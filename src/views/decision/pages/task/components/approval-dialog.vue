<template>
  <el-dialog
    title="审批任务"
    v-model="visible"
    width="500px"
    @close="handleClose"
  >
    <!-- 当前审批类型 -->
    <div class="approval-item">
      <label class="approval-label">当前审批类型：</label>
      <div class="approval-value">任务审批</div>
    </div>

    <!-- 审批意见 -->
    <div class="approval-item">
      <label class="approval-label">审批意见：</label>
      <el-input
        v-model="form.opinion"
        type="textarea"
        rows="6"
        placeholder="请输入审批意见"
        class="approval-textarea"
      />
    </div>

    <!-- 审批结果 -->
    <div class="approval-item">
      <label class="approval-label">审批结果：</label>
      <div class="approval-buttons">
        <el-button type="primary" @click="handleApprove('agree')">
          同意
        </el-button>
        <el-button type="danger" @click="handleApprove('reject')">
          拒绝
        </el-button>
      </div>
    </div>

    <template #footer>
      <el-button @click="handleClose">取消</el-button>
    </template>
  </el-dialog>
</template>

<script>
export default {
  name: 'ApprovalDialog',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    taskData: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      form: {
        opinion: ''
      }
    };
  },
  computed: {
    visible: {
      get() {
        return this.modelValue;
      },
      set(val) {
        this.$emit('update:modelValue', val);
      }
    }
  },
  methods: {
    handleApprove(result) {
      if (!this.form.opinion.trim()) {
        this.$message.warning('请输入审批意见');
        return;
      }

      // 审批状态: 11-同意、12-拒绝
      const approvalData = {
        taskId: this.taskData.id,
        approvalSyncId: this.taskData.approvalSyncId || '',
        approvalStatus: result === 'agree' ? '11' : '12',
        approvalOpinion: this.form.opinion
      };

      this.$emit('submit', approvalData);
      this.handleClose();
    },

    handleClose() {
      this.form.opinion = '';
      this.visible = false;
    }
  }
};
</script>

<style scoped lang="scss">
.approval-item {
  margin-bottom: 20px;

  .approval-label {
    display: block;
    font-size: 14px;
    font-weight: 500;
    color: #333;
    margin-bottom: 8px;
  }

  .approval-value {
    font-size: 14px;
    color: #666;
    padding: 8px 0;
  }

  .approval-textarea {
    ::v-deep .el-textarea__inner {
      border: 1px solid #dcdfe4;
      border-radius: 4px;
    }
  }

  .approval-buttons {
    display: flex;
    gap: 12px;

    .el-button {
      flex: 1;
      height: 36px;
      font-size: 14px;
    }
  }
}
</style>
