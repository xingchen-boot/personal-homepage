<template>
  <div class="resume-page">
    <!-- 页头：返回 + 标题 -->
    <header class="resume-header no-print">
      <router-link to="/" class="back-link">← 返回首页</router-link>
      <div class="header-row">
        <h1 class="page-title">个人简历</h1>
        <div class="header-actions">
          <button type="button" class="action-chip" @click="copyEmail">
            {{ emailCopied ? '已复制邮箱' : '复制邮箱' }}
          </button>
          <a
            class="action-chip ghost"
            href="https://github.com/xingchen-boot"
            target="_blank"
            rel="noopener noreferrer"
          >GitHub</a>
          <button type="button" class="action-chip ghost" @click="printResume">打印 / PDF</button>
        </div>
      </div>
      <!-- 页内锚点目录：长简历快速跳转 -->
      <nav class="resume-toc" aria-label="简历目录">
        <a v-for="item in tocItems" :key="item.id" :href="`#${item.id}`" class="toc-link">
          {{ item.label }}
        </a>
      </nav>
    </header>

    <!-- 基本信息 -->
    <section id="profile" class="resume-section">
      <div class="profile-card">
        <div class="profile-avatar">
          <img :src="avatar" alt="林昭南" class="avatar-img" />
        </div>
        <div class="profile-info">
          <h2 class="profile-name">林昭南</h2>
          <p class="profile-title">前端开发 · 腾讯实习 · AI Agent 开发经验</p>
          <p class="profile-bio">
            广东工业大学计算机科学与技术在读，专注 Vue 生态、性能优化与 AI Agent 应用。
            有腾讯、三七互娱、中国电信三段前端实习经历，擅长样式引擎、虚拟列表、流式交互与工程化治理。
          </p>
          <div class="profile-meta">
            <a href="mailto:3141163409@qq.com" class="meta-item">📧 3141163409@qq.com</a>
            <span class="meta-item">🎓 广工计科 · 2023 — 2027</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 教育背景 -->
    <section id="education" class="resume-section">
      <h3 class="section-title">教育背景</h3>
      <div class="education-card">
        <div class="edu-header">
          <div>
            <h4 class="edu-school">广东工业大学（全日制本科）</h4>
            <p class="edu-major">计算机科学与技术 · GPA 4.0 / 5.0（前 10%）</p>
          </div>
          <span class="edu-period">2023.09 — 2027.06</span>
        </div>
        <ul class="edu-highlights">
          <li v-for="item in educationHighlights" :key="item">{{ item }}</li>
        </ul>
      </div>
    </section>

    <!-- 实习经历 -->
    <section id="experience" class="resume-section">
      <h3 class="section-title">实习经历</h3>
      <div class="experience-list">
        <article v-for="exp in experiences" :key="exp.company + exp.period" class="experience-item">
          <div class="exp-header">
            <div>
              <h4 class="exp-company">{{ exp.company }}</h4>
              <p class="exp-role">{{ exp.role }}</p>
            </div>
            <span class="exp-period">{{ exp.period }}</span>
          </div>
          <p class="exp-summary">{{ exp.summary }}</p>
          <ul class="exp-bullets">
            <li v-for="(bullet, index) in exp.bullets" :key="index">{{ bullet }}</li>
          </ul>
          <div v-if="exp.tags?.length" class="exp-tags">
            <span v-for="tag in exp.tags" :key="tag" class="exp-tag">{{ tag }}</span>
          </div>
          <div v-if="exp.writeupId" class="project-link-row">
            <router-link
              :to="{ name: 'BlogDetail', params: { id: exp.writeupId } }"
              class="project-link"
            >
              读技术复盘 →
            </router-link>
          </div>
        </article>
      </div>
    </section>

    <!-- 项目经历 -->
    <section id="projects" class="resume-section">
      <h3 class="section-title">项目经历</h3>
      <div class="experience-list">
        <article v-for="project in projects" :key="project.name" class="experience-item">
          <div class="exp-header">
            <div>
              <h4 class="exp-company">{{ project.name }}</h4>
              <p class="exp-role">{{ project.stack }}</p>
            </div>
            <span class="exp-period">{{ project.period }}</span>
          </div>
          <p class="exp-summary">{{ project.summary }}</p>
          <ul class="exp-bullets">
            <li v-for="(bullet, index) in project.bullets" :key="index">{{ bullet }}</li>
          </ul>
          <div v-if="project.link || project.writeupId" class="project-link-row">
            <router-link
              v-if="project.writeupId"
              :to="{ name: 'BlogDetail', params: { id: project.writeupId } }"
              class="project-link"
            >
              读技术复盘 →
            </router-link>
            <a
              v-if="project.link"
              :href="project.link"
              target="_blank"
              rel="noopener noreferrer"
              class="project-link"
            >
              访问项目 →
            </a>
          </div>
        </article>
      </div>
    </section>

    <!-- 专业技能 -->
    <section id="skills" class="resume-section">
      <h3 class="section-title">专业技能</h3>
      <div class="skills-grid">
        <div v-for="category in skillCategories" :key="category.name" class="skill-category">
          <h4 class="category-name">{{ category.name }}</h4>
          <div class="skill-tags">
            <span v-for="skill in category.skills" :key="skill" class="skill-tag">{{ skill }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 荣誉奖项 -->
    <section id="awards" class="resume-section">
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
/**
 * 简历页：内容对齐《林昭南.pdf》最新版本
 * 博客昵称仍为「星辰」，本页展示真实姓名与完整履历
 */
import { ref } from 'vue'
import avatar from '../assets/20230311003752_5b225.thumb.400_0.jpg'
import { copyLocalUrl } from '../utils/localLink'

const CONTACT_EMAIL = '3141163409@qq.com'
const emailCopied = ref(false)

/** 简历页内锚点目录 */
const tocItems = [
  { id: 'profile', label: '简介' },
  { id: 'education', label: '教育' },
  { id: 'experience', label: '实习' },
  { id: 'projects', label: '项目' },
  { id: 'skills', label: '技能' },
  { id: 'awards', label: '荣誉' },
]

/** 教育背景亮点 */
const educationHighlights = [
  '一等奖学金 · CET-6',
  '广东省大学生数学建模大赛省级一等奖',
  '蓝桥杯全国软件和信息技术专业人才大赛省级二等奖',
  '校问卷易团队全栈开发',
]

/** 三段前端实习（时间倒序） */
const experiences = [
  {
    company: '腾讯科技（深圳）有限公司',
    role: '前端开发实习生',
    period: '2026.05 — 至今',
    summary:
      '参与 PC QQ Electron 转 Qt 原生渲染的 CSS 下沉架构建设，实现样式共享与运行时级联，支撑多窗口渐进迁移。',
    bullets: [
      '落地 CSS 下沉全链路：打通 Vue SFC 编译、窗级 cssMap、节点元数据到 Qt StyleEngine、Fabric 渲染的完整链路，静态样式按窗口共享加载；输出架构设计与性能评测文档，配套单元测试与基准测试。',
      '建设样式引擎核心能力：实现选择器索引、权重计算、scoped 隔离、伪类状态、CSS 变量等运行时解析；处理跨组件 class 传递、优先级覆盖、虚拟列表透传等边界问题，降低业务迁移改写量。',
      '主导性能专项优化：搭建分阶段 Profiling 体系；650 节点调试页冷挂载从 44.859s 降至 378ms，选择器解析次数减少 99%，性能追平原链路。',
      '实现主题增量更新：打通宿主设计 Token 到 C++ 变量表的更新链路，建立依赖索引实现主题变化的增量刷新，避免全窗口遍历重算。',
    ],
    tags: ['Vue SFC', 'Qt', 'CSS Runtime', 'Profiling'],
    writeupId: 'css-runtime-sinking',
  },
  {
    company: '三七互娱网络科技集团股份有限公司',
    role: '前端开发实习生',
    period: '2026.02 — 2026.05',
    summary:
      '参与海外多平台运营客服等后台前端开发，基于 Vue3 + TypeScript，支撑多业务团队并行迭代。',
    bullets: [
      '参与 Web Worker 异步轮询架构与多平台适配层落地，负责主线程任务注册与联调，支持多路数据并行拉取，解决主线程轮询导致的 UI 卡顿。',
      '实现双向虚拟滚动：基于双锚点监听完成聊天记录双向懒加载，通过 scrollTop 差值补偿解决新消息头部插入的滚动跳动。',
      '参与 TinyMCE 富文本二次开发：图片插入、消息引用、Lottie 贴纸等自定义插件；DOM 树递归将 HTML 转为结构化消息数组，支持多类型混合内容发送。',
    ],
    tags: ['Vue3', 'TypeScript', 'Web Worker', 'TinyMCE'],
  },
  {
    company: '中国电信股份公司（广州）',
    role: '前端开发实习生',
    period: '2025.09 — 2025.12',
    summary:
      '参与广东省检察院政务管理系统前端开发，覆盖案件、会议、AI 工具等核心模块，服务千余名检察人员办公。',
    bullets: [
      '自研虚拟列表解决万级数据渲染卡顿：DOM 节点从万级降至约 30 个，内存占用从 800MB 降至 280MB，滚动帧率稳定 55fps 以上。',
      '实现 AI 问答流式输出：基于 EventSource 完成大模型回答流式响应，首屏响应时间从 3s 降至 0.8s。',
      '自研大文件分片上传引擎：WebWorker 并行哈希、并发队列、断点续传与进度上报；50 份文书批量上传从约 5 分钟降至 30 秒，成功率提升至 99.8%。',
    ],
    tags: ['虚拟列表', 'EventSource', '分片上传', '性能优化'],
    writeupId: 'virtual-list-streaming',
  },
]

/** 个人 / 团队项目 */
const projects = [
  {
    name: 'FrontCode — AI 终端智能助手',
    stack: 'Node.js + OpenAI SDK · MCP · RAG',
    period: '2026.03 — 至今',
    summary:
      '基于 Node.js + OpenAI SDK 构建的终端 AI Agent，支持工具调用、技能扩展、MCP 协议与 RAG 检索，类 Claude Code 架构设计。',
    bullets: [
      '设计 Tool Agent 循环调度系统，AI 决策后自动执行本地工具并回传结果；支持 MCP 协议动态加载外部工具，实现能力热插拔。',
      '实现基于 Markdown 的 Skill 技能扩展协议，支持多级目录自动扫描注入与按需加载。',
      '基于 LanceDB 向量库搭建 RAG 检索与持久化记忆，实现本地文档语义匹配与跨会话上下文延续。',
      '支持指令、文件、图片三类快捷输入；图片自动编码后切换视觉模型，兼顾效率与多模态能力。',
    ],
    writeupId: 'frontcode-ai-agent',
  },
  {
    name: '问卷易 — 问卷调查管理系统',
    stack: 'Vue.js + Element UI + Vuex',
    period: '校团队全栈开发',
    summary:
      '基于 Vue.js 与 Element UI 的问卷调查管理系统，支持问卷创建、分发、收集与分析，含模板库与积分机制。',
    bullets: [
      '组件化问卷设计界面，Vuex 集中管理编辑态数据；Axios 拦截器统一请求与错误处理。',
      'JWT + 路由守卫 + 权限指令实现前端鉴权；组件懒加载与分页优化大数据列表性能。',
      'Nginx 部署并配置 proxy_pass 反向代理，解决前后端跨域。',
    ],
    link: 'https://wj.denglu1.cn/',
  },
]

/** 技能分类（对齐简历「专业技能」） */
const skillCategories = [
  {
    name: '前端框架',
    skills: ['Vue 2 / Vue 3', 'Vue Router', 'Vuex / Pinia', '响应式原理', '组件封装'],
  },
  {
    name: '工程化与规范',
    skills: ['Vite', 'Webpack', 'ESLint', 'Prettier', 'Git 协作'],
  },
  {
    name: 'AI 前端应用',
    skills: ['OpenAI SDK', 'Function Calling', 'MCP', 'Agent 架构', 'RAG / LanceDB'],
  },
  {
    name: '跨端与基础',
    skills: ['Qt', 'Electron', 'IPC', 'Fabric / Yoga', 'JavaScript / TypeScript', 'HTTP / 浏览器原理'],
  },
]

/** 荣誉奖项 */
const awards = [
  { icon: '🏆', title: '广东省大学生数学建模大赛', level: '省级一等奖' },
  { icon: '💻', title: '蓝桥杯程序设计大赛', level: '省级二等奖' },
  { icon: '📐', title: '全国大学生数学竞赛', level: '省级三等奖' },
  { icon: '🎓', title: '校级一等奖学金', level: '一等奖 · GPA 前 10%' },
  { icon: '🌐', title: '英语能力', level: 'CET-4 / CET-6' },
]

/**
 * 调用浏览器打印；可在打印对话框中选择「另存为 PDF」
 * 不托管含手机号的原始 PDF，避免隐私泄露
 */
function printResume() {
  window.print()
}

async function copyEmail() {
  const ok = await copyLocalUrl(CONTACT_EMAIL)
  if (!ok) return
  emailCopied.value = true
  window.setTimeout(() => {
    emailCopied.value = false
  }, 1600)
}
</script>

<style scoped>
.resume-page {
  max-width: 760px;
  margin: 0 auto;
  padding: 40px 24px 64px;
}

.resume-header {
  position: sticky;
  top: 56px;
  z-index: 20;
  margin: -8px -8px 32px;
  padding: 12px 8px 16px;
  background: color-mix(in srgb, var(--color-bg) 92%, transparent);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--color-border);
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

.header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.page-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--color-text);
}

