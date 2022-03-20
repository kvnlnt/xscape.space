import { useAudio } from '@lib/Audio';
import { useSlider } from 'src/app/features/Slider';
import { useSpace } from 'src/app/features/Space';
import ChillSpace from 'src/core/data/ChillSpace';
import DeepSpace from 'src/core/data/DeepSpace';
import ThinkSpace from 'src/core/data/ThinkSpace';
import { useDom } from '../lib/Dom';
import { useHtml } from '../lib/Html';
import { useKeyPress } from '../lib/KeyPress';
import { useSwipe } from '../lib/Swipe';
import { css } from './Escape.styles';

type Slides = 'THINK' | 'CHILL' | 'DEEP';
type Messages =
  | { action: 'SLIDE' }
  | { action: 'ESCAPE_INTO_SPACE' }
  | { action: 'NEXT_SLIDE' }
  | { action: 'PREV_SLIDE' }
  | { action: 'ESCAPE_OUT_OF_SPACE' }
  | { action: 'RMS'; rms: number };
type States = 'INIT' | 'SLIDING' | 'THINKING' | 'CHILLING' | 'IN_DEEP';
type Props = (...children: (HTMLElement | Node)[]) => void;

export const useEscapePage: Feds.Page<Props> = (parent: Props) => {
  useDom<HTMLBodyElement>('body', ['className', css('body')]);

  // props
  const [swipe] = useSwipe();
  const keypress = useKeyPress();
  let activeSlide: Slides = 'THINK';
  let state: States = 'INIT';
  const [container] = useHtml('div', ['class', css('container')]);

  // components
  const audioMachine = useAudio((rms: number) => machine({ action: 'RMS', rms }));

  // components
  const [thinkSpace, thinkMachine] = useSpace({
    space: ThinkSpace,
    onEscape: () => machine({ action: 'ESCAPE_INTO_SPACE' }),
    audioMachine,
  });

  const [chillSpace, chillMachine] = useSpace({
    space: ChillSpace,
    onEscape: () => machine({ action: 'ESCAPE_INTO_SPACE' }),
    audioMachine,
  });

  const [deepSpace, deepMachine] = useSpace({
    space: DeepSpace,
    onEscape: () => machine({ action: 'ESCAPE_INTO_SPACE' }),
    audioMachine,
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

  // methods
  const render = () => {
    parent(container(slides));
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

  // machine
  const machine = (message: Messages = null) => {
    switch (state) {
      case 'INIT':
        render();
        slider('INIT');
        state = 'SLIDING';
        break;
      case 'SLIDING':
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
            state = 'SLIDING';
            break;
        }
    }
  };

  // init
  machine();
};
