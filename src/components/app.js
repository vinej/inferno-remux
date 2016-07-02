import Inferno from 'inferno'
import Component from 'inferno-component'
import { Header } from './header'
import { Footer } from './footer'

export default class App extends Component {
  render() {
    return (
      <div>
        <Header />
        { this.props.children }
        <Footer />
      </div> )
  }
}