.header-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.resume-toc {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
}

.toc-link {
  font-size: 0.8rem;
  padding: 5px 12px;
  border-radius: 999px;
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: all 0.2s ease;
}

.toc-link:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.action-chip {
  font-size: 0.85rem;
  color: #fff;
  background: var(--color-primary);
  padding: 6px 14px;
  border: 1px solid var(--color-primary);
  border-radius: 999px;
  text-decoration: none;
  cursor: pointer;
  transition: opacity 0.2s ease, background 0.2s ease, color 0.2s ease;
}

.action-chip:hover {
  opacity: 0.9;
}

.action-chip.ghost {
  background: transparent;
  color: var(--color-primary);
}

.action-chip.ghost:hover {
  background: var(--color-primary);
  color: #fff;
  opacity: 1;
}

.resume-section {
  margin-bottom: 40px;
  scroll-margin-top: 72px;
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

.avatar-img {
  width: 88px;
  height: 88px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--color-primary);
}

.profile-name {
  font-size: 1.45rem;
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
  margin-bottom: 14px;
}

.profile-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 16px;
}

.meta-item {
  font-size: 0.82rem;
  color: var(--color-text-secondary);
  text-decoration: none;
}

a.meta-item:hover {
  color: var(--color-primary);
}

/* 教育 */
.education-card {
  padding: 20px;
  background: var(--color-bg-card);
  border-radius: 12px;
  border: 1px solid var(--color-border);
}

