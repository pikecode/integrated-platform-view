<template>
  <div class="schedule-page">
    <!-- 面包屑导航 -->
    <decision-breadcrumb :breadcrumbs="['议题管理', '议程安排']" />

    <!-- 操作按钮区 -->
    <div class="action-bar">
      <el-button type="primary" @click="handleAddSchedule">
        <i class="el-icon-plus"></i> 新增议程
      </el-button>
      <el-button @click="handleExport">导出</el-button>
    </div>

    <!-- 议程日历视图 -->
    <div class="schedule-container">
      <!-- 左侧月历 -->
      <div class="calendar-panel">
        <el-date-picker
          v-model="selectedDate"
          type="month"
          placeholder="选择日期"
          @change="handleDateChange"
          style="width: 100%"
        />
        <div class="legend">
          <div class="legend-item">
            <span class="legend-icon" style="background: #f0ad4e;"></span>
            <span>待审批</span>
          </div>
          <div class="legend-item">
            <span class="legend-icon" style="background: #5cb85c;"></span>
            <span>已通过</span>
          </div>
          <div class="legend-item">
            <span class="legend-icon" style="background: #d9534f;"></span>
            <span>已拒绝</span>
          </div>
          <div class="legend-item">
            <span class="legend-icon" style="background: #0275d8;"></span>
            <span>进行中</span>
          </div>
        </div>
      </div>

      <!-- 右侧议程列表 -->
      <div class="schedule-list">
        <!-- 搜索过滤 -->
        <div class="filter-section">
          <el-form :model="filterForm" class="filter-form" label-width="80px">
            <el-row :gutter="20">
              <el-col :xs="24" :sm="12" :md="8">
                <el-form-item label="议题名称：">
                  <el-input
                    v-model="filterForm.title"
                    placeholder="请输入"
                    clearable
                    @keyup.enter="handleSearch"
                  />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8">
                <el-form-item label="议程状态：">
                  <el-select
                    v-model="filterForm.status"
                    placeholder="请选择"
                    clearable
                    style="width: 100%"
                  >
                    <el-option label="待审批" value="pending" />
                    <el-option label="已通过" value="approved" />
                    <el-option label="已拒绝" value="rejected" />
                    <el-option label="进行中" value="ongoing" />
                    <el-option label="已结束" value="ended" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8">
                <el-form-item label="日期范围：">
                  <el-date-picker
                    v-model="filterForm.dateRange"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="24" class="filter-buttons">
                <el-button type="primary" @click="handleSearch">查询</el-button>
                <el-button @click="handleReset">重置</el-button>
              </el-col>
            </el-row>
          </el-form>
        </div>

        <!-- 议程卡片列表 -->
        <div class="schedule-cards">
          <div
            v-if="schedules.length > 0"
            v-for="schedule in schedules"
            :key="schedule.id"
            class="schedule-card"
            :class="`status-${schedule.status}`"
          >
            <div class="card-header">
              <div class="schedule-title">
                <span class="schedule-date">{{ formatDate(schedule.startTime) }}</span>
                <span class="schedule-time">{{ formatTime(schedule.startTime) }} - {{ formatTime(schedule.endTime) }}</span>
              </div>
              <div class="status-badge">
                <el-tag
                  :type="getStatusType(schedule.status)"
                  effect="dark"
                  size="small"
                >
                  {{ getStatusLabel(schedule.status) }}
                </el-tag>
              </div>
            </div>

            <div class="card-body">
              <div class="topic-item" v-for="topic in schedule.topics" :key="topic.id">
                <div class="topic-info">
                  <el-link type="primary" @click="handleViewTopic(topic.id)">
                    {{ topic.title }}
                  </el-link>
                  <span class="topic-dept">{{ topic.department }}</span>
                </div>
                <span class="topic-status">{{ topic.status }}</span>
              </div>
            </div>

            <div class="card-footer">
              <span class="location">{{ schedule.location || '待定' }}</span>
              <div class="card-actions">
                <el-button type="primary" size="small" @click="handleEditSchedule(schedule.id)">
                  编辑
                </el-button>
                <el-button type="danger" size="small" @click="handleDeleteSchedule(schedule.id)">
                  删除
                </el-button>
              </div>
            </div>
          </div>

          <!-- 空状态 -->
          <div v-else class="empty-state">
            <i class="el-icon-document-copy"></i>
            <p>暂无议程安排</p>
          </div>
        </div>

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
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import DecisionBreadcrumb from '../../components/breadcrumb.vue';
import * as topicApi from '@/api/decision/topic';

