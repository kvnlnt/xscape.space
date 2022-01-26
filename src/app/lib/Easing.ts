// see https://webglfundamentals.org/webgl/lessons/webgl-3d-geometry-lathe.html
// https://ko.javascript.info/js-animation

type TimingFunc = (timeFraction: number) => number;

const Timings: Record<string, TimingFunc> = {
  ARC: (timeFraction: number) => {
    return 1 - Math.sin(Math.acos(timeFraction));
  },
  LINEAR: (timeFraction: number) => {
    return timeFraction;
  },
  QUAD: (timeFraction: number) => {
    return Math.pow(timeFraction, 2);
  },
} as const;

const easeOut = (timing: TimingFunc) => {
  return function (timeFraction: number) {
    return 1 - timing(1 - timeFraction);
  };
};

type Animate = {
  cb: (progress: number) => void;
  done?: (progress: number) => void;
  duration?: number;
  ease?: 'IN' | 'OUT';
  timing: keyof typeof Timings;
};

export function animate({ timing, cb, duration = 1000, ease = 'IN', done }: Animate) {
  const start = performance.now();
  const timingFunction = ease === 'IN' ? Timings[timing] : easeOut(Timings[timing]);
  requestAnimationFrame(function animate(time) {
    let timeFraction = (time - start) / duration;
    if (timeFraction > 1) timeFraction = 1;
    const progress = timingFunction(timeFraction);
    cb(progress);
    if (timeFraction < 1) requestAnimationFrame(animate);
    if (timeFraction === 1 && done) done(progress);
  });
}

type Progression = {
  divisions: number;
  ease?: 'IN' | 'OUT';
  timing: keyof typeof Timings;
};

export function easeProgression({ timing, divisions = 10, ease = 'IN' }: Progression) {
  const timingFunction = ease === 'IN' ? Timings[timing] : easeOut(Timings[timing]);
  return Array(divisions)
    .fill(0)
    .map((_, i) => timingFunction(i / divisions));
}
