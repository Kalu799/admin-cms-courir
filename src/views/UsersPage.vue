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

<style scoped>
.users-screen {
  min-height: 100%;
  padding: 32px 16px 48px;

  background-color: #f7f8f5;
  color: #022c4d;
}

.users-container {
  width: 100%;
  max-width: 900px;

  margin: 0 auto;
}

.users-container h1 {
  margin: 0 0 28px;

  font-size: 2rem;
  font-weight: 800;
}

.user-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;

  margin-bottom: 14px;
  padding: 18px 20px;

  border-radius: 14px;

  background-color: #ffffff;

  box-shadow:
    0 2px 8px rgb(2 44 77 / 5%),
    0 8px 24px rgb(2 44 77 / 6%);
}

.user-card strong {
  display: block;

  margin-bottom: 4px;

  font-size: 1.05rem;
  font-weight: 800;
}

.user-card p {
  margin: 0;

  color: #66757f;

  font-size: 0.9rem;
}

.user-card__link {
  flex-shrink: 0;

  padding: 9px 13px;

  border-radius: 10px;

  background-color: #f2f6ed;
  color: #022c4d;

  font-size: 0.85rem;
  font-weight: 700;

  text-decoration: none;
}
</style>