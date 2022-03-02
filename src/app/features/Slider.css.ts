import { useCss } from '@lib/Css';

const [css] = useCss({
  container: [
    ['display', 'flex'],
    ['justifyContent', 'center'],
    ['alignItems', 'center'],
    ['height', '100vh'],
    ['width', '100vw'],
    ['position', 'relative'],
    ['overflow', 'hidden'],
  ],
  slider_container: [
    ['display', 'flex'],
    ['justifyContent', 'center'],
    ['alignItems', 'center'],
    ['width', '100vw'],
    ['height', '100vh'],
    ['position', 'absolute'],
  ],
});

export { css };
