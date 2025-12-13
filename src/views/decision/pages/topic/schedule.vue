<template>
  <basic-container>
    <decision-breadcrumb :breadcrumbs="['议题管理', '议程安排']" />

    <!-- 页面标题和操作按钮 -->
    <div class="schedule-header">
      <h3 class="header-title">议程安排</h3>
      <div class="header-actions">
        <el-button type="primary" size="small" @click="handlePrintSchedule">打印议程</el-button>
      </div>
    </div>

    <!-- 主容器：左侧表格 + 右侧详情 -->
    <div class="schedule-main">
      <!-- 左侧：议程表格 -->
      <div class="schedule-table-section">
        <!-- 搜索和筛选 -->
        <div class="filter-bar">
          <el-form :model="filterForm" label-width="80px" size="small" class="filter-form">
            <el-row :gutter="20">
              <el-col :span="6">
                <el-form-item label="会议名称">
                  <el-input
                    v-model="filterForm.meetingName"
                    placeholder="请输入"
                    clearable
                    @keyup.enter="handleSearch"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="会议时间">
                  <el-date-picker
                    v-model="filterForm.meetingTime"
                    type="daterange"
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="YYYY-MM-DD"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="会议类型">
                  <el-select v-model="filterForm.meetingType" placeholder="请选择会议类型" clearable>
                    <el-option label="院长办公会" value="院长办公会" />
                    <el-option label="党委会" value="党委会" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="24">
                <div class="filter-buttons">
                  <el-button type="primary" size="small" @click="handleSearch">查询</el-button>
                  <el-button size="small" @click="handleReset">重置</el-button>
                </div>
              </el-col>
            </el-row>
          </el-form>
        </div>

        <!-- avue-crud 主体 -->
        <avue-crud
          :option="crudOption"
          :data="tableData"
          :page.sync="page"
          :loading="loading"
          @on-load="onLoad"
          @row-click="handleSelectSchedule"
        >
          <!-- 操作列插槽 -->
          <template #menu="scope">
            <el-link type="primary" size="small" @click.stop="handleViewMeeting(scope.row)">
              查看会议详情
            </el-link>
            <el-divider direction="vertical"></el-divider>
            <el-link
              type="primary"
              size="small"
              @click.stop="handleEditMeeting(scope.row)"
              v-if="scope.row.status === 'wait_start'"
            >
              修改会议信息
            </el-link>
            <el-divider direction="vertical" v-if="scope.row.status === 'wait_start'"></el-divider>
            <el-link
              type="primary"
              size="small"
              @click.stop="handleCancelMeeting(scope.row)"
              v-if="scope.row.status === 'wait_start'"
            >
              取消会议
            </el-link>
            <el-divider direction="vertical" v-if="scope.row.status === 'wait_start'"></el-divider>
            <el-link
              type="danger"
              size="small"
              @click.stop="handleDeleteMeeting(scope.row)"
            >
              删除
            </el-link>
          </template>
        </avue-crud>
      </div>

      <!-- 右侧：议题详情 -->
      <div class="schedule-detail-section" v-if="selectedSchedule">
        <!-- 会议标题和操作 -->
        <div class="detail-header">
          <div class="title-block">
            <span class="meeting-name">{{ selectedSchedule.meetingName }}</span>
            <span class="meeting-time">{{ selectedSchedule.meetingTime }}</span>
          </div>
          <div class="action-block">
            <span class="duration">{{ selectedSchedule.duration }}</span>
          </div>
        </div>

        <!-- 议题列表 -->
        <div class="topics-section">
          <div class="section-title">议题列表</div>
          <div class="topics-container">
            <div
              v-for="(topic, index) in selectedSchedule.topics"
              :key="index"
              class="topic-item"
            >
              <div class="topic-number">{{ index + 1 }}</div>
              <div class="topic-content">
                <div class="topic-title">{{ topic.title }}</div>
                <div class="topic-meta">
                  <span class="meta-item">胸外科 张三</span>
                  <span class="meta-item">{{ topic.duration }}</span>
                </div>
              </div>
              <div class="topic-actions">
                <el-button type="text" size="small" @click="handlePreviewTopic(topic)">预览</el-button>
                <el-button type="text" size="small" @click="handleEditTopic(topic)">编辑</el-button>
              </div>
            </div>
          </div>
        </div>

        <!-- 参会人员 -->
        <div class="participants-section">
          <div class="section-title">参会人员: {{ selectedSchedule.participants.length }}人</div>
          <div class="participants-list">
            <div v-for="participant in selectedSchedule.participants" :key="participant" class="participant-tag">
              <i class="el-icon-user"></i>
              {{ participant }}
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div class="empty-state" v-else>
        <i class="el-icon-document"></i>
        <p>请选择左侧议程查看详情</p>
      </div>
    </div>

    <!-- 修改会议信息弹窗 -->
    <meeting-dialog
      v-model="meetingDialogVisible"
      :meeting-data="selectedSchedule"
    />
  </basic-container>
