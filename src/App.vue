<script setup>
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const logout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <header class="app-header">

    <RouterLink v-if="authStore.isAuthenticated && route.path !== '/'" to="/" class="app-header__dashboard">
      ← Dashboard
    </RouterLink>

    <h1 class="app-header__title">
      Admin — Je cours pour ma forme
    </h1>

    <button v-if="authStore.isAuthenticated" class="app-header__logout" @click="logout">
      Se déconnecter
    </button>

  </header>

  <main class="app-main">
    <RouterView />
  </main>

  <footer class="app-footer">
    © Cepegra — 2026
  </footer>
</template>

<style scoped>
.app-header {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;

  min-height: 64px;
  padding: 10px 16px;

  background-color: #ffffff;
  border-bottom: 1px solid rgb(2 44 77 / 8%);
}

.app-header__logout {
  position: absolute;
  right: 16px;

  padding: 8px 12px;

  border: 1px solid #d6dde1;
  border-radius: 10px;

  background-color: #ffffff;
  color: #022c4d;

  font: inherit;
  font-size: 0.85rem;
  font-weight: 700;

  cursor: pointer;
}

.app-header__logout:active {
  transform: scale(0.97);
}

.app-header__title {
  margin: 0;

  color: #022c4d;

  font-size: 1rem;
  font-weight: 800;
  text-align: center;
}

.app-header__dashboard {
  position: absolute;
  left: 16px;

  padding: 8px 12px;

  border-radius: 10px;

  background-color: #f2f6ed;
  color: #022c4d;

  font-size: 0.85rem;
  font-weight: 700;

  text-decoration: none;
}

.app-header__dashboard:active {
  transform: scale(0.97);
}

.app-main {
  min-height: calc(100dvh - 112px);

  background-color: #f7f8f5;
}

.app-footer {
  padding: 14px 16px;

  background-color: #f7f8f5;
  color: #73808a;

  text-align: center;
  font-size: 0.8rem;
}
</style>