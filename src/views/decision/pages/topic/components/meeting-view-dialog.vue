<template>
  <el-dialog
    title="查看会议详情"
    :model-value="modelValue"
    @update:model-value="(val) => $emit('update:modelValue', val)"
    width="1200px"
    append-to-body
    class="meeting-view-dialog"
  >
    <!-- 主容器 -->
    <div class="dialog-content" v-if="meetingData">
      <!-- 左侧：会议信息 -->
      <div class="left-section">
        <div class="section-title">会议信息</div>
        <div class="info-list">
          <div class="info-item">
            <span class="info-label">会议类型:</span>
            <span class="info-value">{{ meetingData.meetingTypeDesc || '-' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">会议名称:</span>
            <span class="info-value">{{ meetingData.meetingName || '-' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">会议时间:</span>
            <span class="info-value">{{ meetingData.meetingTime || '-' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">会议形式:</span>
            <span class="info-value">{{ meetingData.meetingForm || '-' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">参会人数:</span>
            <span class="info-value">{{ attendeeList.length || 0 }}</span>
          </div>
          <div class="info-item" v-if="attendeeList.length > 0">
            <span class="info-label">参会人员:</span>
            <div class="attendee-list">
              <div class="attendee-item" v-for="(attendee, index) in attendeeList.slice(0, 3)" :key="index">
                {{ attendee.userName || attendee.deptName || '-' }}
              </div>
              <div class="attendee-item more" v-if="attendeeList.length > 3">
                +{{ attendeeList.length - 3 }}人
              </div>
            </div>
          </div>
          <div class="info-item">
            <span class="info-label">申请人:</span>
            <span class="info-value">{{ meetingData.applyUserName || '-' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">会议状态:</span>
            <span class="info-value status" :class="`status-${meetingData.agendaStatus}`">
              {{ meetingData.agendaStatusDesc || meetingData.status || '-' }}
            </span>
          </div>
        </div>
      </div>

      <!-- 右侧：议题列表 -->
      <div class="right-section">
        <div class="section-title">议题列表</div>
        <div class="tips-box" v-if="showTips">
          <i class="el-icon-info"></i>
          <span>点击编辑议题可修改议题信息</span>
        </div>
        <div class="topics-table-wrapper">
          <el-table
            :data="topicList"
            stripe
            size="small"
            style="width: 100%"
            v-if="topicList.length > 0"
          >
            <el-table-column prop="index" label="序号" width="50" align="center" />
            <el-table-column prop="title" label="议题名称" min-width="180" show-overflow-tooltip />
            <el-table-column prop="department" label="申请科室" width="100" />
            <el-table-column prop="director" label="申请科室主任" width="100" />
            <el-table-column label="操作" width="100" fixed="right">
              <template #default="scope">
                <el-button
                  type="text"
                  size="small"
                  @click="handleEditTopic(scope.row)"
                >
                  编辑
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="empty-state" v-else>
            <i class="el-icon-document"></i>
            <p>暂无议题</p>
          </div>
        </div>

        <!-- 分页 -->
        <div class="pagination-wrapper" v-if="topicTotal > 0">
          <el-pagination
            :current-page="topicPage.currentPage"
            :page-size="topicPage.pageSize"
            :total="topicTotal"
            @current-change="handleTopicPageChange"
            layout="prev, pager, next"
          />
        </div>
      </div>
    </div>

    <!-- 底部操作按钮 -->
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">关闭</el-button>
        <el-button type="primary" @click="handleApply">申请上会</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import * as topicApi from '@/api/decision/topic';

export default {
  name: 'MeetingViewDialog',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    meetingData: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['update:modelValue'],
  data() {
    return {
      showTips: true,
      loading: false,
      attendeeList: [],
      topicList: [],
      allTopics: [],  // 存储完整的议题列表
      topicPage: {
        currentPage: 1,
        pageSize: 10
      },
      topicTotal: 0,
      detailData: null
    };
  },
  watch: {
    modelValue(val) {
      if (val) {
        this.loadMeetingDetail();
        this.loadTopics();
      }
    }
  },
  methods: {
    async loadMeetingDetail() {
      if (!this.meetingData || !this.meetingData.id) {
        return;
      }

      this.loading = true;
      try {
        const res = await topicApi.getAgendaDetail(this.meetingData.id);
        if (res.data && res.data.code === 200 && res.data.success) {
          this.detailData = res.data.data;
          // 加载参会人员列表
          this.attendeeList = res.data.data.attendeeList || [];

          // 使用API返回的议题列表
          const topics = res.data.data.topicList || [];
          this.allTopics = topics;
          this.topicTotal = topics.length;
          this.topicPage.currentPage = 1;
          this.loadTopics();
        } else {
          this.$message.error(res.data.msg || '加载会议详情失败');
        }
      } catch (error) {
        console.error('加载会议详情失败：', error);
        this.$message.error('加载会议详情失败');
      } finally {
        this.loading = false;
      }
    },

    loadTopics() {
      if (!this.allTopics || this.allTopics.length === 0) {
        this.topicList = [];
        this.topicTotal = 0;
        return;
      }

      // 处理分页
      const startIndex = (this.topicPage.currentPage - 1) * this.topicPage.pageSize;
      const paginatedTopics = this.allTopics.slice(startIndex, startIndex + this.topicPage.pageSize);

      // 映射API返回的字段到表格需要的格式
      this.topicList = paginatedTopics.map((item, index) => ({
        index: startIndex + index + 1,
        id: item.id,
        title: item.title || item.topicName || '-',
        department: item.department || item.deptName || '-',
        director: item.director || item.applyUserName || '-'
      }));
    },

    handleTopicPageChange(page) {
      this.topicPage.currentPage = page;
      this.loadTopics();
    },

    handleEditTopic(row) {
      this.$router.push(`/decision/topic/edit/${row.id}`);
      this.handleClose();
    },

    handleApply() {
      this.$confirm('确定申请此会议吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        this.$message.success('申请成功');
        this.handleClose();
      }).catch(() => {
        // User cancelled
      });
    },

    handleClose() {
      this.$emit('update:modelValue', false);
    }
  }
};
</script>

<style scoped lang="scss">
.meeting-view-dialog {
  ::v-deep .el-dialog {
    border-radius: 4px;
  }

  ::v-deep .el-dialog__body {
    padding: 20px;
    max-height: 600px;
    overflow-y: auto;
  }

  ::v-deep .el-dialog__footer {
    padding: 10px 20px;
    border-top: 1px solid #ebeef5;
  }
}

.dialog-content {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 20px;
  min-height: 450px;

  .section-title {
    font-size: 14px;
    font-weight: 600;
    color: #303133;
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 1px solid #ebeef5;
  }

  .left-section {
    display: flex;
    flex-direction: column;
    padding-right: 10px;
    overflow-y: auto;

    .info-list {
      .info-item {
        display: flex;
        margin-bottom: 12px;
        line-height: 1.6;

        .info-label {
          flex-shrink: 0;
          width: 80px;
          font-weight: 500;
          color: #606266;
        }

        .info-value {
          flex: 1;
          color: #303133;
          word-break: break-word;

          &.status {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 2px;
            font-size: 12px;
            font-weight: 500;

            &.status-10 {
              background: #f0f9ff;
              color: #409eff;
            }

            &.status-20 {
              background: #f6f6f6;
              color: #606266;
            }

            &.status-30 {
              background: #f0f9ff;
              color: #409eff;
            }

            &.status-40 {
              background: #fef0f0;
              color: #f56c6c;
            }
          }
        }

        .attendee-list {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 4px;

          .attendee-item {
            padding: 2px 8px;
            background: #f0f4ff;
            color: #667eea;
            font-size: 12px;
            border-radius: 3px;

            &.more {
              background: transparent;
              color: #909399;
              padding: 0;
            }
          }
        }
      }
    }
  }

  .right-section {
    display: flex;
    flex-direction: column;
    border: 1px solid #ebeef5;
    border-radius: 4px;
    overflow: hidden;

    .tips-box {
      padding: 10px 12px;
      background: #fdf6ec;
      border-bottom: 1px solid #f5dab1;
      color: #e6a23c;
      font-size: 12px;
      display: flex;
      align-items: center;
      gap: 6px;

      i {
        flex-shrink: 0;
      }
    }

    .topics-table-wrapper {
      flex: 1;
      overflow-y: auto;

      ::v-deep {
        .el-table {
          border: none;

          .el-table__header-wrapper {
            position: sticky;
            top: 0;
            z-index: 10;
          }
        }
      }

      .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 200px;
        color: #909399;

        i {
          font-size: 48px;
          margin-bottom: 10px;
          opacity: 0.5;
        }

        p {
          margin: 0;
          font-size: 14px;
        }
      }
    }

    .pagination-wrapper {
      padding: 10px;
      background: #f5f7fa;
      border-top: 1px solid #ebeef5;
      display: flex;
      justify-content: center;

      ::v-deep .el-pagination {
        display: inline-flex;
      }
    }
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;

  ::v-deep .el-button {
    min-width: 80px;
  }
}

@media (max-width: 1200px) {
  .dialog-content {
    grid-template-columns: 1fr;
    gap: 20px;

    .right-section {
      height: 400px;
    }
  }
}
</style>
