import React, { useEffect } from 'react';
import './index.scss';

const ResumeModal = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="resume-modal-overlay" onClick={onClose}>
      <div
        className="resume-modal-content"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Executive Resume of Mahmud al Hasan"
      >
        <div className="modal-top-bar">
          <div className="modal-title-wrap">
            <span className="dot green"></span>
            <span className="title-text">Executive Resume · Mahmud al Hasan</span>
          </div>
          <div className="modal-actions">
            <button className="print-btn" onClick={handlePrint}>
              🖨️ Print / Save PDF
            </button>
            <button className="close-btn" onClick={onClose} aria-label="Close modal">
              ✕
            </button>
          </div>
        </div>

        <div className="resume-sheet">
          <header className="resume-header">
            <h1 className="name">Mahmud al Hasan</h1>
            <p className="headline">
              Backend Software Engineer (8+ Years) · Laravel &amp; Node.js Foundation · Actively Transitioning to .NET
            </p>
            <div className="contact-row">
              <span>📍 Bayazid, Chattogram, Bangladesh</span>
              <span>📞 +880 1727-328200</span>
              <span>✉️ mahmud.csem@gmail.com</span>
              <a
                href="https://www.linkedin.com/in/mahmud-al-hasan/"
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn
              </a>
              <a
                href="https://github.com/HasanCSE-IYI"
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
              <a
                href="https://hasancse-iyi.github.io/portfolio-one"
                target="_blank"
                rel="noreferrer"
              >
                Portfolio
              </a>
            </div>
          </header>

          <section className="resume-section">
            <h2 className="section-title">Professional Summary</h2>
            <p className="summary-text">
              Results-driven Backend Software Engineer with <strong>8+ years of production experience</strong> designing, building, and deploying high-concurrency RESTful APIs, relational database schemas, and microservices (Laravel, NestJS, MySQL, AWS). Former Co-Founder and Backend Engineering Lead at <strong>Doctor Dekhao</strong> (telemedicine startup), leading a 4-member engineering team. Actively preparing for <strong>.NET backend engineering roles</strong>—applying deep backend architectural fundamentals to build clean, testable Web APIs using <strong>C#, ASP.NET Core, and Entity Framework Core</strong>.
            </p>
          </section>

          <section className="resume-section">
            <h2 className="section-title">Core Competencies</h2>
            <div className="skills-grid">
              <div className="skill-cat">
                <span className="cat-title">Actively Preparing / Building (.NET):</span>
                <span className="cat-items">
                  C#, .NET 8, ASP.NET Core Web API, Entity Framework Core (Code-First &amp; Migrations), LINQ, Repository &amp; Unit-of-Work Patterns, JWT Authentication, Role-Based Access Control (RBAC), Swagger/OpenAPI.
                </span>
              </div>
              <div className="skill-cat">
                <span className="cat-title">Core Production Foundation (8+ Years):</span>
                <span className="cat-items">
                  Laravel (PHP), NestJS, Node.js, Express, RESTful APIs, Microservices, Clean Architecture, Dependency Injection.
                </span>
              </div>
              <div className="skill-cat">
                <span className="cat-title">Databases &amp; Caching:</span>
                <span className="cat-items">
                  MySQL, SQLite, PostgreSQL, MongoDB, Redis Caching, Schema Normalization, Query Optimization, Relational Indexing.
                </span>
              </div>
              <div className="skill-cat">
                <span className="cat-title">Cloud, DevOps &amp; Systems:</span>
                <span className="cat-items">
                  AWS (EC2, S3, RDS), Docker Containerization, Linux (Ubuntu), Git, GitHub Actions CI/CD.
                </span>
              </div>
              <div className="skill-cat">
                <span className="cat-title">Mobile &amp; GIS Systems:</span>
                <span className="cat-items">
                  Flutter, Dart, Offline Map Tile Caching &amp; Vector GIS Engines.
                </span>
              </div>
            </div>
          </section>

          <section className="resume-section">
            <h2 className="section-title">Work Experience</h2>

            <div className="job-entry">
              <div className="job-header">
                <div>
                  <h3 className="job-title">Co-Founder &amp; Backend Engineering Lead</h3>
                  <span className="company">Doctor Dekhao (Telemedicine Platform)</span>
                </div>
                <span className="period">2020 – 2023</span>
              </div>
              <ul className="achievements">
                <li>Led backend engineering for a 4-member software team, architecting real-time consultation APIs and patient-doctor scheduling workflows.</li>
                <li>Designed normalized relational database schemas in MySQL with zero-downtime migrations, ensuring 99.9% uptime for live appointments.</li>
                <li>Engineered secure role-based access control (doctor, patient, admin) and integrated third-party payment gateways and automated SMS alerts.</li>
                <li>Managed containerized production deployments on AWS (EC2, S3, RDS) using Docker.</li>
              </ul>
            </div>

            <div className="job-entry">
              <div className="job-header">
                <div>
                  <h3 className="job-title">Backend / Full Stack Engineer</h3>
                  <span className="company">Independent Engineering &amp; Client Platforms</span>
                </div>
                <span className="period">2016 – Present</span>
              </div>
              <ul className="achievements">
                <li>Architected full-featured e-commerce systems (Hamd-Shop) in Laravel with transactional ACID guarantees and inventory tracking.</li>
                <li>Developed automated high-frequency data extraction pipelines (Shuni Live) using Python, Celery, and Redis task queues.</li>
                <li>Built and optimized production REST APIs in Laravel and NestJS, maintaining sub-60ms response latency targets.</li>
                <li>Actively engineered clean ASP.NET Core Web API transition projects, implementing Code-First EF Core and JWT bearer authentication.</li>
              </ul>
            </div>
          </section>

          <section className="resume-section">
            <h2 className="section-title">Featured Engineering Projects</h2>
            <div className="project-entry">
              <span className="proj-name">Store API (ASP.NET Core Web API) · Transition Project (2024–2026)</span>
              <p className="proj-desc">
                Production-grade REST API engineered with C#, ASP.NET Core 8, EF Core Code-First migrations, SQLite, and JWT bearer token authorization with User and Admin roles. Features Repository pattern, pagination, and Swagger UI.
              </p>
            </div>
            <div className="project-entry">
              <span className="proj-name">Hamd-Shop (Laravel E-Commerce Platform) · Production System</span>
              <p className="proj-desc">
                Complete e-commerce backend built with Laravel and MySQL, featuring catalog management, cart processing, and administrative dashboards.
              </p>
            </div>
            <div className="project-entry">
              <span className="proj-name">Mappi (Flutter GIS &amp; Navigation Engine) · Mobile &amp; Systems Project</span>
              <p className="proj-desc">
                Flutter mapping and navigation app with multi-layer vector tiles, offline tile cache, and heads-up display (HUD) driving navigation.
              </p>
            </div>
          </section>

          <section className="resume-section">
            <h2 className="section-title">Education</h2>
            <div className="job-header">
              <div>
                <h3 className="job-title">Bachelor of Science in Computer Science &amp; Engineering (B.Sc. in CSE)</h3>
                <span className="company">Chittagong, Bangladesh</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ResumeModal;
