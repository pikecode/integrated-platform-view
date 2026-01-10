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
                :loading="loadingDepartments"
                style="width: 100%"
              >
                <el-option
                  v-for="item in departmentOptions"
                  :key="item.id"
                  :label="item.deptName"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <!-- 待反馈 tab 显示执行人 -->
          <el-col v-if="activeTab === 'pending_feedback'" :span="6">
            <el-form-item label="执行人:">
              <el-select
                v-model="searchParams.executor"
                placeholder="请选择执行人"
                clearable
                :loading="loadingPersons"
                style="width: 100%"
              >
                <el-option
                  v-for="item in personOptions"
                  :key="item.id"
                  :label="item.realName || item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <!-- 其他 tab 显示任务来源 -->
          <el-col v-if="activeTab !== 'pending_feedback'" :span="6">
            <el-form-item label="任务来源:">
              <el-select
                v-model="searchParams.source"
                placeholder="请选择"
                clearable
                :loading="loadingTaskSource"
                style="width: 100%"
              >
                <el-option
                  v-for="item in taskSourceOptions"
                  :key="item.id"
                  :label="item.dictValue"
                  :value="item.id"
                />
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
                :loading="loadingTaskSource"
                style="width: 100%"
              >
                <el-option
                  v-for="item in taskSourceOptions"
                  :key="item.id"
                  :label="item.dictValue"
                  :value="item.id"
                />
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
                  multiple
                  collapse-tags
                  clearable
                  :loading="loadingDepartments"
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in departmentOptions"
                    :key="item.id"
                    :label="item.deptName"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="配合人:">
                <el-select
                  v-model="searchParams.cooperatePerson"
                  placeholder="请选择配合人"
                  clearable
                  :loading="loadingPersons"
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in personOptions"
                    :key="item.id"
                    :label="item.realName || item.name"
                    :value="item.id"
                  />
                </el-select>
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
                  multiple
                  collapse-tags
                  clearable
                  :loading="loadingDepartments"
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in departmentOptions"
                    :key="item.id"
                    :label="item.deptName"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item label="执行人:">
                <el-select
                  v-model="searchParams.executor"
                  placeholder="请选择执行人"
                  clearable
                  :loading="loadingPersons"
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in personOptions"
                    :key="item.id"
                    :label="item.realName || item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item label="配合人:">
                <el-select
                  v-model="searchParams.cooperatePerson"
                  placeholder="请选择配合人"
                  clearable
                  :loading="loadingPersons"
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in personOptions"
                    :key="item.id"
                    :label="item.realName || item.name"
                    :value="item.id"
                  />
                </el-select>
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

      <!-- 操作列 -->
      <template #menu="{ row }">
        <el-button type="text" size="small" @click="handlePrint(row)">
          打印
        </el-button>
        <!-- 待审批标签页显示审批按钮 -->
        <el-button
          v-if="activeTab === 'pending_review'"
          type="text"
          size="small"
          style="color: #409eff"
          @click="handleApprove(row)"
        >
          审批
        </el-button>
        <el-button type="text" size="small" @click="handleViewDetail(row.id)">
          查看详情
        </el-button>
      </template>
    </avue-crud>

    <!-- 审批对话框 -->
    <approval-dialog
      v-model="showApprovalDialog"
      :task-data="currentApprovalTask"
      @submit="handleApprovalSubmit"
    />
  </basic-container>
</template>

<script>
import { mapGetters } from 'vuex';
import { taskOption } from '@/option/decision/task';
import DecisionBreadcrumb from '../../components/breadcrumb.vue';
import StatusBadge from '../../components/status-badge/index.vue';
import ApprovalDialog from './components/approval-dialog.vue';
import * as taskApi from '@/api/decision/task';

