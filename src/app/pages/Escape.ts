import { useSlider } from '../components/Slider';
import { useChillSpace } from '../components/spaces/Chill';
import { useDeepSpace } from '../components/spaces/Deep';
import { useThinkSpace } from '../components/spaces/Think';
import { useCss } from '../lib/Css';
import { useDom } from '../lib/Dom';
import { useHtml } from '../lib/Html';
import { useKeyPress } from '../lib/KeyPress';
import { usePalette } from '../lib/Palette';
import { useProperty } from '../lib/Property';
import { useSwipe } from '../lib/Swipe';

const [palette] = usePalette();

const [css] = useCss({
  body: [
    ['backgroundColor', palette('black')],
    ['overflow', 'hidden'],
  ],
  container: [
    ['width', '100vw'],
    ['height', '100vh'],
  ],
  transition_bar: [
    ['position', 'fixed'],
    ['backgroundColor', palette('purple', 0, 0.01)],
    ['top', '-25vh'],
    ['left', '-25vw'],
    ['height', '150vh'],
    ['width', '150vw'],
    ['transition', 'all 0.5s'],
    ['borderRadius', '100%'],
  ],
  transition_bar_in: [
    ['top', '50vh'],
    ['left', '50vw'],
    ['height', '0vw'],
    ['width', '0vw'],
    ['transition', 'all 0.5s'],
    ['borderRadius', '100vw'],
    ['transform', 'rotate(720deg)'],
  ],
  transition_bar_out: [
    ['top', '-25vh'],
    ['left', '-25vw'],
    ['height', '150vh'],
    ['width', '150vw'],
    ['transition', 'all 0.5s'],
  ],
});

type Slides = 'THINK' | 'CHILL' | 'DEEP';
type Events =
  | 'SLIDE'
  | 'ESCAPE_TO_THINK_SPACE'
  | 'ESCAPE_TO_CHILL_SPACE'
  | 'ESCAPE_TO_DEEP_SPACE'
  | 'NEXT_SLIDE'
  | 'PREV_SLIDE'
  | 'ESCAPE';
type States = 'INIT' | 'SEARCHING' | 'THINKING' | 'CHILLING' | 'IN_DEEP';

export const useEscapePage = (parent: (...children: (HTMLElement | Node)[]) => void) => {
  useDom<HTMLBodyElement>('body', ['className', css('body')]);
  const [swipe] = useSwipe();
  const [keypress] = useKeyPress();
  const [state, setState] = useProperty<States>('INIT');
  const [currentSlide, setCurrentSlide] = useProperty<Slides>('THINK');
  const [container] = useHtml('div', ['class', css('container')]);
  const [transitionBar, transitionBarAttrs] = useHtml('div', ['class', css('transition_bar')]);
  const [transitionBar2, transitionBarAttrs2] = useHtml(
    'div',
    ['class', css('transition_bar')],
    ['style', 'transition-delay:0.05s'],
  );
  const [thinkSpace, thinkMachine] = useThinkSpace({
    onActivation: () => machine('ESCAPE_TO_THINK_SPACE'),
    onDeactivation: () => machine('ESCAPE'),
  });
  const [chillSpace, chillMachine] = useChillSpace({
    onActivation: () => machine('ESCAPE_TO_CHILL_SPACE'),
    onDeactivation: () => machine('ESCAPE'),
  });
  const [deepSpace, deepMachine] = useDeepSpace({
    onActivation: () => machine('ESCAPE_TO_DEEP_SPACE'),
    onDeactivation: () => machine('ESCAPE'),
  });
  const [slides, slider] = useSlider<Slides>(
    [
      { name: 'DEEP', element: deepSpace },
      { name: 'THINK', element: thinkSpace },
      { name: 'CHILL', element: chillSpace },
    ],
    ({ slidingIn, slidingOut }) => {
      if (slidingOut === 'THINK') thinkMachine('SLIDE_OUT');
      if (slidingIn === 'THINK') setTimeout(() => thinkMachine('SLIDE_IN'), 750);
      if (slidingOut === 'CHILL') chillMachine('SLIDE_OUT');
      if (slidingIn === 'CHILL') setTimeout(() => chillMachine('SLIDE_IN'), 750);
      if (slidingOut === 'DEEP') deepMachine('SLIDE_OUT');
      if (slidingIn === 'DEEP') setTimeout(() => deepMachine('SLIDE_IN'), 750);
      transitionBarAttrs(['class', css('transition_bar', 'transition_bar_out')]);
      transitionBarAttrs2(['class', css('transition_bar', 'transition_bar_out')]);
      setTimeout(() => {
        transitionBarAttrs(['class', css('transition_bar', 'transition_bar_in')]);
        transitionBarAttrs2(['class', css('transition_bar', 'transition_bar_in')]);
      }, 1000);
      setCurrentSlide(slidingIn);
    },
  );
  swipe('RIGHT', () => machine('NEXT_SLIDE'));
  swipe('LEFT', () => machine('PREV_SLIDE'));
  keypress('ArrowRight', () => machine('NEXT_SLIDE'));
  keypress('ArrowLeft', () => machine('PREV_SLIDE'));

  const machine = (event: Events = null) => {
    switch (state()) {
      case 'INIT':
        parent(container(slides, transitionBar(), transitionBar2()));
        slider('INIT');
        setState('SEARCHING');
        break;
      case 'SEARCHING':
        switch (event) {
          case 'NEXT_SLIDE':
            slider('NEXT');
            break;
          case 'PREV_SLIDE':
            slider('PREV');
            break;
          case 'ESCAPE_TO_THINK_SPACE':
            setState('THINKING');
            break;
          case 'ESCAPE_TO_CHILL_SPACE':
            setState('CHILLING');
            break;
          case 'ESCAPE_TO_DEEP_SPACE':
            setState('IN_DEEP');
            break;
        }
        break;
      case 'THINKING':
      case 'CHILLING':
      case 'IN_DEEP':
        switch (event) {
          case 'ESCAPE':
            setState('SEARCHING');
            break;
        }
    }
  };

  machine();
};
