<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# 第一批可直接丢进 Cursor 的启动 prompt

可以。第一批丢进 Cursor 的启动 prompt，目标不是马上生成一堆页面，而是先让它 **读规则、读架构、读设计系统，然后按最小可实施路径搭骨架**。 对 Cursor 来说，开局 prompt 最有效的做法是：给清楚的 repo 上下文、指定先读哪些文件、要求先出 plan，再允许改代码。[^1][^2][^3]

下面我给你一套 **可以直接复制进 Cursor** 的"第一批启动 prompt 套餐"。
建议顺序就是：**Prompt 1 → Prompt 2 → Prompt 3 → Prompt 4 → Prompt 5a → Prompt 5b → Prompt 6 → Prompt 7**。

***

## Prompt 1：读仓库并建立上下文

这个 prompt 先让 Cursor 进入"理解项目"模式，不急着写代码。[^2][^3]

```text
Goal:
先全面理解这个项目，再提出启动实施方案。暂时不要直接写大量代码。

Context:
这是一个 Web-first tax filing application。
技术栈已确认：
- Frontend: Next.js + React + TypeScript + Tailwind CSS + shadcn/ui
- Backend: Node.js + Fastify + Drizzle ORM
- Tax engine: Rust + Cargo
- Database: PostgreSQL
- Queue: Redis + BullMQ
- Package manager: pnpm
- Monorepo tool: Turborepo
- Deployment: Vercel (frontend) + Railway/Fly.io (API + Rust engine)

项目结构：
taxcode/
├── apps/
│   ├── web/           ← Next.js + Tailwind + shadcn/ui
│   ├── api/           ← Fastify + Drizzle + BullMQ
│   └── tax-engine/    ← Rust + Cargo
├── packages/
│   └── shared-types/  ← shared Zod schemas / TypeScript types
├── turbo.json
├── pnpm-workspace.yaml
└── README.md

视觉方向来自一个 mobile wallet 风格的 Figma 参考图，但产品本质是 Web 优先报税应用，不是移动钱包应用。
网页需要保留柔和卡片视觉语言，但必须采用 desktop-first dashboard / forms / tables 的交互结构。

Files to inspect first:
cursor rules under /Users/xiu/Documents/AIWorkflow/accounting/TaxCode/.cursor/rules
@architecture.md
@design-system.md

Constraints:
- 先理解，不要直接做大改动。
- 如果仓库还没初始化，请明确指出当前状态。
- 不要默认按移动端 App 方式实现。
- 先总结现状、缺口、建议的第一步。

Plan first:
请先输出：
1. 你对项目目标的理解
2. 当前仓库结构概览
3. 缺失的关键文件/目录
4. 推荐的第一阶段实施顺序
5. 你认为最合理的"先做什么、后做什么"

Deliverables:
输出一份简明的启动分析，不修改代码，除非我明确批准下一步。
```

***

## Prompt 2：搭建完整 Monorepo 骨架

Prompt 1 之后，用这个 prompt 让 Cursor 初始化整个 monorepo 的基础结构，三端并行搭建。[^4][^1]

```text
Goal:
为 TaxCode 项目搭建完整的 monorepo 骨架，包括前端、后端和 Rust 引擎三个子项目的初始化。

Context:
项目技术栈已确认：
- Package manager: pnpm
- Monorepo tool: Turborepo
- apps/web: Next.js + React + TypeScript + Tailwind CSS + shadcn/ui
- apps/api: Fastify + Drizzle ORM + BullMQ + TypeScript
- apps/tax-engine: Rust + Cargo
- packages/shared-types: shared Zod schemas / TypeScript types
- Database: PostgreSQL (本地开发用 Docker)

目标结构：
taxcode/
├── apps/
│   ├── web/           ← Next.js (App Router)
│   ├── api/           ← Fastify + Drizzle
│   └── tax-engine/    ← Rust
├── packages/
│   └── shared-types/  ← Zod schemas
├── turbo.json
├── pnpm-workspace.yaml
├── docker-compose.yml ← PostgreSQL + Redis
├── .env.example
└── README.md

Files to inspect first:
@.cursor/rules/core-stack-and-mission.mdc
@.cursor/rules/backend-standards.mdc
@.cursor/rules/rust-tax-engine.mdc
@.cursor/rules/database-queue-and-quality.mdc
@.cursor/rules/frontend-standards.mdc
@architecture.md
@design-system.md

Constraints:
- 使用 pnpm 作为包管理器。
- 使用 Turborepo 管理任务 pipeline。
- apps/web 使用 Next.js App Router，TypeScript strict mode。
- apps/api 使用 Fastify，插件化模块结构（auth, filings, documents, tax-engine-gateway, jobs）。
- apps/tax-engine 是 Rust Cargo workspace member，提供一个 /calculate stub endpoint。
- packages/shared-types 导出共享的 Zod schemas，供 web 和 api 使用。
- docker-compose.yml 包含 PostgreSQL 和 Redis。
- .env.example 包含所有需要的环境变量（DB, Redis, JWT secret, Rust engine URL）。
- 不要写业务逻辑，只搭骨架。
- 如果要引入依赖，请先列出并说明原因。

Plan first:
请先输出：
1. 完整的目录和文件创建计划
2. 每个子项目的 package.json 依赖
3. turbo.json 的 task pipeline 配置
4. pnpm-workspace.yaml 内容
5. docker-compose.yml 内容
6. apps/api 的模块目录结构
7. apps/tax-engine 的 Cargo.toml 和基本结构
8. packages/shared-types 的初始 schema

Deliverables:
在我确认后再开始创建以下内容：
- pnpm-workspace.yaml
- turbo.json
- apps/web/ 完整 Next.js scaffold（不装 shadcn/ui，先跑起来）
- apps/api/ Fastify scaffold（带 health check 和基本插件结构）
- apps/tax-engine/ Rust scaffold（带 Cargo.toml 和 stub calculate）
- packages/shared-types/ 基础 Zod schemas
- docker-compose.yml（PostgreSQL 16 + Redis 7）
- .env.example
- README.md（本地开发启动说明）
```

***

## Prompt 3：初始化前端骨架方案

如果 Prompt 2 之后需要细化前端骨架，用这个。[^4][^1]

```text
Goal:
为这个 Web-first 报税应用搭建前端骨架方案，暂时先做 architecture-level scaffolding，不做完整业务页面。

Context:
产品是 Web-first tax filing app。
视觉参考来自 mobile wallet 风格 Figma，但页面结构必须是 desktop-first web app。
前端技术栈：
- Next.js (App Router)
- React
- TypeScript (strict)
- Tailwind CSS
- shadcn/ui

Files to inspect first:
@.cursor/rules/frontend-standards.mdc
@.cursor/rules/design-system-rules.mdc
@.cursor/rules/ui-ux-rules.mdc
@architecture.md
@design-system.md
@apps/web/

Constraints:
- 优先采用 Next.js App Router。
- 优先搭建 desktop-first app shell。
- 不要复制 mobile bottom tab patterns。
- 不要一次性生成所有业务页面。
- 保持目录结构清晰，方便后续扩展 filings / documents / settings / dashboard。
- Tailwind 配置要映射 design-system.md 的设计 token（颜色、radius、shadow、spacing）。
- shadcn/ui 按需引入。
- 如果要引入依赖，请先列出并说明原因。

Plan first:
请先输出：
1. 推荐的前端目录结构
2. 推荐的 app router 路由结构
3. 推荐的 layout 结构
4. Tailwind config 中的设计 token 映射
5. 需要新增或修改的文件列表
6. 为什么这样设计适合 Web-first tax product

Deliverables:
在我确认后，再开始实现以下内容：
- Tailwind config（含设计 token）
- apps/web/app/(dashboard)/layout.tsx（带 sidebar + topbar shell）
- apps/web/app/page.tsx（dashboard 占位页）
- apps/web/app/(dashboard)/filings/page.tsx 占位
- apps/web/app/(dashboard)/documents/page.tsx 占位
- apps/web/app/(dashboard)/settings/page.tsx 占位
- apps/web/components/ui/ 基础组件（sidebar, topbar, stat-card skeleton）
```

***

## Prompt 4：生成 App Shell

这个 prompt 是真正开始动手的第一步，范围要小，最适合 Cursor。[^3]

