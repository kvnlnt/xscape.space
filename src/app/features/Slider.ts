import { HtmlAttr, useHtml } from '@lib/Html';
import { css } from './Slider.css';

type ViewEvent = 'INIT' | 'NEXT' | 'PREV';
type SlideAttrSetter = (...attrs: HtmlAttr<'div'>[]) => void;
type Slide<Names> = { name: Names; element: HTMLElement };
type Callback<Names> = (slides: { slidingIn: Names; slidingOut: Names }) => void;
type SlideMap<Names> = [HTMLElement, SlideAttrSetter, Names];

export const useSlider = <Names>(
  slides: Slide<Names>[],
  cb: Callback<Names>,
): [HTMLElement, (event?: ViewEvent) => void] => {
  const [container] = useHtml('div', ['class', css('container')]);
  const createSlide = ({ name, element }: Slide<Names>): SlideMap<Names> => {
    const [container, setContainerAttrs] = useHtml('div', ['class', css('slider_container')]);
    return [container(element), setContainerAttrs, name];
  };
  const slideMap = slides.map(createSlide);
  const slideMedianIndex = Math.floor(slides.length / 2);
  const shiftToEnd = (a: any[]) => a.push(a.shift());
  const shiftToFront = (a: any[]) => a.unshift(a.pop());
  const prevSlide = () => slideMap[slideMedianIndex - 1];
  const currSlide = () => slideMap[slideMedianIndex];
  const nextSlide = () => slideMap[slideMedianIndex + 1];

  // slide update
  const slide = (event: ViewEvent = 'INIT') => {
    if (event === 'NEXT') shiftToEnd(slideMap);
    if (event === 'PREV') shiftToFront(slideMap);
    slideMap.forEach((slide) => {
      const shouldShow = [prevSlide()[2], currSlide()[2], nextSlide()[2]].includes(slide[2]);
      if (!shouldShow) slide[1](['style', 'display:none']);
    });
    prevSlide()[1](['style', `order:1;left:-100vw;${event === 'NEXT' ? 'transition:left ease-in-out 1s' : ''}`]);
    currSlide()[1](['style', `order:2;left:0vw;transition:left ease-in-out 1s`]);
    nextSlide()[1](['style', `order:3;left:100vw;${event === 'PREV' ? 'transition:left ease-in-out 1s' : ''}`]);
    const slidingOut = event === 'NEXT' ? prevSlide()[2] : nextSlide()[2];
    const slidingIn = currSlide()[2];
    cb({ slidingIn, slidingOut });
  };

  // state machine
  const machine = (event: ViewEvent = 'INIT') => {
    switch (event) {
      case 'INIT':
        slide();
        break;
      case 'NEXT':
        slide('NEXT');
        break;
      case 'PREV':
        slide('PREV');
        break;
    }
  };

  return [container(...slideMap.map(([slide]) => slide)), machine];
};
