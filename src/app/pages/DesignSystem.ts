import { Color } from '@framework/colors';
import { CSS } from '@framework/css';
import { FSM } from '@framework/fsm';
import { ClassList, Html } from '@framework/html';
import { CHAR, Spectrum } from '../components/Spectral';

const css = CSS({
  container: [
    ['display', 'grid'],
    ['height', '100vh'],
    ['width', '100vw'],
    ['gridTemplateColumns', 'repeat(5, 1fr)'],
    ['gridTemplateRows', 'auto'],
    ['backgroundColor', Color('black')],
    ['gridGap', '10px'],
    ['padding', '10px'],
    ['boxSizing', 'border-box'],
    ['color', Color('white')],
  ],
  letter: [
    ['display', 'flex'],
    ['border', '1px solid white'],
    ['alignItems', 'center'],
    ['justifyContent', 'center'],
    ['padding', '10px'],
  ],
});

type DSContext = { state: 'INIT' };
type DSMessages = { action: 'EXIT' };

export const DesignSystem = () => {
  const fsm = FSM<DSContext, DSMessages>({ state: 'INIT' }, (message, context) => {
    switch (context.state) {
      case 'INIT':
        switch (message.action) {
        }
    }
    return context;
  });

  const $ = Html({
    css: ClassList,
  });

  const template = $('div', ['css', css('container')])(
    ...Object.entries(CHAR).map(([k]) => $('div', ['css', css('letter')])(Spectrum(k))),
  );

  return template;
};
