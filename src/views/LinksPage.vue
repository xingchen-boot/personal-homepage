<template>
  <div class="links-page">
    <div class="page-container">
      <h1 class="page-title">更多站点</h1>
      <p class="page-subtitle">推荐的博客、工具和资源</p>

      <!-- 链接分类 -->
      <section v-for="category in linkCategories" :key="category.name" class="link-section">
        <h2 class="section-title">
          <span class="section-icon">{{ category.icon }}</span>
          {{ category.name }}
        </h2>
        <div class="links-grid">
          <component
            :is="isLocalHostUrl(link.url) ? 'button' : 'a'"
            v-for="link in category.links"
            :key="link.name"
            class="link-card"
            :class="{ local: isLocalHostUrl(link.url) }"
            v-bind="
              isLocalHostUrl(link.url)
                ? { type: 'button', title: '仅本机可访问，点击复制地址' }
                : { href: link.url, target: '_blank', rel: 'noopener noreferrer' }
            "
            @click="isLocalHostUrl(link.url) && onLocalClick(link, $event)"
          >
            <div class="link-avatar">
              <img :src="link.avatar" :alt="link.name" />
            </div>
            <div class="link-info">
              <h3 class="link-name">
                {{ link.name }}
                <span v-if="isLocalHostUrl(link.url)" class="local-badge">
                  {{ copiedUrl === link.url ? '已复制' : '仅本机' }}
                </span>
              </h3>
              <p class="link-desc">{{ link.desc }}</p>
            </div>
          </component>
        </div>
      </section>

      <!-- 申请友链 -->
      <section class="apply-section">
        <h2 class="section-title">申请友链</h2>
        <div class="apply-card">
          <p class="apply-text">如果你也想和我交换友情链接，欢迎邮件联系：3141163409@qq.com</p>
          <div class="apply-info">
            <div class="info-item">
              <span class="info-label">博客名称：</span>
              <span class="info-value">星辰的博客</span>
            </div>
            <div class="info-item">
              <span class="info-label">博客地址：</span>
              <span class="info-value">{{ siteUrl }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">博客描述：</span>
              <span class="info-value">前端学习、技术实践与生活记录</span>
            </div>
            <div class="info-item">
              <span class="info-label">GitHub：</span>
              <a
                class="info-value link"
                href="https://github.com/xingchen-boot"
                target="_blank"
                rel="noopener noreferrer"
              >xingchen-boot</a>
            </div>
            <div class="info-item">
              <span class="info-label">RSS：</span>
              <a class="info-value link" href="/rss.xml" target="_blank" rel="noopener noreferrer">/rss.xml</a>
            </div>
            <div class="info-item">
              <span class="info-label">Sitemap：</span>
              <a class="info-value link" href="/sitemap.xml" target="_blank" rel="noopener noreferrer">/sitemap.xml</a>
            </div>
          </div>
          <p class="apply-note">请在你的博客上先添加我的链接，然后把你的博客信息发到邮箱即可 ~</p>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
/**
 * 友链页：申请信息中的博客地址随当前访问域名自动填充
 * 本机笔记链点击复制地址，避免访客跳进死链
 */
import { ref } from 'vue'
import { isLocalHostUrl, copyLocalUrl } from '../utils/localLink'

const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://github.com/xingchen-boot'
const copiedUrl = ref('')

/** 本地源码精读站（Astro，需本机 4321 在跑） */
const NOTES_BASE = 'http://127.0.0.1:4321'

async function onLocalClick(link, event) {
  event?.preventDefault?.()
  const ok = await copyLocalUrl(link.url)
  if (!ok) return
  copiedUrl.value = link.url
  window.setTimeout(() => {
    if (copiedUrl.value === link.url) copiedUrl.value = ''
  }, 1800)
}

const linkCategories = [
  {
    name: '我的源码精读',
    icon: '📖',
    links: [
      {
        name: 'Pi Agent 阅读指南',
        desc: '星辰笔记：Pi 源码精读 + 实战上手（仅本机 4321，点击复制地址）',
        url: `${NOTES_BASE}/mine/`,
        avatar: '/blog/link-pi.svg',
      },
      {
        name: 'dsh 源码精读',
        desc: '星辰笔记：DeepSeek Harness（仅本机 4321，点击复制地址）',
        url: `${NOTES_BASE}/modules/dsh-ch01`,
        avatar: '/blog/link-dsh.svg',
      },
      {
        name: '精读站首页',
        desc: '双轨目录（仅本机 4321，点击复制地址）',
        url: `${NOTES_BASE}/`,
        avatar: '/blog/link-notes.svg',
      },
      {
        name: 'earendil-works/pi',
        desc: 'Pi Agent 上游仓库',
        url: 'https://github.com/earendil-works/pi',
        avatar: 'https://picsum.photos/seed/pi-upstream/80/80',
      },
      {
        name: 'deepseek-ai/deepseek-harness',
        desc: 'DeepSeek Harness（dsh）上游仓库',
        url: 'https://github.com/deepseek-ai/deepseek-harness',
        avatar: 'https://picsum.photos/seed/dsh-upstream/80/80',
      },
      {
        name: 'dsh 官方文档',
        desc: 'DeepSeek Harness 官方 VitePress 文档',
        url: 'https://deepseek-harness.github.io/deepseek-harness/',
        avatar: 'https://picsum.photos/seed/dsh-docs/80/80',
      },
    ],
  },
  {
    name: '技术博客',
    icon: '📝',
    links: [
      { name: '阮一峰的网络日志', desc: '科技爱好者周刊，前端技术文章', url: 'https://www.ruanyifeng.com/blog/', avatar: 'https://picsum.photos/seed/blog1/80/80' },
      { name: '张鑫旭的博客', desc: 'CSS 专家，前端技术分享', url: 'https://www.zhangxinxu.com/', avatar: 'https://picsum.photos/seed/blog2/80/80' },
      { name: 'Anthony Fu', desc: 'Vue/Vite 核心团队成员', url: 'https://antfu.me/', avatar: 'https://picsum.photos/seed/blog3/80/80' },
      { name: '尤雨溪的博客', desc: 'Vue.js 创始人', url: 'https://evanyou.me/', avatar: 'https://picsum.photos/seed/blog4/80/80' },
    ],
  },
  {
    name: '开发工具',
    icon: '🔧',
    links: [
      { name: 'VS Code', desc: '最流行的代码编辑器', url: 'https://code.visualstudio.com/', avatar: 'https://picsum.photos/seed/tool1/80/80' },
      { name: 'GitHub', desc: '全球最大的代码托管平台', url: 'https://github.com/', avatar: 'https://picsum.photos/seed/tool2/80/80' },
      { name: 'Figma', desc: '设计协作工具', url: 'https://www.figma.com/', avatar: 'https://picsum.photos/seed/tool3/80/80' },
      { name: 'Vercel', desc: '前端部署平台', url: 'https://vercel.com/', avatar: 'https://picsum.photos/seed/tool4/80/80' },
    ],
  },
  {
    name: '学习资源',
    icon: '📚',
    links: [
      { name: 'MDN Web Docs', desc: '最权威的 Web 技术文档', url: 'https://developer.mozilla.org/', avatar: 'https://picsum.photos/seed/learn1/80/80' },
      { name: 'Vue.js 官方文档', desc: 'Vue 3 完整指南', url: 'https://vuejs.org/', avatar: 'https://picsum.photos/seed/learn2/80/80' },
      { name: '掘金', desc: '开发者社区', url: 'https://juejin.cn/', avatar: 'https://picsum.photos/seed/learn3/80/80' },
      { name: 'Stack Overflow', desc: '编程问答社区', url: 'https://stackoverflow.com/', avatar: 'https://picsum.photos/seed/learn4/80/80' },
    ],
  },
  {
    name: '设计灵感',
    icon: '🎨',
    links: [
      { name: 'Dribbble', desc: '设计师作品展示平台', url: 'https://dribbble.com/', avatar: 'https://picsum.photos/seed/design1/80/80' },
      { name: 'Behance', desc: '创意作品集平台', url: 'https://www.behance.net/', avatar: 'https://picsum.photos/seed/design2/80/80' },
      { name: 'Awwwards', desc: '优秀网页设计评选', url: 'https://www.awwwards.com/', avatar: 'https://picsum.photos/seed/design3/80/80' },
      { name: 'CSS Awards', desc: 'CSS 设计灵感', url: 'https://www.cssdesignawards.com/', avatar: 'https://picsum.photos/seed/design4/80/80' },
    ],
  },
]
</script>

<style scoped>
.links-page {
  padding: 40px 24px;
}

.page-container {
  max-width: 700px;
  margin: 0 auto;
}

.page-title {
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 8px;
}

.page-subtitle {
  font-size: 0.9rem;
  color: var(--color-text-secondary);
  margin-bottom: 40px;
}

/* 链接分类 */
.link-section {
  margin-bottom: 40px;
}

.section-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-icon {
  font-size: 1.2rem;
}

/* 链接网格 */
.links-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.link-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
  background: var(--color-bg-card);
  border-radius: 12px;
  border: 1px solid var(--color-border);
  text-decoration: none;
  color: inherit;
  text-align: left;
  font: inherit;
  width: 100%;
  cursor: pointer;
  transition: all 0.3s ease;
}

