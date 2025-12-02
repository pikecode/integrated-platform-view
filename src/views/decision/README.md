# 议事决策模块

## 模块简介

议事决策模块是一个完整的协作决策系统，用于组织内部的议题讨论、投票决策和任务管理。

**模块路径**: `/decision`

## 核心功能

### 1. 议题管理 (Topic Management)
- **路由**: `/decision/topic`
- **页面**: `pages/topic/index.vue`
- **主要功能**:
  - 创建新议题
  - 编辑议题信息
  - 发起投票
  - 查看投票结果
  - 存档议题
  - 搜索和过滤议题

### 2. 任务管理 (Task Management)
- **路由**: `/decision/task`
- **页面**: `pages/task/index.vue`
- **主要功能**:
  - 创建任务
  - 分配任务给成员
  - 跟踪任务进度
  - 标记任务完成
  - 查看我的任务
  - 任务优先级和状态管理

### 3. 仪表盘 (Dashboard)
- **路由**: `/decision/index`
- **页面**: `pages/index.vue`
- **主要功能**:
  - 统计议题数量和任务数量
  - 快速操作按钮
  - 最新议题列表
  - 我的任务列表
  - 系统概览

## 目录结构

```
src/views/decision/
├── api/                          # 已移至 src/api/decision
│   ├── topic.js                 # 议题 API
│   └── task.js                  # 任务 API
├── components/                   # 模块级组件
│   ├── topic-card/              # 议题卡片组件
│   │   └── index.vue
│   ├── task-item/               # 任务项组件
│   │   └── index.vue
│   └── status-badge/            # 状态徽章组件
│       └── index.vue
├── pages/                        # 页面组件
│   ├── index.vue                # 仪表盘首页
│   ├── topic/
│   │   └── index.vue            # 议题列表
│   └── task/
│       └── index.vue            # 任务列表
├── utils/                        # 工具函数
│   ├── formatter.js             # 数据格式化工具
│   └── index.js                 # 工具导出
├── mixins/                       # 模块级 mixins
│   ├── topic.js                 # 议题相关业务逻辑 mixin
│   └── task.js                  # 任务相关业务逻辑 mixin
└── README.md                     # 本文件
```

## API 文档

### 议题 API (`src/api/decision/topic.js`)

```javascript
import * as topicApi from '@/api/decision/topic';

// 获取议题列表
topicApi.getList(current, size, params)

// 获取议题详情
topicApi.getDetail(id)

// 新增议题
topicApi.add(row)

// 更新议题
topicApi.update(row)

// 删除议题
topicApi.remove(ids)

// 发起投票
topicApi.startVote(topicId)

// 结束投票
topicApi.endVote(topicId)

// 提交投票
topicApi.submitVote(topicId, vote)

// 获取投票结果
topicApi.getVoteResult(topicId)

// 存档议题
topicApi.archive(topicId)
```

### 任务 API (`src/api/decision/task.js`)

```javascript
import * as taskApi from '@/api/decision/task';

// 获取任务列表
taskApi.getList(current, size, params)

// 获取任务详情
taskApi.getDetail(id)

// 新增任务
taskApi.add(row)

// 更新任务
taskApi.update(row)

// 删除任务
taskApi.remove(ids)

// 分配任务
taskApi.assign(taskId, assigneeId)

// 标记任务完成
taskApi.markComplete(taskId)

// 获取任务状态统计
taskApi.getStatistics()

// 获取我的任务
taskApi.getMyTasks(current, size, params)

// 更新任务进度
taskApi.updateProgress(taskId, progress)
```

## 组件文档

### TopicCard (议题卡片)

用于展示单个议题的卡片组件。

**Props:**
- `topic` (Object, required): 议题对象
- `canDelete` (Boolean, default: false): 是否可以删除

**Events:**
- `start-vote`: 发起投票
- `vote`: 提交投票
- `delete`: 删除议题

