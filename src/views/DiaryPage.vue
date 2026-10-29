<template>
  <div class="diary-page">
    <div class="page-container">
      <h1 class="page-title">日常随笔</h1>
      <p class="page-subtitle">记录生活中的小确幸和碎碎念</p>

      <!-- 日记列表 -->
      <div class="diary-list">
        <article v-for="diary in diaries" :key="diary.id" class="diary-item">
          <div class="diary-date">
            <span class="date-day">{{ getDay(diary.date) }}</span>
            <span class="date-month">{{ getMonth(diary.date) }}</span>
            <span class="date-year">{{ getYear(diary.date) }}</span>
          </div>
          <div class="diary-content">
            <div class="diary-header">
              <span class="diary-mood">{{ diary.mood }}</span>
              <span class="diary-weather">{{ diary.weather }}</span>
            </div>
            <p class="diary-text">{{ diary.content }}</p>
            <div class="diary-tags">
              <span v-for="tag in diary.tags" :key="tag" class="diary-tag">{{ tag }}</span>
            </div>
          </div>
        </article>
      </div>

      <!-- 加载更多 -->
      <div class="load-more" v-if="hasMore">
        <button class="load-btn" @click="loadMore">加载更多</button>
      </div>

      <!-- 空状态 -->
      <div v-if="diaries.length === 0" class="empty-state">
        <span class="empty-icon">📝</span>
        <p>还没有写过日记呢</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { toDateKey } from '../utils/date'

const hasMore = ref(true)

const diaries = ref([
  {
    id: 1,
    date: '2025-03-15',
    mood: '😊',
    weather: '☀️ 晴',
    content: '今天终于把博客的暗色模式做好了！看着星空背景在夜晚模式下闪闪发光，感觉之前的辛苦都值得了。晚上奖励自己吃了一顿火锅，完美的周末。',
    tags: ['博客开发', '暗色模式'],
  },
  {
    id: 2,
    date: '2025-03-10',
    mood: '😤',
    weather: '🌧️ 小雨',
    content: 'Debug 了一整天，最后发现是一个变量名拼写错误。程序员的日常，被一个字母折磨一天。不过问题解决了，还是很开心的。雨天适合安静写代码。',
    tags: ['Debug', '日常'],
  },
  {
    id: 3,
    date: '2025-03-05',
    mood: '🎉',
    weather: '⛅ 多云',
    content: '收到了心仪公司的实习 offer！这段时间的努力终于有了回报。感谢一直支持我的朋友们，接下来要好好准备入职了。新的征程，加油！',
    tags: ['实习', '里程碑'],
  },
  {
    id: 4,
    date: '2025-02-28',
    mood: '📚',
    weather: '🌤️ 晴间多云',
    content: '读完了《JavaScript 高级程序设计》的第 10 章，对闭包和作用域链有了更深的理解。准备写一篇读书笔记分享到博客上，帮助同样在学习的同学。',
    tags: ['学习', '读书笔记'],
  },
  {
    id: 5,
    date: '2025-02-20',
    mood: '🎵',
    weather: '🌙 晴朗',
    content: '深夜戴着耳机写代码，随机播放到了一首很舒服的 Lo-fi 音乐。窗外月光很亮，键盘声和音乐混在一起，这种感觉真好。记录下这首宝藏歌曲。',
    tags: ['音乐', '深夜 coding'],
  },
  {
    id: 6,
    date: '2025-02-14',
    mood: '🌸',
    weather: '☀️ 晴',
    content: '情人节，一个人也要好好生活。给自己做了一顿丰盛的晚餐，然后继续完善博客的樱花飘落效果。代码不会辜负你，这大概就是程序员的浪漫吧。',
    tags: ['节日', '博客开发'],
  },
])

function parts(dateStr) {
  const key = toDateKey(dateStr)
  const m = key.match(/^(\d{4})-(\d{2})-(\d{2})/)
  return m ? { y: m[1], mo: parseInt(m[2], 10), d: parseInt(m[3], 10) } : { y: '', mo: 1, d: 1 }
}

function getDay(dateStr) {
  return parts(dateStr).d
}

function getMonth(dateStr) {
  const months = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
  return months[parts(dateStr).mo - 1]
}

function getYear(dateStr) {
  return parts(dateStr).y
}

function loadMore() {
  // 模拟加载更多
  hasMore.value = false
}
</script>

<style scoped>
.diary-page {
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

/* 日记列表 */
.diary-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.diary-item {
  display: flex;
  gap: 20px;
  background: var(--color-bg-card);
  border-radius: 16px;
  border: 1px solid var(--color-border);
  padding: 24px;
  transition: all 0.3s ease;
}

.diary-item:hover {
  border-color: var(--color-primary);
  box-shadow: 0 4px 16px rgba(91, 141, 239, 0.1);
}

/* 日期 */
.diary-date {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 60px;
  padding-right: 20px;
  border-right: 2px solid var(--color-border);
}

.date-day {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--color-primary);
  line-height: 1;
}

.date-month {
  font-size: 0.8rem;
  color: var(--color-text-secondary);
  margin-top: 4px;
}

.date-year {
  font-size: 0.7rem;
  color: var(--color-text-muted);
  margin-top: 2px;
}

/* 内容 */
.diary-content {
  flex: 1;
  min-width: 0;
}

.diary-header {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

.diary-mood {
  font-size: 1.2rem;
}

.diary-weather {
  font-size: 0.85rem;
  color: var(--color-text-secondary);
}

.diary-text {
  font-size: 0.95rem;
  color: var(--color-text);
  line-height: 1.8;
  margin-bottom: 12px;
}

.diary-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.diary-tag {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.75rem;
  background: var(--color-primary-light);
  color: var(--color-primary);
}

/* 加载更多 */
.load-more {
  text-align: center;
  margin-top: 32px;
}

.load-btn {
  padding: 10px 32px;
  border-radius: 20px;
  border: 1px solid var(--color-border);
  background: var(--color-bg-card);
  color: var(--color-text-secondary);
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.load-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 60px 0;
}

.empty-icon {
  font-size: 3rem;
  display: block;
  margin-bottom: 16px;
}

.empty-state p {
  font-size: 0.95rem;
  color: var(--color-text-secondary);
}

@media (max-width: 768px) {
  .diary-item {
    flex-direction: column;
    gap: 12px;
  }

  .diary-date {
    flex-direction: row;
    gap: 8px;
    padding-right: 0;
    padding-bottom: 12px;
    border-right: none;
    border-bottom: 1px solid var(--color-border);
  }
}
</style>
