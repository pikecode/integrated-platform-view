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
 * 获取议题详情（表单使用）
 */
export const getTopicDetail = id => {
  return getDetail(id);
};

/**
 * 创建议题（表单使用）
 */
export const createTopic = data => {
  return add(data);
};

/**
 * 更新议题（表单使用）
 */
export const updateTopic = data => {
  return update(data);
};
