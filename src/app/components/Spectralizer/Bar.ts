import { Color } from '@framework/colors';
import { CSS } from '@framework/css';
import { ClassList, Html, Style } from '@framework/html';

const css = CSS({
  bar_wrapper: [
    ['display', 'flex'],
    ['flexDirection', 'row'],
    ['alignItems', 'center'],
    ['justifyContent', 'center'],
    ['height', '100%'],
    ['cursor', 'pointer'],
  ],
  bar_bg: [
    ['backgroundColor', Color('white', 0, 0.01)],
    ['marginLeft', '5px'],
    ['borderRadius', '14px'],
    ['display', 'flex'],
    ['flexDirection', 'column'],
    ['alignItems', 'center'],
    ['justifyContent', 'center'],
    ['height', '100%'],
    ['width', '9px'],
    ['position', 'relative'],
  ],
  bar: [
    ['backgroundColor', Color('purple')],
    ['borderRadius', '3px'],
    ['width', '100%'],
    ['transition', 'all 0.50s'],
    ['height', '0%'],
    ['position', 'absolute'],
  ],
});

const html = Html({
  css: ClassList,
  style: Style,
});

type BarHeight = number;
type BarOffset = number;
export type BarProps = [BarHeight, BarOffset, BarHeight, BarOffset, BarHeight, BarOffset];

export const Bar = (bar: BarProps) => {
  const [h1, o1, h2, o2, h3, o3] = bar;
  const t = html('div', ['css', css('bar_wrapper')])(
    html('div', ['css', css('bar_bg')])(
      html('div', ['css', css('bar')], ['style', `height:${h1}%;top:${o1}%`])(),
      html('div', ['css', css('bar')], ['style', `height:${h2}%;top:${o2}%`])(),
      html('div', ['css', css('bar')], ['style', `height:${h3}%;top:${o3}%`])(),
    ),
  );
  return t;
};
