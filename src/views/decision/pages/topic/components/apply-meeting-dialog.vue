<template>
  <el-dialog
    title="申请上会"
    :model-value="modelValue"
    @update:model-value="(val) => $emit('update:modelValue', val)"
    width="1400px"
    append-to-body
    class="apply-meeting-dialog"
  >
    <!-- 主容器 -->
    <div class="dialog-content">
      <!-- 左侧：会议信息表单 -->
      <div class="left-section">
        <div class="section-title">会议信息</div>
        <el-form :model="formData" label-width="100px" size="small">
          <el-form-item label="会议类型:" required>
            <el-select
              v-model="formData.meetingType"
              placeholder="请选择会议类型"
            >
              <el-option label="院长办公会" value="10" />
              <el-option label="党委会" value="20" />
            </el-select>
          </el-form-item>

          <el-form-item label="会议名称:" required>
            <el-input
              v-model="formData.meetingName"
              placeholder="请输入"
              clearable
            />
          </el-form-item>

          <el-form-item label="会议时间:" required>
            <div class="time-input-group">
              <el-date-picker
                v-model="formData.startTime"
                type="date"
                placeholder="开始时间"
                value-format="YYYY-MM-DD"
              />
              <span class="separator">-</span>
              <el-date-picker
                v-model="formData.endTime"
                type="date"
                placeholder="结束时间"
                value-format="YYYY-MM-DD"
              />
            </div>
          </el-form-item>

          <el-form-item label="会议形式:" required>
            <el-select
              v-model="formData.meetingForm"
              placeholder="请选择会议形式"
            >
              <el-option label="线上" value="线上" />
              <el-option label="线下" value="线下" />
              <el-option label="混合" value="混合" />
            </el-select>
          </el-form-item>

          <el-form-item label="选择参会人员:" required>
            <div class="participant-section">
              <el-select
                v-model="selectedParticipants"
                placeholder="请选择参会人员"
                multiple
                clearable
                :loading="loadingParticipants"
              >
                <el-option
                  v-for="user in participantList"
                  :key="user.id"
                  :label="user.realName"
                  :value="user.id"
                />
              </el-select>
            </div>
          </el-form-item>
        </el-form>
      </div>

      <!-- 右侧：议题信息表格 -->
      <div class="right-section">
        <div class="section-title">议题信息</div>
        <el-table
          :data="topicTableData"
          stripe
          style="width: 100%; height: 400px; overflow-y: auto;"
          size="small"
        >
          <el-table-column prop="index" label="序号" width="50" />
          <el-table-column
            prop="topicName"
            label="议题名称"
            show-overflow-tooltip
          />
          <el-table-column prop="applyDept" label="申请科室" width="100" />
          <el-table-column
            prop="deptDirector"
            label="申请科室主任"
            width="120"
          />
          <el-table-column label="操作" width="80" align="center">
            <template #default="{ row, $index }">
              <el-button
                type="text"
                size="small"
                style="color: #f56c6c"
                @click="handleRemoveTopic($index)"
              >
                移除
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination-container">
          <el-pagination
            :current-page="currentPage"
            :page-size="pageSize"
            :total="topicTotal"
            :page-sizes="[5, 10, 15, 20]"
            layout="prev, pager, next"
            @current-change="handlePageChange"
            @size-change="handlePageSizeChange"
          />
        </div>
      </div>
    </div>

    <!-- 底部操作按钮 -->
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="loading">
          申请上会
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { defineComponent } from 'vue';
import * as topicApi from '@/api/decision/topic';

