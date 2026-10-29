/** JS 性能：Pi 精读章法 */
export const jsPerformanceContent = `
![性能优化封面](/blog/cover-perf.jpeg "先测量，再优化；没有指标的优化只是玄学")

> 性能文章最容易写成技巧清单。本文反过来：**先建立指标与瓶颈模型，再按杠杆排序动手**。读完应能对一个卡顿页面说出「贵在加载 / 解析 / 长任务 / 布局哪一段」，并给出可验证的改法，而不是空谈「又优化了 30%」。

---

## 一、先说结论：性能是产品问题

靠谱路径只有三步：

1. **定义指标**：LCP / INP / CLS，或业务自定义（首屏可交互、列表帧率）
2. **定位瓶颈**：下载、解析、主线程长任务，还是布局抖动
3. **按杠杆排序**：大改架构前，先砍最贵的那一段

| 阶段 | 你在优化什么 | 典型手段 |
|------|-------------|---------|
| 加载 | 字节与优先级 | 拆包、压缩、预加载 |
| 解析/编译 | 主线程开工前 | 减小 JS、延迟非关键 |
| 运行时 | 交互卡顿 | 拆长任务、虚拟列表 |
| 视觉稳定 | 跳变 | 尺寸预留、字体策略 |

> 没有 Performance / Web Vitals / 用户采样，就不要空谈百分比。

---

## 二、加载：让字节更少、更早可用

路由懒加载把「首屏用不到的页」挪出主包；第三方脚本用 \`defer\` / 空闲加载。  
记住：**拆包不是目的，缩短关键路径才是。** 拆得过碎会换来瀑布请求。

\`\`\`javascript
// 路由级：首屏不下载后台页
const Admin = () => import('./views/Admin.vue')
\`\`\`

图片：正确尺寸、现代格式、\`loading="lazy"\`（首屏 LCP 图除外）。

---

## 三、运行时：长任务与列表

主线程一次连续工作 >50ms，输入就会「肉」。策略：

- 大循环切块 + \`scheduler.postTask\` / \`requestIdleCallback\`
- 万级列表 → 虚拟窗口（见本站《万级列表与流式 AI》）
- 避免在 \`input\` 事件里做重布局；用 \`rAF\` 合批读几何

\`\`\`javascript
async function processChunks(items, size = 100) {
  for (let i = 0; i < items.length; i += size) {
    heavyWork(items.slice(i, i + size))
    await new Promise((r) => requestAnimationFrame(r))
  }
}
\`\`\`

---

## 四、布局抖动：先读后写

交错读写几何会强制同步布局：

\`\`\`
坏：读 height → 写 class → 读 width → 写 style …
好：先批量读完，再批量写
\`\`\`

动画优先 \`transform\` / \`opacity\`，少推 layout。

---

## 五、怎么测量才不算玄学

1. Lab：Performance 面板看 Long Task、Bottom-Up  
2. Field：Web Vitals 采样（真实网络与设备）  
3. 每次改动只动一个变量，对比同一条用户路径  

---

## 六、怎么知道自己学会了

1. 说出 LCP 与 INP 分别代表什么用户感受。  
2. 拆包过碎时，可能反而变慢的原因是什么？  
3. 为什么虚拟列表属于运行时杠杆而不是加载杠杆？  
4. 举一个强制同步布局的读写交错例子。

---

## 小结

性能优化是 **指标 → 定位 → 杠杆** 的循环。技巧很多，但没有测量的技巧只是噪音；先砍最贵的一段，再谈微调。
`

export default jsPerformanceContent
