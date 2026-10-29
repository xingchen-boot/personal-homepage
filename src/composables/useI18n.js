import { ref, watch } from 'vue'

const currentLang = ref(localStorage.getItem('lang') || 'zh')

const translations = {
  zh: {
    nav: { home: '首页', articles: '文章', archive: '归档', tags: '标签', github: 'GitHub', about: '关于', resume: '简历', projects: '项目', more: '更多', playlist: '歌单', diary: '日记', links: '友链' },
    hero: {
      greeting: "Hi, I'm",
      name: '星辰!',
      status: '腾讯前端实习 · 2027 届 · 欢迎邮件联系',
      subtitle: '做性能与 AI Agent 方向的前端工程——把慢链路压快，把模型变成能动手的运行时。',
      evidence: '冷挂载 44.9s → 378ms（约 118×）· 万级列表 ≥55fps · FrontCode Agent',
      ctaResume: '查看简历',
      ctaEmail: '邮件联系',
      ctaProjects: '精选项目',
    },
    sidebar: {
      articles: '文章',
      categories: '分类',
      tagCount: '标签',
      hot: '热门文章',
      about: '关于',
      resume: '简历',
      projects: '项目',
      playlist: '歌单',
      daily: '日常',
      moreSites: '更多网站',
      quickLinks: '快速入口',
      email: '邮件',
      github: 'GitHub',
    },
    home: {
      latestArticles: '最新文章',
      featuredProjects: '精选项目',
      viewAllProjects: '全部项目',
      featuredWriteups: '代表作深文',
      viewAllArticles: '全部文章',
      problem: '问题',
      result: '结果',
      readWriteup: '读复盘',
      visitProject: '访问',
      localNote: '本机笔记',
      wordCount: '字',
      prev: '上一页',
      next: '下一页',
      emptyTitle: '暂时还没有文章',
      emptyDesc: '后端未启动时会展示本地示例；你也可以先看看项目与简历。',
      emptyProjects: '浏览项目',
      emptyResume: '查看简历',
    },
    archive: { title: '归档', totalArticles: '篇文章' },
    tags: { title: '标签', subtitle: '按标签浏览文章' },
    blog: { notFound: '文章不存在', backHome: '← 返回首页', comments: '最新评论', namePlaceholder: '你的名字', commentPlaceholder: '写下你的评论...', submit: '提交评论', justNow: '刚刚', minutesAgo: '分钟前', hoursAgo: '小时前', daysAgo: '天前' },
    theme: {
      toDark: '切换到夜晚模式',
      toLight: '切换到白天模式',
      auto: '自动切换',
      webglOn: '开启 WebGL 星空',
      webglOff: '关闭 WebGL 星空（改用 2D）',
      webglUnavailable: '当前环境不支持 WebGL 星空',
    },
  },
  en: {
    nav: { home: 'Home', articles: 'Articles', archive: 'Archive', tags: 'Tags', github: 'GitHub', about: 'About', resume: 'Resume', projects: 'Projects', more: 'More', playlist: 'Playlist', diary: 'Diary', links: 'Links' },
    hero: {
      greeting: "Hi, I'm",
      name: 'Xingchen!',
      status: 'Tencent Frontend Intern · Class of 2027 · Open to email',
      subtitle: 'Frontend engineering for performance & AI Agents — speed up the slow path, turn models into runnable runtimes.',
      evidence: 'Cold mount 44.9s → 378ms (~118×) · Virtual list ≥55fps · FrontCode Agent',
      ctaResume: 'Resume',
      ctaEmail: 'Email',
      ctaProjects: 'Projects',
    },
    sidebar: {
      articles: 'Articles',
      categories: 'Categories',
      tagCount: 'Tags',
      hot: 'Popular',
      about: 'About',
      resume: 'Resume',
      projects: 'Projects',
      playlist: 'Playlist',
      daily: 'Daily',
      moreSites: 'More Sites',
      quickLinks: 'Quick links',
      email: 'Email',
      github: 'GitHub',
    },
    home: {
      latestArticles: 'Latest Articles',
      featuredProjects: 'Featured Projects',
      viewAllProjects: 'All projects',
      featuredWriteups: 'Deep dives',
      viewAllArticles: 'All articles',
      problem: 'Problem',
      result: 'Result',
      readWriteup: 'Write-up',
      visitProject: 'Visit',
      localNote: 'Local notes',
      wordCount: 'words',
      prev: 'Prev',
      next: 'Next',
      emptyTitle: 'No articles yet',
      emptyDesc: 'Showing local samples when the API is offline. You can also browse projects and the resume.',
      emptyProjects: 'Projects',
      emptyResume: 'Resume',
    },
    archive: { title: 'Archive', totalArticles: 'articles' },
    tags: { title: 'Tags', subtitle: 'Browse articles by tag' },
    blog: { notFound: 'Article not found', backHome: '← Back to Home', comments: 'Comments', namePlaceholder: 'Your name', commentPlaceholder: 'Write a comment...', submit: 'Submit', justNow: 'just now', minutesAgo: 'min ago', hoursAgo: 'hours ago', daysAgo: 'days ago' },
    theme: {
      toDark: 'Switch to dark mode',
      toLight: 'Switch to light mode',
      auto: 'Auto switch',
      webglOn: 'Enable WebGL starfield',
      webglOff: 'Disable WebGL starfield (use 2D)',
      webglUnavailable: 'WebGL starfield unavailable',
    },
  },
  ja: {
    nav: { home: 'ホーム', articles: '記事', archive: 'アーカイブ', tags: 'タグ', github: 'GitHub', about: '自己紹介', resume: '履歴書', projects: 'プロジェクト', more: 'その他', playlist: 'プレイリスト', diary: '日記', links: 'リンク' },
    hero: {
      greeting: 'こんにちは、',
      name: '星辰です！',
      status: 'テンセントFEインターン · 2027 卒 · メール歓迎',
      subtitle: 'パフォーマンスと AI Agent 向けのフロントエンド——遅い経路を速くし、モデルを動くランタイムにする。',
      evidence: 'コールドマウント 44.9s → 378ms（約 118×）· 仮想リスト ≥55fps · FrontCode Agent',
      ctaResume: '履歴書',
      ctaEmail: 'メール',
      ctaProjects: 'プロジェクト',
    },
    sidebar: {
      articles: '記事',
      categories: 'カテゴリ',
      tagCount: 'タグ',
      hot: '人気記事',
      about: '自己紹介',
      resume: '履歴書',
      projects: 'プロジェクト',
      playlist: 'プレイリスト',
      daily: '日常',
      moreSites: '他のサイト',
      quickLinks: 'クイックリンク',
      email: 'メール',
      github: 'GitHub',
    },
    home: {
      latestArticles: '最新記事',
      featuredProjects: '注目プロジェクト',
      viewAllProjects: 'すべて見る',
      featuredWriteups: '代表記事',
      viewAllArticles: 'すべての記事',
      problem: '課題',
      result: '成果',
      readWriteup: '振り返り',
      visitProject: '開く',
      localNote: 'ローカルノート',
      wordCount: '字',
      prev: '前へ',
      next: '次へ',
      emptyTitle: '記事がまだありません',
      emptyDesc: 'API が使えないときはローカルのサンプルを表示します。プロジェクトや履歴書もご覧ください。',
      emptyProjects: 'プロジェクト',
      emptyResume: '履歴書',
    },
    archive: { title: 'アーカイブ', totalArticles: '件の記事' },
    tags: { title: 'タグ', subtitle: 'タグで記事を検索' },
    blog: { notFound: '記事が見つかりません', backHome: '← ホームに戻る', comments: 'コメント', namePlaceholder: 'お名前', commentPlaceholder: 'コメントを書く...', submit: '送信', justNow: 'たった今', minutesAgo: '分前', hoursAgo: '時間前', daysAgo: '日前' },
    theme: {
      toDark: 'ダークモードに切替',
      toLight: 'ライトモードに切替',
      auto: '自動切替',
      webglOn: 'WebGL 星空をオン',
      webglOff: 'WebGL 星空をオフ（2D に切替）',
      webglUnavailable: 'この環境では WebGL 星空を使えません',
    },
  },
}

const langNames = { zh: '中文', en: 'EN', ja: '日本語' }

function t(key) {
  const keys = key.split('.')
  let result = translations[currentLang.value]
  for (const k of keys) {
    result = result?.[k]
  }
  return result || key
}

function setLang(lang) {
  currentLang.value = lang
  localStorage.setItem('lang', lang)
}

watch(currentLang, (lang) => {
  document.documentElement.setAttribute('lang', lang)
})

export function useI18n() {
  return { currentLang, t, setLang, langNames }
}
