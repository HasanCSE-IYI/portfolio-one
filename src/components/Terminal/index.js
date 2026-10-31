import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTerminal, faTimes, faWindowMaximize, faWindowMinimize } from '@fortawesome/free-solid-svg-icons';
import { useUi } from '../../context/UiContext';
import { getAllArticles } from '../../data/blogData';
import './index.scss';

const COMMANDS_LIST = [
  { cmd: 'help', desc: 'Display all available shell commands' },
  { cmd: 'about', desc: 'Read executive engineer bio & summary' },
  { cmd: 'skills', desc: 'List core backend & fullstack technical stack' },
  { cmd: 'projects', desc: 'Display featured production architecture repositories' },
  { cmd: 'contact', desc: 'Get direct communication channels & coordinates' },
  { cmd: 'resume', desc: 'Open the printable executive resume modal' },
  { cmd: 'blog', desc: 'Browse latest engineering articles & deep-dives' },
  { cmd: 'theme', desc: 'Switch accent theme: theme [gold|cyan|emerald|violet|rose]' },
  { cmd: 'sound', desc: 'Toggle sound effects: sound [on|off]' },
  { cmd: 'time', desc: 'Print current Bangladesh Standard Time (BST / UTC+6)' },
  { cmd: 'guestbook', desc: 'Open public guestbook and social wall' },
  { cmd: 'clear', desc: 'Clear the terminal console output' },
  { cmd: 'whoami', desc: 'Display current visitor session details' },
  { cmd: 'sudo hire', desc: 'Execute fast-track hiring protocol' },
  { cmd: 'exit', desc: 'Close this interactive terminal session' },
];

const INITIAL_GREETING = [
  {
    type: 'banner',
    text: `┌────────────────────────────────────────────────────────────┐
│  MAHMUD AL HASAN — SENIOR BACKEND ENGINEER OS v2.4 (zsh)   │
│  Type 'help' to see commands · Tab to autocomplete         │
└────────────────────────────────────────────────────────────┘`,
  },
  {
    type: 'system',
    text: `Welcome! You are running an interactive terminal emulator connected to Mahmud's portfolio environment. Type 'help' for instructions.`,
  },
];

