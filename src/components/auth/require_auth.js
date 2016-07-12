import React from 'react';

export default function(ComposedComponent, store) {
  class Authentication extends React.Component {

    static contextTypes = {
      router: React.PropTypes.object
    }

    componentWillMount() {
      if (!store.authenticated) {
        //window.location.assign('#!/')
      }
    }

    componentWillUpdate(nextProps) {
      if (!store.authenticated) {
        //window.location.assign('#!/')
      }
    }

    render() {
      return <ComposedComponent {...this.props} />
    }
  }

  return Authentication;
}
