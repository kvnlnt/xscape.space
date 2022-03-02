import { html as $, useEvent } from '@lib/Feds';

enum Events {
  TODO_CHANGE = 'TODO_CHANGE',
}

type State = 'IDLE';
type Messages = { action: 'TODO_UPDATE'; todo: string };

let state: State = 'IDLE';
let todo = '';
const setTodo = (el: HTMLInputElement) => machine({ action: 'TODO_UPDATE', todo: el.value });
const handleSubmit = (evt: SubmitEvent) => console.log(evt.target, todo);
const bindInputChange = (el: HTMLElement) =>
  sub(Events.TODO_CHANGE, () => {
    el.innerText = todo;
  });
const [pub, sub] = useEvent();

const machine = (message: Messages) => {
  switch (state) {
    case 'IDLE':
      switch (message.action) {
        case 'TODO_UPDATE':
          todo = message.todo;
          pub(Events.TODO_CHANGE);
          break;
      }
  }
};

export const DesignSystem = () =>
  $('div')(
    $('h1', ['color', 'blue'])('ExampleApp'),
    $('h2', ['style', 'fontSize', '24px'])('subtitle'),
    $('div', ['style', 'fontSize', '18px'], ['bind', bindInputChange])('...'),
    $('form', ['onsubmit', handleSubmit])(
      $('fieldset')(
        $('legend')('to dos'),
        $('label')('todo'),
        $('input', ['attr', 'name', 'input'], ['oninput', setTodo])(),
        $('button', ['attr', 'type', 'submit'])('Submit'),
        // html('input', Attr(['data-id', 1]), Attr(['name', 'input']), OnInput(setTodo, Pub(Events.TODO_CHANGE)))(),
        // html('button', Attr(['type', 'submit']))('Submit'),
      ),
    ),
  );

// const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
