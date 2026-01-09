<template>
  <div class="task-detail-page">
    <!-- 面包屑导航 -->
    <decision-breadcrumb :breadcrumbs="['任务管理', '我发布的', '任务详情']" />

    <el-card class="box-card">
      <!-- 加载状态 -->
      <div v-if="loading" class="loading-container">
        <el-icon class="is-loading"><Loading /></el-icon>
        <span>加载中...</span>
      </div>

      <!-- 主内容 -->
      <div v-else-if="taskDetail" class="detail-content">
        <!-- 任务进度流程条 -->
        <div class="progress-flow">
          <div class="flow-container">
            <div class="flow-line"></div>
            <div
              v-for="stage in taskStages"
              :key="stage.id"
              class="flow-item"
              :class="{
                completed: stage.id < parseInt(taskDetail.currentStage),
                active: stage.id === parseInt(taskDetail.currentStage),
                pending: stage.id > parseInt(taskDetail.currentStage),
              }"
            >
              <div class="flow-circle">
                <span>{{ stage.id }}</span>
              </div>
              <div class="flow-info">
                <div class="flow-title">{{ stage.name }}</div>
                <div class="flow-status">{{ getStageStatus(stage.id) }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 基本信息 -->
        <div class="basic-info-section">
          <!-- 操作按钮区域 - 待反馈 -->
          <div v-if="fromPage === 'participate_pending_feedback'" class="action-buttons-bar">
            <el-button type="primary" @click="handleAccept">接收</el-button>
            <el-button type="primary" @click="handleTransfer">转办</el-button>
            <el-button type="danger" @click="handleReject">拒绝</el-button>
            <el-button @click="handleReturn">返回</el-button>
          </div>

          <!-- 操作按钮区域 - 待审批 -->
          <div v-if="fromPage === 'participate_pending_review'" class="action-buttons-bar">
            <el-button type="primary" @click="handleApprove">审批</el-button>
            <el-button @click="handleReturn">返回</el-button>
          </div>

          <!-- 标题和右上角提示 -->
          <div class="header-content">
            <div class="title-area">
              <h2 class="task-title">{{ taskDetail.taskName }}</h2>
              <div class="task-source">任务来源：{{ taskDetail.taskSourceName }}</div>
            </div>
            <div class="countdown-alert" v-if="taskDetail.taskFinishCountdown">
              <div class="countdown-value">倒计时：{{ taskDetail.taskFinishCountdown }}</div>
            </div>
          </div>

          <!-- 执行人和配合人信息 -->
          <div class="personnel-info">
            <!-- 执行人信息 -->
            <div class="personnel-column">
              <div class="personnel-title">执行科室及执行人：</div>
              <div v-if="taskDetail.executorList && taskDetail.executorList.length > 0">
                <div
                  v-for="(dept, deptIdx) in taskDetail.executorList"
                  :key="deptIdx"
                  class="personnel-group"
                >
                  <div class="group-item">
                    <span class="dept-label">{{ String.fromCharCode(10120 + deptIdx) }}</span>
                    <span class="dept-names">{{ getDeptPersonNames(dept) }}</span>
                  </div>
                  <div class="group-leader">分管领导：{{ getDeptLeader(dept) }}</div>
                </div>
              </div>
            </div>

            <!-- 配合人信息 -->
            <div class="personnel-column">
              <div class="personnel-title">配合科室及配合人：</div>
              <div v-if="taskDetail.cooperatorList && taskDetail.cooperatorList.length > 0">
                <div
                  v-for="(dept, deptIdx) in taskDetail.cooperatorList"
                  :key="deptIdx"
                  class="personnel-group"
                >
                  <div class="group-item">
                    <span class="dept-label">{{ String.fromCharCode(10120 + deptIdx) }}</span>
                    <span class="dept-names">{{ getDeptPersonNames(dept) }}</span>
                  </div>
                  <div class="group-leader">分管领导：{{ getDeptLeader(dept) }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- 任务内容 -->
          <div class="basic-info-content">
            <div class="content-label">任务内容：</div>
            <div class="content-text">
              {{ taskDetail.taskContent || '暂无任务内容' }}
            </div>
          </div>

          <!-- 附件列表 -->
          <div class="basic-info-attachments" v-if="taskDetail.attachmentList && taskDetail.attachmentList.length > 0">
            <div class="content-label">任务附件</div>
            <div class="attachment-list">
              <div
                v-for="attachment in taskDetail.attachmentList"
                :key="attachment.id"
                class="attachment-item"
              >
                <div class="attachment-info">
                  <div class="file-name">{{ attachment.fileName }}</div>
                  <div class="file-meta">
                    {{ formatFileSize(attachment.fileSize) }} · {{ attachment.uploadUserName }} ·
                    {{ formatDateTime(attachment.uploadTime) }}
                  </div>
                </div>
                <el-button type="primary" text size="small" @click="handleDownloadFile(attachment)">
                  下载
                </el-button>
              </div>
            </div>
          </div>
        </div>

  

        <!-- 任务接收情况 -->
        <div class="section">
          <div class="section-title">任务接收情况</div>
          <div v-if="taskDetail.receiveRate" class="receive-rate-section">
            <!-- 已接收 -->
            <div
              v-if="
                taskDetail.receiveRate.receivedUserList &&
                taskDetail.receiveRate.receivedUserList.length > 0
              "
              class="receive-status-row"
            >
              <div class="status-label">
                <span class="status-text">已接收</span>
                <span class="status-count">
                  ({{ taskDetail.receiveRate.receivedCount }}/{{ taskDetail.receiveRate.totalCount }})
                </span>
              </div>
              <div class="user-names">
                <span
                  v-for="(user, index) in taskDetail.receiveRate.receivedUserList"
                  :key="user.id"
                  class="user-name"
                >
                  {{ user.userName }}<span v-if="index < taskDetail.receiveRate.receivedUserList.length - 1" class="separator">、</span>
                </span>
              </div>
            </div>

            <!-- 已拒绝 -->
            <div
              v-if="
                taskDetail.receiveRate.rejectedUserList &&
                taskDetail.receiveRate.rejectedUserList.length > 0
              "
              class="receive-status-row"
            >
              <div class="status-label">
                <span class="status-text">已拒绝</span>
                <span class="status-count">
                  ({{ taskDetail.receiveRate.rejectedCount }}/{{ taskDetail.receiveRate.totalCount }})
                </span>
              </div>
              <div class="user-names">
                <span
                  v-for="(user, index) in taskDetail.receiveRate.rejectedUserList"
                  :key="user.id"
                  class="user-name"
                >
                  {{ user.userName }}<span v-if="index < taskDetail.receiveRate.rejectedUserList.length - 1" class="separator">、</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- 进度列表 -->
        <div class="section">
          <div class="section-title">任务进度</div>
          <div
            v-if="taskDetail.progressList && taskDetail.progressList.length > 0"
            class="progress-timeline"
          >
            <div
              v-for="progress in taskDetail.progressList"
              :key="progress.id"
              class="timeline-item"
            >
              <div class="timeline-dot"></div>
              <div class="timeline-content">
                <div class="progress-header">
                  <span class="stage-name">{{ progress.progressStageName }}</span>
                  <span class="operator-info"
                    >{{ progress.operatorName }} · {{ progress.operatorTypeName }}</span
                  >
                </div>
                <div class="progress-time">{{ formatDateTime(progress.createTime) }}</div>
                <div
                  v-if="progress.attachmentVOList && progress.attachmentVOList.length > 0"
                  class="progress-attachments"
                >
                  <div class="attachment-label">进度附件：</div>
                  <el-tag
                    v-for="attachment in progress.attachmentVOList"
                    :key="attachment.id"
                    type="info"
                    class="progress-file"
                  >
                    {{ attachment.fileName }}
                  </el-tag>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="empty-state">暂无进度记录</div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else class="empty-state">未能加载任务详情</div>
    </el-card>

    <!-- 审批对话框 -->
    <approval-dialog
      v-model="showApprovalDialog"
      :task-data="taskDetail || {}"
      @submit="handleApprovalSubmit"
    />

    <!-- 接收对话框 -->
    <accept-dialog
      v-model="showAcceptDialog"
      :task-data="taskDetail || {}"
      @submit="handleAcceptSubmit"
    />
  </div>
</template>

<script>
import { Loading } from '@element-plus/icons-vue';
import * as taskApi from '@/api/decision/task';
import DecisionBreadcrumb from '../../components/breadcrumb.vue';
import ApprovalDialog from './components/approval-dialog.vue';
import AcceptDialog from './components/accept-dialog.vue';

export default {
  name: 'TaskDetail',
  components: {
    Loading,
    DecisionBreadcrumb,
    ApprovalDialog,
    AcceptDialog,
  },
  data() {
    return {
      taskDetail: null,
      loading: false,
      fromPage: '', // 来源页面标识
      showApprovalDialog: false, // 控制审批对话框显示
      showAcceptDialog: false, // 控制接收对话框显示
      taskStages: [
        { id: 1, name: '任务新增' },
        { id: 2, name: '任务接收' },
        { id: 3, name: '任务反馈' },
        { id: 4, name: '任务完成' },
      ],
    };
  },
  watch: {
    '$route.params.id': {
      handler(newVal) {
        if (newVal) {
          this.loadTaskDetail(newVal);
        }
      },
      immediate: true,
    },
  },
  methods: {
    loadTaskDetail(taskId) {
      this.loading = true;

      // 获取来源页面标识
      this.fromPage = this.$route.query.from || '';

      taskApi
        .getTaskDetail(taskId)
        .then(response => {
          console.log('【任务详情】API响应:', response);
          if (response.data && response.data.code === 200 && response.data.success) {
            this.taskDetail = response.data.data;
          } else {
            const errorMsg = response.data?.msg || '加载任务详情失败';
            this.$message.error(errorMsg);
          }
        })
        .catch(error => {
          console.error('【任务详情】请求异常:', error);
          let errorMsg = '加载任务详情失败';
          if (!error.response) {
            errorMsg = '无法连接到服务器，请检查网络';
          } else {
            const status = error.response.status;
            switch (status) {
              case 401:
                errorMsg = '认证失败，请检查登录状态';
                break;
              case 403:
                errorMsg = '没有权限查看此任务';
                break;
              case 404:
                errorMsg = '任务不存在';
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
          this.loading = false;
        });
    },

    formatDateTime(dateTime) {
      if (!dateTime) return '-';
      const date = new Date(dateTime);
      if (isNaN(date.getTime())) return '-';
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    },

    formatFileSize(bytes) {
      if (!bytes || bytes === 0) return '0 B';
      const k = 1024;
      const sizes = ['B', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    },

    getStatusType(status) {
      const typeMap = {
        pending: 'info',
        in_progress: 'warning',
        completed: 'success',
        rejected: 'danger',
      };
      return typeMap[status] || 'info';
    },

    getReceiveStatusType(status) {
      const typeMap = {
        1: 'success',
        2: 'warning',
        3: 'danger',
        30: 'info',
        32: 'success',
      };
      return typeMap[status] || 'info';
    },

    getReceiveStatusName(status) {
      const nameMap = {
        1: '已接收',
        2: '已转办',
        3: '已拒绝',
        30: '待接收',
        32: '已接收',
      };
      return nameMap[status] || '未知';
    },

    getStageStatus(stageId) {
      const currentStage = parseInt(this.taskDetail.currentStage);
      if (stageId < currentStage) {
        return '完成';
      } else if (stageId === currentStage) {
        return '进行中';
      } else {
        return '未开始';
      }
    },

    getDeptPersonNames(deptGroup) {
      if (!deptGroup.receiverList || deptGroup.receiverList.length === 0) {
        return '暂无';
      }
      const names = deptGroup.receiverList.map(person => person.userName);
      return names.join('、');
    },

    getDeptLeader(deptGroup) {
      // 取第一个人作为分管领导（实际应该从 API 中获取）
      if (deptGroup.receiverList && deptGroup.receiverList.length > 0) {
        return deptGroup.receiverList[0].userName;
      }
      return '暂无';
    },

    handleDownloadFile(attachment) {
      this.$message.info(`下载功能开发中: ${attachment.fileName}`);
    },

    handleGoBack() {
      this.$router.go(-1);
    },

    // 接收任务
    handleAccept() {
      this.showAcceptDialog = true;
    },

    // 提交接收
    handleAcceptSubmit(acceptData) {
      console.log('接收数据：', acceptData);

      // TODO: 调用接收任务API
      this.$message.success('任务接收成功');

      // 刷新任务详情或返回列表
      this.loadTaskDetail(this.$route.params.id);
    },

    // 转办任务
    handleTransfer() {
      this.$message.info('转办功能开发中');
      // TODO: 打开转办对话框
    },

    // 拒绝任务
    handleReject() {
      this.$confirm('确认拒绝此任务吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message.success('任务已拒绝');
        // TODO: 调用拒绝任务API
        // 使用 handleReturn 统一处理返回逻辑
        this.handleReturn();
      }).catch(() => {});
    },

    // 返回
    handleReturn() {
      // 根据来源页面返回到对应列表
      switch (this.fromPage) {
        case 'participate_pending_feedback':
          // 返回到"我参与的"待反馈tab
          this.$router.push({
            path: '/decision/task/participate',
            query: { tab: 'pending_feedback' }
          });
          break;
        case 'participate_pending_review':
          // 返回到"我参与的"待审批tab
          this.$router.push({
            path: '/decision/task/participate',
            query: { tab: 'pending_review' }
          });
          break;
        case 'task_published':
          // 返回到"我发布的"列表
          this.$router.push('/decision/task');
          break;
        default:
          // 默认返回上一页或"我发布的"列表
          if (window.history.length > 1) {
            this.$router.go(-1);
          } else {
            this.$router.push('/decision/task');
          }
      }
    },

    // 打开审批对话框
    handleApprove() {
      this.showApprovalDialog = true;
    },

    // 提交审批
    handleApprovalSubmit(approvalData) {
      console.log('审批数据：', approvalData);

      // 调用审批接口
      taskApi.approveTask(approvalData)
        .then(response => {
          console.log('审批接口响应：', response);
          if (response.data && response.data.code === 200 && response.data.success) {
            const statusText = approvalData.approvalStatus === '11' ? '同意' : '拒绝';
            this.$message.success(`任务审批${statusText}成功`);
            // 使用 handleReturn 统一处理返回逻辑
            this.handleReturn();
          } else {
            const errorMsg = response.data?.msg || '审批失败';
            this.$message.error(errorMsg);
          }
        })
        .catch(error => {
          console.error('审批接口请求异常：', error);
          this.$message.error('审批失败，请检查网络连接');
        });
    },
  },
};
</script>

<style scoped lang="scss">
.task-detail-page {
  @media (max-width: 768px) {
    padding: 12px;
  }

  // 操作按钮栏
  .action-buttons-bar {
    display: flex;
    gap: 12px;
    margin-bottom: 20px;
    justify-content: flex-end;

    .el-button {
      min-width: 80px;
    }
  }

  .box-card {
    margin-bottom: 20px;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .title-section {
      display: flex;
      align-items: center;
      gap: 12px;

      .page-title {
        font-size: 18px;
        font-weight: 600;
        color: #333;
      }
    }
  }

  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 200px;
    color: #999;
    gap: 8px;
  }

  .detail-content {
    .basic-info-section {
      position: relative;
      padding: 24px;
      background-color: #fff;
      border-radius: 4px;
      margin-bottom: 30px;
      border: 1px solid #e5e5e5;

      .stage-badge {
        position: absolute;
        top: 0;
        left: 0;
        width: 4px;
        height: 40px;
        background-color: #409eff;
        border-radius: 0;
      }

      .header-content {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 24px;
        margin-left: 12px;

        .title-area {
          flex: 1;

          .task-title {
            font-size: 20px;
            font-weight: 600;
            color: #333;
            margin: 0 0 8px 0;
            line-height: 1.4;
          }

          .task-source {
            font-size: 14px;
            color: #666;
          }
        }

        .countdown-alert {
          background-color: #ffe0ec;
          padding: 12px 16px;
          border-radius: 4px;
          min-width: 200px;
          text-align: center;

          .alert-content {
            font-size: 12px;
            color: #666;
            margin-bottom: 8px;
          }

          .countdown-value {
            font-size: 14px;
            font-weight: 600;
            color: #ff4d4f;
          }
        }
      }

      .personnel-info {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 32px;
        margin-bottom: 24px;
        margin-left: 12px;

        @media (max-width: 768px) {
          grid-template-columns: 1fr;
          gap: 24px;
        }

        .personnel-column {
          .personnel-title {
            font-size: 14px;
            font-weight: 600;
            color: #333;
            margin-bottom: 12px;
            padding-left: 4px;
            border-left: 3px solid #409eff;
          }

          .personnel-group {
            margin-bottom: 16px;
            font-size: 13px;

            .group-item {
              display: flex;
              margin-bottom: 4px;
              color: #333;

              .dept-label {
                font-weight: 600;
                color: #409eff;
                margin-right: 8px;
                min-width: 20px;
              }

              .dept-names {
                color: #333;
              }
            }

            .group-leader {
              margin-left: 28px;
              color: #666;
              font-size: 12px;
            }
          }
        }
      }

      .basic-info-content {
        margin-left: 12px;

        .content-label {
          font-size: 14px;
          font-weight: 500;
          color: #333;
          margin-bottom: 8px;
        }

        .content-text {
          font-size: 14px;
          color: #666;
          line-height: 1.6;
          white-space: pre-wrap;
          word-break: break-word;
        }
      }

      .basic-info-attachments {
        margin-left: 12px;
        margin-top: 24px;
        padding-top: 24px;
        border-top: 1px solid #e5e5e5;

        .content-label {
          font-size: 14px;
          font-weight: 500;
          color: #333;
          margin-bottom: 12px;
        }

        .attachment-list {
          .attachment-item {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            padding: 12px;
            border: 1px solid #e5e5e5;
            border-radius: 4px;
            margin-bottom: 12px;
            gap: 12px;

            @media (max-width: 480px) {
              flex-direction: column;
            }

            .attachment-info {
              flex: 1;
              min-width: 0;

              .file-name {
                color: #333;
                font-weight: 500;
                margin-bottom: 4px;
                word-break: break-word;
              }

              .file-meta {
                font-size: 12px;
                color: #999;
              }
            }
          }
        }
      }
    }

    .progress-flow {
      margin-bottom: 40px;
      padding: 24px 0;
      background-color: #f9fafb;
      border-radius: 4px;

      .flow-container {
        position: relative;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        padding: 0 20px;

        .flow-line {
          position: absolute;
          top: 24px;
          left: 60px;
          right: 60px;
          height: 2px;
          background: linear-gradient(to right, #409eff 0%, #409eff 50%, #bfbfbf 50%, #bfbfbf 100%);
          z-index: 0;
        }

        .flow-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex: 1;
          position: relative;
          z-index: 1;

          .flow-circle {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
            font-size: 16px;
            margin-bottom: 12px;
            border: 2px solid #409eff;
            background-color: #fff;
            color: #409eff;

            span {
              display: block;
            }
          }

          .flow-info {
            text-align: center;

            .flow-title {
              font-size: 14px;
              font-weight: 500;
              color: #333;
              margin-bottom: 4px;
            }

            .flow-status {
              font-size: 12px;
              color: #999;
            }
          }

          &.completed {
            .flow-circle {
              background-color: #409eff;
              color: #fff;
              border-color: #409eff;
            }

            .flow-status {
              color: #52c41a;
              font-weight: 500;
            }
          }

          &.active {
            .flow-circle {
              background-color: #409eff;
              color: #fff;
              border-color: #409eff;
              box-shadow: 0 0 0 4px rgba(64, 158, 255, 0.2);
            }

            .flow-status {
              color: #ff9c6e;
              font-weight: 500;
            }
          }

          &.pending {
            .flow-circle {
              background-color: #f5f5f5;
              color: #bfbfbf;
              border-color: #bfbfbf;
            }

            .flow-status {
              color: #bfbfbf;
            }
          }
        }
      }

      @media (max-width: 768px) {
        padding: 16px 0;

        .flow-container {
          padding: 0 12px;

          .flow-line {
            left: 30px;
            right: 30px;
          }

          .flow-item {
            .flow-circle {
              width: 40px;
              height: 40px;
              font-size: 14px;
              margin-bottom: 8px;
            }

            .flow-info {
              .flow-title {
                font-size: 12px;
              }

              .flow-status {
                font-size: 11px;
              }
            }
          }
        }
      }
    }

    .section {
      margin-bottom: 30px;

      .section-title {
        font-size: 16px;
        font-weight: 600;
        color: #333;
        margin-bottom: 16px;
        padding-bottom: 12px;
        border-bottom: 2px solid #e5e5e5;
      }
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;

      @media (max-width: 768px) {
        grid-template-columns: 1fr;
        gap: 12px;
      }

      .info-item {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;

        &.full-width {
          grid-column: 1 / -1;
        }

        .label {
          font-weight: 500;
          color: #666;
          min-width: 120px;

          @media (max-width: 480px) {
            min-width: 80px;
            font-size: 13px;
          }
        }

        .value {
          color: #333;
          flex: 1;
          word-break: break-word;

          &.countdown {
            color: #ff4d4f;
            font-weight: 600;
          }
        }
      }
    }

    .task-content-section {
      padding: 16px;
      background-color: #f9f9f9;
      border-radius: 4px;
      line-height: 1.6;
      color: #333;
      white-space: pre-wrap;
      word-wrap: break-word;
      max-height: 400px;
      overflow-y: auto;

      @media (max-width: 768px) {
        padding: 12px;
        max-height: 300px;
      }
    }

    .personnel-list {
      .dept-group {
        margin-bottom: 16px;
        padding: 12px;
        background-color: #f9f9f9;
        border-radius: 4px;

        .dept-name {
          font-weight: 600;
          color: #333;
          margin-bottom: 12px;
          font-size: 14px;
        }

        .receiver-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
      }
    }

    .attachment-list {
      .attachment-item {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        padding: 12px;
        border: 1px solid #e5e5e5;
        border-radius: 4px;
        margin-bottom: 12px;
        gap: 12px;

        @media (max-width: 480px) {
          flex-direction: column;
        }

        .attachment-info {
          flex: 1;
          min-width: 0;

          .file-name {
            color: #333;
            font-weight: 500;
            margin-bottom: 4px;
            word-break: break-word;
          }

          .file-meta {
            font-size: 12px;
            color: #999;
          }
        }
      }
    }

    .receive-rate-section {
      .receive-status-row {
        display: flex;
        align-items: flex-start;
        margin-bottom: 16px;
        padding: 12px;
        background-color: #f9f9f9;
        border-radius: 4px;
        gap: 24px;

        @media (max-width: 768px) {
          flex-direction: column;
          gap: 8px;
        }

        .status-label {
          display: flex;
          align-items: center;
          gap: 4px;
          white-space: nowrap;
          min-width: max-content;

          .status-text {
            font-weight: 500;
            color: #333;
            font-size: 14px;
          }

          .status-count {
            color: #666;
            font-size: 13px;
          }
        }

        .user-names {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 4px;
          flex: 1;

          .user-name {
            color: #333;
            font-size: 14px;

            .separator {
              margin: 0 2px;
              color: #999;
            }
          }
        }
      }
    }

    .progress-timeline {
      position: relative;
      padding-left: 30px;

      @media (max-width: 480px) {
        padding-left: 24px;
      }

      &::before {
        content: '';
        position: absolute;
        left: 8px;
        top: 0;
        bottom: 0;
        width: 2px;
        background-color: #e5e5e5;
      }

      .timeline-item {
        position: relative;
        margin-bottom: 24px;

        .timeline-dot {
          position: absolute;
          left: -22px;
          top: 0;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background-color: #1890ff;
          border: 3px solid #fff;
          box-shadow: 0 0 0 2px #e5e5e5;

          @media (max-width: 480px) {
            width: 14px;
            height: 14px;
            left: -20px;
            border-width: 2px;
          }
        }

        .timeline-content {
          padding: 12px;
          background-color: #f9f9f9;
          border-radius: 4px;

          .progress-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            flex-wrap: wrap;
            gap: 8px;

            .stage-name {
              font-weight: 600;
              color: #333;
              font-size: 14px;
            }

            .operator-info {
              font-size: 12px;
              color: #999;
            }
          }

          .progress-time {
            font-size: 12px;
            color: #999;
            margin-bottom: 8px;
          }

          .progress-attachments {
            margin-top: 12px;
            padding-top: 12px;
            border-top: 1px solid #e5e5e5;

            .attachment-label {
              font-size: 12px;
              color: #666;
              margin-bottom: 8px;
            }

            .progress-file {
              margin-right: 8px;
              margin-bottom: 8px;
            }
          }
        }
      }
    }

    .empty-state {
      text-align: center;
      color: #999;
      padding: 40px 0;
      font-size: 14px;
    }
  }
}
</style>
