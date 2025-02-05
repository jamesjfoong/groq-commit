import inquirer from 'inquirer';
import { config } from './config.js';

export async function setupConfig() {
  const answers = await inquirer.prompt([
    {
      type: 'password',
      name: 'apiKey',
      message: 'Enter your Groq API key:',
      validate: input => input.length > 0
    }
  ]);

  config.set('apiKey', answers.apiKey);
  console.log('Configuration saved successfully!');
}