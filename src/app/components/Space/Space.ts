import { Space } from '@domain/types';
import { useAudio } from '@lib/Audio';
import { html, useHtml } from '@lib/Html';
import { usePlaylist } from '../Playlist';
import { useSpectralizer } from '../Spectralizer';
import { css } from './Styles';

type SpaceStates = 'ACTIVE' | 'PASSIVE';
type SpaceMessages =
  | { action: 'SLIDE_IN' }
  | { action: 'SLIDE_OUT' }
  | { action: 'ACTIVATE' }
  | { action: 'DEACTIVATE' }
  | { action: 'SONG_CHANGE'; songIndex: number }
  | { action: 'RMS'; rms: number };
type SpaceProps = {
  space: Space;
  onEscape: () => void;
};

export const useSpace: Feds.Component<SpaceProps, SpaceMessages> = (props: SpaceProps) => {
  // props
  const { space, onEscape } = props;
  const { name } = space;
  let state: SpaceStates = 'PASSIVE';
  let songIndex = 0;
  const [container, containerAttrs] = useHtml('div', ['class', css('container')]);
  const [title_container, titleContainerAttrs] = useHtml('div', ['class', css('title_container')]);
  const [header, headerAttrs] = useHtml('div', ['class', css('title_active', 'font_big_on_tablet')]);
  const [playlist_container, playlistContainerAttrs] = useHtml('div', ['class', css('playlist_container')]);
  const spectralizer_container = html('div', ['class', css('spectralizer_container')], ['onclick', onEscape]);
  const audioMachine = useAudio((rms: number) => machine({ action: 'RMS', rms }));

  // components
  const [spectralizer, spectralizerMachine] = useSpectralizer({});
  const [playlist, playlistMachine] = usePlaylist({
    space,
    callback: (i: number) => machine({ action: 'SONG_CHANGE', songIndex: i }),
  });

  // methods
  const activate = () => {
    containerAttrs(['class', css('container', 'container_active')]);
    titleContainerAttrs(['class', css('title_container_play_mode')]);
    headerAttrs(['class', css('title_active_play_mode')]);
    playlistContainerAttrs(['class', css('playlist_container_active')]);
    playlistMachine({ action: 'START' });
  };

  const deactivate = () => {
    containerAttrs(['class', css('container', 'container_deactive')]);
    titleContainerAttrs(['class', css('title_container')]);
    headerAttrs(['class', css('title_active', 'title_transition_in', 'font_big_on_tablet')]);
    playlistContainerAttrs(['class', css('playlist_container')]);
    playlistMachine({ action: 'QUIT' });
    spectralizerMachine({ action: 'RESET' });
    audioMachine({ action: 'STOP' });
  };

  const slideIn = () => {
    headerAttrs(['class', css('title_active', 'title_transition_in', 'font_big_on_tablet')]);
    spectralizerMachine({ action: 'ANIMATE_IN' });
  };

  const slideOut = () => {
    headerAttrs(['class', css('title_active', 'font_big_on_tablet', 'title_transition_out')]);
    spectralizerMachine({ action: 'ANIMATE_OUT' });
  };

  const render = () =>
    container(
      playlist_container(playlist),
      title_container(header(name.toUpperCase()), spectralizer_container(spectralizer)),
    );

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
