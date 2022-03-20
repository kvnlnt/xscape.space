import { AudioMachine } from '@lib/Audio';
import { html, useHtml } from '@lib/Html';
import { Space } from 'src/core/types';
import { css } from './Space.styles';
import { useSpectralizer } from './Spectralizer';

type SpaceStates = 'ACTIVE' | 'PASSIVE';
type SpaceMessages =
  | { action: 'SLIDE_IN' }
  | { action: 'SLIDE_OUT' }
  | { action: 'ACTIVATE' }
  | { action: 'DEACTIVATE' }
  | { action: 'SONG_CHANGE'; songIndex: number }
  | { action: 'SPECTRALIZER_CLICK' }
  | { action: 'RMS'; rms: number }
  | { action: 'RENDER' };
type SpaceProps = {
  space: Space;
  onEscape: () => void;
  audioMachine: AudioMachine;
};
export type SpaceComponent = Feds.Component<SpaceProps, SpaceMessages>;

export const useSpace: SpaceComponent = (props: SpaceProps) => {
  // props
  const { space, onEscape, audioMachine } = props;
  let state: SpaceStates = 'PASSIVE';
  let songIndex = 0;
  const [container, containerAttrs] = useHtml('div', ['class', css('container')]);
  const spectralizer_container = html('div', ['class', css('spectralizer_container')]);
  const [spectralizer, spectralizerMachine] = useSpectralizer({ space: space });

  // methods
  const activate = () => {
    containerAttrs(['class', css('container', 'container_active')]);
    spectralizerMachine({ action: 'PLAY' });
  };

  const deactivate = () => {
    containerAttrs(['class', css('container', 'container_deactive')]);
    spectralizerMachine({ action: 'RESET' });
    audioMachine({ action: 'STOP' });
    onEscape();
  };

  const slideIn = () => {
    spectralizerMachine({ action: 'ANIMATE_IN' });
  };

  const slideOut = () => {
    spectralizerMachine({ action: 'ANIMATE_OUT' });
  };

  const render = () => container(spectralizer_container(spectralizer));

  const playSong = () => {
    audioMachine({ action: 'PLAY', mp3Url: space.songs[songIndex].mp3Url });
  };

  // state machine
  const machine = (message: SpaceMessages) => {
    switch (state) {
      case 'PASSIVE':
        switch (message.action) {
          case 'SLIDE_IN':
            slideIn();
            state = 'PASSIVE';
            break;
          case 'SLIDE_OUT':
            slideOut();
            state = 'PASSIVE';
            break;
          case 'ACTIVATE':
            activate();
            playSong();
            state = 'ACTIVE';
            break;
        }
        break;
      case 'ACTIVE':
        switch (message.action) {
          case 'DEACTIVATE':
            deactivate();
            state = 'PASSIVE';
            break;
          case 'SONG_CHANGE':
            songIndex = message.songIndex;
            playSong();
            break;
          case 'RMS':
            spectralizerMachine({ action: 'STREAM', rms: message.rms });
            break;
        }
        break;
    }
  };

  return [render(), machine];
};
