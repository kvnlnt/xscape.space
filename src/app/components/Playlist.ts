import { Song, Space } from '@domain/types';
import { useCss } from '@lib/Css';
import { useFont } from '@lib/Fonts';
import { useHtml } from '@lib/Html';
import { useKeyPress } from '@lib/KeyPress';
import { usePalette } from '@lib/Palette';
import { useProperty } from '@lib/Property';

const [keypress] = useKeyPress();
const [palette] = usePalette();
const [font] = useFont();

const [css] = useCss({
  container: [['display', 'none']],
  container_active: [
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
  ],
  item_song: [
    ['color', palette('white')],
    ['fontFamily', font('monospace')],
    ['padding', '5px'],
    ['transition', 'all 0.5s'],
  ],
  item_song_active: [
    ['color', palette('black')],
    ['fontFamily', font('monospace')],
    ['padding', '5px'],
    ['transition', 'all 0.5s'],
  ],
  item_artist: [
    ['color', palette('white', 0, 0.2)],
    ['fontFamily', font('monospace')],
    ['fontSize', '10px'],
    ['marginLeft', '5px'],
    ['transition', 'all 0.5s'],
  ],
  item_artist_active: [
    ['color', palette('black')],
    ['fontFamily', font('monospace')],
    ['fontSize', '10px'],
    ['marginLeft', '5px'],
    ['transition', 'all 0.5s'],
  ],
});

type PlayListProps = {
  space: Space;
};

type PlayListEvent = 'NAV_NEXT' | 'NAV_PREV' | 'PLAY' | 'LOAD' | 'UNLOAD';

type PlayListState = 'IDLE' | 'PLAYING';

export const usePlaylist = ({ space }: PlayListProps) => {
  // props
  const [playState, setPlayState] = useProperty<PlayListState>('IDLE');
  const [songIndex, setSongIndex] = useProperty<number>(0);

  // computed props

  //elements
  const [container, containerAttrs] = useHtml('div', ['class', css('container')]);
  const createItem = (song: Song, i: number) => {
    const [item_song, itemSongAttr] = useHtml('div', [
      'class',
      css('item_song', i === songIndex() ? 'item_song_active' : null),
    ]);
    const [item_artist, itemArtistAttr] = useHtml(
      'a',
      ['class', css('item_artist', i === songIndex() ? 'item_artist_active' : null)],
      ['href', song.artistLink],
      ['target', '_blank'],
    );
    const [item] = useHtml(
      'div',
      ['class', css('item', i === songIndex() ? 'item_active' : 'item_active_on_hover')],
      [
        'onmouseover',
        () => {
          if (i === songIndex()) return;
          itemArtistAttr(['class', css('item_artist_active')]);
          itemSongAttr(['class', css('item_song_active')]);
        },
      ],
      [
        'onmouseout',
        () => {
          if (i === songIndex()) return;
          itemArtistAttr(['class', css('item_artist')]);
          itemSongAttr(['class', css('item_song')]);
        },
      ],
    );
    return item(item_song(song.songName), item_artist('@' + song.artist));
  };

  // actions
  const actions = {
    async load() {
      containerAttrs(['class', css('container_active')]);
    },
    async navNext() {
      console.log('next');
      console.log(playState());
    },
    async navPrev() {
      console.log('prev');
      console.log(playState());
    },
    async unload() {
      containerAttrs(['class', css('container')]);
    },
  };

  keypress('ArrowUp', () => machine('NAV_PREV'));
  keypress('ArrowDown', () => machine('NAV_NEXT'));

  // playState
  const machine = async (event: PlayListEvent = null) => {
    console.log(event, playState());

    switch (playState()) {
      case 'IDLE':
        switch (event) {
          case 'LOAD':
            await actions.load();
            setPlayState('PLAYING');
            break;
        }
        break;
      case 'PLAYING':
        switch (event) {
          case 'NAV_NEXT':
            await actions.navNext();
            break;
          case 'NAV_PREV':
            await actions.navPrev();
            break;
          case 'UNLOAD':
            await actions.unload();
            setPlayState('IDLE');
            break;
        }
        break;
    }
  };

  // component
  const playlist: [HTMLElement, (event: PlayListEvent) => void] = [container(...space.songs.map(createItem)), machine];

  return playlist;
};
