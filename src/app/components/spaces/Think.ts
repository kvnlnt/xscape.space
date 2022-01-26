import { useCss } from 'src/app/lib/Css';
import { useFontFace } from 'src/app/lib/FontFace';
import { useHtml } from 'src/app/lib/Html';
import { useKeyFrames } from 'src/app/lib/KeyFrames';
import { useKeyPress } from 'src/app/lib/KeyPress';
import { usePalette } from 'src/app/lib/Palette';
import { useProperty } from 'src/app/lib/Property';

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
  ],
  container_active: [
    ['animation', kf('container_zoom_width_in', 'container_zoom_height_in')],
    ['animationFillMode', 'forwards'],
    ['animationDuration', '0.5s'],
  ],
  container_deactive: [
    ['animation', kf('container_zoom_width_out', 'container_zoom_height_out')],
    ['animationFillMode', 'forwards'],
    ['animationDuration', '0.5s'],
  ],
  enter_button: [
    ['fontFamily', 'anurati'],
    ['fontSize', '10px'],
    ['marginTop', '40px'],
    ['opacity', '0'],
    ['padding', '20px'],
    ['backgroundColor', palette('white', 0, 0.01)],
    ['color', palette('white')],
    ['border', `1px dashed ${palette('white', 0, 0.1)}`],
    ['cursor', 'pointer'],
    ['letterSpacing', '4px'],
  ],
  enter_button_transition_in: [
    ['animation', kf('fade_in')],
    ['animationFillMode', 'forwards'],
    ['animationDuration', '0.5s'],
  ],
  enter_button_transition_out: [
    ['animation', kf('fade_out')],
    ['animationFillMode', 'forwards'],
    ['animationDuration', '0.5s'],
  ],
  font_big: [['fontSize', '66px']],
  sub_title: [
    ['fontFamily', 'anurati'],
    ['fontSize', '10px'],
    ['letterSpacing', '40px'],
    ['paddingLeft', '40px'],
    ['marginTop', '40px'],
    ['opacity', '0'],
  ],
  sub_title_transition_in: [
    ['animation', kf('fade_in')],
    ['animationFillMode', 'forwards'],
    ['animationDuration', '0.5s'],
  ],
  sub_title_transition_out: [
    ['animation', kf('fade_out')],
    ['animationFillMode', 'forwards'],
    ['animationDuration', '0.5s'],
  ],
  title: [
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
  transition_bar: [
    ['position', 'fixed'],
    ['backgroundColor', palette('white')],
    ['top', '50vh'],
    ['height', '0vh'],
    ['width', '100vw'],
    ['transition', 'all 0.5s'],
  ],
  transition_bar_in: [
    ['top', '50vh'],
    ['height', '0vh'],
    ['transition', 'all 0.5s'],
  ],
  transition_bar_out: [
    ['top', '45vh'],
    ['height', '10vh'],
    ['transition', 'all 0.5s'],
  ],
});

type States = 'ACTIVE' | 'PASSIVE';
type ThinkEvents = 'SLIDE_IN' | 'SLIDE_OUT' | 'ACTIVATE' | 'DEACTIVATE' | 'ON_ACTIVATION';
type ThinkSpaceProps = {
  onActivation?: () => void;
  onDeactivation?: () => void;
};

export const useThinkSpace = ({
  onActivation,
  onDeactivation,
}: ThinkSpaceProps): [HTMLElement, (event: ThinkEvents) => void] => {
  // props
  const [keypress] = useKeyPress();
  const [state, setState] = useProperty<States>('PASSIVE');
  const [container, containerAttrs] = useHtml('div', ['class', css('container')]);
  const [title, titleAttrs] = useHtml('div', ['class', css('title', 'font_big_on_tablet')]);
  const [subtitle, subtitleAttrs] = useHtml('div', ['class', css('sub_title')]);
  const [transitionBar, transitionBarAttrs] = useHtml('div', ['class', css('transition_bar')]);
  const [enterButton, enterButtonAttrs] = useHtml(
    'button',
    ['class', css('enter_button')],
    ['onclick', () => machine('ACTIVATE')],
  );

  keypress('Escape', () => machine('DEACTIVATE'));

  // methods

  const activate = () => {
    containerAttrs(['class', css('container', 'container_active')]);
  };

  const deactivate = () => {
    containerAttrs(['class', css('container', 'container_deactive')]);
  };

  const slideInAnimation = () => {
    titleAttrs(['class', css('title', 'title_transition_in', 'font_big_on_tablet')]);
    subtitleAttrs(['class', css('sub_title', 'sub_title_transition_in')]);
    enterButtonAttrs(['class', css('enter_button', 'enter_button_transition_in')]);
  };

  const slideOutAnimation = () => {
    titleAttrs(['class', css('title', 'font_big_on_tablet', 'title_transition_out')]);
    subtitleAttrs(['class', css('sub_title', 'sub_title_transition_out')]);
    enterButtonAttrs(['class', css('enter_button', 'enter_button_transition_out')]);
  };

  // state machine
  const machine = (event: ThinkEvents) => {
    console.log(event, state());
    switch (state()) {
      case 'PASSIVE':
        switch (event) {
          case 'SLIDE_IN':
            slideInAnimation();
            break;
          case 'SLIDE_OUT':
            slideOutAnimation();
            break;
          case 'ACTIVATE':
            activate();
            if (onActivation) onActivation();
            setState('ACTIVE');
            break;
        }
        break;
      case 'ACTIVE':
        switch (event) {
          case 'DEACTIVATE':
            deactivate();
            if (onDeactivation) onDeactivation();
            setState('PASSIVE');
            break;
        }
        break;
    }
  };

  return [container(title('THINK'), subtitle('SPACE'), enterButton('[ ESC ]'), transitionBar()), machine];
};
