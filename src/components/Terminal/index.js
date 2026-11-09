import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTerminal, faTimes, faWindowMaximize, faWindowMinimize } from '@fortawesome/free-solid-svg-icons';
import { useUi } from '../../context/UiContext';
import { useFocusTrap } from '../../utils/useFocusTrap';
import { getAllArticles } from '../../data/blogData';
import './index.scss';

const COMMANDS_LIST = [
  { cmd: 'help', desc: 'Display all available shell commands' },
  { cmd: 'home', desc: 'Navigate to portfolio home page' },
  { cmd: 'about', desc: 'Read executive engineer bio & summary' },
  { cmd: 'skills', desc: 'List core backend & fullstack technical stack' },
  { cmd: 'projects', desc: 'Display featured production architecture repositories' },
  { cmd: 'portfolio', desc: 'Navigate to interactive portfolio & GitHub repos' },
  { cmd: 'dotnet', desc: 'Inspect .NET 8 SDK and ASP.NET Core runtime details' },
  { cmd: 'docker', desc: 'Inspect running microservice containers' },
  { cmd: 'git', desc: 'Display git working tree status and recent commits' },
  { cmd: 'curl', desc: 'Perform HTTP health probe: curl health' },
  { cmd: 'uptime', desc: 'Display system uptime and server load averages' },
  { cmd: 'uname', desc: 'Print operating system name and kernel version' },
  { cmd: 'cat', desc: 'Display file contents: cat [bio|skills|contact|resume]' },
  { cmd: 'echo', desc: 'Write arguments to the terminal output' },
  { cmd: 'focus', desc: 'Launch ambient Focus Station & Pomodoro workspace' },
  { cmd: 'contact', desc: 'Get direct communication channels & coordinates' },
  { cmd: 'resume', desc: 'Open the printable executive resume modal' },
  { cmd: 'blog', desc: 'Browse latest engineering articles & deep-dives' },
  { cmd: 'cheatsheet', desc: 'Open keyboard shortcuts cheatsheet modal' },
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
  const { playSound, setAccentTheme, toggleSound, soundEnabled, openGuestbook, openCheatsheet } = useUi();

  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState(INITIAL_GREETING);
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isMaximized, setIsMaximized] = useState(false);

  const inputRef = useRef(null);
  const terminalBodyRef = useRef(null);
  const modalRef = useRef(null);

  useFocusTrap(isOpen, modalRef, { initialFocusSelector: '.terminal-input-field' });

  const handleClose = useCallback(() => {
    playSound('close');
    onClose();
  }, [playSound, onClose]);

  // Prevent background scrolling while terminal modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

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

      case 'dotnet': {
        newHistory.push({
          type: 'output',
          text: `.NET SDK (reflecting environment):
 Version:   8.0.404
 Commit:    c78903e1e2

Runtime Environment:
 OS Name:     linux-x64
 Architecture: x64
 .NET Runtimes Installed:
   Microsoft.AspNetCore.App 8.0.404 [/usr/share/dotnet/shared/Microsoft.AspNetCore.App]
   Microsoft.NETCore.App 8.0.404 [/usr/share/dotnet/shared/Microsoft.NETCore.App]

Active Architecture : Clean Architecture (Domain, Application, Infrastructure, WebApi)
Patterns & Tooling  : MediatR, FluentValidation, Entity Framework Core, Redis Caching`,
        });
        playSound('click');
        break;
      }

      case 'docker': {
        newHistory.push({
          type: 'output',
          text: `CONTAINER ID   IMAGE                    STATUS         PORTS                    NAMES
a48f29c1d01    store-api:net8           Up 48 hours    0.0.0.0:5000->80/tcp     store-api-core
b83e10f922a    redis:7.2-alpine         Up 48 hours    0.0.0.0:6379->6379/tcp   cache-redis
c9210f8481e    postgres:16-alpine       Up 48 hours    0.0.0.0:5432->5432/tcp   prod-postgres
d103fa7231c    rabbitmq:3.13-management Up 48 hours    0.0.0.0:5672->5672/tcp   event-bus

4 containers active · 0 failed · Swarm / Compose mesh healthy`,
        });
        playSound('click');
        break;
      }

      case 'git': {
        newHistory.push({
          type: 'output',
          text: `On branch main
Your branch is up to date with 'origin/main'.

Recent engineering commits:
  * feat(resume): add quick section navigation bar and section anchor links
  * feat(guestbook): add interactive heart reactions and mobile sound controls
  * feat(portfolio): integrate URL search deep linking with query sync

working tree clean`,
        });
        playSound('click');
        break;
      }

      case 'curl': {
        newHistory.push({
          type: 'output',
          text: `HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Server: Kestrel (.NET 8.0)
X-Response-Time: 1.84ms

{
  "status": "Healthy",
  "service": "Mahmud-Portfolio-Engine",
  "version": "2.4.0",
  "uptime": "99.98%",
  "database": "PostgreSQL 16 (Online)",
  "cache": "Redis 7.2 (Active)",
  "region": "ap-southeast-1"
}`,
        });
        playSound('click');
        break;
      }

      case 'uptime': {
        newHistory.push({
          type: 'output',
          text: ` 15:15:00 up 450 days, 14:32,  1 user,  load average: 0.14, 0.09, 0.06`,
        });
        playSound('click');
        break;
      }

      case 'uname': {
        newHistory.push({
          type: 'output',
          text: `Linux hasan-portfolio-srv 6.8.0-generic x86_64 GNU/Linux`,
        });
        playSound('click');
        break;
      }

      case 'cat': {
        if (!arg) {
          newHistory.push({
            type: 'output',
            text: `usage: cat [bio|skills|contact|resume]`,
          });
        } else if (arg === 'bio' || arg === 'about') {
          newHistory.push({
            type: 'output',
            text: `Mahmud al Hasan — Senior Backend Software Engineer with 8+ years experience building enterprise systems in ASP.NET Core, Laravel, and NestJS.`,
          });
        } else if (arg === 'skills') {
          newHistory.push({
            type: 'output',
            text: `Core Stack: C# (.NET 8), ASP.NET Core Web API, EF Core, Laravel, PHP, NestJS, Node.js, PostgreSQL, MySQL, Redis, AWS, Docker.`,
          });
        } else if (arg === 'contact') {
          newHistory.push({
            type: 'output',
            text: `Email: mahmud.csem@gmail.com | Phone/WhatsApp: +880 1727 328200 | Location: Bayazid, Chattogram`,
          });
        } else if (arg === 'resume' || arg === 'cv') {
          newHistory.push({
            type: 'output',
            text: `Opening Executive Resume modal...`,
          });
          onClose();
          if (onOpenResumeModal) onOpenResumeModal();
        } else {
          newHistory.push({
            type: 'error',
            text: `cat: ${arg}: No such file or directory. Try 'cat bio', 'cat skills', or 'cat contact'.`,
          });
        }
        playSound('click');
        break;
      }

      case 'echo': {
        const textToEcho = parts.slice(1).join(' ');
        newHistory.push({
          type: 'output',
          text: textToEcho,
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

      case 'home': {
        newHistory.push({
          type: 'output',
          text: `Navigating to Home...`,
        });
        playSound('chime');
        setTimeout(() => {
          onClose();
          navigate('/');
        }, 1200);
        break;
      }

      case 'portfolio':
      case 'repos':
      case 'work': {
        newHistory.push({
          type: 'output',
          text: `Navigating to Portfolio & Repositories...`,
        });
        playSound('chime');
        setTimeout(() => {
          onClose();
          navigate('/portfolio');
        }, 1200);
        break;
      }

      case 'focus': {
        newHistory.push({
          type: 'output',
          text: `Launching Focus Station · Ambient Nature Workspace...`,
        });
        playSound('chime');
        setTimeout(() => {
          onClose();
          navigate('/focus');
        }, 1200);
        break;
      }

      case 'cheatsheet':
      case 'shortcuts': {
        newHistory.push({
          type: 'output',
          text: `Opening Keyboard Shortcuts Cheatsheet...`,
        });
        playSound('chime');
        onClose();
        if (openCheatsheet) openCheatsheet();
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
        handleClose();
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
    // Escape key to dismiss terminal
    if (e.key === 'Escape') {
      e.preventDefault();
      handleClose();
      return;
    }

    // Unix Ctrl+C: Cancel current input line if no text is selected
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c') {
      const selection = window.getSelection()?.toString();
      if (!selection) {
        e.preventDefault();
        setHistory((prev) => [...prev, { type: 'input', text: `${inputVal}^C` }]);
        setInputVal('');
        return;
      }
    }

    // Unix Ctrl+L: Clear terminal screen
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'l') {
      e.preventDefault();
      setHistory([]);
      playSound('click');
      return;
    }

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
    <div className="terminal-overlay-backdrop" onClick={handleClose}>
      <div
        className={`terminal-window ${isMaximized ? 'maximized' : ''}`}
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-label="Interactive Terminal CLI"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Terminal Header Chrome */}
        <div className="terminal-titlebar">
          <div className="window-controls">
            <button
              type="button"
              className="ctrl-dot close"
              onClick={handleClose}
              aria-label="Close terminal"
              title="Close (Esc)"
            />
            <button
              type="button"
              className="ctrl-dot minimize"
              onClick={handleClose}
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
              onClick={handleClose}
              aria-label="Close terminal"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
        </div>

        {/* Quick Command Chips Toolbar */}
        <div className="terminal-quick-chips" role="toolbar" aria-label="Quick shell commands">
          <span className="chips-label">Quick:</span>
          {['help', 'skills', 'projects', 'dotnet', 'docker', 'curl health', 'contact', 'clear'].map((cmd) => (
            <button
              key={cmd}
              type="button"
              className="term-chip"
              onClick={() => {
                playSound('tick');
                handleCommandExecution(cmd);
              }}
            >
              {cmd}
            </button>
          ))}
        </div>

        {/* Terminal Body Screen */}
        <div
          className="terminal-body"
          ref={terminalBodyRef}
          role="log"
          aria-live="polite"
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

export default React.memo(Terminal);
