# LIMS 实验室信息管理系统

## 项目概述

LIMS（Laboratory Information Management System）是一个现代化的实验室信息管理系统，基于 Vue 3 + TypeScript + Vite + Ant Design Vue 构建。系统提供全面的实验室数据管理、样本追踪、分析任务管理、质控报告、统计分析等功能，采用前后端分离架构，提供直观的用户界面和强大的数据处理能力。

## 🚀 技术架构

### 技术栈

- **核心框架**：Vue 3.3.8 + TypeScript 5.2.2
- **构建工具**：Vite 4.5.0
- **UI框架**：Ant Design Vue 4.0.7
- **状态管理**：Pinia 2.1.7 + pinia-plugin-persistedstate
- **路由管理**：Vue Router 4.2.5
- **HTTP客户端**：Axios 1.6.8
- **样式处理**：Less 4.2.0 + UnoCSS 0.57.3
- **图表库**：ECharts 5.4.3
- **富文本编辑**：TinyMCE 5.10.7 + Vditor 3.9.6
- **PDF处理**：html2pdf.js 0.10.3 + pdf-lib 1.17.1
- **文件处理**：JSZip 3.10.1 + XLSX 0.18.5
- **代码规范**：ESLint 8.53.0 + Prettier 3.1.0 + Stylelint 15.11.0
- **包管理器**：PNPM >= 8.9.0

## 📁 项目结构

```
├── public/                    # 静态资源
├── src/                       # 源代码
│   ├── api/                   # API接口定义
│   │   ├── base/              # 基础API
│   │   ├── filemanager/       # 文件管理API
│   │   ├── infra/             # 基础设施API
│   │   ├── lims/              # LIMS核心API
│   │   │   ├── analysisreport/    # 分析报告API
│   │   │   ├── analysisresult/    # 分析结果API
│   │   │   ├── analysistask/      # 分析任务API
│   │   │   ├── console/           # 控制台API
│   │   │   ├── doccenter/         # 文档中心API
│   │   │   ├── fileupload/        # 文件上传API
│   │   │   ├── operatelog/        # 操作日志API
│   │   │   ├── pdf/               # PDF生成API
│   │   │   ├── qcreport/          # 质控报告API
│   │   │   ├── qcsettings/        # 质控设置API
│   │   │   ├── report-template/   # 报告模板API
│   │   │   ├── sample/            # 样本管理API
│   │   │   ├── sampleflow/        # 样本流程API
│   │   │   ├── soc/               # 芯片管理API
│   │   │   ├── soc-data/          # 芯片数据API
│   │   │   ├── socData/           # 芯片数据API(备用)
│   │   │   ├── statscenter/       # 统计中心API
│   │   │   ├── systemversion/     # 系统版本API
│   │   │   └── tagresult/         # 标签结果API
│   │   └── system/            # 系统管理API
│   ├── assets/                # 静态资源
│   │   ├── images/            # 图片资源
│   │   └── styles/            # 样式资源
│   ├── components/            # 公共组件
│   ├── design/                # 设计相关
│   ├── directives/            # 自定义指令
│   ├── enums/                 # 枚举定义
│   ├── hooks/                 # 自定义钩子
│   ├── layouts/               # 布局组件
│   ├── locales/               # 国际化
│   ├── logics/                # 业务逻辑
│   ├── router/                # 路由配置
│   ├── settings/              # 项目设置
│   ├── store/                 # 状态管理
│   ├── types/                 # 类型定义
│   ├── utils/                 # 工具函数
│   ├── views/                 # 页面组件
│   │   ├── base/              # 基础页面
│   │   ├── dashboard/         # 仪表盘
│   │   │   ├── analysis/      # 数据分析
│   │   │   └── workbench/     # 工作台
│   │   ├── filemanager/       # 文件管理
│   │   ├── infra/             # 基础设施
│   │   ├── lims/              # LIMS核心功能
│   │   │   ├── analysisreport/        # 分析报告
│   │   │   ├── analysisreportdetail/  # 报告详情
│   │   │   ├── analysistask/          # 分析任务
│   │   │   ├── analysistaskdetail/    # 任务详情
│   │   │   ├── detectionreport/       # 检测报告
│   │   │   ├── doccenter/             # 文档中心
│   │   │   ├── sample/                # 样本管理
│   │   │   ├── sampledetail/          # 样本详情
│   │   │   ├── soc/                   # 芯片管理
│   │   │   └── socData/               # 芯片数据
│   │   ├── navigation/        # 导航页面
│   │   └── system/            # 系统管理
│   │       ├── dict/                  # 字典管理
│   │       ├── password/              # 密码管理
│   │       ├── role/                  # 角色管理
│   │       ├── settingstemplate/      # 配置报告模板
│   │       ├── settingstemplatedetail/ # 模板详情
│   │       ├── user/                  # 用户管理
│   │       ├── usermanual/            # 用户手册
│   │       ├── usermanualsettings/    # 手册设置
│   │       └── version/               # 版本管理
│   ├── App.vue                # 根组件
│   └── main.ts                # 入口文件
├── build/                     # 构建配置
│   ├── config/                # 配置文件
│   ├── generate/              # 生成工具
│   ├── script/                # 构建脚本
│   ├── vite/                  # Vite配置
│   ├── constant.ts            # 常量定义
│   ├── getConfigFileName.ts   # 配置文件名获取
│   └── utils.ts               # 构建工具函数
├── .husky/                    # Git hooks
├── .vscode/                   # VSCode配置
├── .cursor/                   # Cursor配置
├── dist/                      # 构建输出
├── node_modules/              # 依赖包
├── .editorconfig              # 编辑器配置
├── .env                       # 环境变量
├── .env.development           # 开发环境变量
├── .env.production            # 生产环境变量
├── .env.dev                   # 开发环境配置
├── .env.sandbox               # 沙箱环境配置
├── .env.loc                   # 本地环境配置
├── .env.static                # 静态环境配置
├── .env.front                 # 前端环境配置
├── .eslintignore              # ESLint忽略文件
├── .eslintrc.js               # ESLint配置(已废弃)
├── eslint.config.js           # ESLint配置
├── .gitignore                 # Git忽略文件
├── .gitattributes             # Git属性配置
├── .gitpod.yml                # Gitpod配置
├── .prettierignore            # Prettier忽略文件
├── .stylelintignore           # Stylelint忽略文件
├── .dockerignore              # Docker忽略文件
├── .hintrc                    # Hint配置
├── commitlint.config.js       # Commitlint配置
├── stylelint.config.js        # Stylelint配置
├── uno.config.ts              # UnoCSS配置
├── Dockerfile                 # Docker配置
├── nginx.conf                 # Nginx配置
├── build-docker-images.bat    # Docker构建脚本
├── index.html                 # HTML入口
├── package.json               # 项目配置
├── package-lock.json          # NPM锁定文件
├── pnpm-lock.yaml             # PNPM锁定文件
├── README.md                  # 项目说明
├── tsconfig.json              # TypeScript配置
└── vite.config.ts             # Vite配置
```

