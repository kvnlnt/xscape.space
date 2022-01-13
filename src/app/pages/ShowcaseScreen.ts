import { useDashboard } from '../components/Grids/DashboardShell';
import { useCss } from '../lib/Css';
import { useFont } from '../lib/Fonts';
import { useHtml } from '../lib/Html';
import { useLocalization } from '../lib/Localization';
import { usePalette } from '../lib/Palette';

const [l10n] = useLocalization();
const [palette] = usePalette();
const [font] = useFont();
const [css] = useCss({
  container: [
    ['color', palette('white')],
    ['fontFamily', font('arial')],
    ['padding', '20px'],
    ['fontSize', '14px'],
  ],
});

export const useShowcaseScreen = () => {
  const [container] = useHtml('div', ['class', css('container')]);
  const [dashboard] = useDashboard({ title: l10n('screenShowcaseTitle'), content: container('Showcase') });
  return [dashboard];
};
