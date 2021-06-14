<template>
<div>
  <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item >系统用户管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/userinfo' }">修改密码</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <div class="Cpwdform">
        <el-form :model="PwdForm" status-icon :rules="rules" ref="PwdForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="旧密码" prop="oldPassword" style="width: 60%" >
            <el-input v-model="PwdForm.oldPassword" type="password" clearable></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="newPassword" style="width: 60%">
            <el-input v-model="PwdForm.newPassword" type="password" clearable></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="checkPassword" style="width: 60%" >
            <el-input v-model="PwdForm.checkPassword" type="password" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('PwdForm')">提交</el-button>
            <el-button @click="resetForm('PwdForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
</div>
</template>

<script>
  import axios from "axios";

  export default {
    data() {
      const validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.PwdForm.checkPassword !== '') {
            this.$refs.PwdForm.validateField('checkPassword');
          }
          callback();
        }
      };
      const validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.PwdForm.newPassword) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        PwdForm: {
          oldPassword: '',
          newPassword: '',
          checkPassword: ''
        },
        rules: {
          oldPassword: [
             { required: true, message: '密码不能为空', trigger: 'blur' }
          ],
          newPassword: [
            { required: true, validator: validatePass, trigger: 'blur' },
            { min: 5, max: 20, message: '输入密码格式不正确', trigger: 'blur' }
          ],
          checkPassword: [
            { required: true, validator: validatePass2, trigger: 'blur' }
          ],
        }
      };
    },
    methods: {
      changePwd(payLoad){
        axios({
          method: 'put',
          url:'/information',
          data:payLoad
        }).then(res =>{
          if(res.data.code===0){
            this.$message.success(res.data.msg)
            localStorage.clear()
            this.$router.push('/admin')
          }else if(res.data.code===404004){
            this.$message.error(res.data.msg)
          }
        }).catch(err =>{
          this.$message.error(err.msg)
        })
      },
      submitForm() {
        this.$confirm('将修改管理员密码, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then( ()=> {
          this.changePwd(this.PwdForm)
        })
        .catch(()=>{})
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }
</script>

<style scoped>
.Cpwdform{
  width: 50%;
  padding-top: 20px;
}
</style>
