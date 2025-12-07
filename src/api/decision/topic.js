/**
 * 议题管理 API
 */

import request from '@/axios';

const api = '/blade-decision/topic';

// 模拟议题数据
const mockTopics = [
  {
    id: 1,
    title: '公司年度发展方向讨论',
    description: '讨论2024年公司的发展方向和战略规划',
    status: 'voting',
    creator: '张三',
    createdAt: '2024-12-01',
    voteCount: 15,
    supportCount: 12,
    opposedCount: 2,
    abstainCount: 1
  },
  {
    id: 2,
    title: '远程办公政策调整',
    description: '讨论是否调整远程办公政策',
    status: 'draft',
    creator: '李四',
    createdAt: '2024-12-02',
    voteCount: 0,
    supportCount: 0,
    opposedCount: 0,
    abstainCount: 0
  },
  {
    id: 3,
    title: '技术栈升级方案',
    description: '讨论是否升级现有技术栈',
    status: 'closed',
    creator: '王五',
    createdAt: '2024-11-30',
    voteCount: 20,
    supportCount: 18,
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
