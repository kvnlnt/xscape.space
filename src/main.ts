import { useDom } from './app/lib/Dom';
import { useSplashScreen } from './app/pages/SplashScreen';

window.addEventListener('DOMContentLoaded', async () => {
  const [setBody] = useDom('body');
  const [splash] = useSplashScreen();
  setBody(splash);
});
