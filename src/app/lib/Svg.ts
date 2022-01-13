// SVG

type SvgNode = SVGElement | string | number;
type SvgTemplate = (...children: SvgNode[]) => void;

type SvgTag<T extends keyof SVGElementTagNameMap> = {
  tag: T;
  attrs?: SvgAttr<T>[];
  children: SvgNode[];
};

type SvgAttr<X extends keyof Partial<SVGElementTagNameMap>> = [
  Extract<keyof SVGElementTagNameMap[X], string> | 'class' | 'd',
  string | number | Function | boolean,
];

function SVG<T extends keyof SVGElementTagNameMap>({ tag, attrs = [], children = [] }: SvgTag<T>) {
  const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
  attrs.forEach(([k, v]: SvgAttr<T>) => {
    if (typeof v === 'function') {
      el.addEventListener(k.substring(2, k.length), (e) => v(e));
    } else if (typeof v === 'boolean') {
      if (v === true) el.setAttribute(k, '');
    } else {
      el.setAttribute(k, v.toString());
    }
  });
  children.forEach((child) => {
    if (child instanceof Node) el.appendChild(child);
    if (typeof child === 'string') el.innerHTML += child;
  });
  return el;
}

export function useSvg<T extends keyof SVGElementTagNameMap>(
  tag: T,
  ...attrs: SvgAttr<T>[]
): [(...children: SvgNode[]) => SVGElement, SvgTemplate, (...attrs: SvgAttr<T>[]) => void] {
  let container: SVGElement;
  const element = (...children: SvgNode[]) => {
    container = SVG<T>({ tag, attrs, children });
    return container;
  };
  const replace = (...children: SvgNode[]) => {
    const newContainer = SVG<T>({ tag, attrs, children });
    container.replaceWith(newContainer);
    container = newContainer;
  };
  const updateAttrs = (...attrs: SvgAttr<T>[]) => {
    attrs.forEach((attr) => {
      const [key, val] = attr;
      container.setAttribute(key, val as string);
    });
  };
  return [element, replace, updateAttrs];
}
