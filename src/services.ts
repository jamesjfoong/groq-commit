import { AiService } from './services/ai.service';
import { ConfigService } from './services/config.service';
import { GitService } from './services/git.service';
import { PromptService } from './services/prompt.service';

export function createServices() {
  const config: ConfigService = new ConfigService();
  const git: GitService = new GitService();
  const ai: AiService = new AiService(config);
  const prompt: PromptService = new PromptService(config);

  return { git, ai, config, prompt };
}
