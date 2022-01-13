const EN_US = {
  mainMenuHome: 'Home',
  mainMenuDocs: 'Docs',
  mainMenuLearn: 'Learn',
  mainMenuShowcase: 'Showcase',
  mainMenuGuestbook: 'Guestbook',
  screenDocsTitle: 'Docs',
  screenTitleHome: 'Home',
  screenTitleComponent: 'Components',
  screenLearnTitle: 'Learn',
  screenShowcaseTitle: 'Showcase',
  screenGuestbookTitle: 'Guestbook',
} as const;

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
