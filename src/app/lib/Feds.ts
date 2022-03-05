import { Colors } from './Palette';

/**
 * Set any property
 */
type AttributeProp<T extends keyof HTMLElementTagNameMap> = Extract<keyof HTMLElementTagNameMap[T], string>;
type AttributeValue = string;
type AttrFeature<T extends keyof HTMLElementTagNameMap> = [AttributeProp<T>, AttributeValue];
function Attr<T extends keyof HTMLElementTagNameMap>(el: HTMLElement, ...feature: AttrFeature<T>) {
  const [prop, val]: AttrFeature<T> = feature;
  el.setAttribute(prop, String(val));
}

/**
 * Set color from available palette
 */
type ColorColors = keyof typeof Colors;
type ColorAdjustBrightness = number;
type ColorOpacity = number;
type ColorFeature = [ColorColors, ColorAdjustBrightness?, ColorOpacity?];
function Color(el: HTMLElement, ...feature: ColorFeature) {
  const [color, brightness, opacity]: ColorFeature = feature;
  const [h, s, l] = color;
  const hsla = `hsla(${h}deg,${s}%,${l + brightness}%,${opacity})`;
  el.style.color = hsla;
}

/**
 * Handle Event Bus Message
 */
type BindFeature = [(el: HTMLElement) => void];
function Bind(el: HTMLElement, ...feature: BindFeature) {
  const [cb]: BindFeature = feature;
  cb(el);
}

/**
 * Handle Form Submit
 */
type OnSubmitFeature = [(evt: SubmitEvent) => void];
function OnSubmit(el: HTMLElement, ...feature: OnSubmitFeature) {
  const [cb]: OnSubmitFeature = feature;
  el.addEventListener('submit', (evt: SubmitEvent) => {
    evt.preventDefault();
    cb(evt);
  });
}

/**
 * Handle Input
 */
type OnInputFeature = [(el: HTMLElement) => void];
function OnInput(el: HTMLElement, ...feature: OnInputFeature) {
  const [cb]: OnInputFeature = feature;
  el.addEventListener('input', (evt: InputEvent) => cb(evt.target as HTMLInputElement));
}

/**
 * Set any style
 */
type StyleProp = keyof CSSStyleDeclaration;
type StyleValue = string;
type StyleFeature = [StyleProp, StyleValue];
function Style(el: HTMLElement, ...feature: StyleFeature) {
  const [prop, val] = feature;
  el.style[prop as number] = val;
}

/**
 * Html Templating Engine
 */
type HtmlNode = HTMLElement | string | number | SVGElement;

export const html =
  <
    T extends keyof Partial<HTMLElementTagNameMap>,
    U extends 'attr' | 'bind' | 'color' | 'style' | 'oninput' | 'onsubmit',
  >(
    tag: T,
    ...features: [
      U,
      ...(U extends 'attr'
        ? AttrFeature<T>
        : U extends 'bind'
        ? BindFeature
        : U extends 'color'
        ? ColorFeature
        : U extends 'style'
        ? StyleFeature
        : U extends 'oninput'
        ? OnInputFeature
        : U extends 'onsubmit'
        ? OnSubmitFeature
        : unknown)
    ][]
  ) =>
  (...children: HtmlNode[]) => {
    const el = document.createElementNS('http://www.w3.org/1999/xhtml', tag);

    // features
    features.forEach((feature) => {
      const [featureAttr, ...featureArgs] = feature;
      switch (featureAttr) {
        case 'attr':
          Attr<T>(el, ...(featureArgs as AttrFeature<T>));
          break;
        case 'bind':
          Bind(el, ...(featureArgs as BindFeature));
          break;
        case 'color':
          Color(el, ...(featureArgs as ColorFeature));
          break;
        case 'style':
          Style(el, ...(featureArgs as StyleFeature));
          break;
        case 'oninput':
          OnInput(el, ...(featureArgs as OnInputFeature));
          break;
        case 'onsubmit':
          OnSubmit(el, ...(featureArgs as OnSubmitFeature));
          break;
      }
    });

    // Append children
    children.forEach((child) => {
      if (child instanceof Node) el.appendChild(child);
      if (typeof child === 'string' || typeof child === 'number') el.innerHTML += child;
    });

    return el;
  };

/**
 * A miniature "Event Bus"
 */
type Pub = (eventName: string) => void;
type Sub = (eventName: string, cb: Function) => void;
type Subscriber = { eventName: string; cb: Function };

export const useSignal = (..._: string[]): [Pub, Sub] => {
  const subscribers: Subscriber[] = [];
  const pub: Pub = (eventName: string) => subscribers.filter((i) => i.eventName === eventName).forEach((i) => i.cb());
  const sub: Sub = (eventName: string, cb: Function) => subscribers.push({ eventName, cb });
  return [pub, sub];
};

/**
 * Model
 */
type ModelSubscription<T> = { key: keyof T; cb: (val: T[keyof T]) => void };
export const useModel = <T>(
  model: T,
): {
  get: (key: keyof T) => T[keyof T];
  set: (key: keyof T, val: T[keyof T]) => T[keyof T];
  sub: (key: keyof T, cb: (val: T[keyof T]) => void) => void;
} => {
  const _model: T = model;
  const _subscriptions: ModelSubscription<T>[] = [];

  const subscriber = (key: keyof T, cb: (val: T[keyof T]) => void) => {
    _subscriptions.push({
      key,
      cb,
    });
  };

  const getter = (key: keyof T) => {
    return _model[key];
  };

  const setter = (key: keyof T, val: T[keyof T]) => {
    _model[key] = val;
    _subscriptions.filter((i) => i.key === key).forEach((i) => i.cb(_model[key]));
    return _model[key];
  };

  return {
    get: getter,
    set: setter,
    sub: subscriber,
  };
};

/**
 * Machine
 */
type MachineSubscription<Context, Actions> = { action: Actions; cb: (context: Context) => void };
export const useMachine = <Context, Actions, Messages extends { action: Actions; payload?: Partial<Context> }>(
  context: Context,
  machine: (message: Messages, context: Context) => Context,
): {
  get: (key: keyof Context) => Context[keyof Context];
  pub: (message: Messages) => void;
  sub: (key: Actions, cb: (context: Context) => Context) => void;
} => {
  let _context: Context = context;
  const _subs: MachineSubscription<Context, Actions>[] = [];

  const sub = (action: Actions, cb: (context: Context) => void) => {
    _subs.push({
      action,
      cb,
    });
  };

  const get = (key: keyof Context) => {
    return _context[key];
  };

  const pub = (message: Messages & { action: string }) => {
    _context = machine(message, _context);
    _subs.filter((sub) => sub['action'] === message['action']).forEach((i) => i.cb(_context));
    return _context;
  };

  return {
    get,
    pub,
    sub,
  };
};
