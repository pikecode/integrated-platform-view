<template>
  <el-dialog
    title="发起任务"
    :model-value="modelValue"
    @update:model-value="(val) => $emit('update:modelValue', val)"
    width="1000px"
    append-to-body
    class="create-task-dialog"
  >
    <el-form :model="formData" label-width="120px" size="small">
      <!-- 任务信息 -->
      <div class="section">
        <div class="section-title">任务信息</div>

        <el-form-item label="任务名称:" required>
          <el-input
            v-model="formData.taskName"
            placeholder="请输入"
            maxlength="50"
            show-word-limit
            clearable
          />
        </el-form-item>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="任务来源:" required>
              <el-select
                v-model="formData.taskSource"
                placeholder="请选择任务来源"
                :loading="loadingTaskSource"
                @change="handleTaskSourceChange"
              >
                <el-option
                  v-for="item in taskSourceOptions"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="item.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="任务标签:" required>
              <el-select
                v-model="formData.taskNo"
                placeholder="请选择任务标签"
                :loading="loadingTaskTag"
                :disabled="!formData.taskSource"
              >
                <el-option
                  v-for="item in taskTagOptions"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="item.dictValue"
                />
              </el-select>
              <el-tooltip
                content="根据任务来源选择对应的任务标签"
                placement="top"
                class="help-icon"
              >
                <i class="el-icon-question"></i>
              </el-tooltip>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="任务内容:">
          <el-input
            v-model="formData.taskContent"
            type="textarea"
            placeholder="这是任务信息"
            :rows="4"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
      </div>

      <!-- 相关附件 -->
      <div class="section">
        <div class="section-title">相关附件</div>

        <div class="attachment-section">
          <el-button type="primary" @click="handleSelectFile">
            <i class="el-icon-upload"></i> 上传
          </el-button>
          <span class="attachment-tip">
            最多上传3个文件，单个文件不超过100MB，格式要求：doc/docx/xls/xlsx/pdf/png/jpg
          </span>

          <div class="attachment-list" v-if="formData.attachments.length > 0">
            <div v-for="(file, index) in formData.attachments" :key="index" class="attachment-item">
              <span class="file-name">{{ file.name }}</span>
              <span
                v-if="file.status === 'uploading'"
                class="upload-status uploading"
              >
                上传中...
              </span>
              <span
                v-else-if="file.status === 'success'"
                class="upload-status success"
              >
                ✓ 已上传
              </span>
              <span
                v-else-if="file.status === 'error'"
                class="upload-status error"
              >
                ✗ 上传失败
              </span>
              <div class="file-actions">
                <el-link
                  type="primary"
                  :underline="false"
                  @click="handlePreviewFile(file)"
                  :disabled="file.status !== 'success'"
                >
                  预览
                </el-link>
                <el-link
                  type="danger"
                  :underline="false"
                  @click="handleRemoveFile(index)"
                >
                  删除
                </el-link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 执行及配合信息 -->
      <div class="section">
        <div class="section-title">执行及配合信息</div>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-button type="primary" @click="handleSelectExecutor">
              选择执行科室及人员
            </el-button>
            <div class="executor-list">
              <div
                v-for="(person, index) in formData.executors"
                :key="`executor-${index}`"
                class="executor-item"
              >
                <span class="item-text">
                  {{ person.deptName }}：{{ person.name }}
                </span>
                <div class="item-actions">
                  <el-link type="danger" :underline="false" @click="handleRemoveExecutor(index)">
                    删除
                  </el-link>
                </div>
              </div>
            </div>
          </el-col>

          <el-col :span="12">
            <el-button type="primary" @click="handleSelectCooperator">
              选择配合科室及人员
            </el-button>
            <div class="cooperator-list">
              <div
                v-for="(person, index) in formData.cooperators"
                :key="`cooperator-${index}`"
                class="cooperator-item"
              >
                <span class="item-text">
                  {{ person.deptName }}：{{ person.name }}
                </span>
                <div class="item-actions">
                  <el-link type="danger" :underline="false" @click="handleRemoveCooperator(index)">
                    删除
                  </el-link>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>

      <!-- 时间信息 -->
      <div class="section">
        <div class="section-title">时间信息</div>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="预计完成时间:" required>
              <div class="time-input-group">
                <el-date-picker
                  v-model="formData.expectedCompleteDate"
                  type="date"
                  placeholder="选择时间 格式：yyyy-mm-dd"
                  value-format="YYYY-MM-DD"
                  style="flex: 1"
                />
                <el-select
                  v-model="formData.expectedCompleteTime"
                  placeholder="....."
                  style="width: 100px; margin-left: 10px"
                >
                  <el-option label="00:00" value="00:00" />
                  <el-option label="12:00" value="12:00" />
                  <el-option label="24:00" value="24:00" />
                </el-select>
              </div>
              <el-tooltip
                content="截止为24:00，支持逆到其他时间"
                placement="top"
                class="help-tooltip"
              >
                <i class="el-icon-question"></i>
              </el-tooltip>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="任务截止时间:" required>
              <div class="time-input-group">
                <el-date-picker
                  v-model="formData.deadlineDate"
                  type="date"
                  placeholder="选择时间 格式：yyyy-mm-dd"
                  value-format="YYYY-MM-DD"
                  style="flex: 1"
                />
                <el-select
                  v-model="formData.deadlineTime"
                  placeholder="....."
                  style="width: 100px; margin-left: 10px"
                >
                  <el-option label="00:00" value="00:00" />
                  <el-option label="12:00" value="12:00" />
                  <el-option label="24:00" value="24:00" />
                </el-select>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>

    <!-- 底部按钮 -->
    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSubmit" :loading="submitting">
        确定
      </el-button>
    </template>

    <!-- 选择执行人员对话框 -->
    <select-person-dialog
      v-model="showSelectExecutorDialog"
      :title="'选择执行科室及人员'"
      :selected="formData.executors"
      @confirm="handleExecutorDialogConfirm"
    />

    <!-- 选择配合人员对话框 -->
    <select-person-dialog
      v-model="showSelectCooperatorDialog"
      :title="'选择配合科室及人员'"
      :selected="formData.cooperators"
      @confirm="handleCooperatorDialogConfirm"
    />
  </el-dialog>
