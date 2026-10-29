import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'

/** 站点默认标题后缀 */
const SITE_TITLE = '「星辰」の个人主页'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
    meta: { title: '首页' },
  },
  {
    path: '/archive',
    name: 'Archive',
    component: () => import('../views/ArchivePage.vue'),
    meta: { title: '归档' },
  },
  {
    path: '/tags',
    name: 'Tags',
    component: () => import('../views/TagsPage.vue'),
    meta: { title: '标签' },
  },
  {
    path: '/blog/:id',
    name: 'BlogDetail',
    component: () => import('../views/BlogDetail.vue'),
    meta: { title: '文章' },
  },
  {
    path: '/resume',
    name: 'Resume',
    component: () => import('../views/ResumePage.vue'),
    meta: { title: '简历' },
  },
  {
    path: '/projects',
    name: 'Projects',
    component: () => import('../views/ProjectsPage.vue'),
    meta: { title: '项目' },
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/AboutPage.vue'),
    meta: { title: '关于' },
  },
  {
    path: '/playlist',
    name: 'Playlist',
    component: () => import('../views/PlaylistPage.vue'),
    meta: { title: '歌单' },
  },
  {
    path: '/diary',
    name: 'Diary',
    component: () => import('../views/DiaryPage.vue'),
    meta: { title: '日记' },
  },
  {
    path: '/links',
    name: 'Links',
    component: () => import('../views/LinksPage.vue'),
    meta: { title: '友链' },
  },
  {
    // 404 页面 - 匹配所有未定义的路由
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFoundPage.vue'),
    meta: { title: '页面未找到' },
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

/**
 * 根据路由 meta.title 更新浏览器标签页标题（SEO / 可读性）
 * 文章详情由页面加载后写入真实标题，这里不抢写成「文章 · …」
 */
router.afterEach((to) => {
  if (to.name === 'BlogDetail') {
    document.title = SITE_TITLE
    return
  }
  const pageTitle = to.meta?.title
  document.title = pageTitle ? `${pageTitle} · ${SITE_TITLE}` : SITE_TITLE
})

export default router
