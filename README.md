# groq-commit

A CLI tool to generate commit messages using Groq AI from git diff.

## Features
- 🤖 Uses Groq AI to analyze git changes and generate meaningful commit messages
- ⚡ Fast and lightweight
- 🔧 Configurable settings (model, temperature, tokens, etc)
- 🔄 Auto-commit option available
- 🎨 Pretty console output with status indicators

## Installation

```bash
npm install -g groq-commit
```

## Usage

1. Set up your Groq API key and preferences:
```bash
groq-commit setup
```

2. Generate a commit message from your changes:
```bash
groq-commit generate
```

3. Generate and automatically commit changes:
```bash
groq-commit generate --auto-commit
```

## Commands

- `setup` - Configure Groq API key and preferences
- `generate` - Generate commit message from current changes
- `config list` - Display current configuration
- `config reset` - Reset configuration to defaults

## Project Structure
```
src/
  ├── commands/      # CLI command implementations
  ├── services/      # Core business logic and services
  ├── utils/         # Shared utilities and helpers
  └── index.ts       # Main entry point
```

## Requirements
- Node.js >= 14.0.0
- Groq API key

## License

MIT © [James Jeremy Foong](https://github.com/jamesjfoong)
