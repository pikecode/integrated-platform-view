# 开发新页面 - 完整流程总结

## 核心概念

**开发新页面，暂时不需要登陆验证的核心逻辑很简单：**

```
在路由配置中添加一个标记 → isAuth: false
↓
系统自动跳过认证检查 → 允许所有人访问
↓
开发完成后，删除这个标记 → 自动启用认证
```

---

## 一句话解释

**`isAuth: false` 意思是：这个路由不需要登陆就可以访问。**

---

## 实现步骤（3 步搞定）

### 步骤 1️⃣：配置路由 (在 src/router/views/index.js)

```javascript
{
  path: '/my-feature',           // 你的模块路径
  component: Layout,
  redirect: '/my-feature/index',
  meta: {
    isAuth: false,               // ← 这一行是关键！
  },
  children: [
    {
      path: 'index',
      name: '我的功能',
      meta: {
        isAuth: false,           // ← 子路由也需要这个标记
      },
      component: () => import('@/views/my-feature/pages/index.vue'),
    }
  ]
}
```

### 步骤 2️⃣：创建页面文件

```
src/views/my-feature/
├── pages/
│   ├── index.vue               # 首页
│   ├── list.vue                # 列表页 (可选)
│   └── form.vue                # 表单页 (可选)
├── api/
│   └── index.js                # API 接口
├── components/                 # 组件 (可选)
├── mixins/                      # 业务逻辑 (可选)
└── utils/                       # 工具函数 (可选)
```

### 步骤 3️⃣：直接访问测试

```
http://localhost:2888/my-feature/index
↓
无需登录，直接进入 ✓
```

---

## 完整示例（员工管理模块）

我已经为你创建了一个完整的"员工管理"模块示例，包含：

### 📁 创建的文件

```
✅ src/api/employee/index.js              (API 接口层)
✅ src/views/employee/mixins/index.js     (业务逻辑)
✅ src/views/employee/pages/index.vue     (首页)
✅ src/views/employee/pages/list.vue      (列表页)
✅ src/views/employee/pages/form.vue      (表单页)
✅ src/views/employee/README.md           (模块文档)
✅ src/router/views/index.js              (路由配置)
✅ EMPLOYEE_MODULE_GUIDE.md               (开发指南)
```

### 🚀 立即可以访问

```
首页: http://localhost:2888/employee/index
列表: http://localhost:2888/employee/list
新增: http://localhost:2888/employee/add
编辑: http://localhost:2888/employee/edit/E001
```

**无需登录！** ✓

---

## 三个阶段的完整流程

```
┌─────────────────────────────────────────────────────────┐
│              第一阶段：开发阶段（当前）                   │
├─────────────────────────────────────────────────────────┤
│ isAuth: false                                            │
│ 无需登陆 ✓                                               │
│ 使用模拟数据快速迭代                                      │
│ 可以与设计师/产品经理分享预览                             │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│              第二阶段：后端集成                           │
├─────────────────────────────────────────────────────────┤
│ 后端实现 API 接口                                         │
│ 修改前端 API 调用为真实接口                               │
│ 用真实数据测试所有功能                                    │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│              第三阶段：启用认证                           │
├─────────────────────────────────────────────────────────┤
│ 删除 isAuth: false                                       │
│ 自动启用登陆验证 ✓                                       │
│ 添加按钮级权限控制                                        │
│ 可以上线部署                                              │
└─────────────────────────────────────────────────────────┘
```

---

## 关键改动对比

### 从开发阶段 → 上线阶段（只需改一个地方）

```javascript
// ============================================
// 在 src/router/views/index.js 中
// ============================================

// 开发阶段（当前）
{
  path: '/employee',
  meta: {
    isAuth: false,  // ← 删除这一行
  }
}

// 上线阶段（修改后）
{
  path: '/employee',
  // meta 中没有 isAuth 了，默认需要认证
}
```

**就这么简单！** 一行代码的改动就能从"开发"切换到"上线"模式。

---

## 五个核心要点

### 1️⃣ 什么时候使用 isAuth: false？

**使用场景**:
- 开发阶段（功能还未完成）
- 需要快速原型（UI 演示）
- 需要与非技术人员分享预览（设计师、产品经理）
- 前后端并行开发

**不使用场景**:
- 已上线的生产环境
- 需要权限保护的功能
- 敏感信息页面

### 2️⃣ 为什么要这样做？

**好处**:
- ✅ 快速开发，不受认证影响
- ✅ 模拟数据支持快速迭代
- ✅ 前后端独立开发，互不影响
- ✅ 上线时只需删除一个标记
- ✅ 降低开发成本和复杂度

### 3️⃣ 如何快速从模拟数据切换到真实 API？

**修改位置**: `src/views/employee/pages/list.vue` 第 96-111 行

```javascript
// 当前（模拟数据）
async loadEmployees() {
  this.loading = true;
  try {
    this.mockLoadEmployees();  // ← 模拟函数
    // ...
  }
}

// 改为（真实 API）
async loadEmployees() {
  this.loading = true;
  try {
    const res = await employeeApi.getList(  // ← 真实 API
      this.page.currentPage,
      this.page.pageSize,
      this.search
    );
    this.employees = res.data?.records || [];
    this.total = res.data?.total || 0;
  }
}
```

