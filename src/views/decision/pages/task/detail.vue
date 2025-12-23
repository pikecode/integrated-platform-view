<template>
  <div class="task-detail-page">
    <el-card class="box-card">
      <!-- 页面头部 -->
      <template #header>
        <div class="card-header">
          <div class="title-section">
            <el-button type="primary" text @click="handleGoBack"> ← 返回 </el-button>
            <span class="page-title">任务详情</span>
          </div>
        </div>
      </template>

      <!-- 加载状态 -->
      <div v-if="loading" class="loading-container">
        <el-icon class="is-loading"><Loading /></el-icon>
        <span>加载中...</span>
      </div>

      <!-- 主内容 -->
      <div v-else-if="taskDetail" class="detail-content">
        <!-- 基本信息 -->
        <div class="section">
          <div class="section-title">基本信息</div>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">任务名称：</span>
              <span class="value">{{ taskDetail.taskName }}</span>
            </div>
            <div class="info-item">
              <span class="label">任务来源：</span>
              <span class="value">{{ taskDetail.taskSourceName }}</span>
            </div>
            <div class="info-item">
              <span class="label">任务标签：</span>
              <span class="value">{{ taskDetail.taskTagName }}</span>
            </div>
            <div class="info-item">
              <span class="label">任务状态：</span>
              <el-tag :type="getStatusType(taskDetail.taskStatus)">
                {{ taskDetail.taskStatusName }}
              </el-tag>
            </div>
            <div class="info-item">
              <span class="label">发布者：</span>
              <span class="value">{{ taskDetail.publishUserName }}</span>
            </div>
            <div class="info-item">
              <span class="label">当前阶段：</span>
              <span class="value">{{ taskDetail.currentStageName }}</span>
            </div>
            <div class="info-item full-width">
              <span class="label">创建时间：</span>
              <span class="value">{{ formatDateTime(taskDetail.createTime) }}</span>
            </div>
          </div>
        </div>

        <!-- 任务内容 -->
        <div class="section">
          <div class="section-title">任务内容</div>
          <div class="task-content-section">
            {{ taskDetail.taskContent || '暂无任务内容' }}
          </div>
        </div>

        <!-- 时间信息 -->
        <div class="section">
          <div class="section-title">时间信息</div>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">预计完成时间：</span>
              <span class="value">{{ formatDateTime(taskDetail.expectFinishTime) }}</span>
            </div>
            <div class="info-item">
              <span class="label">截止时间：</span>
              <span class="value">{{ formatDateTime(taskDetail.deadlineTime) }}</span>
            </div>
            <div class="info-item" v-if="taskDetail.taskFinishCountdown">
              <span class="label">完成倒计时：</span>
              <span class="value countdown">{{ taskDetail.taskFinishCountdown }}</span>
            </div>
          </div>
        </div>

        <!-- 执行人员 -->
        <div class="section">
          <div class="section-title">执行人员</div>
          <div v-if="taskDetail.executorList && taskDetail.executorList.length > 0" class="personnel-list">
            <div v-for="dept in taskDetail.executorList" :key="dept.deptId" class="dept-group">
              <div class="dept-name">{{ dept.deptName }}</div>
              <div class="receiver-list">
                <el-tag
                  v-for="person in dept.receiverList"
                  :key="person.id"
                  :type="getReceiveStatusType(person.receiveStatus)"
                  class="person-tag"
                >
                  {{ person.userName }} ({{ getReceiveStatusName(person.receiveStatus) }})
                </el-tag>
              </div>
            </div>
          </div>
          <div v-else class="empty-state">暂无执行人员</div>
        </div>

        <!-- 配合人员 -->
        <div class="section">
          <div class="section-title">配合人员</div>
          <div v-if="taskDetail.cooperatorList && taskDetail.cooperatorList.length > 0" class="personnel-list">
            <div v-for="dept in taskDetail.cooperatorList" :key="dept.deptId" class="dept-group">
              <div class="dept-name">{{ dept.deptName }}</div>
              <div class="receiver-list">
                <el-tag
                  v-for="person in dept.receiverList"
                  :key="person.id"
                  :type="getReceiveStatusType(person.receiveStatus)"
                  class="person-tag"
                >
                  {{ person.userName }} ({{ getReceiveStatusName(person.receiveStatus) }})
                </el-tag>
              </div>
            </div>
          </div>
          <div v-else class="empty-state">暂无配合人员</div>
        </div>

        <!-- 附件列表 -->
        <div class="section">
          <div class="section-title">附件列表</div>
          <div v-if="taskDetail.attachmentList && taskDetail.attachmentList.length > 0" class="attachment-list">
            <div v-for="attachment in taskDetail.attachmentList" :key="attachment.id" class="attachment-item">
              <div class="attachment-info">
                <div class="file-name">{{ attachment.fileName }}</div>
                <div class="file-meta">
                  {{ formatFileSize(attachment.fileSize) }} · {{ attachment.uploadUserName }} · {{ formatDateTime(attachment.uploadTime) }}
                </div>
              </div>
              <el-button type="primary" text size="small" @click="handleDownloadFile(attachment)">
                下载
              </el-button>
            </div>
          </div>
          <div v-else class="empty-state">暂无附件</div>
        </div>

        <!-- 接收情况统计 -->
        <div class="section">
          <div class="section-title">接收情况统计</div>
          <div v-if="taskDetail.receiveRate" class="receive-rate-section">
            <div class="rate-summary">
              <div class="rate-item">
                <div class="rate-value" style="color: #52c41a">{{ taskDetail.receiveRate.receivedCount }}</div>
                <div class="rate-label">已接收</div>
              </div>
              <div class="rate-item">
                <div class="rate-value" style="color: #ff4d4f">{{ taskDetail.receiveRate.rejectedCount }}</div>
                <div class="rate-label">已拒绝</div>
              </div>
              <div class="rate-item">
                <div class="rate-value" style="color: #1890ff">{{ taskDetail.receiveRate.totalCount }}</div>
                <div class="rate-label">总计</div>
              </div>
            </div>

            <div v-if="taskDetail.receiveRate.receivedUserList && taskDetail.receiveRate.receivedUserList.length > 0" class="receive-users">
              <div class="user-title">已接收人员</div>
              <el-tag v-for="user in taskDetail.receiveRate.receivedUserList" :key="user.id" type="success" class="user-tag">
                {{ user.userName }}
              </el-tag>
            </div>

            <div v-if="taskDetail.receiveRate.rejectedUserList && taskDetail.receiveRate.rejectedUserList.length > 0" class="reject-users">
              <div class="user-title">已拒绝人员</div>
              <el-tag v-for="user in taskDetail.receiveRate.rejectedUserList" :key="user.id" type="danger" class="user-tag">
                {{ user.userName }}
              </el-tag>
            </div>
          </div>
        </div>

        <!-- 进度列表 -->
        <div class="section">
          <div class="section-title">任务进度</div>
          <div v-if="taskDetail.progressList && taskDetail.progressList.length > 0" class="progress-timeline">
            <div v-for="progress in taskDetail.progressList" :key="progress.id" class="timeline-item">
              <div class="timeline-dot"></div>
              <div class="timeline-content">
                <div class="progress-header">
                  <span class="stage-name">{{ progress.progressStageName }}</span>
                  <span class="operator-info">{{ progress.operatorName }} · {{ progress.operatorTypeName }}</span>
                </div>
                <div class="progress-time">{{ formatDateTime(progress.createTime) }}</div>
                <div v-if="progress.attachmentVOList && progress.attachmentVOList.length > 0" class="progress-attachments">
                  <div class="attachment-label">进度附件：</div>
                  <el-tag v-for="attachment in progress.attachmentVOList" :key="attachment.id" type="info" class="progress-file">
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
  </div>
