/**
 * 静态菜单配置 (用于开发和无后端菜单的情况)
 * 在后端菜单 API 不可用时使用
 */

// 系统全局菜单（不属于任何特定模块）
export const globalMenus = [
  {
    id: 'wel',
    name: '首页',
    path: '/wel/index',
    icon: 'el-icon-s-home',
    children: []
  }
];

// 决策模块的独立菜单
export const decisionMenus = [
  {
    id: 'decision-index',
    name: '首页',
    path: '/decision/index',
    icon: 'el-icon-home',
    children: []
  },
  {
    id: 'decision-topic',
    name: '议题管理',
    path: '/decision/topic',
    icon: 'el-icon-document-copy',
    children: [
      {
        id: 'decision-topic-list',
        name: '议题列表',
        path: '/decision/topic',
        children: []
      },
      {
        id: 'decision-topic-my',
        name: '我发布的',
        path: '/decision/topic?filter=my',
        children: []
      },
      {
        id: 'decision-topic-pending',
        name: '待我审批',
        path: '/decision/topic?filter=pending',
        children: []
      }
    ]
  },
  {
    id: 'decision-task',
    name: '任务管理',
    path: '/decision/task',
    icon: 'el-icon-s-management',
    children: [
      {
        id: 'decision-task-list',
        name: '任务列表',
        path: '/decision/task',
        children: []
      },
      {
        id: 'decision-task-my',
        name: '我发布的',
        path: '/decision/task?filter=my',
        children: []
      },
      {
        id: 'decision-task-participate',
        name: '我参与的',
        path: '/decision/task?filter=participate',
        children: []
      }
    ]
  },
  {
    id: 'decision-dashboard',
    name: '数据看板',
    path: '/decision/dashboard',
    icon: 'el-icon-data-analysis',
    children: []
  }
];

// 员工管理模块的独立菜单
export const employeeMenus = [
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
];

// 默认的全局静态菜单
export const staticMenus = [
  ...globalMenus,
  {
    id: 'decision',
    name: '议事决策',
    path: '/decision',
    icon: 'el-icon-document',
    children: decisionMenus
  },
  {
    id: 'employee',
    name: '员工管理',
    path: '/employee',
    icon: 'el-icon-user',
    children: employeeMenus
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
