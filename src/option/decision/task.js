export const taskOption = (vm) => {
  return {
    height: 'auto',
    calcHeight: 280,
    tip: false,
    searchShow: false,
    border: true,
    index: true,
    indexLabel: '序号',
    indexWidth: 60,
    selection: false,
    viewBtn: false,
    addBtn: false,
    delBtn: false,
    editBtn: false,
    menu: true,
    menuWidth: 280,
    menuAlign: 'center',
    dialogClickModal: false,

    column: [
      {
        label: '任务名称',
        prop: 'taskName',
        minWidth: 200,
        overHidden: true,
        slot: true
      },
      {
        label: '任务状态',
        prop: 'taskStatusName',
        width: 120,
        slot: true
      },
      {
        label: '当前审批节点',
        prop: 'currentStageName',
        width: 150,
        overHidden: true
      },
      {
        label: '任务内容',
        prop: 'taskContent',
        minWidth: 200,
        overHidden: true
      },
      {
        label: '预计完成时间',
        prop: 'approvalTime',
        width: 180
      },
      {
        label: '任务完成倒计时',
        prop: 'taskFinishCountdown',
        width: 140
      }
    ]
  };
};
