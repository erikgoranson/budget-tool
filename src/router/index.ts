import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue';
import { CircleDollarSign, Cog, Download, Link, PiggyBank, Wallet, GoalIcon, } from 'lucide-vue-next';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      meta: {
        layout: 'default',
        displayName: 'Budgets',
        icon: Wallet,
        sidebarVisible: true,
      },
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      meta: {
        layout: 'default',
        displayName: 'About'
      },
    },
    {
      path: '/:pathMatch(.*)*',
      name: '404',
      component: () => import('../views/404View.vue'),
      meta: {
        layout: 'default',
        displayName: '404 Error'
      },
    },
    {
      path: '/test1',
      name: 'test1',
      component: () => import('../views/Test1View.vue'),
      meta: {
        layout: 'default',
        displayName: 'Test'
      },
    },
    {
      path: '/transactions',
      name: 'transactions',
      component: () => import('../views/TransactionView.vue'),
      meta: {
        layout: 'default',
        displayName: 'Transactions',
        icon: CircleDollarSign,
        sidebarVisible: true,
      },
    },
    {
      path: '/goals',
      name: 'goals',
      component: () => import('../views/GoalsView.vue'),
      meta: {
        layout: 'default',
        displayName: 'Goals',
        icon: GoalIcon,
        sidebarVisible: true,
      },
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/SettingsView.vue'),
      meta: {
        layout: 'default',
        displayName: 'Settings',
        icon: Cog,
        sidebarVisible: true,
      },
    },
    {
      path: '/import',
      name: 'dataimport',
      component: () => import('../views/ImportView.vue'),
      meta: {
        layout: 'default',
        displayName: 'Import Data',
        sidebarVisible: false,
      },
    },
  ]
})

export default router
