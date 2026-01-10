/**
 * 议题管理 avue-crud 配置
 */

// 议题状态字典（根据API返回的topicStatus）
const statusDict = [
  { label: '议题申请中', value: '110' },
  { label: '已撤回', value: '120' },
  { label: '待上会', value: '300' },
  { label: '已申请上会', value: '350' },
  { label: '结论录入完成', value: '950' }
];

// 议题当前阶段字典（根据API返回的currentStage）
const stageDict = [
  { label: '发起议题', value: '1' },
  { label: '申请上会', value: '3' },
  { label: '结论录入', value: '9' }
];

// 申请上会状态字典（根据API返回的applyMeetingStatus）
const applyStatusDict = [
  { label: '否', value: '0' },
  { label: '是', value: '1' }
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
    searchShow: false,
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
        minWidth: 200,
        overHidden: true,
        slot: true
      },
      {
        label: '议题状态',
        prop: 'statusDesc',
        width: 130,
        slot: true
      },
      {
        label: '当前审批节点',
        prop: 'approvalTaskName',
        width: 150,
        overHidden: true
      },
      {
        label: '会议类型',
        prop: 'meetingTypeDesc',
        width: 120,
        overHidden: true
      },
      {
        label: '申报科室',
        prop: 'department',
        width: 120,
        overHidden: true
      },
      {
        label: '科室分管领导',
        prop: 'leader',
        width: 120,
        overHidden: true
      },
      {
        label: '议题申请时间',
        prop: 'createdAt',
        width: 160
      }
    ]
  };
};

/**
 * 我发布的议题配置
 */
export const myTopicsOption = (vm) => {
  return {
    // 基础配置
    height: 'auto',
    calcHeight: 280,
    tip: false,
    searchShow: false,
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
        prop: 'topicName',
        minWidth: 200,
        overHidden: true,
        slot: true
      },
      {
        label: '议题状态',
        prop: 'topicStatusDesc',
        width: 130,
        slot: true
      },
      {
        label: '当前审批节点',
        prop: 'approvalTaskName',
        width: 150,
        overHidden: true
      },
      {
        label: '申报科室',
        prop: 'applyDeptName',
        width: 120,
        overHidden: true
      },
      {
        label: '科室分管领导',
        prop: 'applyDeptLeaderName',
        width: 120,
        overHidden: true
      },
      {
        label: '议题申请时间',
        prop: 'createTime',
        width: 160
      }
    ]
  };
};
