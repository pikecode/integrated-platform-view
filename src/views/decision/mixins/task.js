/**
 * 任务管理相关的公共逻辑 mixin
 */

import * as taskApi from '@/api/decision/task';

export default {
  methods: {
    /**
     * 分配任务
     */
    async assignTask(taskId, assigneeId) {
      try {
        await taskApi.assign(taskId, assigneeId);
        this.$message.success('任务已分配');
        this.loadTasks?.();
      } catch (error) {
        this.$message.error('操作失败: ' + error.message);
      }
    },

    /**
     * 标记任务完成
     */
    async markTaskComplete(taskId) {
      try {
        await taskApi.markComplete(taskId);
        this.$message.success('任务已完成');
        this.loadTasks?.();
      } catch (error) {
        this.$message.error('操作失败: ' + error.message);
      }
    },

    /**
     * 更新任务进度
     */
    async updateTaskProgress(taskId, progress) {
      try {
        await taskApi.updateProgress(taskId, progress);
        this.$message.success('进度已更新');
        this.loadTasks?.();
      } catch (error) {
        this.$message.error('操作失败: ' + error.message);
      }
    },

    /**
     * 获取任务状态统计
     */
    async getTaskStatistics() {
      try {
        const res = await taskApi.getStatistics();
        return res.data;
      } catch (error) {
        this.$message.error('获取统计失败');
        return null;
      }
    },

    /**
     * 获取我的任务
     */
    async getMyTasks(current, size, params) {
      try {
        const res = await taskApi.getMyTasks(current, size, params);
        return res.data;
      } catch (error) {
        this.$message.error('获取任务失败');
        return null;
      }
    },

    /**
     * 删除任务
     */
    async deleteTask(taskId) {
      try {
        this.$confirm('确定删除此任务？', '提示', { type: 'warning' }).then(async () => {
          await taskApi.remove(taskId);
          this.$message.success('任务已删除');
          this.loadTasks?.();
        });
      } catch (error) {
        if (error !== 'cancel') {
          this.$message.error('操作失败: ' + error.message);
        }
      }
    }
  }
};
