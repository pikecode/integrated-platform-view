<template>
  <el-dialog
    title="录入会议结论"
    :model-value="modelValue"
    @update:model-value="(val) => $emit('update:modelValue', val)"
    width="750px"
    append-to-body
    class="conclusion-dialog"
  >
    <!-- 议题信息 -->
    <div class="section">
      <div class="section-title">议题信息</div>
      <el-table :data="topicInfo" stripe style="width: 100%">
        <el-table-column prop="topicName" label="议题名称" />
        <el-table-column prop="applyDept" label="申请科室" width="120" />
        <el-table-column prop="deptDirector" label="申请科室主任" width="120" />
      </el-table>
    </div>

    <!-- 议题结论 -->
    <div class="section">
      <div class="section-title">议题结论</div>
      <el-form label-width="100px">
        <el-form-item label="结论内容：" required>
          <el-input
            v-model="conclusionForm.content"
            type="textarea"
            placeholder="请输入议题结论内容"
            :rows="6"
            maxlength="2000"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="相关附件：">
          <div class="attachment-section">
            <span class="attachment-tip">（最多上传3个文件，单个文件不超过100mb）</span>
            <div class="attachment-list">
              <div v-for="(file, index) in conclusionForm.attachments" :key="index" class="attachment-item">
                <span>{{ file.name }}</span>
                <el-icon class="remove-icon" @click="removeAttachment(index)">
                  <Close />
                </el-icon>
              </div>
            </div>
            <el-button
              v-if="conclusionForm.attachments.length < 3"
              type="primary"
              size="small"
              @click="handleSelectFile"
            >
              选择文件
            </el-button>
            <a href="#" class="template-link">议题导入文件.xls</a>
          </div>
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
import { Close } from '@element-plus/icons-vue';
import { submitTopicConclusion, uploadAttachment } from '@/api/decision/topic';

export default {
  name: 'ConclusionDialog',
  components: {
    Close
  },
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
      conclusionForm: {
        content: '',
        attachments: []
      }
    };
  },
  computed: {
    topicInfo() {
      if (!this.currentTopic || !this.currentTopic.id) {
        return [];
      }
      return [{
        topicName: this.currentTopic.topicName || '',
        applyDept: this.currentTopic.applyDeptName || this.currentTopic.department || '',
        deptDirector: this.currentTopic.applyDeptDirectorName || this.currentTopic.deptDirector || ''
      }];
    }
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
      this.conclusionForm = {
        content: '',
        attachments: []
      };
    },

    handleSelectFile() {
      // 创建文件输入元素
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = '*/*';
      fileInput.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
          // 检查文件大小（100MB = 104857600字节）
          if (file.size > 104857600) {
            this.$message.error('单个文件不超过100mb');
            return;
          }

          // 检查附件数量
          if (this.conclusionForm.attachments.length >= 3) {
            this.$message.error('最多只能上传3个文件');
            return;
          }

          // 添加文件
          this.conclusionForm.attachments.push({
            name: file.name,
            file: file,
            size: file.size
          });
        }
      };
      fileInput.click();
    },

    removeAttachment(index) {
      this.conclusionForm.attachments.splice(index, 1);
    },

    handleClose() {
      this.$emit('update:modelValue', false);
    },

    handleSubmit() {
      // 验证表单
      if (!this.conclusionForm.content.trim()) {
        this.$message.warning('请输入议题结论内容');
        return;
      }

      this.submitting = true;

      // 如果有文件附件，先上传文件
      if (this.conclusionForm.attachments.length > 0) {
        this.uploadFilesAndSubmit();
      } else {
        this.submitConclusion([]);
      }
    },

    uploadFilesAndSubmit() {
      // 并行上传所有文件
      const uploadPromises = this.conclusionForm.attachments.map(attachment => {
        return uploadAttachment(attachment.file)
          .then(res => {
            if (res.data && res.data.code === 200) {
              // 返回上传后的文件ID
              return res.data.data?.id || res.data.data;
            } else {
              throw new Error(res.data?.message || '文件上传失败');
            }
          });
      });

      Promise.all(uploadPromises)
        .then(fileIds => {
          // 所有文件上传成功，提交结论
          this.submitConclusion(fileIds);
        })
        .catch(err => {
          console.error('文件上传失败:', err);
          this.$message.error('文件上传失败，请重试');
          this.submitting = false;
        });
    },

    submitConclusion(fileIds) {
      // 构建结论提交数据，根据 API 文档
      const submitData = {
        topicId: this.currentTopic.id,
        conclusionContent: this.conclusionForm.content,  // API 要求字段名为 conclusionContent
        attachments: fileIds  // attachments 是文件ID数组
      };

      // 调用API提交结论
      submitTopicConclusion(submitData)
        .then(res => {
          if (res.data && res.data.code === 200) {
            this.$message.success('结论录入成功');
            this.$emit('update:modelValue', false);
            this.$emit('submit', this.conclusionForm);
          } else {
            this.$message.error(res.data?.message || '提交结论失败');
          }
        })
        .catch(err => {
          console.error('提交结论出错:', err);
          this.$message.error('提交结论出错，请重试');
        })
        .finally(() => {
          this.submitting = false;
        });
    }
  }
};
</script>

<style scoped lang="scss">
.conclusion-dialog {
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

    .el-table {
      border: 1px solid #e5e5e5;
      border-radius: 4px;

      :deep(.el-table__header-wrapper) {
        background-color: #f5f5f5;
      }
    }
  }

  .attachment-section {
    display: flex;
    flex-direction: column;
    gap: 10px;

    .attachment-tip {
      font-size: 12px;
      color: #999;
    }

    .attachment-list {
      max-height: 150px;
      overflow-y: auto;
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 8px;
      background-color: #fafafa;

      .attachment-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 6px;
        font-size: 12px;
        line-height: 1.5;

        .remove-icon {
          cursor: pointer;
          color: #f56c6c;
          font-size: 14px;

          &:hover {
            color: #dd001b;
          }
        }
      }
    }

    .template-link {
      font-size: 12px;
      color: #0066cc;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }

  ::v-deep .el-form-item {
    margin-bottom: 20px;

    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
