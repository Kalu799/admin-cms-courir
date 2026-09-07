import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import LoginPage from '@/views/LoginPage.vue'
import DashboardPage from '@/views/DashboardPage.vue'
import ProgrammesPage from '@/views/ProgrammesPage.vue'
import UsersPage from '@/views/UsersPage.vue'
import UserDetailPage from '@/views/UserDetailPage.vue'

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
      component: ProgrammesPage
    },
    {
      path: '/users',
      name: 'users',
      component: UsersPage
    },
    {
      path: '/users/:id',
      name: 'user-detail',
      component: UserDetailPage
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
