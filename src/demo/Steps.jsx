import { useEffect, useMemo, useState } from 'react'
import { categories } from '../data/platforms.js'
import { recommended } from './Demo.jsx'

const productTypes = [
  'SaaS / Web app',
  'AI tool / AI agent',
  'Mobile app (Android / iOS)',
  'Developer tool / Open source',
  'Physical product / Hardware',
  'Other',
]

function domain(url) {
  return new URL(url).hostname.replace(/^www\./, '')
}

function Favicon({ url }) {
  return <img className="fav" src={`https://www.google.com/s2/favicons?domain=${domain(url)}&sz=64`} alt="" width="20" height="20" loading="lazy" />
}

function StepHead({ n, title, sub }) {
  return (
    <header className="dhead">
      <p className="kicker">Step {n} of 4</p>
      <h2>{title}</h2>
      <p className="muted">{sub}</p>
    </header>
  )
}

/* ---------- Step 1: details ---------- */

export function Details({ product, setProduct, onNext }) {
  const set = (k) => (e) => setProduct((p) => ({ ...p, [k]: e.target.value }))
  const initial = (product.name || '?').trim()[0]?.toUpperCase()

  return (
    <>
      <StepHead n={1} title="Tell us about your product, once." sub="This is the only form you fill. Edit the sample below and watch the preview update." />
      <div className="details">
        <div className="dform">
          <label className="dfield">
            <span>Product name</span>
            <input value={product.name} onChange={set('name')} maxLength={40} />
          </label>
          <label className="dfield">
            <span>Tagline <em>{product.tagline.length}/60</em></span>
            <input value={product.tagline} onChange={set('tagline')} maxLength={60} />
          </label>
          <label className="dfield">
            <span>Description <em>{product.description.length}/260</em></span>
            <textarea rows={4} value={product.description} onChange={set('description')} maxLength={260} />
          </label>
          <div className="dform__row">
            <label className="dfield">
              <span>Website</span>
              <input value={product.website} onChange={set('website')} />
            </label>
            <label className="dfield">
              <span>Product type</span>
              <select value={product.productType} onChange={set('productType')}>
                {productTypes.map((t) => <option key={t}>{t}</option>)}
              </select>
            </label>
          </div>
          <div className="dform__row">
            <label className="dfield">
              <span>Tags</span>
              <input value={product.tags} onChange={set('tags')} />
            </label>
            <label className="dfield">
              <span>Maker</span>
              <input value={product.maker} onChange={set('maker')} />
            </label>
          </div>
          <div className="dupload">
            <div className="dupload__box"><span>{initial}</span><small>Logo</small></div>
            <div className="dupload__box dupload__box--wide"><small>3 screenshots</small></div>
            <p className="muted">Uploads are resized for every platform automatically.</p>
          </div>
        </div>

        <div className="preview">
          <p className="preview__label">Live preview · how your listing looks</p>
          <article className="listing">
            <div className="listing__logo">{initial}</div>
            <div className="listing__body">
              <h3>{product.name || 'Your product'}</h3>
              <p className="listing__tag">{product.tagline || 'Your one-line tagline'}</p>
              <div className="listing__chips">
                {product.tags.split(',').map((t) => t.trim()).filter(Boolean).slice(0, 3).map((t) => <span key={t}>{t}</span>)}
              </div>
            </div>
            <div className="listing__vote"><span>▲</span><strong>0</strong></div>
          </article>
          <div className="listing__shot">
            <div className="shot__bar"><i /><i /><i /><span>{product.website}</span></div>
            <div className="shot__body">
              <div className="shot__line shot__line--lg" />
              <div className="shot__line" />
              <div className="shot__line shot__line--sm" />
              <div className="shot__grid"><div /><div /><div /></div>
            </div>
          </div>
          <p className="listing__desc">{product.description}</p>
          <ul className="adapt">
            <li><span>✓</span> Tagline trimmed to each platform's limit</li>
            <li><span>✓</span> Category mapped to each site's taxonomy</li>
            <li><span>✓</span> Long and short descriptions generated</li>
          </ul>
        </div>
      </div>
      <div className="dactions">
        <span />
        <button className="btn btn--primary" onClick={onNext} disabled={!product.name.trim()}>Continue — pick platforms →</button>
      </div>
    </>
  )
}

/* ---------- Step 2: choose ---------- */

