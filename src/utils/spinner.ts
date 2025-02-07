import ora, { Ora } from 'ora';

export class Spinner {
  private spinner: Ora;

  constructor() {
    this.spinner = ora();
  }

  start(text: string): this {
    this.spinner.text = text;
    this.spinner.start();

    return this;
  }

  async wrap<T>(text: string, promise: Promise<T>): Promise<T> {
    this.start(text);
    try {
      const result = await promise;

      this.spinner.succeed();

      return result;
    } catch (error) {
      this.spinner.fail();
      throw error;
    }
  }

  succeed(text?: string): this {
    this.spinner.succeed(text);

    return this;
  }

  fail(text?: string): this {
    this.spinner.fail(text);

    return this;
  }
}

export const spinner = new Spinner();
