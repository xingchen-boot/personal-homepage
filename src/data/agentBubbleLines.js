/**
 * 气泡互动台词（摸头 / 戳脸 / 戳肚）
 * 偏轻松，夹一点星辰站内梗；不替代「问我」正式问答
 */

export const petLines = [
  '嘿嘿，摸头杀对我很有效～',
  '星辰今天也在认真写代码！',
  '摸摸更有动力去改 bug 了。',
  '广工计科 · 星辰，在线营业中。',
  '腾讯实习加油中，谢谢鼓励～',
  '摸完要记得点下面「问我」哦。',
  'GPA 4.0 也需要被摸摸头。',
  '舒服……再摸一下？',
]

export const faceLines = [
  '诶！脸不可以随便戳——',
  '在想 CSS 下沉的链路呢…',
  'FrontCode 的 Agent 循环转起来了吗？',
  '别戳啦，腮红都要掉下来了。',
  '你是在检查我有没有偷懒吗？',
  '戳一下加一滴精神值！',
  'Vue、性能、Agent……脑子有点忙。',
  'Pi 精读在 4321/mine，dsh 从 dsh-ch01 开啃～',
]

export const bellyLines = [
  '呀！肚子好痒——',
  '咕…是不是该去看项目页了？',
  '笑死，被戳破防了。',
  '三七、电信、腾讯…实习履历在肚子里装着。',
  '再戳我就滚去写博客了！',
  '问卷易线上还能打开哦～',
]

/**
 * 按互动类型取一句，尽量不连续重复
 * @param {'pet'|'face'|'belly'} kind
 * @param {number} lastIndex
 * @returns {{ text: string, index: number }}
 */
export function pickBubbleLine(kind, lastIndex = -1) {
  const pool =
    kind === 'pet' ? petLines
      : kind === 'belly' ? bellyLines
        : faceLines
  if (!pool.length) return { text: '……', index: 0 }
  let index = Math.floor(Math.random() * pool.length)
  if (pool.length > 1 && index === lastIndex) {
    index = (index + 1) % pool.length
  }
  return { text: pool[index], index }
}
