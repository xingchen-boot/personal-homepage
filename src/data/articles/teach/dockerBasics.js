/** Docker 基础：Pi 精读章法 */
export const dockerBasicsContent = `
![容器化封面](/blog/cover-generic.svg "镜像是配方，容器是一次运行中的实例")

> Docker 入门文常停在「会敲几个命令」。本文要你建立三个对象的心智模型：**镜像 / 容器 / 卷**，弄清它们和虚拟机的差别，并能写一份可复现的 Dockerfile + compose。读完应能解释「为什么代码改了容器里却没变」。

---

## 一、三个对象，先别混

| 对象 | 一句话 | 常见误解 |
|------|--------|----------|
| 镜像 Image | 只读的分层配方 | 当成「正在跑的系统」 |
| 容器 Container | 镜像 + 可写层的一次运行 | 当成永久服务器 |
| 卷 Volume | 容器外的持久化目录 | 以为写进容器就永远在 |

\`\`\`
镜像（分层）
  └─ 启动 → 容器（可写层叠在上面）
              ├─ 删容器：可写层可丢
              └─ 数据要留：挂卷 / 绑定挂载
\`\`\`

和虚拟机比：容器共享宿主机内核，更轻；隔离更弱，安全边界要另想。

---

## 二、最小可复现：Dockerfile

\`\`\`dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
\`\`\`

纪律：

1. **依赖与源码分层拷贝**，才能吃到层缓存  
2. \`.dockerignore\` 排除 \`node_modules\`、\`.git\`  
3. 生产用非 root 用户（进阶必做）

\`\`\`bash
docker build -t my-app:1.0 .
docker run --rm -p 3000:3000 my-app:1.0
\`\`\`

---

## 三、compose：多进程编排入门

\`\`\`yaml
services:
  web:
    build: .
    ports: ["3000:3000"]
    environment:
      DATABASE_URL: postgres://db:5432/app
    depends_on: [db]
  db:
    image: postgres:16
    volumes: ["pgdata:/var/lib/postgresql/data"]
volumes:
  pgdata:
\`\`\`

一键 \`docker compose up\` 的价值是：**环境描述进仓库**，减少「在我机器上能跑」。

---

## 四、调试时最常踩的坑

| 现象 | 原因 | 处理 |
|------|------|------|
| 改了代码容器没变 | 用的是旧镜像层 / 没挂载源码 | 重建或开发时 bind mount |
| 删容器数据没了 | 写在可写层 | 用 named volume |
| 端口访问失败 | 映射写反或只听 127.0.0.1 | \`-p 宿主:容器\`，进程听 0.0.0.0 |

---

## 五、怎么知道自己学会了

1. 镜像和容器谁可删、删了丢什么？  
2. 为什么先 COPY package.json 再 npm ci？  
3. 数据库数据应该放镜像里还是卷里？为什么？  
4. 绑定挂载适合开发还是生产只读发布？

---

## 小结

Docker 的核心不是命令表，而是 **不可变镜像 + 短命容器 + 外置状态**。把环境写成 Dockerfile/compose，协作与部署的摩擦才会下降。
`

export default dockerBasicsContent
