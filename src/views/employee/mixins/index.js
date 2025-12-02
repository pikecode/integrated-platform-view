import * as employeeApi from '@/api/employee';

const mixin = {
  methods: {
    /**
     * 删除员工
     */
    async deleteEmployee(employeeId) {
      try {
        await this.$confirm('确定删除此员工？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        });

        await employeeApi.remove(employeeId);
        this.$message.success('删除成功');

        // 如果父组件有 loadEmployees 方法，调用它刷新列表
        if (this.loadEmployees) {
          this.loadEmployees();
        }
      } catch (error) {
        if (error !== 'cancel') {
          this.$message.error('删除失败');
        }
      }
    },

    /**
     * 编辑员工
     */
    editEmployee(employeeId) {
      this.$router.push(`/employee/edit/${employeeId}`);
    },

    /**
     * 新增员工
     */
    createEmployee() {
      this.$router.push('/employee/add');
    },

    /**
     * 导出员工列表
     */
    async handleExport(params = {}) {
      try {
        const response = await employeeApi.exportEmployee(params);
        // 创建下载链接
        const url = window.URL.createObjectURL(new Blob([response]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', '员工列表.xlsx');
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);
        this.$message.success('导出成功');
      } catch (error) {
        this.$message.error('导出失败');
      }
    },
  },
};

export default mixin;
