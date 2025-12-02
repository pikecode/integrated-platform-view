<template>
  <el-card class="topic-card" shadow="hover">
    <template #header>
      <div class="card-header">
        <span class="title">{{ topic.title }}</span>
        <status-badge :status="topic.status" />
      </div>
    </template>

    <div class="card-content">
      <p class="description">{{ topic.description }}</p>

      <div class="topic-info">
        <div class="info-item">
          <span class="label">议题人:</span>
          <span class="value">{{ topic.creatorName }}</span>
        </div>
        <div class="info-item">
          <span class="label">发起时间:</span>
          <span class="value">{{ formatTime(topic.createTime) }}</span>
        </div>
        <div class="info-item">
          <span class="label">参与人数:</span>
          <span class="value">{{ topic.participantCount || 0 }}</span>
        </div>
      </div>

      <div v-if="topic.status === 'voting'" class="vote-progress">
        <span class="label">投票进度:</span>
        <el-progress :percentage="votePercentage" size="small" />
      </div>

      <div class="vote-result" v-if="topic.status === 'ended' || topic.status === 'voting'">
        <div class="vote-item">
          <span class="vote-label">赞成:</span>
          <span class="vote-count agree">{{ topic.voteAgree || 0 }}</span>
        </div>
        <div class="vote-item">
          <span class="vote-label">反对:</span>
          <span class="vote-count disagree">{{ topic.voteDisagree || 0 }}</span>
        </div>
        <div class="vote-item">
          <span class="vote-label">弃权:</span>
          <span class="vote-count abstain">{{ topic.voteAbstain || 0 }}</span>
        </div>
      </div>

      <div class="actions">
        <el-button
          v-if="topic.status === 'active'"
          type="primary"
          size="small"
          @click="handleStartVote"
        >
          发起投票
        </el-button>
        <el-button
          v-if="topic.status === 'voting'"
          type="warning"
          size="small"
          @click="handleVote"
        >
          我要投票
        </el-button>
        <el-button
          type="primary"
          size="small"
          @click="handleDetail"
        >
          查看详情
        </el-button>
        <el-button
          type="danger"
          size="small"
          @click="handleDelete"
          v-if="canDelete"
        >
          删除
        </el-button>
      </div>
    </div>
  </el-card>
</template>

<script>
import { mapGetters } from 'vuex';
import StatusBadge from '../status-badge/index.vue';
import { formatTime } from '../../utils/formatter';

export default {
  components: {
    StatusBadge
  },
  props: {
    topic: {
      type: Object,
      required: true
    },
    canDelete: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    votePercentage() {
      const total = (this.topic.voteAgree || 0) + (this.topic.voteDisagree || 0) + (this.topic.voteAbstain || 0);
      return total > 0 ? Math.round((this.topic.voteAgree || 0) / total * 100) : 0;
    }
  },
  methods: {
    formatTime,
    handleStartVote() {
      this.$emit('start-vote', this.topic.id);
    },
    handleVote() {
      this.$emit('vote', this.topic.id);
    },
    handleDetail() {
      this.$router.push(`/decision/topic/detail/${this.topic.id}`);
    },
    handleDelete() {
      this.$emit('delete', this.topic.id);
    }
  }
};
</script>

<style scoped lang="scss">
.topic-card {
  transition: all 0.3s;

  &:hover {
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.15);
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;

    .title {
      font-weight: 600;
      font-size: 16px;
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .card-content {
    .description {
      color: #606266;
      margin-bottom: 15px;
      line-height: 1.5;
      max-height: 60px;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .topic-info {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 10px;
      margin-bottom: 15px;
      font-size: 12px;

      .info-item {
        display: flex;
        gap: 5px;

        .label {
          color: #909399;
          font-weight: 500;
        }

        .value {
          color: #606266;
        }
      }
    }

    .vote-progress {
      margin-bottom: 15px;
      font-size: 12px;

      .label {
        color: #909399;
        margin-bottom: 5px;
        display: block;
      }
    }

    .vote-result {
      display: flex;
      gap: 15px;
      margin-bottom: 15px;
      padding: 10px 0;
      border-top: 1px solid #ebeef5;
      border-bottom: 1px solid #ebeef5;

      .vote-item {
        display: flex;
        align-items: center;
        gap: 5px;
        font-size: 12px;

        .vote-label {
          color: #909399;
        }

        .vote-count {
          font-weight: 600;
          font-size: 14px;

          &.agree {
            color: #67c26a;
          }

          &.disagree {
            color: #f56c6c;
          }

          &.abstain {
            color: #e6a23c;
          }
        }
      }
    }

    .actions {
      display: flex;
      gap: 5px;
      flex-wrap: wrap;

      button {
        flex: 1;
        min-width: 80px;
      }
    }
  }
}
</style>
