import { useCss } from '@lib/Css';
import { useFont } from '@lib/Font';
import { useKeyFrames } from '@lib/KeyFrames';
import { usePalette } from '@lib/Palette';

const [palette] = usePalette();
const font = useFont();

const [kf] = useKeyFrames({
  container_zoom_width_in: [
    [0, 'width', '90vw'],
    [100, 'width', '100vw'],
  ],
  container_zoom_width_out: [
    [0, 'width', '100vw'],
    [100, 'width', '90vw'],
  ],
  container_zoom_height_in: [
    [0, 'height', '90vh'],
    [100, 'height', '100vh'],
  ],
  container_zoom_height_out: [
    [0, 'height', '100vh'],
    [100, 'height', '90vh'],
  ],
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
    ['backgroundColor', palette('white', 0, 0.05)],
    ['color', palette('white')],
    ['display', 'flex'],
    ['justifyContent', 'center'],
    ['alignItems', 'center'],
    ['width', '90vw'],
    ['height', '90vh'],
    ['borderRadius', '2vh'],
    ['flexDirection', 'column'],
    ['position', 'relative'],
  ],
  container_active: [
    ['animation', kf('container_zoom_width_in', 'container_zoom_height_in')],
    ['animationFillMode', 'forwards'],
    ['animationDuration', '0.5s'],
    ['justifyContent', 'flex-start'],
  ],
  container_deactive: [
    ['animation', kf('container_zoom_width_out', 'container_zoom_height_out')],
    ['animationFillMode', 'forwards'],
    ['animationDuration', '0.5s'],
  ],
  spectralizer_container: [
    ['height', '100px'],
    ['animation', kf('fade_in')],
    ['animationFillMode', 'forwards'],
    ['animationDuration', '0.5s'],
    ['animationDelay', '0.5s'],
    ['animationTimingFunction', 'ease-in'],
    ['opacity', 0],
  ],
});

export { css };
