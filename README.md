# AI App Ecosystem

A cross-platform, AI-native application ecosystem with secure MCP protocol integration, unified authentication, and intelligent agent orchestration.

## 🏗️ Architecture Overview

This monorepo implements the full stack design from the AI Ecosystem Architecture & Security specification:

- **Interface Layer**: iOS, Android, Web, Desktop, Wearables
- **App Layer**: Calendar, Notes, Tasks, Communications
- **Protocol Bus**: MCP Router, Auth Gateway, Context Store
- **AI Core**: LLM Orchestrator, RAG Engine, Agent Runtime, Edge Inference
- **Data Layer**: PostgreSQL, S3, Observability

## 📦 Workspace Structure

```
ai-app-ecosystem/
├── packages/
│   ├── types/                    # Shared TypeScript types
│   ├── shared/                   # Shared utilities and constants
│   ├── core/                     # Core ecosystem runtime
│   │   ├── mcp-router/          # MCP protocol routing
│   │   ├── auth-gateway/        # OAuth 2.1 & PKCE implementation
│   │   ├── context-store/       # Distributed session state
│   │   └── llm-orchestrator/    # Model routing & inference
│   ├── apps/
│   │   ├── calendar/            # Calendar app (Next.js)
│   │   ├── notes/               # Notes app with RAG (Next.js)
│   │   ├── tasks/               # Task management (Next.js)
│   │   └── comms/               # Messaging & email (Next.js)
│   ├── mobile/
│   │   ├── flutter-ui/          # Flutter cross-platform base
│   │   └── rn-common/           # React Native shared components
│   ├── agents/
│   │   ├── mcp-servers/         # MCP server implementations
│   │   └── workflows/           # Agent orchestration workflows
│   └── infra/
│       ├── docker/              # Container configurations
│       ├── terraform/           # IaC for cloud deployment
│       └── observability/       # Logging, metrics, tracing
├── docs/                         # Architecture & API documentation
├── .github/                      # GitHub Actions CI/CD
└── .gitignore, package.json, etc.
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm 9+
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/aii-institute/aiappecosystem.git
cd aiappecosystem

# Install dependencies
npm install

# Install git hooks
npm run install-hooks
```

### Development

```bash
# Start all apps in development mode
npm run dev

# Run type checking across all packages
npm run type-check

# Lint all packages
npm run lint

# Run tests
npm run test
```

### Building

```bash
# Build all packages
npm run build

# Clean build artifacts
npm run clean
```

## 🔐 Security Architecture

### Identity & Access
- **OAuth 2.1 + PKCE**: Secure authorization flow with no legacy implicit grants
- **Single Sign-On**: One login across all ecosystem surfaces
- **JWT Tokens**: Short-lived (15 min) with rotating refresh tokens
- **MFA & Passkeys**: Multi-factor authentication enforced at account level
- **Scoped Permissions**: Per-app permission isolation

### Transport Security
- **TLS 1.3**: Mandatory encryption on all connections
- **Certificate Pinning**: Mobile client certificate verification
- **HMAC Signing**: Per-request MCP traffic integrity
- **E2E Encryption**: Signal Protocol for user messages
- **HSTS & DNSSEC**: Domain security enforcement

### Data Protection
- **AES-256 Encryption**: At-rest encryption with per-user key derivation (PBKDF2)
- **Row-Level Security**: PostgreSQL RLS enforces user data isolation
- **PII Stripping**: Automatic removal from logs and telemetry
- **Data Residency**: User-configurable region selection (EU/US/APAC)
- **Right-to-Delete**: Full data purge within 30 days on request

### Compliance
- **GDPR & CCPA**: Consent management and data portability built-in
- **EU Cyber Resilience Act**: Compliance by design
- **SOC 2 Type II**: Certification roadmap from day one
- **AI Act Transparency**: Users informed of AI actions
- **Dependency Scanning**: Automated security scanning in CI/CD

## 🛡️ Key Security Controls

| Threat | Risk | Mitigation |
|--------|------|-----------|
| Prompt Injection via MCP | HIGH | Input sanitization + sandboxed execution + output validation |
| Token Exfiltration | HIGH | Short-lived tokens, refresh rotation, device fingerprinting, anomaly detection |
| Data Leakage via RAG | HIGH | User-scoped embedding namespaces + row-level security |
| Supply Chain Attack | MED | Signed packages (Sigstore), MCP registry verification, lockfile pinning |
| Agent Scope Creep | MED | Per-session tool allowlists, human-in-the-loop, immutable audit log |
| Offline Data Exposure | MED | Encrypted local storage, remote wipe, biometric lock |

## 🔌 MCP Protocol

The **Model Context Protocol (MCP)** enables secure, bidirectional communication between apps and the AI core:

```
User Input → Auth Gateway → MCP Router → Tool Discovery → LLM Orchestrator → Claude API
                                ↓
                         Context Store
                                ↓
                           Data Layer
```

### MCP Implementation
- Protocol: **JSON-RPC 2.0 over SSE/HTTP** with TLS 1.3
- Capability Registry: Dynamic tool discovery per app
- Event Bus: Bidirectional A2A communication
- Scoped API Keys: Sandboxed inference with limited tool access

## 🤖 AI Core Components

### LLM Orchestrator
Routes requests to optimal models based on:
- Task complexity & cost
- Latency requirements
- Model capabilities
- User preferences

Supported models: Claude (primary), fallback to specialized models

### RAG Engine
Retrieval-augmented generation over user data:
- **pgvector**: PostgreSQL vector storage
- **Embeddings**: User data semantic indexing
- **Namespacing**: Per-user retrieval isolation
- **Row-Level Security**: Enforced before retrieval

### Agent Runtime
Autonomous multi-step workflows:
- **LangGraph**: Workflow orchestration
- **A2A Protocol**: App-to-app agent communication
- **Tool Allowlists**: Per-session capability scoping
- **Human-in-the-Loop**: Approval gates for destructive actions

### Edge Inference
On-device models for offline & low-latency:
- **CoreML**: iOS models
- **TFLite**: Android models
- Fallback to cloud when online

## 📚 Documentation

- [Architecture Deep Dive](./docs/architecture.md)
- [Security Model](./docs/security.md)
- [Contributing Guide](./CONTRIBUTING.md)
- [GitHub Setup](./GITHUB_SETUP.md)
- [Quick Start](./QUICK_START.md)
- [Project Structure](./PROJECT_STRUCTURE.md)

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm run test -- --coverage
```

## 📦 Deployment

### Docker
```bash
cd packages/infra/docker
docker-compose up
```

### Kubernetes / Cloud
See `packages/infra/terraform/` for IaC templates.

## 🤝 Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit changes (`git commit -m 'Add amazing feature'`)
3. Push to branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🎯 Roadmap

- [ ] Phase 1: MCP Router & Auth Gateway
- [ ] Phase 2: Calendar & Notes apps
- [ ] Phase 3: Mobile apps (Flutter/RN)
- [ ] Phase 4: Agent runtime & workflows
- [ ] Phase 5: Advanced RAG & edge inference
- [ ] Phase 6: Multi-region deployment

## 🔗 Resources

- [Model Context Protocol Spec](https://modelcontextprotocol.io/)
- [OAuth 2.1 Specification](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-v2-1-09)
- [GDPR Compliance Guide](https://gdpr-info.eu/)
- [OWASP Security Guidelines](https://owasp.org/)

---

**Built with ❤️ for AI-native applications**
