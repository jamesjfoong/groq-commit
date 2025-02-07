#!/usr/bin/env node
import { program } from 'commander';

import { registerCommands } from './commands';
import { createServices } from './services';
import { logger } from './utils/logger';
import { getPackageInfo } from './utils/pkg';

process.removeAllListeners('warning');

const services = createServices();
const { name, version, description } = getPackageInfo();

program.name(name).version(version).description(description);

registerCommands(program, services);

program.parseAsync(process.argv).catch((error: Error) => {
  logger.error(error.message);
  process.exit(1);
});
