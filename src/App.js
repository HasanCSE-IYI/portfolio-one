import React, { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './components/Home'
import ScrollToTop from './components/ScrollToTop'
import './App.scss'

const About = lazy(() => import('./components/About'))
const Resume = lazy(() => import('./components/Resume'))
const Contact = lazy(() => import('./components/Contact'))
const Portfolio = lazy(() => import('./components/Portfolio'))
const NotFound = lazy(() => import('./components/NotFound'))

const PageFallback = () => (
  <div className="route-fallback-loader">
    <div className="loader-pulse-bar"></div>
  </div>
)

function App() {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="resume" element={<Resume />} />
            <Route path="contact" element={<Contact />} />
            <Route path="portfolio" element={<Portfolio />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  )
}

export default App
