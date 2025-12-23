/**
 * 议题管理 API
 */

import request from '@/axios';

const api = '/blade-decision/topic';

// 模拟议题数据
const mockTopics = [
  {
    id: 1,
    title: '汇报学生党支部资质资教学项',
    description: '讨论2024年公司的发展方向和战略规划',
    status: 'draft',
    creator: '张朝明',
    creatorId: 1,
    department: '胸外科',
    leader: '张三',
    createdAt: '2025-08-08 12:12:12',
    voteCount: 15,
    supportCount: 12,
    opposedCount: 2,
    abstainCount: 1
  },
  {
    id: 2,
    title: '汇报党职工党部党委选人名单',
    description: '讨论是否调整远程办公政策',
    status: 'pending_vote',
    creator: '李四',
    creatorId: 2,
    department: '胸外科',
    leader: '李明',
    createdAt: '2025-08-08 12:12:12',
    voteCount: 0,
    supportCount: 0,
    opposedCount: 0,
    abstainCount: 0
  },
  {
    id: 3,
    title: '汇报T成党16位中层干部试用期满...',
    description: '讨论是否升级现有技术栈',
    status: 'applying',
    creator: '王五',
    creatorId: 3,
    department: '胸外科',
    leader: '张三',
    createdAt: '2025-08-08 12:12:12',
    voteCount: 20,
    supportCount: 18,
    opposedCount: 2,
    abstainCount: 0
  },
  {
    id: 4,
    title: '关于实际命制党克元为心胸外科副...',
    description: '任职任免相关',
    status: 'approved',
    creator: '张朝明',
    creatorId: 1,
    department: '胸外科',
    leader: '李明',
    createdAt: '2025-08-08 12:12:12',
    voteCount: 25,
    supportCount: 24,
    opposedCount: 1,
    abstainCount: 0
  },
  {
    id: 5,
    title: '汇报议题详情页面',
    description: '讨论详情页面显示',
    status: 'voting',
    creator: '李四',
    creatorId: 2,
    department: '胸外科',
    leader: '张三',
    createdAt: '2025-08-08 12:12:12',
    voteCount: 10,
    supportCount: 8,
    opposedCount: 2,
    abstainCount: 0
  },
  {
    id: 6,
    title: '关于实际命制党克元为心胸外科副...',
    description: '任职任免相关',
    status: 'completed',
    creator: '王五',
    creatorId: 3,
    department: '普外科',
    leader: '李明',
    createdAt: '2025-08-08 12:12:12',
    voteCount: 30,
    supportCount: 28,
    opposedCount: 2,
    abstainCount: 0
  }
];

/**
 * 获取议题列表
 */
export const getList = (current, size, params) => {
  return request({
    url: `${api}/list`,
    method: 'get',
    params: { ...params, current, size },
    meta: { isToken: true }
  });
};

/**
 * 获取议题详情
 */
export const getDetail = id => {
  return request({
    url: `${api}/detail`,
    method: 'get',
    params: { id },
    meta: { isToken: true }
  });
};

/**
 * 新增议题
 */
export const add = row => {
  return request({
    url: `${api}/submit`,
    method: 'post',
    data: row,
    meta: { isToken: true }
  });
};

/**
 * 更新议题
 */
export const update = row => {
  return request({
    url: `${api}/update`,
    method: 'post',
    data: row,
    meta: { isToken: true }
  });
};

/**
 * 删除议题
 */
export const remove = ids => {
  return request({
    url: `${api}/remove`,
    method: 'post',
    params: { ids },
    meta: { isToken: true }
  });
};

/**
 * 发起投票
 */
export const startVote = topicId => {
  return request({
    url: `${api}/startVote`,
    method: 'post',
    params: { topicId },
    meta: { isToken: true }
  });
};

/**
 * 结束投票
 */
export const endVote = topicId => {
  return request({
    url: `${api}/endVote`,
    method: 'post',
    params: { topicId },
    meta: { isToken: true }
  });
};

/**
 * 提交投票
 */
export const submitVote = (topicId, vote) => {
  return request({
    url: `${api}/submitVote`,
    method: 'post',
    data: { topicId, vote },
    meta: { isToken: true }
  });
};

/**
 * 获取投票结果
 */
export const getVoteResult = topicId => {
  return request({
    url: `${api}/voteResult`,
    method: 'get',
    params: { topicId },
    meta: { isToken: true }
  });
};

/**
 * 存档议题
 */
export const archive = topicId => {
  return request({
    url: `${api}/archive`,
    method: 'post',
    params: { topicId },
    meta: { isToken: true }
  });
};

/**
 * 获取议题详情
 */
export const getTopicDetail = (topicId) => {
  return request({
    url: `/api/xinhui-oa-decision/api/topic/publish/v1/detail/${topicId}`,
    method: 'get',
    meta: { isToken: true }
  });
};

/**
 * 创建议题（表单使用）
 */
export const createTopic = data => {
  return request({
    url: '/api/xinhui-oa-decision/api/topic/publish/v1/create',
    method: 'post',
    data,
    meta: { isToken: true }
  });
};

/**
 * 更新议题（表单使用）
 */
