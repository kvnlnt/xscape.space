// import { el } from 'src/app/lib/Html';
// import { isTheme, styles } from 'src/app/lib/Theme';
// import { Palette } from '../lib/Palette';

// export interface TimelineEventProps {
//   title: string;
//   desc: string;
//   date: string;
//   align: 'left' | 'right';
// }

// export const TimelineEvent = ({
//   title,
//   desc,
//   align,
//   date,
// }: TimelineEventProps): [HTMLDivElement, HTMLDivElement, HTMLDivElement] => {
//   const Styles = {
//     Title: {
//       wrapper: styles(['display', 'flex'], ['flexDirection', 'column'], ['textAlign', align], ['marginBottom', '30px']),
//       text: styles(
//         ['color', Palette.black_80, isTheme('light')],
//         ['color', Palette.white, isTheme('dark')],
//         ['fontSize', '16px'],
//         ['lineHeight', '30px'],
//         ['fontWeight', 'bold'],
//         ['whiteSpace', 'nowrap'],
//         ['textOverflow', 'ellipsis'],
//       ),
//       desc: styles(
//         ['color', Palette.black_80, isTheme('light')],
//         ['color', Palette.white_70, isTheme('dark')],
//         ['fontSize', '13px'],
//       ),
//     },
//     Line: {
//       wrapper: styles(
//         ['backgroundColor', Palette.white_80, isTheme('light')],
//         ['backgroundColor', Palette.black_80, isTheme('dark')],
//         ['width', '4px'],
//         ['position', 'relative'],
//       ),
//       dot: styles(
//         ['backgroundColor', Palette.black, isTheme('light')],
//         ['backgroundColor', Palette.white, isTheme('dark')],
//         ['width', '10px'],
//         ['height', '10px'],
//         ['display', 'block'],
//         ['borderRadius', '10px'],
//         ['position', 'absolute'],
//         ['top', '10px'],
//         ['left', '-3px'],
//       ),
//     },
//     Timestamp: {
//       wrapper: styles(
//         ['display', 'flex'],
//         ['alignItems', 'flex-start'],
//         ['justifyContent', align === 'left' ? 'flex-end' : 'flex-start'],
//       ),
//       text: styles(
//         ['backgroundColor', Palette.black_80, isTheme('light')],
//         ['backgroundColor', Palette.white, isTheme('dark')],
//         ['color', Palette.white_80, isTheme('light')],
//         ['color', Palette.black, isTheme('dark')],
//         ['fontSize', '12px'],
//         ['lineHeight', '30px'],
//         ['paddingLeft', '20px'],
//         ['paddingRight', '20px'],
//         ['borderRadius', '20px'],
//         ['whiteSpace', 'nowrap'],
//         ['textOverflow', 'ellipsis'],
//       ),
//     },
//   };

//   const Tags = {
//     Title: {
//       Wrapper: el('div', ['style', Styles.Title.wrapper]),
//       Text: el('div', ['style', Styles.Title.text]),
//       Desc: el('div', ['style', Styles.Title.desc]),
//     },
//     Line: {
//       Wrapper: el('div', ['style', Styles.Line.wrapper]),
//       Dot: el('div', ['style', Styles.Line.dot]),
//     },
//     Timestamp: {
//       Wrapper: el('div', ['style', Styles.Timestamp.wrapper]),
//       Date: el('div', ['style', Styles.Timestamp.text]),
//     },
//   };

//   const Title = Tags.Title.Wrapper(Tags.Title.Text(title), Tags.Title.Desc(desc));
//   const Line = Tags.Line.Wrapper(Tags.Line.Dot());
//   const Timestamp = Tags.Timestamp.Wrapper(Tags.Timestamp.Date(date));
//   return align === 'right' ? [Title, Line, Timestamp] : [Timestamp, Line, Title];
// };

// export const Timeline = (data: TimelineEventProps[]) => {
//   const Styles = {
//     wrapper: styles(['overflowX', 'auto'], ['margin', '20px']),
//     events: styles(
//       ['display', 'grid'],
//       ['justifyContent', 'center'],
//       ['gridTemplateColumns', 'auto auto auto'],
//       ['gridTemplateRows', 'min-content'],
//       ['width', '100%'],
//       ['gridColumnGap', '20px'],
//     ),
//   };

//   const Tags = {
//     Wrapper: el('div', ['style', Styles.wrapper]),
//     Events: el('div', ['style', Styles.events]),
//   };
//   return Tags.Wrapper(Tags.Events(...[].concat(...data.map(TimelineEvent))));
// };
