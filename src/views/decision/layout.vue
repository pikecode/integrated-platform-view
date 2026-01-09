<template>
  <div class="decision-layout">
    <!-- 左侧导航栏 -->
    <div class="decision-sidebar">
      <el-menu
        :default-active="activeMenu"
        class="sidebar-menu"
        @select="handleMenuSelect"
      >
        <!-- 首页 -->
        <el-menu-item index="/decision/index">
          <i class="el-icon-home"></i>
          <span>首页</span>
        </el-menu-item>

        <!-- 议题管理 -->
        <el-sub-menu index="topic">
          <template #title>
            <i class="el-icon-document-copy"></i>
            <span>议题管理</span>
          </template>
          <el-menu-item index="/decision/topic/my">
            <span>我发布的</span>
          </el-menu-item>
          <el-menu-item index="/decision/topic">
            <span>待我审批</span>
          </el-menu-item>
          <el-menu-item index="/decision/topic/schedule">
            <span>议程安排</span>
          </el-menu-item>
        </el-sub-menu>

        <!-- 任务管理 -->
        <el-sub-menu index="task">
          <template #title>
            <i class="el-icon-s-management"></i>
            <span>任务管理</span>
          </template>
          <el-menu-item index="/decision/task">
            <span>我发布的</span>
          </el-menu-item>
          <el-menu-item index="/decision/task/participate">
            <span>我参与的</span>
          </el-menu-item>
        </el-sub-menu>

        <!-- 数据看板 -->
        <el-menu-item index="/decision/dashboard">
          <i class="el-icon-data-analysis"></i>
          <span>数据看板</span>
        </el-menu-item>
      </el-menu>
    </div>

    <!-- 右侧主内容区 -->
    <div class="decision-main">
      <!-- 页面内容 -->
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  name: 'DecisionLayout',
  data() {
    return {
      activeMenu: '/decision/index',
      pageMap: {
        '/decision/index': '首页',
        '/decision/topic': '议题管理',
        '/decision/topic/my': '我发布的',
        '/decision/topic/schedule': '议程安排',
        '/decision/topic/create': '新建议题',
        '/decision/topic/detail': '议题详情',
        '/decision/topic/vote': '投票',
        '/decision/task': '任务管理',
        '/decision/task/participate': '我参与的',
        '/decision/task/create': '新建任务',
        '/decision/task/detail': '任务详情',
        '/decision/task/my-tasks': '我的任务',
        '/decision/dashboard': '数据看板'
      },
      breadcrumbs: []
    };
  },
  computed: {
    currentPageTitle() {
      const path = this.$route.path;
      // 获取基础路径或完整路径
      const matchedPath = Object.keys(this.pageMap).find(key => path.startsWith(key));
      return this.pageMap[matchedPath] || this.pageMap[path] || '议事决策';
    }
  },
  watch: {
    '$route.path': function(newPath) {
      // 详情页面不高亮导航菜单
      if (newPath.includes('/detail/')) {
        this.activeMenu = '';
        return;
      }

      // 根据路由更新菜单选中状态
      if (this.pageMap[newPath]) {
        this.activeMenu = newPath;
      } else {
        // 尝试匹配父级路径
        const basePath = newPath.split('/').slice(0, 3).join('/');
        if (this.pageMap[basePath]) {
          this.activeMenu = basePath;
        }
      }
    }
  },
  mounted() {
    // 初始化菜单选中状态
    const path = this.$route.path;

    // 详情页面不高亮导航菜单
    if (path.includes('/detail/')) {
      this.activeMenu = '';
      return;
    }

    if (this.pageMap[path]) {
      this.activeMenu = path;
    } else {
      // 尝试匹配父级路径
      const basePath = path.split('/').slice(0, 3).join('/');
      if (this.pageMap[basePath]) {
        this.activeMenu = basePath;
      }
    }
  },
  methods: {
    handleMenuSelect(index) {
      // 移除查询参数后的路径
      const basePath = index.split('?')[0];
      this.$router.push(index);
    },
    handleRefresh() {
      this.$message.success('已刷新');
      // 可以在这里添加刷新逻辑
      this.$router.go(0);
    }
  }
};
</script>

