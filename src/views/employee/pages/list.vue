<template>
  <basic-container>
    <!-- 搜索和操作栏 -->
    <el-row :gutter="20" class="search-row">
      <el-col :xs="24" :sm="12" :md="8">
        <el-input
          v-model="search.name"
          placeholder="搜索员工姓名"
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
          <el-option label="在职" value="active" />
          <el-option label="待入职" value="pending" />
          <el-option label="离职" value="left" />
          <el-option label="停用" value="inactive" />
        </el-select>
      </el-col>
      <el-col :xs="24" :sm="24" :md="8">
        <el-button type="primary" @click="handleSearch">
          <i class="el-icon-search"></i> 搜索
        </el-button>
        <el-button type="success" @click="createEmployee">
          <i class="el-icon-plus"></i> 新建员工
        </el-button>
      </el-col>
    </el-row>

    <!-- 员工列表表格 -->
    <el-table
      :data="employees"
      stripe
      style="width: 100%; margin-top: 20px"
    >
      <el-table-column prop="id" label="员工ID" width="120" />
      <el-table-column prop="name" label="员工姓名" width="120" />
      <el-table-column prop="department" label="所属部门" width="150" />
      <el-table-column prop="position" label="职位" width="150" />
      <el-table-column prop="phone" label="联系电话" width="120" />
      <el-table-column prop="email" label="邮箱" width="200" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)">
            {{ getStatusLabel(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template #default="{ row }">
          <el-button type="text" size="small" @click="editEmployee(row.id)">编辑</el-button>
          <el-divider direction="vertical"></el-divider>
          <el-button type="text" size="small" @click="deleteEmployee(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 空状态 -->
    <el-empty v-if="employees.length === 0" description="暂无员工数据" style="margin-top: 40px" />

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
import * as employeeApi from '@/api/employee';
import mixin from '../mixins';

export default {
  name: 'EmployeeList',
  mixins: [mixin],
  data() {
    return {
      employees: [],
      search: {
        name: '',
        status: '',
      },
      page: {
        currentPage: 1,
        pageSize: 10,
      },
      total: 0,
      loading: false,
    };
  },
  mounted() {
    this.loadEmployees();
  },
  methods: {
    async loadEmployees() {
      this.loading = true;
      try {
        // 开发阶段：使用模拟数据
        // 实际开发中应该调用真实 API
        this.mockLoadEmployees();
      } catch (error) {
        this.$message.error('加载员工列表失败');
      } finally {
        this.loading = false;
      }
    },

    mockLoadEmployees() {
      // 模拟员工数据
      const mockData = [
        {
          id: 'E001',
          name: '张三',
          department: '技术部',
          position: '前端工程师',
          phone: '13800138000',
          email: 'zhangsan@example.com',
          status: 'active',
          createTime: '2024-12-02',
        },
        {
          id: 'E002',
          name: '李四',
          department: '产品部',
          position: '产品经理',
          phone: '13800138001',
          email: 'lisi@example.com',
          status: 'active',
          createTime: '2024-12-01',
        },
        {
          id: 'E003',
          name: '王五',
          department: '设计部',
          position: 'UI设计师',
          phone: '13800138002',
          email: 'wangwu@example.com',
          status: 'pending',
          createTime: '2024-11-30',
        },
        {
          id: 'E004',
          name: '赵六',
          department: '技术部',
          position: '后端工程师',
          phone: '13800138003',
          email: 'zhaoliu@example.com',
          status: 'active',
          createTime: '2024-11-29',
        },
        {
          id: 'E005',
          name: '孙七',
          department: '销售部',
          position: '销售经理',
          phone: '13800138004',
          email: 'sunqi@example.com',
          status: 'left',
          createTime: '2024-11-28',
        },
      ];

      // 模拟搜索过滤
      let filtered = mockData;
      if (this.search.name) {
        filtered = filtered.filter(e => e.name.includes(this.search.name));
      }
      if (this.search.status) {
        filtered = filtered.filter(e => e.status === this.search.status);
      }

      this.total = filtered.length;

      // 模拟分页
      const start = (this.page.currentPage - 1) * this.page.pageSize;
      const end = start + this.page.pageSize;
      this.employees = filtered.slice(start, end);
    },

    handleSearch() {
      this.page.currentPage = 1;
      this.loadEmployees();
    },

    handlePageChange(page) {
      this.page.currentPage = page;
      this.loadEmployees();
    },

    handleSizeChange(size) {
      this.page.pageSize = size;
      this.page.currentPage = 1;
      this.loadEmployees();
    },

    getStatusType(status) {
      const typeMap = {
        active: 'success',
        pending: 'warning',
        left: 'info',
        inactive: 'danger',
      };
      return typeMap[status] || 'info';
    },

    getStatusLabel(status) {
      const labelMap = {
        active: '在职',
        pending: '待入职',
        left: '离职',
        inactive: '停用',
      };
      return labelMap[status] || status;
    },
  },
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
