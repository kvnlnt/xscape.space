import { CSS } from '@framework/css';
import { FSM } from '@framework/fsm';
import {
  Attr,
  ClassList,
  Color,
  FontSize,
  Html,
  OnClick,
  OnMachine,
  OnMachineAttr,
  OnMachineClass,
  OnMachineInnerHtml,
  OnMachineInnerText,
  OnTextInput,
} from '@framework/html';

const css = CSS({
  container: [
    ['display', 'flex'],
    ['justifyContent', 'center'],
    ['alignItems', 'center'],
    ['height', '100vh'],
    ['width', '100vw'],
    ['position', 'relative'],
    ['overflow', 'hidden'],
  ],
});

type Context = {
  todo: string;
  state: 'INIT' | 'IDLE';
};

type Messages = { action: 'TODO_UPDATE'; payload: Context } | { action: 'SUBMIT' };

export const DesignSystem = () => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';

  const fsm = FSM<Context, Messages>({ todo: 'test', state: 'IDLE' }, (message, context) => {
    switch (context.state) {
      case 'IDLE':
        switch (message.action) {
          case 'TODO_UPDATE':
            context = { ...context, todo: message.payload.todo };
            break;
          case 'SUBMIT':
            console.log(context);
            context = { ...context, state: 'INIT' };
            break;
        }
    }
    return context;
  });

  const $ = Html({
    color: Color,
    attr: Attr,
    on_click: OnClick,
    sub: OnMachine<Context, Messages>(fsm),
    sub_text: OnMachineInnerText<Context, Messages>(fsm),
    sub_html: OnMachineInnerHtml<Context, Messages>(fsm),
    sub_attr: OnMachineAttr<Context, Messages>(fsm),
    sub_class: OnMachineClass<Context, Messages>(fsm),
    on_input: OnTextInput,
    font_size: FontSize,
    css: ClassList,
  });

  const template = $('div', ['css', css('container')])(
    $('h1', ['color', 'blue'])('ExampleApp'),
    $('h2', ['font_size', 24])('subtitle'),
    $('div', ['sub_text', 'TODO_UPDATE', (ctx) => ctx.todo])('...'),
    $(
      'div',
      ['sub_html', 'TODO_UPDATE', (ctx) => (ctx.todo.length > 2 ? $('div')(ctx.todo + '---') : null)],
      ['sub_attr', 'TODO_UPDATE', (ctx) => ['data-len', ctx.todo.length]],
      ['sub_attr', 'TODO_UPDATE', (ctx) => ['data-len2', ctx.todo]],
      ['sub_class', 'TODO_UPDATE', (ctx) => `one two-${ctx.todo.length}`],
    )('...html'),
    $('form')(
      $('fieldset')(
        $('legend')('to dos'),
        $('input', ['on_input', (val) => fsm.pub('TODO_UPDATE', { todo: val })])(),
        $('button', ['on_click', () => fsm.pub('SUBMIT')])('Submit'),
      ),
    ),
  );

  return template;
};
