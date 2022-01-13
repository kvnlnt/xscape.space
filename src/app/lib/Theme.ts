const StorageKey = 'theme';

enum Theme {
  dark,
  lite,
}

type ThemeNames = keyof typeof Theme;

export const useTheme = (): [(theme: ThemeNames) => boolean, (theme: ThemeNames) => void] => {
  const getter = () => {
    const defaultTheme: ThemeNames = 'dark';
    const storedTheme = localStorage.getItem(StorageKey);
    const currentTheme: ThemeNames = storedTheme ? (storedTheme as ThemeNames) : defaultTheme;
    return currentTheme;
  };
  const checker = (theme: ThemeNames) => theme === getter();
  const setter = (theme: ThemeNames) => localStorage.setItem(StorageKey, theme);
  return [checker, setter];
};
