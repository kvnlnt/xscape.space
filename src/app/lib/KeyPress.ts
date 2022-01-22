export const useKeyPress = (cb: (key: KeyboardEvent['code']) => void) => {
  document.addEventListener('keyup', (e) => cb(e.code));
};
