// import { el } from '../lib/Html';
// import { Palette } from '../lib/Palette';
// import { classes, isTheme, styles } from '../lib/Theme';

// export const Form = el(
//   'form',
//   ['onsubmit', (e: Event) => e.preventDefault()],
//   [
//     'style',
//     ['display:flex', 'justify-content:center', 'align-items:center', 'height:100%', 'flex-direction:column'].join(';'),
//   ],
// );

// export const Fieldset = el('fieldset', ['style', 'display:block; border:0;']);
// export const Field = el('div', ['style', 'display:block; margin-bottom:10px']);
// export const Label = el('label', ['style', 'display:block;']);
// export const Legend = el('legend', ['style', 'display:block; margin-bottom:10px;']);

// interface TextInputProps {
//   placeholder?: string;
//   value: string;
//   onInput?: (e: InputEvent) => void;
// }
// export const TextInput = ({ value, onInput, placeholder }: TextInputProps) =>
//   el(
//     'input',
//     ['type', 'text'],
//     ['style', 'display:block'],
//     ['value', value],
//     ['oninput', onInput],
//     ['placeholder', placeholder],
//   )();

// export const ColorInput = ({ value, onInput, placeholder }: TextInputProps) =>
//   el(
//     'input',
//     ['type', 'color'],
//     ['style', 'display:block'],
//     ['value', value],
//     ['onchange', onInput],
//     ['placeholder', placeholder],
//   )();

// export const Select = ({ onChange, options }: { onChange: (e: Event) => void; options: HTMLOptionElement[] }) =>
//   el(
//     'div',
//     [
//       'style',
//       styles(
//         ['border', `1px solid ${Palette.white_70}`, isTheme('light')],
//         ['border', `1px solid ${Palette.black_70}`, isTheme('dark')],
//         ['padding', '5px'],
//         ['borderRadius', '6px'],
//       ),
//     ],
//     [
//       'class',
//       classes(
//         ['bg_white', isTheme('light')],
//         ['bg_white_80_on_hover', isTheme('light')],
//         ['bg_black', isTheme('dark')],
//         ['bg_black_80_on_hover', isTheme('dark')],
//       ),
//     ],
//   )(
//     el(
//       'select',
//       ['onchange', onChange],
//       [
//         'style',
//         styles(
//           ['cursor', 'pointer'],
//           ['border', `0px`],
//           ['paddingRight', '10px'],
//           ['backgroundColor', 'transparent'],
//           ['color', Palette.black, isTheme('light')],
//           ['color', Palette.white_70, isTheme('dark')],
//         ),
//       ],
//     )(...options),
//   );
