import { Song, Space } from '@domain/types';
import { useCss } from '@lib/Css';
import { useFont } from '@lib/Fonts';
import { useHtml } from '@lib/Html';
import { usePalette } from '@lib/Palette';
import { useProperty } from '@lib/Property';

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
  ],
  item_song: [
    ['color', palette('white')],
    ['fontFamily', font('monospace')],
    ['padding', '5px'],
  ],
  item_song_active: [
    ['backgroundColor', palette('white')],
    ['color', palette('black')],
    ['padding', '5px'],
  ],
  item_artist: [
    ['color', palette('white', 0, 0.2)],
    ['fontFamily', font('monospace')],
    ['fontSize', '10px'],
  ],
});

type PlayListProps = {
  space: Space;
};

type PlayListEvent = 'NAV_NEXT' | 'NAV_PREV' | 'PLAY' | 'LOAD' | 'UNLOAD';

type PlayListState = 'IDLE' | 'READY';

export const usePlaylist = ({ space }: PlayListProps) => {
  // props
  const [state, setState] = useProperty<PlayListState>('IDLE');

  // computed props

  //elements
  const [container, containerAttrs] = useHtml('div', ['class', css('container')]);
  const createItem = (song: Song) => {
    const [item] = useHtml('div', ['class', css('item')]);
    const [item_song] = useHtml('div', ['class', css('item_song')]);
    const [item_artist] = useHtml('div', ['class', css('item_artist')]);
    return item(item_song(song.songName), item_artist(song.artist));
  };

  // actions
  const actions = {
    load() {
      containerAttrs(['class', css('container_active')]);
    },
    unload() {
      containerAttrs(['class', css('container')]);
    },
  };

  // state
  const machine = (event: PlayListEvent = null) => {
    switch (state()) {
      case 'IDLE':
        switch (event) {
          case 'LOAD':
            actions.load();
            setState('READY');
            break;
          case 'UNLOAD':
            actions.unload();
            setState('IDLE');
            break;
        }
    }
  };

  // component
  const playlist: [HTMLElement, (event: PlayListEvent) => void] = [
    container(
      createItem(space.songs[0]),
      createItem(space.songs[0]),
      createItem(space.songs[0]),
      createItem(space.songs[0]),
      createItem(space.songs[0]),
      createItem(space.songs[0]),
      createItem(space.songs[0]),
      createItem(space.songs[0]),
      createItem(space.songs[0]),
      createItem(space.songs[0]),
      createItem(space.songs[0]),
      createItem(space.songs[0]),
      createItem(space.songs[0]),
      createItem(space.songs[0]),
      createItem(space.songs[0]),
    ),
    machine,
  ];

  return playlist;
};
