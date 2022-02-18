import { useSlider } from '@components/Slider';
import { useSpace } from '@components/Space/Space';
import ChillSpace from '@domain/data/ChillSpace';
import DeepSpace from '@domain/data/DeepSpace';
import ThinkSpace from '@domain/data/ThinkSpace';
import { useCss } from '../lib/Css';
import { useDom } from '../lib/Dom';
import { useHtml } from '../lib/Html';
import { useKeyPress } from '../lib/KeyPress';
import { usePalette } from '../lib/Palette';
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
type Messages =
  | { action: 'SLIDE' }
  | { action: 'ESCAPE_INTO_SPACE' }
  | { action: 'NEXT_SLIDE' }
  | { action: 'PREV_SLIDE' }
  | { action: 'ESCAPE_OUT_OF_SPACE' };
type States = 'INIT' | 'SEARCHING' | 'THINKING' | 'CHILLING' | 'IN_DEEP';

export const useEscapePage = (parent: (...children: (HTMLElement | Node)[]) => void) => {
  useDom<HTMLBodyElement>('body', ['className', css('body')]);

  // props
  const [swipe] = useSwipe();
  const keypress = useKeyPress();
  let activeSlide: Slides = 'THINK';
  let state: States = 'INIT';
  const [container] = useHtml('div', ['class', css('container')]);

  // components
  const [thinkSpace, thinkMachine] = useSpace({
    space: ThinkSpace,
    onEscape: () => machine({ action: 'ESCAPE_INTO_SPACE' }),
  });
  const [chillSpace, chillMachine] = useSpace({
    space: ChillSpace,
    onEscape: () => machine({ action: 'ESCAPE_INTO_SPACE' }),
  });
  const [deepSpace, deepMachine] = useSpace({
    space: DeepSpace,
    onEscape: () => machine({ action: 'ESCAPE_INTO_SPACE' }),
  });

  const [slides, slider] = useSlider<Slides>(
    [
      { name: 'DEEP', element: deepSpace },
      { name: 'THINK', element: thinkSpace },
      { name: 'CHILL', element: chillSpace },
    ],
    ({ slidingIn, slidingOut }) => {
      activeSlide = slidingIn;
      if (slidingOut === 'THINK') thinkMachine({ action: 'SLIDE_OUT' });
      if (slidingIn === 'THINK') setTimeout(() => thinkMachine({ action: 'SLIDE_IN' }), 750);
      if (slidingOut === 'CHILL') chillMachine({ action: 'SLIDE_OUT' });
      if (slidingIn === 'CHILL') setTimeout(() => chillMachine({ action: 'SLIDE_IN' }), 750);
      if (slidingOut === 'DEEP') deepMachine({ action: 'SLIDE_OUT' });
      if (slidingIn === 'DEEP') setTimeout(() => deepMachine({ action: 'SLIDE_IN' }), 750);
    },
  );

  // events
  swipe('RIGHT', () => machine({ action: 'NEXT_SLIDE' }));
  swipe('LEFT', () => machine({ action: 'PREV_SLIDE' }));
  keypress('ArrowRight', () => machine({ action: 'NEXT_SLIDE' }));
  keypress('ArrowLeft', () => machine({ action: 'PREV_SLIDE' }));
  keypress('Escape', () => machine({ action: 'ESCAPE_OUT_OF_SPACE' }));
  keypress('Space', () => machine({ action: 'ESCAPE_INTO_SPACE' }));

  // message
  const render = () => {
    parent(container(slides));
    slider('INIT');
  };

  const enterSpace = () => {
    switch (activeSlide) {
      case 'THINK':
        thinkMachine({ action: 'ACTIVATE' });
        break;
      case 'CHILL':
        chillMachine({ action: 'ACTIVATE' });
        break;
      case 'DEEP':
        deepMachine({ action: 'ACTIVATE' });
        break;
    }
  };

  const escapeSpace = () => {
    switch (activeSlide) {
      case 'THINK':
        thinkMachine({ action: 'DEACTIVATE' });
        break;
      case 'CHILL':
        chillMachine({ action: 'DEACTIVATE' });
        break;
      case 'DEEP':
        deepMachine({ action: 'DEACTIVATE' });
        break;
    }
  };

  // state
  const machine = (message: Messages = null) => {
    console.log('escape', message, state);
    switch (state) {
      case 'INIT':
        render();
        state = 'SEARCHING';
        break;
      case 'SEARCHING':
        switch (message.action) {
          case 'NEXT_SLIDE':
            slider('NEXT');
            break;
          case 'PREV_SLIDE':
            slider('PREV');
            break;
          case 'ESCAPE_INTO_SPACE':
            enterSpace();
            if (activeSlide === 'THINK') state = 'THINKING';
            if (activeSlide === 'CHILL') state = 'CHILLING';
            if (activeSlide === 'DEEP') state = 'IN_DEEP';
            break;
        }
        break;
      case 'THINKING':
      case 'CHILLING':
      case 'IN_DEEP':
        switch (message.action) {
          case 'ESCAPE_OUT_OF_SPACE':
            escapeSpace();
            state = 'SEARCHING';
            break;
        }
    }
  };

  // init
  machine();
};
