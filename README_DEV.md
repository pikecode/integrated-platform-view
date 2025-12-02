# 🚀 开发快速开始指南

> 这是针对想要快速理解和继续开发本项目的开发者的指南。

**最后更新**: 2024-12-02 | **分支**: dev_peak | **状态**: ✅ 活跃开发

---

## ⚡ 5分钟快速上手

### 第一步：克隆和安装

```bash
# 克隆项目（如果还没有）
git clone git@github-pikecode:pikecode/integrated-platform-view.git
cd integrated-platform-view

# 切换到开发分支
git checkout dev_peak

# 安装依赖
pnpm install --no-frozen-lockfile
```

### 第二步：启动开发服务器

```bash
pnpm dev
# 服务器运行在: http://localhost:2888
```

### 第三步：访问新模块

在浏览器中打开：

- **决策模块**: http://localhost:2888/decision/index
- **员工模块**: http://localhost:2888/employee/list

---

## 📦 项目包含什么？

### 核心功能

| 功能 | 状态 | 说明 |
|------|------|------|
| 决策模块（议题+任务） | ✅ 完成 | 9 条路由，可访问 |
| 员工管理模块 | ✅ 完成 | 4 条路由，支持无认证 |
| 认证系统改进 | ✅ 完成 | 支持无认证页面开发 |
| 模拟数据 | ✅ 完成 | 员工模块包含示例数据 |
| 完整文档 | ✅ 完成 | 8 份详细指南 |

### 关键特性

- ✅ 模块化架构（API、页面、组件、工具分离）
- ✅ Vue 3 Composition API
- ✅ Vite 5 构建工具
- ✅ 动态路由和代码分割
- ✅ Axios 请求拦截和错误处理
- ✅ 无认证开发支持（`isAuth: false`）

---

## 🎯 我想做什么？

### 👀 查看现有代码

```bash
# 查看决策模块文档
cat src/views/decision/README.md

# 查看员工模块文档
cat src/views/employee/README.md

# 查看完整项目状态报告
cat PROJECT_STATUS.md
```

### 🔧 修改现有模块

1. **修改员工列表页面**：`src/views/employee/pages/list.vue`
2. **修改员工 API**：`src/api/employee/index.js`
3. **修改业务逻辑**：`src/views/employee/mixins/index.js`

修改后立即生效（HMR 热更新）。

### ➕ 创建新业务模块

参考现有的员工管理模块结构：

```
src/
├── api/
│   └── {module}/
│       └── index.js              # API 定义
├── views/
│   └── {module}/
│       ├── pages/
│       │   ├── index.vue         # 首页
│       │   └── *.vue             # 功能页面
│       ├── components/           # 可复用组件
│       ├── mixins/
│       │   └── index.js          # 业务逻辑
│       ├── utils/
│       │   └── *.js              # 工具函数
│       └── README.md             # 模块文档
└── router/
    └── views/index.js            # 添加路由
```

### 🔗 连接后端 API

**当前状态**: 使用模拟数据（`meta.isToken: true`）

**切换到真实 API**:

```javascript
// 1. 在 src/api/employee/index.js 中移除 meta
// 改这样：
export async function getList(params) {
  return service.get('/blade-employee/list', {
    params,
    // ❌ 删除这一行：
    // meta: { isToken: true }
  })
}

// 2. 在 src/views/employee/pages/list.vue 中修改 API 调用
// 无需其他修改，API 会自动使用真实后端

// 3. 测试连接
// 访问 http://localhost:2888/employee/list
// 应该看到真实的员工数据（或 API 错误提示）
```

### 🚀 上线前的准备

```javascript
// 1. 在路由中移除 isAuth: false
// src/router/views/index.js
{
  path: '/employee/list',
  meta: {
    // ❌ 删除这一行：
    // isAuth: false,
    menu: false,
  }
}

// 2. 添加权限检查
// src/views/employee/pages/list.vue
<template>
  <!-- ❌ 删除这一行（不需要了，isAuth 会自动处理） -->
  <!-- ✅ 改用权限检查 -->
  <div v-if="permission.employee_list">
    <!-- 页面内容 -->
  </div>
</template>

// 3. 验证认证流程
// 无登陆状态访问页面，应该跳转到登陆页
// 登陆后，应该能访问所有功能
```

---

## 📚 关键文档

### 快速参考

