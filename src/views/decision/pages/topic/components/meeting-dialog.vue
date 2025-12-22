<template>
  <el-dialog
    title="申请上会"
    :model-value="modelValue"
    @update:model-value="(val) => $emit('update:modelValue', val)"
    width="1200px"
    append-to-body
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

    </div>

    <!-- 底部操作按钮 -->
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit">申请上会</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { defineComponent } from 'vue';
import * as topicApi from '@/api/decision/topic';

export default defineComponent({
  name: 'MeetingDialog',
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
      loading: false,
      formData: {
        id: '',
        meetingType: '',
        meetingName: '',
        startTime: null,
        endTime: null,
        meetingForm: '',
        participants: []
      },
      selectedParticipants: [],
      topicTotal: 0
    };
  },
  watch: {
    modelValue(val) {
      if (val) {
        this.initForm();
      }
    },
    meetingData: {
      handler(newVal) {
        if (newVal && this.modelValue) {
          this.initForm();
        }
      },
      deep: true
    }
  },
  methods: {
    initForm() {
      if (this.meetingData && this.meetingData.meetingName) {
        // 优先使用 _raw 中的原始数据
        const rawData = this.meetingData._raw || this.meetingData;

        this.formData = {
          id: this.meetingData.id || '',
          meetingType: this.meetingData.meetingType || '',
          meetingName: this.meetingData.meetingName || this.meetingData.agendaName || '',
          startTime: rawData.startTime ? rawData.startTime.split(' ')[0] : null,
          endTime: rawData.endTime ? rawData.endTime.split(' ')[0] : null,
          meetingForm: this.meetingData.meetingForm || this.meetingData.meetingFormDesc || '',
          participants: this.meetingData.participants || []
        };
        this.selectedParticipants = [...(this.meetingData.participants || [])];
      } else {
        this.formData = {
          id: '',
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

    handleMeetingTypeChange(val) {
      // Can add logic here to handle meeting type change
    },

    handleSelectParticipants() {
      // This would typically open a user selection dialog
      this.$message.info('选择人员功能开发中');
    },

    handleClose(val) {
      this.$emit('update:modelValue', false);
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

      this.loading = true;
      try {
        // 构建API请求数据
        const submitData = {
          id: this.formData.id,
          meetingType: this.formData.meetingType,
          agendaName: this.formData.meetingName,
          meetingForm: this.formData.meetingForm,
          startTime: this.formatTimeToISO(this.formData.startTime),
          endTime: this.formatTimeToISO(this.formData.endTime)
        };

        topicApi.updateAgenda(submitData).then(res => {
          if (res.data && res.data.code === 200 && res.data.success) {
            this.$message.success('修改会议信息成功');
            this.$emit('update:modelValue', false);
            // 触发刷新列表
            this.$emit('refresh');
          } else {
            this.$message.error(res.data.msg || '修改会议信息失败');
          }
        }).catch(error => {
          console.error('修改会议信息失败：', error);
          this.$message.error('修改会议信息失败');
        }).finally(() => {
          this.loading = false;
        });
      } catch (error) {
        console.error('修改会议信息失败：', error);
        this.$message.error('修改会议信息失败');
        this.loading = false;
      }
    },

    formatTimeToISO(dateStr) {
      // 将 YYYY-MM-DD 转换为 ISO 8601 格式
      if (!dateStr) return null;
      // 添加时间部分，格式为午夜时间
      return `${dateStr}T00:00:00.000Z`;
    }
  }
});
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
  display: block;

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
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;

  ::v-deep .el-button {
    min-width: 80px;
  }
}

</style>
