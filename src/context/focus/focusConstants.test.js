import { parseYoutubeUrl, TIMER_MODES, DEFAULT_YT_TRACK } from './focusConstants';

describe('focusConstants & parseYoutubeUrl utility', () => {
  describe('TIMER_MODES configuration', () => {
    test('defines valid timer modes with required properties', () => {
      expect(TIMER_MODES.pomodoro).toBeDefined();
      expect(TIMER_MODES.pomodoro.focusMinutes).toBe(25);
      expect(TIMER_MODES.pomodoro.breakMinutes).toBe(5);

      expect(TIMER_MODES.deep).toBeDefined();
      expect(TIMER_MODES.deep.focusMinutes).toBe(50);
      expect(TIMER_MODES.deep.breakMinutes).toBe(10);

      expect(TIMER_MODES.sprint).toBeDefined();
      expect(TIMER_MODES.sprint.focusMinutes).toBe(15);
      expect(TIMER_MODES.sprint.breakMinutes).toBe(3);
    });
  });

  describe('DEFAULT_YT_TRACK configuration', () => {
    test('has a valid 11-character video ID and title', () => {
      expect(DEFAULT_YT_TRACK.id).toBeDefined();
      expect(DEFAULT_YT_TRACK.id).toMatch(/^[\w-]{11}$/);
      expect(typeof DEFAULT_YT_TRACK.title).toBe('string');
      expect(DEFAULT_YT_TRACK.title.length).toBeGreaterThan(0);
    });
  });

  describe('parseYoutubeUrl', () => {
    test('returns null for null, undefined, empty, or non-string inputs', () => {
      expect(parseYoutubeUrl(null)).toBeNull();
      expect(parseYoutubeUrl(undefined)).toBeNull();
      expect(parseYoutubeUrl('')).toBeNull();
      expect(parseYoutubeUrl('   ')).toBeNull();
      expect(parseYoutubeUrl(12345)).toBeNull();
      expect(parseYoutubeUrl({})).toBeNull();
    });

    test('parses a bare 11-character YouTube video ID', () => {
      const result = parseYoutubeUrl('jfKfPfyJRdk');
      expect(result).toEqual({ id: 'jfKfPfyJRdk' });
    });

    test('parses standard youtube.com/watch?v=... URLs', () => {
      const result = parseYoutubeUrl('https://www.youtube.com/watch?v=jfKfPfyJRdk');
      expect(result).toEqual({ id: 'jfKfPfyJRdk', list: undefined });
    });

    test('parses standard URL with extra query parameters and playlist', () => {
      const result = parseYoutubeUrl(
        'https://www.youtube.com/watch?v=jfKfPfyJRdk&list=PLrAXtmErZgOdP_8GztsuKi9f8QBP4_a'
      );
      expect(result).toEqual({
        id: 'jfKfPfyJRdk',
        list: 'PLrAXtmErZgOdP_8GztsuKi9f8QBP4_a',
      });
    });

    test('parses youtu.be short URLs with or without protocol', () => {
      const withProtocol = parseYoutubeUrl('https://youtu.be/jfKfPfyJRdk');
      expect(withProtocol).toEqual({ id: 'jfKfPfyJRdk', list: undefined });

      const withoutProtocol = parseYoutubeUrl('youtu.be/jfKfPfyJRdk');
      expect(withoutProtocol).toEqual({ id: 'jfKfPfyJRdk', list: undefined });
    });

    test('parses youtu.be short URL with timestamp parameters', () => {
      const result = parseYoutubeUrl('https://youtu.be/jfKfPfyJRdk?t=120');
      expect(result).toEqual({ id: 'jfKfPfyJRdk', list: undefined });
    });

    test('parses youtube.com/shorts/... URLs', () => {
      const result = parseYoutubeUrl('https://www.youtube.com/shorts/jfKfPfyJRdk');
      expect(result).toEqual({ id: 'jfKfPfyJRdk', list: undefined });
    });

    test('parses youtube.com/embed/... URLs', () => {
      const result = parseYoutubeUrl('https://www.youtube.com/embed/jfKfPfyJRdk');
      expect(result).toEqual({ id: 'jfKfPfyJRdk', list: undefined });
    });

    test('parses youtube.com/live/... URLs', () => {
      const result = parseYoutubeUrl('https://www.youtube.com/live/jfKfPfyJRdk');
      expect(result).toEqual({ id: 'jfKfPfyJRdk', list: undefined });
    });

    test('parses playlist-only URLs without individual video ID', () => {
      const result = parseYoutubeUrl(
        'https://www.youtube.com/playlist?list=PLrAXtmErZgOdP_8GztsuKi9f8QBP4_a'
      );
      expect(result).toEqual({
        id: '',
        list: 'PLrAXtmErZgOdP_8GztsuKi9f8QBP4_a',
      });
    });

    test('parses mobile and music subdomains (m.youtube.com, music.youtube.com)', () => {
      const mobile = parseYoutubeUrl('https://m.youtube.com/watch?v=jfKfPfyJRdk');
      expect(mobile).toEqual({ id: 'jfKfPfyJRdk', list: undefined });

      const music = parseYoutubeUrl('https://music.youtube.com/watch?v=jfKfPfyJRdk');
      expect(music).toEqual({ id: 'jfKfPfyJRdk', list: undefined });
    });

    test('returns null for invalid URLs or random non-video strings', () => {
      expect(parseYoutubeUrl('https://vimeo.com/12345678')).toBeNull();
      expect(parseYoutubeUrl('https://google.com/search?q=youtube')).toBeNull();
      expect(parseYoutubeUrl('random text that is not a video id')).toBeNull();
    });
  });
});
