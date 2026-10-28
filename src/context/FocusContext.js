import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';

const FocusContext = createContext(null);

export const SOUND_DEFINITIONS = [
  { id: 'brown', name: 'Brown Noise', category: 'Noise', icon: '🌊', desc: 'Warm deep low-frequency sound for deep focus' },
  { id: 'pink', name: 'Pink Noise', category: 'Noise', icon: '💨', desc: 'Balanced 1/f soothing static waterfall' },
  { id: 'rain', name: 'Gentle Rain', category: 'Nature', icon: '🌧️', desc: 'Soothing rain drops on a glass window' },
  { id: 'thunder', name: 'Distant Thunder', category: 'Nature', icon: '⚡', desc: 'Deep rolling rumbles over the hills' },
  { id: 'binaural', name: 'Binaural Alpha (10Hz)', category: 'Brainwave', icon: '🧠', desc: '10 Hz frequency for cognitive flow and coding' },
  { id: 'cafe', name: 'Coffee Shop', category: 'Ambience', icon: '☕', desc: 'Warm café murmur and ceramic clinking' },
  { id: 'forest', name: 'Forest Breeze', category: 'Nature', icon: '🌲', desc: 'Gentle wind rustling through pine trees' },
  { id: 'campfire', name: 'Campfire', category: 'Nature', icon: '🔥', desc: 'Soothing crackling wood and warm embers' },
  { id: 'keyboard', name: 'Mechanical Keys', category: 'Coding', icon: '⌨️', desc: 'Rhythmic Cherry MX programmer typing' },
  { id: 'crickets', name: 'Night Crickets', category: 'Nature', icon: '🦗', desc: 'Peaceful evening crickets under stars' },
];

export const FOCUS_PRESETS = [
  {
    id: 'deep-arch',
    name: 'Deep Architecture Flow',
    icon: '⚡',
    desc: 'Brown noise + Gentle rain for deep backend modeling',
    mix: { brown: 65, rain: 45, binaural: 35 },
  },
  {
    id: 'monsoon-cafe',
    name: 'Monsoon Coffee Shop',
    icon: '☕',
    desc: 'Rain + Café ambience with distant thunder',
    mix: { rain: 60, cafe: 45, thunder: 25 },
  },
  {
    id: 'midnight-terminal',
    name: 'Midnight Terminal',
    icon: '💻',
    desc: 'Mechanical keyboard + Pink noise + Night crickets',
    mix: { keyboard: 50, pink: 35, crickets: 25 },
  },
  {
    id: 'zen-sanctuary',
    name: 'Zen Forest Sanctuary',
    icon: '🌲',
    desc: 'Forest breeze + Campfire embers',
    mix: { forest: 55, campfire: 35, rain: 20 },
  },
  {
    id: 'binaural-code',
    name: 'Binaural Alpha State',
    icon: '🧠',
    desc: '10Hz Alpha brainwaves + Brown noise isolation',
    mix: { binaural: 75, brown: 40 },
  },
];

export const YOUTUBE_CHANNELS = [
  { id: 'jfKfPfyJRdk', title: 'Lofi Girl - Beats to Relax/Study', artist: 'Lofi Records', tag: 'Lo-Fi Chill' },
  { id: '4xDzrJKXOOY', title: 'Synthwave Radio - Chill Synth / Cyberpunk', artist: 'Lofi Girl', tag: 'Synthwave' },
  { id: 'DWcJFNfaw9c', title: 'Coffee Shop Radio - 24/7 Chill Beats', artist: 'STEEZYASFUCK', tag: 'Jazzhop' },
  { id: 'lTRiuFIWV54', title: 'Peaceful Piano & Rain - Ambient Work', artist: 'The Soul of Wind', tag: 'Piano & Rain' },
];

