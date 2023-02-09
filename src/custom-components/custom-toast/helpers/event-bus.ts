class Event {
  queue: any = {};
  constructor() {
    this.queue = {};
  }

  $on(name: string, callback: () => void) {
    this.queue[name] = this.queue[name] || [];
    this.queue[name].push(callback);
  }

  $off(name: string, callback: () => void) {
    if (this.queue[name]) {
      for (let i = 0; i < this.queue[name].length; i++) {
        if (this.queue[name][i] === callback) {
          this.queue[name].splice(i, 1);
          break;
        }
      }
    }
  }

  $emit(name: string, data?: any) {
    if (this.queue[name]) {
      this.queue[name].forEach(function (callback: (data?: any) => void) {
        callback(data);
      });
    }
  }
}

export default new Event();
