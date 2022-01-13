type Tokens = 'MENU';

type Menu = boolean;

export const useLocalStorage = <T extends Tokens>(
  key: T,
  val: T extends 'MENU' ? Menu : never,
  cb: (prop: T) => void,
): [() => T extends 'MENU' ? boolean : never, (val: T extends 'MENU' ? Menu : never) => void] => {
  switch (key) {
    case 'MENU':
      const getter = () => JSON.parse(localStorage.getItem(key) || `${val}` || 'false');
      const setter = (val: Menu): void => {
        localStorage.setItem(key, JSON.stringify(val));
        if (cb) cb(getter());
      };
      return [getter, setter];
  }
};

export const useSessionStorage = <T extends Tokens>(
  key: T,
  val: T extends 'MENU' ? Menu : never,
  cb: (prop: T) => void,
): [() => T extends 'MENU' ? boolean : never, (val: T extends 'MENU' ? Menu : never) => void] => {
  switch (key) {
    case 'MENU':
      const getter = () => JSON.parse(sessionStorage.getItem(key) || '{}');
      const setter = (val: Menu): void => {
        sessionStorage.setItem(key, JSON.stringify(val));
        if (cb) cb(getter());
      };
      return [getter, setter];
  }
};
