const Colors = {
  black: [0, 0, 5],
  red: [0, 100, 50],
  blue: [240, 100, 50],
  yellow: [55, 100, 50],
  green: [118, 100, 50],
  purple: [270, 100, 50],
  orange: [30, 100, 50],
  transparent: 'transparent',
  white: [0, 0, 100],
};

export const usePalette = () => {
  const getter = (color: keyof typeof Colors, adjustLightness: number = 0, opacity: number = 1) => {
    if (color === 'transparent') return color;
    const [h, s, l] = Colors[color];
    const hsla = `hsla(${h}deg,${s}%,${l + adjustLightness}%,${opacity})`;
    return hsla;
  };
  return [getter];
};
