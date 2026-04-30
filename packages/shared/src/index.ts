import type { PermissionScope } from '@ecosystem/types';
import { createHash } from 'crypto';

// ── Configuration Constants ───────────────────────────────────

export const CONFIG = {
  JWT_EXPIRY_SECONDS: 900,        // 15 minutes
  REFRESH_TOKEN_EXPIRY_DAYS: 30,
  MFA_CHALLENGE_EXPIRY_SECONDS: 300,
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION_MINUTES: 15,
  MAX_AGENT_STEPS: 50,
  DEFAULT_AGENT_TIMEOUT_MS: 120_000,
  DEFAULT_LLM_MAX_TOKENS: 4096,
  DEFAULT_RAG_TOP_K: 10,
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  REQUEST_TIMEOUT_MS: 30_000,
  HEALTH_CHECK_INTERVAL_MS: 30_000,
} as const;

// ── Permission Scopes ─────────────────────────────────────────

export const SCOPES: Record<string, PermissionScope> = {
  CALENDAR_READ: 'calendar:read',
  CALENDAR_WRITE: 'calendar:write',
  NOTES_READ: 'notes:read',
  NOTES_WRITE: 'notes:write',
  TASKS_READ: 'tasks:read',
  TASKS_WRITE: 'tasks:write',
  COMMS_READ: 'comms:read',
  COMMS_WRITE: 'comms:write',
  PROFILE_READ: 'profile:read',
  PROFILE_WRITE: 'profile:write',
  SETTINGS_READ: 'settings:read',
  SETTINGS_WRITE: 'settings:write',
  AGENTS_EXECUTE: 'agents:execute',
  ADMIN_READ: 'admin:read',
  ADMIN_WRITE: 'admin:write',
} as const;

export const READ_ONLY_SCOPES: PermissionScope[] = [
  'calendar:read',
  'notes:read',
  'tasks:read',
  'comms:read',
  'profile:read',
  'settings:read',
  'admin:read',
];

// ── HTTP Status Codes ─────────────────────────────────────────

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
} as const;

// ── Error Codes ───────────────────────────────────────────────

export const ERROR_CODES = {
  // Auth
  INVALID_TOKEN: 'AUTH_001',
  TOKEN_EXPIRED: 'AUTH_002',
  INSUFFICIENT_SCOPE: 'AUTH_003',
  MFA_REQUIRED: 'AUTH_004',
  ACCOUNT_LOCKED: 'AUTH_005',
  INVALID_CREDENTIALS: 'AUTH_006',
  // MCP
  TOOL_NOT_FOUND: 'MCP_001',
  TOOL_EXECUTION_FAILED: 'MCP_002',
  CAPABILITY_UNAVAILABLE: 'MCP_003',
  SERVER_OFFLINE: 'MCP_004',
  // LLM
  MODEL_UNAVAILABLE: 'LLM_001',
  CONTEXT_TOO_LONG: 'LLM_002',
  PROMPT_INJECTION_DETECTED: 'LLM_003',
  BUDGET_EXCEEDED: 'LLM_004',
  // Agent
  AGENT_TIMEOUT: 'AGENT_001',
  MAX_STEPS_EXCEEDED: 'AGENT_002',
  HUMAN_APPROVAL_REJECTED: 'AGENT_003',
  // Data
  NOT_FOUND: 'DATA_001',
  VALIDATION_FAILED: 'DATA_002',
  CONFLICT: 'DATA_003',
  // General
  INTERNAL_ERROR: 'GEN_001',
  RATE_LIMITED: 'GEN_002',
  SERVICE_UNAVAILABLE: 'GEN_003',
} as const;

// ── MCP JSON-RPC Error Codes ──────────────────────────────────

export const MCP_ERROR_CODES = {
  PARSE_ERROR: -32700,
  INVALID_REQUEST: -32600,
  METHOD_NOT_FOUND: -32601,
  INVALID_PARAMS: -32602,
  INTERNAL_ERROR: -32603,
} as const;

// ── Utility Functions ─────────────────────────────────────────

export function sanitizeInput(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
}

export function validateEmail(email: string): boolean {
  const pattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return pattern.test(email) && email.length <= 254;
}

export function validateUUID(uuid: string): boolean {
  const pattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return pattern.test(uuid);
}

export function validateJWTFormat(token: string): boolean {
  const parts = token.split('.');
  return parts.length === 3 && parts.every((p) => p.length > 0);
}

export function hashValue(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj)) as T;
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  baseDelayMs: number = 1000,
): Promise<T> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt < maxAttempts) {
        await delay(baseDelayMs * Math.pow(2, attempt - 1));
      }
    }
  }
  throw lastError;
}

export function hasPermission(
  userScopes: PermissionScope[],
  requiredScope: PermissionScope,
): boolean {
  return userScopes.includes(requiredScope);
}

export function hasAllPermissions(
  userScopes: PermissionScope[],
  requiredScopes: PermissionScope[],
): boolean {
  return requiredScopes.every((scope) => userScopes.includes(scope));
}

export function hasAnyPermission(
  userScopes: PermissionScope[],
  requiredScopes: PermissionScope[],
): boolean {
  return requiredScopes.some((scope) => userScopes.includes(scope));
}

export function formatDate(date: Date, locale = 'en-US'): string {
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatDateTime(date: Date, locale = 'en-US'): string {
  return date.toLocaleString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function isExpired(expiresAt: Date): boolean {
  return new Date() > expiresAt;
}

export function generateCorrelationId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return `${str.slice(0, maxLength - 3)}...`;
}

export function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

export function omit<T extends object, K extends keyof T>(
  obj: T,
  keys: K[],
): Omit<T, K> {
  const result = { ...obj };
  for (const key of keys) {
    delete result[key];
  }
  return result as Omit<T, K>;
}

export function pick<T extends object, K extends keyof T>(
  obj: T,
  keys: K[],
): Pick<T, K> {
  const result = {} as Pick<T, K>;
  for (const key of keys) {
    if (key in obj) {
      result[key] = obj[key];
    }
  }
  return result;
}
