import { useMandala } from '../components/Branding/Mandala';
import { useIsoShell } from '../components/Grids/IsoShell';
import { useCss } from '../lib/Css';
import { useFont } from '../lib/Fonts';
import { useHtml } from '../lib/Html';
import { useKeyFrames } from '../lib/KeyFrames';
import { useLocalization } from '../lib/Localization';
import { useMath } from '../lib/Math';
import { usePalette } from '../lib/Palette';
import { useSvg } from '../lib/Svg';

const [l10n] = useLocalization();
const [palette] = usePalette();
const [font] = useFont();

const [kf] = useKeyFrames({
  fadeIn: [
    [0, 'opacity', 0],
    [100, 'opacity', 1],
  ],
  slideDown: [
    [0, 'transform', 'translateY(-15px)'],
    [100, 'transform', 'translateY(0px)'],
  ],
  slideUp: [
    [0, 'transform', 'translateY(15px)'],
    [100, 'transform', 'translateY(0px)'],
  ],
  scaleUp: [
    [0, 'transform', 'scale(0.5)'],
    [100, 'transform', 'scale(1)'],
  ],
});

const [css] = useCss({
  animationContainer: [
    ['color', palette('white')],
    ['fontFamily', font('arial')],
    ['padding', '0px'],
    ['fontSize', '14px'],
    ['cursor', 'pointer'],
  ],
  wrapper: [
    ['display', 'flex'],
    ['width', '100vw'],
    ['justifyContent', 'center'],
  ],
  container: [
    ['display', 'flex'],
    ['flexDirection', 'column'],
    ['justifyContent', 'center'],
    ['alignItems', 'center'],
    ['maxWidth', '500px'],
    ['animation', kf('fadeIn', 'scaleUp')],
    ['animationFillMode', 'forwards'],
    ['animationDuration', '.5s'],
    ['animationDelay', '0s'],
  ],
  title: [
    ['color', palette('white')],
    ['fontFamily', font('arial')],
    ['fontWeight', 'bold'],
    ['fontSize', '30px'],
    ['textTransform', 'uppercase'],
    ['letterSpacing', '30px'],
    ['textAlign', 'center'],
    ['marginBottom', '10px'],
    ['marginLeft', '30px'],
    ['animation', kf('slideUp', 'fadeIn')],
    ['animationFillMode', 'forwards'],
    ['animationDuration', '1s'],
    ['animationDelay', '0.25s'],
    ['opacity', 0],
  ],
  subTitle: [
    ['color', palette('white', 0, 0.2)],
    ['fontFamily', font('arial')],
    ['fontSize', '10px'],
    ['textTransform', 'uppercase'],
    ['letterSpacing', '5px'],
    ['textAlign', 'center'],
    ['marginBottom', '0px'],
    ['animation', kf('slideUp', 'fadeIn')],
    ['animationFillMode', 'forwards'],
    ['animationDuration', '1s'],
    ['animationDelay', '0.5s'],
    ['opacity', 0],
  ],
  tagline: [
    ['color', palette('white')],
    ['fontFamily', font('arial')],
    ['fontSize', '15px'],
    ['textTransform', 'uppercase'],
    ['letterSpacing', '5px'],
    ['textAlign', 'center'],
    ['lineHeight', '28px'],
    ['padding', '0px 30px 30px'],
    ['opacity', '0'],
    ['animationName', kf('slideUp', 'fadeIn')],
    ['animationFillMode', 'forwards'],
    ['animationDuration', '1s'],
    ['animationDelay', '.75s'],
  ],
  button: [
    ['backgroundColor', palette('transparent')],
    ['color', palette('white')],
    ['borderTop', '0px'],
    ['borderLeft', '0px'],
    ['borderRight', '0px'],
    ['borderBottom', `5px solid ${palette('white', 0, 0.08)}`],
    ['padding', '15px 20px'],
    ['textTransform', 'uppercase'],
    ['fontSize', '10px'],
    ['letterSpacing', '5px'],
    ['cursor', 'pointer'],
    ['opacity', 0],
    ['animationName', kf('slideUp', 'fadeIn')],
    ['animationFillMode', 'forwards'],
    ['animationDuration', '1s'],
    ['animationDelay', '1s'],
  ],
  bg_white: [
    ['backgroundColor', palette('white', 0, 0.1)],
    ['transition', 'all 1s'],
  ],
  white_text: [
    ['color', palette('white', 0, 0.75)],
    ['transition', 'all 1s'],
  ],
  github_link: [
    ['color', palette('white', 0, 0.2)],
    ['fontSize', '10px'],
    ['position', 'fixed'],
    ['top', '20px'],
    ['right', '20px'],
    ['textDecoration', 'none'],
    ['textTransform', 'uppercase'],
    ['fontFamily', font('arial')],
    ['letterSpacing', '2px'],
    ['borderBottom', `1px dotted ${palette('white', 0, 0.1)}`],
    ['display', 'block'],
    ['padding', '5px'],
  ],
  fs_12: [
    ['fontSize', '12px'],
    ['lineHeight', '16px'],
  ],
  fs_15: [
    ['fontSize', '15px'],
    ['lineHeight', '26px'],
  ],
});

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

