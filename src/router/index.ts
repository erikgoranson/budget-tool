import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      meta: {
        layout: 'default',
      },
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      meta: {
        layout: 'default',
      },
    },
    {
      path: '/:pathMatch(.*)*',
      name: '404',
      component: () => import('../views/404View.vue')
    },
    {
      path: '/test1',
      name: 'test1',
      component: () => import('../views/Test1View.vue'),
      meta: {
        layout: 'dash',
      },
    },
    {
      path: '/transactions',
      name: 'transactions',
      component: () => import('../views/TransactionView.vue'),
      meta: {
        layout: 'dash',
      },
    },
  ]
})

export default router
