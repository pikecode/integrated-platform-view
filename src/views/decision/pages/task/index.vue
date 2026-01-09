<template>
  <basic-container>
    <!-- 面包屑导航 -->
    <decision-breadcrumb :breadcrumbs="['任务管理', '我发布的']" />

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

          <el-col :span="6">
            <el-form-item label="任务状态:">
              <el-select
                v-model="searchParams.status"
                placeholder="请选择"
                multiple
                collapse-tags
                clearable
                :loading="loadingTaskStatus"
                style="width: 100%"
              >
                <el-option
                  v-for="item in taskStatusOptions"
                  :key="item.id"
                  :label="item.dictValue"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="6">
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
        </el-row>

        <!-- 高级搜索选项（展开时显示） -->
        <el-row v-if="showMoreSearch" :gutter="20" class="more-search-row">
          <el-col :span="8">
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
      <!-- 工具栏 - 发起任务按钮 -->
      <template #menu-left>
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="handleCreateTask"
        >
          发起任务
        </el-button>
      </template>

      <!-- 任务名称列 -->
      <template #taskName="{ row }">
        <el-link
          type="primary"
          @click="handleViewDetail(row.id)"
        >
          {{ row.taskName }}
        </el-link>
      </template>

      <!-- 任务状态列 -->
      <template #taskStatusName="{ row }">
        <status-badge :status="row.taskStatus" type="task" />
      </template>

      <!-- 操作列 -->
      <template #menu="{ row }">
        <el-button type="text" size="small" @click="handlePrint(row)">
          打印
        </el-button>
        <el-button type="text" size="small" @click="handleViewDetail(row.id)">
          查看详情
        </el-button>
        <el-button
          v-if="canRestart(row)"
          type="text"
          size="small"
          @click="handleRestart(row)"
        >
          重新发起
        </el-button>
        <el-button
          v-if="canDelete(row)"
          type="text"
          size="small"
          style="color: #f56c6c"
          @click="handleDelete(row)"
        >
          删除
        </el-button>
      </template>
    </avue-crud>

    <!-- 发起任务对话框 -->
    <create-task-dialog
      ref="createTaskDialog"
      v-model="showCreateTaskDialog"
      @submit="handleTaskSubmit"
    />
  </basic-container>
</template>

<script>
import { mapGetters } from 'vuex';
import { taskOption } from '@/option/decision/task';
import DecisionBreadcrumb from '../../components/breadcrumb.vue';
import StatusBadge from '../../components/status-badge/index.vue';
import CreateTaskDialog from './components/create-task-dialog.vue';
import * as taskApi from '@/api/decision/task';

