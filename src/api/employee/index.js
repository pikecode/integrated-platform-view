import request from '@/axios';

const api = '/blade-employee';

/**
 * 获取员工列表
 * @param {number} current 当前页
 * @param {number} size 页面大小
 * @param {object} params 查询参数
 */
export const getList = (current, size, params = {}) => {
  return request({
    url: `${api}/list`,
    method: 'get',
    params: {
      current,
      size,
      ...params,
    },
    meta: {
      isToken: true,  // ← 开发阶段：跳过 token 验证
    },
  });
};

/**
 * 获取员工详情
 * @param {string} id 员工ID
 */
export const getDetail = (id) => {
  return request({
    url: `${api}/detail`,
    method: 'get',
    params: { id },
    meta: {
      isToken: true,  // ← 开发阶段：跳过 token 验证
    },
  });
};

/**
 * 新增员工
 * @param {object} row 员工数据
 */
export const add = (row) => {
  return request({
    url: `${api}/submit`,
    method: 'post',
    data: row,
    meta: {
      isToken: true,  // ← 开发阶段：跳过 token 验证
    },
  });
};

/**
 * 更新员工
 * @param {object} row 员工数据
 */
export const update = (row) => {
  return request({
    url: `${api}/update`,
    method: 'post',
    data: row,
    meta: {
      isToken: true,  // ← 开发阶段：跳过 token 验证
    },
  });
};

/**
 * 删除员工
 * @param {string|array} ids 员工ID或ID数组
 */
export const remove = (ids) => {
  return request({
    url: `${api}/remove`,
    method: 'post',
    params: { ids: Array.isArray(ids) ? ids.join(',') : ids },
    meta: {
      isToken: true,  // ← 开发阶段：跳过 token 验证
    },
  });
};

/**
 * 批量导入员工
 * @param {FormData} data 包含文件的表单数据
 */
export const importEmployee = (data) => {
  return request({
    url: `${api}/import`,
    method: 'post',
    data,
    meta: {
      isToken: true,  // ← 开发阶段：跳过 token 验证
    },
  });
};

/**
 * 导出员工数据
 * @param {object} params 查询参数
 */
export const exportEmployee = (params = {}) => {
  return request({
    url: `${api}/export`,
    method: 'get',
    params,
    responseType: 'blob',
    meta: {
      isToken: true,  // ← 开发阶段：跳过 token 验证
    },
  });
};