export default defineComponent({
  name: 'ApplyMeetingDialog',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    selectedTopics: {
      type: Array,
      default: () => []
    }
  },
  emits: ['update:modelValue', 'refresh'],
  data() {
    return {
      loading: false,
      loadingParticipants: false,
      participantList: [],  // 参会人员列表
      userDeptMap: {},      // 用户ID到部门信息的映射
      formData: {
        meetingType: '',
        meetingName: '',
        startTime: null,
        endTime: null,
        meetingForm: '',
        participants: []
      },
      selectedParticipants: [],  // 改为存储用户ID数组
      topics: [], // 存储所有选中的议题
      currentPage: 1,
      pageSize: 5,
      topicTotal: 0
    };
  },
  computed: {
    // 根据分页计算当前页的表格数据
    topicTableData() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.topics.slice(start, end).map((topic, index) => ({
        ...topic,
        index: start + index + 1 // 显示序号
      }));
    }
  },
  watch: {
    modelValue(val) {
      if (val) {
        this.initDialog();
      }
    },
    selectedTopics(val) {
      // 当选中的议题变化时，更新 topics，同时确保 id 字段存在
      console.log('selectedTopics 变化，新值：', val);
      if (val && val.length > 0) {
        this.topics = val.map(topic => ({
          ...topic,
          // 兼容 id 和 topicId 两种字段名
          id: topic.id || topic.topicId
        }));
        this.topicTotal = val.length;
        console.log('selectedTopics watch 后的 topics：', this.topics);
      }
    }
  },
  methods: {
    initDialog() {
      // 初始化表单数据
      this.formData = {
        meetingType: '',
        meetingName: '',
        startTime: null,
        endTime: null,
        meetingForm: '线上',
        participants: []
      };
      this.selectedParticipants = [];

      // 赋值选中的议题，确保 id 字段存在
      if (this.selectedTopics && this.selectedTopics.length > 0) {
        // 深拷贝并确保每个话题都有 id 字段
        this.topics = this.selectedTopics.map(topic => ({
          ...topic,
          // 兼容 id 和 topicId 两种字段名
          id: topic.id || topic.topicId
        }));
      } else {
        // 如果没有选中议题，添加默认议题
        this.topics = [{
          id: '1',
          topicId: '1',
          topicName: '测试议题',
          applyDept: '新慧医院',
          deptDirector: 'admin'
        }];
      }

      this.topicTotal = this.topics.length;
      this.currentPage = 1;

      console.log('initDialog 初始化的 topics：', this.topics);

      // 加载参会人员列表
      this.loadParticipants();
    },

    loadParticipants() {
      this.loadingParticipants = true;

      // 获取本地存储中的 dept_id 和部门信息
      let deptId = '1123598816738675201';  // 默认值
      let deptInfo = {
        deptId: deptId,
        deptName: '未知部门'
      };

      try {
        const userInfo = localStorage.getItem('saber-userInfo');
        if (userInfo) {
          const userObj = JSON.parse(userInfo);
          if (userObj.dept_id) {
            deptId = userObj.dept_id;
            deptInfo.deptId = deptId;
          }
          if (userObj.dept_name) {
            deptInfo.deptName = userObj.dept_name;
          }
        }
      } catch (error) {
        console.error('读取本地存储失败:', error);
      }

      // 调用 API 获取科室人员列表
      topicApi.getDeptUsers(deptId)
        .then(res => {
          if (res.data && res.data.code === 200) {
            const users = res.data.data || [];
            this.participantList = users;

            // 构建用户ID到部门信息的映射
            this.userDeptMap = {};
            users.forEach(user => {
              this.userDeptMap[user.id] = {
                userId: user.id,
                userName: user.realName,
                deptId: deptInfo.deptId,
                deptName: deptInfo.deptName
              };
            });
          } else {
            this.$message.warning('加载参会人员列表失败');
            this.participantList = [];
            this.userDeptMap = {};
          }
        })
        .catch(err => {
          console.error('加载参会人员列表出错:', err);
          this.$message.error('加载参会人员列表失败');
          this.participantList = [];
          this.userDeptMap = {};
        })
        .finally(() => {
          this.loadingParticipants = false;
        });
    },

    handlePageChange(page) {
      this.currentPage = page;
    },

    handlePageSizeChange(size) {
      this.pageSize = size;
      this.currentPage = 1;
    },

    handleRemoveTopic(index) {
      const actualIndex = (this.currentPage - 1) * this.pageSize + index;
      this.topics.splice(actualIndex, 1);
      this.topicTotal = this.topics.length;

      // 如果当前页没有数据了，返回上一页
      if (this.topicTableData.length === 0 && this.currentPage > 1) {
        this.currentPage -= 1;
      }
    },

    handleClose() {
      this.$emit('update:modelValue', false);
    },

    handleSubmit() {
      // 表单验证
      if (!this.formData.meetingType) {
        this.$message.warning('请选择会议类型');
        return;
      }
      if (!this.formData.meetingName) {
        this.$message.warning('请输入会议名称');
        return;
      }
      if (!this.formData.startTime || !this.formData.endTime) {
        this.$message.warning('请选择会议时间');
        return;
      }
      if (!this.formData.meetingForm) {
        this.$message.warning('请选择会议形式');
        return;
      }

      this.loading = true;

      console.log('提交前 topics 数据：', this.topics);

      // 构建 topicIds，确保有效的 ID
      const topicIds = this.topics
        .map(t => {
          console.log('处理话题：', t, '  id:', t.id, '  topicId:', t.topicId);
          return t.id || t.topicId;
        })
        .filter(id => id && id !== '');  // 过滤空值和空字符串

      console.log('最终的 topicIds：', topicIds);

      if (topicIds.length === 0) {
        this.$message.error('议题数据异常，请刷新重试');
        this.loading = false;
        return;
      }

      // TODO: 测试阶段写死测试数据，后续替换为动态构建
      const attendeeList = [
        {
          deptDTO: {
            deptId: '1123598813738675201',
            deptName: '新慧医院'
          },
          userDTOList: [
            {
              userId: '1123598821738675201',
              userName: 'admin'
            }
          ]
        }
      ];

      // 构建提交数据，按新 API 格式
      const submitData = {
        topicIds: topicIds,
        agendaName: this.formData.meetingName,  // 会议名称
        meetingType: this.formData.meetingType,  // 会议类型 (10-院长办公会, 20-党委会)
        meetingForm: this.formData.meetingForm,  // 会议形式
        startTime: this.formatDateTime(this.formData.startTime, true),   // 开始时间
        endTime: this.formatDateTime(this.formData.endTime, false),     // 结束时间
        attendeeList: attendeeList
      };

      console.log('提交的数据：', submitData);

      topicApi.applyTopicMeeting(submitData)
        .then(res => {
          if (res.data && res.data.code === 200) {
            this.$message.success('申请上会成功');
            this.$emit('update:modelValue', false);
            this.$emit('refresh');
          } else {
            this.$message.error(res.data?.message || '申请上会失败');
          }
        })
        .catch(error => {
          console.error('申请上会失败：', error);
          this.$message.error('申请上会失败，请重试');
        })
        .finally(() => {
          this.loading = false;
        });
    },

    formatDateTime(dateStr, isStartTime = true) {
      // 日期格式需要转换为 LocalDateTime 格式: YYYY-MM-DD HH:mm:ss (用空格分隔)
      if (!dateStr) return '';
      // dateStr 格式为 YYYY-MM-DD，需要添加时间部分
      // 开始时间默认为 00:00:00，结束时间默认为 23:59:59
      if (isStartTime) {
        return dateStr + ' 00:00:00';  // 2025-12-02 00:00:00
      } else {
        return dateStr + ' 23:59:59';  // 2025-12-02 23:59:59
      }
    },
  }
});
</script>

