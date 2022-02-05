import { Space } from '@domain/types';
import { useCss } from '@lib/Css';
import { useFontFace } from '@lib/FontFace';
import { useHtml } from '@lib/Html';
import { useKeyFrames } from '@lib/KeyFrames';
import { usePalette } from '@lib/Palette';
import { useProperty } from '@lib/Property';
import { usePlaylist } from './Playlist';

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
    ['border', '1px solid white'],
    ['margin', '5vw'],
  ],
  font_big: [['fontSize', '66px']],
  sub_title: [
    ['fontFamily', 'anurati'],
    ['fontSize', '10px'],
    ['letterSpacing', '40px'],
    ['paddingLeft', '40px'],
    ['marginTop', '40px'],
    ['opacity', '0'],
    ['transition', 'all 0.5s'],
  ],
  sub_title_active: [
    ['fontFamily', 'anurati'],
    ['fontSize', '10px'],
    ['letterSpacing', '4px'],
    ['paddingLeft', '40px'],
    ['marginTop', '0px'],
    ['opacity', '0'],
    ['transition', 'all 0.5s'],
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
  title_active: [
    ['fontFamily', 'anurati'],
    ['fontSize', '24px'],
    ['letterSpacing', '40px'],
    ['paddingLeft', '40px'],
    ['opacity', '0'],
    ['transition', 'all 0.5s'],
  ],
  title_active_play_mode: [
    ['fontFamily', 'anurati'],
    ['fontSize', '24px'],
    ['letterSpacing', '10px'],
    ['paddingLeft', '24px'],
    ['opacity', '100'],
    ['transition', 'all 0.5s'],
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
    ['borderTop', `1px solid ${palette('white', 0, 0)}`],
  ],
  title_container_play_mode: [
    ['position', 'absolute'],
    ['width', '90vw'],
    ['height', '10vh'],
    ['left', '5vw'],
    ['bottom', '0vh'],
    ['display', 'flex'],
    ['justifyContent', 'space-between'],
    ['alignItems', 'center'],
    ['borderTop', `1px solid ${palette('white', 0, 0.1)}`],
    ['flexDirection', 'row'],
    ['transition', 'all 0.5s'],
    ['paddingTop', '0px'],
  ],
  width_30: [['width', '30vw']],
});

type SpaceStates = 'ACTIVE' | 'PASSIVE';
type SpaceEvents = 'SLIDE_IN' | 'SLIDE_OUT' | 'ACTIVATE' | 'DEACTIVATE' | 'ON_ACTIVATION';

export const useSpace = (space: Space): [HTMLElement, (event: SpaceEvents) => void] => {
  // props
  const { name: title } = space;
  const [state, setState] = useProperty<SpaceStates>('PASSIVE');
  const [container, containerAttrs] = useHtml('div', ['class', css('container')]);
  const [title_container, titleContainerAttrs] = useHtml('div', ['class', css('title_container')]);
  const [header, headerAttrs] = useHtml('div', ['class', css('title_active', 'font_big_on_tablet')]);
  const [playlist_container, playlistContainerAttrs] = useHtml('div', [
    'class',
    css('playlist_container', 'width_30_on_tablet'),
  ]);
  const [playlist, playlistMachine] = usePlaylist({ space });
  const [subHeader, subHeaderAttrs] = useHtml('div', ['class', css('sub_title')]);
  const [playButton, playButtonAttrs] = useHtml(
    'button',
    ['class', css('play_button')],
    ['onclick', () => machine('ACTIVATE')],
  );

  const action = {
    activate: () => {
      containerAttrs(['class', css('container', 'container_active')]);
      titleContainerAttrs(['class', css('title_container_play_mode')]);
      headerAttrs(['class', css('title_active_play_mode')]);
      subHeaderAttrs(['class', css('sub_title_active', 'sub_title_transition_out')]);
      playButtonAttrs(['class', css('play_button_active')]);
      playButton('▢');
      playlistMachine('LOAD');
      playlistContainerAttrs(['class', css('playlist_container_active', 'width_30_on_tablet')]);
    },
    deactivate: () => {
      containerAttrs(['class', css('container', 'container_deactive')]);
      titleContainerAttrs(['class', css('title_container')]);
      headerAttrs(['class', css('title_active', 'title_transition_in', 'font_big_on_tablet')]);
      subHeaderAttrs(['class', css('sub_title', 'sub_title_transition_in')]);
      playButtonAttrs(['class', css('play_button', 'play_button_transition_in')]);
      playButton('▷');
      playlistMachine('UNLOAD');
      playlistContainerAttrs(['class', css('playlist_container')]);
    },
    slideIn: () => {
      headerAttrs(['class', css('title_active', 'title_transition_in', 'font_big_on_tablet')]);
      subHeaderAttrs(['class', css('sub_title', 'sub_title_transition_in')]);
      playButtonAttrs(['class', css('play_button', 'play_button_transition_in')]);
    },
    slideOut: () => {
      headerAttrs(['class', css('title_active', 'font_big_on_tablet', 'title_transition_out')]);
      subHeaderAttrs(['class', css('sub_title', 'sub_title_transition_out')]);
      playButtonAttrs(['class', css('play_button', 'play_button_transition_out')]);
    },
  };

  // state machine
  const machine = (event: SpaceEvents) => {
    switch (state()) {
      case 'PASSIVE':
        switch (event) {
          case 'SLIDE_IN':
            action.slideIn();
            setState('PASSIVE');
            break;
          case 'SLIDE_OUT':
            action.slideOut();
            setState('PASSIVE');
            break;
          case 'ACTIVATE':
            action.activate();
            setState('ACTIVE');
            break;
        }
        break;
      case 'ACTIVE':
        switch (event) {
          case 'DEACTIVATE':
            action.deactivate();
            setState('PASSIVE');
            break;
        }
        break;
    }
  };

  return [
    container(
      playlist_container(playlist),
      title_container(header(title.toUpperCase()), subHeader('SPACE'), playButton('▷')),
    ),
    machine,
  ];
};
