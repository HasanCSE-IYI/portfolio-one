import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  playClickSound,
  playPopSound,
  playTickSound,
  playChimeSound,
  playCloseSound,
} from '../utils/soundEffects';

export const ACCENT_THEMES = {
  gold: {
    id: 'gold',
    name: 'Amber Gold',
    hex: '#f59e0b',
    hoverHex: '#fbbf24',
    rgb: '245, 158, 11',
    glow: 'rgba(245, 158, 11, 0.28)',
    desc: 'Signature Gold',
  },
  cyan: {
    id: 'cyan',
    name: 'Cyber Cyan',
    hex: '#06b6d4',
    hoverHex: '#22d3ee',
    rgb: '6, 182, 212',
    glow: 'rgba(6, 182, 212, 0.28)',
    desc: 'High-Tech Futurism',
  },
  emerald: {
    id: 'emerald',
    name: 'Emerald Mint',
    hex: '#10b981',
    hoverHex: '#34d399',
    rgb: '16, 185, 129',
    glow: 'rgba(16, 185, 129, 0.28)',
    desc: 'Calm Engineering',
  },
  violet: {
    id: 'violet',
    name: 'Electric Violet',
    hex: '#8b5cf6',
    hoverHex: '#a78bfa',
    rgb: '139, 92, 246',
    glow: 'rgba(139, 92, 246, 0.28)',
    desc: 'Deep Space Luminous',
  },
  rose: {
    id: 'rose',
    name: 'Neon Rose',
    hex: '#f43f5e',
    hoverHex: '#fb7185',
    rgb: '244, 63, 94',
    glow: 'rgba(244, 63, 94, 0.28)',
    desc: 'Vibrant Dynamic',
  },
};

const UiContext = createContext(null);

