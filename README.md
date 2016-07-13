# inferno-remux

Welcome to inferno-remux

NOTE: this boilerplate use the 'inferno-compat' package, then even if you see imports of React, the code runs with Inferno. See the webpack.config.js and the package.json files.

This boilerplate give you a minimum example to use Inferno with Mobx, Mobx-React and a minimum implementation of the 'ReMux' flux pattern
* ReMux stand for : **Re**act **M**obx Fl**ux** pattern. 

With 'ReMux' you have a very simple way to implement the following pattern
* component => action => resolver => store => component
 * components receive a store as props (the state of the component)
 * components use the store in read only mode
 * components dispatch actions to apply modifications to the store (the state)
 * resolvers resolve actions and call stores
 * stores are observable with the Mobx @observable decorator
 * Mobx refresh the components with the Mobx-React @observer decorator
 * resolvers could be also middlewares to do something with the action before/after calling the stores
 * the routing is also using the dispach pattern
* TRY IT, IT'S VERY SIMPLE THIS WAY

For a more complete example see: https://github.com/vinej/react-portal

  * npm install
  * npm start

Inferno : https://github.com/trueadm/inferno

JYV








