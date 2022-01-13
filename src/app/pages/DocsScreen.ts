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
  docs: [
    ['color', palette('white')],
    ['fontFamily', font('arial')],
    ['padding', '20px'],
    ['fontSize', '14px'],
  ],
});

export const useDocsScreen = () => {
  const [docs] = useHtml('div', ['class', css('docs')]);
  const [dashboard] = useDashboard({ title: l10n('screenDocsTitle'), content: docs('Docs') });
  return [dashboard];
};
