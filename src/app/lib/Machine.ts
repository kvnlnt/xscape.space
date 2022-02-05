type Subscription<State, Event> = (event: Event) => State;
export const useMachine = <States, Events>(
  state: States,
): [(event: Events) => void, (state: States, event: Events, callback: Subscription<States, Events>) => void] => {
  let currentState = state;
  const subscriptions: {
    state: States;
    event: Events;
    callback: Subscription<States, Events>;
  }[] = [];

  const sub = (state: States, event: Events, callback: Subscription<States, Events>) => {
    subscriptions.push({ state, event, callback });
  };

  const pub = (event: Events) => {
    subscriptions.forEach((s) => {
      if (s.state === currentState) {
        currentState = s.callback(event);
      }
    });
  };
  return [pub, sub];
};
