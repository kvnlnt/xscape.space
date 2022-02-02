enum Font {
  arial = 'Arial',
  monospace = 'Monospace',
}

type FontList = keyof typeof Font;

export const useFont = () => {
  const getter = (font: FontList) => Font[font];
  return [getter];
};
