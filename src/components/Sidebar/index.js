import { useState } from 'react'
import {
  faGithub,
  faLinkedin,
  faSkype,
  faWhatsapp,
} from '@fortawesome/free-brands-svg-icons'
import {
  faBars,
  faClose,
  faEnvelope,
  faHome,
  faPhone,
  faSuitcase,
  faUser,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link, NavLink } from 'react-router-dom'
import LogoS from '../../assets/images/logo.svg'
import LogoSubtitle from '../../assets/images/logo_sub.svg'
import './index.scss'

const Sidebar = () => {
  const [showNav, setShowNav] = useState(false)

  const handleLinkClick = () => {
    setShowNav(false)
  }

  return (
    <div className="nav-bar">
      <Link className="logo" to="/" onClick={handleLinkClick}>
        <img className="App-logo" src={LogoS} alt="Mahmud" />
        <img className="sub-logo" src={LogoSubtitle} alt="Mahmud al Hasan" />
      </Link>
      <nav className={showNav ? 'mobile-show' : ''}>
        <NavLink
          end
          to="/"
          onClick={handleLinkClick}
          className={({ isActive }) => (isActive ? 'active' : undefined)}
        >
          <FontAwesomeIcon icon={faHome} color="#4d4d4e" />
          <span className="nav-text">HOME</span>
        </NavLink>
        <NavLink
          to="/about"
          onClick={handleLinkClick}
          className={({ isActive }) =>
            isActive ? 'about-link active' : 'about-link'
          }
        >
          <FontAwesomeIcon icon={faUser} color="#4d4d4e" />
          <span className="nav-text">ABOUT</span>
        </NavLink>
        <NavLink
          to="/portfolio"
          onClick={handleLinkClick}
          className={({ isActive }) =>
            isActive ? 'portfolio-link active' : 'portfolio-link'
          }
        >
          <FontAwesomeIcon icon={faSuitcase} color="#4d4d4e" />
          <span className="nav-text">PORTFOLIO</span>
        </NavLink>
        <NavLink
          to="/contact"
          onClick={handleLinkClick}
          className={({ isActive }) =>
            isActive ? 'contact-link active' : 'contact-link'
          }
        >
          <FontAwesomeIcon icon={faEnvelope} color="#4d4d4e" />
          <span className="nav-text">CONTACT</span>
        </NavLink>
        <FontAwesomeIcon
          onClick={() => setShowNav(false)}
          icon={faClose}
          color="#ffd700"
          className="close-icon"
          aria-label="Close Menu"
        />
      </nav>
      <ul className={showNav ? 'mobile-show' : ''}>
        <li>
          <a
            href="https://www.linkedin.com/in/mahmud-al-hasan/"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
          >
            <FontAwesomeIcon icon={faLinkedin} color="#4d4d4e" />
          </a>
        </li>
        <li>
          <a
            href="https://github.com/HasanCSE-IYI"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
          >
            <FontAwesomeIcon icon={faGithub} color="#4d4d4e" />
          </a>
        </li>
        <li>
          <a
            href="https://wa.me/8801727328200"
            target="_blank"
            rel="noreferrer"
            aria-label="WhatsApp: +880 1727 328200"
          >
            <FontAwesomeIcon icon={faWhatsapp} color="#4d4d4e" />
          </a>
        </li>
        <li>
          <a
            href="tel:+8801727328200"
            rel="noreferrer"
            aria-label="Phone: +880 1727 328200"
          >
            <FontAwesomeIcon icon={faPhone} color="#4d4d4e" />
          </a>
        </li>
        <li>
          <a
            href="skype:live:rauaha_1"
            rel="noreferrer"
            target="_blank"
            aria-label="Skype"
          >
            <FontAwesomeIcon icon={faSkype} color="#4d4d4e" />
          </a>
        </li>
      </ul>
      <FontAwesomeIcon
        onClick={() => setShowNav(true)}
        icon={faBars}
        color="#ffd700"
        className="hamburger-icon"
        aria-label="Open Menu"
      />
    </div>
  )
}

export default Sidebar