### 4️⃣ 如何快速创建类似的新模块？

**方法**: 复制-修改-粘贴

1. 复制 `/views/employee/` → `/views/department/`
2. 复制 `/api/employee/` → `/api/department/`
3. 在 `src/router/views/index.js` 中添加新路由
4. 批量替换：`employee` → `department`

**时间**: 5 分钟

### 5️⃣ 权限检查什么时候才会生效？

**时间线**:

```
开发阶段 (isAuth: false)
    ↓
权限检查被跳过，所有人都能访问
    ↓
删除 isAuth: false
    ↓
权限检查开始生效，需要登陆验证
    ↓
添加 v-if="permission.xxx"
    ↓
按钮级权限控制生效
```

---

## 实战案例对比

### 案例 1：快速开发（开发阶段）

```vue
<!-- 不用考虑权限，直接写业务逻辑 -->
<template>
  <el-button @click="handleAdd">新增</el-button>
  <el-button @click="handleEdit">编辑</el-button>
  <el-button @click="handleDelete">删除</el-button>
</template>

<script>
export default {
  methods: {
    handleAdd() {
      // 不需要权限检查
      this.$router.push('/employee/add');
    }
  }
}
</script>
```

### 案例 2：上线准备（添加权限控制）

```vue
<!-- 启用权限检查 -->
<template>
  <el-button v-if="permission.employee_add" @click="handleAdd">新增</el-button>
  <el-button v-if="permission.employee_edit" @click="handleEdit">编辑</el-button>
  <el-button v-if="permission.employee_delete" @click="handleDelete">删除</el-button>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters(['permission'])
  },
  methods: {
    handleAdd() {
      if (!this.permission.employee_add) {
        this.$message.error('您没有权限');
        return;
      }
      this.$router.push('/employee/add');
    }
  }
}
</script>
```

---

## 常见误区

### ❌ 误区 1：开发时用了 isAuth: false，上线时会出问题

**真相**: 完全不会！只需删除 `isAuth: false` 标记，系统自动启用认证。

### ❌ 误区 2：isAuth: false 很难移除

**真相**: 超级简单！只需删除一行代码。

### ❌ 误区 3：使用 isAuth: false 会降低安全性

**真相**: 只在开发阶段使用，上线前必须删除。对生产环境完全无影响。

### ❌ 误区 4：所有路由都应该用 isAuth: false

**真相**: 只在开发阶段临时使用。敏感页面和已上线功能不应该使用。

---

## 快速检查清单

### 开发阶段

- [ ] 路由配置添加了 `isAuth: false`
- [ ] 可以直接访问页面（不需要登录）
- [ ] 模拟数据显示正常
- [ ] 所有功能可以正常操作

### 准备上线

- [ ] 后端 API 已实现
- [ ] 从模拟数据切换到真实 API
- [ ] 用真实数据完整测试
- [ ] 删除了 `isAuth: false` 标记
- [ ] 添加了权限检查代码
- [ ] 验证：需要登录才能访问

---

## 我为你创建的完整示例

### 模块功能

| 功能 | 状态 | 位置 |
|------|------|------|
| 首页（统计+快速操作） | ✅ 完成 | `/employee/index` |
| 列表页（搜索+分页） | ✅ 完成 | `/employee/list` |
| 新增页面 | ✅ 完成 | `/employee/add` |
| 编辑页面 | ✅ 完成 | `/employee/edit/:id` |
| 表单验证 | ✅ 完成 | form.vue |
| 模拟数据 | ✅ 完成 | 所有页面 |
| 导入导出按钮 | ✅ 完成 | index.vue |
| 业务逻辑 Mixin | ✅ 完成 | mixins/index.js |
| API 接口定义 | ✅ 完成 | api/employee/index.js |
| 详细文档 | ✅ 完成 | README.md + GUIDE.md |

### 可以立即访问

```
1. http://localhost:2888/employee/index       ← 首页
2. http://localhost:2888/employee/list        ← 列表
3. http://localhost:2888/employee/add         ← 新增
4. http://localhost:2888/employee/edit/E001   ← 编辑
```

### 代码统计

| 文件 | 行数 | 说明 |
|------|------|------|
| API 接口 | 60 | 7 个方法 |
| Mixin | 50 | 5 个业务方法 |
| 首页 | 150 | 统计 + 快速操作 |
| 列表页 | 180 | 搜索 + 分页 |
| 表单页 | 200 | 完整表单 |
| 文档 | 700 | 详细说明 |

**总计**: ~1340 行代码，可直接使用

---

## 总结

### 核心流程

```
1. 添加 isAuth: false
   ↓
2. 开发和测试功能（无需登陆）
   ↓
3. 删除 isAuth: false
   ↓
4. 启用登陆验证（自动生效）
   ↓
5. 上线部署
```

### 三句话记住

1. **开发时**: 加 `isAuth: false`，可以直接访问
2. **上线前**: 删 `isAuth: false`，启用认证
3. **权限检查**: 用 `v-if="permission.xxx"` 控制操作按钮

---

**就这么简单！开发效率 +100% 🚀**

