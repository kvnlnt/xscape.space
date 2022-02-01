import { useDom } from '@lib/Dom';
import { useEscapePage } from '@pages/Escape';

window.addEventListener('DOMContentLoaded', async () => {
  const resetStyle = `margin:0px;padding:0px;width:100vw;height:100vh;`;
  const [body] = useDom('body', ['style', resetStyle]);
  useEscapePage(body);
});