```text
Goal:
实现 Web-first 报税应用的基础 App Shell。

Context:
该应用是桌面优先的浏览器产品，不是移动 App。
风格继承 Figma 里的浅色背景、白卡片、大圆角、柔和阴影，但布局是：
- left sidebar
- top header
- main content area
- optional right summary panel later

Files to inspect first:
@.cursor/rules/design-system-rules.mdc
@.cursor/rules/ui-ux-rules.mdc
@architecture.md
@design-system.md
@apps/web/
@apps/web/app/
@apps/web/components/
@apps/web/tailwind.config.*

Constraints:
- 优先复用现有样式和组件体系。
- 保持 TS strict 兼容。
- 不要实现业务逻辑。
- 不要加入复杂状态管理。
- 不要直接塞大量 mock business components。
- 只做骨架和基础 layout。

Plan first:
请先输出：
1. 你要修改/新增哪些文件
2. layout 组件拆分方案
3. sidebar 包含哪些导航项
4. topbar 包含哪些占位元素
5. 如何验证实现结果

Deliverables:
在我确认后再写代码，实现：
- apps/web/app/layout.tsx（root layout）
- apps/web/app/(dashboard)/layout.tsx（dashboard shell layout）
- apps/web/components/layout/sidebar.tsx
- apps/web/components/layout/topbar.tsx
- apps/web/components/layout/content-container.tsx
- apps/web/components/ui/button.tsx（基础按钮，用 shadcn/ui 或手动实现）
- 基础空页面占位（dashboard / filings / documents / settings）
```

***

## Prompt 5a：Figma → Web Design Token 提炼与组件映射

在实现 Dashboard 之前，必须先完成一个关键步骤：**从 Figma 提炼 Design Token，并建立 Mobile → Web 的组件映射规则**。这个 prompt 让 Cursor 读取 Figma 文件，提取精确的视觉数值，生成 Tailwind 设计配置和组件映射表，作为后续所有前端开发的设计依据。[^5]

> **重要**：这个 prompt 依赖 Figma MCP 工具。请先确认 `@cursor/skills-cursor/canvas/SKILL.md` 已启用，该工具可以读取 Figma 文件并提取设计属性。如果 Figma MCP 不可用，请改用附件的 Figma 截图引用 `@file:1` 进行目测提炼，但必须在输出中注明"基于截图推断"，并列出无法从截图精确获取的数值（如具体颜色 hex）。

```text
Goal:
从 Figma 文件（mobile wallet 风格）中提炼 Design Token，并生成 Mobile → Web 的组件映射规则，输出 Tailwind 配置和组件映射文档，作为后续所有前端页面的设计基准。

Context:
产品是 Web-first tax filing application，桌面优先。
Figma 参考是 mobile wallet 风格（手机 App），需要将其视觉语言提炼后转换为 Web 前端设计系统。
design-system.md 已定义了设计原则和组件清单，本 prompt 的任务是将 Figma 中的具体视觉值提取出来，对齐 design-system.md 的语义角色。

Files to inspect first:
@FigmaFile.fig（Figma MCP 工具读取，或使用截图 @file:1）
@design-system.md（Design Foundations 章节：Color / Typography / Spacing / Radius / Shadow）
@.cursor/rules/design-system-rules.mdc
@.cursor/rules/ui-ux-rules.mdc

Tools:
- 如果 Figma MCP 可用：用它读取 Figma 文件的 Frames、Components、Styles，提取具体数值
- 如果不可用：基于 Figma 截图（@file:1）目测提炼，标注"推断值"

Constraints:
- 不要直接复制 mobile 布局。
- 不要生成 Figma 中不存在的设计值（除非 design-system.md 已有定义）。
- 颜色 token 必须有语义名称（primary, success, warning, danger, info, surface, bg, text, border 等），不能直接用 raw hex 作为 Tailwind class。
- radius token 必须区分：card / input / button / chip / table。
- shadow token 必须有层级：sm / md / lg，不能直接用 Tailwind 内置 shadow。
- Spacing token 用 4px 基准网格。
- Mobile 的 bottom tab → Web sidebar 映射在组件映射表中明确记录。
- Mobile 的单列卡片 → Web dashboard grid 映射在组件映射表中明确记录。
- 最终输出的 Tailwind config 片段可以直接粘贴到 apps/web/tailwind.config.ts。
- 最终输出的组件映射文档可以直接作为 apps/web/docs/design-token-mapping.md。

Plan first:
请先输出：
1. 你将如何读取 Figma 文件（使用 Figma MCP 还是基于截图）
2. Design Token 提炼的计划（按什么顺序提取：Color → Typography → Spacing → Radius → Shadow）
3. 组件映射的计划（按什么顺序映射：Navigation → Cards → Lists → Forms）
4. 如果 Figma MCP 不可用，列出哪些值无法精确获取

Deliverables:
在我确认后再执行以下提炼和映射任务：

### Part A: Design Token 提炼（输出为 Tailwind config 片段）

1. Color tokens（颜色语义 token → hex 值）
   - 从 Figma 的 Color Styles 中提取
   - 必须映射到 design-system.md 定义的角色：bg, surface, surface-subtle, border, text, text-muted, text-faint, primary, success, warning, danger, info
   - 输出 tailwind.config.ts 的 theme.extend.colors 片段

2. Typography tokens（字体 scale → Tailwind fontSize + lineHeight + fontWeight）
   - 从 Figma 的 Text Styles 中提取
   - 必须覆盖 design-system.md 定义的角色：page-title, section-title, card-title, body, helper, label, status, table
   - 输出 tailwind.config.ts 的 theme.extend.fontSize 片段（含 fontFamily）

3. Spacing tokens（间距 → Tailwind spacing）
   - 从 Figma 的 Auto Layout 的 gap / padding 中提取
   - 输出 xs, sm, md, lg, xl, 2xl 的具体 px 值（基于 4px 网格）

4. Radius tokens（圆角 → Tailwind borderRadius）
   - 从 Figma 的 Corner Radius 中提取
   - 必须区分：card / input / button / chip / badge
   - 输出 tailwind.config.ts 的 theme.extend.borderRadius 片段

5. Shadow tokens（阴影 → Tailwind boxShadow）
   - 从 Figma 的 Effect / Shadow 中提取
   - 必须有层级：sm（default card）, md（highlighted/hovered card）, lg（modal/dropdown）
   - 输出 tailwind.config.ts 的 theme.extend.boxShadow 片段

### Part B: Mobile → Web 组件映射表（输出为 Markdown 文档）

6. Navigation 映射
   - Figma mobile bottom tab items → Web sidebar items（逐项映射）
   - 记录每个 nav item 的图标映射（Figma icon → Lucide/heroicons icon name）
   - 记录 mobile tap interaction → Web hover/click/mouseover 的差异说明

7. Card 映射
   - Figma mobile card anatomy → Web StatCard / FilingStatusCard / ReminderCard
   - 记录 mobile 单列 → Web 多列 grid 的布局转换规则
   - 记录 mobile card 信息密度 → Web card 信息密度的调整（Web 可显示更多字段）

8. List 映射
   - Figma mobile list row → Web DataTable row
   - 记录 mobile swipe action → Web hover action button 的转换
   - 记录 mobile pull-to-refresh → Web auto-refresh 或 manual refresh button

9. Form 映射
   - Figma mobile input field → Web FormSection
   - 记录 mobile keyboard (number pad) → Web full keyboard
   - 记录 mobile multi-step → Web Wizard (step navigator)

10. Action Patterns 映射
    - Figma mobile primary CTA → Web primary button
    - 记录 mobile FAB (Floating Action Button) → Web header action button 或 page action
    - 记录 mobile destructive swipe → Web confirmation dialog

### Part C: 验证与对齐检查

11. 对齐 design-system.md
    - 逐项核对提炼出的 token 是否与 design-system.md 的 Foundation 规则一致
    - 如有矛盾，列出矛盾点并给出 resolution 建议
    - 列出 Figma 有但 design-system.md 未覆盖的部分

12. 生成 apps/web/tailwind.config.ts 的完整片段
    - 包含上述所有 token，格式可粘贴替换

13. 生成 apps/web/docs/design-token-mapping.md
    - 包含完整的 Design Token 表和组件映射表
    - 作为后续前端开发的唯一设计基准文档
```

