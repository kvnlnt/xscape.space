import { useCss } from '@lib/Css';
import { useFont } from '@lib/Font';
import { usePalette } from '@lib/Palette';

const [palette] = usePalette();
const font = useFont();

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

export { css };
