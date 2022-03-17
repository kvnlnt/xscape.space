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
import { useMachine } from '@lib/Feds';

type Context = {
  todo: string;
  state?: 'IDLE';
};

type Messages = { action: 'TODO_UPDATE'; payload: Context } | { action: 'SUBMIT' };

const machine = useMachine<Context, Messages['action'], Messages>(
  { todo: 'test', state: 'IDLE' },
  (message: Messages, context: Context) => {
    switch (context.state) {
      case 'IDLE':
        switch (message.action) {
          case 'TODO_UPDATE':
            context = { ...context, todo: message.payload.todo };
            break;
          case 'SUBMIT':
            console.log(context);
            break;
        }
    }
    return context;
  },
);

// const Machine =
//   <T extends Record<State, (...args: any) => State>, State extends string, Context>(config: T) =>
//   (context: Context) => {};

export const DesignSystem = () => {
  const $ = Html({
    color: Color,
    attr: Attr,
    if: If,
    on_click: OnClick,
    machine: OnMachine<Context, Messages['action'], Messages>(machine),
    machine_text: OnMachineInnerText<Context, Messages['action'], Messages>(machine),
    machine_html: OnMachineInnerHtml<Context, Messages['action'], Messages>(machine),
    machine_attr: OnMachineAttr<Context, Messages['action'], Messages>(machine),
    machine_class: OnMachineClass<Context, Messages['action'], Messages>(machine),
    on_input: OnTextInput,
    font_size: FontSize,
  });

  const template = $('div')(
    $('h1', ['color', 'blue'])('ExampleApp'),
    $('h2', ['font_size', 24])('subtitle'),
    $('div', ['machine_text', 'TODO_UPDATE', (ctx) => ctx.todo])('...'),
    $(
      'div',
      ['machine_html', 'TODO_UPDATE', (ctx) => (ctx.todo.length > 2 ? $('div')(ctx.todo + '---') : null)],
      ['machine_attr', 'TODO_UPDATE', (ctx) => ['data-len', ctx.todo.length]],
      ['machine_attr', 'TODO_UPDATE', (ctx) => ['data-len2', ctx.todo.length]],
      ['machine_class', 'TODO_UPDATE', (ctx) => `one two-${ctx.todo.length}`],
    )('...html'),
    $('form')(
      $('fieldset')(
        $('legend')('to dos'),
        $('input', ['on_input', (val) => machine.pub({ action: 'TODO_UPDATE', payload: { todo: val } })])(),
        $('button', ['on_click', () => machine.pub({ action: 'SUBMIT' })])('Submit'),
      ),
    ),
  );

  return template;
};

// const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