| 文档 | 用途 |
|------|------|
| [PROJECT_STATUS.md](./PROJECT_STATUS.md) | 完整项目状态报告 |
| [DECISION_MODULE_SETUP.md](./DECISION_MODULE_SETUP.md) | 决策模块详细说明 |
| [EMPLOYEE_MODULE_GUIDE.md](./EMPLOYEE_MODULE_GUIDE.md) | 员工模块开发指南 |
| [DEV_FLOW_SUMMARY.md](./DEV_FLOW_SUMMARY.md) | 开发流程和最佳实践 |

### 问题排查

遇到问题？查看这些文档：

| 问题 | 文档 |
|------|------|
| 页面无法访问，显示认证错误 | [FIX_LOGIN_REDIRECT.md](./FIX_LOGIN_REDIRECT.md) |
| 不知道怎么处理 API 认证 | [NO_AUTH_API_SOLUTION.md](./NO_AUTH_API_SOLUTION.md) |
| 需要快速修复 | [QUICK_FIX_GUIDE.md](./QUICK_FIX_GUIDE.md) |
| 想验证修改是否正确 | [VERIFICATION_GUIDE.md](./VERIFICATION_GUIDE.md) |

---

## 🔐 认证系统说明

### 开发阶段（当前）

```javascript
// 路由配置
meta: { isAuth: false }        // ✅ 允许无认证访问

// API 调用
meta: { isToken: true }        // ✅ 跳过 token 验证
```

**用途**: 前端独立开发，不需要登陆也不需要真实后端

### 生产阶段（上线前）

```javascript
// 路由配置
// ❌ 删除 isAuth: false

// API 调用
// ❌ 删除 meta: { isToken: true }

// 添加权限检查
v-if="permission.xxx_xxx"
```

**用途**: 真实用户认证，基于角色的访问控制

---

## 🐛 常见问题

### 问题 1：访问页面显示"认证信息错误"

**解决**:
1. 重启开发服务器：`pnpm dev`
2. 使用无痕窗口访问
3. 查看浏览器控制台，应该看到 "Token invalid but page allows no auth access" 的警告（这是正常的）

### 问题 2：修改代码后页面没有更新

**解决**:
1. 检查开发服务器是否还在运行
2. 按 Ctrl+F5 强制刷新浏览器
3. 检查浏览器控制台是否有 JavaScript 错误

### 问题 3：API 请求返回 404

**解决**:
1. 确认后端服务器是否运行
2. 检查 API 端点是否正确
3. 查看浏览器 Network 标签，看请求的 URL 和响应

### 问题 4：找不到某个文件或组件

**解决**:
```bash
# 搜索文件
find src -name "*list*" -type f

# 搜索导出
grep -r "export" src/api/employee/

# 查看导入
grep -n "import.*employee" src/views/
```

---

## 💡 最佳实践

### 1. 模块化设计

```javascript
// ✅ 好的做法：清晰的职责分离
src/api/module/index.js        // 网络请求
src/views/module/mixins/       // 业务逻辑
src/views/module/components/   // UI 组件
src/views/module/utils/        // 工具函数
src/views/module/pages/        // 页面容器

// ❌ 避免：所有代码混在一起
src/views/module/index.vue     // (500+ 行的文件)
```

### 2. API 设计

```javascript
// ✅ 好的做法：清晰的接口
export async function getList(params) {
  return service.get('/api/module/list', { params })
}

export async function getDetail(id) {
  return service.get(`/api/module/detail/${id}`)
}

// ❌ 避免：直接在组件中调用 API
// src/views/module/pages/index.vue
// mounted() { service.get('/api/...') }
```

### 3. 组件设计

```javascript
// ✅ 好的做法：可复用组件
<template>
  <item-card :item="item" @delete="handleDelete" />
</template>

// ❌ 避免：一次性组件
// 只在一个地方使用的复杂组件
```

---

## 🔗 有用的命令

```bash
# 查看分支状态
git status

# 查看最新提交
git log --oneline -10

# 查看某个文件的修改历史
git log --oneline src/views/employee/pages/list.vue

# 查看某次提交的详细内容
git show dcb7bd1

# 创建新分支开发功能
git checkout -b feature/xxx origin/dev_peak

# 提交代码
git add .
git commit -m "feat: 功能描述"
git push origin feature/xxx

# 在 GitHub 创建 Pull Request
gh pr create --title "功能描述" --body "详细说明"
```

---

## 📱 项目结构一览

