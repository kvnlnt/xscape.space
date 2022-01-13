enum Font {
  arial = 'Arial',
}

type FontList = keyof typeof Font;

export const useFont = () => {
  const getter = (font: FontList) => Font[font];
  return [getter];
};
