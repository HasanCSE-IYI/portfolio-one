import { useEffect, useState } from 'react'
import Loader from 'react-loaders'
import { Link } from 'react-router-dom'
import LogoTitle from '../../assets/images/logo-m.svg'
import AnimatedLetters from '../AnimatedLetters'
import './index.scss'
import Logo from './Logo'
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
      // format in Bangladesh time (GMT+6)
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
        <div className="text-zone">
          {/* Status & Local Time Bar (Inspired by Al Nahian & Muttakin Hasib) */}
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

          {/* Focus Chain (Inspired by Muttakin Hasib's hero focus chain) */}
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
              VIEW ARCHITECTURE
            </Link>
          </div>

          {/* Engineering Impact Cards (Inspired by Muttakin Hasib's impact metrics) */}
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
        <Logo />
      </div>

      <Loader type="pacman" />
    </>
  )
}

export default Home
