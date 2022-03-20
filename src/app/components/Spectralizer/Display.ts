import { CSS } from '@framework/css';
import { ClassList, Html, Style } from '@framework/html';
import { Bar, BarProps } from './Bar';

const css = CSS({
  display_wrapper: [
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

type DisplayProps = {
  numOfBars: number;
  readings: BarProps[];
};

export const Display = ({ numOfBars, readings }: DisplayProps) => {
  const emptyBars = Array(numOfBars)
    .fill(0)
    .map(() => Bar([0, 0, 0, 0, 0, 0]));
  const t = html('div', ['css', css('display_wrapper')])(...emptyBars);
  return t;
};
