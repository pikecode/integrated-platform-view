<template>
  <basic-container>
    <decision-breadcrumb :breadcrumbs="breadcrumbs" />

    <!-- 流程进度条 -->
    <div class="process-steps">
      <el-steps :active="currentStepIndex" finish-status="success" align-center>
        <el-step
          v-for="(step, index) in processSteps"
          :key="index"
          :title="step.title"
          :status="getStepStatus(index)"
        >
          <template #description>
            <div class="step-description">
              <div>{{ step.label }}</div>
              <div class="step-time" v-if="topicData[step.timeField]">
                {{ topicData[step.timeField] }}
              </div>
            </div>
          </template>
        </el-step>
      </el-steps>
    </div>

    <!-- 基础信息卡片 -->
    <el-card class="detail-card">
      <template #header>
        <div class="card-title-container">
          <span class="card-title">议题基础信息</span>
        </div>
      </template>

      <el-row :gutter="20">
        <el-col :span="24">
          <div class="info-item">
            <span class="label">议题名称</span>
            <span class="value">{{ topicData.title }}</span>
          </div>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <div class="info-item">
            <span class="label">申报科室</span>
            <span class="value">{{ topicData.department }}</span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="info-item">
            <span class="label">科室主任</span>
            <span class="value">{{ topicData.deptDirector }}</span>
          </div>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <div class="info-item">
            <span class="label">汇报人</span>
            <span class="value">{{ topicData.reporter }}</span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="info-item">
            <span class="label">科室分管领导号</span>
            <span class="value">{{ topicData.leader }}</span>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <!-- 议题内容 -->
    <el-card class="detail-card">
      <template #header>
        <span class="card-title">议题内容</span>
      </template>

      <el-row :gutter="20">
        <el-col :span="24">
          <div class="content-section">
            <h4 class="section-title">议题内容摘要</h4>
            <div class="content-text" v-html="topicData.summary"></div>
          </div>
        </el-col>
      </el-row>

      <el-row :gutter="20" style="margin-top: 20px">
        <el-col :span="24">
          <div class="content-section">
            <h4 class="section-title">会前讨论情况及建议解决方案</h4>
            <div class="content-text">{{ topicData.discussion }}</div>
          </div>
        </el-col>
      </el-row>

      <!-- 相关附件 -->
      <el-row :gutter="20" style="margin-top: 20px" v-if="topicData.attachments && topicData.attachments.length > 0">
        <el-col :span="24">
          <div class="content-section">
            <h4 class="section-title">相关附件</h4>
            <el-table :data="topicData.attachments" size="small" style="width: 100%">
              <el-table-column prop="name" label="文件名" width="200" />
              <el-table-column prop="size" label="大小" width="100" />
              <el-table-column label="操作" width="100">
                <template #default="scope">
                  <el-link type="primary" :href="scope.row.url" target="_blank">下载</el-link>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <!-- 其他信息 -->
    <el-card class="detail-card">
      <template #header>
        <span class="card-title">其他信息</span>
      </template>

      <el-row :gutter="20">
        <el-col :span="12">
          <div class="info-item">
            <span class="label">是否三重一大</span>
            <span class="value">{{ topicData.isImportant }}</span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="info-item">
            <span class="label">是否需要协同科室</span>
            <span class="value">{{ topicData.needCollaboration }}</span>
          </div>
        </el-col>
      </el-row>

      <el-row :gutter="20" v-if="topicData.needCollaboration === '是'">
        <el-col :span="12">
          <div class="info-item">
            <span class="label">协同科室</span>
            <span class="value">{{ topicData.collaborationDepts ? topicData.collaborationDepts.join('、') : '-' }}</span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="info-item">
            <span class="label">协同科室负责人</span>
            <span class="value">{{ topicData.collaborationLeaders }}</span>
          </div>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <div class="info-item">
            <span class="label">是否存在相关风险</span>
            <span class="value">{{ topicData.hasRisk }}</span>
          </div>
        </el-col>
      </el-row>

      <el-row :gutter="20" v-if="topicData.hasRisk === '是'">
        <el-col :span="24">
          <div class="info-item">
            <span class="label">风险应对措施</span>
            <span class="value">{{ topicData.riskMeasures }}</span>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <!-- 申请上会信息 -->
    <el-card class="detail-card" v-if="currentStepIndex >= 1">
      <template #header>
        <span class="card-title">申请上会</span>
      </template>

      <el-row :gutter="20">
        <el-col :span="12">
          <div class="info-item">
            <span class="label">申请人</span>
            <span class="value">{{ topicData.applyUser }}</span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="info-item">
            <span class="label">会议名称</span>
            <span class="value">{{ topicData.meetingType }}</span>
          </div>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <div class="info-item">
            <span class="label">会议类型</span>
            <span class="value">{{ topicData.meetingCategory }}</span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="info-item">
            <span class="label">期望汇报时间</span>
            <span class="value">{{ topicData.expectedTime }}</span>
          </div>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <div class="info-item">
            <span class="label">会议时间段</span>
            <span class="value">{{ formatDateRange(topicData.meetingStartTime, topicData.meetingEndTime) }}</span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="info-item">
            <span class="label">会议时长</span>
            <span class="value">{{ topicData.meetingDuration }}</span>
          </div>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="24">
          <div class="info-item">
            <span class="label">参会人员</span>
            <div class="participants">
              <el-tag v-for="participant in topicData.participants" :key="participant">
                {{ participant }}
              </el-tag>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <!-- 议题上会 -->
    <el-card class="detail-card" v-if="currentStepIndex >= 2">
      <template #header>
        <span class="card-title">议题上会</span>
      </template>

      <el-row :gutter="20">
        <el-col :span="24">
          <div class="info-item">
            <span class="label">会议内容</span>
            <div class="content-text">
              {{ topicData.meetingContent || '暂无内容' }}
            </div>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <!-- 结论录入 -->
    <el-card class="detail-card" v-if="currentStepIndex >= 3">
      <template #header>
        <span class="card-title">结论录入</span>
      </template>

      <el-row :gutter="20">
        <el-col :span="12">
          <div class="info-item">
            <span class="label">录入人员</span>
            <span class="value">{{ topicData.conclusionUser }}</span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="info-item">
            <span class="label">录入时间</span>
            <span class="value">{{ topicData.conclusionTime }}</span>
          </div>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="24">
          <div class="info-item">
            <span class="label">会议结论</span>
            <div class="content-text">
              {{ topicData.conclusion || '暂无结论' }}
            </div>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <!-- 操作按钮 -->
    <div class="action-buttons">
      <el-button @click="handleBack">返回</el-button>
      <el-button type="primary" @click="handleEdit" v-if="canEdit">编辑</el-button>
    </div>
  </basic-container>