***

## Prompt 5b：基于提炼的 Token 实现 Dashboard 首页

这个 prompt 使用 Prompt 5a 提炼出的 Design Token 和组件映射，实现 Web-first 报税应用的 Dashboard 首页。[^5]

```text
Goal:
基于 @design-token-mapping.md（Prompt 5a 产出）和 Design Token，实现 Web-first 报税应用的 Dashboard 首页第一版。

Context:
Design Token 已从 Figma 提炼完成（apps/web/docs/design-token-mapping.md）。
组件映射规则已确定（Mobile bottom tab → Web sidebar, mobile card → web card panel 等）。
技术栈：Next.js + React + TypeScript + Tailwind CSS + shadcn/ui
Dashboard 内容：tax summary / filing progress / pending tasks / recent filings / reminders / quick actions

Files to inspect first:
@apps/web/docs/design-token-mapping.md（Prompt 5a 产出，Design Token + 组件映射）
@apps/web/tailwind.config.ts（Prompt 5a 产出的配置）
@design-system.md（Design QA Checklist 章节）
@.cursor/rules/design-system-rules.mdc
@.cursor/rules/ui-ux-rules.mdc

Constraints:
- 所有视觉样式必须使用 tailwind.config.ts 中定义的 design token（不用 raw hex/radius/shadow 值）。
- 不要直接复制 mobile 布局（使用 apps/web/docs/design-token-mapping.md 的组件映射规则）。
- 保留 Figma 的视觉气质（浅色背景、白卡片、大圆角、柔和阴影），但布局是 desktop-first。
- 组件化拆分，每个 dashboard section 一个组件，不要把所有内容塞进 page.tsx。
- 使用 mock data。
- 首页以 desktop-first 为主，tablet 兼容（mobile 作为 fallback）。
- 完成页面前，对照 design-system.md 的 Design QA Checklist 逐项检查。

Plan first:
请先输出：
1. 你如何使用 design-token-mapping.md 中的 token 和映射规则
2. 组件拆分方案
3. 各组件使用的 token class 列表
4. 如何使用 apps/web/docs/design-token-mapping.md 中的映射规则
5. 如何对照 Design QA Checklist 验证

Deliverables:
在我确认后再实现：
- apps/web/app/(dashboard)/page.tsx（Dashboard 主页面）
- apps/web/components/dashboard/stat-card.tsx（使用设计 token）
- apps/web/components/dashboard/filing-progress-card.tsx
- apps/web/components/dashboard/pending-tasks-card.tsx
- apps/web/components/dashboard/recent-filings-list.tsx
- apps/web/components/dashboard/quick-actions-card.tsx
- apps/web/components/dashboard/reminder-card.tsx
- apps/web/lib/mock-data.ts（mock filing data）
- Design QA 验证报告（对照 design-system.md Design QA Checklist）
```

***

## Prompt 5（已废弃 → 请使用 Prompt 5a + 5b）

> **此 Prompt 已废弃**。原 Prompt 5 直接跳到 Dashboard 实现，跳过了 Figma Design Token 提炼步骤，导致 Cursor 只能目测估计设计值。
> 请使用上方的 **Prompt 5a**（Token 提炼 + 组件映射）和 **Prompt 5b**（Dashboard 实现）替代。

```text
Goal:
基于参考 Figma 的视觉语言，实现 Web-first 报税应用的 Dashboard 首页第一版。

Context:
参考图是 mobile wallet 风格：
- 浅灰蓝背景
- 白色大圆角卡片
- 柔和阴影
- 模块化卡片
- 图表和列表混排
但当前产品是 Web-first 报税应用，所以 Dashboard 首页内容必须改成：
- tax summary
- filing progress
- pending tasks
- recent filings
- reminders / alerts
- quick actions

Files to inspect first:
@.cursor/rules/design-system-rules.mdc
@.cursor/rules/ui-ux-rules.mdc
@architecture.md
@design-system.md
@apps/web/app/(dashboard)/
@apps/web/components/layout/*
@apps/web/components/ui/*
@apps/web/components/*

Constraints:
- 不要直接复制手机布局。
- 不要使用底部导航。
- 保留视觉气质，但信息架构必须是报税产品。
- 使用 mock data。
- 组件化拆分，不要把所有内容塞进一个 page.tsx。
- 首页以 desktop-first 为主，也要兼顾缩小到 tablet。

Plan first:
请先输出：
1. 你从参考图提炼到的视觉元素
2. 你会如何把这些元素映射成 tax dashboard
3. 你准备拆成哪些 React 组件
4. 你要修改/新增哪些文件
5. 页面完成后如何验证

Deliverables:
在我确认后再实现：
- apps/web/app/(dashboard)/page.tsx（dashboard 主页面）
- apps/web/components/dashboard/stat-card.tsx
- apps/web/components/dashboard/filing-progress-card.tsx
- apps/web/components/dashboard/pending-tasks-card.tsx
- apps/web/components/dashboard/recent-filings-list.tsx
- apps/web/components/dashboard/quick-actions-card.tsx
- apps/web/components/dashboard/reminder-card.tsx
- apps/web/lib/mock-data.ts（mock filing data）
```

***

## Prompt 6：建立信息架构文档

如果仓库还比较空，建议早点让 Cursor 把 IA 文档补出来。[^6][^2]

```text
Goal:
为这个 Web-first 报税应用编写 information architecture 文档。

Context:
产品是桌面 Web 报税系统，不是移动钱包应用。
参考图只提供视觉语言，不提供产品结构。
技术栈：Next.js + React + Fastify + Drizzle + Rust + BullMQ
需要一份文档帮助后续前端页面、导航、后端模块和 Cursor 协同。

Files to inspect first:
@.cursor/rules/core-stack-and-mission.mdc
@.cursor/rules/backend-standards.mdc
@.cursor/rules/rust-tax-engine.mdc
@architecture.md
@design-system.md
@apps/web/
@apps/api/

Constraints:
- 输出为 docs/information-architecture.md
- 不要写空泛文档，要面向实现
- 页面结构必须体现报税流程
- 要区分 dashboard 页面与 filing workflow 页面
- 要映射后端模块划分

Plan first:
先告诉我文档目录大纲，再开始写。

Deliverables:
文档至少包含：
- 用户角色（纳税人、会计、管理员）
- 页面地图（含 URL 路径）
- 主流程（创建 filing → 填表 → 上传文档 → 计算 → 提交 IRD）
- 页面职责
- 导航结构（sidebar 导航项）
- dashboard vs filing workflow 的区别
- 后端模块划分（auth, filings, documents, notifications, audit, tax-engine-gateway, jobs）
- 核心数据流向（前端 → Fastify → PostgreSQL / Rust 引擎 / BullMQ）
```

***

## Prompt 7：生成前端实施清单

这个适合在你已经有架构文档后，让 Cursor 帮你排 backlog。[^6]

```text
Goal:
根据当前仓库和文档，为前端实施生成一个分阶段任务清单。

Context:
技术栈：Next.js + React + TypeScript + Tailwind CSS + shadcn/ui
产品：Web-first 报税应用
设计方向：参考移动钱包风格 Figma，但转成桌面报税体验
后端：Fastify + Drizzle + BullMQ + Rust Tax Engine
当前重点：先把前端部分做成可演示版本（mock data 驱动）

Files to inspect first:
@.cursor/rules/frontend-standards.mdc
@.cursor/rules/design-system-rules.mdc
@.cursor/rules/ui-ux-rules.mdc
@architecture.md
@design-system.md
@docs/information-architecture.md
@apps/web/

Constraints:
- 输出要面向 Cursor/工程执行
- 不要笼统写"完成 dashboard"
- 要拆成可以逐步交付的小任务
- 要区分 scaffolding / UI / data / validation / polish
- 哪些用 mock data，哪些对接 API

Plan first:
先输出你准备如何分阶段，再细化任务。

Deliverables:
请输出：
1. Phase 1-5 的前端任务
2. 每个任务的完成标准
3. 每个任务涉及的文件范围
4. 哪些任务适合先用 mock data，哪些要等 API
5. 与后端/Rust engine 的对接时机
```