.edu-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 12px;
}

.edu-school {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text);
}

.edu-major {
  font-size: 0.88rem;
  color: var(--color-primary);
  margin-top: 4px;
}

.edu-period {
  font-size: 0.8rem;
  color: var(--color-text-muted);
  white-space: nowrap;
}

.edu-highlights {
  margin: 0;
  padding-left: 1.1rem;
  color: var(--color-text-secondary);
  font-size: 0.88rem;
  line-height: 1.7;
}

/* 实习 / 项目卡片 */
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
  align-items: flex-start;
  gap: 12px;
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
  white-space: nowrap;
}

.exp-role {
  font-size: 0.88rem;
  color: var(--color-primary);
  margin-top: 4px;
}

.exp-summary {
  font-size: 0.88rem;
  color: var(--color-text-secondary);
  line-height: 1.65;
  margin-bottom: 10px;
}

.exp-bullets {
  margin: 0;
  padding-left: 1.1rem;
  color: var(--color-text-secondary);
  font-size: 0.85rem;
  line-height: 1.7;
}

.exp-bullets li + li {
  margin-top: 6px;
}

.exp-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 14px;
}

.exp-tag {
  font-size: 0.75rem;
  padding: 4px 10px;
  border-radius: 999px;
  background: var(--color-primary-light);
  color: var(--color-primary);
}

