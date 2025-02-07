import chalk from 'chalk';

type LoggerFunction = (msg: string) => void;

interface Logger {
  debug: LoggerFunction;
  info: LoggerFunction;
  success: LoggerFunction;
  warn: LoggerFunction;
  error: LoggerFunction;
  divider: () => void;
  prompt: (prompt: string) => void;
}

export const logger: Logger = {
  debug: (msg: string) => console.log(chalk.dim(msg)),
  info: (msg: string) => console.log(chalk.blue(msg)),
  success: (msg: string) => console.log(chalk.green(msg)),
  warn: (msg: string) => console.log(chalk.yellow(msg)),
  error: (msg: string) => console.error(chalk.red(msg)),
  divider: () => console.log(chalk.green('----------------------------------------')),
  prompt: (prompt: string) => {
    logger.debug('\nPrompt Template:');
    logger.divider();
    logger.debug(prompt);
    logger.divider();
  },
};
