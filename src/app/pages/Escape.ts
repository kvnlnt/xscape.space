import { useSlider } from '@components/Slider';
import { useSpace } from '@components/Space';
import ChillSpace from '@domain/data/ChillSpace';
import DeepSpace from '@domain/data/DeepSpace';
import ThinkSpace from '@domain/data/ThinkSpace';
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
});

type Slides = 'THINK' | 'CHILL' | 'DEEP';
type Events = 'SLIDE' | 'ESCAPE_INTO_SPACE' | 'NEXT_SLIDE' | 'PREV_SLIDE' | 'ESCAPE_OUT_OF_SPACE';
type States = 'INIT' | 'SEARCHING' | 'THINKING' | 'CHILLING' | 'IN_DEEP';

export const useEscapePage = (parent: (...children: (HTMLElement | Node)[]) => void) => {
  useDom<HTMLBodyElement>('body', ['className', css('body')]);

  // props
  const [swipe] = useSwipe();
  const [keypress] = useKeyPress();
  const [activeSlide, setActiveSlide] = useProperty<Slides>('THINK');
  const [state, setState] = useProperty<States>('INIT');
  const [container] = useHtml('div', ['class', css('container')]);

  // components
  const [thinkSpace, thinkMachine] = useSpace(ThinkSpace);
  const [chillSpace, chillMachine] = useSpace(ChillSpace);
  const [deepSpace, deepMachine] = useSpace(DeepSpace);

  const [slides, slider] = useSlider<Slides>(
    [
      { name: 'DEEP', element: deepSpace },
      { name: 'THINK', element: thinkSpace },
      { name: 'CHILL', element: chillSpace },
    ],
    ({ slidingIn, slidingOut }) => {
      setActiveSlide(slidingIn);
      if (slidingOut === 'THINK') thinkMachine('SLIDE_OUT');
      if (slidingIn === 'THINK') setTimeout(() => thinkMachine('SLIDE_IN'), 750);
      if (slidingOut === 'CHILL') chillMachine('SLIDE_OUT');
      if (slidingIn === 'CHILL') setTimeout(() => chillMachine('SLIDE_IN'), 750);
      if (slidingOut === 'DEEP') deepMachine('SLIDE_OUT');
      if (slidingIn === 'DEEP') setTimeout(() => deepMachine('SLIDE_IN'), 750);
    },
  );

  // events
  swipe('RIGHT', () => machine('NEXT_SLIDE'));
  swipe('LEFT', () => machine('PREV_SLIDE'));
  keypress('ArrowRight', () => machine('NEXT_SLIDE'));
  keypress('ArrowLeft', () => machine('PREV_SLIDE'));
  keypress('Escape', () => machine('ESCAPE_OUT_OF_SPACE'));
  keypress('Space', () => machine('ESCAPE_INTO_SPACE'));

  // actions
  const actions: Record<string, () => States> = {
    render() {
      parent(container(slides));
      slider('INIT');
      return 'SEARCHING';
    },
    enterSpace() {
      switch (activeSlide()) {
        case 'THINK':
          thinkMachine('ACTIVATE');
          return 'THINKING';
        case 'CHILL':
          chillMachine('ACTIVATE');
          return 'CHILLING';
        case 'DEEP':
          deepMachine('ACTIVATE');
          return 'IN_DEEP';
      }
    },
    escapeSpace() {
      switch (activeSlide()) {
        case 'THINK':
          thinkMachine('DEACTIVATE');
          return 'SEARCHING';
        case 'CHILL':
          chillMachine('DEACTIVATE');
          return 'SEARCHING';
        case 'DEEP':
          deepMachine('DEACTIVATE');
          return 'SEARCHING';
      }
    },
  };

  // state
  const machine = (event: Events = null) => {
    switch (state()) {
      case 'INIT':
        setState(actions.render());
        break;
      case 'SEARCHING':
        switch (event) {
          case 'NEXT_SLIDE':
            slider('NEXT');
            break;
          case 'PREV_SLIDE':
            slider('PREV');
            break;
          case 'ESCAPE_INTO_SPACE':
            setState(actions.enterSpace());
            break;
        }
        break;
      case 'THINKING':
      case 'CHILLING':
      case 'IN_DEEP':
        switch (event) {
          case 'ESCAPE_OUT_OF_SPACE':
            setState(actions.escapeSpace());
            break;
        }
    }
  };

  // init
  machine();
};