export const TIMER_MODES = {
  deep: { id: 'deep', label: 'Deep Work', focusMinutes: 50, breakMinutes: 10 },
  pomodoro: { id: 'pomodoro', label: 'Classic Pomodoro', focusMinutes: 25, breakMinutes: 5 },
  sprint: { id: 'sprint', label: 'Code Sprint', focusMinutes: 15, breakMinutes: 3 },
  stopwatch: { id: 'stopwatch', label: 'Continuous Flow', focusMinutes: 0, breakMinutes: 0 },
};

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

  // Pomodoro Timer State
  const [timerMode, setTimerMode] = useState('pomodoro');
  const [timerStatus, setTimerStatus] = useState('idle'); // 'idle' | 'running' | 'paused'
  const [timerPhase, setTimerPhase] = useState('focus'); // 'focus' | 'break'
  const [timeRemaining, setTimeRemaining] = useState(25 * 60);
  const [stopwatchSeconds, setStopwatchSeconds] = useState(0);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [currentTask, setCurrentTask] = useState(() => {
    try {
      return localStorage.getItem('focus_current_task') || 'Architecting ASP.NET Core & Microservices';
    } catch {
      return 'Architecting ASP.NET Core & Microservices';
    }
  });

  // YouTube Stream State
  const [activeYouTube, setActiveYouTube] = useState(null); // channel object or null
  const [isYtPlaying, setIsYtPlaying] = useState(false);
  const [isYtFolded, setIsYtFolded] = useState(false);

  // Zen / Immersive Fullscreen State
  const [isZenMode, setIsZenMode] = useState(false);

  // Persist Current Task to storage
  useEffect(() => {
    try {
      localStorage.setItem('focus_current_task', currentTask);
    } catch {
      // ignore
    }
  }, [currentTask]);

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

  // Sound Synthesizers utilizing Web Audio API Buffer/Filter Graphs
  const createSoundSource = (ctx, masterGain, soundId) => {
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.connect(masterGain);

    let stopFn = () => {};

    if (soundId === 'brown' || soundId === 'pink' || soundId === 'rain' || soundId === 'campfire' || soundId === 'forest' || soundId === 'cafe') {
      const bufferSize = ctx.sampleRate * 3;
      const buffer = ctx.createBuffer(2, bufferSize, ctx.sampleRate);
      const dataL = buffer.getChannelData(0);
      const dataR = buffer.getChannelData(1);

      let lastOutL = 0.0;
      let lastOutR = 0.0;
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

      for (let i = 0; i < bufferSize; i++) {
        const whiteL = Math.random() * 2 - 1;
        const whiteR = Math.random() * 2 - 1;

        if (soundId === 'brown' || soundId === 'campfire') {
          lastOutL = (lastOutL + 0.02 * whiteL) / 1.02;
          lastOutR = (lastOutR + 0.02 * whiteR) / 1.02;
          dataL[i] = lastOutL * 3.5;
          dataR[i] = lastOutR * 3.5;
        } else if (soundId === 'pink' || soundId === 'cafe') {
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
          // Rain / Forest: multi-band texture
          dataL[i] = whiteL * 0.22;
          dataR[i] = whiteR * 0.22;
        }
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = buffer;
      noiseSource.loop = true;

      // Filter Shaping
      const filter = ctx.createBiquadFilter();
      if (soundId === 'brown') {
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(380, ctx.currentTime);
      } else if (soundId === 'pink') {
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1200, ctx.currentTime);
      } else if (soundId === 'rain') {
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(950, ctx.currentTime);
        filter.Q.setValueAtTime(0.8, ctx.currentTime);
      } else if (soundId === 'forest') {
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(650, ctx.currentTime);
      } else if (soundId === 'cafe') {
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(750, ctx.currentTime);
      } else if (soundId === 'campfire') {
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(450, ctx.currentTime);
      }

      noiseSource.connect(filter);
      filter.connect(gainNode);
      noiseSource.start(0);

      stopFn = () => {
        try { noiseSource.stop(); } catch {}
      };
    } else if (soundId === 'binaural') {
      // 10 Hz Binaural Alpha Beat: 210 Hz Left, 200 Hz Right
      const oscL = ctx.createOscillator();
      const oscR = ctx.createOscillator();
      const panL = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
      const panR = ctx.createStereoPanner ? ctx.createStereoPanner() : null;

      oscL.type = 'sine';
      oscR.type = 'sine';
      oscL.frequency.setValueAtTime(200, ctx.currentTime);
      oscR.frequency.setValueAtTime(210, ctx.currentTime);

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
      };
    } else if (soundId === 'crickets') {
      // Modulated High-Frequency Crickets Chirp
      const osc = ctx.createOscillator();
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(4600, ctx.currentTime);
      lfo.type = 'sawtooth';
      lfo.frequency.setValueAtTime(16, ctx.currentTime);
      lfoGain.gain.setValueAtTime(0.7, ctx.currentTime);

      lfo.connect(lfoGain.gain);
      osc.connect(gainNode);
      osc.start();
      lfo.start();

      stopFn = () => {
        try { osc.stop(); lfo.stop(); } catch {}
      };
    } else if (soundId === 'keyboard') {
      // ASMR Mechanical Keyboard Rhythmic Interval
      let timerId = null;
      const triggerKeyClick = () => {
        if (!audioCtxRef.current) return;
        const now = ctx.currentTime;
        const clickOsc = ctx.createOscillator();
        const clickGain = ctx.createGain();

        clickOsc.type = 'triangle';
        clickOsc.frequency.setValueAtTime(120 + Math.random() * 80, now);
        clickOsc.frequency.exponentialRampToValueAtTime(30, now + 0.04);

        clickGain.gain.setValueAtTime(0.5, now);
        clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

        clickOsc.connect(clickGain);
        clickGain.connect(gainNode);

        clickOsc.start(now);
        clickOsc.stop(now + 0.05);

        const nextDelay = 120 + Math.random() * 260;
        timerId = setTimeout(triggerKeyClick, nextDelay);
      };

      triggerKeyClick();
      stopFn = () => {
        if (timerId) clearTimeout(timerId);
      };
    } else if (soundId === 'thunder') {
      // Periodic Distant Thunder Rumbles
      let thunderTimer = null;
      const triggerThunder = () => {
        if (!audioCtxRef.current) return;
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const thunderGain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(140, now);

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(55, now);
        osc.frequency.linearRampToValueAtTime(35, now + 2.5);

        thunderGain.gain.setValueAtTime(0.001, now);
        thunderGain.gain.linearRampToValueAtTime(0.4, now + 0.6);
        thunderGain.gain.exponentialRampToValueAtTime(0.001, now + 3.0);

        osc.connect(filter);
        filter.connect(thunderGain);
        thunderGain.connect(gainNode);

        osc.start(now);
        osc.stop(now + 3.2);

        thunderTimer = setTimeout(triggerThunder, 10000 + Math.random() * 15000);
      };

      thunderTimer = setTimeout(triggerThunder, 2000);
      stopFn = () => {
        if (thunderTimer) clearTimeout(thunderTimer);
      };
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
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5

      chimeGain.gain.setValueAtTime(0.35, now);
      chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);

      osc.connect(chimeGain);
      chimeGain.connect(masterGainRef.current || ctx.destination);

      osc.start(now);
      osc.stop(now + 1.8);
    } catch {}
  }, [initAudioEngine]);

  // Master Volume & Mute Update
  useEffect(() => {
    if (masterGainRef.current && audioCtxRef.current) {
      const vol = isMuted ? 0 : masterVolume / 100;
      masterGainRef.current.gain.setTargetAtTime(vol, audioCtxRef.current.currentTime, 0.05);
    }
  }, [masterVolume, isMuted]);

  // Synchronize Per-Sound Node Gains
  useEffect(() => {
    if (!isPlaying) return;
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    Object.entries(volumes).forEach(([id, vol]) => {
      let sound = soundNodesRef.current[id];
      if (vol > 0 && !sound) {
        sound = createSoundSource(ctx, masterGainRef.current, id);
        soundNodesRef.current[id] = sound;
      }

      if (sound) {
        const targetGain = (vol / 100) * 0.8;
        sound.gainNode.gain.setTargetAtTime(targetGain, ctx.currentTime, 0.05);
      }
    });
  }, [volumes, isPlaying]);

  // Toggle Master Sound State
  const toggleMasterPlay = () => {
    const ctx = initAudioEngine();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume();
    }

    if (isPlaying) {
      // Fade out all sounds
      Object.values(soundNodesRef.current).forEach((s) => s.stopFn());
      soundNodesRef.current = {};
      setIsPlaying(false);
    } else {
      // If all volumes are currently 0, default to Deep Architecture Preset
      const hasActive = Object.values(volumes).some((v) => v > 0);
      if (!hasActive) {
        applyPreset(FOCUS_PRESETS[0]);
      }
      setIsPlaying(true);
    }
  };

  // Adjust Individual Sound Volume
  const setSoundVolume = (soundId, val) => {
    const num = Math.max(0, Math.min(100, Number(val)));
    setVolumes((prev) => ({ ...prev, [soundId]: num }));
    setActivePreset(null);

    if (num > 0 && !isPlaying) {
      const ctx = initAudioEngine();
      if (ctx && ctx.state === 'suspended') {
        ctx.resume();
      }
      setIsPlaying(true);
    }
  };

  // Toggle Single Sound
  const toggleSound = (soundId) => {
    const current = volumes[soundId] || 0;
    setSoundVolume(soundId, current > 0 ? 0 : 50);
  };

  // Apply Curated Preset
  const applyPreset = (preset) => {
    const ctx = initAudioEngine();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume();
    }

    const newVols = {};
    SOUND_DEFINITIONS.forEach((s) => {
      newVols[s.id] = preset.mix[s.id] || 0;
    });

    setVolumes(newVols);
    setActivePreset(preset.id);
    setIsPlaying(true);
  };

  // Clear All Active Sounds
  const clearAllSounds = () => {
    const newVols = {};
    SOUND_DEFINITIONS.forEach((s) => {
      newVols[s.id] = 0;
    });
    setVolumes(newVols);
    setActivePreset(null);
    if (isPlaying) {
      Object.values(soundNodesRef.current).forEach((s) => s.stopFn());
      soundNodesRef.current = {};
      setIsPlaying(false);
    }
  };

  // Timer Tick Engine
  useEffect(() => {
    if (timerStatus !== 'running') return;

    const interval = setInterval(() => {
      if (timerMode === 'stopwatch') {
        setStopwatchSeconds((prev) => prev + 1);
      } else {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            playChime();
            if (timerPhase === 'focus') {
              setCompletedSessions((c) => c + 1);
              setTimerPhase('break');
              return (TIMER_MODES[timerMode]?.breakMinutes || 5) * 60;
            } else {
              setTimerPhase('focus');
              return (TIMER_MODES[timerMode]?.focusMinutes || 25) * 60;
            }
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timerStatus, timerMode, timerPhase, playChime]);

  const startTimer = () => {
    setTimerStatus('running');
  };

  const pauseTimer = () => {
    setTimerStatus('paused');
  };

  const resetTimer = (newMode) => {
    const mode = newMode || timerMode;
    setTimerStatus('idle');
    setTimerPhase('focus');
    if (mode === 'stopwatch') {
      setStopwatchSeconds(0);
    } else {
      setTimeRemaining((TIMER_MODES[mode]?.focusMinutes || 25) * 60);
    }
  };

  const changeTimerMode = (newMode) => {
    setTimerMode(newMode);
    resetTimer(newMode);
  };

  // Active Sounds Count
  const activeSoundsCount = Object.values(volumes).filter((v) => v > 0).length;

  return (
    <FocusContext.Provider
      value={{
        // Sounds
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

        // YouTube
        activeYouTube,
        setActiveYouTube,
        isYtPlaying,
        setIsYtPlaying,
        isYtFolded,
        setIsYtFolded,

        // Zen Mode
        isZenMode,
        setIsZenMode,
      }}
    >
      {children}
    </FocusContext.Provider>
  );
};

export const useFocus = () => {
  const ctx = useContext(FocusContext);
  if (!ctx) {
    throw new Error('useFocus must be used within a FocusProvider');
  }
  return ctx;
};
