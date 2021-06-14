<template xmlns="http://www.w3.org/1999/html">
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item >商品管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/goods1' }">商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-button type="primary" @click="addDialogVisible = true">添加轮播图</el-button>
      <el-table :data="bannersList" style="width: 100%" border stripe>
        <el-table-column type="index" label="#"/>
        <el-table-column prop="id" label="轮播图编号" width="100%"/>
        <el-table-column prop="image_url" label="轮播图图片" >
          <template slot-scope="scope">
            <el-image :src="scope.row.image_url" style="width: 40%;height: 40%"/>
          </template>
        </el-table-column>
        <el-table-column prop="operation" label="操作" width="190%">
          <template slot-scope="scope">
            <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="handleDelete(scope.$index, scope.row)"
            />
            <el-button type="text" @click="handleChangeImg(scope.row.id)">修改图片</el-button>
          </template>
        </el-table-column>
      </el-table>

    </el-card>
<!--     添加对话框-->
    <el-dialog title="添加轮播图" :visible.sync="addDialogVisible" width="30%">
      <!-- 内容主体 -->
      <el-form ref="addFormRef" :model="addForm" label-width="80px" style="width:100%">
        <el-form-item prop="file">
          <el-upload
              class="upload-demo"
              action="#"
              list-type="picture"
              :auto-upload="false"
              :on-change="addImg"
              :limit="1">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
    </el-dialog>
    <el-dialog title="修改图片" :visible.sync="changeImgDialogVisible" width="20%">
      <el-form ref="changeFormRef" :model="imgForm">
        <el-form-item prop="file">
          <el-upload
              class="upload-demo"
              action="#"
              list-type="picture"
              :auto-upload="false"
              :on-change="changeImg"
              :limit="1">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>

    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data(){
    return{
      addDialogVisible:false,
      changeImgDialogVisible:false,
      addForm: {
        file:''
      },
      imgForm: {
        file: '',
        id:''
      },
      bannersList:'',
      selectId:'',
    }
  },
  mounted() {
    this.getBannersList()
  },
  methods: {
    getBannersList(){
      axios.get('/banner/bannerlist').then( response => {
        this.bannersList = response.data.data;
        return response.data.res;
      }).catch( error => {
        this.$message.error(error.msg)
      });
    },
    createBanner(payLoad){
      axios({
        method: 'post',
        url:'/banner/create',
        data:payLoad,
        headers: {'Content-type': 'multipart/form-data'}
      }).then( res => {
        this.$message.success(res.data.msg)
        this.editDialogVisible = false;
        this.getBannersList();
      }).catch(err =>{
        this.$message.error(err.msg)
      })
    },
    deleteBannerById(params){
      axios({
        method: 'delete',
        url:'/banner/deleteBanner',
        data:{
          id:params.id
        }
      }).then( res => {
        this.$message.success(res.data.msg)
        this.getBannersList()
      }).catch( error => {
        this.$message.error(error.msg)
      });
    },
    submitImg(payLoad){
      axios({
        method: 'post',
        url:'/banner/changeImg',
        data:payLoad,
        headers: {'Content-type': 'multipart/form-data'}
      }).then( res => {
        this.$message.success(res.data.msg)
        this.editDialogVisible = false;
        this.getBannersList();
      }).catch(err =>{
        this.$message.error(err.msg)
      })
    },
    addImg(file){
      this.addForm.file = file.raw
      let formData = new FormData()
      formData.append('files',this.addForm.file)
      this.createBanner(formData)
    },
    handleDelete(key, keyInfo){
      this.$confirm('将软删除该轮播图, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then( ()=> this.deleteBannerById(keyInfo))
          .catch(()=>{})
    },
    handleChangeImg(val){
      this.changeImgDialogVisible = true
      this.selectId = val
    },
    changeImg(file){
      this.imgForm.file = file.raw
      this.imgForm.id = this.selectId
      let formData = new FormData()
      formData.append('files',this.imgForm.file)
      formData.append('id',this.imgForm.id)
      this.submitImg(formData)
    }
  }
}
</script>

<style scoped>

</style>
