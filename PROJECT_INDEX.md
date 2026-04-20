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
│       │   └── [id]/     # 项目详情页面
│       └── +layout.svelte # 布局组件
├── static/               # 静态文件
├── .gitignore            # Git 忽略文件
├── package.json          # 项目依赖
├── svelte.config.js      # Svelte 配置
├── tailwind.config.js    # Tailwind CSS 配置
└── vite.config.ts        # Vite 配置
```

## 文件说明

### 核心文件

1. **src/routes/+layout.svelte** - 主布局组件，包含左侧边栏
2. **src/routes/+page.svelte** - 首页，显示项目列表
3. **src/routes/create/+page.svelte** - 创建新项目页面
4. **src/routes/project/[id]/+page.svelte** - 项目编辑页面
5. **src/lib/components/SettingsDropdown.svelte** - 主题和语言设置组件
6. **src/lib/utils/theme.ts** - 主题管理工具
7. **src/lib/utils/i18n.ts** - 国际化工具

### 文档文件

1. **.trae/documents/PRD.md** - 产品需求文档
2. **.trae/documents/Technical_Architecture.md** - 技术架构文档
3. **.trae/documents/UI_Design_Guidelines.md** - UI设计指南，包含统一的交互反馈规则

### 配置文件

1. **package.json** - 项目依赖和脚本
2. **svelte.config.js** - Svelte 编译器配置
3. **tailwind.config.js** - Tailwind CSS 配置
4. **vite.config.ts** - Vite 构建配置