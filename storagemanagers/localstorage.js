class LocalStorageManager extends DataManager {
  constructor() {
    super();
    this.todos = this.all();
    this.updateLocalStorage();
  }

  addItem(todo) {
    this.todos.push(todo);
    this.updateLocalStorage();
  }

  all() {
    this.todos = JSON.parse(window.localStorage.getItem('todos') || '[]');
    return this.todos;
  }

  save(todo) {
    const index = this.todos.indexOf(this.todos.find(x => x.id === todo.id));
    this.todos[index] = todo;
    this.updateLocalStorage();
  }

  clear() {
    this.todos = [];
    this.updateLocalStorage();
  }

  removeItem(todo) {
    this.todos = this.todos.filter(x => x.id !== todo.id);
    this.updateLocalStorage();
  }

  updateLocalStorage() {
    window.localStorage.setItem('todos', JSON.stringify(this.todos));
  }

  nextId() {
    return this.todos.length === 0 ? 0 : this.todos[this.todos.length - 1].id + 1;
  }
}