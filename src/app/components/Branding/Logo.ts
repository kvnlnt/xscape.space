import { useMath } from 'src/app/lib/Math';
import { useCss } from '../../lib/Css';
import { useFont } from '../../lib/Fonts';
import { useHtml } from '../../lib/Html';
import { usePalette } from '../../lib/Palette';
import { useSvg } from '../../lib/Svg';
import { useMandala } from './Mandala';

const [palette] = usePalette();
const [font] = useFont();
const { randomNumberInRange } = useMath();

const getRandomColor = () => {
  const colors = [
    palette('blue', 30, 0.7),
    palette('red', 30, 0.7),
    palette('yellow', 0, 0.7),
    palette('green', 30, 0.7),
    palette('purple', 30, 0.7),
    palette('orange'),
  ];
  return colors[randomNumberInRange(0, colors.length - 1)];
};

const [css] = useCss({
  title: [
    ['color', palette('white')],
    ['padding', '30px 10px 10px 22px'],
    ['textAlign', 'center'],
    ['letterSpacing', '12px'],
    ['fontFamily', font('arial')],
    ['fontWeight', 'bold'],
    ['fontSize', '12px'],
  ],
  wrapper: [
    ['cursor', 'pointer'],
    ['display', 'flex'],
    ['alignItems', 'center'],
    ['flexDirection', 'column'],
    ['padding', '40px'],
  ],
});

const CanvasSize = 50;
const [RingOne, RingOneMessage] = useMandala({
  cx: CanvasSize / 2,
  cy: CanvasSize / 2,
  debug: false,
  diameter: CanvasSize * 0.7,
  fill: palette('transparent'),
  stroke: getRandomColor(),
  petals: [...Array(randomNumberInRange(5, 40)).fill({ height: 15, frequency: 20, slope: 5.5 })],
  rotation: 0,
  rotationSpeed: 0.75,
  strokeWidth: '1',
});

const [RingTwo, RingTwoMessage] = useMandala({
  cx: CanvasSize / 2,
  cy: CanvasSize / 2,
  debug: false,
  diameter: CanvasSize * 0.3,
  fill: palette('transparent'),
  stroke: getRandomColor(),
  petals: Array(randomNumberInRange(5, 20)).fill({ height: 5, frequency: 20, slope: 0.3 }),
  rotation: 0,
  rotationSpeed: -0.5,
  strokeWidth: '1',
});

const [RingThree, RingThreeMessage] = useMandala({
  cx: CanvasSize / 2,
  cy: CanvasSize / 2,
  debug: false,
  diameter: CanvasSize * 0.3,
  fill: palette('transparent'),
  stroke: getRandomColor(),
  petals: [...Array(randomNumberInRange(5, 10)).fill({ height: 40, frequency: 20, slope: 6.3 })],
  rotation: 0,
  rotationSpeed: 1,
  strokeWidth: '1',
});

const startAnimation = () => {
  RingOneMessage({ event: 'ANIMATE' });
  RingTwoMessage({ event: 'ANIMATE' });
  RingThreeMessage({ event: 'ANIMATE' });
};
const stopAnimation = () => {
  RingOneMessage({ event: 'STOP' });
  RingTwoMessage({ event: 'STOP' });
  RingThreeMessage({ event: 'STOP' });
};
const [Mandala] = useSvg('svg', ['width', CanvasSize], ['height', CanvasSize]);
const [Wrapper] = useHtml(
  'div',
  ['class', css('wrapper')],
  ['onmouseenter', startAnimation],
  ['onmouseleave', stopAnimation],
);
const [Title] = useHtml('div', ['class', css('title')]);

export default Wrapper(Mandala(RingOne, RingTwo, RingThree), Title('FEDS'));
