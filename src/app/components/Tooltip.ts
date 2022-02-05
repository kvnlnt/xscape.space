import { useDom } from '@lib/Dom';
import { useHtml } from '@lib/Html';
import { useProperty } from '@lib/Property';

type TooltipState = 'SHOWING' | 'HIDDEN';
type TooltipEvent = 'SHOW' | 'HIDE' | 'RESIZE';
type TooltipProps = {
  title: string;
  subTitle: string;
  trackingId: string;
};

export const useTooltip = ({
  title,
  subTitle,
  trackingId,
}: TooltipProps): [HTMLElement, (event: TooltipEvent) => void] => {
  // props
  const [state, setState] = useProperty<TooltipState>('SHOWING');

  // elements
  const [container] = useHtml('div');
  const [titleEl] = useHtml('div');
  const [subTitleEl] = useHtml('div');

  // actions
  const actions: Record<string, () => TooltipState> = {
    resize() {
      const [trackedEl] = useDom(trackingId);
      // console.log(trackedEl);
      return state();
    },
  };

  // state
  const machine = (event: TooltipEvent) => {
    switch (state()) {
      case 'SHOWING':
        switch (event) {
          case 'RESIZE':
            setState(actions.resize());
            break;
        }
      case 'HIDDEN':
        switch (event) {
          case 'RESIZE':
            setState(actions.resize());
            break;
        }
    }
  };

  // html
  const tooltip = container(titleEl(title), subTitleEl(subTitle));

  return [tooltip, machine];
};
