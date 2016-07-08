// The MIT License (MIT)

// Copyright (c) 2015 Michel Weststrate

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
(function() {
    function mrFactory(mobx, Inferno, InfernoDOM, Component, CreateClass) {
        if (!mobx)
            throw new Error("mobx-inferno requires the MobX package")
        if (!Inferno)
            throw new Error("mobx-inferno requires Inferno to be available");

        /**
         * dev tool support
         */
        var isDevtoolsEnabled = false;

        // WeakMap<Node, Object>;
        var componentByNodeRegistery = typeof WeakMap !== "undefined" ? new WeakMap() : undefined;
        var renderReporter = new EventEmitter();

        function findDOMNode(component) {
            if (InfernoDOM)
                return InfernoDOM.findDOMNode(component);
            return null;
        }

        function reportRendering(component) {
            var node = findDOMNode(component);
            if (node && componentByNodeRegistery)
                componentByNodeRegistery.set(node, component);

            renderReporter.emit({
                event: 'render',
                renderTime: component.__$mobRenderEnd - component.__$mobRenderStart,
                totalTime: Date.now() - component.__$mobRenderStart,
                component: component,
                node: node
            });
        }

        function trackComponents() {
            if (typeof WeakMap === "undefined")
                throw new Error("[mobx-inferno] tracking components is not supported in this browser.");
            if (!isDevtoolsEnabled)
                isDevtoolsEnabled = true;
        }

        function EventEmitter() {
            this.listeners = [];
        };
        EventEmitter.prototype.on = function (cb) {
            this.listeners.push(cb);
            var self = this;
            return function() {
                var idx = self.listeners.indexOf(cb);
                if (idx !== -1)
                    self.listeners.splice(idx, 1);
            };
        };
        EventEmitter.prototype.emit = function(data) {
            this.listeners.forEach(function (fn) {
                fn(data);
            });
        };

        /**
         * Utilities
         */
        var specialReactKeys = { children: true, key: true, ref: true };

        function patch(target, funcName) {
            var base = target[funcName];
            var mixinFunc = reactiveMixin[funcName];
            if (!base) {
                target[funcName] = mixinFunc;
            } else {
                target[funcName] = function() {
                    base.apply(this, arguments);
                    mixinFunc.apply(this, arguments);
                }
            }
        }

        /**
         * ReactiveMixin
         */
        var reactiveMixin = {
            componentWillMount: function() {
                // Generate friendly name for debugging
                var name = [
                    this.displayName || this.name || (this.constructor && (this.constructor.displayName || this.constructor.name)) || "<component>",
                    "#", this._reactInternalInstance && this._reactInternalInstance._rootNodeID,
                    ".render()"
                ].join("");

                var baseRender = this.render.bind(this);
                var self = this;
                var reaction = null;
                var isRenderingPending = false;
                function initialRender() {
                    reaction = new mobx.Reaction(name, function() {
                        if (!isRenderingPending) {
                            isRenderingPending = true;
                            if (typeof self.componentWillReact === "function")
                                self.componentWillReact();
                            Component.prototype.forceUpdate.call(self)
                        }
                    });
                    reactiveRender.$mobx = reaction;
                    self.render = reactiveRender;
                    return reactiveRender();
                }

                function reactiveRender() {
                    isRenderingPending = false;
                    var rendering;
                    reaction.track(function() {
                        if (isDevtoolsEnabled)
                            self.__$mobRenderStart = Date.now();
                        rendering = mobx.extras.allowStateChanges(false, baseRender);
                        if (isDevtoolsEnabled)
                            self.__$mobRenderEnd = Date.now();
                    });
                    return rendering;
                }

                this.render = initialRender;
            },

            componentWillUnmount: function() {
                this.render.$mobx && this.render.$mobx.dispose();
                if (isDevtoolsEnabled) {
                    var node = findDOMNode(this);
                    if (node && componentByNodeRegistery) {
                        componentByNodeRegistery.delete(node);
                    }
                    renderReporter.emit({
                        event: 'destroy',
                        component: this,
                        node: node
                    });
                }
            },

            componentDidMount: function() {
                if (isDevtoolsEnabled)
                    reportRendering(this);
            },

            componentDidUpdate: function() {
                if (isDevtoolsEnabled)
                    reportRendering(this);
            },

            shouldComponentUpdate: function(nextProps, nextState) {
                // if props or state did change, but a render was scheduled already, no additional render needs to be scheduled
                if (this.render.$mobx && this.render.$mobx.isScheduled() === true)
                    return false;
                
                // update on any state changes (as is the default)
                if (this.state !== nextState)
                    return true;
                // update if props are shallowly not equal, inspired by PureRenderMixin
                var keys = Object.keys(this.props);
                var key;
                if (keys.length !== Object.keys(nextProps).length)
                    return true;
                for(var i = keys.length -1; i >= 0, key = keys[i]; i--) {
                    var newValue = nextProps[key];
                    if (newValue !== this.props[key]) {
                        return true;
                    } else if (newValue && typeof newValue === "object" && !mobx.isObservable(newValue)) {
                        /**
                         * If the newValue is still the same object, but that object is not observable,
                         * fallback to the default React behavior: update, because the object *might* have changed.
                         * If you need the non default behavior, just use the React pure render mixin, as that one
                         * will work fine with mobx as well, instead of the default implementation of
                         * observer.
                         */
                        return true;
                    }
                }
                return false;
            }
        }

        /**
         * Observer function / decorator
         */
        function observer(arg1, arg2) {
            if (typeof arg1 === "string")
                throw new Error("Store names should be provided as array");
            if (Array.isArray(arg1)) {
                // component needs stores
                if (!arg2) {
                    // invoked as decorator
                    return function(componentClass) {
                        return observer(arg1, componentClass);
                    }
                } else {
                    return createStoreInjector(arg1, observer(arg2));
                }   
            }
            var componentClass = arg1;

            // Stateless function component:
            // If it is function but doesn't seem to be a react class constructor,
            // wrap it to a react class automatically
            if (
                typeof componentClass === "function" &&
                (!componentClass.prototype || !componentClass.prototype.render) &&
                !componentClass.isReactClass && 
                !Component.isPrototypeOf(componentClass)
            ) {
                return observer(CreateClass({
                    displayName:     componentClass.displayName || componentClass.name,
                    propTypes:       componentClass.propTypes,
                    contextTypes:    componentClass.contextTypes,
                    getDefaultProps: function() { return componentClass.defaultProps; },
                    render:          function() { return componentClass.call(this, this.props, this.context); }
                }));
            }

            if (!componentClass)
                throw new Error("Please pass a valid component to 'observer'");
            var target = componentClass.prototype || componentClass;
            [
                "componentWillMount",
                "componentWillUnmount",
                "componentDidMount",
                "componentDidUpdate"
            ].forEach(function(funcName) {
                patch(target, funcName)
            });
            if (!target.shouldComponentUpdate)
                target.shouldComponentUpdate = reactiveMixin.shouldComponentUpdate;
            componentClass.isMobXReactObserver = true;
            return componentClass;
        }

        /**
         * Store provider
         */
        var Provider = CreateClass({
            displayName: "Provider",

            render: function() {
                return Inferno.Children.only(this.props.children);
            },

            getChildContext: function () {
                var stores = {};
                // inherit stores
                var baseStores = this.context.mobxStores;
                if (baseStores) for (var key in baseStores) {
                    stores[key] = baseStores[key];
                }
                // add own stores
                for (var key in this.props)
                    if (!specialReactKeys[key])
                        stores[key] = this.props[key];
                return {
                    mobxStores: stores
                };
            },

            componentWillReceiveProps: function(nextProps) {
                // Maybe this warning is to aggressive?
                if (Object.keys(nextProps).length !== Object.keys(this.props).length)
                    console.warn("MobX Provider: The set of provided stores has changed. Please avoid changing stores as the change might not propagate to all children");
                for (var key in nextProps)
                    if (!specialReactKeys[key] && this.props[key] !== nextProps[key])
                        console.warn("MobX Provider: Provided store '" + key + "' has changed. Please avoid replacing stores as the change might not propagate to all children");
            }
        });

        //var PropTypes = Inferno.PropTypes;
        Provider.contextTypes = { mobxStores: Object };
        Provider.childContextTypes = { mobxStores: Object };

        /**
         * Store Injection
         */
        function createStoreInjector(stores, component) {
            var Injector = Component({
                displayName: "MobXStoreInjector",
                render: function() {
                    var newProps = {};
                    for (var key in this.props)
                        newProps[key] = this.props[key];
                    var baseStores = this.context.mobxStores;
                    stores.forEach(function(storeName) {
                        if (storeName in newProps) // prefer props over stores
                            return;
                        if (!(storeName in baseStores))
                            throw new Error("MobX observer: Store '" + storeName + "' is not available! Make sure it is provided by some Provider");
                        newProps[storeName] = baseStores[storeName];
                    }, this);
                    return Inferno.createElement(component, newProps);
                }
            });
            Injector.contextTypes = { mobxStores: PropTypes.object };
            return Injector;
        }

        /**
         * Export
         */
        return ({
            observer: observer,
            Provider: Provider,
            reactiveComponent: function() {
                console.warn("[mobx-inferno] `reactiveComponent` has been renamed to `observer` and will be removed in 1.1.");
                return observer.apply(null, arguments);
            },
            renderReporter: renderReporter,
            componentByNodeRegistery: componentByNodeRegistery,
            trackComponents: trackComponents
        });
    }

    /**
     * UMD
     */
    if (typeof exports === 'object') {
        module.exports = mrFactory(
            require('mobx'), 
            require('inferno'), 
            require('inferno-dom'),
            require('inferno-component'),
            require('inferno-create-class') 
            );
    } else if (typeof define === 'function' && define.amd) {
        define('mobx-inferno', ['mobx', 'inferno', 'inferno-dom', 'inferno-component', 'inferno-create-class' ], mrFactory);
    } else {
        this.mobxInferno = mrFactory(
            this['mobx'], 
            this['Inferno'], 
            this['InfernoDOM'],
            this['Component'],
            this['CreateClass']
        );
    }
})();

