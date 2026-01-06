<template>
  <el-dialog
    :title="title"
    :model-value="modelValue"
    @update:model-value="(val) => $emit('update:modelValue', val)"
    width="1000px"
    append-to-body
    class="select-person-dialog"
  >
    <div class="dialog-content">
      <!-- 左侧：部门树形列表 -->
      <div class="left-panel">
        <el-input
          v-model="deptSearchKeyword"
          placeholder="请输入部门名"
          prefix-icon="el-icon-search"
          clearable
          style="margin-bottom: 12px"
          :disabled="loading"
        />

        <div class="dept-list">
          <div v-if="loading" class="loading-state">
            <el-icon class="is-loading"><Loading /></el-icon>
            加载部门中...
          </div>
          <el-tree
            v-else
            :data="deptTreeData"
            :props="treeProps"
            :expand-on-click-node="true"
            node-key="id"
            :filter-node-method="filterNode"
            ref="deptTree"
            class="dept-tree"
            @node-click="handleSelectDept"
          >
            <template #default="{ node, data }">
              <span class="tree-node">{{ node.label }}</span>
            </template>
          </el-tree>
          <div v-if="!loading && deptTreeData.length === 0" class="empty-state">
            暂无部门
          </div>
        </div>
      </div>

      <!-- 中间：部门人员列表 -->
      <div class="middle-panel">
        <div v-if="selectedDeptId" class="dept-persons">
          <el-input
            v-model="personSearchKeyword"
            placeholder="请输入人员名"
            prefix-icon="el-icon-search"
            clearable
            style="margin-bottom: 12px"
            :disabled="personLoading"
          />

          <!-- 全选复选框 -->
          <el-checkbox
            v-model="selectAll"
            @change="handleSelectAll"
            style="margin-bottom: 12px; display: block"
            :disabled="personLoading"
          >
            全选
          </el-checkbox>

          <!-- 人员列表 -->
          <div class="person-list">
            <div v-if="personLoading" class="loading-state">
              <el-icon class="is-loading"><Loading /></el-icon>
              加载人员中...
            </div>
            <div
              v-for="person in filteredPersons"
              v-else
              :key="person.id"
              class="person-item"
            >
              <el-checkbox
                v-model="person.checked"
                @change="handlePersonChange"
              >
                {{ person.name }}
              </el-checkbox>
            </div>
            <div v-if="!personLoading && filteredPersons.length === 0" class="empty-state">
              暂无人员
            </div>
          </div>
        </div>

        <div v-else class="no-dept-selected">
          请在左侧选择部门
        </div>
      </div>

      <!-- 右侧：已选择列表 -->
      <div class="right-panel">
        <div class="selected-header">已选择 ({{ selectedPersons.length }}/50)</div>
        <div class="selected-list">
          <el-tag
            v-for="person in selectedPersons"
            :key="`${person.deptId}-${person.id}`"
            closable
            @close="handleRemovePerson(person)"
            style="margin: 4px"
          >
            {{ person.deptName }}-{{ person.name }}
          </el-tag>
          <div v-if="selectedPersons.length === 0" class="empty-state">
            暂无选择
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleConfirm">确定</el-button>
    </template>
  </el-dialog>
</template>

<script>
import * as taskApi from '@/api/decision/task';

