import { useCss } from '../lib/Css';
import { useHtml } from '../lib/Html';
import { usePalette } from '../lib/Palette';

const [palette] = usePalette();

const [css] = useCss({
  logo: [
    ['color', palette('purple', 0, 0.5)],
    ['fontFamily', 'monospace'],
    ['margin', '35px'],
    ['letterSpacing', '20px'],
    ['fontSize', '14px'],
    ['display', 'inline-block'],
  ],
});

export const Logo = () => {
  const [logo] = useHtml('div', ['class', css('logo')]);
  return logo('XSCAPE');
};
