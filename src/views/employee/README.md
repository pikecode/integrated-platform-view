# 员工管理模块

## 模块简介

员工管理模块是一个完整的人力资源管理系统，用于管理公司员工信息、岗位分配和入职离职流程。

**模块路由前缀**: `/employee`

**开发状态**: 开发中 - 暂不需要登陆验证（可直接访问）

---

## 核心功能

### 1. 仪表盘首页 (`/employee/index`)
- 员工统计卡片（总数、在职、离职、待入职）
- 快速操作按钮（查看列表、新增、导入、导出）
- 最近新增员工列表展示
- 支持导入导出功能

### 2. 员工列表 (`/employee/list`)
- 员工信息列表展示
- 搜索和过滤功能
  - 按姓名搜索
  - 按状态筛选（在职、待入职、离职、停用）
- 分页显示
- 编辑和删除操作

### 3. 员工新增/编辑 (`/employee/add` / `/employee/edit/:id`)
- 基本信息录入（姓名、部门、职位）
- 联系信息录入（电话、邮箱）
- 工作信息设置（入职日期、员工状态）
- 备注信息
- 表单验证

---

## 目录结构

```
src/
├── api/employee/
│   └── index.js              # 员工管理 API
│
├── views/employee/
│   ├── mixins/
│   │   └── index.js          # 员工业务逻辑 mixin
│   ├── pages/
│   │   ├── index.vue         # 仪表盘首页
│   │   ├── list.vue          # 员工列表
│   │   └── form.vue          # 员工表单 (新增/编辑)
│   └── README.md             # 本文件
│
└── router/
    └── views/
        └── index.js          # 路由配置
```

---

## API 文档

### 员工 API (`src/api/employee/index.js`)

```javascript
import * as employeeApi from '@/api/employee';

// 获取员工列表
employeeApi.getList(current, size, params)
// 参数:
//   - current: 当前页（从1开始）
//   - size: 每页条数
//   - params: {name, status, ...}

// 获取员工详情
employeeApi.getDetail(id)

// 新增员工
employeeApi.add(row)

// 更新员工
employeeApi.update(row)

// 删除员工
employeeApi.remove(ids)

// 导入员工（批量）
employeeApi.importEmployee(formData)

// 导出员工数据
employeeApi.exportEmployee(params)
```

---

## 路由配置

所有路由已配置在 `src/router/views/index.js` 中，包含以下页面：

```javascript
{
  path: '/employee',
  component: Layout,
  redirect: '/employee/index',
  meta: {
    isAuth: false,  // 开发阶段：暂不需要认证
  },
  children: [
    { path: 'index', name: '员工管理', ... },       // 仪表盘
    { path: 'list', name: '员工列表', ... },        // 列表页
    { path: 'add', name: '新增员工', ... },         // 新增页
    { path: 'edit/:id', name: '编辑员工', ... },   // 编辑页
  ]
}
```

---

## 访问方式

### 开发阶段（无需登录）

直接在浏览器中访问：

- **首页**: `http://localhost:2888/employee/index`
- **员工列表**: `http://localhost:2888/employee/list`
- **新增员工**: `http://localhost:2888/employee/add`
- **编辑员工**: `http://localhost:2888/employee/edit/E001`

### 在应用中导航

```javascript
// 导航到首页
this.$router.push('/employee/index');

// 导航到列表
this.$router.push('/employee/list');

// 导航到新增
this.$router.push('/employee/add');

// 导航到编辑
this.$router.push(`/employee/edit/${employeeId}`);
```

---

## 使用示例

### 在组件中使用 Mixin

```javascript
import mixin from '@/views/employee/mixins';

export default {
  mixins: [mixin],
  methods: {
    handleCreate() {
      this.createEmployee();  // 导航到新增页
    },
    handleEdit(id) {
      this.editEmployee(id);  // 导航到编辑页
    },
    handleDelete(id) {
      this.deleteEmployee(id);  // 删除员工
    }
  }
}
```

### 在其他模块中调用员工 API

```javascript
import * as employeeApi from '@/api/employee';

// 获取所有在职员工
const res = await employeeApi.getList(1, 1000, {
  status: 'active'
});

// 获取某个员工的详情
const employee = await employeeApi.getDetail('E001');
```

---

## 当前模拟数据

开发阶段使用的模拟数据包括：

**员工列表:**
- E001 - 张三 (技术部, 前端工程师, 在职)
- E002 - 李四 (产品部, 产品经理, 在职)
- E003 - 王五 (设计部, UI设计师, 待入职)
- E004 - 赵六 (技术部, 后端工程师, 在职)
- E005 - 孙七 (销售部, 销售经理, 离职)

