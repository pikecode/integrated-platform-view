/**
 * 议题创建/编辑表单 avue-form 配置
 */

// 议题状态字典
const statusDict = [
  { label: '议题申请中', value: 'draft' },
  { label: '待上会', value: 'pending_vote' },
  { label: '上会申请中', value: 'applying' },
  { label: '已申请上会', value: 'approved' },
  { label: '结论审批中', value: 'voting' },
  { label: '结论录入完成', value: 'completed' },
  { label: '已撤回', value: 'withdrawn' }
];

// 科室字典
const departmentDict = [
  { label: '胸外科', value: '胸外科' },
  { label: '心内科', value: '心内科' },
  { label: '放射科', value: '放射科' },
  { label: '重症监护室', value: '重症监护室' },
  { label: '门诊', value: '门诊' },
  { label: '护理部', value: '护理部' },
  { label: '感控部', value: '感控部' },
  { label: '医保科', value: '医保科' },
  { label: '急诊科', value: '急诊科' },
  { label: '质管科', value: '质管科' }
];

// 会议类型字典
const meetingTypeDict = [
  { label: '院长办公会', value: '院长办公会' },
  { label: '党委会', value: '党委会' }
];

// 是否选择字典
const yesNoDict = [
  { label: '否', value: '否' },
  { label: '是', value: '是' }
];

/**
 * 议题创建/编辑表单配置
 */
