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
      // Mock department to director mapping
      deptDirectorMap: {
        '胸外科': '张三',
        '心内科': '李四',
        '放射科': '王五',
        '重症监护室': '赵六',
        '门诊': '孙七',
        '护理部': '周八',
        '感控部': '吴九',
        '医保科': '郑十',
        '急诊科': '刘十一',
        '质管科': '陈十二'
      }
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

    if (this.isEdit) {
      this.loadTopicDetail();
    } else {
      this.initFormData();
    }
  },
  watch: {
    'formData.department'(val) {
      if (val) {
        // Auto-populate department director
        this.formData.deptDirector = this.deptDirectorMap[val] || '';
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

      // Mock save logic
      setTimeout(() => {
        this.$message.success(this.isEdit ? '更新成功' : '创建成功');
        this.$router.push('/decision/topic');
        this.submitting = false;
      }, 500);
    },

    fillCollaborationInfo(depts) {
      // Auto-populate collaboration leaders based on selected departments
      const leaders = depts.map(dept => this.deptDirectorMap[dept] || '').filter(Boolean);
      this.formData.collaborationLeaders = leaders.join(', ');
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