***

## 最建议的实际使用顺序

你现在最适合这样用：

1. 先丢 **Prompt 1**，让 Cursor 理解仓库。[^2][^3]
2. 再丢 **Prompt 2**，让它搭建完整 monorepo 骨架（三端并行初始化）。**[新增]**
3. 批准后丢 **Prompt 3**，让它配置 Tailwind design token 和路由结构。
4. 再丢 **Prompt 4**，让它搭 App Shell（sidebar + topbar）。**[已优化]**
5. 然后丢 **Prompt 5a + 5b**，让它先提炼 Figma Design Token，再实现 Dashboard。**[关键：Figma → Web 的结构化转换]**
6. 丢 **Prompt 6** 和 **Prompt 7**，补文档和任务拆分。

这样比"直接让 Cursor 帮我做一个报税系统"成功率高很多，因为它先有上下文、再有结构、最后才写页面。[^3][^1]

## Phase 1-5 实施顺序详解

### Phase 1：Monorepo 骨架（Prompt 2）
**目标：端到端可运行的空壳**
- pnpm workspaces + Turborepo 配置
- Next.js 前端可启动
- Fastify API 可启动（含 health check）
- Rust Cargo 项目可编译
- Docker Compose（PostgreSQL + Redis）
- shared-types 基础 schema
- .env.example + README

### Phase 2：前端 Design Token + App Shell（Prompt 3 + 4）
**目标：视觉语言落地 + 基础布局骨架**
- Tailwind design token 映射（颜色、radius、shadow、spacing）
- shadcn/ui 按需引入
- Sidebar + Topbar + Content Area
- Dashboard 占位页

### Phase 3：Figma 提炼 + Dashboard 首页（Prompt 5a + 5b）
**目标：Design Token 落地 + 第一个真实页面**
- Prompt 5a：从 Figma 提炼 Color / Typography / Spacing / Radius / Shadow token，生成 Tailwind config 片段
- Prompt 5a：生成 Mobile → Web 组件映射表（bottom tab → sidebar, card → grid, list → table）
- Prompt 5b：基于设计 token 实现 StatCard / FilingProgressCard / PendingTasksCard / RecentFilingsList
- Mock data 驱动
- 响应式桌面优先布局

### Phase 4：信息架构 + 任务清单（Prompt 6 + 7）
**目标：文档和 backlog**
- Information Architecture 文档
- 分阶段任务拆分
- 明确哪些先做 mock，哪些等 API

### Phase 5：后端 + Tax Engine（第二批 prompt）
**目标：业务逻辑层**
- Fastify 模块（auth, filings, documents, notifications）
- Drizzle schema + migrations
- Rust tax engine 核心逻辑
- BullMQ job handlers
- IRD API 集成

## 关键技术选型理由回顾

| 组件 | 选型 | 原因 |
|---|---|---|
| Backend framework | **Fastify** | 轻量、高性能、插件化；IRD API 集成（HTTP 请求/响应处理）干净 |
| ORM / Query layer | **Drizzle** | TypeScript-native、SQL透明、runtime 开销小；复杂报税逻辑需要显式查询控制 |
| Package manager | **pnpm** | Monorepo 原生、严格依赖提升、快速 |
| Monorepo tool | **Turborepo** | 构建缓存（Next.js + Cargo 都受益）、任务 pipeline、远程缓存与 Vercel 集成 |

## 一个很重要的小技巧

每次把 prompt 发给 Cursor 后，**先看它输出的 Plan，不要第一时间 Accept 全部改动**。 Cursor 这类工作流在项目早期最好走"小步提交 + 先计划后编码"的方式，这也是很多模板和实践里反复强调的模式。[^7][^2][^3]

如果你要，我下一条可以继续直接给你：

1. **第二批 prompt**：Filings 页面、表单流程、Documents 页面
2. **第三批 prompt**：Node API（Fastify）、Rust Tax Engine、BullMQ Workers
3. **第四批 prompt**：IRD API 集成、提交流程、状态跟踪

---


24 Jun:
*****************Start from here********************

按照这个标准@第一批可直接丢进 Cursor 的启动 prompt.md (582-585) 修改@第一批可直接丢进 Cursor 的启动 prompt.md (659-661) !!!!!

# 第二批：Filings 页面、表单流程、Documents 页面

第二批 prompt 专注于前端的核心业务页面，从 Dashboard 延伸到实际的报税工作流。

***

## Prompt B1：Filings 列表页

```text
Goal:
实现 Filings 列表页面，显示用户所有税务申报记录。

Context:
产品是 Web-first 报税应用。Dashboard 已经完成，现在需要做 Filings 列表页。
技术栈：Next.js + React + TypeScript + Tailwind CSS + shadcn/ui
当前状态：Dashboard 已完成，App Shell 已搭建，mock data 驱动。

Files to inspect first:
@apps/web/app/(dashboard)/filings/
@apps/web/components/
@apps/web/components/ui/
@apps/web/lib/mock-data.ts
@apps/web/lib/api.ts（API client wrapper）
@.cursor/rules/design-system-rules.mdc
@.cursor/rules/ui-ux-rules.mdc
@architecture.md（数据域：filings, filing_sections, filing_status）

Constraints:
- Desktop-first 布局，使用 DataTable 组件（不用卡片列表替代表格）。
- filing status 必须有清晰的视觉区分（draft / in_progress / ready_for_review / submitted / completed / rejected / error）。
- 支持按 status 筛选和搜索。
- 支持分页。
- 点击行进入详情页。
- 状态颜色不要只用色相，要配合图标和文字。
- 使用 mock data，但 API 调用结构要预留（用 mockApi wrapper）。

Plan first:
请先输出：
1. 页面布局和组件拆分
2. FilingStatusBadge 的状态映射（状态 → 颜色/图标/文字）
3. 需要新增或修改的文件
4. Mock data 的 shape

Deliverables:
在我确认后再实现：
- apps/web/app/(dashboard)/filings/page.tsx
- apps/web/components/filings/filing-status-badge.tsx
- apps/web/components/filings/filing-table.tsx
- apps/web/components/filings/filing-filters.tsx
- apps/web/components/ui/data-table.tsx（可复用 table 组件）
- apps/web/lib/mock-data.ts（新增 filings mock data）
```

***

## Prompt B2：Filing 详情 / 多步表单流程

```text
Goal:
实现 Filing 详情页，包含完整的多步填报表单流程（Personal Info → Income → Deductions → Review）。

Context:
产品是 Web-first 报税应用。Filings 列表已完成，现在需要实现单条 Filing 的填报流程。
技术栈：Next.js + React + TypeScript + Tailwind CSS + shadcn/ui + react-hook-form + zod
表单流程：
Step 1: Personal Information（姓名、IRD 账号、税务年度、地址）
Step 2: Income Details（W-2 收入、1099 收入、其他收入、银行利息、股息等）
Step 3: Deductions（标准扣除 / 逐项扣除切换、医疗保健、州税、慈善捐款等）
Step 4: Review & Calculate（汇总预览，触发 tax engine 计算，显示 tax summary 和 warnings）

Files to inspect first:
@apps/web/app/(dashboard)/filings/[id]/
@apps/web/components/filings/
@apps/web/components/forms/
@apps/web/components/ui/step-navigator.tsx（如已存在）
@apps/web/lib/mock-data.ts
@apps/web/lib/api.ts
@.cursor/rules/ui-ux-rules.mdc
@design-system.md（Form Patterns 章节）

Constraints:
- 使用 react-hook-form + zod 做表单验证。
- 每一步保存后可返回列表，下次继续。
- StepNavigator 显示当前步骤和完成状态。
- 第4步 Review 从 Rust tax engine 获取 tax summary（mock 掉 engine 调用，先显示 mock result）。
- ValidationSummary 组件显示字段级和步骤级错误。
- SaveDraftBar 固定在底部。
- 不要把所有表单字段塞进一个 page.tsx，要拆分到 form components。
- 不要在表单组件里直接调 API，用 api client wrapper。

Plan first:
请先输出：
1. 路由结构（app/(dashboard)/filings/[id] 下如何组织 steps）
2. Form 组件拆分方案
3. zod schema 拆分方案
4. SaveDraftBar 的交互逻辑
5. Review step 如何 mock tax engine result
6. 需要新增或修改的文件

Deliverables:
在我确认后再实现：
- apps/web/app/(dashboard)/filings/[id]/page.tsx（Filing 详情壳）
- apps/web/app/(dashboard)/filings/[id]/step/personal-info/page.tsx
- apps/web/app/(dashboard)/filings/[id]/step/income/page.tsx
- apps/web/app/(dashboard)/filings/[id]/step/deductions/page.tsx
- apps/web/app/(dashboard)/filings/[id]/step/review/page.tsx
- apps/web/components/forms/step-navigator.tsx
- apps/web/components/forms/save-draft-bar.tsx
- apps/web/components/forms/validation-summary.tsx
- apps/web/components/forms/personal-info-form.tsx
- apps/web/components/forms/income-form.tsx
- apps/web/components/forms/deductions-form.tsx
- apps/web/components/forms/review-summary.tsx
- apps/web/lib/schemas/filing.ts（zod schemas）
- apps/web/lib/api.ts（API client，filing CRUD + calculate endpoint）
- apps/web/lib/mock-data.ts（更新 mock 数据）
```

