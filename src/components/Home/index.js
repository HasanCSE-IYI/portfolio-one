import { useEffect, useState } from 'react'
import Loader from 'react-loaders'
import { Link } from 'react-router-dom'
import LogoTitle from '../../assets/images/logo-m.svg'
import AnimatedLetters from '../AnimatedLetters'
import './index.scss'
import Logo from './Logo'

const Home = () => {
  const [letterClass, setLetterClass] = useState('text-animate')

  const nameArray = ['a', 'h', 'm', 'u', 'd', ',']
  const jobArray = [
    's',
    'o',
    'f',
    't',
    'w',
    'a',
    'r',
    'e',
    ' ',
    'e',
    'n',
    'g',
    'i',
    'n',
    'e',
    'e',
    'r',
    '.',
  ]

  useEffect(() => {
    const timer = setTimeout(() => {
      setLetterClass('text-animate-hover')
    }, 4000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      <div className="container home-page">
        <div className="text-zone">
          <h1>
            <span className={letterClass}>H</span>
            <span className={`${letterClass} _12`}>i</span>
            <span className={`${letterClass} _13`}>,</span>
            <br />
            <span className={`${letterClass} _14`}>I</span>
            <span className={`${letterClass} _15`}>'</span>
            <span className={`${letterClass} _16`}>m</span>
            <img
              src={LogoTitle}
              alt="Mahmud al Hasan"
            />
            <AnimatedLetters
              letterClass={letterClass}
              strArray={nameArray}
              idx={15}
            />
            <br />
            <AnimatedLetters
              letterClass={letterClass}
              strArray={jobArray}
              idx={22}
            />
          </h1>
          <h2>Backend Software Engineer (8+ Years) | Laravel • NestJS • Focused on .NET</h2>
          <div className="cta-buttons">
            <Link to="/contact" className="flat-button">
              CONTACT ME
            </Link>
            <Link to="/portfolio" className="flat-button button-secondary">
              VIEW PROJECTS
            </Link>
          </div>
        </div>
        <Logo />
      </div>

      <Loader type="pacman" />
    </>
  )
}

export default Home
