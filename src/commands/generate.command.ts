import { Command } from 'commander';

import { createServices } from '../services';
import { createError } from '../utils/errors';
import { logger } from '../utils/logger';
import { spinner } from '../utils/spinner';

interface GenerateOptions {
  autoCommit?: boolean;
  temperature?: number;
  template?: string;
  maxTokens?: number;
  detailed?: boolean;
}

export function createGenerateCommand(
  program: Command,
  services: ReturnType<typeof createServices>
): Command {
  return program
    .command('generate')
    .description('Generate commit message from current changes')
    .option('-a, --auto-commit', 'Automatically commit after generating message')
    .option('--template <template>', 'Use custom commit message template')
    .action((options) => handleGenerate(options, services));
}

async function handleGenerate(
  options: GenerateOptions,
  services: ReturnType<typeof createServices>
): Promise<void> {
  const { git, ai, config, prompt } = services;

  try {
    if (!config.get('apiKey')) {
      throw createError('NO_API_KEY');
    }

    const [diff, branchName] = await spinner.wrap(
      'Checking git changes...',
      Promise.all([git.getDiff(), git.getBranchName()])
    );

    if (!diff) {
      throw createError('NO_CHANGES');
    }

    const promptText = prompt.build({ diff, branchName, options });
    const message = (await spinner.wrap(
      'Generating commit message...',
      ai.generateCommitMessage(promptText, options)
    )) as string;

    console.log(promptText, message);

    if (options.autoCommit) {
      await spinner.wrap('Committing changes...', git.commit(message));
    }

    logger.success('Generated commit message:');
    logger.info(message);
  } catch (error: any) {
    logger.error(error.message);
    process.exit(1);
  }
}
