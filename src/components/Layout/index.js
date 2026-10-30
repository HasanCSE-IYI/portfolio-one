import { Outlet } from 'react-router-dom'
import Sidebar from '../Sidebar/'
import './index.scss'

const Layout = () => {
  return (
    <div className="App">
      <a href="#main-content" className="skip-to-content-link">
        Skip to main content
      </a>
      <Sidebar />
      <main id="main-content" className="page" tabIndex={-1}>
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
