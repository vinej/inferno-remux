import Inferno from 'inferno'
import InfernoDOM from 'inferno-dom'
import Todos from './components/todos'
import { todoStore } from './stores/todo_store'

require('./style.css')

InfernoDOM.render(
  <Todos store={todoStore} />, document.getElementById("app")
)