export const UiProvider = ({ children }) => {
  const navigate = useNavigate();

  // Accent Theme State (persisted in localStorage)
  const [accentTheme, setAccentThemeState] = useState(() => {
    try {
      const saved = localStorage.getItem('portfolio_accent_theme');
      return saved && ACCENT_THEMES[saved] ? saved : 'gold';
    } catch {
      return 'gold';
    }
  });

  // Sound Effects State (persisted in localStorage)
  const [soundEnabled, setSoundEnabledState] = useState(() => {
    try {
      const saved = localStorage.getItem('portfolio_sfx_enabled');
      return saved !== null ? saved === 'true' : true;
    } catch {
      return true;
    }
  });

  // Modal / Window States
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isCheatsheetOpen, setIsCheatsheetOpen] = useState(false);
  const [isGuestbookOpen, setIsGuestbookOpen] = useState(false);
  const [isThemePickerOpen, setIsThemePickerOpen] = useState(false);

  // Buffer for multi-key sequences (e.g., G then H)
  const keySequenceRef = useRef('');
  const keyTimerRef = useRef(null);

  // Apply CSS Variables to Document Root
  useEffect(() => {
    const themeObj = ACCENT_THEMES[accentTheme] || ACCENT_THEMES.gold;
    const root = document.documentElement;

    root.style.setProperty('--primary-accent', themeObj.hex);
    root.style.setProperty('--primary-accent-hover', themeObj.hoverHex);
    root.style.setProperty('--primary-accent-rgb', themeObj.rgb);
    root.style.setProperty('--primary-accent-glow', themeObj.glow);
    root.style.setProperty('--border-hover', `rgba(${themeObj.rgb}, 0.45)`);
    root.setAttribute('data-accent-theme', themeObj.id);

    try {
      localStorage.setItem('portfolio_accent_theme', themeObj.id);
    } catch {
      // Ignore storage errors
    }
  }, [accentTheme]);

  // Set accent theme with optional sound
  const setAccentTheme = useCallback(
    (themeId) => {
      if (ACCENT_THEMES[themeId]) {
        setAccentThemeState(themeId);
        playPopSound(soundEnabled);
      }
    },
    [soundEnabled]
  );

  // Toggle sound effects
  const toggleSound = useCallback(() => {
    setSoundEnabledState((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('portfolio_sfx_enabled', String(next));
      } catch {
        // Ignore storage errors
      }
      if (next) playChimeSound(true);
      return next;
    });
  }, []);

  // Play synthesized audio
  const playSound = useCallback(
    (type) => {
      if (!soundEnabled) return;
      switch (type) {
        case 'click':
          playClickSound(true);
          break;
        case 'pop':
          playPopSound(true);
          break;
        case 'tick':
          playTickSound(true);
          break;
        case 'chime':
          playChimeSound(true);
          break;
        case 'close':
          playCloseSound(true);
          break;
        default:
          playClickSound(true);
      }
    },
    [soundEnabled]
  );

  // Modal open/close actions with audio feedback
  const openTerminal = useCallback(() => {
    setIsTerminalOpen(true);
    playSound('pop');
  }, [playSound]);

  const closeTerminal = useCallback(() => {
    setIsTerminalOpen(false);
    playSound('close');
  }, [playSound]);

  const toggleTerminal = useCallback(() => {
    setIsTerminalOpen((prev) => {
      playSound(prev ? 'close' : 'pop');
      return !prev;
    });
  }, [playSound]);

  const openCheatsheet = useCallback(() => {
    setIsCheatsheetOpen(true);
    playSound('pop');
  }, [playSound]);

  const closeCheatsheet = useCallback(() => {
    setIsCheatsheetOpen(false);
    playSound('close');
  }, [playSound]);

  const toggleCheatsheet = useCallback(() => {
    setIsCheatsheetOpen((prev) => {
      playSound(prev ? 'close' : 'pop');
      return !prev;
    });
  }, [playSound]);

  const openGuestbook = useCallback(() => {
    setIsGuestbookOpen(true);
    playSound('pop');
  }, [playSound]);

  const closeGuestbook = useCallback(() => {
    setIsGuestbookOpen(false);
    playSound('close');
  }, [playSound]);

  const toggleGuestbook = useCallback(() => {
    setIsGuestbookOpen((prev) => {
      playSound(prev ? 'close' : 'pop');
      return !prev;
    });
  }, [playSound]);

  const openThemePicker = useCallback(() => {
    setIsThemePickerOpen(true);
    playSound('pop');
  }, [playSound]);

  const closeThemePicker = useCallback(() => {
    setIsThemePickerOpen(false);
    playSound('close');
  }, [playSound]);

  const toggleThemePicker = useCallback(() => {
    setIsThemePickerOpen((prev) => {
      playSound(prev ? 'close' : 'pop');
      return !prev;
    });
  }, [playSound]);

  // Global Keyboard Navigation & Hotkeys
  useEffect(() => {
    const handleKeyDown = (e) => {
      const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
      const isInput =
        activeTag === 'input' ||
        activeTag === 'textarea' ||
        (document.activeElement && document.activeElement.isContentEditable);

      // 1. Toggle Terminal via Ctrl+~ or Cmd+~ or Ctrl+` or Cmd+`
      if ((e.metaKey || e.ctrlKey) && (e.key === '`' || e.key === '~')) {
        e.preventDefault();
        toggleTerminal();
        return;
      }

      // If user is actively typing in an input or textarea, don't hijack alphanumeric single keys
      if (isInput) return;

      // 2. Open Cheatsheet via '?'
      if (e.key === '?' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        toggleCheatsheet();
        return;
      }

      // 3. Toggle Sound Effects via 'M' or 'm'
      if ((e.key === 'm' || e.key === 'M') && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        toggleSound();
        return;
      }

      // 4. Close open modals via Escape
      if (e.key === 'Escape') {
        if (isTerminalOpen) closeTerminal();
        if (isCheatsheetOpen) closeCheatsheet();
        if (isGuestbookOpen) closeGuestbook();
        if (isThemePickerOpen) closeThemePicker();
        return;
      }

      // 5. Sequence Hotkeys (e.g. 'G' then 'H' for Home, 'G' then 'P' for Portfolio)
      const key = e.key.toLowerCase();
      if (key === 'g') {
        keySequenceRef.current = 'g';
        clearTimeout(keyTimerRef.current);
        keyTimerRef.current = setTimeout(() => {
          keySequenceRef.current = '';
        }, 1200);
        return;
      }

      if (keySequenceRef.current === 'g') {
        keySequenceRef.current = '';
        clearTimeout(keyTimerRef.current);

        const routeMap = {
          h: '/',
          a: '/about',
          r: '/resume',
          p: '/portfolio',
          f: '/focus',
          b: '/blog',
          c: '/contact',
        };

        if (routeMap[key]) {
          e.preventDefault();
          playSound('pop');
          navigate(routeMap[key]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(keyTimerRef.current);
    };
  }, [
    navigate,
    toggleTerminal,
    toggleCheatsheet,
    toggleSound,
    isTerminalOpen,
    isCheatsheetOpen,
    isGuestbookOpen,
    isThemePickerOpen,
    closeTerminal,
    closeCheatsheet,
    closeGuestbook,
    closeThemePicker,
    playSound,
  ]);

  const value = {
    accentTheme,
    setAccentTheme,
    themes: ACCENT_THEMES,
    currentTheme: ACCENT_THEMES[accentTheme] || ACCENT_THEMES.gold,
    soundEnabled,
    toggleSound,
    playSound,
    // Modals
    isTerminalOpen,
    openTerminal,
    closeTerminal,
    toggleTerminal,
    isCheatsheetOpen,
    openCheatsheet,
    closeCheatsheet,
    toggleCheatsheet,
    isGuestbookOpen,
    openGuestbook,
    closeGuestbook,
    toggleGuestbook,
    isThemePickerOpen,
    openThemePicker,
    closeThemePicker,
    toggleThemePicker,
  };

  return <UiContext.Provider value={value}>{children}</UiContext.Provider>;
};

export const useUi = () => {
  const context = useContext(UiContext);
  if (!context) {
    // Return graceful fallback if rendered outside provider (e.g. in standalone tests)
    return {
      accentTheme: 'gold',
      setAccentTheme: () => {},
      themes: ACCENT_THEMES,
      currentTheme: ACCENT_THEMES.gold,
      soundEnabled: true,
      toggleSound: () => {},
      playSound: () => {},
      isTerminalOpen: false,
      openTerminal: () => {},
      closeTerminal: () => {},
      toggleTerminal: () => {},
      isCheatsheetOpen: false,
      openCheatsheet: () => {},
      closeCheatsheet: () => {},
      toggleCheatsheet: () => {},
      isGuestbookOpen: false,
      openGuestbook: () => {},
      closeGuestbook: () => {},
      toggleGuestbook: () => {},
      isThemePickerOpen: false,
      openThemePicker: () => {},
      closeThemePicker: () => {},
      toggleThemePicker: () => {},
    };
  }
  return context;
};
