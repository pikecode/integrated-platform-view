<template>
  <div class="activity-log">
    <div class="header">
      <h3>{{ title }}</h3>
    </div>

    <div class="log-list">
      <div
        v-for="(log, index) in logs"
        :key="index"
        class="log-item"
      >
        <div class="log-content">
          <span v-html="formatLogContent(log)"></span>
        </div>
        <div class="log-time">{{ log.time }}</div>
      </div>

      <el-empty v-if="logs.length === 0" description="暂无动态" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'ActivityLog',
  props: {
    title: {
      type: String,
      required: true
    },
    logs: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    formatLogContent(log) {
      let content = log.content;

      if (log.userName) {
        content = content.replace(
          log.userName,
          `<a href="javascript:void(0)" class="user-link">${log.userName}</a>`
        );
      }

      if (log.status === 'agree') {
        content = content.replace('（同意）', '<span class="status-tag agree">（同意）</span>');
      } else if (log.status === 'reject') {
        content = content.replace('（拒绝）', '<span class="status-tag reject">（拒绝）</span>');
      }

      return content;
    }
  }
};
</script>

<style scoped lang="scss">
.activity-log {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);

  .header {
    margin-bottom: 15px;

    h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 500;
    }
  }

  .log-list {
    max-height: 300px;
    overflow-y: auto;

    .log-item {
      padding: 12px 0;
      border-bottom: 1px solid #f0f0f0;

      &:last-child {
        border-bottom: none;
      }

      .log-content {
        font-size: 13px;
        line-height: 1.6;
        margin-bottom: 5px;
        color: #606266;

        ::v-deep .user-link {
          color: #409eff;
          text-decoration: none;

          &:hover {
            text-decoration: underline;
          }
        }

        ::v-deep .status-tag {
          &.agree {
            color: #67c23a;
          }

          &.reject {
            color: #f56c6c;
          }
        }
      }

      .log-time {
        font-size: 11px;
        color: #aaa;
      }
    }
  }
}
</style>