***

## Prompt B3：Documents 上传与管理页面

```text
Goal:
实现 Documents 页面，支持文档上传、预览和管理。

Context:
产品是 Web-first 报税应用。Filing 流程中需要关联上传文档（如 W-2、1099、收据等）。
技术栈：Next.js + React + TypeScript + Tailwind CSS + shadcn/ui
文档类型：W-2、1099、1098、收据、身份证明、附加说明等。

Files to inspect first:
@apps/web/app/(dashboard)/documents/
@apps/web/components/documents/
@apps/web/components/ui/upload-panel.tsx（如已存在）
@apps/web/lib/api.ts
@.cursor/rules/ui-ux-rules.mdc
@architecture.md（数据域：documents, filing_sections）
@design-system.md（Document 页面章节）

Constraints:
- 支持拖拽上传和点击上传。
- 上传后显示文件名、大小、上传时间、关联 filing（可选）、状态。
- 支持按类型筛选和搜索。
- 支持预览（图片、PDF）。
- 支持删除（带确认 dialog）。
- Desktop-first 布局，使用 table 而不是卡片列表。
- 不要在组件里直接调 fetch，用 api client wrapper。
- 不要跳过 auth token 传递。

Plan first:
请先输出：
1. 页面布局和组件拆分
2. DocumentStatusBadge 状态映射
3. 上传交互（dropzone、进度条、错误处理）
4. API 接口设计（mock 掉后端，先用 mock）
5. 需要新增或修改的文件

Deliverables:
在我确认后再实现：
- apps/web/app/(dashboard)/documents/page.tsx
- apps/web/components/documents/document-table.tsx
- apps/web/components/documents/document-filters.tsx
- apps/web/components/documents/upload-panel.tsx
- apps/web/components/documents/document-row.tsx
- apps/web/components/documents/document-preview-dialog.tsx
- apps/web/components/documents/document-status-badge.tsx
- apps/web/components/ui/confirmation-dialog.tsx
- apps/web/lib/api.ts（新增 document 相关 API calls）
- apps/web/lib/mock-data.ts（新增 documents mock data）
```

***

## Prompt B4：Settings 页面

```text
Goal:
实现 Settings 页面，包括个人信息设置和税务偏好设置。

Context:
产品是 Web-first 报税应用。App Shell 已搭建，需要填充 Settings 页面。
技术栈：Next.js + React + TypeScript + Tailwind CSS + shadcn/ui
Settings 分区：
- Profile：姓名、邮箱、电话、地址
- Tax Profile：税务身份（单身/已婚等）、IRD 账号、预扣设置
- Notifications：邮件/站内通知偏好
- Security：修改密码、双因素认证（占位）
- Team / Organization（占位）：如果是多用户账号

Files to inspect first:
@apps/web/app/(dashboard)/settings/
@apps/web/components/settings/
@apps/web/components/ui/
@apps/web/lib/api.ts
@.cursor/rules/ui-ux-rules.mdc
@design-system.md（Navigation Patterns 章节）

Constraints:
- Desktop-first，使用 tab 或左侧子导航切换分区。
- 每个分区独立保存，不是一次性大表单。
- 表单验证用 react-hook-form + zod。
- 当前阶段不连真实 API，使用 mock data。
- Security 分区先做占位 UI，不做实际 auth 实现。
- 不要把 profile 和 tax profile 混在一个表单里。

Plan first:
请先输出：
1. Settings 页面结构（tab 方案 vs 子导航方案）
2. 组件拆分
3. 需要新增或修改的文件

Deliverables:
在我确认后再实现：
- apps/web/app/(dashboard)/settings/page.tsx
- apps/web/app/(dashboard)/settings/layout.tsx（settings 子导航）
- apps/web/components/settings/settings-nav.tsx
- apps/web/components/settings/profile-settings-form.tsx
- apps/web/components/settings/tax-profile-settings-form.tsx
- apps/web/components/settings/notification-settings-form.tsx
- apps/web/components/settings/security-settings.tsx（占位）
- apps/web/lib/mock-data.ts（更新 user profile mock）
```

***

# 第三批：Node API（Fastify）、Rust Tax Engine、BullMQ Workers

第三批 prompt 深入后端和 Rust 引擎，从 modular monolith 骨架到核心业务逻辑。

***

## Prompt C1：Fastify 骨架与模块化结构

```text
Goal:
为 TaxCode API 搭建 Fastify 骨架和模块化目录结构，实现 auth 和 health check 模块。

Context:
技术栈已确认：Fastify + Drizzle + BullMQ + TypeScript + pnpm + Turborepo
apps/api/ 的 modular monolith 结构，每个模块包含：routes / schemas / service / repository / errors

模块划分：
- auth: 注册、登录、JWT 颁发、refresh token
- users: 用户 CRUD、profile
- organizations: 组织管理、成员管理
- filings: 报税单 CRUD、状态流转、section 管理
- documents: 文档元数据、关联管理
- notifications: 通知 CRUD、preferences
- tax-engine-gateway: 调用 Rust 引擎的 adapter
- jobs: BullMQ job handlers（export、reminder、recalculation）

Files to inspect first:
@apps/api/
@.cursor/rules/backend-standards.mdc
@.cursor/rules/database-queue-and-quality.mdc
@architecture.md（Backend Architecture 章节）
@packages/shared-types/

Constraints:
- Fastify 插件化架构，每个模块一个插件。
- 使用 @fastify/type-provider-typebox 做类型安全的 route schema。
- 使用 fastify-plugin 避免外层感知插件注册顺序。
- 统一错误响应格式：{ statusCode, error, message }。
- 所有路由 schema 用 TypeBox 定义，导出到 shared-types 包。
- Drizzle ORM 连接配置，但暂不创建表（等 Prompt C2）。
- BullMQ 连接配置，但暂不实现 job handlers（等 Prompt C3）。
- JWT 用 @fastify/jwt。
- Env var validation 用 zod（从 .env.example 读取）。

Plan first:
请先输出：
1. 完整的目录结构（每个模块的 routes/schemas/service/repository/errors）
2. apps/api/src/app.ts（Fastify 实例主文件）
3. apps/api/src/server.ts（入口文件）
4. apps/api/src/plugins/ 下的通用插件（db, redis, auth）
5. apps/api/src/modules/auth/ 的骨架
6. apps/api/src/modules/health/ 的骨架
7. turbo.json 更新（api 相关的 task）
8. apps/api/package.json 依赖列表

Deliverables:
在我确认后再实现：
- apps/api/package.json
- apps/api/tsconfig.json
- apps/api/src/app.ts
- apps/api/src/server.ts
- apps/api/src/plugins/cors.ts
- apps/api/src/plugins/db.ts（Drizzle client plugin）
- apps/api/src/plugins/jwt.ts
- apps/api/src/plugins/redis.ts（BullMQ client plugin）
- apps/api/src/plugins/error-handler.ts
- apps/api/src/modules/auth/index.ts（plugin 导出）
- apps/api/src/modules/auth/routes.ts
- apps/api/src/modules/auth/schemas.ts（TypeBox schemas）
- apps/api/src/modules/auth/service.ts
- apps/api/src/modules/auth/repository.ts
- apps/api/src/modules/auth/errors.ts
- apps/api/src/modules/health/index.ts
- apps/api/src/modules/health/routes.ts
- apps/api/src/modules/_template/（参考模板，供后续模块复制）
- packages/shared-types/src/schemas/user.ts
- packages/shared-types/src/schemas/auth.ts
- packages/shared-types/src/index.ts
- docker-compose.yml（确认 PostgreSQL + Redis 配置）
```

