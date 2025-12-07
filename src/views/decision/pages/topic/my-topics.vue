<template>
  <div class="my-topics-page">
    <!-- 面包屑导航 -->
    <decision-breadcrumb :breadcrumbs="['议题管理', '我发布的']" />

    <!-- Tab 标签切换 -->
    <div class="topic-tabs">
      <el-tabs v-model="activeTab" @tab-change="handleTabChange">
        <el-tab-pane label="议题决策" name="all">
          <template #label>
            <span class="tab-label">议题决策</span>
          </template>
        </el-tab-pane>
        <el-tab-pane label="议题管理" name="managing">
          <template #label>
            <span class="tab-label">议题管理</span>
          </template>
        </el-tab-pane>
        <el-tab-pane label="我发布的" name="my">
          <template #label>
            <span class="tab-label active-tab">我发布的</span>
          </template>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 搜索和过滤区域 -->
    <div class="search-section">
      <div class="search-title">
        <span class="highlight">选择议题/选择议题，再点击批量上会、微选择议题时点击批量申</span>
        <span class="highlight-text">请上会，需要提示 请选择议题！</span>
      </div>

      <el-form :model="searchForm" class="search-form" label-width="100px">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="6">
            <el-form-item label="议题名称：">
              <el-input
                v-model="searchForm.title"
                placeholder="请输入"
                clearable
                @keyup.enter="handleSearch"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6">
            <el-form-item label="议题状态：">
              <el-select
                v-model="searchForm.status"
                placeholder="请选择议题状态（可多选）"
                clearable
                style="width: 100%"
              >
                <el-option label="议题申请中" value="draft" />
                <el-option label="待上会" value="pending_vote" />
                <el-option label="上会申请中" value="applying" />
                <el-option label="已申请上会" value="approved" />
                <el-option label="结论审批中" value="voting" />
                <el-option label="结论录入完成" value="completed" />
                <el-option label="已撤回" value="withdrawn" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6">
            <el-form-item label="申报时间：">
              <el-date-picker
                v-model="searchForm.dateRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="6" class="action-buttons">
            <el-button type="primary" @click="handleSearch">查询</el-button>
            <el-button @click="handleReset">重置</el-button>
          </el-col>
        </el-row>
      </el-form>

      <!-- 批量操作按钮 -->
      <el-row :gutter="10" class="batch-actions">
        <el-col :span="24">
          <el-button type="primary" @click="handleCreateTopic">
            <i class="el-icon-plus"></i> 新增议题
          </el-button>
          <el-button type="warning" @click="handleBatchApply" :disabled="selectedTopics.length === 0">
            批量申请上会
          </el-button>
          <el-button @click="handleExport">导出</el-button>
          <span class="selection-info" v-if="selectedTopics.length > 0">
            已选择 {{ selectedTopics.length }} 条议题
          </span>
        </el-col>
      </el-row>
    </div>

    <!-- 议题列表表格 -->
    <div class="table-section">
      <el-table
        :data="topics"
        stripe
        border
        style="width: 100%"
        :loading="loading"
        @selection-change="handleSelectionChange"
        v-loading="loading"
      >
        <!-- 复选框列 -->
        <el-table-column type="selection" width="50" />

        <!-- 序号列 -->
        <el-table-column label="序号" type="index" width="60" :index="getRowNumber" />

        <!-- 议题名称 -->
        <el-table-column label="议题名称" min-width="200">
          <template slot-scope="scope">
            <el-link type="primary" @click="handleViewDetail(scope.row.id)">
              {{ scope.row.title }}
            </el-link>
          </template>
        </el-table-column>

        <!-- 议题状态 -->
        <el-table-column label="议题状态" width="120">
          <template slot-scope="scope">
            <status-badge :status="scope.row.status" type="topic" />
          </template>
        </el-table-column>

        <!-- 当前审批节点 -->
        <el-table-column label="当前审批节点" width="150">
          <template slot-scope="scope">
            <span>{{ getApprovalNode(scope.row.status) }}</span>
          </template>
        </el-table-column>

        <!-- 申报科室 -->
        <el-table-column label="申报科室" width="120">
          <template slot-scope="scope">
            {{ scope.row.department || '胸外科' }}
          </template>
        </el-table-column>

        <!-- 科室分管领导 -->
        <el-table-column label="科室分管领导" width="120">
          <template slot-scope="scope">
            {{ scope.row.leader || '张三' }}
          </template>
        </el-table-column>

        <!-- 申请时间 -->
        <el-table-column label="申请时间" width="180">
          <template slot-scope="scope">
            {{ formatTime(scope.row.createdAt) }}
          </template>
        </el-table-column>

        <!-- 操作 -->
        <el-table-column label="操作" width="200" fixed="right">
          <template slot-scope="scope">
            <el-button-group>
              <el-button type="primary" size="small" @click="handleViewDetail(scope.row.id)">
                查看详情
              </el-button>
              <el-dropdown @command="handleCommand($event, scope.row)">
                <el-button type="primary" size="small">
                  更多 <i class="el-icon-arrow-down"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="edit" v-if="canEdit(scope.row)">编辑</el-dropdown-item>
                  <el-dropdown-item command="apply" v-if="canApply(scope.row)">申请上会</el-dropdown-item>
                  <el-dropdown-item command="vote" v-if="canVote(scope.row)">投票</el-dropdown-item>
                  <el-dropdown-item command="withdraw" v-if="canWithdraw(scope.row)">撤回</el-dropdown-item>
                  <el-dropdown-item command="delete" v-if="canDelete(scope.row)">删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        v-if="total > 0"
        :current-page="page.currentPage"
        :page-size="page.pageSize"
        :total="total"
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
        :page-sizes="[5, 10, 15, 20]"
        layout="total, sizes, prev, pager, next, jumper"
        style="margin-top: 20px; text-align: right"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import DecisionBreadcrumb from '../../components/breadcrumb.vue';
