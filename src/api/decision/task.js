/**
 * 任务管理 API
 */

import request from '@/axios';

const api = '/blade-decision/task';

/**
 * 获取任务列表
 */
export const getList = (current, size, params) => {
  return request({
    url: `${api}/list`,
    method: 'get',
    params: { ...params, current, size }
  });
};

/**
 * 获取任务详情
 */
export const getDetail = id => {
  return request({
    url: `${api}/detail`,
    method: 'get',
    params: { id }
  });
};

/**
 * 新增任务
 */
export const add = row => {
  return request({
    url: `${api}/submit`,
    method: 'post',
    data: row
  });
};

/**
 * 更新任务
 */
export const update = row => {
  return request({
    url: `${api}/update`,
    method: 'post',
    data: row
  });
};

/**
 * 删除任务
 */
export const remove = ids => {
  return request({
    url: `${api}/remove`,
    method: 'post',
    params: { ids }
  });
};

/**
 * 分配任务
 */
export const assign = (taskId, assigneeId) => {
  return request({
    url: `${api}/assign`,
    method: 'post',
    data: { taskId, assigneeId }
  });
};

/**
 * 标记任务完成
 */
export const markComplete = taskId => {
  return request({
    url: `${api}/markComplete`,
    method: 'post',
    params: { taskId }
  });
};

/**
 * 获取任务状态统计
 */
export const getStatistics = () => {
  return request({
    url: `${api}/statistics`,
    method: 'get'
  });
};

/**
 * 获取我的任务
 */
export const getMyTasks = (current, size, params) => {
  return request({
    url: `${api}/myTasks`,
    method: 'get',
    params: { ...params, current, size }
  });
};

/**
 * 更新任务进度
 */
export const updateProgress = (taskId, progress) => {
  return request({
    url: `${api}/updateProgress`,
    method: 'post',
    data: { taskId, progress }
  });
};
