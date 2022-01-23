type SwipeDirection = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type Subscription = () => void;

export const useSwipe = () => {
  const subscriptions: { direction: SwipeDirection; callback: Subscription }[] = [];
  document.addEventListener('touchstart', handleTouchStart, false);
  document.addEventListener('touchmove', handleTouchMove, false);

  let xDown: number | null = null;
  let yDown: number | null = null;

  function handleTouchStart(evt: TouchEvent) {
    const firstTouch = evt.touches[0];
    xDown = firstTouch.clientX;
    yDown = firstTouch.clientY;
  }

  function handleTouchMove(evt: TouchEvent) {
    if (!xDown || !yDown) return;
    let xUp = evt.touches[0].clientX;
    let yUp = evt.touches[0].clientY;
    let xDiff = xDown - xUp;
    let yDiff = yDown - yUp;
    if (Math.abs(xDiff) > Math.abs(yDiff)) {
      subscriptions.forEach((cb) => {
        if (xDiff > 0) {
          if (cb.direction === 'RIGHT') cb.callback();
        } else {
          if (cb.direction === 'LEFT') cb.callback();
        }
      });
    } else {
      subscriptions.forEach((cb) => {
        if (yDiff > 0) {
          if (cb.direction === 'DOWN') cb.callback();
        } else {
          if (cb.direction === 'UP') cb.callback();
        }
      });
    }
    xDown = null;
    yDown = null;
  }

  const sub = (direction: SwipeDirection, subscription: Subscription) =>
    subscriptions.push({
      direction,
      callback: subscription,
    });
  return [sub];
};