</template>

<script>
import DecisionBreadcrumb from '../../components/breadcrumb.vue';

export default {
  name: 'TopicDetail',
  components: {
    DecisionBreadcrumb
  },
  data() {
    return {
      topicId: null,
      topicData: {
        id: null,
        title: '',
        department: '',
        deptDirector: '',
        reporter: '',
        leader: '',
        summary: '',
        discussion: '',
        attachments: [],
        isImportant: '否',
        needCollaboration: '否',
        collaborationDepts: [],
        collaborationLeaders: '',
        hasRisk: '否',
        riskMeasures: '',
        meetingType: '',
        expectedTime: '',
        status: 'draft',
        createdAt: '',
        applyUser: '',
        meetingCategory: '常委会',
        meetingStartTime: '',
        meetingEndTime: '',
        meetingDuration: '2小时',
        participants: [],
        meetingContent: '',
        conclusionUser: '',
        conclusionTime: '',
        conclusion: ''
      },
      processSteps: [
        {
          title: '议题提交',
          label: '完成',
          timeField: 'createdAt',
          status: 'draft'
        },
        {
          title: '申请上会',
          label: '完成',
          timeField: 'applyTime',
          status: 'pending_vote'
        },
        {
          title: '议题上会',
          label: '进行中',
          timeField: 'meetingTime',
          status: 'voting'
        },
        {
          title: '结论录入',
          label: '未开始',
          timeField: 'conclusionTime',
          status: 'completed'
        }
      ]
    };
  },
  computed: {
    breadcrumbs() {
      return ['议题管理', '议题详情'];
    },
    currentStepIndex() {
      const statusMap = {
        'draft': 0,
        'pending_vote': 0,
        'applying': 1,
        'approved': 1,
        'voting': 2,
        'completed': 3,
        'withdrawn': 0
      };
      return statusMap[this.topicData.status] || 0;
    },
    canEdit() {
      // 只有草稿状态可以编辑
      return this.topicData.status === 'draft';
    }
  },
  created() {
    this.topicId = this.$route.params.id;
    this.loadTopicDetail();
  },
  methods: {
    loadTopicDetail() {
      // Mock 议题详情数据
      setTimeout(() => {
        this.topicData = {
          id: this.topicId,
          title: '汇报学生党支部资质资教学项',
          department: '胸外科',
          deptDirector: '张三',
          reporter: '王小军',
          leader: '张三',
          summary: '<p>近日，学校收到教育行政主管部门关于深化科研人员参与论文的行业转变，要求恶魔部门超越基层单位进展；除常规访谈、核对数据外，涉及数据库，建设连线合作，需要新增内容关系到不完整问题责任焦虑。</p>',
          discussion: '会前讨论情况及建议解决方案的具体内容，持续讨论相关文件的合理性，展开使用会议资源，人员要都能配合，会议实际执行与策略性意见互通有无外专业协助认证送交资料存在学术不清问题题目责任焦虑附件。',
          attachments: [
            { name: '文件名称.doc', size: '104MB', url: '#' },
            { name: '文件名称.doc', size: '104MB', url: '#' },
            { name: '文件名称.doc', size: '104MB', url: '#' }
          ],
          isImportant: '是',
          needCollaboration: '是',
          collaborationDepts: ['心内科', '放射科'],
          collaborationLeaders: '李四、王五',
          hasRisk: '否',
          riskMeasures: '',
          meetingType: '院长办公会',
          expectedTime: '2025-09-12',
          status: 'voting',
          createdAt: '2025-09-12 12:12:12',
          applyTime: '2025-09-12 12:12:12',
          applyUser: '张三',
          meetingCategory: '常委会',
          meetingStartTime: '2025-09-08 15:00',
          meetingEndTime: '2025-09-08 17:00',
          meetingDuration: '2小时',
          participants: ['张三', '李四', '王五', '赵六', '孙七', '周八'],
          meetingContent: '',
          conclusionUser: '',
          conclusionTime: '',
          conclusion: ''
        };
      }, 300);
    },

    getStepStatus(index) {
      if (index < this.currentStepIndex) {
        return 'finish';
      } else if (index === this.currentStepIndex) {
        return 'process';
      } else {
        return 'wait';
      }
    },

    formatDateRange(startTime, endTime) {
      if (startTime && endTime) {
        return `${startTime}～${endTime}`;
      }
      return '-';
    },

    handleBack() {
      this.$router.go(-1);
    },

    handleEdit() {
      this.$router.push(`/decision/topic/edit/${this.topicId}`);
    }
  }
};
</script>

