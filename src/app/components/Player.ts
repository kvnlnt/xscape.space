import { songs } from 'src/data';
import { useAudio } from '../lib/Audio';
import { useCss } from '../lib/Css';
import { useHtml } from '../lib/Html';
import { useKeyPress } from '../lib/KeyPress';
import { usePalette } from '../lib/Palette';
import { Meter } from './Meter';

const [palette] = usePalette();

const [css] = useCss({
  player: [
    ['fontFamily', 'monospace'],
    ['padding', '35px'],
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

export const Player = (mp3Url: string = songs[0].mp3Url) => {
  const [meter, setMeter] = useHtml('div');
  const numOfBars = 20;
  const emptyMeter = Meter(Array(numOfBars).fill(1));
  const readings: number[] = Array(numOfBars).fill(0);
  const { play, pause, state } = useAudio(mp3Url, (rms: number) => {
    if (readings.length >= numOfBars) {
      readings.shift();
      readings.push(rms);
    } else {
      readings.push(rms);
    }
    setMeter(Meter(readings));
  });
  useKeyPress((key) => {
    console.log(key);
    switch (key) {
      case 'Space':
        togglePlay();
        break;
      case 'Escape':
        pause();
        break;
    }
  });
  const [btn, setBtn] = useHtml('div', ['class', css('btn')]);
  const [btnText] = useHtml('div', ['class', css('btnText')]);
  const [spacer] = useHtml('div', ['class', css('spacer')]);

  const togglePlay = () => {
    if (state() === 'PLAYING') {
      pause();
      setBtn(btnText('SPACE'), spacer('|'), btnText('PAUSED'));
      setMeter(emptyMeter);
    } else {
      play();
      setBtn(btnText('SPACE'), spacer('|'), btnText('PLAYING'));
    }
  };
  const [player] = useHtml('div', ['class', css('player')], ['onclick', togglePlay]);
  return player(meter(emptyMeter), btn(btnText('SPACE'), spacer('|'), btnText('PLAY')));
};
