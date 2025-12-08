# 议事决策模块 - 路由嵌套结构说明

## 当前路由嵌套结构（3层）

```
浏览器访问 URL: /decision/topic
     ↓
[第1层] 路由 /decision
   component: Layout (全局布局)
   ├─ 顶部导航 (top-menu)
   ├─ 标签卡 (tags)
   ├─ 左侧菜单 (sidebar - 全局菜单)
   └─ 主内容区 (avue-view)
        ↓
     [第2层] 路由 '' (空路径)
        component: wrapper.vue (决策模块容器)
        ├─ 左侧导航 (决策模块菜单) ← 额外的导航层
        └─ 右侧内容区
             ↓
        [第3层] 路由 'topic'
           component: topic/index.vue (实际页面)
           ↓
           页面在这里渲染
```

### 问题说明

#### 1. **路由嵌套层级太深（3层）**
```
用户URL: /decision/topic
    ↓
Router 解析 /decision
    ↓ 加载 Layout 组件
Router 解析空路径 ''
    ↓ 加载 wrapper.vue 组件
Router 解析 'topic'
    ↓ 加载 topic/index.vue 组件
    ↓
三个组件都需要加载和维护
```

#### 2. **多余的中间容器**
```
page/index/index.vue (全局布局)
    └─ wrapper.vue (决策模块容器) ← 这一层是多余的
        └─ topic/index.vue (实际页面)
```

#### 3. **router-view 的多层嵌套渲染**
```
<div class="avue-main">                    <!-- 第1个 router-view 渲染 -->
  <top />
  <tags />
  <div id="avue-view" v-show="!isSearch">
    <router-view>                          <!-- 第1个：渲染 wrapper.vue -->
      <div class="decision-wrapper">
        <div class="decision-sidebar">...
        <div class="decision-content">
          <router-view>                    <!-- 第2个：渲染 topic/index.vue -->
            <!-- 页面内容 -->
          </router-view>
        </div>
      </div>
    </router-view>
  </div>
</div>
```

---

## 优化后的路由结构（2层 - 更扁平）

```
浏览器访问 URL: /decision/topic
     ↓
[第1层] 路由 /decision
   component: Layout (全局布局)
   ├─ 顶部导航 (top-menu)
   ├─ 标签卡 (tags)
   ├─ 左侧菜单 (sidebar - 全局菜单)
   └─ 主内容区 (avue-view)
        ↓
     [第2层] 路由 'topic'
        component: topic/index.vue (实际页面)
        该页面内部包含：
        ├─ 左侧导航 (决策模块菜单)
        └─ 右侧内容
           ↓
           页面直接在这里渲染
```

### 优化说明

#### 1. **路由嵌套层级简化（2层）**
```
用户URL: /decision/topic
    ↓
Router 解析 /decision
    ↓ 加载 Layout 组件
Router 解析 'topic'
    ↓ 加载 topic/index.vue 组件
    ↓
只需要加载两个组件，更高效
```

#### 2. **移除多余的容器**
```
page/index/index.vue (全局布局)
    └─ topic/index.vue (页面 - 内部包含左侧导航)
              ↑ 直接渲染，无需wrapper
```

#### 3. **单层 router-view 渲染**
```
<div class="avue-main">                    <!-- 第1个 router-view 渲染 -->
  <top />
  <tags />
  <div id="avue-view" v-show="!isSearch">
    <router-view>                          <!-- 直接渲染页面 -->
      <div class="page-with-sidebar">     <!-- 页面内部包含导航 -->
        <div class="sidebar">...
        <div class="content">
          页面内容
        </div>
      </div>
    </router-view>
  </div>
</div>
```

---

## 对比总结

| 对比项 | 当前设计（3层） | 优化设计（2层） |
|-------|-----------------|-----------------|
| **路由深度** | `/decision` → `''` → `'topic'` | `/decision` → `'topic'` |
| **组件加载** | Layout → wrapper.vue → topic/index.vue | Layout → topic/index.vue |
| **router-view层数** | 2个嵌套 | 1个 |
| **中间容器** | wrapper.vue 包装 | 无包装 |
| **页面复杂度** | 简单（无导航） | 中等（需要包含导航） |
| **性能** | 稍差（多层加载） | 更好（直接加载） |
| **代码层级** | 深 | 扁平 |
| **维护成本** | 较高 | 较低 |

---

## 实现步骤

### 第1步：修改路由配置
```javascript
// 从这样：
{
  path: '/decision',
  component: Layout,
  children: [
    {
      path: '',
      component: wrapper.vue,
      children: [
        { path: 'topic', component: topic/index.vue },
        { path: 'task', component: task/index.vue },
      ]
    }
  ]
}

// 改为这样：
{
  path: '/decision',
  component: Layout,
  children: [
    { path: 'index', component: index.vue },
    { path: 'topic', component: topic/index.vue },
    { path: 'task', component: task/index.vue },
  ]
}
```

### 第2步：为每个页面添加左侧导航

每个页面组件内部需要包含左侧导航菜单（可以提取为可复用组件）：

```vue
<template>
  <div class="page-container">
    <!-- 左侧导航菜单 -->
    <decision-sidebar :active-menu="activeMenu" @select="handleMenuSelect" />

    <!-- 右侧内容区 -->
    <div class="page-content">
      <decision-breadcrumb :breadcrumbs="breadcrumbs" />
      <!-- 页面具体内容 -->
    </div>
  </div>
</template>
```

### 第3步：删除wrapper.vue
- 删除 `src/views/decision/wrapper.vue`
- 删除或备份 `src/views/decision/layout.vue`（不再使用）

### 第4步：测试验证
- 测试所有 `/decision/*` 路由
- 验证左侧菜单在每个页面都正常工作
- 验证面包屑导航正确显示
- 验证标签卡正常工作

---

## 优化收益

✅ **更少的组件层级** - 代码更容易理解
✅ **更好的性能** - 减少组件加载和渲染
✅ **更易维护** - 路由配置更清晰
✅ **与系统一致** - 与其他模块设计模式相同
✅ **更灵活** - 页面组件更独立，可单独复用

---

## 注意事项

⚠️ **左侧导航抽取** - 需要创建可复用的导航组件
⚠️ **状态管理** - 需要确保菜单选中状态在各页面间正确同步
⚠️ **面包屑数据** - 每个页面需要自己定义面包屑数据
⚠️ **样式隔离** - 需要确保页面样式不相互影响
