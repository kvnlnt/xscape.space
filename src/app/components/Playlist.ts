import { Space } from '@domain/types';
import { useCss } from '@lib/Css';
import { useHtml } from '@lib/Html';
import { useProperty } from '@lib/Property';

const [css] = useCss({
  container: [],
});

type PlayListProps = {
  space: Space;
};

type PlayListEvent = 'NAV_NEXT' | 'NAV_PREV' | 'PLAY';

type PlayListState = 'INIT';

export const usePlaylist = ({ space }: PlayListProps) => {
  // props
  const [state, setState] = useProperty<PlayListState>('INIT');

  // computed props

  //elements
  const [container, containerAttrs] = useHtml('div', ['class', css('container')]);

  // actions
  const actions: Record<string, () => PlayListState> = {};

  // state
  const machine = (event: PlayListEvent = null) => {
    switch (state()) {
      case 'INIT':
    }
  };

  // component
  const playlist = [container(), machine];

  // init
  machine();

  return playlist;
};
