import { ref } from 'vue'

const validUsername = 'librarian'
const validPassword = 'library123'

export const isAuthenticated = ref(false)

export const login = (username, password) => {
  isAuthenticated.value = username === validUsername && password === validPassword
  return isAuthenticated.value
}

export const logout = () => {
  isAuthenticated.value = false
}
