import { computed, ref } from 'vue'
import {
  GoogleAuthProvider,
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  updateProfile,
} from 'firebase/auth'
import { auth, firebaseConfigured } from '../services/firebase'

const currentUser = ref(null)
const authLoading = ref(firebaseConfigured)

let resolveAuthReady
export const authReady = new Promise((resolve) => { resolveAuthReady = resolve })
let authReadyResolved = false

function finishAuthInitialisation() {
  if (authReadyResolved) return
  authReadyResolved = true
  authLoading.value = false
  resolveAuthReady()
}

if (auth) {
  onAuthStateChanged(auth, (user) => {
    currentUser.value = user
    finishAuthInitialisation()
  }, finishAuthInitialisation)
  setPersistence(auth, browserLocalPersistence).catch(() => {})
  window.setTimeout(finishAuthInitialisation, 2500)
} else {
  finishAuthInitialisation()
}

function requireAuth() {
  if (!auth) throw new Error('Firebase is not configured. Add the required values to your local .env file.')
  return auth
}

function friendlyAuthError(error) {
  const messages = {
    'auth/email-already-in-use': 'An account already exists for this email address.',
    'auth/invalid-credential': 'The email address or password is incorrect.',
    'auth/invalid-email': 'Enter a valid email address.',
    'auth/popup-closed-by-user': 'Google sign-in was cancelled before it finished.',
    'auth/popup-blocked': 'The browser blocked the Google sign-in window. Allow pop-ups and try again.',
    'auth/too-many-requests': 'Too many attempts. Please wait a moment before trying again.',
    'auth/weak-password': 'Use a password with at least six characters.',
  }
  return messages[error?.code] || error?.message || 'Authentication could not be completed. Please try again.'
}

export function useAuth() {
  async function register({ name, email, password }) {
    try {
      const credential = await createUserWithEmailAndPassword(requireAuth(), email, password)
      await updateProfile(credential.user, { displayName: name.trim() })
      await credential.user.reload()
      currentUser.value = requireAuth().currentUser
      return credential.user
    } catch (error) {
      throw new Error(friendlyAuthError(error))
    }
  }

  async function signIn(email, password) {
    try {
      return (await signInWithEmailAndPassword(requireAuth(), email, password)).user
    } catch (error) {
      throw new Error(friendlyAuthError(error))
    }
  }

  async function signInWithGoogle() {
    try {
      const provider = new GoogleAuthProvider()
      provider.setCustomParameters({ prompt: 'select_account' })
      return (await signInWithPopup(requireAuth(), provider)).user
    } catch (error) {
      throw new Error(friendlyAuthError(error))
    }
  }

  async function sendPasswordReset(email) {
    try {
      await sendPasswordResetEmail(requireAuth(), email)
    } catch (error) {
      throw new Error(friendlyAuthError(error))
    }
  }

  async function signOut() {
    await firebaseSignOut(requireAuth())
  }

  return {
    currentUser: computed(() => currentUser.value),
    isAuthenticated: computed(() => Boolean(currentUser.value)),
    authLoading: computed(() => authLoading.value),
    firebaseConfigured,
    register,
    signIn,
    signInWithGoogle,
    sendPasswordReset,
    signOut,
  }
}
