import { Colors } from '@lib/Palette';
import { Color as ColorFunc } from './colors';
import { Machine, MachineContext, MachineMessages } from './fsm';

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

// Features

export const Attr = (el: HTMLElement, prop: string, val: string) => el.setAttribute(prop, String(val));

export const ClassList = (el: HTMLElement, classes: string) => (el.className = classes);

export const Color = (el: HTMLElement, color: keyof typeof Colors) => (el.style.color = ColorFunc(color));

export const OnClick = (el: HTMLElement, cb: () => void) =>
  el.addEventListener('click', (e) => (e.preventDefault(), cb()));

export const OnMachine =
  <Context extends MachineContext, Messages extends MachineMessages>(machine: Machine<Context, Messages>) =>
  (el: HTMLElement, action: Messages['action'], cb: (el: HTMLElement, context: Context) => any) =>
    machine.sub(action, (context) => cb(el, context));

export const OnMachineAttr =
  <Context extends MachineContext, Messages extends MachineMessages>(machine: Machine<Context, Messages>) =>
  (el: HTMLElement, action: Messages['action'], cb: (context: Context) => [string, string | number]) =>
    machine.sub(action, (context) => {
      const [prop, val] = cb(context);
      el.setAttribute(prop, String(val));
    });

export const OnMachineClass =
  <Context extends MachineContext, Messages extends MachineMessages>(machine: Machine<Context, Messages>) =>
  (el: HTMLElement, action: Messages['action'], cb: (context: Context) => string) =>
    machine.sub(action, (context) => {
      el.className = cb(context);
    });

export const OnMachineInnerText =
  <Context extends MachineContext, Messages extends MachineMessages>(machine: Machine<Context, Messages>) =>
  (el: HTMLElement, action: Messages['action'], cb: (context: Context) => any) =>
    machine.sub(action, (context) => {
      el.innerText = cb(context);
    });

export const OnMachineInnerHtml =
  <Context extends MachineContext, Messages extends MachineMessages>(machine: Machine<Context, Messages>) =>
  (el: HTMLElement, action: Messages['action'], cb: (context: Context) => any) =>
    machine.sub(action, (context: Context) => {
      el.innerHTML = '';
      const content = cb(context);
      if (content) el.appendChild(content);
    });

export const OnTextInput = (el: HTMLInputElement, cb: (val: string) => void) =>
  el.addEventListener('input', () => cb(el.value));

export const Style = (el: HTMLElement, style: string) => el.setAttribute('style', style);
