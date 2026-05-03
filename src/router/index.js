import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
  },
  {
    path: '/archive',
    name: 'Archive',
    component: () => import('../views/ArchivePage.vue'),
  },
  {
    path: '/tags',
    name: 'Tags',
    component: () => import('../views/TagsPage.vue'),
  },
  {
    path: '/blog/:id',
    name: 'BlogDetail',
    component: () => import('../views/BlogDetail.vue'),
  },
  {
    path: '/resume',
    name: 'Resume',
    component: () => import('../views/ResumePage.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0 }
  },
})

export default router