```
integrated-platform-view/
├── src/
│   ├── api/                    # API 定义
│   │   ├── decision/           # 决策模块 API
│   │   │   ├── topic.js        # 议题 API
│   │   │   └── task.js         # 任务 API
│   │   └── employee/           # 员工模块 API
│   │       └── index.js
│   │
│   ├── views/                  # 页面组件
│   │   ├── decision/           # 决策模块
│   │   │   ├── pages/          # 页面
│   │   │   ├── components/     # 组件
│   │   │   ├── mixins/         # 业务逻辑
│   │   │   ├── utils/          # 工具函数
│   │   │   └── README.md
│   │   └── employee/           # 员工模块
│   │       ├── pages/
│   │       ├── components/
│   │       ├── mixins/
│   │       └── README.md
│   │
│   ├── router/
│   │   └── views/index.js      # 所有路由配置
│   │
│   ├── axios.js                # 网络请求配置（已修改）
│   ├── permission.js           # 权限检查
│   ├── main.js                 # 应用入口
│   └── App.vue                 # 根组件
│
├── docs/                       # 文档（可选）
├── .env                        # 环境变量配置
├── vite.config.mjs             # Vite 构建配置
├── package.json                # 项目依赖
├── pnpm-lock.yaml              # 依赖锁定
│
├── PROJECT_STATUS.md           # ⭐ 完整项目报告
├── DECISION_MODULE_SETUP.md    # 决策模块详解
├── EMPLOYEE_MODULE_GUIDE.md    # 员工模块指南
├── DEV_FLOW_SUMMARY.md         # 开发流程
├── FIX_LOGIN_REDIRECT.md       # 认证问题修复
├── NO_AUTH_API_SOLUTION.md     # 无认证 API 方案
├── QUICK_FIX_GUIDE.md          # 快速修复
├── VERIFICATION_GUIDE.md       # 验证指南
└── README_DEV.md               # ⭐ 本文档
```

---

## 🎓 学习路径

### 新手快速上手（30分钟）

1. ✅ 克隆项目，启动开发服务器
2. ✅ 访问员工列表页面，查看模拟数据
3. ✅ 在浏览器中修改代码，观察 HMR 热更新
4. ✅ 阅读 `EMPLOYEE_MODULE_GUIDE.md`

### 深入理解（1小时）

1. ✅ 阅读 `PROJECT_STATUS.md`
2. ✅ 查看员工模块的完整代码结构
3. ✅ 理解认证系统的两层设计
4. ✅ 阅读 `DEV_FLOW_SUMMARY.md`

### 开始开发（需要时查阅）

1. ✅ 参考现有模块创建新功能
2. ✅ 遇到问题查看相应的文档
3. ✅ 按照 Git 命令提交和推送代码

---

## ❓ 获取帮助

### 找不到什么？

```bash
# 搜索关键字
grep -r "keyword" src/

# 查找文件
find . -name "*pattern*"

# 查看所有路由
grep -r "path:" src/router/
```

### 出错了？

1. 查看浏览器控制台的错误信息
2. 查看开发服务器的输出日志
3. 检查 `QUICK_FIX_GUIDE.md` 的常见问题
4. 查看相关模块的 `README.md`

### 需要参考？

- **Vue 3 文档**: https://vuejs.org
- **Vite 文档**: https://vite.dev
- **Element Plus**: https://element-plus.org
- **本项目文档**: 查看根目录的所有 .md 文件

---

## ✅ 快速检查清单

在开始开发前，确保完成以下步骤：

- [ ] 代码已克隆到本地
- [ ] 依赖已安装 (`pnpm install`)
- [ ] 开发服务器正在运行 (`pnpm dev`)
- [ ] 可以访问 http://localhost:2888
- [ ] 员工列表页面可以正常加载
- [ ] 浏览器控制台没有 JavaScript 错误
- [ ] 已阅读 `PROJECT_STATUS.md`

准备好了？开始开发吧！ 🚀

---

## 📞 补充资源

| 资源 | 位置 |
|------|------|
| 项目状态报告 | [PROJECT_STATUS.md](./PROJECT_STATUS.md) |
| GitHub 仓库 | https://github.com/pikecode/integrated-platform-view |
| 开发分支 | dev_peak |
| 主分支 | master |

---

**最后更新**: 2024-12-02
**作者**: Claude Code + Peak
**版本**: 1.0

如有问题或建议，欢迎提出 Issue 或 Pull Request！

祝开发顺利！ 🎉