export function Choose({ product, selected, setSelected, onBack, onNext }) {
  const recs = useMemo(() => new Set(recommended(product.productType)), [product.productType])

  const toggle = (name) =>
    setSelected((s) => {
      const next = new Set(s)
      next.has(name) ? next.delete(name) : next.add(name)
      return next
    })

  const setGroup = (items, on) =>
    setSelected((s) => {
      const next = new Set(s)
      items.forEach((p) => (on ? next.add(p.name) : next.delete(p.name)))
      return next
    })

  const hours = Math.round((selected.size * 45) / 60)

  return (
    <>
      <StepHead n={2} title="Pick where to launch." sub={`We pre-selected the best free platforms for a "${product.productType}". Paid-only sites are already filtered out.`} />

      <div className="choose__bar">
        <div><strong>{selected.size}</strong> platforms selected</div>
        <div><strong>~{hours} hrs</strong> of manual form-filling saved</div>
        <button className="btn btn--ghost-dark btn--sm" onClick={() => setSelected(new Set(recs))}>Reset to recommended</button>
      </div>

      {categories.map((c) => {
        const on = c.items.filter((p) => selected.has(p.name)).length
        return (
          <div key={c.id} className="cgroup">
            <div className="cgroup__head">
              <div>
                <h3>{c.label} <span className="muted">{on}/{c.items.length}</span></h3>
                <p className="muted">{c.how}</p>
              </div>
              <div className="cgroup__btns">
                <button onClick={() => setGroup(c.items, true)}>All</button>
                <button onClick={() => setGroup(c.items, false)}>None</button>
              </div>
            </div>
            <ul className="cgrid">
              {c.items.map((p) => {
                const isOn = selected.has(p.name)
                return (
                  <li key={p.name}>
                    <label className={`copt ${isOn ? 'is-on' : ''}`}>
                      <input type="checkbox" checked={isOn} onChange={() => toggle(p.name)} />
                      <span className="copt__box" aria-hidden="true">{isOn ? '✓' : ''}</span>
                      <Favicon url={p.url} />
                      <span className="copt__text">
                        <span className="copt__name">{p.name}</span>
                        <span className="copt__free">{p.free}</span>
                      </span>
                      {recs.has(p.name) && <span className="copt__rec">Rec</span>}
                    </label>
                  </li>
                )
              })}
            </ul>
          </div>
        )
      })}

      <div className="dactions">
        <button className="btn btn--ghost-dark" onClick={onBack}>← Back</button>
        <button className="btn btn--primary" onClick={onNext} disabled={!selected.size}>Launch on {selected.size} platforms →</button>
      </div>
    </>
  )
}

/* ---------- Step 3: launching ---------- */

export function Launching({ platforms, launched, onDone, onBack, onNext }) {
  const [started, setStarted] = useState(launched)
  const [done, setDone] = useState(launched ? platforms.length : 0)

  useEffect(() => {
    if (!started || done >= platforms.length) {
      if (started && done >= platforms.length) onDone()
      return
    }
    const t = setTimeout(() => setDone((d) => d + 1), 140)
    return () => clearTimeout(t)
  }, [started, done, platforms.length, onDone])

  const pct = platforms.length ? Math.round((done / platforms.length) * 100) : 0
  const finished = started && done >= platforms.length

  return (
    <>
      <StepHead n={3} title={finished ? 'Launched everywhere.' : 'Ready for lift-off.'} sub={finished ? 'Every submission is out. Community posts are drafted and waiting for you.' : `One click sends ${platforms.length} tailored submissions. In real life this runs in the background.`} />

      {!started ? (
        <div className="liftoff">
          <button className="liftoff__btn" onClick={() => setStarted(true)}>
            <span>▲</span>
            Launch now
          </button>
          <p className="muted">{platforms.length} platforms · 1 click · ₹0</p>
        </div>
      ) : (
        <>
          <div className="progress">
            <div className="progress__meta">
              <span>{finished ? 'All done' : `Submitting to ${platforms[done]?.name}…`}</span>
              <strong>{done}/{platforms.length}</strong>
            </div>
            <div className="progress__track"><div className="progress__fill" style={{ width: `${pct}%` }} /></div>
          </div>
          <ul className="log">
            {platforms.map((p, i) => {
              const state = i < done ? 'done' : i === done ? 'active' : 'wait'
              return (
                <li key={p.name} className={`log__row log__row--${state}`}>
                  <Favicon url={p.url} />
                  <span className="log__name">{p.name}</span>
                  <span className="log__state">
                    {state === 'done' ? (p.category === 'communities' ? 'Post drafted' : 'Submitted') : state === 'active' ? 'Working…' : 'Waiting'}
                  </span>
                </li>
              )
            })}
          </ul>
        </>
      )}

      <div className="dactions">
        <button className="btn btn--ghost-dark" onClick={onBack} disabled={started && !finished}>← Back</button>
        <button className="btn btn--primary" onClick={onNext} disabled={!finished}>Open dashboard →</button>
      </div>
    </>
  )
}

/* ---------- Step 4: dashboard ---------- */

const DAY = 86400000
const fmt = (d) => d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })

// Deterministic sample status per platform so the demo looks the same every time.
function statusFor(p, i) {
  const today = new Date()
  if (p.category === 'communities') return { key: 'draft', label: 'Draft ready', when: 'Post when you like' }
  if (p.name === 'Product Hunt') return { key: 'scheduled', label: 'Scheduled', when: `Launches ${fmt(new Date(+today + 7 * DAY))}` }
  if (/queue/i.test(p.free)) return { key: 'queue', label: 'In queue', when: `Est. ${fmt(new Date(+today + (14 + i * 3) * DAY))}` }
  if (/conditional|limited|via/i.test(p.free)) return { key: 'review', label: 'Under review', when: 'Usually 2–5 days' }
  return i % 3 === 2
    ? { key: 'review', label: 'Under review', when: 'Usually 2–5 days' }
    : { key: 'live', label: 'Live', when: `Since ${fmt(today)}` }
}

