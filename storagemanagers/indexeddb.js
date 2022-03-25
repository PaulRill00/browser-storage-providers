class IndexedDbManager extends DataManager {
  dbName = 'Todos';
  storeName = 'Todos';

  async init() {
    return new Promise((resolve, _reject) => {

      // This grabs the database from all browsers, and falls back to the shim db
      const indexedDb = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;
      
      // Open or create the database
      const dbVersion = 1;
      this.connection = indexedDb.open(this.dbName, dbVersion);
      
      // Create the table
      this.connection.onupgradeneeded = () => {
        const db = this.connection.result;
        const store = db.createObjectStore(this.storeName, { keyPath: 'id' });
        const index = store.createIndex('ID', ['id'])
      }
      
      this.connection.onsuccess = () => {
        resolve();
      }
    });
  }
  
  async addItem(task) {
    const store = this.getStore();

    const request = store.add({...task});
  
    return new Promise((resolve, reject) => {
      request.onsuccess = resolve;
      request.onerror = reject;
    })
  }

  async removeItem(task) {
    const store = this.getStore();

    const request = store.delete(task.id);
    
    return new Promise((resolve, reject) => {
      request.onsuccess = resolve;
      request.onerror = reject;
    })
  }

  nextId() {  
    const store = this.getStore();
    const index = store.index('ID');

    const request = index.openCursor(null, 'prev');

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        const id = request.result?.value.id ?? -1;
        resolve(id + 1)
      }

      request.onerror = reject;
    })
  }

  async all() {
    const store = this.getStore();
    
    const request = store.getAll();

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        resolve(request.result);
      }

      request.onerror = reject;
    });
  }

  async save(task) {
    const store = this.getStore();

    const request = store.put({...task});
    
    return new Promise((resolve, reject) => {
      request.onsuccess = resolve;
      request.onerror = reject;
    })
  }

  async clear() {
    const store = this.getStore();

    const request = store.clear();
    
    return new Promise((resolve, reject) => {
      request.onsuccess = resolve;
      request.onerror = reject;
    })
  }

  getDb() {
    return this.connection.result;
  }

  getTransaction() {
    return this.getDb().transaction(this.dbName, 'readwrite');
  }

  getStore() {
    const transaction = this.getTransaction();
    return transaction.objectStore(this.storeName);
  }
}


