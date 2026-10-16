// Firebase is loaded on demand so the landing page stays light until someone
// actually signs up or opens /admin.

// Must match the address hard-coded in firestore.rules — the rules are what
// actually protect the data; this constant only decides what the UI shows.
export const ADMIN_EMAIL = 'maulik.darji2005@gmail.com'

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
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
