<template>
  <div class="topic-management-page">
    <!-- 面包屑导航 -->
    <decision-breadcrumb :breadcrumbs="['议题管理', '待我审批']" />

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
            <el-form-item label="议题状态">
              <el-select
                v-model="searchParams.status"
                placeholder="请选择议题状态"
                clearable
              >
                <el-option label="议题申请中" value="draft" />
                <el-option label="待上会" value="pending_vote" />
                <el-option label="上会申请中" value="applying" />
                <el-option label="已申请上会" value="approved" />
                <el-option label="结论审批中" value="voting" />
                <el-option label="结论录入完成" value="completed" />
                <el-option label="已撤回" value="withdrawn" />
              </el-select>
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
          <el-col :span="6">
            <el-form-item label="申报时间">
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
        </el-row>

        <!-- 展开更多条件 -->
        <el-row :gutter="20" v-if="showMoreSearch">
          <el-col :span="6">
            <el-form-item label="议题当前阶段">
              <el-select
                v-model="searchParams.stage"
                placeholder="全部"
                clearable
              >
                <el-option label="阶段1" value="stage1" />
                <el-option label="阶段2" value="stage2" />
                <el-option label="阶段3" value="stage3" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="申请上会状态">
              <el-select
                v-model="searchParams.applyStatus"
                placeholder="全部"
                clearable
              >
                <el-option label="待审批" value="pending" />
                <el-option label="已导出" value="exported" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="科室主任">
              <el-input
                v-model="searchParams.deptDirector"
                placeholder="请输入申报科室主任"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 搜索和重置按钮 -->
        <el-row :gutter="20">
          <el-col :span="24">
            <div class="search-actions">
              <el-button type="primary" @click="handleSearch" size="small">
                <i class="el-icon-search"></i> 搜索
              </el-button>
              <el-button @click="handleSearchReset" size="small">
                <i class="el-icon-refresh"></i> 重置
              </el-button>
              <el-button
                link
                type="primary"
                @click="showMoreSearch = !showMoreSearch"
                size="small"
              >
                {{ showMoreSearch ? '收起' : '查看更多' }}
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
      <!-- 顶部批量操作按钮 -->
      <template #menu-left>
        <el-button type="primary" icon="el-icon-plus" @click="handleCreateTopic">
          新增议题
        </el-button>
        <el-button
          type="warning"
          @click="handleBatchApply"
          :disabled="selectedTopics.length === 0"
        >
          批量申请上会
        </el-button>
        <el-button @click="handleExport">导出</el-button>
        <span v-if="selectedTopics.length > 0" class="selection-info">
          已选择 {{ selectedTopics.length }} 条议题
        </span>
      </template>

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
          @click="handleViewDetail(row.id)"
        >
          查看详情
        </el-button>
        <el-button
          v-if="canEdit(row)"
          type="text"
          size="small"
          @click="handleCommand('edit', row)"
        >
          编辑
        </el-button>
        <el-button
          v-if="canWithdraw(row)"
          type="text"
          size="small"
          @click="handleCommand('withdraw', row)"
        >
          撤回
        </el-button>
        <el-button
          v-if="canApply(row)"
          type="text"
          size="small"
          @click="handleCommand('apply', row)"
        >
          申请上会
        </el-button>
        <el-button
          v-if="canVote(row)"
          type="text"
          size="small"
          @click="handleCommand('vote', row)"
        >
          投票
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
      // 搜索条件状态
      searchParams: {
        title: '',
        status: '',
        department: '',
        createdAt: null,
        stage: '',
        applyStatus: '',
        deptDirector: ''
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
          title: '新增胸外科手术规范',
          status: 'draft',
          stage: 'stage1',
          applyStatus: 'pending',
          startTime: '2024-12-01 10:00:00',
          endTime: '2024-12-15 18:00:00',
          department: '胸外科',
          deptDirector: '张三',
          leader: '张三',
          creator: 'admin',
          createdAt: '2024-12-01 10:30:00'
        },
        {
          id: '2',
          title: '优化心内科治疗流程',
          status: 'pending_vote',
          stage: 'stage2',
          applyStatus: 'exported',
          startTime: '2024-11-28 09:00:00',
          endTime: '2024-12-10 17:00:00',
          department: '心内科',
          deptDirector: '李四',
          leader: '李四',
          creator: 'admin',
          createdAt: '2024-11-28 14:15:00'
        },
        {
          id: '3',
          title: '放射科设备更新方案',
          status: 'approved',
          stage: 'stage2',
          applyStatus: 'exported',
          startTime: '2024-11-25 08:00:00',
          endTime: '2024-12-08 16:00:00',
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
          startTime: '2024-11-20 10:00:00',
          endTime: '2024-12-05 15:00:00',
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
          startTime: '2024-11-15 09:00:00',
          endTime: '2024-11-30 17:00:00',
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
          startTime: '2024-11-10 10:00:00',
          endTime: '2024-11-25 18:00:00',
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
          startTime: '2024-11-05 09:00:00',
          endTime: '2024-11-20 16:00:00',
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
          startTime: '2024-10-30 10:00:00',
          endTime: '2024-11-15 17:00:00',
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
          startTime: '2024-10-25 09:00:00',
          endTime: '2024-11-10 16:00:00',
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
          startTime: '2024-10-20 08:00:00',
          endTime: '2024-11-05 17:00:00',
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
    onLoad(page, params = {}) {
      this.loading = true;
      setTimeout(() => {
        try {
          let filtered = [...this.mockTopics];

          if (params.title) {
            filtered = filtered.filter(topic =>
              topic.title.includes(params.title)
            );
          }

          if (params.status) {
            filtered = filtered.filter(topic =>
              topic.status === params.status
            );
          }

          if (params.stage) {
            filtered = filtered.filter(topic =>
              topic.stage === params.stage
            );
          }

          if (params.applyStatus) {
            filtered = filtered.filter(topic =>
              topic.applyStatus === params.applyStatus
            );
          }

          if (params.deptDirector) {
            filtered = filtered.filter(topic =>
              topic.deptDirector.includes(params.deptDirector)
            );
          }

          if (params.startTime) {
            filtered = filtered.filter(topic => {
              const topicStart = new Date(topic.startTime);
              const paramStart = new Date(params.startTime);
              return topicStart >= paramStart;
            });
          }

          if (params.endTime) {
            filtered = filtered.filter(topic => {
              const topicEnd = new Date(topic.endTime);
              const paramEnd = new Date(params.endTime);
              paramEnd.setHours(23, 59, 59, 999);
              return topicEnd <= paramEnd;
            });
          }

          if (params.department) {
            filtered = filtered.filter(topic =>
              topic.department === params.department
            );
          }

          if (params.createdAt && params.createdAt.length === 2) {
            const [startDate, endDate] = params.createdAt;
            filtered = filtered.filter(topic => {
              const topicDate = new Date(topic.createdAt);
              const start = new Date(startDate);
              const end = new Date(endDate);
              end.setHours(23, 59, 59, 999);
              return topicDate >= start && topicDate <= end;
            });
          }

          this.page.total = filtered.length;

          const start = (page.currentPage - 1) * page.pageSize;
          const end = start + page.pageSize;
          this.data = filtered.slice(start, end);
        } catch (error) {
          this.$message.error('加载议题失败');
        } finally {
          this.loading = false;
          this.$refs.crud?.toggleSelection();
        }
      }, 500);
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

    handleCreateTopic() {
      this.$router.push('/decision/topic/create');
    },

    handleViewDetail(topicId) {
      this.$router.push(`/decision/topic/detail/${topicId}`);
    },

    handleBatchApply() {
      if (this.selectedTopics.length === 0) {
        this.$message.warning('请先选择议题');
        return;
      }
      this.$message.success(`已申请 ${this.selectedTopics.length} 个议题上会`);
      this.onLoad(this.page, this.query);
    },

    handleExport() {
      this.$message.info('导出功能开发中');
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
        status: '',
        department: '',
        createdAt: null,
        stage: '',
        applyStatus: '',
        deptDirector: ''
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

  .search-form-container {
    background: #f9fafb;
    border: 1px solid #e8eaed;
    border-radius: 4px;
    padding: 16px;
    margin-bottom: 20px;

    ::v-deep .el-form {
      margin: 0;
    }

    ::v-deep .el-form-item {
      margin-bottom: 16px;

      &:last-child {
        margin-bottom: 0;
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

  .search-actions {
    display: flex;
    gap: 8px;
    align-items: center;

    ::v-deep .el-button {
      &.is-plain {
        background: white;
        border-color: #ddd;
        color: #606266;

        &:hover {
          background: #f5f5f5;
          border-color: #999;
        }
      }

      &.is-link {
        padding: 0;
        height: auto;
        line-height: 1;
      }
    }
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
</style>
