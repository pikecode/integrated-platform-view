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
          <div class="section-title">议题列表 ({{ selectedSchedule.topics.length }}个)</div>
          <VueDraggable
            v-model="selectedSchedule.topics"
            class="topics-container"
            v-if="selectedSchedule.topics.length > 0"
            @change="handleTopicsSorted"
          >
            <div
              v-for="(topic, index) in selectedSchedule.topics"
              :key="topic.id"
              class="topic-card"
            >
              <div class="topic-card-body">
                <div class="topic-time">
                  <div class="date">{{ topic.startTime ? topic.startTime.split(' ')[0] : '-' }}</div>
                  <div class="time">{{ topic.startTime ? topic.startTime.split(' ')[1] : '' }}-{{ topic.endTime ? topic.endTime.split(' ')[1] : '' }}</div>
                </div>
                <div class="topic-info">
                  <div class="topic-title">{{ topic.title }}</div>
                  <div class="topic-footer">
                    <span class="department">{{ topic.department }}</span>
                    <span class="director">{{ topic.director }}</span>
                  </div>
                </div>
                <div class="topic-duration">{{ topic.duration }}秒</div>
              </div>
              <div class="topic-actions">
                <el-dropdown @command="handleTopicCommand($event, topic)">
                  <i class="el-icon-more"></i>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item command="view">查看</el-dropdown-item>
                      <el-dropdown-item command="edit">编辑</el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
            </div>
          </VueDraggable>
          <div v-else class="empty-topics">
            <i class="el-icon-document"></i>
            <p>暂无议题</p>
          </div>
        </div>

        <!-- 参会人员 -->
        <div class="participants-section" v-if="selectedSchedule.participants && selectedSchedule.participants.length > 0">
          <div class="section-title">参会人员 ({{ selectedSchedule.participants.length }}人)</div>
          <div class="participants-list">
            <div v-for="participant in selectedSchedule.participants" :key="participant.id" class="participant-tag">
              <i class="el-icon-user"></i>
              <span class="participant-name">{{ participant.name }}</span>
              <span class="participant-dept" v-if="participant.deptName">- {{ participant.deptName }}</span>
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
import { VueDraggable } from 'vue-draggable-plus';

