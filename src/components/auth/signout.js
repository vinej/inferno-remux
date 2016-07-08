import Inferno from 'inferno'
import React from 'react';
import AuthActions from '../../actions/auth_actions'

export default class SignOut extends React.Component {
  componentWillMount() {
    AuthActions.authSignOut()
  }

  render() {
    return <div>Sorry to see you leave</div>
  }
}

