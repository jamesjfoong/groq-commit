# groq-commit Feature Development Guide

## Project Context
groq-commit is a CLI tool that generates commit messages using Groq AI. The project is built with TypeScript and follows a service-based architecture.

## Core Components

### Services
- `AiService`: Handles Groq API interactions for message generation
- `ConfigService`: Manages application configuration using Configstore
- `GitService`: Interfaces with git operations using simple-git
- `PromptService`: Handles prompt template management and generation

### Utils
- `logger`: Provides formatted console output with chalk
- `spinner`: Shows loading indicators using ora
- `errors`: Centralizes error handling with custom error codes

## Development Guidelines

1. **Architecture**
   - Follow service-based pattern
   - Use dependency injection via services.ts
   - Keep services single-responsibility

2. **TypeScript Best Practices**
   - Use strict typing
   - Define interfaces for all service methods
   - Avoid any type when possible

3. **Error Handling**
   - Use createError utility with predefined error codes
   - Handle async operations with try/catch
   - Provide meaningful error messages

4. **CLI Commands**
   - Follow Commander.js patterns
   - Include help text and options
   - Support --help flag

5. **Configuration**
   - Use ConfigService for all settings
   - Support environment variables
   - Provide sensible defaults

6. **Testing**
   - Write unit tests for services
   - Mock external dependencies
   - Test error scenarios

## Feature Implementation Checklist

1. [ ] Define interfaces and types
2. [ ] Implement service logic
3. [ ] Add error handling
4. [ ] Create CLI command (if needed)
5. [ ] Update configuration (if needed)
6. [ ] Add tests
7. [ ] Update documentation

## VSCode Setup

1. **Extensions**
   - ESLint: JavaScript/TypeScript linting
   - Prettier: Code formatting
   - TypeScript Hero: Import organization
   - GitLens: Enhanced git features

2. **Workspace Settings**
   - Enable format on save
   - Use TypeScript workspace version
   - Set EOL to LF
   - Enable ESLint auto-fix

3. **Debug Configuration**
   - Launch configurations for debugging CLI
   - Support for breakpoints in TypeScript
   - Source map support enabled

4. **Tasks**
   - Build task (tsc)
   - Test task (jest)
   - Lint task (eslint)
   - Watch task for development

## Dependencies

Core:
- groq-sdk: Groq API client
- commander: CLI framework
- configstore: Configuration management
- simple-git: Git operations
- chalk: Terminal styling
- ora: Loading spinners

Dev:
- typescript
- eslint
- prettier
- ts-node
