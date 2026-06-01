export interface PIIPattern {
  id: string;
  name: string;
  pattern: string;
  enabled: boolean;
  severity: "block" | "alarm" | "ignore";
}

export interface GuardrailConfig {
  maxTokenLimit: number; // Token waste alarm threshold
  maxTokenAction: "block" | "alarm"; // Block or warn on high token
  piiAction: "block" | "alarm" | "redact"; // Customer data action
  customKeywords: string[];
  enabledChecks: {
    tech: boolean; // Prompt injection, bypass
    compliance: boolean; // Policy, licensing, code leak
    safety: boolean; // Hate, harassment, exploit code
    context: boolean; // Irrelevant, gibberish
    pii: boolean; // Personally Identifiable Info
    tokens: boolean; // Token-waste
  };
  piiPatterns: PIIPattern[];
  aiProvider?: "gemini" | "openai";
  openaiApiKey?: string;
  openaiBaseUrl?: string;
  disableAiEvaluation?: boolean;
}

export interface CheckDetail {
  passed: boolean;
  score: number; // 0 (clean) to 1 (failed/high risk)
  reason?: string;
}

export interface PromptMetrics {
  charCount: number;
  wordCount: number;
  estimatedTokens: number;
}

export interface GuardrailResult {
  passed: boolean;
  status: "PASSED" | "BLOCKED" | "WARNING";
  errorMessage?: string; // Standardized, helpful but non-informative to prevent adversarial probe
  durationMs: number;
  piiDetected: string[]; // List of PII types found
  redactedPrompt?: string;
  metrics: PromptMetrics;
  checks: {
    tech: CheckDetail;
    compliance: CheckDetail;
    safety: CheckDetail;
    context: CheckDetail;
    pii: CheckDetail;
    tokens: CheckDetail;
  };
}

export interface AuditLog {
  id: string;
  timestamp: string;
  prompt: string;
  redactedPrompt?: string;
  userId: string;
  userIP: string;
  status: "PASSED" | "BLOCKED" | "WARNING";
  reason: string;
  durationMs: number;
  metrics: PromptMetrics;
  checksBreakdown: {
    tech: CheckDetail;
    compliance: CheckDetail;
    safety: CheckDetail;
    context: CheckDetail;
    pii: CheckDetail;
    tokens: CheckDetail;
  };
}

export interface SystemStats {
  totalPassed: number;
  totalBlocked: number;
  totalWarnings: number;
  averageLatencyMs: number;
  totalTokensProcessed: number;
  estimatedTokensSaved: number; // Tokens blocked / prevented from wasting
}
