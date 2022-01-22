import { useProperty } from './Property';

type AudioState = 'INIT' | 'PLAYING' | 'PAUSED';

export const useAudio = (mp3Url: string, rmsCallback: (rms: number) => void) => {
  const [state, setState] = useProperty<AudioState>('INIT');
  let audioCtx: AudioContext;
  let audio: HTMLAudioElement;

  const init = () => {
    audioCtx = new AudioContext();
    audio = new Audio(mp3Url);
    audio.crossOrigin = 'anonymous';
    const processor = audioCtx.createScriptProcessor(2048, 1, 1);

    audio.addEventListener(
      'canplaythrough',
      function () {
        const source = audioCtx.createMediaElementSource(audio);
        source.connect(processor);
        source.connect(audioCtx.destination);
        processor.connect(audioCtx.destination);
      },
      false,
    );

    processor.addEventListener('audioprocess', function (evt) {
      const input = evt.inputBuffer.getChannelData(0);
      const len = input.length;
      let total = 0;
      let i = 0;
      let rms: number;
      while (i < len) total += Math.abs(input[i++]);
      rms = Math.sqrt(total / len);
      if (state() === 'PLAYING') rmsCallback(rms * 100);
    });
  };

  const play = () => {
    if (state() === 'INIT') init();
    setState('PLAYING');
    audio.play();
  };
  const pause = () => {
    setState('PAUSED');
    audio.pause();
  };
  return { play, pause, state };
};
