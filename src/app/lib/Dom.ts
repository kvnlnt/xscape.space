type Attr<T> = [keyof T, string];

export function useDom<T extends HTMLElement>(
  selector: string,
  ...attrs: Attr<T>[]
): [(...children: (HTMLElement | Node)[]) => void, (...attrs: Attr<T>[]) => void] {
  let element: T = document.querySelector(selector);
  const setAttrs = (...attrs: Attr<T>[]): void => attrs.forEach(([k, v]) => (element[k] = v as any));

  if (!element) {
    window.addEventListener('DOMContentLoaded', () => {
      element = document.querySelector(selector);
      setAttrs(...attrs);
    });
  } else {
    setAttrs(...attrs);
  }
  const setHtml = (...children: (HTMLElement | Node)[]) => {
    element.innerHTML = '';
    children.forEach((child) => element.appendChild(child));
  };
  return [setHtml, setAttrs];
}
