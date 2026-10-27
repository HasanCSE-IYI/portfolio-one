import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const ScrollToTop = () => {
  const { pathname } = useLocation()

  // Prevent browser from automatically restoring scroll position on page reload
  useEffect(() => {
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      try {
        window.history.scrollRestoration = 'manual'
      } catch {
        // ignore in environments without history API support
      }
    }
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
      try {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'instant',
        })
      } catch (err) {
        try {
          window.scrollTo(0, 0)
        } catch {
          // ignore in testing environments without window.scrollTo support
        }
      }
    }
  }, [pathname])

  return null
}

export default ScrollToTop
