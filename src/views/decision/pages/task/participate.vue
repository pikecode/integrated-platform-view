<template>
  <basic-container>
    <!-- 面包屑导航 -->
    <decision-breadcrumb :breadcrumbs="['任务管理', '我参与的']" />

    <!-- 任务状态Tabs -->
    <el-tabs v-model="activeTab" @tab-click="handleTabChange" class="task-tabs">
      <el-tab-pane label="待反馈" name="pending_feedback" />
      <el-tab-pane label="待审批" name="pending_review" />
      <el-tab-pane label="已反馈" name="feedbacked" />
      <el-tab-pane label="已审批" name="reviewed" />
    </el-tabs>

    <!-- 主容器：左侧搜索+表格 + 右侧提示框 -->
    <div class="main-layout">
      <!-- 左侧：搜索和表格 -->
      <div class="left-section">
        <!-- 搜索表单 -->
        <div class="search-form-container">
          <el-form :model="searchParams" label-width="80px" size="small">
            <!-- 搜索条件 - 一行 -->
            <el-row :gutter="20">
              <el-col :span="4">
                <el-form-item label="任务名称:">
                  <el-input
                    v-model="searchParams.title"
                    placeholder="请输入"
                    clearable
                  />
                </el-form-item>
              </el-col>

              <el-col :span="5">
                <el-form-item label="执行科室:">
                  <el-select
                    v-model="searchParams.departments"
                    placeholder="请选择执行科室"
                    multiple
                    collapse-tags
                    clearable
                  >
                    <el-option label="胸外科" value="dept1" />
                    <el-option label="心内科" value="dept2" />
                    <el-option label="神经外科" value="dept3" />
                  </el-select>
                  <span v-if="searchParams.departments.length > 0" class="selected-count">
                    已选：{{ searchParams.departments.length }}
                  </span>
                </el-form-item>
              </el-col>

              <el-col :span="4">
                <el-form-item label="执行人:">
                  <el-input
                    v-model="searchParams.executor"
                    placeholder="请输入"
                    clearable
                  />
                </el-form-item>
              </el-col>

              <el-col :span="5">
                <el-form-item label="任务来源:">
                  <el-select
                    v-model="searchParams.source"
                    placeholder="请选择任务来源"
                    clearable
                  >
                    <el-option label="系统生成" value="system" />
                    <el-option label="手动创建" value="manual" />
                    <el-option label="导入" value="import" />
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="6">
                <!-- 操作按钮区 -->
                <div class="search-actions">
                  <div class="action-buttons">
                    <el-button type="primary" @click="handleSearch">查询</el-button>
                    <el-button @click="handleSearchReset">重置</el-button>
                  </div>
                  <div class="view-buttons">
                    <el-button
                      type="text"
                      size="small"
                      @click="showMoreSearch = !showMoreSearch"
                    >
                      {{ showMoreSearch ? '收起' : '更多查询条件>' }}
                    </el-button>
                  </div>
                </div>
              </el-col>
            </el-row>

            <!-- 高级搜索选项 -->
            <el-row v-if="showMoreSearch" :gutter="20" style="margin-top: 12px;">
              <el-col :span="4">
                <el-form-item label="创建时间:">
                  <el-date-picker
                    v-model="searchParams.createTimeRange"
                    type="daterange"
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="YYYY-MM-DD"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>

        <!-- avue-crud 表格 -->
        <avue-crud
          ref="crud"
          :option="taskOption"
          :data="data"
          v-model="form"
          v-model:page="page"
          :table-loading="loading"
          @on-load="onLoad"
        >
          <!-- 任务名称列 -->
          <template #title="{ row }">
            <el-link
              type="primary"
              @click="handleViewDetail(row.id)"
            >
              {{ row.title }}
            </el-link>
          </template>

          <!-- 任务状态列 -->
          <template #status="{ row }">
            <status-badge :status="row.status" type="task" />
          </template>

          <!-- 操作列 - 只显示查看详情和打印 -->
          <template #menu="{ row }">
            <el-button type="text" size="small" @click="handlePrint(row)">
              打印
            </el-button>
            <el-button type="text" size="small" @click="handleViewDetail(row.id)">
              查看详情
            </el-button>
          </template>
        </avue-crud>
      </div>

      <!-- 右侧：提示框 -->
      <div class="right-section">
        <div class="hint-box">
          <div class="hint-title">任务的接收反馈必须在<br />详情中进行</div>
          <div class="hint-content">
            <p>任务完成倒计时小于<br />24小时 红色显示</p>
          </div>
        </div>
      </div>
    </div>
  </basic-container>
