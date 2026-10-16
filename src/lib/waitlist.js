const ENDPOINT = import.meta.env.VITE_WAITLIST_ENDPOINT
const LOCAL_KEY = 'launchmania-waitlist'

export function hasEndpoint() {
  return Boolean(ENDPOINT)
}

function saveLocally(entry) {
  try {
    const list = JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]')
    list.push(entry)
    localStorage.setItem(LOCAL_KEY, JSON.stringify(list))
  } catch {
    // Storage can be blocked (private mode); the remote submit still counts.
  }
}

export function alreadyJoined(email) {
  try {
    const list = JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]')
    return list.some((e) => e.email === email.toLowerCase())
  } catch {
    return false
  }
}

// Sends the sign-up as form data so it works with Google Apps Script,
// Formspree, Sheet Monkey and most no-code form backends.
export async function joinWaitlist(fields) {
  const entry = {
    ...fields,
    email: fields.email.trim().toLowerCase(),
    source: fields.source || 'website',
    joinedAt: new Date().toISOString(),
    referrer: document.referrer || '',
  }

  if (ENDPOINT) {
    const body = new URLSearchParams(entry)
    await fetch(ENDPOINT, { method: 'POST', mode: 'no-cors', body })
  } else {
    console.warn('[waitlist] VITE_WAITLIST_ENDPOINT is not set. Sign-up only saved in this browser.', entry)
  }

  saveLocally(entry)
  return entry
}
