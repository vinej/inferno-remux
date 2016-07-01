import { observable } from 'mobx'

class TodoStore {
  @observable todos = []
  @observable desc

  constructor() {
    this.count = 3
    this.desc = ''
    this.todos.push( { id:1, desc: 'test', done: false} );
    this.todos.push( { id:2, desc: 'test2', done: true} );
  }

  setDesc(desc) {
    this.desc = desc
  }

  getDesc(desc) {
    return this.desc
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
    this.todos.push( { id: this.count, desc: this.desc, done: false} );
    this.count = this.count + 1
    this.desc = ''
  }
}
export let todoStore = new TodoStore()