export const topicFormOption = {
  dialogWidth: 1200,
  dialogClickModal: false,
  labelWidth: 140,
  submitBtn: false,
  emptyBtn: false,
  group: [
    {
      icon: 'el-icon-document',
      label: '议题内容信息',
      prop: 'group1',
      column: [
        {
          label: '议题名称',
          prop: 'title',
          type: 'input',
          span: 24,
          maxlength: 50,
          showWordLimit: true,
          placeholder: '50个字以内',
          rules: [
            { required: true, message: '请输入议题名称', trigger: 'blur' }
          ]
        },
        {
          label: '申报科室',
          prop: 'department',
          type: 'select',
          span: 12,
          dicData: departmentDict,
          placeholder: '请选择申报科室',
          rules: [
            { required: true, message: '请选择申报科室', trigger: 'change' }
          ]
        },
        {
          label: '科室主任',
          prop: 'deptDirector',
          type: 'select',
          span: 12,
          placeholder: '请选择科室主任',
          dicData: [],
          rules: [
            { required: true, message: '请选择科室主任', trigger: 'change' }
          ]
        },
        {
          label: '汇报人',
          prop: 'reporter',
          type: 'select',
          span: 12,
          placeholder: '请选择汇报人',
          dicData: [],
          rules: [
            { required: true, message: '请选择汇报人', trigger: 'change' }
          ]
        },
        {
          label: '汇报时长',
          prop: 'duration',
          type: 'number',
          span: 12,
          placeholder: '请输入汇报时长',
          append: '分钟',
          min: 1,
          max: 120,
          value: 30
        },
        {
          label: '科室分管领导',
          prop: 'leader',
          type: 'select',
          span: 12,
          placeholder: '请选择科室分管领导',
          dicData: [],
          rules: [
            { required: true, message: '请选择科室分管领导', trigger: 'change' }
          ]
        },
        {
          label: '议题内容摘要',
          prop: 'summary',
          component: 'avue-ueditor',
          action: '/blade-resource/oss/endpoint/put-file',
          propsHttp: {
            res: 'data',
            url: 'link'
          },
          span: 24,
          rules: [
            { required: true, message: '请输入议题内容摘要', trigger: 'blur' }
          ]
        }
      ]
    },
    {
      icon: 'el-icon-edit',
      label: '会前讨论情况及建议解决方案',
      prop: 'group2',
      column: [
        {
          label: '',
          prop: 'discussion',
          type: 'textarea',
          span: 24,
          rows: 6,
          maxlength: 500,
          showWordLimit: true,
          placeholder: '请输入会前讨论情况及建议解决方案（500个字以内）'
        }
      ]
    },
    {
      icon: 'el-icon-upload',
      label: '相关附件',
      prop: 'group3',
      column: [
        {
          label: '上传文件',
          prop: 'attachments',
          type: 'upload',
          span: 24,
          listType: 'text',
          multiple: true,
          limit: 5,
          fileSize: 102400,
          accept: '.doc,.docx,.xls,.xlsx,.pdf,.png,.jpg',
          tip: '最多上传5个文件，单个文件不超过100MB，格式要求doc/docx/xls/xlsx/pdf/png/jpg',
          action: '/api/xinhui-oa-decision/api/attachment/v1/upload',
          propsHttp: {
            res: 'data',
            url: 'fileKey',
            name: 'fileName'
          },
          dataType: 'string'
        }
      ]
    },
    {
      icon: 'el-icon-info',
      label: '其他信息',
      prop: 'group4',
      column: [
        {
          label: '是否三重一大',
          prop: 'isImportant',
          type: 'select',
          span: 12,
          dicData: yesNoDict,
          value: '否',
          rules: [
            { required: true, message: '请选择是否三重一大', trigger: 'change' }
          ]
        },
        {
          label: '是否需要协同科室',
          prop: 'needCollaboration',
          type: 'select',
          span: 12,
          dicData: yesNoDict,
          value: '否',
          rules: [
            { required: true, message: '请选择是否需要协同科室', trigger: 'change' }
          ]
        },
        {
          label: '协同科室',
          prop: 'collaborationDepts',
          type: 'select',
          span: 12,
          multiple: true,
          placeholder: '请选择协同科室（支持3个以内）',
          dicData: departmentDict,
          rules: [
            { required: true, message: '请选择协同科室', trigger: 'change' }
          ]
        },
        {
          label: '协同科室主任',
          prop: 'collaborationLeaders',
          type: 'select',
          span: 12,
          placeholder: '自动显示',
          dicData: [],
          rules: [
            { required: true, message: '请选择协同科室主任', trigger: 'change' }
          ]
        },
        {
          label: '协同科室分管领导',
          prop: 'collaborationDirectors',
          type: 'select',
          span: 12,
          multiple: true,
          placeholder: '自动显示',
          dicData: [],
          rules: [
            { required: true, message: '请选择协同科室分管领导', trigger: 'change' }
          ]
        },
        {
          label: '是否存在舆情风险',
          prop: 'hasRisk',
          type: 'select',
          span: 12,
          dicData: yesNoDict,
          value: '否',
          rules: [
            { required: true, message: '请选择是否存在舆情风险', trigger: 'change' }
          ]
        },
        {
          label: '舆情应对措施',
          prop: 'publicOpinionMeasures',
          type: 'textarea',
          span: 24,
          rows: 4,
          placeholder: '请输入舆情应对措施',
          display: false,
          rules: [
            { required: true, message: '请输入舆情应对措施', trigger: 'blur' }
          ]
        },
        {
          label: '风险应对措施',
          prop: 'riskMeasures',
          type: 'textarea',
          span: 24,
          rows: 4,
          placeholder: '请输入风险应对措施'
        }
      ]
    },
    {
      icon: 'el-icon-date',
      label: '会议信息',
      prop: 'group5',
      column: [
        {
          label: '会议类型',
          prop: 'meetingType',
          type: 'select',
          span: 12,
          dicData: [],
          placeholder: '请选择会议类型',
          rules: [
            { required: true, message: '请选择会议类型', trigger: 'change' }
          ]
        },
        {
          label: '期望汇报时间',
          prop: 'expectedTime',
          type: 'date',
          span: 12,
          format: 'YYYY-MM-DD',
          valueFormat: 'YYYY-MM-DD',
          placeholder: '选择到某天',
          rules: [
            { required: true, message: '请选择期望汇报时间', trigger: 'change' }
          ]
        }
      ]
    }
  ]
};
