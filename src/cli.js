#!/usr/bin/env node
import { program } from 'commander';
import { generateCommitMessage } from './commit-generator.js';
import { setupConfig } from './setup.js';

process.removeAllListeners('warning');

program
  .version('1.0.0')
  .description('Generate commit messages using Groq AI');

program
  .command('setup')
  .description('Configure Groq API key')
  .action(setupConfig);

program
  .command('generate')
  .description('Generate commit message from current changes')
  .option('-t, --type <type>', 'Commit type (feat, fix, etc.)')
  .option('-s, --scope <scope>', 'Commit scope')
  .action(async (options) => {
    const message = await generateCommitMessage(options);
    console.log('Generated commit message:', message);
  });

program.parse(process.argv);