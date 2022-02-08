import { Song, Space } from '@domain/types';
import { useCss } from '@lib/Css';
import { useFont } from '@lib/Fonts';
import { html, useHtml } from '@lib/Html';
import { useKeyPress } from '@lib/KeyPress';
import { usePalette } from '@lib/Palette';
import { useProperty } from '@lib/Property';

const [palette] = usePalette();
const [font] = useFont();

const [css] = useCss({
  playlist: [['display', 'none']],
  playlist_active: [
    ['display', 'flex'],
    ['flexDirection', 'column'],
  ],
  item: [
    ['color', palette('white')],
    ['padding', '5px'],
    ['fontFamily', font('monospace')],
    ['cursor', 'pointer'],
    ['display', 'flex'],
    ['alignItems', 'center'],
    ['backgroundSize', 'cover'],
    ['backgroundRepeat', 'no-repeat'],
    ['backgroundPositionX', '-100vw'],
    ['backgroundImage', `linear-gradient(to right, ${palette('white')} 100%, ${palette('transparent')} 0%)`],
    ['transition', 'all 0.25s'],
  ],
  item_active: [
    ['backgroundImage', `linear-gradient(to right, ${palette('white')} 100%, ${palette('transparent')} 0%)`],
    ['backgroundPositionX', '0vw'],
    ['transition', 'all 0.25s'],
    ['color', palette('black')],
  ],
  item_song: [
    ['fontFamily', font('monospace')],
    ['padding', '5px'],
    ['transition', 'all 0.5s'],
  ],
  item_artist: [
    ['color', palette('black', 50, 1)],
    ['fontFamily', font('monospace')],
    ['fontSize', '10px'],
    ['marginLeft', '5px'],
    ['transition', 'all 0.5s'],
  ],
});

type PlayListProps = { space: Space };
type PlayListState = 'INIT' | 'PLAYING';
type PlayListActions =
  | { action: 'PLAY_NEXT' }
  | { action: 'PLAY'; index: number }
  | { action: 'PLAY_PREV' }
  | { action: 'START' }
  | { action: 'QUIT' };

export const usePlaylist = ({ space }: PlayListProps) => {
  // props
  const [keypress] = useKeyPress();
  const [playState, setPlayState] = useProperty<PlayListState>('INIT');
  const [songIndex, setSongIndex] = useProperty<number>(0);

  //elements
  const [playlist, playlistAttrs] = useHtml('div', ['class', css('playlist')]);

  const render = () => {
    return playlist(
      ...space.songs.map((song: Song, i: number) => {
        return html(
          'div',
          ['class', css('item', i === songIndex() ? 'item_active' : 'item_active_on_hover')],
          ['onclick', () => machine({ action: 'PLAY', index: i })],
        )(
          html('div', ['class', css('item_song')])(song.songName),
          html('a', ['class', css('item_artist')], ['href', song.artistLink], ['target', '_blank'])('@' + song.artist),
        );
      }),
    );
  };

  // actions
  const actions = {
    init() {
      playlistAttrs(['class', css('playlist_active')]);
    },
    play(index: number) {
      setSongIndex(index);
      render();
    },
    playNext() {
      setSongIndex(songIndex() === space.songs.length - 1 ? 0 : songIndex() + 1);
      render();
    },
    playPrev() {
      setSongIndex(songIndex() === 0 ? space.songs.length - 1 : songIndex() - 1);
      render();
    },
    quit() {
      playlistAttrs(['class', css('playlist')]);
    },
  };

  keypress('ArrowUp', () => machine({ action: 'PLAY_PREV' }));
  keypress('ArrowDown', () => machine({ action: 'PLAY_NEXT' }));

  // playState
  const machine = (reducer: PlayListActions) => {
    switch (playState()) {
      case 'INIT':
        actions.init();
        setPlayState('PLAYING');
        break;
      case 'PLAYING':
        switch (reducer.action) {
          case 'PLAY':
            actions.play(reducer.index);
            break;
          case 'PLAY_NEXT':
            actions.playNext();
            break;
          case 'PLAY_PREV':
            actions.playPrev();
            break;
          case 'QUIT':
            actions.quit();
            setPlayState('INIT');
            break;
        }
        break;
    }
  };

  // component
  const component: [HTMLElement, (reducer: PlayListActions) => void] = [render(), machine];
  return component;
};
