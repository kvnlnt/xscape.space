import { html as $, useModel } from '@lib/Feds';

type Todo = {
  Todo: string;
};

type State = 'IDLE';
type Messages = { action: 'TODO_UPDATE'; todo: Todo['Todo'] };

export const DesignSystem = () => {
  let state: State = 'IDLE';

  // models
  const todoModel = useModel<Todo>({ Todo: 'test' });

  // handlers
  const handleOnInput = (el: HTMLInputElement) => machine({ action: 'TODO_UPDATE', todo: el.value });
  const handleSubmit = (evt: SubmitEvent) => console.log(evt.target, todoModel.get('Todo'));

  // listeners
  const listenForTodoChange = (el: HTMLElement) =>
    todoModel.sub('Todo', (todo) => {
      el.innerText = todo;
    });

  // state machine
  const machine = (message: Messages) => {
    switch (state) {
      case 'IDLE':
        switch (message.action) {
          case 'TODO_UPDATE':
            todoModel.set('Todo', message.todo);
            break;
        }
    }
  };

  return $('div')(
    $('h1', ['color', 'blue'])('ExampleApp'),
    $('h2', ['style', 'fontSize', '24px'])('subtitle'),
    $('div', ['style', 'fontSize', '18px'], ['bind', listenForTodoChange])('...'),
    $('form', ['onsubmit', handleSubmit])(
      $('fieldset')(
        $('legend')('to dos'),
        $('input', ['attr', 'name', 'input'], ['oninput', handleOnInput])(),
        $('button', ['attr', 'type', 'submit'])('Submit'),
      ),
    ),
  );
};

// const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
