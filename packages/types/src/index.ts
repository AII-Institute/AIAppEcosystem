// ============================================================
// AI App Ecosystem — Shared Type Definitions
// ============================================================

// ── User & Identity ──────────────────────────────────────────

export type UserId = string;
export type AppId = string;
export type SessionId = string;
export type DeviceId = string;

export interface User {
  id: UserId;
  email: string;
  displayName: string;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  mfaEnabled: boolean;
  region: DataRegion;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  notifications: NotificationPreferences;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  inApp: boolean;
}

export type DataRegion = 'eu' | 'us' | 'apac';

// ── OAuth 2.1 & Authentication ────────────────────────────────

export interface OAuth2Token {
  accessToken: string;
  refreshToken: string;
  tokenType: 'Bearer';
  expiresIn: number;
  expiresAt: Date;
  scope: string[];
  issuedAt: Date;
}

export interface PKCEChallenge {
  codeVerifier: string;
  codeChallenge: string;
  codeChallengeMethod: 'S256';
}

export interface AuthorizationRequest {
  clientId: string;
  redirectUri: string;
  responseType: 'code';
  scope: string[];
  state: string;
  codeChallenge: string;
  codeChallengeMethod: 'S256';
}

export interface JWTPayload {
  sub: UserId;
  iss: string;
  aud: string | string[];
  exp: number;
  iat: number;
  jti: string;
  scope: string[];
  deviceId?: DeviceId;
}

export interface JWTToken {
  raw: string;
  payload: JWTPayload;
  expiresAt: Date;
}

export interface MFAChallenge {
  type: MFAType;
  challengeId: string;
  expiresAt: Date;
}

export type MFAType = 'totp' | 'webauthn' | 'sms' | 'email';

export interface PasskeyCredential {
  credentialId: string;
  publicKey: string;
  userId: UserId;
  deviceName: string;
  createdAt: Date;
  lastUsedAt: Date;
}

export interface AuthSession {
  sessionId: SessionId;
  userId: UserId;
  deviceId: DeviceId;
  token: OAuth2Token;
  createdAt: Date;
  lastActiveAt: Date;
  ipAddress: string;
  userAgent: string;
}

// ── Permission Scopes ─────────────────────────────────────────

export type PermissionScope =
  | 'calendar:read'
  | 'calendar:write'
  | 'notes:read'
  | 'notes:write'
  | 'tasks:read'
  | 'tasks:write'
  | 'comms:read'
  | 'comms:write'
  | 'profile:read'
  | 'profile:write'
  | 'settings:read'
  | 'settings:write'
  | 'agents:execute'
  | 'admin:read'
  | 'admin:write';

export interface AppPermissions {
  appId: AppId;
  userId: UserId;
  scopes: PermissionScope[];
  grantedAt: Date;
  grantedBy: 'user' | 'admin';
}

// ── MCP Protocol ──────────────────────────────────────────────

export interface MCPRequest {
  jsonrpc: '2.0';
  id: string | number;
  method: string;
  params?: MCPRequestParams;
}

export interface MCPRequestParams {
  [key: string]: unknown;
}

export interface MCPResponse {
  jsonrpc: '2.0';
  id: string | number;
  result?: MCPResult;
  error?: MCPError;
}

export interface MCPResult {
  [key: string]: unknown;
}

export interface MCPError {
  code: number;
  message: string;
  data?: unknown;
}

export interface MCPCapability {
  name: string;
  description: string;
  version: string;
  tools: MCPTool[];
  resources: MCPResource[];
}

export interface MCPTool {
  name: string;
  description: string;
  inputSchema: JsonSchema;
  requiresAuth: boolean;
  requiredScopes: PermissionScope[];
}

export interface MCPResource {
  uri: string;
  name: string;
  description: string;
  mimeType: string;
}

export interface MCPServer {
  id: string;
  appId: AppId;
  name: string;
  version: string;
  capabilities: MCPCapability;
  endpoint: string;
  status: 'online' | 'offline' | 'degraded';
  lastHealthCheck: Date;
}

export interface MCPToolCall {
  toolName: string;
  serverId: string;
  input: Record<string, unknown>;
  requestedAt: Date;
  completedAt?: Date;
  result?: unknown;
  error?: MCPError;
}

export interface AppContext {
  sessionId: SessionId;
  userId: UserId;
  appId: AppId;
  scopes: PermissionScope[];
  locale: string;
  timezone: string;
}

// ── LLM / AI ──────────────────────────────────────────────────

export type ModelId =
  | 'claude-opus-4-7'
  | 'claude-sonnet-4-6'
  | 'claude-haiku-4-5-20251001'
  | string;

export interface LLMRequest {
  model: ModelId;
  messages: Message[];
  tools?: Tool[];
  maxTokens?: number;
  temperature?: number;
  systemPrompt?: string;
  stream?: boolean;
  metadata?: LLMRequestMetadata;
}

export interface LLMRequestMetadata {
  userId: UserId;
  appId: AppId;
  sessionId: SessionId;
  requestId: string;
  costBudget?: number;
}

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string | ContentBlock[];
}

