<template>
  <el-dialog
    title="反馈"
    v-model="visible"
    width="600px"
    @close="handleClose"
  >
    <div class="feedback-dialog-content">
      <!-- 任务反馈 -->
      <div class="form-item">
        <label class="form-label">任务反馈：</label>
        <el-input
          v-model="form.feedback"
          type="textarea"
          rows="4"
          placeholder="请输入任务反馈"
          maxlength="200"
          show-word-limit
          class="feedback-textarea"
        />
      </div>

      <!-- 相关附件 -->
      <div class="form-item">
        <label class="form-label">相关附件：</label>
        <div class="upload-section">
          <el-upload
            ref="uploadRef"
            :http-request="handleUpload"
            :before-upload="beforeUpload"
            :file-list="fileList"
            :on-remove="handleRemove"
            :show-file-list="false"
            :auto-upload="true"
            :limit="3"
            :on-exceed="handleExceed"
          >
            <el-button type="primary">上传</el-button>
          </el-upload>
          <span class="upload-tip">最多上传3个文件，单个文件不超过100MB，格式要求</span>
        </div>

        <!-- 文件列表 -->
        <div v-if="fileList.length > 0" class="file-list">
          <div
            v-for="(file, index) in fileList"
            :key="index"
            class="file-item"
          >
            <span class="file-name">{{ file.name }}</span>
            <div class="file-actions">
              <el-button type="text" size="small" @click="handlePreview(file)">
                预览
              </el-button>
              <el-button type="text" size="small" class="delete-btn" @click="handleRemove(file)">
                删除
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <el-button type="primary" @click="handleSubmit">提交反馈</el-button>
      <el-button @click="handleClose">取消</el-button>
    </template>
  </el-dialog>
</template>

<script>
import request from '@/axios';

export default {
  name: 'FeedbackDialog',
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
        feedback: ''
      },
      fileList: []
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
    // 自定义上传方法
    handleUpload(options) {
      const { file } = options;
      const formData = new FormData();
      formData.append('file', file);

      request({
        url: '/api/xinhui-oa-task/api/attachment/v1/upload',
        method: 'post',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        meta: { isToken: true }
      })
        .then(response => {
          console.log('【文件上传】成功:', response);
          if (response.data && response.data.code === 200) {
            this.fileList.push({
              name: file.name,
              url: response.data.data.url || response.data.data.link,
              id: response.data.data.id
            });
            this.$message.success('文件上传成功');
          } else {
            this.$message.error(response.data?.msg || '文件上传失败');
          }
        })
        .catch(error => {
          console.error('【文件上传】失败:', error);
          this.$message.error('文件上传失败');
        });
    },

    beforeUpload(file) {
      // 检查文件大小（100MB = 100 * 1024 * 1024 bytes）
      const isLt100M = file.size / 1024 / 1024 < 100;
      if (!isLt100M) {
        this.$message.error('上传文件大小不能超过 100MB!');
        return false;
      }
      return true;
    },

    handleExceed() {
      this.$message.warning('最多只能上传3个文件');
    },

    handleRemove(file) {
      const index = this.fileList.findIndex(item => item.name === file.name);
      if (index > -1) {
        this.fileList.splice(index, 1);
      }
    },

    handlePreview(file) {
      if (file.url) {
        window.open(file.url, '_blank');
      } else {
        this.$message.info('文件预览功能开发中');
      }
    },

    handleSubmit() {
      if (!this.form.feedback.trim()) {
        this.$message.warning('请输入任务反馈');
        return;
      }

      const feedbackData = {
        taskId: this.taskData.id,
        feedbackContent: this.form.feedback,
        attachmentIdList: this.fileList.map(file => file.id).filter(id => id)
      };

      this.$emit('submit', feedbackData);
      this.handleClose();
    },

    handleClose() {
      this.form.feedback = '';
      this.fileList = [];
      this.visible = false;
    }
  }
};
</script>

<style scoped lang="scss">
.feedback-dialog-content {
  .form-item {
    margin-bottom: 20px;

    .form-label {
      display: block;
      font-size: 14px;
      font-weight: 500;
      color: #333;
      margin-bottom: 8px;
    }

    .feedback-textarea {
      ::v-deep .el-textarea__inner {
        border: 1px solid #dcdfe4;
        border-radius: 4px;
      }
    }

    .upload-section {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;

      .upload-tip {
        font-size: 12px;
        color: #999;
      }
    }

    .file-list {
      border: 1px solid #ebeef5;
      border-radius: 4px;
      padding: 8px;
      background: #fafafa;

      .file-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 12px;
        border-bottom: 1px solid #ebeef5;

        &:last-child {
          border-bottom: none;
        }

        .file-name {
          flex: 1;
          font-size: 14px;
          color: #409eff;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .file-actions {
          display: flex;
          gap: 8px;

          .el-button {
            padding: 0;
            margin: 0;
          }

          .delete-btn {
            color: #f56c6c;

            &:hover {
              color: #f56c6c;
            }
          }
        }
      }
    }
  }
}
</style>
