# GitHub Repository Setup Guide

This guide walks you through configuring the AI App Ecosystem repository on GitHub.

## 1. Branch Protection (main)

Go to **Settings → Branches → Add rule**:
- Pattern: `main`
- ✅ Require a pull request before merging
- ✅ Require code reviews (at least 1)
- ✅ Require status checks to pass before merging
- ✅ Require branches to be up to date before merging
- ✅ Require code review from code owners

Required status checks:
- `lint`
- `type-check`
- `test`
- `security`
- `build`

## 2. GitHub Secrets

Go to **Settings → Secrets and variables → Actions** and create:

| Secret Name | Purpose |
|-------------|---------|
| `SNYK_TOKEN` | Dependency scanning (from snyk.io) |
| `CODECOV_TOKEN` | Coverage tracking (from codecov.io) |
| `NPM_TOKEN` | Optional: publish packages to npm |

## 3. Code Owners

Create `.github/CODEOWNERS`:

```
# Root configuration
package.json @your-github-username
tsconfig.json @your-github-username

# Core packages
packages/types/ @your-github-username
packages/shared/ @your-github-username
packages/core/ @your-github-username

# Apps
packages/apps/ @your-github-username

# Docs
docs/ @your-github-username
README.md @your-github-username
```

## 4. Dependabot

Create `.github/dependabot.yml`:

```yaml
version: 2
updates:
  - package-ecosystem: npm
    directory: "/"
    schedule:
      interval: weekly
      day: monday
      time: "09:00"
    labels:
      - dependencies
    commit-message:
      prefix: "chore"

  - package-ecosystem: github-actions
    directory: "/"
    schedule:
      interval: weekly
    labels:
      - ci
    commit-message:
      prefix: "ci"
```

## 5. Issue Templates

Create `.github/ISSUE_TEMPLATE/bug_report.md`:

```markdown
---
name: Bug Report
about: Report a bug to help us improve
---

## Describe the bug

## Steps to reproduce
1.
2.

## Expected behavior

## Actual behavior

## Environment
- Node version:
- OS:
- Package version:
```

Create `.github/ISSUE_TEMPLATE/feature_request.md`:

```markdown
---
name: Feature Request
about: Suggest an enhancement
---

## Is your feature related to a problem?

## Describe the solution

## Alternatives considered

## Additional context
```

## 6. PR Template

Create `.github/PULL_REQUEST_TEMPLATE.md`:

```markdown
## Description

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How has this been tested?

## Security Checklist
- [ ] No hardcoded secrets
- [ ] User input sanitized
- [ ] Permissions checked before data access
- [ ] Audit log entry for sensitive operations

## Related Issues
Closes #
```

## 7. Repository Topics

Under **Settings → General → Topics**, add:
- `ai-native`
- `mcp-protocol`
- `monorepo`
- `typescript`
- `security`
- `claude`

## 8. Verify CI/CD

Create a test branch:
```bash
git checkout -b feature/test-ci
echo "# CI test" >> README.md
git add README.md
git commit -m "test: verify CI pipeline"
git push origin feature/test-ci
```

Open a PR and confirm all 5 jobs pass (lint, type-check, test, security, build).

## Post-Launch Checklist

- [ ] Branch protection configured on `main`
- [ ] GitHub Secrets added
- [ ] CI/CD pipeline verified passing
- [ ] Code owners file created
- [ ] Dependabot enabled
- [ ] Issue and PR templates created
- [ ] Repository topics set
- [ ] First Phase 1 issues created
