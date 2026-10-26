import {
  faAws,
  faDocker,
  faLinux,
  faNodeJs,
  faPython,
} from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'
import AnimatedLetters from '../AnimatedLetters'
import ResumeModal from '../ResumeModal'
import './index.scss'

const BOOKS = [
  {
    title: 'Clean Architecture',
    author: 'Robert C. Martin (Uncle Bob)',
    takeaway: 'Separation of concerns, dependency inversion, and business logic decoupled from frameworks and databases.',
    tag: 'Architecture',
  },
  {
    title: 'Designing Data-Intensive Applications',
    author: 'Martin Kleppmann',
    takeaway: 'Reliability, scalability, and maintainability across transactional isolation levels, replication, and distributed storage.',
    tag: 'Distributed Systems',
  },
  {
    title: 'Domain-Driven Design',
    author: 'Eric Evans',
    takeaway: 'Ubiquitous language, bounded contexts, aggregates, and modeling complex business rules directly into domain code.',
    tag: 'Domain Modeling',
  },
  {
    title: 'Pro ASP.NET Core Web API',
    author: 'Adam Freeman',
    takeaway: 'Deep dive into HTTP pipeline interception, IoC container, EF Core Code-First patterns, and high-performance Web APIs.',
    tag: '.NET Ecosystem',
  },
]

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
  const [isResumeOpen, setIsResumeOpen] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLetterClass('text-animate-hover')
    }, 1800)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      <div className="container about-page">
        <div className="about-header">
          <h1>
            <AnimatedLetters
              letterClass={letterClass}
              strArray={['A', 'b', 'o', 'u', 't', ' ', 'm', 'e']}
              idx={15}
            />
          </h1>
          <p className="about-subtitle">
            8+ Years in Production Backend Systems · Architecture · Modern .NET Focus
          </p>
        </div>

        {/* Centered Grand 3D Interactive Tech Cube */}
        <div className="stage-cube-cont">
          <div className="cube-orbit-wrap">
            <div className="cubespinner">
              <div className="face1">
                <FontAwesomeIcon icon={faLinux} color="#fcc624" title="Linux Environment" />
              </div>
              <div className="face2 flutter-face">
                <svg viewBox="0 0 24 24" width="1em" height="1em" fill="#02569b" aria-label="Flutter">
                  <title>Flutter</title>
                  <path d="M14.314 0L2.3 12 6 15.7 21.684.013h-7.357zm.014 11.072L7.857 17.53l6.47 6.47H21.7l-6.46-6.468 6.46-6.46h-7.37z" />
                </svg>
              </div>
              <div className="face3">
                <FontAwesomeIcon icon={faNodeJs} color="#339933" title="Node.js / NestJS" />
              </div>
              <div className="face4">
                <FontAwesomeIcon icon={faAws} color="#ff9900" title="AWS Cloud Infrastructure" />
              </div>
              <div className="face5">
                <FontAwesomeIcon icon={faPython} color="#3776ab" title="Python Data Pipelines" />
              </div>
              <div className="face6">
                <FontAwesomeIcon icon={faDocker} color="#2496ed" title="Docker Containerization" />
              </div>
            </div>
          </div>
        </div>

        <div className="text-zone">
          <div className="bio-card">
            <p>
              I am a Backend-focused Software Engineer with <strong>8+ years of experience</strong> building and deploying production-ready REST APIs, microservices, and web platforms primarily using <strong>Laravel, NestJS, and Node.js</strong>.
            </p>
            <p>
              As a former Co-Founder of <strong>Doctor Dekhao</strong> (telemedicine startup), I led backend engineering for a 4-member team—designing robust API contracts, modeling relational schemas, and delivering high-performance telemedicine services under real-time constraints.
            </p>
            <p>
              Expanding on my extensive backend foundation, I am <strong>now actively focused on the .NET ecosystem</strong>—building clean, modular Web APIs with <strong>C#, ASP.NET Core, and Entity Framework Core</strong> (Code-First &amp; Migrations), alongside cloud deployments on <strong>AWS, Docker, and Linux</strong>.
            </p>
          </div>

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

          {/* Curated Engineering Library (Inspired by Muttakin Hasib's Library) */}
          <div className="books-section">
            <div className="books-header">
              <span className="section-eyebrow">ENGINEERING FOUNDATIONS</span>
              <h3>Architectural Influences &amp; Curated Library</h3>
              <p>Books that systematically shaped my approach to software structure, domain boundaries, and data scalability.</p>
            </div>
            <div className="books-grid">
              {BOOKS.map((book, idx) => (
                <div className="book-card" key={idx}>
                  <div className="book-top">
                    <span className="book-tag">{book.tag}</span>
                    <span className="book-icon">📖</span>
                  </div>
                  <h4 className="book-title">{book.title}</h4>
                  <span className="book-author">{book.author}</span>
                  <p className="book-takeaway">{book.takeaway}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Direct Resume / CV Trigger */}
          <div className="about-cv-cta">
            <button
              type="button"
              className="about-cv-btn"
              onClick={() => setIsResumeOpen(true)}
            >
              📄 VIEW / DOWNLOAD EXECUTIVE CV (PDF)
            </button>
          </div>
        </div>
      </div>

      {/* Full Executive Resume / CV Modal */}
      <ResumeModal
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
      />
    </>
  )
}

export default About
