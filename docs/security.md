# AI App Ecosystem — Security Model

## Threat Model

| Threat | Severity | Mitigation |
|--------|----------|------------|
| Prompt Injection via MCP | HIGH | Input sanitization + sandboxed tool execution + output validation before acting |
| Token Exfiltration | HIGH | Short-lived JWTs (15 min), refresh rotation, device fingerprinting, anomaly detection |
| Data Leakage via RAG | HIGH | User-scoped embedding namespaces + PostgreSQL RLS enforced before retrieval |
| Supply Chain Attack | MED | Signed packages (Sigstore), MCP registry verification, lockfile pinning, Dependabot |
| Agent Scope Creep | MED | Per-session tool allowlists, human-in-the-loop for destructive actions, immutable audit log |
| Offline Data Exposure | MED | Encrypted local storage (Keychain/Keystore), remote wipe, biometric lock |

## Security Controls

### Identity & Access (Zero-Trust)
- **OAuth 2.1 + PKCE**: No legacy implicit flows. All authorization uses PKCE with S256 challenge method.
- **JWT Lifetime**: Access tokens expire in 15 minutes. Refresh tokens rotate on use.
- **MFA**: Required at account level. TOTP, WebAuthn (passkeys), and backup codes supported.
- **Per-app scopes**: Calendar app cannot read notes without explicit user consent. Scopes follow the `app:action` pattern.
- **Single Sign-On**: One identity across all ecosystem surfaces.

### Transport Security
- TLS 1.3 mandatory on all connections; no downgrade permitted.
- Certificate pinning on Flutter and React Native clients.
- MCP traffic integrity verified with HMAC per request.
- E2E encryption for user messages using Signal Protocol.
- HSTS headers enforced; DNSSEC on all owned domains.

### App Isolation (Least Privilege)
- Each app runs as an independent MCP server with isolated credentials.
- Inter-app data access goes through the MCP Router — never via direct database queries.
- PostgreSQL Row-Level Security ensures users only see their own rows, even if a query bug exists.
- AI agents operate in sandboxed tool scopes scoped to the current session.
- Secrets stored in HashiCorp Vault; zero hardcoded credentials in code or environment files checked into version control.

### Data Protection
- AES-256-GCM encryption at rest; per-user key derivation using PBKDF2 (SHA-256, 310,000 iterations).
- User data is never used to train AI models without explicit opt-in.
- PII is stripped from all log and telemetry pipelines automatically before storage.
- Users choose data residency region (EU / US / APAC) at account creation.
- Right-to-delete: full data purge within 30 days of request, with confirmation receipt.

### Audit & Detection
- Immutable audit log for every MCP tool call and AI-initiated action.
- ML-based anomaly detection on API access patterns (velocity, geography, scope changes).
- Prompt injection detection layer runs before every LLM inference call.
- Real-time alerting on unusual data volume or access spikes.
- Quarterly penetration testing; public bug bounty program.

### CI/CD Security
- `npm audit` blocks merges on HIGH/CRITICAL findings.
- Snyk scans run on every PR.
- Dependabot opens PRs for dependency updates weekly.
- GitHub Actions uses pinned action versions (SHA-pinned for third-party actions).
- Secrets never appear in build logs; all sensitive values sourced from GitHub Secrets.

## Compliance Roadmap

| Standard | Status | Notes |
|----------|--------|-------|
| GDPR | By design | Consent management, data portability, right-to-delete |
| CCPA | By design | Data categories disclosed, opt-out supported |
| EU Cyber Resilience Act | By design | Vulnerability disclosure, update support |
| SOC 2 Type II | Roadmap | Controls instrumented from day one |
| EU AI Act | By design | Users informed of AI actions, human override available |

## Authentication Flow

```
1. User initiates login
2. Client generates PKCE code_verifier + code_challenge (S256)
3. Authorization request sent with code_challenge
4. Auth Gateway validates request, issues authorization code
5. Client exchanges code + code_verifier for OAuth2Token
6. Short-lived JWT (15 min) issued; refresh token stored encrypted
7. MFA challenge issued if not recently completed
8. On expiry: refresh token used to obtain new access token (refresh rotates)
9. Anomaly detector monitors token usage patterns throughout session
```

## Incident Response

1. **Detection**: Anomaly alert or bug report received.
2. **Triage**: Severity classified within 1 hour (Critical/High/Med/Low).
3. **Containment**: Affected tokens/sessions revoked immediately for Critical issues.
4. **Eradication**: Root cause identified and patch developed.
5. **Recovery**: Patch deployed, affected users notified per legal requirements.
6. **Post-mortem**: Blameless post-mortem published internally within 5 business days.

Critical vulnerabilities: patch within 24 hours.
High vulnerabilities: patch within 7 days.
