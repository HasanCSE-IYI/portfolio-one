import React, { useState, useEffect, useRef, useCallback } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faHome,
  faUser,
  faFileAlt,
  faSuitcase,
  faHeadphones,
  faBookOpen,
  faEnvelope,
  faClose,
  faCompass,
} from '@fortawesome/free-solid-svg-icons'
import { useUi } from '../../context/UiContext'
import './index.scss'

// 7 primary navigation items mapped symmetrically across a 180° upper radial semicircle
const NAV_ITEMS = [
  {
    path: '/',
    label: 'Home',
    subtitle: 'Welcome & Highlights',
    icon: faHome,
    exact: true,
  },
  {
    path: '/about',
    label: 'About',
    subtitle: 'Bio & Architecture Skills',
    icon: faUser,
  },
  {
    path: '/resume',
    label: 'Resume',
    subtitle: '8+ Yrs Experience & Stack',
    icon: faFileAlt,
  },
  {
    path: '/portfolio',
    label: 'Works',
    subtitle: 'Enterprise Systems & APIs',
    icon: faSuitcase,
  },
  {
    path: '/focus',
    label: 'Focus',
    subtitle: 'Ambient Beats & Synthesizer',
    icon: faHeadphones,
  },
  {
    path: '/blog',
    label: 'Blog',
    subtitle: 'Engineering & Tech Notes',
    icon: faBookOpen,
  },
  {
    path: '/contact',
    label: 'Contact',
    subtitle: 'Hire Mahmud & Inquiries',
    icon: faEnvelope,
  },
]

// Precompute radial geometry: 180° arc from left (180°) to right (0°)
// Angle for item i: 180 - (i * 30) degrees
const COMPUTED_ITEMS = NAV_ITEMS.map((item, index) => {
  const angleDeg = 180 - index * (180 / (NAV_ITEMS.length - 1))
  const angleRad = (angleDeg * Math.PI) / 180
  return {
    ...item,
    index,
    angleDeg,
    cos: Math.cos(angleRad),
    sin: -Math.sin(angleRad), // Negative for upward CSS translation
  }
})

