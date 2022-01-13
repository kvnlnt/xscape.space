// import { el } from '../lib/Html';
// import { Palette } from '../lib/Palette';
// import { classes, isTheme, styles } from '../lib/Theme';

// interface MenuItem {
//   text: string;
//   href?: string;
//   onclick?: () => void;
//   isSelected?: boolean;
// }

// export const VerticalMenu = (items: MenuItem[]) =>
//   el('ul', ['style', styles(['listStyle', 'none'], ['margin', 0], ['padding', 0])])(
//     ...items.map(({ text, href, onclick, isSelected = false }) =>
//       el('li')(
//         el(
//           'a',
//           ['href', href],
//           ['onclick', onclick],
//           [
//             'style',
//             styles(
//               ['display', 'block'],
//               ['fontWeight', 'bold', isSelected],
//               ['cursor', 'pointer'],
//               ['paddingTop', '10px'],
//               ['paddingBottom', '10px'],
//               ['paddingLeft', '20px'],
//               ['paddingRight', '20px'],
//             ),
//           ],
//           [
//             'class',
//             classes(
//               ['black', isTheme('light')],
//               ['bg_white_80_on_hover', isTheme('light')],
//               ['white', isTheme('dark')],
//               ['bg_black_80_on_hover', isTheme('dark')],
//             ),
//           ],
//         )(text),
//       ),
//     ),
//   );

// export const HorizontalTabs = (items: MenuItem[]) =>
//   el(
//     'ul',
//     [
//       'style',
//       styles(
//         ['listStyle', 'none'],
//         ['margin', '0'],
//         ['padding', '0'],
//         ['display', 'flex'],
//         ['backgroundColor', Palette.black_80, isTheme('dark')],
//         ['backgroundColor', Palette.white_80, isTheme('light')],
//       ),
//     ],
//     ['class', classes(['flex_column'], ['flex_row_on_tablet'])],
//   )(
//     ...items.map(({ text, href, onclick, isSelected = false }) =>
//       el('li')(
//         el(
//           'a',
//           ['href', href],
//           ['onclick', onclick],
//           [
//             'class',
//             classes(
//               ['black', isTheme('light')],
//               ['bg_white_80_on_hover', isTheme('light')],
//               ['white', isTheme('dark')],
//               ['bg_black_80_on_hover', isTheme('dark')],
//             ),
//           ],
//           [
//             'style',
//             styles(
//               ['display', 'block'],
//               ['padding', '20px'],
//               ['textDecoration', 'none'],
//               ['fontWeight', 'bold', isSelected],
//               ['cursor', 'pointer'],
//             ),
//           ],
//         )(text),
//       ),
//     ),
//   );
