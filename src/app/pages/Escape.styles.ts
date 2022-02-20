import { useCss } from '@lib/Css';
import { usePalette } from '@lib/Palette';

const [palette] = usePalette();

const [css] = useCss({
  body: [
    ['backgroundColor', palette('black')],
    ['overflow', 'hidden'],
  ],

  container: [
    ['width', '100vw'],
    ['height', '100vh'],
  ],
});

export { css };