统计数据：
- 总员工数: 156
- 在职员工: 142
- 离职员工: 10
- 待入职: 4

---

## 开发规范

### 1. 命名规范

- 路由路径: 小写 + 横线分隔 (`/employee`, `/employee-list`)
- 组件名: PascalCase (`EmployeeList`, `EmployeeForm`)
- 方法名: camelCase (`loadEmployees`, `handleDelete`)
- CSS 类名: kebab-case (`.search-row`, `.form-card`)

### 2. 文件组织

- API 文件: `src/api/{module}/`
- 组件文件: `src/views/{module}/components/`
- 页面文件: `src/views/{module}/pages/`
- 工具函数: `src/views/{module}/utils/`
- 业务逻辑: `src/views/{module}/mixins/`

### 3. 组件规范

- 使用 Vue 3 Composition API（或 Options API）
- 使用 Element Plus 组件库
- 使用 SCSS 样式（scoped）
- 添加适当的注释和文档

---

## 后端 API 要求

### 数据结构

**员工对象:**
```javascript
{
  id: 'E001',                  // 员工ID
  name: '张三',                // 员工姓名
  department: '技术部',         // 所属部门
  position: '前端工程师',       // 职位
  phone: '13800138000',        // 联系电话
  email: 'email@example.com',  // 邮箱
  hireDate: '2024-01-15',      // 入职日期
  status: 'active',            // 状态 (active/pending/left/inactive)
  remark: '备注',              // 备注信息
  createTime: '2024-01-15 10:00:00',  // 创建时间
  updateTime: '2024-12-02 14:30:00'   // 更新时间
}
```

### API 端点

需要后端实现以下接口（假设基础路径为 `/blade-employee`）：

| 方法 | 端点 | 说明 |
|------|------|------|
| GET | `/list` | 获取员工列表 |
| GET | `/detail` | 获取员工详情 |
| POST | `/submit` | 新增员工 |
| POST | `/update` | 更新员工 |
| POST | `/remove` | 删除员工 |
| POST | `/import` | 导入员工 |
| GET | `/export` | 导出员工 |

---

## 分阶段开发计划

### ✅ 第一阶段：开发阶段（当前）
- [x] 路由配置 (isAuth: false)
- [x] 页面结构搭建
- [x] 模拟数据展示
- [x] 基础功能开发
- [x] 表单验证

**状态**: 可直接访问，无需登录

### 📋 第二阶段：后端集成
- [ ] 后端 API 实现
- [ ] 真实数据测试
- [ ] 导入导出功能
- [ ] 错误处理优化

### 🔐 第三阶段：权限配置
- [ ] 配置权限代码 (employee_view, employee_add, etc.)
- [ ] 移除 `isAuth: false` 标记
- [ ] 添加权限检查

### 🚀 第四阶段：上线
- [ ] 性能优化
- [ ] 国际化支持
- [ ] 完整测试覆盖
- [ ] 部署和文档

---

## 常见问题

### Q1: 如何添加新的员工属性？

A: 需要修改以下几个地方：
1. `src/api/employee/index.js` - 更新 API 参数
2. `src/views/employee/pages/form.vue` - 添加表单字段
3. `src/views/employee/pages/list.vue` - 添加列表列
4. `src/views/employee/pages/index.vue` - 如需要

### Q2: 如何切换到真实后端 API？

A: 修改 `src/api/employee/index.js` 中的 `api` 变量：

```javascript
// 当前
const api = '/blade-employee';

// 改为你的实际 API 前缀
const api = '/api/employee';
```

### Q3: 如何启用登陆验证？

A: 修改 `src/router/views/index.js`，移除或改为 true：

```javascript
// 当前（开发阶段）
meta: {
  isAuth: false,
}

// 修改为（启用验证）
meta: {
  // isAuth: false,  // 删除这一行
}
```

### Q4: 导入导出功能如何实现？

A:
- **导入**: 点击"导入员工"按钮 → 选择 Excel 文件 → 自动上传到 `/blade-employee/import`
- **导出**: 点击"导出员工"按钮 → 下载 Excel 文件

需要后端实现对应的文件处理接口。

---

## 技术栈

- **框架**: Vue 3
- **UI 框架**: Element Plus
- **HTTP 客户端**: Axios
- **状态管理**: Vuex
- **路由**: Vue Router
- **样式**: SCSS

---

## 联系方式

如有任何问题或建议，请联系开发团队。

---

**创建时间**: 2024-12-02
**模块状态**: 开发中 - 测试版
**下一步**: 等待后端 API 实现或直接使用模拟数据继续开发

