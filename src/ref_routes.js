import Inferno from 'inferno';
import { browserHistory} from 'inferno-router'

export default class RefRoutes {
  static routeTodo() {
    window.location.assign('/#!/todos')
  }

  static routeSignIn() {
    window.location.assign('/#!/signin')
  }
}
