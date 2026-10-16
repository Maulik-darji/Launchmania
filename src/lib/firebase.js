// Firebase is loaded on demand so the landing page stays light until someone
// actually signs up or opens /admin.

// Must match the address hard-coded in firestore.rules — the rules are what
// actually protect the data; this constant only decides what the UI shows.
export const ADMIN_EMAIL = 'maulik.darji2005@gmail.com'

// Firebase web config is public by design (it ships in the bundle either way);
// firestore.rules is what protects the data, so it lives here, not in env vars.
const config = {
  apiKey: 'AIzaSyBCGI4rUUOVT2ZKECoUr4C1ZWL-PYV0xLQ',
  authDomain: 'launchmania.firebaseapp.com',
  projectId: 'launchmania',
  storageBucket: 'launchmania.firebasestorage.app',
  messagingSenderId: '131832975024',
  appId: '1:131832975024:web:1d489db4327c7592a03575',
}

export const firebaseConfigured = Boolean(config.apiKey && config.projectId && config.appId)

let appPromise

function app() {
  if (!firebaseConfigured) return Promise.reject(new Error('Firebase is not configured. See FIREBASE_SETUP.md.'))
  appPromise ??= import('firebase/app').then(({ initializeApp }) => initializeApp(config))
  return appPromise
}

export async function db() {
  const [a, fs] = await Promise.all([app(), import('firebase/firestore')])
  return { db: fs.getFirestore(a), fs }
}

export async function auth() {
  const [a, au] = await Promise.all([app(), import('firebase/auth')])
  return { auth: au.getAuth(a), au }
}

export function isAdmin(user) {
  if (!user || !user.emailVerified) return false
  const viaGoogle = user.providerData.some((p) => p.providerId === 'google.com')
  return viaGoogle && user.email?.toLowerCase() === ADMIN_EMAIL
}
