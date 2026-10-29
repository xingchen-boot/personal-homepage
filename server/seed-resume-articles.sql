-- 简历向深度文章（可重复执行：先删后插）
USE personal_blog;

DELETE FROM blog_tags WHERE blog_id IN ('css-runtime-sinking', 'virtual-list-streaming', 'frontcode-ai-agent');
DELETE FROM blogs WHERE id IN ('css-runtime-sinking', 'virtual-list-streaming', 'frontcode-ai-agent');

INSERT INTO blogs (id, title, date, category, summary, content) VALUES
('css-runtime-sinking', '从 Electron 到 Qt：CSS 下沉链路怎么打通', '2026-06-12', '性能优化',
 '记录腾讯实习中 PC QQ 样式下沉架构：Vue SFC 编译、窗级 cssMap、Qt StyleEngine 与冷挂载优化路径。',
 '## 背景\n\nPC QQ 客户端在从 Electron 渐进迁移到 Qt 原生渲染时，业务侧仍大量以 Vue 组件描述 UI。\n如果继续「各窗口各自解析样式」，多窗口场景会重复编译、重复建图，冷挂载成本极高。\n\n本文梳理我参与的 **CSS 下沉** 思路：让静态样式按窗口共享，运行时只做必要的级联与增量更新。\n\n## 目标链路\n\n一条可落地的目标链路是：\n\n`Vue SFC → 编译产物 / cssMap → 节点元数据 → Qt StyleEngine → Fabric 渲染`\n\n## 性能专项\n\n在 650 节点调试页上，冷挂载从约 **44.859s** 降到 **378ms**，选择器解析次数下降约 **99%**。\n\n## 小结\n\nCSS 下沉是一次编译期结构化 + 运行时级联 + 增量刷新的工程化改造。'),

('virtual-list-streaming', '万级列表与流式 AI：两段前端性能实战', '2026-01-20', '性能优化',
 '汇总电信实习中的虚拟列表与 EventSource 流式问答，以及三七互娱双向虚拟滚动与 Worker 轮询经验。',
 '## 虚拟列表\n\n万级数据直接渲染会把 DOM 推到万级节点。自研虚拟列表把可见 DOM 收敛到约 30 个节点后，内存从约 800MB 降到约 280MB，滚动可稳定在 55fps+。\n\n## 流式 AI\n\n基于 EventSource 的流式输出让首包体感从约 3s 到 0.8s。\n\n## Worker 轮询\n\n把轮询放到 Web Worker，主线程只做任务注册与结果消费。'),

('frontcode-ai-agent', 'FrontCode：做一个类 Claude Code 的终端 Agent', '2026-04-08', 'AI',
 '个人项目 FrontCode 的架构笔记：Tool Agent 循环、MCP 热插拔、Skill 协议与 LanceDB RAG 记忆。',
 '## 目标\n\n在终端里把推理和动手接起来：模型决策后调用本地工具，再把结果回传。\n\n## Tool Agent 循环\n\n输入 → 决策 → 工具执行 → 回传 → 直到最终回答。\n\n## MCP / Skill / RAG\n\nMCP 做能力热插拔，Skill 做按需知识注入，LanceDB 做本地语义检索与跨会话记忆。');

INSERT IGNORE INTO tags (name) VALUES
('CSS Runtime'), ('Qt'), ('性能优化'), ('腾讯实习'),
('虚拟列表'), ('EventSource'), ('Web Worker'),
('AI Agent'), ('MCP'), ('RAG'), ('Node.js');

INSERT INTO blog_tags (blog_id, tag_id)
SELECT 'css-runtime-sinking', id FROM tags WHERE name IN ('CSS Runtime', 'Qt', '性能优化', '腾讯实习');

INSERT INTO blog_tags (blog_id, tag_id)
SELECT 'virtual-list-streaming', id FROM tags WHERE name IN ('虚拟列表', 'EventSource', 'Web Worker', '性能优化');

INSERT INTO blog_tags (blog_id, tag_id)
SELECT 'frontcode-ai-agent', id FROM tags WHERE name IN ('AI Agent', 'MCP', 'RAG', 'Node.js');
