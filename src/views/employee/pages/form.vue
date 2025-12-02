<template>
  <basic-container>
    <el-card class="form-card">
      <template #header>
        <div class="card-header">
          <span>{{ isEdit ? '编辑员工' : '新增员工' }}</span>
        </div>
      </template>

      <el-form
        ref="form"
        :model="formData"
        :rules="rules"
        label-width="120px"
        @submit.prevent="submitForm"
      >
        <!-- 基本信息 -->
        <el-divider>基本信息</el-divider>

        <el-form-item label="员工姓名" prop="name">
          <el-input
            v-model="formData.name"
            placeholder="请输入员工姓名"
            maxlength="50"
          />
        </el-form-item>

        <el-form-item label="所属部门" prop="department">
          <el-select v-model="formData.department" placeholder="选择所属部门">
            <el-option label="技术部" value="技术部" />
            <el-option label="产品部" value="产品部" />
            <el-option label="设计部" value="设计部" />
            <el-option label="销售部" value="销售部" />
            <el-option label="市场部" value="市场部" />
            <el-option label="人资部" value="人资部" />
          </el-select>
        </el-form-item>

        <el-form-item label="职位" prop="position">
          <el-input
            v-model="formData.position"
            placeholder="请输入职位"
            maxlength="50"
          />
        </el-form-item>

        <!-- 联系信息 -->
        <el-divider>联系信息</el-divider>

        <el-form-item label="联系电话" prop="phone">
          <el-input
            v-model="formData.phone"
            placeholder="请输入联系电话"
            type="tel"
          />
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model="formData.email"
            placeholder="请输入邮箱地址"
            type="email"
          />
        </el-form-item>

        <!-- 工作信息 -->
        <el-divider>工作信息</el-divider>

        <el-form-item label="入职日期" prop="hireDate">
          <el-date-picker
            v-model="formData.hireDate"
            type="date"
            placeholder="选择入职日期"
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="员工状态" prop="status">
          <el-select v-model="formData.status" placeholder="选择员工状态">
            <el-option label="在职" value="active" />
            <el-option label="待入职" value="pending" />
            <el-option label="离职" value="left" />
            <el-option label="停用" value="inactive" />
          </el-select>
        </el-form-item>

        <el-form-item label="备注">
          <el-input
            v-model="formData.remark"
            type="textarea"
            rows="4"
            placeholder="请输入备注信息"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>

        <!-- 按钮组 -->
        <el-form-item>
          <el-button type="primary" @click="submitForm" :loading="submitting">
            {{ isEdit ? '更新' : '新增' }}
          </el-button>
          <el-button @click="goBack">取消</el-button>
          <el-button v-if="isEdit" type="danger" @click="deleteConfirm">删除</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </basic-container>
</template>

<script>
import * as employeeApi from '@/api/employee';

export default {
  name: 'EmployeeForm',
  data() {
    return {
      isEdit: false,
      submitting: false,
      formData: {
        id: '',
        name: '',
        department: '',
        position: '',
        phone: '',
        email: '',
        hireDate: null,
        status: 'pending',
        remark: '',
      },
      rules: {
        name: [{ required: true, message: '请输入员工姓名', trigger: 'blur' }],
        department: [{ required: true, message: '请选择所属部门', trigger: 'change' }],
        position: [{ required: true, message: '请输入职位', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '邮箱格式不正确', trigger: 'blur' },
        ],
        hireDate: [{ required: true, message: '请选择入职日期', trigger: 'change' }],
        status: [{ required: true, message: '请选择员工状态', trigger: 'change' }],
      },
    };
  },
  mounted() {
    const id = this.$route.params.id;
    if (id) {
      this.isEdit = true;
      this.loadEmployee(id);
    }
  },
  methods: {
    async loadEmployee(id) {
      try {
        // 开发阶段：使用模拟数据
        this.formData = {
          id: id,
          name: '张三',
          department: '技术部',
          position: '前端工程师',
          phone: '13800138000',
          email: 'zhangsan@example.com',
          hireDate: '2024-01-15',
          status: 'active',
          remark: '这是一个很优秀的工程师',
        };
      } catch (error) {
        this.$message.error('加载员工信息失败');
        this.goBack();
      }
    },

    async submitForm() {
      try {
        await this.$refs.form.validate();
        this.submitting = true;

        // 开发阶段：模拟提交
        await new Promise(resolve => setTimeout(resolve, 1000));

        this.$message.success(this.isEdit ? '更新成功' : '新增成功');
        this.goBack();
      } catch (error) {
        this.$message.error('提交失败，请检查表单');
      } finally {
        this.submitting = false;
      }
    },

    deleteConfirm() {
      this.$confirm('确定删除此员工？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.$message.success('删除成功');
          this.goBack();
        })
        .catch(() => {
          // 取消删除
        });
    },

    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>

<style scoped lang="scss">
.form-card {
  max-width: 800px;
  margin: 0 auto;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    > span {
      font-size: 16px;
      font-weight: bold;
    }
  }
}
</style>
