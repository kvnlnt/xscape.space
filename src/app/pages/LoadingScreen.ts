import { el } from '../lib/Html';
import { Palette } from '../lib/Palette';
import { styles } from '../lib/Theme';

export const LoadingScreen = (): HTMLDivElement =>
  el('div', [
    'style',
    styles(
      ['display', 'flex'],
      ['width', '100vw'],
      ['height', '100vh'],
      ['alignItems', 'center'],
      ['justifyContent', 'center'],
      ['fontSize', '30px'],
      ['backgroundColor', Palette.white_80],
    ),
  ])('TRANSITION');
