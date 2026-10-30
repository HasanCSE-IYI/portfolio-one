import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMapMarkerAlt,
  faPhone,
  faEnvelope,
  faPrint,
  faGlobe,
} from '@fortawesome/free-solid-svg-icons';
import {
  faGithub,
  faLinkedin,
  faWhatsapp,
} from '@fortawesome/free-brands-svg-icons';
import {
  RESUME_META,
  PROFESSIONAL_SUMMARY,
  TECHNICAL_SKILLS,
  FEATURED_PROJECTS,
  WORK_EXPERIENCE,
  EDUCATION,
  LANGUAGES,
  ADDITIONAL_ACTIVITIES,
  REFERENCES,
} from '../../data/resumeData';
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
    const originalTitle = document.title;
    document.title = 'Mahmud_Al_Hasan_CV_Backend_Software_Engineer';
    document.body.classList.add('resume-modal-open');
    window.print();
    setTimeout(() => {
      document.title = originalTitle;
    }, 1500);
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
            <span className="title-text">Curriculum Vitae · {RESUME_META.name}</span>
          </div>
          <div className="modal-actions">
            <Link to="/resume" className="full-page-link" onClick={onClose}>
              ↗ Open Full Page
            </Link>
            <button className="print-btn" onClick={handlePrint}>
              <FontAwesomeIcon icon={faPrint} /> Print / Save PDF
            </button>
            <button className="close-btn" onClick={onClose} aria-label="Close modal">
              ✕
            </button>
          </div>
        </div>

        <div className="resume-sheet">
          <header className="resume-header">
            <h1 className="name">{RESUME_META.name}</h1>
            <p className="headline">{RESUME_META.headline}</p>
            <div className="contact-row">
              <span>
                <FontAwesomeIcon icon={faMapMarkerAlt} className="contact-icon" /> {RESUME_META.location}
              </span>
              <a href={`tel:${RESUME_META.phoneRaw}`}>
                <FontAwesomeIcon icon={faPhone} className="contact-icon" /> {RESUME_META.phone}
              </a>
              <a href={`mailto:${RESUME_META.email}`}>
                <FontAwesomeIcon icon={faEnvelope} className="contact-icon" /> {RESUME_META.email}
              </a>
              <a
                href={RESUME_META.linkedin}
                target="_blank"
                rel="noreferrer"
              >
                <FontAwesomeIcon icon={faLinkedin} className="contact-icon" /> LinkedIn
              </a>
              <a
                href={RESUME_META.github}
                target="_blank"
                rel="noreferrer"
              >
                <FontAwesomeIcon icon={faGithub} className="contact-icon" /> GitHub
              </a>
              <a
                href={RESUME_META.whatsapp}
                target="_blank"
                rel="noreferrer"
              >
                <FontAwesomeIcon icon={faWhatsapp} className="contact-icon" /> WhatsApp
              </a>
            </div>
          </header>

          <section className="resume-section">
            <h2 className="section-title">Professional Summary</h2>
            <p className="summary-text">{PROFESSIONAL_SUMMARY}</p>
          </section>

          <section className="resume-section">
            <h2 className="section-title">Technical Skills</h2>
            <div className="skills-grid">
              {TECHNICAL_SKILLS.map((skill, idx) => (
                <div className="skill-cat" key={idx}>
                  <span className="cat-title">{skill.category}:</span>
                  <span className={`cat-items ${skill.highlight ? 'highlight' : ''}`}>
                    {skill.items}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="resume-section">
            <h2 className="section-title">Featured Projects</h2>
            {FEATURED_PROJECTS.map((proj, idx) => (
              <div className="job-entry" key={idx}>
                <div className="job-header">
                  <div>
                    <h3 className="job-title">{proj.title}</h3>
                    <span className="company">{proj.tech}</span>
                  </div>
                  <a
                    href={proj.url}
                    target="_blank"
                    rel="noreferrer"
                    className="period"
                  >
                    github.com/HasanCSE-IYI/{proj.title} ↗
                  </a>
                </div>
                <ul className="achievements">
                  {proj.achievements.map((ach, aIdx) => (
                    <li key={aIdx}>{ach}</li>
                  ))}
                </ul>
              </div>
            ))}
          </section>

          <section className="resume-section">
            <h2 className="section-title">Work Experience</h2>
            {WORK_EXPERIENCE.map((job, idx) => (
              <div className="job-entry" key={idx}>
                <div className="job-header">
                  <div>
                    <h3 className="job-title">{job.role}</h3>
                    <span className="company">
                      {job.company}
                      {job.workType && ` (${job.workType})`}
                    </span>
                  </div>
                  <span className="period">{job.period}</span>
                </div>
                <ul className="achievements">
                  {job.bullets.map((b, bIdx) => (
                    <li key={bIdx}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </section>

          <section className="resume-section">
            <h2 className="section-title">Education</h2>
            <div className="job-entry">
              <div className="job-header">
                <div>
                  <h3 className="job-title">{EDUCATION.degree}</h3>
                  <span className="company">{EDUCATION.institution}</span>
                </div>
                <span className="period">{EDUCATION.status}</span>
              </div>
            </div>
          </section>

          <section className="resume-section">
            <h2 className="section-title">Languages &amp; Additional</h2>
            <p className="summary-text">
              <strong>Languages:</strong>{' '}
              {LANGUAGES.map((l, lIdx) => (
                <span key={lIdx}>
                  {l.name} ({l.proficiency})
                  {lIdx < LANGUAGES.length - 1 ? ', ' : ''}
                </span>
              ))}
              <br />
              <strong>Activities &amp; Training:</strong> {ADDITIONAL_ACTIVITIES.join('; ')}.
            </p>
          </section>

          <section className="resume-section references-section">
            <h2 className="section-title">Professional References</h2>
            <div className="references-grid">
              {REFERENCES.map((ref, idx) => (
                <div className="ref-card" key={idx}>
                  <div className="ref-name">{ref.name}</div>
                  <div className="ref-title">{ref.role}</div>
                  {ref.designations.map((d, dIdx) => (
                    <div className="ref-dept" key={dIdx}>
                      {d.role} · {d.org}
                    </div>
                  ))}
                  {ref.web && (
                    <div className="ref-web">
                      <a href={ref.webUrl} target="_blank" rel="noreferrer">
                        <FontAwesomeIcon icon={faGlobe} /> {ref.web}
                      </a>
                    </div>
                  )}
                  <div className="ref-contact">
                    <a href={`tel:${ref.phoneRaw}`}>
                      <FontAwesomeIcon icon={faPhone} /> {ref.phone}
                    </a>
                    <a href={`mailto:${ref.email}`}>
                      <FontAwesomeIcon icon={faEnvelope} /> {ref.email}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ResumeModal;
