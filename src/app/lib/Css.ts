enum Breakpoints {
  MOBILE = 0,
  TABLET = 720,
  DESKTOP = 1200,
}

function uuid(str: string = 'xxxxxxxx') {
  function getRandomSymbol(symbol: string) {
    let array;
    if (symbol === 'y') {
      array = ['8', '9', 'a', 'b'];
      return array[Math.floor(Math.random() * array.length)];
    }
    array = new Uint8Array(1);
    window.crypto.getRandomValues(array);
    return (array[0] % 16).toString(16);
  }
  return str.replace(/[xy]/g, getRandomSymbol);
}

type CssPropType = keyof CSSStyleDeclaration;
type CssPropValType = string | number;
type StyleDeclaration = [CssPropType, CssPropValType, boolean?];
export const useCss = <T>(
  declarations: Record<keyof T, StyleDeclaration[]>,
): [
  (
    ...list: (
      | keyof T
      | `${Extract<keyof T, string>}_on_hover`
      | `${Extract<keyof T, string>}_on_tablet`
      | `${Extract<keyof T, string>}_on_hover_on_tablet`
      | `${Extract<keyof T, string>}_on_tablet`
      | `${Extract<keyof T, string>}_on_hover_on_desktop`
    )[]
  ) => string,
  (declarations: Partial<Record<keyof T, StyleDeclaration[]>>) => void,
] => {
  const id = uuid();
  const style = document.createElement('style');
  style.id = id;
  document.getElementsByTagName('head')[0].appendChild(style);

  const render = () => {
    style.innerHTML = '';
    const styles: string[] = [];
    const addStyle = (breakpoint: Breakpoints = Breakpoints.MOBILE) => {
      styles.push(`@media screen and (min-width:${breakpoint}px) {\n`);
      const suffix = {
        [Breakpoints.MOBILE]: '',
        [Breakpoints.TABLET]: '_on_tablet',
        [Breakpoints.DESKTOP]: '_on_desktop',
      };
      Object.entries(declarations).forEach(([selector, declarations]: [string, StyleDeclaration[]]) => {
        styles.push(`.${selector}${suffix[breakpoint]}_${id} {`);
        declarations.forEach(([prop, val, render = true]) =>
          render ? styles.push(`${(<string>prop).replace(/([A-Z])/g, '-$1').toLowerCase()}:${val};`) : null,
        );
        styles.push(`}\n`);
        styles.push(`.${selector}_on_hover${suffix[breakpoint]}_${id}:hover {`);
        declarations.forEach(([prop, val, render = true]) =>
          render ? styles.push(`${(<string>prop).replace(/([A-Z])/g, '-$1').toLowerCase()}:${val};`) : null,
        );
        styles.push(`}\n`);
      });
      styles.push(`}\n`);
    };
    addStyle(Breakpoints.MOBILE);
    addStyle(Breakpoints.TABLET);
    addStyle(Breakpoints.DESKTOP);
    style.innerHTML = styles.join('');
  };

  render();

  const getter = (
    ...list: (
      | keyof T
      | `${Extract<keyof T, string>}_on_hover`
      | `${Extract<keyof T, string>}_on_tablet`
      | `${Extract<keyof T, string>}_on_hover_on_tablet`
      | `${Extract<keyof T, string>}_on_tablet`
      | `${Extract<keyof T, string>}_on_hover_on_desktop`
    )[]
  ) => {
    return list.map((item) => `${item}_${id}`).join(' ');
  };

  const setter = (update: Partial<Record<keyof T, StyleDeclaration[]>>) => {
    declarations = { ...declarations, ...update };
    render();
  };

  return [getter, setter];
};
