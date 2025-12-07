<template>
  <div class="decision-wrapper">
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
    <div class="decision-content">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  name: 'DecisionWrapper',
  data() {
    return {
      activeMenu: '/decision/index',
      pathMap: {
        '/decision/index': '/decision/index',
        '/decision/topic': '/decision/topic',
        '/decision/topic/my': '/decision/topic/my',
        '/decision/topic/schedule': '/decision/topic/schedule',
        '/decision/task': '/decision/task',
        '/decision/task/participate': '/decision/task/participate',
        '/decision/dashboard': '/decision/dashboard'
      }
    };
  },
  watch: {
    '$route.path': {
      handler(newPath) {
        // 根据路由更新菜单选中状态
        const matchedPath = Object.keys(this.pathMap).find(key => newPath === key || newPath.startsWith(key + '/'));
        if (matchedPath) {
          this.activeMenu = matchedPath;
        }
      },
      immediate: true
    }
  },
  methods: {
    handleMenuSelect(index) {
      this.$router.push(index);
    }
  }
};
</script>

<style scoped lang="scss">
.decision-wrapper {
  display: flex;
  height: 100%;
  background: #f0f2f5;

  .decision-sidebar {
    width: 220px;
    background: #fff;
    border-right: 1px solid #e8eaed;
    overflow-y: auto;
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.08);

    .sidebar-menu {
      border: none;
      padding: 12px 0;

      ::v-deep .el-menu-item {
        padding: 0 0 0 20px;
        height: 40px;
        line-height: 40px;
        color: #606266;
        font-size: 14px;
        border-left: 3px solid transparent;
        transition: all 0.3s;

        &:hover {
          background-color: #f5f7fa;
          color: #667eea;
        }

        &.is-active {
          color: #667eea;
          background-color: #f0f4ff;
          border-left-color: #667eea;
        }

        i {
          margin-right: 8px;
          font-size: 16px;
        }
      }

      ::v-deep .el-sub-menu__title {
        padding: 0 0 0 20px;
        height: 40px;
        line-height: 40px;
        color: #606266;
        font-size: 14px;
        border-left: 3px solid transparent;

        &:hover {
          background-color: #f5f7fa;
          color: #667eea;
        }

        i {
          margin-right: 8px;
          font-size: 16px;
        }
      }

      ::v-deep .el-sub-menu.is-active > .el-sub-menu__title {
        color: #667eea !important;
        border-left-color: #667eea;
      }
    }
  }

  .decision-content {
    flex: 1;
    overflow: auto;
    padding: 24px;
    background: #f0f2f5;

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

@media (max-width: 768px) {
  .decision-wrapper {
    flex-direction: column;

    .decision-sidebar {
      width: 100%;
      height: auto;
      border-right: none;
      border-bottom: 1px solid #e8eaed;

      .sidebar-menu {
        display: flex;
        flex-wrap: wrap;

        ::v-deep .el-menu-item,
        ::v-deep .el-sub-menu {
          flex: 1;
          min-width: 100px;
        }
      }
    }

    .decision-content {
      padding: 16px;
    }
  }
}
</style>
