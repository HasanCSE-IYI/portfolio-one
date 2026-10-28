import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';

const FocusContext = createContext(null);

export const BRAINWAVE_MODES = {
  alpha: { id: 'alpha', label: 'Alpha', hz: 10, icon: '🧠', tag: '10Hz Flow', desc: 'Flow State & Creative Architecture', carrier: 200 },
  beta: { id: 'beta', label: 'Beta', hz: 18, icon: '⚡', tag: '18Hz Focus', desc: 'Active Problem Solving & Debugging', carrier: 220 },
  theta: { id: 'theta', label: 'Theta', hz: 6, icon: '🌌', tag: '6Hz Insight', desc: 'Deep Intuition & Algorithmic Design', carrier: 180 },
  gamma: { id: 'gamma', label: 'Gamma', hz: 40, icon: '💎', tag: '40Hz Peak', desc: 'Peak Cognitive Synthesis & Logic', carrier: 240 },
  delta: { id: 'delta', label: 'Delta', hz: 2, icon: '🌙', tag: '2Hz Rest', desc: 'Deep Mental Recovery & Restoration', carrier: 150 },
};

export const AMBIENT_THEMES = [
  { id: 'obsidian', name: 'Obsidian Dark', icon: '🌑', desc: 'Apple dark glassmorphism with subtle warm amber accents' },
  { id: 'aurora', name: 'Nordic Aurora', icon: '🌌', desc: 'Ethereal emerald and cyan northern lights mesh' },
  { id: 'cyberpunk', name: 'Cyberpunk Tokyo', icon: '⚡', desc: 'Midnight Tokyo neon purple and amber horizon' },
  { id: 'nebula', name: 'Deep Nebula', icon: '🪐', desc: 'Cosmic deep space sapphire and violet stellar shimmer' },
  { id: 'sunset', name: 'Pacific Sunset', icon: '🌅', desc: 'Warm Cupertino dusk peach, coral and gold ambient glow' },
];

