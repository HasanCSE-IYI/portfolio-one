import { useEffect, useState, useRef } from 'react'
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
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
  faSatellite,
  faRoad,
  faMountain,
  faTrafficLight,
  faCrosshairs,
  faExpand,
  faCompress,
  faDirections,
  faPlus,
  faMinus,
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

// Exact coordinates from Google Maps: Public Mor, BSRM Goli, Bayazid Bostami Road, Bayazid, Chattogram
// Link: https://maps.app.goo.gl/saQBZp8WNoPgTQ9t9
const BAYAZID_COORDS = [22.391135, 91.817740];

// 3 Distinct Base Google Map Types (from Google Maps app) with 2x Retina Clarity
const MAP_TYPES = {
  satellite: {
    id: 'satellite',
    label: 'Satellite',
    title: 'Google HD Satellite & Street Labels (2x Retina HD)',
    icon: faSatellite,
    lyrs: 'y',
    maxNativeZoom: 20,
    maxZoom: 22,
    desc: 'HD imagery with roads and labels',
  },
  roadmap: {
    id: 'roadmap',
    label: 'Roadmap',
    title: 'Google Standard Streets & Landmarks (2x Retina HD)',
    icon: faRoad,
    lyrs: 'm',
    maxNativeZoom: 20,
    maxZoom: 22,
    desc: 'Clean vector streets and landmarks',
  },
  terrain: {
    id: 'terrain',
    label: 'Terrain',
    title: 'Google Topographic Terrain & Relief (2x Retina HD)',
    icon: faMountain,
    lyrs: 'p',
    maxNativeZoom: 20,
    maxZoom: 22,
    desc: 'Topographic contours and natural relief',
  },
};

// Core Google Map Detail & Overlay (Live Traffic)
// Dynamically applied across all 3 Map Types
const MAP_DETAILS = {
  traffic: {
    id: 'traffic',
    label: 'Traffic',
    title: 'Google Live Real-Time Traffic Congestion (2x Retina HD)',
    icon: faTrafficLight,
    suffix: 'traffic',
    bannerText: 'Google Live Traffic: Real-time traffic flow active on Bayazid roads',
  },
};

// Generates dynamic Google Map 2x Retina Tile URL combining base type and detail overlay
const getTileUrl = (baseId, detailId) => {
  const base = MAP_TYPES[baseId] || MAP_TYPES.satellite;
  const detail = detailId ? MAP_DETAILS[detailId] : null;
  const suffix = detail?.suffix ? `,${detail.suffix}` : '';
  return `https://{s}.google.com/vt/lyrs=${base.lyrs}${suffix}&x={x}&y={y}&z={z}&scale=2`;
};

// Modern Compact Red Pin Marker with subtle radar pulse and high-fidelity vector styling
const redMarkerModernIcon = L.divIcon({
  className: 'custom-modern-pin-wrapper',
  html: `
    <div class="modern-pin-container">
      <div class="modern-pin-pulse" aria-hidden="true"></div>
      <div class="modern-pin-body">
        <svg viewBox="0 0 28 36" width="28" height="36" fill="none" xmlns="http://www.w3.org/2000/svg" class="modern-pin-svg">
          <defs>
            <linearGradient id="modernPinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#ff4757"/>
              <stop offset="35%" stop-color="#ef4444"/>
              <stop offset="75%" stop-color="#dc2626"/>
              <stop offset="100%" stop-color="#991b1b"/>
            </linearGradient>
            <filter id="pinShadow" x="-30%" y="-20%" width="160%" height="160%">
              <feDropShadow dx="0" dy="3" stdDeviation="2" flood-color="#000000" flood-opacity="0.55"/>
            </filter>
          </defs>
          <ellipse cx="14" cy="34" rx="7" ry="2" fill="#000000" opacity="0.4"/>
          <g filter="url(#pinShadow)">
            <path d="M14 1C6.82 1 1 6.82 1 14C1 23.2 14 34 14 34S27 23.2 27 14C27 6.82 21.18 1 14 1Z" fill="url(#modernPinGrad)" stroke="#ffffff" stroke-width="1.2" stroke-linejoin="round"/>
            <circle cx="14" cy="13.5" r="4.5" fill="#ffffff"/>
            <circle cx="14" cy="13.5" r="2.2" fill="#dc2626"/>
            <ellipse cx="11.5" cy="8" rx="2.5" ry="1.2" fill="#ffffff" opacity="0.55"/>
          </g>
        </svg>
      </div>
    </div>
  `,
  iconSize: [28, 36],
  iconAnchor: [14, 34],
});

