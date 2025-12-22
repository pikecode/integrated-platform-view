/**
 * 议程安排 avue-crud 配置
 */

// 会议状态字典
const statusDict = [
  { label: '待进行', value: '10' },
  { label: '进行中', value: '20' },
  { label: '已结束', value: '30' },
  { label: '已取消', value: '40' }
];

// 会议类型字典
const meetingTypeDict = [
  { label: '院长办公会', value: '10' },
  { label: '党委会', value: '20' }
];

// 会议形式字典
const meetingFormDict = [
  { label: '线上', value: '线上' },
  { label: '线下', value: '线下' },
  { label: '混合', value: '混合' }
];

/**
 * 议程安排配置
 */
export const scheduleOption = (vm) => {
  return {
    // 基础配置
    height: 'auto',
    calcHeight: 320,
    tip: false,
    searchShow: false,
    border: true,
    index: false,
    selection: false,
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
        label: '序号',
        prop: 'index',
        width: 60,
        align: 'center'
      },
      {
        label: '会议名称',
        prop: 'meetingName',
        search: false,
        minWidth: 150,
        overHidden: true
      },
      {
        label: '会议类型',
        prop: 'meetingType',
        search: false,
        width: 100,
        formatter: (row) => {
          return row.meetingTypeDesc || '-';
        }
      },
      {
        label: '会议形式',
        prop: 'meetingForm',
        search: false,
        type: 'select',
        dicData: meetingFormDict,
        width: 80
      },
      {
        label: '参会人数',
        prop: 'participantCount',
        search: false,
        width: 80
      },
      {
        label: '会议时间',
        prop: 'meetingTime',
        search: false,
        width: 150,
        formatter: (row) => {
          return row.meetingTime || '-';
        }
      },
      {
        label: '会议状态',
        prop: 'status',
        search: false,
        width: 100,
        formatter: (row) => {
          return row.agendaStatusDesc || row.status || '-';
        }
      }
    ]
  };
};