export default {
  name: 'SelectPersonDialog',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    selected: {
      type: Array,
      default: () => []
    },
    title: {
      type: String,
      default: '选择科室及人员'
    }
  },
  emits: ['update:modelValue', 'confirm'],
  data() {
    return {
      deptSearchKeyword: '',
      personSearchKeyword: '',
      selectedDeptId: null,
      selectedDept: null,
      selectAll: false,
      selectedPersons: [],
      deptTreeData: [],
      deptPersons: {},
      loading: false,
      personLoading: false,
      treeProps: {
        children: 'children',
        label: 'deptName'
      }
    };
  },
  computed: {
    currentDeptPersons() {
      if (!this.selectedDeptId) {
        return [];
      }
      return this.deptPersons[this.selectedDeptId] || [];
    },

    filteredPersons() {
      if (!this.personSearchKeyword) {
        return this.currentDeptPersons;
      }
      return this.currentDeptPersons.filter(person =>
        person.name.includes(this.personSearchKeyword)
      );
    }
  },
  watch: {
    modelValue(val) {
      if (val) {
        this.selectedPersons = JSON.parse(JSON.stringify(this.selected));
        // 对话框打开时加载部门列表
        if (this.deptTreeData.length === 0) {
          this.loadDepts();
        } else {
          // 如果部门已加载，更新当前部门的checkbox状态
          this.updateCheckboxState();
        }
      }
    },
    // 监听 selected prop 的变化
    selected: {
      handler(newVal) {
        if (this.modelValue && newVal) {
          this.selectedPersons = JSON.parse(JSON.stringify(newVal));
          this.updateCheckboxState();
        }
      },
      deep: true
    },
    // 监听搜索关键词变化，实时过滤树
    deptSearchKeyword(val) {
      this.$refs.deptTree?.filter(val);
    }
  },
  methods: {
    // 加载部门列表
    async loadDepts() {
      this.loading = true;
      try {
        const tenantId = this.getTenantId();

        console.log('【部门列表】开始加载');
        console.log('【部门列表】tenantId:', tenantId);

        const response = await taskApi.getDepartmentList(tenantId);

        console.log('【部门列表】API响应:', response);

        if (response.data && response.data.code === 200) {
          const deptList = response.data.data || [];
          // 将平面数组转换为树形结构
          this.deptTreeData = this.buildDeptTree(deptList);
          console.log('【部门列表】✓ 加载成功，共', deptList.length, '个部门');
        } else {
          const errorMsg = response.data?.msg || '加载部门失败';
          console.error('【部门列表】✗ 服务器返回错误:', response.data);
          this.$message.error(errorMsg);
        }
      } catch (error) {
        console.error('【部门列表】✗ 请求异常:', error);
        console.error('【部门列表】错误详情:', {
          message: error.message,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data
        });

        let errorMsg = '加载部门失败';

        if (!error.response) {
          errorMsg = '无法连接到服务器，请检查网络和API地址';
        } else {
          const status = error.response.status;
          switch (status) {
            case 401:
              errorMsg = '认证失败，请检查登录状态';
              break;
            case 403:
              errorMsg = '没有权限访问此接口';
              break;
            case 404:
              errorMsg = '接口地址不存在';
              break;
            case 500:
              errorMsg = '服务器错误，请稍后重试';
              break;
            default:
              errorMsg = `请求失败 (HTTP ${status})`;
          }
        }

        this.$message.error(errorMsg);
      } finally {
        this.loading = false;
      }
    },

    // 将平面部门列表转换为树形结构
    buildDeptTree(deptList) {
      const deptMap = new Map();
      const rootDepts = [];

      // 构建 ID 到部门的映射
      deptList.forEach(dept => {
        deptMap.set(dept.id, { ...dept, children: [] });
      });

      // 构建树形结构
      deptList.forEach(dept => {
        const node = deptMap.get(dept.id);
        if (dept.parentId === '0' || !dept.parentId) {
          // 是根部门
          rootDepts.push(node);
        } else {
          // 是子部门，加入父部门的 children
          const parent = deptMap.get(dept.parentId);
          if (parent) {
            parent.children.push(node);
          }
        }
      });

      return rootDepts;
    },

    // 树形过滤方法
    filterNode(value, data) {
      if (!value) return true;
      return data.deptName.includes(value);
    },

    // 获取租户ID
    getTenantId() {
      try {
        const userInfoStr = localStorage.getItem('saber-userInfo');
        console.log('【租户ID】localStorage.saber-userInfo:', userInfoStr);

        const userInfo = JSON.parse(userInfoStr || '{}');
        const tenantId = userInfo.content?.tenantId || userInfo.content?.tenant_id || '000000';

        console.log('【租户ID】解析后的userInfo:', userInfo);
        console.log('【租户ID】最终使用的tenantId:', tenantId);

        return tenantId;
      } catch (e) {
        console.error('【租户ID】解析出错:', e);
        console.warn('【租户ID】使用默认值: 000000');
        return '000000';
      }
    },

    // 加载部门人员
    async loadDeptPersons(deptId) {
      this.personLoading = true;
      try {
        console.log('【部门人员】开始加载');
        console.log('【部门人员】deptId:', deptId);

        const response = await taskApi.getDepartmentUsers(deptId);

        console.log('【部门人员】API响应:', response);

        if (response.data && response.data.code === 200) {
          const userList = response.data.data?.userList || [];
          // 转换为本地格式，并设置 checked 状态
          this.deptPersons[deptId] = userList.map(person => ({
            id: person.id,
            name: person.realName || person.name,
            realName: person.realName,
            roleId: person.roleId,
            postId: person.postId,
            roleName: person.roleName,
            postName: person.postName,
            checked: false
          }));
          console.log('【部门人员】✓ 加载成功，共', userList.length, '人');
        } else {
          const errorMsg = response.data?.msg || '加载人员失败';
          console.error('【部门人员】✗ 服务器返回错误:', response.data);
          this.$message.error(errorMsg);
          this.deptPersons[deptId] = [];
        }
      } catch (error) {
        console.error('【部门人员】✗ 请求异常:', error);
        console.error('【部门人员】错误详情:', {
          message: error.message,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data
        });

        let errorMsg = '加载人员失败';

        if (!error.response) {
          errorMsg = '无法连接到服务器，请检查网络和API地址';
        } else {
          const status = error.response.status;
          switch (status) {
            case 401:
              errorMsg = '认证失败，请检查登录状态';
              break;
            case 403:
              errorMsg = '没有权限访问此接口';
              break;
            case 404:
              errorMsg = '接口地址不存在';
              break;
            case 500:
              errorMsg = '服务器错误，请稍后重试';
              break;
            default:
              errorMsg = `请求失败 (HTTP ${status})`;
          }
        }

        this.$message.error(errorMsg);
        this.deptPersons[deptId] = [];
      } finally {
        this.personLoading = false;
      }
    },

    handleSelectDept(dept) {
      this.selectedDeptId = dept.id;
      this.selectedDept = dept;
      this.personSearchKeyword = '';
      this.selectAll = false;

      // 如果该部门有下级部门，不加载人员，提示选择具体科室
      if (dept.children && dept.children.length > 0) {
        this.deptPersons[dept.id] = [];
        this.$message.info('请选择具体科室');
        return;
      }

      // 如果还没加载该部门的人员，则加载
      if (!this.deptPersons[dept.id]) {
        this.loadDeptPersons(dept.id);
      } else {
        this.updateCheckboxState();
      }
    },

    updateCheckboxState() {
      // 根据 selectedPersons 更新当前部门的 persons 的 checked 状态
      const currentPersons = this.currentDeptPersons;
      const selectedIds = new Set(
        this.selectedPersons
          .filter(p => p.deptId === this.selectedDeptId)
          .map(p => p.id)
      );

      currentPersons.forEach(person => {
        person.checked = selectedIds.has(person.id);
      });

      // 更新全选状态
      this.selectAll = currentPersons.length > 0 && currentPersons.every(p => p.checked);
    },

    handleSelectAll(value) {
      // 全选/全不选当前部门的人员
      this.currentDeptPersons.forEach(person => {
        person.checked = value;
      });
      this.updateSelectedPersons();
    },

    handlePersonChange() {
      // 更新选中人员列表
      this.updateSelectedPersons();
      // 更新全选状态
      this.selectAll = this.currentDeptPersons.length > 0 && this.currentDeptPersons.every(p => p.checked);
    },

    updateSelectedPersons() {
      // 获取当前部门已选中的人员
      const currentDeptPersons = this.currentDeptPersons.filter(p => p.checked);

      // 移除该部门的所有已选人员
      this.selectedPersons = this.selectedPersons.filter(p => p.deptId !== this.selectedDeptId);

      // 添加当前部门新选中的人员
      currentDeptPersons.forEach(person => {
        this.selectedPersons.push({
          id: person.id,
          name: person.name,
          realName: person.realName,
          deptId: this.selectedDeptId,
          deptName: this.selectedDept.deptName,
          roleId: person.roleId,
          postId: person.postId,
          roleName: person.roleName,
          postName: person.postName
        });
      });
    },

    handleRemovePerson(person) {
      // 从选中列表中删除
      this.selectedPersons = this.selectedPersons.filter(
        p => !(p.deptId === person.deptId && p.id === person.id)
      );

      // 更新 checkbox 状态
      if (this.selectedDeptId === person.deptId) {
        const foundPerson = this.currentDeptPersons.find(p => p.id === person.id);
        if (foundPerson) {
          foundPerson.checked = false;
        }
        this.selectAll = false;
      }
    },

    handleClose() {
      this.$emit('update:modelValue', false);
    },

    handleConfirm() {
      this.$emit('confirm', this.selectedPersons);
      this.$emit('update:modelValue', false);
    }
  }
};
</script>

