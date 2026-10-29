<template>
  <div class="about-page">
    <div class="page-container">
      <!-- 个人介绍卡片 -->
      <section class="profile-card">
        <div class="profile-header">
          <div class="avatar-wrapper">
            <img :src="avatar" alt="星辰 / 林昭南" class="avatar-img" />
          </div>
          <div class="profile-info">
            <h1 class="profile-name">星辰 · 林昭南</h1>
            <p class="profile-title">腾讯前端实习 · 2027 届 · 性能与 AI Agent</p>
            <p class="profile-motto">把慢链路压快，把模型变成能动手的运行时</p>
          </div>
        </div>
        <div class="profile-bio">
          <p>
            我是林昭南，广东工业大学计算机科学与技术在读（GPA 4.0 / 前 10%）。
            目前在腾讯参与 PC QQ Electron → Qt 原生渲染的 CSS 下沉架构，做过三七互娱海外客服后台与电信检察政务系统前端。
          </p>
          <p>
            关注 Vue 生态、性能优化、虚拟列表、流式 AI 交互，以及 AI Agent / MCP / RAG 等落地实践。
            这里记录可复用的工程复盘与可验证的结果，方便交流与求职展示。
          </p>
        </div>
        <div class="profile-actions">
          <router-link to="/resume" class="action-btn primary">查看完整简历</router-link>
          <router-link to="/projects" class="action-btn">项目作品集</router-link>
          <a href="mailto:3141163409@qq.com" class="action-btn">邮件联系</a>
        </div>
      </section>

      <!-- 社交链接 -->
      <section class="section">
        <h2 class="section-title">社交链接</h2>
        <div class="social-links">
          <a
            v-for="link in socialLinks"
            :key="link.name"
            :href="link.url"
            target="_blank"
            rel="noopener noreferrer"
            class="social-item"
          >
            <span class="social-icon">{{ link.icon }}</span>
            <div class="social-info">
              <span class="social-name">{{ link.name }}</span>
              <span class="social-desc">{{ link.desc }}</span>
            </div>
          </a>
        </div>
      </section>

      <!-- 技能栈 -->
      <section class="section">
        <h2 class="section-title">技能栈</h2>
        <div class="skills-grid">
          <div v-for="category in skillCategories" :key="category.name" class="skill-category">
            <h3 class="category-name">{{ category.name }}</h3>
            <div class="skill-tags">
              <span v-for="skill in category.skills" :key="skill" class="skill-tag">{{ skill }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- 近期关注 -->
      <section class="section">
        <h2 class="section-title">近期关注</h2>
        <div class="hobbies-grid">
          <div v-for="item in focusItems" :key="item.name" class="hobby-item">
            <span class="hobby-icon">{{ item.icon }}</span>
            <span class="hobby-name">{{ item.name }}</span>
          </div>
        </div>
      </section>

      <!-- 联系方式 -->
      <section class="section">
        <h2 class="section-title">联系我</h2>
        <p class="contact-text">实习 / 技术交流 / 合作意向，欢迎通过以下方式联系：</p>
        <div class="contact-methods">
          <a class="contact-item" href="mailto:3141163409@qq.com">
            <span class="contact-icon">📧</span>
            <span class="contact-value">3141163409@qq.com</span>
          </a>
          <a class="contact-item" href="https://github.com/xingchen-boot" target="_blank" rel="noopener noreferrer">
            <span class="contact-icon">🐙</span>
            <span class="contact-value">GitHub · xingchen-boot</span>
          </a>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
/**
 * 关于页：博客人设「星辰」+ 真实履历摘要
 * 完整经历见 /resume
 */
import avatar from '../assets/20230311003752_5b225.thumb.400_0.jpg'

const socialLinks = [
  { name: 'GitHub', icon: '🐙', url: 'https://github.com/xingchen-boot', desc: '开源项目与代码' },
  { name: '问卷易', icon: '📋', url: 'https://wj.denglu1.cn/', desc: '校团队问卷调查系统' },
]

/** 与简历「专业技能」对齐的精简版 */
const skillCategories = [
  {
    name: '前端框架',
    skills: ['Vue 2 / Vue 3', 'TypeScript', 'Vue Router', 'Pinia / Vuex'],
  },
  {
    name: '工程与性能',
    skills: ['Vite', 'Webpack', '虚拟列表', 'Web Worker', 'Profiling'],
  },
  {
    name: 'AI 与 Agent',
    skills: ['OpenAI SDK', 'MCP', 'Function Calling', 'RAG'],
  },
  {
    name: '跨端与基础',
    skills: ['Electron', 'Qt 渲染链路', 'Node.js', 'HTTP / 浏览器原理'],
  },
]

/** 兴趣改为「近期关注」，更贴合求职向人设 */
const focusItems = [
  { name: 'CSS Runtime', icon: '🧩' },
  { name: '性能优化', icon: '⚡' },
  { name: 'AI Agent', icon: '🤖' },
  { name: '流式交互', icon: '🌊' },
  { name: '工程化', icon: '🛠️' },
  { name: '博客写作', icon: '✍️' },
]
</script>

<style scoped>
.about-page {
  padding: 40px 24px;
}

.page-container {
  max-width: 700px;
  margin: 0 auto;
}

.profile-card {
  background: var(--color-bg-card);
  border-radius: 16px;
  border: 1px solid var(--color-border);
  padding: 32px;
  margin-bottom: 32px;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 24px;
}

.avatar-wrapper {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid var(--color-primary);
  box-shadow: 0 0 20px rgba(91, 141, 239, 0.2);
  flex-shrink: 0;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-name {
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 4px;
}

.profile-title {
  font-size: 0.95rem;
  color: var(--color-primary);
  margin-bottom: 4px;
}

.profile-motto {
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  font-style: italic;
}

.profile-bio p {
  font-size: 0.95rem;
  color: var(--color-text-secondary);
  line-height: 1.8;
  margin-bottom: 12px;
}

.profile-bio p:last-child {
  margin-bottom: 0;
}

.profile-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 24px;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 18px;
  border-radius: 999px;
  font-size: 0.88rem;
  text-decoration: none;
  border: 1px solid var(--color-border);
  color: var(--color-text);
  transition: all 0.2s ease;
}

.action-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.action-btn.primary {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: #fff;
}

.action-btn.primary:hover {
  opacity: 0.9;
  color: #fff;
}

.section {
  margin-bottom: 32px;
}

.section-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--color-border);
}

