import { useEffect, useMemo, useState } from 'react'
import { db } from '../lib/firebase.js'
import { Logo } from '../components/Nav.jsx'

const DAY = 86400000

// One row per email: the latest non-empty value of each field wins, so a
// hero sign-up followed by the full form shows up as a single founder.
function mergeByEmail(docs) {
  const map = new Map()
  for (const d of [...docs].sort((a, b) => a.at - b.at)) {
    const prev = map.get(d.email)
    if (!prev) {
      map.set(d.email, { ...d, firstAt: d.at, submissions: 1 })
      continue
    }
    for (const [k, v] of Object.entries(d)) if (v) prev[k] = v
    prev.firstAt = Math.min(prev.firstAt, d.at)
    prev.submissions += 1
  }
  return [...map.values()].sort((a, b) => b.firstAt - a.firstAt)
}

function tally(rows, key) {
  const m = new Map()
  for (const r of rows) {
    const k = r[key] || 'Not given'
    m.set(k, (m.get(k) || 0) + 1)
  }
  return [...m.entries()].sort((a, b) => b[1] - a[1])
}

const fmtDate = (t) => new Date(t).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })

function toCsv(rows) {
  const cols = ['firstAt', 'name', 'email', 'productUrl', 'productType', 'stage', 'audience', 'willingToPay', 'source', 'submissions', 'referrer']
  const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`
  const lines = rows.map((r) => cols.map((c) => esc(c === 'firstAt' ? new Date(r.firstAt).toISOString() : r[c])).join(','))
  return [cols.join(','), ...lines].join('\n')
}

function Breakdown({ title, data, total }) {
  return (
    <div className="acard">
      <h3>{title}</h3>
      <ul className="abreak">
        {data.map(([k, n]) => (
          <li key={k}>
            <span className="abreak__k">{k}</span>
            <span className="abreak__track"><span style={{ width: `${(n / Math.max(total, 1)) * 100}%` }} /></span>
            <span className="abreak__n">{n}</span>
          </li>
        ))}
        {!data.length && <li className="muted">No data yet.</li>}
      </ul>
    </div>
  )
}

export default function Dashboard({ user, onSignOut }) {
  const [docs, setDocs] = useState([])
  const [status, setStatus] = useState('loading')
  const [q, setQ] = useState('')
  const [type, setType] = useState('')
  const [limit, setLimit] = useState(50)

  useEffect(() => {
    let unsub = () => {}
    db().then(({ db: store, fs }) => {
      const query = fs.query(fs.collection(store, 'waitlist'), fs.orderBy('createdAt', 'desc'), fs.limit(5000))
      unsub = fs.onSnapshot(
        query,
        (snap) => {
          setDocs(snap.docs.map((d) => {
            const data = d.data()
            return { id: d.id, ...data, at: data.createdAt?.toMillis?.() ?? Date.now() }
          }))
          setStatus('ready')
        },
        () => setStatus('error'),
      )
    })
    return () => unsub()
  }, [])

  const founders = useMemo(() => mergeByEmail(docs), [docs])

  const stats = useMemo(() => {
    const now = Date.now()
    const week = founders.filter((f) => now - f.firstAt < 7 * DAY).length
    const prevWeek = founders.filter((f) => now - f.firstAt >= 7 * DAY && now - f.firstAt < 14 * DAY).length
    const detailed = founders.filter((f) => f.productType).length
    const pay = founders.filter((f) => f.willingToPay === 'Yes' || f.willingToPay === 'Maybe').length
    return { total: founders.length, week, prevWeek, detailed, pay }
  }, [founders])

  const days = useMemo(() => {
    const start = new Date()
    start.setHours(0, 0, 0, 0)
    const out = Array.from({ length: 30 }, (_, i) => ({ t: +start - (29 - i) * DAY, n: 0 }))
    for (const f of founders) {
      const i = Math.floor((f.firstAt - out[0].t) / DAY)
      if (i >= 0 && i < 30) out[i].n++
    }
    return out
  }, [founders])
  const maxDay = Math.max(1, ...days.map((d) => d.n))

  const filtered = founders.filter((f) => {
    if (type && f.productType !== type) return false
    if (!q) return true
    const s = q.toLowerCase()
    return [f.name, f.email, f.productUrl].some((v) => v?.toLowerCase().includes(s))
  })

  function exportCsv() {
    const blob = new Blob([toCsv(filtered)], { type: 'text/csv' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `launchmania-waitlist-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(a.href)
  }

  const pct = (n) => (stats.total ? Math.round((n / stats.total) * 100) : 0)
  const types = tally(founders, 'productType').map(([k]) => k).filter((k) => k !== 'Not given')

  return (
    <div className="admin">
      <header className="admin__bar">
        <div className="container admin__bar-inner">
          <Logo />
          <span className="tag tag--solid">Admin</span>
          <div className="admin__user">
            {user.photoURL && <img src={user.photoURL} alt="" width="28" height="28" referrerPolicy="no-referrer" />}
            <span>{user.email}</span>
            <button className="btn btn--ghost-dark btn--sm" onClick={onSignOut}>Sign out</button>
          </div>
        </div>
      </header>

      <main className="container admin__main">
        <div className="admin__head">
          <div>
            <p className="kicker">Waitlist</p>
            <h1>Is there demand?</h1>
          </div>
          <span className="admin__live"><span className="dot" /> Live</span>
        </div>

        {status === 'error' && (
          <p className="admin__error">Couldn’t load the waitlist. Check that firestore.rules is deployed and you’re signed in as the admin.</p>
        )}

        <div className="kpis admin__kpis">
          <div className="kpi kpi--accent"><span>Founders joined</span><strong>{stats.total}</strong></div>
          <div className="kpi"><span>Last 7 days</span><strong>{stats.week}</strong><em>{stats.prevWeek} the week before</em></div>
          <div className="kpi"><span>Gave full details</span><strong>{pct(stats.detailed)}%</strong><em>{stats.detailed} founders</em></div>
          <div className="kpi"><span>Would pay (yes / maybe)</span><strong>{pct(stats.pay)}%</strong><em>{stats.pay} founders</em></div>
        </div>

        <div className="acard">
          <div className="acard__head">
            <h3>Sign-ups, last 30 days</h3>
            <span className="muted">{days.reduce((s, d) => s + d.n, 0)} total</span>
          </div>
          <div className="adays">
            {days.map((d) => (
              <div key={d.t} className="adays__col" title={`${new Date(d.t).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}: ${d.n}`}>
                <span style={{ height: `${(d.n / maxDay) * 100}%` }} />
              </div>
            ))}
          </div>
          <div className="adays__axis">
            <span>{new Date(days[0].t).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
            <span>Today</span>
          </div>
        </div>

        <div className="agrid">
          <Breakdown title="Product type" data={tally(founders, 'productType')} total={stats.total} />
          <Breakdown title="Stage" data={tally(founders, 'stage')} total={stats.total} />
          <Breakdown title="Would pay for done-for-you" data={tally(founders, 'willingToPay')} total={stats.total} />
          <Breakdown title="Audience" data={tally(founders, 'audience')} total={stats.total} />
        </div>

        <div className="acard">
          <div className="acard__head">
            <h3>Founders <span className="muted">{filtered.length}</span></h3>
            <div className="atools">
              <input placeholder="Search name, email, URL" value={q} onChange={(e) => setQ(e.target.value)} />
              <select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="">All product types</option>
                {types.map((t) => <option key={t}>{t}</option>)}
              </select>
              <button className="btn btn--primary btn--sm" onClick={exportCsv} disabled={!filtered.length}>Export CSV</button>
            </div>
          </div>
          <div className="atable-wrap">
            <table className="atable">
              <thead>
                <tr>
                  <th>Joined</th><th>Founder</th><th>Product</th><th>Type</th><th>Stage</th><th>Audience</th><th>Would pay</th><th>Source</th>
                </tr>
              </thead>
              <tbody>
                {filtered.slice(0, limit).map((f) => (
                  <tr key={f.email}>
                    <td className="mono">{fmtDate(f.firstAt)}</td>
                    <td>
                      <strong>{f.name || '—'}</strong>
                      <a href={`mailto:${f.email}`} className="atable__email">{f.email}</a>
                    </td>
                    <td>{f.productUrl ? <a href={f.productUrl} target="_blank" rel="noopener noreferrer nofollow" className="link">{f.productUrl.replace(/^https?:\/\//, '')}</a> : '—'}</td>
                    <td>{f.productType || '—'}</td>
                    <td>{f.stage || '—'}</td>
                    <td>{f.audience || '—'}</td>
                    <td>{f.willingToPay ? <span className={`pay pay--${f.willingToPay.split(',')[0].split(' ')[0].toLowerCase()}`}>{f.willingToPay}</span> : '—'}</td>
                    <td className="mono">{f.source}{f.submissions > 1 ? ` ×${f.submissions}` : ''}</td>
                  </tr>
                ))}
                {status === 'loading' && <tr><td colSpan="8" className="muted">Loading…</td></tr>}
                {status === 'ready' && !filtered.length && <tr><td colSpan="8" className="muted">No sign-ups yet.</td></tr>}
              </tbody>
            </table>
          </div>
          {filtered.length > limit && (
            <button className="atable__more" onClick={() => setLimit((l) => l + 100)}>Show more ({filtered.length - limit} left)</button>
          )}
        </div>
      </main>
    </div>
  )
}
