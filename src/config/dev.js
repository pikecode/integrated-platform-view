/**
 * 开发模式配置
 * 用于绕过登录，直接进入系统
 */

export default {
  // 是否启用开发模式（绕过登录）
  mockMode: true,

  // Mock 用户信息
  mockUser: {
    user_id: '1123598821738675201',
    user_name: 'admin',
    real_name: '管理员',
    avatar: '/img/bg/img-logo.png',
    authority: 'administrator,admin',
    role_name: 'administrator,admin',
    role_id: '1123598816738675201',
    dept_id: '1123598813738675201',
    tenant_id: '000000',
    account: 'admin',
    expires_in: 3600,
    license: 'powered by bladex',
  },

  // Mock Token
  mockToken: 'mock-dev-token-' + Date.now(),
  mockRefreshToken: 'mock-dev-refresh-token-' + Date.now(),

  // Mock 租户ID
  mockTenantId: '000000',
};
