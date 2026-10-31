import React, { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './components/Home'
import Resume from './components/Resume'
import ScrollToTop from './components/ScrollToTop'
import ErrorBoundary from './components/ErrorBoundary'
import { FocusProvider } from './context/FocusContext'
import { UiProvider } from './context/UiContext'
import MiniPlayer from './components/Focus/MiniPlayer'
import './App.scss'

const About = lazy(() => import('./components/About'))
const Contact = lazy(() => import('./components/Contact'))
const Portfolio = lazy(() => import('./components/Portfolio'))
const Focus = lazy(() => import('./components/Focus'))
const Blog = lazy(() => import('./components/Blog'))
const NotFound = lazy(() => import('./components/NotFound'))

const PageFallback = () => (
  <div className="route-fallback-loader">
    <div className="loader-pulse-bar"></div>
  </div>
)

function App() {
  return (
    <ErrorBoundary>
      <UiProvider>
        <FocusProvider>
          <ScrollToTop />
          <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="about" element={<About />} />
                <Route path="resume" element={<Resume />} />
                <Route path="contact" element={<Contact />} />
                <Route path="portfolio" element={<Portfolio />} />
                <Route path="focus" element={<Focus />} />
                <Route path="blog" element={<Blog />} />
                <Route path="blog/:slug" element={<Blog />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </Suspense>
          <MiniPlayer />
        </FocusProvider>
      </UiProvider>
    </ErrorBoundary>
  )
}

export default App
