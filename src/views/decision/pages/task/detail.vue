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
          <div class="countdown-time">3天20小时</div>
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
  </basic-container>
</template>

<script>
import DecisionBreadcrumb from '../../components/breadcrumb.vue';

export default {
  name: 'TaskDetail',
  components: {
    DecisionBreadcrumb
  },
  data() {
    return {
      taskId: null,
      currentStepIndex: 2,
      showCountdown: true,
      processSteps: [
        {
          title: '任务新增',
          status: '完成',
          statusClass: 'status-complete',
          time: '2025-09-12 12:12:12'
        },
        {
          title: '任务接收',
          status: '完成',
          statusClass: 'status-complete',
          time: '2025-09-12 12:12:12'
        },
        {
          title: '任务反馈',
          status: '进行中',
          statusClass: 'status-process',
          time: null
        },
        {
          title: '任务完成',
          status: '未开始',
          statusClass: 'status-wait',
          time: null
        }
      ],
      taskData: {
        id: null,
        title: '汇报学生党支部资质资教学项',
        source: '议题',
        executors: [
          { dept: '普外科', person: '王明伟、张三、李四' },
          { dept: '胸外科', person: '王明伟、张三、李四' },
          { dept: 'xxx科', person: '王明伟、张三、李四' }
        ],
        cooperators: [
          { dept: '普外科', person: '王明伟、张三、李四' },
          { dept: '胸外科', person: '王明伟、张三、李四' },
          { dept: 'xxx科', person: '王明伟、张三、李四' }
        ],
        content: '近日，学校收到教育行政主管部门关于深化科研人员参与论文的行业转变，要求恶魔部门超越基层单位进展；除常规访谈、核对数据外，涉及数据库，建设连线合作，需要新增内容关系到不完整问题责任焦虑。科研部约谈了相关人员并开展行业讨论，进行常规访谈、核对数据，于2025年9月8日上午在校师大行政楼618会议室内涵请5名协办方家助认同议论文是否存在学术不端问题题目责任焦虑附件。并于2025年9月8日下午进行学术委员会评议（线上/线下形式），11位委员进行投票，9位委员认定论文在科研研信行为。现提交院长办公室审议。',
        attachments: [
          { name: '文件名称.doc', size: '104MB', url: '#' },
          { name: '文件名称.doc', size: '104MB', url: '#' }
        ]
      }
    };
  },
  computed: {
    breadcrumbs() {
      return ['任务管理', '我发布的', '任务详情'];
    }
  },
  created() {
    this.taskId = this.$route.params.id;
    this.loadTaskDetail();
  },
  methods: {
    loadTaskDetail() {
      // Mock 数据加载
      setTimeout(() => {
        // 数据已在 data 中初始化
        console.log('Task detail loaded:', this.taskData);
      }, 300);
    },

    handlePreview(file) {
      this.$message.info('预览功能开发中');
    },

    handleDownload(file) {
      this.$message.success('开始下载: ' + file.name);
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
