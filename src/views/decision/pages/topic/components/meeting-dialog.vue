<template>
  <el-dialog
    :title="'申请上会'"
    :visible.sync="visibleInternal"
    width="1200px"
    class="meeting-dialog"
  >
    <!-- 主容器 -->
    <div class="dialog-content">
      <!-- 左侧：会议信息表单 -->
      <div class="left-section">
        <div class="section-title">会议信息</div>
        <el-form :model="formData" label-width="100px" size="small">
          <el-form-item label="会议类型:" required>
            <el-select
              v-model="formData.meetingType"
              placeholder="请选择会议类型"
              @change="handleMeetingTypeChange"
            >
              <el-option label="院长办公会" value="院长办公会" />
              <el-option label="党委会" value="党委会" />
            </el-select>
          </el-form-item>

          <el-form-item label="会议名称:" required>
            <el-input
              v-model="formData.meetingName"
              placeholder="请输入"
              clearable
            />
          </el-form-item>

          <el-form-item label="会议时间:" required>
            <div class="time-input-group">
              <el-date-picker
                v-model="formData.startTime"
                type="date"
                placeholder="开始时间"
                value-format="YYYY-MM-DD"
              />
              <span class="separator">-</span>
              <el-date-picker
                v-model="formData.endTime"
                type="date"
                placeholder="结束时间"
                value-format="YYYY-MM-DD"
              />
            </div>
          </el-form-item>

          <el-form-item label="会议形式:" required>
            <el-select
              v-model="formData.meetingForm"
              placeholder="请选择会议形式"
            >
              <el-option label="线上" value="线上" />
              <el-option label="线下" value="线下" />
              <el-option label="混合" value="混合" />
            </el-select>
          </el-form-item>

          <el-form-item label="选择参会人员:" required>
            <div class="participant-section">
              <el-button
                type="primary"
                size="small"
                @click="handleSelectParticipants"
              >
                选择人员
              </el-button>
              <span class="participant-text" v-if="selectedParticipants.length > 0">
                已选: {{ selectedParticipants.join('、') }}
              </span>
            </div>
          </el-form-item>
        </el-form>
      </div>

      <!-- 右侧：议题列表 -->
      <div class="right-section">
        <div class="section-title">议题信息</div>
        <div class="topics-table-wrapper">
          <el-table
            :data="topicList"
            stripe
            size="small"
            style="width: 100%; height: 100%"
          >
            <el-table-column prop="index" label="序号" width="50" />
            <el-table-column prop="title" label="议题名称" min-width="200" />
            <el-table-column prop="department" label="申请科室" width="100" />
            <el-table-column prop="director" label="申请科室主任" width="100" />
            <el-table-column label="操作" width="80" fixed="right">
              <template #default="scope">
                <el-button
                  type="text"
                  size="small"
                  style="color: #f56c6c"
                  @click="handleRemoveTopic(scope.row)"
                >
                  移除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
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
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSubmit">申请上会</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'MeetingDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    meetingData: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      visibleInternal: false,
      formData: {
        meetingType: '',
        meetingName: '',
        startTime: null,
        endTime: null,
        meetingForm: '',
        participants: []
      },
      selectedParticipants: [],
      // Mock topic data
      mockTopics: [
        {
          index: 1,
          id: 1,
          title: '汇报学生党支部资质资教学项',
          department: '胸外科',
          director: '张三'
        },
        {
          index: 2,
          id: 2,
          title: '关于正式任命xxx为胸外科副主任',
          department: '胸外科',
          director: '张三'
        },
        {
          index: 3,
          id: 3,
          title: '关于正式任命xxx为胸外科副主任',
          department: '胸外科',
          director: '张三'
        },
        {
          index: 4,
          id: 4,
          title: '汇报学生党支部资质资教学项',
          department: '胸外科',
          director: '张三'
        },
        {
          index: 5,
          id: 5,
          title: '关于正式任命xxx为胸外科副主任',
          department: '胸外科',
          director: '张三'
        },
        {
          index: 6,
          id: 6,
          title: '关于正式任命xxx为胸外科副主任',
          department: '胸外科',
          director: '张三'
        },
        {
          index: 7,
          id: 7,
          title: '关于正式任命xxx为胸外科副主任',
          department: '胸外科',
          director: '张三'
        },
        {
          index: 8,
          id: 8,
          title: '汇报学生党支部资质资教学项',
          department: '胸外科',
          director: '张三'
        },
        {
          index: 9,
          id: 9,
          title: '汇报学生党支部资质资教学项',
          department: '胸外科',
          director: '张三'
        },
        {
          index: 10,
          id: 10,
          title: '关于正式任命xxx为胸外科副主任',
          department: '胸外科',
          director: '张三'
        }
      ],
      topicList: [],
      topicPage: {
        currentPage: 1,
        pageSize: 10
      },
      topicTotal: 0
    };
  },
  watch: {
    visible(val) {
      this.visibleInternal = val;
      if (val) {
        this.initForm();
        this.loadTopics();
      }
    },
    visibleInternal(val) {
      this.$emit('update:visible', val);
    },
    meetingData: {
      handler(newVal) {
        if (newVal && this.visibleInternal) {
          this.initForm();
        }
      },
      deep: true
    }
  },
  methods: {
    initForm() {
      if (this.meetingData && this.meetingData.meetingName) {
        this.formData = {
          meetingType: this.meetingData.meetingType || '',
          meetingName: this.meetingData.meetingName || '',
          startTime: null,
          endTime: null,
          meetingForm: this.meetingData.meetingForm || '',
          participants: this.meetingData.participants || []
        };
        this.selectedParticipants = [...(this.meetingData.participants || [])];
      } else {
        this.formData = {
          meetingType: '',
          meetingName: '',
          startTime: null,
          endTime: null,
          meetingForm: '',
          participants: []
        };
        this.selectedParticipants = [];
      }
    },

    loadTopics() {
      this.topicTotal = this.mockTopics.length;
      const startIndex = (this.topicPage.currentPage - 1) * this.topicPage.pageSize;
      this.topicList = this.mockTopics.slice(
        startIndex,
        startIndex + this.topicPage.pageSize
      );
    },

    handleMeetingTypeChange(val) {
      // Can add logic here to handle meeting type change
    },

    handleSelectParticipants() {
      // This would typically open a user selection dialog
      this.$message.info('选择人员功能开发中');
    },

    handleRemoveTopic(row) {
      this.$confirm('确定移除此议题吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // Remove topic from mock data
        this.mockTopics = this.mockTopics.filter(t => t.id !== row.id);
        this.loadTopics();
        this.$message.success('移除成功');
      }).catch(() => {
        // User cancelled
      });
    },

    handleTopicPageChange(page) {
      this.topicPage.currentPage = page;
      this.loadTopics();
    },

    handleClose(val) {
      this.visibleInternal = false;
    },

    handleSubmit() {
      // Validate form
      if (!this.formData.meetingType) {
        this.$message.warning('请选择会议类型');
        return;
      }
      if (!this.formData.meetingName) {
        this.$message.warning('请输入会议名称');
        return;
      }
      if (!this.formData.startTime || !this.formData.endTime) {
        this.$message.warning('请选择会议时间');
        return;
      }
      if (!this.formData.meetingForm) {
        this.$message.warning('请选择会议形式');
        return;
      }
      if (this.selectedParticipants.length === 0) {
        this.$message.warning('请选择参会人员');
        return;
      }

      // Submit
      this.$message.success('申请上会成功');
      this.visibleInternal = false;
    }
  }
};
</script>

<style scoped lang="scss">
.meeting-dialog {
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
  grid-template-columns: 320px 1fr;
  gap: 20px;
  height: 500px;

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
    overflow-y: auto;
    padding-right: 10px;

    ::v-deep {
      .el-form {
        .el-form-item {
          margin-bottom: 18px;

          &:last-child {
            margin-bottom: 0;
          }
        }

        .el-form-item__label {
          font-weight: 500;
          color: #606266;
        }
      }
    }

    .time-input-group {
      display: flex;
      align-items: center;
      gap: 8px;

      ::v-deep .el-date-editor {
        flex: 1;
      }

      .separator {
        color: #dcdfe6;
      }
    }

    .participant-section {
      display: flex;
      align-items: center;
      gap: 12px;

      .participant-text {
        flex: 1;
        font-size: 12px;
        color: #909399;
        word-break: break-word;
      }
    }
  }

  .right-section {
    display: flex;
    flex-direction: column;
    border: 1px solid #ebeef5;
    border-radius: 4px;
    overflow: hidden;

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
    height: auto;

    .right-section {
      height: 400px;
    }
  }
}
</style>
