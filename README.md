# AI App Ecosystem

A cross-platform, AI-native application ecosystem with secure MCP protocol integration, unified authentication, and intelligent agent orchestration.

## Architecture

```
User Interfaces (iOS, Android, Web, Desktop, Wearables)
         ↓  OAuth 2.1 · Single Sign-On
    Auth Gateway
         ↓  MCP Protocol · JSON-RPC 2.0 · TLS 1.3
    MCP Router ── Context Store
         ↓  Scoped API Keys · Sandboxed Inference
AI Core (LLM Orchestrator · RAG Engine · Agent Runtime · Edge Inference)
         ↓  Encrypted at Rest · Row-Level Security
Data Layer (PostgreSQL + pgvector · S3 · Observability)
```

## Workspace Structure

```
packages/
├── types/          # Shared TypeScript types (200+ definitions)
├── shared/         # Utilities, constants, permission scopes
└── core/
    ├── mcp-router/       # MCP protocol routing — Phase 1
    ├── auth-gateway/     # OAuth 2.1 + PKCE — Phase 1
    ├── context-store/    # Redis session state — Phase 1
    └── llm-orchestrator/ # Model routing — Phase 1
```

## Quick Start

```bash
npm install
npm run type-check   # verify setup
npm run test         # run tests
```

## Commands

```bash
npm run type-check   # TypeScript strict check across all packages
npm run lint         # ESLint
npm run lint:fix     # Auto-fix lint issues
npm run test         # Jest
npm run build        # Compile all packages
npm run clean        # Remove dist/
```

## Security Controls

| Threat | Risk | Mitigation |
|--------|------|-----------|
| Prompt Injection via MCP | HIGH | Input sanitization + sandboxed execution + output validation |
| Token Exfiltration | HIGH | Short-lived JWTs (15 min), refresh rotation, device fingerprinting |
| Data Leakage via RAG | HIGH | User-scoped embedding namespaces + PostgreSQL RLS |
| Supply Chain Attack | MED | Lockfile pinning, Dependabot, npm audit in CI |
| Agent Scope Creep | MED | Per-session tool allowlists, human-in-the-loop, immutable audit log |
| Offline Data Exposure | MED | Encrypted local storage, remote wipe, biometric lock |

Full threat model: [docs/security.md](./docs/security.md)

## Common Issues

**"Module not found"** → `npm install`

**TypeScript errors in IDE** → Restart TS server (`Cmd+Shift+P → TypeScript: Restart TS Server`)

**Lint-staged fails on commit** → `npm run lint:fix` then retry

## Roadmap

- [ ] Phase 1: MCP Router, Auth Gateway, Context Store, LLM Orchestrator
- [ ] Phase 2: Calendar, Notes, Tasks, Comms apps (Next.js)
- [ ] Phase 3: Mobile (Flutter / React Native)
- [ ] Phase 4: Agent runtime & workflows
- [ ] Phase 5: RAG engine & edge inference
- [ ] Phase 6: Multi-region deployment (Docker → K8s → Terraform)

## Docs

- [Architecture](./docs/architecture.md)
- [Security Model](./docs/security.md)
- [Contributing](./CONTRIBUTING.md)
- [GitHub Setup](./GITHUB_SETUP.md)
