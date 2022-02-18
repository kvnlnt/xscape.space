const EN_US = {} as const;

type Key = keyof typeof EN_US;

export const useLocalization = (lang = window.navigator.language) => {
  const getter = (key: Key) => {
    let translation;
    switch (lang) {
      case 'en-US':
        translation = EN_US;
        break;
      default:
        translation = EN_US;
        break;
    }
    return { ...EN_US, ...translation }[key];
  };
  return [getter];
};