export default {
  name: 'TopicSchedule',
  components: {
    DecisionBreadcrumb,
    MeetingDialog,
    MeetingViewDialog,
    VueDraggable
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

    async handleSelectSchedule(row) {
      // 加载议程详情
      await this.loadAgendaDetail(row.id);
    },

    async handleViewMeeting(row) {
      // 确保 viewingMeeting 有正确的 id
      this.viewingMeeting = {
        id: row.id || row._raw?.id,
        meetingName: row.meetingName,
        meetingTypeDesc: row.meetingTypeDesc,
        meetingForm: row.meetingForm,
        meetingTime: row.meetingTime,
        applyUserName: row.applyUserName,
        agendaStatus: row.agendaStatus,
        agendaStatusDesc: row.agendaStatusDesc
      };
      // 打开弹窗（弹窗内会根据 id 加载详情）
      this.meetingViewDialogVisible = true;
    },

    async loadAgendaDetail(agendaId) {
      try {
        const res = await topicApi.getAgendaDetail(agendaId);
        if (res.data && res.data.success && res.data.data) {
          const detail = res.data.data;

          // 处理议题列表，如果为空使用 mock 数据
          let topics = (detail.topicList || []).map(topic => ({
            id: topic.topicId,
            title: topic.topicName,
            department: topic.applyDeptName,
            deptId: topic.applyDeptId,
            sort: topic.defaultSort
          }));

          // 如果议题列表为空，使用 mock 数据
          if (topics.length === 0) {
            topics = [
              {
                id: '1',
                title: '征报生党支部资质资教学项',
                department: '胸外科',
                deptId: 'dept001',
                director: '张三',
                startTime: '2025-08-08 13:00',
                endTime: '2025-08-08 13:30',
                duration: 309,
                sort: 1
              },
              {
                id: '2',
                title: '医院信息化建设进展汇报',
                department: '信息技术部',
                deptId: 'dept002',
                director: '李四',
                startTime: '2025-08-08 14:00',
                endTime: '2025-08-08 14:45',
                duration: 45,
                sort: 2
              },
              {
                id: '3',
                title: '临床路径优化方案讨论',
                department: '质管科',
                deptId: 'dept003',
                director: '王五',
                startTime: '2025-08-08 15:00',
                endTime: '2025-08-08 16:00',
                duration: 60,
                sort: 3
              },
              {
                id: '4',
                title: '医疗质量持续改进项目总结',
                department: '胸外科',
                deptId: 'dept001',
                director: '赵六',
                startTime: '2025-08-08 16:30',
                endTime: '2025-08-08 17:30',
                duration: 60,
                sort: 4
              },
              {
                id: '5',
                title: '人才队伍建设与引进计划',
                department: '人力资源部',
                deptId: 'dept004',
                director: '孙七',
                startTime: '2025-08-08 17:45',
                endTime: '2025-08-08 18:45',
                duration: 60,
                sort: 5
              }
            ];
          }

          // 处理参会人员列表，如果为空使用 mock 数据
          let participants = (detail.attendeeList || []).map(attendee => ({
            id: attendee.userId,
            name: attendee.userName,
            deptId: attendee.deptId,
            deptName: attendee.deptName
          }));

          // 如果参会人员列表为空，使用 mock 数据
          if (participants.length === 0) {
            participants = [
              { id: '1', name: '张明', deptId: 'dept001', deptName: '胸外科' },
              { id: '2', name: '李四', deptId: 'dept002', deptName: '心内科' },
              { id: '3', name: '王五', deptId: 'dept003', deptName: '放射科' },
              { id: '4', name: '赵六', deptId: 'dept004', deptName: '质管科' },
              { id: '5', name: '孙七', deptId: 'dept001', deptName: '胸外科' },
              { id: '6', name: '周八', deptId: 'dept005', deptName: '护理部' }
            ];
          }

          // 设置选中的议程，包含详情数据
          this.selectedSchedule = {
            id: detail.agendaId,
            meetingName: detail.agendaName,
            meetingType: detail.meetingType,
            meetingTypeDesc: detail.meetingTypeDesc,
            meetingForm: detail.meetingFormDesc,
            meetingTime: this.formatMeetingTime(detail.startTime, detail.endTime),
            duration: detail.agendaDuration ? `${detail.agendaDuration}分钟` : '-',
            status: detail.agendaStatusDesc || detail.agendaStatus,
            agendaStatus: detail.agendaStatus,
            applyUserName: detail.applyUserName,
            topics: topics,
            participants: participants,
            _raw: detail
          };
        } else {
          this.$message.error(res.data.msg || '加载会议详情失败');
        }
      } catch (error) {
        console.error('加载会议详情失败：', error);
        this.$message.error('加载会议详情失败');
      }
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

    handleTopicCommand(command, topic) {
      switch (command) {
        case 'view':
          this.handlePreviewTopic(topic);
          break;
        case 'edit':
          this.handleEditTopic(topic);
          break;
        default:
          break;
      }
    },

    async handleTopicsSorted() {
      // 排序完成后，调用API保存排序
      if (!this.selectedSchedule || !this.selectedSchedule.id) {
        this.$message.warning('议程信息不完整，无法保存排序');
        return;
      }

      try {
        // 构建排序数据
        const topicSortList = this.selectedSchedule.topics.map((topic, index) => ({
          topicId: topic.id,
          defaultSort: index + 1
        }));

        const requestData = {
          agendaId: this.selectedSchedule.id,
          topicSortList
        };

        const res = await topicApi.sortAgendaTopics(requestData);
        if (res.data && res.data.success) {
          this.$message.success('议题排序已保存');
        } else {
          this.$message.error(res.data?.msg || '保存议题排序失败');
          // 排序失败时重新加载
          await this.loadAgendaDetail(this.selectedSchedule.id);
        }
      } catch (error) {
        console.error('保存议题排序失败：', error);
        this.$message.error('保存议题排序失败');
        // 排序失败时重新加载
        await this.loadAgendaDetail(this.selectedSchedule.id);
      }
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
  height: calc(100vh - 340px);
  min-height: 500px;

  .schedule-table-section {
    display: flex;
    flex-direction: column;
    background: white;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    overflow: hidden;

    .filter-bar {
      padding: 16px;
      background: #f9fafb;
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
          margin-top: 12px;

          .el-button {
            padding: 7px 15px;
          }
        }
      }
    }

    ::v-deep .avue-crud {
      flex: 1;
      min-height: 0;
      overflow: hidden;
      display: flex;
      flex-direction: column;

      .avue-crud__body {
        flex: 1;
        overflow-y: auto;
        overflow-x: hidden;

        /* 优化滚动条样式 */
        &::-webkit-scrollbar {
          width: 6px;
        }

        &::-webkit-scrollbar-track {
          background: transparent;
        }

        &::-webkit-scrollbar-thumb {
          background: #bfcbd9;
          border-radius: 3px;

          &:hover {
            background: #a8b7d6;
          }
        }
      }

      .el-table {
        border: none;

        .el-table__header-wrapper {
          flex-shrink: 0;
          background: #fff;
          z-index: 10;

          th {
            background: #f9fafb;
            border-bottom: 1px solid #ebeef5;
          }
        }

        .el-table__body-wrapper {
          flex: 1;
          overflow: hidden;

          &::-webkit-scrollbar {
            width: 6px;
          }

          &::-webkit-scrollbar-track {
            background: transparent;
          }

          &::-webkit-scrollbar-thumb {
            background: #bfcbd9;
            border-radius: 3px;

            &:hover {
              background: #a8b7d6;
            }
          }
        }

        tr {
          transition: background-color 0.2s ease;

          &:hover {
            background-color: #f5f7fa !important;
          }
        }
      }
    }
  }

  .schedule-detail-section {
    background: white;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    min-height: 0;

    .detail-header {
      padding: 16px;
      background: #f9fafb;
      border-bottom: 1px solid #ebeef5;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      flex-shrink: 0;

      .title-block {
        display: flex;
        flex-direction: column;
        gap: 6px;
        flex: 1;
        min-width: 0;

        .meeting-name {
          font-size: 14px;
          font-weight: 600;
          color: #303133;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .meeting-time {
          font-size: 12px;
          color: #909399;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }

      .action-block {
        text-align: right;
        flex-shrink: 0;
        margin-left: 12px;

        .duration {
          font-size: 12px;
          color: #606266;
        }
      }
    }

    .topics-section {
      padding: 12px;
      border-bottom: 1px solid #ebeef5;
      flex: 1;
      overflow-y: auto;
      min-height: 0;

      /* 优化滚动条样式 */
      &::-webkit-scrollbar {
        width: 6px;
      }

      &::-webkit-scrollbar-track {
        background: transparent;
      }

      &::-webkit-scrollbar-thumb {
        background: #bfcbd9;
        border-radius: 3px;

        &:hover {
          background: #a8b7d6;
        }
      }

      .section-title {
        font-size: 13px;
        font-weight: 600;
        color: #303133;
        margin-bottom: 12px;
        padding-left: 10px;
        border-left: 3px solid #409eff;
        flex-shrink: 0;
      }

      .topics-container {
        display: flex;
        flex-direction: column;
        gap: 12px;

        .topic-card {
          display: flex;
          align-items: stretch;
          background: white;
          border: 1px solid #dcdfe6;
          border-radius: 4px;
          overflow: hidden;
          transition: all 0.2s ease;
          cursor: grab;

          &:active {
            cursor: grabbing;
          }

          &:hover {
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
            border-color: #409eff;
          }

          // 拖动时的样式
          &.sortable-ghost {
            opacity: 0.5;
            background: #f5f7fa;
          }

          .topic-card-body {
            display: flex;
            align-items: center;
            gap: 16px;
            flex: 1;
            padding: 12px 16px;
            min-width: 0;

            .topic-time {
              flex-shrink: 0;
              text-align: center;
              min-width: 60px;

              .date {
                font-size: 12px;
                color: #606266;
                line-height: 1.4;
              }

              .time {
                font-size: 12px;
                color: #606266;
                line-height: 1.4;
              }
            }

            .topic-info {
              flex: 1;
              min-width: 0;
              display: flex;
              flex-direction: column;
              gap: 6px;

              .topic-title {
                font-size: 14px;
                color: #303133;
                font-weight: 500;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }

              .topic-footer {
                display: flex;
                gap: 8px;
                font-size: 12px;
                color: #909399;

                .department {
                  flex-shrink: 0;
                }

                .director {
                  flex-shrink: 0;
                }
              }
            }

            .topic-duration {
              flex-shrink: 0;
              font-size: 12px;
              color: #606266;
              white-space: nowrap;
            }
          }

          .topic-actions {
            flex-shrink: 0;
            padding: 12px 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            min-width: 44px;
            cursor: pointer;
            transition: background-color 0.2s ease;

            &:hover {
              background-color: #f5f7fa;
            }

            ::v-deep .el-dropdown {
              font-size: 18px;
              color: #606266;
              cursor: pointer;

              &:hover {
                color: #409eff;
              }
            }
          }
        }
      }

      .empty-topics {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 40px 20px;
        color: #909399;

        i {
          font-size: 36px;
          color: #dcdfe6;
          margin-bottom: 12px;
        }

        p {
          margin: 0;
          font-size: 12px;
        }
      }
    }

    .participants-section {
      padding: 12px;
      flex-shrink: 0;
      max-height: 150px;
      overflow-y: auto;

      /* 优化滚动条样式 */
      &::-webkit-scrollbar {
        width: 4px;
      }

      &::-webkit-scrollbar-track {
        background: transparent;
      }

      &::-webkit-scrollbar-thumb {
        background: #bfcbd9;
        border-radius: 2px;

        &:hover {
          background: #a8b7d6;
        }
      }

      .section-title {
        font-size: 13px;
        font-weight: 600;
        color: #303133;
        margin-bottom: 10px;
        padding-left: 10px;
        border-left: 3px solid #409eff;
      }

      .participants-list {
        display: flex;
        flex-direction: column;
        gap: 6px;

        .participant-tag {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 10px;
          background: #f0f9ff;
          border: 1px solid #c5e4f3;
          border-radius: 4px;
          font-size: 12px;
          color: #409eff;
          overflow: hidden;
          transition: all 0.2s ease;

          &:hover {
            background: #e8f4fd;
            border-color: #b3d8ff;
          }

          i {
            flex-shrink: 0;
            font-size: 11px;
          }

          .participant-name {
            font-weight: 500;
            flex-shrink: 0;
          }

          .participant-dept {
            color: #79bbff;
            font-size: 11px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
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
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    padding: 40px 20px;

    i {
      font-size: 52px;
      color: #dcdfe6;
      margin-bottom: 16px;
    }

    p {
      margin: 0;
      color: #909399;
      font-size: 14px;
      text-align: center;
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
      height: 500px;
      margin-top: 20px;
    }
  }
}
</style>
