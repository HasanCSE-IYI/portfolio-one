import { FOCUS_PRESETS } from './focusPresets';
import { SOUND_DEFINITIONS } from './soundDefinitions';

describe('Focus Data Model Integrity (Presets & Sound Definitions)', () => {
  test('all presets have required fields and unique IDs', () => {
    const presetIds = new Set();

    FOCUS_PRESETS.forEach((preset) => {
      expect(preset.id).toBeDefined();
      expect(typeof preset.id).toBe('string');
      expect(preset.id.length).toBeGreaterThan(0);

      // Check for unique preset IDs
      expect(presetIds.has(preset.id)).toBe(false);
      presetIds.add(preset.id);

      expect(preset.name).toBeDefined();
      expect(preset.icon).toBeDefined();
      expect(preset.desc).toBeDefined();
      expect(preset.scene).toBeDefined();
      expect(preset.mix).toBeDefined();
      expect(typeof preset.mix).toBe('object');
      expect(Object.keys(preset.mix).length).toBeGreaterThan(0);
    });
  });

  test('all sound definitions have required fields and unique IDs', () => {
    const soundIds = new Set();

    SOUND_DEFINITIONS.forEach((sound) => {
      expect(sound.id).toBeDefined();
      expect(typeof sound.id).toBe('string');

      // Check for unique sound IDs
      expect(soundIds.has(sound.id)).toBe(false);
      soundIds.add(sound.id);

      expect(sound.name).toBeDefined();
      expect(sound.category).toBeDefined();
      expect(sound.icon).toBeDefined();
    });
  });

  test('procedural noise sounds have valid noise types', () => {
    const noiseSounds = SOUND_DEFINITIONS.filter((s) => s.type === 'procedural_noise');
    expect(noiseSounds.length).toBeGreaterThan(0);
    noiseSounds.forEach((sound) => {
      expect(['brown', 'pink', 'white']).toContain(sound.noiseType);
    });
  });

  test('binaural sounds have valid frequency parameters', () => {
    const binauralSounds = SOUND_DEFINITIONS.filter((s) => s.type === 'binaural');
    expect(binauralSounds.length).toBeGreaterThan(0);
    binauralSounds.forEach((sound) => {
      expect(typeof sound.hz).toBe('number');
      expect(typeof sound.carrier).toBe('number');
    });
  });

  test('recorded ambient sounds have valid audio source paths', () => {
    const ambientSounds = SOUND_DEFINITIONS.filter((s) => !s.type);
    expect(ambientSounds.length).toBeGreaterThan(0);
    ambientSounds.forEach((sound) => {
      expect(sound.file || sound.fallbackUrl).toBeDefined();
    });
  });

  test('every sound ID referenced in preset mixes exists in SOUND_DEFINITIONS', () => {
    const validSoundIds = new Set(SOUND_DEFINITIONS.map((s) => s.id));

    FOCUS_PRESETS.forEach((preset) => {
      Object.entries(preset.mix).forEach(([soundKey, volume]) => {
        expect(validSoundIds.has(soundKey)).toBe(true);
        expect(typeof volume).toBe('number');
        expect(volume).toBeGreaterThan(0);
        expect(volume).toBeLessThanOrEqual(100);
      });
    });
  });
});
