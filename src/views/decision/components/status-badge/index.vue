<template>
  <el-tag :type="statusType" effect="light" size="small">{{ statusLabel }}</el-tag>
</template>

<script>
export default {
  props: {
    status: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: 'topic' // 'topic' | 'task'
    }
  },
  computed: {
    statusLabel() {
      // 议题状态标签
      if (this.type === 'topic') {
        const topicLabels = {
          draft: '议题申请中',
          pending_vote: '待上会',
          applying: '上会申请中',
          approved: '已申请上会',
          voting: '结论审批中',
          completed: '结论录入完成',
          withdrawn: '已撤回'
        };
        return topicLabels[this.status] || '未知';
      }

      // 任务状态标签（原有逻辑）
      const labelMap = {
        draft: '草稿',
        active: '进行中',
        voting: '投票中',
        ended: '已结束',
        archived: '已存档',
        pending: '待审批',
        assigned: '已分配',
        in_progress: '进行中',
        completed: '已完成',
        overdue: '逾期',
        withdrawn: '已撤回',
        rejected: '已拒绝'
      };
      return labelMap[this.status] || '未知';
    },
    statusType() {
      // 议题状态类型
      if (this.type === 'topic') {
        const topicTypes = {
          draft: 'info',
          pending_vote: 'warning',
          applying: 'primary',
          approved: 'success',
          voting: 'warning',
          completed: 'success',
          withdrawn: 'danger'
        };
        return topicTypes[this.status] || 'info';
      }

      // 任务状态类型（原有逻辑）
      const typeMap = {
        draft: 'info',
        active: 'primary',
        voting: 'warning',
        ended: 'success',
        archived: 'danger',
        pending: 'info',
        assigned: 'primary',
        in_progress: 'warning',
        completed: 'success',
        overdue: 'danger',
        withdrawn: 'info',
        rejected: 'danger'
      };
      return typeMap[this.status] || 'info';
    }
  }
};
</script>
