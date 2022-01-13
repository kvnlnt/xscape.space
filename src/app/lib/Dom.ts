export function useDom(selector: string) {
  let element: HTMLElement = document.querySelector(selector);
  if (!element) {
    window.addEventListener('DOMContentLoaded', () => {
      element = document.querySelector(selector);
    });
  }
  const setter = (...children: (HTMLElement | Node)[]) => {
    element.innerHTML = '';
    children.forEach((child) => element.appendChild(child));
  };
  return [setter];
}
