import { ref } from 'vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

export const firebaseUser = ref(null)
export const firebaseRole = ref('guest')

const getRole = (user) => {
  if (!user) return 'guest'

  return user.email === import.meta.env.VITE_FIREBASE_ADMIN_EMAIL ? 'admin' : 'member'
}

export const startFirebaseAuthObserver = () => {
  const auth = getAuth()

  onAuthStateChanged(auth, (user) => {
    firebaseUser.value = user
    firebaseRole.value = getRole(user)
  })
}
