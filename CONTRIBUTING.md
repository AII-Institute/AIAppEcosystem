# Contributing to AI App Ecosystem

## Development Workflow

### 1. Branch Strategy
- `main` — production-ready code, protected
- `develop` — integration branch
- `feature/description` — new features
- `fix/description` — bug fixes
- `chore/description` — maintenance tasks

### 2. Making Changes

```bash
git checkout -b feature/my-feature

# Edit files in relevant packages
npm run type-check    # Verify types
npm run lint:fix      # Fix linting
npm run test          # Run tests

git add packages/relevant-package/...
git commit -m "feat(scope): brief description"
git push origin feature/my-feature
```

### 3. Commit Message Format

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <short description>

[optional body]
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `ci`
Scopes: `types`, `shared`, `mcp-router`, `auth-gateway`, `context-store`, `llm-orchestrator`, `calendar`, `notes`, `tasks`, `comms`, `mobile`, `agents`, `infra`

Examples:
- `feat(mcp-router): add capability registry TTL`
- `fix(auth-gateway): handle token refresh race condition`
- `docs(architecture): add edge inference diagram`

## Code Standards

### TypeScript
- Strict mode always on — no `any`, no `@ts-ignore` without explanation
- Explicit return types on exported functions
- Use `Result<T, E>` from `@ecosystem/types` for fallible operations
- Import types from `@ecosystem/types`; utilities from `@ecosystem/shared`

### Testing
- Unit tests alongside source in `tests/` directory
- Minimum 80% coverage on new code
- Use `jest` — no additional test frameworks
- Test file naming: `feature.test.ts`

### Security Checklist (required for all PRs)
- [ ] No hardcoded secrets or credentials
- [ ] User input sanitized with `sanitizeInput()` from `@ecosystem/shared`
- [ ] Permissions checked before accessing user data
- [ ] New scopes added to `@ecosystem/types` and documented
- [ ] Audit log entry created for sensitive operations
- [ ] `npm audit` clean at HIGH level

## Pull Request Process

1. CI must pass (lint, type-check, tests, security scan, build)
2. At least 1 approving review required
3. Branch must be up to date with target
4. PR description must explain the change and link related issues
5. Breaking changes require a `BREAKING CHANGE:` footer in commit message

## Adding a New Package

```bash
mkdir -p packages/my-package/src packages/my-package/tests

# Copy and update package.json
cp packages/shared/package.json packages/my-package/package.json
# Set "name": "@ecosystem/my-package"

cp packages/shared/tsconfig.json packages/my-package/tsconfig.json
touch packages/my-package/src/index.ts

npm install
npm run type-check
```

## Getting Help

- Check `docs/architecture.md` for design questions
- Check `docs/security.md` for security questions
- Open a GitHub Discussion for general questions
- Open a GitHub Issue for bugs
