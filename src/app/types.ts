namespace Feds {
  export type Element<Props> = (props: Props) => HTMLElement;
  export type Machine<Messages> = (message: Messages) => void;
  export type Component<Props, Messages> = (props: Props) => [HTMLElement, Machine<Messages>];
  export type Page<Props> = (props: Props) => void;
}
