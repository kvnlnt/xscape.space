import { useCss } from '@lib/Css';
import { useHtml } from '@lib/Html';
import { usePalette } from '@lib/Palette';

const [palette] = usePalette();

const [css] = useCss({
  spectralizer: [
    ['display', 'flex'],
    ['flexDirection', 'row'],
    ['alignItems', 'center'],
    ['justifyContent', 'center'],
    ['height', '100%'],
    ['cursor', 'pointer'],
  ],
  bar_bg: [
    ['backgroundColor', palette('white', 0, 0.02)],
    ['marginLeft', '5px'],
    ['borderRadius', '7px'],
    ['display', 'flex'],
    ['flexDirection', 'row'],
    ['alignItems', 'center'],
    ['justifyContent', 'center'],
    ['height', '100%'],
    ['width', '5px'],
  ],
  bar: [
    ['backgroundColor', palette('purple')],
    ['borderRadius', '7px'],
    ['width', '100%'],
    ['transition', 'all 0.10s'],
    ['height', '0%'],
  ],
});

type SpectralizerState = 'PLAY_BUTTON' | 'PAUSE_BUTTON' | 'STREAMING' | 'IDLE';

type SpectralizerActions =
  | { action: 'PLAY' }
  | { action: 'PAUSE' }
  | { action: 'CLEAR' }
  | { action: 'HOVER_OVER' }
  | { action: 'HOVER_OUT' }
  | { action: 'ANIMATE_IN' }
  | { action: 'ANIMATE_OUT' }
  | { action: 'RESET' }
  | { action: 'STREAM'; rms: number };

type SpectralizerProps = {
  state?: SpectralizerState;
  height?: number;
};

type Spectrum = [
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
];

export const useSpectralizer = ({
  state = 'IDLE',
}: SpectralizerProps): [HTMLElement, (action: SpectralizerActions) => void] => {
  const [spectralizer] = useHtml(
    'div',
    ['class', css('spectralizer')],
    ['onmouseenter', () => machine({ action: 'HOVER_OVER' })],
    ['onmouseleave', () => machine({ action: 'HOVER_OUT' })],
  );
  let viewState: SpectralizerState = state;
  let wave: Spectrum = [0, 10, 20, 30, 40, 70, 90, 90, 70, 40, 30, 20, 10, 0];
  let waveInterval: number;
  let streamWave: Spectrum = [0, 10, 20, 30, 40, 70, 90, 90, 70, 40, 30, 20, 10, 0];
  const playButton: Spectrum = [0, 0, 0, 0, 50, 40, 30, 20, 10, 4, 0, 0, 0, 0];
  const off: Spectrum = [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5];
  const barBgs = off.map(() => useHtml('div', ['class', css('bar_bg')]));
  const bars = off.map((i) => useHtml('div', ['class', css('bar')], ['style', `height:${i}%;`]));
  const render = () => spectralizer(...barBgs.map(([barBg], bar) => barBg(bars[bar][0]())));
  const shuffle = (ary: any[]) => ary.slice(0).sort(() => Math.random() - 0.5);

  const animateIn = () => {
    playButton.forEach((i, ii) => bars[ii][1](['style', `height:${i}%;`]));
  };

  const animateOut = () => {
    off.forEach((i, ii) => bars[ii][1](['style', `height:${i}%;`]));
  };

  const animateWave = () => {
    wave = shuffle(wave) as Spectrum;
    wave.forEach((i, ii) => bars[ii][1](['style', `height:${i}%;`]));
  };

  const stream = (rms: number) => {
    streamWave.shift();
    streamWave.push(rms);
    streamWave.forEach((i, ii) => bars[ii][1](['style', `height:${i}%;`]));
  };

  const reset = () => {
    playButton.forEach((i, ii) => bars[ii][1](['style', `height:${i}%;`]));
  };

  const machine = (action: SpectralizerActions) => {
    switch (viewState) {
      case 'IDLE':
        switch (action.action) {
          case 'ANIMATE_IN':
            animateIn();
            viewState = 'STREAMING';
            break;
          case 'ANIMATE_OUT':
            animateOut();
            break;
          case 'PLAY':
            viewState = 'STREAMING';
            break;
          case 'HOVER_OVER':
            waveInterval = setInterval(animateWave, 20);
            break;
          case 'HOVER_OUT':
            clearInterval(waveInterval);
            animateIn();
            break;
        }
        break;
      case 'STREAMING':
        switch (action.action) {
          case 'STREAM':
            stream(action.rms);
            break;
          case 'RESET':
            reset();
            break;
        }
      default:
        break;
    }
  };

  return [render(), machine];
};
