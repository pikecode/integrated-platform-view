<template>
  <div class="breadcrumb-nav">
    <span class="breadcrumb-item" @click="handleNavigate('/decision/index')">
      议事决策
    </span>
    <span class="separator">/</span>
    <template v-for="(item, index) in breadcrumbs" :key="`breadcrumb-${index}`">
      <span
        class="breadcrumb-item"
        :class="{ active: index === breadcrumbs.length - 1 }"
        @click="handleItemClick(index)"
      >
        {{ item }}
      </span>
      <span
        v-if="index < breadcrumbs.length - 1"
        class="separator"
      >
        /
      </span>
    </template>
  </div>
</template>

<script>
export default {
  name: 'DecisionBreadcrumb',
  props: {
    breadcrumbs: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    handleNavigate(path) {
      if (this.$route.path !== path) {
        this.$router.push(path);
      }
    },
    handleItemClick(index) {
      // 最后一项不可点击
      if (index === this.breadcrumbs.length - 1) {
        return;
      }

      // 根据面包屑项目名称导航到相应的路由
      const item = this.breadcrumbs[index];
      const routeMap = {
        '议题管理': '/decision/topic',
        '任务管理': '/decision/task',
        '数据看板': '/decision/dashboard',
        '首页': '/decision/index',
        '待我审批': '/decision/topic',
        '已审批': '/decision/topic',
        '我发布的': '/decision/task', // 任务的我发布的
        '我参与的': '/decision/task/participate',
        '议程安排': '/decision/topic/schedule'
      };

      const path = routeMap[item];
      if (path) {
        this.handleNavigate(path);
      }
    }
  }
};
</script>

<style scoped lang="scss">
.breadcrumb-nav {
  margin-bottom: 20px;
  font-size: 14px;
  color: #606266;

  .breadcrumb-item {
    cursor: pointer;
    transition: color 0.3s;

    &:hover:not(.active) {
      color: #409eff;
    }

    &.active {
      color: #303133;
      font-weight: 600;
      cursor: default;

      &:hover {
        color: #303133;
      }
    }
  }

  .separator {
    margin: 0 8px;
    color: #bfbfbf;
  }
}
</style>
