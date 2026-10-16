import { categories, totalPlatforms } from '../data/platforms.js'
import { useEffect, useRef } from 'react'
import EmailCapture from './EmailCapture.jsx'
import LaunchGrid from './LaunchGrid.jsx'

const ticker = categories.flatMap((c) => c.items.map((p) => p.name))

export default function Hero() {
  const content = useRef(null)

  // Content shrinks and fades as you scroll away: the second half of the zoom-out.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const el = content.current
        if (!el) return
        const p = Math.min(1, window.scrollY / (el.parentElement.offsetHeight || 1))
        el.style.setProperty('--sp', p.toFixed(3))
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf) }
  }, [])

  return (
    <section className="hero" id="top">
      <LaunchGrid />
      <div className="container hero__content" ref={content}>
        <p className="eyebrow">
          <span className="dot" /> Early access · Free for founders
        </p>
        <h1 className="hero__title">
          One form.<br />
          <span className="accent">{totalPlatforms} launch platforms.</span><br />
          Your first users.
        </h1>
        <p className="hero__sub">
          You built the product. Now you need people to use it. Fill in your startup details once and
          Launchmania submits it to Product Hunt, Peerlist, Uneed, AlternativeTo and every other platform
          that lets you launch for <strong>₹0</strong>.
        </p>

        <EmailCapture source="hero" />
        <a href="#/demo" className="hero__demo">
          <span className="hero__demo-play" aria-hidden="true">▶</span>
          Try the interactive demo
        </a>

        <dl className="hero__stats">
          <div>
            <dt>Platforms</dt>
            <dd>{totalPlatforms}</dd>
          </div>
          <div>
            <dt>Forms to fill</dt>
            <dd>1</dd>
          </div>
          <div>
            <dt>Cost to launch</dt>
            <dd>₹0</dd>
          </div>
          <div>
            <dt>Hours saved</dt>
            <dd>25+</dd>
          </div>
        </dl>
      </div>

      <div className="ticker" aria-hidden="true">
        <div className="ticker__track">
          {[...ticker, ...ticker].map((name, i) => (
            <span key={i}>{name}</span>
          ))}
        </div>
      </div>
    </section>
  )
}
