import { Color, Colors } from '@framework/colors';
import { Html } from '@framework/html';
import { useMachine } from '@lib/Feds';

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
  const $ = Html({
    color: (el, color: keyof typeof Colors) => (el.style.color = Color(color)),
    font_size: (el, size: number) => (el.style.fontSize = `${size}px`),
    on_input: (el: HTMLInputElement) => {
      el.addEventListener('input', () => {
        machine.pub({ action: 'TODO_UPDATE', payload: { todo: el.value } });
      });
    },
    on_submit: (el) => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        machine.pub({ action: 'SUBMIT' });
      });
    },
    on_machine_message: (el: HTMLElement, msg: 'TODO_UPDATE') =>
      machine.sub(msg, (context) => {
        if (msg === 'TODO_UPDATE') el.innerText = context.todo;
        return null;
      }),
  });

  const template = $('div')(
    $('h1', ['color', 'blue'])('ExampleApp'),
    $('h2', ['font_size', 24])('subtitle'),
    $('div', ['font_size', 18], ['on_machine_message', 'TODO_UPDATE'])('...'),
    $('form')($('fieldset')($('legend')('to dos'), $('input', ['on_input'])(), $('button', ['on_submit'])('Submit'))),
  );

  return template;
};

// const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