</template>

<script>
import SelectPersonDialog from './select-person-dialog.vue';
import * as taskApi from '@/api/decision/task';

export default {
  name: 'CreateTaskDialog',
  components: {
    SelectPersonDialog
  },
  props: {
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue', 'submit'],
  data() {
    return {
      submitting: false,
      loadingTaskSource: false,
      loadingTaskTag: false,
      showSelectExecutorDialog: false,
      showSelectCooperatorDialog: false,
      taskSourceOptions: [], // 任务来源选项
      taskTagOptions: [], // 任务标签选项
      formData: {
        taskName: '',
        taskSource: '',
        taskNo: '',
        taskContent: '',
        attachments: [],
        executors: [], // [{ id, name, deptId, deptName }, ...]
        cooperators: [], // [{ id, name, deptId, deptName }, ...]
        expectedCompleteDate: null,
        expectedCompleteTime: '24:00',
        deadlineDate: null,
        deadlineTime: '24:00'
      }
    };
  },
  watch: {
    modelValue(val) {
      if (val) {
        this.initForm();
        this.loadTaskSource();
      }
    },
    'formData.taskSource'(newVal) {
      if (newVal) {
        this.loadTaskTag(newVal);
      } else {
        this.taskTagOptions = [];
        this.formData.taskNo = '';
      }
    }
  },
  methods: {
    loadTaskSource() {
      this.loadingTaskSource = true;
      taskApi.getDictionary('oatask_rwly')
        .then(response => {
          console.log('【任务来源】API响应:', response);
          if (response.data && response.data.code === 200) {
            this.taskSourceOptions = response.data.data || [];
          } else {
            const errorMsg = response.data?.msg || '加载任务来源失败';
            console.error('【任务来源】错误:', errorMsg);
            this.$message.error(errorMsg);
          }
        })
        .catch(error => {
          console.error('【任务来源】请求异常:', error);
          this.$message.error('加载任务来源失败，请检查网络连接');
        })
        .finally(() => {
          this.loadingTaskSource = false;
        });
    },

    loadTaskTag(sourceValue) {
      this.loadingTaskTag = true;
      this.formData.taskNo = '';
      this.taskTagOptions = [];

      taskApi.getDictionary('oatask-rwbq')
        .then(response => {
          console.log('【任务标签】API响应:', response);
          if (response.data && response.data.code === 200) {
            this.taskTagOptions = response.data.data || [];
          } else {
            const errorMsg = response.data?.msg || '加载任务标签失败';
            console.error('【任务标签】错误:', errorMsg);
            this.$message.error(errorMsg);
          }
        })
        .catch(error => {
          console.error('【任务标签】请求异常:', error);
          this.$message.error('加载任务标签失败，请检查网络连接');
        })
        .finally(() => {
          this.loadingTaskTag = false;
        });
    },
    initForm() {
      this.formData = {
        taskName: '',
        taskSource: '',
        taskNo: '',
        taskContent: '',
        attachments: [],
        executors: [],
        cooperators: [],
        expectedCompleteDate: null,
        expectedCompleteTime: '24:00',
        deadlineDate: null,
        deadlineTime: '24:00'
      };
    },

    handleTaskSourceChange() {
      // 任务来源变化时，监听器会自动处理任务标签的加载
    },

    handleSelectFile() {
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = '.doc,.docx,.xls,.xlsx,.pdf,.png,.jpg';
      fileInput.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
          // 检查文件大小（100MB = 104857600字节）
          if (file.size > 104857600) {
            this.$message.error('单个文件不超过100MB');
            return;
          }

          // 检查附件数量
          if (this.formData.attachments.length >= 3) {
            this.$message.error('最多只能上传3个文件');
            return;
          }

          // 添加文件到列表并上传
          const attachmentItem = {
            name: file.name,
            file: file,
            size: file.size,
            status: 'uploading', // 'uploading' | 'success' | 'error'
            attachmentId: null
          };

          this.formData.attachments.push(attachmentItem);

          // 上传文件到服务器
          taskApi.uploadAttachment(file)
            .then(response => {
              console.log('【文件上传】API响应:', response);

              if (response.data && response.data.code === 200) {
                attachmentItem.status = 'success';
                attachmentItem.attachmentId = response.data.data?.id || response.data.data;
                console.log('【文件上传】✓ 上传成功，ID:', attachmentItem.attachmentId);
              } else {
                attachmentItem.status = 'error';
                const errorMsg = response.data?.msg || '上传文件失败';
                console.error('【文件上传】✗ 服务器返回错误:', response.data);
                this.$message.error(errorMsg);
              }
            })
            .catch(error => {
              console.error('【文件上传】✗ 请求异常:', error);
              attachmentItem.status = 'error';

              let errorMsg = '上传文件失败';
              if (!error.response) {
                errorMsg = '无法连接到服务器，请检查网络';
              } else {
                const status = error.response.status;
                switch (status) {
                  case 401:
                    errorMsg = '认证失败，请检查登录状态';
                    break;
                  case 403:
                    errorMsg = '没有权限上传文件';
                    break;
                  case 404:
                    errorMsg = '接口地址不存在';
                    break;
                  case 413:
                    errorMsg = '文件过大';
                    break;
                  case 500:
                    errorMsg = '服务器错误，请稍后重试';
                    break;
                  default:
                    errorMsg = `上传失败 (HTTP ${status})`;
                }
              }

              this.$message.error(errorMsg);
            });
        }
      };
      fileInput.click();
    },

    handlePreviewFile(file) {
      this.$message.info(`预览功能开发中: ${file.name}`);
    },

    handleRemoveFile(index) {
      this.formData.attachments.splice(index, 1);
    },

    // 选择执行科室及人员
    handleSelectExecutor() {
      this.showSelectExecutorDialog = true;
    },

    handleRemoveExecutor(index) {
      this.formData.executors.splice(index, 1);
    },

    // 选择配合科室及人员
    handleSelectCooperator() {
      this.showSelectCooperatorDialog = true;
    },

    handleRemoveCooperator(index) {
      this.formData.cooperators.splice(index, 1);
    },

    // 执行人员选择对话框的确认回调
    handleExecutorDialogConfirm(selectedPersons) {
      this.formData.executors = selectedPersons;
      this.showSelectExecutorDialog = false;
    },

    // 配合人员选择对话框的确认回调
    handleCooperatorDialogConfirm(selectedPersons) {
      this.formData.cooperators = selectedPersons;
      this.showSelectCooperatorDialog = false;
    },

    handleClose() {
      this.$emit('update:modelValue', false);
    },

    handleSubmit() {
      // 表单验证
      if (!this.formData.taskName.trim()) {
        this.$message.warning('请输入任务名称');
        return;
      }

      if (!this.formData.taskSource) {
        this.$message.warning('请选择任务来源');
        return;
      }

      if (!this.formData.taskNo) {
        this.$message.warning('请选择任务编号');
        return;
      }

      if (!this.formData.expectedCompleteDate) {
        this.$message.warning('请选择预计完成时间');
        return;
      }

      if (!this.formData.deadlineDate) {
        this.$message.warning('请选择任务截止时间');
        return;
      }

      if (this.formData.executors.length === 0) {
        this.$message.warning('请至少选择一个执行人员');
        return;
      }

      // 检查是否有上传失败的文件
      const failedAttachments = this.formData.attachments.filter(a => a.status === 'error');
      if (failedAttachments.length > 0) {
        this.$message.warning('请删除上传失败的文件后重试');
        return;
      }

      // 检查是否有正在上传的文件
      const uploadingAttachments = this.formData.attachments.filter(a => a.status === 'uploading');
      if (uploadingAttachments.length > 0) {
        this.$message.warning('请等待所有文件上传完成后再提交');
        return;
      }

      this.submitting = true;

      // 转换时间格式为 YYYY-MM-DD HH:MM:SS
      const formatDateTime = (date, time) => {
        if (!date) return null;
        let hour = time.split(':')[0];
        let minute = time.split(':')[1] || '00';

        // 处理 24:00 的情况，转换为下一天的 00:00
        let dateObj = new Date(date);
        if (hour === '24') {
          dateObj.setDate(dateObj.getDate() + 1);
          hour = '00';
        }

        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');

        return `${year}-${month}-${day} ${hour}:${minute}:00`;
      };

      // 构建接收人列表
      const receiverList = [];

      // 添加执行人 (receiverType = 1)
      this.formData.executors.forEach(person => {
        receiverList.push({
          deptId: person.deptId,
          deptName: person.deptName,
          userId: person.id,
          userName: person.name,
          receiverType: '1'
        });
      });

      // 添加配合人 (receiverType = 2)
      this.formData.cooperators.forEach(person => {
        receiverList.push({
          deptId: person.deptId,
          deptName: person.deptName,
          userId: person.id,
          userName: person.name,
          receiverType: '2'
        });
      });

      // 构建提交数据
      const submitData = {
        taskName: this.formData.taskName,
        taskSourceId: this.formData.taskSource,
        taskSourceName: this.getTaskSourceName(this.formData.taskSource),
        taskTagId: this.formData.taskNo,
        taskTagName: this.getTaskTagName(this.formData.taskNo),
        taskContent: this.formData.taskContent,
        taskType: '1', // 默认值，可根据需要更改
        expectFinishTime: formatDateTime(this.formData.expectedCompleteDate, this.formData.expectedCompleteTime),
        deadlineTime: formatDateTime(this.formData.deadlineDate, this.formData.deadlineTime),
        attachmentIdList: this.formData.attachments
          .filter(a => a.status === 'success' && a.attachmentId)
          .map(a => a.attachmentId),
        receiverList: receiverList
      };

      console.log('【任务发起】提交数据:', submitData);

      // 调用API提交任务
      taskApi.publishTask(submitData)
        .then(response => {
          console.log('【任务发起】API响应:', response);

          if (response.data && response.data.code === 200) {
            this.$message.success('任务发起成功');
            this.$emit('update:modelValue', false);
            this.$emit('submit', submitData);
          } else {
            const errorMsg = response.data?.msg || '发起任务失败';
            this.$message.error(errorMsg);
          }
        })
        .catch(error => {
          console.error('【任务发起】请求异常:', error);
          let errorMsg = '发起任务失败';

          if (!error.response) {
            errorMsg = '无法连接到服务器，请检查网络和API地址';
          } else {
            const status = error.response.status;
            switch (status) {
              case 401:
                errorMsg = '认证失败，请检查登录状态';
                break;
              case 403:
                errorMsg = '没有权限发起任务';
                break;
              case 404:
                errorMsg = '接口地址不存在';
                break;
              case 500:
                errorMsg = '服务器错误，请稍后重试';
                break;
              default:
                errorMsg = `请求失败 (HTTP ${status})`;
            }
          }

          this.$message.error(errorMsg);
        })
        .finally(() => {
          this.submitting = false;
        });
    },

    // 获取任务来源名称
    getTaskSourceName(value) {
      const option = this.taskSourceOptions.find(item => item.dictValue === value);
      return option ? option.dictLabel : value;
    },

    // 获取任务标签名称
    getTaskTagName(value) {
      const option = this.taskTagOptions.find(item => item.dictValue === value);
      return option ? option.dictLabel : value;
    }
  }
};
</script>

