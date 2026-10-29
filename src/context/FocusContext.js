import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';

const FocusContext = createContext(null);

export const BRAINWAVE_MODES = {
  alpha: { id: 'alpha', label: 'Alpha', hz: 10, icon: '🧠', tag: '10Hz Flow', desc: 'Flow State & Creative Architecture', carrier: 200 },
  beta: { id: 'beta', label: 'Beta', hz: 15, icon: '⚡', tag: '15Hz Focus', desc: 'Active Problem Solving & Debugging', carrier: 220 },
  gamma: { id: 'gamma', label: 'Gamma', hz: 40, icon: '💎', tag: '40Hz Peak', desc: 'Peak Cognitive Synthesis & Logic', carrier: 240 },
  theta: { id: 'theta', label: 'Theta', hz: 6, icon: '🌌', tag: '6Hz Insight', desc: 'Deep Intuition & Algorithmic Design', carrier: 180 },
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
  // Rain Category (9 sounds)
  {
    id: 'tin-roof',
    name: 'Tin Roof Rain',
    category: 'Rain',
    icon: '🏠',
    desc: 'Monsoon rain on tin roof, like home',
    file: '/sounds/tin-roof.mp3',
    fallbackUrl: 'https://nahian.bd/_astro/tin-roof.COAPwzA3.mp3',
  },
  {
    id: 'light-rain',
    name: 'Light Rain',
    category: 'Rain',
    icon: '🌧️',
    desc: 'Calm and steady gentle drizzle',
    file: 'https://cdn.jsdelivr.net/gh/remvze/moodist@main/public/sounds/rain/light-rain.mp3',
  },
  {
    id: 'heavy-rain',
    name: 'Heavy Rain',
    category: 'Rain',
    icon: '⛈️',
    desc: 'Torrents of pelting downpour',
    file: 'https://cdn.jsdelivr.net/gh/remvze/moodist@main/public/sounds/rain/heavy-rain.mp3',
  },
  {
    id: 'thunder',
    name: 'Thunder',
    category: 'Rain',
    icon: '⚡',
    desc: 'Deep rolling atmospheric thunder',
    file: 'https://cdn.jsdelivr.net/gh/remvze/moodist@main/public/sounds/rain/thunder.mp3',
  },
  {
    id: 'rain-on-window',
    name: 'Rain on Window',
    category: 'Rain',
    icon: '🪟',
    desc: 'Soothing rain drumming on glass',
    file: 'https://cdn.jsdelivr.net/gh/remvze/moodist@main/public/sounds/rain/rain-on-window.mp3',
  },
  {
    id: 'rain-on-car-roof',
    name: 'Rain on Car Roof',
    category: 'Rain',
    icon: '🚗',
    desc: 'Cosy pitter-patter inside a parked car',
    file: 'https://cdn.jsdelivr.net/gh/remvze/moodist@main/public/sounds/rain/rain-on-car-roof.mp3',
  },
  {
    id: 'rain-on-umbrella',
    name: 'Rain on Umbrella',
    category: 'Rain',
    icon: '☂️',
    desc: 'Tapping drops on taut nylon umbrella',
    file: 'https://cdn.jsdelivr.net/gh/remvze/moodist@main/public/sounds/rain/rain-on-umbrella.mp3',
  },
  {
    id: 'rain-on-tent',
    name: 'Rain on Tent',
    category: 'Rain',
    icon: '⛺',
    desc: 'Wilderness camping in a rainstorm',
    file: 'https://cdn.jsdelivr.net/gh/remvze/moodist@main/public/sounds/rain/rain-on-tent.mp3',
  },
  {
    id: 'rain-on-leaves',
    name: 'Rain on Leaves',
    category: 'Rain',
    icon: '🍃',
    desc: 'Splashes falling through lush foliage',
    file: 'https://cdn.jsdelivr.net/gh/remvze/moodist@main/public/sounds/rain/rain-on-leaves.mp3',
  },

  // Nature & Water Category (14 sounds)
  {
    id: 'forest',
    name: 'Forest Woods',
    category: 'Nature',
    icon: '🌲',
    desc: 'Woods ambience with breeze & birds',
    file: '/sounds/forest.mp3',
    fallbackUrl: 'https://cdn.jsdelivr.net/gh/remvze/moodist@main/public/sounds/nature/forest.mp3',
  },
  {
    id: 'river',
    name: 'Flowing River',
    category: 'Nature',
    icon: '🏞️',
    desc: 'Crisp mountain river rushing over rocks',
    file: 'https://cdn.jsdelivr.net/gh/remvze/moodist@main/public/sounds/nature/river.mp3',
  },
  {
    id: 'waves',
    name: 'Ocean Waves',
    category: 'Nature',
    icon: '🌊',
    desc: 'Rhythmic ocean swells washing shore',
    file: 'https://cdn.jsdelivr.net/gh/remvze/moodist@main/public/sounds/nature/waves.mp3',
  },
  {
    id: 'waterfall',
    name: 'Waterfall',
    category: 'Nature',
    icon: '💧',
    desc: 'Deep roaring cascade into mountain pool',
    file: 'https://cdn.jsdelivr.net/gh/remvze/moodist@main/public/sounds/nature/waterfall.mp3',
  },
  {
    id: 'droplets',
    name: 'Water Droplets',
    category: 'Nature',
    icon: '🫧',
    desc: 'Serene cave drops in quiet water',
    file: 'https://cdn.jsdelivr.net/gh/remvze/moodist@main/public/sounds/nature/droplets.mp3',
  },
  {
    id: 'campfire',
    name: 'Campfire',
    category: 'Nature',
    icon: '🔥',
    desc: 'Crackling warm wood, gentle sparks',
    file: 'https://cdn.jsdelivr.net/gh/remvze/moodist@main/public/sounds/nature/campfire.mp3',
  },
  {
    id: 'wind',
    name: 'Mountain Wind',
    category: 'Nature',
    icon: '🍃',
    desc: 'Alpine gust sweeping across ridges',
    file: 'https://cdn.jsdelivr.net/gh/remvze/moodist@main/public/sounds/nature/wind.mp3',
  },
  {
    id: 'wind-in-trees',
    name: 'Wind in Trees',
    category: 'Nature',
    icon: '🌳',
    desc: 'Whistling wind in tall tree branches',
    file: 'https://cdn.jsdelivr.net/gh/remvze/moodist@main/public/sounds/nature/wind-in-trees.mp3',
  },
  {
    id: 'jungle',
    name: 'Tropical Jungle',
    category: 'Nature',
    icon: '🌴',
    desc: 'Exotic rainforest canopy soundscape',
    file: 'https://cdn.jsdelivr.net/gh/remvze/moodist@main/public/sounds/nature/jungle.mp3',
  },
  {
    id: 'walk-in-snow',
    name: 'Walk in Snow',
    category: 'Nature',
    icon: '❄️',
    desc: 'Crunching footsteps on fresh powder snow',
    file: 'https://cdn.jsdelivr.net/gh/remvze/moodist@main/public/sounds/nature/walk-in-snow.mp3',
  },
  {
    id: 'walk-on-gravel',
    name: 'Walk on Gravel',
    category: 'Nature',
    icon: '🪨',
    desc: 'Rhythmic footsteps along gravel trail',
    file: 'https://cdn.jsdelivr.net/gh/remvze/moodist@main/public/sounds/nature/walk-on-gravel.mp3',
  },
  {
    id: 'walk-on-leaves',
    name: 'Walk on Leaves',
    category: 'Nature',
    icon: '🍂',
    desc: 'Crisp autumn leaf rustle beneath shoes',
    file: 'https://cdn.jsdelivr.net/gh/remvze/moodist@main/public/sounds/nature/walk-on-leaves.mp3',
  },
  {
    id: 'underwater',
    name: 'Underwater',
    category: 'Nature',
    icon: '🤿',
    desc: 'Deep aquatic ocean calm & sonar bubbles',
    file: 'https://cdn.jsdelivr.net/gh/remvze/moodist@main/public/sounds/places/underwater.mp3',
  },
  {
    id: 'wind-chimes',
    name: 'Wind Chimes',
    category: 'Nature',
    icon: '🎐',
    desc: 'Melodic bamboo & metal breeze chimes',
    file: 'https://cdn.jsdelivr.net/gh/remvze/moodist@main/public/sounds/things/wind-chimes.mp3',
  },

  // Animals & Wildlife Category (8 sounds)
  {
    id: 'birds',
    name: 'Songbirds',
    category: 'Animals',
    icon: '🐦',
    desc: 'Melodious woodland birds in morning light',
    file: 'https://cdn.jsdelivr.net/gh/remvze/moodist@main/public/sounds/animals/birds.mp3',
  },
  {
    id: 'crickets',
    name: 'Summer Crickets',
    category: 'Animals',
    icon: '🦗',
    desc: 'Nocturnal meadow chirps under stars',
    file: 'https://cdn.jsdelivr.net/gh/remvze/moodist@main/public/sounds/animals/crickets.mp3',
  },
  {
    id: 'frog',
    name: 'Pond Frogs',
    category: 'Animals',
    icon: '🐸',
    desc: 'Tranquil wetland frogs croaking peacefully',
    file: 'https://cdn.jsdelivr.net/gh/remvze/moodist@main/public/sounds/animals/frog.mp3',
  },
  {
    id: 'owl',
    name: 'Night Owl',
    category: 'Animals',
    icon: '🦉',
    desc: 'Gentle distant nocturnal forest call',
    file: 'https://cdn.jsdelivr.net/gh/remvze/moodist@main/public/sounds/animals/owl.mp3',
  },
  {
    id: 'seagulls',
    name: 'Coastal Seagulls',
    category: 'Animals',
    icon: '🕊️',
    desc: 'Sea birds calling over ocean breezes',
    file: 'https://cdn.jsdelivr.net/gh/remvze/moodist@main/public/sounds/animals/seagulls.mp3',
  },
  {
    id: 'whale',
    name: 'Whale Songs',
    category: 'Animals',
    icon: '🐋',
    desc: 'Deep marine whale calls and echoes',
    file: 'https://cdn.jsdelivr.net/gh/remvze/moodist@main/public/sounds/animals/whale.mp3',
  },
  {
    id: 'cat-purring',
    name: 'Cat Purring',
    category: 'Animals',
    icon: '🐱',
    desc: 'Cosy, steady rhythmic feline purr',
    file: 'https://cdn.jsdelivr.net/gh/remvze/moodist@main/public/sounds/animals/cat-purring.mp3',
  },
  {
    id: 'beehive',
    name: 'Beehive Meadow',
    category: 'Animals',
    icon: '🐝',
    desc: 'Gentle honeybee garden hum',
    file: 'https://cdn.jsdelivr.net/gh/remvze/moodist@main/public/sounds/animals/beehive.mp3',
  },

  // Noise & Neural Waves Category (8 sounds)
  {
    id: 'brown',
    name: 'Brown Noise',
    category: 'Noise & Waves',
    icon: '🌊',
    desc: 'Deep warm low-frequency acoustic warmth',
    type: 'procedural_noise',
    noiseType: 'brown',
  },
  {
    id: 'pink',
    name: 'Pink Noise',
    category: 'Noise & Waves',
    icon: '💨',
    desc: 'Gentle balanced 1/f rainfall noise',
    type: 'procedural_noise',
    noiseType: 'pink',
  },
  {
    id: 'white',
    name: 'White Noise',
    category: 'Noise & Waves',
    icon: '📻',
    desc: 'Crisp wideband static masking voices',
    type: 'procedural_noise',
    noiseType: 'white',
  },
  {
    id: 'alpha',
    name: 'Binaural Alpha (10Hz)',
    category: 'Noise & Waves',
    icon: '🧠',
    desc: '10 Hz frequency for calm creative flow',
    type: 'binaural',
    hz: 10,
    carrier: 200,
  },
  {
    id: 'beta',
    name: 'Binaural Beta (15Hz)',
    category: 'Noise & Waves',
    icon: '⚡',
    desc: '15 Hz active focus and problem-solving',
    type: 'binaural',
    hz: 15,
    carrier: 220,
  },
  {
    id: 'gamma',
    name: 'Binaural Gamma (40Hz)',
    category: 'Noise & Waves',
    icon: '💎',
    desc: '40 Hz peak cognitive synthesis',
    type: 'binaural',
    hz: 40,
    carrier: 240,
  },
  {
    id: 'theta',
    name: 'Binaural Theta (6Hz)',
    category: 'Noise & Waves',
    icon: '🌌',
    desc: '6 Hz deep intuition & algorithmic vision',
    type: 'binaural',
    hz: 6,
    carrier: 180,
  },
  {
    id: 'delta',
    name: 'Binaural Delta (2Hz)',
    category: 'Noise & Waves',
    icon: '🌙',
    desc: '2 Hz deep recovery and restoration',
    type: 'binaural',
    hz: 2,
    carrier: 150,
  },
];

