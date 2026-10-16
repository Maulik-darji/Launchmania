import { useEffect, useMemo, useState } from 'react'
import { categories } from '../data/platforms.js'
import { Details, Choose, Launching, Dashboard } from './Steps.jsx'

export const sampleProduct = {
  name: 'Notely AI',
  tagline: 'Turn messy meeting notes into clear action items',
  description:
    'Notely AI listens to your meetings, writes a clean summary and pulls out every action item with an owner and a due date. Works with Google Meet, Zoom and Teams.',
  website: 'https://notely.example',
  productType: 'AI tool / AI agent',
  tags: 'productivity, meetings, AI',
  maker: 'Aisha Patel',
}

// Which platforms we'd pre-select for each product type.
const skipFor = {
  'Developer tool / Open source': [],
  'Mobile app (Android / iOS)': ['DevHunt', 'GitHub', 'Hashnode', 'DEV Community', 'SourceForge'],
  'Physical product / Hardware': ['DevHunt', 'GitHub', 'Hashnode', 'DEV Community', 'SourceForge', 'G2', 'Capterra', 'GetApp', 'Software Advice', 'Alt Hunt', 'AlternativeTo', 'SaaSHub'],
}
const defaultSkip = ['DevHunt', 'GitHub']

export function recommended(productType) {
  const skip = skipFor[productType] ?? defaultSkip
  return categories.flatMap((c) => c.items.map((p) => p.name)).filter((n) => !skip.includes(n))
}

const steps = [
  { id: 'details', label: 'Product details', hint: 'One form' },
  { id: 'choose', label: 'Pick platforms', hint: 'Smart picks' },
  { id: 'launch', label: 'Launch', hint: 'One click' },
  { id: 'dashboard', label: 'Track results', hint: 'Dashboard' },
]

export default function Demo() {
  const [step, setStep] = useState(0)
  const [product, setProduct] = useState(sampleProduct)
  const [selected, setSelected] = useState(() => new Set(recommended(sampleProduct.productType)))
  const [launched, setLaunched] = useState(false)

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [step])

  const selectedList = useMemo(
    () => categories.flatMap((c) => c.items.filter((p) => selected.has(p.name)).map((p) => ({ ...p, category: c.id }))),
    [selected],
  )

  return (
    <main className="demo">
      <div className="demo__banner">
        <div className="container demo__banner-inner">
          <span className="tag tag--solid">Interactive demo</span>
          <span>Sample data only. Nothing is submitted anywhere.</span>
          <a href="#waitlist" className="link">Want this for your product? Join the waitlist →</a>
        </div>
      </div>

      <div className="container demo__layout">
        <aside className="demo__steps" aria-label="Demo steps">
          <p className="kicker">Launch flow</p>
          <ol>
            {steps.map((s, i) => {
              // Results only exist after the launch has run.
              const locked = i === 3 && !launched
              return (
                <li key={s.id}>
                  <button
                    className={`dstep ${i === step ? 'is-active' : ''} ${i < step ? 'is-done' : ''}`}
                    onClick={() => setStep(i)}
                    disabled={locked}
                  >
                    <span className="dstep__n">{i < step ? '✓' : i + 1}</span>
                    <span>
                      <span className="dstep__label">{s.label}</span>
                      <span className="dstep__hint">{s.hint}</span>
                    </span>
                  </button>
                </li>
              )
            })}
          </ol>
          <div className="demo__summary">
            <div><span>Product</span><strong>{product.name || '—'}</strong></div>
            <div><span>Platforms</span><strong>{selected.size}</strong></div>
            <div><span>Forms you fill</span><strong>1</strong></div>
          </div>
        </aside>

        <section className="demo__panel">
          {step === 0 && <Details product={product} setProduct={setProduct} onNext={() => setStep(1)} />}
          {step === 1 && (
            <Choose
              product={product}
              selected={selected}
              setSelected={setSelected}
              onBack={() => setStep(0)}
              onNext={() => setStep(2)}
            />
          )}
          {step === 2 && (
            <Launching
              platforms={selectedList}
              launched={launched}
              onDone={() => setLaunched(true)}
              onBack={() => setStep(1)}
              onNext={() => setStep(3)}
            />
          )}
          {step === 3 && <Dashboard product={product} platforms={selectedList} onRestart={() => { setLaunched(false); setStep(0) }} />}
        </section>
      </div>
    </main>
  )
}
