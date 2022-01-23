import { useCss } from '../lib/Css';
import { HtmlAttr, useHtml } from '../lib/Html';
import { useKeyPress } from '../lib/KeyPress';
import { usePalette } from '../lib/Palette';

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
type Slide<Names> = {
  name: Names;
  element: HTMLElement;
};

export const useSlider = <Names>(...slides: Slide<Names>[]) => {
  const slideMap = slides.map(({ name, element }): [HTMLElement, SlideAttrSetter, Names] => {
    const [container, setContainerAttrs] = useHtml('div', ['class', css('slider_container')]);
    return [container(element), setContainerAttrs, name];
  });

  const slideMedianIndex = Math.floor(slides.length / 2);
  const shiftToEnd = (a: any[]) => a.push(a.shift());
  const shiftToFront = (a: any[]) => a.unshift(a.pop());
  const prevSlide = () => slideMap[slideMedianIndex - 1];
  const currSlide = () => slideMap[slideMedianIndex];
  const nextSlide = () => slideMap[slideMedianIndex + 1];

  // methods
  useKeyPress((key) => {
    console.log(key);
    switch (key) {
      case 'ArrowRight':
      case 'Space':
        machine('NEXT');
        break;
      case 'ArrowLeft':
        machine('PREV');
        break;
    }
  });

  // state machine
  const machine = (event: ViewEvent = 'NONE') => {
    switch (event) {
      case 'NEXT':
        shiftToEnd(slideMap);
        break;
      case 'PREV':
        shiftToFront(slideMap);
        break;
    }
    slideMap.forEach((slide) => {
      const shouldShow = [prevSlide()[2], currSlide()[2], nextSlide()[2]].includes(slide[2]);
      if (!shouldShow) slide[1](['style', 'display:none']);
    });
    prevSlide()[1](['style', `order:1;left:-110vw;${event === 'NEXT' ? 'transition:left ease-in-out 1s' : null}`]);
    currSlide()[1](['style', `order:2;left:5vw;transition:left ease-in-out 1s`]);
    nextSlide()[1](['style', `order:3;left:110vw;${event === 'PREV' ? 'transition:left ease-in-out 1s' : null}`]);
  };

  machine();
  return [slideMap.map(([slide]) => slide)];
};
