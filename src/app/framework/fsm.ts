type Subscription<Context, Actions> = { action: Actions; cb: (context: Context) => void };

export type MachineContext = { state: string };
export type MachineMessages = {
  action: string;
  payload?: any;
};

export type Machine<Context extends MachineContext, Messages extends MachineMessages> = {
  get: (key: keyof Context) => Context[keyof Context];
  pub: (action: Messages['action'], contextUpdate?: Partial<Context>) => void;
  sub: (key: Messages['action'], cb: (context: Context) => void) => void;
};

export const FSM = <Context extends MachineContext, Messages extends MachineMessages>(
  context: Context,
  machine: (message: Messages, context: Context) => Context,
): Machine<Context, Messages> => {
  let _context: Context = context;
  const _subs: Subscription<Context, Messages['action']>[] = [];

  const sub = (action: Messages['action'], cb: (context: Context) => void) => {
    _subs.push({
      action,
      cb,
    });
  };

  const get = (key: keyof Context) => {
    return _context[key];
  };

  const pub = (action: Messages['action'], contextUpdate?: Partial<Context>) => {
    _context = machine({ action, payload: contextUpdate } as Messages, _context);
    _subs.filter((sub) => sub['action'] === action).forEach((i) => i.cb(_context));
    return _context;
  };

  return {
    get,
    pub,
    sub,
  };
};
