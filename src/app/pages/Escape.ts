import { useCss } from '../lib/Css';
import { useDom } from '../lib/Dom';
import { useEvent } from '../lib/Event';
import { useHtml } from '../lib/Html';
import { useKeyFrames } from '../lib/KeyFrames';
import { useKeyPress } from '../lib/KeyPress';
import { usePalette } from '../lib/Palette';
import { useProperty } from '../lib/Property';
import { useChillSpace } from './spaces/Chill';
import { useDeepSpace } from './spaces/Deep';
import { useThinkSpace } from './spaces/Think';

const [palette] = usePalette();

const [kf] = useKeyFrames({
  fadeIn: [
    [0, 'opacity', 0],
    [100, 'opacity', 1],
  ],
});

const [css] = useCss({
  bg: [['backgroundColor', palette('black')]],
  container: [
    ['display', 'flex'],
    ['justifyContent', 'center'],
    ['alignItems', 'center'],
    ['height', '100vh'],
    ['width', '100vw'],
    ['position', 'relative'],
  ],
  slider_container: [
    ['display', 'flex'],
    ['justifyContent', 'center'],
    ['alignItems', 'center'],
    ['border', `1px solid ${palette('white', 0, 0.1)}`],
    ['width', '90vw'],
    ['height', '90vh'],
    ['position', 'absolute'],
    ['left', '5vw'],
  ],
  order_1: [
    ['order', '1'],
    ['left', '-100vw'],
    ['transition', 'left 1s'],
  ],
  order_2: [
    ['order', '2'],
    ['left', '5vw'],
    ['transition', 'left 1s'],
  ],
  order_3: [
    ['order', '3'],
    ['left', '100vw'],
  ],
});

type ViewState = 'INIT' | 'THINK' | 'CHILL' | 'DEEP';
type ViewEvent = 'START' | 'NEXT';

export const useEscapePage = () => {
  // props
  useDom<HTMLBodyElement>('body', ['className', css('bg')]);
  const [pub, sub] = useEvent<ViewEvent>();
  const [viewState, setViewState] = useProperty<ViewState>('INIT');
  const [container] = useHtml('div', ['class', css('container')]);
  const [thinkSpace] = useThinkSpace();
  const [chillSpace] = useChillSpace();
  const [deepSpace] = useDeepSpace();
  const [think_container, setThinkAttrs] = useHtml('div', ['class', css('slider_container', 'order_2')]);
  const [chill_container, setChillAttrs] = useHtml('div', ['class', css('slider_container', 'order_3')]);
  const [deep_container, setDeepAttrs] = useHtml('div', ['class', css('slider_container', 'order_1')]);

  // methods
  useKeyPress((key) => {
    console.log(key);
    switch (key) {
      case 'Space':
        pub('NEXT');
        break;
    }
  });

  // handlers
  sub('NEXT', () => machine('NEXT'));

  // state machine
  const machine = (event: ViewEvent) => {
    console.log(event, viewState());
    switch (viewState()) {
      case 'INIT':
        setViewState('THINK');
        return [container(think_container(thinkSpace), chill_container(chillSpace), deep_container(deepSpace))];
      case 'THINK':
        if (event === 'NEXT') {
          setViewState('CHILL');
          setChillAttrs(['class', css('slider_container', 'order_2')]);
          setDeepAttrs(['class', css('slider_container', 'order_3')]);
          setThinkAttrs(['class', css('slider_container', 'order_1')]);
        }
        break;
      case 'CHILL':
        if (event === 'NEXT') {
          setViewState('DEEP');
          setDeepAttrs(['class', css('slider_container', 'order_2')]);
          setThinkAttrs(['class', css('slider_container', 'order_3')]);
          setChillAttrs(['class', css('slider_container', 'order_1')]);
        }
        break;
      case 'DEEP':
        if (event === 'NEXT') {
          setViewState('THINK');
          setThinkAttrs(['class', css('slider_container', 'order_2')]);
          setDeepAttrs(['class', css('slider_container', 'order_1')]);
          setChillAttrs(['class', css('slider_container', 'order_3')]);
        }
        break;
    }
  };

  return machine('START');
};
