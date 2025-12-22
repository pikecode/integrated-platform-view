<template>
  <basic-container>
    <!-- 面包屑导航 -->
    <decision-breadcrumb :breadcrumbs="breadcrumbs" />

    <!-- 流程进度步骤 -->
    <div class="process-steps-wrapper">
      <el-steps :active="currentStepIndex" finish-status="success" align-center>
        <el-step
          v-for="(step, index) in processSteps"
          :key="index"
          :title="`${index + 1}`"
        >
          <template #description>
            <div class="step-content">
              <div class="step-title">{{ step.title }}</div>
              <div class="step-status" :class="step.statusClass">{{ step.status }}</div>
              <div class="step-time" v-if="step.time">{{ step.time }}</div>
            </div>
          </template>
        </el-step>
      </el-steps>
    </div>

    <!-- 主容器：左侧任务卡片 + 右侧倒计时 -->
    <div class="main-content">
      <!-- 左侧：任务卡片 -->
      <div class="left-section">
        <div class="task-card">
          <div class="task-card-header">
            <i class="el-icon-folder-opened"></i>
            <span class="task-card-title">{{ taskData.title }}</span>
          </div>
          <div class="task-card-content">
            <div class="meta-item">
              <span class="meta-label">任务来源:</span>
              <span class="meta-value">{{ taskData.source }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">执行科室及执行人:</span>
              <div class="meta-list">
                <div v-for="(item, idx) in taskData.executors" :key="idx" class="list-item">
                  ① {{ item.dept }}：{{ item.person }}
                </div>
              </div>
            </div>
            <div class="meta-item">
              <span class="meta-label">配合科室及配合人:</span>
              <div class="meta-list">
                <div v-for="(item, idx) in taskData.cooperators" :key="idx" class="list-item">
                  ① {{ item.dept }}：{{ item.person }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧：倒计时提示框 -->
      <div class="right-section">
        <div class="countdown-box" v-if="showCountdown">
          <div class="countdown-label">倒计时:</div>
          <div class="countdown-time">{{ countdown }}</div>
          <div class="countdown-hint">
            <p>任务审批通过了，需要</p>
            <p>展示倒计时</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 任务详细信息 -->
    <el-card class="detail-card">
      <template #header>
        <span class="card-title">任务新增</span>
      </template>

      <div class="info-section">
        <div class="info-title">■ 任务新增</div>

        <div class="info-grid">
          <div class="info-item">
            <span class="label">任务来源:</span>
            <span class="value">{{ taskData.source }}</span>
          </div>
          <div class="info-item">
            <span class="label">执行科室及执行人:</span>
            <div class="value">
              <div v-for="(item, idx) in taskData.executors" :key="idx">
                ① {{ item.dept }}：{{ item.person }}
              </div>
            </div>
          </div>
        </div>

        <div class="info-grid">
          <div class="info-item">
            <span class="label">配合科室及配合人:</span>
            <div class="value">
              <div v-for="(item, idx) in taskData.cooperators" :key="idx">
                ① {{ item.dept }}：{{ item.person }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 任务内容 -->
    <el-card class="detail-card">
      <template #header>
        <span class="card-title">任务内容</span>
      </template>

      <div class="content-box">
        <p>{{ taskData.content }}</p>
      </div>
    </el-card>

    <!-- 任务附件 -->
    <el-card class="detail-card">
      <template #header>
        <span class="card-title">任务附件</span>
      </template>

      <el-table :data="taskData.attachments" stripe size="small" style="width: 100%">
        <el-table-column prop="name" label="文件名" />
        <el-table-column prop="size" label="大小" width="100" />
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button type="text" size="small" @click="handlePreview(scope.row)">预览</el-button>
            <el-button type="text" size="small" @click="handleDownload(scope.row)">下载</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 任务进度和接收情况 -->
    <el-row :gutter="20">
      <!-- 左侧：任务进度 -->
      <el-col :span="16">
        <el-card class="detail-card">
          <template #header>
            <span class="card-title">任务进度</span>
          </template>

          <div class="progress-timeline">
            <div
              v-for="(progress, index) in progressList"
              :key="progress.id"
              class="progress-item"
              :class="{ 'is-last': index === progressList.length - 1 }"
            >
              <div class="progress-dot"></div>
              <div class="progress-content">
                <div class="progress-header">
                  <span class="progress-stage">{{ progress.progressStageName }}</span>
                  <span class="progress-time">{{ progress.createTime }}</span>
                </div>
                <div class="progress-operator">
                  （{{ progress.operatorTypeName }}）{{ progress.operatorName }}
                </div>

                <!-- 附件列表 -->
                <div v-if="progress.attachmentVOList && progress.attachmentVOList.length > 0" class="progress-attachments">
                  <div class="attachment-title">相关附件</div>
                  <el-table :data="progress.attachmentVOList" size="small" style="width: 100%">
                    <el-table-column prop="fileName" label="文件名" />
                    <el-table-column prop="fileSize" label="大小" width="100">
                      <template #default="scope">
                        {{ scope.row.fileSize ? scope.row.fileSize + 'KB' : '' }}
                      </template>
                    </el-table-column>
                    <el-table-column label="操作" width="150">
                      <template #default="scope">
                        <el-button type="text" size="small" @click="handlePreview(scope.row)">预览</el-button>
                        <el-button type="text" size="small" @click="handleDownload(scope.row)">下载</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </div>
            </div>

            <!-- 无进度数据提示 -->
            <el-empty v-if="!progressList || progressList.length === 0" description="暂无进度信息" />
          </div>
        </el-card>
      </el-col>

      <!-- 右侧：任务接收情况 -->
      <el-col :span="8">
        <el-card class="detail-card">
          <template #header>
            <span class="card-title">任务接收情况</span>
          </template>

          <div class="receive-status">
            <!-- 已接收 -->
            <div class="status-group">
              <div class="status-header">
                <span>已接收</span>
                <span class="status-count">
                  ({{ receiveRate.receivedCount || 0 }}/{{ receiveRate.totalCount || 0 }})
                </span>
              </div>
              <div class="user-list">
                <div
                  v-for="user in receiveRate.receivedUserList"
                  :key="user.id"
                  class="user-item"
                >
                  <el-avatar :size="32" class="user-avatar">
                    {{ user.userName ? user.userName.charAt(0) : '' }}
                  </el-avatar>
                  <span class="user-name">{{ user.userName }}</span>
                </div>
                <div v-if="!receiveRate.receivedUserList || receiveRate.receivedUserList.length === 0" class="empty-text">
                  暂无
                </div>
              </div>
            </div>

            <!-- 已拒绝 -->
            <div class="status-group">
              <div class="status-header">
                <span>已拒绝</span>
                <span class="status-count">
                  ({{ receiveRate.rejectedCount || 0 }}/{{ receiveRate.totalCount || 0 }})
                </span>
              </div>
              <div class="user-list">
                <div
                  v-for="user in receiveRate.rejectedUserList"
                  :key="user.id"
                  class="user-item"
                >
                  <el-avatar :size="32" class="user-avatar rejected">
                    {{ user.userName ? user.userName.charAt(0) : '' }}
                  </el-avatar>
                  <span class="user-name">{{ user.userName }}</span>
                </div>
                <div v-if="!receiveRate.rejectedUserList || receiveRate.rejectedUserList.length === 0" class="empty-text">
                  暂无
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </basic-container>
</template>

<script>
import DecisionBreadcrumb from '../../components/breadcrumb.vue';
import * as taskApi from '@/api/decision/task';

export default {
  name: 'TaskDetail',
  components: {
    DecisionBreadcrumb
  },
  data() {
    return {
      taskId: null,
      currentStepIndex: 0,
      showCountdown: false,
      countdown: '',
      processSteps: [],
      taskData: {
        id: null,
        title: '',
        source: '',
        executors: [],
        cooperators: [],
        content: '',
        attachments: []
      },
      // 任务进度列表
      progressList: [],
      // 任务接收情况
      receiveRate: {
        receivedCount: 0,
        rejectedCount: 0,
        totalCount: 0,
        receivedUserList: [],
        rejectedUserList: []
      },
      // 权限标志
      canReceive: false,
      canTrans: false,
      canFeedback: false,
      canReject: false
    };
  },
  computed: {
    breadcrumbs() {
      return ['任务管理', '任务详情'];
    }
  },
  created() {
    this.taskId = this.$route.params.id;
    this.loadTaskDetail();
  },
  methods: {
    async loadTaskDetail() {
      try {
        const res = await taskApi.getTaskDetail(this.taskId);

        if (res.data && res.data.code === 200) {
          const data = res.data.data;

          // 映射基本信息
          this.taskData = {
            id: data.id,
            title: data.taskName || '',
            source: data.taskSourceName || '',
            executors: this.transformExecutorList(data.executorList || []),
            cooperators: this.transformCooperatorList(data.cooperatorList || []),
            content: data.taskContent || '', // 注意：接口文档中未定义此字段，保留以备后用
            attachments: this.transformAttachmentList(data.attachmentList || [])
          };

          // 映射进度步骤
          this.processSteps = this.buildProcessSteps(data);

          // 设置当前步骤索引（基于 currentStage）
          this.currentStepIndex = this.getCurrentStepIndex(data.currentStage);

          // 设置倒计时
          if (data.taskFinishCountdown) {
            this.showCountdown = true;
            this.countdown = data.taskFinishCountdown;
          } else {
            this.showCountdown = false;
          }

          // 设置权限标志
          this.canReceive = data.canReceive || false;
          this.canTrans = data.canTrans || false;
          this.canFeedback = data.canFeedback || false;
          this.canReject = data.canReject || false;

          // 设置任务进度列表
          this.progressList = data.progressList || [];

          // 设置任务接收情况
          this.receiveRate = data.receiveRate || {
            receivedCount: 0,
            rejectedCount: 0,
            totalCount: 0,
            receivedUserList: [],
            rejectedUserList: []
          };

        } else {
          this.$message.error(res.data.msg || '加载任务详情失败');
        }
      } catch (error) {
        console.error('加载任务详情失败：', error);
        this.$message.error('加载任务详情失败');
      }
    },

    // 转换执行人列表格式
    transformExecutorList(executorList) {
      return executorList.map(executor => {
        const persons = executor.receiverList
          .map(receiver => receiver.userName)
          .join('、');
        return {
          dept: executor.deptName,
          person: persons || '未分配'
        };
      });
    },

    // 转换配合人列表格式
    transformCooperatorList(cooperatorList) {
      return cooperatorList.map(cooperator => {
        const persons = cooperator.receiverList
          .map(receiver => receiver.userName)
          .join('、');
        return {
          dept: cooperator.deptName,
          person: persons || '未分配'
        };
      });
    },

    // 转换附件列表格式
    transformAttachmentList(attachmentList) {
      return attachmentList.map(attachment => ({
        id: attachment.id,
        name: attachment.fileName || '未命名文件',
        size: attachment.fileSize ? `${attachment.fileSize}KB` : '',
        fileKey: attachment.fileKey || '',
        fileType: attachment.fileType || '',
        uploadTime: attachment.uploadTime || '',
        uploadUserName: attachment.uploadUserName || ''
      }));
    },

    // 构建流程步骤
    buildProcessSteps(data) {
      const steps = [
        { title: '任务新增', stage: '1', status: '未开始', statusClass: 'status-wait', time: null },
        { title: '任务接收', stage: '3', status: '未开始', statusClass: 'status-wait', time: null },
        { title: '任务反馈', stage: '5', status: '未开始', statusClass: 'status-wait', time: null },
        { title: '任务完成', stage: '900', status: '未开始', statusClass: 'status-wait', time: null }
      ];

      const currentStage = parseInt(data.currentStage) || 0;
      const progressList = data.progressList || [];

      // 根据 progressList 更新步骤状态
      steps.forEach(step => {
        const stageNum = parseInt(step.stage);

        // 查找对应阶段的进度记录
        const progress = progressList.find(p => parseInt(p.progressStage) === stageNum);

        if (progress) {
          step.time = progress.createTime;

          if (currentStage > stageNum) {
            step.status = '完成';
            step.statusClass = 'status-complete';
          } else if (currentStage === stageNum) {
            step.status = '进行中';
            step.statusClass = 'status-process';
          }
        } else if (currentStage >= stageNum) {
          // 即使没有进度记录，如果当前阶段已过，也标记为完成
          step.status = '完成';
          step.statusClass = 'status-complete';
        }
      });

      return steps;
    },

    // 获取当前步骤索引
    getCurrentStepIndex(currentStage) {
      const stage = parseInt(currentStage) || 0;

      // 根据阶段号映射到步骤索引
      if (stage >= 900) return 3; // 任务完成
      if (stage >= 5) return 2;   // 任务反馈
      if (stage >= 3) return 1;   // 任务接收
      if (stage >= 1) return 0;   // 任务新增

      return 0;
    },

    handlePreview(file) {
      if (file.fileKey) {
        // TODO: 实现文件预览，使用 fileKey 获取文件
        this.$message.info('预览功能开发中');
      } else {
        this.$message.warning('文件信息不完整');
      }
    },

    handleDownload(file) {
      if (file.fileKey) {
        // TODO: 实现文件下载，使用 fileKey 获取文件
        this.$message.success('开始下载: ' + file.name);
        // 示例: window.open(`/api/file/download?fileKey=${file.fileKey}`, '_blank');
      } else {
        this.$message.warning('文件信息不完整');
      }
    }
  }
};
</script>

<style scoped lang="scss">
.process-steps-wrapper {
  background: #fff;
  padding: 20px;
  border-radius: 4px;
  margin-bottom: 30px;

  ::v-deep .el-steps {
    .el-step__main {
      position: relative;
    }
  }

  .step-content {
    text-align: center;
    font-size: 12px;

    .step-title {
      font-weight: 500;
      color: #303133;
      margin-bottom: 4px;
    }

    .step-status {
      font-size: 11px;
      margin-bottom: 4px;

      &.status-complete {
        color: #67c23a;
      }

      &.status-process {
        color: #409eff;
      }

      &.status-wait {
        color: #909399;
      }
    }

    .step-time {
      color: #909399;
      font-size: 10px;
    }
  }
}

.main-content {
  display: grid;
  grid-template-columns: 1fr 250px;
  gap: 20px;
  margin-bottom: 30px;

  .left-section {
    .task-card {
      background: #fff;
      border-radius: 4px;
      overflow: hidden;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);

      .task-card-header {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 16px;
        background: #409eff;
        color: white;
        font-weight: 500;

        i {
          font-size: 18px;
        }

        .task-card-title {
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }

      .task-card-content {
        padding: 16px;

        .meta-item {
          margin-bottom: 16px;
          font-size: 13px;

          &:last-child {
            margin-bottom: 0;
          }

          .meta-label {
            color: #606266;
            font-weight: 500;
            display: block;
            margin-bottom: 8px;
          }

          .meta-value {
            color: #303133;
          }

          .meta-list {
            margin-top: 8px;

            .list-item {
              color: #303133;
              line-height: 1.6;
              padding: 4px 0;
            }
          }
        }
      }
    }
  }

  .right-section {
    .countdown-box {
      background: #fff;
      border-radius: 4px;
      padding: 16px;
      text-align: center;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);

      .countdown-label {
        color: #606266;
        font-size: 12px;
        margin-bottom: 8px;
      }

      .countdown-time {
        font-size: 24px;
        font-weight: 600;
        color: #e74c3c;
        margin-bottom: 12px;
      }

      .countdown-hint {
        background: #fce4ec;
        border-left: 3px solid #e91e63;
        padding: 8px 12px;
        border-radius: 2px;
        text-align: center;

        p {
          margin: 0;
          color: #d81b60;
          font-size: 11px;
          line-height: 1.4;
        }
      }
    }
  }
}

.detail-card {
  margin-bottom: 20px;

  ::v-deep .el-card__header {
    background: #f5f7fa;
    border-bottom: 1px solid #ebeef5;
  }

  .card-title {
    font-size: 14px;
    font-weight: 500;
    color: #303133;
  }

  .info-section {
    .info-title {
      font-size: 13px;
      font-weight: 600;
      color: #303133;
      margin-bottom: 16px;
      padding-left: 10px;
      border-left: 3px solid #409eff;
    }

    .info-grid {
      margin-bottom: 20px;

      &:last-child {
        margin-bottom: 0;
      }
    }

    .info-item {
      display: flex;
      padding: 12px 0;
      border-bottom: 1px solid #f0f0f0;
      font-size: 13px;

      &:last-child {
        border-bottom: none;
      }

      .label {
        width: 150px;
        flex-shrink: 0;
        color: #606266;
        font-weight: 500;
      }

      .value {
        flex: 1;
        color: #303133;
      }
    }
  }

  .content-box {
    background: #fafafa;
    padding: 16px;
    border-radius: 4px;
    color: #606266;
    line-height: 1.8;
    font-size: 13px;

    p {
      margin: 0;
    }
  }
}

// 任务进度时间轴样式
.progress-timeline {
  padding: 20px 0;
  position: relative;

  .progress-item {
    display: flex;
    position: relative;
    padding-bottom: 32px;

    &:not(.is-last)::before {
      content: '';
      position: absolute;
      left: 7px;
      top: 24px;
      bottom: -8px;
      width: 2px;
      background: #dcdfe6;
    }

    .progress-dot {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: #409eff;
      border: 3px solid #fff;
      box-shadow: 0 0 0 2px #409eff;
      flex-shrink: 0;
      margin-top: 2px;
      z-index: 1;
      position: relative;
    }

    .progress-content {
      flex: 1;
      margin-left: 16px;

      .progress-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;

        .progress-stage {
          font-size: 15px;
          font-weight: 500;
          color: #409eff;
        }

        .progress-time {
          font-size: 12px;
          color: #909399;
        }
      }

      .progress-operator {
        font-size: 13px;
        color: #606266;
        margin-bottom: 12px;
      }

      .progress-attachments {
        margin-top: 12px;
        background: #f9fafb;
        padding: 12px;
        border-radius: 4px;

        .attachment-title {
          font-size: 13px;
          font-weight: 500;
          color: #303133;
          margin-bottom: 8px;
        }

        ::v-deep .el-table {
          background: transparent;

          th {
            background: transparent;
          }

          .el-button--text {
            color: #409eff;
          }
        }
      }
    }
  }
}

// 任务接收情况样式
.receive-status {
  padding: 12px 0;

  .status-group {
    margin-bottom: 24px;

    &:last-child {
      margin-bottom: 0;
    }

    .status-header {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      font-weight: 500;
      color: #303133;
      margin-bottom: 12px;
      padding-bottom: 8px;
      border-bottom: 1px solid #ebeef5;

      .status-count {
        font-size: 13px;
        color: #909399;
        font-weight: normal;
      }
    }

    .user-list {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;

      .user-item {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 12px;
        background: #f5f7fa;
        border-radius: 4px;
        font-size: 13px;

        .user-avatar {
          background: #409eff;
          color: #fff;
          font-size: 14px;
          font-weight: 500;

          &.rejected {
            background: #f56c6c;
          }
        }

        .user-name {
          color: #303133;
        }
      }

      .empty-text {
        color: #909399;
        font-size: 13px;
        padding: 8px 0;
      }
    }
  }
}

@media (max-width: 992px) {
  .main-content {
    grid-template-columns: 1fr;

    .right-section {
      .countdown-box {
        max-width: 100%;
      }
    }
  }
}
</style>
