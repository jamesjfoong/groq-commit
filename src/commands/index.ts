import { readdirSync } from 'fs';
import { join } from 'path';

import { Command } from 'commander';

import { createServices } from '../services';

export function registerCommands(program: Command, services: ReturnType<typeof createServices>) {
  readdirSync(__dirname)
    .filter((file) => file.endsWith('.command.ts') || file.endsWith('.command.js'))
    .forEach((file) => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const commandModule = require(join(__dirname, file));
      const commandFunction = Object.values(commandModule).find((exp) => typeof exp === 'function');

      if (commandFunction) {
        commandFunction(program, services);
      } else {
        console.warn(`No command function found in file: ${file}`);
      }
    });
}