<style scoped lang="scss">
.apply-meeting-dialog {
  ::v-deep .el-dialog {
    .el-dialog__body {
      padding: 20px;
    }
  }

  .dialog-content {
    display: flex;
    gap: 30px;
    height: 500px;

    .left-section,
    .right-section {
      flex: 1;
      display: flex;
      flex-direction: column;

      .section-title {
        font-size: 14px;
        font-weight: 600;
        color: #333;
        margin-bottom: 15px;
        padding-bottom: 10px;
        border-bottom: 1px solid #e5e5e5;
      }
    }

    .left-section {
      .el-form {
        .time-input-group {
          display: flex;
          align-items: center;
          gap: 10px;

          .separator {
            color: #999;
          }

          :deep(.el-date-picker) {
            width: 100%;
          }
        }

        .participant-section {
          display: flex;
          align-items: center;
          gap: 15px;

          .participant-text {
            color: #666;
            font-size: 12px;
          }
        }
      }
    }

    .right-section {
      .el-table {
        border: 1px solid #e5e5e5;
        border-radius: 4px;

        :deep(.el-table__header-wrapper) {
          background-color: #f5f5f5;
        }
      }

      .pagination-container {
        display: flex;
        justify-content: flex-end;
        margin-top: 15px;

        :deep(.el-pagination) {
          .btn-prev,
          .btn-next,
          .el-pager li {
            min-width: 32px;
            height: 32px;
            line-height: 32px;
          }
        }
      }
    }
  }

  .dialog-footer {
    text-align: right;
    padding-top: 15px;
    border-top: 1px solid #e5e5e5;

    .el-button {
      margin-left: 10px;
    }
  }
}
</style>
