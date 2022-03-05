import { html as $, useMachine } from '@lib/Feds';

type Context = {
  todo: string;
  state?: 'IDLE';
};

type Messages = { action: 'TODO_UPDATE'; payload: Context } | { action: 'SUBMIT' };

// machine
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
  // listeners
  const listenForContextChange = (el: HTMLElement) =>
    machine.sub('TODO_UPDATE', (context) => {
      el.innerText = context.todo;
      return null;
    });

  const handleInput = (el: HTMLInputElement) => machine.pub({ action: 'TODO_UPDATE', payload: { todo: el.value } });

  const template = $('div')(
    $('h1', ['color', 'blue'])('ExampleApp'),
    $('h2', ['style', 'fontSize', '24px'])('subtitle'),
    $('div', ['style', 'fontSize', '18px'], ['bind', listenForContextChange])('...'),
    $('form', ['onsubmit', () => machine.pub({ action: 'SUBMIT' })])(
      $('fieldset')(
        $('legend')('to dos'),
        $('input', ['attr', 'name', 'input'], ['oninput', handleInput])(),
        $('button', ['attr', 'type', 'submit'])('Submit'),
      ),
    ),
  );

  return template;
};

// const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
