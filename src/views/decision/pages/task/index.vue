<template>
  <basic-container>
    <!-- 面包屑导航 -->
    <decision-breadcrumb :breadcrumbs="['任务管理', '我发布的']" />

    <!-- 搜索表单 -->
    <div class="search-form-container">
      <el-form :model="searchParams" label-width="80px" size="small">
        <!-- 第一行搜索条件 -->
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
            <el-form-item label="任务状态:">
              <el-select
                v-model="searchParams.status"
                placeholder="请选择任务状态"
                clearable
              >
                <el-option label="进行中" value="in_progress" />
                <el-option label="已撤回" value="withdrawn" />
                <el-option label="待审批" value="pending" />
                <el-option label="已拒绝" value="rejected" />
                <el-option label="已完成" value="completed" />
              </el-select>
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

          <el-col :span="6" style="text-align: right;">
            <el-button type="primary" @click="handleSearch">查询</el-button>
          </el-col>
        </el-row>

        <!-- 第二行搜索条件 -->
        <el-row :gutter="20">
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
            <el-form-item label="配合科室:">
              <el-select
                v-model="searchParams.cooperateDept"
                placeholder="请选择执行科室"
                clearable
              >
                <el-option label="胸外科" value="dept1" />
                <el-option label="心内科" value="dept2" />
                <el-option label="神经外科" value="dept3" />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="4">
            <el-form-item label="配合人:">
              <el-input
                v-model="searchParams.cooperatePerson"
                placeholder="请输入"
                clearable
              />
            </el-form-item>
          </el-col>

          <el-col :span="5">
            <!-- Empty col for spacing -->
          </el-col>

          <el-col :span="6" style="text-align: right;">
            <!-- Buttons on right -->
          </el-col>
        </el-row>

        <!-- 高级搜索选项 -->
        <el-row v-if="showMoreSearch" :gutter="20">
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

        <!-- 控制按钮 -->
        <el-row style="text-align: right; margin-top: -10px;">
          <el-button @click="handleSearchReset">重置</el-button>
          <el-button type="text" @click="showMoreSearch = !showMoreSearch">
            {{ showMoreSearch ? '收起' : '更多查询条件>' }}
          </el-button>
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
      // 已撤回和已拒绝的任务可以重新发起
      return ['withdrawn', 'rejected'].includes(row.status);
    },

    canDelete(row) {
      // 草稿、已撤回、已拒绝的任务可以删除
      return ['draft', 'withdrawn', 'rejected'].includes(row.status);
    }
  }
};
</script>

<style scoped lang="scss">
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
    margin-top: 12px;

    .left-buttons {
      display: flex;
      gap: 8px;
    }

    .view-buttons {
      display: flex;
      gap: 8px;
    }
  }

  .selected-count {
    margin-left: 8px;
    font-size: 12px;
    color: #909399;
  }
}
</style>