export const SOUND_DEFINITIONS = [
  { id: 'brown', name: 'Brown Noise', category: 'Noise', icon: '🌊', desc: 'Warm deep low-frequency sound for deep focus' },
  { id: 'pink', name: 'Pink Noise', category: 'Noise', icon: '💨', desc: 'Balanced 1/f soothing static waterfall' },
  { id: 'white', name: 'White Noise', category: 'Noise', icon: '📻', desc: 'Crisp wideband static for acoustic isolation' },
  { id: 'rain', name: 'Gentle Rain', category: 'Nature', icon: '🌧️', desc: 'Soothing rain drops on a glass window' },
  { id: 'thunder', name: 'Distant Thunder', category: 'Nature', icon: '⚡', desc: 'Deep rolling rumbles over the hills' },
  { id: 'waves', name: 'Ocean Waves', category: 'Nature', icon: '🌊', desc: 'Rhythmic ocean swells washing ashore' },
  { id: 'wind', name: 'Mountain Wind', category: 'Nature', icon: '🍃', desc: 'Howling alpine gust sweeping through peaks' },
  { id: 'forest', name: 'Forest Breeze', category: 'Nature', icon: '🌲', desc: 'Gentle wind rustling through pine trees' },
  { id: 'campfire', name: 'Campfire', category: 'Nature', icon: '🔥', desc: 'Soothing crackling wood and warm embers' },
  { id: 'birds', name: 'Morning Birds', category: 'Nature', icon: '🐦', desc: 'Gentle melodious birdsong in morning light' },
  { id: 'crickets', name: 'Night Crickets', category: 'Nature', icon: '🦗', desc: 'Peaceful evening crickets under stars' },
  { id: 'binaural', name: 'Binaural Alpha (10Hz)', category: 'Brainwave', icon: '🧠', desc: '10 Hz frequency for cognitive flow and coding' },
  { id: 'cafe', name: 'Coffee Shop', category: 'Ambience', icon: '☕', desc: 'Warm café murmur and ceramic clinking' },
  { id: 'keyboard', name: 'Mechanical Keys', category: 'Coding', icon: '⌨️', desc: 'Rhythmic Cherry MX programmer typing' },
  { id: 'clock', name: 'Tick-Tock Clock', category: 'Coding', icon: '⏱️', desc: 'Steady 1 Hz rhythmic pacing click' },
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
    id: 'coastal-dawn',
    name: 'Coastal Code Sanctuary',
    icon: '🌊',
    desc: 'Ocean waves + Gentle rain + Binaural alpha flow',
    mix: { waves: 65, rain: 40, binaural: 35 },
  },
  {
    id: 'nordic-cabin',
    name: 'Nordic Mountain Cabin',
    icon: '🏔️',
    desc: 'Mountain wind + Campfire + Distant thunder',
    mix: { wind: 55, campfire: 45, thunder: 25 },
  },
  {
    id: 'morning-garden',
    name: 'Morning Garden Flow',
    icon: '🐦',
    desc: 'Morning birds + Forest breeze + Brown noise',
    mix: { birds: 60, forest: 50, brown: 30 },
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

  // Persist Current Task to storage & track in ref for timer
  const currentTaskRef = useRef(currentTask);
  useEffect(() => {
    currentTaskRef.current = currentTask;
    try {
      localStorage.setItem('focus_current_task', currentTask);
    } catch {
      // ignore
    }
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
      task: taskName || 'Deep Work Sprint',
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

  // Multi-State Brainwave Tuner (Alpha, Beta, Theta, Gamma, Delta)
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
      desc: 'Custom developer soundscape',
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
  }, [volumes]);

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

  // Apple-style Mindful Box Breathing (4s Inhale, 4s Hold, 4s Exhale, 4s Hold)
  const [isBreathingMode, setIsBreathingMode] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState('inhale');
  const [breathingSeconds, setBreathingSeconds] = useState(4);

  // Ambient Dynamic Backdrops (Obsidian, Aurora, Cyberpunk, Nebula, Sunset)
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
      // Dynamic Binaural Beat (Alpha, Beta, Theta, Gamma, Delta)
      const mode = BRAINWAVE_MODES[brainwaveModeRef.current] || BRAINWAVE_MODES.alpha;
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
    } else if (soundId === 'white') {
      // Pure White Noise static
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(2, bufferSize, ctx.sampleRate);
      const dataL = buffer.getChannelData(0);
      const dataR = buffer.getChannelData(1);
      for (let i = 0; i < bufferSize; i++) {
        dataL[i] = (Math.random() * 2 - 1) * 0.16;
        dataR[i] = (Math.random() * 2 - 1) * 0.16;
      }
      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = buffer;
      noiseSource.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(4500, ctx.currentTime);

      noiseSource.connect(filter);
      filter.connect(gainNode);
      noiseSource.start(0);

      stopFn = () => {
        try { noiseSource.stop(); } catch {}
      };
    } else if (soundId === 'waves') {
      // Ocean Waves: Brown noise with periodic swell LFO on filter and gain
      const bufferSize = ctx.sampleRate * 3;
      const buffer = ctx.createBuffer(2, bufferSize, ctx.sampleRate);
      const dataL = buffer.getChannelData(0);
      const dataR = buffer.getChannelData(1);
      let lastOutL = 0.0, lastOutR = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const whiteL = Math.random() * 2 - 1;
        const whiteR = Math.random() * 2 - 1;
        lastOutL = (lastOutL + 0.02 * whiteL) / 1.02;
        lastOutR = (lastOutR + 0.02 * whiteR) / 1.02;
        dataL[i] = lastOutL * 3.2;
        dataR[i] = lastOutR * 3.2;
      }
      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = buffer;
      noiseSource.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, ctx.currentTime);

      const swellGain = ctx.createGain();
      swellGain.gain.setValueAtTime(0.3, ctx.currentTime);

      const lfo = ctx.createOscillator();
      const lfoFilterGain = ctx.createGain();
      const lfoAmpGain = ctx.createGain();

      lfo.type = 'sine';
      lfo.frequency.setValueAtTime(0.09, ctx.currentTime);
      lfoFilterGain.gain.setValueAtTime(280, ctx.currentTime);
      lfoAmpGain.gain.setValueAtTime(0.35, ctx.currentTime);

      lfo.connect(lfoFilterGain);
      lfoFilterGain.connect(filter.frequency);

      lfo.connect(lfoAmpGain);
      lfoAmpGain.connect(swellGain.gain);

      noiseSource.connect(filter);
      filter.connect(swellGain);
      swellGain.connect(gainNode);

      noiseSource.start(0);
      lfo.start(0);

      stopFn = () => {
        try {
          noiseSource.stop();
          lfo.stop();
        } catch {}
      };
    } else if (soundId === 'wind') {
      // Alpine Mountain Wind: Pink noise through modulated resonant bandpass
      const bufferSize = ctx.sampleRate * 3;
      const buffer = ctx.createBuffer(2, bufferSize, ctx.sampleRate);
      const dataL = buffer.getChannelData(0);
      const dataR = buffer.getChannelData(1);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const whiteL = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + whiteL * 0.0555179;
        b1 = 0.99332 * b1 + whiteL * 0.0750759;
        b2 = 0.96900 * b2 + whiteL * 0.1538520;
        b3 = 0.86650 * b3 + whiteL * 0.3104856;
        b4 = 0.55000 * b4 + whiteL * 0.5329522;
        b5 = -0.7616 * b5 - whiteL * 0.0168980;
        dataL[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + whiteL * 0.5362) * 0.18;
        dataR[i] = dataL[i];
        b6 = whiteL * 0.115926;
      }
      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = buffer;
      noiseSource.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(450, ctx.currentTime);
      filter.Q.setValueAtTime(2.2, ctx.currentTime);

      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.type = 'sine';
      lfo.frequency.setValueAtTime(0.14, ctx.currentTime);
      lfoGain.gain.setValueAtTime(220, ctx.currentTime);

      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);

      noiseSource.connect(filter);
      filter.connect(gainNode);

      noiseSource.start(0);
      lfo.start(0);

      stopFn = () => {
        try {
          noiseSource.stop();
          lfo.stop();
        } catch {}
      };
    } else if (soundId === 'birds') {
      // Morning Birds: Intermittent melodic sine bursts with frequency chirps
      let birdTimer = null;
      const triggerBirdSong = () => {
        if (!audioCtxRef.current) return;
        const now = ctx.currentTime;
        const count = 2 + Math.floor(Math.random() * 3);
        for (let c = 0; c < count; c++) {
          const chirpStart = now + c * 0.12;
          const osc = ctx.createOscillator();
          const chirpGain = ctx.createGain();

          osc.type = 'sine';
          const baseFreq = 2600 + Math.random() * 600;
          osc.frequency.setValueAtTime(baseFreq, chirpStart);
          osc.frequency.linearRampToValueAtTime(baseFreq + 800, chirpStart + 0.05);
          osc.frequency.exponentialRampToValueAtTime(baseFreq - 200, chirpStart + 0.09);

          chirpGain.gain.setValueAtTime(0.001, chirpStart);
          chirpGain.gain.linearRampToValueAtTime(0.18, chirpStart + 0.02);
          chirpGain.gain.exponentialRampToValueAtTime(0.001, chirpStart + 0.09);

          osc.connect(chirpGain);
          chirpGain.connect(gainNode);

          osc.start(chirpStart);
          osc.stop(chirpStart + 0.1);
        }
        birdTimer = setTimeout(triggerBirdSong, 2500 + Math.random() * 4500);
      };

      birdTimer = setTimeout(triggerBirdSong, 800);
      stopFn = () => {
        if (birdTimer) clearTimeout(birdTimer);
      };
    } else if (soundId === 'clock') {
      // Tick-Tock Clock: Alternating 1-second cadence tick
      let clockTimer = null;
      let isTick = true;
      const triggerClock = () => {
        if (!audioCtxRef.current) return;
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const clickGain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(isTick ? 1200 : 900, now);
        isTick = !isTick;

        clickGain.gain.setValueAtTime(0.3, now);
        clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

        osc.connect(clickGain);
        clickGain.connect(gainNode);

        osc.start(now);
        osc.stop(now + 0.03);

        clockTimer = setTimeout(triggerClock, 1000);
      };

      triggerClock();
      stopFn = () => {
        if (clockTimer) clearTimeout(clockTimer);
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
      binauralNodesRef.current = null;
      setIsPlaying(false);
    }
  };

  // Vinyl Tape Warmth Synthesizer Engine
  useEffect(() => {
    if (!audioCtxRef.current || !masterGainRef.current) return;
    const ctx = audioCtxRef.current;

    if (isVinylWarmth && isPlaying) {
      if (vinylNodeRef.current) return;
      try {
        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          if (Math.random() < 0.0008) {
            data[i] = (Math.random() * 2 - 1) * 0.7;
          } else {
            data[i] = (Math.random() * 2 - 1) * 0.015;
          }
        }
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(2200, ctx.currentTime);
        filter.Q.setValueAtTime(1.4, ctx.currentTime);

        const vGain = ctx.createGain();
        vGain.gain.setValueAtTime(0.1, ctx.currentTime);

        source.connect(filter);
        filter.connect(vGain);
        vGain.connect(masterGainRef.current);
        source.start(0);

        vinylNodeRef.current = { source, vGain };
      } catch {}
    } else {
      if (vinylNodeRef.current) {
        try {
          vinylNodeRef.current.source.stop();
        } catch {}
        vinylNodeRef.current = null;
      }
    }
  }, [isVinylWarmth, isPlaying]);

  // Mindfulness Box Breathing Tick Engine (4s Inhale -> 4s Hold -> 4s Exhale -> 4s Hold)
  useEffect(() => {
    if (!isBreathingMode) return;

    const timer = setInterval(() => {
      setBreathingSeconds((prev) => {
        if (prev <= 1) {
          setBreathingPhase((curPhase) => {
            let nextPhase = 'inhale';
            if (curPhase === 'inhale') nextPhase = 'hold-in';
            else if (curPhase === 'hold-in') nextPhase = 'exhale';
            else if (curPhase === 'exhale') nextPhase = 'hold-out';
            else if (curPhase === 'hold-out') nextPhase = 'inhale';
            playChime();
            return nextPhase;
          });
          return 4;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isBreathingMode, playChime]);

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
              const mins = TIMER_MODES[timerMode]?.focusMinutes || 25;
              logCompletedSession(currentTaskRef.current, mins, TIMER_MODES[timerMode]?.label || 'Focus');
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
  }, [timerStatus, timerMode, timerPhase, playChime, logCompletedSession]);

  // Synchronize browser tab title with active Pomodoro countdown
  useEffect(() => {
    if (typeof document === 'undefined') return;

    if (timerStatus === 'running' || timerStatus === 'paused') {
      const secs = timerMode === 'stopwatch' ? stopwatchSeconds : timeRemaining;
      const h = Math.floor(secs / 3600);
      const m = Math.floor((secs % 3600) / 60);
      const s = secs % 60;
      const timeStr = h > 0
        ? `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
        : `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;

      const prefix = timerStatus === 'paused' ? '⏸️ ' : timerPhase === 'break' ? '☕ ' : '⏳ ';
      document.title = `(${prefix}${timeStr}) Focus Station · Mahmud al Hasan`;
    } else if (timerStatus === 'idle') {
      if (document.title.startsWith('(')) {
        document.title = 'Mahmud al Hasan | Backend Software Engineer (Laravel, Node.js & .NET)';
      }
    }
  }, [timerStatus, timeRemaining, stopwatchSeconds, timerMode, timerPhase]);

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
        sessionHistory,
        clearSessionHistory,

        // YouTube
        activeYouTube,
        setActiveYouTube,
        isYtPlaying,
        setIsYtPlaying,
        isYtFolded,
        setIsYtFolded,

        // Brainwave Tuner
        brainwaveMode,
        changeBrainwaveMode,

        // Vinyl Tape Warmth
        isVinylWarmth,
        setIsVinylWarmth,

        // User Presets
        userPresets,
        saveUserPreset,
        deleteUserPreset,

        // Mindfulness Box Breathing
        isBreathingMode,
        setIsBreathingMode,
        breathingPhase,
        breathingSeconds,

        // Ambient Backdrop Theme
        ambientTheme,
        changeAmbientTheme,

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
