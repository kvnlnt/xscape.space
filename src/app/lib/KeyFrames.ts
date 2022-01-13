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

type PercentType = number;
type CssPropType = keyof CSSStyleDeclaration;
type CssPropValType = string | number;
export type KeyframeStyleDeclaration = [PercentType, CssPropType, CssPropValType][];
export const useKeyFrames = <T>(
  declarations: Record<keyof T, KeyframeStyleDeclaration>,
): [(...list: (keyof T)[]) => string, (update: Partial<Record<keyof T, KeyframeStyleDeclaration[]>>) => void] => {
  const id = uuid();
  const style = document.createElement('style');
  style.id = id;
  document.getElementsByTagName('head')[0].appendChild(style);

  const render = () => {
    style.innerHTML = '';
    const styles: string[] = [];
    const declarationList = Object.entries(declarations).sort((a, b) => (a[0] < b[0] ? -1 : 1));
    declarationList.forEach(([selector, declaration]: [string, KeyframeStyleDeclaration]) => {
      styles.push(`@keyframes ${selector}_${id} {\n`);
      declaration.forEach(([percent, prop, val]) => styles.push(`${percent}% { ${prop}: ${val}; }\n`));
      styles.push(`}\n`);
    });
    style.innerHTML = styles.join('');
  };

  render();

  const getter = (...list: (keyof T)[]) => list.map((item) => `${item}_${id}`).join(', ');

  const setter = (update: Partial<Record<keyof T, KeyframeStyleDeclaration[]>>) => {
    declarations = { ...declarations, ...update };
    render();
  };

  return [getter, setter];
};
