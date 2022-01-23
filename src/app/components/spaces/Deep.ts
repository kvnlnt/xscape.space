import { useCss } from 'src/app/lib/Css';
import { useFontFace } from 'src/app/lib/FontFace';
import { useHtml } from 'src/app/lib/Html';
import { useKeyFrames } from 'src/app/lib/KeyFrames';
import { usePalette } from 'src/app/lib/Palette';

const [palette] = usePalette();
useFontFace('anurati', `url('assets/Anurati-Regular.otf')`);

const [kf] = useKeyFrames({
  fade_in: [
    [0, 'opacity', 0],
    [100, 'opacity', 1],
  ],
  fade_out: [
    [0, 'opacity', 1],
    [100, 'opacity', 0],
  ],
});

const [css] = useCss({
  container: [
    ['backgroundColor', palette('green', 0, 0.1)],
    ['color', palette('white')],
    ['display', 'flex'],
    ['justifyContent', 'center'],
    ['alignItems', 'center'],
    ['width', '100%'],
    ['height', '100%'],
    ['flexDirection', 'column'],
  ],
  title: [
    ['fontFamily', 'anurati'],
    ['fontSize', '36px'],
    ['letterSpacing', '40px'],
    ['paddingLeft', '40px'],
    ['opacity', '0'],
  ],
  sub_title: [
    ['fontFamily', 'anurati'],
    ['fontSize', '10px'],
    ['letterSpacing', '40px'],
    ['paddingLeft', '40px'],
    ['marginTop', '40px'],
    ['opacity', '0'],
  ],
  fade_in: [
    ['animation', kf('fade_in')],
    ['animationFillMode', 'forwards'],
    ['animationDuration', '0.5s'],
  ],
  fade_out: [
    ['animation', kf('fade_out')],
    ['animationFillMode', 'forwards'],
    ['animationDuration', '0.5s'],
  ],
});

export const useDeepSpace = (): [HTMLElement, () => void, () => void] => {
  const [container] = useHtml('div', ['class', css('container')]);
  const [title, titleAttrs] = useHtml('div', ['class', css('title')]);
  const [subtitle, subtitleAttrs] = useHtml('div', ['class', css('sub_title')]);
  const animateIn = () => {
    titleAttrs(['class', css('title', 'fade_in')]);
    subtitleAttrs(['class', css('sub_title', 'fade_in')]);
  };
  const animateOut = () => {
    titleAttrs(['class', css('title', 'fade_out')]);
    subtitleAttrs(['class', css('sub_title', 'fade_out')]);
  };
  return [container(title('DEEP'), subtitle('SPACE')), animateIn, animateOut];
};