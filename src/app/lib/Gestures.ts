type SwipeDirection = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export const useSwipe = (cb: (direction: SwipeDirection) => void) => {
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
      cb(xDiff > 0 ? 'RIGHT' : 'LEFT');
    } else {
      cb(yDiff > 0 ? 'DOWN' : 'UP');
    }

    xDown = null;
    yDown = null;
  }
};
