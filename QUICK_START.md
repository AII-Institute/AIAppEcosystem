# Quick Start Guide

Get up and running with the AI App Ecosystem in 5 minutes.

## Prerequisites

- **Node.js**: 18+ ([Download](https://nodejs.org/))
- **npm**: 9+ (comes with Node)
- **Git**: ([Download](https://git-scm.com/))

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/aii-institute/aiappecosystem.git
cd aiappecosystem
```

## 2️⃣ Install Dependencies

```bash
npm install
```

## 3️⃣ Set Up Git Hooks

```bash
npm run install-hooks
```

## 4️⃣ Verify Setup

```bash
npm run type-check   # ✅ No TypeScript errors
npm run lint         # ✅ No linting errors
npm run test         # ✅ All tests passed
```

## 5️⃣ Available Commands

```bash
# Code quality
npm run type-check      # Type check all packages
npm run lint            # Check code style
npm run lint:fix        # Fix code style automatically

# Testing
npm run test            # Run all tests
npm run test:watch      # Run tests in watch mode

# Building
npm run build           # Build all packages
npm run clean           # Remove build artifacts

# Development
npm run dev             # Start all apps in dev mode (once implemented)
```

## Creating a Feature

```bash
git checkout -b feature/my-feature

# Make changes to relevant packages
# e.g., packages/shared/src/index.ts

npm run lint:fix
npm run type-check
npm run test

git add packages/my-package/...
git commit -m "feat(scope): add my feature"
git push origin feature/my-feature
# Open PR on GitHub
```

## Adding a New Package

```bash
mkdir -p packages/my-package/src packages/my-package/tests

cp packages/shared/package.json packages/my-package/package.json
# Update "name" to "@ecosystem/my-package"

cp packages/shared/tsconfig.json packages/my-package/tsconfig.json
touch packages/my-package/src/index.ts

npm install
npm run type-check
```

## Project Structure at a Glance

```
packages/
├── types/     ← Shared type definitions (edit when adding new types)
├── shared/    ← Utilities & constants (edit for shared logic)
├── core/      ← Core infrastructure (implement Phase 1 here)
├── apps/      ← Web applications (Next.js)
├── mobile/    ← Mobile apps (Flutter / React Native)
├── agents/    ← AI agent workflows
└── infra/     ← Deployment & infrastructure
```

## Common Issues

**"Module not found"** — Run `npm install`

**"Type errors" in IDE** — Restart TypeScript server (`Cmd+Shift+P → TypeScript: Restart TS Server` in VS Code)

**"lint-staged failed" on commit** — Run `npm run lint:fix` then try again

**Node version mismatch** — Use `nvm install 20 && nvm use 20`

## IDE Setup (VS Code)

Install extensions: ESLint, Prettier

`.vscode/settings.json`:
```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": { "source.fixAll.eslint": true },
  "typescript.enablePromptUseWorkspaceTsdk": true
}
```

## Documentation

- **Architecture**: [docs/architecture.md](./docs/architecture.md)
- **Security**: [docs/security.md](./docs/security.md)
- **Contributing**: [CONTRIBUTING.md](./CONTRIBUTING.md)
- **GitHub Setup**: [GITHUB_SETUP.md](./GITHUB_SETUP.md)

---

**Happy coding!** 🚀
