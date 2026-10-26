import {
  faAws,
  faDocker,
  faLaravel,
  faLinux,
  faNodeJs,
  faPython,
} from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'
import Loader from 'react-loaders'
import AnimatedLetters from '../AnimatedLetters'
import './index.scss'

const PRINCIPLES = [
  {
    title: 'Clean Architecture & Decoupled Domain',
    summary: 'Keeping business logic independent of frameworks, databases, and UI layers using Repository patterns and Dependency Injection.',
  },
  {
    title: 'High Throughput & Database Indexing',
    summary: 'Minimizing latency via EF Core AsNoTracking(), asynchronous I/O (async/await), and optimized relational indexing.',
  },
  {
    title: 'Defensive Security & RBAC',
    summary: 'Enforcing granular Role-Based Access Control, JWT signature verification, and secure parameter validation at every API boundary.',
  },
]

const About = () => {
  const [letterClass, setLetterClass] = useState('text-animate')
  const [showPrinciples, setShowPrinciples] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLetterClass('text-animate-hover')
    }, 3000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      <div className="container about-page">
        <div className="text-zone">
          <h1>
            <AnimatedLetters
              letterClass={letterClass}
              strArray={['A', 'b', 'o', 'u', 't', ' ', 'm', 'e']}
              idx={15}
            />
          </h1>
          <p>
            I am a Backend-focused Software Engineer with <strong>8+ years of experience</strong> building and deploying production-ready REST APIs, microservices, and web platforms primarily using <strong>Laravel, NestJS, and Node.js</strong>.
          </p>
          <p>
            As a former Co-Founder of <strong>Doctor Dekhao</strong> (telemedicine startup), I led backend engineering for a 4-member team—designing robust API contracts, modeling relational schemas, and delivering high-performance telemedicine services under real-time constraints.
          </p>
          <p>
            Expanding on my extensive backend foundation, I am <strong>now actively focused on the .NET ecosystem</strong>—building clean, modular Web APIs with <strong>C#, ASP.NET Core, and Entity Framework Core</strong> (Code-First &amp; Migrations), alongside cloud deployments on <strong>AWS, Docker, and Linux</strong>.
          </p>

          {/* Expandable Engineering Philosophy (Inspired by Muttakin Hasib & Al Nahian) */}
          <div className="philosophy-section">
            <button
              className="philosophy-toggle-btn"
              onClick={() => setShowPrinciples(!showPrinciples)}
            >
              <span>{showPrinciples ? '▲ Hide Engineering Philosophy' : '▼ View Engineering Principles & Philosophy'}</span>
            </button>

            {showPrinciples && (
              <div className="principles-grid">
                {PRINCIPLES.map((p, idx) => (
                  <div className="principle-card" key={idx}>
                    <div className="principle-title">
                      <span className="dot"></span>
                      {p.title}
                    </div>
                    <p className="principle-summary">{p.summary}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="tech-groups">
            <div className="group-label">CURRENT FOCUS:</div>
            <div className="tech-tags">
              <span className="tag highlight">C# (.NET 8)</span>
              <span className="tag highlight">ASP.NET Core Web API</span>
              <span className="tag highlight">Entity Framework Core</span>
              <span className="tag highlight">JWT &amp; RBAC</span>
            </div>

            <div className="group-label">CORE BACKEND FOUNDATION:</div>
            <div className="tech-tags">
              <span className="tag">Laravel (PHP)</span>
              <span className="tag">NestJS</span>
              <span className="tag">Node.js / Express</span>
              <span className="tag">MySQL</span>
              <span className="tag">MongoDB</span>
              <span className="tag">SQLite</span>
              <span className="tag">AWS (EC2, S3, RDS)</span>
              <span className="tag">Docker</span>
              <span className="tag">Linux</span>
              <span className="tag">Python / Scrapy</span>
            </div>
          </div>
        </div>

        <div className="stage-cube-cont">
          <div className="cubespinner">
            <div className="face1">
              <FontAwesomeIcon icon={faLinux} color="#FCC624" title="Linux Environment" />
            </div>
            <div className="face2">
              <FontAwesomeIcon icon={faLaravel} color="#DD0031" title="Laravel" />
            </div>
            <div className="face3">
              <FontAwesomeIcon icon={faNodeJs} color="#68A063" title="Node.js / NestJS" />
            </div>
            <div className="face4">
              <FontAwesomeIcon icon={faAws} color="#FF9900" title="AWS Cloud" />
            </div>
            <div className="face5">
              <FontAwesomeIcon icon={faPython} color="#4B8BBE" title="Python" />
            </div>
            <div className="face6">
              <FontAwesomeIcon icon={faDocker} color="#2496ED" title="Docker / Linux" />
            </div>
          </div>
        </div>
      </div>
      <Loader type="pacman" />
    </>
  )
}

export default About
