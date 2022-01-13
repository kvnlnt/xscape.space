import { DashboardShell } from '../components/Grids/DashboardShell';
import { BoxRow } from '../elements/Boxes';
import { H1 } from '../elements/Typography';

export interface StylesScreenOptions {
  state?: 'INIT';
}
export const StylesScreen = (options: StylesScreenOptions) =>
  DashboardShell('StylesScreen', BoxRow(H1('StylesScreen')));