export type ContentBlock = TextBlock | ImageBlock | ToolUseBlock | ToolResultBlock;

export interface TextBlock {
  type: 'text';
  text: string;
}

export interface ImageBlock {
  type: 'image';
  source: { type: 'base64'; mediaType: string; data: string };
}

export interface ToolUseBlock {
  type: 'tool_use';
  id: string;
  name: string;
  input: Record<string, unknown>;
}

export interface ToolResultBlock {
  type: 'tool_result';
  toolUseId: string;
  content: string | ContentBlock[];
  isError?: boolean;
}

export interface Tool {
  name: string;
  description: string;
  inputSchema: JsonSchema;
}

export interface ToolCall {
  id: string;
  name: string;
  input: Record<string, unknown>;
}

export interface LLMResponse {
  id: string;
  model: ModelId;
  content: ContentBlock[];
  stopReason: 'end_turn' | 'max_tokens' | 'tool_use' | 'stop_sequence';
  usage: TokenUsage;
}

export interface TokenUsage {
  inputTokens: number;
  outputTokens: number;
  cacheReadInputTokens?: number;
  cacheCreationInputTokens?: number;
}

// ── RAG / Embeddings ──────────────────────────────────────────

export interface EmbeddingRequest {
  text: string;
  userId: UserId;
  namespace: string;
}

export interface Embedding {
  id: string;
  userId: UserId;
  namespace: string;
  vector: number[];
  text: string;
  metadata: EmbeddingMetadata;
  createdAt: Date;
}

export interface EmbeddingMetadata {
  sourceId: string;
  sourceType: 'note' | 'task' | 'email' | 'calendar_event' | 'document';
  appId: AppId;
  [key: string]: unknown;
}

export interface RAGQuery {
  query: string;
  userId: UserId;
  namespace: string;
  topK: number;
  minSimilarity?: number;
  filter?: RAGFilter;
}

export interface RAGFilter {
  sourceType?: EmbeddingMetadata['sourceType'][];
  appId?: AppId;
  dateRange?: { from: Date; to: Date };
}

export interface RAGResult {
  query: string;
  results: SimilarityResult[];
  totalResults: number;
}

export interface SimilarityResult {
  embedding: Embedding;
  similarity: number;
  rank: number;
}

// ── Agent & Workflows ─────────────────────────────────────────

export interface Agent {
  id: string;
  name: string;
  description: string;
  version: string;
  capabilities: string[];
  allowedScopes: PermissionScope[];
  maxSteps: number;
  timeoutMs: number;
}

export interface AgentWorkflow {
  id: string;
  name: string;
  description: string;
  agentId: string;
  steps: WorkflowStep[];
  triggers: WorkflowTrigger[];
  createdBy: UserId;
  createdAt: Date;
}

export type WorkflowStep = LLMStep | ToolStep | ConditionalStep | HumanApprovalStep;

export interface LLMStep {
  type: 'llm';
  id: string;
  prompt: string;
  model: ModelId;
  outputVariable: string;
}

export interface ToolStep {
  type: 'tool';
  id: string;
  toolName: string;
  serverId: string;
  input: Record<string, unknown>;
  outputVariable: string;
}

export interface ConditionalStep {
  type: 'conditional';
  id: string;
  condition: string;
  trueBranch: string;
  falseBranch: string;
}

export interface HumanApprovalStep {
  type: 'human_approval';
  id: string;
  message: string;
  timeoutMs: number;
  onTimeout: 'approve' | 'reject' | 'error';
}

export interface WorkflowTrigger {
  type: 'schedule' | 'event' | 'webhook' | 'manual';
  config: Record<string, unknown>;
}

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  userId: UserId;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  startedAt: Date;
  completedAt?: Date;
  steps: StepExecution[];
  error?: string;
}

export interface StepExecution {
  stepId: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  startedAt?: Date;
  completedAt?: Date;
  output?: unknown;
  error?: string;
}

// ── Audit & Events ────────────────────────────────────────────

export interface AuditLog {
  id: string;
  userId: UserId;
  appId: AppId;
  sessionId: SessionId;
  action: AuditAction;
  resource: string;
  resourceId: string;
  metadata: Record<string, unknown>;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
  success: boolean;
  errorCode?: string;
}

export type AuditAction =
  | 'auth.login'
  | 'auth.logout'
  | 'auth.token_refresh'
  | 'auth.mfa_challenge'
  | 'mcp.tool_call'
  | 'mcp.capability_query'
  | 'llm.request'
  | 'rag.query'
  | 'agent.execute'
  | 'data.read'
  | 'data.write'
  | 'data.delete'
  | 'admin.action';

export interface EcosystemEvent {
  id: string;
  type: EventType;
  source: AppId;
  target?: AppId;
  userId: UserId;
  payload: Record<string, unknown>;
  timestamp: Date;
  correlationId?: string;
}

