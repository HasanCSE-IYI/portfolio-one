import { copyToClipboard } from './clipboard';

describe('copyToClipboard Utility', () => {
  const originalClipboard = navigator.clipboard;
  const originalExecCommand = document.execCommand;

  afterEach(() => {
    Object.defineProperty(navigator, 'clipboard', {
      value: originalClipboard,
      configurable: true,
      writable: true,
    });
    document.execCommand = originalExecCommand;
    jest.restoreAllMocks();
  });

  test('returns false for empty or non-string inputs', async () => {
    expect(await copyToClipboard('')).toBe(false);
    expect(await copyToClipboard(null)).toBe(false);
    expect(await copyToClipboard(undefined)).toBe(false);
    expect(await copyToClipboard(123)).toBe(false);
  });

  test('copies text successfully using navigator.clipboard when available', async () => {
    const writeTextMock = jest.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: writeTextMock },
      configurable: true,
      writable: true,
    });

    const result = await copyToClipboard('Hello Mahmud');
    expect(result).toBe(true);
    expect(writeTextMock).toHaveBeenCalledWith('Hello Mahmud');
  });

  test('falls back to document.execCommand when navigator.clipboard fails', async () => {
    const writeTextMock = jest.fn().mockRejectedValue(new Error('Permission denied'));
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: writeTextMock },
      configurable: true,
      writable: true,
    });

    document.execCommand = jest.fn().mockReturnValue(true);

    const result = await copyToClipboard('Fallback text');
    expect(result).toBe(true);
    expect(document.execCommand).toHaveBeenCalledWith('copy');
  });

  test('falls back to document.execCommand when navigator.clipboard is undefined', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      value: undefined,
      configurable: true,
      writable: true,
    });

    document.execCommand = jest.fn().mockReturnValue(true);

    const result = await copyToClipboard('No clipboard API');
    expect(result).toBe(true);
    expect(document.execCommand).toHaveBeenCalledWith('copy');
  });
});
