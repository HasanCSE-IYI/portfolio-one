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
} from '@fortawesome/free-solid-svg-icons';
import {
  faGithub,
  faLinkedin,
  faWhatsapp,
} from '@fortawesome/free-brands-svg-icons';
import './index.scss';
import portfolioData from '../../data/portfolio.json';

const BASE_COMMANDS = [
  // Navigation
  {
    id: 'nav-home',
    category: 'Navigation',
    title: 'Go to Home',
    subtitle: 'System specifications, architectural capabilities & REST pipeline',
    icon: faHome,
    action: (navigate) => navigate('/'),
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
    subtitle: 'Deep work ambient soundscapes, Pomodoro interval timer & lo-fi beats',
    icon: faHeadphones,
    action: (navigate) => navigate('/focus'),
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
    id: 'act-cv-modal',
    category: 'Quick Actions',
    title: 'Open Quick CV Preview Modal',
    subtitle: 'Instant popup view of executive resume with A4 print engine',
    icon: faFileAlt,
    action: (navigate, onOpenResumeModal) => onOpenResumeModal && onOpenResumeModal(),
  },
  {
    id: 'act-store-api',
    category: 'Quick Actions',
    title: 'Launch Store API Simulator',
    subtitle: 'Simulate C# controller, EF Core queries & JWT RBAC live',
    icon: faCode,
    action: (navigate) => navigate('/portfolio'),
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
      navigator.clipboard?.writeText('mahmud.csem@gmail.com');
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
      navigator.clipboard?.writeText('+8801727328200');
      return 'Phone number copied to clipboard!';
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
  action: (navigate) => navigate('/portfolio'),
}));

const ALL_COMMANDS = [...BASE_COMMANDS, ...PROJECT_COMMANDS];

const CommandPalette = ({ isOpen, onClose, onOpenResumeModal }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [toastMessage, setToastMessage] = useState(null);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const navigate = useNavigate();

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
      const result = cmd.action(navigate, onOpenResumeModal);
      if (typeof result === 'string') {
        setToastMessage(result);
        setTimeout(() => {
          setToastMessage(null);
          onClose();
        }, 1200);
      } else {
        onClose();
      }
    },
    [navigate, onOpenResumeModal, onClose]
  );

  // Handle keyboard navigation inside the palette
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) =>
          filteredCommands.length ? (prev + 1) % filteredCommands.length : 0
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) =>
          filteredCommands.length
            ? (prev - 1 + filteredCommands.length) % filteredCommands.length
            : 0
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
  }, [isOpen, selectedIndex, filteredCommands, onClose, executeCommand]);

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
    <div className="command-palette-overlay" onClick={onClose} aria-modal="true" role="dialog">
      <div
        className="command-palette-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="palette-header">
          <FontAwesomeIcon icon={faSearch} className="palette-search-icon" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            className="palette-input"
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
          <div className="palette-toast">
            <FontAwesomeIcon icon={faCheck} className="toast-icon" />
            <span>{toastMessage}</span>
          </div>
        )}

        <div className="palette-list" ref={listRef}>
          {filteredCommands.length > 0 ? (
            filteredCommands.map((cmd, idx) => (
              <div
                key={cmd.id}
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
            <span><kbd>↵</kbd> Select</span>
            <span><kbd>esc</kbd> Dismiss</span>
          </div>
          <span className="footer-brand">Mahmud al Hasan · Portfolio Spotlight</span>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
