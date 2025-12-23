/**
 * 任务管理 API
 */

import request from '@/axios';

const api = '/blade-decision/task';

// 模拟任务数据
const mockTasks = [
  {
    id: 1,
    title: '完成项目需求文档',
    description: '编写2024年Q1项目的需求文档',
    status: 'in_progress',
    priority: 'high',
    assignee: '张三',
    dueDate: '2024-12-15',
    progress: 60,
    createdAt: '2024-12-01'
  },
  {
    id: 2,
    title: '代码审查',
    description: '审查新功能的代码实现',
    status: 'pending',
    priority: 'medium',
    assignee: '李四',
    dueDate: '2024-12-10',
    progress: 0,
    createdAt: '2024-12-02'
  },
  {
    id: 3,
    title: '测试用例编写',
    description: '编写新功能的测试用例',
    status: 'completed',
    priority: 'high',
    assignee: '王五',
    dueDate: '2024-12-05',
    progress: 100,
    createdAt: '2024-11-30'
  }
];

/**
 * 获取任务列表
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
 * 获取任务详情
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
 * 新增任务
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
 * 更新任务
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
 * 删除任务
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
 * 分配任务
 */
export const assign = (taskId, assigneeId) => {
  return request({
    url: `${api}/assign`,
    method: 'post',
    data: { taskId, assigneeId },
    meta: { isToken: true }
  });
};

/**
 * 标记任务完成
 */
export const markComplete = taskId => {
  return request({
    url: `${api}/markComplete`,
    method: 'post',
    params: { taskId },
    meta: { isToken: true }
  });
};

/**
 * 获取任务状态统计
 */
export const getStatistics = () => {
  return request({
    url: `${api}/statistics`,
    method: 'get',
    meta: { isToken: true }
  });
};

/**
 * 获取我的任务
 */
export const getMyTasks = (current, size, params) => {
  return request({
    url: `${api}/myTasks`,
    method: 'get',
    params: { ...params, current, size },
    meta: { isToken: true }
  });
};

/**
 * 更新任务进度
 */
export const updateProgress = (taskId, progress) => {
  return request({
    url: `${api}/updateProgress`,
    method: 'post',
    data: { taskId, progress },
    meta: { isToken: true }
  });
};

/**
 * 获取任务列表（分页）- 新API
 */
export const getTaskPage = (data) => {
  return request({
    url: '/api/xinhui-oa-task/api/task/publish/v1/page',
    method: 'post',
    data,
    meta: { isToken: true }
  });
};

/**
 * 获取任务详情 - 新API
 */
export const getTaskDetail = (taskId) => {
  return request({
    url: `/api/xinhui-oa-task/api/task/publish/v1/detail/${taskId}`,
    method: 'get',
    meta: { isToken: true }
  });
};

/**
 * 获取待反馈任务列表（我参与的）
 */
export const getFeedbackTaskPage = (data) => {
  return request({
    url: '/api/xinhui-oa-task/api/task/participate/v1/page/feedback',
    method: 'post',
    data,
    meta: { isToken: true }
  });
};

/**
 * 获取已反馈任务列表（我参与的）
 */
export const getFeedbackDoneTaskPage = (data) => {
  return request({
    url: '/api/xinhui-oa-task/api/task/participate/v1/page/feedbackdone',
    method: 'post',
    data,
    meta: { isToken: true }
  });
};

/**
 * 获取部门列表
 */
export const getDepartmentList = (tenantId) => {
  return request({
    url: `/api/xinhui-oa-task/api/dept/${tenantId}/list`,
    method: 'get',
    meta: { isToken: true }
  });
};

/**
 * 获取部门人员列表
 */
export const getDepartmentUsers = (deptId) => {
  return request({
    url: `/api/xinhui-oa-task/api/dept/${deptId}/user/get`,
    method: 'get',
    meta: { isToken: true }
  });
};
