import Inferno from 'inferno'
import InfernoDOM from 'inferno-dom'
import Todos from './components/todos'
import { Header } from './components/header'
import { Footer } from './components/footer'
import { todoStore } from './stores/todo_store'
require('./style.css')

InfernoDOM.render(
  <div>
    <Header />
    <Todos store={todoStore} />
    <Footer />
  </div>, document.getElementById("app")
)