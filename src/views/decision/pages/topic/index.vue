<template>
  <div class="topic-management-page">
    <!-- 面包屑导航 -->
    <decision-breadcrumb :breadcrumbs="['议题管理', activeTab === 'pending' ? '待我审批' : '已审批']" />

    <!-- 标签页 -->
    <div class="tabs-container">
      <el-tabs v-model="activeTab" @tab-change="handleTabChange">
        <el-tab-pane label="待审批" name="pending"></el-tab-pane>
        <el-tab-pane label="已审批" name="approved"></el-tab-pane>
      </el-tabs>
    </div>

    <!-- 自定义搜索表单 -->
    <div class="search-form-container">
      <el-form :model="searchParams" label-width="100px" size="small">
        <el-row :gutter="20">
          <!-- 第一行：基础搜索条件 -->
          <el-col :span="6">
            <el-form-item label="议题名称">
              <el-input
                v-model="searchParams.title"
                placeholder="请输入议题名称"
                @keyup.enter="handleSearch"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="审批类型">
              <el-select
                v-model="searchParams.approvalType"
                placeholder="请选择审批类型（单选）"
                clearable
              >
                <el-option label="类型1" value="type1" />
                <el-option label="类型2" value="type2" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="议题申请时间">
              <el-date-picker
                v-model="searchParams.createdAt"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="申报科室">
              <el-select
                v-model="searchParams.department"
                placeholder="请选择申报科室"
                clearable
              >
                <el-option label="胸外科" value="胸外科" />
                <el-option label="心内科" value="心内科" />
                <el-option label="放射科" value="放射科" />
                <el-option label="重症监护室" value="重症监护室" />
                <el-option label="门诊" value="门诊" />
                <el-option label="护理部" value="护理部" />
                <el-option label="感控部" value="感控部" />
                <el-option label="医保科" value="医保科" />
                <el-option label="急诊科" value="急诊科" />
                <el-option label="质管科" value="质管科" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 展开更多条件 -->
        <el-row :gutter="20" v-if="showMoreSearch" class="more-search-row">
          <el-col :span="8">
            <el-form-item label="当前审批节点">
              <el-select
                v-model="searchParams.approvalNode"
                placeholder="全部"
                clearable
              >
                <el-option label="节点1" value="node1" />
                <el-option label="节点2" value="node2" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 搜索和重置按钮 -->
        <el-row :gutter="20">
          <el-col :span="24">
            <div class="search-buttons-row">
              <el-button type="primary" @click="handleSearch">查询</el-button>
              <el-button @click="handleSearchReset">重置</el-button>
              <el-button
                type="text"
                @click="showMoreSearch = !showMoreSearch"
                class="more-btn"
              >
                {{ showMoreSearch ? '收起' : '更多' }}
                <i :class="showMoreSearch ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
              </el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <!-- avue-crud 主体 -->
    <avue-crud
      ref="crud"
      :option="optionWithoutSearch"
      :data="data"
      v-model="form"
      v-model:page="page"
      :table-loading="loading"
      @row-update="rowUpdate"
      @row-save="rowSave"
      @row-del="rowDel"
      @search-change="searchChange"
      @search-reset="searchReset"
      @selection-change="selectionChange"
      @current-change="currentChange"
      @size-change="sizeChange"
      @refresh-change="refreshChange"
      @on-load="onLoad"
    >

      <!-- 议题名称插槽 - 链接 -->
      <template #title="{ row }">
        <el-link type="primary" @click="handleViewDetail(row.id)">
          {{ row.title }}
        </el-link>
      </template>

      <!-- 状态徽章插槽 -->
      <template #status="{ row }">
        <status-badge :status="row.status" type="topic" />
      </template>

      <!-- 操作列插槽 - 自定义权限按钮 -->
      <template #menu="{ row }">
        <el-button
          type="text"
          size="small"
          @click="handleApprove(row)"
          v-if="activeTab === 'pending'"
        >
          审批
        </el-button>
        <el-button
          type="text"
          size="small"
          @click="handleViewDetail(row.id)"
        >
          查看详情
        </el-button>
      </template>
    </avue-crud>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import DecisionBreadcrumb from '../../components/breadcrumb.vue';
import StatusBadge from '../../components/status-badge/index.vue';
import { topicOption } from '@/option/decision/topic';
import * as topicApi from '@/api/decision/topic';

