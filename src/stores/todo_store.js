import { observable } from 'mobx'

class TodoStore {
  @observable todos = []

  constructor() {
    this.count = 3
    this.todos.push( { id:1, desc: 'test', done: false} );
    this.todos.push( { id:2, desc: 'test2', done: true} );
  }

  get() {
    return this.todos
  }

  update() {
    this.todos[0].done= true
  }

  delete() {
    this.todos.splice(0,1)
  }

  add() {
    this.todos.push( { id: this.count, desc: 'test'+this.count, done: false} );
    this.count = this.count + 1
  }
}
export let todoStore = new TodoStore()