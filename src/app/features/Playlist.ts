import { html, useHtml } from '@lib/Html';
import { useKeyPress } from '@lib/KeyPress';
import { Song, Space } from 'src/core/types';
import { css } from './Playlist.styles';

type PlayListProps = { space: Space; callback: (songNumber: number) => void };
type PlayListState = 'INIT' | 'PLAYING';
type PlayListMessages =
  | { action: 'PLAY_NEXT' }
  | { action: 'PLAY'; index: number }
  | { action: 'PLAY_PREV' }
  | { action: 'START' }
  | { action: 'QUIT' };

export const usePlaylist = ({ space, callback }: PlayListProps) => {
  // props
  const keypress = useKeyPress();
  let playState: PlayListState = 'INIT';
  let songIndex: number = 0;

  //elements
  const [playlist, playlistAttrs] = useHtml('div', ['class', css('playlist')]);

  // methods
  const render = () => {
    return playlist(
      ...space.songs.map((song: Song, i: number) => {
        return html(
          'div',
          ['class', css('item', i === songIndex ? 'item_active' : 'item_active_on_hover')],
          ['onclick', () => machine({ action: 'PLAY', index: i })],
        )(
          html('div', ['class', css('item_song')])(song.songName),
          html('a', ['class', css('item_artist')], ['href', song.artistLink], ['target', '_blank'])('@' + song.artist),
        );
      }),
    );
  };
  const init = () => {
    playlistAttrs(['class', css('playlist_active')]);
    callback(songIndex);
  };
  const play = (index: number) => {
    songIndex = index;
    callback(index);
    render();
  };
  const playNext = () => {
    const newIndex = songIndex === space.songs.length - 1 ? 0 : songIndex + 1;
    songIndex = newIndex;
    callback(newIndex);
    render();
  };
  const playPrev = () => {
    const newIndex = songIndex === 0 ? space.songs.length - 1 : songIndex - 1;
    songIndex = newIndex;
    callback(newIndex);
    render();
  };
  const quit = () => {
    playlistAttrs(['class', css('playlist')]);
  };

  keypress('ArrowUp', () => machine({ action: 'PLAY_PREV' }));
  keypress('ArrowDown', () => machine({ action: 'PLAY_NEXT' }));

  // playState
  const machine = (message: PlayListMessages) => {
    switch (playState) {
      case 'INIT':
        switch (message.action) {
          case 'START':
            init();
            playState = 'PLAYING';
            break;
          default:
            init();
            playState = 'PLAYING';
            break;
        }
      case 'PLAYING':
        switch (message.action) {
          case 'PLAY':
            play(message.index);
            break;
          case 'PLAY_NEXT':
            playNext();
            break;
          case 'PLAY_PREV':
            playPrev();
            break;
          case 'QUIT':
            quit();
            playState = 'INIT';
            break;
        }
        break;
    }
  };

  // component
  const component: [HTMLElement, (message: PlayListMessages) => void] = [render(), machine];
  return component;
};
