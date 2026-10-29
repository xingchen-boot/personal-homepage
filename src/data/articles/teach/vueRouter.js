/** Vue Router：Pi 精读章法 */
export const vueRouterContent = `
![路由封面](/blog/cover-generic.svg "路由不只是换组件，而是URL与权限的契约")

> 会写 \`path + component\` 不等于会做路由。本文建立：**URL 是状态、导航守卫是门禁、懒加载是性能杠杆、嵌套路由是信息架构**。读完应能设计一套带登录门禁与标题同步的路由表，而不是把跳转写成 \`window.location\`。

---

## 一、路由表是产品信息架构

\`\`\`javascript
const routes = [
  { path: '/', name: 'home', component: Home, meta: { title: '首页' } },
  {
    path: '/app',
    component: AppLayout,
    meta: { requiresAuth: true },
    children: [
      { path: '', redirect: '/app/dashboard' },
      { path: 'dashboard', component: () => import('./Dashboard.vue') },
    ],
  },
  { path: '/login', component: Login },
]
\`\`\`

| 字段 | 用途 |
|------|------|
| name | 程序化导航的稳定句柄 |
| meta | 标题、权限、埋点等横切信息 |
| children | 嵌套 UI（侧栏布局不卸载） |

---

## 二、守卫：门禁放在哪

\`\`\`javascript
router.beforeEach((to) => {
  if (to.meta.requiresAuth && !store.user) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  document.title = to.meta.title ?? 'App'
})
\`\`\`

原则：

1. **鉴权集中**在全局或布局级，别每个页复制 \`if (!user)\`  
2. 登录后回到 \`redirect\`，别写死首页  
3. 异步鉴权要用返回值 / 回调形式，避免导航打断

---

## 三、懒加载与滚动行为

\`\`\`javascript
component: () => import('./Heavy.vue')
// scrollBehavior: ({ savedPosition }) => savedPosition || { top: 0 }
\`\`\`

懒加载换的是首包体积；滚动行为换的是「返回列表是否还在原处」——同属产品体验。

---

## 四、动态段与耦合

\`/users/:id\` 的参数是 URL 契约。组件内用 \`onBeforeRouteUpdate\` 处理「同组件不同 id」——只靠 \`onMounted\` 会漏。

---

## 五、怎么知道自己学会了

1. 为什么推荐 \`name\` 导航而不是手写长 path？  
2. \`meta.requiresAuth\` 放全局守卫还是页面 \`onMounted\`？  
3. 嵌套路由解决的 UI 问题是什么？  
4. 同组件切换 \`:id\` 为何要 \`beforeRouteUpdate\`？

---

## 小结

路由是 **URL ↔ 界面 ↔ 权限** 的契约。表结构清晰、守卫集中、懒加载按页切开，SPA 才既好维护又够快。
`

export default vueRouterContent
