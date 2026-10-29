/** TypeScript 泛型：Pi 精读章法 */
export const tsGenericsContent = `
![TypeScript 泛型封面](/blog/cover-generic.svg "泛型不是炫技，是把「类型参数」显式化")

> 泛型劝退很多人，是因为教程从 \`T\` 开始背。本文从问题出发：**重复类型、丢失推导、约束不够**。读完应能给 \`map\` / \`api\` / 组件 props 写出有约束的泛型，并看懂常见报错在说什么。

---

## 一、为什么需要类型参数

没有泛型时，你要么写死类型，要么写成 \`any\` 放弃检查：

\`\`\`typescript
function first(arr: any[]) { return arr[0] } // 返回 any，调用方瞎了
\`\`\`

有了泛型，**输入决定输出**：

\`\`\`typescript
function first<T>(arr: T[]): T | undefined {
  return arr[0]
}
const n = first([1, 2]) // number | undefined
\`\`\`

| 场景 | 泛型在表达什么 |
|------|----------------|
| 容器 | 元素类型由使用处决定 |
| 工厂 / API | 响应形状随端点变化 |
| 约束 | 「至少长什么样」 |

---

## 二、约束：\`extends\` 不是继承炫技

\`\`\`typescript
function pluck<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}
\`\`\`

\`K extends keyof T\` 的意思是：key 必须是 T 的键。这比 \`string\` 安全一个数量级。

---

## 三、默认与推导

\`\`\`typescript
type Result<T = void> = { ok: true; data: T } | { ok: false; error: string }

async function getJSON<T>(url: string): Promise<T> {
  const res = await fetch(url)
  return res.json() as Promise<T>
}
\`\`\`

优先让编译器推导；只有推导失败或要收窄时才显式传 \`<User>\`。

---

## 四、和 \`interface\` 组合

\`\`\`typescript
interface ApiList<T> {
  items: T[]
  total: number
}
type User = { id: string; name: string }
type UserList = ApiList<User>
\`\`\`

组件库里的 \`Props<T>\`、表格 \`Column<T>\` 同理：表格不知道行类型，使用处才知道。

---

## 五、怎么知道自己学会了

1. \`first(arr: any[])\` 的类型损失具体是什么？  
2. \`K extends keyof T\` 禁止了哪类调用？  
3. 何时该显式传类型参数，何时该靠推导？  
4. \`ApiList<T>\` 比复制三份 UserList/OrderList 好在哪？

---

## 小结

泛型把「稍后再说清楚的类型」变成参数。会约束、会推导、会和 \`keyof\` / 索引访问类型配合，TS 才从「加类型注解」变成「设计类型系统」。
`

export default tsGenericsContent
