<template>
  <basic-container>
    <!-- 面包屑导航 -->
    <decision-breadcrumb :breadcrumbs="['首页']" />

    <!-- 欢迎横幅 -->
    <welcome-banner :user-name="userInfo?.name || 'xxx'" />

    <!-- 快速入口 -->
    <quick-entry
      @topic-create="handleTopicCreate"
    />

    <!-- 待办事项：议题和任务 -->
    <el-row :gutter="20" class="pending-row">
      <!-- 议题待办 -->
      <el-col :span="12">
        <pending-items
          title="议题待办"
          :badges="topicBadges"
          :data="pendingTopics"
          :columns="topicColumns"
          action-label="去审批"
          @view-all="goToTopics"
          @item-click="handleTopicDetail"
          @action="handleTopicApproval"
        />
      </el-col>

      <!-- 任务待办 -->
      <el-col :span="12">
        <pending-items
          title="任务待办"
          :badges="taskBadges"
          :data="pendingTasks"
          :columns="taskColumns"
          action-label="去审批"
          @view-all="goToTasks"
          @item-click="handleTaskDetail"
          @action="handleTaskApproval"
        />
      </el-col>
    </el-row>

    <!-- 活动动态 -->
    <el-row :gutter="20" class="activity-row">
      <!-- 相关议题动态 -->
      <el-col :span="12">
        <activity-log
          title="相关议题动态"
          :logs="topicLogs"
        />
      </el-col>

      <!-- 相关任务动态 -->
      <el-col :span="12">
        <activity-log
          title="相关任务动态"
          :logs="taskLogs"
        />
      </el-col>
    </el-row>
  </basic-container>
</template>

<script>
import { mapGetters } from 'vuex';
import DecisionBreadcrumb from '../components/breadcrumb.vue';
import WelcomeBanner from '../components/welcome-banner/index.vue';
import QuickEntry from '../components/quick-entry/index.vue';
import PendingItems from '../components/pending-items/index.vue';
import ActivityLog from '../components/activity-log/index.vue';

export default {
  name: 'DecisionIndex',
  components: {
    DecisionBreadcrumb,
    WelcomeBanner,
    QuickEntry,
    PendingItems,
    ActivityLog
  },
  data() {
    return {
      pendingTopics: [
        {
          id: 1,
          title: '汇报学生党支部资质资教学项',
          department: '胸外科',
          applyTime: '2025-08-08 12:12:12'
        },
        {
          id: 2,
          title: '汇报职工党党支部支持候选人名单',
          department: '胸外科',
          applyTime: '2025-08-08 12:12:12'
        },
        {
          id: 3,
          title: '汇报了成等16位中层干部用期满…',
          department: '胸外科',
          applyTime: '2025-08-08 12:12:12'
        },
        {
          id: 4,
          title: '关于正式任命xxx为胸外科副主任',
          department: '胸外科',
          applyTime: '2025-08-08 12:12:12'
        },
        {
          id: 5,
          title: '关于正式任命xxx为胸外科副主任',
          department: '胸外科',
          applyTime: '2025-08-08 12:12:12'
        }
      ],
      pendingTasks: [
        {
          id: 101,
          title: '汇报学生党支部贡献事项',
          creator: '李四',
          createTime: '2025-08-08 12:12:12'
        },
        {
          id: 102,
          title: '汇报教职工党党支部支持候选人名单',
          creator: '张三',
          createTime: '2025-08-08 12:12:12'
        },
        {
          id: 103,
          title: '汇报了成等中层干部用期满…',
          creator: '张秋月',
          createTime: '2025-08-08 12:12:12'
        },
        {
          id: 104,
          title: '关于正式任名xxx为胸外科副主任',
          creator: '蔡朝',
          createTime: '2025-08-08 12:12:12'
        }
      ],
      topicLogs: [
        {
          userName: '张明明',
          content: '【议题审批-审批点名称】张明明审批了（同意）....',
          status: 'agree',
          time: '2025-09-08 12:12:12'
        },
        {
          userName: '李四',
          content: '议题（xxxx）的【议题审批】已通过。',
          status: 'agree',
          time: '2025-09-08 12:12:12'
        },
        {
          userName: '张明月',
          content: '议题（xxxx）的【录入会议结论审批】已通过。',
          status: 'agree',
          time: '2025-09-08 12:12:12'
        },
        {
          userName: '张明明',
          content: '【申请上会审批-审批点名称】张明明审批了（拒绝）...',
          status: 'reject',
          time: '2025-09-08 12:12:12'
        },
        {
          userName: '李四',
          content: '议题（xxxx）的【录入会议结论审批】已通过。',
          status: 'agree',
          time: '2025-09-08 12:12:12'
        }
      ],
      taskLogs: [
        {
          userName: '张明明',
          content: '张明明接收了任务（汇报学生党支部贡献事项）。',
          status: 'agree',
          time: '2025-09-08 12:12:12'
        },
        {
          userName: '李四',
          content: '李四反馈了任务（汇报教职工党党支部支持候选人名单）。',
          status: 'agree',
          time: '2025-09-08 12:12:12'
        },
        {
          userName: '张秋月',
          content: '张秋月接收了任务（汇报了成等中层干部用期满）。',
          status: 'agree',
          time: '2025-09-08 12:12:12'
        }
      ],
      topicColumns: [
        { prop: 'title', label: '议题名称', isLink: true },
        { prop: 'department', label: '申报科室', width: '150' },
        { prop: 'applyTime', label: '议题申请时间', width: '160' }
      ],
      taskColumns: [
        { prop: 'title', label: '任务名称', isLink: true },
        { prop: 'creator', label: '发起人', width: '120' },
        { prop: 'createTime', label: '任务发起时间', width: '160' }
      ],
      loading: true
    };
  },
  computed: {
    ...mapGetters(['userInfo']),
    topicBadges() {
      return [
        { label: '待审批', type: 'warning', count: 7 }
      ];
    },
    taskBadges() {
      return [
        { label: '待审批', type: 'warning', count: 9 },
        { label: '待接收', type: 'info', count: 2 },
        { label: '待反馈', type: 'danger', count: 2 }
      ];
    }
  },
  mounted() {
    this.loadData();
  },
  methods: {
    loadData() {
      // 模拟数据加载
      this.loading = false;
    },

    handleTopicCreate() {
      this.$router.push('/decision/topic/create');
    },

    goToTopics() {
      this.$router.push('/decision/topic');
    },

    goToTasks() {
      this.$router.push('/decision/task');
    },

    handleTopicDetail(row) {
      this.$router.push(`/decision/topic/detail/${row.id}`);
    },

    handleTaskDetail(row) {
      this.$router.push(`/decision/task/detail/${row.id}`);
    },

    handleTopicApproval(row) {
      this.$router.push(`/decision/topic/detail/${row.id}`);
    },

    handleTaskApproval(row) {
      this.$router.push(`/decision/task/detail/${row.id}`);
    }
  }
};
</script>

<style scoped lang="scss">
.pending-row {
  margin-bottom: 30px;
}

.activity-row {
  margin-bottom: 30px;
}
</style>
