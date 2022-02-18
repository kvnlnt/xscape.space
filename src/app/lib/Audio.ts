type AudioState = 'IDLE' | 'PLAYING' | 'PAUSED';
type AudioMessages = { action: 'PLAY'; mp3Url: string } | { action: 'PAUSE' } | { action: 'STOP' };

export const useAudio = (rmsCallback: (rms: number) => void) => {
  let state: AudioState = 'IDLE';
  let audio: HTMLAudioElement;
  let audioCtx: AudioContext;

  const createAudioElement = (mp3: string, rmsCallback: (rms: number) => void) => {
    if (audioCtx) audioCtx.close();
    audioCtx = new AudioContext();
    audio = new Audio(mp3);
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
      rmsCallback(rms * 100);
    });

    return audio;
  };

  const machine = (events: AudioMessages) => {
    switch (state) {
      case 'IDLE':
        switch (events.action) {
          case 'PLAY':
            state = 'PLAYING';
            audio = createAudioElement(events.mp3Url, rmsCallback);
            audio.play();
            break;
        }
        break;
      case 'PLAYING':
        switch (events.action) {
          case 'PAUSE':
            state = 'PAUSED';
            audio.pause();
            break;
          case 'PLAY':
            audio = createAudioElement(events.mp3Url, rmsCallback);
            audio.play();
          case 'STOP':
            audioCtx.close();
        }
      case 'PAUSED':
        switch (events.action) {
          case 'PLAY':
            state = 'PLAYING';
            audio.play();
            break;
        }
    }
  };

  return machine;
};