import StatusBadge from '../../components/status-badge/index.vue';
import * as topicApi from '@/api/decision/topic';
import topicMixin from '../../mixins/topic';

export default {
  name: 'MyTopics',
  components: {
    DecisionBreadcrumb,
    StatusBadge
  },
  mixins: [topicMixin],
  data() {
    return {
      activeTab: 'my',
      topics: [],
      selectedTopics: [],
      searchForm: {
        title: '',
        status: '',
        dateRange: null
      },
      page: {
        currentPage: 1,
        pageSize: 10
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
        // 加载我发布的议题
        const res = await topicApi.getList(
          this.page.currentPage,
          this.page.pageSize,
          { ...this.searchForm, createdBy: this.userInfo.id }
        );
        this.topics = res.data?.records || [];
        this.total = res.data?.total || 0;
      } catch (error) {
        this.$message.error('加载议题失败');
      } finally {
        this.loading = false;
      }
    },

    handleTabChange(tabName) {
      this.activeTab = tabName;
      // 根据不同的 Tab 切换页面
      switch (tabName) {
        case 'all':
          this.$router.push('/decision/topic');
          break;
        case 'managing':
          this.$router.push('/decision/topic?filter=managing');
          break;
        case 'my':
          this.$router.push('/decision/topic?filter=my');
          break;
        default:
          break;
      }
    },

    handleSearch() {
      this.page.currentPage = 1;
      this.loadTopics();
    },

    handleReset() {
      this.searchForm = {
        title: '',
        status: '',
        dateRange: null
      };
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

    handleSelectionChange(selection) {
      this.selectedTopics = selection;
    },

    getRowNumber(index) {
      return (this.page.currentPage - 1) * this.page.pageSize + index + 1;
    },

    formatTime(time) {
      if (!time) return '-';
      return new Date(time).toLocaleString('zh-CN');
    },

    getApprovalNode(status) {
      const nodeMap = {
        'draft': '议题草稿',
        'pending_vote': '待审批',
        'applying': '申请中',
        'approved': '已审批',
        'voting': '投票中',
        'completed': '已完成',
        'withdrawn': '已撤回'
      };
      return nodeMap[status] || '未知';
    },

    handleCreateTopic() {
      this.$router.push('/decision/topic/create');
    },

    handleViewDetail(topicId) {
      this.$router.push(`/decision/topic/detail/${topicId}`);
    },

    handleBatchApply() {
      if (this.selectedTopics.length === 0) {
        this.$message.warning('请先选择议题');
        return;
      }
      this.$message.success(`已选择 ${this.selectedTopics.length} 个议题，批量申请上会`);
    },

    handleExport() {
      this.$message.info('导出功能开发中');
    },

    handleCommand(command, row) {
      switch (command) {
        case 'edit':
          this.$router.push(`/decision/topic/detail/${row.id}`);
          break;
        case 'apply':
          this.$message.success('已申请上会');
          break;
        case 'vote':
          this.$router.push(`/decision/topic/vote/${row.id}`);
          break;
        case 'withdraw':
          this.handleWithdraw(row.id);
          break;
        case 'delete':
          this.handleDelete(row.id);
          break;
        default:
          break;
      }
    },

    handleDelete(topicId) {
      this.$confirm('确定删除此议题吗？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          await topicApi.remove(topicId);
          this.$message.success('删除成功');
          this.loadTopics();
        } catch (error) {
          this.$message.error('删除失败');
        }
      }).catch(() => {
        // 用户取消删除
      });
    },

    handleWithdraw(topicId) {
      this.$confirm('确定撤回此议题吗？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message.success('已撤回');
        this.loadTopics();
      }).catch(() => {
        // 用户取消撤回
      });
    },

    canEdit(row) {
      return row.status === 'draft' || row.creator === this.userInfo.name;
    },

    canApply(row) {
      return row.status === 'draft' || row.status === 'pending_vote';
    },

    canVote(row) {
      return row.status === 'voting';
    },

    canWithdraw(row) {
      return ['draft', 'pending_vote', 'applying'].includes(row.status);
    },

    canDelete(row) {
      return row.status === 'draft' || row.creator === this.userInfo.name;
    }
  }
};
</script>

