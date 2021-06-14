<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item >商品管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/goods1' }">商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model="searchInfo" clearable>
            <el-button slot="append" icon="el-icon-search" @click="searchSubmit"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加类别</el-button>
        </el-col>
      </el-row>
      <el-table :data="goodsClassList"  row-key="id"  default-expand-all style="width: 100%" :tree-props="{children: 'children', hasChildren: 'hasChildren'}" border stripe>
        <el-table-column type="index" label="#"/>
        <el-table-column prop="id" label="分类id"/>
        <el-table-column prop="parentId" label="父级id"/>
        <el-table-column prop="name" label="名字"/>
        <el-table-column prop="createTime" label="创建日期" :formatter="formatDate"/>
        <el-table-column prop="operation" label="操作" width="80%">
          <template slot-scope="scope">
            <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="handleDelete(scope.$index, scope.row)"
            />
<!--            <el-button-->
<!--                type="primary"-->
<!--                icon="el-icon-edit"-->
<!--                size="mini"-->
<!--                @click="handleEdit(scope.$index, scope.row)"-->
<!--            />-->
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
          @current-change="handleCurrentChange"
          :current-page="pagenum"
          layout="prev, pager, next, jumper"
          :total="total">
      </el-pagination>
    </el-card>
    <!-- 添加对话框 -->
    <el-dialog title="添加类别" :visible.sync="addDialogVisible" @close="closeDialog" width="40%">
      <!-- 内容主体 -->
      <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="80px">
        <el-form-item label="父级id" prop="parentId" style="width:80%">
          <el-input v-model="addForm.parentId"></el-input>
        </el-form-item>
        <el-form-item label="名字" prop="name" style="width:80%">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="createSubmit()">确定</el-button>
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
      pagenum: 1,
      searchInfo:'',
      total: 0,
      addLoading: false,
      goodsClassList: [],
      addDialogVisible: false,
      // editDialogVisible: false,
      addForm: {
        parentId: '',
        name: '',
      },
      // editForm: {},
      addFormRules: {
        parentId: [
          { required: true, message: '商品编号不能为空', trigger: 'blur' },
        ],
        name: [
          { required: true, message: '商品名不能为空', trigger: 'blur' },
        ]
      }
    }
  },
  created() {

  },
  mounted() {
    this.getGoodsClassList()
  },
  methods: {
    getGoodsClassList(){
      axios.get('/category/list').then( response => {
        this.goodsClassList = this.listToTree(response.data.data);
        return response.data.res;
      }).catch( error => {
        console.log(error);
      });
    },
    createInfo(data){
      axios.post('/category/create',data).then( res => {
        this.$message.success(res.data.msg)
        this.addDialogVisible = false;
        this.getGoodsClassList();
      }).catch( error => {
        this.$message.success(error.msg)
      })
    },
    // 关闭对话框时清空input内数据
    closeDialog(){
      this.$refs.addFormRef.resetFields();
    },
    deleteGoodsClassInfoById(params) {
      axios({
        method: 'delete',
        url:'/category/delete',
        data:{
          id:params.id
        }
      }).then( res => {
        this.$message.error(res.data.msg)
        this.getGoodsClassList()
      }).catch( error => {
        this.$message.error(error.msg)
      });
    },
    // updateGoodsClassInfoById(id, payLoad) {
    //   axios.put('/good/'+ id, payLoad).then( response => {
    //     console.log(response);
    //     this.editDialogVisible = false;
    //     this.getGoodsClassList();
    //   })
    // },
    handleCurrentChange (newPage) {
      this.pagenum = newPage
      this.getGoodsClassList()
    },
    async handleAdd(){
      this.addDialogVisible = true
    },
    createSubmit() {
      this.$refs.addFormRef.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交？', '提示', {}).then(() => {
            this.addLoading = true;
            let addPara = new URLSearchParams();
            addPara.append("parentId", this.addForm.parentId);
            addPara.append("name", this.addForm.name);
            this.createInfo(addPara)
          })
        }
      })
    },
    async handleDelete(key, keyInfo) {
      this.$confirm('将软删除该类别, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then( ()=> this.deleteGoodsClassInfoById(keyInfo))
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
    },
    searchSubmit(){
      this.searchAdmin(this.searchInfo)
    },
    searchAdmin(payLoad){
      const data = {name:payLoad}
      axios({
        method: 'post',
        url:'category/search',
        data:data
      }).then( res =>{
        if(res.data.code === 0){
          this.$message.success(res.data.msg)
          this.goodsClassList = res.data.data
        }else{
          this.$message.error(res.data.msg)
          this.goodsClassList = res.data.data
          }
      }).catch( err =>{
        this.$message.success(err.msg)
      })
    },
    listToTree(data){
      let res = {};
      for (let i = 0; i < data.length; i++) {
        let row = data[i];
        // 此行代码用以统一根节点的paren_id, 跟节点的parent_id 可以为 0 或 null
        row.parentId = row.parentId ? row.parentId : 0
        if (res[row.id]) {
          Object.assign(res[row.id], {id: row.id, name: row.name,createTime:row.createTime,parentId:row.parentId});
        } else {
          res[row.id] = {id: row.id, name: row.name, createTime:row.createTime,parentId:row.parentId,children: []};
        }
        if (res[row.parentId]) {
          res[row.parentId].children.push(res[row.id]);
        } else {
          res[row.parentId] = {children: [res[row.id]]};
        }
      }
      return res[1].children
    },
  }
}
</script>

<style scoped>

</style>