const Terminal = ({ isOpen, onClose, onOpenResumeModal }) => {
  const navigate = useNavigate();
  const { playSound, setAccentTheme, toggleSound, soundEnabled, openGuestbook } = useUi();

  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState(INITIAL_GREETING);
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isMaximized, setIsMaximized] = useState(false);

  const inputRef = useRef(null);
  const terminalBodyRef = useRef(null);

  // Focus input on terminal open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 100);
    }
  }, [isOpen]);

  // Auto-scroll to bottom on output change
  useEffect(() => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
    }
  }, [history]);

  if (!isOpen) return null;

  const handleCommandExecution = (rawInput) => {
    const trimmed = rawInput.trim();
    if (!trimmed) {
      setHistory((prev) => [...prev, { type: 'input', text: '' }]);
      return;
    }

    // Add to history
    setCommandHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);

    const parts = trimmed.split(' ');
    const command = parts[0].toLowerCase();
    const arg = parts[1] ? parts[1].toLowerCase() : '';

    const newHistory = [...history, { type: 'input', text: trimmed }];

    switch (command) {
      case 'help':
      case 'commands': {
        const helpOutput = COMMANDS_LIST.map(
          (c) => `  ${c.cmd.padEnd(14, ' ')} : ${c.desc}`
        ).join('\n');
        newHistory.push({
          type: 'output',
          text: `Available commands:\n${helpOutput}\n\nTip: Press Up/Down arrows to cycle history, Tab to autocomplete.`,
        });
        playSound('click');
        break;
      }

      case 'about':
      case 'bio': {
        newHistory.push({
          type: 'output',
          text: `Mahmud al Hasan — Senior Backend Software Engineer
Location: Bayazid, Chattogram, Bangladesh
Experience: 8+ Years Enterprise Architecture & Distributed Systems
Core: ASP.NET Core & C#, Laravel & PHP, NestJS & Node.js, AWS Cloud, Docker
Bio: Architecting high-throughput REST APIs, relational databases, clean architecture, and mission-critical enterprise workflows for global clients.`,
        });
        playSound('click');
        break;
      }

      case 'skills': {
        newHistory.push({
          type: 'output',
          text: `Technical Competencies:
  • Backend       : C#, ASP.NET Core Web API, Entity Framework Core, Laravel, PHP, NestJS, Node.js
  • Architecture  : Clean Architecture, CQRS, MediatR, Repository Pattern, Microservices, Domain-Driven Design
  • Databases     : PostgreSQL, MySQL, Redis Caching, Query Profiling & Indexing
  • Cloud & DevOps: AWS (EC2, S3, RDS), Docker, GitHub Actions CI/CD, Nginx, Linux Server Administration
  • Frontend      : React.js, TypeScript, JavaScript (ES6+), Modern Sass/SCSS, Responsive Web Architecture`,
        });
        playSound('click');
        break;
      }

      case 'projects': {
        newHistory.push({
          type: 'output',
          text: `Featured Engineering Systems:
  1. Store API Simulator (.NET 8 Clean Architecture) -> https://github.com/HasanCSE-IYI
  2. Enterprise Multi-Tenant ERP & Billing Engine (Laravel + Redis)
  3. Real-Time Distributed Notification Engine (NestJS + RabbitMQ)
  4. GIS Spatial Mapping & Logistics Tracker (Leaflet + GeoJSON)

Type 'contact' to request private architectural walk-throughs.`,
        });
        playSound('click');
        break;
      }

      case 'contact': {
        newHistory.push({
          type: 'output',
          text: `Direct Communication Coordinates:
  • Email     : mahmud.csem@gmail.com
  • Phone     : +880 1727 328200
  • WhatsApp  : https://wa.me/8801727328200
  • LinkedIn  : https://www.linkedin.com/in/mahmud-al-hasan/
  • GitHub    : https://github.com/HasanCSE-IYI

Navigating to /contact in 2 seconds...`,
        });
        playSound('chime');
        setTimeout(() => {
          onClose();
          navigate('/contact');
        }, 1800);
        break;
      }

      case 'resume':
      case 'cv': {
        newHistory.push({
          type: 'output',
          text: `Opening Executive Resume modal...`,
        });
        playSound('chime');
        onClose();
        if (onOpenResumeModal) onOpenResumeModal();
        break;
      }

      case 'blog': {
        const articles = getAllArticles();
        const articleList = articles
          .map((a, i) => `  ${i + 1}. [${a.category}] ${a.title} (${a.readTime})`)
          .join('\n');
        newHistory.push({
          type: 'output',
          text: `Engineering Notes & Architectural Deep-Dives:\n${articleList}\n\nNavigating to /blog in 2 seconds...`,
        });
        playSound('chime');
        setTimeout(() => {
          onClose();
          navigate('/blog');
        }, 1800);
        break;
      }

      case 'theme': {
        if (!arg) {
          newHistory.push({
            type: 'output',
            text: `Current theme accent options:\n  • theme gold    : Amber Gold (#f59e0b)\n  • theme cyan    : Cyber Cyan (#06b6d4)\n  • theme emerald : Emerald Mint (#10b981)\n  • theme violet  : Electric Violet (#8b5cf6)\n  • theme rose    : Neon Rose (#f43f5e)`,
          });
        } else if (['gold', 'cyan', 'emerald', 'violet', 'rose'].includes(arg)) {
          setAccentTheme(arg);
          newHistory.push({
            type: 'output',
            text: `[OK] Accent theme switched to '${arg.toUpperCase()}'.`,
          });
          playSound('chime');
        } else {
          newHistory.push({
            type: 'error',
            text: `Unknown theme '${arg}'. Valid options: gold, cyan, emerald, violet, rose`,
          });
        }
        break;
      }

      case 'sound': {
        if (arg === 'on') {
          if (!soundEnabled) toggleSound();
          newHistory.push({ type: 'output', text: `[OK] UI Sound Effects enabled.` });
          playSound('chime');
        } else if (arg === 'off') {
          if (soundEnabled) toggleSound();
          newHistory.push({ type: 'output', text: `[OK] UI Sound Effects muted.` });
        } else {
          newHistory.push({
            type: 'output',
            text: `UI Sounds currently: ${soundEnabled ? 'ENABLED' : 'MUTED'}\nUsage: sound on | sound off`,
          });
        }
        break;
      }

      case 'guestbook': {
        newHistory.push({
          type: 'output',
          text: `Opening Public Guestbook & Social Wall...`,
        });
        playSound('chime');
        onClose();
        openGuestbook();
        break;
      }

      case 'time':
      case 'date':
      case 'clock': {
        try {
          const now = new Date();
          const formatter = new Intl.DateTimeFormat('en-US', {
            timeZone: 'Asia/Dhaka',
            dateStyle: 'full',
            timeStyle: 'medium',
          });
          newHistory.push({
            type: 'output',
            text: `Bangladesh Standard Time (BST / UTC+6):\n${formatter.format(now)}`,
          });
        } catch {
          newHistory.push({
            type: 'output',
            text: `Current Time: ${new Date().toLocaleString()}`,
          });
        }
        playSound('click');
        break;
      }

      case 'whoami': {
        newHistory.push({
          type: 'output',
          text: `Visitor Session Details:
  Platform : ${typeof navigator !== 'undefined' ? navigator.platform : 'Unknown'}
  Agent    : ${typeof navigator !== 'undefined' ? navigator.userAgent.slice(0, 60) : 'Browser'}...
  Status   : Authorized Guest (Read & Execute permissions granted)`,
        });
        playSound('click');
        break;
      }

      case 'sudo': {
        if (arg === 'hire') {
          newHistory.push({
            type: 'success',
            text: `🎉 ACCESS GRANTED: Fast-track senior hiring protocol activated!
Redirecting to direct executive contact with prioritized response guarantee...`,
          });
          playSound('chime');
          setTimeout(() => {
            onClose();
            navigate('/contact');
          }, 1800);
        } else {
          newHistory.push({
            type: 'error',
            text: `sudo: ${arg || 'command'}: permission denied. Try 'sudo hire' for fast-track hiring.`,
          });
        }
        break;
      }

      case 'clear':
      case 'cls': {
        setHistory([]);
        playSound('click');
        return;
      }

      case 'exit':
      case 'quit': {
        onClose();
        return;
      }

      default: {
        newHistory.push({
          type: 'error',
          text: `zsh: command not found: ${command}. Type 'help' to inspect supported commands.`,
        });
        playSound('click');
      }
    }

    setHistory(newHistory);
  };

  const handleKeyDown = (e) => {
    // Arrow Up / Down for command history
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      const nextIdx = historyIndex + 1;
      if (nextIdx < commandHistory.length) {
        setHistoryIndex(nextIdx);
        setInputVal(commandHistory[commandHistory.length - 1 - nextIdx]);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIdx = historyIndex - 1;
        setHistoryIndex(nextIdx);
        setInputVal(commandHistory[commandHistory.length - 1 - nextIdx]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInputVal('');
      }
      return;
    }

    // Tab Autocompletion
    if (e.key === 'Tab') {
      e.preventDefault();
      const trimmed = inputVal.trim().toLowerCase();
      if (!trimmed) return;
      const matched = COMMANDS_LIST.find((c) => c.cmd.startsWith(trimmed));
      if (matched) {
        setInputVal(matched.cmd);
        playSound('tick');
      }
      return;
    }

    // Enter: execute command
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCommandExecution(inputVal);
      setInputVal('');
      return;
    }

    // Play subtle mechanical tick on keystroke
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
      playSound('tick');
    }
  };

  return (
    <div className="terminal-overlay-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-label="Interactive Terminal CLI">
      <div
        className={`terminal-window ${isMaximized ? 'maximized' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Terminal Header Chrome */}
        <div className="terminal-titlebar">
          <div className="window-controls">
            <button
              type="button"
              className="ctrl-dot close"
              onClick={onClose}
              aria-label="Close terminal"
              title="Close (Esc)"
            />
            <button
              type="button"
              className="ctrl-dot minimize"
              onClick={onClose}
              aria-label="Minimize terminal"
              title="Minimize"
            />
            <button
              type="button"
              className="ctrl-dot maximize"
              onClick={() => setIsMaximized((prev) => !prev)}
              aria-label="Toggle full terminal size"
              title="Maximize"
            />
          </div>

          <div className="terminal-title">
            <FontAwesomeIcon icon={faTerminal} className="term-icon" />
            <span>hasan@portfolio-os: ~ (zsh)</span>
          </div>

          <div className="titlebar-actions">
            <button
              type="button"
              className="term-action-btn"
              onClick={() => setIsMaximized((prev) => !prev)}
              aria-label="Expand terminal"
            >
              <FontAwesomeIcon icon={isMaximized ? faWindowMinimize : faWindowMaximize} />
            </button>
            <button
              type="button"
              className="term-action-btn close"
              onClick={onClose}
              aria-label="Close terminal"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
        </div>

        {/* Terminal Body Screen */}
        <div
          className="terminal-body"
          ref={terminalBodyRef}
          onClick={() => inputRef.current && inputRef.current.focus()}
        >
          {history.map((entry, idx) => {
            if (entry.type === 'banner') {
              return (
                <pre key={idx} className="term-banner">
                  {entry.text}
                </pre>
              );
            }
            if (entry.type === 'system') {
              return (
                <div key={idx} className="term-system">
                  {entry.text}
                </div>
              );
            }
            if (entry.type === 'input') {
              return (
                <div key={idx} className="term-line-input">
                  <span className="prompt">hasan@dev:~$</span>
                  <span className="cmd-text">{entry.text}</span>
                </div>
              );
            }
            if (entry.type === 'error') {
              return (
                <div key={idx} className="term-error">
                  {entry.text}
                </div>
              );
            }
            if (entry.type === 'success') {
              return (
                <div key={idx} className="term-success">
                  {entry.text}
                </div>
              );
            }
            return (
              <pre key={idx} className="term-output">
                {entry.text}
              </pre>
            );
          })}

          {/* Active Input Line */}
          <div className="term-active-line">
            <span className="prompt">hasan@dev:~$</span>
            <input
              ref={inputRef}
              type="text"
              className="terminal-input-field"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              spellCheck="false"
              autoComplete="off"
              autoCapitalize="off"
              aria-label="Terminal command prompt"
            />
          </div>
        </div>

        {/* Terminal Status Footer */}
        <div className="terminal-footer-bar">
          <span className="footer-status">ONLINE · UTF-8 · zsh 5.9</span>
          <span className="footer-tip">Press Tab to autocomplete · Ctrl+~ to toggle</span>
        </div>
      </div>
    </div>
  );
};

export default Terminal;
