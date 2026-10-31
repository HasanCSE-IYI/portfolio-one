import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faMapMarkerAlt,
  faArrowRight,
  faFilePdf,
  faLayerGroup,
  faTerminal,
  faCopy,
  faCheck,
  faExpand,
  faCompress,
  faBroom,
  faBolt,
  faFolderOpen,
  faLaptopCode,
  faHeartbeat,
  faUserSecret,
  faInfoCircle,
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
  const [isTerminalExpanded, setIsTerminalExpanded] = useState(false)
  const [commandInput, setCommandInput] = useState('')
  const [terminalHistory, setTerminalHistory] = useState([])
  const [pastCommands, setPastCommands] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [copiedHistoryIdx, setCopiedHistoryIdx] = useState(null)
  const cliHistoryRef = useRef(null)
  const cliInputRef = useRef(null)

  const AVAILABLE_COMMANDS = [
    'help',
    'skills',
    'projects',
    'curl /api/health',
    'health',
    'neofetch',
    'sysinfo',
    'whoami',
    'experience',
    'contact',
    'resume',
    'history',
    'clear',
    'sudo',
    'uptime',
    'date',
  ]

  const trimmedInput = commandInput.trim().toLowerCase()
  const ghostSuggestion = trimmedInput
    ? AVAILABLE_COMMANDS.find(
        (c) => c.startsWith(trimmedInput) && c !== trimmedInput
      ) || ''
    : ''

  const handleCopyOutput = async (hIdx, rawText) => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(rawText)
      }
      setCopiedHistoryIdx(hIdx)
      setTimeout(() => {
        setCopiedHistoryIdx(null)
      }, 2000)
    } catch (e) {
      setCopiedHistoryIdx(hIdx)
      setTimeout(() => {
        setCopiedHistoryIdx(null)
      }, 2000)
    }
  }

  const handleTerminalClick = (e) => {
    if (
      e.target.closest('button') ||
      e.target.closest('a') ||
      e.target.closest('input')
    ) {
      return
    }
    if (typeof window !== 'undefined') {
      const selection = window.getSelection()
      if (selection && selection.toString().length > 0) {
        return
      }
    }
    cliInputRef.current?.focus()
  }

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

    const timestamp = new Date().toLocaleTimeString('en-GB', { hour12: false })
    let result = null
    let rawText = ''

    switch (trimmed) {
      case 'help':
        rawText = `Available Backend CLI Commands:\n• skills           - Technical stack (.NET 8, Laravel, AWS, Docker)\n• projects         - Top production systems & repositories\n• experience       - 8+ years timeline & achievements\n• whoami           - Senior Backend Engineer profile\n• curl /api/health - Live REST healthcheck probe\n• neofetch         - Architecture specs & ASCII info\n• contact          - Email, WhatsApp & GitHub channels\n• resume           - View & download PDF resume\n• history          - List session command history\n• clear            - Clear terminal (Ctrl+L)`
        result = (
          <div className="cli-output help-output">
            <div className="output-header-badge help-badge">HELP</div>
            <p className="help-heading">Available Backend CLI Commands:</p>
            <div className="help-grid">
              <div className="help-col">
                <div className="help-section-title">Core &amp; Architecture</div>
                <div className="help-row"><button type="button" className="help-cmd-btn" onClick={() => executeCliCommand('skills')}>skills</button><span>- Technical stack &amp; frameworks</span></div>
                <div className="help-row"><button type="button" className="help-cmd-btn" onClick={() => executeCliCommand('projects')}>projects</button><span>- Production systems &amp; repositories</span></div>
                <div className="help-row"><button type="button" className="help-cmd-btn" onClick={() => executeCliCommand('experience')}>experience</button><span>- 8+ years timeline &amp; achievements</span></div>
                <div className="help-row"><button type="button" className="help-cmd-btn" onClick={() => executeCliCommand('whoami')}>whoami</button><span>- Senior Backend Engineer profile</span></div>
              </div>
              <div className="help-col">
                <div className="help-section-title">DevOps &amp; System</div>
                <div className="help-row"><button type="button" className="help-cmd-btn" onClick={() => executeCliCommand('curl /api/health')}>curl /api/health</button><span>- Live REST healthcheck probe</span></div>
                <div className="help-row"><button type="button" className="help-cmd-btn" onClick={() => executeCliCommand('neofetch')}>neofetch</button><span>- Architecture specs &amp; ASCII info</span></div>
                <div className="help-row"><button type="button" className="help-cmd-btn" onClick={() => executeCliCommand('uptime')}>uptime</button><span>- Server SLA &amp; worker pool uptime</span></div>
                <div className="help-row"><button type="button" className="help-cmd-btn" onClick={() => executeCliCommand('date')}>date</button><span>- Server time (UTC &amp; Asia/Dhaka)</span></div>
              </div>
              <div className="help-col">
                <div className="help-section-title">Contact &amp; Utilities</div>
                <div className="help-row"><button type="button" className="help-cmd-btn" onClick={() => executeCliCommand('contact')}>contact</button><span>- Direct email, WhatsApp &amp; GitHub</span></div>
                <div className="help-row"><button type="button" className="help-cmd-btn" onClick={() => executeCliCommand('resume')}>resume</button><span>- View &amp; download PDF resume</span></div>
                <div className="help-row"><button type="button" className="help-cmd-btn" onClick={() => executeCliCommand('history')}>history</button><span>- List session command history</span></div>
                <div className="help-row"><button type="button" className="help-cmd-btn" onClick={() => executeCliCommand('clear')}>clear</button><span>- Clear terminal screen (Ctrl+L)</span></div>
              </div>
            </div>
            <div className="help-shortcuts">
              <span>Shortcuts:</span>
              <span className="kbd-pill"><kbd>Tab</kbd> Autocomplete</span>
              <span className="kbd-pill"><kbd>&uarr;&darr;</kbd> History</span>
              <span className="kbd-pill"><kbd>Ctrl+L</kbd> Clear</span>
            </div>
          </div>
        )
        break
      case 'skills':
        rawText = `.NET Core & C#: C#, ASP.NET Core Web API, EF Core 8, JWT, LINQ\nBackend: Laravel (8+ yrs), NestJS, Node.js, Clean Architecture\nDatabases: MySQL, MongoDB, SQLite, Redis\nCloud/DevOps: AWS (EC2, S3, RDS), Docker, Linux (Ubuntu)`
        result = (
          <div className="cli-output skills-output">
            <div className="output-header-badge skills-badge">STACK</div>
            <div className="skills-cli-category">
              <div className="category-title">
                <span className="badge dotnet">.NET Core &amp; C#</span>
                <span className="exp-hint">Specialization</span>
              </div>
              <p className="skills-line"><span className="accent">.NET Core:</span> C#, ASP.NET Core Web API, EF Core 8, JWT, LINQ</p>
            </div>
            <div className="skills-cli-category">
              <div className="category-title">
                <span className="badge backend">Backend Engineering</span>
                <span className="exp-hint">8+ Years</span>
              </div>
              <p className="skills-line"><span className="accent">Backend:</span> Laravel (8+ yrs), NestJS, Node.js, Clean Architecture</p>
            </div>
            <div className="skills-cli-category">
              <div className="category-title">
                <span className="badge database">Data &amp; Persistence</span>
                <span className="exp-hint">High Concurrency</span>
              </div>
              <p className="skills-line"><span className="accent">Databases:</span> MySQL, MongoDB, SQLite, Redis</p>
            </div>
            <div className="skills-cli-category">
              <div className="category-title">
                <span className="badge cloud">Cloud &amp; Infrastructure</span>
                <span className="exp-hint">99.9% Uptime</span>
              </div>
              <p className="skills-line"><span className="accent">Cloud/DevOps:</span> AWS (EC2, S3, RDS), Docker, Linux (Ubuntu)</p>
            </div>
          </div>
        )
        break
      case 'projects':
        rawText = `• StoreApi [.NET 8 / EF Core] - JWT Auth & Clean Architecture\n• Doctor Dekhao [Laravel / AWS] - Telemedicine API, 99.9% uptime\n• Mappi [Flutter GIS] - Offline vector navigation engine\n• chittago [Kotlin / Android] - Offline MBTiles map engine\n• Hamd-Shop [Laravel / MySQL] - ACID transaction e-commerce\n• saas-ai [Next.js / Edge] - Multi-modal AI streaming API`
        result = (
          <div className="cli-output projects-output">
            <div className="output-header-badge projects-badge">PROJECTS</div>
            <div className="projects-cli-grid">
              <div className="project-cli-item">
                <div className="p-header">
                  <span className="p-bullet">•</span>
                  <strong className="p-name">StoreApi</strong>
                  <span className="p-badge dotnet">[.NET 8 / EF Core]</span>
                </div>
                <p className="p-desc">JWT Auth &amp; Clean Architecture with repository pattern and OpenAPI.</p>
              </div>
              <div className="project-cli-item">
                <div className="p-header">
                  <span className="p-bullet">•</span>
                  <strong className="p-name">Doctor Dekhao</strong>
                  <span className="p-badge cloud">[Laravel / AWS]</span>
                </div>
                <p className="p-desc">Telemedicine API, 99.9% uptime real-time doctor queue &amp; consultation sync.</p>
              </div>
              <div className="project-cli-item">
                <div className="p-header">
                  <span className="p-bullet">•</span>
                  <strong className="p-name">Mappi</strong>
                  <span className="p-badge mobile">[Flutter GIS]</span>
                </div>
                <p className="p-desc">Offline vector navigation engine with spatial SQLite and vector tiles.</p>
              </div>
              <div className="project-cli-item">
                <div className="p-header">
                  <span className="p-bullet">•</span>
                  <strong className="p-name">chittago</strong>
                  <span className="p-badge mobile">[Kotlin / Android]</span>
                </div>
                <p className="p-desc">Offline MBTiles map engine and points of interest routing.</p>
              </div>
              <div className="project-cli-item">
                <div className="p-header">
                  <span className="p-bullet">•</span>
                  <strong className="p-name">Hamd-Shop</strong>
                  <span className="p-badge backend">[Laravel / MySQL]</span>
                </div>
                <p className="p-desc">ACID transaction e-commerce platform with zero transactional deadlocks.</p>
              </div>
              <div className="project-cli-item">
                <div className="p-header">
                  <span className="p-bullet">•</span>
                  <strong className="p-name">saas-ai</strong>
                  <span className="p-badge edge">[Next.js / Edge]</span>
                </div>
                <p className="p-desc">Multi-modal AI streaming API engine with server-sent events.</p>
              </div>
            </div>
            <div className="projects-cli-footer">
              <span>View interactive architecture demos in <Link to="/portfolio" className="cli-link">Portfolio &rarr;</Link></span>
            </div>
          </div>
        )
        break
      case 'curl /api/health':
      case 'health':
        rawText = `HTTP/2 200 OK (14ms)\n{\n  "status": "HEALTHY",\n  "uptime": "8+ Years Production",\n  "activeFocus": ".NET Core Web API & C#",\n  "availability": "Open to Opportunities"\n}`
        result = (
          <div className="cli-output json-style curl-output">
            <div className="curl-meta-bar">
              <span className="curl-proto">&gt; GET /api/health HTTP/2</span>
              <span className="curl-status-pill">HTTP/2 200 OK (14ms)</span>
            </div>
            <div className="curl-headers">
              <p><span className="hdr-key">content-type:</span> application/json; charset=utf-8</p>
              <p><span className="hdr-key">server-timing:</span> db;dur=6, cache;dur=1.2, total;dur=14</p>
              <p><span className="hdr-key">x-cluster-node:</span> backend-prod-ap-southeast-1</p>
            </div>
            <div className="cli-output json-style">
              <p>HTTP/2 200 OK (14ms)</p>
              <p>&#123;</p>
              <p>&nbsp;&nbsp;&quot;status&quot;: &quot;HEALTHY&quot;,</p>
              <p>&nbsp;&nbsp;&quot;uptime&quot;: &quot;8+ Years Production&quot;,</p>
              <p>&nbsp;&nbsp;&quot;activeFocus&quot;: &quot;.NET Core Web API &amp; C#&quot;,</p>
              <p>&nbsp;&nbsp;&quot;availability&quot;: &quot;Open to Opportunities&quot;</p>
              <p>&#125;</p>
            </div>
          </div>
        )
        break
      case 'neofetch':
      case 'sysinfo':
      case 'uname':
        rawText = `    /\\\n   /  \\\n  / /\\ \\\n / /  \\ \\\n/_/    \\_\\\nmahmud@backend-core\nOS: Ubuntu 24.04 LTS (x86_64)\nKernel: Linux 6.8.0-cloud-amd64\nUptime: 8+ Years Production Engineering\nShell: zsh 5.9 (interactive cli)\nActive Stack: C# · ASP.NET Core 8 · EF Core 8\nCore Backend: Laravel (8+ yrs) · NestJS · Node.js\nCloud/DevOps: AWS (EC2, S3, RDS) · Docker · Nginx\nMemory: 32 GB High-Concurrency Pool\nSLA: 99.9% Production SLA (<60ms Latency)`
        result = (
          <div className="cli-output neofetch-output">
            <div className="output-header-badge sys-badge">SYSINFO</div>
            <div className="neofetch-grid">
              <pre className="neofetch-ascii" aria-hidden="true">
{`    /\\
   /  \\
  / /\\ \\
 / /  \\ \\
/_/    \\_\\`}
              </pre>
              <div className="neofetch-meta">
                <div className="neofetch-title">
                  <span className="user">mahmud</span>
                  <span className="at">@</span>
                  <span className="host">backend-core</span>
                </div>
                <div className="neofetch-sep">-----------------------------</div>
                <div className="neofetch-row"><span className="n-key">OS:</span> <span className="n-val">Ubuntu 24.04 LTS (x86_64)</span></div>
                <div className="neofetch-row"><span className="n-key">Host:</span> <span className="n-val">Enterprise Backend Architecture</span></div>
                <div className="neofetch-row"><span className="n-key">Kernel:</span> <span className="n-val">Linux 6.8.0-cloud-amd64</span></div>
                <div className="neofetch-row"><span className="n-key">Uptime:</span> <span className="n-val">8+ Years Production Engineering</span></div>
                <div className="neofetch-row"><span className="n-key">Shell:</span> <span className="n-val">zsh 5.9 (interactive cli)</span></div>
                <div className="neofetch-row"><span className="n-key">Active Stack:</span> <span className="n-val highlight">C# · ASP.NET Core 8 · EF Core 8</span></div>
                <div className="neofetch-row"><span className="n-key">Core Backend:</span> <span className="n-val">Laravel (8+ yrs) · NestJS · Node.js</span></div>
                <div className="neofetch-row"><span className="n-key">Cloud/DevOps:</span> <span className="n-val">AWS (EC2, S3, RDS) · Docker · Nginx</span></div>
                <div className="neofetch-row"><span className="n-key">Memory:</span> <span className="n-val">32 GB High-Concurrency Pool</span></div>
                <div className="neofetch-row"><span className="n-key">SLA:</span> <span className="n-val success">99.9% Production SLA (&lt;60ms Latency)</span></div>
              </div>
            </div>
          </div>
        )
        break
      case 'whoami':
        rawText = `Mahmud al Hasan — Senior Backend Software Engineer (8+ Years Production Experience)\nFoundation: Laravel & NestJS · Specialization: ASP.NET Core Web API & C#\nCo-Founder & Lead @ Doctor Dekhao · Proven 99.9% SLA & Clean Architecture`
        result = (
          <div className="cli-output whoami-output">
            <div className="output-header-badge whoami-badge">WHOAMI</div>
            <p className="whoami-primary">Mahmud al Hasan — Senior Backend Software Engineer (8+ Years Production Experience)</p>
            <p className="whoami-secondary">Foundation: Laravel &amp; NestJS · Specialization: ASP.NET Core Web API &amp; C#</p>
            <p className="whoami-tertiary">Co-Founder &amp; Technical Lead @ Doctor Dekhao · Proven 99.9% Production SLA</p>
          </div>
        )
        break
      case 'experience':
      case 'work':
        rawText = `2021 - Present: Senior Backend Engineer & Co-Founder @ Doctor Dekhao\n• Led 4-member backend team, designed relational schemas\n• Scaled high-concurrency telemedicine to 99.9% uptime SLA\nEnterprise Systems Specialization:\n• Clean Architecture with ASP.NET Core 8, EF Core 8, JWT RBAC`
        result = (
          <div className="cli-output experience-output">
            <div className="output-header-badge exp-badge">TRACK RECORD</div>
            <p className="output-subtitle">8+ Years Production Engineering Highlights:</p>
            <div className="exp-cli-timeline">
              <div className="exp-cli-item">
                <div className="exp-cli-header">
                  <span className="exp-role">Co-Founder &amp; Backend Lead</span>
                  <span className="exp-company">@ Doctor Dekhao</span>
                  <span className="exp-period">2021 &ndash; Present</span>
                </div>
                <p className="exp-detail">Led 4-member backend team, designed relational schemas, and maintained 99.9% uptime SLA.</p>
              </div>
              <div className="exp-cli-item">
                <div className="exp-cli-header">
                  <span className="exp-role">Enterprise Systems &amp; Web API</span>
                  <span className="exp-company">@ Store API</span>
                  <span className="exp-period">Clean Architecture</span>
                </div>
                <p className="exp-detail">Architected ASP.NET Core 8 Web API, EF Core 8, Repository Pattern, and JWT RBAC.</p>
              </div>
            </div>
          </div>
        )
        break
      case 'contact':
        rawText = `Email: mahmud.csem@gmail.com\nPhone: +880 1727-328200\nWhatsApp: +880 1727-328200\nGitHub: https://github.com/HasanCSE-IYI`
        result = (
          <div className="cli-output contact-output">
            <div className="output-header-badge contact-badge">CHANNELS</div>
            <p>Email: <a href="mailto:mahmud.csem@gmail.com">mahmud.csem@gmail.com</a></p>
            <p>Phone: <a href="tel:+8801727328200">+880 1727-328200</a></p>
            <p>WhatsApp: <a href="https://wa.me/8801727328200" target="_blank" rel="noreferrer">+880 1727-328200</a></p>
            <p>GitHub: <a href="https://github.com/HasanCSE-IYI" target="_blank" rel="noreferrer">github.com/HasanCSE-IYI</a></p>
          </div>
        )
        break
      case 'resume':
      case 'cv':
        rawText = `Mahmud al Hasan — Executive Resume\nRole: Senior Backend Software Engineer (8+ Years)\nPDF: /portfolio-one/assets/resume/mahmud-al-hasan-resume.pdf`
        result = (
          <div className="cli-output resume-output">
            <div className="output-header-badge resume-badge">RESUME</div>
            <p className="r-title"><strong>Mahmud al Hasan &mdash; Executive Backend Resume</strong></p>
            <p className="r-summary">Senior Backend Software Engineer (8+ Years) · ASP.NET Core Web API, C#, Clean Architecture, Laravel, AWS, Docker.</p>
            <div className="r-actions">
              <a
                href={`${process.env.PUBLIC_URL || ''}/assets/resume/mahmud-al-hasan-resume.pdf`}
                target="_blank"
                rel="noreferrer"
                className="cli-link resume-btn"
              >
                <FontAwesomeIcon icon={faFilePdf} />
                <span>Open PDF Resume</span>
              </a>
            </div>
          </div>
        )
        break
      case 'history':
        rawText = `Session Command History:\n${pastCommands.map((c, i) => `  ${i + 1}  ${c}`).join('\n')}`
        result = (
          <div className="cli-output history-output">
            <div className="output-header-badge sys-badge">HISTORY</div>
            <p className="output-subtitle">Session Command History:</p>
            {pastCommands.length === 0 ? (
              <p className="muted-hint">No commands executed yet.</p>
            ) : (
              <div className="history-cli-list">
                {pastCommands.map((c, i) => (
                  <div key={i} className="h-line">
                    <span className="h-idx">{i + 1}</span>
                    <span className="h-val">{c}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
        break
      case 'sudo':
        rawText = `visitor is not in the sudoers file. This incident will be reported to Mahmud.`
        result = (
          <div className="cli-output error">
            <div className="output-header-badge error-badge">ACCESS DENIED</div>
            <p><FontAwesomeIcon icon={faUserSecret} className="err-icon" /> visitor is not in the sudoers file. This incident will be reported to Mahmud.</p>
          </div>
        )
        break
      case 'uptime':
        rawText = `8+ years continuous production service, 99.9% SLA uptime, 0 deadlocks`
        result = (
          <div className="cli-output uptime-output">
            <div className="output-header-badge sys-badge">UPTIME</div>
            <p><span className="accent">Uptime:</span> 8+ years continuous production service, 99.9% SLA</p>
            <p><span className="accent">Load Average:</span> 0.14, 0.09, 0.05 (4 high-concurrency worker threads)</p>
          </div>
        )
        break
      case 'date':
        rawText = `UTC: ${new Date().toUTCString()} | Local: ${new Date().toLocaleString()}`
        result = (
          <div className="cli-output date-output">
            <div className="output-header-badge sys-badge">DATE</div>
            <p><span className="accent">UTC:</span> {new Date().toUTCString()}</p>
            <p><span className="accent">Local (BD):</span> {new Date().toLocaleString('en-US', { timeZone: 'Asia/Dhaka', timeZoneName: 'short' })}</p>
          </div>
        )
        break
      default:
        rawText = `Command not found: '${trimmed}'. Type 'help' for list of commands.`
        result = (
          <div className="cli-output error">
            <p>Command not found: &apos;{trimmed}&apos;. Type &apos;<strong>help</strong>&apos; for list of commands.</p>
          </div>
        )
        break
    }

    setTerminalHistory((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        command: cmd,
        timestamp,
        result,
        rawText,
      },
    ])
    setCommandInput('')
  }

  // Auto-scroll inside terminal history container only when new output arrives
  useEffect(() => {
    if (terminalHistory.length > 0 && cliHistoryRef.current) {
      cliHistoryRef.current.scrollTop = cliHistoryRef.current.scrollHeight
    }
  }, [terminalHistory])

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && (e.key === 'l' || e.key === 'L' || e.key === 'k' || e.key === 'K')) {
      e.preventDefault()
      setTerminalHistory([])
      setCommandInput('')
      return
    }

    if (e.key === 'Tab') {
      e.preventDefault()
      if (ghostSuggestion) {
        setCommandInput(ghostSuggestion)
      }
      return
    }

    if (e.key === 'ArrowRight' && e.target.selectionStart === commandInput.length) {
      if (ghostSuggestion) {
        e.preventDefault()
        setCommandInput(ghostSuggestion)
        return
      }
    }

    if (e.key === 'Escape') {
      e.preventDefault()
      setCommandInput('')
      return
    }

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
            <div
              className={`terminal-card ${isTerminalExpanded ? 'is-expanded' : ''}`}
              onClick={handleTerminalClick}
            >
              <div className="terminal-header">
                <div className="terminal-dots">
                  <button
                    type="button"
                    className="dot red"
                    title="Clear console output (Ctrl+L)"
                    aria-label="Clear console output"
                    onClick={(e) => {
                      e.stopPropagation()
                      setTerminalHistory([])
                      setCommandInput('')
                    }}
                  />
                  <button
                    type="button"
                    className="dot yellow"
                    title={isSpecCollapsed ? 'Expand system specs' : 'Minimize system specs'}
                    aria-label={isSpecCollapsed ? 'Expand system specs' : 'Minimize system specs'}
                    onClick={(e) => {
                      e.stopPropagation()
                      setIsSpecCollapsed((prev) => !prev)
                    }}
                  />
                  <button
                    type="button"
                    className="dot green"
                    title={isTerminalExpanded ? 'Collapse terminal view' : 'Expand terminal view'}
                    aria-label={isTerminalExpanded ? 'Collapse terminal view' : 'Expand terminal view'}
                    onClick={(e) => {
                      e.stopPropagation()
                      setIsTerminalExpanded((prev) => !prev)
                    }}
                  />
                </div>
                <div className="terminal-title-wrap">
                  <FontAwesomeIcon icon={faTerminal} className="terminal-icon-mini" />
                  <span className="terminal-title">mahmud@backend-core:~$</span>
                </div>
                <div className="terminal-header-controls">
                  <span className="terminal-live-badge">
                    <span className="live-dot" aria-hidden="true"></span>
                    <span>zsh 5.9</span>
                  </span>
                  <button
                    type="button"
                    className="terminal-ctrl-btn"
                    title={isTerminalExpanded ? 'Collapse terminal height' : 'Expand terminal height'}
                    aria-label={isTerminalExpanded ? 'Collapse terminal height' : 'Expand terminal height'}
                    onClick={(e) => {
                      e.stopPropagation()
                      setIsTerminalExpanded((prev) => !prev)
                    }}
                  >
                    <FontAwesomeIcon icon={isTerminalExpanded ? faCompress : faExpand} />
                  </button>
                </div>
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
                  {terminalHistory.length === 0 ? (
                    <div className="cli-welcome-banner" aria-hidden="true">
                      <div className="welcome-tag">
                        <span className="beacon"></span>
                        <span className="title">Backend Core Shell v2.4</span>
                        <span className="arch">x86_64-linux</span>
                      </div>
                      <p className="welcome-hint">
                        Interactive shell ready. Type a command or select quick tags below. Press <kbd>Tab</kbd> to autocomplete.
                      </p>
                    </div>
                  ) : (
                    <div className="cli-history" ref={cliHistoryRef} role="log" aria-live="polite">
                      {terminalHistory.map((item, hIdx) => (
                        <div key={item.id || hIdx} className="history-block">
                          <div className="history-prompt">
                            <div className="history-prompt-left">
                              <span className="prompt-sym">❯</span>
                              <span className="cmd-echo">{item.command}</span>
                            </div>
                            <div className="history-prompt-right">
                              <span className="history-timestamp">{item.timestamp}</span>
                              <button
                                type="button"
                                className="copy-output-btn"
                                title="Copy output"
                                aria-label={`Copy output for ${item.command}`}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleCopyOutput(hIdx, item.rawText)
                                }}
                              >
                                <FontAwesomeIcon icon={copiedHistoryIdx === hIdx ? faCheck : faCopy} />
                                <span>{copiedHistoryIdx === hIdx ? 'Copied' : 'Copy'}</span>
                              </button>
                            </div>
                          </div>
                          {item.result}
                        </div>
                      ))}
                    </div>
                  )}

                  <form onSubmit={handleRunCommand} className="cli-input-form">
                    <span className="prompt-sym">❯</span>
                    <div className="cli-input-wrapper">
                      <input
                        ref={cliInputRef}
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
                      {ghostSuggestion && (
                        <div className="cli-ghost-layer" aria-hidden="true">
                          <span className="invisible-prefix">{commandInput}</span>
                          <span className="ghost-suffix">{ghostSuggestion.slice(commandInput.length)}</span>
                        </div>
                      )}
                    </div>
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

                  <div className="cli-hints-bar">
                    <div className="cli-quick-tags">
                      <span className="quick-label">Quick run:</span>
                      <button type="button" onClick={() => executeCliCommand('skills')}>
                        <FontAwesomeIcon icon={faBolt} className="quick-icon" />
                        <span>skills</span>
                      </button>
                      <button type="button" onClick={() => executeCliCommand('projects')}>
                        <FontAwesomeIcon icon={faFolderOpen} className="quick-icon" />
                        <span>projects</span>
                      </button>
                      <button type="button" onClick={() => executeCliCommand('curl /api/health')}>
                        <FontAwesomeIcon icon={faHeartbeat} className="quick-icon" />
                        <span>curl health</span>
                      </button>
                      <button type="button" onClick={() => executeCliCommand('neofetch')}>
                        <FontAwesomeIcon icon={faTerminal} className="quick-icon" />
                        <span>neofetch</span>
                      </button>
                      <button type="button" onClick={() => executeCliCommand('whoami')}>
                        <FontAwesomeIcon icon={faLaptopCode} className="quick-icon" />
                        <span>whoami</span>
                      </button>
                      <button type="button" onClick={() => executeCliCommand('help')}>
                        <FontAwesomeIcon icon={faInfoCircle} className="quick-icon" />
                        <span>help</span>
                      </button>
                      {terminalHistory.length > 0 && (
                        <button type="button" className="clear-tag" onClick={() => executeCliCommand('clear')}>
                          <FontAwesomeIcon icon={faBroom} className="quick-icon" />
                          <span>clear</span>
                        </button>
                      )}
                    </div>
                    <div className="cli-keyboard-pills" aria-hidden="true">
                      <span className="kbd-pill"><kbd>Tab</kbd> Complete</span>
                      <span className="kbd-pill"><kbd>↑↓</kbd> History</span>
                      <span className="kbd-pill"><kbd>Ctrl+L</kbd> Clear</span>
                    </div>
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
