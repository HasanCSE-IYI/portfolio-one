import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faMapMarkerAlt,
  faArrowRight,
  faFilePdf,
  faLayerGroup,
  faTerminal,
} from '@fortawesome/free-solid-svg-icons'
import LogoTitle from '../../assets/images/logo-m.svg'
import AnimatedLetters from '../AnimatedLetters'
import RequestPipeline from '../RequestPipeline'
import './index.scss'
import portfolioData from '../../data/portfolio.json'

const CAPABILITIES = [
  {
    name: 'ASP.NET Core & Modern C#',
    tag: '.NET & C#',
    summary: 'Clean Architecture, ASP.NET Core Web API, EF Core (Code-First & Migrations), and JWT Role-Based Authorization.',
    project: 'Store API',
    link: '/portfolio',
    codeHint: 'Repository Pattern · Unit of Work · EF Core LINQ',
    architecture: {
      headline: 'Enterprise Clean Architecture & ASP.NET Core 8 Web API',
      overview: 'Strict separation of concerns decoupling core business domain entities from external persistence providers and HTTP transport.',
      flowSteps: [
        { layer: 'Domain', title: 'Entities & POCO Models', detail: 'Pure domain entities free from external framework dependencies' },
        { layer: 'Application', title: 'Services & Contracts', detail: 'Interface abstractions, DTO contracts, and query pipelines' },
        { layer: 'Infrastructure', title: 'EF Core & Persistence', detail: 'DbContext, Code-First migrations, AsNoTracking() read optimization' },
        { layer: 'Presentation', title: 'ASP.NET Core Web API', detail: 'Controllers with JWT Bearer, RFC 7807 ProblemDetails & OpenAPI' },
      ],
      metrics: '<60ms response latency · AsNoTracking() read optimization · Granular RBAC',
    },
  },
  {
    name: 'High-Concurrency Telemedicine',
    tag: 'Laravel & Cloud',
    summary: 'Led 4-member backend team, designed relational schemas, and maintained 99.9% uptime real-time consultations.',
    project: 'Doctor Dekhao',
    link: '/portfolio',
    codeHint: 'Zero-Downtime Migrations · Real-Time Doctor Sync',
    architecture: {
      headline: 'Real-Time Telemedicine Engine (Doctor Dekhao)',
      overview: 'High-availability relational platform synchronizing live patient queues and doctor consultation video sessions.',
      flowSteps: [
        { layer: 'Client Gateway', title: 'Mobile & Web Apps', detail: 'Token-authenticated consultation dispatch' },
        { layer: 'Queue Tier', title: 'Redis & Event Bus', detail: 'Instant doctor availability and lock coordination' },
        { layer: 'Relational DB', title: 'MySQL with ACID', detail: 'Normalized medical records, zero-downtime schema evolution' },
        { layer: 'Cloud Infrastructure', title: 'AWS EC2, S3 & Docker', detail: '99.9% SLA uptime, automated health probes and multi-stage containers' },
      ],
      metrics: '4-member team led · 99.9% production SLA · Zero transactional deadlocks',
    },
  },
  {
    name: 'Cloud Infrastructure & DevOps',
    tag: 'AWS & Docker',
    summary: 'Automated containerized microservices on AWS (EC2, RDS, S3), Docker, and production Linux environments.',
    project: 'AWS / Docker',
    link: '/about',
    codeHint: 'Docker Multi-Stage · Nginx Reverse Proxy · AWS S3',
    architecture: {
      headline: 'Containerized Cloud Architecture (AWS & Linux)',
      overview: 'Resilient multi-tier deployment topology balancing zero-trust networking with automated CI/CD.',
      flowSteps: [
        { layer: 'Ingress', title: 'Cloudflare / Route 53', detail: 'DNS resolution, DDoS mitigation, and SSL/TLS 1.3 termination' },
        { layer: 'Reverse Proxy', title: 'Nginx on Ubuntu', detail: 'Static caching, compression, and HTTP/2 proxy buffering' },
        { layer: 'Containers', title: 'Docker Containers', detail: 'Multi-stage lean Alpine images with isolated process sandboxing' },
        { layer: 'Persistence', title: 'AWS RDS & S3', detail: 'Automated snapshots, encrypted asset buckets, and managed read replicas' },
      ],
      metrics: 'Sub-minute automated deploys · Immutable image tags · Encrypted cloud storage',
    },
  },
  {
    name: 'Event-Driven Data Pipelines',
    tag: 'Python & Redis',
    summary: 'Asynchronous task processing with Celery, Redis queues, and high-volume data ingestion pipelines.',
    project: 'Shuni Live',
    link: '/portfolio',
    codeHint: 'Scrapy Crawler · Celery Workers · Redis Pub/Sub',
    architecture: {
      headline: 'Distributed Asynchronous Ingestion (Shuni Live)',
      overview: 'Event-driven pipeline continuously crawling, parsing, and queueing high-frequency live data streams.',
      flowSteps: [
        { layer: 'Crawler Pool', title: 'Scrapy Ingestion', detail: 'Concurrent asynchronous web extractors and rate limiters' },
        { layer: 'Message Broker', title: 'Redis Pub/Sub', detail: 'Low-latency in-memory message transport and deduplication queues' },
        { layer: 'Worker Farm', title: 'Celery Distributed Tasks', detail: 'Scalable worker processes transforming and sanitizing payloads' },
        { layer: 'Store & Feed', title: 'Relational DB / Stream', detail: 'Indexed analytics storage and real-time client publication' },
      ],
      metrics: 'High-throughput concurrency · Fault-tolerant queue retries · Zero data loss',
    },
  },
]

