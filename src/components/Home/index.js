import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faMapMarkerAlt,
  faArrowRight,
  faFilePdf,
  faLayerGroup,
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
  },
  {
    name: 'High-Concurrency Telemedicine',
    tag: 'Laravel & Cloud',
    summary: 'Led 4-member backend team, designed relational schemas, and maintained 99.9% uptime real-time consultations.',
    project: 'Doctor Dekhao',
    link: '/portfolio',
  },
  {
    name: 'Cloud Infrastructure & DevOps',
    tag: 'AWS & Docker',
    summary: 'Automated containerized microservices on AWS (EC2, RDS, S3), Docker, and production Linux environments.',
    project: 'AWS / Docker',
    link: '/about',
  },
  {
    name: 'Event-Driven Data Pipelines',
    tag: 'Python & Redis',
    summary: 'Asynchronous task processing with Celery, Redis queues, and high-volume data ingestion pipelines.',
    project: 'Shuni Live',
    link: '/portfolio',
  },
]

const Home = () => {
  const [letterClass, setLetterClass] = useState('text-animate')
  const [currentTime, setCurrentTime] = useState('')
  const [activeCapability, setActiveCapability] = useState(0)

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

  // Live ticking local time (Inspired by Al Nahian's local time widget)
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
                Open to Opportunities · Backend Software Engineer
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
                <span className={`${letterClass} _4`}>'</span>
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

            <h2>Backend Software Engineer (8+ Years) | Laravel • NestJS • Transitioning to .NET</h2>

            <p className="hero-bio">
              Architecting resilient REST APIs, relational schemas, and high-concurrency systems.
              Former Co-Founder &amp; Tech Lead at <strong>Doctor Dekhao</strong> (Laravel/Cloud); actively preparing for .NET roles and building clean services with <strong>ASP.NET Core Web API, C#, and Entity Framework Core</strong>.
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
              <Link to="/contact" className="flat-button">
                <span>CONTACT ME</span>
              </Link>
              <Link to="/resume" className="flat-button button-cv">
                <FontAwesomeIcon icon={faFilePdf} className="btn-icon" />
                <span>VIEW / DOWNLOAD CV</span>
              </Link>
              <Link to="/portfolio" className="flat-button button-secondary">
                <FontAwesomeIcon icon={faLayerGroup} className="btn-icon" />
                <span>VIEW ARCHITECTURE &amp; SIMULATOR</span>
              </Link>
            </div>
          </div>

          {/* System Specification Terminal */}
          <div className="hero-spec">
            <div className="terminal-card">
              <div className="terminal-header">
                <div className="terminal-dots">
                  <span className="dot red"></span>
                  <span className="dot yellow"></span>
                  <span className="dot green"></span>
                </div>
                <span className="terminal-title">mahmud-al-hasan@backend-engineer:~$ specs --summary</span>
              </div>
              <div className="terminal-body">
                <div className="spec-row">
                  <span className="spec-key">Role:</span>
                  <span className="spec-val highlight">Backend Software Engineer</span>
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

        {/* Interactive Architecture Capabilities (Inspired by Muttakin Hasib's Capabilities section) */}
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
              >
                <div className="cap-top">
                  <span className="cap-tag">{cap.tag}</span>
                  <Link to={cap.link} className="cap-trace">
                    Traced to: {cap.project} ↗
                  </Link>
                </div>
                <h4 className="cap-title">{cap.name}</h4>
                <p className="cap-summary">{cap.summary}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Systems in Motion: REST API Request Lifecycle Pipeline */}
        <RequestPipeline />
      </div>
    </>
  )
}

export default Home
