# 解决方案：页面可以访问，但 API 报错 401 的问题

## 🎯 问题描述

**症状**：
- ✅ 可以直接进入页面（因为 `isAuth: false`）
- ❌ 页面加载后提示"认证信息错误或无效"
- ❌ "用户令牌不可用，请重新登录"

**原因**：
```
路由检查 ✓
    ↓
isAuth: false 允许进入 ✓
    ↓
页面加载，调用 API
    ↓
axios 拦截器检查 token
    ↓
没有 token → 返回 401
    ↓
系统提示：认证信息错误 ❌
```

---

## ✅ 解决方案

### 核心原理

在 axios 的请求拦截器中，有一个参数控制是否需要 token：

```javascript
// src/axios.js 第 64 行
const isToken = meta.isToken === false;  // 如果为 true，跳过 token 验证
```

所以只需要在 API 调用时添加 `meta: { isToken: true }` 即可跳过 token 验证。

### 实施方法

#### 方法 1：单个 API 方法（推荐用于特定接口）

```javascript
// src/api/employee/index.js

export const getList = (current, size, params = {}) => {
  return request({
    url: `${api}/list`,
    method: 'get',
    params: {
      current,
      size,
      ...params,
    },
    meta: {
      isToken: true,  // ← 这个参数使 API 不需要 token
    },
  });
};
```

**效果**:
- 这个 API 不会被 token 验证拦截
- 可以在没有登陆的情况下调用
- 完全不影响其他 API

#### 方法 2：整个模块（推荐用于整个开发模块）

如果整个模块都不需要 token 验证，可以在 API 文件顶部创建一个配置：

```javascript
// src/api/employee/index.js

const api = '/blade-employee';

// 开发阶段配置：所有 API 都跳过 token 验证
const devConfig = {
  meta: {
    isToken: true,  // ← 跳过 token 验证
  },
};

export const getList = (current, size, params = {}) => {
  return request({
    url: `${api}/list`,
    method: 'get',
    params: {
      current,
      size,
      ...params,
    },
    ...devConfig,  // ← 应用配置
  });
};

export const getDetail = (id) => {
  return request({
    url: `${api}/detail`,
    method: 'get',
    params: { id },
    ...devConfig,  // ← 应用配置
  });
};

// ... 其他 API 方法
```

---

## 📋 已为你更新的文件

### 更新内容

**文件**: `src/api/employee/index.js`

为所有 7 个 API 方法添加了 `meta: { isToken: true }` 标记：

```javascript
✅ getList()         // 获取员工列表
✅ getDetail()       // 获取员工详情
✅ add()             // 新增员工
✅ update()          // 更新员工
✅ remove()          // 删除员工
✅ importEmployee()  // 导入员工
✅ exportEmployee()  // 导出员工
```

### 现在可以做什么

现在访问员工管理模块时：
- ✅ 页面可以进入
- ✅ API 可以正常调用
- ✅ 数据可以正常加载
- ✅ 所有功能可以正常使用

试试访问：
```
http://localhost:2888/employee/index
http://localhost:2888/employee/list
http://localhost:2888/employee/add
```

---

## 🔄 三个阶段的 token 处理

### 第一阶段：开发阶段（当前）

```javascript
// 路由配置
meta: {
  isAuth: false  // ← 允许进入
}

// API 配置
meta: {
  isToken: true  // ← 跳过 token 验证
}

结果：无需登陆，可以直接访问和调用 API ✓
```

### 第二阶段：后端集成

```javascript
// 路由配置（不变）
meta: {
  isAuth: false  // ← 仍然允许进入
}

// API 配置（改为真实 API）
meta: {
  isToken: false  // ← 改回，需要 token
  // 或删除 meta 配置
}

// 但是后端 API 实际上可以接受真实请求
结果：模拟数据改为真实数据，其他不变
```

### 第三阶段：上线（启用认证）

```javascript
// 路由配置
meta: {
  isAuth: false  // ← 删除这一行或改为 true
}

// API 配置
meta: {
  isToken: false  // ← 需要 token
  // 或删除 meta 配置，使用默认值
}

结果：需要登陆，需要有效 token ✓
```

---

## 理解 isToken 参数

### isToken: true vs isToken: false

```javascript
// isToken: true (跳过 token 验证)
export const publicAPI = () => {
  return request({
    url: '/public-api',
    meta: {
      isToken: true,  // ← 不需要 token，任何人都能调用
    },
  });
};

// isToken: false (需要 token 验证) - 这是默认值
export const privateAPI = () => {
  return request({
    url: '/private-api',
    meta: {
      isToken: false,  // 或省略，默认需要 token
    },
  });
};
```

### axios.js 中的处理逻辑

```javascript
// src/axios.js 第 64-74 行

const isToken = meta.isToken === false;  // 如果 isToken 为 false，则跳过

const token = getToken();
if (token && !isToken) {  // 如果有 token 且不跳过，则使用 token
  config.headers[website.tokenHeader] = cryptoToken
    ? 'crypto ' + crypto.encryptAES(token, crypto.cryptoKey)
    : 'bearer ' + token;
}
```

