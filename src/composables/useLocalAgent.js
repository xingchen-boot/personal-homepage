/**
 * 无 API Key 的本地问答引擎
 * - 关键词 / 子串打分检索知识库
 * - 按意图拼出可读回答，并附上站内链接
 */
import { agentKnowledge } from '../data/agentKnowledge'

/**
 * 简单规范化：小写、去空白与常见标点
 * @param {string} text
 */
function normalize(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[\s，。！？、；：,.!?;:'"`~（）()【】\[\]《》<>]/g, '')
}

/**
 * 给一条知识打分
 * @param {string} queryNorm
 * @param {object} item
 */
function scoreItem(queryNorm, item) {
  if (!queryNorm) return 0
  let score = 0
  const haystack = normalize(`${item.title}${item.text}${(item.keywords || []).join('')}`)

  for (const keyword of item.keywords || []) {
    const key = normalize(keyword)
    if (!key) continue
    if (queryNorm.includes(key) || key.includes(queryNorm)) {
      score += 6
    } else if (haystack.includes(key) && queryNorm.length >= 2) {
      // 问句里出现知识相关字的弱匹配：按字符重叠
      let overlap = 0
      for (const ch of key) {
        if (queryNorm.includes(ch)) overlap += 1
      }
      if (overlap >= Math.min(2, key.length)) score += 1
    }
  }

  // 问句字符与正文重叠（中文短句友好）
  let charHits = 0
  const uniqueChars = [...new Set(queryNorm.split(''))]
  for (const ch of uniqueChars) {
    if (ch && haystack.includes(ch)) charHits += 1
  }
  score += Math.min(charHits, 8) * 0.35

  return score
}

/**
 * 检索最相关的若干条知识
 * @param {string} question
 * @param {number} limit
 */
export function retrieveKnowledge(question, limit = 3) {
  const queryNorm = normalize(question)
  const ranked = agentKnowledge
    .map((item) => ({ item, score: scoreItem(queryNorm, item) }))
    .filter((row) => row.score > 1.2)
    .sort((a, b) => b.score - a.score)

  return ranked.slice(0, limit)
}

/**
 * 根据问题生成本地回答
 * @param {string} question
 */
export function answerLocally(question) {
  const trimmed = String(question || '').trim()
  if (!trimmed) {
    return {
      answer: '你可以问我：实习经历、项目亮点、技术栈或联系方式。',
      matches: [],
    }
  }

  const matches = retrieveKnowledge(trimmed, 3)

  if (matches.length === 0) {
    return {
      answer:
        '我暂时只能根据站内公开资料回答（简历、项目、关于）。你可以试试：「腾讯实习做什么」「有哪些项目」「怎么联系你」。若需要更自由的对话，以后可以再接大模型 API。',
      matches: [],
    }
  }

  const top = matches[0]
  const extras = matches.slice(1)

  let answer = `【${top.item.title}】\n${top.item.text}`

  if (extras.length) {
    answer += '\n\n你可能还想了解：'
    for (const row of extras) {
      answer += `\n· ${row.item.title}：${row.item.text.slice(0, 42)}${row.item.text.length > 42 ? '…' : ''}`
    }
  }

  answer += '\n\n（本地检索回答，未调用在线大模型）'

  return {
    answer,
    matches: matches.map((row) => row.item),
  }
}

export function useLocalAgent() {
  return {
    answerLocally,
    retrieveKnowledge,
  }
}
