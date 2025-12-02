<template>
  <el-card class="task-item" shadow="hover">
    <div class="task-header">
      <div class="task-title-group">
        <status-badge :status="task.status" />
        <h3 class="task-title">{{ task.title }}</h3>
      </div>
      <div class="task-actions">
        <el-button type="primary" link size="small" @click="handleEdit">编辑</el-button>
        <el-button type="danger" link size="small" @click="handleDelete">删除</el-button>
      </div>
    </div>

    <div class="task-content">
      <p class="description">{{ task.description }}</p>

      <div class="task-meta">
        <div class="meta-item">
          <i class="el-icon-user"></i>
          <span>{{ task.assigneeName || '未分配' }}</span>
        </div>
        <div class="meta-item">
          <i class="el-icon-date"></i>
          <span>截止: {{ formatTime(task.dueDate) }}</span>
        </div>
        <div class="meta-item">
          <i class="el-icon-warning"></i>
          <el-tag
            :type="priorityType"
            size="small"
          >
            {{ priorityLabel }}
          </el-tag>
        </div>
      </div>

      <div v-if="task.status === 'in_progress'" class="progress-bar">
        <el-progress :percentage="task.progress || 0" size="small" />
      </div>

      <div class="task-footer">
        <span class="create-info">由 {{ task.creatorName }} 创建于 {{ formatTime(task.createTime) }}</span>
        <div class="footer-actions">
          <el-button
            v-if="task.status === 'pending'"
            type="success"
            size="small"
            @click="handleStart"
          >
            开始
          </el-button>
          <el-button
            v-if="task.status === 'in_progress'"
            type="success"
            size="small"
            @click="handleComplete"
          >
            完成
          </el-button>
          <el-button
            type="primary"
            size="small"
            @click="handleDetail"
          >
            详情
          </el-button>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script>
import StatusBadge from '../status-badge/index.vue';
import { formatTime } from '../../utils/formatter';

export default {
  components: {
    StatusBadge
  },
  props: {
    task: {
      type: Object,
      required: true
    }
  },
  computed: {
    priorityLabel() {
      const labelMap = {
        high: '高',
        medium: '中',
        low: '低'
      };
      return labelMap[this.task.priority] || '中';
    },
    priorityType() {
      const typeMap = {
        high: 'danger',
        medium: 'warning',
        low: 'info'
      };
      return typeMap[this.task.priority] || 'info';
    }
  },
  methods: {
    formatTime,
    handleEdit() {
      this.$router.push(`/decision/task/detail/${this.task.id}`);
    },
    handleDelete() {
      this.$emit('delete', this.task.id);
    },
    handleStart() {
      this.$emit('start', this.task.id);
    },
    handleComplete() {
      this.$emit('complete', this.task.id);
    },
    handleDetail() {
      this.$router.push(`/decision/task/detail/${this.task.id}`);
    }
  }
};
</script>

<style scoped lang="scss">
.task-item {
  margin-bottom: 15px;
  transition: all 0.3s;

  &:hover {
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.15);
  }

  .task-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 1px solid #ebeef5;

    .task-title-group {
      display: flex;
      align-items: center;
      gap: 10px;
      flex: 1;

      .task-title {
        margin: 0;
        font-size: 14px;
        font-weight: 600;
        color: #303133;
      }
    }

    .task-actions {
      display: flex;
      gap: 5px;
    }
  }

  .task-content {
    .description {
      color: #606266;
      font-size: 13px;
      line-height: 1.5;
      margin-bottom: 10px;
      max-height: 50px;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .task-meta {
      display: flex;
      gap: 15px;
      margin-bottom: 10px;
      font-size: 12px;
      color: #909399;
      flex-wrap: wrap;

      .meta-item {
        display: flex;
        align-items: center;
        gap: 5px;

        i {
          font-size: 14px;
        }
      }
    }

    .progress-bar {
      margin-bottom: 10px;
    }

    .task-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 10px;
      border-top: 1px solid #ebeef5;

      .create-info {
        font-size: 11px;
        color: #aaaaaa;
      }

      .footer-actions {
        display: flex;
        gap: 5px;
      }
    }
  }
}
</style>
