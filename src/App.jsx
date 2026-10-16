import { useEffect, useState } from 'react'
import Nav from './components/Nav.jsx'
import Hero from './components/Hero.jsx'
import Problem from './components/Problem.jsx'
import HowItWorks from './components/HowItWorks.jsx'
import Platforms from './components/Platforms.jsx'
import Sequence from './components/Sequence.jsx'
import Waitlist from './components/Waitlist.jsx'
import Faq from './components/Faq.jsx'
import Footer from './components/Footer.jsx'
import Demo from './demo/Demo.jsx'

function useHash() {
  const [hash, setHash] = useState(window.location.hash)
  useEffect(() => {
    const onChange = () => setHash(window.location.hash)
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return hash
}

const REVEAL = '.section__head, .grid--3 > *, .step, .tabs, .tabpanel, .excluded, .phase, .waitlist__copy, .waitlist__panel, .faq__list, .how__cta'

// Blocks start slightly zoomed in and settle to 1x as they enter the viewport.
function useReveal(key) {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const els = [...document.querySelectorAll(REVEAL)]
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-in')
          io.unobserve(e.target)
        }
      }),
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    )
    els.forEach((el) => {
      // Stagger siblings in the same row.
      const i = [...el.parentElement.children].indexOf(el)
      el.style.setProperty('--d', `${Math.min(i, 5) * 70}ms`)
      el.classList.add('reveal')
      io.observe(el)
    })
    return () => io.disconnect()
  }, [key])
}

export default function App() {
  const hash = useHash()
  const isDemo = hash.startsWith('#/demo')

  // Section links (#how, #waitlist…) may arrive from the demo page, where the
  // target isn't mounted yet, so scroll after the landing page renders.
  useEffect(() => {
    if (isDemo) {
      window.scrollTo(0, 0)
      return
    }
    const el = hash && document.getElementById(hash.slice(1))
    if (el) el.scrollIntoView()
  }, [hash, isDemo])

  useReveal(hash)

  return (
    <>
      <Nav />
      {isDemo ? (
        <Demo />
      ) : (
        <main>
          <Hero />
          <Problem />
          <HowItWorks />
          <Platforms />
          <Sequence />
          <Waitlist />
          <Faq />
        </main>
      )}
      <Footer />
    </>
  )
}
