# AI App Ecosystem — Architecture Guide

## System Overview

The AI App Ecosystem is a monorepo implementing a layered, AI-native platform with secure MCP protocol integration. Every layer communicates through well-defined interfaces with authentication enforced at every boundary.

## Layer Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Interface Layer                           │
│  iOS/Android (Flutter/RN) │ Web (Next.js) │ Desktop (Tauri) │
└────────────────────────────┬────────────────────────────────┘
                             │ OAuth 2.1 · Single Sign-On
┌────────────────────────────▼────────────────────────────────┐
│                      App Layer                               │
│  Calendar App │ Notes App │ Tasks App │ Comms App            │
└────────────────────────────┬────────────────────────────────┘
                             │ MCP Protocol · JSON-RPC 2.0 · TLS 1.3
┌────────────────────────────▼────────────────────────────────┐
│                    Protocol Bus                              │
│  MCP Router │ Auth Gateway │ Context Store                   │
└────────────────────────────┬────────────────────────────────┘
                             │ Scoped API Keys · Sandboxed Inference
┌────────────────────────────▼────────────────────────────────┐
│                      AI Core                                 │
│  LLM Orchestrator │ RAG Engine │ Agent Runtime │ Edge Infer. │
└────────────────────────────┬────────────────────────────────┘
                             │ Encrypted at Rest · Row-Level Security
┌────────────────────────────▼────────────────────────────────┐
│                     Data Layer                               │
│  PostgreSQL + pgvector │ S3-compatible │ Observability        │
└─────────────────────────────────────────────────────────────┘
```

## Request Flow

```
User Input
    │
    ▼ HTTPS + JWT
App Client (Flutter / Next.js)
    │
    ▼ MCP call
Auth Gateway  ──  validates token, checks scopes
    │
    ▼ authorized
MCP Router  ──  discovers tools, routes request
    │
    ▼ context + tools
LLM Orchestrator  ──  Claude API
    │
    ▼ fetch / write
Data Layer  ──  encrypted PostgreSQL
    │
    ▼ response
Back to User
```

## Package Structure

### `packages/types`
Single source of truth for all TypeScript types across the ecosystem. All packages import from here — never define types inline.

### `packages/shared`
Stateless utilities, constants, and helpers. No side effects, fully testable.

### `packages/core/mcp-router`
Routes JSON-RPC 2.0 requests to the correct MCP server. Maintains a capability registry of all registered tools and resources.

**Key responsibilities:**
- Tool discovery and capability advertisement
- Request routing and load balancing
- Bidirectional event bus (A2A protocol)
- Health monitoring of MCP servers

### `packages/core/auth-gateway`
OAuth 2.1 + PKCE implementation. Every request through the MCP Router must pass through here first.

**Key responsibilities:**
- Token validation (JWT signature + expiry)
- Scope enforcement per tool call
- Rate limiting per user/app
- MFA challenge issuance

### `packages/core/context-store`
Encrypted Redis-backed session state shared across apps.

**Key responsibilities:**
- Conversation history per session
- Cross-app context propagation
- Session lifecycle management
- Encrypted storage with per-user keys

### `packages/core/llm-orchestrator`
Routes LLM requests to the optimal model based on task complexity, cost, and latency requirements.

**Key responsibilities:**
- Model selection (Claude primary)
- Cost and token budget tracking
- Fallback chain management
- Prompt injection detection before inference

### `packages/apps/*`
Next.js web applications, each with its own MCP server.

### `packages/mobile/*`
Flutter and React Native implementations sharing business logic.

### `packages/agents/*`
MCP server implementations and LangGraph-based workflow orchestration.

### `packages/infra/*`
Docker, Kubernetes, Terraform, and observability configurations.

## Adding a New App

1. **Create the package:**
   ```bash
   mkdir -p packages/apps/my-app/src
   cp packages/apps/calendar/package.json packages/apps/my-app/package.json
   # Update name to @ecosystem/app-my-app
   ```

2. **Register an MCP server** in `packages/core/mcp-router` by implementing `MCPCapability` from `@ecosystem/types`.

3. **Define scopes** in `packages/types/src/index.ts` following the `app:action` pattern.

4. **Add CI checks** — the existing workflow covers all packages automatically.

## Development Workflow

1. Changes to `packages/types` trigger rebuilds of all downstream packages (enforced by Turbo).
2. Each package has its own `build`, `test`, `lint`, and `type-check` scripts.
3. Pre-commit hooks run lint-staged on changed files only.
4. CI runs on every push and PR against Node 18 and 20.

## Deployment

- **Local**: `docker-compose up` in `packages/infra/docker`
- **Staging**: Terraform in `packages/infra/terraform/environments/staging`
- **Production**: Kubernetes via `packages/infra/kubernetes`
