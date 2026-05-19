const PII_PATTERNS = [
  { pattern: /\b[\w.-]+@[\w.-]+\.\w+\b/g, replacement: '[EMAIL_REDACTED]' },
  { pattern: /\b\+?[\d\s\-()]{7,20}\b/g, replacement: '[PHONE_REDACTED]' },
  { pattern: /"password"\s*:\s*"[^"]*"/gi, replacement: '"password":"[REDACTED]"' },
  { pattern: /"token"\s*:\s*"[^"]*"/gi, replacement: '"token":"[REDACTED]"' },
  { pattern: /"secret"\s*:\s*"[^"]*"/gi, replacement: '"secret":"[REDACTED]"' },
  { pattern: /"apiKey"\s*:\s*"[^"]*"/gi, replacement: '"apiKey":"[REDACTED]"' },
];

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
  userId?: string;
  ip?: string;
  endpoint?: string;
}

function maskPII(data: string): string {
  let result = data;
  for (const { pattern, replacement } of PII_PATTERNS) {
    result = result.replace(pattern, replacement);
  }
  return result;
}

function formatLogEntry(entry: LogEntry): string {
  const base = `[${entry.timestamp}] ${entry.level.toUpperCase()}: ${entry.message}`;
  
  if (entry.endpoint) {
    return `${base} [${entry.endpoint}]`;
  }
  
  if (entry.context) {
    const sanitizedContext = JSON.stringify(entry.context, (key, value) => {
      if (typeof value === 'string') {
        return maskPII(value);
      }
      return value;
    });
    return `${base} ${sanitizedContext}`;
  }
  
  return base;
}

export const logger = {
  debug(message: string, context?: Record<string, unknown>): void {
    if (process.env.NODE_ENV === 'development') {
      console.debug(formatLogEntry({
        timestamp: new Date().toISOString(),
        level: 'debug',
        message,
        ...context,
      }));
    }
  },

  info(message: string, context?: Record<string, unknown>): void {
    console.log(formatLogEntry({
      timestamp: new Date().toISOString(),
      level: 'info',
      message,
      ...context,
    }));
  },

  warn(message: string, context?: Record<string, unknown>): void {
    console.warn(formatLogEntry({
      timestamp: new Date().toISOString(),
      level: 'warn',
      message,
      ...context,
    }));
  },

  error(message: string, error?: Error, context?: Record<string, unknown>): void {
    console.error(formatLogEntry({
      timestamp: new Date().toISOString(),
      level: 'error',
      message,
      ...context,
      ...(error && { error: error.message, stack: error.stack }),
    }));
  },

  auth(event: 'login_success' | 'login_failure' | 'logout', userId?: string, ip?: string): void {
    this.info(`Auth: ${event}`, { userId, ip });
  },

  apiRequest(method: string, endpoint: string, statusCode: number, ip?: string, userId?: string): void {
    this.info(`${method} ${endpoint} - ${statusCode}`, { ip, userId });
  },
};