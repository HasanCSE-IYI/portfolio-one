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
  faSuitcase,
  faUser,
  faSearch,
  faHeadphones,
  faChevronRight,
  faBookOpen,
  faTerminal,
  faPalette,
  faVolumeHigh,
  faVolumeXmark,
  faKeyboard,
  faComments,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link, NavLink, useLocation } from 'react-router-dom'
import LogoS from '../../assets/images/logo.svg'
import ResumeModal from '../ResumeModal'
import CommandPalette from '../CommandPalette'
import AvailabilityBadge from '../AvailabilityBadge'
import Terminal from '../Terminal'
import Cheatsheet from '../Cheatsheet'
import ThemeSwitcher from '../ThemeSwitcher'
import Guestbook from '../Guestbook'
import { useUi } from '../../context/UiContext'
import './index.scss'

const Sidebar = () => {
  const [isResumeOpen, setIsResumeOpen] = useState(false)
  const [isPaletteOpen, setIsPaletteOpen] = useState(false)
  const [showMoreMenu, setShowMoreMenu] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMac, setIsMac] = useState(true)
  const location = useLocation()

  const {
    soundEnabled,
    toggleSound,
    isTerminalOpen,
    openTerminal,
    closeTerminal,
    isCheatsheetOpen,
    openCheatsheet,
    closeCheatsheet,
    isGuestbookOpen,
    openGuestbook,
    closeGuestbook,
    isThemePickerOpen,
    openThemePicker,
    closeThemePicker,
    playSound,
  } = useUi()

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

            {/* Live Availability & BST Timezone Badge */}
            <AvailabilityBadge />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="desktop-nav" aria-label="Desktop Navigation">
            <NavLink
              end
              to="/"
              className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
              onClick={() => {
                handleHomeClick()
                playSound('click')
              }}
            >
              <FontAwesomeIcon icon={faHome} className="nav-icon" />
              <span>Home</span>
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
              onClick={() => playSound('click')}
            >
              <FontAwesomeIcon icon={faUser} className="nav-icon" />
              <span>About</span>
            </NavLink>
            <NavLink
              to="/resume"
              className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
              onClick={() => playSound('click')}
            >
              <FontAwesomeIcon icon={faFileAlt} className="nav-icon" />
              <span>Resume</span>
            </NavLink>
            <NavLink
              to="/portfolio"
              className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
              onClick={() => playSound('click')}
            >
              <FontAwesomeIcon icon={faSuitcase} className="nav-icon" />
              <span>Portfolio</span>
            </NavLink>
            <NavLink
              to="/focus"
              className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
              onClick={() => playSound('click')}
            >
              <FontAwesomeIcon icon={faHeadphones} className="nav-icon" />
              <span>Focus</span>
            </NavLink>
            <NavLink
              to="/blog"
              className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
              onClick={() => playSound('click')}
            >
              <FontAwesomeIcon icon={faBookOpen} className="nav-icon" />
              <span>Blog</span>
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
              onClick={() => playSound('click')}
            >
              <FontAwesomeIcon icon={faEnvelope} className="nav-icon" />
              <span>Contact</span>
            </NavLink>
          </nav>

          {/* Actions: Socials + Tools + Resume / More */}
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

            {/* Power Tools Toolbar */}
            <div className="tools-toolbar">
              {/* Terminal Quick Button */}
              <button
                type="button"
                className="action-tool-btn"
                onClick={openTerminal}
                aria-label="Open Interactive Terminal (Ctrl+~)"
                title="Interactive Terminal CLI (Ctrl+~)"
              >
                <FontAwesomeIcon icon={faTerminal} />
              </button>

              {/* Theme Accent Color Picker */}
              <button
                type="button"
                className="action-tool-btn"
                onClick={openThemePicker}
                aria-label="Change Accent Color Theme"
                title="Accent Color Themes"
              >
                <FontAwesomeIcon icon={faPalette} />
              </button>

              {/* UI Sound Effects Toggle */}
              <button
                type="button"
                className={`action-tool-btn ${!soundEnabled ? 'muted' : ''}`}
                onClick={toggleSound}
                aria-label={soundEnabled ? 'Mute UI sounds (M)' : 'Enable UI sounds (M)'}
                title={soundEnabled ? 'Mute UI sounds (M)' : 'Enable UI sounds (M)'}
              >
                <FontAwesomeIcon icon={soundEnabled ? faVolumeHigh : faVolumeXmark} />
              </button>

              {/* Public Guestbook & Wall */}
              <button
                type="button"
                className="action-tool-btn"
                onClick={openGuestbook}
                aria-label="Open Public Guestbook"
                title="Public Guestbook & Wall"
              >
                <FontAwesomeIcon icon={faComments} />
              </button>

              {/* Keyboard Shortcuts Cheatsheet */}
              <button
                type="button"
                className="action-tool-btn"
                onClick={openCheatsheet}
                aria-label="Keyboard Shortcuts (?)"
                title="Keyboard Shortcuts (?)"
              >
                <FontAwesomeIcon icon={faKeyboard} />
              </button>
            </div>

            {/* Quick Spotlight Trigger */}
            <button
              type="button"
              className="spotlight-quick-btn"
              onClick={() => {
                playSound('pop')
                setIsPaletteOpen(true)
              }}
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
              onClick={() => {
                playSound('pop')
                setIsResumeOpen(true)
              }}
              aria-label="View Resume"
            >
              <FontAwesomeIcon icon={faFileAlt} className="resume-icon" />
              <span>Resume</span>
            </button>

            {/* More Menu Toggle (Mobile) */}
            <button
              type="button"
              className={`more-toggle-btn ${showMoreMenu ? 'active' : ''}`}
              onClick={() => {
                playSound('click')
                setShowMoreMenu(!showMoreMenu)
              }}
              aria-label="Quick Connect Options"
              aria-expanded={showMoreMenu}
              aria-controls="mobile-more-dropdown"
            >
              <FontAwesomeIcon icon={showMoreMenu ? faClose : faEllipsisVertical} />
            </button>
          </div>
        </div>

        {/* Mobile Dropdown for Extra Contact Links & Power Tools */}
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
                  <span className="header-text">Channels &amp; Tools</span>
                </div>
                <button
                  type="button"
                  className="close-dropdown-btn"
                  onClick={() => setShowMoreMenu(false)}
                  aria-label="Close menu"
                >
                  <FontAwesomeIcon icon={faClose} />
                </button>
              </div>

              <div className="dropdown-items" role="menu">
                {/* Spotlight Search Mobile Item */}
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

                {/* Interactive Terminal Mobile Item */}
                <button
                  type="button"
                  className="dropdown-item terminal-item"
                  role="menuitem"
                  onClick={() => {
                    setShowMoreMenu(false)
                    openTerminal()
                  }}
                >
                  <span className="item-icon-box terminal-box">
                    <FontAwesomeIcon icon={faTerminal} />
                  </span>
                  <div className="item-text-group">
                    <span className="item-main-title">Terminal CLI</span>
                    <span className="item-sub-title">Interactive shell console (Ctrl+~)</span>
                  </div>
                  <span className="item-kbd-badge">Ctrl+~</span>
                </button>

                {/* Theme Switcher Mobile Item */}
                <button
                  type="button"
                  className="dropdown-item theme-item"
                  role="menuitem"
                  onClick={() => {
                    setShowMoreMenu(false)
                    openThemePicker()
                  }}
                >
                  <span className="item-icon-box theme-box">
                    <FontAwesomeIcon icon={faPalette} />
                  </span>
                  <div className="item-text-group">
                    <span className="item-main-title">Accent Theme</span>
                    <span className="item-sub-title">Amber, Cyan, Emerald, Violet, Rose</span>
                  </div>
                  <FontAwesomeIcon icon={faChevronRight} className="item-arrow-icon" />
                </button>

                {/* Public Guestbook Mobile Item */}
                <button
                  type="button"
                  className="dropdown-item guestbook-item"
                  role="menuitem"
                  onClick={() => {
                    setShowMoreMenu(false)
                    openGuestbook()
                  }}
                >
                  <span className="item-icon-box guestbook-box">
                    <FontAwesomeIcon icon={faComments} />
                  </span>
                  <div className="item-text-group">
                    <span className="item-main-title">Public Guestbook</span>
                    <span className="item-sub-title">Sign the visitor wall &amp; endorsements</span>
                  </div>
                  <FontAwesomeIcon icon={faChevronRight} className="item-arrow-icon" />
                </button>

                {/* Keyboard Shortcuts Cheatsheet Mobile Item */}
                <button
                  type="button"
                  className="dropdown-item cheatsheet-item"
                  role="menuitem"
                  onClick={() => {
                    setShowMoreMenu(false)
                    openCheatsheet()
                  }}
                >
                  <span className="item-icon-box cheatsheet-box">
                    <FontAwesomeIcon icon={faKeyboard} />
                  </span>
                  <div className="item-text-group">
                    <span className="item-main-title">Keyboard Shortcuts</span>
                    <span className="item-sub-title">Hotkeys cheatsheet (?)</span>
                  </div>
                  <span className="item-kbd-badge">?</span>
                </button>

                {/* Blog Link */}
                <Link
                  to="/blog"
                  className="dropdown-item blog-item"
                  role="menuitem"
                  onClick={() => setShowMoreMenu(false)}
                >
                  <span className="item-icon-box blog-box">
                    <FontAwesomeIcon icon={faBookOpen} />
                  </span>
                  <div className="item-text-group">
                    <span className="item-main-title">Engineering Blog</span>
                    <span className="item-sub-title">Architectural Deep-Dives &amp; Notes</span>
                  </div>
                  <FontAwesomeIcon icon={faChevronRight} className="item-arrow-icon" />
                </Link>

                {/* Focus Station Link */}
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
                    <span className="item-sub-title">Ambient Soundscapes &amp; Pomodoro</span>
                  </div>
                  <FontAwesomeIcon icon={faChevronRight} className="item-arrow-icon" />
                </Link>

                {/* Resume Link */}
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
          onClick={() => {
            handleHomeClick()
            playSound('click')
          }}
        >
          <FontAwesomeIcon icon={faHome} className="dock-icon" />
          <span className="dock-label">Home</span>
        </NavLink>
        <NavLink
          to="/about"
          className={({ isActive }) => (isActive ? 'dock-item active' : 'dock-item')}
          aria-label="About"
          onClick={() => playSound('click')}
        >
          <FontAwesomeIcon icon={faUser} className="dock-icon" />
          <span className="dock-label">About</span>
        </NavLink>
        <NavLink
          to="/resume"
          className={({ isActive }) => (isActive ? 'dock-item active' : 'dock-item')}
          aria-label="Resume"
          onClick={() => playSound('click')}
        >
          <FontAwesomeIcon icon={faFileAlt} className="dock-icon" />
          <span className="dock-label">Resume</span>
        </NavLink>
        <NavLink
          to="/portfolio"
          className={({ isActive }) => (isActive ? 'dock-item active' : 'dock-item')}
          aria-label="Portfolio"
          onClick={() => playSound('click')}
        >
          <FontAwesomeIcon icon={faSuitcase} className="dock-icon" />
          <span className="dock-label">Works</span>
        </NavLink>
        <NavLink
          to="/focus"
          className={({ isActive }) => (isActive ? 'dock-item active' : 'dock-item')}
          aria-label="Focus"
          onClick={() => playSound('click')}
        >
          <FontAwesomeIcon icon={faHeadphones} className="dock-icon" />
          <span className="dock-label">Focus</span>
        </NavLink>
        <NavLink
          to="/blog"
          className={({ isActive }) => (isActive ? 'dock-item active' : 'dock-item')}
          aria-label="Blog"
          onClick={() => playSound('click')}
        >
          <FontAwesomeIcon icon={faBookOpen} className="dock-icon" />
          <span className="dock-label">Blog</span>
        </NavLink>
        <NavLink
          to="/contact"
          className={({ isActive }) => (isActive ? 'dock-item active' : 'dock-item')}
          aria-label="Contact"
          onClick={() => playSound('click')}
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

      {/* Global Interactive Terminal CLI */}
      <Terminal
        isOpen={isTerminalOpen}
        onClose={closeTerminal}
        onOpenResumeModal={() => setIsResumeOpen(true)}
      />

      {/* Global Keyboard Shortcuts Cheatsheet */}
      <Cheatsheet
        isOpen={isCheatsheetOpen}
        onClose={closeCheatsheet}
      />

      {/* Global Accent Theme Color Picker */}
      <ThemeSwitcher
        isOpen={isThemePickerOpen}
        onClose={closeThemePicker}
      />

      {/* Global Public Guestbook & Social Wall */}
      <Guestbook
        isOpen={isGuestbookOpen}
        onClose={closeGuestbook}
      />
    </>
  )
}

export default Sidebar
