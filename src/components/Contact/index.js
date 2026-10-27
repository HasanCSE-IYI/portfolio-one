import { useEffect, useState, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import iconMarker from 'leaflet/dist/images/marker-icon.png'
import iconMarker2x from 'leaflet/dist/images/marker-icon-2x.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'
import emailjs from '@emailjs/browser'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faEnvelope,
  faPaperPlane,
  faCopy,
  faCheck,
} from '@fortawesome/free-solid-svg-icons'
import {
  faGithub,
  faLinkedin,
  faWhatsapp,
} from '@fortawesome/free-brands-svg-icons'
import AnimatedLetters from '../AnimatedLetters'
import './index.scss'

// Fix Leaflet's default marker icon missing in Webpack production builds
delete L.Icon.Default.prototype._getIconUrl;

const defaultMarkerIcon = L.icon({
  iconUrl: iconMarker,
  iconRetinaUrl: iconMarker2x,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Icon.Default.mergeOptions({
  iconUrl: iconMarker,
  iconRetinaUrl: iconMarker2x,
  shadowUrl: iconShadow,
});

const COLLABORATION_TIERS = [
  {
    title: 'Full-Time Backend Software Engineer',
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
  const [selectedTier, setSelectedTier] = useState('')
  const [subject, setSubject] = useState('')
  const [formFeedback, setFormFeedback] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [copiedMessage, setCopiedMessage] = useState(false)
  const form = useRef()

  useEffect(() => {
    const timer = setTimeout(() => {
      setLetterClass('text-animate-hover')
    }, 1800)
    return () => clearTimeout(timer)
  }, [])

  const handleSelectTier = (tierTitle) => {
    setSelectedTier(tierTitle)
    setSubject(`[Engagement] ${tierTitle}`)
    const messageInput = document.querySelector('textarea[name="message"]')
    if (messageInput) {
      messageInput.focus()
    }
  }

  const handleCopyFullMessage = () => {
    if (!formFeedback?.formData) return
    const { name, email, subject: sub, message } = formFeedback.formData
    const textToCopy = `Sender: ${name} (${email})\nSubject: ${sub}\n\n${message}`
    if (navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy).then(() => {
        setCopiedMessage(true)
        setTimeout(() => setCopiedMessage(false), 2400)
      })
    }
  }

  const sendEmail = (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setFormFeedback(null)

    const serviceId = process.env.REACT_APP_EMAILJS_SERVICE_ID || 'service_ah887jc'
    const templateId = process.env.REACT_APP_EMAILJS_TEMPLATE_ID || 'template_6ohf9ai'
    const publicKey = process.env.REACT_APP_EMAILJS_PUBLIC_KEY || '-z1plCY3kWdfs26uU'

    const nameVal = form.current?.name?.value || ''
    const emailVal = form.current?.email?.value || ''
    const subjectVal = subject || form.current?.subject?.value || 'Portfolio Contact'
    const messageVal = form.current?.message?.value || ''

    emailjs
      .sendForm(
        serviceId,
        templateId,
        form.current,
        publicKey
      )
      .then(
        () => {
          setIsSubmitting(false)
          setFormFeedback({
            type: 'success',
            title: 'Message Delivered Successfully!',
            message: 'Thank you for reaching out. Mahmud has received your message and will reply shortly.',
          })
          if (form.current) {
            form.current.reset()
            setSubject('')
            setSelectedTier('')
          }
        },
        () => {
          setIsSubmitting(false)
          const mailtoUrl = `mailto:mahmud.csem@gmail.com?subject=${encodeURIComponent(
            subjectVal
          )}&body=${encodeURIComponent(
            `Hi Mahmud,\n\nName: ${nameVal}\nEmail: ${emailVal}\n\nMessage:\n${messageVal}`
          )}`

          const whatsappUrl = `https://wa.me/8801727328200?text=${encodeURIComponent(
            `Hi Mahmud,\n\nName: ${nameVal}\nEmail: ${emailVal}\nSubject: ${subjectVal}\n\nMessage:\n${messageVal}`
          )}`

          setFormFeedback({
            type: 'error',
            title: 'Direct Dispatch Offline (Gmail Reconnection Required)',
            message:
              'The automated gateway is undergoing Gmail OAuth token renewal. Your message is safely preserved below—dispatch it with 1 click:',
            mailtoUrl,
            whatsappUrl,
            formData: { name: nameVal, email: emailVal, subject: subjectVal, message: messageVal },
          })
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
            Have a backend engineering opportunity, system architecture challenge, or project in mind? Pick whatever channel is most convenient:
          </p>

          {/* Quick Connect Channels */}
          <div className="quick-connect-bar">
            <a
              href="https://wa.me/8801727328200"
              target="_blank"
              rel="noreferrer"
              className="quick-link whatsapp"
              title="Chat directly on WhatsApp"
            >
              <FontAwesomeIcon icon={faWhatsapp} className="channel-icon" />
              <span>WhatsApp · +880 1727 328200</span>
            </a>
            <a
              href="mailto:mahmud.csem@gmail.com"
              className="quick-link email"
              title="Send an email to mahmud.csem@gmail.com"
            >
              <FontAwesomeIcon icon={faEnvelope} className="channel-icon" />
              <span>mahmud.csem@gmail.com</span>
            </a>
            <a
              href="https://www.linkedin.com/in/mahmud-al-hasan/"
              target="_blank"
              rel="noreferrer"
              className="quick-link linkedin"
              title="Connect on LinkedIn"
            >
              <FontAwesomeIcon icon={faLinkedin} className="channel-icon" />
              <span>LinkedIn Profile</span>
            </a>
            <a
              href="https://github.com/HasanCSE-IYI"
              target="_blank"
              rel="noreferrer"
              className="quick-link github"
              title="View GitHub Repositories"
            >
              <FontAwesomeIcon icon={faGithub} className="channel-icon" />
              <span>GitHub Repositories</span>
            </a>
          </div>

          {/* Collaboration Tiers (Inspired by Al Nahian's Work With Me section) */}
          <div className="collaboration-section">
            <h2 className="section-title">Ways We Can Work Together</h2>
            <div className="tiers-grid">
              {COLLABORATION_TIERS.map((tier, idx) => (
                <div
                  className={`tier-card ${selectedTier === tier.title ? 'selected' : ''}`}
                  key={idx}
                  onClick={() => handleSelectTier(tier.title)}
                  title="Click to select this engagement type"
                >
                  <div className="tier-header">
                    <span className="tier-title">{tier.title}</span>
                    <span className="tier-badge">{tier.badge}</span>
                  </div>
                  <p className="tier-desc">{tier.description}</p>
                  <span className="tier-select-hint">
                    {selectedTier === tier.title ? '✓ Selected' : '+ Select Engagement'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="contact-form-section">
            <h2 className="section-title">Send a Direct Message</h2>

            {formFeedback && (
              <div
                className={`form-feedback-toast ${formFeedback.type}`}
                role="alert"
                aria-live="polite"
              >
                <div className="toast-top-row">
                  <span className="toast-icon">
                    {formFeedback.type === 'success' ? (
                      <FontAwesomeIcon icon={faCheck} />
                    ) : (
                      '⚠️'
                    )}
                  </span>
                  <div className="toast-header-text">
                    <strong className="toast-title">{formFeedback.title}</strong>
                    <p className="toast-message">{formFeedback.message}</p>
                  </div>
                  <button
                    type="button"
                    className="toast-close"
                    onClick={() => setFormFeedback(null)}
                    aria-label="Close notification"
                  >
                    ✕
                  </button>
                </div>

                {formFeedback.type === 'error' && formFeedback.mailtoUrl && (
                  <div className="toast-fallback-tray">
                    <a
                      href={formFeedback.mailtoUrl}
                      className="fallback-action-btn mail-client-btn"
                    >
                      <FontAwesomeIcon icon={faEnvelope} />
                      <span>1-Click Send via Email App</span>
                    </a>
                    <a
                      href={formFeedback.whatsappUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="fallback-action-btn whatsapp-send-btn"
                    >
                      <FontAwesomeIcon icon={faWhatsapp} />
                      <span>1-Click Send via WhatsApp</span>
                    </a>
                    <button
                      type="button"
                      className="fallback-action-btn copy-msg-btn"
                      onClick={handleCopyFullMessage}
                    >
                      <FontAwesomeIcon icon={copiedMessage ? faCheck : faCopy} />
                      <span>{copiedMessage ? 'Copied to Clipboard!' : 'Copy Full Message'}</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            <div className="contact-form">
              <form ref={form} onSubmit={sendEmail}>
                <ul>
                  <li className="half">
                    <input
                      placeholder="Your Name"
                      type="text"
                      name="name"
                      aria-label="Your Name"
                      required
                    />
                  </li>
                  <li className="half">
                    <input
                      placeholder="Your Email"
                      type="email"
                      name="email"
                      aria-label="Your Email"
                      required
                    />
                  </li>
                  <li>
                    <input
                      placeholder="Subject (e.g. Backend Opportunity / Consulting)"
                      type="text"
                      name="subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      aria-label="Message Subject"
                      required
                    />
                  </li>
                  <li>
                    <textarea
                      placeholder="Message (Please describe your project, timeline, or engineering opportunity)"
                      name="message"
                      aria-label="Your Message"
                      required
                    ></textarea>
                  </li>
                  <li>
                    <button
                      type="submit"
                      className={`flat-button submit-btn ${isSubmitting ? 'submitting' : ''}`}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="submit-spinner"></span>
                          <span>DISPATCHING MESSAGE...</span>
                        </>
                      ) : (
                        <>
                          <FontAwesomeIcon icon={faPaperPlane} className="send-icon" />
                          <span>SEND DIRECT MESSAGE</span>
                        </>
                      )}
                    </button>
                  </li>
                </ul>
              </form>
            </div>
          </div>
        </div>

        <div className="contact-aside">
          <div className="info-map">
            Mahmud al Hasan
            <br />
            Backend Software Engineer
            <br />
            (Laravel, NestJS • Transitioning to .NET)
            <br />
            Bayazid, Chattogram, Bangladesh
            <br />
            Phone: +880 1727 328200
            <br />
            <br />
            <span>mahmud.csem@gmail.com</span>
          </div>

          <div className="map-wrap">
            <MapContainer
              center={[22.3972, 91.8150]}
              zoom={15}
              scrollWheelZoom={false}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[22.3972, 91.8150]} icon={defaultMarkerIcon}>
                <Popup>Mahmud al Hasan lives here in Public Mor, Bayazid, Chattogram :)</Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>
      </div>
    </>
  )
}

export default Contact
