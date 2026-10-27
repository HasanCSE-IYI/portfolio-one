import { useState, useEffect } from 'react'
import {
  faGithub,
  faLinkedin,
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
  faSearch,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link, NavLink, useLocation } from 'react-router-dom'
import LogoS from '../../assets/images/logo.svg'
import ResumeModal from '../ResumeModal'
import CommandPalette from '../CommandPalette'
import './index.scss'

const Sidebar = () => {
  const [isResumeOpen, setIsResumeOpen] = useState(false)
  const [isPaletteOpen, setIsPaletteOpen] = useState(false)
  const [showMoreMenu, setShowMoreMenu] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMac, setIsMac] = useState(true)
  const location = useLocation()

  // Detect client platform for Spotlight shortcut badge (⌘K vs Ctrl K)
  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      const isApple = /Mac|iPod|iPhone|iPad/i.test(navigator.userAgent || navigator.platform || '')
      setIsMac(isApple)
    }
  }, [])

  // Track window scroll for dynamic glass depth
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 16)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Global keyboard shortcut: Cmd+K / Ctrl+K to toggle Command Palette
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setIsPaletteOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Close extra menu on route change
  useEffect(() => {
    setShowMoreMenu(false)
  }, [location.pathname])

  return (
    <>
      {/* Top Floating Glass Navbar (Desktop Floating Capsule & Mobile Slim Header) */}
      <header className={`modern-navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="navbar-container">
          {/* Brand Logo & Live Availability Status Capsule */}
          <div className="brand-zone">
            <Link className="brand-logo" to="/" aria-label="Home · Mahmud al Hasan">
              <div className="logo-icon-wrap">
                <img className="logo-img" src={LogoS} alt="Mahmud al Hasan Logo" />
              </div>
            </Link>

            <Link
              to="/contact"
              className="status-hire-capsule"
              aria-label="Available for hire · Click to open contact"
              title="Open to backend & .NET engineering opportunities · Click to get in touch"
            >
              <span className="beacon-indicator">
                <span className="beacon-ping"></span>
                <span className="beacon-dot"></span>
              </span>
              <span className="status-text">Available for hire</span>
            </Link>
          </div>

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

            {/* Quick Spotlight Trigger */}
            <button
              type="button"
              className="spotlight-quick-btn"
              onClick={() => setIsPaletteOpen(true)}
              aria-label="Open Command Search (Cmd+K / Ctrl+K)"
              title="Quick Search commands, pages & actions (⌘K / Ctrl+K)"
            >
              <FontAwesomeIcon icon={faSearch} className="spotlight-icon" />
              <span className="spotlight-kbd">{isMac ? '⌘K' : 'Ctrl K'}</span>
            </button>

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
                <button
                  type="button"
                  className="dropdown-item spotlight-item"
                  onClick={() => {
                    setShowMoreMenu(false)
                    setIsPaletteOpen(true)
                  }}
                >
                  <FontAwesomeIcon icon={faSearch} />
                  <span>Spotlight Search · {isMac ? '⌘K' : 'Ctrl K'}</span>
                </button>
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

      {/* Global Command Palette (Apple Spotlight) */}
      <CommandPalette
        isOpen={isPaletteOpen}
        onClose={() => setIsPaletteOpen(false)}
        onOpenResumeModal={() => setIsResumeOpen(true)}
      />
    </>
  )
}

export default Sidebar
