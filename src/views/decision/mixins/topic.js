/**
 * 议题管理相关的公共逻辑 mixin
 */

import * as topicApi from '@/api/decision/topic';

export default {
  methods: {
    /**
     * 发起投票
     */
    async startVote(topicId) {
      try {
        await topicApi.startVote(topicId);
        this.$message.success('投票已发起');
        this.loadTopics?.();
      } catch (error) {
        this.$message.error('操作失败: ' + error.message);
      }
    },

    /**
     * 结束投票
     */
    async endVote(topicId) {
      try {
        await topicApi.endVote(topicId);
        this.$message.success('投票已结束');
        this.loadTopics?.();
      } catch (error) {
        this.$message.error('操作失败: ' + error.message);
      }
    },

    /**
     * 提交投票
     */
    async submitVote(topicId, vote) {
      try {
        await topicApi.submitVote(topicId, vote);
        this.$message.success('投票已提交');
        this.loadTopics?.();
      } catch (error) {
        this.$message.error('投票失败: ' + error.message);
      }
    },

    /**
     * 获取投票结果
     */
    async getVoteResult(topicId) {
      try {
        const res = await topicApi.getVoteResult(topicId);
        return res.data;
      } catch (error) {
        this.$message.error('获取结果失败');
        return null;
      }
    },

    /**
     * 存档议题
     */
    async archiveTopic(topicId) {
      try {
        await topicApi.archive(topicId);
        this.$message.success('议题已存档');
        this.loadTopics?.();
      } catch (error) {
        this.$message.error('操作失败: ' + error.message);
      }
    },

    /**
     * 删除议题
     */
    async deleteTopic(topicId) {
      try {
        this.$confirm('确定删除此议题？', '提示', { type: 'warning' }).then(async () => {
          await topicApi.remove(topicId);
          this.$message.success('议题已删除');
          this.loadTopics?.();
        });
      } catch (error) {
        if (error !== 'cancel') {
          this.$message.error('操作失败: ' + error.message);
        }
      }
    }
  }
};
