// HTML

export type HtmlNode = HTMLElement | string | number | SVGElement;
export type HtmlTemplate = (...children: HtmlNode[]) => void;

type HtmlTag<T extends keyof HTMLElementTagNameMap> = {
  tag: T;
  attrs?: HtmlAttr<T>[];
  children: HtmlNode[];
};

export type HtmlAttr<X extends keyof Partial<HTMLElementTagNameMap>> = [
  Extract<keyof HTMLElementTagNameMap[X], string> | 'class' | `data-${string}`,
  string | number | Function | boolean,
];

function HTML<T extends keyof HTMLElementTagNameMap>({ tag, attrs = [], children = [] }: HtmlTag<T>) {
  const el = document.createElementNS('http://www.w3.org/1999/xhtml', tag);
  attrs.forEach(([k, v]: HtmlAttr<T>) => {
    if (typeof v === 'function') {
      el.addEventListener(k.substring(2, k.length), (e) => v(e));
    } else if (typeof v === 'boolean') {
      if (v === true) el.setAttribute(k, '');
    } else {
      if (v) el.setAttribute(k, v.toString());
    }
  });
  children.forEach((child) => {
    if (child instanceof Node) el.appendChild(child);
    if (typeof child === 'string' || typeof child === 'number') el.innerHTML += child;
  });
  return el;
}

export function html<T extends keyof HTMLElementTagNameMap>(
  tag: T,
  ...attrs: HtmlAttr<T>[]
): (...children: HtmlNode[]) => HTMLElement {
  return (...children: HtmlNode[]) => HTML<T>({ tag, attrs, children });
}

export function useHtml<T extends keyof HTMLElementTagNameMap>(
  tag: T,
  ...attrs: HtmlAttr<T>[]
): [(...children: HtmlNode[]) => HTMLElement, (...attrs: HtmlAttr<T>[]) => void] {
  let container: HTMLElement;
  let hasRendered = false;

  const replace = (...children: HtmlNode[]) => {
    const attrs: HtmlAttr<T>[] = [];
    Array.from(container.attributes).forEach((attr) => attrs.push([attr.name as any, attr.value]));
    const newContainer = HTML<T>({ tag, attrs, children });
    container.replaceWith(newContainer);
    container = newContainer;
    return container;
  };

  const element = (...children: HtmlNode[]) => {
    if (hasRendered) return replace(...children);
    container = HTML<T>({ tag, attrs, children });
    hasRendered = true;
    return container;
  };

  const updateAttrs = (...attrs: HtmlAttr<T>[]) => {
    attrs.forEach((attr) => {
      const [key, val] = attr;
      if (container) container.setAttribute(key, val as string);
    });
  };
  return [element, updateAttrs];
}
