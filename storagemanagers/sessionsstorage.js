class SessionStorageManager extends DataManager {
  constructor() {
    super();
    this.todos = this.all();
    this.updateSessionStorage();
  }

  addItem(todo) {
    this.todos.push(todo);
    this.updateSessionStorage();
  }

  all() {
    this.todos = JSON.parse(window.sessionStorage.getItem('todos') || '[]');
    return this.todos;
  }

  save(todo) {
    const index = this.todos.indexOf(this.todos.find(x => x.id === todo.id));
    this.todos[index] = todo;
    this.updateSessionStorage();
  }

  clear() {
    this.todos = [];
    this.updateSessionStorage();
  }

  removeItem(todo) {
    this.todos = this.todos.filter(x => x.id !== todo.id);
    this.updateSessionStorage();
  }

  updateSessionStorage() {
    window.sessionStorage.setItem('todos', JSON.stringify(this.todos));
  }

  nextId() {
    return this.todos.length === 0 ? 0 : this.todos[this.todos.length - 1].id + 1;
  }
}