import { db, firebaseConfigured } from './firebase.js'

const LOCAL_KEY = 'launchmania-waitlist'

// Field names and max lengths; firestore.rules enforces the same list.
const FIELDS = {
  email: 254,
  name: 100,
  productUrl: 300,
  productType: 60,
  stage: 60,
  audience: 20,
  willingToPay: 20,
  source: 30,
  referrer: 500,
}

function saveLocally(entry) {
  try {
    const list = JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]')
    list.push(entry)
    localStorage.setItem(LOCAL_KEY, JSON.stringify(list))
  } catch {
    // Storage can be blocked (private mode); the remote write still counts.
  }
}

export function alreadyJoined(email) {
  try {
    const list = JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]')
    return list.some((e) => e.email === email.trim().toLowerCase())
  } catch {
    return false
  }
}

export async function joinWaitlist(fields) {
  const raw = {
    ...fields,
    email: fields.email.trim().toLowerCase(),
    source: fields.source || 'website',
    referrer: document.referrer || '',
  }
  const entry = {}
  for (const [k, max] of Object.entries(FIELDS)) {
    if (raw[k]) entry[k] = String(raw[k]).trim().slice(0, max)
  }

  if (firebaseConfigured) {
    const { db: store, fs } = await db()
    await fs.addDoc(fs.collection(store, 'waitlist'), { ...entry, createdAt: fs.serverTimestamp() })
  } else {
    console.warn('[waitlist] Firebase is not configured. Sign-up only saved in this browser.', entry)
  }

  saveLocally(entry)
  return entry
}
