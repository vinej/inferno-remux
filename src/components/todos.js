import Inferno from 'inferno';
import Component from 'inferno-component';
import { todoStore } from '../stores/todo_store'

var observer = require('../mobx_inferno.js').observer

@observer
class Todo extends Component {

  getTodoDoneClass(todo) {
    if (todo.done) {
      return { textDecoration: "line-through", color: 'lightgray' }
    } else {
      return { textDecoration: "none", color : 'black'}
    }
  }

  render() {
    return (  <tr> 
                <td>{this.props.todo.id}</td> 
                <td onClick={ () => this.props.todo.done = !this.props.todo.done} 
                    style={ this.getTodoDoneClass(this.props.todo) }>{this.props.todo.desc}</td> 
              </tr> );
  }
}

@observer
export default class Todos extends Component {
  add() {
    todoStore.add()
  }

  update() {
    todoStore.update()
  }

  delete() {
    todoStore.delete()
  }

  render() {
      return ( 
        <div className="pure-form">
          <table className='pure-table'>
            <thead >
              <th>Id</th>
              <th style={{ width: '130px'}}>Description</th>
            </thead>
            <tbody>
            { todoStore.get().map( (todo) => <Todo key={todo.id} todo={todo} /> ) }
            </tbody>
          </table>
          <div>
            <input  type='text' 
                    value={ todoStore.getDesc() } 
                    onChange={ (event) => todoStore.setDesc(event.target.value)} 
                    />
          </div>
          <button className="pure-button" onClick={ () => this.add() }> add </button>
          <button className="pure-button" onClick={ () => this.update() }> update first</button>
          <button className="pure-button" onClick={ () => this.delete() }> delete first</button>
        </div>
      )
   }
}
