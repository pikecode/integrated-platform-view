<template>
  <basic-container>
    <!-- 面包屑导航 -->
    <decision-breadcrumb :breadcrumbs="['任务管理', '我发布的']" />

    <!-- 搜索和操作栏 -->
    <el-row :gutter="20" class="search-row">
      <el-col :xs="24" :sm="12" :md="8">
        <el-input
          v-model="search.title"
          placeholder="搜索任务标题"
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
          <el-option label="待处理" value="pending" />
          <el-option label="已分配" value="assigned" />
          <el-option label="进行中" value="in_progress" />
          <el-option label="已完成" value="completed" />
          <el-option label="逾期" value="overdue" />
        </el-select>
      </el-col>
      <el-col :xs="24" :sm="24" :md="8">
        <el-button type="primary" @click="handleSearch">搜索</el-button>
        <el-button type="success" @click="handleCreate" v-if="permission.decision_task_add">
          <i class="el-icon-plus"></i> 新建任务
        </el-button>
      </el-col>
    </el-row>

    <!-- 任务列表 -->
    <el-empty v-if="tasks.length === 0" description="暂无任务" />
    <div v-else>
      <task-item
        v-for="task in tasks"
        :key="task.id"
        :task="task"
        @delete="handleDelete"
        @start="handleStart"
        @complete="handleComplete"
      />
    </div>

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
import DecisionBreadcrumb from '../../components/breadcrumb.vue';
import TaskItem from '../../components/task-item/index.vue';
import * as taskApi from '@/api/decision/task';
import taskMixin from '../../mixins/task';

export default {
  name: 'TaskManagement',
  components: {
    DecisionBreadcrumb,
    TaskItem
  },
  mixins: [taskMixin],
  data() {
    return {
      tasks: [],
      search: {
        title: '',
        status: ''
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
    this.loadTasks();
  },
  methods: {
    async loadTasks() {
      this.loading = true;
      try {
        const res = await taskApi.getList(
          this.page.currentPage,
          this.page.pageSize,
          this.search
        );
        this.tasks = res.data?.records || [];
        this.total = res.data?.total || 0;
      } catch (error) {
        this.$message.error('加载任务失败');
      } finally {
        this.loading = false;
      }
    },

    handleSearch() {
      this.page.currentPage = 1;
      this.loadTasks();
    },

    handlePageChange(page) {
      this.page.currentPage = page;
      this.loadTasks();
    },

    handleSizeChange(size) {
      this.page.pageSize = size;
      this.page.currentPage = 1;
      this.loadTasks();
    },

    handleCreate() {
      this.$router.push('/decision/task/create');
    },

    handleDelete(taskId) {
      this.deleteTask(taskId);
    },

    async handleStart(taskId) {
      try {
        this.$confirm('确定开始此任务？', '提示', { type: 'info' }).then(async () => {
          // 这里可以调用更新任务状态的 API
          this.$message.success('任务已开始');
          this.loadTasks();
        });
      } catch (error) {
        if (error !== 'cancel') {
          this.$message.error('操作失败');
        }
      }
    },

    handleComplete(taskId) {
      this.markTaskComplete(taskId);
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
</style>
