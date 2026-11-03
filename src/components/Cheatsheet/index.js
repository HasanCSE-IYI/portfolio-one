import React, { useState, useEffect, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKeyboard, faTimes, faSearch } from '@fortawesome/free-solid-svg-icons';
import { useUi } from '../../context/UiContext';
import './index.scss';

const SHORTCUT_GROUPS = [
  {
    title: 'Global Navigation (Press G then...)',
    shortcuts: [
      { keys: ['G', 'H'], label: 'Navigate to Home' },
      { keys: ['G', 'A'], label: 'Navigate to About' },
      { keys: ['G', 'R'], label: 'Navigate to Resume' },
      { keys: ['G', 'P'], label: 'Navigate to Portfolio & Works' },
      { keys: ['G', 'B'], label: 'Navigate to Engineering Blog' },
      { keys: ['G', 'F'], label: 'Navigate to Focus Station' },
      { keys: ['G', 'C'], label: 'Navigate to Contact & Maps' },
    ],
  },
  {
    title: 'Developer Tools & Search',
    shortcuts: [
      { keys: ['⌘ / Ctrl', 'K'], label: 'Open Command Palette Spotlight' },
      { keys: ['⌘ / Ctrl', '~'], label: 'Toggle Interactive Terminal CLI' },
      { keys: ['?'], label: 'Open this Keyboard Cheatsheet' },
      { keys: ['Esc'], label: 'Close any active modal or overlay' },
    ],
  },
  {
    title: 'Audio & Accessibility',
    shortcuts: [
      { keys: ['M'], label: 'Toggle UI Sound Effects (Mute / Unmute)' },
      { keys: ['Space'], label: 'Play / Pause Timer (on Focus Station)' },
    ],
  },
];

const Cheatsheet = ({ isOpen, onClose }) => {
  const { playSound } = useUi();
  const [filterQuery, setFilterQuery] = useState('');

  // Handle Escape key & body scroll lock for accessible modal behavior
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        playSound('close');
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, playSound]);

  const filteredGroups = useMemo(() => {
    if (!filterQuery.trim()) return SHORTCUT_GROUPS;
    const q = filterQuery.toLowerCase().trim();
    return SHORTCUT_GROUPS.map((g) => ({
      ...g,
      shortcuts: g.shortcuts.filter(
        (sc) =>
          sc.label.toLowerCase().includes(q) ||
          sc.keys.some((k) => k.toLowerCase().includes(q))
      ),
    })).filter((g) => g.shortcuts.length > 0);
  }, [filterQuery]);

  if (!isOpen) return null;

  return (
    <div
      className="cheatsheet-overlay-backdrop"
      onClick={() => {
        playSound('close');
        onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cheatsheet-modal-title"
    >
      <div className="cheatsheet-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="cheatsheet-header">
          <div className="header-title-wrap">
            <FontAwesomeIcon icon={faKeyboard} className="cheatsheet-icon" />
            <h3 id="cheatsheet-modal-title">Keyboard Shortcuts</h3>
            <span className="cheatsheet-tag">Pro Tips</span>
          </div>
          <button
            type="button"
            className="close-cheatsheet-btn"
            onClick={() => {
              playSound('close');
              onClose();
            }}
            aria-label="Close cheatsheet"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {/* Filter Bar */}
        <div className="cheatsheet-filter-bar">
          <div className="cs-filter-wrap">
            <FontAwesomeIcon icon={faSearch} className="cs-search-icon" />
            <input
              type="text"
              placeholder="Search shortcuts (e.g. blog, terminal, sound)..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="cs-filter-input"
              aria-label="Filter keyboard shortcuts"
            />
            {filterQuery && (
              <button
                type="button"
                className="cs-clear-btn"
                onClick={() => {
                  playSound('close');
                  setFilterQuery('');
                }}
                aria-label="Clear shortcut search"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Shortcuts Content */}
        <div className="cheatsheet-body">
          {filteredGroups.length > 0 ? (
            filteredGroups.map((group, gIdx) => (
              <div key={gIdx} className="shortcut-group">
                <h4 className="group-title">{group.title}</h4>
                <div className="shortcut-list">
                  {group.shortcuts.map((sc, sIdx) => (
                    <div
                      key={sIdx}
                      className="shortcut-row"
                      aria-keyshortcuts={sc.keys.join('+')}
                    >
                      <span className="shortcut-label">{sc.label}</span>
                      <div className="keys-wrap">
                        {sc.keys.map((k, kIdx) => (
                          <React.Fragment key={kIdx}>
                            <kbd className="key-cap">{k}</kbd>
                            {kIdx < sc.keys.length - 1 && <span className="key-then">+</span>}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="cs-empty-state">
              <p>No keyboard shortcuts matching &ldquo;{filterQuery}&rdquo;</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="cheatsheet-footer">
          <span>Tip: Shortcuts are active site-wide when not typing in text inputs.</span>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Cheatsheet);
