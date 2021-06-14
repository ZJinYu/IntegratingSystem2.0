<template>
  <div>
    <h2>会员注册</h2>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
  <el-form-item label="用户名" prop="uid">
    <el-input v-model="ruleForm.uid"></el-input>
  </el-form-item>
  <el-form-item label="密码" prop="passWord">
    <el-input v-model="ruleForm.passWord" type="password"></el-input>
  </el-form-item>
  <el-form-item label="确定密码" prop="checkPassWord">
    <el-input v-model="ruleForm.checkPassWord" type="password"></el-input>
  </el-form-item>
  <el-form-item label="真实姓名" prop="userName">
    <el-input v-model="ruleForm.userName"></el-input>
  </el-form-item>
  <el-form-item label="年龄" prop="age">
    <el-select v-model="ruleForm.age" placeholder="---">
      <el-option label="18" value="18"></el-option>
      <el-option label="20" value="20"></el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="出生日期" required>
    <el-col :span="11">
      <el-form-item prop="bornDate">
        <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.bornDate" style="width: 100%;"></el-date-picker>
      </el-form-item>
    </el-col>
  </el-form-item>
  <el-form-item label="性别" prop="gander">
    <el-radio-group v-model="ruleForm.gander">
      <el-radio label="男"></el-radio>
      <el-radio label="女"></el-radio>
    </el-radio-group>
  </el-form-item>
  <el-form-item label="电话" prop="number">
    <el-input type="number" v-model="ruleForm.number"></el-input>
  </el-form-item>
  <el-form-item label="邮箱" prop="email">
    <el-input type="email" v-model="ruleForm.email"></el-input>
  </el-form-item>
  <el-form-item label="地址" prop="address">
    <el-input type="address" v-model="ruleForm.address"></el-input>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
    <el-button @click="resetForm('ruleForm')">重置</el-button>
  </el-form-item>
</el-form>
  </div>
</template>

<script>
export default {
    data() {
       var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.ruleForm.checkPassWord !== '') {
            this.$refs.ruleForm.validateField('checkPassWord');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm.passWord) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        ruleForm: {
          uid: '',
          passWord: '',
          checkPassWord: '',
          name: '',
          age: '',
          bornDate: '2000-01-01',
          delivery: false,
          gander: '',
          number: '',
          address: ''
        },
        rules: {
          uid: [
             { required: true, message: '用户名不能为空', trigger: 'blur' },
             { min: 2, max: 15, message: '输入账号格式不正确', trigger: 'blur' }
          ],
         passWord: [
            { required: true, validator: validatePass, trigger: 'blur' },
            { min: 6, max: 20, message: '输入密码格式不正确', trigger: 'blur' }
          ],
          checkPassWord: [
            { required: true, validator: validatePass2, trigger: 'blur' }
          ],
          userName: [
            { required: true, message: '姓名不能为空', trigger: 'blur' },
            { min: 3, max: 4, message: '输入姓名格式不正确', trigger: 'blur' }
          ],
          age: [
            { required: true, message: '请选择年龄', trigger: 'change' }
          ],
          bornDate: [
            { type: 'date', required: true, message: '请选择日期', trigger: 'blur' }
          ],
          gander: [
            { required: true, message: '请选择性别', trigger: 'blur' }
          ],
          email: [
            { required: true, message: '邮箱不能为空', trigger: 'blur' },
            { min: 6, max: 20, message: '输入邮箱格式不正确', trigger: 'blur' }
          ],
          number: [
            {required: true, message: '手机号码不能为空', trigger: 'blur' },
            { min: 11, max: 11, message: '输入手机格式不正确', trigger: 'blur' }
          ],
          address: [
            { required: true, message: '请填写详细地址', trigger: 'blur' }
          ]
        }
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('注册成功!');
          } else {
            console.log('注册失败，请重试');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }
</script>

<style scoped>

</style>