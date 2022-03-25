class TaskManager {
  constructor(dataManager) {
    this.dataManager = dataManager || new DataManager();
    
    this.todolist = document.getElementById('todo-list-container');
    this.todoinput = document.getElementById('todo-input');

    this.todoinput.onkeydown = this.onInputKeyPressed.bind(this);

    this.refreshTodoList();

    document.querySelector('li[role="presentation"]#all').onclick =  () => this.onPresentationChange('', 'all');
    document.querySelector('li[role="presentation"]#active').onclick =  () => this.onPresentationChange('only-active', 'active');
    document.querySelector('li[role="presentation"]#complete').onclick =  () => this.onPresentationChange('only-complete', 'complete');
  }

  setDataManager(dataManager) {
    this.dataManager = dataManager;
    this.refreshTodoList();
  }

  onPresentationChange(filter, activeId) {
    this.todolist.classList.remove('only-active');
    this.todolist.classList.remove('only-complete');

    document.querySelectorAll('li[role="presentation"] .nav-link').forEach(element => {
      element.classList.remove('active');
    })
    document.querySelector(`li[role="presentation"]#${activeId} .nav-link`).classList.add('active');

    if (filter.length > 0) {
      this.todolist.classList.add(filter);
    }
  }

  async onInputKeyPressed(event) {
    if (event.code === 'Enter') {
      await this.addTodo(this.todoinput.value);
      this.todoinput.value = '';
    }
  }

  async onTodoToggle(todo) {
    todo.completed = !todo.completed;
    await this.dataManager.save(todo);
    this.refreshTodoList();
  }

  async onTodoRemove(todo) {
    await this.dataManager.removeItem(todo);
    await this.refreshTodoList();
  }

  async addTodo(task) {
    await this.dataManager.addItem(new Task(await this.dataManager.nextId(), task));
    await this.refreshTodoList();
  }

  async clear() {
    await this.dataManager.clear();
    await this.refreshTodoList();
  }

  async refreshTodoList() {
    const todos = await this.dataManager.all();

    this.todolist.innerHTML = '';

    todos.forEach(todo => {
      const template = document.createElement('template');
      const html = `
        <div class="todo-item ${todo.completed ? 'complete' : ''}" id="todo-item-${todo.id}">
          <div class="checker"><span class="${todo.complted ? 'checker' : ''}"><input type="checkbox" ${todo.completed ? 'checked' :''}></span></div>
          <span>${todo.task}</span>
          <a href="javascript:void(0);" class="float-right remove-todo-item">X</a>
        </div>
      `.trim();

      template.innerHTML = html;

      this.todolist.appendChild(template.content.firstChild);

      this.todolist
        .querySelector(`#todo-item-${todo.id} input`)
        .onchange = () => this.onTodoToggle(todo);

      this.todolist
        .querySelector(`#todo-item-${todo.id} .remove-todo-item`)
        .onclick = () => this.onTodoRemove(todo);
    })
  }
}