import { usePalette } from 'src/app/lib/Palette';
import { useCss } from '../../lib/Css';
import { useHtml } from '../../lib/Html';

const [palette] = usePalette();

const [css] = useCss({
  grid: [
    ['display', 'flex'],
    ['height', '100vh'],
    ['width', '100vw'],
    ['backgroundColor', palette('black')],
    ['backgroundSize', '10px 10px'],
  ],
});

export const useIsoShell = (content: HTMLElement) => {
  const [Grid] = useHtml('div', ['class', css('grid')]);
  return [Grid(content)];
};