export const updateTopic = data => {
  return request({
    url: '/api/xinhui-oa-decision/api/topic/publish/v1/update',
    method: 'post',
    data,
    meta: { isToken: true }
  });
};

/**
 * 暂存议题（表单使用）
 */
export const storageTopic = data => {
  return request({
    url: '/api/xinhui-oa-decision/api/topic/publish/v1/storage/create',
    method: 'post',
    data,
    meta: { isToken: true }
  });
};

/**
 * 获取议题状态统计
 */
export const getTopicStatus = () => {
  return request({
    url: '/api/xinhui-oa-decision/api/decision/status/topic/status',
    method: 'get',
    meta: { isToken: true }
  });
};

/**
 * 获取我发布的议题列表（分页）
 */
export const getMyTopicPage = (data) => {
  return request({
    url: '/api/xinhui-oa-decision/api/topic/publish/v1/page',
    method: 'post',
    data,
    meta: { isToken: true }
  });
};

/**
 * 获取科室列表
 */
export const getDeptList = (tenantId) => {
  return request({
    url: `/api/xinhui-oa-decision/api/dept/${tenantId}/list`,
    method: 'get',
    meta: { isToken: true }
  });
};

/**
 * 获取议题当前阶段列表
 */
export const getTopicStage = () => {
  return request({
    url: '/api/xinhui-oa-decision/api/decision/status/topic/stage',
    method: 'get',
    meta: { isToken: true }
  });
};

/**
 * 获取申请上会状态列表
 */
export const getApplyStatus = () => {
  return request({
    url: '/api/xinhui-oa-decision/api/decision/status/boolean',
    method: 'get',
    meta: { isToken: true }
  });
};

/**
 * 获取科室人员（科主任和分管领导）
 */
export const getDeptUsers = (deptId) => {
  return request({
    url: `/api/xinhui-oa-decision/api/dept/${deptId}/user/get`,
    method: 'get',
    meta: { isToken: true }
  });
};

/**
 * 获取会议类型列表
 */
export const getAgendaType = () => {
  return request({
    url: '/api/xinhui-oa-decision/api/decision/status/agenda/type',
    method: 'get',
    meta: { isToken: true }
  });
};

/**
 * 获取议程列表（分页）
 */
export const getAgendaPage = (data) => {
  return request({
    url: '/api/xinhui-oa-decision/api/agenda/v1/page',
    method: 'post',
    data,
    meta: { isToken: true }
  });
};

/**
 * 取消议程
 */
export const cancelAgenda = (agendaId) => {
  return request({
    url: `/api/xinhui-oa-decision/api/agenda/v1/cancel/${agendaId}`,
    method: 'post',
    meta: { isToken: true }
  });
};

/**
 * 删除议程
 */
export const deleteAgenda = (agendaId) => {
  return request({
    url: `/api/xinhui-oa-decision/api/agenda/v1/delete/${agendaId}`,
    method: 'post',
    meta: { isToken: true }
  });
};

/**
 * 获取议程详情
 */
export const getAgendaDetail = (agendaId) => {
  return request({
    url: `/api/xinhui-oa-decision/api/agenda/v1/detail/${agendaId}`,
    method: 'get',
    meta: { isToken: true }
  });
};

/**
 * 更新议程
 */
export const updateAgenda = (data) => {
  return request({
    url: `/api/xinhui-oa-decision/api/agenda/v1/update`,
    method: 'post',
    data,
    meta: { isToken: true }
  });
};

/**
 * 获取待审批议题列表（分页）
 */
export const getPendingApprovalTopicPage = (data) => {
  return request({
    url: '/api/xinhui-oa-decision/api/topic/approval/v1/page/approval',
    method: 'post',
    data,
    meta: { isToken: true }
  });
};

/**
 * 获取已审批议题列表（分页）
 */
export const getApprovedTopicPage = (data) => {
  return request({
    url: '/api/xinhui-oa-decision/api/topic/approval/v1/page/approvaldone',
    method: 'post',
    data,
    meta: { isToken: true }
  });
};

/**
 * 保存议题（新建/更新）
 */
export const saveTopicData = (data) => {
  return request({
    url: '/api/xinhui-oa-decision/api/topic/publish/v1/update',
    method: 'post',
    data,
    meta: { isToken: true }
  });
};

/**
 * 撤回议题
 */
export const withdrawTopic = (topicId, approvalSyncId) => {
  return request({
    url: '/api/xinhui-oa-decision/api/topic/publish/v1/withdraw',
    method: 'post',
    params: { topicId, approvalSyncId },
    meta: { isToken: true }
  });
};

/**
 * 提交议题结论
 */
export const submitTopicConclusion = (data) => {
  return request({
    url: '/api/xinhui-oa-decision/api/topic/conclusion/v1/create',
    method: 'post',
    data,
    meta: { isToken: true }
  });
};

/**
 * 申请议题上会
 */
export const applyTopicMeeting = (data) => {
  return request({
    url: '/api/xinhui-oa-decision/api/topic/meeting/v1/apply',
    method: 'post',
    data,
    meta: { isToken: true }
  });
};

/**
 * 上传附件
 */
export const uploadAttachment = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return request({
    url: '/api/xinhui-oa-decision/api/attachment/v1/upload',
    method: 'post',
    data: formData,
    meta: { isToken: true }
  });
};
