<template>
  <div class="topic-management-page">
    <!-- 面包屑导航 -->
    <decision-breadcrumb :breadcrumbs="['议题管理', '我发布的']" />

    <!-- Tab 切换 -->
    <el-tabs v-model="activeTab" class="meeting-tabs" @tab-change="handleTabChange">
      <el-tab-pane
        v-for="meetingType in meetingTypeList"
        :key="meetingType.code"
        :label="meetingType.value"
        :name="meetingType.code"
      >
        <!-- 院长办公室 (code: 10) 内容 -->
        <template v-if="meetingType.code === '10'">
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
                    <el-option
                      v-for="item in topicStatusList"
                      :key="item.code"
                      :label="item.value"
                      :value="item.code"
                    />
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
                    <el-option
                      v-for="item in deptList"
                      :key="item.id"
                      :label="item.deptName"
                      :value="item.id"
                    />
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
            </el-row>

            <!-- 展开更多条件 -->
            <el-row :gutter="20" v-if="showMoreSearch" class="more-search-row">
              <el-col :span="6">
                <el-form-item label="议题当前阶段">
                  <el-select
                    v-model="searchParams.stage"
                    placeholder="全部"
                    clearable
                  >
                    <el-option
                      v-for="item in topicStageList"
                      :key="item.code"
                      :label="item.value"
                      :value="item.code"
                    />
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
                    <el-option
                      v-for="item in applyStatusList"
                      :key="item.code"
                      :label="item.value"
                      :value="item.code"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="申报科室科主任">
                  <el-select
                    v-model="searchParams.deptDirector"
                    placeholder="请选择申报科室科主任"
                    clearable
                  >
                    <el-option
                      v-for="item in deptDirectorList"
                      :key="item.id"
                      :label="item.realName"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="申报科室分管领导">
                  <el-select
                    v-model="searchParams.deptLeader"
                    placeholder="请选择申报科室分管领导"
                    clearable
                  >
                    <el-option
                      v-for="item in deptLeaderList"
                      :key="item.id"
                      :label="item.realName"
                      :value="item.id"
                    />
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
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      @refresh-change="refreshChange"
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
      <template #topicName="{ row }">
        <el-link type="primary" @click="handleViewDetail(row.id)">
          {{ row.topicName }}
        </el-link>
      </template>

      <!-- 状态徽章插槽 -->
      <template #topicStatusDesc="{ row }">
        <status-badge :status="row.topicStatus" type="topic" />
      </template>

      <!-- 操作列插槽 - 自定义权限按钮 -->
      <template #menu="{ row }">
        <div class="action-buttons-wrapper">
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
            @click="handleCommand('conclusion', row)"
          >
            录入结论
          </el-button>
          <el-button
            v-if="row.canPrint"
            type="text"
            size="small"
            @click="handleCommand('print', row)"
          >
            打印
          </el-button>
        </div>
      </template>
        </avue-crud>
        </template>

        <!-- 党委会 (code: 20) 内容 -->
        <template v-if="meetingType.code === '20'">
        <!-- 自定义搜索表单 -->
        <div class="search-form-container">
          <el-form :model="searchParamsCommittee" label-width="100px" size="small">
            <el-row :gutter="20">
              <!-- 第一行：基础搜索条件 -->
              <el-col :span="6">
                <el-form-item label="议题名称">
                  <el-input
                    v-model="searchParamsCommittee.title"
                    placeholder="请输入议题名称"
                    @keyup.enter="handleSearchCommittee"
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="议题状态">
                  <el-select
                    v-model="searchParamsCommittee.status"
                    placeholder="请选择议题状态"
                    clearable
                  >
                    <el-option
                      v-for="item in topicStatusList"
                      :key="item.code"
                      :label="item.value"
                      :value="item.code"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="申报科室">
                  <el-select
                    v-model="searchParamsCommittee.department"
                    placeholder="请选择申报科室"
                    clearable
                  >
                    <el-option
                      v-for="item in deptList"
                      :key="item.id"
                      :label="item.deptName"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="议题申请时间">
                  <el-date-picker
                    v-model="searchParamsCommittee.createdAt"
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
            <el-row :gutter="20" v-if="showMoreSearchCommittee" class="more-search-row">
              <el-col :span="6">
                <el-form-item label="议题当前阶段">
                  <el-select
                    v-model="searchParamsCommittee.stage"
                    placeholder="全部"
                    clearable
                  >
                    <el-option
                      v-for="item in topicStageList"
                      :key="item.code"
                      :label="item.value"
                      :value="item.code"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="申请上会状态">
                  <el-select
                    v-model="searchParamsCommittee.applyStatus"
                    placeholder="全部"
                    clearable
                  >
                    <el-option
                      v-for="item in applyStatusList"
                      :key="item.code"
                      :label="item.value"
                      :value="item.code"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="申报科室科主任">
                  <el-select
                    v-model="searchParamsCommittee.deptDirector"
                    placeholder="请选择申报科室科主任"
                    clearable
                  >
                    <el-option
                      v-for="item in deptDirectorList"
                      :key="item.id"
                      :label="item.realName"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="申报科室分管领导">
                  <el-select
                    v-model="searchParamsCommittee.deptLeader"
                    placeholder="请选择申报科室分管领导"
                    clearable
                  >
                    <el-option
                      v-for="item in deptLeaderList"
                      :key="item.id"
                      :label="item.realName"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <!-- 搜索和重置按钮 -->
            <el-row :gutter="20">
              <el-col :span="24">
                <div class="search-buttons-row">
                  <el-button type="primary" @click="handleSearchCommittee">查询</el-button>
                  <el-button @click="handleSearchResetCommittee">重置</el-button>
                  <el-button
                    type="text"
                    @click="showMoreSearchCommittee = !showMoreSearchCommittee"
                    class="more-btn"
                  >
                    {{ showMoreSearchCommittee ? '收起' : '更多' }}
                    <i :class="showMoreSearchCommittee ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
                  </el-button>
                </div>
              </el-col>
            </el-row>
          </el-form>
        </div>

        <!-- avue-crud 主体 -->
        <avue-crud
          ref="crudCommittee"
          :option="optionWithoutSearch"
          :data="dataCommittee"
          v-model="formCommittee"
          v-model:page="pageCommittee"
          :table-loading="loadingCommittee"
          @row-update="rowUpdateCommittee"
          @row-save="rowSaveCommittee"
          @row-del="rowDelCommittee"
          @search-change="searchChangeCommittee"
          @search-reset="searchResetCommittee"
          @selection-change="selectionChangeCommittee"
          @current-change="handleCurrentChangeCommittee"
          @size-change="handleSizeChangeCommittee"
          @refresh-change="refreshChangeCommittee"
        >
          <!-- 顶部批量操作按钮 -->
          <template #menu-left>
            <el-button type="primary" icon="el-icon-plus" @click="handleCreateTopic">
              新增议题
            </el-button>
            <el-button
              type="warning"
              @click="handleBatchApplyCommittee"
              :disabled="selectedTopicsCommittee.length === 0"
            >
              批量申请上会
            </el-button>
            <el-button @click="handleExport">导出</el-button>
            <span v-if="selectedTopicsCommittee.length > 0" class="selection-info">
              已选择 {{ selectedTopicsCommittee.length }} 条议题
            </span>
          </template>

          <!-- 议题名称插槽 - 链接 -->
          <template #topicName="{ row }">
            <el-link type="primary" @click="handleViewDetail(row.id)">
              {{ row.topicName }}
            </el-link>
          </template>

          <!-- 状态徽章插槽 -->
          <template #topicStatusDesc="{ row }">
            <status-badge :status="row.topicStatus" type="topic" />
          </template>

          <!-- 操作列插槽 - 自定义权限按钮 -->
          <template #menu="{ row }">
            <div class="action-buttons-wrapper">
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
                @click="handleCommand('conclusion', row)"
              >
                录入结论
              </el-button>
              <el-button
                v-if="row.canPrint"
                type="text"
                size="small"
                @click="handleCommand('print', row)"
              >
                打印
              </el-button>
            </div>
          </template>
        </avue-crud>
        </template>
      </el-tab-pane>
    </el-tabs>

    <!-- 申请上会弹窗 -->
    <apply-meeting-dialog
      v-model="showApplyMeetingDialog"
      :selected-topics="selectedTopicsForApply"
      @refresh="onLoad(page, query)"
    />

    <!-- 录入结论弹窗 -->
    <conclusion-dialog
      v-model="showConclusionDialog"
      :current-topic="currentTopicForConclusion"
      @submit="handleConclusionSubmit"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import DecisionBreadcrumb from '../../components/breadcrumb.vue';
