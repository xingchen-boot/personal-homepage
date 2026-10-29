/** Vue Composition API：Pi 精读章法 */
export const vueCompositionContent = `
![Vue3 组合式开发](/blog/cover-vue.jpeg "封面：用组合，而不是用选项类型切豆腐")

> Composition API 的收益不来自「新语法」，而来自 **按关注点聚合 + composable 复用**。读完应能拆一个大页成若干 \`useXxx\`，守住响应式边界，并说明何时该进 Pinia。

---

## 一、Options 在大组件里痛在哪

同一业务的 \`data / methods / watch\` 被拆到文件四处，阅读要上下跳。  
Composition 允许：**状态、计算、副作用按功能块挨在一起**。

---

## 二、composable 约定

\`\`\`javascript
import { ref, computed } from 'vue'

export function useCounter(initialValue = 0) {
  const count = ref(initialValue)
  const doubled = computed(() => count.value * 2)
  const increment = () => { count.value += 1 }
  return { count, doubled, increment }
}
\`\`\`

| 约定 | 理由 |
|------|------|
| 命名 \`useXxx\` | 一眼可辨 |
| 返回状态 + 显式方法 | 避免隐式全局 |
| 副作用可清理 | 防泄漏 |
| 单一关注点 | 别做成上帝 use |

---

## 三、守住响应式边界

\`\`\`javascript
import { toRefs, unref, computed } from 'vue'

export function useFeature(props) {
  const { data } = toRefs(props)
  const label = computed(() => unref(data)?.name ?? '—')
  return { label }
}
\`\`\`

翻车点：解构 props 丢响应式；过早 \`unref\`；composable 偷偷变全局单例导致难测。

---

## 四、页面内代码顺序（可读性纪律）

1. props / emits  
2. 本页状态  
3. composable  
4. computed  
5. methods  
6. 生命周期  

跨页共享 → Pinia；页内私有 → \`ref\`。请求态固定返回 \`{ loading, error, data, reload }\` 便于测试。

---

## 五、怎么知道自己学会了

1. Composition 相对 Options 的结构性收益是什么？  
2. 为何 \`const { x } = props\` 危险？  
3. 什么状态该进 Pinia，什么留在 composable？  
4. 如何测一个 \`useXxx\` 而不挂整页 UI？

---

## 小结

Composition API 是组织纪律：大型组件可读、逻辑可测可复用、响应式边界显式。当成结构设计工具，而不是语法糖，收益最大。
`

export default vueCompositionContent
