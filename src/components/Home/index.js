import { useEffect, useState } from 'react'
import Loader from 'react-loaders'
import { Link } from 'react-router-dom'
import LogoTitle from '../../assets/images/logo-m.svg'
import AnimatedLetters from '../AnimatedLetters'
import './index.scss'
import portfolioData from '../../data/portfolio.json'

const Home = () => {
  const [letterClass, setLetterClass] = useState('text-animate')
  const [currentTime, setCurrentTime] = useState('')

  const nameArray = ['a', 'h', 'm', 'u', 'd', ',']
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
    }, 4000)
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
                Open to Opportunities · Backend &amp; .NET Core
              </span>
              <span className="location-clock">
                📍 Chattogram, BD (GMT+6) · <span className="time-val">{currentTime || '12:00 PM'}</span>
              </span>
            </div>

            <h1>
              <span className={letterClass}>H</span>
              <span className={`${letterClass} _12`}>i</span>
              <span className={`${letterClass} _13`}>,</span>
              <br />
              <span className={`${letterClass} _14`}>I</span>
              <span className={`${letterClass} _15`}>'</span>
              <span className={`${letterClass} _16`}>m</span>
              <img
                src={LogoTitle}
                alt="Mahmud al Hasan"
              />
              <AnimatedLetters
                letterClass={letterClass}
                strArray={nameArray}
                idx={15}
              />
              <br />
              <AnimatedLetters
                letterClass={letterClass}
                strArray={jobArray}
                idx={22}
              />
            </h1>

            <h2>Backend Software Engineer (8+ Years) | Laravel • NestJS • Focused on .NET</h2>

            <p className="hero-bio">
              Architecting resilient REST APIs, microservices, and high-concurrency systems.
              Former Co-Founder &amp; Tech Lead at <strong>Doctor Dekhao</strong>; currently building production-grade services with <strong>ASP.NET Core Web API, C#, and Entity Framework Core</strong>.
            </p>

            {/* Focus Chain */}
            <div className="focus-chain">
              <span className="chain-item">C# &amp; ASP.NET Core</span>
              <span className="chain-arrow">➔</span>
              <span className="chain-item">EF Core &amp; SQL</span>
              <span className="chain-arrow">➔</span>
              <span className="chain-item">Laravel &amp; NestJS</span>
              <span className="chain-arrow">➔</span>
              <span className="chain-item">AWS Cloud &amp; Docker</span>
            </div>

            <div className="cta-buttons">
              <Link to="/contact" className="flat-button">
                CONTACT ME
              </Link>
              <Link to="/portfolio" className="flat-button button-secondary">
                VIEW ARCHITECTURE &amp; SIMULATOR
              </Link>
            </div>
          </div>

          {/* System Specification Terminal (Replaces large spinning React logo) */}
          <div className="hero-spec">
            <div className="terminal-card">
              <div className="terminal-header">
                <div className="terminal-dots">
                  <span className="dot red"></span>
                  <span className="dot yellow"></span>
                  <span className="dot green"></span>
                </div>
                <span className="terminal-title">mahmud@backend-engine:~$ specs --summary</span>
              </div>
              <div className="terminal-body">
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
      </div>

      <Loader type="pacman" />
    </>
  )
}

export default Home
