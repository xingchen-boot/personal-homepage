/** React Hooks：Pi 精读章法 */
export const reactHooksContent = `
![React Hooks 封面](/blog/cover-generic.svg "Hooks 是订阅与同步的语法，不是生命周期翻译器")

> 把 \`componentDidMount\` 一对一翻译成 \`useEffect\`，是学 Hooks 的最大弯路。本文建立：**渲染是计算、Effect 是同步外部世界、依赖数组是诚实声明**。读完应能解释一次「无限重渲染」的根因，并写出可清理的订阅。

---

## 一、两个世界

| 世界 | 例子 | 用什么 |
|------|------|--------|
| 纯计算 UI | 从 props/state 推导画面 | 渲染体 + \`useMemo\`（必要时） |
| 外部系统 | DOM、网络、订阅、定时器 | \`useEffect\` / \`useLayoutEffect\` |

\`\`\`javascript
useEffect(() => {
  const ctrl = new AbortController()
  load(id, ctrl.signal).then(setData)
  return () => ctrl.abort()
}, [id])
\`\`\`

依赖必须诚实：用了 \`id\` 就写 \`[id]\`；用空数组「只想挂载一次」却闭包了会变的值，必出 stale bug。

---

## 二、状态：按「最小完整」切

- 能算出来的别再存一份（派生用表达式 / \`useMemo\`）  
- 相关字段用一个 state，避免多 \`set\` 不同步  
- 复杂更新用 \`useReducer\` 比散落 \`setA/setB\` 清晰  

---

## 三、自定义 Hook：复用「订阅方式」

\`\`\`javascript
function useWindowWidth() {
  const [w, setW] = useState(() => window.innerWidth)
  useEffect(() => {
    const onResize = () => setW(window.innerWidth)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return w
}
\`\`\`

Hook 复用的是**状态 + Effect 协议**，不是复制 JSX。

---

## 四、常见翻车

| 现象 | 原因 |
|------|------|
| 无限请求 | Effect 里 \`setState\` 改了依赖对象每次新引用 |
| 卸载报错 | 未 abort / 未忽略过期响应 |
| 事件里读到旧 state | 闭包过期，需函数式更新或 ref |

---

## 五、怎么知道自己学会了

1. 为什么「把 didMount 翻译成 useEffect([])」危险？  
2. 依赖数组「少写」和「多写」各导致什么？  
3. 自定义 Hook 相对高阶组件的优势？  
4. 如何用 abort 证明你理解了 Effect 清理？

---

## 小结

Hooks 把组件变成「数据进、UI 出」的函数，Effect 专门对齐外部世界。诚实的依赖与成对的清理，比背 API 列表重要得多。
`

export default reactHooksContent
