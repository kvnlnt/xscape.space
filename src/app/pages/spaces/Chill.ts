import { useCss } from 'src/app/lib/Css';
import { useFontFace } from 'src/app/lib/FontFace';
import { useHtml } from 'src/app/lib/Html';
import { usePalette } from 'src/app/lib/Palette';

const [palette] = usePalette();
const anurati = useFontFace('anurati', `url('assets/Anurati-Regular.otf')`);

const [css] = useCss({
  container: [
    ['backgroundColor', palette('brown')],
    ['color', palette('white')],
    ['display', 'flex'],
    ['justifyContent', 'center'],
    ['alignItems', 'center'],
    ['fontFamily', 'anurati'],
    ['fontSize', '60px'],
    ['letterSpacing', '40px'],
    ['paddingLeft', '40px'],
    ['width', '100%'],
    ['height', '100%'],
  ],
});

export const useChillSpace = () => {
  const [container] = useHtml('div', ['class', css('container')]);
  return [container('CHILL')];
};
