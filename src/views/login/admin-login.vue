<template>
  <div class="log_containar">
    <div class="login_box">
      <!--头像-->
      <div class="avatar_box">
        <img src="@/assets/img/user.png" alt="">
      </div>
      <!--登录表单-->
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px" class="login_form">
        <!--用户名-->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="iconfont icon-RectangleCopy" clearable></el-input>
        </el-form-item>
        <!--密码-->
        <el-form-item prop="password">
          <el-input  v-model="loginForm.password" prefix-icon="iconfont icon-RectangleCopy1" type="password" clearable></el-input>
        </el-form-item>
        <!--按钮-->
        <el-form-item class="btns">
        <el-button type="primary" @click="login">登陆</el-button>
        <el-button type="success" @click="cantRegister">注册</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      //绑定表单数据对象
      loginForm: {
        username: 'admin',
        password: 'admin'
      },
      //表单规则
      loginFormRules: {
        username: [ { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 18, message: '请输入正确的用户名格式', trigger: 'blur' }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 18, message: '请按格式输入密码', trigger: 'blur' }]
      }
    }
  },
  methods: {
    cantRegister() {
      this.$message('新的管理员无法从外部注册，请联系工作人员！');
    },
    //表单预验证
    login() {
      console.log(this.loginForm);
      axios({
        method: 'post',
        url:'/login',
        headers:{
          'Content-Type': "application/json;charset=UTF-8",
        },
        data:{
          username:this.loginForm.username,
          password:this.loginForm.password
        }
      }).then( res => {
        console.log(res);
        if(res.data.code === 0){
          localStorage.setItem("token",res.data.token)
            this.$router.push('/index')
            this.$message.success(res.data.msg)
        }else{
          this.$message.error(res.data.msg)
        }
      }).catch(err=> {
        this.$message.error(err)
      })
    },
  }
}
</script>

<style scoped>
.log_containar{
  background-color: #003B5C;
  height: 100%;
}
.login_box{
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.avatar_box{
  height: 130px;
  width: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 10px #ddd;
  position: absolute;
  left: 50%;
  transform: translate(-55%,-50%);
  background-color: #fff;
  }
.avatar_box img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #eee;
}
.login_form {
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
  position: absolute;
  bottom: 0;
}
.btns {
  display: flex;
  justify-content: flex-end;
}
</style>
