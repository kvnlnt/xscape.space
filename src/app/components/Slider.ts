import { useCss } from '../lib/Css';
import { HtmlAttr, useHtml } from '../lib/Html';
import { useKeyPress } from '../lib/KeyPress';
import { usePalette } from '../lib/Palette';
import { useSwipe } from '../lib/Swipe';

const [swipe] = useSwipe();
const [keypress] = useKeyPress();
const [palette] = usePalette();

const [css] = useCss({
  slider_container: [
    ['display', 'flex'],
    ['justifyContent', 'center'],
    ['alignItems', 'center'],
    ['border', `1px solid ${palette('white', 0, 0.1)}`],
    ['width', '90vw'],
    ['height', '90vh'],
    ['position', 'absolute'],
  ],
});

type ViewEvent = 'NONE' | 'NEXT' | 'PREV';
type SlideAttrSetter = (...attrs: HtmlAttr<'div'>[]) => void;
type Slide<Names> = { name: Names; element: HTMLElement };
type Callback<Names> = (slides: { slidingIn: Names; slidingOut: Names }) => void;
type SlideMap<Names> = [HTMLElement, SlideAttrSetter, Names];

export const useSlider = <Names>(slides: Slide<Names>[], cb: Callback<Names>) => {
  const createSlide = () => useHtml('div', ['class', css('slider_container')]);

  const slideMap = slides.map(({ name, element }): SlideMap<Names> => {
    const [container, setContainerAttrs] = createSlide();
    return [container(element), setContainerAttrs, name];
  });

  const slideMedianIndex = Math.floor(slides.length / 2);
  const shiftToEnd = (a: any[]) => a.push(a.shift());
  const shiftToFront = (a: any[]) => a.unshift(a.pop());
  const prevSlide = () => slideMap[slideMedianIndex - 1];
  const currSlide = () => slideMap[slideMedianIndex];
  const nextSlide = () => slideMap[slideMedianIndex + 1];
  swipe('RIGHT', () => machine('NEXT'));
  swipe('LEFT', () => machine('PREV'));
  keypress('ArrowRight', () => machine('NEXT'));
  keypress('Space', () => machine('NEXT'));
  keypress('ArrowLeft', () => machine('PREV'));

  // slide update
  const slide = (event: ViewEvent = 'NONE') => {
    if (event === 'NEXT') shiftToEnd(slideMap);
    if (event === 'PREV') shiftToFront(slideMap);
    slideMap.forEach((slide) => {
      const shouldShow = [prevSlide()[2], currSlide()[2], nextSlide()[2]].includes(slide[2]);
      if (!shouldShow) slide[1](['style', 'display:none']);
    });
    prevSlide()[1](['style', `order:1;left:-110vw;${event === 'NEXT' ? 'transition:left ease-in-out 1s' : ''}`]);
    currSlide()[1](['style', `order:2;left:5vw;transition:left ease-in-out 1s`]);
    nextSlide()[1](['style', `order:3;left:110vw;${event === 'PREV' ? 'transition:left ease-in-out 1s' : ''}`]);
    const slidingOut = event === 'NEXT' ? prevSlide()[2] : nextSlide()[2];
    const slidingIn = currSlide()[2];
    cb({
      slidingIn,
      slidingOut,
    });
  };

  // state machine
  const machine = (event: ViewEvent = 'NONE') => {
    switch (event) {
      case 'NEXT':
        slide('NEXT');
        break;
      case 'PREV':
        slide('PREV');
        break;
    }
  };

  slide();
  return [slideMap.map(([slide]) => slide)];
};
