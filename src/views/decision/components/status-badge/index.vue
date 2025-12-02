<template>
  <el-tag :type="statusType" effect="light" size="small">{{ statusLabel }}</el-tag>
</template>

<script>
export default {
  props: {
    status: {
      type: String,
      required: true
    }
  },
  computed: {
    statusLabel() {
      const labelMap = {
        draft: '草稿',
        active: '进行中',
        voting: '投票中',
        ended: '已结束',
        archived: '已存档',
        pending: '待处理',
        assigned: '已分配',
        in_progress: '进行中',
        completed: '已完成',
        overdue: '逾期'
      };
      return labelMap[this.status] || '未知';
    },
    statusType() {
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
        overdue: 'danger'
      };
      return typeMap[this.status] || 'info';
    }
  }
};
</script>
