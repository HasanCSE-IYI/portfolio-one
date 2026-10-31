import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKeyboard, faTimes } from '@fortawesome/free-solid-svg-icons';
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
  if (!isOpen) return null;

  return (
    <div
      className="cheatsheet-overlay-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Keyboard Shortcuts Cheatsheet"
    >
      <div className="cheatsheet-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="cheatsheet-header">
          <div className="header-title-wrap">
            <FontAwesomeIcon icon={faKeyboard} className="cheatsheet-icon" />
            <h3>Keyboard Shortcuts</h3>
            <span className="cheatsheet-tag">Pro Tips</span>
          </div>
          <button
            type="button"
            className="close-cheatsheet-btn"
            onClick={onClose}
            aria-label="Close cheatsheet"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {/* Shortcuts Content */}
        <div className="cheatsheet-body">
          {SHORTCUT_GROUPS.map((group, gIdx) => (
            <div key={gIdx} className="shortcut-group">
              <h4 className="group-title">{group.title}</h4>
              <div className="shortcut-list">
                {group.shortcuts.map((sc, sIdx) => (
                  <div key={sIdx} className="shortcut-row">
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
          ))}
        </div>

        {/* Footer */}
        <div className="cheatsheet-footer">
          <span>Tip: Shortcuts are active site-wide when not typing in text inputs.</span>
        </div>
      </div>
    </div>
  );
};

export default Cheatsheet;
