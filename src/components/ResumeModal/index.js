import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
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
      document.body.classList.add('resume-modal-open');
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
      document.body.classList.remove('resume-modal-open');
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.body.classList.remove('resume-modal-open');
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handlePrint = () => {
    document.body.classList.add('resume-modal-open');
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
            <span className="title-text">Curriculum Vitae · Mahmud al Hasan</span>
          </div>
          <div className="modal-actions">
            <Link to="/resume" className="full-page-link" onClick={onClose}>
              ↗ Open Full Page
            </Link>
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
              Software Engineer (.NET / Backend) · 8+ Years Production Experience
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
                href="https://wa.me/8801727328200"
                target="_blank"
                rel="noreferrer"
              >
                WhatsApp
              </a>
            </div>
          </header>

          <section className="resume-section">
            <h2 className="section-title">Professional Summary</h2>
            <p className="summary-text">
              Backend-focused Software Engineer with <strong>8+ years of experience</strong> building and deploying REST APIs and web applications with <strong>Laravel, NestJS, and Node.js</strong>, including leading backend architecture for a telemedicine startup (<strong>Doctor Dekhao</strong>). Experienced with AWS, MySQL, MongoDB, and Linux-based deployment. Now actively focused on the <strong>.NET ecosystem (C#, ASP.NET Core, Entity Framework Core)</strong> through hands-on API projects.
            </p>
          </section>

          <section className="resume-section">
            <h2 className="section-title">Technical Skills</h2>
            <div className="skills-grid">
              <div className="skill-cat">
                <span className="cat-title">.NET &amp; C#:</span>
                <span className="cat-items">
                  C#, ASP.NET Core Web API, Entity Framework Core (Code First, migrations), LINQ, JWT authentication, RESTful APIs
                </span>
              </div>
              <div className="skill-cat">
                <span className="cat-title">Learning / Expanding:</span>
                <span className="cat-items highlight">
                  xUnit, SQL Server, Microsoft Azure, Docker Containerization
                </span>
              </div>
              <div className="skill-cat">
                <span className="cat-title">Backend Foundation:</span>
                <span className="cat-items">
                  Laravel (PHP), NestJS, Node.js, Express, RESTful API design, Microservices, Clean Architecture
                </span>
              </div>
              <div className="skill-cat">
                <span className="cat-title">Databases &amp; Caching:</span>
                <span className="cat-items">
                  MySQL, MongoDB, SQLite, PostgreSQL, Redis Queues
                </span>
              </div>
              <div className="skill-cat">
                <span className="cat-title">Cloud &amp; Systems:</span>
                <span className="cat-items">
                  AWS (EC2, S3), Linux, Git, GitHub Actions CI/CD
                </span>
              </div>
              <div className="skill-cat">
                <span className="cat-title">Data &amp; Automation:</span>
                <span className="cat-items">
                  Python, Scrapy, Celery, Redis Task Queues
                </span>
              </div>
              <div className="skill-cat">
                <span className="cat-title">Frontend &amp; UI:</span>
                <span className="cat-items">
                  TypeScript, Next.js, React, ReactFlow, Shadcn UI
                </span>
              </div>
            </div>
          </section>

          <section className="resume-section">
            <h2 className="section-title">Featured Projects</h2>
            <div className="job-entry">
              <div className="job-header">
                <div>
                  <h3 className="job-title">Store API</h3>
                  <span className="company">ASP.NET Core, EF Core, SQLite, JWT</span>
                </div>
                <a
                  href="https://github.com/HasanCSE-IYI/StoreApi"
                  target="_blank"
                  rel="noreferrer"
                  className="period"
                >
                  github.com/HasanCSE-IYI/StoreApi ↗
                </a>
              </div>
              <ul className="achievements">
                <li>Built a RESTful product inventory API with JWT authentication and role-based authorization (User/Admin).</li>
                <li>Implemented search, category filtering, pagination, and EF Core Code First migrations.</li>
                <li>Structured the codebase in Controller–Service–Repository layers with custom middleware.</li>
              </ul>
            </div>
          </section>

          <section className="resume-section">
            <h2 className="section-title">Work Experience</h2>

            <div className="job-entry">
              <div className="job-header">
                <div>
                  <h3 className="job-title">IT Operations &amp; Web Systems Engineer</h3>
                  <div className="company-subline">
                    <span className="company">EXONEXT &amp; SourcingPi</span>
                    <span className="work-type-badge">Hybrid</span>
                  </div>
                </div>
                <span className="period">Feb 2025 – Present</span>
              </div>
              <ul className="achievements">
                <li>Administer IT infrastructure, network configuration, and system security for hybrid business operations.</li>
                <li>Maintain and deploy updates for company websites, improving loading performance and responsiveness.</li>
                <li>Produce technical documentation and user guides for internal workflows.</li>
              </ul>
            </div>

            <div className="job-entry">
              <div className="job-header">
                <div>
                  <h3 className="job-title">Front-End Support &amp; Content Developer</h3>
                  <div className="company-subline">
                    <span className="company">Independent Contractor</span>
                    <span className="work-type-badge">Remote</span>
                  </div>
                </div>
                <span className="period">Feb 2025 – Aug 2026</span>
              </div>
              <ul className="achievements">
                <li>Monitored, tested, and resolved web platform defects, reducing recurring errors and downtime.</li>
                <li>Handled UI responsiveness fixes, cross-browser compatibility, and content updates.</li>
              </ul>
            </div>

            <div className="job-entry">
              <div className="job-header">
                <div>
                  <h3 className="job-title">Software Engineer</h3>
                  <span className="company">iGOT AI</span>
                </div>
                <span className="period">Feb 2024 – Aug 2024</span>
              </div>
              <ul className="achievements">
                <li>Developed core modules of a no-code virtual employee platform and AI chatbot solutions.</li>
                <li>Built node-based workflow interfaces with ReactFlow, Next.js, and TypeScript.</li>
                <li>Created reusable, accessible UI components with Shadcn UI.</li>
              </ul>
            </div>

            <div className="job-entry">
              <div className="job-header">
                <div>
                  <h3 className="job-title">Software Engineer</h3>
                  <span className="company">BeWeddy and BlessUp AI</span>
                </div>
                <span className="period">Feb 2022 – Dec 2023</span>
              </div>
              <ul className="achievements">
                <li>Developed and maintained features and modules using NestJS, MongoDB, and Next.js/React.</li>
                <li>Built and consumed RESTful APIs with JWT authentication using a modular, dependency-injection architecture.</li>
                <li>Managed deployment and DevOps on AWS (EC2, S3), reducing release cycles.</li>
                <li>Provided production support: resolved critical bugs and handled system incidents.</li>
              </ul>
            </div>

            <div className="job-entry">
              <div className="job-header">
                <div>
                  <h3 className="job-title">Software Engineer (Ex-Co-Founder)</h3>
                  <span className="company">Doctor Dekhao (Telemedicine Startup)</span>
                </div>
                <span className="period">Jun 2019 – Sep 2021</span>
              </div>
              <ul className="achievements">
                <li>Co-founded a telemedicine startup and led backend architecture for a 4-member software team.</li>
                <li>Designed, deployed, and maintained RESTful APIs (Laravel, MySQL) serving mobile applications for real-time patient-doctor consultations.</li>
                <li>Modeled database schemas and optimized relational queries and API payloads, dramatically improving response times.</li>
                <li>Collaborated closely with mobile engineers to establish API contracts for real-time doctor-patient interactions.</li>
                <li>Deployed and maintained backend infrastructure on cloud servers.</li>
              </ul>
            </div>

            <div className="job-entry">
              <div className="job-header">
                <div>
                  <h3 className="job-title">Software Engineer (R&amp;D)</h3>
                  <span className="company">DataShall Analytics Ltd.</span>
                </div>
                <span className="period">Sep 2018 – May 2019</span>
              </div>
              <ul className="achievements">
                <li>Contributed to &quot;Shuni Live&quot;, an AI-powered social listening and sentiment analytics platform.</li>
                <li>Integrated the Facebook Graph API for automated timeline data extraction and keyword discovery.</li>
                <li>Built data scraping pipelines and background task queues with Python, Scrapy, Celery, and Redis.</li>
                <li>Built the business analytics module for &quot;Shuni 02&quot;, enabling client retargeting based on negative sentiment analysis.</li>
              </ul>
            </div>

            <div className="job-entry">
              <div className="job-header">
                <div>
                  <h3 className="job-title">Mobile Application Developer</h3>
                  <span className="company">Talha Soft</span>
                </div>
                <span className="period">Apr 2018 – Aug 2018</span>
              </div>
              <ul className="achievements">
                <li>Built cross-platform mobile app prototypes with Python and Kivy.</li>
                <li>Managed version control with SVN and configured Linux-based Android builds with Buildozer.</li>
              </ul>
            </div>
          </section>

          <section className="resume-section">
            <h2 className="section-title">Education</h2>
            <div className="job-entry">
              <div className="job-header">
                <div>
                  <h3 className="job-title">B.Sc. in Computer Science and Engineering (CSE)</h3>
                  <div className="company-subline">
                    <span className="company">Bangladesh University of Business and Technology</span>
                    <span className="location-tag">Dhaka, Bangladesh</span>
                  </div>
                </div>
                <span className="period">Graduated</span>
              </div>
            </div>
          </section>

          <section className="resume-section">
            <h2 className="section-title">Languages &amp; Additional</h2>
            <p className="summary-text">
              <strong>Bangla</strong> (Native / Fluent) · <strong>English</strong> (Professional Working Proficiency)
            </p>
            <p className="summary-text" style={{ marginTop: '6px' }}>
              Firefox Student Ambassador (volunteer) · Professional PHP with Laravel training, BASIS BITM · Intra-university programming contests
            </p>
          </section>

          <section className="resume-section reference-section">
            <h2 className="section-title">Professional Reference</h2>
            <div className="reference-card">
              <div className="ref-header">
                <div>
                  <h3 className="job-title">Habibur Rahman</h3>
                  <span className="ref-badge">Professional Mentor &amp; Industry Trainer</span>
                </div>
              </div>
              <ul className="achievements" style={{ marginTop: '6px', marginBottom: '8px' }}>
                <li><strong>Trainer</strong> · BASIS BITM (PHP with Laravel Framework)</li>
                <li><strong>Head of IT Department</strong> · Sorejomin Barta</li>
              </ul>
              <div className="contact-row ref-modal-contacts">
                <a href="tel:+8801711805110">📞 +880 1711-805110</a>
                <a href="mailto:habib2498922@gmail.com">✉️ habib2498922@gmail.com</a>
                <a href="https://www.sorejominbarta.com" target="_blank" rel="noreferrer">
                  🌐 www.sorejominbarta.com ↗
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ResumeModal;
