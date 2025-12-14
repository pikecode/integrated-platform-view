export const taskOption = (vm) => {
  return {
    height: 'auto',
    calcHeight: 280,
    tip: false,
    searchShow: false,
    border: true,
    index: true,
    indexLabel: '序号',
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
        width: 150,
        slot: true
      },
      {
        label: '当前审批节点',
        prop: 'approvalTaskName',
        width: 150,
        overHidden: true
      },
      {
        label: '当前执行人',
        prop: 'approvalAssigneeName',
        width: 120,
        overHidden: true
      },
      {
        label: '任务来源',
        prop: 'taskSourceName',
        width: 120,
        overHidden: true
      },
      {
        label: '任务标签',
        prop: 'taskTagName',
        width: 100,
        overHidden: true
      },
      {
        label: '当前阶段',
        prop: 'currentStageName',
        width: 120,
        overHidden: true
      },
      {
        label: '我的角色',
        prop: 'myParticipateRoleName',
        width: 100
      },
      {
        label: '预计完成时间',
        prop: 'expectFinishTime',
        width: 160
      },
      {
        label: '任务完成倒计时',
        prop: 'taskFinishCountdown',
        width: 140
      },
      {
        label: '创建时间',
        prop: 'createTime',
        width: 160
      }
    ]
  };
};