export const FOCUS_PRESETS = [
  {
    id: 'monsoon-tin-roof',
    name: 'Monsoon Tin Roof',
    icon: '🏠',
    desc: 'Tin roof rain + Thunder + Wind in trees',
    mix: { 'tin-roof': 70, 'thunder': 45, 'wind-in-trees': 35 },
  },
  {
    id: 'nordic-rain',
    name: 'Nordic Pine Rain',
    icon: '🌲',
    desc: 'Rain on leaves + Forest woods + Campfire',
    mix: { 'forest': 60, 'rain-on-leaves': 50, 'campfire': 35 },
  },
  {
    id: 'pacific-surf',
    name: 'Pacific Surf & Birds',
    icon: '🌊',
    desc: 'Ocean waves + Seagulls + Mountain wind',
    mix: { 'waves': 65, 'seagulls': 40, 'wind': 35 },
  },
  {
    id: 'tranquil-brook',
    name: 'Tranquil Mountain River',
    icon: '🏞️',
    desc: 'Flowing river + Water droplets + Songbirds',
    mix: { 'river': 65, 'droplets': 40, 'birds': 45 },
  },
  {
    id: 'cosy-tent-storm',
    name: 'Cosy Wilderness Tent',
    icon: '⛺',
    desc: 'Rain on tent + Distant thunder + Campfire',
    mix: { 'rain-on-tent': 65, 'thunder': 40, 'campfire': 45 },
  },
  {
    id: 'midnight-car-rain',
    name: 'Midnight Drive in Rain',
    icon: '🚗',
    desc: 'Rain on car roof + Rain on window + Crickets',
    mix: { 'rain-on-car-roof': 60, 'rain-on-window': 45, 'crickets': 30 },
  },
  {
    id: 'tropical-jungle',
    name: 'Tropical Rainforest',
    icon: '🌴',
    desc: 'Jungle canopy + Heavy rain + Pond frogs',
    mix: { 'jungle': 60, 'heavy-rain': 50, 'frog': 35 },
  },
  {
    id: 'starlit-meadow',
    name: 'Starlit Night Meadow',
    icon: '🦗',
    desc: 'Summer crickets + Night owl + River',
    mix: { 'crickets': 60, 'owl': 45, 'river': 35 },
  },
  {
    id: 'deep-alpha-waterfall',
    name: 'Deep Alpha Waterfall',
    icon: '💧',
    desc: 'Waterfall + Brown noise + Binaural Alpha (10Hz)',
    mix: { 'waterfall': 60, 'brown': 45, 'alpha': 40 },
  },
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
      return localStorage.getItem('focus_current_task') || 'Architecting Cloud Native Microservices';
    } catch {
      return 'Architecting Cloud Native Microservices';
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

        // Play audio with fallback to fallbackUrl or procedural
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
      // If all volumes are currently 0, default to Monsoon Tin Roof Preset
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
      document.title = `(${prefix}${timeStr}) Nature Focus Station · Mahmud al Hasan`;
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
