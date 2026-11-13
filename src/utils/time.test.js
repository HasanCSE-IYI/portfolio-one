import { getDhakaTime } from './time';

describe('getDhakaTime Utility', () => {
  test('returns formatted BST time with seconds by default', () => {
    // 2026-11-13T10:00:00Z is 4:00:00 PM BST (UTC+6)
    const testDate = new Date('2026-11-13T10:00:00Z');
    const result = getDhakaTime({ date: testDate });

    expect(result).toMatch(/04:00:00\s*(PM|pm)/i);
  });

  test('returns formatted BST time without seconds when includeSeconds is false', () => {
    const testDate = new Date('2026-11-13T10:00:00Z');
    const result = getDhakaTime({ date: testDate, includeSeconds: false });

    expect(result).toMatch(/4:00\s*(PM|pm)/i);
  });

  test('formats current time when no date is supplied', () => {
    const result = getDhakaTime();
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
    expect(result).toMatch(/(AM|PM|am|pm)/i);
  });
});
