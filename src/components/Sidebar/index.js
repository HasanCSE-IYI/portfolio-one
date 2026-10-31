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
  faHeadphones,
  faChevronRight,
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

  // Global keyboard shortcuts: Cmd+K / Ctrl+K for Palette, Escape to close mobile menu
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setIsPaletteOpen((prev) => !prev)
      } else if (e.key === 'Escape' && showMoreMenu) {
        setShowMoreMenu(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showMoreMenu])

  // Close extra menu on route change
  useEffect(() => {
    setShowMoreMenu(false)
  }, [location.pathname])

  // Scroll to top if clicking Home while already on the home page
  const handleHomeClick = () => {
    if (location.pathname === '/') {
      if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
        try {
          window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth',
          })
        } catch {
          window.scrollTo(0, 0)
        }
      }
    }
  }

  return (
    <>
      {/* Top Floating Glass Navbar (Desktop Floating Capsule & Mobile Slim Header) */}
      <header className={`modern-navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="navbar-container">
          {/* Brand Logo & Live Availability Status Capsule */}
          <div className="brand-zone">
            <Link className="brand-logo" to="/" aria-label="Home · Mahmud al Hasan" onClick={handleHomeClick}>
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
              onClick={handleHomeClick}
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
              to="/focus"
              className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
            >
              <FontAwesomeIcon icon={faHeadphones} className="nav-icon" />
              <span>Focus</span>
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
              aria-expanded={showMoreMenu}
              aria-controls="mobile-more-dropdown"
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
            <div
              id="mobile-more-dropdown"
              className="mobile-more-dropdown"
              role="dialog"
              aria-modal="true"
              aria-label="Quick Connect Channels and Navigation Menu"
            >
              <div className="dropdown-header">
                <div className="header-title-wrap">
                  <span className="header-badge">QUICK MENU</span>
                  <span className="header-text">Channels &amp; Navigation</span>
                </div>
                <button
                  type="button"
                  className="close-dropdown-btn"
                  onClick={() => setShowMoreMenu(false)}
                  aria-label="Close menu"
                >
                  ✕
                </button>
              </div>

              <div className="dropdown-links" role="menu">
                <div className="dropdown-section-label">DIRECT CHANNELS</div>

                <a
                  href="https://github.com/HasanCSE-IYI"
                  target="_blank"
                  rel="noreferrer"
                  className="dropdown-item"
                  role="menuitem"
                >
                  <span className="item-icon-box github-box">
                    <FontAwesomeIcon icon={faGithub} />
                  </span>
                  <div className="item-text-group">
                    <span className="item-main-title">GitHub Profile</span>
                    <span className="item-sub-title">/HasanCSE-IYI · Source &amp; Repos</span>
                  </div>
                  <FontAwesomeIcon icon={faChevronRight} className="item-arrow-icon" />
                </a>

                <a
                  href="https://www.linkedin.com/in/mahmud-al-hasan/"
                  target="_blank"
                  rel="noreferrer"
                  className="dropdown-item"
                  role="menuitem"
                >
                  <span className="item-icon-box linkedin-box">
                    <FontAwesomeIcon icon={faLinkedin} />
                  </span>
                  <div className="item-text-group">
                    <span className="item-main-title">LinkedIn Network</span>
                    <span className="item-sub-title">/mahmud-al-hasan · Engineering</span>
                  </div>
                  <FontAwesomeIcon icon={faChevronRight} className="item-arrow-icon" />
                </a>

                <a
                  href="https://wa.me/8801727328200"
                  target="_blank"
                  rel="noreferrer"
                  className="dropdown-item"
                  role="menuitem"
                >
                  <span className="item-icon-box whatsapp-box">
                    <FontAwesomeIcon icon={faWhatsapp} />
                  </span>
                  <div className="item-text-group">
                    <span className="item-main-title">WhatsApp Chat</span>
                    <span className="item-sub-title">+880 1727 328200 · Instant Message</span>
                  </div>
                  <FontAwesomeIcon icon={faChevronRight} className="item-arrow-icon" />
                </a>

                <a
                  href="tel:+8801727328200"
                  className="dropdown-item"
                  role="menuitem"
                >
                  <span className="item-icon-box phone-box">
                    <FontAwesomeIcon icon={faPhone} />
                  </span>
                  <div className="item-text-group">
                    <span className="item-main-title">Direct Call</span>
                    <span className="item-sub-title">+880 1727 328200 · Voice Hotline</span>
                  </div>
                  <FontAwesomeIcon icon={faChevronRight} className="item-arrow-icon" />
                </a>

                <div className="dropdown-section-label">TOOLS &amp; QUICK ACTIONS</div>

                <button
                  type="button"
                  className="dropdown-item spotlight-item"
                  role="menuitem"
                  onClick={() => {
                    setShowMoreMenu(false)
                    setIsPaletteOpen(true)
                  }}
                >
                  <span className="item-icon-box spotlight-box">
                    <FontAwesomeIcon icon={faSearch} />
                  </span>
                  <div className="item-text-group">
                    <span className="item-main-title">Spotlight Search</span>
                    <span className="item-sub-title">Quick commands, pages &amp; actions</span>
                  </div>
                  <span className="item-kbd-badge">{isMac ? '⌘K' : 'Ctrl K'}</span>
                </button>

                <Link
                  to="/focus"
                  className="dropdown-item focus-item"
                  role="menuitem"
                  onClick={() => setShowMoreMenu(false)}
                >
                  <span className="item-icon-box focus-box">
                    <FontAwesomeIcon icon={faHeadphones} />
                  </span>
                  <div className="item-text-group">
                    <span className="item-main-title">Focus Station</span>
                    <span className="item-sub-title">Ambient Lo-Fi &amp; Pomodoro</span>
                  </div>
                  <FontAwesomeIcon icon={faChevronRight} className="item-arrow-icon" />
                </Link>

                <Link
                  to="/resume"
                  className="dropdown-item resume-item"
                  role="menuitem"
                  onClick={() => setShowMoreMenu(false)}
                >
                  <span className="item-icon-box resume-box">
                    <FontAwesomeIcon icon={faFileAlt} />
                  </span>
                  <div className="item-text-group">
                    <span className="item-main-title">Executive Resume</span>
                    <span className="item-sub-title">Verified CV &amp; Credentials</span>
                  </div>
                  <FontAwesomeIcon icon={faChevronRight} className="item-arrow-icon" />
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
          onClick={handleHomeClick}
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
          to="/focus"
          className={({ isActive }) => (isActive ? 'dock-item active' : 'dock-item')}
          aria-label="Focus"
        >
          <FontAwesomeIcon icon={faHeadphones} className="dock-icon" />
          <span className="dock-label">Focus</span>
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