<style scoped lang="scss">
.detail-card {
  margin-bottom: 20px;

  ::v-deep .el-card__header {
    background: #f5f7fa;
    border-bottom: 1px solid #ebeef5;
  }

  .card-title-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .card-title {
    font-size: 16px;
    font-weight: 500;
    color: #303133;
  }
}

.process-steps {
  margin-bottom: 30px;
  background: #fff;
  padding: 20px;
  border-radius: 4px;

  ::v-deep .el-step__main {
    position: relative;
  }

  .step-description {
    text-align: center;
    font-size: 12px;

    .step-time {
      color: #909399;
      font-size: 11px;
      margin-top: 4px;
    }
  }
}

.info-item {
  display: flex;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;

  .label {
    width: 140px;
    flex-shrink: 0;
    color: #606266;
    font-weight: 500;
  }

  .value {
    flex: 1;
    color: #303133;
    word-break: break-word;
  }
}

.content-section {
  margin-bottom: 20px;

  .section-title {
    margin: 0 0 12px 0;
    font-size: 14px;
    font-weight: 500;
    color: #303133;
    border-left: 3px solid #409eff;
    padding-left: 10px;
  }

  .content-text {
    color: #606266;
    line-height: 1.6;
    padding: 12px;
    background: #fafafa;
    border-radius: 4px;
  }
}

.participants {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding-top: 8px;

  ::v-deep .el-tag {
    margin: 4px 0;
  }
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 30px;
  padding-bottom: 20px;

  .el-button {
    width: 120px;
  }
}
</style>
