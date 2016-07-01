import Inferno from 'inferno';
import Component from 'inferno-component';
import { todoStore } from '../stores/todo_store'

var observer = require('../mobx_inferno.js').observer

// class Input extends Component {
//   constructor() {
//     super()
//     this.handleBlur =this.handleBlur.bind(this)
//   }

//   handleBlur(event) {
//     console.log(event, "blur")
//   }

//   render() {
//     const props = {
//       onBlur : this.handleBlur
//     }

//     return (<input { ...props } ></input>)
//   }
// }

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
                <td onClick={ () => todoStore.delete(this.props.todo.id)}>del</td>
              </tr> );
  }
}

@observer
export default class Todos extends Component {
  add() {
    todoStore.add()
  }

  render() {
      return ( 
        <div className="pure-form">
          <table className='pure-table'>
            <thead >
              <tr>
                <th>Id</th>
                <th style={{ width: '130px'}}>Description</th>
                <th >del</th>
              </tr>
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
        </div>
      )
   }
}
