import chalk from 'chalk';
import { Command } from 'commander';

import { createServices } from '../services';
import { ConfigSchema } from '../services/config.service';
import { logger } from '../utils/logger';
import { spinner } from '../utils/spinner';

interface ConfigOptions {
  action: 'list' | 'reset';
}

const SENSITIVE_FIELDS = ['apiKey'];
const MASK = '********';

const formatConfigValue = (key: string, value: string | number | boolean): string => {
  if (!value) return chalk.gray('(not set)');
  if (SENSITIVE_FIELDS.includes(key)) return chalk.yellow(MASK);

  return chalk.green(typeof value === 'string' ? value : JSON.stringify(value));
};

const displayConfig = (config: ConfigSchema): void => {
  logger.info('\nCurrent configuration:\n');

  Object.entries(config)
    .sort(([a], [b]) => a.localeCompare(b))
    .forEach(([key, value]) => {
      logger.info(`${chalk.blue(key.padEnd(15))}: ${formatConfigValue(key, value)}`);
    });

  logger.info(''); // Empty line for better readability
};

export function createConfigCommand(
  program: Command,
  services: ReturnType<typeof createServices>
): Command {
  const config = program.command('config').description('Manage configuration');

  config
    .command('list')
    .description('List current configuration')
    .action(() => handleConfig({ action: 'list' }, services));

  config
    .command('reset')
    .description('Reset configuration to defaults')
    .action(() => handleConfig({ action: 'reset' }, services));

  return config;
}

async function handleConfig(
  options: ConfigOptions,
  services: ReturnType<typeof createServices>
): Promise<void> {
  const { config } = services;

  try {
    if (options.action === 'list') {
      const currentConfig = config.getAll();

      displayConfig(currentConfig);
    } else if (options.action === 'reset') {
      await spinner.wrap('Resetting configuration...', Promise.resolve(config.reset()));
      logger.success('Configuration reset successfully!');

      const newConfig = await config.getAll();

      displayConfig(newConfig);
    }
  } catch (error: any) {
    logger.error(error.message);
    process.exit(1);
  }
}
