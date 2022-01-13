const fs = require('fs');

const name = process.argv[2];

const template = () => `import { DashboardShell } from '../components/DashboardShell';
import { BoxRow } from '../elements/Boxes';
import { H1 } from '../elements/Typography';

export interface ${name}Options {
  state?: 'INIT';
}
export const ${name} = (options: ${name}Options) => DashboardShell('${name}', BoxRow(H1('${name}')));`;

fs.writeFileSync(`./src/app/screens/${name}.ts`, template(), 'utf-8');
