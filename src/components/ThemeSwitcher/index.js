import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPalette, faTimes, faCheck } from '@fortawesome/free-solid-svg-icons';
import { useUi, ACCENT_THEMES } from '../../context/UiContext';
import './index.scss';

const ThemeSwitcher = ({ isOpen, onClose }) => {
  const { accentTheme, setAccentTheme } = useUi();

  if (!isOpen) return null;

  return (
    <div
      className="theme-switcher-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Theme Accent Color Switcher"
    >
      <div className="theme-switcher-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="theme-header">
          <div className="theme-title-wrap">
            <FontAwesomeIcon icon={faPalette} className="palette-icon" />
            <h3>Global Accent Theme</h3>
          </div>
          <button
            type="button"
            className="close-theme-btn"
            onClick={onClose}
            aria-label="Close theme switcher"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {/* Theme Grid */}
        <div className="theme-grid">
          {Object.values(ACCENT_THEMES).map((th) => {
            const isSelected = accentTheme === th.id;
            return (
              <button
                key={th.id}
                type="button"
                className={`theme-card-btn ${isSelected ? 'selected' : ''}`}
                onClick={() => setAccentTheme(th.id)}
                aria-pressed={isSelected}
              >
                <div className="color-swatch-wrap">
                  <span
                    className="color-circle"
                    style={{
                      background: th.hex,
                      boxShadow: `0 0 14px ${th.glow}`,
                    }}
                  >
                    {isSelected && <FontAwesomeIcon icon={faCheck} className="check-icon" />}
                  </span>
                </div>
                <div className="theme-text-info">
                  <span className="theme-name">{th.name}</span>
                  <span className="theme-desc">{th.desc}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="theme-footer">
          <span>Theme persists automatically in your browser across sessions.</span>
        </div>
      </div>
    </div>
  );
};

export default ThemeSwitcher;