</template>

<script>
import DecisionBreadcrumb from '../../components/breadcrumb.vue';
import MeetingDialog from './components/meeting-dialog.vue';
import { scheduleOption } from '@/option/decision/schedule';

export default {
  name: 'TopicSchedule',
  components: {
    DecisionBreadcrumb,
    MeetingDialog
  },
  data() {
    return {
      filterForm: {
        meetingName: '',
        meetingTime: null,
        meetingType: ''
      },
      page: {
        currentPage: 1,
        pageSize: 10
      },
      loading: false,
      selectedSchedule: null,
      tableData: [],
      crudOption: scheduleOption(this),
      meetingDialogVisible: false,
      // Mock data
      mockSchedules: [
        {
          index: 1,
          meetingName: '9.23院长办公会—议事',
          meetingType: '院长办公会',
          meetingForm: '线上',
          participantCount: 2,
          meetingTime: '2025-08-08 12:00 至 15:00',
          status: 'wait_start',
          duration: '30分钟',
          topics: [
            {
              id: 1,
              title: '汇报学生党支部资质资教学项',
              department: '胸外科',
              reporter: '张三',
              duration: '15分钟'
            },
            {
              id: 2,
              title: '关于正式任命xxx为胸外科副主任',
              department: '胸外科',
              reporter: '张三',
              duration: '15分钟'
            },
            {
              id: 3,
              title: '关于正式任命xxx为胸外科副主任',
              department: '胸外科',
              reporter: '张三',
              duration: '15分钟'
            }
          ],
          participants: ['张三', '李四', '王五', '赵六', '孙七', '周八']
        },
        {
          index: 2,
          meetingName: '9.23院长办公会—议事',
          meetingType: '院长办公会',
          meetingForm: '线下',
          participantCount: 5,
          meetingTime: '2025-08-08 12:00 至 15:00',
          status: 'ongoing',
          duration: '2小时',
          topics: [
            {
              id: 3,
              title: '护理人员培训计划',
              department: '护理部',
              reporter: '李四',
              duration: '20分钟'
            }
          ],
          participants: ['张三', '李四', '王五']
        },
        {
          index: 3,
          meetingName: '党委会会议',
          meetingType: '党委会',
          meetingForm: '线下',
          participantCount: 6,
          meetingTime: '2025-08-08 12:00 至 15:00',
          status: 'ended',
          duration: '1.5小时',
          topics: [
            {
              id: 4,
              title: '医院信息系统升级方案',
              department: '信息部',
              reporter: '王五',
              duration: '25分钟'
            }
          ],
          participants: ['张三', '李四', '王五', '赵六', '孙七', '周八']
        },
        {
          index: 4,
          meetingName: '院长办公会',
          meetingType: '院长办公会',
          meetingForm: '线上',
          participantCount: 7,
          meetingTime: '2025-08-08 12:00 至 15:00',
          status: 'cancelled',
          duration: '1小时',
          topics: [
            {
              id: 5,
              title: '防疫应急预案制定',
              department: '感控部',
              reporter: '赵六',
              duration: '18分钟'
            }
          ],
          participants: ['张三', '李四', '王五', '赵六']
        }
      ]
    };
  },
  mounted() {
    this.onLoad();
  },
  methods: {
    onLoad() {
      this.loadSchedules();
    },

    loadSchedules() {
      this.loading = true;
      try {
        // Filter by search form
        let filtered = this.mockSchedules;

        if (this.filterForm.meetingName) {
          filtered = filtered.filter(s =>
            s.meetingName.includes(this.filterForm.meetingName)
          );
        }

        if (this.filterForm.meetingType) {
          filtered = filtered.filter(s =>
            s.meetingType === this.filterForm.meetingType
          );
        }

        if (this.filterForm.meetingTime && this.filterForm.meetingTime.length === 2) {
          const [startDate, endDate] = this.filterForm.meetingTime;
          filtered = filtered.filter(s => {
            // Extract date from meetingTime string (format: "2025-08-08 12:00 至 15:00")
            const dateMatch = s.meetingTime.match(/(\d{4}-\d{2}-\d{2})/);
            if (dateMatch) {
              const meetingDate = new Date(dateMatch[1]);
              const start = new Date(startDate);
              const end = new Date(endDate);
              return meetingDate >= start && meetingDate <= end;
            }
            return false;
          });
        }

        // Apply pagination
        const startIndex = (this.page.currentPage - 1) * this.page.pageSize;
        this.tableData = filtered.slice(startIndex, startIndex + this.page.pageSize);
        this.page.total = filtered.length;
      } finally {
        this.loading = false;
      }
    },

    handleSearch() {
      this.page.currentPage = 1;
      this.loadSchedules();
    },

    handleReset() {
      this.filterForm = {
        meetingName: '',
        meetingTime: null,
        meetingType: ''
      };
      this.page.currentPage = 1;
      this.loadSchedules();
    },

    handleSelectSchedule(row) {
      this.selectedSchedule = row;
    },

    handleViewMeeting(row) {
      this.$message.info('查看会议详情功能开发中');
    },

    handleEditMeeting(row) {
      this.selectedSchedule = row;
      this.meetingDialogVisible = true;
    },

    handleCancelMeeting(row) {
      this.$confirm('确定取消此会议吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // Find and update the meeting status
        const meetingIndex = this.mockSchedules.findIndex(m => m.index === row.index);
        if (meetingIndex !== -1) {
          this.mockSchedules[meetingIndex].status = 'cancelled';
          this.loadSchedules();
          this.$message.success('会议已取消');
          this.selectedSchedule = null;
        }
      }).catch(() => {
        // User cancelled
      });
    },

    handleDeleteMeeting(row) {
      this.$confirm('确定删除此会议吗？删除后将无法恢复', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // Remove the meeting from mock data
        this.mockSchedules = this.mockSchedules.filter(m => m.index !== row.index);
        this.loadSchedules();
        this.$message.success('会议已删除');
        this.selectedSchedule = null;
      }).catch(() => {
        // User cancelled
      });
    },

    handlePreviewTopic(topic) {
      this.$router.push(`/decision/topic/detail/${topic.id}`);
    },

    handleEditTopic(topic) {
      this.$router.push(`/decision/topic/edit/${topic.id}`);
    },

    handlePrintSchedule() {
      this.$message.info('打印议程功能开发中');
    }
  }
};
</script>