</template>

<script>
import { mapGetters } from 'vuex';
import { taskOption } from '@/option/decision/task';
import DecisionBreadcrumb from '../../components/breadcrumb.vue';
import StatusBadge from '../../components/status-badge/index.vue';
import * as taskApi from '@/api/decision/task';

export default {
  name: 'TaskParticipate',
  components: {
    DecisionBreadcrumb,
    StatusBadge
  },
  data() {
    return {
      form: {},
      data: [],
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      loading: true,
      viewMode: 'list',
      showMoreSearch: false,
      activeTab: 'pending_feedback',
      searchParams: {
        title: '',
        departments: [],
        status: '',
        source: '',
        executor: '',
        cooperateDept: '',
        cooperatePerson: '',
        createTimeRange: null
      },
      // 我参与的任务数据 - 与我发布的数据略有不同
      mockTasks: [
        {
          id: 101,
          title: '汇报学生党支部资质资教学项',
          status: 'in_progress',
          tabStatus: 'pending_feedback',
          currentNode: '/',
          content: '关于口腔医学中心马长相担申请加入九三学社事宜.',
          dueDate: '2025-08-08 12:12:12',
          countdown: '3天20小时',
          department: 'dept1',
          assignee: '张明明',
          cooperateDept: 'dept2',
          cooperatePerson: '李五',
          createdAt: '2025-08-01 10:00',
          creatorName: '王五',
          source: 'system'
        },
        {
          id: 102,
          title: '关于正式任命xxx为胸外科副主任',
          status: 'pending',
          tabStatus: 'pending_review',
          currentNode: '/',
          content: '关于口腔医学中心马长相担申请加入九三学社事宜.',
          dueDate: '2025-08-08 12:12:12',
          countdown: '/',
          department: 'dept2',
          assignee: '王五',
          cooperateDept: 'dept3',
          cooperatePerson: '王六',
          createdAt: '2025-08-01 10:00',
          creatorName: '李四',
          source: 'manual'
        },
        {
          id: 103,
          title: '关于科研经费审批流程优化',
          status: 'completed',
          tabStatus: 'feedbacked',
          currentNode: 'node1',
          content: '需要完善科研经费审批流程.',
          dueDate: '2025-08-15 12:00',
          countdown: '/',
          department: 'dept1',
          assignee: '李四',
          cooperateDept: 'dept1',
          cooperatePerson: '张三',
          createdAt: '2025-08-02 10:00',
          creatorName: '李四',
          source: 'system'
        },
        {
          id: 104,
          title: '教师招聘计划制定',
          status: 'completed',
          tabStatus: 'reviewed',
          currentNode: '/',
          content: '制定本年度教师招聘计划.',
          dueDate: '2025-08-20 12:00',
          countdown: '5天15小时',
          department: 'dept3',
          assignee: '赵六',
          cooperateDept: 'dept2',
          cooperatePerson: '李五',
          createdAt: '2025-08-03 10:00',
          creatorName: '李四',
          source: 'system'
        },
        {
          id: 105,
          title: '学科建设评估工作',
          status: 'in_progress',
          tabStatus: 'pending_feedback',
          currentNode: '/',
          content: '开展学科建设评估工作.',
          dueDate: '2025-08-12 12:00',
          countdown: '/',
          department: 'dept1',
          assignee: '王五',
          cooperateDept: 'dept3',
          cooperatePerson: '赵七',
          createdAt: '2025-08-01 10:00',
          creatorName: '李四',
          source: 'system'
        }
      ]
    };
  },
  computed: {
    ...mapGetters(['permission', 'userInfo']),
    taskOption() {
      return taskOption(this);
    }
  },
  mounted() {
    this.onLoad(this.page);
  },
  methods: {
    handleTabChange() {
      // 切换Tab时重置搜索条件和分页
      this.page.currentPage = 1;
      this.onLoad(this.page);
    },

    onLoad(page, params = {}) {
      this.loading = true;

      let filtered = [...this.mockTasks];

      // 按标题搜索
      if (this.searchParams.title) {
        filtered = filtered.filter(t =>
          t.title.includes(this.searchParams.title)
        );
      }

      // 按状态筛选
      if (this.searchParams.status) {
        filtered = filtered.filter(t => t.status === this.searchParams.status);
      }

      // 按科室筛选
      if (this.searchParams.departments.length > 0) {
        filtered = filtered.filter(t =>
          this.searchParams.departments.includes(t.department)
        );
      }

      // 按来源筛选
      if (this.searchParams.source) {
        filtered = filtered.filter(t => t.source === this.searchParams.source);
      }

      // 按执行人筛选
      if (this.searchParams.executor) {
        filtered = filtered.filter(t =>
          (t.assignee || '').includes(this.searchParams.executor)
        );
      }

      // 按配合科室筛选
      if (this.searchParams.cooperateDept) {
        filtered = filtered.filter(t =>
          (t.cooperateDept || '') === this.searchParams.cooperateDept
        );
      }

      // 按配合人筛选
      if (this.searchParams.cooperatePerson) {
        filtered = filtered.filter(t =>
          (t.cooperatePerson || '').includes(this.searchParams.cooperatePerson)
        );
      }

      // 按Tab状态筛选
      const tabStatusMap = {
        pending_feedback: 'pending_feedback',    // 待反馈
        pending_review: 'pending_review',        // 待审批
        feedbacked: 'feedbacked',                // 已反馈
        reviewed: 'reviewed'                     // 已审批
      };

      const currentTabStatus = tabStatusMap[this.activeTab];
      if (currentTabStatus) {
        filtered = filtered.filter(t => t.tabStatus === currentTabStatus);
      }

      // 分页
      this.page.total = filtered.length;
      const startIndex = (page.currentPage - 1) * page.pageSize;
      this.data = filtered.slice(startIndex, startIndex + page.pageSize);

      this.loading = false;
    },

    handleSearch() {
      this.page.currentPage = 1;
      this.onLoad(this.page);
    },

    handleSearchReset() {
      this.searchParams = {
        title: '',
        departments: [],
        status: '',
        source: '',
        executor: '',
        cooperateDept: '',
        cooperatePerson: '',
        createTimeRange: null
      };
      this.handleSearch();
    },

    handlePrint(row) {
      this.$message.info('打印功能开发中');
    },

    handleViewDetail(id) {
      this.$router.push(`/decision/task/detail/${id}`);
    }
  }
};
</script>

