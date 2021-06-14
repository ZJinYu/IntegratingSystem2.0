<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item >会员信息管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/userinfo' }">查看会员信息</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片组件 -->
    <el-card>
      <el-row>
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model="searchInfo" clearable>
            <el-button slot="append" icon="el-icon-search" @click="searchSubmit"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table :data="userList" style="width: 100%" border stripe>
        <el-table-column type="index" label="#"/>
        <el-table-column prop="nickName" label="昵称" width="200%"/>
        <el-table-column prop="id" label="会员ID" width="200%"/>
        <el-table-column prop="realName" label="姓名" width="90%"/>
        <el-table-column prop="gander" label="性别" width="60%" :formatter="sfktFormdata"/>
        <el-table-column prop="age" label="年龄" width="50%"/>
        <el-table-column prop="email" label="邮箱" width="180%"/>
        <el-table-column prop="phone" label="电话" width="120%"/>
        <el-table-column prop="type" label="角色" width="100%" :formatter="typeFormdata"/>
        <el-table-column prop="balance" label="金额" width="100%" ></el-table-column>>
        <el-table-column prop="address" label="地址"/>
        <el-table-column prop="status" label="状态" width="120px" :formatter="btnBoolean">
          <template slot-scope="scope">
            <el-switch
              active-color="#13ce66"
              inactive-color="#ff4949"
              v-model="scope.row.status"
              :active-value="true"
              :inactive-value="false"
              @change="changeStatus(scope.row.status, scope.row)"/>
          </template>
        </el-table-column>
        <el-table-column prop="operation " label="操作" width="120px">
          <template slot-scope="scope">
            <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="handleEdit(scope.$index, scope.row)"/>
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
      :total="1">
      </el-pagination>
    </el-card>
    <!-- 添加对话框 -->
    <el-dialog title="添加新用户" :visible.sync="addDialogVisible" @close="closeDialog" width="40%">
      <!-- 内容主体 -->
      <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="80px">
        <el-form-item label="昵称" prop="nickName">
          <el-input v-model="addForm.nickName"></el-input>
        </el-form-item>
        <el-form-item label="真实姓名" prop="realName">
          <el-input v-model="addForm.realName"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input v-model="addForm.age"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="gander">
          <el-radio-group v-model="addForm.gender">
            <el-radio label="1">男</el-radio>
            <el-radio label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="addForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="初始金额" prop="balance">
          <el-input v-model="addForm.balance"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="addForm.address" width="50px"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="createSubmit">确定</el-button>
        <el-button @click="addDialogVisible = false">取消</el-button>
      </span>
    </el-dialog>
    <el-dialog title="编辑" :visible.sync="editDialogVisible" width="40%">
      <!-- 内容主体 -->
      <el-form ref="editFormRef" :model="editForm" :rules="addFormRules" label-width="80px">
        <el-form-item label="昵称" prop="nickName">
          <el-input v-model="editForm.nickName"></el-input>
        </el-form-item>
        <el-form-item label="真实姓名" prop="realName">
          <el-input v-model="editForm.realName" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input v-model="editForm.age"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="editForm.gender">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="editForm.phone" ></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="editForm.address" width="50px"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editSubmit">确定</el-button>
        <el-button @click="editDialogVisible = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
  export default{
    data() {
      // 限定只能为数字规则
      const isNum = (rule, value, callback) => {
        const age = /^[0-9]*$/;
        if (age.test(value)) {
          return callback();
        }
        callback(new Error("年龄只能为数字"));
      };
      const checkEmail = (rule, value, callback) => {
        // 验证邮箱的正则表达式
        const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
        if (regEmail.test(value)) {
          // 合法的邮箱
          return callback();
        }
        callback(new Error("请输入合法的邮箱"));
      };
      return {
        //获取用户列表的参数对象
        queryInfo: {
          pagenum: 1,
          pagesize: 2
        },
        searchInfo:'',
        userList: [],
        addLoading: false,
        editLoading: false,
        addDialogVisible: false,
        editDialogVisible: false,
        addForm: {},
        editForm: {},
        addFormRules: {
          nickName: [
            { min: 2, max: 15, message: '输入用户名格式不正确', trigger: 'blur' }
          ],
          realName: [
            { required: true, message: '真实姓名不能为空', trigger: 'blur' },
            { min: 3, max: 4, message: '输入真实姓名格式不正确', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '密码不能为空', trigger: 'blur' },
            { min: 6, max: 20, message: '输入密码格式不正确', trigger: 'blur' }
          ],
          type: [
            { required: true, message: '请选择年龄', trigger: 'change' }
          ],
          age: [
            { required: true, message: '年龄不能为空', trigger: 'blur' },
            { validator: isNum, min: 1, max: 3, message: '输入正确年龄', trigger: 'blur' }
          ],
          gender: [
            { required: true, message: '请选择性别', trigger: 'blur' }
          ],
          email: [
            { required: true, message: '邮箱不能为空', trigger: 'change' },
            { validator: checkEmail, message: "输入邮箱格式不正确", trigger: "blur"}
          ],
          phone: [
            { required: true, message: '手机号码不能为空', trigger: 'blur' },
            { validator: isNum, min: 11, max: 11, message: '输入手机格式不正确', trigger: 'blur' }
          ],
          address: [
            { required: true, message: '请填写详细地址', trigger: 'blur' }
          ]
        },
      }
    },
    created() {

    },
    mounted() {
      this.getUserList()
    },
    methods: {
      btnBoolean(row){
        console.log(row);
        if (row.status == 0) {
          return 'false';
        } else if(row.status == 1){
          return 'true';
        }
      },
      sfktFormdata(row){
        if (row.gender == 1) {
          return '男';
        } else if(row.gender == 2){
          return '女';
        }
      },
      typeFormdata(row){
        if (row.type == 0) {
          return '非会员卡用户';
        } else if(row.type == 1){
          return '会员卡用户';
        }
      },
      createInfo(data){
        axios({
          method: 'post',
          url:'/user/create',
          data:data
        }).then( res => {
          this.$message.success(res.data.msg)
          this.addDialogVisible = false;
          this.getUserList();
        }).catch( error => {
          this.$message.error(error.msg)
        })
      },
      // 关闭对话框时清空input内数据
      closeDialog(){
        this.$refs.addFormRef.resetFields();
      },
      getUserList(){
        axios.get('/user/list').then( response => {
          this.userList = response.data.data;
          return response.data.res
        }).catch( error => {
          this.$message.error(error.msg)
        });
      },
      deleteUserInfoById(params) {
        axios({
          method: 'delete',
          url:'/user/delete',
          data:{
            id:params.id
          }
        }).then( res => {
          this.$message.success(res.data.msg)
          this.getUserList()
        }).catch( error => {
          this.$message.error(error.msg)
        });
      },
      updateUserInfoById(payLoad){
        axios({
          method: 'put',
          url:'/user/modify',
          data:payLoad
        }).then(res => {
          this.$message.success(res.data.msg)
          this.editDialogVisible = false;
          this.getUserList();
        }).catch(err=> {
          this.$message.error(err.msg)
        })
      },
      changeStatusToRecovery(payLoad){
        axios({
          method: 'post',
          url:'/user/recovery',
          data:payLoad
        }).then(res => {
          this.$message.success(res.data.msg)
          this.editDialogVisible = false;
          this.getUserList();
        }).catch(err=> {
          this.$message.error(err.msg)
        })
      },
      changeStatusToDisable(payLoad){
        axios({
          method: 'post',
          url:'/user/disable',
          data:payLoad
        }).then(res => {
          this.$message.success(res.data.msg)
          this.editDialogVisible = false;
          this.getUserList();
        }).catch(err=> {
          this.$message.error(err.msg)
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
          nickName: '',
          realName: '',
          gender: '',
          password: '',
          age: '',
          email: '',
          phone: '',
          bornDate: '',
          address: ''
        };
      },
      createSubmit() {
        this.$refs.addFormRef.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交？', '提示', {}).then(() => {
              this.addLoading = true;
              let addPara = new URLSearchParams();
              addPara.append("nickName", this.addForm.nickName);
              addPara.append("realName", this.addForm.realName);
              addPara.append("gander", this.addForm.gender);
              addPara.append("password", this.addForm.password);
              addPara.append("age", this.addForm.age);
              addPara.append("email", this.addForm.email);
              addPara.append("phone", this.addForm.phone);
              addPara.append("bornDate", this.addForm.bornDate);
              addPara.append("address", this.addForm.address);
              this.createInfo(addPara)
            })
          }
        })
      },
      editSubmit() {
        console.log(this.editForm);
        this.$refs.editFormRef.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交？', '提示', {}).then(() => {
              this.editLoading = true;
              this.updateUserInfoById(this.editForm)
            })
          }
        })
      },
      async handleDelete(key, keyInfo) {
        this.$confirm('将软删除该用户信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then( ()=> this.deleteUserInfoById(keyInfo))
          .catch(()=>{})
      },
      async handleEdit(key, keyInfo) {
        this.editDialogVisible = true
        this.editForm = {
          id: keyInfo.id,
          nickName: keyInfo.nickName,
          realName: keyInfo.realName,
          gender: keyInfo.gender,
          age: keyInfo.age,
          email: keyInfo.email,
          phone: keyInfo.phone,
          type: keyInfo.type,
          address: keyInfo.address
       }
      },
      changeStatus(key,keyInfo){
        if(key===true){
          this.changeStatusToRecovery(keyInfo)
        }else if(key===false){
          this.changeStatusToDisable(keyInfo)
        }
      },
      searchSubmit(){
        this.searchUser(this.searchInfo)
      },
      searchUser(payLoad){
        const data = {realName:payLoad}
        axios({
          method: 'post',
          url:'user/search',
          data:data
        }).then( res =>{
          if(res.data.code === 0){
            this.$message.success(res.data.msg)
            this.userList = res.data.data
          }else {
            this.$message.error(res.data.msg)
            this.userList = res.data.data
          }
        }).catch( err =>{
          this.$message.success(err.msg)
        })
      }
    },
  }
</script>
<style scoped>
 .text {
    font-size: 14px;
  }

  .item {
    padding: 18px 0;
  }

  .box-card {
    width: 480px;
  }
</style>
