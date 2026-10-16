import { useState } from 'react'
import { alreadyJoined, joinWaitlist } from '../lib/waitlist.js'
import { burst } from './LaunchGrid.jsx'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Compact one-field sign-up used in the hero.
export default function EmailCapture({ source }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | loading | done | error
  const [message, setMessage] = useState('')

  async function onSubmit(e) {
    e.preventDefault()
    if (!EMAIL_RE.test(email.trim())) {
      setStatus('error')
      setMessage('Enter a valid email address.')
      return
    }
    if (alreadyJoined(email)) {
      setStatus('done')
      setMessage("You're already on the list. We'll be in touch.")
      return
    }
    setStatus('loading')
    try {
      await joinWaitlist({ email, source })
      setStatus('done')
      burst()
      setMessage("You're in. Tell us about your product below to jump the queue.")
    } catch {
      setStatus('error')
      setMessage('Something went wrong. Please try again.')
    }
  }

  if (status === 'done') {
    return (
      <div className="capture capture--done" role="status">
        <span className="check" aria-hidden="true">✓</span>
        <span>{message}</span>
        <a href="#waitlist" className="link">Add details →</a>
      </div>
    )
  }

  return (
    <form className="capture" onSubmit={onSubmit} noValidate>
      <label htmlFor={`email-${source}`} className="sr-only">Email address</label>
      <input
        id={`email-${source}`}
        type="email"
        placeholder="founder@yourstartup.com"
        value={email}
        onChange={(e) => { setEmail(e.target.value); setStatus('idle') }}
        autoComplete="email"
        required
      />
      <button className="btn btn--primary" disabled={status === 'loading'}>
        {status === 'loading' ? 'Joining…' : 'Join the waitlist'}
      </button>
      {status === 'error' && <p className="capture__error" role="alert">{message}</p>}
    </form>
  )
}
