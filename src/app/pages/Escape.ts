import { useSlider } from '../components/Slider';
import { useChillSpace } from '../components/spaces/Chill';
import { useDeepSpace } from '../components/spaces/Deep';
import { useThinkSpace } from '../components/spaces/Think';
import { useCss } from '../lib/Css';
import { useDom } from '../lib/Dom';
import { useHtml } from '../lib/Html';
import { usePalette } from '../lib/Palette';
import { useProperty } from '../lib/Property';

const [palette] = usePalette();

const [css] = useCss({
  body: [
    ['backgroundColor', palette('black')],
    ['overflow', 'hidden'],
  ],
  container: [
    ['display', 'flex'],
    ['justifyContent', 'center'],
    ['alignItems', 'center'],
    ['height', '100vh'],
    ['width', '100vw'],
    ['position', 'relative'],
    ['overflow', 'hidden'],
  ],
});

type ViewState = 'SLIDER';
type Slides = 'THINK' | 'CHILL' | 'DEEP';

export const useEscapePage = () => {
  // props
  useDom<HTMLBodyElement>('body', ['className', css('body')]);
  const [viewState] = useProperty<ViewState>('SLIDER');
  const [container] = useHtml('div', ['class', css('container')]);
  const [thinkSpace, thinkAnimateIn, thinkAnimateOut] = useThinkSpace();
  const [chillSpace, chillAnimateIn, chillAnimateOut] = useChillSpace();
  const [deepSpace, deepAnimateIn, deepAnimateOut] = useDeepSpace();
  const [slides] = useSlider<Slides>(
    [
      { name: 'DEEP', element: deepSpace },
      { name: 'THINK', element: thinkSpace },
      { name: 'CHILL', element: chillSpace },
    ],
    ({ slidingIn, slidingOut }) => {
      if (slidingOut === 'THINK') thinkAnimateOut();
      if (slidingIn === 'THINK') setTimeout(thinkAnimateIn, 750);
      if (slidingOut === 'CHILL') chillAnimateOut();
      if (slidingIn === 'CHILL') setTimeout(chillAnimateIn, 750);
      if (slidingOut === 'DEEP') deepAnimateOut();
      if (slidingIn === 'DEEP') setTimeout(deepAnimateIn, 750);
    },
  );

  // state machine
  const machine = () => {
    switch (viewState()) {
      case 'SLIDER':
        return [container(...slides)];
    }
  };

  return machine();
};
