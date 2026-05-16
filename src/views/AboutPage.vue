<template>
  <div class="about-page">
    <div class="page-container">
      <!-- 个人介绍卡片 -->
      <section class="profile-card">
        <div class="profile-header">
          <div class="avatar-wrapper">
            <img :src="avatar" alt="Avatar" class="avatar-img" />
          </div>
          <div class="profile-info">
            <h1 class="profile-name">星辰</h1>
            <p class="profile-title">前端开发爱好者</p>
            <p class="profile-motto">用代码创造美好体验</p>
          </div>
        </div>
        <div class="profile-bio">
          <p>热爱前端开发，喜欢探索新技术，用代码实现创意想法。目前专注于 Vue 生态，也在持续学习 React 和 TypeScript。</p>
          <p>这个博客是我的个人空间，用来记录学习笔记、技术总结和生活感悟。希望能帮到你 ~</p>
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

      <!-- 兴趣爱好 -->
      <section class="section">
        <h2 class="section-title">兴趣爱好</h2>
        <div class="hobbies-grid">
          <div v-for="hobby in hobbies" :key="hobby.name" class="hobby-item">
            <span class="hobby-icon">{{ hobby.icon }}</span>
            <span class="hobby-name">{{ hobby.name }}</span>
          </div>
        </div>
      </section>

      <!-- 联系方式 -->
      <section class="section">
        <h2 class="section-title">联系我</h2>
        <p class="contact-text">如果你有任何问题或合作意向，欢迎通过以下方式联系我：</p>
        <div class="contact-methods">
          <div class="contact-item">
            <span class="contact-icon">📧</span>
            <span class="contact-value">your-email@example.com</span>
          </div>
          <div class="contact-item">
            <span class="contact-icon">💬</span>
            <span class="contact-value">微信：your-wechat</span>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import avatar from '../assets/20230311003752_5b225.thumb.400_0.jpg'

const socialLinks = [
  { name: 'GitHub', icon: '🐙', url: 'https://github.com/xingchen-boot', desc: '开源项目和代码' },
  { name: '掘金', icon: '📘', url: 'https://juejin.cn', desc: '技术文章分享' },
  { name: '知乎', icon: '💡', url: 'https://zhihu.com', desc: '问答和思考' },
  { name: 'B站', icon: '📺', url: 'https://bilibili.com', desc: '视频内容' },
]

const skillCategories = [
  {
    name: '前端基础',
    skills: ['HTML5', 'CSS3', 'JavaScript', 'TypeScript'],
  },
  {
    name: '框架与库',
    skills: ['Vue 3', 'React', 'Vue Router', 'Pinia', 'Vite'],
  },
  {
    name: 'UI 与样式',
    skills: ['Element Plus', 'Tailwind CSS', 'SCSS', 'UnoCSS'],
  },
  {
    name: '工具与平台',
    skills: ['Git', 'GitHub', 'VS Code', 'Figma', 'Chrome DevTools'],
  },
  {
    name: '后端与数据库',
    skills: ['Node.js', 'Express', 'MySQL', 'MongoDB'],
  },
]

const hobbies = [
  { name: '编程', icon: '💻' },
  { name: '阅读', icon: '📚' },
  { name: '音乐', icon: '🎵' },
  { name: '游戏', icon: '🎮' },
  { name: '摄影', icon: '📷' },
  { name: '旅行', icon: '✈️' },
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

/* 个人介绍卡片 */
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

/* 通用区块 */
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

/* 社交链接 */
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

/* 技能栈 */
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

/* 兴趣爱好 */
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

/* 联系方式 */
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

  .hobbies-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