**使用示例:**
```vue
<topic-card
  :topic="topic"
  :can-delete="canDelete"
  @start-vote="handleStartVote"
  @vote="handleVote"
  @delete="handleDelete"
/>
```

### TaskItem (任务项)

用于展示单个任务的列表项组件。

**Props:**
- `task` (Object, required): 任务对象

**Events:**
- `delete`: 删除任务
- `start`: 开始任务
- `complete`: 完成任务

**使用示例:**
```vue
<task-item
  :task="task"
  @delete="handleDelete"
  @start="handleStart"
  @complete="handleComplete"
/>
```

### StatusBadge (状态徽章)

用于显示议题或任务状态的徽章组件。

**Props:**
- `status` (String, required): 状态值

**支持的状态:**
- 议题: draft, active, voting, ended, archived
- 任务: pending, assigned, in_progress, completed, overdue

## Mixin 文档

### Topic Mixin

提供议题相关的业务逻辑，包括投票、存档等操作。

**方法:**
- `startVote(topicId)`: 发起投票
- `endVote(topicId)`: 结束投票
- `submitVote(topicId, vote)`: 提交投票
- `getVoteResult(topicId)`: 获取投票结果
- `archiveTopic(topicId)`: 存档议题
- `deleteTopic(topicId)`: 删除议题

**使用:**
```javascript
import topicMixin from '@/views/decision/mixins/topic';

export default {
  mixins: [topicMixin],
  methods: {
    handleVote() {
      this.submitVote(this.topicId, 'agree');
    }
  }
}
```

### Task Mixin

提供任务相关的业务逻辑，包括分配、标记完成等操作。

**方法:**
- `assignTask(taskId, assigneeId)`: 分配任务
- `markTaskComplete(taskId)`: 标记任务完成
- `updateTaskProgress(taskId, progress)`: 更新任务进度
- `getTaskStatistics()`: 获取任务统计
- `getMyTasks(current, size, params)`: 获取我的任务
- `deleteTask(taskId)`: 删除任务

**使用:**
```javascript
import taskMixin from '@/views/decision/mixins/task';

export default {
  mixins: [taskMixin],
  methods: {
    handleComplete() {
      this.markTaskComplete(this.taskId);
    }
  }
}
```

## 工具函数

### Formatter (`utils/formatter.js`)

```javascript
import { formatTime, formatDate, getRelativeTime, getTopicStatusLabel, getTaskStatusLabel, getPriorityLabel, calculateVotePercentage, isOverdue, getDaysUntilDue, isAboutToOverdue } from '@/views/decision/utils/formatter';

// 格式化时间: "2024-12-02 14:30"
formatTime('2024-12-02T14:30:00')

// 格式化日期: "2024-12-02"
formatDate('2024-12-02T14:30:00')

// 相对时间: "2小时前"
getRelativeTime('2024-12-02T14:30:00')

// 议题状态标签
getTopicStatusLabel('voting') // => "投票中"

// 任务状态标签
getTaskStatusLabel('in_progress') // => "进行中"

// 优先级标签
getPriorityLabel('high') // => "高"

// 计算投票百分比
calculateVotePercentage(8, 10) // => 80

// 判断是否逾期
isOverdue('2024-11-01') // => true

// 获取距离截止日期的天数
getDaysUntilDue('2024-12-10') // => 8

// 判断是否即将逾期（3天内）
isAboutToOverdue('2024-12-05') // => true
```

## 路由配置

所有路由已配置在 `src/router/views/index.js` 中：

```javascript
{
  path: '/decision',
  component: Layout,
  redirect: '/decision/index',
  children: [
    { path: 'index', name: '议事决策', ... },
    { path: 'topic', name: '议题管理', ... },
    { path: 'topic/create', name: '新建议题', ... },
    { path: 'topic/detail/:id', name: '议题详情', ... },
    { path: 'topic/vote/:id', name: '投票', ... },
    { path: 'task', name: '任务管理', ... },
    { path: 'task/create', name: '新建任务', ... },
    { path: 'task/detail/:id', name: '任务详情', ... },
    { path: 'task/my-tasks', name: '我的任务', ... }
  ]
}
```

