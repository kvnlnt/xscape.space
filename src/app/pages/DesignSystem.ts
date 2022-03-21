import { CHAR } from '@core/data/Letters';
import { Color } from '@framework/colors';
import { CSS } from '@framework/css';
import { ClassList, Html } from '@framework/html';
import { CharacterList } from '../components/Spectralizer/Character';
import { Display } from '../components/Spectralizer/Display';

const css = CSS({
  container: [['backgroundColor', Color('black')]],
  jumbotron_container: [
    ['gridColumn', '1/-1'],
    ['display', 'flex'],
    ['alignItems', 'center'],
    ['justifyContent', 'center'],
  ],
  letter_container: [
    ['display', 'grid'],
    ['height', '100vh'],
    ['width', '100vw'],
    ['gridTemplateColumns', 'repeat(5, 1fr)'],
    ['gridTemplateRows', 'auto'],
    ['gridGap', '10px'],
    ['padding', '10px'],
    ['boxSizing', 'border-box'],
    ['color', Color('white')],
  ],
  letter: [
    ['display', 'flex'],
    ['border', `1px solid ${Color('white', 0, 0.1)}`],
    ['alignItems', 'center'],
    ['justifyContent', 'center'],
    ['padding', '10px'],
  ],
});

const html = Html({
  css: ClassList,
});

export const DesignSystem = () => {
  const { DisplayMachine, DisplayTemplate } = Display();
  const template = html('div', ['css', css('container')])(
    html('div', ['css', css('letter_container')])(
      html('div', ['css', css('jumbotron_container')])(DisplayTemplate),
      ...CharacterList.map((character) => html('div', ['css', css('letter')])(character)),
    ),
  );

  setTimeout(() => {
    DisplayMachine.pub('UPDATE', { bars: [...CHAR['A'], [0, 0, 0, 0, 0, 0], ...CHAR['B']] });
  }, 1000);

  return template;
};
