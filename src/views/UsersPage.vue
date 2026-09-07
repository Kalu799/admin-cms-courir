<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const users = ref([])
const loading = ref(true)
const errorMessage = ref('')

const getUsers = async () => {
  loading.value = true
  errorMessage.value = ''

  try {

    console.log(
      `${import.meta.env.VITE_API_URL}/api/admin/users`
    )

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/admin/users`,
      {
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error('Impossible de récupérer les coureurs')
    }

    users.value = await response.json()
  }
  catch (error) {
    errorMessage.value = error.message
  }
  finally {
    loading.value = false
  }
}

onMounted(() => {
  getUsers()
})
</script>

<template>
  <section class="users-screen">
    <div class="users-container">
      <h1>Coureurs</h1>

      <p v-if="loading">
        Chargement...
      </p>

      <p v-if="errorMessage">
        {{ errorMessage }}
      </p>

      <div v-for="user in users" :key="user.id" class="user-card">
        <strong>
          {{ user.login }}
        </strong>

        <p>
          Rôle : {{ user.role }}
        </p>

        <RouterLink :to="`/users/${user.id}`" class="user-card__link">
          Voir le détail
        </RouterLink>
      </div>
    </div>
  </section>
</template>