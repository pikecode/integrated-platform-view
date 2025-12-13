/**
 * 议题管理 avue-crud 配置
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

// 议题当前阶段字典
const stageDict = [
  { label: '全部', value: '' },
  { label: '阶段1', value: 'stage1' },
  { label: '阶段2', value: 'stage2' },
  { label: '阶段3', value: 'stage3' }
];

// 申请上会状态字典
const applyStatusDict = [
  { label: '全部', value: '' },
  { label: '待审批', value: 'pending' },
  { label: '已导出', value: 'exported' }
];

/**
 * 基础议题配置（议题管理和我发布的共用）
 */
export const topicOption = (vm) => {
  return {
    // 基础配置
    height: 'auto',
    calcHeight: 280,
    tip: false,
    searchShow: true,
    searchMenuSpan: 6,
    border: true,
    index: true,
    selection: true,
    viewBtn: false,
    addBtn: false,
    delBtn: false,
    editBtn: false,
    menu: true,
    menuWidth: 280,
    dialogClickModal: false,

    // 列定义
    column: [
      {
        label: '议题名称',
        prop: 'title',
        search: true,
        searchPlaceholder: '请输入议题名称',
        minWidth: 200,
        overHidden: true,
        slot: true
      },
      {
        label: '议题状态',
        prop: 'status',
        search: true,
        searchPlaceholder: '请选择议题状态',
        type: 'select',
        dicData: statusDict,
        width: 120,
        slot: true
      },
      {
        label: '当前审批节点',
        prop: 'approvalNode',
        width: 150,
        formatter: (row) => {
          const nodeMap = {
            'draft': '议题草稿',
            'pending_vote': '待审批',
            'applying': '申请中',
            'approved': '已审批',
            'voting': '投票中',
            'completed': '已完成',
            'withdrawn': '已撤回'
          };
          return nodeMap[row.status] || '未知';
        }
      },
      {
        label: '申报科室',
        prop: 'department',
        search: false,
        searchDisplay: false,
        type: 'select',
        dicData: departmentDict,
        width: 120
      },
      {
        label: '科室分管领导',
        prop: 'leader',
        width: 120
      },
      {
        label: '议题申报时间',
        prop: 'createdAt',
        search: true,
        searchRange: true,
        type: 'date',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD',
        width: 180
      },
      // 隐藏在表格中，但在搜索中使用的字段
      {
        label: '议题当前阶段',
        prop: 'stage',
        search: true,
        searchPlaceholder: '全部',
        type: 'select',
        dicData: stageDict,
        hide: true
      },
      {
        label: '申请上会状态',
        prop: 'applyStatus',
        search: true,
        searchPlaceholder: '全部',
        type: 'select',
        dicData: applyStatusDict,
        hide: true
      },
      {
        label: '开始时间',
        prop: 'startTime',
        search: true,
        searchPlaceholder: '开始时间',
        type: 'datetime',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
        hide: true
      },
      {
        label: '结束时间',
        prop: 'endTime',
        search: true,
        searchPlaceholder: '结束时间',
        type: 'datetime',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
        hide: true
      },
      {
        label: '申报科室主任',
        prop: 'deptDirector',
        search: true,
        searchPlaceholder: '请输入申报科室主任',
        hide: true
      }
    ]
  };
};

/**
 * 我发布的议题配置（启用申报科室搜索）
 */
export const myTopicsOption = (vm) => {
  const option = topicOption(vm);

  // 启用申报科室搜索
  const deptColumn = option.column.find(col => col.prop === 'department');
  if (deptColumn) {
    deptColumn.search = true;
    deptColumn.searchDisplay = true;
    deptColumn.searchPlaceholder = '请选择申报科室';
  }

  return option;
};