L.Icon.Default.mergeOptions({
  iconUrl: iconMarker,
  iconRetinaUrl: iconMarker2x,
  shadowUrl: iconShadow,
});

// Helper for Bangladesh Standard Time (BST = UTC+6)
const getBSTTime = () => {
  try {
    return new Date().toLocaleTimeString('en-US', {
      timeZone: 'Asia/Dhaka',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  } catch (e) {
    const d = new Date();
    const utc = d.getTime() + d.getTimezoneOffset() * 60000;
    const bstDate = new Date(utc + 6 * 3600000);
    return bstDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  }
};

// Weather icon helper mapping WMO weather codes to emojis
const getWeatherIcon = (code, isDay = 1) => {
  if (code === 0) return isDay ? '☀️' : '🌙';
  if (code <= 3) return isDay ? '🌤️' : '☁️';
  if (code <= 48) return '🌫️';
  if (code <= 67) return '🌧️';
  if (code <= 77) return '❄️';
  if (code <= 82) return '🌦️';
  return '⛈️';
};

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
  const [activeBaseType, setActiveBaseType] = useState('satellite')
  const [activeDetail, setActiveDetail] = useState(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [mapInstance, setMapInstance] = useState(null)
  const [localTime, setLocalTime] = useState(getBSTTime)
  const [weather, setWeather] = useState({ temp: 28, icon: '🌤️' })
  const form = useRef()

  // Update live BST time & fetch real-time weather in Bayazid, Chattogram
  useEffect(() => {
    const timer = setInterval(() => {
      setLocalTime(getBSTTime())
    }, 30000)

    let isMounted = true
    fetch('https://api.open-meteo.com/v1/forecast?latitude=22.3911&longitude=91.8177&current_weather=true')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isMounted && data?.current_weather) {
          const { temperature, weathercode, is_day } = data.current_weather
          setWeather({
            temp: Math.round(temperature),
            icon: getWeatherIcon(weathercode, is_day),
          })
        }
      })
      .catch(() => {
        // Fallback default
      })

    return () => {
      isMounted = false
      clearInterval(timer)
    }
  }, [])

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailText)

  const toggleFullscreen = () => {
    setIsFullscreen((prev) => !prev)
  }

  const handleToggleDetail = (detailId) => {
    setActiveDetail((prev) => (prev === detailId ? null : detailId))
  }

  const currentTileUrl = getTileUrl(activeBaseType, activeDetail)
  const tileLayerKey = `${activeBaseType}-${activeDetail || 'plain'}`

  // Reflow map tiles when toggling fullscreen
  useEffect(() => {
    if (mapInstance) {
      const timer = setTimeout(() => {
        try {
          mapInstance.invalidateSize()
        } catch (e) {
          // ignore
        }
      }, 200)
      return () => clearTimeout(timer)
    }
  }, [isFullscreen, mapInstance])

  // Support ESC key to exit fullscreen
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isFullscreen])

  // Prevent background scroll when map is fullscreen
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isFullscreen])

  useEffect(() => {
    const timer = setTimeout(() => {
      setLetterClass('text-animate-hover')
    }, 1800)
    return () => clearTimeout(timer)
  }, [])

  const handleRecenter = () => {
    if (mapInstance) {
      mapInstance.flyTo(BAYAZID_COORDS, 17, {
        duration: 1.2,
        easeLinearity: 0.25,
      })
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
    const triggerSuccess = () => {
      setCopiedMessage(true)
      setTimeout(() => setCopiedMessage(false), 2400)
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(textToCopy)
        .then(triggerSuccess)
        .catch(() => {
          try {
            const el = document.createElement('textarea')
            el.value = textToCopy
            el.style.position = 'fixed'
            el.style.opacity = '0'
            document.body.appendChild(el)
            el.select()
            document.execCommand('copy')
            document.body.removeChild(el)
            triggerSuccess()
          } catch (e) {
            // ignore
          }
        })
    } else {
      try {
        const el = document.createElement('textarea')
        el.value = textToCopy
        el.style.position = 'fixed'
        el.style.opacity = '0'
        document.body.appendChild(el)
        el.select()
        document.execCommand('copy')
        document.body.removeChild(el)
        triggerSuccess()
      } catch (e) {
        // ignore
      }
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
            Mahmud al Hasan
            <br />
            Backend Software Engineer
            <br />
            (Laravel, NestJS • Transitioning to .NET)
            <br />
            Bayazid, Chattogram, Bangladesh
            <br />
            Phone: <a href="tel:+8801727328200" className="phone-link">+880 1727 328200</a>
            <br />
            <br />
            <a href="mailto:mahmud.csem@gmail.com" className="email-link">
              <span>mahmud.csem@gmail.com</span>
            </a>
          </div>

          <div className={`map-wrap layer-${activeBaseType} ${isFullscreen ? 'is-fullscreen' : ''}`}>
            {/* Harmonious Modern Exit Full View Button */}
            {isFullscreen && (
              <button
                type="button"
                className="map-fullscreen-exit-btn"
                onClick={toggleFullscreen}
                title="Exit Full View (Esc)"
                aria-label="Exit Full View"
              >
                <span className="exit-icon-wrap" aria-hidden="true">
                  <FontAwesomeIcon icon={faTimes} className="exit-icon" />
                </span>
                <span className="exit-label">Exit Full View</span>
                <kbd className="exit-kbd">ESC</kbd>
              </button>
            )}

            {/* Map Top Floating Header Controls */}
            <div className="map-glass-controls">
              {/* Unified Map Types & Traffic Detail Segmented Capsule */}
              <div className="map-layer-selector" role="tablist" aria-label="Map Types and Traffic">
                {Object.values(MAP_TYPES).map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    role="tab"
                    aria-selected={activeBaseType === type.id}
                    aria-label={type.label}
                    className={`map-layer-tab ${activeBaseType === type.id ? 'active' : ''}`}
                    onClick={() => setActiveBaseType(type.id)}
                    title={type.title}
                  >
                    <FontAwesomeIcon icon={type.icon} className="tab-icon" />
                    <span className="tab-label">{type.label}</span>
                  </button>
                ))}

                <span className="control-divider" aria-hidden="true"></span>

                {/* Traffic Overlay Toggle Integrated inside Map Capsule */}
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeDetail === 'traffic'}
                  aria-label="Traffic"
                  className={`map-layer-tab detail-tab ${activeDetail === 'traffic' ? 'active' : ''}`}
                  onClick={() => handleToggleDetail('traffic')}
                  title={MAP_DETAILS.traffic.title}
                >
                  <FontAwesomeIcon icon={MAP_DETAILS.traffic.icon} className="tab-icon" />
                  <span className="tab-label">Traffic</span>
                  {activeDetail === 'traffic' && <span className="tab-active-dot" aria-hidden="true"></span>}
                </button>
              </div>

              {/* Right: Actions Group (Recenter & Fullscreen) */}
              <div className="map-actions-group">
                <button
                  type="button"
                  className="map-action-btn recenter-btn"
                  onClick={handleRecenter}
                  title="Recenter on Bayazid, Chattogram"
                  aria-label="Recenter map on Bayazid, Chattogram"
                >
                  <FontAwesomeIcon icon={faCrosshairs} />
                </button>

                <button
                  type="button"
                  className={`map-action-btn fullscreen-btn ${isFullscreen ? 'active-fullscreen' : ''}`}
                  onClick={toggleFullscreen}
                  title={isFullscreen ? 'Exit Fullscreen (Esc)' : 'View Fullscreen Map'}
                  aria-label={isFullscreen ? 'Exit Fullscreen' : 'View Fullscreen Map'}
                >
                  <FontAwesomeIcon icon={isFullscreen ? faCompress : faExpand} />
                </button>
              </div>
            </div>

            {/* Active Detail Notification Banner */}
            {activeDetail && (
              <div className={`map-active-detail-banner banner-${activeDetail}`} role="status">
                <div className="banner-content">
                  <FontAwesomeIcon icon={MAP_DETAILS[activeDetail].icon} className="banner-icon" />
                  <span className="banner-text">{MAP_DETAILS[activeDetail].bannerText}</span>
                </div>
                <button
                  type="button"
                  className="banner-dismiss-btn"
                  onClick={() => setActiveDetail(null)}
                  aria-label="Dismiss detail overlay"
                  title="Turn off detail"
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
            )}

            {/* Modern Custom Zoom In / Zoom Out Controls */}
            <div className="map-modern-zoom-controls" role="group" aria-label="Map Zoom Controls">
              <button
                type="button"
                className="modern-zoom-btn zoom-in"
                onClick={() => mapInstance && mapInstance.zoomIn()}
                title="Zoom In (+)"
                aria-label="Zoom in"
              >
                <FontAwesomeIcon icon={faPlus} />
              </button>
              <button
                type="button"
                className="modern-zoom-btn zoom-out"
                onClick={() => mapInstance && mapInstance.zoomOut()}
                title="Zoom Out (-)"
                aria-label="Zoom out"
              >
                <FontAwesomeIcon icon={faMinus} />
              </button>
            </div>

            {/* Slim Bottom Floating Coordinates, BST Time, Weather & Google Maps Pill */}
            <div className="map-bottom-pill" role="status" aria-label="Location, Local Time and Weather">
              <span className="live-radar-dot" aria-hidden="true"></span>
              <span className="coords-text">22.3911° N, 91.8177° E · Bayazid, Chattogram</span>

              <span className="pill-divider" aria-hidden="true"></span>

              <div className="pill-meta-group" title="Current Local Time in Bayazid (BST · UTC+6)">
                <span className="meta-icon" aria-hidden="true">🕒</span>
                <span className="meta-time">{localTime}</span>
                <span className="meta-tz">BST · UTC+6</span>
              </div>

              <span className="pill-divider" aria-hidden="true"></span>

              <div className="pill-meta-group pill-weather" title="Live Temperature in Bayazid, Chattogram">
                <span className="meta-weather-icon" aria-hidden="true">{weather.icon}</span>
                <span className="meta-weather-temp">{weather.temp}°C</span>
              </div>

              <span className="pill-divider" aria-hidden="true"></span>

              <a
                href="https://maps.app.goo.gl/saQBZp8WNoPgTQ9t9"
                target="_blank"
                rel="noreferrer"
                className="pill-google-link"
                title="Open Bayazid in Google Maps"
                aria-label="Open Bayazid in Google Maps"
              >
                <FontAwesomeIcon icon={faDirections} className="google-icon" />
                <span>Google Maps</span>
              </a>
            </div>

            <MapContainer
              center={BAYAZID_COORDS}
              zoom={17}
              scrollWheelZoom={false}
              zoomControl={false}
              zoomSnap={0.5}
              zoomDelta={0.5}
              wheelPxPerZoomLevel={120}
              whenCreated={setMapInstance}
            >
              <TileLayer
                key={tileLayerKey}
                attribution=""
                url={currentTileUrl}
                subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
                tileSize={256}
                maxNativeZoom={MAP_TYPES[activeBaseType]?.maxNativeZoom || 20}
                maxZoom={MAP_TYPES[activeBaseType]?.maxZoom || 22}
                updateWhenIdle={false}
                updateWhenZooming={false}
                keepBuffer={6}
              />

              <Marker
                position={BAYAZID_COORDS}
                icon={redMarkerModernIcon}
                interactive={false}
              />
            </MapContainer>
          </div>
        </div>
      </div>
    </>
  )
}

export default Contact
