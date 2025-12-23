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
                @change="handleTaskSourceChange"
              >
                <el-option label="议题" value="topic" />
                <el-option label="会议" value="meeting" />
                <el-option label="其他" value="other" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="任务编号:" required>
              <el-select
                v-model="formData.taskNo"
                placeholder="请选择任务来源"
                :disabled="!formData.taskSource"
              >
                <el-option label="选项1" value="no_1" />
                <el-option label="选项2" value="no_2" />
              </el-select>
              <el-tooltip
                content="任务来源ID任务编号数字开头配置"
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
              <div class="file-actions">
                <el-link type="primary" :underline="false" @click="handlePreviewFile(file)">
                  预览
                </el-link>
                <el-link type="danger" :underline="false" @click="handleRemoveFile(index)">
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
      showSelectExecutorDialog: false,
      showSelectCooperatorDialog: false,
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
      }
    }
  },
  methods: {
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
      // 任务来源变化时，重置任务编号
      this.formData.taskNo = '';
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

          // 添加文件
          this.formData.attachments.push({
            name: file.name,
            file: file,
            size: file.size
          });
          this.$message.success('文件添加成功');
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

      this.submitting = true;

      // 构建提交数据
      const submitData = {
        taskName: this.formData.taskName,
        taskSource: this.formData.taskSource,
        taskNo: this.formData.taskNo,
        taskContent: this.formData.taskContent,
        attachments: this.formData.attachments.map(f => f.name),
        executors: this.formData.executors,
        cooperators: this.formData.cooperators,
        expectedCompleteTime: `${this.formData.expectedCompleteDate} ${this.formData.expectedCompleteTime}`,
        deadlineTime: `${this.formData.deadlineDate} ${this.formData.deadlineTime}`
      };

      console.log('提交任务数据：', submitData);

      // TODO: 调用API提交任务
      this.$message.success('任务发起成功');
      this.$emit('update:modelValue', false);
      this.$emit('submit', submitData);

      this.submitting = false;
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