<style scoped lang="scss">
.select-person-dialog {
  ::v-deep .el-dialog {
    .el-dialog__body {
      padding: 20px;
    }
  }

  .dialog-content {
    display: flex;
    gap: 20px;
    height: 500px;

    .left-panel,
    .middle-panel,
    .right-panel {
      flex: 1;
      display: flex;
      flex-direction: column;
      border: 1px solid #e5e5e5;
      border-radius: 4px;
      padding: 12px;
      background-color: #fafafa;
    }

    .left-panel {
      .dept-list {
        flex: 1;
        overflow-y: auto;

        .loading-state {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100px;
          color: #999;
          font-size: 13px;
          gap: 8px;

          ::v-deep .el-icon {
            font-size: 16px;
          }
        }

        .dept-tree {
          ::v-deep .el-tree-node {
            padding: 0;
          }

          ::v-deep .el-tree-node__content {
            height: auto;
            padding: 4px 0;
            font-size: 13px;

            &:hover {
              background-color: #f0f5ff;
            }

            &.is-focusable {
              &:focus {
                background-color: transparent;
              }
            }
          }

          ::v-deep .el-tree-node.is-current > .el-tree-node__content {
            background-color: #e6f7ff;
          }
        }

        .tree-node {
          color: #333;
          flex: 1;
        }

        .dept-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 12px;
          font-size: 13px;
          border-bottom: 1px solid #f0f0f0;
          cursor: pointer;
          transition: background-color 0.2s;

          &:hover {
            background-color: #f0f5ff;
          }

          &.active {
            background-color: #e6f7ff;
            border-left: 3px solid #1890ff;
            padding-left: 9px;
          }

          .dept-name {
            flex: 1;
          }

          ::v-deep .el-link {
            font-size: 12px;
          }
        }

        .empty-state {
          text-align: center;
          color: #999;
          padding: 20px 0;
          font-size: 12px;
        }
      }
    }

    .middle-panel {
      .dept-persons {
        display: flex;
        flex-direction: column;
        height: 100%;

        .person-list {
          flex: 1;
          overflow-y: auto;

          .loading-state {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100px;
            color: #999;
            font-size: 13px;
            gap: 8px;

            ::v-deep .el-icon {
              font-size: 16px;
            }
          }

          .person-item {
            padding: 6px 0;
            font-size: 13px;

            ::v-deep .el-checkbox {
              display: flex;
              align-items: center;
            }
          }

          .empty-state {
            text-align: center;
            color: #999;
            padding: 20px 0;
            font-size: 12px;
          }
        }
      }

      .no-dept-selected {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        color: #999;
        font-size: 14px;
      }
    }

    .right-panel {
      .selected-header {
        font-size: 12px;
        color: #666;
        font-weight: 500;
        margin-bottom: 12px;
      }

      .selected-list {
        flex: 1;
        overflow-y: auto;
        display: flex;
        flex-direction: column;

        ::v-deep .el-tag {
          width: fit-content;
          margin: 4px;
        }

        .empty-state {
          text-align: center;
          color: #999;
          padding: 20px 0;
          font-size: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }
  }
}
</style>
