<template>
  <div class="projects-page">
    <div class="page-container">
      <header class="page-header">
        <h1 class="page-title">项目作品集</h1>
        <p class="page-subtitle">
          个人项目与实习中主导的前端专项，聚焦可量化结果与可复用能力。
        </p>
      </header>

      <div class="project-list">
        <article v-for="project in projectList" :key="project.id" class="project-card">
          <div class="project-top">
            <div>
              <h2 class="project-name">{{ project.name }}</h2>
              <p class="project-meta">
                <span>{{ project.role }}</span>
                <span class="meta-dot">·</span>
                <span>{{ project.period }}</span>
              </p>
            </div>
            <span v-if="project.metric" class="project-metric">{{ project.metric }}</span>
          </div>

          <p class="project-summary">{{ project.summary }}</p>

          <dl v-if="project.problem || project.result" class="project-case">
            <div v-if="project.problem" class="case-block">
              <dt>问题</dt>
              <dd>{{ project.problem }}</dd>
            </div>
            <div v-if="project.result" class="case-block">
              <dt>结果</dt>
              <dd>{{ project.result }}</dd>
            </div>
          </dl>

          <ul class="project-highlights">
            <li v-for="(item, index) in project.highlights" :key="index">{{ item }}</li>
          </ul>

          <div class="project-footer">
            <div class="project-tags">
              <span v-for="tag in project.tags" :key="tag" class="tag">{{ tag }}</span>
            </div>
            <div class="project-links">
              <router-link
                v-if="project.writeupId"
                :to="{ name: 'BlogDetail', params: { id: project.writeupId } }"
                class="project-link"
              >
                读复盘 →
              </router-link>
              <LocalNoteLink
                v-if="project.link && isLocalOnlyLink(project)"
                :url="project.link"
                :label="project.linkLabel || '本机笔记'"
              />
              <a
                v-else-if="project.link"
                :href="project.link"
                class="project-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                {{ project.linkLabel || '访问项目' }} →
              </a>
            </div>
          </div>
        </article>
      </div>

      <div class="page-actions">
        <router-link to="/resume" class="action-link">查看完整简历</router-link>
        <a href="mailto:3141163409@qq.com" class="action-link ghost">邮件联系</a>
      </div>
    </div>
  </div>
</template>

<script setup>
/** 项目作品集页：数据来自 data/projects.js */
import { projectList } from '../data/projects'
import { isLocalOnlyLink } from '../utils/localLink'
import LocalNoteLink from '../components/LocalNoteLink.vue'
</script>

<style scoped>
.projects-page {
  padding: 40px 24px 64px;
}

.page-container {
  max-width: 760px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 28px;
}

.page-title {
  font-size: 1.7rem;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 8px;
}

.page-subtitle {
  font-size: 0.95rem;
  color: var(--color-text-secondary);
  line-height: 1.7;
}

.project-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.project-card {
  padding: 22px 22px 18px;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 14px;
  transition: border-color 0.2s ease, transform 0.2s ease;
}

.project-card:hover {
  border-color: var(--color-primary);
  transform: translateY(-2px);
}

.project-top {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: flex-start;
  margin-bottom: 10px;
}

.project-name {
  font-size: 1.05rem;
  font-weight: 650;
  color: var(--color-text);
  margin-bottom: 6px;
}

.project-meta {
  font-size: 0.82rem;
  color: var(--color-primary);
}

.meta-dot {
  margin: 0 6px;
  opacity: 0.6;
}

.project-metric {
  flex-shrink: 0;
  font-size: 0.75rem;
  padding: 5px 10px;
  border-radius: 999px;
  background: var(--color-primary-light);
  color: var(--color-primary);
  white-space: nowrap;
}

.project-summary {
  font-size: 0.9rem;
  color: var(--color-text-secondary);
  line-height: 1.7;
  margin-bottom: 12px;
}

.project-case {
  margin: 0 0 14px;
  display: grid;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 10px;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
}

.case-block dt {
  font-size: 0.72rem;
  font-weight: 650;
  color: var(--color-primary);
  margin-bottom: 4px;
}

.case-block dd {
  margin: 0;
  font-size: 0.86rem;
  line-height: 1.6;
  color: var(--color-text-secondary);
}

.project-highlights {
  margin: 0 0 14px;
  padding-left: 1.1rem;
  color: var(--color-text-secondary);
  font-size: 0.86rem;
  line-height: 1.7;
}

.project-highlights li + li {
  margin-top: 4px;
}

.project-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.project-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  font-size: 0.75rem;
  padding: 4px 10px;
  border-radius: 999px;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
}

.project-links {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.project-link {
  font-size: 0.85rem;
  color: var(--color-primary);
  text-decoration: none;
}

.project-link:hover {
  text-decoration: underline;
}

.page-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 28px;
}

.action-link {
  display: inline-flex;
  align-items: center;
  padding: 8px 16px;
  border-radius: 999px;
  background: var(--color-primary);
  color: #fff;
  text-decoration: none;
  font-size: 0.88rem;
}

.action-link.ghost {
  background: transparent;
  color: var(--color-text);
  border: 1px solid var(--color-border);
}

.action-link.ghost:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

@media (max-width: 768px) {
  .project-top {
    flex-direction: column;
  }
}
</style>
