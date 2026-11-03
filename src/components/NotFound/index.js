import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useUi } from '../../context/UiContext'
import './index.scss'

const NotFound = () => {
  const { playSound } = useUi()

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.title = '404 - Page Not Found | Mahmud al Hasan'
    }
  }, [])

  return (
    <div className="container not-found-page">
      <div className="not-found-card">
        <span className="error-code">404</span>
        <h1 className="error-title">Page Not Found</h1>
        <p className="error-desc">
          The route you navigated to doesn&apos;t exist or may have been relocated.
        </p>
        <div className="error-actions">
          <Link to="/" className="btn-primary" onClick={() => playSound('click')}>
            ← Return to Home
          </Link>
          <Link to="/portfolio" className="btn-secondary" onClick={() => playSound('click')}>
            Browse Projects
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFound
