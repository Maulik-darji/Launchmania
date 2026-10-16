import { useEffect, useState } from 'react'

export function Logo() {
  return (
    <a href="#top" className="logo" aria-label="Launchmania home">
      <svg width="22" height="22" viewBox="0 0 32 32" aria-hidden="true">
        <rect width="32" height="32" fill="var(--purple)" />
        <path d="M9 23V9h4v10h10v4z" fill="var(--bg)" />
      </svg>
      <span>Launchmania</span>
    </a>
  )
}

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const close = () => setOpen(false)

  return (
    <header className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
      <div className="container nav__inner">
        <Logo />
        <nav className={`nav__links ${open ? 'is-open' : ''}`} aria-label="Primary">
          <a href="#how" onClick={close}>How it works</a>
          <a href="#platforms" onClick={close}>Platforms</a>
          <a href="#sequence" onClick={close}>Launch plan</a>
          <a href="#faq" onClick={close}>FAQ</a>
          <a href="#/demo" onClick={close} className="nav__demo">See the demo</a>
          <a href="#waitlist" className="btn btn--primary btn--sm nav__cta-mobile" onClick={close}>Join waitlist</a>
        </nav>
        <a href="#waitlist" className="btn btn--primary btn--sm nav__cta">Join waitlist</a>
        <button
          className="nav__toggle"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <span /><span />
        </button>
      </div>
    </header>
  )
}
