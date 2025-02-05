import Groq from 'groq-sdk';
import simpleGit from 'simple-git';
import { config } from './config.js';

const git = simpleGit();

export async function generateCommitMessage(options) {
  const apiKey = config.get('apiKey');
  if (!apiKey) {
    throw new Error('Groq API key not configured. Run `groq-commit setup` first.');
  }

  const diff = await git.diff(['--cached', '--shortstat']);
  const summary = await git.diff(['--cached', '--name-status']);
  if (!diff && !summary) {
    throw new Error('No staged changes detected. Use git add to stage changes.');
  }

  const groq = new Groq({ apiKey });

  const prompt = `
Generate a concise commit message based on these git changes:
Changes overview: ${diff}
Modified files: ${summary}

Follow Conventional Commits format.
${options.type ? `Type: ${options.type}` : ''}
${options.scope ? `Scope: ${options.scope}` : ''}`;

  const completion = await groq.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'mixtral-8x7b-32768',
    temperature: 0.3,
    max_tokens: 100,
  });

  return completion.choices[0]?.message?.content ?? 'No message generated';
}