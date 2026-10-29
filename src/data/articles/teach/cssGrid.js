/** CSS Grid：Pi 精读章法 */
export const cssGridContent = `
![Grid 布局封面](/blog/cover-generic.svg "二维布局用 Grid；一维轨道用 Flex")

> Flex 和 Grid 被混用多年。本文只解决一件事：**何时用 Grid、轨道与区域怎么想、和 Flex 如何分工**。读完应能徒手画出 \`grid-template-areas\` 的页面骨架，并说清「一维 vs 二维」的判据。

---

## 一、判据：一维还是二维

| 需求 | 更合适 | 理由 |
|------|--------|------|
| 一行工具栏、主轴对齐 | Flex | 一条轴上分配空间 |
| 整页圣杯 / 卡片矩阵 / 重叠定位 | Grid | 行+列同时约束 |
| 组件内部从左到右挤 | Flex | 内容驱动宽度 |
| 版心分栏对齐 | Grid | 轨道对齐是一等公民 |

> 不是「Grid 更新所以全用 Grid」。二维对齐选 Grid，一维流式选 Flex，常在同一页共存。

---

## 二、轨道心智：先定线，再放物品

\`\`\`css
.layout {
  display: grid;
  grid-template-columns: 240px 1fr 1fr;
  grid-template-rows: auto 1fr auto;
  gap: 16px;
  min-height: 100vh;
}
\`\`\`

\`fr\` 是「剩余空间的份数」，不是魔法百分比。  
\`minmax(0, 1fr)\` 常用来防止子项 \`min-content\` 把轨道撑破。

---

## 三、区域命名：给大脑减负

\`\`\`css
.page {
  display: grid;
  grid-template-areas:
    "nav nav"
    "side main"
    "foot foot";
  grid-template-columns: 200px 1fr;
}
.nav  { grid-area: nav; }
.side { grid-area: side; }
.main { grid-area: main; }
.foot { grid-area: foot; }
\`\`\`

ASCII 画布即文档——改布局先改 areas 字符串，比改一堆 line number 更不易错。

---

## 四、自动流与响应式

\`\`\`css
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
}
\`\`\`

\`auto-fit\` / \`auto-fill\` 差在「空轨道是否折叠」。卡片墙优先 \`auto-fit + minmax\`。

---

## 五、怎么知道自己学会了

1. 导航条横排用 Grid 还是 Flex？依据是什么？  
2. 为什么子项会把 \`1fr\` 轨道撑出横向滚动？如何修？  
3. \`grid-template-areas\` 相对线号定位的优点？  
4. \`auto-fit\` 与 \`auto-fill\` 在只有两项时的视觉差？

---

## 小结

Grid 是 **二维轨道系统**：先设计线与区域，再往里放内容。和 Flex 分工清楚后，布局代码会明显变短、变稳。
`

export default cssGridContent
