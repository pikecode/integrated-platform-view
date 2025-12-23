<template>
  <basic-container>
    <decision-breadcrumb :breadcrumbs="breadcrumbs" />
    <el-card class="form-card">
      <template #header>
        <div class="card-header">
          <span class="card-title">{{ isConclusion ? '录入议题结论' : (isEdit ? '编辑议题' : '新建议题') }}</span>
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
import { getDeptList, getDeptUsers, getAgendaType, createTopic, updateTopic, storageTopic, getTopicDetail } from '@/api/decision/topic';
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
      deptInfoCache: {},
      // 标志位：是否正在从API加载详情数据
      isLoadingDetail: false
    };
  },
  computed: {
    breadcrumbs() {
      return this.isEdit ? ['议题管理', '编辑议题'] : ['议题管理', '新建议题'];
    }
  },
  created() {
    this.topicId = this.$route.params.id;
    // 判断当前是新建还是编辑
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
        // 如果正在加载详情，使用不清空值的版本
        if (this.isLoadingDetail) {
          this.loadDeptDirectorsNoClearing(val);
        } else {
          this.loadDeptDirectors(val);
        }
      }
    },

    'formData.needCollaboration'(val) {
      // Show/hide collaboration related fields
      this.setGroupFieldsDisplay('group4', ['collaborationDepts', 'collaborationLeaders', 'collaborationDirectors'], val === '是');
    },

    'formData.hasRisk'(val) {
      // Show/hide public opinion measures and risk measures fields
      this.setGroupFieldDisplay('group4', 'publicOpinionMeasures', val === '是');
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
        publicOpinionMeasures: '',
        riskMeasures: '',
        meetingType: '',
        expectedTime: ''
      };
    },

    loadTopicDetail() {
      // 调用API获取议题详情
      this.isLoadingDetail = true;  // 标记正在加载详情

      getTopicDetail(this.topicId)
        .then(res => {
          if (res.data && res.data.code === 200) {
            const detail = res.data.data || {};

            // 先加载科室选项和协同科室选项（如果有的话）
            const loadPromises = [];

            // 如果有主申报科室，先加载其主任列表
            if (detail.applyDeptId) {
              loadPromises.push(
                this.loadDeptDirectorsPromise(detail.applyDeptId)
              );
            }

            // 如果有协同科室，先加载其信息
            if (detail.cooperateDeptId) {
              loadPromises.push(
                this.loadCollaborationDeptInfoPromise(detail.cooperateDeptId)
              );
            }

            // 等待所有选项加载完成后，再设置表单数据
            Promise.all(loadPromises).then(() => {
              // 将API返回的数据映射到表单字段
              this.formData = {
                id: detail.id || this.topicId,
                title: detail.topicName || '',
                department: detail.applyDeptId || '',
                deptDirector: detail.applyDeptDirectorId || '',
                reporter: detail.reporterId || '',
                duration: detail.reportDuration || 30,
                leader: detail.applyDeptLeaderId || '',
                summary: detail.topicSummary || '',
                discussion: detail.preDiscuss || '',
                attachments: detail.attachments || [],
                isImportant: detail.isThreeMajor === '1' || detail.isThreeMajor === 1 ? '是' : '否',
                needCollaboration: detail.cooperateDeptId ? '是' : '否',
                collaborationDepts: detail.cooperateDeptId ? [detail.cooperateDeptId] : [],
                collaborationLeaders: detail.cooperateDeptDirectorId || '',
                collaborationDirectors: detail.cooperateDeptLeaderId ? [detail.cooperateDeptLeaderId] : [],
                hasRisk: detail.isPublicOpinion === '1' || detail.isPublicOpinion === 1 ? '是' : '否',
                publicOpinionMeasures: detail.publicOpinionMeasure || '',
                riskMeasures: detail.riskMeasure || '',
                meetingType: detail.meetingType || '',
                expectedTime: detail.expectReportDate || '',
                status: detail.topicStatus || 'draft',
                createdAt: detail.createTime || ''
              };

              // 更新字段显示状态
              this.$nextTick(() => {
                if (this.formData.needCollaboration === '是') {
                  this.setGroupFieldsDisplay('group4', ['collaborationDepts', 'collaborationLeaders', 'collaborationDirectors'], true);
                }
                if (this.formData.hasRisk === '是') {
                  this.setGroupFieldDisplay('group4', 'riskMeasures', true);
                }

                // 详情加载完成，取消标志位
                this.isLoadingDetail = false;
              });
            }).catch(err => {
              console.error('加载依赖数据失败:', err);
              this.isLoadingDetail = false;
            });
          } else {
            this.$message.error(res.data?.msg || '获取议题详情失败');
            this.$router.go(-1);
          }
        })
        .catch(err => {
          console.error('获取议题详情失败:', err);
          this.$message.error('获取议题详情失败，请重试');
          this.$router.go(-1);
        });
    },

    // 返回 Promise 的科室主任加载方法（用于编辑时加载选项）
    loadDeptDirectorsPromise(deptId) {
      return new Promise((resolve, reject) => {
        // 检查缓存中是否已有该科室的主任列表
        if (this.deptDirectorCache[deptId]) {
          this.updateDeptDirectorFieldWithoutClear(this.deptDirectorCache[deptId]);
          resolve();
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

              // 更新表单配置中的科室主任字段（不清空值）
              this.updateDeptDirectorFieldWithoutClear(directorData);
              resolve();
            } else {
              resolve();
            }
          })
          .catch(err => {
            console.error('获取科室主任列表失败:', err);
            reject(err);
          });
      });
    },

    // 返回 Promise 的协同科室加载方法
    loadCollaborationDeptInfoPromise(deptId) {
      return new Promise((resolve, reject) => {
        // 检查缓存中是否已有该科室的信息
        if (this.deptDirectorCache[deptId]) {
          this.updateCollaborationDeptFieldWithoutClear(this.deptDirectorCache[deptId]);
          resolve();
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

              // 缓存主任列表
              this.deptDirectorCache[deptId] = directorData;

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

              // 更新表单配置（不清空值）
              this.updateCollaborationDeptFieldWithoutClear(directorData);
              resolve();
            } else {
              resolve();
            }
          })
          .catch(err => {
            console.error('获取协同科室主任列表失败:', err);
            reject(err);
          });
      });
    },

    // 更新科室主任字段，不清空已有值
    updateDeptDirectorFieldWithoutClear(directorData) {
      const deptGroup = this.formOption.group.find(g => g.prop === 'group1');
      if (deptGroup) {
        // 更新科室主任字段
        const directorField = deptGroup.column.find(c => c.prop === 'deptDirector');
        if (directorField) {
          directorField.dicData = directorData;
          // 不清空值，保留已有的选择
        }

        // 更新科室分管领导字段（使用相同的数据）
        const leaderField = deptGroup.column.find(c => c.prop === 'leader');
        if (leaderField) {
          leaderField.dicData = directorData;
          // 不清空值
        }

        // 更新汇报人字段（使用相同的数据）
        const reporterField = deptGroup.column.find(c => c.prop === 'reporter');
        if (reporterField) {
          reporterField.dicData = directorData;
          // 不清空值
        }
      }
    },

    // 更新协同科室字段，不清空已有值
    updateCollaborationDeptFieldWithoutClear(directorData) {
      const group4 = this.formOption.group.find(g => g.prop === 'group4');
      if (group4) {
        // 更新协同科室主任字段
        const leaderField = group4.column.find(c => c.prop === 'collaborationLeaders');
        if (leaderField) {
          leaderField.dicData = directorData;
          // 不清空值
        }

        // 更新协同科室分管领导字段（使用相同的数据）
        const directorField = group4.column.find(c => c.prop === 'collaborationDirectors');
        if (directorField) {
          directorField.dicData = directorData;
          // 不清空值
        }
      }
    },

    handleCancel() {
      this.$router.go(-1);
    },

    handleSave() {
      // 暂存（不需要验证所有必填字段）
      const apiData = this.transformFormDataToAPI(this.formData);

      this.submitting = true;
      storageTopic(apiData)
        .then(res => {
          if (res.data && res.data.success) {
            this.$message.success('暂存成功');
            this.$router.push('/decision/topic/my');
          } else {
            this.$message.error(res.data?.msg || '暂存失败');
          }
        })
        .catch(err => {
          console.error('暂存议题失败:', err);
          this.$message.error('暂存失败，请重试');
        })
        .finally(() => {
          this.submitting = false;
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

      // 根据编辑模式选择不同的 API
      // 录入结论也使用编辑接口
      const apiCall = (this.isEdit || this.isConclusion) ? updateTopic(apiData) : createTopic(apiData);

      // 调用 API 保存议题
      apiCall
        .then(res => {
          if (res.data && res.data.success) {
            if (this.isConclusion) {
              this.$message.success('结论录入成功');
            } else {
              this.$message.success(this.isEdit ? '更新成功' : '创建成功');
            }
            this.$router.push('/decision/topic/my');
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
      let directorInfo = this.deptDirectorCache[`user_${formData.deptDirector}`] || {};
      if (!directorInfo.name && formData.deptDirector) {
        // 如果缓存中没有，从 dicData 中查找
        const deptGroup = this.formOption.group.find(g => g.prop === 'group1');
        if (deptGroup) {
          const directorField = deptGroup.column.find(c => c.prop === 'deptDirector');
          if (directorField && directorField.dicData) {
            const found = directorField.dicData.find(d => d.value === formData.deptDirector);
            if (found) {
              directorInfo = { id: formData.deptDirector, name: found.label };
            }
          }
        }
      }

      // 获取申报科室分管领导信息（与主任使用相同的数据源）
      let leaderInfo = this.deptDirectorCache[`user_${formData.leader}`] || {};
      if (!leaderInfo.name && formData.leader) {
        const deptGroup = this.formOption.group.find(g => g.prop === 'group1');
        if (deptGroup) {
          const leaderField = deptGroup.column.find(c => c.prop === 'leader');
          if (leaderField && leaderField.dicData) {
            const found = leaderField.dicData.find(d => d.value === formData.leader);
            if (found) {
              leaderInfo = { id: formData.leader, name: found.label };
            }
          }
        }
      }

      // 获取汇报人信息（与主任使用相同的数据源）
      let reporterInfo = this.deptDirectorCache[`user_${formData.reporter}`] || {};
      if (!reporterInfo.name && formData.reporter) {
        const deptGroup = this.formOption.group.find(g => g.prop === 'group1');
        if (deptGroup) {
          const reporterField = deptGroup.column.find(c => c.prop === 'reporter');
          if (reporterField && reporterField.dicData) {
            const found = reporterField.dicData.find(d => d.value === formData.reporter);
            if (found) {
              reporterInfo = { id: formData.reporter, name: found.label };
            }
          }
        }
      }

      // 获取协同科室信息
      const collaborationDeptId = formData.collaborationDepts?.[0] || '';
      const collaborationDeptInfo = this.deptInfoCache[collaborationDeptId] || {};

      // 获取协同科室主任信息
      let collaborationDirectorInfo = this.deptDirectorCache[`user_${formData.collaborationLeaders}`] || {};

      // 如果缓存中没有，从 dicData 中查找
      if (!collaborationDirectorInfo.name && formData.collaborationLeaders) {
        const group4 = this.formOption.group.find(g => g.prop === 'group4');
        if (group4) {
          const directorField = group4.column.find(c => c.prop === 'collaborationLeaders');
          if (directorField && directorField.dicData) {
            const found = directorField.dicData.find(d => d.value === formData.collaborationLeaders);
            if (found) {
              collaborationDirectorInfo = { id: formData.collaborationLeaders, name: found.label };
            }
          }
        }
      }

      // 获取协同科室分管领导信息（可能是多个，取第一个）
      let collaborationLeaderInfo = {};
      if (formData.collaborationDirectors && formData.collaborationDirectors.length > 0) {
        collaborationLeaderInfo = this.deptDirectorCache[`user_${formData.collaborationDirectors[0]}`] || {};

        // 如果缓存中没有，从 dicData 中查找
        if (!collaborationLeaderInfo.name) {
          const group4 = this.formOption.group.find(g => g.prop === 'group4');
          if (group4) {
            const leaderField = group4.column.find(c => c.prop === 'collaborationDirectors');
            if (leaderField && leaderField.dicData) {
              const found = leaderField.dicData.find(d => d.value === formData.collaborationDirectors[0]);
              if (found) {
                collaborationLeaderInfo = { id: formData.collaborationDirectors[0], name: found.label };
              }
            }
          }
        }
      }

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
        applyDeptLeaderId: formData.leader || '',  // 科室分管领导ID
        applyDeptLeaderName: leaderInfo.name || '',  // 科室分管领导名称

        // 其他信息
        reporterId: formData.reporter || '',  // 汇报人ID
        reporterName: reporterInfo.name || '',  // 汇报人名称
        reportDuration: formData.duration || 0,

        // 内容信息
        topicSummary: formData.summary || '',
        preDiscuss: formData.discussion || '',

        // 特殊信息
        isThreeMajor: isThreeMajor,
        isPublicOpinion: isPublicOpinion,
        publicOpinionMeasure: formData.publicOpinionMeasures || '',
        riskMeasure: formData.riskMeasures || '',

        // 会议信息
        meetingType: formData.meetingType || '',
        expectReportDate: formData.expectedTime || '',

        // 附件
        attachments: formData.attachments || []
      };

      // 编辑模式下需要提供 ID
      if (this.isEdit && this.topicId) {
        apiData.id = this.topicId;
      }

      // 只有当存在协同科室时，才包含协同科室相关字段
      if (collaborationDeptId) {
        apiData.cooperateDeptId = collaborationDeptId;
        apiData.cooperateDeptName = collaborationDeptInfo.name || '';
        apiData.cooperateDeptDirectorId = formData.collaborationLeaders || '';
        apiData.cooperateDeptDirectorName = collaborationDirectorInfo.name || '';
        apiData.cooperateDeptLeaderId = formData.collaborationDirectors?.[0] || '';  // 分管领导ID
        apiData.cooperateDeptLeaderName = collaborationLeaderInfo.name || '';  // 分管领导名称
      }

      return apiData;
    },

    fillCollaborationInfo(depts) {
      // 当选择了协同科室时，加载该科室的主任和分管领导
      if (depts && depts.length > 0) {
        // 获取第一个协同科室的主任和分管领导
        // 如果正在加载详情，使用不清空值的版本
        if (this.isLoadingDetail) {
          this.loadCollaborationDeptInfoNoClearing(depts[0]);
        } else {
          this.loadCollaborationDeptInfo(depts[0]);
        }
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

    // 加载协同科室信息但不清空已有值（用于编辑加载详情时）
    loadCollaborationDeptInfoNoClearing(deptId) {
      // 检查缓存中是否已有该科室的信息
      if (this.deptDirectorCache[deptId]) {
        const directorData = this.deptDirectorCache[deptId];
        this.updateCollaborationDeptFieldWithoutClear(directorData);
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

            // 更新表单配置中的协同科室主任字段（不清空已有值）
            this.updateCollaborationDeptFieldWithoutClear(directorData);
          }
        })
        .catch(err => {
          console.error('获取协同科室主任列表失败:', err);
          // 失败时不清空，保留已有值
        });
    },

    updateCollaborationDeptField(directorData) {
      // 更新 group4 中的协同科室主任字段和分管领导字段
      const group4 = this.formOption.group.find(g => g.prop === 'group4');
      if (group4) {
        // 更新协同科室主任字段
        const leaderField = group4.column.find(c => c.prop === 'collaborationLeaders');
        if (leaderField) {
          leaderField.dicData = directorData;
          // 清空之前选中的主任
          this.formData.collaborationLeaders = '';
        }

        // 同时更新协同科室分管领导字段（使用相同的数据）
        const directorField = group4.column.find(c => c.prop === 'collaborationDirectors');
        if (directorField) {
          directorField.dicData = directorData;
          // 清空之前选中的分管领导
          this.formData.collaborationDirectors = [];
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

    // 加载科室主任但不清空已有值（用于编辑加载详情时）
    loadDeptDirectorsNoClearing(deptId) {
      // 检查缓存中是否已有该科室的主任列表
      if (this.deptDirectorCache[deptId]) {
        this.updateDeptDirectorFieldWithoutClear(this.deptDirectorCache[deptId]);
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

            // 更新表单配置中的科室主任字段（不清空已有值）
            this.updateDeptDirectorFieldWithoutClear(directorData);
          }
        })
        .catch(err => {
          console.error('获取科室主任列表失败:', err);
          // 失败时不清空，保留已有值
        });
    },

    updateDeptDirectorField(directorData) {
      // 更新 group1 中的科室主任字段、科室分管领导字段和汇报人字段
      const deptGroup = this.formOption.group.find(g => g.prop === 'group1');
      if (deptGroup) {
        // 更新科室主任字段
        const directorField = deptGroup.column.find(c => c.prop === 'deptDirector');
        if (directorField) {
          directorField.dicData = directorData;
          // 清空之前选中的主任
          this.formData.deptDirector = '';
        }

        // 更新科室分管领导字段（使用相同的数据）
        const leaderField = deptGroup.column.find(c => c.prop === 'leader');
        if (leaderField) {
          leaderField.dicData = directorData;
          // 清空之前选中的分管领导
          this.formData.leader = '';
        }

        // 更新汇报人字段（使用相同的数据）
        const reporterField = deptGroup.column.find(c => c.prop === 'reporter');
        if (reporterField) {
          reporterField.dicData = directorData;
          // 清空之前选中的汇报人
          this.formData.reporter = '';
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