<style scoped lang="scss">
.create-task-dialog {
  ::v-deep .el-dialog {
    .el-dialog__body {
      padding: 20px;
      max-height: 600px;
      overflow-y: auto;
    }
  }

  .section {
    margin-bottom: 20px;

    .section-title {
      font-size: 14px;
      font-weight: 600;
      color: #333;
      margin-bottom: 15px;
      padding-bottom: 10px;
      border-bottom: 1px solid #e5e5e5;
    }
  }

  ::v-deep .el-form-item {
    margin-bottom: 16px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .help-icon {
    margin-left: 8px;
    cursor: pointer;
    color: #666;
  }

  .attachment-section {
    .attachment-tip {
      font-size: 12px;
      color: #999;
      margin-left: 10px;
    }

    .attachment-list {
      margin-top: 12px;
      padding: 8px;
      background-color: #f9f9f9;
      border: 1px solid #e5e5e5;
      border-radius: 4px;

      .attachment-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 0;
        font-size: 12px;

        &:not(:last-child) {
          border-bottom: 1px solid #f0f0f0;
        }

        .file-name {
          color: #0066cc;
          flex: 1;
        }

        .upload-status {
          font-size: 11px;
          margin-left: 8px;
          padding: 2px 6px;
          border-radius: 3px;
          white-space: nowrap;

          &.uploading {
            color: #ff9500;
            background-color: #fff7e6;
          }

          &.success {
            color: #52c41a;
            background-color: #f6ffed;
          }

          &.error {
            color: #ff4d4f;
            background-color: #fff1f0;
          }
        }

        .file-actions {
          display: flex;
          gap: 12px;
          margin-left: 10px;
        }
      }
    }
  }

  .executor-list,
  .cooperator-list {
    margin-top: 12px;

    .executor-item,
    .cooperator-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 12px;
      background-color: #f0f5ff;
      border: 1px solid #d9e8ff;
      border-radius: 4px;
      font-size: 12px;
      margin-bottom: 8px;

      &:last-child {
        margin-bottom: 0;
      }

      .item-text {
        flex: 1;
        word-break: break-word;
      }

      .item-actions {
        display: flex;
        gap: 12px;
        margin-left: 10px;
        white-space: nowrap;
        flex-shrink: 0;
      }
    }
  }

  .time-input-group {
    display: flex;
    align-items: center;
    gap: 10px;

    ::v-deep .el-date-editor {
      flex: 1;
    }
  }

  .help-tooltip {
    margin-left: 8px;
    cursor: pointer;
    color: #666;
  }
}
</style>
