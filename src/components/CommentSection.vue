<template>
  <div class="comments">
    <h4 class="comments-title">{{ t('blog.comments') }}</h4>
    <div class="comments-list">
      <div v-for="comment in comments" :key="comment.id" class="comment-item">
        <div class="comment-avatar">{{ comment.author[0] }}</div>
        <div class="comment-content">
          <div class="comment-header">
            <span class="comment-author">{{ comment.author }}</span>
            <span class="comment-time">{{ formatTime(comment.created_at) }}</span>
          </div>
          <p class="comment-text">{{ comment.content }}</p>
        </div>
      </div>
    </div>

    <!-- 评论表单 -->
    <div class="comment-form">
      <input v-model="author" class="form-input" :placeholder="t('blog.namePlaceholder')" />
      <!-- 蜜罐字段：对真人隐藏，机器人常会自动填写 -->
      <input
        v-model="website"
        class="honeypot"
        type="text"
        name="website"
        tabindex="-1"
        autocomplete="off"
        aria-hidden="true"
      />
      <textarea v-model="content" class="form-textarea" :placeholder="t('blog.commentPlaceholder')" rows="3"></textarea>
      <p v-if="errorMessage" class="form-error">{{ errorMessage }}</p>
      <button class="form-btn" @click="submit" :disabled="!author || !content || submitting">
        {{ submitting ? '提交中...' : t('blog.submit') }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getComments, postComment } from '../api'
import { useI18n } from '../composables/useI18n'

const route = useRoute()
const { t } = useI18n()
const comments = ref([])
const author = ref('')
const content = ref('')
/** 蜜罐：应始终为空 */
const website = ref('')
const submitting = ref(false)
const errorMessage = ref('')

async function loadComments() {
  try {
    comments.value = await getComments(route.params.id)
  } catch {
    comments.value = []
  }
}

onMounted(loadComments)

async function submit() {
  if (!author.value || !content.value || submitting.value) return
  submitting.value = true
  errorMessage.value = ''
  try {
    await postComment(route.params.id, {
      author: author.value,
      content: content.value,
      website: website.value,
    })
    author.value = ''
    content.value = ''
    website.value = ''
    await loadComments()
  } catch (err) {
    errorMessage.value = err.message || '提交失败'
  } finally {
    submitting.value = false
  }
}

function formatTime(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  const now = new Date()
  const diff = now - d
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return t('blog.justNow')
  if (minutes < 60) return `${minutes}${t('blog.minutesAgo')}`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}${t('blog.hoursAgo')}`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}${t('blog.daysAgo')}`
  return d.toLocaleDateString()
}
</script>

<style scoped>
.comments {
  margin-top: 16px;
  padding: 16px;
  background: var(--color-bg-card);
  border-radius: 12px;
  border: 1px solid var(--color-border);
}

.comments-title {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 12px;
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.comment-item {
  display: flex;
  gap: 10px;
}

.comment-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--color-primary-light);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  flex-shrink: 0;
}

.comment-content {
  flex: 1;
  min-width: 0;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.comment-author {
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--color-text);
}

.comment-time {
  font-size: 0.7rem;
  color: var(--color-text-muted);
}

.comment-text {
  font-size: 0.8rem;
  color: var(--color-text-secondary);
  line-height: 1.5;
}

.comment-form {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-input,
.form-textarea {
  padding: 8px 12px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-bg);
  color: var(--color-text);
  font-size: 0.85rem;
  outline: none;
  transition: border-color 0.2s;
}

.form-input:focus,
.form-textarea:focus {
  border-color: var(--color-primary);
}

.form-textarea {
  resize: vertical;
  font-family: inherit;
}

.form-btn {
  align-self: flex-end;
  padding: 6px 16px;
  border: none;
  border-radius: 8px;
  background: var(--color-primary);
  color: #fff;
  font-size: 0.8rem;
  cursor: pointer;
  transition: opacity 0.2s;
}

.form-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.form-btn:not(:disabled):hover {
  opacity: 0.85;
}

.honeypot {
  position: absolute;
  left: -10000px;
  top: auto;
  width: 1px;
  height: 1px;
  overflow: hidden;
  opacity: 0;
}

.form-error {
  font-size: 0.8rem;
  color: #e05c5c;
}
</style>
