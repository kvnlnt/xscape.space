interface Registry {
  unregister: () => void;
}

interface Callable {
  [key: string]: Function;
}

interface Subscriber {
  [key: string]: Callable;
}

interface IEventBus {
  pub<T>(event: string, arg?: T): void;
  sub(event: string, callback: Function): Registry;
}

class EventBus implements IEventBus {
  subscribers: Subscriber = {};
  static nextId = 0;

  constructor() {
    this.pub = this.pub.bind(this);
    this.sub = this.sub.bind(this);
    this.getNextId = this.getNextId.bind(this);
  }

  pub<T>(event: string, arg?: T): void {
    const subscriber = this.subscribers[event];
    if (subscriber === undefined) return;
    Object.keys(subscriber).forEach((key) => subscriber[key](arg));
  }

  sub(event: string, callback: Function): Registry {
    const id = this.getNextId();
    if (!this.subscribers[event]) this.subscribers[event] = {};
    this.subscribers[event][id] = callback;
    return {
      unregister: () => {
        delete this.subscribers[event][id];
        if (Object.keys(this.subscribers[event]).length === 0) delete this.subscribers[event];
      },
    };
  }

  getNextId(): number {
    return EventBus.nextId++;
  }
}

export const useEventBus = () => {
  const eventBus = new EventBus();
  return [eventBus.pub, eventBus.sub];
};
