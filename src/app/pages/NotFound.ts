import { Box, BoxColumn } from '../elements/Boxes';
import { Link } from '../elements/Links';
import { H1 } from '../elements/Typography';

export interface NotFoundPageOptions {
  state?: 'init';
}
export const NotFoundPage = (options: NotFoundPageOptions) =>
  BoxColumn(H1('404'), Box('Page Not Found'), Box(Link({ href: '/', text: 'Back to Home' })));
