/**
 * 静态菜单配置 (用于开发和无后端菜单的情况)
 * 在后端菜单 API 不可用时使用
 */

export const staticMenus = [
  {
    id: 'wel',
    name: '首页',
    path: '/wel/index',
    icon: 'el-icon-s-home',
    children: []
  },
  {
    id: 'decision',
    name: '议事决策',
    path: '/decision',
    icon: 'el-icon-document',
    children: [
      {
        id: 'decision-index',
        name: '议事决策',
        path: '/decision/index',
        icon: 'el-icon-home',
        children: []
      },
      {
        id: 'decision-topic',
        name: '议题管理',
        path: '/decision/topic',
        icon: 'el-icon-document-copy',
        children: []
      },
      {
        id: 'decision-task',
        name: '任务管理',
        path: '/decision/task',
        icon: 'el-icon-s-management',
        children: []
      },
      {
        id: 'decision-my-tasks',
        name: '我的任务',
        path: '/decision/task/my-tasks',
        icon: 'el-icon-document-copy',
        children: []
      }
    ]
  },
  {
    id: 'employee',
    name: '员工管理',
    path: '/employee',
    icon: 'el-icon-user',
    children: [
      {
        id: 'employee-index',
        name: '首页',
        path: '/employee/index',
        icon: 'el-icon-home',
        children: []
      },
      {
        id: 'employee-list',
        name: '员工列表',
        path: '/employee/list',
        icon: 'el-icon-document-copy',
        children: []
      }
    ]
  }
];

/**
 * 根据路由配置生成菜单树
 * @param {Array} routes - 路由配置数组
 * @returns {Array} 菜单树
 */
export function generateMenuFromRoutes(routes) {
  return routes
    .filter(route => {
      // 过滤掉不显示在菜单中的路由
      return route.meta && route.meta.title && route.meta.menu !== false;
    })
    .map(route => ({
      id: route.path,
      name: route.meta.title || route.name,
      path: route.path,
      icon: route.meta.icon || 'el-icon-folder',
      children: route.children
        ? route.children
            .filter(child => child.meta && child.meta.title && child.meta.menu !== false)
            .map(child => ({
              id: child.path,
              name: child.meta.title || child.name,
              path: child.path,
              icon: child.meta.icon || 'el-icon-document',
              children: []
            }))
        : []
    }));
}

export default staticMenus;
