import { FSM } from '@framework/fsm';
import {
  Attr,
  Color,
  FontSize,
  Html,
  If,
  OnClick,
  OnMachine,
  OnMachineAttr,
  OnMachineClass,
  OnMachineInnerHtml,
  OnMachineInnerText,
  OnTextInput,
} from '@framework/html';

type Context = {
  todo: string;
  state: 'INIT' | 'IDLE';
};

type Messages = { action: 'TODO_UPDATE'; payload: Context } | { action: 'SUBMIT' };

const machine = FSM<Context, Messages>({ todo: 'test', state: 'IDLE' }, (message, context) => {
  switch (context.state) {
    case 'IDLE':
      switch (message.action) {
        case 'TODO_UPDATE':
          context = { ...context, todo: message.payload.todo };
          break;
        case 'SUBMIT':
          context = { ...context, state: 'INIT' };
          break;
      }
  }
  return context;
});

export const DesignSystem = () => {
  const $ = Html({
    color: Color,
    attr: Attr,
    if: If,
    on_click: OnClick,
    machine_sub: OnMachine<Context, Messages>(machine),
    machine_sub_text: OnMachineInnerText<Context, Messages>(machine),
    machine_sub_html: OnMachineInnerHtml<Context, Messages>(machine),
    machine_sub_attr: OnMachineAttr<Context, Messages>(machine),
    machine_sub_class: OnMachineClass<Context, Messages>(machine),
    on_input: OnTextInput,
    font_size: FontSize,
  });

  const template = $('div')(
    $('h1', ['color', 'blue'])('ExampleApp'),
    $('h2', ['font_size', 24])('subtitle'),
    $('div', ['machine_sub_text', 'TODO_UPDATE', (ctx) => ctx.todo])('...'),
    $(
      'div',
      ['machine_sub_html', 'TODO_UPDATE', (ctx) => (ctx.todo.length > 2 ? $('div')(ctx.todo + '---') : null)],
      ['machine_sub_attr', 'TODO_UPDATE', (ctx) => ['data-len', ctx.todo.length]],
      ['machine_sub_attr', 'TODO_UPDATE', (ctx) => ['data-len2', ctx.todo]],
      ['machine_sub_class', 'TODO_UPDATE', (ctx) => `one two-${ctx.todo.length}`],
    )('...html'),
    $('form')(
      $('fieldset')(
        $('legend')('to dos'),
        $('input', ['on_input', (val) => machine.pub('TODO_UPDATE', { todo: val })])(),
        $('button', ['on_click', () => machine.pub('SUBMIT')])('Submit'),
      ),
    ),
  );

  return template;
};

// const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
