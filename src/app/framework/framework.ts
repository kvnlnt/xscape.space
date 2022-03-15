namespace Feds {
  // Component
  export type Component<Props, Messages> = (props: Props) => [HTMLElement, Machine<Messages>];

  // Page
  export type Page<Props> = (props: Props) => void;

  // State Machine
  export type Machine<Messages> = (message: Messages) => void;
}
