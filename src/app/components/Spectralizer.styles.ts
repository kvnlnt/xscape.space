import { useCss } from '@lib/Css';
import { usePalette } from '@lib/Palette';

const [palette] = usePalette();

const [css] = useCss({
  spectralizer: [
    ['display', 'flex'],
    ['flexDirection', 'row'],
    ['alignItems', 'center'],
    ['justifyContent', 'center'],
    ['height', '100%'],
    ['cursor', 'pointer'],
  ],
  bar_bg: [
    ['backgroundColor', palette('white', 0, 0.02)],
    ['marginLeft', '5px'],
    ['borderRadius', '7px'],
    ['display', 'flex'],
    ['flexDirection', 'row'],
    ['alignItems', 'center'],
    ['justifyContent', 'center'],
    ['height', '100%'],
    ['width', '5px'],
  ],
  bar: [
    ['backgroundColor', palette('purple')],
    ['borderRadius', '7px'],
    ['width', '100%'],
    ['transition', 'all 0.10s'],
    ['height', '0%'],
  ],
});

export { css };