.project-link-row {
  margin-top: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
}

.project-link {
  font-size: 0.85rem;
  color: var(--color-primary);
  text-decoration: none;
}

.project-link:hover {
  text-decoration: underline;
}

/* 技能 */
.skills-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skill-category {
  padding: 16px 18px;
  background: var(--color-bg-card);
  border-radius: 12px;
  border: 1px solid var(--color-border);
}

.category-name {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 10px;
}

.skill-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.skill-tag {
  padding: 5px 12px;
  border-radius: 999px;
  font-size: 0.8rem;
  background: var(--color-primary-light);
  color: var(--color-primary);
}

/* 荣誉 */
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
  font-size: 1.4rem;
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

  .profile-meta {
    justify-content: center;
  }

  .edu-header,
  .exp-header {
    flex-direction: column;
    align-items: flex-start;
  }
}

/* 打印 / 导出 PDF：隐藏站点导航与装饰，保留简历正文 */
@media print {
  :global(body) {
    background: #fff !important;
  }

  .no-print {
    display: none !important;
  }

  .resume-page {
    max-width: none;
    padding: 0;
  }

  .resume-section,
  .profile-card,
  .education-card,
  .experience-item,
  .skill-category,
  .award-item {
    break-inside: avoid;
    box-shadow: none;
    border-color: #ddd;
  }
}
</style>