.social-links {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.social-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  background: var(--color-bg-card);
  border-radius: 12px;
  border: 1px solid var(--color-border);
  text-decoration: none;
  transition: all 0.3s ease;
}

.social-item:hover {
  border-color: var(--color-primary);
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(91, 141, 239, 0.1);
}

.social-icon {
  font-size: 1.5rem;
}

.social-info {
  display: flex;
  flex-direction: column;
}

.social-name {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-text);
}

.social-desc {
  font-size: 0.8rem;
  color: var(--color-text-secondary);
}

.skills-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.skill-category {
  background: var(--color-bg-card);
  border-radius: 12px;
  border: 1px solid var(--color-border);
  padding: 20px;
}

.category-name {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 12px;
}

.skill-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.skill-tag {
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.8rem;
  background: var(--color-primary-light);
  color: var(--color-primary);
  border: 1px solid transparent;
  transition: all 0.2s ease;
}

.skill-tag:hover {
  border-color: var(--color-primary);
  background: var(--color-primary);
  color: #fff;
}

.hobbies-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.hobby-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px;
  background: var(--color-bg-card);
  border-radius: 12px;
  border: 1px solid var(--color-border);
  transition: all 0.3s ease;
}

.hobby-item:hover {
  border-color: var(--color-primary);
  transform: translateY(-2px);
}

.hobby-icon {
  font-size: 1.5rem;
}

.hobby-name {
  font-size: 0.9rem;
  color: var(--color-text);
}

.contact-text {
  font-size: 0.9rem;
  color: var(--color-text-secondary);
  margin-bottom: 16px;
}

.contact-methods {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  background: var(--color-bg-card);
  border-radius: 12px;
  border: 1px solid var(--color-border);
  text-decoration: none;
  transition: border-color 0.2s ease;
}

.contact-item:hover {
  border-color: var(--color-primary);
}

.contact-icon {
  font-size: 1.2rem;
}

.contact-value {
  font-size: 0.9rem;
  color: var(--color-text);
}

@media (max-width: 768px) {
  .profile-header {
    flex-direction: column;
    text-align: center;
  }

  .profile-actions {
    justify-content: center;
  }

  .hobbies-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
