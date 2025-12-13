/**
 * 议程安排 avue-crud 配置
 */

// 会议状态字典
const statusDict = [
  { label: '待进行', value: 'wait_start' },
  { label: '进行中', value: 'ongoing' },
  { label: '已结束', value: 'ended' },
  { label: '已取消', value: 'cancelled' }
];

// 会议类型字典
const meetingTypeDict = [
  { label: '院长办公会', value: '院长办公会' },
  { label: '党委会', value: '党委会' }
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
    calcHeight: 280,
    tip: false,
    searchShow: false,
    border: true,
    index: true,
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
        width: 50,
        type: 'index'
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
        type: 'select',
        dicData: meetingTypeDict,
        width: 100
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
        type: 'select',
        dicData: statusDict,
        width: 100,
        formatter: (row) => {
          const statusMap = {
            'wait_start': '待进行',
            'ongoing': '进行中',
            'ended': '已结束',
            'cancelled': '已取消'
          };
          return statusMap[row.status] || '-';
        }
      }
    ]
  };
};
