/**
 * 议题管理 API
 */

import request from '@/axios';

const api = '/blade-decision/topic';

/**
 * 获取议题列表
 */
export const getList = (current, size, params) => {
  return request({
    url: `${api}/list`,
    method: 'get',
    params: { ...params, current, size }
  });
};

/**
 * 获取议题详情
 */
export const getDetail = id => {
  return request({
    url: `${api}/detail`,
    method: 'get',
    params: { id }
  });
};

/**
 * 新增议题
 */
export const add = row => {
  return request({
    url: `${api}/submit`,
    method: 'post',
    data: row
  });
};

/**
 * 更新议题
 */
export const update = row => {
  return request({
    url: `${api}/update`,
    method: 'post',
    data: row
  });
};

/**
 * 删除议题
 */
export const remove = ids => {
  return request({
    url: `${api}/remove`,
    method: 'post',
    params: { ids }
  });
};

/**
 * 发起投票
 */
export const startVote = topicId => {
  return request({
    url: `${api}/startVote`,
    method: 'post',
    params: { topicId }
  });
};

/**
 * 结束投票
 */
export const endVote = topicId => {
  return request({
    url: `${api}/endVote`,
    method: 'post',
    params: { topicId }
  });
};

/**
 * 提交投票
 */
export const submitVote = (topicId, vote) => {
  return request({
    url: `${api}/submitVote`,
    method: 'post',
    data: { topicId, vote }
  });
};

/**
 * 获取投票结果
 */
export const getVoteResult = topicId => {
  return request({
    url: `${api}/voteResult`,
    method: 'get',
    params: { topicId }
  });
};

/**
 * 存档议题
 */
export const archive = topicId => {
  return request({
    url: `${api}/archive`,
    method: 'post',
    params: { topicId }
  });
};
