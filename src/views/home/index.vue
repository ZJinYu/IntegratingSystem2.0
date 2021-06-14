<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <img src="@/assets/img/logo.jpg" class="logo-img">
        <span>联城百货超市积分管理系统</span>
      </div>
      <div style="margin-left:1200px">
        <el-avatar icon="el-icon-user-solid"></el-avatar>
        <span>{{username}}</span>
      </div>
      <el-button type="info" @click="logout">退出登录</el-button>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-menu background-color="#77DAC9"
        text-color="#000"
        active-text-color="#923E25"
        :unique-opened="true"
        router>
        <!-- 如果要把某个值重置为true可以将:router = "true"省略为router -->
         <!-- 左侧导航一次只能展开一项:unique-opened = "true"==>boolean -->
         <!-- 一级菜单 -->
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-s-tools"></i>
              <span>系统用户管理</span>
            </template>
            <!-- 二级菜单 -->
              <el-menu-item index="/changepwd">
                <i class="el-icon-menu"></i>
                <span>修改密码</span>
              </el-menu-item>
              <el-menu-item index="/admininfo">
                <i class="el-icon-menu"></i>
                <span>查看管理员</span>
              </el-menu-item>
            </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-user-solid"></i>
              <span>会员信息管理</span>
            </template>
            <el-menu-item index="/userinfo">
              <i class="el-icon-menu"></i>
              <span>查看当前会员</span>
            </el-menu-item>
            <!-- <el-menu-item index="2-2">
              <i class="el-icon-menu"></i>
              <span>添加会员信息</span>
            </el-menu-item> -->
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-s-goods"></i>
              <span>商品管理</span>
            </template>
            <el-menu-item index="/goodsList">
              <i class="el-icon-menu"></i>
              <span>商品列表</span>
            </el-menu-item>
            <el-menu-item index="/goodsClass">
              <i class="el-icon-menu"></i>
              <span>分类参数</span>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-bank-card"></i>
              <span>会员卡信息管理</span>
            </template>
            <el-menu-item index="/card">
              <i class="el-icon-menu"></i>
              <span>查看当前会员卡</span>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="5">
            <template slot="title">
              <i class="el-icon-s-order"></i>
              <span>订单管理</span>
            </template>
            <el-menu-item index="/orderinfo">
              <i class="el-icon-menu"></i>
              <span>订单信息</span>
            </el-menu-item>
          </el-submenu>
          <el-menu-item index="/banner">
            <i class="el-icon-s-tools"></i>
            <span slot="title">轮播图管理</span>
          </el-menu-item>
          <el-menu-item index="/rule">
            <i class="el-icon-s-tools"></i>
            <span slot="title">积分兑换规则</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import axios from "axios";

export default {
  data(){
    return {
      username:'',
    }
  },
  mounted() {
    this.getAdminInfo()
  },
  methods: {
    getAdminInfo(){
      axios.post('/information').then( res => {
        this.username = res.data.data.username
      }).catch( error => {
        this.$message.error(error.msg)
      });
    },
    logout() {
      //清除token，并且强制返回登录界面
      localStorage.clear()
      this.$router.push('/admin')
    }
  },
}
</script>

<style scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #000000;
  font-size: 20px;
}
.el-header>div{
  display: flex;
  align-items: center;
}
.el-header>div span{
  margin-left: 15px;
}
.logo-img{
  margin-left: 10px;
  height: 45px;
  width: 180px;
}

.el-aside {
  background-color: #00AC8E;

}
.el-menu{
  border-right: none;
}
.el-main {
  background-color: #eeeeee;
}
</style>