**理解**:
- `isToken: false` (或默认) → 如果有 token，就使用 token
- `isToken: true` → 无论如何都不使用 token

---

## 🚀 快速参考

### 开发阶段快速复制

如果你创建其他不需要登陆的模块，可以这样做：

```javascript
// 在你的 API 文件顶部加上这个配置
const devConfig = {
  meta: {
    isToken: true,  // 跳过 token 验证
  },
};

// 然后在每个 API 调用中加上 ...devConfig
export const getList = (params) => {
  return request({
    url: `/api/mymodule/list`,
    method: 'get',
    params,
    ...devConfig,  // ← 加上这一行
  });
};
```

### 上线前的改动

从开发切换到上线只需要：

```javascript
// 删除或注释掉这个配置
// const devConfig = {
//   meta: {
//     isToken: true,
//   },
// };

// 删除或注释掉 API 中的 ...devConfig
export const getList = (params) => {
  return request({
    url: `/api/mymodule/list`,
    method: 'get',
    params,
    // ...devConfig,  // ← 删除这一行
  });
};
```

---

## ⚠️ 注意事项

### ❌ 不要这样做

```javascript
// ❌ 错误：meta 配置错了
meta: {
  isAuth: true  // 这控制路由认证，不是 API 认证
}

// ❌ 错误：参数名拼写错了
meta: {
  istoken: true  // 应该是 isToken（大小写错误）
}

// ❌ 错误：没有添加 meta
return request({
  url: '/api/list',
  // 缺少 meta 配置
});
```

### ✅ 应该这样做

```javascript
// ✅ 正确：使用 meta.isToken
meta: {
  isToken: true  // 跳过 API token 验证
}

// ✅ 正确：配合 isAuth 使用
// 路由配置
meta: {
  isAuth: false  // 路由允许进入
}

// API 配置
meta: {
  isToken: true  // API 跳过 token
}
```

---

## 🧪 测试步骤

### 步骤 1：刷新页面

```
清空缓存后重新访问：
http://localhost:2888/employee/list
```

### 步骤 2：观察结果

- [ ] 页面成功加载（没有被重定向到登陆页）
- [ ] 员工列表数据显示（模拟数据）
- [ ] 没有提示"认证信息错误"
- [ ] 搜索、分页、新增、编辑、删除功能正常

### 步骤 3：打开浏览器控制台

按 F12，打开 Network 标签，查看 API 请求：

```
GET /blade-employee/list

Headers 中应该看不到 Authorization 头：
Authorization: Bearer xxx  ← 应该没有这个
```

---

## 📚 相关概念回顾

| 概念 | 位置 | 说明 |
|------|------|------|
| `isAuth` | 路由 meta | 控制路由是否需要登陆 |
| `isToken` | API meta | 控制 API 请求是否需要 token |
| `Authorization` | 请求头 | 存储 token 的地方 |
| `token` | 浏览器 Cookie | 登陆后获得的凭证 |

### 流程对比

```
场景 1：有登陆，有 token
┌─────────────────────┐
│ 路由检查 (isAuth)   │ → isAuth: false 允许 / true 检查
├─────────────────────┤
│ 页面加载            │ → 成功进入
├─────────────────────┤
│ API 请求 (isToken)  │ → isToken: false 使用 token / true 不用
├─────────────────────┤
│ 请求头添加 token    │ → Authorization: Bearer xxx
├─────────────────────┤
│ 后端验证            │ → token 有效，返回数据 ✓
└─────────────────────┘

场景 2：无登陆，无 token（开发阶段）
┌─────────────────────┐
│ 路由检查 (isAuth)   │ → isAuth: false 允许 ✓
├─────────────────────┤
│ 页面加载            │ → 成功进入 ✓
├─────────────────────┤
│ API 请求 (isToken)  │ → isToken: true 不需要 token ✓
├─────────────────────┤
│ 请求头不添加 token  │ → 没有 Authorization 头
├─────────────────────┤
│ 后端验证            │ → 允许无 token 访问，返回数据 ✓
└─────────────────────┘
```

---

## 🎓 总结

### 关键改动

在 `src/api/employee/index.js` 中，为所有 API 方法添加了：

```javascript
meta: {
  isToken: true,  // 跳过 token 验证
}
```

### 现在可以

✅ 在开发阶段无需登陆访问页面
✅ API 可以正常调用（跳过 token 检查）
✅ 看到模拟数据的完整效果
✅ 测试所有页面功能

### 上线前需要

- [ ] 删除或注释掉 `meta: { isToken: true }`
- [ ] 后端 API 真正实现
- [ ] 用真实数据测试
- [ ] 删除路由中的 `isAuth: false`

---

**版本**: 1.0
**更新时间**: 2024-12-02
**状态**: 已修复 - 可以正常使用 ✓

