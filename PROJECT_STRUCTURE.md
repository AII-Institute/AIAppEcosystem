# AI App Ecosystem - Project Structure

## Directory Tree

```
ai-app-ecosystem/
├── .github/
│   └── workflows/
│       └── ci.yml                      # GitHub Actions CI/CD pipeline
│
├── .husky/
│   └── pre-commit                      # Git pre-commit hook
│
├── packages/
│   ├── types/                          # Shared TypeScript definitions
│   │   ├── src/
│   │   │   └── index.ts                # 200+ core type definitions
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── shared/                         # Shared utilities & constants
│   │   ├── src/
│   │   │   └── index.ts                # Utilities and constants
│   │   ├── tests/
│   │   │   └── shared.test.ts          # Utility tests
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── core/                           # Core ecosystem runtime (TO IMPLEMENT)
│   │   ├── mcp-router/                 # MCP protocol routing
│   │   │   ├── src/
│   │   │   │   ├── router.ts
│   │   │   │   ├── capability-registry.ts
│   │   │   │   └── event-bus.ts
│   │   │   └── package.json
│   │   │
│   │   ├── auth-gateway/               # OAuth 2.1 & PKCE
│   │   │   ├── src/
│   │   │   │   ├── auth-service.ts
│   │   │   │   ├── token-manager.ts
│   │   │   │   └── mfa.ts
│   │   │   └── package.json
│   │   │
│   │   ├── context-store/              # Redis session store
│   │   │   ├── src/
│   │   │   │   ├── context-manager.ts
│   │   │   │   └── encryption.ts
│   │   │   └── package.json
│   │   │
│   │   └── llm-orchestrator/           # LLM routing & inference
│   │       ├── src/
│   │       │   ├── orchestrator.ts
│   │       │   ├── model-router.ts
│   │       │   └── cost-tracker.ts
│   │       └── package.json
│   │
│   ├── apps/                           # Application implementations (TO IMPLEMENT)
│   │   ├── calendar/                   # Calendar app (Next.js)
│   │   ├── notes/                      # Notes app with RAG (Next.js)
│   │   ├── tasks/                      # Task management (Next.js)
│   │   └── comms/                      # Messaging & email (Next.js)
│   │
│   ├── mobile/                         # Mobile app implementations (TO IMPLEMENT)
│   │   ├── flutter-ui/                 # Flutter cross-platform
│   │   └── rn-common/                  # React Native shared components
│   │
│   ├── agents/                         # Agent & workflow implementations (TO IMPLEMENT)
│   │   ├── mcp-servers/                # MCP server instances
│   │   └── workflows/                  # Agent orchestration workflows
│   │
│   └── infra/                          # Infrastructure & DevOps (TO IMPLEMENT)
│       ├── docker/
│       ├── kubernetes/
│       ├── terraform/
│       └── observability/
│
├── docs/
│   ├── architecture.md                 # System architecture guide ✅
│   └── security.md                     # Security model & threat analysis ✅
│
├── .eslintrc.json                      # ESLint configuration
├── .prettierrc.json                    # Prettier formatting config
├── .gitignore                          # Git ignore rules
├── .lintstagedrc.json                  # Lint-staged configuration
├── package.json                        # Monorepo root
├── tsconfig.json                       # TypeScript configuration
├── turbo.json                          # Turbo build orchestration
├── CONTRIBUTING.md                     # Contribution guidelines
├── README.md                           # Project overview
├── GITHUB_SETUP.md                     # GitHub setup guide
├── QUICK_START.md                      # 5-minute developer guide
└── PROJECT_STRUCTURE.md                # This file
```

## Package Status

### Core Packages

| Package | Purpose | Status |
|---------|---------|--------|
| `@ecosystem/types` | Shared TypeScript definitions | ✅ Complete |
| `@ecosystem/shared` | Utilities, constants, helpers | ✅ Complete |
| `@ecosystem/core:mcp-router` | MCP request routing | 📝 Phase 1 |
| `@ecosystem/core:auth-gateway` | OAuth 2.1 + PKCE auth | 📝 Phase 1 |
| `@ecosystem/core:context-store` | Session state management | 📝 Phase 1 |
| `@ecosystem/core:llm-orchestrator` | LLM model routing | 📝 Phase 1 |

### Application Packages

| App | Framework | Purpose | Status |
|-----|-----------|---------|--------|
| `@ecosystem/app-calendar` | Next.js | Scheduling & events | 📝 Phase 2 |
| `@ecosystem/app-notes` | Next.js | Writing & RAG search | 📝 Phase 2 |
| `@ecosystem/app-tasks` | Next.js | Task management | 📝 Phase 2 |
| `@ecosystem/app-comms` | Next.js | Messaging & email | 📝 Phase 2 |

### Infrastructure

| Component | Technology | Status |
|-----------|-----------|--------|
| Docker | Docker Compose | 📝 Phase 1 |
| Kubernetes | K8s + Kustomize | 📝 Phase 3 |
| Terraform | HCL | 📝 Phase 3 |
| Observability | OTel + Grafana | 📝 Phase 3 |

## Development Workflow

```bash
# 1. Create feature branch
git checkout -b feature/my-feature

# 2. Make changes & verify
npm run type-check && npm run lint && npm run test

# 3. Commit with conventional format
git commit -m "feat(scope): description"

# 4. Push and open PR
git push origin feature/my-feature
```

## Next Steps by Phase

### Phase 1 (Core Infrastructure)
- [ ] MCP Router — tool discovery & capability registry
- [ ] Auth Gateway — OAuth 2.1 + PKCE + MFA
- [ ] Context Store — encrypted Redis sessions
- [ ] LLM Orchestrator — Claude API + model routing
- [ ] Docker Compose for local development
- [ ] PostgreSQL schema with RLS

### Phase 2 (First Apps)
- [ ] Calendar app scaffolding
- [ ] Notes app with RAG
- [ ] Tasks app
- [ ] Shared UI component library

### Phase 3 (Mobile & Scale)
- [ ] Flutter app
- [ ] React Native components
- [ ] Kubernetes manifests
- [ ] Terraform IaC

---

**Project Status**: Foundation Phase ✅
**Last Updated**: 2026-04-30
**Version**: 1.0.0
