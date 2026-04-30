import {
  sanitizeInput,
  validateEmail,
  validateUUID,
  hashValue,
  hasPermission,
  hasAllPermissions,
  retryWithBackoff,
  isExpired,
  chunkArray,
  omit,
  pick,
  generateCorrelationId,
  truncate,
} from '../src/index';

describe('sanitizeInput', () => {
  it('escapes HTML special characters', () => {
    expect(sanitizeInput('<script>alert("xss")</script>')).toBe(
      '&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;',
    );
  });

  it('trims whitespace', () => {
    expect(sanitizeInput('  hello  ')).toBe('hello');
  });

  it('returns safe strings unchanged (aside from trim)', () => {
    expect(sanitizeInput('hello world')).toBe('hello world');
  });
});

describe('validateEmail', () => {
  it('accepts valid emails', () => {
    expect(validateEmail('user@example.com')).toBe(true);
    expect(validateEmail('user+tag@sub.domain.org')).toBe(true);
  });

  it('rejects invalid emails', () => {
    expect(validateEmail('notanemail')).toBe(false);
    expect(validateEmail('@missing-local.com')).toBe(false);
    expect(validateEmail('missing-at-sign.com')).toBe(false);
  });
});

describe('validateUUID', () => {
  it('accepts valid v4 UUIDs', () => {
    expect(validateUUID('550e8400-e29b-11d4-a716-446655440000')).toBe(false); // v1
    expect(validateUUID('f47ac10b-58cc-4372-a567-0e02b2c3d479')).toBe(true); // v4
  });

  it('rejects malformed UUIDs', () => {
    expect(validateUUID('not-a-uuid')).toBe(false);
    expect(validateUUID('')).toBe(false);
  });
});

describe('hashValue', () => {
  it('produces a 64-char hex string', () => {
    const hash = hashValue('test');
    expect(hash).toHaveLength(64);
    expect(/^[0-9a-f]+$/.test(hash)).toBe(true);
  });

  it('is deterministic', () => {
    expect(hashValue('same')).toBe(hashValue('same'));
  });

  it('differs for different inputs', () => {
    expect(hashValue('a')).not.toBe(hashValue('b'));
  });
});

describe('hasPermission', () => {
  it('returns true when scope is present', () => {
    expect(hasPermission(['calendar:read', 'notes:write'], 'calendar:read')).toBe(true);
  });

  it('returns false when scope is absent', () => {
    expect(hasPermission(['calendar:read'], 'calendar:write')).toBe(false);
  });
});

describe('hasAllPermissions', () => {
  it('returns true when all scopes present', () => {
    expect(
      hasAllPermissions(['calendar:read', 'notes:read'], ['calendar:read', 'notes:read']),
    ).toBe(true);
  });

  it('returns false when any scope missing', () => {
    expect(hasAllPermissions(['calendar:read'], ['calendar:read', 'notes:write'])).toBe(false);
  });
});

describe('retryWithBackoff', () => {
  it('succeeds on first try', async () => {
    const fn = jest.fn().mockResolvedValue('ok');
    const result = await retryWithBackoff(fn, 3, 0);
    expect(result).toBe('ok');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('retries on failure and eventually succeeds', async () => {
    const fn = jest.fn().mockRejectedValueOnce(new Error('fail')).mockResolvedValue('ok');
    const result = await retryWithBackoff(fn, 3, 0);
    expect(result).toBe('ok');
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('throws after max attempts', async () => {
    const fn = jest.fn().mockRejectedValue(new Error('always fails'));
    await expect(retryWithBackoff(fn, 3, 0)).rejects.toThrow('always fails');
    expect(fn).toHaveBeenCalledTimes(3);
  });
});

describe('isExpired', () => {
  it('returns true for past dates', () => {
    expect(isExpired(new Date(Date.now() - 1000))).toBe(true);
  });

  it('returns false for future dates', () => {
    expect(isExpired(new Date(Date.now() + 10_000))).toBe(false);
  });
});

describe('chunkArray', () => {
  it('splits array into chunks', () => {
    expect(chunkArray([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
  });

  it('handles empty array', () => {
    expect(chunkArray([], 3)).toEqual([]);
  });
});

describe('omit', () => {
  it('removes specified keys', () => {
    expect(omit({ a: 1, b: 2, c: 3 }, ['b'])).toEqual({ a: 1, c: 3 });
  });
});

describe('pick', () => {
  it('keeps only specified keys', () => {
    expect(pick({ a: 1, b: 2, c: 3 }, ['a', 'c'])).toEqual({ a: 1, c: 3 });
  });
});

describe('generateCorrelationId', () => {
  it('generates unique ids', () => {
    const a = generateCorrelationId();
    const b = generateCorrelationId();
    expect(a).not.toBe(b);
  });
});

describe('truncate', () => {
  it('truncates long strings', () => {
    expect(truncate('hello world', 8)).toBe('hello...');
  });

  it('leaves short strings unchanged', () => {
    expect(truncate('hi', 10)).toBe('hi');
  });
});
