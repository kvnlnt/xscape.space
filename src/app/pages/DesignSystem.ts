import { Color } from '@framework/colors';
import { CSS } from '@framework/css';
import { ClassList, Html } from '@framework/html';
import { Bar } from '../components/Spectralizer/Bar';
import { Character, CharacterList } from '../components/Spectralizer/Character';

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
  const template = html('div', ['css', css('container')])(
    html('div', ['css', css('letter_container')])(
      html('div', ['css', css('jumbotron_container')])(
        Character('J'),
        Bar([20, 40, 0, 0, 0, 0]),
        Character('U'),
        Bar([20, 40, 0, 0, 0, 0]),
        Character('M'),
        Bar([20, 40, 0, 0, 0, 0]),
        Character('B'),
        Bar([20, 40, 0, 0, 0, 0]),
        Character('O'),
        Bar([20, 40, 0, 0, 0, 0]),
        Character('T'),
        Bar([20, 40, 0, 0, 0, 0]),
        Character('R'),
        Bar([20, 40, 0, 0, 0, 0]),
        Character('O'),
        Bar([20, 40, 0, 0, 0, 0]),
        Character('N'),
      ),
      ...CharacterList.map((character) => html('div', ['css', css('letter')])(character)),
    ),
  );

  return template;
};
