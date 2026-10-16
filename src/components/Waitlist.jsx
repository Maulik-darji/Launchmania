import { useState } from 'react'
import { alreadyJoined, joinWaitlist } from '../lib/waitlist.js'
import { burst } from './LaunchGrid.jsx'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const productTypes = [
  'SaaS / Web app',
  'AI tool / AI agent',
  'Mobile app (Android / iOS)',
  'Developer tool / Open source',
  'Physical product / Hardware',
  'Other',
]

const stages = ['Idea', 'Building MVP', 'Live, no users yet', 'Live, some users']

const initial = { name: '', email: '', productUrl: '', productType: '', stage: '', audience: 'Worldwide', willingToPay: '' }

export default function Waitlist() {
  const [form, setForm] = useState(initial)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }))
    setErrors((er) => ({ ...er, [key]: undefined }))
  }

  function validate() {
    const er = {}
    if (!form.name.trim()) er.name = 'Tell us your name.'
    if (!EMAIL_RE.test(form.email.trim())) er.email = 'Enter a valid email address.'
    if (!form.productType) er.productType = 'Pick the closest match.'
    if (!form.stage) er.stage = 'Pick your current stage.'
    return er
  }

  async function onSubmit(e) {
    e.preventDefault()
    const er = validate()
    setErrors(er)
    if (Object.keys(er).length) return
    setStatus('loading')
    try {
      // A repeat email still sends, so the richer details reach the sheet.
      const repeat = alreadyJoined(form.email)
      await joinWaitlist({ ...form, source: repeat ? 'details-update' : 'waitlist-form' })
      setStatus('done')
      burst()
    } catch {
      setStatus('error')
    }
  }

  return (
    <section className="section section--purple" id="waitlist">
      <div className="container waitlist">
        <div className="waitlist__copy">
          <p className="kicker kicker--dark">Join the waitlist</p>
          <h2>Be first to launch everywhere at once.</h2>
          <p>
            We’re opening Launchmania to a small group of founders first. Early members get free launches,
            a hand-checked platform list for their product, and a say in what we build next.
          </p>
          <ul className="perks">
            <li>Free launch package for early members</li>
            <li>Personal platform shortlist for your product</li>
            <li>Launch-day post templates for HN, Reddit and LinkedIn</li>
          </ul>
        </div>

        <div className="waitlist__panel">
          {status === 'done' ? (
            <div className="success" role="status">
              <span className="success__mark" aria-hidden="true">✓</span>
              <h3>You’re on the list, {form.name.split(' ')[0]}.</h3>
              <p>
                We’ll email <strong>{form.email}</strong> when your spot opens. Know another founder stuck on
                getting users? Send them this page.
              </p>
              <button
                className="btn btn--ghost"
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.origin)
                }}
              >
                Copy link to share
              </button>
            </div>
          ) : (
            <form className="form" onSubmit={onSubmit} noValidate>
              <div className="form__row">
                <Field label="Your name" error={errors.name}>
                  <input value={form.name} onChange={set('name')} autoComplete="name" placeholder="Aisha Patel" />
                </Field>
                <Field label="Work email" error={errors.email}>
                  <input type="email" value={form.email} onChange={set('email')} autoComplete="email" placeholder="you@startup.com" />
                </Field>
              </div>

              <Field label="Product URL" hint="Optional">
                <input type="url" value={form.productUrl} onChange={set('productUrl')} placeholder="https://" />
              </Field>

              <div className="form__row">
                <Field label="What are you launching?" error={errors.productType}>
                  <select value={form.productType} onChange={set('productType')}>
                    <option value="">Select…</option>
                    {productTypes.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </Field>
                <Field label="Stage" error={errors.stage}>
                  <select value={form.stage} onChange={set('stage')}>
                    <option value="">Select…</option>
                    {stages.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </Field>
              </div>

              <fieldset className="field">
                <legend>Target audience</legend>
                <div className="segmented">
                  {['Worldwide', 'India', 'Both'].map((a) => (
                    <label key={a} className={form.audience === a ? 'is-active' : ''}>
                      <input type="radio" name="audience" value={a} checked={form.audience === a} onChange={set('audience')} />
                      {a}
                    </label>
                  ))}
                </div>
              </fieldset>

              <fieldset className="field">
                <legend>Would you pay for a done-for-you launch? <span className="hint">Optional</span></legend>
                <div className="segmented">
                  {['No, free only', 'Maybe', 'Yes'].map((a) => (
                    <label key={a} className={form.willingToPay === a ? 'is-active' : ''}>
                      <input type="radio" name="willingToPay" value={a} checked={form.willingToPay === a} onChange={set('willingToPay')} />
                      {a}
                    </label>
                  ))}
                </div>
              </fieldset>

              <button className="btn btn--dark btn--block" disabled={status === 'loading'}>
                {status === 'loading' ? 'Joining…' : 'Get early access'}
              </button>
              {status === 'error' && <p className="form__error" role="alert">Something went wrong. Please try again.</p>}
              <p className="form__note">No spam. One email when your spot opens.</p>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

function Field({ label, hint, error, children }) {
  return (
    <label className={`field ${error ? 'has-error' : ''}`}>
      <span className="field__label">
        {label} {hint && <span className="hint">{hint}</span>}
      </span>
      {children}
      {error && <span className="field__error">{error}</span>}
    </label>
  )
}
