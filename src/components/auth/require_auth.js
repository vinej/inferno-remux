import Inferno from 'inferno';
import React from 'react';

export default function(ComposedComponent, store) {
  class Authentication extends React.Component {

    static contextTypes = {
      router: React.PropTypes.object
    }

    componentWillMount() {
      if (!store.authenticated) {
      }
    }

    componentWillUpdate(nextProps) {
      if (!store.authenticated) {
      }
    }

    render() {
      return <ComposedComponent {...this.props} />
    }
  }

  return Authentication;
}
