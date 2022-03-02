import { Space } from '@domain/types';
import { html, useHtml } from '@lib/Html';
import { css } from './Spectralizer.styles';

type Spectrum = number[];
type SpectralizerState = 'THINK' | 'CHILL' | 'DEEP' | 'PAUSE_BUTTON' | 'STREAMING' | 'STREAMING_HOVER';
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
  space: Space;
};

export const useSpectralizer: Feds.Component<SpectralizerProps, SpectralizerMessages> = ({
  space,
}: SpectralizerProps) => {
  const [spectralizer] = useHtml(
    'div',
    ['class', css('spectralizer')],
    ['onmouseenter', () => machine({ action: 'HOVER_OVER' })],
    ['onmouseleave', () => machine({ action: 'HOVER_OUT' })],
  );
  const originalViewState = space.name === 'think' ? 'THINK' : space.name === 'chill' ? 'CHILL' : 'DEEP';
  let viewState: SpectralizerState = originalViewState;
  let wave: Spectrum = [0, 10, 20, 30, 40, 70, 90, 90, 70, 40, 30, 20, 10, 0];
  let waveInterval: number;
  let streamWave: Spectrum = [0, 10, 20, 30, 40, 70, 90, 90, 70, 40, 30, 20, 10, 0];
  const playText = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [50, 0, 0, 0],
    [50, 0, 0, 0],
    [10, -15, 10, 0],
    [35, -8, 0, 0],
    [20, -8, 0, 0],
    [0, 0, 0, 0],
    [50, 0, 0, 0],
    [50, 0, 0, 0],
    [10, 20, 0, 0],
    [10, 20, 0, 0],
    [0, 0, 0, 0],
    [50, 0, 0, 0],
    [50, 0, 0, 0],
    [10, 0, 10, -30],
    [50, 0, 0, 0],
    [50, 0, 0, 0],
    [0, 0, 0, 0],
    [20, -5, 20, 5],
    [20, -5, 20, 5],
    [10, 0, 20, 10],
    [50, 0, 0, 0],
    [50, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
  const pauseButton: Spectrum = [0, 0, 0, 50, 50, 50, 0, 0, 50, 50, 50, 0, 0, 0];
  const thinkText = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [10, -20, 0, 0],
    [10, -20, 0, 0],
    [50, 0, 0, 0],
    [50, 0, 0, 0],
    [10, -20, 0, 0],
    [10, -20, 0, 0],
    [0, 0, 0, 0],
    [50, 0, 0, 0],
    [50, 0, 0, 0],
    [20, 0, 0, 0],
    [20, 0, 0, 0],
    [50, 0, 0, 0],
    [50, 0, 0, 0],
    [0, 0, 0, 0],
    [50, 0, 0, 0],
    [50, 0, 0, 0],
    [0, 0, 0, 0],
    [50, 0, 0, 0],
    [50, 0, 0, 0],
    [20, -5, 0, 0],
    [20, 5, 0, 0],
    [50, 0, 0, 0],
    [50, 0, 0, 0],
    [0, 0, 0, 0],
    [50, 0, 0, 0],
    [50, 0, 0, 0],
    [20, 0, 0, 0],
    [20, 25, 20, -25],
    [20, 25, 20, -25],
  ];
  const off: Spectrum = [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5];
  const bars = Array(36)
    .fill(null)
    .map(() =>
      html('div', ['class', css('bar_bg')])(
        html('div', ['class', css('bar')], ['style', `height:0%;`])(),
        html('div', ['class', css('bar')], ['style', `height:0%;`])(),
      ),
    );
  const render = () => spectralizer(...bars);
  const shuffle = (ary: any[]) => ary.slice(0).sort(() => Math.random() - 0.5);

  const animateIn = () => {
    // playText.forEach((i, ii) => bars[ii][1](['style', `height:${i}%;`]));
  };

  const animateOut = () => {
    // off.forEach((i, ii) => bars[ii][1](['style', `height:${i}%;`]));
  };

  const animateWave = () => {
    wave = shuffle(wave) as Spectrum;
    // wave.forEach((i, ii) => bars[ii][1](['style', `height:${i}%;`]));
  };

  const stream = (rms: number) => {
    streamWave.shift();
    streamWave.push(rms);
    // streamWave.forEach((i, ii) => bars[ii][1](['style', `height:${i}%;`]));
  };

  const reset = () => {
    // playText.forEach((i, ii) => bars[ii][1](['style', `height:${i}%;`]));
  };

  const showPauseButton = () => {
    // pauseButton.forEach((i, ii) => bars[ii][1](['style', `height:${i}%;`]));
  };

  const showPlayText = () => {
    playText.forEach((i, ii) => {
      bars[ii].children[0].setAttribute('style', `height:${i[0]}%;top:${i[1]}%`);
      bars[ii].children[1].setAttribute('style', `height:${i[2]}%;top:${i[3]}%`);
    });
  };

  const showThinkText = () => {
    thinkText.forEach((i, ii) => {
      bars[ii].children[0].setAttribute('style', `height:${i[0]}%;top:${i[1]}%`);
      bars[ii].children[1].setAttribute('style', `height:${i[2]}%;top:${i[3]}%`);
    });
  };

  const showChillText = () => {
    thinkText.forEach((i, ii) => {
      bars[ii].children[0].setAttribute('style', `height:${i[0]}%;top:${i[1]}%`);
      bars[ii].children[1].setAttribute('style', `height:${i[2]}%;top:${i[3]}%`);
    });
  };

  const showDeepText = () => {
    thinkText.forEach((i, ii) => {
      bars[ii].children[0].setAttribute('style', `height:${i[0]}%;top:${i[1]}%`);
      bars[ii].children[1].setAttribute('style', `height:${i[2]}%;top:${i[3]}%`);
    });
  };

  const machine = (message: SpectralizerMessages) => {
    console.log(message, viewState);
    switch (viewState) {
      case 'THINK':
      case 'CHILL':
      case 'DEEP':
        switch (message.action) {
          case 'HOVER_OVER':
            showPlayText();
            break;
          case 'HOVER_OUT':
          default:
            switch (space.name) {
              case 'think':
                showThinkText();
                break;
              case 'chill':
                showChillText();
                break;
              case 'deep':
                showDeepText();
                break;
            }
        }
        break;
      case 'STREAMING':
        switch (message.action) {
          case 'STREAM':
            stream(message.rms);
            break;
          case 'RESET':
            viewState = originalViewState;
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
            showPlayText();
            break;
        }
    }
  };

  return [render(), machine];
};
