<template>
  <el-dialog
    title="转办"
    v-model="visible"
    width="600px"
    @close="handleClose"
  >
    <div class="transfer-dialog-content">
      <!-- 转办原因 -->
      <div class="form-item">
        <label class="form-label">转办原因：</label>
        <el-input
          v-model="form.transferReason"
          type="textarea"
          rows="4"
          placeholder="请输入转办原因"
          maxlength="200"
          show-word-limit
        />
      </div>

      <!-- 目标执行人 -->
      <div class="form-item">
        <label class="form-label">转办给：</label>
        <el-button type="primary" @click="handleSelectPerson">
          选择人员
        </el-button>
        <div v-if="selectedPersons.length > 0" class="person-list">
          <div
            v-for="(person, index) in selectedPersons"
            :key="`person-${index}`"
            class="person-item"
          >
            <span class="item-text">
              {{ person.deptName }}：{{ person.name }}
            </span>
            <div class="item-actions">
              <el-link type="danger" :underline="false" @click="handleRemovePerson(index)">
                删除
              </el-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <el-button type="primary" @click="handleSubmit">确定转办</el-button>
      <el-button @click="handleClose">取消</el-button>
    </template>

    <!-- 选择人员对话框 -->
    <select-person-dialog
      v-model="showSelectPersonDialog"
      :title="'选择人员'"
      :selected="selectedPersons"
      @confirm="handlePersonDialogConfirm"
    />
  </el-dialog>
</template>

<script>
import SelectPersonDialog from './select-person-dialog.vue';

export default {
  name: 'TransferDialog',
  components: {
    SelectPersonDialog
  },
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    taskData: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      form: {
        transferReason: ''
      },
      selectedPersons: [],
      showSelectPersonDialog: false
    };
  },
  computed: {
    visible: {
      get() {
        return this.modelValue;
      },
      set(val) {
        this.$emit('update:modelValue', val);
      }
    }
  },
  methods: {
    handleSelectPerson() {
      this.showSelectPersonDialog = true;
    },

    handlePersonDialogConfirm(persons) {
      this.selectedPersons = persons;
    },

    handleRemovePerson(index) {
      this.selectedPersons.splice(index, 1);
    },

    handleSubmit() {
      if (!this.form.transferReason.trim()) {
        this.$message.warning('请输入转办原因');
        return;
      }

      if (this.selectedPersons.length === 0) {
        this.$message.warning('请选择转办人员');
        return;
      }

      const transferData = {
        taskId: this.taskData.id,
        targetUserList: this.selectedPersons.map(person => ({
          userId: String(person.id),
          userName: person.name || person.realName,
          deptId: String(person.deptId),
          deptName: person.deptName
        })),
        transferReason: this.form.transferReason
      };

      this.$emit('submit', transferData);
      this.handleClose();
    },

    handleClose() {
      this.form.transferReason = '';
      this.selectedPersons = [];
      this.visible = false;
    }
  }
};
</script>

<style scoped lang="scss">
.transfer-dialog-content {
  .form-item {
    margin-bottom: 20px;

    .form-label {
      display: block;
      font-size: 14px;
      font-weight: 500;
      color: #333;
      margin-bottom: 8px;
    }

    .person-list {
      margin-top: 12px;
      border: 1px solid #ebeef5;
      border-radius: 4px;
      padding: 8px;
      background: #fafafa;

      .person-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 12px;
        border-bottom: 1px solid #ebeef5;

        &:last-child {
          border-bottom: none;
        }

        .item-text {
          flex: 1;
          font-size: 14px;
          color: #333;
        }

        .item-actions {
          .el-link {
            padding: 0;
            margin: 0;
          }
        }
      }
    }
  }
}
</style>
