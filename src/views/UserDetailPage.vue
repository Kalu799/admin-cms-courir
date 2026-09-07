<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const route = useRoute()
const authStore = useAuthStore()
const router = useRouter()

const user = ref(null)
const loading = ref(true)
const errorMessage = ref('')

const getUser = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/admin/users/${route.params.id}`,
      {
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error('Impossible de récupérer le coureur')
    }

    user.value = await response.json()
  }
  catch (error) {
    errorMessage.value = error.message
  }
  finally {
    loading.value = false
  }
}

const deleteUser = async () => {
  const confirmed = window.confirm(
    `Voulez-vous vraiment supprimer l'utilisateur "${user.value.login}" ?`
  )

  if (!confirmed) return

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/admin/users/${user.value.id}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error('Impossible de supprimer cet utilisateur')
    }

    router.push('/users')
  }
  catch (error) {
    errorMessage.value = error.message
  }
}

onMounted(() => {
  getUser()
})
</script>

<template>
  <section>
    <p v-if="loading">
      Chargement...
    </p>

    <p v-if="errorMessage">
      {{ errorMessage }}
    </p>

    <RouterLink to="/users" class="user-detail__back">
      ← Retour aux coureurs
    </RouterLink>

    <section class="user-detail-screen">
      <div v-if="user" class="user-detail-card">
        <h1>{{ user.login }}</h1>

        <p>Rôle : {{ user.role }}</p>

        <p v-if="user.currentSeasonLabel">
          Programme : {{ user.currentSeasonLabel }}
        </p>

        <p v-if="user.currentWeekNumber">
          Semaine {{ user.currentWeekNumber }}
        </p>

        <p v-if="user.currentSessionLabel">
          Prochaine séance : {{ user.currentSessionLabel }}
        </p>

        <p v-if="!user.currentSessionId">
          Aucun programme en cours
        </p>

        <button v-if="user.role !== 'admin'" class="user-detail__delete" @click="deleteUser">
          Supprimer ce coureur
        </button>
      </div>
    </section>

  </section>
</template>

<style scoped>
.user-detail-screen {
  min-height: 100%;
  padding: 32px 16px 48px;

  background-color: #f7f8f5;
  color: #022c4d;
}

.user-detail-card {
  width: 100%;
  max-width: 600px;
  box-sizing: border-box;

  margin: 0 auto;
  padding: 28px;

  border-radius: 18px;

  background-color: #ffffff;

  box-shadow:
    0 2px 8px rgb(2 44 77 / 6%),
    0 12px 32px rgb(2 44 77 / 8%);
}

.user-detail__back {
  display: inline-block;

  margin-bottom: 24px;

  color: #022c4d;

  font-size: 0.9rem;
  font-weight: 700;

  text-decoration: none;
}

.user-detail-card h1 {
  margin: 0 0 20px;

  font-size: 1.8rem;
  font-weight: 800;
}

.user-detail-card p {
  margin: 0 0 10px;

  color: #52616c;
}

.user-detail__delete {
  margin-top: 28px;
  padding: 12px 16px;

  border: 1px solid #d95c5c;
  border-radius: 10px;

  background-color: #ffffff;
  color: #b43b3b;

  font: inherit;
  font-weight: 700;

  cursor: pointer;
}
</style>