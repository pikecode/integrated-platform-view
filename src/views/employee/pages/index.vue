<template>
  <basic-container>
    <div class="dashboard">
      <!-- 统计卡片 -->
      <el-row :gutter="20" class="stat-row">
        <el-col :xs="24" :sm="12" :md="6">
          <div class="stat-card">
            <div class="stat-title">总员工数</div>
            <div class="stat-value">{{ stats.totalEmployee }}</div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6">
          <div class="stat-card">
            <div class="stat-title">在职员工</div>
            <div class="stat-value">{{ stats.activeEmployee }}</div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6">
          <div class="stat-card">
            <div class="stat-title">离职员工</div>
            <div class="stat-value">{{ stats.leftEmployee }}</div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6">
          <div class="stat-card">
            <div class="stat-title">待入职</div>
            <div class="stat-value">{{ stats.pendingEmployee }}</div>
          </div>
        </el-col>
      </el-row>

      <!-- 快速操作按钮 -->
      <el-row :gutter="20" class="action-row">
        <el-col :xs="24" :sm="12" :md="6">
          <el-button
            type="primary"
            size="large"
            block
            @click="goToList"
          >
            <i class="el-icon-document"></i> 查看员工列表
          </el-button>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6">
          <el-button
            type="success"
            size="large"
            block
            @click="createEmployee"
          >
            <i class="el-icon-plus"></i> 新增员工
          </el-button>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6">
          <el-button
            type="info"
            size="large"
            block
            @click="handleImport"
          >
            <i class="el-icon-upload"></i> 导入员工
          </el-button>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6">
          <el-button
            type="warning"
            size="large"
            block
            @click="handleExport"
          >
            <i class="el-icon-download"></i> 导出员工
          </el-button>
        </el-col>
      </el-row>

      <!-- 最近新增员工列表 -->
      <el-card class="recent-card">
        <template #header>
          <div class="card-header">
            <span>最近新增员工 (前5条)</span>
            <el-button type="text" size="small" @click="goToList">查看更多 →</el-button>
          </div>
        </template>

        <el-table :data="recentEmployees" stripe>
          <el-table-column prop="id" label="员工ID" width="150"></el-table-column>
          <el-table-column prop="name" label="员工姓名" width="150"></el-table-column>
          <el-table-column prop="department" label="所属部门" width="150"></el-table-column>
          <el-table-column prop="position" label="职位" width="150"></el-table-column>
          <el-table-column prop="status" label="状态">
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

        <el-empty v-if="recentEmployees.length === 0" description="暂无数据" />
      </el-card>
    </div>

    <!-- 隐藏的文件上传输入框 -->
    <input
      ref="fileInput"
      type="file"
      accept=".xlsx,.xls,.csv"
      style="display: none"
      @change="handleFileSelect"
    />
  </basic-container>
</template>

<script>
import * as employeeApi from '@/api/employee';
import mixin from '../mixins';

export default {
  name: 'EmployeeDashboard',
  mixins: [mixin],
  data() {
    return {
      stats: {
        totalEmployee: 0,
        activeEmployee: 0,
        leftEmployee: 0,
        pendingEmployee: 0,
      },
      recentEmployees: [],
    };
  },
  mounted() {
    this.loadData();
  },
  methods: {
    async loadData() {
      try {
        // 模拟数据 - 开发阶段使用
        this.stats = {
          totalEmployee: 156,
          activeEmployee: 142,
          leftEmployee: 10,
          pendingEmployee: 4,
        };

        // 模拟最近员工数据
        this.recentEmployees = [
          {
            id: 'E001',
            name: '张三',
            department: '技术部',
            position: '前端工程师',
            status: 'active',
            createTime: '2024-12-02',
          },
          {
            id: 'E002',
            name: '李四',
            department: '产品部',
            position: '产品经理',
            status: 'active',
            createTime: '2024-12-01',
          },
          {
            id: 'E003',
            name: '王五',
            department: '设计部',
            position: 'UI设计师',
            status: 'pending',
            createTime: '2024-11-30',
          },
        ];
      } catch (error) {
        this.$message.error('加载数据失败');
      }
    },

    goToList() {
      this.$router.push('/employee/list');
    },

    handleImport() {
      this.$refs.fileInput.click();
    },

    async handleFileSelect(event) {
      const file = event.target.files[0];
      if (!file) return;

      try {
        this.$message.info('文件上传中...');
        const formData = new FormData();
        formData.append('file', file);

        await employeeApi.importEmployee(formData);
        this.$message.success('导入成功');
        this.loadData();
      } catch (error) {
        this.$message.error('导入失败');
      } finally {
        this.$refs.fileInput.value = '';
      }
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
.dashboard {
  .stat-row {
    margin-bottom: 20px;

    .stat-card {
      background: white;
      padding: 20px;
      border-radius: 6px;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
      text-align: center;

      .stat-title {
        font-size: 14px;
        color: #909399;
        margin-bottom: 10px;
      }

      .stat-value {
        font-size: 28px;
        font-weight: bold;
        color: #303133;
      }
    }
  }

  .action-row {
    margin-bottom: 20px;
  }

  .recent-card {
    margin-top: 20px;

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
}
</style>
