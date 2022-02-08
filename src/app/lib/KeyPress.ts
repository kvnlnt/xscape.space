type KeyPressed = 'ArrowLeft' | 'ArrowRight' | 'ArrowDown' | 'ArrowUp' | 'Escape' | 'Space';
type Subscription = () => void;

export const useKeyPress = () => {
  const subscriptions: Record<string, Subscription[]> = {};

  document.addEventListener('keyup', (e) => {
    (subscriptions[e.code] || []).forEach((subscription) => subscription());
  });
  const sub = (key: KeyPressed, callback: Subscription) => {
    if (!subscriptions.hasOwnProperty(key)) subscriptions[key] = [];
    subscriptions[key].push(callback);
  };
  return [sub];
};