function sampleVisits(name) {
  let h = 0
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) % 997
  return 20 + (h % 180)
}

function drafts(product) {
  const url = product.website
  return [
    {
      where: 'Show HN',
      text: `Show HN: ${product.name} – ${product.tagline.toLowerCase()}\n\n${url}\n\nHi HN, I'm ${product.maker.split(' ')[0]}. ${product.description}\n\nI'd love blunt feedback on what's confusing or missing.`,
    },
    {
      where: 'r/SideProject',
      text: `I built ${product.name} to ${product.tagline.charAt(0).toLowerCase() + product.tagline.slice(1)}\n\n${product.description}\n\nIt's free to try: ${url}\nWhat would make you actually use this?`,
    },
    {
      where: 'LinkedIn',
      text: `Today we're launching ${product.name} 🚀\n\n${product.tagline}.\n\n${product.description}\n\nTry it → ${url}\n\n#${product.tags.split(',')[0].trim().replace(/\s+/g, '')} #buildinpublic`,
    },
  ]
}

export function Dashboard({ product, platforms, onRestart }) {
  const rows = platforms.map((p, i) => ({ ...p, status: statusFor(p, i) }))
  const count = (k) => rows.filter((r) => r.status.key === k).length
  const [copied, setCopied] = useState('')
  const [filter, setFilter] = useState('all')

  const traffic = rows
    .filter((r) => r.status.key === 'live')
    .map((r) => ({ name: r.name, v: sampleVisits(r.name) }))
    .sort((a, b) => b.v - a.v)
    .slice(0, 6)
  const max = Math.max(...traffic.map((t) => t.v), 1)

  const shown = filter === 'all' ? rows : rows.filter((r) => r.status.key === filter)

  const copy = (d) => {
    navigator.clipboard?.writeText(d.text)
    setCopied(d.where)
    setTimeout(() => setCopied(''), 1600)
  }

  return (
    <>
      <StepHead n={4} title={`${product.name || 'Your product'} is out in the world.`} sub="Everything in one place: what's live, what's queued, and which platform actually brings users." />

      <div className="kpis">
        <div className="kpi"><span>Live</span><strong>{count('live')}</strong></div>
        <div className="kpi"><span>Scheduled / queued</span><strong>{count('scheduled') + count('queue')}</strong></div>
        <div className="kpi"><span>Under review</span><strong>{count('review')}</strong></div>
        <div className="kpi kpi--accent"><span>Drafts to post</span><strong>{count('draft')}</strong></div>
      </div>

      <div className="dash">
        <div className="dcard">
          <div className="dcard__head">
            <h3>Submissions</h3>
            <div className="filters">
              {[['all', 'All'], ['live', 'Live'], ['queue', 'Queued'], ['review', 'Review'], ['draft', 'Drafts']].map(([k, l]) => (
                <button key={k} className={filter === k ? 'is-on' : ''} onClick={() => setFilter(k)}>{l}</button>
              ))}
            </div>
          </div>
          <ul className="subs">
            {shown.map((r) => (
              <li key={r.name}>
                <Favicon url={r.url} />
                <span className="subs__name">{r.name}</span>
                <span className="subs__when">{r.status.when}</span>
                <span className={`status status--${r.status.key}`}>{r.status.label}</span>
              </li>
            ))}
            {!shown.length && <li className="muted">Nothing here.</li>}
          </ul>
        </div>

        <div className="dside">
          <div className="dcard">
            <div className="dcard__head">
              <h3>Sign-ups by platform</h3>
              <span className="tag">Sample</span>
            </div>
            {traffic.length ? (
              <ul className="bars">
                {traffic.map((t) => (
                  <li key={t.name}>
                    <span className="bars__name">{t.name}</span>
                    <span className="bars__track"><span className="bars__fill" style={{ width: `${(t.v / max) * 100}%` }} /></span>
                    <span className="bars__v">{t.v}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="muted">Shows up once listings go live.</p>
            )}
          </div>

          <div className="dcard">
            <div className="dcard__head">
              <h3>Community posts</h3>
              <span className="tag">You publish</span>
            </div>
            <div className="drafts">
              {drafts(product).map((d) => (
                <div key={d.where} className="draft">
                  <div className="draft__head">
                    <strong>{d.where}</strong>
                    <button onClick={() => copy(d)}>{copied === d.where ? 'Copied ✓' : 'Copy'}</button>
                  </div>
                  <pre>{d.text}</pre>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="dend">
        <div>
          <h3>That's the whole thing. One form, every platform.</h3>
          <p>Want Launchmania to do this for your real product?</p>
        </div>
        <div className="dend__btns">
          <button className="btn btn--ghost-dark" onClick={onRestart}>Restart demo</button>
          <a href="#waitlist" className="btn btn--dark">Join the waitlist</a>
        </div>
      </div>
    </>
  )
}
