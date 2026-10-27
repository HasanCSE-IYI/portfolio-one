import {
  faAws,
  faDocker,
  faLinux,
  faNodeJs,
  faPython,
} from '@fortawesome/free-brands-svg-icons'
import {
  faBookOpen,
  faChevronDown,
  faChevronUp,
  faFilePdf,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AnimatedLetters from '../AnimatedLetters'
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
            8+ Years in Production Backend Systems · Architecture · Active .NET Transition
          </p>
        </div>

        {/* Centered Grand 3D Interactive Tech Cube */}
        <div className="stage-cube-cont">
          <div className="cube-orbit-wrap">
            <div className="cubespinner">
              <div className="face1">
                <FontAwesomeIcon icon={faLinux} color="#fcc624" title="Linux Environment" />
              </div>
              <div className="face2 dotnet-face">
                <svg viewBox="0 0 24 24" width="1em" height="1em" fill="#512bd4" aria-label=".NET &amp; C#">
                  <title>.NET &amp; C# Backend</title>
                  <path d="M24 8.618a8.877 8.877 0 0 0-.214-1.936c-.57-2.614-2.664-4.57-5.267-4.908A19.78 19.78 0 0 0 14.805 1.5H3.633a2.133 2.133 0 0 0-2.133 2.133v16.734a2.133 2.133 0 0 0 2.133 2.133h11.172c1.238 0 2.47-.09 3.714-.274 2.603-.338 4.697-2.294 5.267-4.908.147-.643.214-1.29.214-1.936V8.618zm-4.328 6.764c-.347 1.583-1.616 2.766-3.188 2.971-.851.125-1.714.187-2.576.187H5.828V5.46h8.08c.862 0 1.725.062 2.576.187 1.572.205 2.841 1.388 3.188 2.971.09.412.132.827.132 1.24v4.384c0 .413-.042.828-.132 1.24z" />
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
              Leveraging my extensive 8+ years of backend foundation, I am <strong>actively preparing for .NET backend engineering roles</strong>—building clean, modular Web APIs with <strong>C#, ASP.NET Core, and Entity Framework Core</strong> (Code-First &amp; Migrations), alongside cloud deployments on <strong>AWS, Docker, and Linux</strong>.
            </p>
          </div>

          {/* Expandable Engineering Philosophy (Inspired by Muttakin Hasib & Al Nahian) */}
          <div className="philosophy-section">
            <button
              type="button"
              className="philosophy-toggle-btn"
              onClick={() => setShowPrinciples(!showPrinciples)}
              aria-expanded={showPrinciples}
            >
              <FontAwesomeIcon
                icon={showPrinciples ? faChevronUp : faChevronDown}
                className="toggle-icon"
              />
              <span>
                {showPrinciples
                  ? 'Hide Engineering Philosophy'
                  : 'View Engineering Principles & Philosophy'}
              </span>
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
                    <span className="book-icon" aria-hidden="true">
                      <FontAwesomeIcon icon={faBookOpen} />
                    </span>
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
            <Link
              to="/resume"
              className="about-cv-btn"
            >
              <FontAwesomeIcon icon={faFilePdf} className="cv-btn-icon" />
              <span>VIEW / DOWNLOAD EXECUTIVE CV (PDF)</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default About
