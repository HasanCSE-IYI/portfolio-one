import { useEffect, useState } from 'react'
import Loader from 'react-loaders'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { useRef } from 'react'
import emailjs from '@emailjs/browser'
import AnimatedLetters from '../AnimatedLetters'
import './index.scss'

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
          <p>
            I am interested in freelance opportunities - especially ambitious or
            large projects. However, if you have other request or question,
            don't hesitate to contact me using below form either.
          </p>
          <div className="contact-form">
            <form ref={form} onSubmit={sendEmail}>
              <ul>
                <li className="half">
                  <input placeholder="Name" type="text" name="name" required />
                </li>
                <li className="half">
                  <input
                    placeholder="Email"
                    type="email"
                    name="email"
                    required
                  />
                </li>
                <li>
                  <input
                    placeholder="Subject"
                    type="text"
                    name="subject"
                    required
                  />
                </li>
                <li>
                  <textarea placeholder="Message" name="message" required></textarea>
                </li>
                <li>
                  <input type="submit" className="flat-button" value="SEND" />
                </li>
              </ul>
            </form>
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