***

## Prompt C2：Drizzle Schema 与 Database Migrations

```text
Goal:
基于 architecture.md 定义的数据域，生成 Drizzle schema 和数据库 migrations。

Context:
数据库：PostgreSQL
ORM： Drizzle
技术栈：Fastify + Drizzle + BullMQ

核心数据域（来自 architecture.md）：
- users（id, email, password_hash, name, phone, role, created_at, updated_at）
- organizations（id, name, type, created_at, updated_at）
- organization_members（user_id, org_id, role, joined_at）
- tax_profiles（id, user_id, tax_year, filing_status, iras_id, state, created_at, updated_at）
- filings（id, org_id, tax_profile_id, tax_year, status, created_at, updated_at, submitted_at）
- filing_sections（id, filing_id, section_type, data, is_complete, completed_at）
- documents（id, org_id, filing_id, document_type, file_name, file_size, file_url, uploaded_by, uploaded_at, status）
- submission_records（id, filing_id, iras_submission_id, submitted_at, status, response_data）
- audit_logs（id, org_id, user_id, action, resource_type, resource_id, metadata, created_at）
- notifications（id, user_id, type, title, message, is_read, created_at）
- job_runs（id, job_type, status, payload, result, started_at, completed_at, error）
- tax_rule_versions（id, tax_year, rule_version, effective_date, rules_data）

Files to inspect first:
@apps/api/src/modules/（已搭建的模块结构）
@apps/api/src/plugins/db.ts
@.cursor/rules/database-queue-and-quality.mdc
@architecture.md（Data Architecture 章节）

Constraints:
- 所有表必须有：id（uuid）、created_at、updated_at。
- filing status 用枚举：draft / in_progress / needs_attention / ready_for_review / submitted / completed / rejected。
- document status 用枚举：pending / processing / ready / error / deleted。
- 使用 Drizzle 的 pg-core（不用 Prisma-style DSL）。
- 每张表的关系要明确（外键注释）。
- migrations 文件用 Drizzle Kit 生成。
- sensitive 字段（password_hash, file_url）要有注释说明。
- schema 要支持 soft delete（deleted_at）以便 audit。

Plan first:
请先输出：
1. 完整的 schema 拆分（每张表一个文件）
2. relationships 图（表之间如何关联）
3. Drizzle config 文件
4. migration 文件的命名规范

Deliverables:
在我确认后再实现：
- apps/api/src/db/schema/users.ts
- apps/api/src/db/schema/organizations.ts
- apps/api/src/db/schema/organization-members.ts
- apps/api/src/db/schema/tax-profiles.ts
- apps/api/src/db/schema/filings.ts
- apps/api/src/db/schema/filing-sections.ts
- apps/api/src/db/schema/documents.ts
- apps/api/src/db/schema/submission-records.ts
- apps/api/src/db/schema/audit-logs.ts
- apps/api/src/db/schema/notifications.ts
- apps/api/src/db/schema/job-runs.ts
- apps/api/src/db/schema/tax-rule-versions.ts
- apps/api/src/db/schema/index.ts（统一导出）
- apps/api/src/db/index.ts（db client 导出）
- apps/api/drizzle.config.ts
- apps/api/migrations/0001_initial_schema.sql
- apps/api/drizzle/meta/_journal.json
- apps/api/src/db/seed.ts（development seed data）
```

***

## Prompt C3：Filings 模块完整实现

```text
Goal:
实现 Fastify Filings 模块，包含 CRUD、状态流转和 section 管理。

Context:
技术栈：Fastify + Drizzle + TypeScript
Filings 模块职责：
- 创建 filing draft
- 保存 filing sections（personal info, income, deductions）
- 状态流转：draft → in_progress → needs_attention → ready_for_review → submitted → completed
- 调用 Rust tax engine 进行计算（通过 tax-engine-gateway）
- 查询 listing（支持筛选、分页、排序）

Files to inspect first:
@apps/api/src/modules/filings/
@apps/api/src/modules/tax-engine-gateway/
@apps/api/src/db/schema/filings.ts
@apps/api/src/db/schema/filing-sections.ts
@apps/api/src/db/schema/audit-logs.ts
@packages/shared-types/src/schemas/filing.ts
@apps/api/src/modules/_template/

Constraints:
- 所有 endpoint 需要 JWT auth。
- 状态流转必须有明确的校验规则（哪些字段完整才能流转到下一状态）。
- filing sections 的保存是幂等的（同一 section 可以多次覆盖）。
- 调用 tax engine 的错误要正确处理（engine down / timeout / validation error）。
- audit log 记录所有状态变更。
- API response shape 要和 shared-types 的 zod schema 对齐。

Plan first:
请先输出：
1. 所有 endpoint 的定义（method, path, input schema, output schema）
2. 状态流转规则（每种状态可以流转到哪些状态，需要哪些前置条件）
3. service 层的业务逻辑
4. 与 tax-engine-gateway 的交互方式
5. 需要新增或修改的文件

Deliverables:
在我确认后再实现：
- apps/api/src/modules/filings/index.ts
- apps/api/src/modules/filings/routes.ts
- apps/api/src/modules/filings/schemas.ts
- apps/api/src/modules/filings/service.ts
- apps/api/src/modules/filings/repository.ts
- apps/api/src/modules/filings/errors.ts
- apps/api/src/modules/filings/filing-state-machine.ts（状态流转逻辑）
- apps/api/src/modules/tax-engine-gateway/index.ts
- apps/api/src/modules/tax-engine-gateway/client.ts（HTTP call to Rust）
- apps/api/src/modules/tax-engine-gateway/errors.ts
- packages/shared-types/src/schemas/filing.ts（更新 Zod schemas）
- apps/api/src/db/seed.ts（更新 seed 添加 filing seed data）
```

***

## Prompt C4：Rust Tax Engine 核心实现

```text
Goal:
为 TaxCode 实现 Rust Tax Engine 的核心计算逻辑，提供 HTTP 接口供 Fastify 调用。

Context:
技术栈：Rust + Cargo + Actix Web（或其他轻量 HTTP 框架）
Rust 引擎职责：
- 接收 normalized filing payload
- 应用税务规则（基于 tax_year 和 rule_version）
- 计算 taxable income、deductions、credits、tax owed
- 返回 tax summary、breakdown、validation issues、warnings

Engine 结构：
- input: FilingPayload（income, deductions, personal info, tax_year, rule_version）
- output: TaxResult（summary, breakdown[], validation_issues[], warnings[]）
- rules: 版本化的税务规则（可扩展为 JSON 配置或内嵌）

Files to inspect first:
@apps/tax-engine/
@.cursor/rules/rust-tax-engine.mdc
@architecture.md（Rust Tax Engine 章节）

Constraints:
- 使用 strong types（struct/enum），不要用 loose JSON。
- 税务规则硬编码为初始版本（NZ IRD 简化版），rules 目录支持未来扩展。
- 支持 rule versioning（按 tax_year 加载不同规则集）。
- 所有计算必须是确定性的（相同输入 → 相同输出）。
- Actix Web 提供 /calculate POST endpoint。
- 健康检查：GET /health
- 错误处理：返回明确的 error code + message。
- 完整的测试覆盖（单元测试 + property test）。

Plan first:
请先输出：
1. Rust 项目结构（Cargo workspace member）
2. Input / Output 的 Rust type 定义
3. Tax rule 结构设计（如何组织 deduction/credit rules）
4. HTTP server 结构（routes, middleware）
5. 初始税务规则内容（简化版 NZ IRD 规则）
6. 需要测试的边界情况

Deliverables:
在我确认后再实现：
- apps/tax-engine/Cargo.toml
- apps/tax-engine/src/main.rs
- apps/tax-engine/src/http/mod.rs
- apps/tax-engine/src/http/routes.rs
- apps/tax-engine/src/http/error.rs
- apps/tax-engine/src/domain/mod.rs
- apps/tax-engine/src/domain/types.rs（核心类型定义）
- apps/tax-engine/src/domain/filing_payload.rs
- apps/tax-engine/src/domain/tax_result.rs
- apps/tax-engine/src/rules/mod.rs
- apps/tax-engine/src/rules/engine.rs（计算引擎）
- apps/tax-engine/src/rules/v1.rs（IRD simplified rules）
- apps/tax-engine/tests/calculate_test.rs
- apps/tax-engine/tests/rules_test.rs
```