button.link-card {
  appearance: none;
}

.link-card:hover {
  border-color: var(--color-primary);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(91, 141, 239, 0.1);
}

.link-card.local {
  border-style: dashed;
}

.local-badge {
  display: inline-block;
  margin-left: 6px;
  padding: 1px 6px;
  font-size: 0.65rem;
  font-weight: 500;
  vertical-align: middle;
  border-radius: 999px;
  background: var(--color-primary-light);
  color: var(--color-primary);
}

.link-avatar {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  overflow: hidden;
  flex-shrink: 0;
}

.link-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.link-info {
  flex: 1;
  min-width: 0;
}

.link-name {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.link-desc {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 申请友链 */
.apply-section {
  margin-top: 40px;
}

.apply-card {
  background: var(--color-bg-card);
  border-radius: 16px;
  border: 1px solid var(--color-border);
  padding: 24px;
}

.apply-text {
  font-size: 0.9rem;
  color: var(--color-text-secondary);
  margin-bottom: 16px;
}

.apply-info {
  background: var(--color-bg);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
}

.info-item {
  display: flex;
  margin-bottom: 8px;
  font-size: 0.85rem;
}

.info-item:last-child {
  margin-bottom: 0;
}

.info-label {
  color: var(--color-text-secondary);
  min-width: 80px;
}

.info-value {
  color: var(--color-text);
  font-weight: 500;
}

.info-value.link {
  color: var(--color-primary);
  text-decoration: none;
}

.info-value.link:hover {
  text-decoration: underline;
}

.apply-note {
  font-size: 0.8rem;
  color: var(--color-text-muted);
  font-style: italic;
}

@media (max-width: 768px) {
  .links-grid {
    grid-template-columns: 1fr;
  }
}
</style>
