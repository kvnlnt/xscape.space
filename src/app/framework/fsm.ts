type Subscription<Context, Actions> = { action: Actions; cb: (context: Context) => void };

export type MachineContext = { state: string };
export type MachineMessages<Context> = {
  action: string;
  payload?: Partial<Context>;
};

export type Machine<Context extends MachineContext, Messages extends MachineMessages<MachineContext>> = {
  get: <T extends keyof Context>(key: T) => Context[T];
  pub: (action: Messages['action'], contextUpdate?: Partial<Context>) => void;
  sub: (key: Messages['action'], cb: (context: Context) => void) => void;
};

export const FSM = <Context extends MachineContext, Messages extends MachineMessages<Context>>(
  context: Context,
  machine: (message: MachineMessages<Context>, context: Context) => Context,
): Machine<Context, Messages> => {
  let _context: Context = context;
  const _subs: Subscription<Context, Messages['action']>[] = [];

  const sub = (action: Messages['action'], cb: (context: Context) => void) => {
    _subs.push({
      action,
      cb,
    });
  };

  const get = <T extends keyof Context>(key: T) => {
    return _context[key];
  };

  const pub = <T extends Messages['action']>(action: T, contextUpdate?: Partial<Context>) => {
    const message: MachineMessages<Context> = { action, payload: contextUpdate };
    _context = machine(message, _context);
    _subs.filter((sub) => sub['action'] === action).forEach((i) => i.cb(_context));
    return _context;
  };

  return {
    get,
    pub,
    sub,
  };
};