## 权限配置

权限命名规范: `decision_{resource}_{action}`

- `decision_topic_add`: 创建议题
- `decision_topic_update`: 编辑议题
- `decision_topic_delete`: 删除议题
- `decision_task_add`: 创建任务
- `decision_task_update`: 编辑任务
- `decision_task_delete`: 删除任务

## 使用示例

### 在其他模块中使用议题相关功能

```javascript
import * as topicApi from '@/api/decision/topic';

// 获取议题列表
const topics = await topicApi.getList(1, 10, { status: 'active' });

// 发起投票
await topicApi.startVote(topicId);

// 提交投票
await topicApi.submitVote(topicId, 'agree');
```

### 使用组件

```vue
<template>
  <div>
    <!-- 显示议题卡片 -->
    <topic-card
      :topic="topic"
      @start-vote="handleStartVote"
      @vote="handleVote"
    />

    <!-- 显示任务项 -->
    <task-item
      :task="task"
      @complete="handleComplete"
    />

    <!-- 显示状态徽章 -->
    <status-badge :status="topic.status" />
  </div>
</template>

<script>
import TopicCard from '@/views/decision/components/topic-card';
import TaskItem from '@/views/decision/components/task-item';
import StatusBadge from '@/views/decision/components/status-badge';

export default {
  components: {
    TopicCard,
    TaskItem,
    StatusBadge
  }
}
</script>
```

## 后端接口约定

### 议题数据结构

```javascript
{
  id: 'uuid',
  title: '议题标题',
  description: '议题描述',
  status: 'draft|active|voting|ended|archived',
  creatorId: 'user_id',
  creatorName: '张三',
  participantCount: 10,
  voteAgree: 8,
  voteDisagree: 1,
  voteAbstain: 1,
  createTime: '2024-12-02T14:30:00',
  updateTime: '2024-12-02T14:30:00'
}
```

### 任务数据结构

```javascript
{
  id: 'uuid',
  title: '任务标题',
  description: '任务描述',
  status: 'pending|assigned|in_progress|completed|overdue',
  priority: 'high|medium|low',
  assigneeId: 'user_id',
  assigneeName: '李四',
  creatorId: 'user_id',
  creatorName: '张三',
  progress: 50,
  dueDate: '2024-12-10',
  createTime: '2024-12-02T14:30:00',
  updateTime: '2024-12-02T14:30:00'
}
```

## 常见问题

### Q: 如何扩展新的业务逻辑？

A:
1. 在 `utils/formatter.js` 中添加新的格式化函数
2. 在 `mixins/` 中添加新的业务逻辑 mixin
3. 在页面组件中引入并使用

### Q: 如何添加新的组件？

A:
1. 在 `components/` 中创建新的组件目录
2. 编写 `index.vue` 文件
3. 在页面中导入和使用

### Q: 如何修改 API 端点？

A:
在 `src/api/decision/` 中的对应文件修改 `api` 变量：
```javascript
const api = '/blade-decision/topic'; // 修改此处
```

## 开发指南

1. **添加新功能**: 遵循现有的代码结构和命名规范
2. **编写 API**: 使用统一的请求函数模式
3. **创建组件**: 确保组件的复用性和独立性
4. **编写 mixin**: 将可复用的业务逻辑提取到 mixin 中
5. **权限控制**: 使用 `v-if="permission.xxx"` 控制操作按钮的显示

## 测试

### 本地测试

1. 启动开发服务器: `pnpm dev`
2. 访问 `http://localhost:2888/decision`
3. 后端需要实现对应的 API 端点

### 数据模拟

如果后端暂未实现，可以在 `src/mock/` 中添加模拟数据。

## 部署

模块已经集成到主应用中，跟随主应用的部署流程即可：

```bash
npm run build:prod
```

## 联系方式

如有问题，请联系开发团队。

---

更新时间: 2024-12-02
