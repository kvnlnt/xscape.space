import { useCss } from '@lib/Css';
import { useHtml } from '@lib/Html';
import { usePalette } from '@lib/Palette';

const [palette] = usePalette();

const [css] = useCss({
  meter: [
    ['display', 'flex'],
    ['flexDirection', 'row'],
    ['height', '50px'],
    ['alignItems', 'flex-end'],
    ['justifyContent', 'center'],
  ],
  bar: [
    ['backgroundColor', palette('purple')],
    ['marginLeft', '1px'],
    ['borderRadius', '2px'],
    ['minHeight', '5px'],
  ],
  width_150: [['width', '150px']],
  width_400: [['width', '400px']],
});

export const Meter = (readings: number[]) => {
  const [meter] = useHtml('div', ['class', css('meter', 'width_150', 'width_400_on_tablet')]);
  const bars = readings.map((reading) => {
    const [bar] = useHtml('div', ['class', css('bar')], ['style', `height:${reading}%;width:5px;`]);
    return bar();
  });
  return meter(...bars);
};
