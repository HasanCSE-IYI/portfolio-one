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
  faExclamationTriangle,
  faTimes,
  faMapMarkerAlt,
  faSatellite,
  faCrosshairs,
  faExternalLinkAlt,
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

// Exact coordinates for residence in Bayazid, Chattogram
const BAYAZID_COORDS = [22.3972, 91.8150];

// 3D Clear Red Pin Marker with volumetric lighting, specular highlight & ground cast shadow
const redMarker3DIcon = L.divIcon({
  className: 'custom-red-pin-3d-wrapper',
  html: `
    <div class="pin-3d-container">
      <div class="pin-3d-beacon"></div>
      <div class="pin-3d-body">
        <svg viewBox="0 0 48 64" width="46" height="60" fill="none" xmlns="http://www.w3.org/2000/svg" class="pin-3d-svg">
          <defs>
            <radialGradient id="groundShadow3D" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#000000" stop-opacity="0.65"/>
              <stop offset="60%" stop-color="#000000" stop-opacity="0.25"/>
              <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
            </radialGradient>
            <linearGradient id="bodyGradient3D" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#ff453a"/>
              <stop offset="30%" stop-color="#ef4444"/>
              <stop offset="70%" stop-color="#dc2626"/>
              <stop offset="100%" stop-color="#881337"/>
            </linearGradient>
            <radialGradient id="specularDome3D" cx="35%" cy="28%" r="65%">
              <stop offset="0%" stop-color="#ffffff" stop-opacity="0.95"/>
              <stop offset="25%" stop-color="#fca5a5" stop-opacity="0.6"/>
              <stop offset="55%" stop-color="#ef4444" stop-opacity="0"/>
              <stop offset="100%" stop-color="#4c0519" stop-opacity="0.85"/>
            </radialGradient>
            <linearGradient id="lensRing3D" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#ffffff"/>
              <stop offset="40%" stop-color="#f1f5f9"/>
              <stop offset="100%" stop-color="#94a3b8"/>
            </linearGradient>
            <radialGradient id="coreRuby3D" cx="35%" cy="32%" r="60%">
              <stop offset="0%" stop-color="#ff7b72"/>
              <stop offset="45%" stop-color="#dc2626"/>
              <stop offset="100%" stop-color="#581c87"/>
            </radialGradient>
            <filter id="castShadow3D" x="-30%" y="-20%" width="160%" height="160%">
              <feDropShadow dx="0" dy="4" stdDeviation="4.5" flood-color="#000000" flood-opacity="0.65"/>
            </filter>
          </defs>
          <ellipse cx="24" cy="58" rx="14" ry="4" fill="url(#groundShadow3D)"/>
          <g filter="url(#castShadow3D)">
            <path d="M24 2C13.5 2 5 10.5 5 21C5 33 24 56 24 56S43 33 43 21C43 10.5 34.5 2 24 2Z" fill="url(#bodyGradient3D)" stroke="#ffffff" stroke-width="1.4" stroke-linejoin="round"/>
            <path d="M24 2C13.5 2 5 10.5 5 21C5 33 24 56 24 56S43 33 43 21C43 10.5 34.5 2 24 2Z" fill="url(#specularDome3D)"/>
            <circle cx="24" cy="20.5" r="9" fill="url(#lensRing3D)" stroke="#ffffff" stroke-width="1"/>
            <circle cx="24" cy="20.5" r="5.6" fill="url(#coreRuby3D)"/>
            <ellipse cx="22" cy="18.5" rx="2" ry="1.2" fill="#ffffff" opacity="0.95"/>
          </g>
        </svg>
      </div>
    </div>
  `,
  iconSize: [46, 60],
  iconAnchor: [23, 56],
  popupAnchor: [0, -56],
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
  const [emailText, setEmailText] = useState('')
  const [messageText, setMessageText] = useState('')
  const [formFeedback, setFormFeedback] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [copiedMessage, setCopiedMessage] = useState(false)
  const [mapInstance, setMapInstance] = useState(null)
  const markerRef = useRef(null)
  const form = useRef()

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailText)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLetterClass('text-animate-hover')
    }, 1800)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (markerRef.current) {
      const timer = setTimeout(() => {
        try {
          markerRef.current.openPopup()
        } catch (e) {
          // ignore
        }
      }, 700)
      return () => clearTimeout(timer)
    }
  }, [mapInstance])

  const handleRecenter = () => {
    if (mapInstance) {
      mapInstance.flyTo(BAYAZID_COORDS, 17, {
        duration: 1.2,
        easeLinearity: 0.25,
      })
      if (markerRef.current) {
        setTimeout(() => {
          try {
            markerRef.current.openPopup()
          } catch (e) {
            // ignore
          }
        }, 1250)
      }
    }
  }

  const handleSelectTier = (tierTitle) => {
    setSelectedTier(tierTitle)
    setSubject(`[Engagement] ${tierTitle}`)
    if (!messageText.trim()) {
      setMessageText(`Hi Mahmud,\n\nI would like to explore working with you regarding "${tierTitle}". Here are the details of our requirements: `)
    }
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

    const templateParams = {
      name: nameVal,
      email: emailVal,
      subject: subjectVal,
      message: messageVal,
      user_name: nameVal,
      user_email: emailVal,
    }

    emailjs
      .sendForm(
        serviceId,
        templateId,
        form.current,
        publicKey
      )
      .catch(() => {
        // Fallback to direct JSON send if FormData parsing fails in some environments
        return emailjs.send(serviceId, templateId, templateParams, publicKey)
      })
      .then(
        () => {
          setIsSubmitting(false)
          setFormFeedback({
            type: 'success',
            title: 'Message Delivered Successfully!',
            message: 'Thank you for reaching out! Mahmud has received your message and will reply shortly.',
          })
          if (form.current) {
            form.current.reset()
            setSubject('')
            setSelectedTier('')
            setEmailText('')
            setMessageText('')
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
            title: 'Direct Dispatch Offline',
            message:
              'The automated gateway is currently unavailable. Your message is safely preserved below—dispatch it with 1 click:',
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
            <div className="form-section-header">
              <h2 className="section-title">Send a Direct Message</h2>
              <div className="contact-sla-badge">
                <span className="sla-dot"></span>
                <span>Typical response: &lt; 4 hours · Direct WhatsApp available for urgent matters</span>
              </div>
            </div>

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
                      <FontAwesomeIcon icon={faExclamationTriangle} />
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
                  <li className="half email-input-col">
                    <div className="input-wrap">
                      <input
                        placeholder="Your Email"
                        type="email"
                        name="email"
                        value={emailText}
                        onChange={(e) => setEmailText(e.target.value)}
                        aria-label="Your Email"
                        required
                      />
                      {emailText && (
                        <span
                          className={`email-validation-indicator ${isEmailValid ? 'valid' : 'invalid'}`}
                          title={isEmailValid ? 'Valid email format' : 'Incomplete email address'}
                        >
                          <FontAwesomeIcon icon={isEmailValid ? faCheck : faTimes} />
                        </span>
                      )}
                    </div>
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
                  <li className="message-input-col">
                    <textarea
                      placeholder="Message (Please describe your project, timeline, or engineering opportunity)"
                      name="message"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      aria-label="Your Message"
                      required
                    ></textarea>
                    <div className="textarea-footer">
                      <span className="char-count">
                        {messageText.length} characters
                      </span>
                    </div>
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
            <div className="info-map-header">
              <span className="info-map-avatar-dot"></span>
              <div>
                <h3 className="info-map-name">Mahmud al Hasan</h3>
                <p className="info-map-role">Backend Software Engineer (.NET & Cloud APIs)</p>
              </div>
            </div>
            <div className="info-map-location">
              <div className="location-landmark">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="pin-icon" />
                <span className="primary-landmark">বায়েজীদ, চট্টগ্রাম</span>
              </div>
              <div className="location-detail">
                Bayazid, Chattogram - 4210, Bangladesh
              </div>
            </div>
            <div className="info-map-contact-row">
              <a href="tel:+8801727328200" className="contact-item">
                📞 +880 1727 328200
              </a>
              <a href="mailto:mahmud.csem@gmail.com" className="contact-item email">
                ✉️ mahmud.csem@gmail.com
              </a>
            </div>
          </div>

          <div className="map-wrap satellite-active">
            {/* Map Top Floating Header Controls */}
            <div className="map-glass-controls">
              <div className="map-location-tag">
                <span className="live-radar-dot"></span>
                <span>বায়েজীদ, চট্টগ্রাম (Bayazid, Chattogram)</span>
              </div>
              <div className="map-view-actions">
                <div className="satellite-hd-badge">
                  <FontAwesomeIcon icon={faSatellite} />
                  <span>HD স্যাটেলাইট ভিউ</span>
                </div>
                <button
                  type="button"
                  className="recenter-btn"
                  onClick={handleRecenter}
                  title="বায়েজীদে রিসেন্টার করুন"
                  aria-label="Recenter map on Bayazid, Chattogram"
                >
                  <FontAwesomeIcon icon={faCrosshairs} />
                </button>
              </div>
            </div>

            <MapContainer
              center={BAYAZID_COORDS}
              zoom={17}
              scrollWheelZoom={false}
              whenCreated={setMapInstance}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.google.com/maps" target="_blank" rel="noreferrer">Google Maps</a> Satellite'
                url="https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
                subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
                maxNativeZoom={20}
                maxZoom={21}
              />

              <Marker
                position={BAYAZID_COORDS}
                icon={redMarker3DIcon}
                ref={markerRef}
              >
                <Popup className="custom-location-popup" autoPan={false}>
                  <div className="popup-card">
                    <div className="popup-badge">
                      <span className="live-dot-red"></span>
                      <span>বর্তমান অবস্থান / Location</span>
                    </div>
                    <h3 className="popup-title">বায়েজীদ, চট্টগ্রাম</h3>
                    <p className="popup-sub">Bayazid, Chattogram - 4210, Bangladesh</p>
                    <div className="popup-meta">
                      <span className="badge-chip">চট্টগ্রাম বিভাগ, বাংলাদেশ</span>
                      <span className="coords-chip">22.3972° N, 91.8150° E</span>
                    </div>
                    <a
                      href="https://www.google.com/maps/search/?api=1&query=22.3972,91.8150"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="popup-maps-btn"
                    >
                      <FontAwesomeIcon icon={faExternalLinkAlt} /> Google Maps-এ দেখুন
                    </a>
                  </div>
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>
      </div>
    </>
  )
}

export default Contact
