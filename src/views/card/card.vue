<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item >会员卡信息管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/cardinfo' }">查看当前会员卡</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model="searchInfo" clearable>
            <el-button slot="append" icon="el-icon-search" @click="searchSubmit"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="handleAdd">添加会员卡</el-button>
        </el-col>
      </el-row>
      <el-table :data="cardInfo" style="width: 100%" border stripe>
        <el-table-column type="index" label="#"/>
        <el-table-column prop="id" label="会员卡号"/>
        <el-table-column prop="username" label="持卡人"/>
        <el-table-column prop="status" label="状态" :formatter="btnStatus"/>
        <el-table-column prop="score" label="卡内积分"/>
        <el-table-column prop="createTime" label="创建时间" :formatter="formatDate"/>
        <el-table-column prop="operation" label="操作" width="270px">
          <template slot-scope="scope">
            <el-button size="mini" type="success" round @click="recoveryCard(scope.$index, scope.row)">恢复</el-button>
            <el-button size="mini" type="warning" round @click="disableCard(scope.$index, scope.row)">禁用</el-button>
            <el-button size="mini" type="info" round @click="loseCard(scope.$index, scope.row)">挂失</el-button>
            <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="handleDelete(scope.$index, scope.row)"
            ></el-button>
            <!-- <el-button type="warning" icon="el-icon-setting" size="mini"></el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-size="queryInfo.pagesize"
      layout="prev, pager, next, jumper"
      :total="10">
      </el-pagination>
    </el-card>
    <!-- 添加对话框 -->
    <el-dialog title="添加会员卡" :visible.sync="addDialogVisible" @close="closeDialog" width="30%">
      <!-- 内容主体 -->
      <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="80px">
        <el-form-item label="用户ID" prop="id">
          <el-select v-model="addForm.id" @change="getUsernameById">
            <el-option
                v-for="item in userInfo"
                :key="item.id"
                :label="item.id"
                :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username" disabled style="width:250px"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button type="primary"  @click="createSubmit">确定</el-button>
        <el-button @click="addDialogVisible = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import axios from "axios";

  export default{
    data(){
      // 限定只能为数字规则
      const isNum = (rule, value, callback) => {
        const age = /^[0-9]*$/;
        if (age.test(value)) {
          return callback();
        }
        callback(new Error("年龄只能为数字"));
      };
      return{
        queryInfo:{
            pageNum: 1,
            pageSize: 2
          },
        searchInfo:'',
        cardInfo:[],
        temp:[],
        userInfo:[],
        addLoading: false,
        addDialogVisible: false,
        addForm: {},
        editForm: {},
        addFormRules: {
          id: [
            { required: true, message: '会员卡号不能为空', trigger: 'blur' },
            { validator: isNum,min: 2, max: 15, message: '输入会员卡格式不正确', trigger: 'blur' }
          ],
          username: [
            { required: true, message: '用户名不能为空', trigger: 'blur' },
            { min: 2, max: 15, message: '输入用户名不正确', trigger: 'blur' }
          ]
        }
      }
    },
    created() {

    },
    mounted() {
      this.getCardList()
      this.getUserList()
    },
    methods: {
      btnStatus(row){
        if (row.status === 0) {
          return '禁用';
        } else if(row.status === 1){
          return '启用';
        }else if(row.status === 2){
          return '挂失';
        }
      },
      // 监听pagesize改变的事件
      createInfo(payLoad){
        axios({
          method: 'post',
          url:'/card/create',
          data:payLoad
        }).then( res => {
          this.$message.success(res.data.msg)
          this.addDialogVisible = false;
          this.getCardList();
        }).catch( error => {
          this.$message.error(error.msg)
        })
      },
      // 关闭对话框时清空input内数据
      closeDialog(){
        this.$refs.addFormRef.resetFields();
      },
      getCardList() {
        axios.get('/card/list').then( response => {
          this.cardInfo = response.data.data;
        }).catch( error => {
          this.$message.error(error.msg)
        });
      },
      getUserList(){
        axios.get('/user/list').then( response => {
          this.userInfo = response.data.data
        }).catch( error => {
          this.$message.error(error.msg)
        });
      },
      getUsernameById(id){
        const temp = this.userInfo.find(data =>{
          if(data.id === id)
          return data.realName
        })
        this.addForm.username = temp.realName
      },
      disableCard(key,params){
        axios({
          method: 'post',
          url:'/card/disable',
          data:{
            id:params.id
          }
        }).then(res =>{
          this.$message(res.data.msg)
          this.getCardList()
        }).catch(error =>{
          this.$message.error(error.msg)
        })
      },
      recoveryCard(key,params){
        axios({
          method: 'post',
          url:'/card/recovery',
          data:{
            id:params.id
          }
        }).then(res =>{
          this.$message(res.data.msg)
          this.getCardList()
        }).catch(error =>{
          this.$message.error(error.msg)
        })
      },
      loseCard(key,params){
        axios({
          method: 'post',
          url:'/card/lose',
          data:{
            id:params.id
          }
        }).then(res =>{
          this.$message(res.data.msg)
          this.getCardList()
        }).catch(error =>{
          this.$message.error(error.msg)
        })
      },
      deleteCardInfoById(params) {
        axios({
          method: 'delete',
          url:'/card/deleteCard',
          data:{
            id:params.id
          }
        }).then( res => {
          this.$message.success(res.data.msg)
          this.getCardList()
        }).catch( error => {
          this.$message.error(error.msg)
        });
      },
      searchCard(payLoad){
        const data = {username:payLoad}
        axios({
          method: 'post',
          url:'/card/search',
          data:data
        }).then( res =>{
          if(res.data.code === 0){
            this.$message.success(res.data.msg)
            this.cardInfo = res.data.data
          }else{
            this.$message.error(res.data.msg)
            this.cardInfo = null
          }
        }).catch( err =>{
          this.$message.success(err.msg)
        })
      },
      // 监听pagesize改变的事件
      handleSizeChange(newSize) {
        this.queryInfo.pagesize = newSize
        this.getUserList()
      },
      handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage
        this.getUserList()
      },
      async handleAdd(){
        this.addDialogVisible = true
        this.addForm = {
          id: '',
          username: '',
        };
      },
      searchSubmit(){
        this.searchCard(this.searchInfo)
      },
      createSubmit() {
        this.$refs.addFormRef.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交？', '提示', {}).then(() => {
              this.addLoading = true;
              let addPara = new URLSearchParams();
              addPara.append("id", this.addForm.id);
              addPara.append("username", this.addForm.username);
              this.createInfo(addPara)
            })
          }
        })
      },
      async handleDelete(key, keyInfo) {
        this.$confirm('将软删除该会员卡信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then( ()=> this.deleteCardInfoById(keyInfo))
        .catch(()=>{})
      },
      formatDate(row) {
        console.log(row)
        if (row.createTime === null) {
          return
        } else {
          let date = new Date(parseInt(row.createTime) * 1000);
          const Y = date.getFullYear() + '-'
          const M =
              date.getMonth() + 1 < 10
                  ? '0' + (date.getMonth() + 1) + '-'
                  : date.getMonth() + '-'
          const D =
              date.getDate() < 10
                  ? '0' + date.getDate() + ' '
                  : date.getDate() + ' '
          const h =
              date.getHours() < 10
                  ? '0' + date.getHours() + ':'
                  : date.getHours() + ':'
          const m =
              date.getMinutes() < 10
                  ? '0' + date.getMinutes() + ':'
                  : date.getMinutes() + ':'
          const s =
              date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
          return Y + M + D + h + m + s
        }
      }
    }
  }
</script>

<style scoped>

</style>