***

## Prompt C5：BullMQ Job Handlers

```text
Goal:
实现 BullMQ job handlers，处理后台异步任务。

Context:
技术栈：Fastify + BullMQ + Redis + TypeScript
Job 类型：
- recalculation: filing 内容变更后，触发 tax engine 重算
- export: 生成 PDF 申报表导出
- notification: 发送邮件或站内通知
- reminder: 定时提醒（deadline 临近时）
- document-processing: 文档上传后的后处理

Job handler 原则：
- 所有 job 必须是幂等的（同一 job 多次执行结果一致）。
- 失败重试（可配置重试次数和间隔）。
- job payload 要有 version 字段（schema 演进）。
- 重要 job（submission, recalculation）要记录 job_runs 表。

Files to inspect first:
@apps/api/src/modules/jobs/
@apps/api/src/plugins/redis.ts
@.cursor/rules/database-queue-and-quality.mdc
@architecture.md（Queue and Async Processing 章节）

Constraints:
- 使用 BullMQ Worker 类，不依赖 Fastify plugin lifecycle。
- 每个 job type 有独立的 handler file。
- Job payload 用 shared-types 的 zod schema 验证。
- 错误处理：重试 → 失败后记录 job_runs.error → 发送告警通知（占位）。
- 使用 distributed lock 防止并发重复执行（同一 filing 不能同时有两个 recalculation job）。

Plan first:
请先输出：
1. Job 类型定义（enum + payload schema）
2. Job pipeline 配置（retry, backoff, concurrency）
3. Worker 入口结构
4. 每个 job handler 的核心逻辑（伪代码）
5. 需要新增或修改的文件

Deliverables:
在我确认后再实现：
- apps/api/src/modules/jobs/index.ts（worker 入口）
- apps/api/src/modules/jobs/queue.ts（queue 定义和 connection）
- apps/api/src/modules/jobs/errors.ts
- apps/api/src/modules/jobs/handlers/recalculation.ts
- apps/api/src/modules/jobs/handlers/export.ts
- apps/api/src/modules/jobs/handlers/notification.ts
- apps/api/src/modules/jobs/handlers/reminder.ts
- apps/api/src/modules/jobs/handlers/document-processing.ts
- apps/api/src/modules/jobs/producers/recalculation-producer.ts
- apps/api/src/modules/jobs/producers/export-producer.ts
- apps/api/src/modules/jobs/producers/notification-producer.ts
- packages/shared-types/src/schemas/jobs.ts
```

***

# 第四批：IRD API 集成、提交流程、状态跟踪

第四批 prompt 接入真实的 IRD（新西兰税务局）API，实现申报提交和状态跟踪。

***

## Prompt D1：IRD API 集成架构设计

```text
Goal:
设计 IRD API 集成方案，包括认证方式、API 版本选择、错误处理和重试策略。

Context:
产品：TaxCode NZ（新西兰税务申报）
IRD API：IRD NZ 提供 RESTful API 用于电子申报（IRIS — Internet Revenue Information System）
目标 API endpoints：
- POST /filing/submit — 提交申报
- GET /filing/{id}/status — 查询申报状态
- GET /filing/{id}/notice — 获取税务通知
- POST /document/upload — 上传附件文档

IRD 认证方式（需要确认）：
- Option A: IRD OAuth 2.0（client credentials 或 JWT bearer）
- Option B: API key + TLS client certificate
- Option C: 混合（IRD 系统用 OAuth，配额管理用 API key）

Files to inspect first:
@apps/api/src/modules/ird-gateway/
@apps/api/src/modules/submissions/
@.cursor/rules/backend-standards.mdc
@.cursor/rules/documentation-security-performance.mdc
@architecture.md（Submission flow 章节）

Constraints:
- IRD credentials 绝对不能硬编码，必须从 vault（未来）或 env 读取。
- API 调用需要完整的 request/response logging（不含敏感字段）。
- 税率计算结果提交前必须经过 Rust engine 验证。
- IRD API rate limiting 必须尊重（429 handling + retry-after）。
- 集成代码要和 filing 模块解耦，通过 adapter pattern 调用。
- 需要沙箱（sandbox）环境支持，区分 test/production。

Plan first:
请先输出：
1. IRD API 认证方案（推荐 + 备选）
2. IRD gateway adapter 结构
3. 错误处理策略（IRD error → internal error mapping）
4. Rate limiting 和 retry 策略
5. Sandbox vs Production 环境区分方案
6. 需要新增或修改的文件

Deliverables:
在我确认后再实现：
- apps/api/src/modules/ird-gateway/index.ts
- apps/api/src/modules/ird-gateway/client.ts（HTTP client with retry）
- apps/api/src/modules/ird-gateway/auth.ts（OAuth/token management）
- apps/api/src/modules/ird-gateway/errors.ts（IRD error → internal mapping）
- apps/api/src/modules/ird-gateway/mappers.ts（IRD response → internal types）
- apps/api/src/modules/ird-gateway/routes/submit.ts（submit filing endpoint）
- apps/api/src/modules/ird-gateway/routes/status.ts（check status endpoint）
- apps/api/src/modules/ird-gateway/routes/notice.ts（fetch notice endpoint）
- apps/api/src/modules/ird-gateway/routes/document.ts（upload document endpoint）
- apps/api/.env.example（新增 IRD_API_URL, IRD_CLIENT_ID, IRD_CLIENT_SECRET 等）
```

***

## Prompt D2：完整 Submission 提交流程

```text
Goal:
实现从"Ready for Review"到"Submitted"的完整提交流程。

Context:
技术栈：Fastify + Drizzle + BullMQ + Rust + IRD Gateway
提交流程步骤：
1. User 点击"Submit Filing"
2. Backend 验证 filing completeness（调用 Rust engine 做 final validation）
3. Backend 生成 IRD 格式 payload（mapping internal types → IRD schema）
4. Backend 调用 IRD /filing/submit API
5. Backend 保存 submission_records 表
6. Backend 更新 filing status → submitted
7. Backend 记录 audit_log
8. Backend enqueue notification job（告知用户提交成功）
9. Frontend 显示 submission confirmation

Files to inspect first:
@apps/api/src/modules/filings/
@apps/api/src/modules/ird-gateway/
@apps/api/src/modules/jobs/
@apps/api/src/db/schema/submission-records.ts
@apps/api/src/db/schema/audit-logs.ts
@architecture.md（Submission flow 章节）

Constraints:
- 整个流程必须在单一事务中完成关键步骤（filing status 变更 + submission_records 写入）。
- IRD API 调用失败时：filing status 不变，用户收到明确错误信息，submission_records 记录失败。
- 不允许重复提交（同一 filing_id 已有成功 submission_records → 拒绝）。
- submission_records 要保存完整的 IRD response_data（供后续查询/申诉使用）。
- audit_log 记录所有关键操作（谁、何时、什么操作、结果）。
- 在 Stub IRD mode 下（sandbox / mock），整个流程可用 mock 端点测试。

Plan first:
请先输出：
1. 完整的提交流程 state machine
2. 每个步骤的错误处理策略
3. IRD payload mapper 的字段映射
4. submission_records 的 data shape
5. Frontend 提交按钮的 UX 流程（confirm dialog → loading → success/error）
6. 需要新增或修改的文件

Deliverables:
在我确认后再实现：
- apps/api/src/modules/filings/service.ts（新增 submitFiling 方法）
- apps/api/src/modules/filings/routes.ts（新增 POST /filings/:id/submit）
- apps/api/src/modules/filings/filing-state-machine.ts（新增 submitted 状态流转）
- apps/api/src/modules/ird-gateway/mappers.ts（新增 toIRDSubmitPayload）
- apps/api/src/modules/submissions/index.ts
- apps/api/src/modules/submissions/repository.ts
- apps/api/src/modules/submissions/errors.ts
- apps/api/src/modules/audit/index.ts（统一 audit log 工具）
- apps/api/src/modules/jobs/producers/notification-producer.ts（新增提交成功通知）
- packages/shared-types/src/schemas/filing.ts（新增 submit-related schemas）
- apps/web/app/(dashboard)/filings/[id]/step/review/page.tsx（更新，增加 Submit 按钮）
- apps/web/components/forms/submit-filing-dialog.tsx（确认弹窗）
```

