import { Meter } from '@components/Meter';
import { useCss } from '@lib/Css';
import { useHtml } from '@lib/Html';
import { usePalette } from '@lib/Palette';

const [palette] = usePalette();

const [css] = useCss({
  player: [
    ['fontFamily', 'monospace'],
    ['fontSize', '16px'],
    ['display', 'flex'],
    ['cursor', 'pointer'],
    ['flexDirection', 'column'],
    ['justifyContent', 'center'],
    ['alignItems', 'center'],
  ],
  btn: [
    ['color', palette('white', 0, 0.2)],
    ['display', 'flex'],
    ['fontSize', '12px'],
    ['marginTop', '20px'],
  ],
  btnText: [['letterSpacing', '4px']],
  spacer: [
    ['padding', '0 10px'],
    ['display', 'inline-block'],
    ['color', palette('white', 0, 0.1)],
  ],
});

export const Player = (mp3Url: string) => {
  const [meter] = useHtml('div');
  const numOfBars = 20;
  const emptyMeter = Meter(Array(numOfBars).fill(1));
  const readings: number[] = Array(numOfBars).fill(0);
  // const { play, pause, state } = useAudio(mp3Url, (rms: number) => {
  //   if (readings.length >= numOfBars) {
  //     readings.shift();
  //     readings.push(rms);
  //   } else {
  //     readings.push(rms);
  //   }
  //   meter(Meter(readings));
  // });
  // useKeyPress((key) => {
  //   switch (key) {
  //     case 'Space':
  //       togglePlay();
  //       break;
  //     case 'Escape':
  //       pause();
  //       break;
  //   }
  // });
  const [btn] = useHtml('div', ['class', css('btn')]);
  const [btnText] = useHtml('div', ['class', css('btnText')]);
  const [spacer] = useHtml('div', ['class', css('spacer')]);

  const togglePlay = () => {
    if (state() === 'PLAYING') {
      pause();
      btn(btnText('SPACE'), spacer('|'), btnText('PAUSED'));
      meter(emptyMeter);
    } else {
      play();
      btn(btnText('SPACE'), spacer('|'), btnText('PLAYING'));
    }
  };
  const [player] = useHtml('div', ['class', css('player')], ['onclick', togglePlay]);
  return player(meter(emptyMeter), btn(btnText('SPACE'), spacer('|'), btnText('PLAY')));
};
