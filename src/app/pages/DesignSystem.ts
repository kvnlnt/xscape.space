import { Attr, Color, FontSize, Html, OnClick, OnMachine, OnTextInput } from '@framework/html';
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

export const DesignSystem = () => {
  const $ = Html({
    color: Color,
    attr: Attr,
    on_click: OnClick,
    on_machine: OnMachine<Context, Messages['action'], Messages>(machine),
    on_input: OnTextInput,
    font_size: FontSize,
  });

  const template = $('div')(
    $('h1', ['color', 'blue'])('ExampleApp'),
    $('h2', ['font_size', 24])('subtitle'),
    $('div', ['font_size', 18], ['on_machine', 'TODO_UPDATE', (el, context) => (el.innerText = context.todo)])('...'),
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
