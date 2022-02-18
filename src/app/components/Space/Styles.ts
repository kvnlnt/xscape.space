import { useCss } from '@lib/Css';
import { useFontFace } from '@lib/FontFace';
import { useKeyFrames } from '@lib/KeyFrames';
import { usePalette } from '@lib/Palette';

const [palette] = usePalette();
useFontFace('anurati', `url('assets/Anurati-Regular.otf')`);

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
    ['border', `1px solid ${palette('white', 0, 0.1)}`],
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
  current_title: [
    ['position', 'fixed'],
    ['bottom', '10vh'],
    ['left', '10vw'],
  ],
  play_button: [
    ['fontFamily', 'anurati'],
    ['fontSize', '5vh'],
    ['marginTop', '40px'],
    ['opacity', '0'],
    ['padding', '20px 20px 20px 24px  '],
    ['backgroundColor', palette('transparent')],
    ['color', palette('white', 0, 0.5)],
    ['border', `0`],
    ['cursor', 'pointer'],
    ['transition', 'all 0.5s'],
  ],
  play_button_active: [
    ['fontFamily', 'anurati'],
    ['fontSize', '3vh'],
    ['marginTop', '0px'],
    ['opacity', '100'],
    ['padding', '20px 20px 20px 24px  '],
    ['backgroundColor', palette('transparent')],
    ['color', palette('white', 0, 0.5)],
    ['border', `0`],
    ['cursor', 'pointer'],
    ['transition', 'all 0.5s'],
  ],
  play_button_transition_in: [
    ['animation', kf('fade_in')],
    ['animationFillMode', 'forwards'],
    ['animationDuration', '0.5s'],
  ],
  play_button_transition_out: [
    ['animation', kf('fade_out')],
    ['animationFillMode', 'forwards'],
    ['animationDuration', '0.5s'],
  ],
  playlist_container: [
    ['opacity', '0'],
    ['transition', 'all 0.5s'],
    ['position', 'absolute'],
    ['left', '5vh'],
    ['bottom', '50vh'],
    ['width', '100vw'],
    ['height', '20vh'],
  ],
  playlist_container_active: [
    ['opacity', '100'],
    ['transition', 'all 0.5s'],
    ['position', 'absolute'],
    ['left', '0vh'],
    ['top', '0vh'],
    ['width', '90vw'],
    ['height', 'calc(90vh - 10vw)'],
    ['boxSizing', 'border-box'],
    ['margin', '5vw'],
  ],
  font_big: [['fontSize', '66px']],
  spectralizer_container: [
    ['height', '100px'],
    ['animation', kf('fade_in')],
    ['animationFillMode', 'forwards'],
    ['animationDuration', '0.5s'],
    ['animationDelay', '0.5s'],
    ['animationTimingFunction', 'ease-in'],
    ['opacity', 0],
  ],
  title_active: [
    ['fontFamily', 'anurati'],
    ['fontSize', '24px'],
    ['letterSpacing', '40px'],
    ['paddingLeft', '40px'],
    ['opacity', '0'],
    ['transition', 'all 0.5s'],
    ['marginBottom', '50px'],
  ],
  title_active_play_mode: [
    ['fontFamily', 'anurati'],
    ['fontSize', '0px'],
    ['letterSpacing', '10px'],
    ['paddingLeft', '0px'],
    ['opacity', '0.1'],
    ['transition', 'all 0.5s'],
    ['marginBottom', '0px'],
  ],
  title_inactive: [
    ['fontFamily', 'anurati'],
    ['fontSize', '24px'],
    ['letterSpacing', '40px'],
    ['paddingLeft', '40px'],
    ['opacity', '0'],
    ['transition', 'all 0.5s'],
  ],
  title_transition_in: [
    ['animation', kf('fade_in')],
    ['animationFillMode', 'forwards'],
    ['animationDuration', '0.5s'],
  ],
  title_transition_out: [
    ['animation', kf('fade_out')],
    ['animationFillMode', 'forwards'],
    ['animationDuration', '0.5s'],
  ],
  title_container: [
    ['position', 'absolute'],
    ['width', '60vw'],
    ['height', '60vh'],
    ['left', '15vw'],
    ['bottom', '15vh'],
    ['display', 'flex'],
    ['justifyContent', 'center'],
    ['alignItems', 'center'],
    ['flexDirection', 'column'],
    ['transition', 'all 0.5s'],
  ],
  title_container_play_mode: [
    ['position', 'absolute'],
    ['width', '90vw'],
    ['height', '125px'],
    ['left', '5vw'],
    ['bottom', '5vh'],
    ['display', 'flex'],
    ['justifyContent', 'space-between'],
    ['alignItems', 'center'],
    ['flexDirection', 'column'],
    ['transition', 'all 0.5s'],
    ['paddingTop', '0px'],
  ],
  width_30: [['width', '30vw']],
});

export { css };
