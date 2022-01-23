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

export const useFontFace = <T>(fontFamily: T, src: `url('${string}.ttf')` | `url('${string}.otf')`) => {
  const id = uuid();
  const style = document.createElement('style');
  style.id = id;
  document.getElementsByTagName('head')[0].appendChild(style);
  const render = () => (style.innerHTML = `@font-face {font-family:'${fontFamily}'; src: ${src};}`);
  render();
  return fontFamily;
};
