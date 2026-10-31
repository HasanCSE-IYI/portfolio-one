import {
  playClickSound,
  playPopSound,
  playTickSound,
  playChimeSound,
  playCloseSound,
} from './soundEffects';

describe('soundEffects utility', () => {
  it('safely runs all procedural audio generators without throwing errors', () => {
    expect(() => {
      playClickSound(true);
      playPopSound(true);
      playTickSound(true);
      playChimeSound(true);
      playCloseSound(true);
    }).not.toThrow();
  });

  it('no-ops safely when enabled is false', () => {
    expect(() => {
      playClickSound(false);
      playPopSound(false);
      playTickSound(false);
      playChimeSound(false);
      playCloseSound(false);
    }).not.toThrow();
  });
});