export default {
  name: 'TopicSchedule',
  components: {
    DecisionBreadcrumb
  },
  data() {
    return {
      selectedDate: new Date(),
      filterForm: {
        title: '',
        status: '',
        dateRange: null
      },
      schedules: [],
      page: {
        currentPage: 1,
        pageSize: 10
      },
      total: 0,
      loading: false,
      // Mock schedule data
      mockSchedules: [
        {
          id: '1',
          startTime: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 14, 0),
          endTime: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 16, 30),
          status: 'pending',
          location: '会议室A',
          topics: [
            { id: '1', title: '医院绩效评估体系改革', department: '胸外科', status: '待审批' },
            { id: '2', title: '新增医疗设备购置方案', department: '放射科', status: '待审批' }
          ]
        },
        {
          id: '2',
          startTime: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 2, 10, 0),
          endTime: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 2, 12, 0),
          status: 'approved',
          location: '会议室B',
          topics: [
            { id: '3', title: '护理人员培训计划', department: '护理部', status: '已通过' }
          ]
        },
        {
          id: '3',
          startTime: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 5, 15, 0),
          endTime: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 5, 17, 0),
          status: 'ongoing',
          location: '会议室C',
          topics: [
            { id: '4', title: '医院信息系统升级方案', department: '信息部', status: '进行中' },
            { id: '5', title: '防疫应急预案制定', department: '感控部', status: '进行中' }
          ]
        },
        {
          id: '4',
          startTime: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 8, 9, 0),
          endTime: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 8, 11, 30),
          status: 'rejected',
          location: '线上会议',
          topics: [
            { id: '6', title: '药房改革方案', department: '药学部', status: '已拒绝' }
          ]
        }
      ]
    };
  },
  computed: {
    ...mapGetters(['permission', 'userInfo'])
  },
  mounted() {
    this.loadSchedules();
  },
  methods: {
    loadSchedules() {
      this.loading = true;
      try {
        // Use mock data for now
        this.schedules = this.mockSchedules;
        this.total = this.mockSchedules.length;
      } finally {
        this.loading = false;
      }
    },

    handleDateChange(date) {
      this.page.currentPage = 1;
      this.loadSchedules();
    },

    handleSearch() {
      this.page.currentPage = 1;
      // Filter by search form
      let filtered = this.mockSchedules;

      if (this.filterForm.title) {
        filtered = filtered.filter(schedule =>
          schedule.topics.some(topic => topic.title.includes(this.filterForm.title))
        );
      }

      if (this.filterForm.status) {
        filtered = filtered.filter(schedule => schedule.status === this.filterForm.status);
      }

      if (this.filterForm.dateRange && this.filterForm.dateRange.length === 2) {
        const [start, end] = this.filterForm.dateRange;
        filtered = filtered.filter(schedule => {
          const scheduleDate = new Date(schedule.startTime);
          return scheduleDate >= start && scheduleDate <= end;
        });
      }

      this.schedules = filtered;
      this.total = filtered.length;
    },

    handleReset() {
      this.filterForm = {
        title: '',
        status: '',
        dateRange: null
      };
      this.page.currentPage = 1;
      this.loadSchedules();
    },

    handlePageChange(page) {
      this.page.currentPage = page;
      this.loadSchedules();
    },

    handleSizeChange(size) {
      this.page.pageSize = size;
      this.page.currentPage = 1;
      this.loadSchedules();
    },

    formatDate(date) {
      if (!date) return '-';
      const d = new Date(date);
      return d.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    },

    formatTime(date) {
      if (!date) return '-';
      const d = new Date(date);
      return d.toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit'
      });
    },

    getStatusLabel(status) {
      const labels = {
        'pending': '待审批',
        'approved': '已通过',
        'rejected': '已拒绝',
        'ongoing': '进行中',
        'ended': '已结束'
      };
      return labels[status] || '-';
    },

    getStatusType(status) {
      const types = {
        'pending': 'warning',
        'approved': 'success',
        'rejected': 'danger',
        'ongoing': 'info',
        'ended': ''
      };
      return types[status] || 'info';
    },

    handleViewTopic(topicId) {
      this.$router.push(`/decision/topic/detail/${topicId}`);
    },

    handleAddSchedule() {
      this.$message.info('新增议程功能开发中');
    },

    handleEditSchedule(scheduleId) {
      this.$message.info('编辑议程功能开发中');
    },

    handleDeleteSchedule(scheduleId) {
      this.$confirm('确定删除此议程吗？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.schedules = this.schedules.filter(s => s.id !== scheduleId);
        this.total = this.schedules.length;
        this.$message.success('删除成功');
      }).catch(() => {
        // User cancelled
      });
    },

    handleExport() {
      this.$message.info('导出功能开发中');
    }
  }
};
</script>

