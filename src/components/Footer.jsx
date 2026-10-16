import { Logo } from './Nav.jsx'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div>
          <Logo />
          <p className="muted">Launch everywhere at once. Get your first users for ₹0.</p>
        </div>
        <nav className="footer__links" aria-label="Footer">
          <a href="#how">How it works</a>
          <a href="#platforms">Platforms</a>
          <a href="#faq">FAQ</a>
          <a href="#waitlist">Join waitlist</a>
        </nav>
      </div>
      <div className="container footer__bottom">
        <span>© {new Date().getFullYear()} Launchmania</span>
        <span>Platform list reviewed Oct 2026</span>
      </div>
    </footer>
  )
}
