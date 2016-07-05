import Inferno from 'inferno'
import InfernoDOM from 'inferno-dom'
import { Route, Router, browserHistory } from 'inferno-router'
import Todos from './components/todos'
import App from './components/app'
import { Welcome } from './components/welcome'
//import Form from './components/form'
import { todoStore } from './stores/todo_store'

require('./style.css')

var todos = () => <Todos store={ todoStore } />

InfernoDOM.render(
  (
    <Router history={browserHistory} component={ App } hashbang="true">
      <Route path="/" component={ Welcome } />
      <Route path="/welcome" component={ Welcome } />
      <Route path="/todos" component={ todos } />
    </Router>
  ), document.getElementById("app")
)