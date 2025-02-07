import chalk from 'chalk';
import { Command } from 'commander';
import { Groq } from 'groq-sdk';
import { Model } from 'groq-sdk/resources';
import inquirer from 'inquirer';

import { createServices } from '../services';
import { ConfigSchema } from '../services/config.service';
import { logger } from '../utils/logger';
import { spinner } from '../utils/spinner';

interface ModelChoice {
  name: string;
  value: string;
}

interface SetupAnswers {
  apiKey?: string;
  model: string;
  customizeMore: boolean;
  promptTemplate?: string;
  maxTokens?: number;
  temperature?: number;
}

async function getAvailableModels(apiKey: string): Promise<ModelChoice[]> {
  try {
    const response = await spinner.wrap(
      'Fetching available models...',
      new Groq({ apiKey }).models.list()
    );

    if (!response.data || !Array.isArray(response.data)) {
      throw new Error('Unexpected API response format');
    }

    return response.data.map((model: Model) => ({
      name: `${model.id} (${model.owned_by})`,
      value: model.id,
    }));
  } catch (error) {
    logger.warn('Failed to fetch models: ' + (error as Error).message);

    return [{ name: 'llama-3.3-70b-versatile', value: 'llama-3.3-70b-versatile' }];
  }
}

export function createSetupCommand(
  program: Command,
  services: ReturnType<typeof createServices>
): Command {
  return program
    .command('setup')
    .description('Configure Groq API key and preferences')
    .action(() => handleSetup(services));
}

async function handleSetup(services: ReturnType<typeof createServices>): Promise<void> {
  const { config } = services;

  try {
    logger.info('\nWelcome to groq-commit setup!\n');

    const { apiKey } = await inquirer.prompt<{ apiKey?: string }>([
      {
        type: 'password',
        name: 'apiKey',
        message: 'Enter your Groq API key:',
        default: config.get('apiKey'),
        validate: (input: string) => {
          if (!input) return true;
          if (input.length < 20) {
            return 'API key seems too short. Please check your key';
          }

          return true;
        },
      },
    ]);

    const effectiveApiKey = apiKey || config.get('apiKey');
    const modelChoices = await getAvailableModels(effectiveApiKey);

    const answers = await inquirer.prompt<SetupAnswers>([
      {
        type: 'list',
        name: 'model',
        message: 'Select your preferred AI model:',
        choices: modelChoices,
        default: config.get('model'),
      },
      {
        type: 'confirm',
        name: 'customizeMore',
        message: 'Would you like to customize additional settings?',
        default: false,
      },
    ]);

    if (apiKey) {
      answers.apiKey = apiKey;
    }

    if (answers.customizeMore) {
      const advancedAnswers = await inquirer.prompt<SetupAnswers>([
        {
          type: 'input',
          name: 'promptTemplate',
          message: 'Custom prompt template (leave empty for default):',
          default: config.get('promptTemplate'),
          description: 'Use {diff}, {summary}, {branch}, {type}, {scope} as placeholders',
        },
        {
          type: 'input',
          name: 'maxTokens',
          message: 'Maximum tokens for generation:',
          default: config.get('maxTokens') || 500,
          validate: (input: string) => {
            const num = parseInt(input);

            return num >= 50 && num <= 1000 ? true : 'Please enter a number between 50 and 1000';
          },
          filter: (input: string) => parseInt(input),
        },
        {
          type: 'input',
          name: 'temperature',
          message: 'Temperature for generation (0.0-1.0):',
          default: config.get('temperature') || 0.7,
          validate: (input: string) => {
            const num = parseFloat(input);

            if (isNaN(num) || num < 0 || num > 1) {
              return 'Please enter a number between 0 and 1';
            }

            return true;
          },
          filter: (input: string) => {
            const num = parseFloat(input);

            return isNaN(num) ? input : num;
          },
        },
      ] as never);

      Object.assign(answers, advancedAnswers);
    }

    // Update config with non-empty values and handle type conversions
    Object.entries(answers).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        if (key === 'temperature') {
          config.set(key, Number(parseFloat(value.toString()).toFixed(2)));
        } else if (key === 'maxTokens') {
          config.set(key, parseInt(value.toString(), 10));
        } else {
          config.set(key as keyof ConfigSchema, value as string);
        }
      }
    });

    logger.success('\nConfiguration saved successfully!');
    logger.info('\nTry generating a commit message:');
    logger.info(chalk.cyan('  groq-commit generate'));
    logger.info('\nNeed help? Run:');
    logger.info(chalk.cyan('  groq-commit --help'));
  } catch (error: unknown) {
    if (error instanceof Error) {
      logger.error(error.message);
    } else {
      logger.error('An unexpected error occurred.');
    }
    process.exit(1);
  }
}
