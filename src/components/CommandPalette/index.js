import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faHome,
  faUser,
  faFileAlt,
  faSuitcase,
  faEnvelope,
  faPhone,
  faCopy,
  faCheck,
  faTimes,
  faArrowRight,
  faCode,
  faFolder,
  faHeadphones,
  faBookOpen,
  faTerminal,
  faKeyboard,
  faPalette,
  faVolumeHigh,
  faComments,
  faPrint,
} from '@fortawesome/free-solid-svg-icons';
import {
  faGithub,
  faLinkedin,
  faWhatsapp,
} from '@fortawesome/free-brands-svg-icons';
import './index.scss';
import portfolioData from '../../data/portfolio.json';
import { getAllArticles } from '../../data/blogData';
import { useUi } from '../../context/UiContext';
import { useFocusTrap } from '../../utils/useFocusTrap';
import { copyToClipboard } from '../../utils/clipboard';

const BASE_COMMANDS = [
  // Navigation
  {
    id: 'nav-home',
    category: 'Navigation',
    title: 'Go to Home',
    subtitle: 'System specifications, architectural capabilities & REST pipeline',
    icon: faHome,
    action: (navigate) => {
      navigate('/')
      if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
        try {
          window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
        } catch {
          window.scrollTo(0, 0)
        }
      }
    },
  },
  {
    id: 'nav-about',
    category: 'Navigation',
    title: 'Go to About Me',
    subtitle: 'Background, 8+ years experience, 3D tech cube & engineering books',
    icon: faUser,
    action: (navigate) => navigate('/about'),
  },
  {
    id: 'nav-resume',
    category: 'Navigation',
    title: 'Go to Executive Resume',
    subtitle: 'Full verified CV, work history, mentor reference & print engine',
    icon: faFileAlt,
    action: (navigate) => navigate('/resume'),
  },
  {
    id: 'nav-portfolio',
    category: 'Navigation',
    title: 'Go to Portfolio & Works',
    subtitle: 'Production GitHub repositories, GIS navigation & Store API simulator',
    icon: faSuitcase,
    action: (navigate) => navigate('/portfolio'),
  },
  {
    id: 'nav-focus',
    category: 'Navigation',
    title: 'Go to Focus Station',
    subtitle: 'Deep work ambient soundscapes, Pomodoro interval timer & binaural audio',
    icon: faHeadphones,
    action: (navigate) => navigate('/focus'),
  },
  {
    id: 'nav-blog',
    category: 'Navigation',
    title: 'Go to Engineering Blog',
    subtitle: 'Architectural deep-dives, database indexing, microservices & technical notes',
    icon: faBookOpen,
    action: (navigate) => navigate('/blog'),
  },
  {
    id: 'nav-contact',
    category: 'Navigation',
    title: 'Go to Contact',
    subtitle: 'Direct messaging, engagement tiers, and location map',
    icon: faEnvelope,
    action: (navigate) => navigate('/contact'),
  },

  // Actions & Quick Connect
  {
    id: 'act-terminal',
    category: 'Developer Tools',
    title: 'Open Interactive Terminal CLI',
    subtitle: 'Zsh shell emulator (Ctrl+~) with skills, bio, theme & hiring commands',
    icon: faTerminal,
    action: (navigate, onOpenResumeModal, ui) => ui?.openTerminal?.(),
  },
  {
    id: 'act-theme',
    category: 'Developer Tools',
    title: 'Change Accent Color Theme',
    subtitle: 'Switch between Amber Gold, Cyber Cyan, Emerald, Violet, and Rose',
    icon: faPalette,
    action: (navigate, onOpenResumeModal, ui) => ui?.openThemePicker?.(),
  },
  {
    id: 'act-sound',
    category: 'Developer Tools',
    title: 'Toggle UI Sound Effects',
    subtitle: 'Mute or unmute procedural Web Audio clicks and harmonic chimes (M)',
    icon: faVolumeHigh,
    action: (navigate, onOpenResumeModal, ui) => {
      ui?.toggleSound?.();
      return 'Sound effect preferences updated!';
    },
  },
  {
    id: 'act-guestbook',
    category: 'Developer Tools',
    title: 'Open Public Guestbook & Social Wall',
    subtitle: 'Sign the visitor wall or read peer recommendations and endorsements',
    icon: faComments,
    action: (navigate, onOpenResumeModal, ui) => ui?.openGuestbook?.(),
  },
  {
    id: 'act-cheatsheet',
    category: 'Developer Tools',
    title: 'Open Keyboard Shortcuts Cheatsheet',
    subtitle: 'View full cheat sheet of navigation and developer hotkeys (?)',
    icon: faKeyboard,
    action: (navigate, onOpenResumeModal, ui) => ui?.openCheatsheet?.(),
  },
  {
    id: 'act-cv-modal',
    category: 'Quick Actions',
    title: 'Open Quick CV Preview Modal',
    subtitle: 'Instant popup view of executive resume with A4 print engine',
    icon: faFileAlt,
    action: (navigate, onOpenResumeModal) => onOpenResumeModal && onOpenResumeModal(),
  },
  {
    id: 'act-print-resume',
    category: 'Quick Actions',
    title: 'Print / Save PDF Resume',
    subtitle: 'Navigate to Executive Resume and trigger browser print dialog',
    icon: faPrint,
    action: (navigate) => {
      navigate('/resume');
      setTimeout(() => {
        if (typeof window !== 'undefined' && typeof window.print === 'function') {
          window.print();
        }
      }, 400);
    },
  },
  {
    id: 'act-store-api',
    category: 'Quick Actions',
    title: 'Launch Store API Simulator',
    subtitle: 'Simulate C# controller, EF Core queries & JWT RBAC live',
    icon: faCode,
    action: (navigate) => navigate('/portfolio?cat=dotnet'),
  },
  {
    id: 'act-focus-station',
    category: 'Quick Actions',
    title: 'Launch Focus Station & Flow Timer',
    subtitle: 'Start deep engineering session with Pomodoro timer & ambient synth',
    icon: faHeadphones,
    action: (navigate) => navigate('/focus'),
  },
  {
    id: 'act-copy-email',
    category: 'Contact & Channels',
    title: 'Copy Email Address',
    subtitle: 'mahmud.csem@gmail.com',
    icon: faCopy,
    action: () => {
      copyToClipboard('mahmud.csem@gmail.com');
      return 'Email copied to clipboard!';
    },
  },
  {
    id: 'act-copy-phone',
    category: 'Contact & Channels',
    title: 'Copy Phone Number',
    subtitle: '+880 1727-328200',
    icon: faPhone,
    action: () => {
      copyToClipboard('+8801727328200');
      return 'Phone number copied to clipboard!';
    },
  },
  {
    id: 'act-call-phone',
    category: 'Contact & Channels',
    title: 'Call Directly (+880 1727 328200)',
    subtitle: 'Initiate direct telephone dial for recruitment & technical roles',
    icon: faPhone,
    action: () => {
      if (typeof window !== 'undefined') {
        window.location.href = 'tel:+8801727328200';
      }
    },
  },
  {
    id: 'act-whatsapp',
    category: 'Contact & Channels',
    title: 'Chat on WhatsApp',
    subtitle: '+880 1727 328200 · Direct WhatsApp chat',
    icon: faWhatsapp,
    action: () => window.open('https://wa.me/8801727328200', '_blank', 'noreferrer'),
  },
  {
    id: 'act-github',
    category: 'Contact & Channels',
    title: 'Open GitHub Profile',
    subtitle: 'github.com/HasanCSE-IYI · Open-source repositories',
    icon: faGithub,
    action: () => window.open('https://github.com/HasanCSE-IYI', '_blank', 'noreferrer'),
  },
  {
    id: 'act-linkedin',
    category: 'Contact & Channels',
    title: 'Open LinkedIn Profile',
    subtitle: 'linkedin.com/in/mahmud-al-hasan · Professional network',
    icon: faLinkedin,
    action: () => window.open('https://www.linkedin.com/in/mahmud-al-hasan/', '_blank', 'noreferrer'),
  },
];

