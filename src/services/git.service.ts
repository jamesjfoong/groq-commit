import { simpleGit, SimpleGit } from 'simple-git';

export class GitService {
  private git: SimpleGit;

  constructor() {
    this.git = simpleGit();
  }

  async getDiff(): Promise<string> {
    return this.git.diff(['--cached', '--unified=5']);
  }

  async getBranchName() {
    return this.git.revparse(['--abbrev-ref', 'HEAD']);
  }

  async commit(message: string) {
    return this.git.commit(message);
  }
}