<style scoped lang="scss">
.schedule-page {
  background: white;
  border-radius: 6px;
  padding: 24px;

  .action-bar {
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 1px solid #dcdfe6;

    .el-button {
      margin-right: 10px;
    }
  }

  .schedule-container {
    display: grid;
    grid-template-columns: 250px 1fr;
    gap: 20px;

    .calendar-panel {
      background: #f5f7fa;
      border-radius: 6px;
      padding: 15px;

      ::v-deep .el-input {
        margin-bottom: 20px;
      }

      .legend {
        margin-top: 20px;

        .legend-item {
          display: flex;
          align-items: center;
          margin-bottom: 12px;
          font-size: 13px;

          .legend-icon {
            width: 12px;
            height: 12px;
            border-radius: 2px;
            margin-right: 8px;
          }
        }
      }
    }

    .schedule-list {
      .filter-section {
        background: #f5f7fa;
        border-radius: 6px;
        padding: 15px;
        margin-bottom: 20px;

        .filter-form {
          ::v-deep .el-form-item {
            margin-bottom: 10px;
          }

          .filter-buttons {
            text-align: left;

            .el-button {
              margin-right: 10px;
            }
          }
        }
      }

      .schedule-cards {
        .schedule-card {
          border: 1px solid #dcdfe6;
          border-radius: 6px;
          margin-bottom: 15px;
          overflow: hidden;
          transition: all 0.3s;

          &:hover {
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
          }

          &.status-pending {
            border-left: 4px solid #f0ad4e;
          }

          &.status-approved {
            border-left: 4px solid #5cb85c;
          }

          &.status-rejected {
            border-left: 4px solid #d9534f;
          }

          &.status-ongoing {
            border-left: 4px solid #0275d8;
          }

          &.status-ended {
            border-left: 4px solid #999;
          }

          .card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px;
            background: #f9fafc;
            border-bottom: 1px solid #ebeef5;

            .schedule-title {
              display: flex;
              flex-direction: column;
              gap: 5px;

              .schedule-date {
                font-size: 14px;
                font-weight: 600;
                color: #303133;
              }

              .schedule-time {
                font-size: 12px;
                color: #909399;
              }
            }

            .status-badge {
              ::v-deep .el-tag {
                padding: 4px 12px;
              }
            }
          }

          .card-body {
            padding: 15px;

            .topic-item {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 10px;
              background: white;
              border-radius: 4px;
              margin-bottom: 8px;
              font-size: 13px;

              &:last-child {
                margin-bottom: 0;
              }

              .topic-info {
                flex: 1;
                display: flex;
                align-items: center;
                gap: 15px;

                ::v-deep .el-link {
                  flex: 1;
                  font-size: 13px;
                }

                .topic-dept {
                  color: #909399;
                  white-space: nowrap;
                }
              }

              .topic-status {
                color: #606266;
                white-space: nowrap;
                margin-left: 10px;
              }
            }
          }

          .card-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 15px;
            background: #f9fafc;
            border-top: 1px solid #ebeef5;
            font-size: 13px;

            .location {
              color: #606266;
            }

            .card-actions {
              display: flex;
              gap: 8px;

              .el-button {
                margin: 0;
              }
            }
          }
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #909399;

          i {
            font-size: 48px;
            color: #dcdfe6;
            display: block;
            margin-bottom: 15px;
          }

          p {
            margin: 0;
          }
        }
      }

      ::v-deep .el-pagination {
        margin-top: 20px;
        text-align: right;
      }
    }
  }
}

@media (max-width: 768px) {
  .schedule-page {
    .schedule-container {
      grid-template-columns: 1fr;

      .calendar-panel {
        display: none;
      }
    }
  }
}
</style>
