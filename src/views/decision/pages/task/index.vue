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
                style="width: 100%"
              >
                <el-option label="胸外科" value="dept1" />
                <el-option label="心内科" value="dept2" />
                <el-option label="神经外科" value="dept3" />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="任务状态:">
              <el-select
                v-model="searchParams.status"
                placeholder="请选择"
                clearable
                style="width: 100%"
              >
                <el-option label="进行中" value="in_progress" />
                <el-option label="已撤回" value="withdrawn" />
                <el-option label="待审批" value="pending" />
                <el-option label="已拒绝" value="rejected" />
                <el-option label="已完成" value="completed" />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="6">
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
        </el-row>

        <!-- 高级搜索选项（展开时显示） -->
        <el-row v-if="showMoreSearch" :gutter="20" class="more-search-row">
          <el-col :span="8">
            <el-form-item label="执行人:">
              <el-input
                v-model="searchParams.executor"
                placeholder="请输入执行人"
                clearable
              />
            </el-form-item>
          </el-col>

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
  </basic-container>
</template>

<script>
import { mapGetters } from 'vuex';
import { taskOption } from '@/option/decision/task';
import DecisionBreadcrumb from '../../components/breadcrumb.vue';
import StatusBadge from '../../components/status-badge/index.vue';
import * as taskApi from '@/api/decision/task';

export default {
  name: 'TaskManagement',
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
    this.onLoad(this.page);
  },
  methods: {
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

        if (this.searchParams.status) {
          requestData.taskStatus = this.searchParams.status;
        }

        if (this.searchParams.departments && this.searchParams.departments.length > 0) {
          requestData.executeDeptIds = this.searchParams.departments;
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
        status: '',
        source: '',
        executor: '',
        cooperateDept: '',
        cooperatePerson: '',
        createTimeRange: null
      };
      this.handleSearch();
    },

    handleCreateTask() {
      this.$router.push('/decision/task/create');
    },

    handleRestart(row) {
      // 打开创建对话框，预填充数据
      this.$router.push({
        path: '/decision/task/create',
        query: { restartFrom: row.id }
      });
    },

    handlePrint(row) {
      this.$message.info('打印功能开发中');
    },

    handleViewDetail(id) {
      this.$router.push(`/decision/task/detail/${id}`);
    },

    handleDelete(row) {
      this.$confirm('确定删除此任务吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 从模拟数据中删除
        this.mockTasks = this.mockTasks.filter(t => t.id !== row.id);
        this.$message.success('删除成功');
        this.onLoad(this.page);
      }).catch(() => {});
    },

    canRestart(row) {
      // 使用API返回的canRecall标志
      return row.canRecall === true;
    },

    canDelete(row) {
      // 使用API返回的canDel标志
      return row.canDel === true;
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
</style>
