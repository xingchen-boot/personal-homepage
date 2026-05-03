<template>
  <div class="resume-page">
    <header class="resume-header">
      <router-link to="/" class="back-link">← 返回首页</router-link>
      <h1 class="page-title">个人简历</h1>
    </header>

    <!-- 基本信息 -->
    <section class="resume-section">
      <div class="profile-card">
        <div class="profile-avatar">
          <div class="avatar-placeholder">⭐</div>
        </div>
        <div class="profile-info">
          <h2 class="profile-name">星辰</h2>
          <p class="profile-title">前端实习生</p>
          <p class="profile-bio">热爱前端开发，喜欢用代码创造美好的用户体验。有两段实习经历，参加过数学建模大赛和蓝桥杯。</p>
        </div>
      </div>
    </section>

    <!-- 技能 -->
    <section class="resume-section">
      <h3 class="section-title">技能</h3>
      <div class="skills-grid">
        <div v-for="skill in skills" :key="skill.name" class="skill-item">
          <span class="skill-name">{{ skill.name }}</span>
          <div class="skill-bar">
            <div class="skill-fill" :style="{ width: skill.level + '%' }"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- 实习经历 -->
    <section class="resume-section">
      <h3 class="section-title">实习经历</h3>
      <div class="experience-list">
        <div v-for="exp in experiences" :key="exp.company" class="experience-item">
          <div class="exp-header">
            <h4 class="exp-company">{{ exp.company }}</h4>
            <span class="exp-period">{{ exp.period }}</span>
          </div>
          <p class="exp-role">{{ exp.role }}</p>
          <p class="exp-desc">{{ exp.description }}</p>
        </div>
      </div>
    </section>

    <!-- 荣誉奖项 -->
    <section class="resume-section">
      <h3 class="section-title">荣誉奖项</h3>
      <div class="awards-list">
        <div v-for="award in awards" :key="award.title" class="award-item">
          <span class="award-icon">{{ award.icon }}</span>
          <div class="award-info">
            <h4 class="award-title">{{ award.title }}</h4>
            <p class="award-level">{{ award.level }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
const skills = [
  { name: 'HTML5', level: 90 },
  { name: 'CSS3', level: 85 },
  { name: 'JavaScript', level: 80 },
  { name: 'Vue 3', level: 85 },
  { name: 'React', level: 50 },
  { name: 'TypeScript', level: 60 },
  { name: 'Git', level: 70 },
  { name: 'Node.js', level: 50 },
]

const experiences = [
  {
    company: '某科技公司',
    role: '前端开发实习生',
    period: '2024.06 - 2024.09',
    description: '参与公司内部管理系统的前端开发，负责页面组件开发与接口对接。',
  },
  {
    company: '某互联网公司',
    role: '前端开发实习生',
    period: '2024.12 - 2025.03',
    description: '参与公司C端产品的前端开发，负责核心业务模块的实现。',
  },
]

const awards = [
  { icon: '🏆', title: '全国数学建模大赛', level: '省级一等奖' },
  { icon: '💻', title: '蓝桥杯程序设计大赛', level: '省级二等奖' },
  { icon: '🎓', title: '优秀一等奖学金', level: '一等奖' },
]
</script>

<style scoped>
.resume-page {
  max-width: 700px;
  margin: 0 auto;
  padding: 40px 0;
}

.resume-header {
  margin-bottom: 40px;
}

.back-link {
  font-size: 0.85rem;
  color: var(--color-primary);
  display: inline-block;
  margin-bottom: 12px;
}

.back-link:hover {
  opacity: 0.8;
}

.page-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--color-text);
}

.resume-section {
  margin-bottom: 40px;
}

.section-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--color-border);
}

/* 个人信息 */
.profile-card {
  display: flex;
  gap: 24px;
  padding: 24px;
  background: var(--color-bg-card);
  border-radius: 12px;
  border: 1px solid var(--color-border);
}

.profile-avatar {
  flex-shrink: 0;
}

.avatar-placeholder {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-primary-light), var(--color-accent-light));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  border: 2px solid var(--color-border);
}

.profile-name {
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 4px;
  color: var(--color-text);
}

.profile-title {
  font-size: 0.9rem;
  color: var(--color-primary);
  margin-bottom: 12px;
}

.profile-bio {
  font-size: 0.9rem;
  color: var(--color-text-secondary);
  line-height: 1.7;
}

/* 技能 */
.skills-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.skill-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.skill-name {
  font-size: 0.85rem;
  color: var(--color-text);
  min-width: 80px;
}

.skill-bar {
  flex: 1;
  height: 6px;
  background: var(--color-border);
  border-radius: 3px;
  overflow: hidden;
}

.skill-fill {
  height: 100%;
  background: var(--color-primary);
  border-radius: 3px;
}

/* 实习经历 */
.experience-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.experience-item {
  padding: 20px;
  background: var(--color-bg-card);
  border-radius: 12px;
  border: 1px solid var(--color-border);
}

.exp-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.exp-company {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text);
}

.exp-period {
  font-size: 0.8rem;
  color: var(--color-text-muted);
}

.exp-role {
  font-size: 0.9rem;
  color: var(--color-primary);
  margin-bottom: 8px;
}

.exp-desc {
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  line-height: 1.6;
}

/* 荣誉奖项 */
.awards-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.award-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  background: var(--color-bg-card);
  border-radius: 12px;
  border: 1px solid var(--color-border);
}

.award-icon {
  font-size: 1.5rem;
}

.award-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 4px;
}

.award-level {
  font-size: 0.8rem;
  color: var(--color-primary);
}

@media (max-width: 768px) {
  .profile-card {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .skills-grid {
    grid-template-columns: 1fr;
  }

  .exp-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
}
</style>
