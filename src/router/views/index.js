import Layout from '@/page/index/index.vue';
import Store from '@/store/';

export default [
  {
    path: '/wel',
    component: () =>
      Store.getters.isMacOs ? import('@/mac/index.vue') : import('@/page/index/index.vue'),
    redirect: '/wel/index',
    children: [
      {
        path: 'index',
        name: '首页',
        meta: {
          i18n: 'dashboard',
        },
        component: () => import(/* webpackChunkName: "views" */ '@/views/wel/index.vue'),
      },
      {
        path: 'dashboard',
        name: '控制台',
        meta: {
          i18n: 'dashboard',
          menu: false,
        },
        component: () => import(/* webpackChunkName: "views" */ '@/views/wel/dashboard.vue'),
      },
    ],
  },
  {
    path: '/test',
    component: Layout,
    redirect: '/test/index',
    children: [
      {
        path: 'index',
        name: '测试页',
        meta: {
          i18n: 'test',
        },
        component: () => import(/* webpackChunkName: "views" */ '@/views/util/test.vue'),
      },
    ],
  },
  {
    path: '/dict-horizontal',
    component: Layout,
    redirect: '/dict-horizontal/index',
    children: [
      {
        path: 'index',
        name: '字典管理',
        meta: {
          i18n: 'dict',
        },
        component: () =>
          import(/* webpackChunkName: "views" */ '@/views/util/demo/dict-horizontal.vue'),
      },
    ],
  },
  {
    path: '/dict-vertical',
    component: Layout,
    redirect: '/dict-vertical/index',
    children: [
      {
        path: 'index',
        name: '字典管理',
        meta: {
          i18n: 'dict',
        },
        component: () =>
          import(/* webpackChunkName: "views" */ '@/views/util/demo/dict-vertical.vue'),
      },
    ],
  },
  {
    path: '/info',
    component: Layout,
    redirect: '/info/index',
    children: [
      {
        path: 'index',
        name: '个人信息',
        meta: {
          i18n: 'info',
        },
        component: () => import(/* webpackChunkName: "views" */ '@/views/system/userinfo.vue'),
      },
    ],
  },
  {
    path: '/work/process/leave',
    component: Layout,
    redirect: '/work/process/leave/form',
    children: [
      {
        path: 'form/:processDefinitionId',
        name: '请假流程',
        meta: {
          i18n: 'work',
        },
        component: () =>
          import(/* webpackChunkName: "views" */ '@/views/work/process/leave/form.vue'),
      },
      {
        path: 'handle/:taskId/:processInstanceId/:businessId',
        name: '处理请假流程',
        meta: {
          i18n: 'work',
        },
        component: () =>
          import(/* webpackChunkName: "views" */ '@/views/work/process/leave/handle.vue'),
      },
      {
        path: 'detail/:processInstanceId/:businessId',
        name: '请假流程详情',
        meta: {
          i18n: 'work',
        },
        component: () =>
          import(/* webpackChunkName: "views" */ '@/views/work/process/leave/detail.vue'),
      },
    ],
  },
  {
    path: '/workflow',
    component: Layout,
    children: [
      {
        path: 'design/process/:id',
        name: '模型设计2',
        component: () =>
          import( /* webpackChunkName: "views" */ '@/views/plugin/workflow/pages/design/index.vue'),
      },
      {
        path: 'design/model/history/:id',
        name: '模型历史',
        component: () =>
          import( /* webpackChunkName: "views" */ '@/views/plugin/workflow/pages/design/model-history.vue'),
      },
      {
        path: 'design/form/history/:id',
        name: '表单历史',
        component: () =>
          import( /* webpackChunkName: "views" */ '@/views/plugin/workflow/pages/design/form-history.vue'),
      },
      {
        path: 'process/start/:params',
        name: '新建流程2',
        component: () =>
          import( /* webpackChunkName: "views" */ '@/views/plugin/workflow/pages/process/form/start.vue'),
      },
      {
        path: 'process/detail/:params',
        name: '流程详情',
        component: () =>
          import( /* webpackChunkName: "views" */ '@/views/plugin/workflow/pages/process/form/detail.vue'),
      }
    ]
  },
  {
    path: '/xinhuimed',
    component: () =>
      Store.getters.isMacOs ? import('@/mac/index.vue') : import('@/page/index/index.vue'),
    redirect: '/xinhuimed/workbench/index',
    children: [
      {
        path: 'workbench/index',
        name: '工作台',
        meta: {
          i18n: 'workbench',
        },
        component: () => import(/* webpackChunkName: "workbench" */ '@/views/xinhuimed/workbench/index.vue'),
      },
      {
        path: 'process/index',
        name: '流程',
        meta: {
          i18n: 'process',
        },
        component: () => import(/* webpackChunkName: "process" */ '@/views/xinhuimed/process/index.vue'),
      },
      {
        path: 'application/index',
        name: '应用中心',
        meta: {
          i18n: 'application',
        },
        component: () => import(/* webpackChunkName: "application" */ '@/views/xinhuimed/application/index.vue'),
      },
    ],
  },
  {
    path: '/decision',
    component: Layout,
    redirect: '/decision/index',
    meta: {
      isAuth: false,
      title: '议事决策',
      icon: 'el-icon-document',
    },
    children: [
      {
        path: 'index',
        name: '议事决策',
        meta: {
          title: '议事决策',
          icon: 'el-icon-home',
          isAuth: false,
        },
        component: () => import(/* webpackChunkName: "decision" */ '@/views/decision/pages/index.vue'),
      },
      {
        path: 'topic',
        name: '议题管理',
        meta: {
          title: '议题管理',
          icon: 'el-icon-document-copy',
          isAuth: false,
        },
        component: () => import(/* webpackChunkName: "decision" */ '@/views/decision/pages/topic/index.vue'),
      },
      {
        path: 'topic/create',
        name: '新建议题',
        meta: {
          title: '新建议题',
          menu: false,
          isAuth: false,
        },
        component: () => import(/* webpackChunkName: "decision" */ '@/views/decision/pages/topic/index.vue'),
      },
      {
        path: 'topic/detail/:id',
        name: '议题详情',
        meta: {
          title: '议题详情',
          menu: false,
          isAuth: false,
        },
        component: () => import(/* webpackChunkName: "decision" */ '@/views/decision/pages/topic/index.vue'),
      },
      {
        path: 'topic/vote/:id',
        name: '投票',
        meta: {
          title: '投票',
          menu: false,
          isAuth: false,
        },
        component: () => import(/* webpackChunkName: "decision" */ '@/views/decision/pages/topic/index.vue'),
      },
      {
        path: 'task',
        name: '任务管理',
        meta: {
          title: '任务管理',
          icon: 'el-icon-s-management',
          isAuth: false,
        },
        component: () => import(/* webpackChunkName: "decision" */ '@/views/decision/pages/task/index.vue'),
      },
      {
        path: 'task/create',
        name: '新建任务',
        meta: {
          title: '新建任务',
          menu: false,
          isAuth: false,
        },
        component: () => import(/* webpackChunkName: "decision" */ '@/views/decision/pages/task/index.vue'),
      },
      {
        path: 'task/detail/:id',
        name: '任务详情',
        meta: {
          title: '任务详情',
          menu: false,
          isAuth: false,
        },
        component: () => import(/* webpackChunkName: "decision" */ '@/views/decision/pages/task/index.vue'),
      },
      {
        path: 'task/my-tasks',
        name: '我的任务',
        meta: {
          title: '我的任务',
          icon: 'el-icon-document-copy',
          isAuth: false,
        },
        component: () => import(/* webpackChunkName: "decision" */ '@/views/decision/pages/task/index.vue'),
      },
    ],
  },
  {
    path: '/employee',
    component: Layout,
    redirect: '/employee/index',
    meta: {
      isAuth: false,  // 开发阶段：暂不需要认证
    },
    children: [
      {
        path: 'index',
        name: '员工管理',
        meta: {
          i18n: 'employee',
          isAuth: false,  // 开发阶段：暂不需要认证
        },
        component: () => import(/* webpackChunkName: "employee" */ '@/views/employee/pages/index.vue'),
      },
      {
        path: 'list',
        name: '员工列表',
        meta: {
          i18n: 'employee',
          isAuth: false,
          menu: false,
        },
        component: () => import(/* webpackChunkName: "employee" */ '@/views/employee/pages/list.vue'),
      },
      {
        path: 'add',
        name: '新增员工',
        meta: {
          i18n: 'employee',
          isAuth: false,
          menu: false,
        },
        component: () => import(/* webpackChunkName: "employee" */ '@/views/employee/pages/form.vue'),
      },
      {
        path: 'edit/:id',
        name: '编辑员工',
        meta: {
          i18n: 'employee',
          isAuth: false,
          menu: false,
        },
        component: () => import(/* webpackChunkName: "employee" */ '@/views/employee/pages/form.vue'),
      },
    ],
  },
];
