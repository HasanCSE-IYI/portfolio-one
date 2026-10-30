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
import {
  RESUME_META,
  TECHNICAL_SKILLS,
  FEATURED_PROJECTS,
  WORK_EXPERIENCE,
  EDUCATION,
  LANGUAGES,
  ADDITIONAL_ACTIVITIES,
  REFERENCES,
  getPlainTextResume,
} from '../../data/resumeData';
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
    const plainTextResume = getPlainTextResume();

    const triggerSuccess = () => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(plainTextResume)
        .then(triggerSuccess)
        .catch(() => {
          try {
            const el = document.createElement('textarea');
            el.value = plainTextResume;
            el.style.position = 'fixed';
            el.style.opacity = '0';
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);
            triggerSuccess();
          } catch (e) {
            // ignore
          }
        });
    } else {
      try {
        const el = document.createElement('textarea');
        el.value = plainTextResume;
        el.style.position = 'fixed';
        el.style.opacity = '0';
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        triggerSuccess();
      } catch (e) {
        // ignore
      }
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
          <span className="doc-updated">Updated {RESUME_META.lastUpdated}</span>
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
                strArray={RESUME_META.name.split('')}
                idx={1}
              />
            </h1>
            <p className="headline">{RESUME_META.headline}</p>
          </div>

          <div className="contact-strip">
            <span className="strip-item">
              <FontAwesomeIcon icon={faMapMarkerAlt} className="strip-icon" />
              <span>{RESUME_META.location}</span>
            </span>
            <a href={`tel:${RESUME_META.phoneRaw}`} className="strip-item link">
              <FontAwesomeIcon icon={faPhone} className="strip-icon" />
              <span>{RESUME_META.phone}</span>
            </a>
            <a href={`mailto:${RESUME_META.email}`} className="strip-item link">
              <FontAwesomeIcon icon={faEnvelope} className="strip-icon" />
              <span>{RESUME_META.email}</span>
            </a>
            <a
              href={RESUME_META.linkedin}
              target="_blank"
              rel="noreferrer"
              className="strip-item link"
            >
              <FontAwesomeIcon icon={faLinkedin} className="strip-icon" />
              <span>LinkedIn</span>
            </a>
            <a
              href={RESUME_META.github}
              target="_blank"
              rel="noreferrer"
              className="strip-item link"
            >
              <FontAwesomeIcon icon={faGithub} className="strip-icon" />
              <span>GitHub</span>
            </a>
            <a
              href={RESUME_META.whatsapp}
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
            {TECHNICAL_SKILLS.map((skill, idx) => (
              <div className="skill-row" key={idx}>
                <span className="skill-label">{skill.category}:</span>
                <span className={`skill-values ${skill.highlight ? 'highlight' : ''}`}>
                  {skill.items}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Section: Featured Projects */}
        <section className="paper-section">
          <h2 className="section-title">
            <FontAwesomeIcon icon={faLayerGroup} className="section-icon" />
            <span>Featured Engineering Projects</span>
          </h2>

          {FEATURED_PROJECTS.map((proj, idx) => (
            <div className="experience-item project-item" key={idx}>
              <div className="item-header">
                <div className="item-title-col">
                  <div className="project-title-row">
                    <h3 className="job-title">{proj.title}</h3>
                    <span className="tech-badge">{proj.tech}</span>
                  </div>
                  <div className="company-subline">
                    <span className="company-name">{proj.subline}</span>
                  </div>
                </div>
                <div className="item-date-col">
                  <a
                    href={proj.url}
                    target="_blank"
                    rel="noreferrer"
                    className="date-badge project-link-badge"
                    aria-label={`View ${proj.title} source repository on GitHub`}
                  >
                    <FontAwesomeIcon icon={faGithub} className="cal-icon" />
                    <span>GitHub Repository ↗</span>
                  </a>
                </div>
              </div>
              <ul className="bullet-list">
                {proj.achievements.map((ach, aIdx) => (
                  <li key={aIdx}>{ach}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        {/* Section: Work Experience */}
        <section className="paper-section">
          <h2 className="section-title">
            <FontAwesomeIcon icon={faBriefcase} className="section-icon" />
            <span>Work Experience</span>
          </h2>

          {WORK_EXPERIENCE.map((job, idx) => (
            <div className="experience-item" key={idx}>
              <div className="item-header">
                <div className="item-title-col">
                  <h3 className="job-title">{job.role}</h3>
                  <div className="company-subline">
                    <span className="company-name">{job.company}</span>
                    {job.workType && <span className="work-type-badge">{job.workType}</span>}
                  </div>
                </div>
                <div className="item-date-col">
                  <span className="date-badge">
                    <FontAwesomeIcon icon={faCalendarAlt} className="cal-icon" />
                    <span>{job.period}</span>
                  </span>
                </div>
              </div>
              <ul className="bullet-list">
                {job.bullets.map((bullet, bIdx) => (
                  <li key={bIdx}>{bullet}</li>
                ))}
              </ul>
            </div>
          ))}
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
                <h3 className="job-title">{EDUCATION.degree}</h3>
                <div className="company-subline">
                  <span className="company-name">{EDUCATION.institution}</span>
                  <span className="location-tag">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="loc-icon" /> {EDUCATION.location}
                  </span>
                </div>
              </div>
              <div className="item-date-col">
                <span className="date-badge grad-badge">
                  <FontAwesomeIcon icon={faGraduationCap} className="cal-icon" />
                  <span>{EDUCATION.status}</span>
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
                {LANGUAGES.map((lang, lIdx) => (
                  <React.Fragment key={lIdx}>
                    <strong>{lang.name}</strong> ({lang.proficiency})
                    {lIdx < LANGUAGES.length - 1 ? ' · ' : ''}
                  </React.Fragment>
                ))}
              </p>
            </div>
            <div className="col-item">
              <h2 className="section-title">
                <FontAwesomeIcon icon={faCode} className="section-icon" />
                <span>Additional &amp; Training</span>
              </h2>
              <ul className="bullet-list">
                {ADDITIONAL_ACTIVITIES.map((act, aIdx) => (
                  <li key={aIdx}>{act}</li>
                ))}
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

          {REFERENCES.map((ref, idx) => (
            <div className="reference-card" key={idx}>
              <div className="ref-header">
                <div className="ref-name-wrap">
                  <h3 className="ref-name">{ref.name}</h3>
                  <span className="ref-role-pill">{ref.role}</span>
                </div>
              </div>
              <div className="ref-designations">
                {ref.designations.map((desig, dIdx) => (
                  <div className="designation-item" key={dIdx}>
                    <span className="bullet-dot">▪</span>
                    <span>
                      <strong>{desig.role}</strong> · {desig.org}
                    </span>
                  </div>
                ))}
              </div>
              <div className="ref-contact-row">
                <a href={`tel:${ref.phoneRaw}`} className="ref-contact-link">
                  <FontAwesomeIcon icon={faPhone} className="ref-icon" />
                  <span>{ref.phone}</span>
                </a>
                <a href={`mailto:${ref.email}`} className="ref-contact-link">
                  <FontAwesomeIcon icon={faEnvelope} className="ref-icon" />
                  <span>{ref.email}</span>
                </a>
                {ref.web && (
                  <a
                    href={ref.webUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="ref-contact-link"
                  >
                    <FontAwesomeIcon icon={faGlobe} className="ref-icon" />
                    <span>{ref.web} ↗</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </section>

        {/* Bottom Fast Action Bar (Screen Only) */}
        <div className="resume-bottom-cta screen-only">
          <div className="bottom-cta-inner">
            <div className="bottom-cta-text">
              <h4>Ready to collaborate?</h4>
              <p>Download a verified copy or reach out directly for backend &amp; .NET roles.</p>
            </div>
            <div className="bottom-cta-actions">
              <button
                type="button"
                className="action-btn print-btn"
                onClick={handlePrint}
                aria-label="Print document"
              >
                <FontAwesomeIcon icon={faPrint} />
                <span>Print / Save PDF</span>
              </button>
              <button
                type="button"
                className="action-btn copy-btn"
                onClick={handleCopyText}
                aria-label="Copy resume text"
              >
                <FontAwesomeIcon icon={copied ? faCheck : faCopy} />
                <span>{copied ? 'Copied!' : 'Copy Plain Text'}</span>
              </button>
              <Link to="/contact" className="action-btn contact-btn">
                <FontAwesomeIcon icon={faEnvelope} />
                <span>Get in Touch</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Executive Document Print Footer (Rendered in A4 Print & PDF Output) */}
        <footer className="resume-print-footer" aria-hidden="true">
          <div className="print-footer-line">
            <span className="doc-id">Curriculum Vitae · {RESUME_META.name}</span>
            <span className="doc-role">{RESUME_META.headline}</span>
            <span className="doc-loc">{RESUME_META.location}</span>
            <span className="doc-url">{RESUME_META.website}</span>
          </div>
        </footer>
      </article>
    </div>
  );
};

export default Resume;
