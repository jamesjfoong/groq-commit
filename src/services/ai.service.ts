import { Groq } from 'groq-sdk';
import { Model } from 'groq-sdk/resources';

import { createError } from '../utils/errors';

import { ConfigService } from './config.service';

interface GenerateOptions {
  temperature?: number;
  maxTokens?: number;
}

export class AiService {
  private client: Groq;

  constructor(private config: ConfigService) {
    this.client = new Groq({ apiKey: this.config.get('apiKey') });
  }

  async generateCommitMessage(prompt: string, options: GenerateOptions = {}): Promise<string> {
    try {
      const completion = await this.client.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: this.config.get('model'),
        temperature: options.temperature ?? 0.3,
        max_tokens: options.maxTokens ?? 200,
      });

      return completion.choices[0]?.message?.content ?? 'No message generated';
    } catch (error) {
      throw createError('API_ERROR', (error as Error).message);
    }
  }

  async getAvailableModels(): Promise<Model[]> {
    try {
      const response = await this.client.models.list();

      return response.data || [];
    } catch (error) {
      throw createError('API_ERROR', (error as Error).message);
    }
  }
}
