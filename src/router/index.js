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
    {
      path: '/programmes',
      name: 'programmes',
      component: () => import('@/views/ProgrammesPage.vue'),
    },
    {
      path: '/users',
      name: 'users',
      component: () => import('@/views/UsersPage.vue'),
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
