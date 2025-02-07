import Configstore from 'configstore';

export interface ConfigSchema {
  apiKey: string;
  model: string;
  maxTokens: number;
  temperature: number;
  promptTemplate: string;
}

const defaultConfig: ConfigSchema = {
  apiKey: process.env.GROQ_API_KEY || '',
  model: 'llama-3.3-70b-versatile',
  maxTokens: 500,
  temperature: 0.7,
  promptTemplate: '',
};

export class ConfigService {
  private store: Configstore;

  constructor() {
    this.store = new Configstore('groq-commit', defaultConfig);
  }

  get<T extends keyof ConfigSchema>(key: T): ConfigSchema[T] {
    return this.store.get(key);
  }

  set<T extends keyof ConfigSchema>(key: T, value: ConfigSchema[T]): void {
    this.store.set(key, value);
  }

  getAll(): ConfigSchema {
    return this.store.all;
  }

  reset(): void {
    this.store.clear();
    this.store.set(defaultConfig);
  }
}

export const config = new ConfigService();
