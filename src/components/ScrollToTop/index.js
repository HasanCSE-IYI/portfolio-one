import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const PAGE_TITLES = {
  '/': 'Mahmud al Hasan | Senior Backend Software Engineer',
  '/about': 'About Me | Mahmud al Hasan (8+ Years Backend Engineering)',
  '/resume': 'Executive Resume (CV) | Mahmud al Hasan',
  '/contact': 'Contact & Collaboration | Mahmud al Hasan',
  '/portfolio': 'Portfolio & Repositories | Mahmud al Hasan',
  '/focus': 'Focus Station · Ambient Workspace | Mahmud al Hasan',
  '/blog': 'Engineering Notes & Architecture Blog | Mahmud al Hasan',
}

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

    // Dynamic Route Titles for Accessibility (WCAG 2.4.2) and Browser History
    if (typeof document !== 'undefined') {
      if (PAGE_TITLES[pathname]) {
        document.title = PAGE_TITLES[pathname]
      } else if (pathname.startsWith('/blog/')) {
        document.title = 'Engineering Article | Mahmud al Hasan'
      } else {
        document.title = '404 - Page Not Found | Mahmud al Hasan'
      }
    }
  }, [pathname])

  return null
}

export default ScrollToTop
