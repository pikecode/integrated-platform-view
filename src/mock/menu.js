/**
 * Mock菜单数据
 * 用于开发模式绕过后端
 */

// 顶部菜单
export const mockTopMenu = [
  {
    id: '1',
    code: 'desk',
    name: '工作台',
    alias: 'menu',
    path: '/wel/index',
    source: 'icon-caidan',
    sort: 1,
    category: 1,
    isOpen: 1,
  },
  {
    id: '2',
    code: 'system',
    name: '系统管理',
    alias: 'menu',
    path: '/system',
    source: 'icon-xitong',
    sort: 2,
    category: 1,
    isOpen: 1,
  },
];

// 路由菜单
export const mockRoutes = [
  {
    id: '1',
    parentId: '0',
    code: 'desk',
    name: '工作台',
    alias: 'menu',
    path: '/wel',
    source: 'icon-caidan',
    sort: 1,
    category: 1,
    action: 0,
    isOpen: 1,
    children: [
      {
        id: '1-1',
        parentId: '1',
        code: 'wel_index',
        name: '首页',
        alias: 'menu',
        path: '/wel/index',
        source: 'icon-shouye',
        sort: 1,
        category: 1,
        action: 0,
        isOpen: 1,
      },
    ],
  },
  {
    id: '2',
    parentId: '0',
    code: 'system',
    name: '系统管理',
    alias: 'menu',
    path: '/system',
    source: 'icon-xitong',
    sort: 2,
    category: 1,
    action: 0,
    isOpen: 1,
    children: [
      {
        id: '2-1',
        parentId: '2',
        code: 'user',
        name: '用户管理',
        alias: 'menu',
        path: '/system/user',
        source: 'icon-yonghu',
        sort: 1,
        category: 1,
        action: 0,
        isOpen: 1,
      },
      {
        id: '2-2',
        parentId: '2',
        code: 'dept',
        name: '部门管理',
        alias: 'menu',
        path: '/system/dept',
        source: 'icon-bumen',
        sort: 2,
        category: 1,
        action: 0,
        isOpen: 1,
      },
      {
        id: '2-3',
        parentId: '2',
        code: 'role',
        name: '角色管理',
        alias: 'menu',
        path: '/authority/role',
        source: 'icon-jiaose',
        sort: 3,
        category: 1,
        action: 0,
        isOpen: 1,
      },
      {
        id: '2-4',
        parentId: '2',
        code: 'menu',
        name: '菜单管理',
        alias: 'menu',
        path: '/system/menu',
        source: 'icon-caidan',
        sort: 4,
        category: 1,
        action: 0,
        isOpen: 1,
      },
    ],
  },
];

// 按钮权限
export const mockButtons = [
  {
    code: 'user_view',
    name: '查看',
  },
  {
    code: 'user_add',
    name: '新增',
  },
  {
    code: 'user_edit',
    name: '编辑',
  },
  {
    code: 'user_delete',
    name: '删除',
  },
  {
    code: 'user_role',
    name: '角色配置',
  },
  {
    code: 'user_reset',
    name: '密码重置',
  },
];
