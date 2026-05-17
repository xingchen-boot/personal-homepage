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
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/AboutPage.vue'),
  },
  {
    path: '/playlist',
    name: 'Playlist',
    component: () => import('../views/PlaylistPage.vue'),
  },
  {
    path: '/diary',
    name: 'Diary',
    component: () => import('../views/DiaryPage.vue'),
  },
  {
    path: '/links',
    name: 'Links',
    component: () => import('../views/LinksPage.vue'),
  },
  {
    // 404 页面 - 匹配所有未定义的路由
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFoundPage.vue'),
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
