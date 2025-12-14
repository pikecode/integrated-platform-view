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

    <!-- 搜索表单 -->
    <div class="search-form-container">
      <el-form :model="searchParams" label-width="90px" size="small">
        <!-- 第一行搜索条件 -->
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="任务名称:">
              <el-input
                v-model="searchParams.title"
                placeholder="请输入任务名称"
                clearable
              />
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="执行科室:">
              <el-select
                v-model="searchParams.departments"
                placeholder="请选择"
                multiple
                collapse-tags
                clearable
                style="width: 100%"
              >
                <el-option label="胸外科" value="dept1" />
                <el-option label="心内科" value="dept2" />
                <el-option label="神经外科" value="dept3" />
              </el-select>
            </el-form-item>
          </el-col>

          <!-- 待反馈 tab 显示执行人 -->
          <el-col v-if="activeTab === 'pending_feedback'" :span="6">
            <el-form-item label="执行人:">
              <el-input
                v-model="searchParams.executor"
                placeholder="请输入执行人"
                clearable
              />
            </el-form-item>
          </el-col>

          <!-- 其他 tab 显示任务来源 -->
          <el-col v-if="activeTab !== 'pending_feedback'" :span="6">
            <el-form-item label="任务来源:">
              <el-select
                v-model="searchParams.source"
                placeholder="请选择"
                clearable
                style="width: 100%"
              >
                <el-option label="系统生成" value="system" />
                <el-option label="手动创建" value="manual" />
                <el-option label="导入" value="import" />
              </el-select>
            </el-form-item>
          </el-col>

          <!-- 待反馈 tab 显示任务来源 -->
          <el-col v-if="activeTab === 'pending_feedback'" :span="6">
            <el-form-item label="任务来源:">
              <el-select
                v-model="searchParams.source"
                placeholder="请选择"
                clearable
                style="width: 100%"
              >
                <el-option label="系统生成" value="system" />
                <el-option label="手动创建" value="manual" />
                <el-option label="导入" value="import" />
              </el-select>
            </el-form-item>
          </el-col>

          <!-- 其他 tab 显示任务内容 -->
          <el-col v-if="activeTab !== 'pending_feedback'" :span="6">
            <el-form-item label="任务内容:">
              <el-input
                v-model="searchParams.content"
                placeholder="请输入任务内容"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 高级搜索选项（展开时显示） -->
        <el-row v-if="showMoreSearch" :gutter="20" class="more-search-row">
          <!-- 待反馈 tab 的更多条件 -->
          <template v-if="activeTab === 'pending_feedback'">
            <el-col :span="8">
              <el-form-item label="配合科室:">
                <el-select
                  v-model="searchParams.cooperateDept"
                  placeholder="请选择"
                  clearable
                  style="width: 100%"
                >
                  <el-option label="胸外科" value="dept1" />
                  <el-option label="心内科" value="dept2" />
                  <el-option label="神经外科" value="dept3" />
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="配合人:">
                <el-input
                  v-model="searchParams.cooperatePerson"
                  placeholder="请输入配合人"
                  clearable
                />
              </el-form-item>
            </el-col>
          </template>

          <!-- 其他 tab 的更多条件 -->
          <template v-else>
            <el-col :span="6">
              <el-form-item label="配合科室:">
                <el-select
                  v-model="searchParams.cooperateDept"
                  placeholder="请选择"
                  clearable
                  style="width: 100%"
                >
                  <el-option label="胸外科" value="dept1" />
                  <el-option label="心内科" value="dept2" />
                  <el-option label="神经外科" value="dept3" />
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item label="执行人:">
                <el-input
                  v-model="searchParams.executor"
                  placeholder="请输入执行人"
                  clearable
                />
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item label="配合人:">
                <el-input
                  v-model="searchParams.cooperatePerson"
                  placeholder="请输入配合人"
                  clearable
                />
              </el-form-item>
            </el-col>
          </template>
        </el-row>

        <!-- 按钮区域 -->
        <el-row :gutter="20">
          <el-col :span="24">
            <div class="search-buttons-row">
              <el-button type="primary" @click="handleSearch">查询</el-button>
              <el-button @click="handleSearchReset">重置</el-button>
              <el-button
                type="text"
                @click="showMoreSearch = !showMoreSearch"
                class="more-btn"
              >
                {{ showMoreSearch ? '收起' : '更多' }}
                <i :class="showMoreSearch ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
              </el-button>
            </div>
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
        content: '',
        createTimeRange: null
      }
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

    async onLoad(page, params = {}) {
      this.loading = true;
      try {
        // 构建API请求参数
        const requestData = {
          current: page.currentPage,
          size: page.pageSize
        };

        // 添加搜索条件
        if (this.searchParams.title) {
          requestData.taskName = this.searchParams.title;
        }

        if (this.searchParams.departments && this.searchParams.departments.length > 0) {
          requestData.executeDeptIds = this.searchParams.departments;
        }

        if (this.searchParams.status) {
          requestData.taskStatus = this.searchParams.status;
        }

        if (this.searchParams.source) {
          requestData.taskSource = this.searchParams.source;
        }

        if (this.searchParams.executor) {
          requestData.executorName = this.searchParams.executor;
        }

        if (this.searchParams.cooperateDept) {
          requestData.cooperateDeptId = this.searchParams.cooperateDept;
        }

        if (this.searchParams.cooperatePerson) {
          requestData.cooperatePersonName = this.searchParams.cooperatePerson;
        }

        if (this.searchParams.content) {
          requestData.taskContent = this.searchParams.content;
        }

        if (this.searchParams.createTimeRange && this.searchParams.createTimeRange.length === 2) {
          requestData.createTimeStart = this.$dayjs(this.searchParams.createTimeRange[0]).format('YYYY-MM-DD');
          requestData.createTimeEnd = this.$dayjs(this.searchParams.createTimeRange[1]).format('YYYY-MM-DD');
        }

        // 根据activeTab调用不同的API
        let res;
        if (this.activeTab === 'feedbacked') {
          // 已反馈 - 使用 feedbackdone 接口
          res = await taskApi.getFeedbackDoneTaskPage(requestData);
        } else {
          // 待反馈、待审批、已审批 - 都使用 feedback 接口
          res = await taskApi.getFeedbackTaskPage(requestData);
        }

        if (res.data && res.data.code === 200) {
          this.data = res.data.data.records || [];
          this.page.total = res.data.data.total || 0;
        } else {
          this.$message.error(res.data.msg || '加载任务失败');
          this.data = [];
          this.page.total = 0;
        }
      } catch (error) {
        console.error('加载任务失败：', error);
        this.$message.error('加载任务失败');
        this.data = [];
        this.page.total = 0;
      } finally {
        this.loading = false;
      }
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
        content: '',
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

  ::v-deep .el-tabs__nav {
    border-bottom: none;
  }

  ::v-deep .el-tabs__active-bar {
    background-color: #409eff;
  }
}

.search-form-container {
  background: #f9fafb;
  border-radius: 4px;
  padding: 16px;
  margin-bottom: 20px;

  ::v-deep .el-form {
    .el-form-item {
      margin-bottom: 8px;
    }

    .el-row:last-child {
      .el-form-item {
        margin-bottom: 0;
      }
    }
  }

  .search-buttons-row {
    display: flex;
    gap: 8px;
    align-items: center;
    justify-content: flex-end;
    padding-top: 4px;

    .el-button {
      &:not(.more-btn) {
        min-width: 70px;
      }
    }

    .more-btn {
      margin-left: 4px;
      padding: 8px 4px;

      i {
        margin-left: 2px;
        font-size: 12px;
      }
    }
  }

  .more-search-row {
    padding-top: 4px;
    margin-top: 4px;
    animation: slideDown 0.3s ease-out;
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
