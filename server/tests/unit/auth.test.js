import { describe, it, expect } from 'vitest';
import { hashPassword, comparePassword, generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken, hashToken } from '../../src/utils/tokens.js';

describe('Auth Tokens & Crypto Unit Tests', () => {
  it('hashes and compares passwords with bcrypt cost 12', async () => {
    const raw = 'SuperSecret123!';
    const hashed = await hashPassword(raw);

    expect(hashed).not.toBe(raw);
    expect(await comparePassword(raw, hashed)).toBe(true);
    expect(await comparePassword('WrongPassword', hashed)).toBe(false);
  });

  it('signs and verifies JWT access tokens', () => {
    const user = { id: 'user-cuid-123', email: 'test@example.com', isGuest: false };
    const token = generateAccessToken(user);

    expect(typeof token).toBe('string');
    const decoded = verifyAccessToken(token);
    expect(decoded.userId).toBe(user.id);
    expect(decoded.email).toBe(user.email);
  });

  it('signs and verifies JWT refresh tokens', () => {
    const user = { id: 'user-cuid-123', email: 'test@example.com' };
    const token = generateRefreshToken(user);

    expect(typeof token).toBe('string');
    const decoded = verifyRefreshToken(token);
    expect(decoded.userId).toBe(user.id);
  });

  it('generates SHA-256 deterministic token hashes for db storage', () => {
    const token = 'sample-refresh-token-string';
    const hash1 = hashToken(token);
    const hash2 = hashToken(token);

    expect(hash1).toBe(hash2);
    expect(hash1.length).toBe(64); // SHA-256 hex string length
  });
});