const Home = () => {
  const [letterClass, setLetterClass] = useState('text-animate')
  const [currentTime, setCurrentTime] = useState('')
  const [activeCapability, setActiveCapability] = useState(0)
  const [isSpecCollapsed, setIsSpecCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768
    }
    return false
  })
  const [commandInput, setCommandInput] = useState('')
  const [terminalHistory, setTerminalHistory] = useState([])
  const [pastCommands, setPastCommands] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const cliHistoryRef = useRef(null)

  const executeCliCommand = (cmd) => {
    const trimmed = cmd.trim().toLowerCase()
    if (!trimmed) return

    setPastCommands((prev) => [...prev, cmd])
    setHistoryIndex(-1)

    if (trimmed === 'clear') {
      setTerminalHistory([])
      setCommandInput('')
      return
    }

    let result = null
    switch (trimmed) {
      case 'help':
        result = (
          <div className="cli-output">
            <p>Available commands:</p>
            <p>  <strong>skills</strong>           - Core &amp; expanding technical stack</p>
            <p>  <strong>projects</strong>         - Top production GitHub repositories</p>
            <p>  <strong>curl /api/health</strong> - Run live healthcheck probe</p>
            <p>  <strong>contact</strong>          - Direct contact channels &amp; phone</p>
            <p>  <strong>whoami</strong>           - Print engineering identity &amp; role</p>
            <p>  <strong>clear</strong>            - Clear terminal history</p>
          </div>
        )
        break
      case 'skills':
        result = (
          <div className="cli-output">
            <p><span className="accent">.NET Core:</span> C#, ASP.NET Core Web API, EF Core 8, JWT, LINQ</p>
            <p><span className="accent">Backend:</span> Laravel (8+ yrs), NestJS, Node.js, Clean Architecture</p>
            <p><span className="accent">Databases:</span> MySQL, MongoDB, SQLite, Redis</p>
            <p><span className="accent">Cloud/DevOps:</span> AWS (EC2, S3, RDS), Docker, Linux (Ubuntu)</p>
          </div>
        )
        break
      case 'projects':
        result = (
          <div className="cli-output">
            <p>• <strong>StoreApi</strong> [.NET 8 / EF Core] - JWT Auth &amp; Clean Architecture</p>
            <p>• <strong>Doctor Dekhao</strong> [Laravel / AWS] - Telemedicine API, 99.9% uptime</p>
            <p>• <strong>Mappi</strong> [Flutter GIS] - Offline vector navigation engine</p>
            <p>• <strong>chittago</strong> [Kotlin / Android] - Offline MBTiles map engine</p>
            <p>• <strong>Hamd-Shop</strong> [Laravel / MySQL] - ACID transaction e-commerce</p>
            <p>• <strong>saas-ai</strong> [Next.js / Edge] - Multi-modal AI streaming API</p>
          </div>
        )
        break
      case 'curl /api/health':
      case 'health':
        result = (
          <div className="cli-output json-style">
            <p>HTTP/2 200 OK (14ms)</p>
            <p>&#123;</p>
            <p>&nbsp;&nbsp;&quot;status&quot;: &quot;HEALTHY&quot;,</p>
            <p>&nbsp;&nbsp;&quot;uptime&quot;: &quot;8+ Years Production&quot;,</p>
            <p>&nbsp;&nbsp;&quot;activeFocus&quot;: &quot;.NET Core Web API &amp; C#&quot;,</p>
            <p>&nbsp;&nbsp;&quot;availability&quot;: &quot;Open to Opportunities&quot;</p>
            <p>&#125;</p>
          </div>
        )
        break
      case 'contact':
        result = (
          <div className="cli-output">
            <p>Email: <a href="mailto:mahmud.csem@gmail.com">mahmud.csem@gmail.com</a></p>
            <p>Phone: <a href="tel:+8801727328200">+880 1727-328200</a></p>
            <p>WhatsApp: <a href="https://wa.me/8801727328200" target="_blank" rel="noreferrer">+880 1727-328200</a></p>
            <p>GitHub: <a href="https://github.com/HasanCSE-IYI" target="_blank" rel="noreferrer">github.com/HasanCSE-IYI</a></p>
          </div>
        )
        break
      case 'whoami':
        result = (
          <div className="cli-output">
            <p>Mahmud al Hasan — Senior Backend Software Engineer (8+ Years Production Experience)</p>
            <p>Foundation: Laravel &amp; NestJS · Specialization: ASP.NET Core Web API &amp; C#</p>
          </div>
        )
        break
      default:
        result = (
          <div className="cli-output error">
            <p>Command not found: &apos;{trimmed}&apos;. Type &apos;<strong>help</strong>&apos; for list of commands.</p>
          </div>
        )
        break
    }

    setTerminalHistory((prev) => [...prev, { command: cmd, result }])
    setCommandInput('')
  }

  // Auto-scroll inside terminal history container only when new output arrives
  useEffect(() => {
    if (terminalHistory.length > 0 && cliHistoryRef.current) {
      cliHistoryRef.current.scrollTop = cliHistoryRef.current.scrollHeight
    }
  }, [terminalHistory])

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (pastCommands.length === 0) return
      const nextIndex = historyIndex === -1 ? pastCommands.length - 1 : Math.max(0, historyIndex - 1)
      setHistoryIndex(nextIndex)
      setCommandInput(pastCommands[nextIndex])
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex === -1) return
      const nextIndex = historyIndex + 1
      if (nextIndex >= pastCommands.length) {
        setHistoryIndex(-1)
        setCommandInput('')
      } else {
        setHistoryIndex(nextIndex)
        setCommandInput(pastCommands[nextIndex])
      }
    }
  }

  const handleRunCommand = (e) => {
    e.preventDefault()
    if (!commandInput.trim()) return
    executeCliCommand(commandInput)
  }

  const firstNameArray = ['a', 'h', 'm', 'u', 'd']
  const lastNameArray = ['a', 'l', ' ', 'H', 'a', 's', 'a', 'n', ',']
  const jobArray = [
    's',
    'o',
    'f',
    't',
    'w',
    'a',
    'r',
    'e',
    ' ',
    'e',
    'n',
    'g',
    'i',
    'n',
    'e',
    'e',
    'r',
    '.',
  ]

  useEffect(() => {
    const timer = setTimeout(() => {
      setLetterClass('text-animate-hover')
    }, 2200)
    return () => clearTimeout(timer)
  }, [])

  // Live ticking local time (Dhaka, Bangladesh GMT+6)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const options = {
        timeZone: 'Asia/Dhaka',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      }
      setCurrentTime(new Intl.DateTimeFormat('en-US', options).format(now))
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  const impactMetrics = portfolioData.impactMetrics || []

  return (
    <>
      <div className="container home-page">
        <div className="hero-grid">
          {/* Main Hero Column */}
          <div className="hero-main">
            {/* Status & Local Time Bar */}
            <div className="status-time-bar">
              <span className="availability-chip">
                <span className="pulse-indicator"></span>
                Open to Opportunities · Senior Backend Software Engineer
              </span>
              <span className="location-clock">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="clock-loc-icon" /> Bayazid, Chattogram, BD (GMT+6) · <span className="time-val">{currentTime || '12:00 PM'}</span>
              </span>
            </div>

            <h1>
              <span className="greeting-line">
                <span className={letterClass}>H</span>
                <span className={`${letterClass} _1`}>i</span>
                <span className={`${letterClass} _2`}>,</span>
                <span className="inline-space">&nbsp;</span>
                <span className={`${letterClass} _3`}>I</span>
                <span className={`${letterClass} _4`}>&apos;</span>
                <span className={`${letterClass} _5`}>m</span>
              </span>
              <br />
              <span className="name-line">
                <span className="first-name-unit">
                  <img
                    src={LogoTitle}
                    alt="M"
                    className="name-logo-m"
                  />
                  <AnimatedLetters
                    letterClass={letterClass}
                    strArray={firstNameArray}
                    idx={6}
                  />
                </span>
                <span className="name-sep">&nbsp;</span>
                <span className="last-name-unit">
                  <AnimatedLetters
                    letterClass={letterClass}
                    strArray={lastNameArray}
                    idx={11}
                  />
                </span>
              </span>
              <br />
              <AnimatedLetters
                letterClass={letterClass}
                strArray={jobArray}
                idx={21}
              />
            </h1>

            <h2>Senior Backend Software Engineer (8+ Years) | ASP.NET Core &amp; C# • Laravel • Distributed Systems</h2>

            <p className="hero-bio">
              Architecting resilient REST APIs, relational schemas, and high-concurrency systems.
              Former Co-Founder &amp; Tech Lead at <strong>Doctor Dekhao</strong> (Laravel/Cloud); architecting enterprise-grade microservices and Web APIs with <strong>ASP.NET Core, C#, Entity Framework Core, and AWS</strong>.
            </p>

            {/* Focus Chain */}
            <div className="focus-chain">
              <span className="chain-item">C# &amp; ASP.NET Core</span>
              <FontAwesomeIcon icon={faArrowRight} className="chain-arrow" />
              <span className="chain-item">EF Core &amp; SQL</span>
              <FontAwesomeIcon icon={faArrowRight} className="chain-arrow" />
              <span className="chain-item">Laravel &amp; NestJS</span>
              <FontAwesomeIcon icon={faArrowRight} className="chain-arrow" />
              <span className="chain-item">AWS Cloud &amp; Docker</span>
            </div>

            <div className="cta-buttons">
              <Link to="/portfolio" className="flat-button button-primary-glow">
                <FontAwesomeIcon icon={faLayerGroup} className="btn-icon" />
                <span>EXPLORE ARCHITECTURE &amp; SIMULATOR</span>
              </Link>
              <Link to="/resume" className="flat-button button-cv">
                <FontAwesomeIcon icon={faFilePdf} className="btn-icon" />
                <span>EXECUTIVE RESUME</span>
              </Link>
              <Link to="/contact" className="flat-button button-secondary">
                <span>GET IN TOUCH</span>
              </Link>
            </div>
          </div>

          {/* System Specification & Interactive macOS/Unix Terminal */}
          <div className="hero-spec">
            <div className="terminal-card">
              <div className="terminal-header">
                <div className="terminal-dots">
                  <button
                    type="button"
                    className="dot red"
                    title="Clear console output"
                    aria-label="Clear console output"
                    onClick={() => {
                      setTerminalHistory([])
                      setCommandInput('')
                    }}
                  />
                  <button
                    type="button"
                    className="dot yellow"
                    title={isSpecCollapsed ? 'Expand system specs' : 'Minimize system specs'}
                    aria-label={isSpecCollapsed ? 'Expand system specs' : 'Minimize system specs'}
                    onClick={() => setIsSpecCollapsed((prev) => !prev)}
                  />
                  <button
                    type="button"
                    className="dot green"
                    title="Run help command"
                    aria-label="Run help command"
                    onClick={() => executeCliCommand('help')}
                  />
                </div>
                <div className="terminal-title-wrap">
                  <FontAwesomeIcon icon={faTerminal} className="terminal-icon-mini" />
                  <span className="terminal-title">mahmud-al-hasan@backend-core:~$</span>
                </div>
                <span className="terminal-live-badge">
                  <span className="live-dot" aria-hidden="true"></span>
                  <span>Interactive CLI</span>
                </span>
              </div>
              <div className="terminal-body">
                {!isSpecCollapsed && (
                  <div className="specs-container">
                    <div className="spec-row">
                      <span className="spec-key">Role:</span>
                      <span className="spec-val highlight">Senior Backend Software Engineer</span>
                    </div>
                    <div className="spec-row">
                      <span className="spec-key">Experience:</span>
                      <span className="spec-val">8+ Years in Production Systems</span>
                    </div>
                    <div className="spec-row">
                      <span className="spec-key">Current Focus:</span>
                      <span className="spec-val accent">C#, ASP.NET Core Web API, EF Core</span>
                    </div>
                    <div className="spec-row">
                      <span className="spec-key">Proven Foundation:</span>
                      <span className="spec-val">Laravel (PHP), NestJS, Node.js</span>
                    </div>
                    <div className="spec-row">
                      <span className="spec-key">Startup Track:</span>
                      <span className="spec-val">Co-Founder &amp; Lead @ Doctor Dekhao</span>
                    </div>
                    <div className="spec-row">
                      <span className="spec-key">Databases:</span>
                      <span className="spec-val">MySQL, SQLite, MongoDB, Redis Caching</span>
                    </div>
                    <div className="spec-row">
                      <span className="spec-key">Cloud &amp; OS:</span>
                      <span className="spec-val">AWS (EC2, RDS, S3), Docker, Linux</span>
                    </div>
                    <div className="spec-row">
                      <span className="spec-key">SLA &amp; Latency:</span>
                      <span className="spec-val success">99.9% Uptime · &lt;60ms REST Latency</span>
                    </div>
                  </div>
                )}

                {/* Interactive CLI Console Zone */}
                <div className="terminal-cli-zone">
                  {terminalHistory.length > 0 && (
                    <div className="cli-history" ref={cliHistoryRef}>
                      {terminalHistory.map((item, hIdx) => (
                        <div key={hIdx} className="history-block">
                          <div className="history-prompt">
                            <span className="prompt-sym">❯</span>
                            <span className="cmd-echo">{item.command}</span>
                          </div>
                          {item.result}
                        </div>
                      ))}
                    </div>
                  )}

                  <form onSubmit={handleRunCommand} className="cli-input-form">
                    <span className="prompt-sym">❯</span>
                    <input
                      type="text"
                      className="cli-terminal-input"
                      value={commandInput}
                      onChange={(e) => setCommandInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Type 'help', 'skills', 'projects', 'curl /api/health'..."
                      aria-label="Interactive CLI command prompt"
                      spellCheck="false"
                      autoCapitalize="off"
                      autoComplete="off"
                    />
                    <button
                      type="submit"
                      className="cli-submit-btn"
                      aria-label="Execute CLI command"
                      disabled={!commandInput.trim()}
                    >
                      <span>Run</span>
                      <span className="btn-return-icon" aria-hidden="true">↵</span>
                    </button>
                  </form>

                  <div className="cli-quick-tags">
                    <span className="quick-label">Quick run:</span>
                    <button type="button" onClick={() => executeCliCommand('skills')}>skills</button>
                    <button type="button" onClick={() => executeCliCommand('projects')}>projects</button>
                    <button type="button" onClick={() => executeCliCommand('curl /api/health')}>curl health</button>
                    <button type="button" onClick={() => executeCliCommand('whoami')}>whoami</button>
                    <button type="button" onClick={() => executeCliCommand('help')}>help</button>
                    {terminalHistory.length > 0 && (
                      <button type="button" className="clear-tag" onClick={() => executeCliCommand('clear')}>clear</button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Engineering Impact Metrics Grid */}
        <div className="impact-grid">
          {impactMetrics.map((item, idx) => (
            <div className="impact-card" key={idx}>
              <div className="metric-val">{item.value}</div>
              <div className="metric-claim">{item.claim}</div>
              <div className="metric-context">{item.context}</div>
            </div>
          ))}
        </div>

        {/* Interactive Architecture Capabilities */}
        <div className="capabilities-section">
          <div className="capabilities-header">
            <span className="section-eyebrow">SYSTEM DOMAINS &amp; ARCHITECTURAL PATTERNS</span>
            <h3>Architectural Capabilities</h3>
            <p>Four connected domains. Each traced directly to real production systems.</p>
          </div>
          <div className="capabilities-grid">
            {CAPABILITIES.map((cap, idx) => (
              <div
                className={`capability-node ${activeCapability === idx ? 'active' : ''}`}
                key={idx}
                onClick={() => setActiveCapability(idx)}
                role="button"
                tabIndex={0}
                aria-pressed={activeCapability === idx}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setActiveCapability(idx)
                  }
                }}
              >
                <div className="cap-top">
                  <span className="cap-tag">{cap.tag}</span>
                  {activeCapability === idx && (
                    <span className="cap-active-badge">
                      <span className="active-dot" aria-hidden="true"></span>
                      Active
                    </span>
                  )}
                  <Link to={cap.link} className="cap-trace" onClick={(e) => e.stopPropagation()}>
                    Traced to: {cap.project} ↗
                  </Link>
                </div>
                <h4 className="cap-title">{cap.name}</h4>
                <p className="cap-summary">{cap.summary}</p>
                <div className="cap-code-hint">
                  <span className="hint-label">Implementation:</span>
                  <code className="hint-code">{cap.codeHint}</code>
                </div>
              </div>
            ))}
          </div>

          {/* Dynamic Architectural Deep-Dive Inspector */}
          {CAPABILITIES[activeCapability] && (
            <div className="capability-deep-inspector" role="region" aria-label="Selected Domain Architecture">
              <div className="inspector-top">
                <div className="inspector-left">
                  <span className="inspector-badge">
                    <span className="beacon-dot" aria-hidden="true"></span>
                    ARCHITECTURAL BREAKDOWN
                  </span>
                  <h4 className="inspector-headline">{CAPABILITIES[activeCapability].architecture.headline}</h4>
                  <p className="inspector-overview">{CAPABILITIES[activeCapability].architecture.overview}</p>
                </div>
                <Link to={CAPABILITIES[activeCapability].link} className="inspector-link">
                  <span>Explore in Project ↗</span>
                </Link>
              </div>

              <div className="inspector-flow-grid">
                {CAPABILITIES[activeCapability].architecture.flowSteps.map((step, sIdx) => (
                  <div className="flow-step-card" key={sIdx}>
                    <div className="step-header">
                      <span className="step-index">0{sIdx + 1}</span>
                      <span className="step-layer">{step.layer}</span>
                    </div>
                    <div className="step-title">{step.title}</div>
                    <div className="step-detail">{step.detail}</div>
                  </div>
                ))}
              </div>

              <div className="inspector-metrics-bar">
                <span className="metric-tag-label">Production Guarantee:</span>
                <span className="metric-tag-val">{CAPABILITIES[activeCapability].architecture.metrics}</span>
              </div>
            </div>
          )}
        </div>

        {/* Systems in Motion: REST API Request Lifecycle Pipeline */}
        <RequestPipeline />
      </div>
    </>
  )
}

export default Home
