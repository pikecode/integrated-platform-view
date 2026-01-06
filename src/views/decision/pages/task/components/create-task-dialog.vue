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
                  :label="item.dictValue"
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
                @change="handleTaskTagChange"
              >
                <el-option
                  v-for="item in taskTagOptions"
                  :key="item.dictValue"
                  :label="item.dictValue"
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
        <div class="section-title">
          相关附件
          <span class="required-mark">*</span>
        </div>

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

        <el-form-item label="预计完成时间:" required>
          <div class="time-input-group">
            <el-date-picker
              v-model="formData.expectedCompleteDate"
              type="date"
              placeholder="选择日期"
              value-format="YYYY-MM-DD"
              style="flex: 1"
            />
            <el-select
              v-model="formData.expectedCompleteTime"
              placeholder="选择时间"
              style="width: 120px; margin-left: 10px"
            >
              <el-option
                v-for="time in timeOptions"
                :key="time"
                :label="time"
                :value="time"
              />
            </el-select>
          </div>
          <el-tooltip
            content="可选择到24:00，表示当天结束"
            placement="top"
            class="help-tooltip"
          >
            <i class="el-icon-question"></i>
          </el-tooltip>
        </el-form-item>

        <el-form-item label="任务截止时间:" required>
          <div class="time-input-group">
            <el-date-picker
              v-model="formData.deadlineDate"
              type="date"
              placeholder="选择日期"
              value-format="YYYY-MM-DD"
              style="flex: 1"
            />
            <el-select
              v-model="formData.deadlineTime"
              placeholder="选择时间"
              style="width: 120px; margin-left: 10px"
            >
              <el-option
                v-for="time in timeOptions"
                :key="time"
                :label="time"
                :value="time"
              />
            </el-select>
          </div>
        </el-form-item>
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
      pendingTaskDetail: null, // 待设置的任务详情数据
      // 生成时间选项：00:00 到 24:00，每30分钟一个
      timeOptions: (() => {
        const options = [];
        for (let h = 0; h < 24; h++) {
          options.push(`${String(h).padStart(2, '0')}:00`);
          options.push(`${String(h).padStart(2, '0')}:30`);
        }
        options.push('24:00'); // 添加24:00选项
        return options;
      })(),
      formData: {
        taskName: '',
        taskSource: '',
        taskSourceName: '', // 任务来源名称
        taskNo: '',
        taskTagName: '', // 任务标签名称
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
        // 同时加载任务来源和标签选项
        Promise.all([this.loadTaskSourceAsync(), this.loadTaskTagAsync()]).then(() => {
          // 选项加载完成后，如果有待设置的任务数据则设置
          if (this.pendingTaskDetail) {
            this.setTaskData(this.pendingTaskDetail);
            this.pendingTaskDetail = null;
          }
        });
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
            console.log('【任务来源】选项数据:', JSON.stringify(this.taskSourceOptions, null, 2));
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

    loadTaskSourceAsync() {
      return new Promise((resolve) => {
        this.loadingTaskSource = true;
        taskApi.getDictionary('oatask_rwly')
          .then(response => {
            console.log('【任务来源】API响应:', response);
            if (response.data && response.data.code === 200) {
              this.taskSourceOptions = response.data.data || [];
              console.log('【任务来源】选项数据:', JSON.stringify(this.taskSourceOptions, null, 2));
            } else {
              const errorMsg = response.data?.msg || '加载任务来源失败';
              console.error('【任务来源】错误:', errorMsg);
            }
          })
          .catch(error => {
            console.error('【任务来源】请求异常:', error);
          })
          .finally(() => {
            this.loadingTaskSource = false;
            resolve();
          });
      });
    },


    loadTaskTagAsync() {
      return new Promise((resolve) => {
        this.loadingTaskTag = true;
        this.taskTagOptions = [];

        taskApi.getDictionary('oatask-rwbq')
          .then(response => {
            console.log('【任务标签】API响应:', response);
            if (response.data && response.data.code === 200) {
              this.taskTagOptions = response.data.data || [];
              console.log('【任务标签】选项数据:', JSON.stringify(this.taskTagOptions, null, 2));
            } else {
              const errorMsg = response.data?.msg || '加载任务标签失败';
              console.error('【任务标签】错误:', errorMsg);
            }
          })
          .catch(error => {
            console.error('【任务标签】请求异常:', error);
          })
          .finally(() => {
            this.loadingTaskTag = false;
            resolve();
          });
      });
    },

    loadTaskTag() {
      this.loadingTaskTag = true;
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
        taskSourceName: '',
        taskNo: '',
        taskTagName: '',
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

    setTaskData(taskDetail) {
      // 从任务详情数据预填充表单
      console.log('【预填充数据】接收的任务详情:', taskDetail);
      console.log('【预填充数据】当前 taskSourceOptions:', this.taskSourceOptions);
      console.log('【预填充数据】当前 taskTagOptions:', this.taskTagOptions);

      // 根据名称查找任务来源ID
      let taskSourceId = '';
      if (taskDetail.taskSourceName) {
        const sourceOption = this.taskSourceOptions.find(item => item.dictValue === taskDetail.taskSourceName);
        console.log('【预填充数据】查找任务来源 - 搜索值:', taskDetail.taskSourceName, '结果:', sourceOption);
        taskSourceId = sourceOption ? sourceOption.id : '';
      }

      // 根据名称查找任务标签ID
      let taskTagId = '';
      if (taskDetail.taskTagName) {
        const tagOption = this.taskTagOptions.find(item => item.dictValue === taskDetail.taskTagName);
        console.log('【预填充数据】查找任务标签 - 搜索值:', taskDetail.taskTagName, '结果:', tagOption);
        taskTagId = tagOption ? tagOption.id : '';
      }

      // 提取执行人（来自 executorList）
      const executors = [];
      if (taskDetail.executorList && Array.isArray(taskDetail.executorList)) {
        taskDetail.executorList.forEach(deptGroup => {
          if (deptGroup.receiverList && Array.isArray(deptGroup.receiverList)) {
            deptGroup.receiverList.forEach(person => {
              if (person.receiverType === '1' || person.receiverType === 1) {
                executors.push({
                  id: person.userId,
                  name: person.userName,
                  deptId: deptGroup.deptId,
                  deptName: deptGroup.deptName
                });
              }
            });
          }
        });
      }

      // 提取配合人（来自 cooperatorList）
      const cooperators = [];
      if (taskDetail.cooperatorList && Array.isArray(taskDetail.cooperatorList)) {
        taskDetail.cooperatorList.forEach(deptGroup => {
          if (deptGroup.receiverList && Array.isArray(deptGroup.receiverList)) {
            deptGroup.receiverList.forEach(person => {
              if (person.receiverType === '2' || person.receiverType === 2) {
                cooperators.push({
                  id: person.userId,
                  name: person.userName,
                  deptId: deptGroup.deptId,
                  deptName: deptGroup.deptName
                });
              }
            });
          }
        });
      }

      // 解析时间
      const parseDateTime = (dateTimeStr) => {
        if (!dateTimeStr) return { date: null, time: '24:00' };
        const parts = dateTimeStr.split(' ');
        return {
          date: parts[0],
          time: parts[1] ? parts[1].substring(0, 5) : '24:00'
        };
      };

      const expectFinish = parseDateTime(taskDetail.expectFinishTime);
      const deadline = parseDateTime(taskDetail.deadlineTime);

      this.formData = {
        taskName: taskDetail.taskName || '',
        taskSource: taskSourceId,
        taskSourceName: taskDetail.taskSourceName || '',
        taskNo: taskTagId,
        taskTagName: taskDetail.taskTagName || '',
        taskContent: taskDetail.taskContent || '',
        attachments: [], // 附件暂不处理
        executors: executors,
        cooperators: cooperators,
        expectedCompleteDate: expectFinish.date,
        expectedCompleteTime: expectFinish.time,
        deadlineDate: deadline.date,
        deadlineTime: deadline.time
      };

      console.log('【预填充数据】填充后的表单:', this.formData);
    },

    handleTaskSourceChange() {
      // 获取任务来源名称并赋值（dictValue 既是值也是显示文本）
      const option = this.taskSourceOptions.find(item => item.dictValue == this.formData.taskSource);
      this.formData.taskSourceName = option ? option.dictValue : '';
      console.log('【任务来源变化】ID:', this.formData.taskSource, 'Name:', this.formData.taskSourceName, 'Option:', option);
    },

    handleTaskTagChange() {
      // 获取任务标签名称并赋值（dictValue 既是值也是显示文本）
      const option = this.taskTagOptions.find(item => item.dictValue == this.formData.taskNo);
      this.formData.taskTagName = option ? option.dictValue : '';
      console.log('【任务标签变化】ID:', this.formData.taskNo, 'Name:', this.formData.taskTagName, 'Option:', option);
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
                // 强制更新视图
                this.$forceUpdate();
              } else {
                attachmentItem.status = 'error';
                const errorMsg = response.data?.msg || '上传文件失败';
                console.error('【文件上传】✗ 服务器返回错误:', response.data);
                this.$message.error(errorMsg);
                this.$forceUpdate();
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
              this.$forceUpdate();
            });
        }
      };
      fileInput.click();
    },

    handlePreviewFile(file) {
      if (!file.file || file.status !== 'success') {
        this.$message.warning('文件未上传成功，无法预览');
        return;
      }

      const fileName = file.name.toLowerCase();
      const fileType = fileName.substring(fileName.lastIndexOf('.') + 1);

      // 图片类型直接预览
      if (['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'].includes(fileType)) {
        const imageUrl = URL.createObjectURL(file.file);
        const previewWindow = window.open('', '_blank');
        if (previewWindow) {
          previewWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
              <title>${file.name} - 图片预览</title>
              <style>
                body { margin: 0; padding: 20px; background: #333; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
                img { max-width: 100%; max-height: 100vh; box-shadow: 0 4px 8px rgba(0,0,0,0.3); }
              </style>
            </head>
            <body>
              <img src="${imageUrl}" alt="${file.name}" />
            </body>
            </html>
          `);
          previewWindow.document.close();
        }
        return;
      }

      // PDF 类型
      if (fileType === 'pdf') {
        const pdfUrl = URL.createObjectURL(file.file);
        window.open(pdfUrl, '_blank');
        return;
      }

      // 其他文件类型提示下载
      if (['doc', 'docx', 'xls', 'xlsx'].includes(fileType)) {
        this.$message.info(`${fileType.toUpperCase()} 文件需要下载后使用相应软件打开查看`);
        // 触发下载
        const downloadUrl = URL.createObjectURL(file.file);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = file.name;
        link.click();
        URL.revokeObjectURL(downloadUrl);
      } else {
        this.$message.warning('该文件类型暂不支持预览');
      }
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

      // 检查是否至少上传了一个附件
      if (this.formData.attachments.length === 0) {
        this.$message.warning('请至少上传一个附件');
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

        console.log('【时间格式化】输入 - date:', date, 'time:', time);

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

        const result = `${year}-${month}-${day} ${hour}:${minute}:00`;
        console.log('【时间格式化】输出:', result);
        return result;
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
      // 确保taskSourceName和taskTagName不为空（failsafe机制，使用宽松比较）
      let taskSourceName = this.formData.taskSourceName;
      console.log('【Failsafe检查】taskSourceName:', taskSourceName);
      console.log('【Failsafe检查】taskSourceOptions:', this.taskSourceOptions);
      console.log('【Failsafe检查】taskSource ID:', this.formData.taskSource);

      if (!taskSourceName) {
        const sourceOption = this.taskSourceOptions.find(item => item.dictValue == this.formData.taskSource);
        taskSourceName = sourceOption ? sourceOption.dictValue : '';
        console.log('【Failsafe修复】找到的option:', sourceOption, '最终Name:', taskSourceName);
      }

      let taskTagName = this.formData.taskTagName;
      console.log('【Failsafe检查】taskTagName:', taskTagName);
      console.log('【Failsafe检查】taskTagOptions:', this.taskTagOptions);
      console.log('【Failsafe检查】taskNo ID:', this.formData.taskNo);

      if (!taskTagName) {
        const tagOption = this.taskTagOptions.find(item => item.dictValue == this.formData.taskNo);
        taskTagName = tagOption ? tagOption.dictValue : '';
        console.log('【Failsafe修复】找到的option:', tagOption, '最终Name:', taskTagName);
      }

      const submitData = {
        taskName: this.formData.taskName, // 任务名称（必填）
        taskSourceId: this.formData.taskSource, // 任务来源ID（必填）
        taskSourceName: taskSourceName, // 任务来源名称（必填）
        taskTagId: this.formData.taskNo, // 任务标签ID（必填）
        taskTagName: taskTagName, // 任务标签名称（必填）
        taskContent: this.formData.taskContent, // 任务内容（必填）
        taskType: '1', // 任务类型（必填）
        expectFinishTime: formatDateTime(this.formData.expectedCompleteDate, this.formData.expectedCompleteTime), // 预计完成时间，格式: YYYY-MM-DD HH:MM:SS（必填）
        deadlineTime: formatDateTime(this.formData.deadlineDate, this.formData.deadlineTime), // 任务截止时间，格式: YYYY-MM-DD HH:MM:SS（必填）
        attachmentIdList: this.formData.attachments // 附件ID列表（可选）
          .filter(a => a.status === 'success' && a.attachmentId)
          .map(a => a.attachmentId),
        receiverList: receiverList // 任务接收人员列表（必填，至少1条）
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
      const option = this.taskSourceOptions.find(item => item.dictValue == value);
      return option ? option.dictValue : value;
    },

    // 获取任务标签名称
    getTaskTagName(value) {
      const option = this.taskTagOptions.find(item => item.dictValue == value);
      return option ? option.dictValue : value;
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

      .required-mark {
        color: #ff4d4f;
        margin-left: 4px;
      }
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