<style scoped lang="scss">
.decision-layout {
  display: flex;
  height: calc(100vh - 100px); // 减去顶部导航栏高度
  background: #f0f2f5;

  .decision-sidebar {
    width: 220px;
    background: #fff;
    border-right: 1px solid #e8eaed;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.08);

    .sidebar-header {
      padding: 20px 16px;
      border-bottom: 1px solid #e8eaed;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;

      h2 {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
      }
    }

    .sidebar-menu {
      flex: 1;
      border: none;
      padding: 0;

      ::v-deep .el-menu-item {
        padding: 0 !important;
        padding-left: 20px !important;
        height: 36px;
        line-height: 36px;
        color: #606266;
        font-size: 13px;
        border-left: 3px solid transparent;
        transition: all 0.3s;
        background-color: transparent !important;

        &:hover {
          background-color: #f5f7fa !important;
          color: #667eea;
        }

        &.is-active {
          color: #667eea;
          background-color: #f0f4ff !important;
          border-left-color: #667eea;
        }

        i {
          margin-right: 10px;
          font-size: 16px;
          width: auto;
          display: inline-block;
        }

        span {
          vertical-align: middle;
        }
      }

      ::v-deep .el-sub-menu__title {
        padding: 0 !important;
        padding-left: 20px !important;
        height: 36px;
        line-height: 36px;
        color: #606266;
        font-size: 13px;
        border-left: 3px solid transparent;
        background-color: transparent !important;

        &:hover {
          background-color: #f5f7fa !important;
          color: #667eea;
        }

        i {
          margin-right: 10px;
          font-size: 16px;
          width: auto;
          display: inline-block;
        }

        span {
          vertical-align: middle;
        }
      }

      ::v-deep .el-sub-menu.is-active > .el-sub-menu__title {
        color: #667eea !important;
        border-left-color: #667eea;
        background-color: transparent !important;
      }

      ::v-deep .el-menu--inline {
        background-color: #fafbfc;

        .el-menu-item {
          padding-left: 40px !important;
          background-color: transparent !important;

          &:hover {
            background-color: #f0f4ff !important;
          }

          &.is-active {
            background-color: #f0f4ff !important;
          }
        }
      }
    }
  }

  .decision-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    .decision-header {
      height: 60px;
      background: white;
      border-bottom: 1px solid #e8eaed;
      padding: 0 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);

      .header-left {
        display: flex;
        align-items: center;
        font-size: 14px;

        .breadcrumb {
          color: #909399;
          font-weight: 600;
        }

        .separator {
          margin: 0 8px;
          color: #bfbfbf;
        }

        .current-page {
          color: #606266;
          font-weight: 600;
        }
      }

      .header-right {
        .el-button {
          padding: 6px 16px;
        }
      }
    }

    .decision-content {
      flex: 1;
      overflow: auto;
      padding: 24px;

      // 美化滚动条
      &::-webkit-scrollbar {
        width: 8px;
      }

      &::-webkit-scrollbar-track {
        background: transparent;
      }

      &::-webkit-scrollbar-thumb {
        background: #ccc;
        border-radius: 4px;

        &:hover {
          background: #999;
        }
      }
    }
  }
}

// 响应式布局
@media (max-width: 1024px) {
  .decision-layout {
    .decision-sidebar {
      width: 180px;

      .sidebar-menu ::v-deep .el-menu-item,
      .sidebar-menu ::v-deep .el-sub-menu__title {
        padding: 0 16px;
      }
    }
  }
}

@media (max-width: 768px) {
  .decision-layout {
    flex-direction: column;

    .decision-sidebar {
      width: 100%;
      height: auto;
      border-right: none;
      border-bottom: 1px solid #e8eaed;
    }

    .decision-main {
      .decision-header {
        padding: 0 16px;
      }

      .decision-content {
        padding: 16px;
      }
    }
  }
}
</style>
