<template>
  <basic-container>
    <decision-breadcrumb :breadcrumbs="breadcrumbs" />
    <el-card class="form-card">
      <template #header>
        <div class="card-header">
          <span class="card-title">{{ isEdit ? '编辑议题' : '新建议题' }}</span>
          <div class="header-actions">
            <el-button @click="handleCancel">取消</el-button>
            <el-button @click="handleSave">暂存</el-button>
            <el-button type="primary" @click="handleSubmit">保存并提交</el-button>
          </div>
        </div>
      </template>

      <avue-form
        ref="form"
        :option="formOption"
        v-model="formData"
      />
    </el-card>
  </basic-container>
</template>

<script>
import { topicFormOption } from '@/option/decision/topic-form';
import { getDeptList, getDeptUsers, getAgendaType, saveTopicData } from '@/api/decision/topic';
import DecisionBreadcrumb from '../../components/breadcrumb.vue';

export default {
  name: 'TopicForm',
  components: {
    DecisionBreadcrumb
  },
  data() {
    return {
      isEdit: false,
      topicId: null,
      formData: {},
      formOption: JSON.parse(JSON.stringify(topicFormOption)),
      submitting: false,
      // 科室ID到科室主任列表的映射，用于缓存
      deptDirectorCache: {},
      // 科室信息缓存（ID -> 科室对象）
      deptInfoCache: {}
    };
  },
  computed: {
    breadcrumbs() {
      return this.isEdit ? ['议题管理', '编辑议题'] : ['议题管理', '新建议题'];
    }
  },
  created() {
    this.topicId = this.$route.params.id;
    this.isEdit = !!this.topicId;

    // 加载科室列表
    this.loadDeptList();

    // 加载会议类型
    this.loadMeetingTypes();

    if (this.isEdit) {
      this.loadTopicDetail();
    } else {
      this.initFormData();
    }
  },
  watch: {
    'formData.department'(val) {
      if (val) {
        // 加载该科室的主任列表
        this.loadDeptDirectors(val);
      }
    },

    'formData.needCollaboration'(val) {
      // Show/hide collaboration related fields
      this.setGroupFieldsDisplay('group4', ['collaborationDepts', 'collaborationLeaders', 'collaborationDirectors'], val === '是');
    },

    'formData.hasRisk'(val) {
      // Show/hide risk measures field
      this.setGroupFieldDisplay('group4', 'riskMeasures', val === '是');
    },

    'formData.collaborationDepts'(val) {
      if (val && val.length > 0) {
        this.fillCollaborationInfo(val);
      } else {
        this.formData.collaborationLeaders = '';
      }
    }
  },
  methods: {
    loadDeptList() {
      // 从接口获取科室列表
      getDeptList('000000')
        .then(res => {
          if (res.data && res.data.data) {
            // 将返回的科室数据转换为 dicData 格式
            const deptData = res.data.data.map(dept => ({
              label: dept.deptName,
              value: dept.id
            }));

            // 缓存科室信息，用于后续获取科室名称
            res.data.data.forEach(dept => {
              this.deptInfoCache[dept.id] = {
                id: dept.id,
                name: dept.deptName,
                parentId: dept.parentId
              };
            });

            // 更新表单配置中的科室字段
            const deptGroup = this.formOption.group.find(g => g.prop === 'group1');
            if (deptGroup) {
              const deptField = deptGroup.column.find(c => c.prop === 'department');
              if (deptField) {
                deptField.dicData = deptData;
              }
            }

            // 同时更新协同科室字段
            const group4 = this.formOption.group.find(g => g.prop === 'group4');
            if (group4) {
              const collaborationField = group4.column.find(c => c.prop === 'collaborationDepts');
              if (collaborationField) {
                collaborationField.dicData = deptData;
              }
            }
          }
        })
        .catch(err => {
          console.error('获取科室列表失败:', err);
          // 失败时保持原有的静态数据
        });
    },

    loadMeetingTypes() {
      // 从接口获取会议类型列表
      getAgendaType()
        .then(res => {
          if (res.data && res.data.data && Array.isArray(res.data.data)) {
            // 将返回的会议类型数据转换为 dicData 格式
            const meetingTypeData = res.data.data.map(item => ({
              label: item.value,
              value: item.code
            }));

            // 更新表单配置中的会议类型字段
            const group5 = this.formOption.group.find(g => g.prop === 'group5');
            if (group5) {
              const meetingTypeField = group5.column.find(c => c.prop === 'meetingType');
              if (meetingTypeField) {
                meetingTypeField.dicData = meetingTypeData;
              }
            }
          }
        })
        .catch(err => {
          console.error('获取会议类型列表失败:', err);
          // 失败时保持原有的静态数据
        });
    },

    initFormData() {
      this.formData = {
        title: '',
        department: '',
        deptDirector: '',
        reporter: '',
        duration: 30,
        leader: '',
        summary: '',
        discussion: '',
        attachments: [],
        isImportant: '否',
        needCollaboration: '否',
        collaborationDepts: [],
        collaborationLeaders: '',
        collaborationDirectors: [],
        hasRisk: '否',
        riskMeasures: '',
        meetingType: '',
        expectedTime: ''
      };
    },

    loadTopicDetail() {
      // Mock data for edit mode
      setTimeout(() => {
        this.formData = {
          id: this.topicId,
          title: '新增胸外科手术规范',
          department: '胸外科',
          deptDirector: '张三',
          reporter: '李四',
          duration: 30,
          leader: '王五',
          summary: '<p>这是议题内容摘要的富文本编辑内容...</p>',
          discussion: '会前讨论情况及建议解决方案的具体内容...',
          attachments: [],
          isImportant: '是',
          needCollaboration: '是',
          collaborationDepts: ['心内科', '放射科'],
          collaborationLeaders: '李四, 王五',
          collaborationDirectors: [],
          hasRisk: '否',
          riskMeasures: '',
          meetingType: '院长办公会',
          expectedTime: '2024-12-20',
          status: 'draft',
          createdAt: '2024-12-01 10:30:00'
        };

        // Update field display states for loaded data
        this.$nextTick(() => {
          if (this.formData.needCollaboration === '是') {
            this.setGroupFieldsDisplay('group4', ['collaborationDepts', 'collaborationLeaders', 'collaborationDirectors'], true);
          }
          if (this.formData.hasRisk === '是') {
            this.setGroupFieldDisplay('group4', 'riskMeasures', true);
          }
        });
      }, 300);
    },

    handleCancel() {
      this.$router.go(-1);
    },

    handleSave() {
      // Save as draft
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.saveOrUpdate({ ...this.formData, status: 'draft' });
        }
      });
    },

    handleSubmit() {
      // Submit for review
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.saveOrUpdate({ ...this.formData, status: 'pending_vote' });
        }
      });
    },

    saveOrUpdate(data) {
      this.submitting = true;

      // 将表单数据转换为 API 需要的格式
      const apiData = this.transformFormDataToAPI(data);

      // 调用 API 保存议题
      saveTopicData(apiData)
        .then(res => {
          if (res.data && res.data.success) {
            this.$message.success(this.isEdit ? '更新成功' : '创建成功');
            this.$router.push('/decision/topic');
          } else {
            this.$message.error(res.data?.msg || '保存失败');
          }
        })
        .catch(err => {
          console.error('保存议题失败:', err);
          this.$message.error('保存失败，请重试');
        })
        .finally(() => {
          this.submitting = false;
        });
    },

    transformFormDataToAPI(formData) {
      // 获取申报科室信息
      const deptInfo = this.deptInfoCache[formData.department] || {};
      // 获取申报科室主任信息
      const directorInfo = this.deptDirectorCache[`user_${formData.deptDirector}`] || {};

      // 获取协同科室信息
      const collaborationDeptId = formData.collaborationDepts?.[0] || '';
      const collaborationDeptInfo = this.deptInfoCache[collaborationDeptId] || {};
      const collaborationDirectorInfo = this.deptDirectorCache[`user_${formData.collaborationLeaders}`] || {};

      // 将是否值转换为 0/1
      const isThreeMajor = formData.isImportant === '是' ? '1' : '0';
      const isPublicOpinion = formData.hasRisk === '是' ? '1' : '0';

      // 构建 API 参数
      const apiData = {
        // 议题基本信息
        topicName: formData.title,

        // 申报科室
        applyDeptId: formData.department,
        applyDeptName: deptInfo.name || '',
        applyDeptDirectorId: formData.deptDirector,
        applyDeptDirectorName: directorInfo.name || '',
        applyDeptLeaderId: '',  // leader 是文本输入，暂时用空值
        applyDeptLeaderName: formData.leader || '',

        // 协同科室
        cooperateDeptId: collaborationDeptId,
        cooperateDeptName: collaborationDeptInfo.name || '',
        cooperateDeptDirectorId: formData.collaborationLeaders,
        cooperateDeptDirectorName: collaborationDirectorInfo.name || '',
        cooperateDeptLeaderId: '',  // collaborationDirectors 是多选，取第一个
        cooperateDeptLeaderName: formData.collaborationDirectors?.[0] || '',

        // 其他信息
        reporterId: '',  // reporter 是文本输入，需要转换
        reporterName: formData.reporter || '',
        reportDuration: formData.duration || 0,

        // 内容信息
        topicSummary: formData.summary || '',
        preDiscuss: formData.discussion || '',

        // 特殊信息
        isThreeMajor: isThreeMajor,
        isPublicOpinion: isPublicOpinion,
        riskMeasure: formData.riskMeasures || '',

        // 会议信息
        meetingType: formData.meetingType || '',
        expectReportDate: formData.expectedTime || '',

        // 附件
        attachments: formData.attachments || [],

        // 编辑模式下需要提供 ID
        id: this.topicId || ''
      };

      return apiData;
    },

    fillCollaborationInfo(depts) {
      // 当选择了协同科室时，加载该科室的主任和分管领导
      if (depts && depts.length > 0) {
        // 获取第一个协同科室的主任和分管领导
        this.loadCollaborationDeptInfo(depts[0]);
      } else {
        // 清空协同科室相关的字段
        this.formData.collaborationLeaders = '';
        this.formData.collaborationDirectors = [];
      }
    },

    loadCollaborationDeptInfo(deptId) {
      // 检查缓存中是否已有该科室的信息
      if (this.deptDirectorCache[deptId]) {
        const directorData = this.deptDirectorCache[deptId];
        this.updateCollaborationDeptField(directorData);
        return;
      }

      // 从接口获取协同科室的主任列表
      getDeptUsers(deptId)
        .then(res => {
          if (res.data && res.data.data && res.data.data.directorList) {
            // 将返回的主任列表转换为 dicData 格式
            const directorData = res.data.data.directorList.map(director => ({
              label: director.name,
              value: director.id
            }));

            // 同时缓存用户列表的完整数据
            if (res.data.data.userList) {
              res.data.data.userList.forEach(user => {
                this.deptDirectorCache[`user_${user.id}`] = {
                  id: user.id,
                  name: user.name,
                  realName: user.realName
                };
              });
            }

            // 缓存主任列表
            this.deptDirectorCache[deptId] = directorData;

            // 更新表单配置中的协同科室主任字段
            this.updateCollaborationDeptField(directorData);
          }
        })
        .catch(err => {
          console.error('获取协同科室主任列表失败:', err);
          this.updateCollaborationDeptField([]);
        });
    },

    updateCollaborationDeptField(directorData) {
      // 更新 group4 中的协同科室主任字段
      const group4 = this.formOption.group.find(g => g.prop === 'group4');
      if (group4) {
        const leaderField = group4.column.find(c => c.prop === 'collaborationLeaders');
        if (leaderField) {
          leaderField.dicData = directorData;
          // 清空之前选中的主任
          this.formData.collaborationLeaders = '';
        }
      }
    },

    loadDeptDirectors(deptId) {
      // 检查缓存中是否已有该科室的主任列表
      if (this.deptDirectorCache[deptId]) {
        this.updateDeptDirectorField(this.deptDirectorCache[deptId]);
        return;
      }

      // 从接口获取科室主任列表
      getDeptUsers(deptId)
        .then(res => {
          if (res.data && res.data.data && res.data.data.directorList) {
            // 将返回的主任列表转换为 dicData 格式
            const directorData = res.data.data.directorList.map(director => ({
              label: director.name,
              value: director.id
            }));

            // 缓存主任列表和完整信息
            this.deptDirectorCache[deptId] = directorData;

            // 同时缓存用户列表的完整数据，用于获取用户信息
            if (res.data.data.userList) {
              res.data.data.userList.forEach(user => {
                this.deptDirectorCache[`user_${user.id}`] = {
                  id: user.id,
                  name: user.name,
                  realName: user.realName
                };
              });
            }

            // 更新表单配置中的科室主任字段
            this.updateDeptDirectorField(directorData);
          }
        })
        .catch(err => {
          console.error('获取科室主任列表失败:', err);
          // 失败时清空主任下拉列表
          this.updateDeptDirectorField([]);
        });
    },

    updateDeptDirectorField(directorData) {
      // 更新 group1 中的科室主任字段
      const deptGroup = this.formOption.group.find(g => g.prop === 'group1');
      if (deptGroup) {
        const directorField = deptGroup.column.find(c => c.prop === 'deptDirector');
        if (directorField) {
          directorField.dicData = directorData;
          // 清空之前选中的主任
          this.formData.deptDirector = '';
        }
      }
    },

    setGroupFieldsDisplay(groupProp, fieldProps, display) {
      const group = this.formOption.group.find(g => g.prop === groupProp);
      if (group) {
        fieldProps.forEach(fieldProp => {
          const col = group.column.find(c => c.prop === fieldProp);
          if (col) {
            col.display = display;
          }
        });
      }
    },

    setGroupFieldDisplay(groupProp, fieldProp, display) {
      const group = this.formOption.group.find(g => g.prop === groupProp);
      if (group) {
        const col = group.column.find(c => c.prop === fieldProp);
        if (col) {
          col.display = display;
        }
      }
    }
  }
};
</script>

<style scoped lang="scss">
.form-card {
  ::v-deep .el-card__header {
    background: #f5f7fa;
    border-bottom: 1px solid #ebeef5;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;

    .card-title {
      font-size: 16px;
      font-weight: 500;
      color: #303133;
    }

    .header-actions {
      display: flex;
      gap: 8px;

      .el-button {
        font-size: 14px;
      }
    }
  }
}
</style>