import StatusBadge from '../../components/status-badge/index.vue';
import ApplyMeetingDialog from './components/apply-meeting-dialog.vue';
import ConclusionDialog from './components/conclusion-dialog.vue';
import { myTopicsOption } from '@/option/decision/topic';
import * as topicApi from '@/api/decision/topic';

export default {
  name: 'MyTopics',
  components: {
    DecisionBreadcrumb,
    StatusBadge,
    ApplyMeetingDialog,
    ConclusionDialog
  },
  data() {
    return {
      // 会议类型列表（动态）
      meetingTypeList: [],
      activeTab: '',
      // 议题状态列表
      topicStatusList: [],
      // 科室列表
      deptList: [],
      // 议题当前阶段列表
      topicStageList: [],
      // 申请上会状态列表
      applyStatusList: [],
      // 科室科主任列表
      deptDirectorList: [],
      // 科室分管领导列表
      deptLeaderList: [],
      // 搜索条件状态
      searchParams: {
        title: '',
        status: '',
        department: '',
        createdAt: null,
        stage: '',
        applyStatus: '',
        deptDirector: '',
        deptLeader: ''
      },
      searchParamsCommittee: {
        title: '',
        status: '',
        department: '',
        createdAt: null,
        stage: '',
        applyStatus: '',
        deptDirector: '',
        deptLeader: ''
      },
      showMoreSearch: false,
      showMoreSearchCommittee: false,
      // 院长办公室数据
      form: {},
      query: {},
      loading: true,
      data: [],
      page: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      selectedTopics: [],
      // 党委会数据
      formCommittee: {},
      queryCommittee: {},
      loadingCommittee: true,
      dataCommittee: [],
      pageCommittee: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      selectedTopicsCommittee: [],
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
      ],
      // 申请上会弹窗相关
      showApplyMeetingDialog: false,
      selectedTopicsForApply: [],
      // 录入结论弹窗相关
      showConclusionDialog: false,
      currentTopicForConclusion: null
    };
  },
  computed: {
    ...mapGetters(['permission', 'userInfo']),
    option() {
      return myTopicsOption(this);
    },
    optionWithoutSearch() {
      const opt = myTopicsOption(this);
      opt.searchShow = false; // 禁用 avue-crud 的内置搜索
      return opt;
    }
  },
  watch: {
    // 监听院长办公室申报科室变化
    'searchParams.department'(newVal) {
      if (newVal) {
        this.fetchDeptUsers(newVal, 'office');
      } else {
        this.deptDirectorList = [];
        this.deptLeaderList = [];
        this.searchParams.deptDirector = '';
        this.searchParams.deptLeader = '';
      }
    },
    // 监听党委会申报科室变化
    'searchParamsCommittee.department'(newVal) {
      if (newVal) {
        this.fetchDeptUsers(newVal, 'committee');
      } else {
        this.searchParamsCommittee.deptDirector = '';
        this.searchParamsCommittee.deptLeader = '';
      }
    }
  },
  mounted() {
    this.fetchMeetingTypes();
    this.fetchTopicStatus();
    this.fetchDeptList();
    this.fetchTopicStage();
    this.fetchApplyStatus();
  },
  methods: {
    // 处理Tab切换
    handleTabChange(tab) {
      // 根据当前激活的tab加载相应的数据
      if (this.activeTab === '10') {
        this.onLoad(this.page);
      } else if (this.activeTab === '20') {
        this.onLoadCommittee(this.pageCommittee);
      }
    },

    // 获取会议类型列表
    async fetchMeetingTypes() {
      try {
        const res = await topicApi.getAgendaType();
        if (res.data && res.data.code === 200) {
          this.meetingTypeList = res.data.data || [];
          // 设置第一个tab为默认激活
          if (this.meetingTypeList.length > 0) {
            this.activeTab = this.meetingTypeList[0].code;
          }
          // 等会议类型加载完成后再加载当前激活tab的数据
          this.$nextTick(() => {
            if (this.activeTab === '10') {
              this.onLoad(this.page);
            } else if (this.activeTab === '20') {
              this.onLoadCommittee(this.pageCommittee);
            }
          });
        }
      } catch (error) {
        console.error('获取会议类型失败：', error);
        // 如果获取失败，使用默认配置
        this.meetingTypeList = [
          { code: '10', value: '院长办公室' },
          { code: '20', value: '党委会' }
        ];
        this.activeTab = '10';
        this.$nextTick(() => {
          this.onLoad(this.page);
        });
      }
    },

    // 获取议题状态列表
    async fetchTopicStatus() {
      try {
        const res = await topicApi.getTopicStatus();
        if (res.data && res.data.code === 200) {
          this.topicStatusList = res.data.data || [];
        }
      } catch (error) {
        console.error('获取议题状态失败：', error);
      }
    },

    // 获取科室列表
    async fetchDeptList() {
      try {
        // 从 userInfo 获取 tenantId，如果没有则使用默认值
        const tenantId = this.userInfo?.tenantId || '000000';
        const res = await topicApi.getDeptList(tenantId);
        if (res.data && res.data.code === 200) {
          this.deptList = res.data.data || [];
        }
      } catch (error) {
        console.error('获取科室列表失败：', error);
      }
    },

    // 获取议题当前阶段列表
    async fetchTopicStage() {
      try {
        const res = await topicApi.getTopicStage();
        if (res.data && res.data.code === 200) {
          this.topicStageList = res.data.data || [];
        }
      } catch (error) {
        console.error('获取议题当前阶段失败：', error);
      }
    },

    // 获取申请上会状态列表
    async fetchApplyStatus() {
      try {
        const res = await topicApi.getApplyStatus();
        if (res.data && res.data.code === 200) {
          this.applyStatusList = res.data.data || [];
        }
      } catch (error) {
        console.error('获取申请上会状态失败：', error);
      }
    },

    // 获取科室人员（科主任和分管领导）
    async fetchDeptUsers(deptId, type) {
      try {
        const res = await topicApi.getDeptUsers(deptId);
        if (res.data && res.data.code === 200) {
          const data = res.data.data;
          // 设置科主任列表
          this.deptDirectorList = data.directorList || [];
          // 设置分管领导列表（将单个对象转为数组）
          this.deptLeaderList = data.leader ? [data.leader] : [];

          // 清空之前选择的值
          if (type === 'office') {
            this.searchParams.deptDirector = '';
            this.searchParams.deptLeader = '';
          } else if (type === 'committee') {
            this.searchParamsCommittee.deptDirector = '';
            this.searchParamsCommittee.deptLeader = '';
          }
        }
      } catch (error) {
        console.error('获取科室人员失败：', error);
      }
    },

    async onLoad(page, params = {}) {
      this.loading = true;
      try {
        // 只在院长办公室(code: 10)时加载
        if (this.activeTab !== '10') {
          this.loading = false;
          return;
        }

        // 构建API请求参数
        const requestData = {
          current: page.currentPage - 1,  // API 期望 0-indexed (第一页是0，所以 1-1=0)
          size: page.pageSize,
          meetingType: 10  // 院长办公室
        };

        // 添加搜索条件（使用 this.searchParams）
        if (this.searchParams.title) {
          requestData.topicName = this.searchParams.title;
        }

        if (this.searchParams.status) {
          requestData.topicStatusList = [this.searchParams.status];
        }

        if (this.searchParams.department) {
          requestData.applyDeptId = this.searchParams.department;
        }

        if (this.searchParams.createdAt && this.searchParams.createdAt.length === 2) {
          requestData.applyTimeStart = this.$dayjs(this.searchParams.createdAt[0]).format('YYYY-MM-DD');
          requestData.applyTimeEnd = this.$dayjs(this.searchParams.createdAt[1]).format('YYYY-MM-DD');
        }

        if (this.searchParams.stage) {
          requestData.currentStageList = [this.searchParams.stage];
        }

        if (this.searchParams.applyStatus) {
          requestData.applyMeetingStatus = this.searchParams.applyStatus;
        }

        if (this.searchParams.deptDirector) {
          requestData.deptDirectorId = this.searchParams.deptDirector;
        }

        if (this.searchParams.deptLeader) {
          requestData.deptLeaderId = this.searchParams.deptLeader;
        }

        // 调用API
        const res = await topicApi.getMyTopicPage(requestData);

        if (res.data && res.data.code === 200) {
          this.data = res.data.data.records || [];
          this.page.total = res.data.data.total || 0;

          // 强制更新视图，确保v-if判断能正确执行
          this.$nextTick(() => {
            // 刷新avue-crud组件，清除任何缓存
            if (this.$refs.crud) {
              this.$refs.crud.reload();
            }
            this.$forceUpdate();
          });
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

    handleCurrentChange(currentPage) {
      this.onLoad(this.page, this.query);
    },

    handleSizeChange(pageSize) {
      this.page.currentPage = 1;  // 改变页大小时重置到第一页
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
      // 将选中的议题数组传入申请上会弹窗
      this.selectedTopicsForApply = this.selectedTopics.map(topic => ({
        id: topic.id,
        topicName: topic.topicName,
        applyDept: topic.department,
        deptDirector: topic.deptDirector
      }));
      this.showApplyMeetingDialog = true;
    },

    handleExport() {
      this.$message.info('导出功能开发中');
    },

    handleCommand(command, row) {
      switch (command) {
        case 'edit':
          // 跳转到编辑页面，并传递议题ID
          this.$router.push(`/decision/topic/edit/${row.id}`);
          break;
        case 'apply':
          // 打开申请上会弹窗，将当前行作为选中的议题
          this.selectedTopicsForApply = [{
            id: row.id,
            topicName: row.topicName,
            applyDept: row.department,
            deptDirector: row.deptDirector
          }];
          this.showApplyMeetingDialog = true;
          break;
        case 'vote':
          this.$router.push(`/decision/topic/vote/${row.id}`);
          break;
        case 'withdraw':
          this.handleWithdraw(row);
          break;
        case 'conclusion':
          // 打开录入结论弹窗
          this.currentTopicForConclusion = row;
          this.showConclusionDialog = true;
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

    handleWithdraw(row) {
      this.$confirm('确定撤回此议题吗？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const res = await topicApi.withdrawTopic(row.id, row.approvalSyncId);
          if (res.data && res.data.code === 200) {
            this.$message.success('议题已撤回');
            // 刷新当前tab的列表
            if (this.activeTab === '10') {
              this.onLoad(this.page, this.query);
            } else if (this.activeTab === '20') {
              this.onLoadCommittee(this.pageCommittee, this.queryCommittee);
            }
          } else {
            this.$message.error(res.data.msg || '撤回失败');
          }
        } catch (error) {
          console.error('撤回议题失败：', error);
          this.$message.error('撤回议题失败');
        }
      }).catch(() => {
        // 用户取消操作
      });
    },

    handleConclusionSubmit(conclusionData) {
      // 结论提交成功后刷新列表
      if (this.activeTab === '10') {
        this.onLoad(this.page, this.query);
      } else if (this.activeTab === '20') {
        this.onLoadCommittee(this.pageCommittee, this.queryCommittee);
      }
    },

    canEdit(row) {
      return row.canEdit === true;
    },

    canApply(row) {
      return row.canApplyMeeting === true;
    },

    canVote(row) {
      return row.canInputConclusion === true;
    },

    canWithdraw(row) {
      return row.canWithdraw === true;
    },

    canDelete(row) {
      return row.canEdit === true;
    },

    // ==================== 党委会会议相关方法 ====================
    async onLoadCommittee(page, params = {}) {
      this.loadingCommittee = true;
      try {
        // 只在党委会(code: 20)时加载
        if (this.activeTab !== '20') {
          this.loadingCommittee = false;
          return;
        }

        // 构建API请求参数
        const requestData = {
          current: page.currentPage - 1,  // API 期望 0-indexed (第一页是0，所以 1-1=0)
          size: page.pageSize,
          meetingType: 20  // 党委会
        };

        // 添加搜索条件（使用 this.searchParamsCommittee）
        if (this.searchParamsCommittee.title) {
          requestData.topicName = this.searchParamsCommittee.title;
        }

        if (this.searchParamsCommittee.status) {
          requestData.topicStatusList = [this.searchParamsCommittee.status];
        }

        if (this.searchParamsCommittee.department) {
          requestData.applyDeptId = this.searchParamsCommittee.department;
        }

        if (this.searchParamsCommittee.createdAt && this.searchParamsCommittee.createdAt.length === 2) {
          requestData.applyTimeStart = this.$dayjs(this.searchParamsCommittee.createdAt[0]).format('YYYY-MM-DD');
          requestData.applyTimeEnd = this.$dayjs(this.searchParamsCommittee.createdAt[1]).format('YYYY-MM-DD');
        }

        if (this.searchParamsCommittee.stage) {
          requestData.currentStageList = [this.searchParamsCommittee.stage];
        }

        if (this.searchParamsCommittee.applyStatus) {
          requestData.applyMeetingStatus = this.searchParamsCommittee.applyStatus;
        }

        if (this.searchParamsCommittee.deptDirector) {
          requestData.deptDirectorId = this.searchParamsCommittee.deptDirector;
        }

        if (this.searchParamsCommittee.deptLeader) {
          requestData.deptLeaderId = this.searchParamsCommittee.deptLeader;
        }

        // 调用API
        const res = await topicApi.getMyTopicPage(requestData);

        if (res.data && res.data.code === 200) {
          this.dataCommittee = res.data.data.records || [];
          this.pageCommittee.total = res.data.data.total || 0;

          // 强制更新视图，确保v-if判断能正确执行
          this.$nextTick(() => {
            // 刷新avue-crud组件，清除任何缓存
            if (this.$refs.crudCommittee) {
              this.$refs.crudCommittee.reload();
            }
            this.$forceUpdate();
          });
        } else {
          this.$message.error(res.data.msg || '加载议题失败');
          this.dataCommittee = [];
          this.pageCommittee.total = 0;
        }
      } catch (error) {
        console.error('加载议题失败：', error);
        this.$message.error('加载议题失败');
        this.dataCommittee = [];
        this.pageCommittee.total = 0;
      } finally {
        this.loadingCommittee = false;
        this.$refs.crudCommittee?.toggleSelection();
      }
    },

    searchChangeCommittee(params, done) {
      this.queryCommittee = params;
      this.pageCommittee.currentPage = 1;
      this.onLoadCommittee(this.pageCommittee, params);
      done();
    },

    searchResetCommittee() {
      this.queryCommittee = {};
      this.pageCommittee.currentPage = 1;
      this.onLoadCommittee(this.pageCommittee);
    },

    selectionChangeCommittee(list) {
      this.selectedTopicsCommittee = list;
    },

    refreshChangeCommittee() {
      this.onLoadCommittee(this.pageCommittee, this.queryCommittee);
    },

    handleCurrentChangeCommittee(currentPage) {
      this.onLoadCommittee(this.pageCommittee, this.queryCommittee);
    },

    handleSizeChangeCommittee(pageSize) {
      this.pageCommittee.currentPage = 1;  // 改变页大小时重置到第一页
      this.onLoadCommittee(this.pageCommittee, this.queryCommittee);
    },

    rowSaveCommittee(row, done, loading) {
      this.$message.success('新增成功');
      this.onLoadCommittee(this.pageCommittee, this.queryCommittee);
      done();
    },

    rowUpdateCommittee(row, index, done, loading) {
      this.$message.success('更新成功');
      this.onLoadCommittee(this.pageCommittee, this.queryCommittee);
      done();
    },

    rowDelCommittee(row) {
      this.$confirm('确定删除此议题吗？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message.success('删除成功');
        this.onLoadCommittee(this.pageCommittee, this.queryCommittee);
      });
    },

    handleBatchApplyCommittee() {
      if (this.selectedTopicsCommittee.length === 0) {
        this.$message.warning('请先选择议题');
        return;
      }
      // 将选中的议题数组传入申请上会弹窗
      this.selectedTopicsForApply = this.selectedTopicsCommittee.map(topic => ({
        id: topic.id,
        topicName: topic.topicName,
        applyDept: topic.department,
        deptDirector: topic.deptDirector
      }));
      this.showApplyMeetingDialog = true;
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
        deptDirector: '',
        deptLeader: ''
      };
      this.page.currentPage = 1;
      this.onLoad(this.page, {});
    },

    handleSearchCommittee() {
      this.pageCommittee.currentPage = 1;
      this.onLoadCommittee(this.pageCommittee, this.searchParamsCommittee);
    },

    handleSearchResetCommittee() {
      this.searchParamsCommittee = {
        title: '',
        status: '',
        department: '',
        createdAt: null,
        stage: '',
        applyStatus: '',
        deptDirector: '',
        deptLeader: ''
      };
      this.pageCommittee.currentPage = 1;
      this.onLoadCommittee(this.pageCommittee, {});
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

    // 操作列按钮排成两行显示
    .avue-crud__menu {
      .action-buttons-wrapper {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
        max-width: 200px;
        align-items: flex-start;

        .el-button {
          white-space: nowrap;
          padding: 0 4px !important;
          font-size: 12px;
          height: 28px;
          line-height: 28px;
          flex: 0 1 auto;
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

  .meeting-tabs {
    ::v-deep .el-tabs__nav-wrap {
      background: white;
      border-bottom: 2px solid #e8eaed;
    }

    ::v-deep .el-tabs__nav {
      border: none;
    }

    ::v-deep .el-tabs__item {
      padding: 0 20px;
      height: 50px;
      line-height: 50px;
      font-size: 14px;
      font-weight: 500;
      color: #606266;
      border-bottom: 3px solid transparent;
      transition: all 0.3s;

      &:hover {
        color: #667eea;
      }

      &.is-active {
        color: #667eea;
        border-bottom-color: #667eea;
      }
    }

    ::v-deep .el-tabs__content {
      padding: 20px 0;
    }
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
