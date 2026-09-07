import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('adminToken'))
  const user = ref(null)

  const isAuthenticated = computed(() => !!token.value)

  const login = async (login, password) => {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/auth/login`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          login,
          password,
        }),
      }
    )

    if (!response.ok) {
      throw new Error('Identifiants incorrects')
    }

    const data = await response.json()

    if (data.user.role !== 'admin') {
      throw new Error('Accès administrateur requis')
    }

    token.value = data.token
    user.value = data.user

    localStorage.setItem('adminToken', data.token)
  }

  const logout = () => {
    token.value = null
    user.value = null

    localStorage.removeItem('adminToken')
  }

  const fetchMe = async () => {
    if (!token.value) return

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/auth/me`,
      {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      }
    )

    if (!response.ok) {
      logout()
      return
    }

    const data = await response.json()

    if (data.role !== 'admin') {
      logout()
      return
    }

    user.value = data
  }

  return {
    token,
    user,
    isAuthenticated,
    login,
    logout,
    fetchMe,
  }
})