## 🛠️ 开发规范

### 代码规范

- **语言**：使用 TypeScript 进行开发，严格类型检查
- **组件**：使用 Vue 3 Composition API + `<script setup>` 语法
- **样式**：使用 Less 预处理器 + UnoCSS 原子化CSS
- **格式化**：ESLint + Prettier + Stylelint 自动格式化
- **提交**：使用 Conventional Commits 规范 + Commitlint 检查

### 命名规范

- **组件名**：PascalCase (如：`UserManagement.vue`)
- **文件名**：kebab-case (如：`user-management.vue`)
- **变量名**：camelCase (如：`userName`)
- **常量名**：UPPER_SNAKE_CASE (如：`API_BASE_URL`)
- **接口名**：PascalCase + Interface后缀 (如：`UserInterface`)
- **枚举名**：PascalCase + Enum后缀 (如：`StatusEnum`)

### 注释规范

- 使用 JSDoc 注释格式
- 关键业务逻辑添加中文注释
- 复杂算法和数据处理添加详细说明
- API接口添加参数和返回值说明

### 目录规范

- **views**：页面组件，按业务模块划分
- **components**：公共组件，可复用组件
- **api**：API接口定义，按模块划分
- **utils**：工具函数，纯函数优先
- **hooks**：组合式函数，业务逻辑复用
- **types**：TypeScript类型定义
- **enums**：枚举定义，业务常量

## 🚀 快速开始

### 环境要求

- **Node.js**: >= 18.0.0 或 >= 20.0.0
- **PNPM**: >= 8.9.0 (推荐使用PNPM)

### 安装依赖

```bash
# 使用 PNPM (推荐)
pnpm install

# 或使用 NPM
npm install
```

### 开发环境

```bash
# 启动开发服务器
pnpm dev

# 启动前端模式
pnpm front

# 类型检查
pnpm type:check

# 代码检查
pnpm lint

# 代码修复
pnpm lint:fix

# 样式检查
pnpm lint:stylelint
```

### 构建部署

```bash
# 构建生产版本
pnpm build

# 构建开发版本
pnpm build:dev

# 构建测试版本
pnpm build:sandbox

# 构建本地版本
pnpm build:loc

# 构建静态版本
pnpm build:static

# 预览构建结果
pnpm preview

# 构建分析报告
pnpm report
```

### Docker 部署

```bash
# 构建镜像
docker build -t tngs-web:1.0.0 .

# 运行容器
docker run -d -p 8088:80 --name tngs-web-container tngs-web:1.0.0

# 导出镜像
docker save -o tngs-web.tar tngs-web:1.0.0

# 导入镜像
docker load -i tngs-web.tar && docker tag tngs-web:1.0.0 tngs-web:latest

# 使用批处理脚本构建 (Windows)
./build-docker-images.bat
```

## 📊 核心功能

### LIMS 核心模块

- **样本管理**：样本录入、追踪、状态管理
- **分析任务**：任务创建、分配、执行、监控
- **分析报告**：报告生成、审核、发布、下载
- **质控管理**：质控设置、质控报告、质量监控
- **芯片管理**：芯片数据管理、SOC数据处理
- **文档中心**：文档管理、版本控制、权限管理

### 数据分析模块

- **统计分析**：病原体检出统计、阳性率分析
- **数据可视化**：ECharts图表、实时数据展示
- **报表生成**：PDF报告生成、Excel导出

### 系统管理模块

- **用户管理**：用户账号、角色权限
- **系统配置**：模板配置、版本管理

## 🔧 开发工具

### 推荐 IDE

- **VSCode** + Vue Language Features (Volar)
- **WebStorm** + Vue.js插件
- **Cursor** (AI辅助开发)

### 推荐插件

- Vue Language Features (Volar)
- TypeScript Vue Plugin (Volar)
- ESLint
- Prettier
- UnoCSS
- GitLens