export default {
  name: 'TopicManagement',
  components: {
    DecisionBreadcrumb,
    StatusBadge
  },
  data() {
    return {
      // 标签页和视图模式
      activeTab: 'pending',
      viewMode: 'list',
      // 搜索条件状态
      searchParams: {
        title: '',
        approvalType: '',
        department: '',
        createdAt: null,
        approvalNode: ''
      },
      showMoreSearch: false,
      // 表格状态
      form: {},
      query: {},
      loading: true,
      data: [],
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      selectedTopics: [],
      mockTopics: [
        {
          id: '1',
          title: '汇报学生党支部资质资教学项',
          status: 'draft',
          stage: 'stage1',
          applyStatus: 'pending',
          approvalType: 'type1',
          approvalNode: 'node1',
          department: '胸外科',
          deptDirector: '张明',
          leader: '张三',
          creator: 'admin',
          createdAt: '2025-08-08 12:12:12'
        },
        {
          id: '2',
          title: '关于正式任命xxx为胸外科副主任',
          status: 'pending_vote',
          stage: 'stage2',
          applyStatus: 'pending',
          approvalType: 'type1',
          approvalNode: 'node1',
          department: '胸外科',
          deptDirector: '张明',
          leader: '李四',
          creator: 'admin',
          createdAt: '2025-08-08 12:12:12'
        },
        {
          id: '3',
          title: '放射科设备更新方案',
          status: 'approved',
          stage: 'stage2',
          applyStatus: 'exported',
          approvalType: 'type2',
          approvalNode: 'node2',
          department: '放射科',
          deptDirector: '王五',
          leader: '王五',
          creator: 'admin',
          createdAt: '2024-11-25 09:00:00'
        },
        {
          id: '4',
          title: '重症监护室管理制度改革',
          status: 'voting',
          stage: 'stage3',
          applyStatus: 'exported',
          approvalType: 'type1',
          approvalNode: 'node1',
          department: '重症监护室',
          deptDirector: '赵六',
          leader: '赵六',
          creator: 'admin',
          createdAt: '2024-11-20 16:45:00'
        },
        {
          id: '5',
          title: '门诊预约系统升级',
          status: 'completed',
          stage: 'stage3',
          applyStatus: 'exported',
          approvalType: 'type2',
          approvalNode: 'node2',
          department: '门诊',
          deptDirector: '孙七',
          leader: '孙七',
          creator: 'admin',
          createdAt: '2024-11-15 11:20:00'
        },
        {
          id: '6',
          title: '护理团队培训计划',
          status: 'applying',
          stage: 'stage1',
          applyStatus: 'pending',
          approvalType: 'type1',
          approvalNode: 'node1',
          department: '护理部',
          deptDirector: '周八',
          leader: '周八',
          creator: 'admin',
          createdAt: '2024-11-10 13:30:00'
        },
        {
          id: '7',
          title: '感染控制规范更新',
          status: 'withdrawn',
          stage: 'stage1',
          applyStatus: 'pending',
          approvalType: 'type2',
          approvalNode: 'node1',
          department: '感控部',
          deptDirector: '吴九',
          leader: '吴九',
          creator: 'admin',
          createdAt: '2024-11-05 08:00:00'
        },
        {
          id: '8',
          title: '医保报销流程优化',
          status: 'draft',
          stage: 'stage1',
          applyStatus: 'pending',
          approvalType: 'type1',
          approvalNode: 'node1',
          department: '医保科',
          deptDirector: '郑十',
          leader: '郑十',
          creator: 'admin',
          createdAt: '2024-10-30 15:10:00'
        },
        {
          id: '9',
          title: '急诊科绩效考核方案',
          status: 'pending_vote',
          stage: 'stage2',
          applyStatus: 'exported',
          approvalType: 'type2',
          approvalNode: 'node2',
          department: '急诊科',
          deptDirector: '张三',
          leader: '张三',
          creator: 'admin',
          createdAt: '2024-10-25 10:45:00'
        },
        {
          id: '10',
          title: '医疗质量持续改进项目',
          status: 'approved',
          stage: 'stage2',
          applyStatus: 'exported',
          approvalType: 'type1',
          approvalNode: 'node2',
          department: '质管科',
          deptDirector: '李四',
          leader: '李四',
          creator: 'admin',
          createdAt: '2024-10-20 09:30:00'
        }
      ]
    };
  },
  computed: {
    ...mapGetters(['permission', 'userInfo']),
    option() {
      return topicOption(this);
    },
    optionWithoutSearch() {
      const opt = topicOption(this);
      opt.searchShow = false; // 禁用 avue-crud 的内置搜索
      return opt;
    }
  },
  mounted() {
    this.onLoad(this.page);
  },
  methods: {
    async onLoad(page, params = {}) {
      this.loading = true;
      try {
        // 构建API请求参数
        const requestData = {
          current: page.currentPage,
          size: page.pageSize
        };

        // 添加搜索条件
        if (this.searchParams.title || params.title) {
          requestData.topicName = this.searchParams.title || params.title;
        }

        if (this.searchParams.approvalType || params.approvalType) {
          requestData.approvalType = this.searchParams.approvalType || params.approvalType;
        }

        if (this.searchParams.department || params.department) {
          requestData.applyDeptId = this.searchParams.department || params.department;
        }

        if (this.searchParams.createdAt && this.searchParams.createdAt.length === 2) {
          requestData.applyTimeStart = this.$dayjs(this.searchParams.createdAt[0]).format('YYYY-MM-DD');
          requestData.applyTimeEnd = this.$dayjs(this.searchParams.createdAt[1]).format('YYYY-MM-DD');
        }

        if (this.searchParams.approvalNode || params.approvalNode) {
          requestData.currentStageList = [this.searchParams.approvalNode || params.approvalNode];
        }

        // 根据当前tab调用不同的API
        let res;
        if (this.activeTab === 'pending') {
          // 待审批
          res = await topicApi.getPendingApprovalTopicPage(requestData);
        } else {
          // 已审批
          res = await topicApi.getApprovedTopicPage(requestData);
        }

        if (res.data && res.data.code === 200) {
          const apiData = res.data.data;
          // 映射API返回的字段到表格数据
          this.data = (apiData.records || []).map(item => ({
            id: item.id,
            title: item.topicName,
            topicNo: item.topicNo,
            status: item.topicStatus,
            statusDesc: item.topicStatusDesc,
            stage: item.currentStage,
            stageDesc: item.currentStageDesc,
            applyStatus: item.applyMeetingStatus,
            applyStatusDesc: item.applyMeetingStatusDesc,
            approvalType: item.approvalType,
            approvalNode: item.currentStageDesc,
            approvalTaskName: item.approvalTaskName,
            approvalAssigneeName: item.approvalAssigneeName,
            approvalTime: item.approvalTime,
            department: item.applyDeptName,
            deptId: item.applyDeptId,
            deptDirector: item.applyDeptDirectorName,
            deptDirectorId: item.applyDeptDirectorId,
            leader: item.applyDeptLeaderName,
            leaderId: item.applyDeptLeaderId,
            creator: item.publishUserName,
            creatorId: item.publishUserId,
            createdAt: item.createTime,
            meetingType: item.meetingType,
            meetingTypeDesc: item.meetingTypeDesc,
            // 权限按钮
            canEdit: item.canEdit,
            canApplyMeeting: item.canApplyMeeting,
            canInputConclusion: item.canInputConclusion,
            canWithdraw: item.canWithdraw,
            canPrint: item.canPrint,
            // 保留原始数据
            _raw: item
          }));
          this.page.total = apiData.total || 0;
        } else {
          this.$message.error(res.data.msg || '加载议题失败');
          this.data = [];
          this.page.total = 0;
        }
      } catch (error) {
        console.error('加载议题失败：', error);
        this.$message.error('加载议题失败');
        this.data = [];
        this.page.total = 0;
      } finally {
        this.loading = false;
        this.$refs.crud?.toggleSelection();
      }
    },

    handleTabChange() {
      this.page.currentPage = 1;
      this.onLoad(this.page, this.searchParams);
    },

    handleApprove(row) {
      this.$message.success('审批成功');
      this.onLoad(this.page, this.searchParams);
    },

    searchChange(params, done) {
      this.query = params;
      this.page.currentPage = 1;
      this.onLoad(this.page, params);
      done();
    },

    searchReset() {
      this.query = {};
      this.page.currentPage = 1;
      this.onLoad(this.page);
    },

    selectionChange(list) {
      this.selectedTopics = list;
    },

    currentChange(currentPage) {
      this.page.currentPage = currentPage;
      this.onLoad(this.page, this.query);
    },

    sizeChange(pageSize) {
      this.page.pageSize = pageSize;
      this.page.currentPage = 1;
      this.onLoad(this.page, this.query);
    },

    refreshChange() {
      this.onLoad(this.page, this.query);
    },

    rowSave(row, done, loading) {
      this.$message.success('新增成功');
      this.onLoad(this.page, this.query);
      done();
    },

    rowUpdate(row, index, done, loading) {
      this.$message.success('更新成功');
      this.onLoad(this.page, this.query);
      done();
    },

    rowDel(row) {
      this.$confirm('确定删除此议题吗？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message.success('删除成功');
        this.onLoad(this.page, this.query);
      });
    },

    navigateTo(type) {
      switch (type) {
        case 'all':
          this.$router.push('/decision/topic');
          break;
        case 'managing':
          this.$router.push('/decision/topic');
          break;
        case 'my':
          this.$router.push('/decision/topic/my');
          break;
        default:
          break;
      }
    },

    handleViewDetail(topicId) {
      this.$router.push(`/decision/topic/detail/${topicId}`);
    },

    handleCommand(command, row) {
      switch (command) {
        case 'edit':
          this.$router.push(`/decision/topic/detail/${row.id}`);
          break;
        case 'apply':
          this.$message.success('已申请上会');
          this.onLoad(this.page, this.query);
          break;
        case 'vote':
          this.$router.push(`/decision/topic/vote/${row.id}`);
          break;
        case 'withdraw':
          this.handleWithdraw(row.id);
          break;
        case 'delete':
          this.handleDelete(row.id);
          break;
        default:
          break;
      }
    },

    handleDelete(topicId) {
      this.$confirm('确定删除此议题吗？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message.success('删除成功');
        this.onLoad(this.page, this.query);
      });
    },

    handleWithdraw(topicId) {
      this.$confirm('确定撤回此议题吗？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message.success('已撤回');
        this.onLoad(this.page, this.query);
      });
    },

    canEdit(row) {
      return row.status === 'draft' || row.creator === this.userInfo.name;
    },

    canApply(row) {
      return row.status === 'draft' || row.status === 'pending_vote';
    },

    canVote(row) {
      return row.status === 'voting';
    },

    canWithdraw(row) {
      return ['draft', 'pending_vote', 'applying'].includes(row.status);
    },

    canDelete(row) {
      return row.status === 'draft' || row.creator === this.userInfo.name;
    },

    // ==================== 自定义搜索处理方法 ====================
    handleSearch() {
      this.page.currentPage = 1;
      this.onLoad(this.page, this.searchParams);
    },

    handleSearchReset() {
      this.searchParams = {
        title: '',
        approvalType: '',
        department: '',
        createdAt: null,
        approvalNode: ''
      };
      this.page.currentPage = 1;
      this.onLoad(this.page, {});
    }
  }
};
</script>

