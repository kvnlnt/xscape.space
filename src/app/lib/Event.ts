type Pub<T> = (eventName: T) => void;
type Sub<T> = (eventName: T, cb: Function) => void;
type Subscriber<T> = { eventName: T; cb: Function };

export const useEvent = <T>(): [Pub<T>, Sub<T>] => {
  const subscribers: Subscriber<T>[] = [];
  const pub: Pub<T> = (eventName: T) => subscribers.filter((i) => i.eventName === eventName).forEach((i) => i.cb());
  const sub: Sub<T> = (eventName: T, cb: Function) => subscribers.push({ eventName, cb });
  return [pub, sub];
};
