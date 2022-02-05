type KeyPressed = 'ArrowLeft' | 'ArrowRight' | 'ArrowDown' | 'ArrowUp' | 'Escape' | 'Space';
type Subscription = () => void;

export const useKeyPress = () => {
  const subscriptions: Partial<Record<KeyPressed, Subscription>> = {};

  document.addEventListener('keyup', (e) => {
    Object.keys(subscriptions)
      .filter((key: KeyPressed) => key === e.code)
      .forEach((key: KeyPressed) => subscriptions[key]());
  });

  const sub = (key: KeyPressed, callback: Subscription) => (subscriptions[key as KeyPressed] = callback);

  return [sub];
};
