<template>
  <div class="playlist-page">
    <div class="page-container">
      <h1 class="page-title">我的歌单</h1>
      <p class="page-subtitle">音乐是编程时最好的伴侣</p>

      <!-- 歌单分类 -->
      <div class="playlist-tabs">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          class="tab-btn"
          :class="{ active: activeTab === tab.key }"
          @click="activeTab = tab.key"
        >
          {{ tab.name }}
        </button>
      </div>

      <!-- 歌曲列表 -->
      <div class="song-list">
        <div
          v-for="(song, index) in filteredSongs"
          :key="song.id"
          class="song-item"
          :class="{ playing: currentSong?.id === song.id }"
          @click="playSong(song)"
        >
          <div class="song-index">
            <span v-if="currentSong?.id === song.id" class="playing-icon">♪</span>
            <span v-else>{{ index + 1 }}</span>
          </div>
          <div class="song-cover">
            <img :src="song.cover" :alt="song.title" />
          </div>
          <div class="song-info">
            <span class="song-title">{{ song.title }}</span>
            <span class="song-artist">{{ song.artist }}</span>
          </div>
          <div class="song-album">{{ song.album }}</div>
          <div class="song-duration">{{ song.duration }}</div>
        </div>
      </div>

      <!-- 推荐语 -->
      <section class="recommend-section">
        <h2 class="section-title">我的音乐品味</h2>
        <div class="taste-tags">
          <span v-for="tag in tasteTags" :key="tag" class="taste-tag">{{ tag }}</span>
        </div>
        <p class="recommend-text">
          编程时喜欢听轻音乐和 Lo-fi，调试 Bug 时需要一点摇滚来提神，
          周末放松时偏向民谣和爵士。音乐让代码更有灵魂。
        </p>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const activeTab = ref('all')

const tabs = [
  { key: 'all', name: '全部' },
  { key: 'coding', name: '编程必备' },
  { key: 'relax', name: '放松时刻' },
  { key: 'energy', name: '提神醒脑' },
]

const songs = [
  { id: 1, title: 'Lofi Chill', artist: 'Lofi Girl', album: 'Chill Beats', duration: '3:24', category: 'coding', cover: 'https://picsum.photos/seed/music1/100/100' },
  { id: 2, title: 'Midnight Coding', artist: 'Code & Coffee', album: 'Dev Sessions', duration: '4:12', category: 'coding', cover: 'https://picsum.photos/seed/music2/100/100' },
  { id: 3, title: 'Spring Walk', artist: 'Ambient Garden', album: 'Nature Sounds', duration: '5:01', category: 'relax', cover: 'https://picsum.photos/seed/music3/100/100' },
  { id: 4, title: 'Jazz in the Rain', artist: 'Rainy Jazz', album: 'Café Moments', duration: '3:45', category: 'relax', cover: 'https://picsum.photos/seed/music4/100/100' },
  { id: 5, title: 'Bohemian Rhapsody', artist: 'Queen', album: 'A Night at the Opera', duration: '5:55', category: 'energy', cover: 'https://picsum.photos/seed/music5/100/100' },
  { id: 6, title: 'Don\'t Stop Me Now', artist: 'Queen', album: 'Jazz', duration: '3:29', category: 'energy', cover: 'https://picsum.photos/seed/music6/100/100' },
  { id: 7, title: 'Piano Sonata No. 11', artist: 'Mozart', album: 'Classical Best', duration: '6:30', category: 'coding', cover: 'https://picsum.photos/seed/music7/100/100' },
  { id: 8, title: 'Sunset Lover', artist: 'Petit Biscuit', album: 'Presence', duration: '3:40', category: 'relax', cover: 'https://picsum.photos/seed/music8/100/100' },
  { id: 9, title: 'Thunder', artist: 'Imagine Dragons', album: 'Evolve', duration: '3:05', category: 'energy', cover: 'https://picsum.photos/seed/music9/100/100' },
  { id: 10, title: 'Weightless', artist: 'Marconi Union', album: 'Ambient', duration: '8:09', category: 'coding', cover: 'https://picsum.photos/seed/music10/100/100' },
]

const currentSong = ref(null)

const filteredSongs = computed(() => {
  if (activeTab.value === 'all') return songs
  return songs.filter(song => song.category === activeTab.value)
})

const tasteTags = ['Lo-fi', '轻音乐', '爵士', '古典', '摇滚', '民谣', '电子', '纯音乐']

function playSong(song) {
  currentSong.value = currentSong.value?.id === song.id ? null : song
}
</script>

<style scoped>
.playlist-page {
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
  margin-bottom: 32px;
}

/* 分类标签 */
.playlist-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.tab-btn {
  padding: 8px 20px;
  border-radius: 20px;
  border: 1px solid var(--color-border);
  background: var(--color-bg-card);
  color: var(--color-text-secondary);
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tab-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.tab-btn.active {
  background: var(--color-primary);
  color: #fff;
  border-color: var(--color-primary);
}

/* 歌曲列表 */
.song-list {
  background: var(--color-bg-card);
  border-radius: 16px;
  border: 1px solid var(--color-border);
  overflow: hidden;
  margin-bottom: 40px;
}

.song-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 1px solid var(--color-border);
}

.song-item:last-child {
  border-bottom: none;
}

.song-item:hover {
  background: var(--color-primary-light);
}

.song-item.playing {
  background: var(--color-primary-light);
}

.song-item.playing .song-title {
  color: var(--color-primary);
}

.song-index {
  width: 24px;
  text-align: center;
  font-size: 0.85rem;
  color: var(--color-text-muted);
}

.playing-icon {
  color: var(--color-primary);
  animation: pulse 1s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.song-cover {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
}

.song-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.song-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.song-title {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--color-text);
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.song-artist {
  font-size: 0.8rem;
  color: var(--color-text-secondary);
}

.song-album {
  font-size: 0.8rem;
  color: var(--color-text-muted);
  min-width: 100px;
}

.song-duration {
  font-size: 0.8rem;
  color: var(--color-text-muted);
  font-family: 'Fira Code', monospace;
}

/* 推荐语 */
.recommend-section {
  background: var(--color-bg-card);
  border-radius: 16px;
  border: 1px solid var(--color-border);
  padding: 24px;
}

.section-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 16px;
}

.taste-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.taste-tag {
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.8rem;
  background: var(--color-primary-light);
  color: var(--color-primary);
}

.recommend-text {
  font-size: 0.9rem;
  color: var(--color-text-secondary);
  line-height: 1.8;
}

@media (max-width: 768px) {
  .song-album {
    display: none;
  }

  .song-item {
    padding: 12px 16px;
  }
}
</style>