<style scoped lang="scss">
.topic-management-page {
  background: white;
  border-radius: 6px;
  padding: 24px;

  .tabs-container {
    margin-bottom: 20px;

    ::v-deep .el-tabs {
      &__header {
        margin-bottom: 16px;
      }

      &__nav-wrap {
        ::after {
          display: none;
        }
      }
    }
  }

  .search-form-container {
    background: #f9fafb;
    border-radius: 4px;
    padding: 16px;
    margin-bottom: 20px;

    ::v-deep .el-form {
      margin: 0;

      .el-form-item {
        margin-bottom: 8px;
      }

      .el-row:last-child {
        .el-form-item {
          margin-bottom: 0;
        }
      }
    }

    ::v-deep .el-form-item__label {
      color: #333;
      font-weight: 500;
    }

    ::v-deep .el-input,
    ::v-deep .el-select,
    ::v-deep .el-date-editor {
      width: 100%;
    }
  }

  .search-buttons-row {
    display: flex;
    gap: 8px;
    align-items: center;
    justify-content: flex-end;
    padding-top: 4px;

    .el-button {
      &:not(.more-btn) {
        min-width: 70px;
      }
    }

    .more-btn {
      margin-left: 4px;
      padding: 8px 4px;

      i {
        margin-left: 2px;
        font-size: 12px;
      }
    }
  }

  .more-search-row {
    padding-top: 4px;
    margin-top: 4px;
    animation: slideDown 0.3s ease-out;
  }

  ::v-deep .avue-crud {
    margin-top: 20px;

    // 操作列按钮排成一行不换行
    .avue-crud__menu {
      white-space: nowrap;
      overflow-x: auto;

      .el-button {
        white-space: nowrap;
        margin-right: 1px;
        padding: 0 4px !important;
        font-size: 12px;
        height: 28px;
        line-height: 28px;

        &:last-child {
          margin-right: 0;
        }
      }
    }
  }

  .selection-info {
    font-size: 12px;
    color: #999;
    margin-left: 12px;
    font-weight: normal;
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
