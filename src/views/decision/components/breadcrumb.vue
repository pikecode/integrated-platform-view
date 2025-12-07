<template>
  <div class="breadcrumb-nav">
    <span class="breadcrumb-item">议事决策</span>
    <span class="separator">/</span>
    <template v-for="(item, index) in breadcrumbs" :key="`breadcrumb-${index}`">
      <span
        class="breadcrumb-item"
        :class="{ active: index === breadcrumbs.length - 1 }"
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
  }
};
</script>

<style scoped lang="scss">
.breadcrumb-nav {
  margin-bottom: 20px;
  font-size: 14px;
  color: #606266;

  .breadcrumb-item {
    &.active {
      color: #303133;
      font-weight: 600;
    }
  }

  .separator {
    margin: 0 8px;
    color: #bfbfbf;
  }
}
</style>
