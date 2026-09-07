<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const authStore = useAuthStore()

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

    <div v-if="user">
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
    </div>
  </section>
</template>

<style scoped>
.user-detail__back {
  display: inline-block;
  margin-bottom: 20px;

  color: #022c4d;

  font-size: 0.9rem;
  font-weight: 700;

  text-decoration: none;
}

.user-detail__back:hover {
  text-decoration: underline;
}
</style>