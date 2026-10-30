import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import {
  BRAINWAVE_MODES,
  SOUND_TO_SCENE_MAP,
  FOCUS_QUOTES,
  DEFAULT_YT_TRACK,
  TIMER_MODES,
  parseYoutubeUrl,
} from './focus/focusConstants';
import { SOUND_DEFINITIONS } from './focus/soundDefinitions';

// Re-export modular domain constants and data for clean architecture & backward compatibility
export * from './focus/focusConstants';
export * from './focus/soundDefinitions';
export * from './focus/focusPresets';

const FocusContext = createContext(null);

export const FocusProvider = ({ children }) => {
  // Web Audio Context & Node Refs
  const audioCtxRef = useRef(null);
  const masterGainRef = useRef(null);
  const analyserRef = useRef(null);
  const soundNodesRef = useRef({});

  // Sound Engine State
  const [isPlaying, setIsPlaying] = useState(false);
  const [masterVolume, setMasterVolume] = useState(75);
  const [isMuted, setIsMuted] = useState(false);
  const [activePreset, setActivePreset] = useState(null);

  // Per-sound volume map (0 - 100)
  const [volumes, setVolumes] = useState(() => {
    const init = {};
    SOUND_DEFINITIONS.forEach((s) => {
      init[s.id] = 0;
    });
    return init;
  });

  // Atmospheric Scene State
  const [activeScene, setActiveScene] = useState('forest');
  const changeScene = useCallback((sceneId) => {
    setActiveScene(sceneId);
  }, []);

  // Quotes State
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(() =>
    Math.floor(Math.random() * FOCUS_QUOTES.length)
  );

  const nextQuote = useCallback(() => {
    setCurrentQuoteIndex((prev) => (prev + 1) % FOCUS_QUOTES.length);
  }, []);

  const prevQuote = useCallback(() => {
    setCurrentQuoteIndex((prev) => (prev - 1 + FOCUS_QUOTES.length) % FOCUS_QUOTES.length);
  }, []);

  // YouTube Focus Player State
  const [customYtLinks, setCustomYtLinks] = useState(() => {
    try {
      const saved = localStorage.getItem('focus-links');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [currentYtTrack, setCurrentYtTrack] = useState(() => {
    try {
      const saved = localStorage.getItem('focus-links');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed[0];
      }
    } catch {}
    return DEFAULT_YT_TRACK;
  });
  const [isYtPlaying, setIsYtPlaying] = useState(false);
  const [ytVolume, setYtVolume] = useState(80);
  const [isYtFolded, setIsYtFolded] = useState(() => {
    try {
      return localStorage.getItem('yt-video-hidden') === '1';
    } catch {
      return false;
    }
  });

  const toggleYtFold = useCallback(() => {
    setIsYtFolded((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('yt-video-hidden', next ? '1' : '0');
      } catch {}
      return next;
    });
  }, []);

  const playYtTrack = useCallback((track) => {
    if (!track) return;
    setCurrentYtTrack(track);
    setIsYtPlaying(true);
  }, []);

  const toggleYtPlay = useCallback(() => {
    setIsYtPlaying((prev) => !prev);
  }, []);

  const nextYtTrack = useCallback(() => {
    if (customYtLinks.length > 0) {
      const idx = customYtLinks.findIndex((p) => p.id === currentYtTrack?.id);
      const nextIdx = (idx + 1) % customYtLinks.length;
      setCurrentYtTrack(customYtLinks[nextIdx]);
      setIsYtPlaying(true);
    }
  }, [customYtLinks, currentYtTrack]);

  const prevYtTrack = useCallback(() => {
    if (customYtLinks.length > 0) {
      const idx = customYtLinks.findIndex((p) => p.id === currentYtTrack?.id);
      const prevIdx = (idx - 1 + customYtLinks.length) % customYtLinks.length;
      setCurrentYtTrack(customYtLinks[prevIdx]);
      setIsYtPlaying(true);
    }
  }, [customYtLinks, currentYtTrack]);

  const addCustomYtLink = useCallback((inputUrl) => {
    const parsed = parseYoutubeUrl(inputUrl);
    if (!parsed || !parsed.id) return false;
    const newTrack = {
      id: parsed.id,
      title: `YouTube Video (${parsed.id})`,
      sub: 'Custom Stream',
      list: parsed.list,
      thumb: `https://i.ytimg.com/vi/${parsed.id}/mqdefault.jpg`,
    };
    setCustomYtLinks((prev) => {
      const filtered = prev.filter((p) => p.id !== parsed.id);
      const updated = [newTrack, ...filtered].slice(0, 20);
      try {
        localStorage.setItem('focus-links', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    setCurrentYtTrack(newTrack);
    setIsYtPlaying(true);
    return true;
  }, []);

  const removeCustomYtLink = useCallback((id) => {
    setCustomYtLinks((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      try {
        localStorage.setItem('focus-links', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, []);

  // Pomodoro Timer State
  const [timerMode, setTimerMode] = useState('pomodoro');
  const [timerStatus, setTimerStatus] = useState('idle'); // 'idle' | 'running' | 'paused'
  const [timerPhase, setTimerPhase] = useState('focus'); // 'focus' | 'break'
  const [timeRemaining, setTimeRemaining] = useState(25 * 60);
  const [stopwatchSeconds, setStopwatchSeconds] = useState(0);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [currentTask, setCurrentTask] = useState(() => {
    try {
      const stored = localStorage.getItem('focus_current_task');
      if (stored && (stored.includes('ASP.NET') || stored.includes('.NET') || stored.includes('Laravel') || stored.includes('Architecting'))) {
        localStorage.setItem('focus_current_task', 'Focused Deep Work & Calm Reflection');
        return 'Focused Deep Work & Calm Reflection';
      }
      return stored || 'Focused Deep Work & Calm Reflection';
    } catch {
      return 'Focused Deep Work & Calm Reflection';
    }
  });

  // Zen / Immersive Fullscreen State
  const [isZenMode, setIsZenMode] = useState(false);

  // Persist Current Task to storage
  const currentTaskRef = useRef(currentTask);
  useEffect(() => {
    currentTaskRef.current = currentTask;
    try {
      localStorage.setItem('focus_current_task', currentTask);
    } catch {}
  }, [currentTask]);

  // Pomodoro Session History State
  const [sessionHistory, setSessionHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('focus_session_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const logCompletedSession = useCallback((taskName, minutes, modeLabel) => {
    const newEntry = {
      id: Date.now(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      task: taskName || 'Deep Nature Focus Sprint',
      minutes,
      mode: modeLabel,
    };
    setSessionHistory((prev) => {
      const updated = [newEntry, ...prev.slice(0, 9)];
      try {
        localStorage.setItem('focus_session_history', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, []);

  const clearSessionHistory = useCallback(() => {
    setSessionHistory([]);
    try {
      localStorage.removeItem('focus_session_history');
    } catch {}
  }, []);

  // Multi-State Brainwave Tuner (Alpha, Beta, Gamma, Theta, Delta)
  const [brainwaveMode, setBrainwaveMode] = useState('alpha');
  const brainwaveModeRef = useRef('alpha');
  const binauralNodesRef = useRef(null);

  const changeBrainwaveMode = useCallback((newMode) => {
    setBrainwaveMode(newMode);
    brainwaveModeRef.current = newMode;
    const info = BRAINWAVE_MODES[newMode] || BRAINWAVE_MODES.alpha;
    if (binauralNodesRef.current && audioCtxRef.current) {
      const { oscL, oscR } = binauralNodesRef.current;
      const now = audioCtxRef.current.currentTime;
      try {
        oscL.frequency.cancelScheduledValues(now);
        oscR.frequency.cancelScheduledValues(now);
        oscL.frequency.linearRampToValueAtTime(info.carrier, now + 1.0);
        oscR.frequency.linearRampToValueAtTime(info.carrier + info.hz, now + 1.0);
      } catch {}
    }
  }, []);

  // Vinyl Tape Warmth Effect State
  const [isVinylWarmth, setIsVinylWarmth] = useState(false);
  const vinylNodeRef = useRef(null);

  // Custom User Mix Presets (persisted in localStorage)
  const [userPresets, setUserPresets] = useState(() => {
    try {
      const saved = localStorage.getItem('focus_user_presets');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const saveUserPreset = useCallback((name) => {
    if (!name || !name.trim()) return;
    const currentMix = {};
    SOUND_DEFINITIONS.forEach((s) => {
      if (volumes[s.id] > 0) currentMix[s.id] = volumes[s.id];
    });
    const newPreset = {
      id: `custom-${Date.now()}`,
      name: name.trim(),
      icon: '✨',
      desc: 'Custom nature soundscape',
      scene: activeScene,
      mix: currentMix,
      isCustom: true,
    };
    setUserPresets((prev) => {
      const updated = [newPreset, ...prev];
      try {
        localStorage.setItem('focus_user_presets', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    setActivePreset(newPreset.id);
  }, [volumes, activeScene]);

  const deleteUserPreset = useCallback((id) => {
    setUserPresets((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      try {
        localStorage.setItem('focus_user_presets', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    setActivePreset((prev) => (prev === id ? null : prev));
  }, []);

  // Favorite Sounds (persisted in localStorage)
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('focus_favorites');
      return saved ? JSON.parse(saved) : ['rain', 'river', 'scifi', 'fire', 'birds'];
    } catch {
      return ['rain', 'river', 'scifi', 'fire', 'birds'];
    }
  });

  const toggleFavorite = useCallback((soundId) => {
    setFavorites((prev) => {
      const next = prev.includes(soundId)
        ? prev.filter((id) => id !== soundId)
        : [...prev, soundId];
      try {
        localStorage.setItem('focus_favorites', JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  // Sleep Timer (auto fade & pause)
  const [sleepTimerMinutes, setSleepTimerMinutes] = useState(null);
  const [sleepTimerRemaining, setSleepTimerRemaining] = useState(0);

  const setSleepTimer = useCallback((minutes) => {
    if (!minutes || minutes <= 0) {
      setSleepTimerMinutes(null);
      setSleepTimerRemaining(0);
    } else {
      setSleepTimerMinutes(minutes);
      setSleepTimerRemaining(minutes * 60);
    }
  }, []);

  useEffect(() => {
    if (!sleepTimerMinutes || sleepTimerRemaining <= 0) return;
    const interval = setInterval(() => {
      setSleepTimerRemaining((prev) => {
        if (prev <= 1) {
          setIsPlaying(false);
          setSleepTimerMinutes(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [sleepTimerMinutes, sleepTimerRemaining]);

  // Share Mix URL generator
  const getShareableMixUrl = useCallback(() => {
    const activeEntries = Object.entries(volumes).filter(([, v]) => v > 0);
    if (activeEntries.length === 0) return null;
    const mixStr = activeEntries.map(([id, v]) => `${id}:${v}`).join(',');
    return `${window.location.origin}${window.location.pathname}#focus?mix=${encodeURIComponent(mixStr)}`;
  }, [volumes]);

  const loadMixString = useCallback((mixStr) => {
    if (!mixStr) return;
    const newVolumes = {};
    SOUND_DEFINITIONS.forEach((s) => {
      newVolumes[s.id] = 0;
    });
    mixStr.split(',').forEach((part) => {
      const [id, volStr] = part.split(':');
      const vol = parseInt(volStr, 10);
      if (id && !isNaN(vol) && vol > 0 && newVolumes[id] !== undefined) {
        newVolumes[id] = Math.min(100, Math.max(0, vol));
      }
    });
    setVolumes(newVolumes);
    setIsPlaying(true);
  }, []);

  useEffect(() => {
    try {
      const hash = window.location.hash;
      if (hash && hash.includes('mix=')) {
        const match = hash.match(/mix=([^&]+)/);
        if (match && match[1]) {
          loadMixString(decodeURIComponent(match[1]));
        }
      }
    } catch {}
  }, [loadMixString]);

  // Apple-style Mindful Box Breathing (4s Inhale, 4s Hold, 4s Exhale, 4s Hold)
  const [isBreathingMode, setIsBreathingMode] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState('inhale');
  const [breathingSeconds, setBreathingSeconds] = useState(4);

  // Ambient Dynamic Backdrops
  const [ambientTheme, setAmbientTheme] = useState(() => {
    try {
      return localStorage.getItem('focus_ambient_theme') || 'obsidian';
    } catch {
      return 'obsidian';
    }
  });

  const changeAmbientTheme = useCallback((themeId) => {
    setAmbientTheme(themeId);
    try {
      localStorage.setItem('focus_ambient_theme', themeId);
    } catch {}
  }, []);

  // Audio Context Initialization (Lazy on first interaction)
  const initAudioEngine = useCallback(() => {
    if (audioCtxRef.current) return audioCtxRef.current;
    if (typeof window === 'undefined') return null;

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;

    try {
      const ctx = new AudioContextClass();
      const master = ctx.createGain();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;

      master.gain.setValueAtTime(masterVolume / 100, ctx.currentTime);
      master.connect(analyser);
      analyser.connect(ctx.destination);

      audioCtxRef.current = ctx;
      masterGainRef.current = master;
      analyserRef.current = analyser;

      return ctx;
    } catch {
      return null;
    }
  }, [masterVolume]);

  // Hybrid Sound Synthesizers (Studio CC0 Audio + Web Audio Procedural Fallback)
  const createSoundSource = (ctx, masterGain, soundId) => {
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.connect(masterGain);

    const soundDef = SOUND_DEFINITIONS.find((s) => s.id === soundId);
    if (!soundDef) return { gainNode, stopFn: () => {} };

    let stopFn = () => {};

    if (soundDef.type === 'binaural') {
      // Dynamic Binaural Beat Synthesis
      const mode = BRAINWAVE_MODES[soundDef.id] || BRAINWAVE_MODES.alpha;
      const oscL = ctx.createOscillator();
      const oscR = ctx.createOscillator();
      const panL = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
      const panR = ctx.createStereoPanner ? ctx.createStereoPanner() : null;

      oscL.type = 'sine';
      oscR.type = 'sine';
      oscL.frequency.setValueAtTime(mode.carrier, ctx.currentTime);
      oscR.frequency.setValueAtTime(mode.carrier + mode.hz, ctx.currentTime);

      binauralNodesRef.current = { oscL, oscR };

      if (panL && panR) {
        panL.pan.setValueAtTime(-1, ctx.currentTime);
        panR.pan.setValueAtTime(1, ctx.currentTime);
        oscL.connect(panL);
        oscR.connect(panR);
        panL.connect(gainNode);
        panR.connect(gainNode);
      } else {
        oscL.connect(gainNode);
        oscR.connect(gainNode);
      }

      oscL.start();
      oscR.start();

      stopFn = () => {
        try { oscL.stop(); oscR.stop(); } catch {}
        binauralNodesRef.current = null;
      };
    } else if (soundDef.id === 'scifi') {
      // Procedural Sci-Fi Starship Drone Synthesizer
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(360, ctx.currentTime);
      filter.Q.setValueAtTime(1.2, ctx.currentTime);
      filter.connect(gainNode);

      const oscs = [];
      const configs = [
        [55, 'sawtooth', 0.12],
        [55.4, 'sawtooth', 0.12],
        [82.4, 'triangle', 0.1],
        [110.2, 'sine', 0.08],
      ];

      configs.forEach(([freq, type, vol]) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        g.gain.setValueAtTime(vol, ctx.currentTime);
        osc.connect(g);
        g.connect(filter);
        osc.start();
        oscs.push(osc);
      });

      // LFO filter sweep
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.setValueAtTime(0.035, ctx.currentTime);
      lfoGain.gain.setValueAtTime(150, ctx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      lfo.start();
      oscs.push(lfo);

      stopFn = () => {
        oscs.forEach((o) => {
          try { o.stop(); } catch {}
        });
      };
    } else if (soundDef.type === 'procedural_noise') {
      // Procedural Colored Noise (Brown, Pink, White)
      const bufferSize = ctx.sampleRate * 3;
      const buffer = ctx.createBuffer(2, bufferSize, ctx.sampleRate);
      const dataL = buffer.getChannelData(0);
      const dataR = buffer.getChannelData(1);

      let lastOutL = 0.0, lastOutR = 0.0;
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

      for (let i = 0; i < bufferSize; i++) {
        const whiteL = Math.random() * 2 - 1;
        const whiteR = Math.random() * 2 - 1;

        if (soundDef.noiseType === 'brown') {
          lastOutL = (lastOutL + 0.02 * whiteL) / 1.02;
          lastOutR = (lastOutR + 0.02 * whiteR) / 1.02;
          dataL[i] = lastOutL * 3.5;
          dataR[i] = lastOutR * 3.5;
        } else if (soundDef.noiseType === 'pink') {
          b0 = 0.99886 * b0 + whiteL * 0.0555179;
          b1 = 0.99332 * b1 + whiteL * 0.0750759;
          b2 = 0.96900 * b2 + whiteL * 0.1538520;
          b3 = 0.86650 * b3 + whiteL * 0.3104856;
          b4 = 0.55000 * b4 + whiteL * 0.5329522;
          b5 = -0.7616 * b5 - whiteL * 0.0168980;
          dataL[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + whiteL * 0.5362) * 0.11;
          dataR[i] = dataL[i];
          b6 = whiteL * 0.115926;
        } else {
          // White noise
          dataL[i] = whiteL * 0.16;
          dataR[i] = whiteR * 0.16;
        }
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = buffer;
      noiseSource.loop = true;

      const filter = ctx.createBiquadFilter();
      if (soundDef.noiseType === 'brown') {
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(380, ctx.currentTime);
      } else if (soundDef.noiseType === 'pink') {
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1200, ctx.currentTime);
      } else {
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(4500, ctx.currentTime);
      }

      noiseSource.connect(filter);
      filter.connect(gainNode);
      noiseSource.start(0);

      stopFn = () => {
        try { noiseSource.stop(); } catch {}
      };
    } else if (soundDef.file && typeof window !== 'undefined' && window.Audio) {
      // Studio Recording (Moodist / Nahian CC0)
      try {
        const audio = new window.Audio();
        audio.loop = true;
        audio.crossOrigin = 'anonymous';

        const basePrefix = process.env.PUBLIC_URL || '';
        const sourceUrl = soundDef.file.startsWith('/')
          ? `${basePrefix}${soundDef.file}`
          : soundDef.file;

        audio.src = sourceUrl;

        let sourceNode = null;
        if (ctx && ctx.createMediaElementSource) {
          try {
            sourceNode = ctx.createMediaElementSource(audio);
            sourceNode.connect(gainNode);
          } catch (e) {
            // In case of any cross-origin issue, audio still plays via DOM
          }
        }

        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            if (soundDef.fallbackUrl && audio.src !== soundDef.fallbackUrl) {
              audio.src = soundDef.fallbackUrl;
              audio.play().catch(() => {});
            }
          });
        }

        stopFn = () => {
          try {
            audio.pause();
            audio.currentTime = 0;
            audio.removeAttribute('src');
            audio.load();
          } catch {}
        };
      } catch (err) {
        // Fallback for test/JSDOM
      }
    }

    return { gainNode, stopFn };
  };

  // Play session complete chime
  const playChime = useCallback(() => {
    const ctx = initAudioEngine();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const chimeGain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.3); // A5

      chimeGain.gain.setValueAtTime(0.3, now);
      chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

      osc.connect(chimeGain);
      chimeGain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 1.2);
    } catch {}
  }, [initAudioEngine]);

  // Master Play / Pause Toggle
  const toggleMasterPlay = useCallback(() => {
    const ctx = initAudioEngine();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    setIsPlaying((prev) => !prev);
  }, [initAudioEngine]);

  // Set single sound volume
  const setSoundVolume = useCallback((soundId, vol) => {
    const numVol = Math.max(0, Math.min(100, Number(vol)));
    setVolumes((prev) => ({
      ...prev,
      [soundId]: numVol,
    }));
    setActivePreset(null);

    // Auto switch atmospheric scene if mapped
    if (numVol > 0 && SOUND_TO_SCENE_MAP[soundId]) {
      setActiveScene(SOUND_TO_SCENE_MAP[soundId]);
    }
  }, []);

  // Toggle single sound on/off
  const toggleSound = useCallback((soundId) => {
    setVolumes((prev) => {
      const current = prev[soundId] || 0;
      const next = current > 0 ? 0 : 50;
      if (next > 0 && !isPlaying) {
        setIsPlaying(true);
        const ctx = initAudioEngine();
        if (ctx && ctx.state === 'suspended') ctx.resume().catch(() => {});
      }
      if (next > 0 && SOUND_TO_SCENE_MAP[soundId]) {
        setActiveScene(SOUND_TO_SCENE_MAP[soundId]);
      }
      return {
        ...prev,
        [soundId]: next,
      };
    });
  }, [isPlaying, initAudioEngine]);

  // Apply a curated or custom soundscape preset
  const applyPreset = useCallback((preset) => {
    if (!preset) return;
    setActivePreset(preset.id);
    const newVolumes = {};
    SOUND_DEFINITIONS.forEach((s) => {
      newVolumes[s.id] = preset.mix[s.id] || 0;
    });
    setVolumes(newVolumes);

    if (preset.scene) {
      setActiveScene(preset.scene);
    }

    if (!isPlaying) {
      setIsPlaying(true);
      const ctx = initAudioEngine();
      if (ctx && ctx.state === 'suspended') ctx.resume().catch(() => {});
    }
  }, [isPlaying, initAudioEngine]);

  // Shuffle: a surprise mix of 2-3 harmonious sounds
  const shuffleMix = useCallback(() => {
    const eligible = SOUND_DEFINITIONS.filter((s) => s.id !== 'scifi');
    const pick1 = eligible[Math.floor(Math.random() * eligible.length)];
    const pick2 = eligible[Math.floor(Math.random() * eligible.length)];
    const pick3 = Math.random() > 0.4 ? eligible[Math.floor(Math.random() * eligible.length)] : null;

    const newVolumes = {};
    SOUND_DEFINITIONS.forEach((s) => {
      newVolumes[s.id] = 0;
    });

    newVolumes[pick1.id] = 50 + Math.floor(Math.random() * 25);
    newVolumes[pick2.id] = 30 + Math.floor(Math.random() * 25);
    if (pick3 && pick3.id !== pick1.id && pick3.id !== pick2.id) {
      newVolumes[pick3.id] = 25 + Math.floor(Math.random() * 20);
    }

    setVolumes(newVolumes);
    setActivePreset(null);

    const primaryScene = SOUND_TO_SCENE_MAP[pick1.id] || SOUND_TO_SCENE_MAP[pick2.id] || 'forest';
    setActiveScene(primaryScene);

    if (!isPlaying) {
      setIsPlaying(true);
      const ctx = initAudioEngine();
      if (ctx && ctx.state === 'suspended') ctx.resume().catch(() => {});
    }
  }, [isPlaying, initAudioEngine]);

  // Clear all sound layers
  const clearAllSounds = useCallback(() => {
    setVolumes((prev) => {
      const reset = {};
      Object.keys(prev).forEach((k) => {
        reset[k] = 0;
      });
      return reset;
    });
    setActivePreset(null);
  }, []);

  // Sync Master Volume
  useEffect(() => {
    if (!audioCtxRef.current || !masterGainRef.current) return;
    const ctx = audioCtxRef.current;
    const gain = masterGainRef.current;
    const target = isMuted ? 0 : masterVolume / 100;
    gain.gain.cancelScheduledValues(ctx.currentTime);
    gain.gain.linearRampToValueAtTime(target, ctx.currentTime + 0.05);
  }, [masterVolume, isMuted]);

  // Sync Individual Sound Nodes with Volumes
  useEffect(() => {
    if (!isPlaying) {
      Object.keys(soundNodesRef.current).forEach((soundId) => {
        const nodeObj = soundNodesRef.current[soundId];
        if (nodeObj && nodeObj.stopFn) {
          try { nodeObj.stopFn(); } catch {}
        }
      });
      soundNodesRef.current = {};
      return;
    }

    const ctx = initAudioEngine();
    if (!ctx || !masterGainRef.current) return;

    SOUND_DEFINITIONS.forEach((sound) => {
      const vol = volumes[sound.id] || 0;
      const targetGain = vol / 100;

      let nodeObj = soundNodesRef.current[sound.id];

      if (targetGain > 0) {
        if (!nodeObj) {
          nodeObj = createSoundSource(ctx, masterGainRef.current, sound.id);
          soundNodesRef.current[sound.id] = nodeObj;
        }
        if (nodeObj && nodeObj.gainNode) {
          nodeObj.gainNode.gain.cancelScheduledValues(ctx.currentTime);
          nodeObj.gainNode.gain.linearRampToValueAtTime(targetGain, ctx.currentTime + 0.1);
        }
      } else if (nodeObj) {
        if (nodeObj.gainNode) {
          nodeObj.gainNode.gain.cancelScheduledValues(ctx.currentTime);
          nodeObj.gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.1);
        }
        setTimeout(() => {
          if ((volumes[sound.id] || 0) === 0 && soundNodesRef.current[sound.id]) {
            try { soundNodesRef.current[sound.id].stopFn(); } catch {}
            delete soundNodesRef.current[sound.id];
          }
        }, 150);
      }
    });
  }, [isPlaying, volumes, initAudioEngine]);

  // Analog Vinyl Warmth Effect Node
  useEffect(() => {
    if (!audioCtxRef.current || !masterGainRef.current) return;
    const ctx = audioCtxRef.current;

    if (isVinylWarmth && !vinylNodeRef.current) {
      try {
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowshelf';
        filter.frequency.setValueAtTime(280, ctx.currentTime);
        filter.gain.setValueAtTime(4.5, ctx.currentTime);

        const highCut = ctx.createBiquadFilter();
        highCut.type = 'highshelf';
        highCut.frequency.setValueAtTime(8000, ctx.currentTime);
        highCut.gain.setValueAtTime(-2.5, ctx.currentTime);

        filter.connect(highCut);
        vinylNodeRef.current = { filter, highCut };
      } catch {}
    }
  }, [isVinylWarmth]);

  // Pomodoro Timer Engine
  useEffect(() => {
    if (timerStatus !== 'running') return;

    const interval = setInterval(() => {
      if (timerMode === 'stopwatch') {
        setStopwatchSeconds((prev) => prev + 1);
        return;
      }

      setTimeRemaining((prev) => {
        if (prev <= 1) {
          playChime();
          const modeConfig = TIMER_MODES[timerMode] || TIMER_MODES.pomodoro;

          if (timerPhase === 'focus') {
            logCompletedSession(currentTaskRef.current, modeConfig.focusMinutes, modeConfig.label);
            setCompletedSessions((s) => s + 1);
            setTimerPhase('break');
            return modeConfig.breakMinutes * 60;
          } else {
            setTimerPhase('focus');
            return modeConfig.focusMinutes * 60;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerStatus, timerMode, timerPhase, playChime, logCompletedSession]);

  // Timer Control Callbacks
  const startTimer = useCallback(() => {
    setTimerStatus('running');
  }, []);

  const pauseTimer = useCallback(() => {
    setTimerStatus('paused');
  }, []);

  const resetTimer = useCallback(() => {
    setTimerStatus('idle');
    setTimerPhase('focus');
    setStopwatchSeconds(0);
    const modeConfig = TIMER_MODES[timerMode] || TIMER_MODES.pomodoro;
    setTimeRemaining(modeConfig.focusMinutes * 60);
  }, [timerMode]);

  const changeTimerMode = useCallback((newMode) => {
    setTimerMode(newMode);
    setTimerStatus('idle');
    setTimerPhase('focus');
    setStopwatchSeconds(0);
    const modeConfig = TIMER_MODES[newMode] || TIMER_MODES.pomodoro;
    setTimeRemaining(modeConfig.focusMinutes * 60);
  }, []);

  // Mindful Box Breathing Cycle (4s Inhale -> 4s Hold -> 4s Exhale -> 4s Hold)
  useEffect(() => {
    if (!isBreathingMode) return;

    const interval = setInterval(() => {
      setBreathingSeconds((prev) => {
        if (prev <= 1) {
          setBreathingPhase((currentPhase) => {
            switch (currentPhase) {
              case 'inhale': return 'hold-in';
              case 'hold-in': return 'exhale';
              case 'exhale': return 'hold-out';
              case 'hold-out': return 'inhale';
              default: return 'inhale';
            }
          });
          return 4;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isBreathingMode]);

  // Browser Tab Title Synchronization
  useEffect(() => {
    if (timerStatus === 'running') {
      const formatTime = (secs) => {
        const h = Math.floor(secs / 3600);
        const m = Math.floor((secs % 3600) / 60);
        const s = secs % 60;
        if (h > 0) {
          return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        }
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
      };

      const timeStr = timerMode === 'stopwatch'
        ? formatTime(stopwatchSeconds)
        : formatTime(timeRemaining);
      const phaseStr = timerPhase === 'focus' ? 'Focus' : 'Break';
      document.title = `(${timeStr}) ${phaseStr} · Focus Station`;
    } else {
      document.title = 'Focus Station · Hasan';
    }
  }, [timerStatus, timeRemaining, stopwatchSeconds, timerMode, timerPhase]);

  const activeSoundsCount = Object.values(volumes).filter((v) => v > 0).length;

  const value = {
    // Soundboard
    isPlaying,
    toggleMasterPlay,
    masterVolume,
    setMasterVolume,
    isMuted,
    setIsMuted,
    volumes,
    setSoundVolume,
    toggleSound,
    activePreset,
    applyPreset,
    clearAllSounds,
    activeSoundsCount,
    analyserRef,
    shuffleMix,
    favorites,
    toggleFavorite,
    sleepTimerMinutes,
    sleepTimerRemaining,
    setSleepTimer,
    getShareableMixUrl,
    loadMixString,

    // Scenes & Atmosphere
    activeScene,
    changeScene,

    // Quotes
    currentQuoteIndex,
    nextQuote,
    prevQuote,

    // YouTube Integration
    currentYtTrack,
    isYtPlaying,
    ytVolume,
    setYtVolume,
    isYtFolded,
    toggleYtFold,
    customYtLinks,
    playYtTrack,
    toggleYtPlay,
    nextYtTrack,
    prevYtTrack,
    addCustomYtLink,
    removeCustomYtLink,

    // Timer
    timerMode,
    changeTimerMode,
    timerStatus,
    timerPhase,
    timeRemaining,
    stopwatchSeconds,
    startTimer,
    pauseTimer,
    resetTimer,
    completedSessions,
    currentTask,
    setCurrentTask,
    sessionHistory,
    clearSessionHistory,

    // Brainwave & Synth
    brainwaveMode,
    changeBrainwaveMode,
    isVinylWarmth,
    setIsVinylWarmth,

    // Custom Presets
    userPresets,
    saveUserPreset,
    deleteUserPreset,

    // Breathing
    isBreathingMode,
    setIsBreathingMode,
    breathingPhase,
    breathingSeconds,

    // Themes & Zen
    ambientTheme,
    changeAmbientTheme,
    isZenMode,
    setIsZenMode,
  };

  return <FocusContext.Provider value={value}>{children}</FocusContext.Provider>;
};

export const useFocus = () => {
  const ctx = useContext(FocusContext);
  if (!ctx) {
    throw new Error('useFocus must be used within a FocusProvider');
  }
  return ctx;
};