<style scoped lang="scss">
.my-topics-page {
  background: white;
  border-radius: 6px;
  padding: 24px;

  .topic-tabs {
    margin-bottom: 20px;
    border-bottom: 1px solid #ebeef5;

    ::v-deep .el-tabs__header {
      margin: 0;
      padding: 0;
    }

    ::v-deep .el-tabs__nav-wrap {
      &::after {
        display: none;
      }
    }

    ::v-deep .el-tabs__item {
      padding: 0 20px;
      height: 50px;
      line-height: 50px;
      font-size: 14px;
      color: #606266;

      &.is-active {
        color: #667eea;
      }

      .tab-label {
        &.active-tab {
          color: #667eea;
          font-weight: 600;
        }
      }
    }

    ::v-deep .el-tabs__active-bar {
      background-color: #667eea;
    }
  }

  .search-section {
    background: white;
    border-radius: 6px;
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);

    .search-title {
      margin-bottom: 15px;
      padding: 10px;
      background: #fff3cd;
      border-left: 4px solid #ffc107;
      border-radius: 4px;
      font-size: 12px;
      color: #856404;

      .highlight {
        color: #ff6b6b;
        font-weight: bold;
      }

      .highlight-text {
        margin-left: 10px;
        color: #ff6b6b;
        font-weight: bold;
      }
    }

    .search-form {
      margin-bottom: 15px;

      ::v-deep .el-form-item {
        margin-bottom: 10px;
      }

      .action-buttons {
        display: flex;
        align-items: center;

        .el-button {
          width: 100%;

          &:not(:last-child) {
            margin-right: 10px;
          }
        }
      }
    }

    .batch-actions {
      padding: 10px 0;
      border-top: 1px solid #dcdfe6;

      .el-button {
        margin-right: 10px;

        &:disabled {
          opacity: 0.6;
        }
      }

      .selection-info {
        color: #909399;
        margin-left: 10px;
      }
    }
  }

  .table-section {
    ::v-deep .el-table {
      font-size: 13px;

      .el-table__header-wrapper {
        background: #f5f7fa;
      }

      .el-table__body-wrapper {
        max-height: none;
      }

      .el-table__row:hover > td {
        background-color: #f5f7fa;
      }

      .el-button-group {
        .el-button {
          padding: 5px 10px;
          font-size: 12px;
          height: 28px;
          line-height: 28px;
        }
      }
    }

    ::v-deep .el-pagination {
      margin-top: 20px;
      text-align: right;

      .btn-prev,
      .btn-next,
      .el-pager li,
      .el-icon,
      .el-input {
        font-size: 12px;
      }
    }
  }
}
</style>
