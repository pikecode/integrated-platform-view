<template>
  <el-dialog
    title="申请上会"
    :model-value="modelValue"
    @update:model-value="(val) => $emit('update:modelValue', val)"
    width="1400px"
    append-to-body
    class="apply-meeting-dialog"
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
            >
              <el-option label="院长办公会" value="10" />
              <el-option label="党委会" value="20" />
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

      <!-- 右侧：议题信息表格 -->
      <div class="right-section">
        <div class="section-title">议题信息</div>
        <el-table
          :data="topicTableData"
          stripe
          style="width: 100%; height: 400px; overflow-y: auto;"
          size="small"
        >
          <el-table-column prop="index" label="序号" width="50" />
          <el-table-column
            prop="topicName"
            label="议题名称"
            show-overflow-tooltip
          />
          <el-table-column prop="applyDept" label="申请科室" width="100" />
          <el-table-column
            prop="deptDirector"
            label="申请科室主任"
            width="120"
          />
          <el-table-column label="操作" width="80" align="center">
            <template #default="{ row, $index }">
              <el-button
                type="text"
                size="small"
                style="color: #f56c6c"
                @click="handleRemoveTopic($index)"
              >
                移除
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination-container">
          <el-pagination
            :current-page="currentPage"
            :page-size="pageSize"
            :total="topicTotal"
            :page-sizes="[5, 10, 15, 20]"
            layout="prev, pager, next"
            @current-change="handlePageChange"
            @size-change="handlePageSizeChange"
          />
        </div>
      </div>
    </div>

    <!-- 底部操作按钮 -->
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="loading">
          申请上会
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { defineComponent } from 'vue';
import * as topicApi from '@/api/decision/topic';

export default defineComponent({
  name: 'ApplyMeetingDialog',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    selectedTopics: {
      type: Array,
      default: () => []
    }
  },
  emits: ['update:modelValue', 'refresh'],
  data() {
    return {
      loading: false,
      formData: {
        meetingType: '',
        meetingName: '',
        startTime: null,
        endTime: null,
        meetingForm: '',
        participants: []
      },
      selectedParticipants: [],
      topics: [], // 存储所有选中的议题
      currentPage: 1,
      pageSize: 5,
      topicTotal: 0
    };
  },
  computed: {
    // 根据分页计算当前页的表格数据
    topicTableData() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.topics.slice(start, end).map((topic, index) => ({
        ...topic,
        index: start + index + 1 // 显示序号
      }));
    }
  },
  watch: {
    modelValue(val) {
      if (val) {
        this.initDialog();
      }
    },
    selectedTopics(val) {
      if (val && val.length > 0) {
        this.topics = [...val];
        this.topicTotal = val.length;
      }
    }
  },
  methods: {
    initDialog() {
      // 初始化表单数据
      this.formData = {
        meetingType: '',
        meetingName: '',
        startTime: null,
        endTime: null,
        meetingForm: '线上',
        participants: []
      };
      this.selectedParticipants = [];
      this.topics = [...this.selectedTopics];
      this.topicTotal = this.topics.length;
      this.currentPage = 1;
    },

    handleSelectParticipants() {
      // TODO: 打开选择参会人员对话框
      this.$message.info('选择人员功能开发中');
    },

    handlePageChange(page) {
      this.currentPage = page;
    },

    handlePageSizeChange(size) {
      this.pageSize = size;
      this.currentPage = 1;
    },

    handleRemoveTopic(index) {
      const actualIndex = (this.currentPage - 1) * this.pageSize + index;
      this.topics.splice(actualIndex, 1);
      this.topicTotal = this.topics.length;

      // 如果当前页没有数据了，返回上一页
      if (this.topicTableData.length === 0 && this.currentPage > 1) {
        this.currentPage -= 1;
      }
    },

    handleClose() {
      this.$emit('update:modelValue', false);
    },

    handleSubmit() {
      // 表单验证
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
      if (this.topics.length === 0) {
        this.$message.warning('请至少选择一个议题');
        return;
      }

      this.loading = true;
      try {
        // TODO: 构建API请求数据并调用申请上会接口
        const submitData = {
          meetingType: this.formData.meetingType,
          meetingName: this.formData.meetingName,
          startTime: this.formData.startTime,
          endTime: this.formData.endTime,
          meetingForm: this.formData.meetingForm,
          participants: this.selectedParticipants,
          topicIds: this.topics.map(t => t.id) // 申请上会的议题ID列表
        };

        console.log('申请上会提交数据：', submitData);

        // 这里需要真实的API调用
        // await topicApi.applyMeeting(submitData);

        this.$message.success('申请上会成功');
        this.$emit('update:modelValue', false);
        this.$emit('refresh');
      } catch (error) {
        console.error('申请上会失败：', error);
        this.$message.error('申请上会失败');
      } finally {
        this.loading = false;
      }
    }
  }
});
</script>

<style scoped lang="scss">
.apply-meeting-dialog {
  ::v-deep .el-dialog {
    .el-dialog__body {
      padding: 20px;
    }
  }

  .dialog-content {
    display: flex;
    gap: 30px;
    height: 500px;

    .left-section,
    .right-section {
      flex: 1;
      display: flex;
      flex-direction: column;

      .section-title {
        font-size: 14px;
        font-weight: 600;
        color: #333;
        margin-bottom: 15px;
        padding-bottom: 10px;
        border-bottom: 1px solid #e5e5e5;
      }
    }

    .left-section {
      .el-form {
        .time-input-group {
          display: flex;
          align-items: center;
          gap: 10px;

          .separator {
            color: #999;
          }

          :deep(.el-date-picker) {
            width: 100%;
          }
        }

        .participant-section {
          display: flex;
          align-items: center;
          gap: 15px;

          .participant-text {
            color: #666;
            font-size: 12px;
          }
        }
      }
    }

    .right-section {
      .el-table {
        border: 1px solid #e5e5e5;
        border-radius: 4px;

        :deep(.el-table__header-wrapper) {
          background-color: #f5f5f5;
        }
      }

      .pagination-container {
        display: flex;
        justify-content: flex-end;
        margin-top: 15px;

        :deep(.el-pagination) {
          .btn-prev,
          .btn-next,
          .el-pager li {
            min-width: 32px;
            height: 32px;
            line-height: 32px;
          }
        }
      }
    }
  }

  .dialog-footer {
    text-align: right;
    padding-top: 15px;
    border-top: 1px solid #e5e5e5;

    .el-button {
      margin-left: 10px;
    }
  }
}
</style>
