import { useCss } from '../../lib/Css';
import { useFont } from '../../lib/Fonts';
import { useHtml } from '../../lib/Html';
import { usePalette } from '../../lib/Palette';
import { useTheme } from '../../lib/Theme';
import { useLocalStorage } from '../../lib/WebStorage';
import Logo from '../Branding/Logo';
import MainMenu from '../Menus/MainMenu';

const [theme] = useTheme();
const [palette] = usePalette();
const [font] = useFont();
const [css] = useCss({
  grid: [
    ['display', 'grid'],
    ['height', '100vh'],
    ['gridTemplateAreas', '"menu context user" "menu content content"'],
    ['gridTemplateRows', 'min-content 1fr'],
    ['gridTemplateColumns', 'min-content 1fr'],
    ['backgroundColor', palette('black'), theme('dark')],
    ['backgroundColor', palette('white'), theme('lite')],
  ],
  menuArea: [
    ['gridArea', 'menu'],
    ['display', 'flex'],
    ['flexDirection', 'column'],
    ['backgroundColor', palette('black', 3)],
    ['position', 'relative'],
    ['minWidth', '35px'],
  ],
  contentArea: [
    ['gridArea', 'content'],
    ['maxWidth', '100vw'],
    ['display', 'flex'],
    ['backgroundColor', palette('black', 2)],
  ],
  contextArea: [
    ['gridArea', 'context'],
    ['maxWidth', '100vw'],
    ['display', 'flex'],
    ['backgroundColor', palette('black', 2)],
    ['padding', '20px'],
    ['borderBottomWidth', '1px'],
    ['borderBottomStyle', 'solid'],
    ['borderBottomColor', palette('white', 0, 0.05)],
  ],
  userArea: [
    ['gridArea', 'user'],
    ['display', 'flex'],
    ['justifyContent', 'flex-end'],
    ['alignItems', 'center'],
    ['backgroundColor', palette('black', 2)],
    ['borderBottomWidth', '1px'],
    ['borderBottomStyle', 'solid'],
    ['borderBottomColor', palette('white', 0, 0.05)],
  ],
  hamburger: [
    ['color', palette('white', 0, 0.15)],
    ['position', 'absolute'],
    ['top', '10px'],
    ['right', '10px'],
    ['cursor', 'pointer'],
    ['transition', 'all 1s'],
  ],
  title: [
    ['fontFamily', font('arial')],
    ['fontSize', '12px'],
    ['fontWeight', 'normal'],
    ['textTransform', 'uppercase'],
    ['color', palette('white', 0, 0.5)],
  ],
  toggleButton: [['marginLeft', '10px']],
  hidden: [['display', 'none']],
  white_transition: [
    ['color', palette('white')],
    ['transition', 'all 1s'],
  ],
  opacity_transition: [
    ['opacity', 1],
    ['transition', 'all 1s'],
  ],
});

interface DashboardProps {
  title: string;
  content: HTMLElement;
}

export const useDashboard = (props: DashboardProps) => {
  // state
  const [collapsed, setCollapsed] = useLocalStorage('MENU', true, () => updateHtml(render()));
  const toggle = () => setCollapsed(!collapsed());

  // html
  const [html, updateHtml] = useHtml('div');
  const [Grid] = useHtml('div', ['class', css('grid')]);
  const [UserArea] = useHtml('div', ['class', css('userArea')]);
  const [MenuArea] = useHtml('div', ['class', css('menuArea')]);
  const [ContentArea] = useHtml('div', ['class', css('contentArea')]);
  const [ContextArea] = useHtml('div', ['class', css('contextArea')]);
  const [Title] = useHtml('h1', ['class', css('title')]);
  const [Hamburger] = useHtml('div', ['class', css('hamburger', 'white_transition_on_hover')], ['onclick', toggle]);

  // render
  const render = (): HTMLElement =>
    Grid(
      MenuArea(Hamburger('☰'), collapsed() ? null : Logo, collapsed() ? null : MainMenu),
      ContextArea(Title(props.title)),
      UserArea(),
      ContentArea(props.content),
    );

  return [html(render())];
};
