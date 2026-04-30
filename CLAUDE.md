# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Install dependencies and setup hooks
npm install
npm run install-hooks

# Development
npm run dev              # Start Teachly app (port 3010)

# Quality checks (run before committing)
npm run type-check
npm run lint
npm run lint:fix

# Testing
npm run test             # All tests with coverage
npm run test:watch       # Watch mode (shared package only has tests)

# Build
npm run build            # Full monorepo build via Turbo
npm run clean            # Remove all dist/ and node_modules
```

All commands use Turbo for task orchestration with proper dependency ordering (`build` requires `^build` — dependencies built first).

## Architecture

This is an npm workspaces + Turbo monorepo. Dependency flow is strictly one-directional:

```
@ecosystem/types  →  @ecosystem/shared  →  core packages  →  apps
```

**Packages:**

- `packages/types` — All shared TypeScript types (200+ definitions). Single source of truth; never define types inline in other packages.
- `packages/shared` — Utility functions, constants (JWT TTLs, permission scopes), sanitization, retry logic. Only package with Jest tests.
- `packages/core/auth-gateway` — OAuth 2.1 + PKCE, short-lived JWTs (15 min), refresh token rotation, MFA.
- `packages/core/mcp-router` — MCP/JSON-RPC 2.0 protocol routing, capability registry, tool discovery.
- `packages/core/context-store` — Redis-backed encrypted session state, `AppContext` propagation.
- `packages/core/llm-orchestrator` — LLM model routing and inference orchestration.
- `packages/apps/teachly` — Next.js 14.2 app for live K-12 classes. Uses `@/` path alias for `src/`.

## Key Patterns

**Error handling** — Use `Result<T, E = Error>` discriminated union for sync and `AsyncResult<T, E = Error>` for async. These types come from `@ecosystem/types`.

**TypeScript** — Strict mode is enforced. No `any`, no implicit returns, no unused variables. Target: ES2022, module: CommonJS. All packages emit declaration maps.

**MCP tools in Teachly** — Seven tools defined (`listClasses`, `createClass`, `listActivities`, `submitActivity`, `listCommunityPosts`, `createCommunityPost`, `getStudentProgress`). Each tool has required permission scopes tied to `TeachlyRole` (teacher/parent/student).

**Commits** — Conventional commit format required: `<type>(<scope>): <description>`. Types: feat, fix, chore, docs, refactor, test. Pre-commit hook (Husky + lint-staged) auto-runs ESLint fix and Prettier on staged files.

**Adding a new core package** — Must be placed under `packages/core/`, named `@ecosystem/core-<name>`, and added to root `package.json` workspaces. Should depend only on `@ecosystem/types` and `@ecosystem/shared`.

## CI

Five parallel GitHub Actions jobs run on push to `main`/`develop` and all PRs: lint → type-check → test (with Codecov) → security (npm audit HIGH + Snyk) → build. All must pass before merging.
