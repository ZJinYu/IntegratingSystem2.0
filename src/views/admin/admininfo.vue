  <template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item >系统用户管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/admininfo' }">查看管理员</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model="searchInfo" clearable>
            <el-button slot="append" icon="el-icon-search" @click="searchSubmit"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="handleAdd">添加管理员</el-button>
        </el-col>
      </el-row>
      <el-table :data="adminList" style="width: 100%" border stripe>
        <el-table-column type="index" label="#"/>
        <el-table-column prop="id" label="id"/>
        <el-table-column prop="username" label="用户名"/>
        <el-table-column prop="realName" label="真实姓名"/>
        <el-table-column prop="phone" label="电话"/>
        <el-table-column prop="gender" label="性别" :formatter="sfktFormate"/>
        <el-table-column prop="role" label="角色"/>
        <el-table-column prop="status" label="状态" width="120px">
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
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="handleDelete(scope.$index, scope.row)"
              >
            </el-button>
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="handleEdit(scope.$index, scope.row)"
              >
            </el-button>
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
    <el-dialog title="添加管理员" :visible.sync="addDialogVisible" @close="closeDialog" width="40%">
      <!-- 内容主体 -->
      <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="真实姓名" prop="realName">
          <el-input v-model="addForm.realName"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="addForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="addForm.gender">
            <el-radio label="1">男</el-radio>
            <el-radio label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="createSubmit">确定</el-button>
        <el-button @click="addDialogVisible = false">取消</el-button>
      </span>
    </el-dialog>
    <!-- 修改信息 -->
    <el-dialog title="编辑" :visible.sync="editDialogVisible" width="40%">
      <!-- 内容主体 -->
      <el-form ref="editFormRef" :model="editForm" :rules="addFormRules" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="真实姓名" prop="realName">
          <el-input v-model="editForm.realName"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="editForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="editForm.gender">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
          </el-radio-group>
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
      const isNum = (rule, value, callback) => {
        const age = /^[0-9]*$/;
        if (age.test(value)) {
          return callback();
        }
        callback(new Error("年龄只能为数字"));
      };
        return {
          queryInfo:{
            pagenum: 1,
            pagesize: 2
          },
          searchInfo:'',
          adminList: [],
          temp:[],
          addLoading: false,
          editLoading: false,
          addDialogVisible: false,
          editDialogVisible: false,
          addForm: {},
          editForm: {},
          addFormRules: {
            username: [
              { required: true, message: '用户名不能为空', trigger: 'blur' },
              { min: 2, max: 15, message: '输入用户名格式不正确', trigger: 'blur' }
            ],
            password: [
              { required: true, message: '密码不能为空', trigger: 'blur' },
              { min: 5, max: 20, message: '输入密码格式不正确', trigger: 'blur' }
            ],
            realName: [
              { required: true, message: '真实姓名不能为空', trigger: 'blur' },
              { min: 2, max: 4, message: '输入真实姓名格式不正确', trigger: 'blur' }
            ],
            age: [
              { required: true, message: '年龄不能为空', trigger: 'blur' },
              { validator: isNum, max: 2, message: '输入正确年龄', trigger: 'blur' }
            ],
            gender: [
              { required: true, message: '请选择性别', trigger: 'blur' }
            ],
            phone: [
              { required: true, message: '手机号码不能为空', trigger: 'blur' },
              { validator: isNum, min: 11, max: 11, message: '输入手机格式不正确', trigger: 'blur' }
            ],
          },
        }
      },
    created() {

    },
    mounted() {
      this.getAdminList()
    },
    methods: {
      sfktFormate(row){
        if (row.gender == 1) {
          return '男';
        } else if(row.gender == 2){
          return '女';
        }
      },
      createInfo(payLoad){
        axios.post('/create', payLoad).then( res => {
          if (res.data.code == 0) {
            this.$message.success(res.data.msg)
            this.addDialogVisible = false;
          }else{
            this.$message.error(res.data.msg)
          }
          this.getAdminList();
        }).catch( error => {
          this.$message.error(error.msg)
        })
      },
      // 关闭对话框时清空input内数据
      closeDialog(){
        this.$refs.addFormRef.resetFields();
      },
      getAdminList(){
        axios.get('/list').then( response => {
          console.log(response)
          this.adminList = response.data.data;
        }).catch( error => {
          this.$message.error(error.msg)
        });
      },
      deleteAdminInfoById(params) {
        axios({
          method: 'delete',
          url:'/delete',
          data:{
            id:params.id
          }
        }).then( res => {
          if (res.data.code == 0) {
            this.$message.success(res.data.msg)
          }else{
            this.$message.error(res.data.msg)
          }
          this.getAdminList();
        }).catch( error => {
          this.$message.error(error.msg)
        });
      },
      updateAdminInfoById(payLoad) {
        axios({
          method: 'put',
          url:'/modify',
          data:payLoad
        }).then( res => {
          if (res.data.code == 0) {
            this.$message.success(res.data.msg)
            this.editDialogVisible = false;
          }else{
            this.$message.error(res.data.msg)
          }
          this.getAdminList();
        }).catch(err => {
          this.$message.error(err.msg)
        })
      },
      changeStatusToRecovery(payLoad){
        axios({
          method: 'post',
          url:'/recovery',
          data:payLoad
        }).then(res => {
          if (res.data.code == 0) {
            this.$message.success(res.data.msg)
            this.getUserList();
          }else{
            this.$message.error(res.data.msg)
          }
        }).catch(err=> {
          console.log(err);
        })
      },
      changeStatusToDisable(payLoad){
        axios({
          method: 'post',
          url:'/disable',
          data:payLoad
        }).then(res => {
          if (res.data.code == 0) {
            this.$message.success(res.data.msg)
            this.getUserList();
          }else{
            this.$message.error(res.data.msg)
            setTimeout(()=>{
              location.reload()
            },1000)
          }
          this.getUserList();
        }).catch(err=> {
          console.log(err);
        })
      },
      // 监听pagesize改变的事件
      handleSizeChange(newSize) {
        this.queryInfo.pagesize = newSize
        this.getAdminList()
      },
      handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage
        this.getAdminList()
      },
      async handleAdd(){
        this.addDialogVisible = true
        this.addForm = {
          username: '',
          realName: '',
          password: '',
          phone: '',
          gender: '',
          role:'系统管理员'
        };
      },
      createSubmit() {
        this.$refs.addFormRef.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交？', '提示', {}).then(() => {
              this.addLoading = true;
              let addPara = new URLSearchParams();
              addPara.append("username", this.addForm.username);
              addPara.append("realName", this.addForm.realName);
              addPara.append("password", this.addForm.password);
              addPara.append("age", this.addForm.age);
              addPara.append("phone", this.addForm.phone);
              addPara.append("gender", this.addForm.gender);
              addPara.append("role", this.addForm.role);
              this.createInfo(addPara)
            })
          }
        })
      },
      editSubmit() {
        this.$refs.editFormRef.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交？', '提示', {}).then(() => {
              this.editLoading = true;
              this.updateAdminInfoById(this.editForm)
            })
          }
        })
      },
      async handleDelete(key, keyInfo) {
        this.$confirm('将软删除该管理员, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then( ()=> this.deleteAdminInfoById(keyInfo))
            .catch(()=>{})
      },
      async handleEdit(key, keyInfo) {
        this.editDialogVisible = true
        this.editForm = {
          id: keyInfo.id,
          username: keyInfo.username,
          realName: keyInfo.realName,
          gender: keyInfo.gender,
          phone: keyInfo.phone
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
        this.searchAdmin(this.searchInfo)
      },
      searchAdmin(payLoad){
        const data = {username:payLoad}
        axios({
          method: 'post',
          url:'/search',
          data:data
        }).then( res =>{
          if(res.data.code === 0){
            this.$message.success(res.data.msg)
            this.adminList = res.data.data
          }else {
            this.$message.error(res.data.msg)
            this.adminList = res.data.data
          }
        }).catch( err =>{
          this.$message.success(err.msg)
        })
      },
    }
  }
</script>

<style scoped>

</style>
