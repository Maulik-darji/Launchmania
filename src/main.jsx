import React, { Suspense, lazy } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Nav from './components/Nav.jsx'
import Footer from './components/Footer.jsx'
import NotFound from './components/NotFound.jsx'
import './styles.css'

const Admin = lazy(() => import('./admin/Admin.jsx'))

const path = window.location.pathname.replace(/\/+$/, '') || '/'

function Root() {
  if (path === '/') return <App />
  if (path === '/admin') {
    return (
      <Suspense fallback={<div className="admin-loading" />}>
        <Admin />
      </Suspense>
    )
  }
  return (
    <>
      <Nav />
      <NotFound />
      <Footer />
    </>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
)
