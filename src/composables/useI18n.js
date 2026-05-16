import { ref, watch } from 'vue'

const currentLang = ref(localStorage.getItem('lang') || 'zh')

const translations = {
  zh: {
    nav: { home: '首页', articles: '文章', archive: '归档', tags: '标签', github: 'GitHub', about: '关于', playlist: '歌单', diary: '日记', links: '友链' },
    hero: { greeting: "Hi, I'm", name: '星辰!', subtitle: 'Hope my blog can help you ~' },
    sidebar: { articles: '文章', categories: '分类', tagCount: '标签', about: '关于', playlist: '歌单', daily: '日常', moreSites: '更多网站' },
    home: { latestArticles: '最新文章', wordCount: '字', prev: '上一页', next: '下一页' },
    archive: { title: '归档', totalArticles: '篇文章' },
    tags: { title: '标签', subtitle: '按标签浏览文章' },
    blog: { notFound: '文章不存在', backHome: '← 返回首页', comments: '最新评论', namePlaceholder: '你的名字', commentPlaceholder: '写下你的评论...', submit: '提交评论', justNow: '刚刚', minutesAgo: '分钟前', hoursAgo: '小时前', daysAgo: '天前' },
    theme: { toDark: '切换到夜晚模式', toLight: '切换到白天模式', auto: '自动切换' },
  },
  en: {
    nav: { home: 'Home', articles: 'Articles', archive: 'Archive', tags: 'Tags', github: 'GitHub', about: 'About', playlist: 'Playlist', diary: 'Diary', links: 'Links' },
    hero: { greeting: "Hi, I'm", name: 'Xingchen!', subtitle: 'Hope my blog can help you ~' },
    sidebar: { articles: 'Articles', categories: 'Categories', tagCount: 'Tags', about: 'About', playlist: 'Playlist', daily: 'Daily', moreSites: 'More Sites' },
    home: { latestArticles: 'Latest Articles', wordCount: 'words', prev: 'Prev', next: 'Next' },
    archive: { title: 'Archive', totalArticles: 'articles' },
    tags: { title: 'Tags', subtitle: 'Browse articles by tag' },
    blog: { notFound: 'Article not found', backHome: '← Back to Home', comments: 'Comments', namePlaceholder: 'Your name', commentPlaceholder: 'Write a comment...', submit: 'Submit', justNow: 'just now', minutesAgo: 'min ago', hoursAgo: 'hours ago', daysAgo: 'days ago' },
    theme: { toDark: 'Switch to dark mode', toLight: 'Switch to light mode', auto: 'Auto switch' },
  },
  ja: {
    nav: { home: 'ホーム', articles: '記事', archive: 'アーカイブ', tags: 'タグ', github: 'GitHub', about: '自己紹介', playlist: 'プレイリスト', diary: '日記', links: 'リンク' },
    hero: { greeting: 'こんにちは、', name: '星辰です！', subtitle: 'ブログがお役に立てれば幸いです ~' },
    sidebar: { articles: '記事', categories: 'カテゴリ', tagCount: 'タグ', about: '自己紹介', playlist: 'プレイリスト', daily: '日常', moreSites: '他のサイト' },
    home: { latestArticles: '最新記事', wordCount: '字', prev: '前へ', next: '次へ' },
    archive: { title: 'アーカイブ', totalArticles: '件の記事' },
    tags: { title: 'タグ', subtitle: 'タグで記事を検索' },
    blog: { notFound: '記事が見つかりません', backHome: '← ホームに戻る', comments: 'コメント', namePlaceholder: 'お名前', commentPlaceholder: 'コメントを書く...', submit: '送信', justNow: 'たった今', minutesAgo: '分前', hoursAgo: '時間前', daysAgo: '日前' },
    theme: { toDark: 'ダークモードに切替', toLight: 'ライトモードに切替', auto: '自動切替' },
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
