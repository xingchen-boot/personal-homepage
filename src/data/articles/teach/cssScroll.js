/** 横向滚动：Pi 精读章法 */
export const cssScrollContent = `
![横向滚动布局示意](/blog/cover-css-scroll.jpg "封面：卡片轨道是内容型产品的高频交互")

> 「能滚」只是及格线。横向轨道要同时照顾：**宽度策略、吸附、触控板/触屏、键盘与读屏**。读完应能交付一条不撑破整页、可 snap、有无障碍退路的轨道，而不是只会 \`overflow-x: auto\`。

---

## 一、场景与目标

图片墙、套餐卡、标签轨、推荐位都需要横向滚动。目标：

1. 桌面触控板 / 鼠标 / 触屏都顺手  
2. 吸附符合产品预期  
3. 不破坏整页横向布局  
4. 键盘与读屏有替代路径  

![横向滚动结构](/blog/scroll-snap.svg "图 1：固定宽卡片 + snap 吸附点")

---

## 二、基线：overflow-x + flex

\`\`\`css
.scroll-container {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  overflow-y: hidden;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
}
.scroll-item {
  flex: 0 0 auto;
  width: min(300px, 78vw);
  scroll-snap-align: start;
}
\`\`\`

| 要点 | 为什么 |
|------|--------|
| \`flex: 0 0 auto\` | 防止被挤扁 |
| \`min(..., 78vw)\` | 小屏仍能露出下一张的暗示 |
| snap | 松手后停在卡片边界 |

---

## 三、别让整页跟着横滑

父级常需：\`overflow-x: hidden\`（或 \`max-width: 100%\`），轨道自身滚动。  
\`width: 100vw\` 在有滚动条时可能溢出——优先 \`100%\`。

隐藏滚动条可以，但**必须保留可滚动性**，并提供按钮/键盘替代，否则等于剥夺能力。

\`\`\`css
.scroll-container {
  scrollbar-width: none;
}
.scroll-container::-webkit-scrollbar { display: none; }
\`\`\`

---

## 四、无障碍与和轮播的边界

- Tab 能聚焦卡片内链接  
- 左右按钮 \`scrollBy\` 作为替代控件  
- 只要「用户掌控滚动」用轨道；要自动播放/指示点再上轮播，不要混成四不像  

---

## 五、怎么知道自己学会了

1. 子项为何不能 \`flex: 1\`？  
2. 隐藏滚动条后还缺什么？  
3. \`100vw\` 可能带来什么问题？  
4. 轨道与轮播的产品边界如何划？

---

## 小结

横向滚动的完成度取决于 **宽度策略 + 吸附 + 输入设备 + 无障碍**。先把 flex 轨道做稳，再决定强 snap 与自定义拖拽。
`

export default cssScrollContent
