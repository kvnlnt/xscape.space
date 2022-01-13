import { DashboardShell } from '../components/Grids/DashboardShell';
import { Timeline, TimelineEventProps } from '../elements/Time';
import l10n from '../lib/Localization';

export const data: TimelineEventProps[] = [
  {
    title: 'Add Timeline Component',
    desc: 'Simplest possible mobile friendly timeline component',
    date: 'August 1st, 2021',
    align: 'right',
  },
  {
    title: 'FEDS Created',
    desc: 'Basic app outline completed',
    date: 'July 1st, 2021',
    align: 'left',
  },
];

export interface ChangeLogScreenOptions {
  state?: 'init';
}
export const ChangeLogScreen = (options: ChangeLogScreenOptions) => DashboardShell(l10n.titleChangeLog, Timeline(data));