export type EventType =
  | 'user.created'
  | 'user.updated'
  | 'user.deleted'
  | 'session.started'
  | 'session.ended'
  | 'calendar.event_created'
  | 'calendar.event_updated'
  | 'note.created'
  | 'note.updated'
  | 'task.created'
  | 'task.completed'
  | 'message.received'
  | 'agent.workflow_started'
  | 'agent.workflow_completed';

// ── API Keys ──────────────────────────────────────────────────

export interface ApiKey {
  id: string;
  userId: UserId;
  appId: AppId;
  name: string;
  keyHash: string;
  scopes: PermissionScope[];
  createdAt: Date;
  expiresAt?: Date;
  lastUsedAt?: Date;
  isActive: boolean;
}

// ── Observability ─────────────────────────────────────────────

export interface Trace {
  traceId: string;
  spanId: string;
  parentSpanId?: string;
  name: string;
  service: string;
  startTime: Date;
  endTime?: Date;
  attributes: Record<string, string | number | boolean>;
  status: 'ok' | 'error' | 'unset';
}

export interface Metric {
  name: string;
  value: number;
  unit: string;
  labels: Record<string, string>;
  timestamp: Date;
}

// ── Encryption ────────────────────────────────────────────────

export interface EncryptedData {
  ciphertext: string;
  iv: string;
  algorithm: 'AES-256-GCM';
  keyId: string;
}

export interface KeyDerivationParams {
  salt: string;
  iterations: number;
  hash: 'SHA-256' | 'SHA-512';
  algorithm: 'PBKDF2';
}

// ── Teachly ───────────────────────────────────────────────────

export type TeachlyRole = 'teacher' | 'parent' | 'student';

export type ClassColor = 'sky' | 'leaf' | 'sun' | 'coral';

export type ActivityType = 'drawing' | 'voice' | 'reading' | 'worksheet' | 'video';

export type ActivityStatus = 'pending' | 'submitted' | 'reviewed';

export type WeekDay = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export interface ClassSchedule {
  days: WeekDay[];
  time: string;
  durationMinutes: number;
}

export interface TeachlyClass {
  id: string;
  name: string;
  emoji: string;
  teacherId: UserId;
  schedule: ClassSchedule;
  studentIds: UserId[];
  color: ClassColor;
  createdAt: Date;
  updatedAt: Date;
}

export interface TeachlyActivity {
  id: string;
  classId: string;
  title: string;
  description: string;
  type: ActivityType;
  dueDate?: Date;
  createdAt: Date;
}

export interface ActivitySubmission {
  id: string;
  activityId: string;
  studentId: UserId;
  status: ActivityStatus;
  submittedAt?: Date;
  reviewedAt?: Date;
  content?: string;
}

export interface PostReaction {
  emoji: string;
  count: number;
}

export interface CommunityPost {
  id: string;
  classId: string;
  authorId: UserId;
  authorName: string;
  authorRole: TeachlyRole;
  content: string;
  reactions: PostReaction[];
  createdAt: Date;
}

export interface TeachlyStudent {
  id: UserId;
  name: string;
  age: number;
  parentId: UserId;
  classIds: string[];
  stars: number;
  badges: string[];
}

export interface TeachlyTeacherStats {
  activeStudents: number;
  activeClasses: number;
  activitiesDone: number;
  completionRate: number;
  monthlyRevenue: number;
}

export interface TeachlyParentProgress {
  childId: UserId;
  attendancePercent: number;
  sessionsAttended: number;
  totalSessions: number;
  activitiesDone: number;
  activitiesPending: number;
  starsEarned: number;
  badgesEarned: number;
}

// ── Utilities ─────────────────────────────────────────────────

export type JsonSchema = {
  type: string;
  properties?: Record<string, JsonSchema>;
  items?: JsonSchema;
  required?: string[];
  description?: string;
  enum?: unknown[];
  [key: string]: unknown;
};

export type Result<T, E = Error> = { success: true; data: T } | { success: false; error: E };

export type AsyncResult<T, E = Error> = Promise<Result<T, E>>;

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasNextPage: boolean;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// ── Onboarding ────────────────────────────────────────────────

export type OnboardingStepKey = string;

export type OnboardingStatus = 'not_started' | 'in_progress' | 'completed';

export interface OnboardingUser {
  id: string;
  email: string;
  appId: AppId;
  role: string;
  displayName: string | null;
  avatarColor: string | null;
  createdAt: string;
}

export interface OnboardingState {
  id: string;
  userId: string;
  appId: AppId;
  currentStep: OnboardingStepKey;
  status: OnboardingStatus;
  stepData: Record<string, unknown>;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface OnboardingStepDefinition {
  key: OnboardingStepKey;
  order: number;
  label: string;
}

export interface CreateOnboardingUserInput {
  email: string;
  appId: AppId;
  role: string;
  displayName?: string;
  avatarColor?: string;
}

export interface UpdateOnboardingStateInput {
  currentStep?: OnboardingStepKey;
  status?: OnboardingStatus;
  stepData?: Record<string, unknown>;
  completedAt?: string | null;
}
