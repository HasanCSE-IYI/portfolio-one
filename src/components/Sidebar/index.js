import { useState, useEffect } from 'react'
import {
  faGithub,
  faLinkedin,
  faSkype,
  faWhatsapp,
} from '@fortawesome/free-brands-svg-icons'
import {
  faClose,
  faEllipsisVertical,
  faEnvelope,
  faFileAlt,
  faHome,
  faPhone,
  faSuitcase,
  faUser,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link, NavLink, useLocation } from 'react-router-dom'
import LogoS from '../../assets/images/logo.svg'
import ResumeModal from '../ResumeModal'
import './index.scss'

const Sidebar = () => {
  const [isResumeOpen, setIsResumeOpen] = useState(false)
  const [showMoreMenu, setShowMoreMenu] = useState(false)
  const location = useLocation()

  // Close extra menu on route change
  useEffect(() => {
    setShowMoreMenu(false)
  }, [location.pathname])

  return (
    <>
      {/* Top Floating Glass Navbar (Desktop Floating Capsule & Mobile Slim Header) */}
      <header className="modern-navbar">
        <div className="navbar-container">
          {/* Brand Logo & Name */}
          <Link className="brand-logo" to="/">
            <div className="logo-icon-wrap">
              <img className="logo-img" src={LogoS} alt="Mahmud al Hasan" />
            </div>
            <div className="brand-text">
              <span className="brand-name">Mahmud al Hasan</span>
              <span className="brand-status">
                <span className="status-dot"></span>
                <span className="status-text">Available for hire</span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="desktop-nav" aria-label="Desktop Navigation">
            <NavLink
              end
              to="/"
              className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
            >
              <FontAwesomeIcon icon={faHome} className="nav-icon" />
              <span>Home</span>
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
            >
              <FontAwesomeIcon icon={faUser} className="nav-icon" />
              <span>About</span>
            </NavLink>
            <NavLink
              to="/resume"
              className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
            >
              <FontAwesomeIcon icon={faFileAlt} className="nav-icon" />
              <span>Resume</span>
            </NavLink>
            <NavLink
              to="/portfolio"
              className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
            >
              <FontAwesomeIcon icon={faSuitcase} className="nav-icon" />
              <span>Portfolio</span>
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
            >
              <FontAwesomeIcon icon={faEnvelope} className="nav-icon" />
              <span>Contact</span>
            </NavLink>
          </nav>

          {/* Actions: Socials + Resume / More */}
          <div className="nav-actions">
            <div className="social-links">
              <a
                href="https://github.com/HasanCSE-IYI"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub Profile"
                className="social-btn"
                title="GitHub"
              >
                <FontAwesomeIcon icon={faGithub} />
              </a>
              <a
                href="https://www.linkedin.com/in/mahmud-al-hasan/"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn Profile"
                className="social-btn"
                title="LinkedIn"
              >
                <FontAwesomeIcon icon={faLinkedin} />
              </a>
              <a
                href="https://wa.me/8801727328200"
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp: +880 1727 328200"
                className="social-btn whatsapp"
                title="WhatsApp"
              >
                <FontAwesomeIcon icon={faWhatsapp} />
              </a>
            </div>

            {/* Resume Button */}
            <button
              type="button"
              className="resume-pill-btn"
              onClick={() => setIsResumeOpen(true)}
              aria-label="View Resume"
            >
              <FontAwesomeIcon icon={faFileAlt} className="resume-icon" />
              <span>Resume</span>
            </button>

            {/* More Menu Toggle (Mobile) */}
            <button
              type="button"
              className={`more-toggle-btn ${showMoreMenu ? 'active' : ''}`}
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              aria-label="Quick Connect Options"
            >
              <FontAwesomeIcon icon={showMoreMenu ? faClose : faEllipsisVertical} />
            </button>
          </div>
        </div>

        {/* Mobile Dropdown for Extra Contact Links */}
        {showMoreMenu && (
          <>
            <div
              className="dropdown-backdrop"
              onClick={() => setShowMoreMenu(false)}
              aria-hidden="true"
            />
            <div className="mobile-more-dropdown">
              <div className="dropdown-header">
                <span>Quick Connect &amp; Channels</span>
                <button
                  type="button"
                  className="close-dropdown-btn"
                  onClick={() => setShowMoreMenu(false)}
                  aria-label="Close menu"
                >
                  ✕
                </button>
              </div>
              <div className="dropdown-links">
                <a
                  href="https://github.com/HasanCSE-IYI"
                  target="_blank"
                  rel="noreferrer"
                  className="dropdown-item"
                >
                  <FontAwesomeIcon icon={faGithub} />
                  <span>GitHub · /HasanCSE-IYI</span>
                </a>
                <a
                  href="https://www.linkedin.com/in/mahmud-al-hasan/"
                  target="_blank"
                  rel="noreferrer"
                  className="dropdown-item"
                >
                  <FontAwesomeIcon icon={faLinkedin} />
                  <span>LinkedIn · /mahmud-al-hasan</span>
                </a>
                <a
                  href="https://wa.me/8801727328200"
                  target="_blank"
                  rel="noreferrer"
                  className="dropdown-item"
                >
                  <FontAwesomeIcon icon={faWhatsapp} />
                  <span>WhatsApp · +880 1727 328200</span>
                </a>
                <a
                  href="tel:+8801727328200"
                  className="dropdown-item"
                >
                  <FontAwesomeIcon icon={faPhone} />
                  <span>Direct Call · +880 1727 328200</span>
                </a>
                <a
                  href="skype:live:rauaha_1"
                  target="_blank"
                  rel="noreferrer"
                  className="dropdown-item"
                >
                  <FontAwesomeIcon icon={faSkype} />
                  <span>Skype · live:rauaha_1</span>
                </a>
                <Link
                  to="/resume"
                  className="dropdown-item resume-item"
                  onClick={() => setShowMoreMenu(false)}
                >
                  <FontAwesomeIcon icon={faFileAlt} />
                  <span>View Full Executive Resume</span>
                </Link>
              </div>
            </div>
          </>
        )}
      </header>

      {/* Modern Floating Bottom Island Dock (Mobile & Tablet Thumb Zone Navigation) */}
      <nav className="mobile-bottom-dock" aria-label="Mobile Navigation">
        <NavLink
          end
          to="/"
          className={({ isActive }) => (isActive ? 'dock-item active' : 'dock-item')}
          aria-label="Home"
        >
          <FontAwesomeIcon icon={faHome} className="dock-icon" />
          <span className="dock-label">Home</span>
        </NavLink>
        <NavLink
          to="/about"
          className={({ isActive }) => (isActive ? 'dock-item active' : 'dock-item')}
          aria-label="About"
        >
          <FontAwesomeIcon icon={faUser} className="dock-icon" />
          <span className="dock-label">About</span>
        </NavLink>
        <NavLink
          to="/resume"
          className={({ isActive }) => (isActive ? 'dock-item active' : 'dock-item')}
          aria-label="Resume"
        >
          <FontAwesomeIcon icon={faFileAlt} className="dock-icon" />
          <span className="dock-label">Resume</span>
        </NavLink>
        <NavLink
          to="/portfolio"
          className={({ isActive }) => (isActive ? 'dock-item active' : 'dock-item')}
          aria-label="Portfolio"
        >
          <FontAwesomeIcon icon={faSuitcase} className="dock-icon" />
          <span className="dock-label">Works</span>
        </NavLink>
        <NavLink
          to="/contact"
          className={({ isActive }) => (isActive ? 'dock-item active' : 'dock-item')}
          aria-label="Contact"
        >
          <FontAwesomeIcon icon={faEnvelope} className="dock-icon" />
          <span className="dock-label">Contact</span>
        </NavLink>
      </nav>

      {/* Global Executive Resume Modal */}
      <ResumeModal
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
      />
    </>
  )
}

export default Sidebar