<style scoped lang="scss">
.schedule-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #dcdfe6;

  .header-title {
    margin: 0;
    font-size: 16px;
    font-weight: 500;
    color: #303133;
  }

  .header-actions {
    display: flex;
    gap: 8px;
  }
}

.schedule-main {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 20px;
  height: calc(100vh - 300px);
  min-height: 600px;

  .schedule-table-section {
    display: flex;
    flex-direction: column;
    background: white;
    border-radius: 4px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
    overflow: hidden;

    .filter-bar {
      padding: 15px;
      background: #f5f7fa;
      border-bottom: 1px solid #ebeef5;

      .filter-form {
        margin: 0;

        ::v-deep .el-form-item {
          margin-bottom: 0;
        }

        .filter-buttons {
          display: flex;
          justify-content: flex-end;
          gap: 8px;

          .el-button {
            padding: 7px 15px;
          }
        }
      }
    }

    ::v-deep .avue-crud {
      flex: 1;
      overflow-y: auto;

      .avue-crud__body {
        height: 100%;
      }

      .el-table {
        border: none;

        .el-table__header-wrapper {
          position: sticky;
          top: 0;
          z-index: 10;
        }
      }
    }
  }

  .schedule-detail-section {
    background: white;
    border-radius: 4px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
    overflow-y: auto;
    display: flex;
    flex-direction: column;

    .detail-header {
      padding: 15px;
      background: #f5f7fa;
      border-bottom: 1px solid #ebeef5;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;

      .title-block {
        display: flex;
        flex-direction: column;
        gap: 4px;

        .meeting-name {
          font-size: 13px;
          font-weight: 600;
          color: #303133;
        }

        .meeting-time {
          font-size: 11px;
          color: #909399;
        }
      }

      .action-block {
        text-align: right;

        .duration {
          font-size: 11px;
          color: #606266;
        }
      }
    }

    .topics-section {
      padding: 12px;
      border-bottom: 1px solid #ebeef5;
      flex: 1;
      overflow-y: auto;

      .section-title {
        font-size: 12px;
        font-weight: 600;
        color: #303133;
        margin-bottom: 10px;
        padding-left: 8px;
        border-left: 3px solid #409eff;
      }

      .topics-container {
        .topic-item {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          padding: 8px;
          margin-bottom: 6px;
          background: #fafafa;
          border-radius: 3px;
          font-size: 11px;

          .topic-number {
            flex-shrink: 0;
            width: 24px;
            height: 24px;
            background: #e8f4fd;
            color: #409eff;
            border-radius: 3px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
          }

          .topic-content {
            flex: 1;
            min-width: 0;

            .topic-title {
              font-size: 11px;
              color: #303133;
              margin-bottom: 3px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }

            .topic-meta {
              display: flex;
              gap: 6px;
              color: #909399;

              .meta-item {
                font-size: 10px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
            }
          }

          .topic-actions {
            flex-shrink: 0;
            display: flex;
            gap: 2px;

            ::v-deep .el-link {
              font-size: 10px;
              padding: 0;
            }
          }
        }
      }
    }

    .participants-section {
      padding: 12px;

      .section-title {
        font-size: 12px;
        font-weight: 600;
        color: #303133;
        margin-bottom: 8px;
        padding-left: 8px;
        border-left: 3px solid #409eff;
      }

      .participants-list {
        display: flex;
        flex-direction: column;
        gap: 4px;

        .participant-tag {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 4px 8px;
          background: #f0f9ff;
          border-radius: 3px;
          font-size: 11px;
          color: #409eff;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;

          i {
            flex-shrink: 0;
            font-size: 10px;
          }
        }
      }
    }
  }

  .empty-state {
    grid-column: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: white;
    border-radius: 4px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);

    i {
      font-size: 48px;
      color: #dcdfe6;
      margin-bottom: 10px;
    }

    p {
      margin: 0;
      color: #909399;
      font-size: 13px;
    }
  }
}

@media (max-width: 1200px) {
  .schedule-main {
    grid-template-columns: 1fr;
    height: auto;

    .schedule-detail-section,
    .empty-state {
      grid-column: 1;
      height: 400px;
      margin-top: 20px;
    }
  }
}
</style>
