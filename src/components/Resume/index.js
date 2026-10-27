import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPrint,
  faCopy,
  faCheck,
  faEnvelope,
  faBriefcase,
  faGraduationCap,
  faCode,
  faGlobe,
  faLayerGroup,
  faCalendarAlt,
  faMapMarkerAlt,
  faPhone,
  faUserTie,
} from '@fortawesome/free-solid-svg-icons';
import {
  faGithub,
  faLinkedin,
  faWhatsapp,
} from '@fortawesome/free-brands-svg-icons';
import AnimatedLetters from '../AnimatedLetters';
import './index.scss';

const Resume = () => {
  const [copied, setCopied] = useState(false);

  const handlePrint = () => {
    const originalTitle = document.title;
    document.title = 'Mahmud_Al_Hasan_CV_Backend_Software_Engineer';
    document.body.classList.remove('resume-modal-open');
    window.print();
    setTimeout(() => {
      document.title = originalTitle;
    }, 1500);
  };

  const handleCopyText = () => {
    const plainTextResume = `MAHMUD AL HASAN
Software Engineer (.NET / Backend)
Bayazid, Chattogram, Bangladesh
+880 1727 328200 | mahmud.csem@gmail.com
LinkedIn: https://www.linkedin.com/in/mahmud-al-hasan | GitHub: https://github.com/HasanCSE-IYI

PROFESSIONAL SUMMARY
Backend-focused Software Engineer with 8+ years of experience building and deploying REST APIs and web applications with Laravel, NestJS, and Node.js, including leading backend architecture for a telemedicine startup. Experienced with AWS, MySQL, MongoDB, and Linux-based deployment. Now focused on the .NET ecosystem (C#, ASP.NET Core, Entity Framework Core) through hands-on API projects.

TECHNICAL SKILLS
- .NET: C#, ASP.NET Core Web API, Entity Framework Core (Code First, migrations), JWT authentication, REST
- Learning: xUnit, SQL Server, Azure, Docker
- Backend: Laravel (PHP), NestJS, Node.js, RESTful API design
- Databases: MySQL, MongoDB, SQLite
- Cloud & Systems: AWS, Linux, Git
- Data & Automation: Python, Scrapy, Celery, Redis
- Frontend: TypeScript, Next.js, React

WORK EXPERIENCE
1. IT Operations & Web Systems Engineer | EXONEXT & SourcingPi (Feb 2025 – Present | Hybrid)
   - Administer IT infrastructure, network configuration, and system security for hybrid business operations.
   - Maintain and deploy updates for company websites, improving loading performance and responsiveness.
   - Produce technical documentation and user guides for internal workflows.

2. Front-End Support & Content Developer | Independent Contractor (Feb 2025 – Aug 2026 | Remote)
   - Monitored, tested, and fixed web platform defects, reducing recurring errors and downtime.
   - Handled UI responsiveness fixes and content updates.

3. Software Engineer | iGOT AI (Feb 2024 – Aug 2024)
   - Developed core modules of a no-code virtual employee platform and AI chatbot solutions.
   - Built node-based workflow interfaces with ReactFlow, Next.js, and TypeScript.
   - Created reusable, accessible UI components with Shadcn UI.

4. Software Engineer | BeWeddy and BlessUp AI (Feb 2022 – Dec 2023)
   - Developed and maintained features and modules using NestJS, MongoDB, and Next.js/React.
   - Built and consumed RESTful APIs with JWT authentication using modular, dependency-injection architecture.
   - Managed deployment and DevOps on AWS (EC2, S3), reducing release cycles.
   - Provided production support: fixed critical bugs and handled system incidents.

5. Software Engineer (Ex-Co-Founder) | Doctor Dekhao (Startup) (Jun 2019 – Sep 2021)
   - Co-founded a telemedicine startup and led backend architecture for a 4-member engineering team.
   - Designed, deployed, and maintained RESTful APIs (Laravel, MySQL) serving mobile applications for real-time patient-doctor consultations.
   - Modeled database schema and optimized queries and API payloads, dramatically improving response times.
   - Worked with mobile engineers to define API contracts for real-time doctor-patient interactions.
   - Deployed and maintained backend infrastructure on cloud servers.

6. Software Engineer (R&D) | DataShall Analytics Ltd. (Sep 2018 – May 2019)
   - Contributed to "Shuni Live", an AI-powered social listening and sentiment analytics platform.
   - Integrated the Facebook Graph API for automated timeline data extraction and keyword discovery.
   - Built data scraping and task queues with Python, Scrapy, Celery, and Redis.
   - Built the business module for "Shuni 02", enabling client retargeting based on negative sentiment analysis.

7. Mobile Application Developer | Talha Soft (Apr 2018 – Aug 2018)
   - Built cross-platform mobile app prototypes with Python and Kivy.
   - Managed version control with SVN and configured Linux-based Android builds with Buildozer.

EDUCATION
B.Sc. in Computer Science and Engineering
Bangladesh University of Business and Technology

LANGUAGES
Bangla (Native / Fluent), English (Professional)

ADDITIONAL
Firefox Student Ambassador (volunteer); PHP with Laravel training, BASIS BITM; intra-university programming contests.

PROFESSIONAL REFERENCES
1. Habibur Rahman
Trainer | BASIS BITM (PHP with Laravel Framework)
Head of IT Department | Sorejomin Barta
www.sorejominbarta.com
Phone: +880 1711-805110 | Email: habib2498922@gmail.com

2. IFTEKHAR UDDIN MD. TANVIR
MSc in Computer Science, MBA
Head of IT (Ex) | Island Securities Ltd.
Phone: +880 1919-316231 | Email: eng.iftekhar@gmail.com`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(plainTextResume).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2200);
      });
    }
  };

  return (
    <div className="container resume-page">
      {/* Resume Top Control Bar (Screen Only) */}
      <div className="resume-controls-bar">
        <div className="controls-left">
          <span className="doc-pill">
            <span className="dot green"></span>
            Official Curriculum Vitae
          </span>
          <span className="doc-updated">Updated October 2026</span>
        </div>
        <div className="controls-right">
          <button
            type="button"
            className="action-btn copy-btn"
            onClick={handleCopyText}
            aria-label="Copy plain text resume"
          >
            <FontAwesomeIcon icon={copied ? faCheck : faCopy} />
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Plain Text'}</span>
          </button>
          <button
            type="button"
            className="action-btn print-btn"
            onClick={handlePrint}
            aria-label="Print or Save PDF"
          >
            <FontAwesomeIcon icon={faPrint} />
            <span>Print / Save PDF</span>
          </button>
          <Link to="/contact" className="action-btn contact-btn">
            <FontAwesomeIcon icon={faEnvelope} />
            <span>Contact Me</span>
          </Link>
        </div>
      </div>

      {/* Main Resume Paper / Document Card */}
      <article className="resume-paper" id="printable-resume">
        {/* Document Header */}
        <header className="paper-header">
          <div className="name-title-zone">
            <h1 className="full-name">
              <AnimatedLetters
                letterClass="text-animate-hover"
                strArray={'Mahmud al Hasan'.split('')}
                idx={1}
              />
            </h1>
            <p className="headline">
              Software Engineer (.NET / Backend) · 8+ Years Production Experience
            </p>
          </div>

          <div className="contact-strip">
            <span className="strip-item">
              <FontAwesomeIcon icon={faMapMarkerAlt} className="strip-icon" />
              <span>Bayazid, Chattogram, Bangladesh</span>
            </span>
            <a href="tel:+8801727328200" className="strip-item link">
              <FontAwesomeIcon icon={faPhone} className="strip-icon" />
              <span>+880 1727-328200</span>
            </a>
            <a href="mailto:mahmud.csem@gmail.com" className="strip-item link">
              <FontAwesomeIcon icon={faEnvelope} className="strip-icon" />
              <span>mahmud.csem@gmail.com</span>
            </a>
            <a
              href="https://www.linkedin.com/in/mahmud-al-hasan/"
              target="_blank"
              rel="noreferrer"
              className="strip-item link"
            >
              <FontAwesomeIcon icon={faLinkedin} className="strip-icon" />
              <span>LinkedIn</span>
            </a>
            <a
              href="https://github.com/HasanCSE-IYI"
              target="_blank"
              rel="noreferrer"
              className="strip-item link"
            >
              <FontAwesomeIcon icon={faGithub} className="strip-icon" />
              <span>GitHub</span>
            </a>
            <a
              href="https://wa.me/8801727328200"
              target="_blank"
              rel="noreferrer"
              className="strip-item link whatsapp"
            >
              <FontAwesomeIcon icon={faWhatsapp} className="strip-icon" />
              <span>WhatsApp</span>
            </a>
          </div>
        </header>

        {/* Section: Professional Summary */}
        <section className="paper-section">
          <h2 className="section-title">
            <FontAwesomeIcon icon={faBriefcase} className="section-icon" />
            <span>Professional Summary</span>
          </h2>
          <p className="summary-body">
            Backend-focused Software Engineer with <strong>8+ years of experience</strong> building and deploying robust REST APIs and web applications with <strong>Laravel, NestJS, and Node.js</strong>, including leading backend architecture for a telemedicine startup (<strong>Doctor Dekhao</strong>). Experienced with <strong>AWS (EC2, S3), MySQL, MongoDB, and Linux-based deployments</strong>. Actively focused on expanding into the modern <strong>.NET ecosystem (C#, ASP.NET Core, Entity Framework Core)</strong> through hands-on architectural API projects.
          </p>
        </section>

        {/* Section: Technical Skills */}
        <section className="paper-section">
          <h2 className="section-title">
            <FontAwesomeIcon icon={faCode} className="section-icon" />
            <span>Technical Skills</span>
          </h2>
          <div className="skills-grid">
            <div className="skill-row">
              <span className="skill-label">.NET &amp; C#:</span>
              <span className="skill-values">
                C#, ASP.NET Core Web API, Entity Framework Core (Code First, migrations), LINQ, JWT authentication, RESTful APIs
              </span>
            </div>
            <div className="skill-row">
              <span className="skill-label">Learning / Active Expansion:</span>
              <span className="skill-values highlight">
                xUnit, SQL Server, Microsoft Azure, Docker Containerization
              </span>
            </div>
            <div className="skill-row">
              <span className="skill-label">Backend Foundation:</span>
              <span className="skill-values">
                Laravel (PHP), NestJS, Node.js, Express, RESTful API Design, Microservices, Clean Architecture
              </span>
            </div>
            <div className="skill-row">
              <span className="skill-label">Databases &amp; Caching:</span>
              <span className="skill-values">
                MySQL, MongoDB, SQLite, PostgreSQL, Redis Task Queues
              </span>
            </div>
            <div className="skill-row">
              <span className="skill-label">Cloud &amp; Systems:</span>
              <span className="skill-values">
                AWS (EC2, S3, RDS), Linux (Ubuntu), Git, GitHub Actions CI/CD
              </span>
            </div>
            <div className="skill-row">
              <span className="skill-label">Data &amp; Automation:</span>
              <span className="skill-values">
                Python, Scrapy, Celery, Redis Queues
              </span>
            </div>
            <div className="skill-row">
              <span className="skill-label">Frontend &amp; UI:</span>
              <span className="skill-values">
                TypeScript, Next.js, React, ReactFlow, Shadcn UI
              </span>
            </div>
          </div>
        </section>

        {/* Section: Featured Projects */}
        <section className="paper-section">
          <h2 className="section-title">
            <FontAwesomeIcon icon={faLayerGroup} className="section-icon" />
            <span>Featured Engineering Projects</span>
          </h2>

          <div className="experience-item project-item">
            <div className="item-header">
              <div className="item-title-col">
                <div className="project-title-row">
                  <h3 className="job-title">Store API</h3>
                  <span className="tech-badge">ASP.NET Core · EF Core · SQLite · JWT</span>
                </div>
                <div className="company-subline">
                  <span className="company-name">RESTful Product Inventory API &amp; Architecture</span>
                </div>
              </div>
              <div className="item-date-col">
                <a
                  href="https://github.com/HasanCSE-IYI/StoreApi"
                  target="_blank"
                  rel="noreferrer"
                  className="date-badge project-link-badge"
                  aria-label="View StoreApi source repository on GitHub"
                >
                  <FontAwesomeIcon icon={faGithub} className="cal-icon" />
                  <span>GitHub Repository ↗</span>
                </a>
              </div>
            </div>
            <ul className="bullet-list">
              <li>
                Built a production-style RESTful product inventory API with JWT authentication and role-based authorization (User/Admin).
              </li>
              <li>
                Implemented multi-parameter search, category filtering, pagination, and EF Core Code First migrations.
              </li>
              <li>
                Structured the codebase in Controller–Service–Repository layers with custom error-handling middleware.
              </li>
            </ul>
          </div>
        </section>

        {/* Section: Work Experience */}
        <section className="paper-section">
          <h2 className="section-title">
            <FontAwesomeIcon icon={faBriefcase} className="section-icon" />
            <span>Work Experience</span>
          </h2>

          {/* 1. EXONEXT & SourcingPi */}
          <div className="experience-item">
            <div className="item-header">
              <div className="item-title-col">
                <h3 className="job-title">IT Operations &amp; Web Systems Engineer</h3>
                <div className="company-subline">
                  <span className="company-name">EXONEXT &amp; SourcingPi</span>
                  <span className="work-type-badge">Hybrid</span>
                </div>
              </div>
              <div className="item-date-col">
                <span className="date-badge">
                  <FontAwesomeIcon icon={faCalendarAlt} className="cal-icon" />
                  <span>Feb 2025 – Present</span>
                </span>
              </div>
            </div>
            <ul className="bullet-list">
              <li>Administer IT infrastructure, network configuration, and system security for hybrid business operations.</li>
              <li>Maintain and deploy updates for company websites, improving loading performance and responsiveness.</li>
              <li>Produce technical documentation and user guides for internal workflows.</li>
            </ul>
          </div>

          {/* 2. Independent Contractor */}
          <div className="experience-item">
            <div className="item-header">
              <div className="item-title-col">
                <h3 className="job-title">Front-End Support &amp; Content Developer</h3>
                <div className="company-subline">
                  <span className="company-name">Independent Contractor</span>
                  <span className="work-type-badge">Remote</span>
                </div>
              </div>
              <div className="item-date-col">
                <span className="date-badge">
                  <FontAwesomeIcon icon={faCalendarAlt} className="cal-icon" />
                  <span>Feb 2025 – Aug 2026</span>
                </span>
              </div>
            </div>
            <ul className="bullet-list">
              <li>Monitored, tested, and resolved web platform defects, reducing recurring errors and downtime.</li>
              <li>Handled UI responsiveness fixes, cross-browser compatibility, and content updates.</li>
            </ul>
          </div>

          {/* 3. iGOT AI */}
          <div className="experience-item">
            <div className="item-header">
              <div className="item-title-col">
                <h3 className="job-title">Software Engineer</h3>
                <div className="company-subline">
                  <span className="company-name">iGOT AI</span>
                </div>
              </div>
              <div className="item-date-col">
                <span className="date-badge">
                  <FontAwesomeIcon icon={faCalendarAlt} className="cal-icon" />
                  <span>Feb 2024 – Aug 2024</span>
                </span>
              </div>
            </div>
            <ul className="bullet-list">
              <li>Developed core modules of a no-code virtual employee platform and AI chatbot solutions.</li>
              <li>Built node-based workflow interfaces with ReactFlow, Next.js, and TypeScript.</li>
              <li>Created reusable, accessible UI components with Shadcn UI.</li>
            </ul>
          </div>

          {/* 4. BeWeddy and BlessUp AI */}
          <div className="experience-item">
            <div className="item-header">
              <div className="item-title-col">
                <h3 className="job-title">Software Engineer</h3>
                <div className="company-subline">
                  <span className="company-name">BeWeddy &amp; BlessUp AI</span>
                </div>
              </div>
              <div className="item-date-col">
                <span className="date-badge">
                  <FontAwesomeIcon icon={faCalendarAlt} className="cal-icon" />
                  <span>Feb 2022 – Dec 2023</span>
                </span>
              </div>
            </div>
            <ul className="bullet-list">
              <li>Developed and maintained features and modules using NestJS, MongoDB, and Next.js/React.</li>
              <li>Built and consumed RESTful APIs with JWT authentication, using a modular, dependency-injection-based architecture.</li>
              <li>Managed deployment and DevOps on AWS (EC2, S3), reducing release cycle times.</li>
              <li>Provided production support, resolving critical bugs and handling system incidents.</li>
            </ul>
          </div>

          {/* 5. Doctor Dekhao */}
          <div className="experience-item">
            <div className="item-header">
              <div className="item-title-col">
                <h3 className="job-title">Software Engineer (Ex-Co-Founder)</h3>
                <div className="company-subline">
                  <span className="company-name">Doctor Dekhao (Telemedicine Startup)</span>
                </div>
              </div>
              <div className="item-date-col">
                <span className="date-badge">
                  <FontAwesomeIcon icon={faCalendarAlt} className="cal-icon" />
                  <span>Jun 2019 – Sep 2021</span>
                </span>
              </div>
            </div>
            <ul className="bullet-list">
              <li>Co-founded a telemedicine startup and led backend architecture for a 4-member software engineering team.</li>
              <li>Designed, deployed, and maintained RESTful APIs (Laravel, MySQL) serving mobile applications for real-time patient-doctor consultations.</li>
              <li>Modeled database schemas and optimized relational queries and API payloads, dramatically improving response times.</li>
              <li>Worked closely with mobile engineers to establish API contracts for real-time doctor-patient interactions.</li>
              <li>Deployed and maintained the backend infrastructure on cloud servers.</li>
            </ul>
          </div>

          {/* 6. DataShall Analytics Ltd. */}
          <div className="experience-item">
            <div className="item-header">
              <div className="item-title-col">
                <h3 className="job-title">Software Engineer (R&amp;D)</h3>
                <div className="company-subline">
                  <span className="company-name">DataShall Analytics Ltd.</span>
                </div>
              </div>
              <div className="item-date-col">
                <span className="date-badge">
                  <FontAwesomeIcon icon={faCalendarAlt} className="cal-icon" />
                  <span>Sep 2018 – May 2019</span>
                </span>
              </div>
            </div>
            <ul className="bullet-list">
              <li>Contributed to &quot;Shuni Live&quot;, an AI-powered social listening and sentiment analytics platform.</li>
              <li>Integrated the Facebook Graph API for automated timeline data extraction and keyword discovery.</li>
              <li>Built data scraping pipelines and background task queues with Python, Scrapy, Celery, and Redis.</li>
              <li>Built the business analytics module for &quot;Shuni 02&quot;, enabling client retargeting based on negative sentiment analysis.</li>
            </ul>
          </div>

          {/* 7. Talha Soft */}
          <div className="experience-item">
            <div className="item-header">
              <div className="item-title-col">
                <h3 className="job-title">Mobile Application Developer</h3>
                <div className="company-subline">
                  <span className="company-name">Talha Soft</span>
                </div>
              </div>
              <div className="item-date-col">
                <span className="date-badge">
                  <FontAwesomeIcon icon={faCalendarAlt} className="cal-icon" />
                  <span>Apr 2018 – Aug 2018</span>
                </span>
              </div>
            </div>
            <ul className="bullet-list">
              <li>Built cross-platform mobile app prototypes with Python and Kivy.</li>
              <li>Managed version control with SVN and configured Linux-based Android builds with Buildozer.</li>
            </ul>
          </div>
        </section>

        {/* Section: Education */}
        <section className="paper-section">
          <h2 className="section-title">
            <FontAwesomeIcon icon={faGraduationCap} className="section-icon" />
            <span>Education</span>
          </h2>
          <div className="experience-item education-item">
            <div className="item-header">
              <div className="item-title-col">
                <h3 className="job-title">B.Sc. in Computer Science and Engineering (CSE)</h3>
                <div className="company-subline">
                  <span className="company-name">
                    Bangladesh University of Business and Technology
                  </span>
                  <span className="location-tag">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="loc-icon" /> Dhaka, Bangladesh
                  </span>
                </div>
              </div>
              <div className="item-date-col">
                <span className="date-badge grad-badge">
                  <FontAwesomeIcon icon={faGraduationCap} className="cal-icon" />
                  <span>Graduated</span>
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Section: Languages & Additional */}
        <section className="paper-section">
          <div className="two-col-grid">
            <div className="col-item">
              <h2 className="section-title">
                <FontAwesomeIcon icon={faGlobe} className="section-icon" />
                <span>Languages</span>
              </h2>
              <p className="summary-body">
                <strong>Bangla</strong> (Native / Fluent) · <strong>English</strong> (Professional Working Proficiency)
              </p>
            </div>
            <div className="col-item">
              <h2 className="section-title">
                <FontAwesomeIcon icon={faCode} className="section-icon" />
                <span>Additional &amp; Training</span>
              </h2>
              <ul className="bullet-list">
                <li>Firefox Student Ambassador (Volunteer)</li>
                <li>Professional PHP with Laravel Training · BASIS BITM</li>
                <li>Intra-University Programming Contests Participant</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section: Professional References */}
        <section className="paper-section reference-section">
          <h2 className="section-title">
            <FontAwesomeIcon icon={faUserTie} className="section-icon" />
            <span>Professional References</span>
          </h2>
          <div className="reference-card">
            <div className="ref-header">
              <div className="ref-name-wrap">
                <h3 className="ref-name">Habibur Rahman</h3>
                <span className="ref-role-pill">Professional Mentor &amp; Industry Trainer</span>
              </div>
            </div>
            <div className="ref-designations">
              <div className="designation-item">
                <span className="bullet-dot">▪</span>
                <span>
                  <strong>Trainer</strong> · BASIS BITM (PHP with Laravel Framework)
                </span>
              </div>
              <div className="designation-item">
                <span className="bullet-dot">▪</span>
                <span>
                  <strong>Head of IT Department</strong> · Sorejomin Barta
                </span>
              </div>
            </div>
            <div className="ref-contact-row">
              <a href="tel:+8801711805110" className="ref-contact-link">
                <FontAwesomeIcon icon={faPhone} className="ref-icon" />
                <span>+880 1711-805110</span>
              </a>
              <a href="mailto:habib2498922@gmail.com" className="ref-contact-link">
                <FontAwesomeIcon icon={faEnvelope} className="ref-icon" />
                <span>habib2498922@gmail.com</span>
              </a>
              <a
                href="https://www.sorejominbarta.com"
                target="_blank"
                rel="noreferrer"
                className="ref-contact-link"
              >
                <FontAwesomeIcon icon={faGlobe} className="ref-icon" />
                <span>www.sorejominbarta.com ↗</span>
              </a>
            </div>
          </div>

          <div className="reference-card">
            <div className="ref-header">
              <div className="ref-name-wrap">
                <h3 className="ref-name">IFTEKHAR UDDIN MD. TANVIR</h3>
                <span className="ref-role-pill">MSc in Computer Science, MBA</span>
              </div>
            </div>
            <div className="ref-designations">
              <div className="designation-item">
                <span className="bullet-dot">▪</span>
                <span>
                  <strong>Head of IT (Ex)</strong> · Island Securities Ltd.
                </span>
              </div>
            </div>
            <div className="ref-contact-row">
              <a href="tel:+8801919316231" className="ref-contact-link">
                <FontAwesomeIcon icon={faPhone} className="ref-icon" />
                <span>+880 1919-316231</span>
              </a>
              <a href="mailto:eng.iftekhar@gmail.com" className="ref-contact-link">
                <FontAwesomeIcon icon={faEnvelope} className="ref-icon" />
                <span>eng.iftekhar@gmail.com</span>
              </a>
            </div>
          </div>
        </section>

        {/* Executive Document Print Footer (Rendered in A4 Print & PDF Output) */}
        <footer className="resume-print-footer" aria-hidden="true">
          <div className="print-footer-line">
            <span className="doc-id">Curriculum Vitae · Mahmud al Hasan</span>
            <span className="doc-role">Software Engineer (.NET / Backend)</span>
            <span className="doc-loc">Bayazid, Chattogram, Bangladesh</span>
            <span className="doc-url">https://hasancse-iyi.github.io/portfolio-one/</span>
          </div>
        </footer>
      </article>
    </div>
  );
};

export default Resume;
