import { useHtml } from '@lib/Html';
import { css } from './Spectralizer.styles';

type SpectralizerState = 'PLAY_BUTTON' | 'PAUSE_BUTTON' | 'STREAMING' | 'STREAMING_HOVER' | 'IDLE';

type SpectralizerMessages =
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
}: SpectralizerProps): [HTMLElement, (action: SpectralizerMessages) => void] => {
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
  const pauseButton: Spectrum = [0, 0, 0, 50, 50, 50, 0, 0, 50, 50, 50, 0, 0, 0];
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

  const showPauseButton = () => {
    pauseButton.forEach((i, ii) => bars[ii][1](['style', `height:${i}%;`]));
  };

  const showPlayButton = () => {
    playButton.forEach((i, ii) => bars[ii][1](['style', `height:${i}%;`]));
  };

  const machine = (message: SpectralizerMessages) => {
    console.log(message);
    switch (viewState) {
      case 'IDLE':
        switch (message.action) {
          case 'ANIMATE_IN':
            animateIn();
            break;
          case 'ANIMATE_OUT':
            animateOut();
            break;
          case 'PLAY':
            viewState = 'STREAMING';
            clearInterval(waveInterval);
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
        switch (message.action) {
          case 'STREAM':
            stream(message.rms);
            break;
          case 'RESET':
            viewState = 'IDLE';
            reset();
            break;
          case 'HOVER_OVER':
            viewState = 'STREAMING_HOVER';
            showPauseButton();
            break;
        }
        break;
      case 'STREAMING_HOVER':
        switch (message.action) {
          case 'HOVER_OUT':
            viewState = 'STREAMING';
            showPlayButton();
            break;
        }
    }
  };

  return [render(), machine];
};
