type OmitFirstArg<T> = T extends (x: any, ...args: infer P) => infer R ? (...args: P) => R : never;

// Html Template engine
type Tags = keyof HTMLElementTagNameMap;
type FeatureProp = string;
type FeatureFunc = (el: HTMLElement, ...a: any) => any;
type FeatureParams<T> = Parameters<OmitFirstArg<T>>;

export const Html =
  <T extends Record<FeatureProp, FeatureFunc>>(features: T) =>
  <KS extends Array<keyof T>>(
    tag: Tags,
    ...attrs: { [I in keyof KS]-?: [KS[I], ...FeatureParams<T[Extract<KS[I], keyof T>]>] }
  ) =>
  (...children: (HTMLElement | string | number | SVGElement)[]) => {
    // Create element
    const el = document.createElementNS('http://www.w3.org/1999/xhtml', tag);

    // Run features
    attrs.forEach(([attr, ...args]) => features[attr](el, ...args));

    // Append children
    children.forEach((child) => {
      if (child instanceof Node) el.appendChild(child);
      if (typeof child === 'string' || typeof child === 'number') el.innerHTML += child;
    });

    return el;
  };
