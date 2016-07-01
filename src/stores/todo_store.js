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

  update(id, desc) {
    const idx = this.todos.findIndex( (r) => r.id === id );
    this.todos[idx].desc = desc
  }

  delete(id) {
    const idx = this.todos.findIndex( (r) => r.id === id );
    this.todos.splice(idx,1);
  }

  add() {
    if (this.desc === '') return
    this.todos.push( { id: this.count, desc: this.desc, done: false} );
    this.count = this.count + 1
    this.desc = ''
  }
}
export let todoStore = new TodoStore()