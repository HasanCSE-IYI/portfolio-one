import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faCircleDot, faEnvelope, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { useUi } from '../../context/UiContext';
import './index.scss';

const AvailabilityBadge = ({ compact = false, showTooltip = true }) => {
  const { playSound } = useUi();
  const [bstTime, setBstTime] = useState('');
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date();
        const formatter = new Intl.DateTimeFormat('en-US', {
          timeZone: 'Asia/Dhaka',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        });
        setBstTime(formatter.format(now));
      } catch {
        // Fallback for older engines
        const now = new Date();
        setBstTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 30000); // Update every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`availability-badge-wrapper ${compact ? 'compact' : ''}`}
      onMouseEnter={() => showTooltip && setIsTooltipVisible(true)}
      onMouseLeave={() => showTooltip && setIsTooltipVisible(false)}
      onFocus={() => showTooltip && setIsTooltipVisible(true)}
      onBlur={() => showTooltip && setIsTooltipVisible(false)}
    >
      <Link
        to="/contact"
        className="availability-pill"
        aria-label="Available for hire · Bangladesh Standard Time · Click to contact"
        onClick={() => playSound('click')}
      >
        <span className="beacon-indicator" aria-hidden="true">
          <span className="beacon-ping"></span>
          <span className="beacon-dot"></span>
        </span>
        <span className="badge-status-text">Available</span>
        {bstTime && (
          <>
            <span className="badge-divider">·</span>
            <span className="badge-time-text">
              <FontAwesomeIcon icon={faClock} className="badge-clock-icon" aria-hidden="true" />
              <span>{bstTime} BST</span>
            </span>
          </>
        )}
      </Link>

      {/* Floating Detailed Availability Popover */}
      {showTooltip && (
        <div
          className={`availability-popover ${isTooltipVisible ? 'visible' : ''}`}
          role="tooltip"
          aria-hidden={!isTooltipVisible}
        >
          <div className="popover-header">
            <span className="live-dot-wrap">
              <FontAwesomeIcon icon={faCircleDot} className="live-dot" />
              <span className="popover-title">Live Availability Status</span>
            </span>
            <span className="popover-role">Senior Backend Engineer</span>
          </div>

          <div className="popover-body">
            <div className="popover-row">
              <FontAwesomeIcon icon={faMapMarkerAlt} className="row-icon" />
              <span>Chattogram, Bangladesh · UTC+6 (BST)</span>
            </div>
            <div className="popover-row">
              <FontAwesomeIcon icon={faClock} className="row-icon" />
              <span>
                Local Time: <strong>{bstTime ? `${bstTime} BST` : 'BST'}</strong> (Active &amp; Overlapping US/EU)
              </span>
            </div>
            <p className="popover-desc">
              Currently accepting high-impact contracts, full-time senior backend roles, and distributed systems consulting.
            </p>
          </div>

          <div className="popover-footer">
            <span className="response-time">⚡ Response guaranteed &lt; 12h</span>
            <Link
              to="/contact"
              className="popover-action-btn"
              onClick={() => {
                setIsTooltipVisible(false);
                playSound('click');
              }}
            >
              <FontAwesomeIcon icon={faEnvelope} />
              <span>Get in Touch</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvailabilityBadge;