<style scoped lang="scss">
.task-tabs {
  margin-bottom: 20px;
  background: white;
  padding: 0 16px;
  border-bottom: 1px solid #e8eaed;

  ::v-deep .el-tabs__nav {
    border-bottom: none;
  }

  ::v-deep .el-tabs__active-bar {
    background-color: #409eff;
  }
}

.main-layout {
  display: grid;
  grid-template-columns: 1fr 220px;
  gap: 20px;

  .left-section {
    flex: 1;
  }

  .right-section {
    .hint-box {
      background: #fce4ec;
      border-left: 3px solid #e91e63;
      padding: 16px;
      border-radius: 2px;
      position: sticky;
      top: 20px;

      .hint-title {
        color: #d81b60;
        font-weight: 500;
        font-size: 13px;
        line-height: 1.5;
        margin-bottom: 12px;
      }

      .hint-content {
        color: #d81b60;
        font-size: 12px;
        line-height: 1.5;

        p {
          margin: 0;
        }
      }
    }
  }
}

.search-form-container {
  background: #f9fafb;
  border: 1px solid #e8eaed;
  border-radius: 4px;
  padding: 16px;
  margin-bottom: 20px;

  .search-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;

    .action-buttons {
      display: flex;
      gap: 8px;

      .el-button {
        min-width: 70px;
      }
    }

    .view-buttons {
      flex-shrink: 0;
    }
  }

  .selected-count {
    margin-left: 8px;
    font-size: 12px;
    color: #909399;
  }
}

@media (max-width: 1200px) {
  .main-layout {
    grid-template-columns: 1fr;

    .right-section {
      .hint-box {
        position: static;
      }
    }
  }
}
</style>