const PROJECT_COMMANDS = (portfolioData.portfolio || []).map((port) => ({
  id: `proj-${port.id}`,
  category: 'Projects & Repositories',
  title: port.title,
  subtitle: `${port.language} · ${port.categoryLabel} ${port.metrics ? '• ' + port.metrics : ''}`,
  icon: faFolder,
  action: (navigate) => navigate(`/portfolio?q=${encodeURIComponent(port.title)}`),
}));

const BLOG_COMMANDS = getAllArticles().map((art) => ({
  id: `blog-${art.slug}`,
  category: 'Engineering Articles & Notes',
  title: art.title,
  subtitle: `${art.category} · ${art.readTime} · ${art.subtitle || ''}`,
  icon: faBookOpen,
  action: (navigate) => navigate(`/blog/${art.slug}`),
}));

const ALL_COMMANDS = [...BASE_COMMANDS, ...PROJECT_COMMANDS, ...BLOG_COMMANDS];

const CommandPalette = ({ isOpen, onClose, onOpenResumeModal }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [toastMessage, setToastMessage] = useState(null);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const modalRef = useRef(null);
  const navigate = useNavigate();
  const ui = useUi();

  useFocusTrap(isOpen, modalRef);

  // Filter commands by title, subtitle, or category
  const filteredCommands = ALL_COMMANDS.filter((cmd) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase().trim();
    return (
      cmd.title.toLowerCase().includes(q) ||
      cmd.subtitle.toLowerCase().includes(q) ||
      cmd.category.toLowerCase().includes(q)
    );
  });

  // Auto-focus input and reset query on open
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setToastMessage(null);
      document.body.style.overflow = 'hidden';
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const executeCommand = useCallback(
    (cmd) => {
      const result = cmd.action(navigate, onOpenResumeModal, ui);
      if (typeof result === 'string') {
        ui?.playSound?.('chime');
        setToastMessage(result);
        setTimeout(() => {
          setToastMessage(null);
          onClose();
        }, 1200);
      } else {
        ui?.playSound?.('click');
        onClose();
      }
    },
    [navigate, onOpenResumeModal, onClose, ui]
  );

  const handleClose = useCallback(() => {
    ui?.playSound?.('close');
    onClose();
  }, [ui, onClose]);

  // Handle keyboard navigation inside the palette
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        ui?.playSound?.('tick');
        setSelectedIndex((prev) =>
          filteredCommands.length ? (prev + 1) % filteredCommands.length : 0
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        ui?.playSound?.('tick');
        setSelectedIndex((prev) =>
          filteredCommands.length
            ? (prev - 1 + filteredCommands.length) % filteredCommands.length
            : 0
        );
      } else if (e.key === 'PageDown') {
        e.preventDefault();
        ui?.playSound?.('tick');
        setSelectedIndex((prev) =>
          filteredCommands.length ? Math.min(filteredCommands.length - 1, prev + 5) : 0
        );
      } else if (e.key === 'PageUp') {
        e.preventDefault();
        ui?.playSound?.('tick');
        setSelectedIndex((prev) =>
          filteredCommands.length ? Math.max(0, prev - 5) : 0
        );
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          executeCommand(filteredCommands[selectedIndex]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filteredCommands, handleClose, executeCommand, ui]);

  // Keep selected item scrolled into view
  useEffect(() => {
    if (listRef.current) {
      const activeElement = listRef.current.querySelector('.command-item.selected');
      if (activeElement && typeof activeElement.scrollIntoView === 'function') {
        activeElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  return (
    <div
      className="command-palette-overlay"
      onClick={handleClose}
      aria-modal="true"
      role="dialog"
      aria-label="Command Spotlight Palette"
    >
      <div
        className="command-palette-modal"
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="palette-header">
          <FontAwesomeIcon icon={faSearch} className="palette-search-icon" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            className="palette-input"
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={filteredCommands.length > 0}
            aria-controls="command-palette-list"
            aria-activedescendant={filteredCommands.length > 0 ? `cmd-opt-${selectedIndex}` : undefined}
            placeholder="Type a command or search (e.g. Mappi, Store API, Resume, WhatsApp)..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            aria-label="Command search"
          />
          {query && (
            <button
              type="button"
              className="palette-clear-btn"
              onClick={() => {
                ui?.playSound?.('pop');
                setQuery('');
                inputRef.current?.focus();
              }}
              aria-label="Clear query"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          )}
          <span className="palette-esc-badge" aria-hidden="true">ESC</span>
        </div>

        {toastMessage && (
          <div className="palette-toast" role="status" aria-live="polite">
            <FontAwesomeIcon icon={faCheck} className="toast-icon" />
            <span>{toastMessage}</span>
          </div>
        )}

        <div
          className="palette-list"
          ref={listRef}
          id="command-palette-list"
          role="listbox"
          aria-label="Suggested commands"
        >
          {filteredCommands.length > 0 ? (
            filteredCommands.map((cmd, idx) => (
              <div
                key={cmd.id}
                id={`cmd-opt-${idx}`}
                role="option"
                aria-selected={selectedIndex === idx}
                className={`command-item ${selectedIndex === idx ? 'selected' : ''}`}
                onClick={() => executeCommand(cmd)}
                onMouseEnter={() => setSelectedIndex(idx)}
              >
                <div className="item-icon-wrap">
                  <FontAwesomeIcon icon={cmd.icon} className="item-icon" />
                </div>
                <div className="item-content">
                  <div className="item-title-row">
                    <span className="item-title">{cmd.title}</span>
                    <span className="item-category">{cmd.category}</span>
                  </div>
                  <span className="item-subtitle">{cmd.subtitle}</span>
                </div>
                <div className="item-arrow" aria-hidden="true">
                  <FontAwesomeIcon icon={faArrowRight} />
                </div>
              </div>
            ))
          ) : (
            <div className="palette-empty">
              <p>No matching commands found for &ldquo;<strong>{query}</strong>&rdquo;</p>
              <span>Try searching for &quot;Store API&quot;, &quot;Mappi&quot;, &quot;Resume&quot;, &quot;Contact&quot;, or &quot;GitHub&quot;</span>
            </div>
          )}
        </div>

        <div className="palette-footer">
          <div className="footer-shortcuts">
            <span><kbd>↑</kbd> <kbd>↓</kbd> Navigate</span>
            <span><kbd>PgUp</kbd> <kbd>PgDn</kbd> Jump</span>
            <span><kbd>↵</kbd> Select</span>
            <span><kbd>esc</kbd> Dismiss</span>
          </div>
          <span className="footer-brand">Mahmud al Hasan · Portfolio Spotlight</span>
        </div>
      </div>
    </div>
  );
};

export default React.memo(CommandPalette);