</template>

<script>
import { Loading } from '@element-plus/icons-vue';
import * as taskApi from '@/api/decision/task';

export default {
  name: 'TaskDetail',
  components: {
    Loading
  },
  data() {
    return {
      taskDetail: null,
      loading: false
    };
  },
  watch: {
    '$route.params.id': {
      handler(newVal) {
        if (newVal) {
          this.loadTaskDetail(newVal);
        }
      },
      immediate: true
    }
  },
  methods: {
    loadTaskDetail(taskId) {
      this.loading = true;
      taskApi.getTaskDetail(taskId)
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
        'pending': 'info',
        'in_progress': 'warning',
        'completed': 'success',
        'rejected': 'danger'
      };
      return typeMap[status] || 'info';
    },

    getReceiveStatusType(status) {
      const typeMap = {
        '1': 'success',
        '2': 'warning',
        '3': 'danger',
        '30': 'info',
        '32': 'success'
      };
      return typeMap[status] || 'info';
    },

    getReceiveStatusName(status) {
      const nameMap = {
        '1': '已接收',
        '2': '已转办',
        '3': '已拒绝',
        '30': '待接收',
        '32': '已接收'
      };
      return nameMap[status] || '未知';
    },

    handleDownloadFile(attachment) {
      this.$message.info(`下载功能开发中: ${attachment.fileName}`);
    },

    handleGoBack() {
      this.$router.go(-1);
    }
  }
};
</script>

<style scoped lang="scss">
.task-detail-page {
  padding: 20px;
  background-color: #f5f7fa;

  @media (max-width: 768px) {
    padding: 12px;
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
      .rate-summary {
        display: flex;
        gap: 40px;
        margin-bottom: 20px;
        padding: 20px;
        background-color: #f9f9f9;
        border-radius: 4px;
        justify-content: space-around;

        @media (max-width: 768px) {
          gap: 20px;
          padding: 16px;
        }

        @media (max-width: 480px) {
          flex-direction: column;
          gap: 16px;
        }

        .rate-item {
          text-align: center;

          .rate-value {
            font-size: 28px;
            font-weight: 600;
            margin-bottom: 8px;

            @media (max-width: 480px) {
              font-size: 24px;
            }
          }

          .rate-label {
            font-size: 14px;
            color: #666;
          }
        }
      }

      .receive-users,
      .reject-users {
        margin-bottom: 16px;

        .user-title {
          font-weight: 500;
          color: #666;
          margin-bottom: 12px;
          font-size: 14px;
        }

        .user-tag {
          margin-right: 8px;
          margin-bottom: 8px;
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
