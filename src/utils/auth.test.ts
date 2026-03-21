import { describe, it, expect } from 'vitest';

describe('Auth Utilities', () => {
  it('should validate email correctly', () => {
    // Basic test to verify vitest execution
    const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    expect(validateEmail('test@example.com')).toBe(true);
    expect(validateEmail('invalid-email')).toBe(false);
  });
});
