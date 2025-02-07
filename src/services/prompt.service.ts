import fs from 'fs/promises';
import path from 'path';

import { ConfigService } from './config.service';

interface PromptOptions {
  detailed?: boolean;
}

interface BuildParams {
  diff: string;
  branchName: string;
  options: PromptOptions;
}

const DEFAULT_TEMPLATES_DIR: string = path.join(process.cwd(), 'templates');

const DEFAULT_TEMPLATE: string = `
GENERATE ONLY THE COMMIT MESSAGE WITHOUT ANY EXPLANATION
DO NOT ASSUMPTIONS

Current branch: {{branch}}
Analyze these git changes and generate a detailed commit message:
{{diff}}

Requirements:
1. Follow the Conventional Commits format (type(scope): message)
2. Write a clear description in imperative, present tense, lowercase, no period
3. Include breaking changes warning if there are breaking changes
4. Add body if changes need more explanation or context
5. Use point form for the body
6. Add footer for any breaking changes or issue references
`;

export class PromptService {
  constructor(private config: ConfigService) {}

  async loadTemplate(templateName: string): Promise<string> {
    try {
      const templatePath = path.join(DEFAULT_TEMPLATES_DIR, `${templateName}.txt`);

      return await fs.readFile(templatePath, 'utf-8');
    } catch (error) {
      throw new Error(`Failed to load template '${templateName}': ${(error as Error).message}`);
    }
  }

  build({ diff, branchName }: BuildParams): string {
    const template: string = this.config.get('promptTemplate') || DEFAULT_TEMPLATE;

    return template.replace('{{diff}}', diff).replace('{{branch}}', branchName);
  }
}
