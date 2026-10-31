import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments, faTimes, faPaperPlane, faHeart, faCheck } from '@fortawesome/free-solid-svg-icons';
import { useUi } from '../../context/UiContext';
import './index.scss';

const DEFAULT_AVATARS = ['💻', '🚀', '⚡', '☕', '🎯', '🧠', '🛠️', '🌟'];

const INITIAL_ENTRIES = [
  {
    id: 'entry-1',
    name: 'Samiul Karim',
    role: 'Principal Software Architect',
    company: 'Fintech Solutions UK',
    avatar: '🚀',
    message:
      'Mahmud is one of the most reliable backend engineers I have collaborated with. His ASP.NET Core clean architecture models and query optimizations scaled our transactions seamlessly.',
    date: 'Oct 24, 2026',
  },
  {
    id: 'entry-2',
    name: 'Elena Rostova',
    role: 'Engineering Manager',
    company: 'Distributed Cloud Labs',
    avatar: '⚡',
    message:
      'Incredible attention to detail in database indexing and asynchronous event queues with RabbitMQ. A true 10x backend problem solver.',
    date: 'Oct 19, 2026',
  },
  {
    id: 'entry-3',
    name: 'Tanvir Hossain',
    role: 'Senior Fullstack Engineer',
    company: 'SourcingPi',
    avatar: '💻',
    message:
      'Great teamwork and mentorship! The Focus Station and Store API simulator in this portfolio reflect the exact high standard he brings to production code.',
    date: 'Oct 12, 2026',
  },
];

const Guestbook = ({ isOpen, onClose }) => {
  const { playSound } = useUi();
  const [entries, setEntries] = useState(() => {
    try {
      const saved = localStorage.getItem('portfolio_guestbook_entries');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Fallback
    }
    return INITIAL_ENTRIES;
  });

  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [avatar, setAvatar] = useState('💻');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Persist entries to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('portfolio_guestbook_entries', JSON.stringify(entries));
    } catch {
      // Storage error
    }
  }, [entries]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Please enter your name.');
      return;
    }
    if (!message.trim()) {
      setErrorMsg('Please write a short note or message.');
      return;
    }

    const newEntry = {
      id: `entry-${Date.now()}`,
      name: name.trim(),
      role: role.trim() || 'Software Engineer',
      avatar,
      message: message.trim(),
      date: 'Just now',
    };

    setEntries((prev) => [newEntry, ...prev]);
    setName('');
    setRole('');
    setMessage('');
    setErrorMsg('');
    setIsSuccess(true);
    playSound('chime');

    setTimeout(() => {
      setIsSuccess(false);
    }, 3500);
  };

  return (
    <div
      className="guestbook-overlay-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Public Guestbook & Social Wall"
    >
      <div className="guestbook-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="guestbook-header">
          <div className="header-title-wrap">
            <FontAwesomeIcon icon={faComments} className="guestbook-icon" />
            <div>
              <h3>Public Guestbook &amp; Social Wall</h3>
              <p className="guestbook-subtitle">Leave a signature, note, or peer recommendation for Mahmud.</p>
            </div>
          </div>
          <button
            type="button"
            className="close-guestbook-btn"
            onClick={onClose}
            aria-label="Close guestbook"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {/* Content Body: Split View (Sign Form + Feed) */}
        <div className="guestbook-body">
          {/* Sign Form */}
          <div className="guestbook-form-pane">
            <h4>
              <span>Sign the Wall</span>
              <FontAwesomeIcon icon={faHeart} className="heart-icon" />
            </h4>

            {isSuccess && (
              <div className="success-banner">
                <FontAwesomeIcon icon={faCheck} />
                <span>Thank you! Your note has been pinned to the guestbook wall.</span>
              </div>
            )}

            {errorMsg && <div className="error-banner">{errorMsg}</div>}

            <form onSubmit={handleSubmit} className="guestbook-form">
              <div className="avatar-picker-row">
                <span className="picker-label">Choose Avatar:</span>
                <div className="avatar-options">
                  {DEFAULT_AVATARS.map((av) => (
                    <button
                      key={av}
                      type="button"
                      className={`avatar-option-btn ${avatar === av ? 'active' : ''}`}
                      onClick={() => {
                        setAvatar(av);
                        playSound('click');
                      }}
                      aria-label={`Select avatar ${av}`}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="gb-name">Your Name *</label>
                <input
                  id="gb-name"
                  type="text"
                  placeholder="e.g. Alex Johnson"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={50}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="gb-role">Role / Company (Optional)</label>
                <input
                  id="gb-role"
                  type="text"
                  placeholder="e.g. Senior Tech Lead @ Acme Corp"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  maxLength={60}
                />
              </div>

              <div className="form-group">
                <label htmlFor="gb-message">Message *</label>
                <textarea
                  id="gb-message"
                  placeholder="Write a greeting, recommendation, or thought..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  maxLength={280}
                  rows={3}
                  required
                />
                <span className="char-count">{message.length}/280</span>
              </div>

              <button
                type="submit"
                className="submit-guestbook-btn"
                onClick={() => playSound('click')}
              >
                <FontAwesomeIcon icon={faPaperPlane} />
                <span>Pin Message</span>
              </button>
            </form>
          </div>

          {/* Entries Feed */}
          <div className="guestbook-feed-pane">
            <h4>
              <span>Recent Signatures</span>
              <span className="entry-counter">({entries.length})</span>
            </h4>

            <div className="feed-list">
              {entries.map((item) => (
                <div key={item.id} className="feed-card">
                  <div className="feed-card-header">
                    <span className="user-avatar">{item.avatar}</span>
                    <div className="user-meta">
                      <span className="user-name">{item.name}</span>
                      <span className="user-role">{item.role}</span>
                    </div>
                    <span className="user-date">{item.date}</span>
                  </div>
                  <p className="user-message">&ldquo;{item.message}&rdquo;</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Guestbook;
