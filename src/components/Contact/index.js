import { useEffect, useState, useRef } from 'react'
import Loader from 'react-loaders'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import emailjs from '@emailjs/browser'
import AnimatedLetters from '../AnimatedLetters'
import './index.scss'

const COLLABORATION_TIERS = [
  {
    title: 'Full-Time Senior Backend Engineer',
    badge: 'Primary Focus',
    description: 'Looking to join engineering teams building enterprise .NET Core, ASP.NET Web API, Laravel, or NestJS microservices with high performance and cloud readiness.',
  },
  {
    title: 'System Architecture & Database Optimization',
    badge: 'Specialized',
    description: 'Relational schema modeling, EF Core / MySQL query optimization, indexing strategies, and transitioning monoliths into modular API architectures.',
  },
  {
    title: 'Technical Consultation & Code Review',
    badge: 'Advisory',
    description: 'Architecture assessments, security audits (JWT & RBAC), RESTful API contract reviews, and mentorship on Clean Architecture.',
  },
]

const Contact = () => {
  const [letterClass, setLetterClass] = useState('text-animate')
  const form = useRef()

  useEffect(() => {
    const timer = setTimeout(() => {
      setLetterClass('text-animate-hover')
    }, 3000)
    return () => clearTimeout(timer)
  }, [])

  const sendEmail = (e) => {
    e.preventDefault()

    const serviceId = process.env.REACT_APP_EMAILJS_SERVICE_ID || 'service_ah887jc'
    const templateId = process.env.REACT_APP_EMAILJS_TEMPLATE_ID || 'template_6ohf9ai'
    const publicKey = process.env.REACT_APP_EMAILJS_PUBLIC_KEY || '-z1plCY3kWdfs26uU'

    emailjs
      .sendForm(
        serviceId,
        templateId,
        form.current,
        publicKey
      )
      .then(
        () => {
          alert('Message successfully sent!')
          if (form.current) {
            form.current.reset()
          }
        },
        () => {
          alert('Failed to send the message, please try again')
        }
      )
  }

  return (
    <>
      <div className="container contact-page">
        <div className="text-zone">
          <h1>
            <AnimatedLetters
              letterClass={letterClass}
              strArray={['C', 'o', 'n', 't', 'a', 'c', 't', ' ', 'm', 'e']}
              idx={15}
            />
          </h1>

          <p className="contact-lead">
            Have a senior engineering opportunity, system architecture challenge, or project in mind? Pick whatever channel is most convenient:
          </p>

          {/* Quick Connect Channels (Inspired by Al Nahian's quick reach bar) */}
          <div className="quick-connect-bar">
            <a
              href="https://wa.me/8801727328200"
              target="_blank"
              rel="noreferrer"
              className="quick-link whatsapp"
            >
              💬 WhatsApp (+880 1727-328200)
            </a>
            <a
              href="mailto:mahmud.csem@gmail.com"
              className="quick-link email"
            >
              ✉️ mahmud.csem@gmail.com
            </a>
            <a
              href="https://www.linkedin.com/in/mahmud-al-hasan/"
              target="_blank"
              rel="noreferrer"
              className="quick-link linkedin"
            >
              💼 LinkedIn Profile
            </a>
            <a
              href="https://github.com/HasanCSE-IYI"
              target="_blank"
              rel="noreferrer"
              className="quick-link github"
            >
              🐙 GitHub Repositories
            </a>
          </div>

          {/* Collaboration Tiers (Inspired by Al Nahian's Work With Me section) */}
          <div className="collaboration-section">
            <h2 className="section-title">Ways We Can Work Together</h2>
            <div className="tiers-grid">
              {COLLABORATION_TIERS.map((tier, idx) => (
                <div className="tier-card" key={idx}>
                  <div className="tier-header">
                    <span className="tier-title">{tier.title}</span>
                    <span className="tier-badge">{tier.badge}</span>
                  </div>
                  <p className="tier-desc">{tier.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="contact-form-section">
            <h2 className="section-title">Send a Direct Message</h2>
            <div className="contact-form">
              <form ref={form} onSubmit={sendEmail}>
                <ul>
                  <li className="half">
                    <input placeholder="Your Name" type="text" name="name" required />
                  </li>
                  <li className="half">
                    <input
                      placeholder="Your Email"
                      type="email"
                      name="email"
                      required
                    />
                  </li>
                  <li>
                    <input
                      placeholder="Subject (e.g. Senior Backend Opportunity / Consulting)"
                      type="text"
                      name="subject"
                      required
                    />
                  </li>
                  <li>
                    <textarea placeholder="Message" name="message" required></textarea>
                  </li>
                  <li>
                    <input type="submit" className="flat-button" value="SEND MESSAGE" />
                  </li>
                </ul>
              </form>
            </div>
          </div>
        </div>

        <div className="info-map">
          Mahmud al Hasan
          <br />
          Backend Software Engineer
          <br />
          (Laravel, NestJS • Focused on .NET)
          <br />
          Bayazid, Chattogram, Bangladesh
          <br />
          Phone: +880 1727 328200
          <br />
          <br />
          <span>mahmud.csem@gmail.com</span>
        </div>

        <div className="map-wrap">
          <MapContainer center={[22.3833, 91.8167]} zoom={13}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={[22.3833, 91.8167]}>
              <Popup>Mahmud lives here in Bayazid, Chattogram :)</Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
      <Loader type="pacman" />
    </>
  )
}

export default Contact