const CanvasSize = 300;

const createMandala = () => {
  const [Mandala] = useSvg('svg', ['width', CanvasSize], ['height', CanvasSize]);

  const [RingOne, RingOneMessage] = useMandala({
    cx: CanvasSize / 2,
    cy: CanvasSize / 2,
    debug: false,
    diameter: CanvasSize * 0.75,
    fill: palette('transparent'),
    stroke: getRandomColor(),
    petals: [
      ...Array(randomNumberInRange(20, 50)).fill({
        height: randomNumberInRange(0, 100),
        frequency: 20,
        slope: randomNumberInRange(1, 5),
      }),
    ],
    rotation: randomNumberInRange(0, 90),
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
    petals: Array(randomNumberInRange(20, 50)).fill({
      height: randomNumberInRange(0, 100),
      frequency: 20,
      slope: randomNumberInRange(1, 3),
    }),
    rotation: randomNumberInRange(0, 90),
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
    petals: [
      ...Array(randomNumberInRange(20, 50)).fill({
        height: randomNumberInRange(0, 100),
        frequency: 20,
        slope: randomNumberInRange(1, 6),
      }),
    ],
    rotation: randomNumberInRange(0, 90),
    rotationSpeed: 1,
    strokeWidth: '1',
  });

  return Mandala(RingOne, RingTwo, RingThree);
};

export const useSplashScreen = () => {
  let interval: number;
  const [wrapper] = useHtml('div', ['class', css('wrapper')]);
  const [container] = useHtml('div', ['class', css('container')]);
  const stopAnimation = () => clearInterval(interval);
  const startAnimation = () => {
    stopAnimation();
    interval = setInterval(() => setAnimationContainer(createMandala()));
  };
  const [animationContainer, setAnimationContainer] = useHtml('div', ['class', css('animationContainer')]);
  const [title] = useHtml('div', ['class', css('title')]);
  const [github] = useHtml(
    'a',
    ['class', css('github_link', 'white_text_on_hover')],
    ['href', 'http://github.com/kvnlnt/feds'],
    ['target', '_blank'],
  );
  const [subTitle] = useHtml('div', ['class', css('subTitle')]);
  const [tagline] = useHtml('div', ['class', css('tagline', 'fs_12', 'fs_15_on_tablet')]);
  const [button] = useHtml(
    'button',
    ['class', css('button', 'bg_white_on_hover')],
    ['onclick', () => alert('COMING SOON!!! ')],
    ['onmouseover', () => startAnimation()],
    ['onmouseout', () => stopAnimation()],
  );
  const [dashboard] = useIsoShell(
    wrapper(
      github('github'),
      container(
        title('feds'),
        subTitle('Own Your Framework'),
        animationContainer(createMandala()),
        tagline(
          'A hard to break, easy to fix frontend development system designed for adoption. Own your framework or it will own you.',
        ),
        button('Prove It'),
      ),
    ),
  );
  startAnimation();
  setTimeout(() => stopAnimation(), 2000);
  return [dashboard];
};
