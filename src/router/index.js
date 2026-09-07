import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import LoginPage from '@/views/LoginPage.vue'
import DashboardPage from '@/views/DashboardPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
  path: '/login',
  name: 'login',
  component: LoginPage
},
{
  path: '/',
  name: 'dashboard',
  component: DashboardPage
},
  ],
})

router.beforeEach((to) => {
  const authStore = useAuthStore()

  if (!authStore.isAuthenticated && to.path !== '/login') {
    return '/login'
  }

  if (authStore.isAuthenticated && to.path === '/login') {
    return '/'
  }
})

export default router
