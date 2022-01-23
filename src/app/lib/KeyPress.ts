type KeyPressed = 'ArrowLeft' | 'ArrowRight' | 'Space';
type Subscription = () => void;

export const useKeyPress = () => {
  const subscriptions: {
    key: KeyPressed;
    callback: Subscription;
  }[] = [];

  document.addEventListener('keyup', (e) => {
    subscriptions.filter((s) => s.key === e.code).forEach((s) => s.callback());
  });

  const sub = (key: KeyPressed, callback: Subscription) =>
    subscriptions.push({
      key,
      callback,
    });

  return [sub];
};
