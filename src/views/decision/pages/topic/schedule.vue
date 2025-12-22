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
                    type="datetimerange"
                    range-separator="-"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间"
                    value-format="YYYY-MM-DD HH:mm:ss"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="会议类型">
                  <el-select v-model="filterForm.meetingType" placeholder="请选择会议类型" clearable>
                    <el-option
                      v-for="item in meetingTypeList"
                      :key="item.code"
                      :label="item.value"
                      :value="item.code"
                    />
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
              v-if="scope.row.agendaStatus === '10'"
            >
              修改会议信息
            </el-link>
            <el-divider direction="vertical" v-if="scope.row.agendaStatus === '10'"></el-divider>
            <el-link
              type="primary"
              size="small"
              @click.stop="handleCancelMeeting(scope.row)"
              v-if="scope.row.agendaStatus === '10'"
            >
              取消会议
            </el-link>
            <el-divider direction="vertical" v-if="scope.row.agendaStatus === '10'"></el-divider>
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
        <div class="participants-section" v-if="selectedSchedule.participants && selectedSchedule.participants.length > 0">
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
      @refresh="loadSchedules"
    />

    <!-- 查看会议详情弹窗 -->
    <meeting-view-dialog
      v-model="meetingViewDialogVisible"
      :meeting-data="viewingMeeting"
    />
  </basic-container>
</template>

<script>
import DecisionBreadcrumb from '../../components/breadcrumb.vue';
import MeetingDialog from './components/meeting-dialog.vue';
import MeetingViewDialog from './components/meeting-view-dialog.vue';
import { scheduleOption } from '@/option/decision/schedule';
import * as topicApi from '@/api/decision/topic';

export default {
  name: 'TopicSchedule',
  components: {
    DecisionBreadcrumb,
    MeetingDialog,
    MeetingViewDialog
  },
  data() {
    return {
      // 会议类型列表
      meetingTypeList: [],
      filterForm: {
        meetingName: '',
        meetingTime: null,
        meetingType: ''
      },
      page: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      loading: false,
      selectedSchedule: null,
      tableData: [],
      crudOption: scheduleOption(this),
      meetingDialogVisible: false,
      meetingViewDialogVisible: false,
      viewingMeeting: null
    };
  },
  mounted() {
    this.fetchMeetingTypes();
    this.onLoad();
  },
  methods: {
    // 获取会议类型列表
    async fetchMeetingTypes() {
      try {
        const res = await topicApi.getAgendaType();
        if (res.data && res.data.code === 200) {
          this.meetingTypeList = res.data.data || [];
        }
      } catch (error) {
        console.error('获取会议类型失败：', error);
      }
    },

    onLoad() {
      this.loadSchedules();
    },

    async loadSchedules() {
      this.loading = true;
      try {
        // 使用真实API
        const requestData = {
          current: this.page.currentPage,
          size: this.page.pageSize
        };

        // 添加搜索条件
        if (this.filterForm.meetingName) {
          requestData.agendaName = this.filterForm.meetingName;
        }

        if (this.filterForm.meetingType) {
          requestData.agendaType = this.filterForm.meetingType;
        }

        if (this.filterForm.meetingTime && this.filterForm.meetingTime.length === 2) {
          requestData.startTimeStart = this.filterForm.meetingTime[0];
          requestData.startTimeEnd = this.filterForm.meetingTime[1];
        }

        // 调用API
        const res = await topicApi.getAgendaPage(requestData);

        if (res.data && res.data.code === 200 && res.data.success) {
          const apiData = res.data.data;
          // 映射API返回的字段到表格数据
          this.tableData = (apiData.records || []).map((item, index) => ({
            index: (this.page.currentPage - 1) * this.page.pageSize + index + 1,
            id: item.id,
            meetingName: item.agendaName,
            meetingType: item.meetingType,  // 使用类型代码，不是描述
            meetingTypeDesc: item.meetingTypeDesc,  // 保存描述供显示使用
            meetingForm: item.meetingFormDesc,
            participantCount: item.attendeeCount,
            meetingTime: this.formatMeetingTime(item.startTime, item.endTime),
            duration: item.agendaDuration ? `${item.agendaDuration}分钟` : '-',
            status: item.agendaStatusDesc || item.agendaStatus,  // 优先使用描述
            agendaStatus: item.agendaStatus,  // 保存状态代码
            agendaStatusDesc: item.agendaStatusDesc,
            applyUserName: item.applyUserName,
            participants: [],  // 默认空数组，可从详情API获取实际数据
            topics: [],  // 默认空数组，可从详情API获取实际数据
            // 保留原始数据
            _raw: item
          }));
          this.page.total = apiData.total || 0;
        } else {
          this.$message.error(res.data.msg || '加载议程列表失败');
          this.tableData = [];
          this.page.total = 0;
        }
      } catch (error) {
        console.error('加载议程列表失败：', error);
        this.$message.error('加载议程列表失败');
        this.tableData = [];
        this.page.total = 0;
      } finally {
        this.loading = false;
      }
    },

    formatMeetingTime(startTime, endTime) {
      if (!startTime) return '-';
      const start = this.$dayjs(startTime).format('YYYY-MM-DD HH:mm');
      const end = endTime ? this.$dayjs(endTime).format('HH:mm') : '';
      return end ? `${start} 至 ${end}` : start;
    },

    async handleSearch() {
      console.log('搜索条件：', this.filterForm);
      this.page.currentPage = 1;
      await this.loadSchedules();
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
      // 设置选中的议程
      this.selectedSchedule = {
        ...row,
        // 如果API返回了议题列表，使用它；否则使用空数组
        topics: row.topics || [],
        // 如果API返回了参会人员，使用它；否则使用空数组
        participants: row.participants || []
      };

      // TODO: 如果需要加载议程详情（包括议题列表和参会人员），在这里调用详情API
      // this.loadAgendaDetail(row.id);
    },

    handleViewMeeting(row) {
      this.viewingMeeting = row;
      this.meetingViewDialogVisible = true;
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
      }).then(async () => {
        try {
          const res = await topicApi.cancelAgenda(row.id);
          if (res.data && res.data.success) {
            this.$message.success('会议已取消');
            this.selectedSchedule = null;
            this.loadSchedules();
          } else {
            this.$message.error(res.data.msg || '取消会议失败');
          }
        } catch (error) {
          console.error('取消会议失败：', error);
          this.$message.error('取消会议失败');
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
      }).then(async () => {
        try {
          const res = await topicApi.deleteAgenda(row.id);
          if (res.data && res.data.success) {
            this.$message.success('会议已删除');
            this.selectedSchedule = null;
            this.loadSchedules();
          } else {
            this.$message.error(res.data.msg || '删除会议失败');
          }
        } catch (error) {
          console.error('删除会议失败：', error);
          this.$message.error('删除会议失败');
        }
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
      flex-shrink: 0;

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
