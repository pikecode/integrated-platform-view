<template>
  <div class="pending-items">
    <div class="header">
      <div class="title-group">
        <h3>{{ title }}</h3>
        <div class="badges">
          <el-tag
            v-for="badge in badges"
            :key="badge.label"
            :type="badge.type"
            size="small"
          >
            {{ badge.label }}
            <span v-if="badge.count" class="badge-count">{{ badge.count }}</span>
          </el-tag>
        </div>
      </div>
      <el-link type="primary" @click="handleViewAll">全部></el-link>
    </div>

    <el-table
      :data="displayData"
      :height="tableHeight"
      style="width: 100%"
    >
      <el-table-column
        v-for="column in columns"
        :key="column.prop"
        :prop="column.prop"
        :label="column.label"
        :width="column.width"
      >
        <template #default="{ row }">
          <el-link
            v-if="column.isLink"
            type="primary"
            @click="handleItemClick(row)"
          >
            {{ row[column.prop] }}
          </el-link>
          <span v-else>{{ row[column.prop] }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-link type="primary" @click="handleAction(row)">
            {{ actionLabel }}
          </el-link>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'PendingItems',
  props: {
    title: {
      type: String,
      required: true
    },
    badges: {
      type: Array,
      required: true
    },
    data: {
      type: Array,
      required: true
    },
    columns: {
      type: Array,
      required: true
    },
    actionLabel: {
      type: String,
      default: '去审批'
    },
    tableHeight: {
      type: String,
      default: '300px'
    }
  },
  computed: {
    displayData() {
      return this.data || [];
    }
  },
  methods: {
    handleViewAll() {
      this.$emit('view-all');
    },
    handleItemClick(row) {
      this.$emit('item-click', row);
    },
    handleAction(row) {
      this.$emit('action', row);
    }
  }
};
</script>

<style scoped lang="scss">
.pending-items {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;

    .title-group {
      display: flex;
      align-items: center;
      gap: 15px;

      h3 {
        margin: 0;
        font-size: 16px;
        font-weight: 500;
      }

      .badges {
        display: flex;
        gap: 8px;

        ::v-deep .el-tag {
          .badge-count {
            margin-left: 3px;
          }
        }
      }
    }
  }
}
</style>