export default {
  name: 'TaskParticipate',
  components: {
    DecisionBreadcrumb,
    StatusBadge,
    ApprovalDialog
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
      loadingDepartments: false,
      loadingTaskSource: false,
      loadingPersons: false,
      viewMode: 'list',
      showMoreSearch: false,
      activeTab: 'pending_feedback',
      taskSourceOptions: [], // 任务来源选项
      departmentOptions: [], // 部门选项
      personOptions: [], // 人员选项
      searchParams: {
        title: '',
        departments: [],
        status: '',
        source: '',
        executor: '',
        cooperateDept: [],
        cooperatePerson: '',
        content: '',
        createTimeRange: null
      },
      showApprovalDialog: false,
      currentApprovalTask: {}
    };
  },
  computed: {
    ...mapGetters(['permission', 'userInfo']),
    taskOption() {
      return taskOption(this);
    }
  },
  mounted() {
    // 从 URL query 中恢复 tab 状态
    const tabFromQuery = this.$route.query.tab;
    if (tabFromQuery && ['pending_feedback', 'pending_review', 'feedbacked', 'reviewed'].includes(tabFromQuery)) {
      this.activeTab = tabFromQuery;
    }

    this.loadTaskSource();
    this.loadDepartments();
    this.loadPersons();
    this.onLoad(this.page);
  },
  methods: {
    // 加载部门列表
    loadDepartments() {
      this.loadingDepartments = true;

      // 从本地存储获取 tenantId，优先使用用户信息中的 tenantId
      let tenantId = '000000'; // 默认租户ID
      try {
        const userInfoStr = localStorage.getItem('saber-userInfo');
        if (userInfoStr) {
          const userInfo = JSON.parse(userInfoStr);
          if (userInfo.content && userInfo.content.tenantId) {
            tenantId = userInfo.content.tenantId;
            console.log('【部门列表】使用用户 tenantId:', tenantId);
          }
        }
      } catch (error) {
        console.warn('【部门列表】获取用户 tenantId 失败，使用默认值:', error);
      }

      taskApi.getDepartmentList(tenantId)
        .then(response => {
          console.log('【部门列表】API响应:', response);
          if (response.data && response.data.code === 200) {
            this.departmentOptions = response.data.data || [];
            console.log('【部门列表】选项数据:', this.departmentOptions);
          } else {
            const errorMsg = response.data?.msg || '加载部门列表失败';
            console.error('【部门列表】错误:', errorMsg);
            this.$message.error(errorMsg);
          }
        })
        .catch(error => {
          console.error('【部门列表】请求异常:', error);
          this.$message.error('加载部门列表失败，请检查网络连接');
        })
        .finally(() => {
          this.loadingDepartments = false;
        });
    },

    // 加载任务来源字典
    loadTaskSource() {
      this.loadingTaskSource = true;
      taskApi.getDictionary('oatask_rwly')
        .then(response => {
          console.log('【任务来源】API响应:', response);
          if (response.data && response.data.code === 200) {
            this.taskSourceOptions = response.data.data || [];
            console.log('【任务来源】选项数据:', this.taskSourceOptions);
          } else {
            const errorMsg = response.data?.msg || '加载任务来源失败';
            console.error('【任务来源】错误:', errorMsg);
            this.$message.error(errorMsg);
          }
        })
        .catch(error => {
          console.error('【任务来源】请求异常:', error);
          this.$message.error('加载任务来源失败，请检查网络连接');
        })
        .finally(() => {
          this.loadingTaskSource = false;
        });
    },

    // 加载人员列表
    loadPersons() {
      this.loadingPersons = true;

      // 从本地存储获取 deptId，优先使用用户信息中的 deptId
      let deptId = null;
      try {
        const userInfoStr = localStorage.getItem('saber-userInfo');
        if (userInfoStr) {
          const userInfo = JSON.parse(userInfoStr);
          if (userInfo.content && userInfo.content.deptId) {
            deptId = userInfo.content.deptId;
            console.log('【人员列表】使用用户 deptId:', deptId);
          } else if (userInfo.content && userInfo.content.dept_id) {
            deptId = userInfo.content.dept_id;
            console.log('【人员列表】使用用户 dept_id:', deptId);
          }
        }
      } catch (error) {
        console.warn('【人员列表】获取用户 deptId 失败:', error);
      }

      if (!deptId) {
        console.warn('【人员列表】未找到用户 deptId，跳过加载人员');
        this.loadingPersons = false;
        return;
      }

      taskApi.getDepartmentUsers(deptId)
        .then(response => {
          console.log('【人员列表】API响应:', response);
          if (response.data && response.data.code === 200) {
            const userList = response.data.data?.userList || response.data.data || [];
            this.personOptions = userList;
            console.log('【人员列表】选项数据:', this.personOptions);
          } else {
            const errorMsg = response.data?.msg || '加载人员列表失败';
            console.error('【人员列表】错误:', errorMsg);
            this.$message.error(errorMsg);
          }
        })
        .catch(error => {
          console.error('【人员列表】请求异常:', error);
          this.$message.error('加载人员列表失败，请检查网络连接');
        })
        .finally(() => {
          this.loadingPersons = false;
        });
    },

    handleTabChange(tab) {
      // 切换Tab时重置搜索条件和分页
      this.page.currentPage = 1;
      // 等待 activeTab 更新后再加载数据
      this.$nextTick(() => {
        this.onLoad(this.page);
      });
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
          requestData.execDeptIdList = this.searchParams.departments;
        }

        if (this.searchParams.executor) {
          requestData.executorId = this.searchParams.executor;
        }

        if (this.searchParams.source) {
          requestData.taskSourceId = this.searchParams.source;
        }

        if (this.searchParams.cooperateDept && this.searchParams.cooperateDept.length > 0) {
          requestData.coopDeptIdList = this.searchParams.cooperateDept;
        }

        if (this.searchParams.cooperatePerson) {
          requestData.cooperatorId = this.searchParams.cooperatePerson;
        }

        // 根据activeTab调用不同的API
        let res;
        switch (this.activeTab) {
          case 'pending_feedback':
            // 待反馈
            res = await taskApi.getFeedbackTaskPage(requestData);
            break;
          case 'feedbacked':
            // 已反馈
            res = await taskApi.getFeedbackDoneTaskPage(requestData);
            break;
          case 'pending_review':
            // 待审批
            res = await taskApi.getApprovalTaskPage(requestData);
            break;
          case 'reviewed':
            // 已审批
            res = await taskApi.getApprovalDoneTaskPage(requestData);
            break;
          default:
            res = await taskApi.getFeedbackTaskPage(requestData);
        }

        if (res.data && res.data.code === 200) {
          const records = res.data.data.records || [];
          this.data = records;
          this.page.total = res.data.data.total || 0;
        } else {
          // API 返回失败或为空
          this.data = [];
          this.page.total = 0;
        }
      } catch (error) {
        console.error('加载任务失败：', error);
        // 出现异常时
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
        cooperateDept: [],
        cooperatePerson: '',
        content: '',
        createTimeRange: null
      };
      this.handleSearch();
    },

    handlePrint(row) {
      this.$message.info('打印功能开发中');
    },

    handleApprove(row) {
      this.currentApprovalTask = row;
      this.showApprovalDialog = true;
    },

    handleApprovalSubmit(approvalData) {
      console.log('审批数据：', approvalData);

      // 调用审批接口
      taskApi.approveTask(approvalData)
        .then(response => {
          console.log('审批接口响应：', response);
          if (response.data && response.data.code === 200 && response.data.success) {
            const statusText = approvalData.approvalStatus === '11' ? '同意' : '拒绝';
            this.$message.success(`任务审批${statusText}成功`);
            // 刷新列表
            this.onLoad(this.page);
          } else {
            const errorMsg = response.data?.msg || '审批失败';
            this.$message.error(errorMsg);
          }
        })
        .catch(error => {
          console.error('审批接口请求异常：', error);
          this.$message.error('审批失败，请检查网络连接');
        });
    },

    handleViewDetail(id) {
      // 根据不同的tab，跳转时携带不同的from参数
      if (this.activeTab === 'pending_feedback') {
        this.$router.push({
          path: `/decision/task/detail/${id}`,
          query: { from: 'participate_pending_feedback' }
        });
      } else if (this.activeTab === 'pending_review') {
        this.$router.push({
          path: `/decision/task/detail/${id}`,
          query: { from: 'participate_pending_review' }
        });
      } else {
        this.$router.push(`/decision/task/detail/${id}`);
      }
    },
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

::v-deep .basic-container {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 100px);
  overflow: hidden;
}

.task-tabs {
  flex-shrink: 0;
  margin-bottom: 0;
}

.search-form-container {
  flex-shrink: 0;
  margin-bottom: 16px;
}

::v-deep .avue-crud {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  margin: 0;

  .el-card {
    display: flex;
    flex-direction: column;
    flex: 1;
    margin: 0;
    border-radius: 4px;

    .el-card__body {
      display: flex;
      flex-direction: column;
      flex: 1;
      overflow: hidden;
      padding: 0;

      .el-table {
        flex: 1;
      }

      .el-table__wrapper {
        flex: 1;
        overflow: auto;
      }
    }
  }

  .el-table {
    flex: 1;
  }

  .el-pagination {
    flex-shrink: 0;
    padding: 12px 0;
  }
}
</style>
