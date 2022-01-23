import { useSlider } from '../components/Slider';
import { useChillSpace } from '../components/spaces/Chill';
import { useDeepSpace } from '../components/spaces/Deep';
import { useThinkSpace } from '../components/spaces/Think';
import { useCss } from '../lib/Css';
import { useDom } from '../lib/Dom';
import { useHtml } from '../lib/Html';
import { useKeyFrames } from '../lib/KeyFrames';
import { usePalette } from '../lib/Palette';
import { useProperty } from '../lib/Property';

const [palette] = usePalette();

const [kf] = useKeyFrames({
  fadeIn: [
    [0, 'opacity', 0],
    [100, 'opacity', 1],
  ],
});

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

type ViewState = 'INIT';
type Slides = 'THINK' | 'CHILL' | 'DEEP';

export const useEscapePage = () => {
  // props
  useDom<HTMLBodyElement>('body', ['className', css('body')]);
  const [viewState] = useProperty<ViewState>('INIT');
  const [container] = useHtml('div', ['class', css('container')]);
  const [thinkSpace] = useThinkSpace();
  const [chillSpace] = useChillSpace();
  const [deepSpace] = useDeepSpace();
  const [slides] = useSlider<Slides>(
    { name: 'DEEP', element: deepSpace },
    { name: 'THINK', element: thinkSpace },
    { name: 'CHILL', element: chillSpace },
  );

  // state machine
  const machine = () => {
    switch (viewState()) {
      case 'INIT':
        return [container(...slides)];
    }
  };

  return machine();
};
