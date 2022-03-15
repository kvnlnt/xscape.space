/**
 * Machine
 */
type MachineSubscription<Context, Actions> = { action: Actions; cb: (context: Context) => void };
export const useMachine = <Context, Actions, Messages extends { action: Actions; payload?: Partial<Context> }>(
  context: Context,
  machine: (message: Messages, context: Context) => Context,
): {
  get: (key: keyof Context) => Context[keyof Context];
  pub: (message: Messages) => void;
  sub: (key: Actions, cb: (context: Context) => Context) => void;
} => {
  let _context: Context = context;
  const _subs: MachineSubscription<Context, Actions>[] = [];

  const sub = (action: Actions, cb: (context: Context) => void) => {
    _subs.push({
      action,
      cb,
    });
  };

  const get = (key: keyof Context) => {
    return _context[key];
  };

  const pub = (message: Messages & { action: string }) => {
    _context = machine(message, _context);
    _subs.filter((sub) => sub['action'] === message['action']).forEach((i) => i.cb(_context));
    return _context;
  };

  return {
    get,
    pub,
    sub,
  };
};

// /**
//  * A miniature "Event Bus"
//  */
// type Pub = (eventName: string) => void;
// type Sub = (eventName: string, cb: Function) => void;
// type Subscriber = { eventName: string; cb: Function };

// export const useSignal = (..._: string[]): [Pub, Sub] => {
//   const subscribers: Subscriber[] = [];
//   const pub: Pub = (eventName: string) => subscribers.filter((i) => i.eventName === eventName).forEach((i) => i.cb());
//   const sub: Sub = (eventName: string, cb: Function) => subscribers.push({ eventName, cb });
//   return [pub, sub];
// };

// /**
//  * Model
//  */
// type ModelSubscription<T> = { key: keyof T; cb: (val: T[keyof T]) => void };
// export const useModel = <T>(
//   model: T,
// ): {
//   get: (key: keyof T) => T[keyof T];
//   set: (key: keyof T, val: T[keyof T]) => T[keyof T];
//   sub: (key: keyof T, cb: (val: T[keyof T]) => void) => void;
// } => {
//   const _model: T = model;
//   const _subscriptions: ModelSubscription<T>[] = [];

//   const subscriber = (key: keyof T, cb: (val: T[keyof T]) => void) => {
//     _subscriptions.push({
//       key,
//       cb,
//     });
//   };

//   const getter = (key: keyof T) => {
//     return _model[key];
//   };

//   const setter = (key: keyof T, val: T[keyof T]) => {
//     _model[key] = val;
//     _subscriptions.filter((i) => i.key === key).forEach((i) => i.cb(_model[key]));
//     return _model[key];
//   };

//   return {
//     get: getter,
//     set: setter,
//     sub: subscriber,
//   };
// };
