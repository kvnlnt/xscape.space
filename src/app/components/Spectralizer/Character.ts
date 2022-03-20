import { CHAR } from '@core/data/Letters';
import { CSS } from '@framework/css';
import { ClassList, Html, Style } from '@framework/html';
import { Bar } from './Bar';

const css = CSS({
  wrapper: [
    ['display', 'flex'],
    ['flexDirection', 'row'],
    ['alignItems', 'center'],
    ['justifyContent', 'center'],
    ['height', '100%'],
    ['cursor', 'pointer'],
  ],
});

const html = Html({
  css: ClassList,
  style: Style,
});

export const Character = (char: keyof typeof CHAR) => {
  const t = html('div', ['css', css('wrapper')])(Bar(CHAR[char][0]), Bar(CHAR[char][1]), Bar(CHAR[char][2]));
  return t;
};

export const CharacterList = Object.entries(CHAR).map(([k]) => Character(k));
