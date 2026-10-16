import { useEffect } from 'react'

export default function NotFound() {
  useEffect(() => {
    const prev = document.title
    document.title = '404 — Page not found · Launchmania'
    return () => { document.title = prev }
  }, [])

  return (
    <main className="notfound">
      <div className="container notfound__inner">
        <p className="notfound__code">404</p>
        <h1>This page didn’t make it to launch.</h1>
        <p className="muted">The page you’re looking for doesn’t exist or has moved.</p>
        <a href="/" className="btn btn--primary">Back to Launchmania</a>
      </div>
    </main>
  )
}
