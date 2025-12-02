<template>
  <basic-container>
    <!-- 搜索和操作栏 -->
    <el-row :gutter="20" class="search-row">
      <el-col :xs="24" :sm="12" :md="8">
        <el-input
          v-model="search.title"
          placeholder="搜索议题标题"
          clearable
          @keyup.enter="handleSearch"
        />
      </el-col>
      <el-col :xs="24" :sm="12" :md="8">
        <el-select
          v-model="search.status"
          placeholder="选择状态"
          clearable
          style="width: 100%"
        >
          <el-option label="草稿" value="draft" />
          <el-option label="进行中" value="active" />
          <el-option label="投票中" value="voting" />
          <el-option label="已结束" value="ended" />
          <el-option label="已存档" value="archived" />
        </el-select>
      </el-col>
      <el-col :xs="24" :sm="24" :md="8">
        <el-button type="primary" @click="handleSearch">搜索</el-button>
        <el-button type="success" @click="handleCreate" v-if="permission.decision_topic_add">
          <i class="el-icon-plus"></i> 新建议题
        </el-button>
      </el-col>
    </el-row>

    <!-- 议题卡片列表 -->
    <el-empty v-if="topics.length === 0" description="暂无议题" />
    <el-row :gutter="20" v-else class="topics-grid">
      <el-col :xs="24" :sm="12" :md="8" v-for="topic in topics" :key="topic.id">
        <topic-card
          :topic="topic"
          :can-delete="canDeleteTopic(topic)"
          @start-vote="handleStartVote"
          @vote="handleVote"
          @delete="handleDelete"
        />
      </el-col>
    </el-row>

    <!-- 分页 -->
    <el-pagination
      v-if="total > 0"
      :current-page="page.currentPage"
      :page-size="page.pageSize"
      :total="total"
      @current-change="handlePageChange"
      @size-change="handleSizeChange"
      layout="total, sizes, prev, pager, next, jumper"
      style="margin-top: 20px; text-align: right"
    />
  </basic-container>
</template>

<script>
import { mapGetters } from 'vuex';
import TopicCard from '../../components/topic-card/index.vue';
import * as topicApi from '@/api/decision/topic';
import topicMixin from '../../mixins/topic';

export default {
  name: 'TopicManagement',
  components: {
    TopicCard
  },
  mixins: [topicMixin],
  data() {
    return {
      topics: [],
      search: {
        title: '',
        status: ''
      },
      page: {
        currentPage: 1,
        pageSize: 12
      },
      total: 0,
      loading: true
    };
  },
  computed: {
    ...mapGetters(['permission', 'userInfo'])
  },
  mounted() {
    this.loadTopics();
  },
  methods: {
    async loadTopics() {
      this.loading = true;
      try {
        const res = await topicApi.getList(
          this.page.currentPage,
          this.page.pageSize,
          this.search
        );
        this.topics = res.data?.records || [];
        this.total = res.data?.total || 0;
      } catch (error) {
        this.$message.error('加载议题失败');
      } finally {
        this.loading = false;
      }
    },

    handleSearch() {
      this.page.currentPage = 1;
      this.loadTopics();
    },

    handlePageChange(page) {
      this.page.currentPage = page;
      this.loadTopics();
    },

    handleSizeChange(size) {
      this.page.pageSize = size;
      this.page.currentPage = 1;
      this.loadTopics();
    },

    handleCreate() {
      this.$router.push('/decision/topic/create');
    },

    handleStartVote(topicId) {
      this.startVote(topicId);
    },

    handleVote(topicId) {
      this.$router.push(`/decision/topic/vote/${topicId}`);
    },

    handleDelete(topicId) {
      this.deleteTopic(topicId);
    },

    canDeleteTopic(topic) {
      // 只有草稿状态的议题才能删除，或者是创建者
      return (topic.status === 'draft') || (topic.creatorId === this.userInfo.id);
    }
  }
};
</script>

<style scoped lang="scss">
.search-row {
  margin-bottom: 20px;
  padding: 15px;
  background: white;
  border-radius: 6px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

.topics-grid {
  margin-bottom: 20px;
}
</style>
