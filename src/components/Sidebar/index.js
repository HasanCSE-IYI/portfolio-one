import {
  faGithub,
  faHackerrank,
  faLinkedin,
  faSkype,
} from '@fortawesome/free-brands-svg-icons'
import {
  faEnvelope,
  faHome,
  faSuitcase,
  faUser,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link, NavLink } from 'react-router-dom'
import LogoS from '../../assets/images/logo.svg'
import LogoSubtitle from '../../assets/images/logo_sub.svg'
import './index.scss'

const Sidebar = () => {
  return (
    <div className="nav-bar">
      <Link className="logo" to="/">
        <img className="App-logo" src={LogoS} alt="Mahmud" />
        <img className="sub-logo" src={LogoSubtitle} alt="Mahmud al Hasan" />
      </Link>
      <nav>
        <NavLink
          end
          to="/"
          className={({ isActive }) => (isActive ? 'active' : undefined)}
        >
          <FontAwesomeIcon icon={faHome} color="#4d4d4e" />
        </NavLink>
        <NavLink
          to="/about"
          className={({ isActive }) =>
            isActive ? 'about-link active' : 'about-link'
          }
        >
          <FontAwesomeIcon icon={faUser} color="#4d4d4e" />
        </NavLink>
        <NavLink
          to="/portfolio"
          className={({ isActive }) =>
            isActive ? 'portfolio-link active' : 'portfolio-link'
          }
        >
          <FontAwesomeIcon icon={faSuitcase} color="#4d4d4e" />
        </NavLink>
        <NavLink
          to="/contact"
          className={({ isActive }) =>
            isActive ? 'contact-link active' : 'contact-link'
          }
        >
          <FontAwesomeIcon icon={faEnvelope} color="#4d4d4e" />
        </NavLink>
      </nav>
      <ul>
        <li>
          <a
            href="https://www.linkedin.com/in/mahmud-al-hasan/"
            target="_blank"
            rel="noreferrer"
          >
            <FontAwesomeIcon icon={faLinkedin} color="#4d4d4e" />
          </a>
        </li>
        <li>
          <a
            href="https://github.com/zero-fighter"
            target="_blank"
            rel="noreferrer"
          >
            <FontAwesomeIcon icon={faGithub} color="#4d4d4e" />
          </a>
        </li>
        <li>
          <a
            href="https://www.hackerrank.com/zero_fighter"
            rel="noreferrer"
            target="_blank"
          >
            <FontAwesomeIcon icon={faHackerrank} color="#4d4d4e" />
          </a>
        </li>
        <li>
          <a
            href="skype:live:rauaha_1"
            rel="noreferrer"
            target="_blank"
          >
            <FontAwesomeIcon icon={faSkype} color="#4d4d4e" />
          </a>
        </li>
      </ul>
    </div>
  )
}

export default Sidebar
