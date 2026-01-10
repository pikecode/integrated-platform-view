<template>
  <el-dialog
    title="审批议题"
    :model-value="modelValue"
    @update:model-value="(val) => $emit('update:modelValue', val)"
    width="700px"
    append-to-body
    class="approval-dialog"
  >
    <!-- 议题信息 -->
    <div class="section">
      <div class="section-title">议题信息</div>
      <el-descriptions :column="2" border size="small">
        <el-descriptions-item label="议题名称">
          {{ currentTopic.title || '---' }}
        </el-descriptions-item>
        <el-descriptions-item label="申报科室">
          {{ currentTopic.department || '---' }}
        </el-descriptions-item>
        <el-descriptions-item label="当前审批节点">
          {{ currentTopic.approvalTaskName || '---' }}
        </el-descriptions-item>
        <el-descriptions-item label="议题状态">
          {{ currentTopic.statusDesc || '---' }}
        </el-descriptions-item>
      </el-descriptions>
    </div>

    <!-- 审批内容 -->
    <div class="section">
      <div class="section-title">审批内容</div>
      <el-form label-width="100px">
        <el-form-item label="审批结果：" required>
          <el-radio-group v-model="approvalForm.status">
            <el-radio label="11">同意</el-radio>
            <el-radio label="12">拒绝</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="审批意见：" required>
          <el-input
            v-model="approvalForm.opinion"
            type="textarea"
            placeholder="请输入审批意见（至少1个字符）"
            :rows="6"
            maxlength="2000"
            show-word-limit
          />
        </el-form-item>
      </el-form>
    </div>

    <!-- 底部按钮 -->
    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSubmit" :loading="submitting">
        确定
      </el-button>
    </template>
  </el-dialog>
</template>

<script>
import { approveTopicApproval } from '@/api/decision/topic';

export default {
  name: 'ApprovalDialog',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    currentTopic: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['update:modelValue', 'submit'],
  data() {
    return {
      submitting: false,
      approvalForm: {
        status: '11',  // 默认选择同意
        opinion: ''
      }
    };
  },
  watch: {
    modelValue(val) {
      if (val) {
        this.initForm();
      }
    }
  },
  methods: {
    initForm() {
      this.approvalForm = {
        status: '11',
        opinion: ''
      };
    },

    handleClose() {
      this.$emit('update:modelValue', false);
    },

    handleSubmit() {
      // 验证审批意见
      if (!this.approvalForm.opinion.trim()) {
        this.$message.warning('请输入审批意见');
        return;
      }

      if (this.approvalForm.opinion.trim().length < 1) {
        this.$message.warning('审批意见至少需要1个字符');
        return;
      }

      this.submitApproval();
    },

    submitApproval() {
      this.submitting = true;

      const submitData = {
        topicId: this.currentTopic.id,
        approvalSyncId: this.currentTopic.approvalSyncId,
        approvalStatus: this.approvalForm.status,
        approvalOpinion: this.approvalForm.opinion.trim()
      };

      approveTopicApproval(submitData)
        .then(res => {
          if (res.data && res.data.code === 200) {
            const statusText = this.approvalForm.status === '11' ? '同意' : '拒绝';
            this.$message.success(`审批${statusText}成功`);
            this.$emit('update:modelValue', false);
            this.$emit('submit', this.approvalForm);
          } else {
            this.$message.error(res.data?.msg || '审批失败');
          }
        })
        .catch(err => {
          console.error('审批出错:', err);
          this.$message.error('审批出错，请重试');
        })
        .finally(() => {
          this.submitting = false;
        });
    }
  }
};
</script>

<style scoped lang="scss">
.approval-dialog {
  ::v-deep .el-dialog {
    .el-dialog__body {
      padding: 20px;
    }
  }

  .section {
    margin-bottom: 25px;

    .section-title {
      font-size: 14px;
      font-weight: 600;
      color: #333;
      margin-bottom: 15px;
      padding-bottom: 10px;
      border-bottom: 1px solid #e5e5e5;
    }

    ::v-deep .el-descriptions {
      background-color: #f5f7fa;
      border-radius: 4px;

      .el-descriptions__header {
        background-color: transparent;
      }

      .el-descriptions__body {
        background-color: transparent;
      }
    }
  }

  ::v-deep .el-form-item {
    margin-bottom: 20px;

    &:last-child {
      margin-bottom: 0;
    }

    .el-radio {
      margin-right: 20px;
    }
  }

  ::v-deep .el-input__wrapper {
    background-color: #fff;
  }
}
</style>