export default {
  name: 'TaskManagement',
  components: {
    DecisionBreadcrumb,
    StatusBadge,
    CreateTaskDialog
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
      loadingTaskStatus: false,
      loadingTaskSource: false,
      loadingDepartments: false,
      loadingPersons: false,
      viewMode: 'list',
      showMoreSearch: false,
      showCreateTaskDialog: false,
      taskStatusOptions: [], // 任务状态选项
      taskSourceOptions: [], // 任务来源选项
      departmentOptions: [], // 部门选项
      personOptions: [], // 人员选项
      searchParams: {
        title: '',
        departments: [],
        status: [],
        source: '',
        executor: '',
        cooperateDept: [],
        cooperatePerson: '',
        createTimeRange: null
      },
      mockTasks: [
        {
          id: 1,
          title: '汇报学生党支部资质资教学项',
          status: 'in_progress',
          currentNode: '/',
          content: '关于口腔医学中心马长相担申请加入九三学社事宜.',
          dueDate: '2025-08-08 12:00',
          countdown: '3天20小时',
          department: 'dept1',
          assignee: '张明明',
          cooperateDept: 'dept2',
          cooperatePerson: '李五',
          createdAt: '2025-08-01 10:00',
          creatorName: '李四',
          source: 'system'
        },
        {
          id: 2,
          title: '关于正式任命xxx为胸外科副主任',
          status: 'withdrawn',
          currentNode: '/',
          content: '关于口腔医学中心马长相担申请加入九三学社事宜.',
          dueDate: '2025-08-08 12:00',
          countdown: '/',
          department: 'dept1',
          assignee: '张三',
          cooperateDept: 'dept3',
          cooperatePerson: '王六',
          createdAt: '2025-08-01 10:00',
          creatorName: '李四',
          source: 'manual'
        },
        {
          id: 3,
          title: '汇报学生党支部资质资教学项',
          status: 'pending',
          currentNode: 'node1',
          content: '关于口腔医学中心马长相担申请加入九三学社事宜.',
          dueDate: '2025-08-08 12:00',
          countdown: '/',
          department: 'dept2',
          assignee: '王五',
          cooperateDept: 'dept1',
          cooperatePerson: '张三',
          createdAt: '2025-08-01 10:00',
          creatorName: '李四',
          source: 'system'
        },
        {
          id: 4,
          title: '关于正式任命xxx为胸外科副主任',
          status: 'rejected',
          currentNode: '/',
          content: '关于口腔医学中心马长相担申请加入九三学社事宜.',
          dueDate: '2025-08-08 12:00',
          countdown: '3天20小时',
          department: 'dept1',
          assignee: '张三',
          cooperateDept: 'dept2',
          cooperatePerson: '赵七',
          createdAt: '2025-08-01 10:00',
          creatorName: '李四',
          source: 'import'
        },
        {
          id: 5,
          title: '关于正式任命xxx为胸外科副主任',
          status: 'completed',
          currentNode: '/',
          content: '关于口腔医学中心马长相担申请加入九三学社事宜.',
          dueDate: '2025-08-08 12:00',
          countdown: '/',
          department: 'dept3',
          assignee: '赵六',
          cooperateDept: 'dept1',
          cooperatePerson: '李二',
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
    this.loadTaskStatus();
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

    // 加载任务状态字典
    loadTaskStatus() {
      this.loadingTaskStatus = true;
      taskApi.getDictionary('oatask-rwbq')
        .then(response => {
          console.log('【任务状态】API响应:', response);
          if (response.data && response.data.code === 200) {
            this.taskStatusOptions = response.data.data || [];
            console.log('【任务状态】选项数据:', this.taskStatusOptions);
          } else {
            const errorMsg = response.data?.msg || '加载任务状态失败';
            console.error('【任务状态】错误:', errorMsg);
            this.$message.error(errorMsg);
          }
        })
        .catch(error => {
          console.error('【任务状态】请求异常:', error);
          this.$message.error('加载任务状态失败，请检查网络连接');
        })
        .finally(() => {
          this.loadingTaskStatus = false;
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

    async onLoad(page, params = {}) {
      this.loading = true;
      try {
        // 构建API请求参数
        const requestData = {
          current: page.currentPage,
          size: page.pageSize
        };

        // 添加搜索条件（根据实际API参数调整）
        if (this.searchParams.title) {
          requestData.taskName = this.searchParams.title;
        }

        if (this.searchParams.status && this.searchParams.status.length > 0) {
          requestData.taskStatusList = this.searchParams.status;
        }

        if (this.searchParams.departments && this.searchParams.departments.length > 0) {
          requestData.execDeptIdList = this.searchParams.departments;
        }

        if (this.searchParams.source) {
          requestData.taskSourceId = this.searchParams.source;
        }

        if (this.searchParams.executor) {
          requestData.executorid = this.searchParams.executor;
        }

        if (this.searchParams.cooperateDept && this.searchParams.cooperateDept.length > 0) {
          requestData.coopDeptIdList = this.searchParams.cooperateDept;
        }

        if (this.searchParams.cooperatePerson) {
          requestData.cooperatorId = this.searchParams.cooperatePerson;
        }

        if (this.searchParams.createTimeRange && this.searchParams.createTimeRange.length === 2) {
          requestData.createTimeStart = this.$dayjs(this.searchParams.createTimeRange[0]).format('YYYY-MM-DD');
          requestData.createTimeEnd = this.$dayjs(this.searchParams.createTimeRange[1]).format('YYYY-MM-DD');
        }

        // 调用API
        const res = await taskApi.getTaskPage(requestData);

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
        status: [],
        source: '',
        executor: '',
        cooperateDept: [],
        cooperatePerson: '',
        createTimeRange: null
      };
      this.handleSearch();
    },

    handleCreateTask() {
      this.showCreateTaskDialog = true;
    },

    handleTaskSubmit(taskData) {
      // 任务提交成功后刷新列表
      console.log('任务提交：', taskData);
      this.onLoad(this.page);
    },

    handleRestart(row) {
      // 调用详情 API 获取任务数据
      taskApi.getTaskDetail(row.id)
        .then(response => {
          console.log('【任务详情】API响应:', response);
          if (response.data && response.data.code === 200) {
            const taskDetail = response.data.data;
            console.log('【任务详情】详情数据:', taskDetail);

            // 存储任务数据，打开对话框后由 watch 处理
            this.$refs.createTaskDialog.pendingTaskDetail = taskDetail;
            this.showCreateTaskDialog = true;
          } else {
            const errorMsg = response.data?.msg || '获取任务详情失败';
            console.error('【任务详情】错误:', errorMsg);
            this.$message.error(errorMsg);
          }
        })
        .catch(error => {
          console.error('【任务详情】请求异常:', error);
          let errorMsg = '获取任务详情失败';

          if (!error.response) {
            errorMsg = '无法连接到服务器，请检查网络';
          } else {
            const status = error.response.status;
            switch (status) {
              case 401:
                errorMsg = '认证失败，请检查登录状态';
                break;
              case 403:
                errorMsg = '没有权限访问此任务';
                break;
              case 404:
                errorMsg = '任务不存在';
                break;
              case 500:
                errorMsg = '服务器错误，请稍后重试';
                break;
              default:
                errorMsg = `请求失败 (HTTP ${status})`;
            }
          }

          this.$message.error(errorMsg);
        });
    },

    handlePrint(row) {
      this.$message.info('打印功能开发中');
    },

    handleViewDetail(id) {
      this.$router.push({
        path: `/decision/task/detail/${id}`,
        query: { from: 'task_published' }
      });
    },

    handleDelete(row) {
      this.$confirm('确定删除此任务吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 调用删除 API
        taskApi.deleteTask(row.id)
          .then(response => {
            console.log('【任务删除】API响应:', response);
            if (response.data && response.data.code === 200) {
              this.$message.success('删除成功');
              this.onLoad(this.page);
            } else {
              const errorMsg = response.data?.msg || '删除任务失败';
              console.error('【任务删除】错误:', errorMsg);
              this.$message.error(errorMsg);
            }
          })
          .catch(error => {
            console.error('【任务删除】请求异常:', error);
            let errorMsg = '删除任务失败';

            if (!error.response) {
              errorMsg = '无法连接到服务器，请检查网络';
            } else {
              const status = error.response.status;
              switch (status) {
                case 401:
                  errorMsg = '认证失败，请检查登录状态';
                  break;
                case 403:
                  errorMsg = '没有权限删除此任务';
                  break;
                case 404:
                  errorMsg = '任务不存在';
                  break;
                case 500:
                  errorMsg = '服务器错误，请稍后重试';
                  break;
                default:
                  errorMsg = `请求失败 (HTTP ${status})`;
              }
            }

            this.$message.error(errorMsg);
          });
      }).catch(() => {});
    },

    canRestart(row) {
      return row.canRecall;
    },

    canDelete(row) {
      return row.canDel;
    }
  }
};
</script>

<style scoped lang="scss">
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
  height: 100%;
  overflow: hidden;
}

.search-form-container {
  flex-shrink: 0;
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
}
</style>