const CircularNav = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [hoveredItem, setHoveredItem] = useState(null)
  const location = useLocation()
  const { playSound } = useUi()

  const navRef = useRef(null)
  const triggerRef = useRef(null)

  // Current active route item
  const currentActiveItem = NAV_ITEMS.find((item) =>
    item.exact
      ? location.pathname === item.path
      : location.pathname.startsWith(item.path)
  )

  // Toggle open/close
  const toggleMenu = useCallback(() => {
    setIsOpen((prev) => {
      const next = !prev
      if (next) {
        playSound('pop')
      } else {
        playSound('close')
      }
      return next
    })
  }, [playSound])

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false)
    setHoveredItem(null)
  }, [location.pathname])

  // Close menu when user scrolls
  useEffect(() => {
    const handleScroll = () => {
      if (isOpen) {
        setIsOpen(false)
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isOpen])

  // Keyboard accessibility: Escape closes menu, traps/handles focus
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        e.preventDefault()
        setIsOpen(false)
        playSound('close')
        if (triggerRef.current) {
          triggerRef.current.focus()
        }
      }
    }

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, playSound])

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isOpen && navRef.current && !navRef.current.contains(e.target)) {
        setIsOpen(false)
        playSound('close')
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('touchstart', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [isOpen, playSound])

  // Handle Home smooth scroll if already on Home
  const handleItemClick = (item) => {
    playSound('click')
    if (item.path === '/' && location.pathname === '/') {
      if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
        try {
          window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
        } catch {
          window.scrollTo(0, 0)
        }
      }
    }
    setIsOpen(false)
  }

  return (
    <nav
      ref={navRef}
      className={`circular-nav-container ${isOpen ? 'is-open' : 'is-closed'}`}
      aria-label="Circular Animated Navigation Menu"
    >
      {/* Blurred Dimmer Scrim Backdrop (Closes on click) */}
      <div
        data-testid="circular-scrim"
        className={`circular-nav-scrim ${isOpen ? 'visible' : ''}`}
        onClick={() => {
          setIsOpen(false)
          playSound('close')
        }}
        aria-hidden={!isOpen}
      />

      {/* Radial Menu System (Orbit dial + items) */}
      <div className="circular-nav-stage">
        {/* Subtle SVG Radar Orbit Guide */}
        <div className="circular-orbit-dial" aria-hidden="true">
          <svg className="orbit-svg" viewBox="-150 -150 300 160">
            <defs>
              <linearGradient id="orbitGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="var(--primary-accent, #f59e0b)" stopOpacity="0.2" />
                <stop offset="50%" stopColor="var(--primary-accent, #f59e0b)" stopOpacity="0.8" />
                <stop offset="100%" stopColor="var(--primary-accent, #f59e0b)" stopOpacity="0.2" />
              </linearGradient>
            </defs>
            <path
              d="M -125 0 A 125 125 0 0 1 125 0"
              fill="none"
              stroke="url(#orbitGlow)"
              strokeWidth="1.5"
              strokeDasharray="4 6"
              className="orbit-path"
            />
          </svg>
        </div>

        {/* Dynamic HUD Preview Badge (Displays item title on hover/focus) */}
        <div className={`circular-hud-badge ${isOpen ? 'active' : ''}`} aria-live="polite">
          <span className="hud-accent-dot" />
          <span className="hud-title">
            {hoveredItem ? hoveredItem.label : currentActiveItem ? currentActiveItem.label : 'Navigation'}
          </span>
          <span className="hud-separator">·</span>
          <span className="hud-subtitle">
            {hoveredItem ? hoveredItem.subtitle : currentActiveItem ? currentActiveItem.subtitle : 'Explore Portfolio'}
          </span>
        </div>

        {/* Radial Navigation Items Array */}
        <ul className="circular-items-ring" aria-hidden={!isOpen}>
          {COMPUTED_ITEMS.map((item) => {
            const isActive = item.exact
              ? location.pathname === item.path
              : location.pathname.startsWith(item.path)

            return (
              <li
                key={item.path}
                className="circular-item-node"
                style={{
                  '--cos': item.cos,
                  '--sin': item.sin,
                  '--index': item.index,
                }}
              >
                <NavLink
                  to={item.path}
                  end={item.exact}
                  tabIndex={isOpen ? 0 : -1}
                  className={({ isActive: linkActive }) =>
                    `circular-item-btn ${linkActive ? 'active' : ''}`
                  }
                  aria-label={`${item.label} — ${item.subtitle}`}
                  onMouseEnter={() => {
                    setHoveredItem(item)
                    playSound('tick')
                  }}
                  onMouseLeave={() => setHoveredItem(null)}
                  onFocus={() => setHoveredItem(item)}
                  onBlur={() => setHoveredItem(null)}
                  onClick={() => handleItemClick(item)}
                >
                  <FontAwesomeIcon icon={item.icon} className="node-icon" />
                  <span className="node-label-pill">{item.label}</span>
                  {isActive && <span className="active-glow-pip" />}
                </NavLink>
              </li>
            )
          })}
        </ul>

        {/* Central Master Trigger Hub */}
        <div className="circular-hub-wrap">
          <button
            ref={triggerRef}
            type="button"
            className="circular-trigger-btn"
            onClick={toggleMenu}
            aria-expanded={isOpen}
            aria-label={isOpen ? 'Close navigation menu' : 'Open circular navigation menu'}
            aria-haspopup="menu"
          >
            {/* Ambient Breathing Waves */}
            <span className="trigger-pulse-ring" />
            <span className="trigger-pulse-ring-outer" />

            {/* Morphing Center Icon */}
            <span className="trigger-icon-wrap">
              <FontAwesomeIcon
                icon={isOpen ? faClose : faCompass}
                className={`trigger-icon ${isOpen ? 'icon-close' : 'icon-compass'}`}
              />
            </span>
          </button>
        </div>
      </div>
    </nav>
  )
}

export default CircularNav