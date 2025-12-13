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
        prop: 'title',
        minWidth: 200,
        overHidden: true,
        slot: true
      },
      {
        label: '任务状态',
        prop: 'status',
        width: 120,
        slot: true
      },
      {
        label: '当前审批节点',
        prop: 'currentNode',
        width: 150,
        formatter: (row) => row.currentNode || '/'
      },
      {
        label: '任务内容',
        prop: 'content',
        minWidth: 200,
        overHidden: true
      },
      {
        label: '预计完成时间',
        prop: 'dueDate',
        width: 150,
        formatter: (row) => row.dueDate || '/'
      },
      {
        label: '任务完成倒计时',
        prop: 'countdown',
        width: 150,
        formatter: (row) => row.countdown || '/'
      }
    ]
  };
};
