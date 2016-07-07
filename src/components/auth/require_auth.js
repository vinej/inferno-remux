import Inferno from 'inferno';
import Component from 'inferno-component';
import { observer } from "../../mobx_inferno.js";
import { authStore } from '../../stores/auth_store';

@observer
export default function(ComposedComponent) {
  class Authentication extends Component {

    // static contextTypes = {
    //   router: React.PropTypes.object
    // }

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
