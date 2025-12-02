<template>
  <basic-container>
    <!-- 统计卡片 -->
    <el-row :gutter="20" class="statistics-row">
      <el-col :xs="24" :sm="12" :md="6">
        <div class="stat-card">
          <div class="stat-icon active">
            <i class="el-icon-document"></i>
          </div>
          <div class="stat-content">
            <div class="stat-label">进行中的议题</div>
            <div class="stat-value">{{ statistics.activeTopics || 0 }}</div>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <div class="stat-card">
          <div class="stat-icon voting">
            <i class="el-icon-question"></i>
          </div>
          <div class="stat-content">
            <div class="stat-label">投票中的议题</div>
            <div class="stat-value">{{ statistics.votingTopics || 0 }}</div>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <div class="stat-card">
          <div class="stat-icon pending">
            <i class="el-icon-circle-check"></i>
          </div>
          <div class="stat-content">
            <div class="stat-label">待处理的任务</div>
            <div class="stat-value">{{ statistics.pendingTasks || 0 }}</div>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <div class="stat-card">
          <div class="stat-icon progress">
            <i class="el-icon-s-management"></i>
          </div>
          <div class="stat-content">
            <div class="stat-label">进行中的任务</div>
            <div class="stat-value">{{ statistics.progressTasks || 0 }}</div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 快速操作 -->
    <el-row :gutter="20" class="quick-actions">
      <el-col :span="24">
        <div class="action-panel">
          <h3>快速操作</h3>
          <el-button type="primary" size="large" @click="goToTopics">
            <i class="el-icon-plus"></i> 发起议题
          </el-button>
          <el-button type="success" size="large" @click="goToTasks">
            <i class="el-icon-plus"></i> 创建任务
          </el-button>
          <el-button type="warning" size="large" @click="goToMyTasks">
            <i class="el-icon-document-copy"></i> 我的任务
          </el-button>
        </div>
      </el-col>
    </el-row>

    <!-- 最新议题 -->
    <el-row :gutter="20" class="content-row">
      <el-col :span="24">
        <h2>最新议题</h2>
        <el-empty v-if="recentTopics.length === 0" description="暂无议题" />
        <el-row :gutter="20" v-else>
          <el-col :xs="24" :sm="12" :md="8" v-for="topic in recentTopics" :key="topic.id">
            <topic-card
              :topic="topic"
              @start-vote="handleStartVote"
              @vote="handleVote"
              @delete="handleDeleteTopic"
            />
          </el-col>
        </el-row>
      </el-col>
    </el-row>

    <!-- 我的任务 -->
    <el-row :gutter="20" class="content-row">
      <el-col :span="24">
        <h2>我的任务</h2>
        <el-empty v-if="myTasks.length === 0" description="暂无任务" />
        <div v-else>
          <task-item
            v-for="task in myTasks"
            :key="task.id"
            :task="task"
            @delete="handleDeleteTask"
            @start="handleStartTask"
            @complete="handleCompleteTask"
          />
        </div>
      </el-col>
    </el-row>

    <!-- 投票对话框 -->
    <el-dialog title="提交投票" v-model="voteDialogVisible" width="400px">
      <el-radio-group v-model="voteForm.vote" size="large">
        <el-radio label="agree">赞成</el-radio>
        <el-radio label="disagree">反对</el-radio>
        <el-radio label="abstain">弃权</el-radio>
      </el-radio-group>
      <el-input
        v-model="voteForm.comment"
        type="textarea"
        placeholder="可选：添加投票意见"
        rows="3"
        style="margin-top: 15px"
      />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="voteDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitVote">提交</el-button>
        </span>
      </template>
    </el-dialog>
  </basic-container>
</template>

<script>
import { mapGetters } from 'vuex';
import TopicCard from '../components/topic-card/index.vue';
import TaskItem from '../components/task-item/index.vue';
import * as topicApi from '@/api/decision/topic';
import * as taskApi from '@/api/decision/task';
import topicMixin from '../mixins/topic';
import taskMixin from '../mixins/task';

export default {
  name: 'DecisionIndex',
  components: {
    TopicCard,
    TaskItem
  },
  mixins: [topicMixin, taskMixin],
  data() {
    return {
      statistics: {
        activeTopics: 0,
        votingTopics: 0,
        pendingTasks: 0,
        progressTasks: 0
      },
      recentTopics: [],
      myTasks: [],
      voteDialogVisible: false,
      currentVotingTopicId: null,
      voteForm: {
        vote: 'agree',
        comment: ''
      },
      loading: true
    };
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  mounted() {
    this.loadData();
  },
  methods: {
    async loadData() {
      this.loading = true;
      try {
        // 并发加载所有数据
        const [topicsRes, tasksRes, statsRes] = await Promise.all([
          topicApi.getList(1, 6, { status: 'active,voting' }),
          taskApi.getMyTasks(1, 5, {}),
          taskApi.getStatistics()
        ]);

        this.recentTopics = topicsRes.data?.records || [];
        this.myTasks = tasksRes.data?.records || [];
        this.statistics = statsRes.data || {};
      } catch (error) {
        this.$message.error('加载数据失败');
      } finally {
        this.loading = false;
      }
    },

    loadTopics() {
      this.loadData();
    },

    loadTasks() {
      this.loadData();
    },

    goToTopics() {
      this.$router.push('/decision/topic');
    },

    goToTasks() {
      this.$router.push('/decision/task');
    },

    goToMyTasks() {
      this.$router.push('/decision/task/my-tasks');
    },

    handleVote(topicId) {
      this.currentVotingTopicId = topicId;
      this.voteDialogVisible = true;
    },

    async submitVote() {
      if (!this.voteForm.vote) {
        this.$message.warning('请选择投票意见');
        return;
      }
      await this.submitVote(this.currentVotingTopicId, this.voteForm.vote);
      this.voteDialogVisible = false;
      this.voteForm = { vote: 'agree', comment: '' };
    },

    handleStartVote(topicId) {
      this.startVote(topicId);
    },

    handleDeleteTopic(topicId) {
      this.deleteTopic(topicId);
    },

    handleDeleteTask(taskId) {
      this.deleteTask(taskId);
    },

    handleStartTask(taskId) {
      // 实现任务开始逻辑
      this.$message.info('任务已开始');
      this.loadTasks();
    },

    handleCompleteTask(taskId) {
      this.markTaskComplete(taskId);
    }
  }
};
</script>

<style scoped lang="scss">
.statistics-row {
  margin-bottom: 30px;

  .stat-card {
    display: flex;
    align-items: center;
    padding: 20px;
    background: white;
    border-radius: 6px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
    transition: all 0.3s;

    &:hover {
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
      transform: translateY(-2px);
    }

    .stat-icon {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      color: white;
      margin-right: 15px;

      &.active {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }

      &.voting {
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      }

      &.pending {
        background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
      }

      &.progress {
        background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
      }
    }

    .stat-content {
      flex: 1;

      .stat-label {
        font-size: 12px;
        color: #909399;
        margin-bottom: 5px;
      }

      .stat-value {
        font-size: 28px;
        font-weight: 600;
        color: #303133;
      }
    }
  }
}

.quick-actions {
  margin-bottom: 30px;

  .action-panel {
    padding: 20px;
    background: white;
    border-radius: 6px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);

    h3 {
      margin: 0 0 15px 0;
      color: #303133;
    }

    button {
      margin-right: 10px;
      margin-bottom: 10px;
    }
  }
}

.content-row {
  margin-bottom: 30px;

  h2 {
    margin: 0 0 15px 0;
    font-size: 18px;
    color: #303133;
    font-weight: 600;
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
