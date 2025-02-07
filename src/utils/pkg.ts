import { readFileSync } from 'fs';
import { join } from 'path';

interface PackageJson {
  name: string;
  version: string;
  description: string;
}

export function getPackageInfo(): PackageJson {
  try {
    const pkgPath = join(__dirname, '../../package.json');
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));

    return {
      name: pkg.name || 'groq-commit',
      version: pkg.version || '0.0.0',
      description: pkg.description || 'Generate commit messages using Groq AI',
    };
  } catch (error) {
    return {
      name: 'groq-commit',
      version: '0.0.0',
      description: 'Generate commit messages using Groq AI',
    };
  }
}
