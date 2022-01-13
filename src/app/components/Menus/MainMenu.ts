import { useDom } from 'src/app/lib/Dom';
import { useDocsScreen } from 'src/app/pages/DocsScreen';
import { useGuestbookScreen } from 'src/app/pages/GuestbookScreen';
import { useHomeScreen } from 'src/app/pages/HomeScreen';
import { useLearnScreen } from 'src/app/pages/LearnScreen';
import { useShowcaseScreen } from 'src/app/pages/ShowcaseScreen';
import { useCss } from '../../lib/Css';
import { useFont } from '../../lib/Fonts';
import { useHtml } from '../../lib/Html';
import { useLocalization } from '../../lib/Localization';
import { usePalette } from '../../lib/Palette';

const [l10n] = useLocalization();
const [palette] = usePalette();
const [font] = useFont();

const [css] = useCss({
  wrapper: [
    ['listStyle', 'none'],
    ['padding', 0],
    ['margin', 0],
  ],
  item: [
    ['display', 'block'],
    ['padding', '10px 25px'],
    ['margin', 0],
    ['color', palette('white', 0, 0.25)],
    ['cursor', 'pointer'],
    ['fontFamily', font('arial')],
    ['fontSize', '12px'],
    ['letterSpacing', '1.5px'],
    ['textAlign', 'center'],
    ['textTransform', 'uppercase'],
  ],
  bg_white: [['backgroundColor', palette('white')]],
  text_black: [['color', palette('black')]],
});

const [MainMenu] = useHtml('ul', ['class', css('wrapper')]);
const [setBody] = useDom('body');

const MenuItem = (text: string, onclick: (e: MouseEvent) => void) => {
  const [li] = useHtml('li');
  const [a] = useHtml('a', ['class', css('item', 'bg_white_on_hover', 'text_black_on_hover')], ['onclick', onclick]);
  return li(a(text));
};

export default MainMenu(
  MenuItem(l10n('mainMenuHome'), () => {
    const [home] = useHomeScreen();
    setBody(home);
  }),
  MenuItem(l10n('mainMenuDocs'), () => {
    const [docs] = useDocsScreen();
    setBody(docs);
  }),
  MenuItem(l10n('mainMenuLearn'), () => {
    const [learn] = useLearnScreen();
    setBody(learn);
  }),
  MenuItem(l10n('mainMenuShowcase'), () => {
    const [showcase] = useShowcaseScreen();
    setBody(showcase);
  }),
  MenuItem(l10n('mainMenuGuestbook'), () => {
    const [guestBook] = useGuestbookScreen();
    setBody(guestBook);
  }),
);
