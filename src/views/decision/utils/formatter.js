/**
 * 议事决策模块 - 数据格式化工具
 */

import dayjs from 'dayjs';

/**
 * 格式化时间
 */
export const formatTime = (time) => {
  if (!time) return '--';
  return dayjs(time).format('YYYY-MM-DD HH:mm');
};

/**
 * 格式化日期
 */
export const formatDate = (date) => {
  if (!date) return '--';
  return dayjs(date).format('YYYY-MM-DD');
};

/**
 * 获取相对时间（如 "2小时前"）
 */
export const getRelativeTime = (time) => {
  if (!time) return '--';
  return dayjs(time).fromNow();
};

/**
 * 获取议题状态的显示标签
 */
export const getTopicStatusLabel = (status) => {
  const statusMap = {
    draft: '草稿',
    active: '进行中',
    voting: '投票中',
    ended: '已结束',
    archived: '已存档'
  };
  return statusMap[status] || '未知状态';
};

/**
 * 获取任务状态的显示标签
 */
export const getTaskStatusLabel = (status) => {
  const statusMap = {
    pending: '待处理',
    assigned: '已分配',
    in_progress: '进行中',
    completed: '已完成',
    overdue: '逾期'
  };
  return statusMap[status] || '未知状态';
};

/**
 * 获取优先级标签
 */
export const getPriorityLabel = (priority) => {
  const priorityMap = {
    high: '高',
    medium: '中',
    low: '低'
  };
  return priorityMap[priority] || '中';
};

/**
 * 计算投票百分比
 */
export const calculateVotePercentage = (agreeCount, totalCount) => {
  if (totalCount === 0) return 0;
  return Math.round((agreeCount / totalCount) * 100);
};

/**
 * 判断任务是否逾期
 */
export const isOverdue = (dueDate) => {
  if (!dueDate) return false;
  return dayjs(dueDate).isBefore(dayjs());
};

/**
 * 获取距离截止日期的天数
 */
export const getDaysUntilDue = (dueDate) => {
  if (!dueDate) return null;
  const diff = dayjs(dueDate).diff(dayjs(), 'day');
  return diff;
};

/**
 * 判断任务是否即将逾期（3天内）
 */
export const isAboutToOverdue = (dueDate) => {
  const daysLeft = getDaysUntilDue(dueDate);
  return daysLeft !== null && daysLeft >= 0 && daysLeft <= 3;
};
