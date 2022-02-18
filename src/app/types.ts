namespace Feds {
  export type Element<Props> = (props: Props) => HTMLElement;
  export type Component<Props, Messages> = (props: Props) => [HTMLElement, (message: Messages) => void];
  export type Page<Props, Messages> = (props: Props) => [HTMLElement, (message: Messages) => void];
}
