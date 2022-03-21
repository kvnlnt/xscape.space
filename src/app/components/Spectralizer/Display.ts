import { CSS } from '@framework/css';
import { FSM } from '@framework/fsm';
import { ClassList, Html, OnMachineInnerHtml, Style } from '@framework/html';
import { Bar } from './Bar';

const css = CSS({
  display_wrapper: [
    ['display', 'flex'],
    ['flexDirection', 'row'],
    ['alignItems', 'center'],
    ['justifyContent', 'center'],
    ['height', '100%'],
    ['cursor', 'pointer'],
  ],
  display_sub_wrapper: [
    ['display', 'flex'],
    ['height', '100%'],
  ],
});

type DisplayContext = {
  bars: [number, number, number, number, number, number][];
  state: 'LISTENING';
};

type DisplayMessages = {
  action: 'UPDATE';
  bars: [number, number, number, number, number, number][];
};

const DisplayMachine = FSM<DisplayContext, DisplayMessages>(
  { bars: [[0, 0, 0, 0, 0, 0]], state: 'LISTENING' },
  (message, context) => {
    switch (context.state) {
      case 'LISTENING':
        switch (message.action) {
          case 'UPDATE':
            context = { ...context, bars: message.payload.bars };
            break;
        }
    }
    return context;
  },
);

const html = Html({
  css: ClassList,
  style: Style,
  sub: OnMachineInnerHtml<DisplayContext, DisplayMessages>(DisplayMachine),
});

export const Display = () => {
  const bars = DisplayMachine.get('bars').map((bar) => Bar(bar));
  const DisplayTemplate = html(
    'div',
    ['css', css('display_wrapper')],
    ['sub', 'UPDATE', (ctx) => html('div', ['css', css('display_sub_wrapper')])(...ctx.bars.map((bar) => Bar(bar)))],
  )(...bars);
  return {
    DisplayMachine,
    DisplayTemplate,
  };
};
