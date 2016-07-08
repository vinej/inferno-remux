import Inferno from 'inferno'
import React from 'react';
import { observer } from "mobx-react";
import { authStore } from '../../stores/auth_store';

@observer
export default function(ComposedComponent) {
  class Authentication extends React.Component {
    static contextTypes = {
      router: React.PropTypes.object
    }

    componentWillMount() {
      if (!authStore.authenticated) {
        window.location.assign('/#!/signin')
      }
    }

    componentWillUpdate(nextProps) {
      if (!authStore.authenticated) {
        window.location.assign('/#!/signin')
      }
    }

    render() {
      return <ComposedComponent {...this.props} />
    }
  }

  return Authentication;
}
