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
        // 先尝试精确匹配
        if (this.pathMap[newPath]) {
          this.activeMenu = newPath;
          return;
        }

        // 按路径长度排序（从长到短），避免短路径先匹配
        const sortedPaths = Object.keys(this.pathMap).sort((a, b) => b.length - a.length);
        const matchedPath = sortedPaths.find(key => newPath.startsWith(key + '/'));

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
