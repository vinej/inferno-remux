import Inferno from 'inferno'
import InfernoDOM from 'inferno-dom'
import Todos from './components/todos'

require('./style.css')

InfernoDOM.render(
  <Todos />, document.getElementById("app")
)