***

## Prompt D3：Submission 状态跟踪与 Webhook

```text
Goal:
实现申报状态跟踪，包括轮询 IRD 状态和接收 IRD Webhook 回调。

Context:
IRD 申报状态跟踪机制：
- 方式 A：轮询 GET /filing/{id}/status（后台 job，定期检查）
- 方式 B：IRD Webhook 回调（IRD 主动推送状态变更）
两种方式结合使用（Webhooks 优先，轮询兜底）

Filing 状态扩展：
- submitted → processing（在 IRD 处理中）
- processing → accepted / rejected（IRD 返回结果）
- accepted → notice_received（税务通知可用）
- rejected → needs_correction（需要修正后重新提交）

Files to inspect first:
@apps/api/src/modules/filings/
@apps/api/src/modules/ird-gateway/routes/status.ts
@apps/api/src/modules/jobs/handlers/
@apps/api/src/db/schema/filing-sections.ts
@architecture.md（Submission flow 章节）

Constraints:
- Webhook endpoint 必须公开（无 JWT），但必须有 signature 验证（IRD HMAC）。
- Webhook handler 更新 filing status 后，enqueue notification job 告知用户。
- 轮询 job 频率可配置（默认每小时一次），只轮询 submitted/processing 状态的 filing。
- status 变更要完整记录 audit_log。
- 所有 IRD status 映射到内部 FilingStatus（reject reason 等元数据存在 filing_sections）。
- Webhook 和轮询都要幂等（多次相同状态更新不产生副作用）。

Plan first:
请先输出：
1. IRD status → 内部 FilingStatus 的映射表
2. Webhook endpoint 的 signature 验证方案
3. 轮询 job 的实现策略（哪些 filing 需要轮询，频率控制）
4. 用户通知的内容模板
5. 需要新增或修改的文件

Deliverables:
在我确认后再实现：
- apps/api/src/modules/ird-gateway/routes/webhook.ts（IRD webhook handler）
- apps/api/src/modules/ird-gateway/signature.ts（HMAC signature 验证）
- apps/api/src/modules/filings/service.ts（新增 updateFilingStatusFromIRD 方法）
- apps/api/src/modules/filings/repository.ts（新增 status update 方法）
- apps/api/src/modules/jobs/handlers/status-polling.ts（轮询 job handler）
- apps/api/src/modules/jobs/producers/status-polling-producer.ts
- apps/api/src/modules/jobs/handlers/notification.ts（新增 IRD status 变更通知）
- apps/api/src/modules/audit/index.ts（新增 audit event types）
- apps/api/src/modules/audit/errors.ts（新增 webhook 认证错误）
- apps/api/.env.example（新增 IRD_WEBHOOK_SECRET）
- apps/api/src/modules/filings/filing-state-machine.ts（更新状态机）
```

***

## Prompt D4：Documents 与 IRD Document Upload 集成

```text
Goal:
实现 Document 模块与 IRD 文档上传 API 的集成。

Context:
IRD 申报支持附加证明文档（W-2 scan, 1099, receipts 等）。
Document 流程：
1. User 上传文档到 TaxCode（文件存 S3/R2，metadata 存 DB）
2. User 将文档关联到特定 filing
3. Filing 提交时，TaxCode 调用 IRD /document/upload API 上传关联文档
4. IRD 返回 document_id
5. 提交申报时，将 document_id 附加到申报 payload

文件存储方案（待确认）：
- Option A: AWS S3
- Option B: Cloudflare R2（兼容 S3 API，费用更低）
- Option C: Local filesystem（仅开发环境）

Files to inspect first:
@apps/api/src/modules/documents/
@apps/api/src/modules/documents/routes.ts
@apps/api/src/modules/documents/service.ts
@apps/api/src/modules/documents/repository.ts
@apps/api/src/modules/ird-gateway/routes/document.ts
@architecture.md（File and Document Handling 章节）

Constraints:
- 文件上传必须走 multipart/form-data，大小限制（建议 10MB/文件）。
- 文件类型白名单：PDF, PNG, JPG, JPEG（不接受 .exe, .zip 等）。
- 文件上传后立即扫描 virus（占位接口，未来接入 ClamAV 或云服务）。
- IRD 文档上传在 filing submission 流程中自动触发（不用用户手动操作）。
- document 的 iras_document_id 字段保存 IRD 返回的 document_id。
- 删除文档时要检查是否有正在处理的 filing 依赖它。

Plan first:
请先输出：
1. 文件存储方案选择建议
2. Document upload → IRD upload 的完整流程
3. S3/R2 client 集成方案
- apps/api/src/modules/documents/file-storage.ts（storage client）
- apps/api/src/modules/documents/virus-scan.ts（scan placeholder）
- apps/api/src/modules/documents/repository.ts（新增 iras_document_id）
- apps/api/src/modules/documents/service.ts（新增 uploadToIRD 方法）
- apps/api/src/modules/filings/service.ts（submit 时自动上传关联文档）
- apps/api/src/modules/documents/errors.ts（新增 storage/scan 错误）
- apps/api/.env.example（新增 S3/R2 相关 env）
- apps/api/drizzle.config.ts（新增 documents 表 iras_document_id 列，migration）

Deliverables:
在我确认后再实现：
- apps/api/src/modules/documents/file-storage.ts（storage client）
- apps/api/src/modules/documents/virus-scan.ts（scan placeholder）
- apps/api/src/modules/documents/repository.ts（新增 iras_document_id）
- apps/api/src/modules/documents/service.ts（新增 uploadToIRD 方法）
- apps/api/src/modules/filings/service.ts（submit 时自动上传关联文档）
- apps/api/src/modules/documents/errors.ts（新增 storage/scan 错误）
- apps/api/.env.example（新增 S3/R2 相关 env）
- apps/api/drizzle.config.ts（新增 documents 表 iras_document_id 列，migration）
```

***

## 批次使用顺序建议

| 批次 | 重点 | 前提条件 |
|---|---|---|
| 第一批 | 骨架 + App Shell + Dashboard | 无 |
| 第二批 | Filings 列表 + 表单流程 + Documents | 第一批完成 |
| 第三批 | Fastify API + Drizzle + BullMQ + Rust Engine | 第一批完成 |
| 第四批 | IRD API 集成 + 提交 + 状态跟踪 | 第三批完成（尤其是 Filings 模块 + Rust Engine） |

**实际执行顺序可以是**：
- 前端（第二批）可以和后端（第三批）并行开发，通过 mock API 解耦
- IRD 集成（第四批）依赖第三批的完整 API 和 Rust Engine

<span style="display:none">[^10][^11][^8][^9]</span>

<div align="center">⁂</div>

[^1]: https://foresthill.ai/blog/cursor-nextjs
[^2]: https://github.com/schneiderlo/cursor-template
[^3]: https://ai-learningpath.nstech.com.br/pages/cursor/cursor_prompting_context.html
[^4]: https://cursorprompts.org/categories/nextjs
[^5]: Yu-Lan-1.jpg
[^6]: https://github.com/shreyas-makes/cursor-nextjs-starter
[^7]: https://www.reddit.com/r/aipromptprogramming/comments/1krwwwi/how_i_start_my_projects_with_cursor_ai_prompts/
[^8]: https://cursordevkit.com/cursor-prompts
[^9]: https://aiunpacker.com/prompts/best-ai-prompts-for-nextjs-application-setup-with-cursor/
[^10]: https://designcode.io/cursor-building-a-next-js-project-with-v0-shadcn-and-cursor/
[^11]: https://gist.github.com/aashari/07cc9c1b6c0debbeb4f4d94a3a81339e
