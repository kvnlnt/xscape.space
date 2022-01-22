import { Player } from '../components/Player';
import { Logo } from '../elements/Logo';
import { useCss } from '../lib/Css';
import { useFont } from '../lib/Fonts';
import { useHtml } from '../lib/Html';
import { useKeyFrames } from '../lib/KeyFrames';
import { useLocalization } from '../lib/Localization';
import { usePalette } from '../lib/Palette';
import { useProperty } from '../lib/Property';

const [l10n] = useLocalization();
const [palette] = usePalette();
const [font] = useFont();

const [kf] = useKeyFrames({
  fadeIn: [
    [0, 'opacity', 0],
    [100, 'opacity', 1],
  ],
});

const [css] = useCss({
  grid: [
    ['display', 'grid'],
    ['gridTemplateAreas', "'logoArea' 'artArea' 'playerArea'"],
    ['gridTemplateColumns', '1fr'],
    ['gridTemplateRows', 'min-content 1fr min-content'],
    ['width', '100vw'],
    ['height', '100vh'],
    ['justifyContent', 'center'],
  ],
  logoArea: [
    ['gridArea', 'logoArea'],
    ['textAlign', 'right'],
    ['display', 'flex'],
    ['alignItems', 'center'],
    ['justifyContent', 'center'],
  ],
  playerArea: [
    ['gridArea', 'playerArea'],
    ['display', 'flex'],
    ['alignItems', 'center'],
    ['justifyContent', 'center'],
  ],
  artArea: [['gridArea', 'artArea']],
});

type State = 'INIT' | 'MENU' | 'PLAYER';

export const useSpacePage = () => {
  const [state] = useProperty<State>('INIT');

  switch (state()) {
    case 'INIT':
    case 'MENU':
    case 'PLAYER':
      const [grid] = useHtml('div', ['class', css('grid')]);
      const [logoArea] = useHtml('div', ['class', css('logoArea')]);
      const [playerArea] = useHtml('div', ['class', css('playerArea')]);
      const [artArea] = useHtml('div', ['class', css('artArea')]);
      return [grid(artArea('art'), logoArea(Logo()), playerArea(Player()))];
  }
};
