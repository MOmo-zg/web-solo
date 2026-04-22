# 项目索引

## 目录结构

```
/workspace/
├── .svelte-kit/          # SvelteKit 构建输出
├── .trae/                # 项目文档
│   └── documents/        # 产品需求和技术架构文档
├── src/                  # 源代码
│   ├── lib/              # 共享组件和工具
│   │   ├── assets/       # 静态资源
│   │   ├── components/   # 组件
│   │   └── utils/        # 工具函数
│   └── routes/           # 路由
│       ├── create/       # 创建项目页面
│       ├── project/      # 项目相关页面
│       └── +layout.svelte # 布局组件
├── static/               # 静态文件
├── .gitignore            # Git 忽略文件
├── package.json          # 项目依赖
├── svelte.config.js      # Svelte 配置
├── tailwind.config.js    # Tailwind CSS 配置
└── vite.config.ts        # Vite 配置
```

## 当前代码状态（2026-04-20）

### 已实现的功能

1. **核心页面**
   - 首页（`/`）：显示 Agent 聊天界面
   - 创建项目页面（`/create`）：设置项目基本信息（名称、类型、描述）
   - 项目编辑页面（`/project/[id]`）：小说创作界面

2. **布局功能**
   - 左侧边栏：包含 New task、Rules、Skills、Novels（项目列表）
   - 侧边栏隐藏/显示功能
   - 响应式布局，适配不同屏幕尺寸
   - 右侧边栏：显示小说信息和模型上下文

3. **主题和国际化**
   - 主题切换：支持浅色、深色、跟随系统三种模式
   - 语言切换：支持中文和英文
   - 下拉菜单悬停显示，鼠标从按钮移动到菜单时不会消失

4. **技术实现**
   - 使用 Svelte 5 + TypeScript + Tailwind CSS
   - 响应式设计，支持不同设备
   - 修复服务器端渲染问题（localStorage 兼容性）
   - 使用 `$state()` 进行状态管理
   - 使用 `onMount()` 进行浏览器端初始化

### 主要文件内容

1. **src/routes/+layout.svelte**
   - 主布局组件，包含左侧边栏、主内容区、右侧边栏
   - 用户菜单支持主题和语言切换
   - 侧边栏切换按钮

2. **src/routes/+page.svelte**
   - 首页，显示 Agent 聊天组件

3. **src/routes/create/+page.svelte**
   - 创建新项目页面，包含表单和导航栏

4. **src/lib/components/AgentChat.svelte**
   - Agent 聊天组件，包含输入框、工具栏、模型选择

5. **src/lib/utils/theme.ts**
   - 主题管理工具，支持获取、设置、应用主题
   - 支持系统主题监听
   - `isBrowser()` 函数确保在浏览器环境中正确执行

6. **src/lib/utils/i18n.ts**
   - 国际化工具，支持语言切换
   - 提供中文和英文翻译

### 当前问题

1. **主题切换**：虽然代码看起来正确，但可能在浏览器中没有正确应用
2. **项目列表**：目前只有一个占位项目 "web-solo"
3. **创建项目**："+" 按钮目前没有点击事件

### 技术栈

- 前端：Svelte 5 + TypeScript + Tailwind CSS 3 + Vite
- 构建工具：Vite
- 包管理：npm

## 文件说明

### 核心文件

1. **src/routes/+layout.svelte** - 主布局组件，包含左侧边栏
2. **src/routes/+page.svelte** - 首页，显示 Agent 聊天界面
3. **src/routes/create/+page.svelte** - 创建新项目页面
4. **src/routes/project/[id]/+page.svelte** - 项目编辑页面
5. **src/lib/components/AgentChat.svelte** - Agent 聊天组件
6. **src/lib/components/SettingsDropdown.svelte** - 主题和语言设置组件（旧版，已弃用）
7. **src/lib/utils/theme.ts** - 主题管理工具
8. **src/lib/utils/i18n.ts** - 国际化工具

### 文档文件

1. **.trae/documents/PRD.md** - 产品需求文档
2. **.trae/documents/Technical_Architecture.md** - 技术架构文档
3. **.trae/documents/UI_Design_Guidelines.md** - UI设计指南，包含统一的交互反馈规则
4. **PROJECT_INDEX.md** - 项目索引文档（本文件）
5. **DEVELOPMENT_STATUS.md** - 开发状态文档

### 配置文件

1. **package.json** - 项目依赖和脚本
2. **svelte.config.js** - Svelte 编译器配置
3. **tailwind.config.js** - Tailwind CSS 配置
4. **vite.config.ts** - Vite 构建配置