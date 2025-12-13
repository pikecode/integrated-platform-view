<template>
  <div class="quick-entry">
    <h3>快速入口：</h3>
    <div class="entry-buttons">
      <!-- 议题新增 -->
      <div class="entry-item" @click="handleTopicCreate">
        <div class="icon-wrapper">
          <i class="el-icon-message"></i>
        </div>
        <span>议题新增</span>
      </div>

      <!-- 任务新增（带提示框） -->
      <div class="entry-item" @click="handleTaskCreate">
        <div class="icon-wrapper">
          <i class="el-icon-message"></i>
        </div>
        <span>任务新增</span>
        <div class="tooltip">
          点击任务新增跳转到任务管理-我发布的，直接提出任务新增弹窗
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'QuickEntry',
  methods: {
    handleTopicCreate() {
      this.$emit('topic-create');
    },
    handleTaskCreate() {
      this.$emit('task-create');
    }
  }
};
</script>

<style scoped lang="scss">
.quick-entry {
  margin-bottom: 30px;

  h3 {
    margin: 0 0 15px 0;
    font-size: 16px;
    font-weight: 500;
  }

  .entry-buttons {
    display: flex;
    gap: 20px;

    .entry-item {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      cursor: pointer;

      .icon-wrapper {
        width: 80px;
        height: 80px;
        background: #f0f0f0;
        border: 2px solid #ddd;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s;

        i {
          font-size: 36px;
          color: #666;
        }
      }

      &:hover .icon-wrapper {
        border-color: #409eff;
        background: #ecf5ff;

        i {
          color: #409eff;
        }
      }

      .tooltip {
        position: absolute;
        top: -10px;
        right: -120px;
        background: #fce4ec;
        border-left: 3px solid #e91e63;
        padding: 10px 15px;
        border-radius: 4px;
        width: 200px;
        font-size: 12px;
        color: #d81b60;
        line-height: 1.5;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        z-index: 10;
      }
    }
  }
}
</style>
