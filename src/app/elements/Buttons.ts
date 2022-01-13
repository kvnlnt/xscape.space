// import { el } from '../lib/Html';
// import { Palette } from '../lib/Palette';
// import { classes, isTheme, styles } from '../lib/Theme';

// interface Button {
//   text: string;
//   onClick: (e: MouseEvent) => void;
// }

// export const Button = ({ text, onClick }: Button) =>
//   el(
//     'button',
//     ['onclick', onClick],
//     [
//       'style',
//       styles(
//         ['cursor', 'pointer'],
//         ['paddingLeft', '10px'],
//         ['paddingRight', '10px'],
//         ['paddingTop', '5px'],
//         ['paddingBottom', '5px'],
//         ['borderRadius', '6px'],
//         ['margin', '0px'],
//         ['color', Palette.black_80, isTheme('light')],
//         ['color', Palette.white_80, isTheme('dark')],
//         ['border', `1px solid ${Palette.black_80}`, isTheme('light')],
//         ['border', `1px solid ${Palette.white_80}`, isTheme('dark')],
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
//   )(text);
// export const AlertButton = ({ text, onClick }: Button) => el('button', ['onclick', onClick])(text);
