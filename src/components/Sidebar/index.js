import React, { useState, useEffect, useRef } from 'react'
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
  faPhone,
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
import { useFocusTrap } from '../../utils/useFocusTrap'
import './index.scss'

const Sidebar = () => {
  const [isResumeOpen, setIsResumeOpen] = useState(false)
  const [isPaletteOpen, setIsPaletteOpen] = useState(false)
  const [showMoreMenu, setShowMoreMenu] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMac, setIsMac] = useState(true)
  const location = useLocation()
  const moreMenuRef = useRef(null)

  useFocusTrap(showMoreMenu, moreMenuRef)

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

  // Close extra menu, resume modal, and command palette on route change
  useEffect(() => {
    setShowMoreMenu(false)
    setIsResumeOpen(false)
    setIsPaletteOpen(false)
  }, [location.pathname])

  // Prevent background scrolling while mobile extra menu is open
  useEffect(() => {
    if (showMoreMenu) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [showMoreMenu])

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
                <img className="logo-img" src={LogoS} alt="Mahmud al Hasan Logo" width="32" height="32" decoding="async" />
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

          {/* Actions: Spotlight + Tools + Resume / More */}
          <div className="nav-actions">
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

            {/* Power Tools Toolbar */}
            <div className="tools-toolbar" role="toolbar" aria-label="Quick Tools">
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
                className="action-tool-btn tool-secondary"
                onClick={openGuestbook}
                aria-label="Open Public Guestbook"
                title="Public Guestbook & Wall"
              >
                <FontAwesomeIcon icon={faComments} />
              </button>

              {/* Keyboard Shortcuts Cheatsheet */}
              <button
                type="button"
                className="action-tool-btn tool-secondary"
                onClick={openCheatsheet}
                aria-label="Keyboard Shortcuts (?)"
                title="Keyboard Shortcuts (?)"
              >
                <FontAwesomeIcon icon={faKeyboard} />
              </button>
            </div>

            {/* Three-dot More Menu Toggle (Available on Desktop & Mobile) */}
            <button
              type="button"
              className={`more-toggle-btn ${showMoreMenu ? 'active' : ''}`}
              onClick={() => {
                playSound('click')
                setShowMoreMenu(!showMoreMenu)
              }}
              aria-label="Quick Connect Options & Menu"
              aria-expanded={showMoreMenu}
              aria-controls="mobile-more-dropdown"
              title="Quick Menu, Channels & Tools"
            >
              <FontAwesomeIcon icon={showMoreMenu ? faClose : faEllipsisVertical} />
            </button>

            {/* Accessible Executive Resume Modal Trigger */}
            <button
              type="button"
              className="resume-pill-btn sr-only-btn"
              onClick={() => {
                playSound('pop')
                setIsResumeOpen(true)
              }}
              aria-label="View Resume"
              title="Open Executive CV Preview & Download"
            >
              <FontAwesomeIcon icon={faFileAlt} className="resume-icon" />
              <span>Resume</span>
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
              ref={moreMenuRef}
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
                {/* Pages & Navigation Section */}
                <div className="dropdown-section-label">PAGES &amp; EXPLORE</div>

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

                {/* Blog Link */}
                <Link
                  to="/blog"
                  className="dropdown-item blog-item"
                  role="menuitem"
                  onClick={() => {
                    setShowMoreMenu(false)
                    playSound('click')
                  }}
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
                  onClick={() => {
                    setShowMoreMenu(false)
                    playSound('click')
                  }}
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

                {/* Executive Resume Section */}
                <div className="dropdown-section-label">EXECUTIVE RESUME</div>

                {/* Quick CV Modal Preview Button */}
                <button
                  type="button"
                  className="dropdown-item resume-item"
                  role="menuitem"
                  onClick={() => {
                    setShowMoreMenu(false)
                    playSound('pop')
                    setIsResumeOpen(true)
                  }}
                  aria-label="Preview Executive CV"
                >
                  <span className="item-icon-box resume-box">
                    <FontAwesomeIcon icon={faFileAlt} />
                  </span>
                  <div className="item-text-group">
                    <span className="item-main-title">Quick CV Preview</span>
                    <span className="item-sub-title">Interactive Resume Modal &amp; PDF</span>
                  </div>
                  <FontAwesomeIcon icon={faChevronRight} className="item-arrow-icon" />
                </button>

                {/* Full Dedicated Resume Page Link */}
                <Link
                  to="/resume"
                  className="dropdown-item resume-page-link"
                  role="menuitem"
                  onClick={() => {
                    setShowMoreMenu(false)
                    playSound('click')
                  }}
                >
                  <span className="item-icon-box resume-box">
                    <FontAwesomeIcon icon={faFileAlt} />
                  </span>
                  <div className="item-text-group">
                    <span className="item-main-title">Full Resume Page</span>
                    <span className="item-sub-title">Verified CV, Print Styles &amp; Details</span>
                  </div>
                  <FontAwesomeIcon icon={faChevronRight} className="item-arrow-icon" />
                </Link>

                {/* Power Tools Section */}
                <div className="dropdown-section-label">POWER TOOLS &amp; SETTINGS</div>

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

                {/* Sound Effects Toggle Mobile Item */}
                <button
                  type="button"
                  className={`dropdown-item sound-item ${!soundEnabled ? 'muted' : ''}`}
                  role="menuitem"
                  onClick={() => {
                    toggleSound()
                  }}
                  aria-label={soundEnabled ? 'Mute UI sound effects' : 'Enable UI sound effects'}
                >
                  <span className={`item-icon-box sound-box ${!soundEnabled ? 'muted' : ''}`}>
                    <FontAwesomeIcon icon={soundEnabled ? faVolumeHigh : faVolumeXmark} />
                  </span>
                  <div className="item-text-group">
                    <span className="item-main-title">UI Sound Effects</span>
                    <span className="item-sub-title">
                      {soundEnabled ? 'Audio cues active (Clicks, Chimes)' : 'Procedural audio currently muted'}
                    </span>
                  </div>
                  <span className="item-kbd-badge">{soundEnabled ? 'ON' : 'MUTED'}</span>
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

                {/* Social & Contact Channels */}
                <div className="dropdown-section-label">CHANNELS &amp; CONNECT</div>
                <a
                  href="tel:+8801727328200"
                  className="dropdown-item"
                  role="menuitem"
                  onClick={() => {
                    setShowMoreMenu(false)
                    playSound('click')
                  }}
                >
                  <span className="item-icon-box phone-box">
                    <FontAwesomeIcon icon={faPhone} />
                  </span>
                  <div className="item-text-group">
                    <span className="item-main-title">Direct Phone Call</span>
                    <span className="item-sub-title">+880 1727 328200</span>
                  </div>
                  <FontAwesomeIcon icon={faChevronRight} className="item-arrow-icon" />
                </a>
                <a
                  href="mailto:mahmud.csem@gmail.com"
                  className="dropdown-item"
                  role="menuitem"
                  onClick={() => {
                    setShowMoreMenu(false)
                    playSound('click')
                  }}
                >
                  <span className="item-icon-box email-box">
                    <FontAwesomeIcon icon={faEnvelope} />
                  </span>
                  <div className="item-text-group">
                    <span className="item-main-title">Direct Email</span>
                    <span className="item-sub-title">mahmud.csem@gmail.com</span>
                  </div>
                  <FontAwesomeIcon icon={faChevronRight} className="item-arrow-icon" />
                </a>
                <a
                  href="https://wa.me/8801727328200"
                  target="_blank"
                  rel="noreferrer"
                  className="dropdown-item"
                  role="menuitem"
                  onClick={() => {
                    setShowMoreMenu(false)
                    playSound('click')
                  }}
                >
                  <span className="item-icon-box whatsapp-box">
                    <FontAwesomeIcon icon={faWhatsapp} />
                  </span>
                  <div className="item-text-group">
                    <span className="item-main-title">WhatsApp Chat</span>
                    <span className="item-sub-title">+880 1727-328200</span>
                  </div>
                  <FontAwesomeIcon icon={faChevronRight} className="item-arrow-icon" />
                </a>
                <a
                  href="https://www.linkedin.com/in/mahmud-al-hasan/"
                  target="_blank"
                  rel="noreferrer"
                  className="dropdown-item"
                  role="menuitem"
                  onClick={() => {
                    setShowMoreMenu(false)
                    playSound('click')
                  }}
                >
                  <span className="item-icon-box linkedin-box">
                    <FontAwesomeIcon icon={faLinkedin} />
                  </span>
                  <div className="item-text-group">
                    <span className="item-main-title">LinkedIn Profile</span>
                    <span className="item-sub-title">linkedin.com/in/mahmud-al-hasan</span>
                  </div>
                  <FontAwesomeIcon icon={faChevronRight} className="item-arrow-icon" />
                </a>
                <a
                  href="https://github.com/HasanCSE-IYI"
                  target="_blank"
                  rel="noreferrer"
                  className="dropdown-item"
                  role="menuitem"
                  onClick={() => {
                    setShowMoreMenu(false)
                    playSound('click')
                  }}
                >
                  <span className="item-icon-box github-box">
                    <FontAwesomeIcon icon={faGithub} />
                  </span>
                  <div className="item-text-group">
                    <span className="item-main-title">GitHub Profile</span>
                    <span className="item-sub-title">github.com/HasanCSE-IYI</span>
                  </div>
                  <FontAwesomeIcon icon={faChevronRight} className="item-arrow-icon" />
                </a>
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

export default React.memo(Sidebar)
