<template xmlns="http://www.w3.org/1999/html">
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
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
          <el-button type="primary" @click="addDialogVisible = true">添加商品</el-button>
        </el-col>
      </el-row>
      <el-table :data="goodsList" style="width: 100%" border stripe>
        <el-table-column type="index" label="#"/>
        <el-table-column prop="id" label="商品编号"/>
        <el-table-column prop="image_url" label="商品图片">
          <template slot-scope="scope">
            <el-image :src="scope.row.image_url" style="width: 40%;height: 40%"/>
          </template>
        </el-table-column>
        <el-table-column prop="goodName" label="商品名称"/>
        <el-table-column prop="type" label="商品类别"/>
        <el-table-column prop="buildDate" label="生产日期"/>
        <el-table-column prop="supplier" label="供应商"/>
        <el-table-column prop="status" label="上架状态" width="100%">
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
        <el-table-column prop="quantity" label="数量" width="100%"/>
        <el-table-column prop="price" label="单价" width="100%"/>
        <el-table-column prop="operation" label="操作" width="190%">
          <template slot-scope="scope">
            <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="handleDelete(scope.$index, scope.row)"
            />
            <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="handleEdit(scope.$index, scope.row)"
            />
            <el-button type="text" @click="handleAddImg(scope.row.id)">添加图片</el-button>
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
    <el-dialog title="添加商品" :visible.sync="addDialogVisible" @close="closeDialog" width="30%">
      <!-- 内容主体 -->
      <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="80px" style="width:100%">
        <el-form-item label="商品名" prop="goodName">
          <el-input v-model="addForm.goodName"></el-input>
        </el-form-item>
        <el-form-item label="小标题" prop="smallTitle">
          <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 6}"
              placeholder="请输入内容"
              v-model="addForm.smallTitle">
          </el-input>
        </el-form-item>
        <el-form-item label="重量" prop="weight">
          <el-input v-model="addForm.weight"></el-input>
        </el-form-item>
        <el-form-item label="商品类别" prop="class">
          <el-select v-model="addForm.class" @change="typeChange">
            <el-option
                v-for="item in typeList"
                :key="item.id"
                :label="item.name"
                :value="item.name"/>
          </el-select>
        </el-form-item>
        <el-form-item label="商品小类" prop="type">
          <el-select v-model="addForm.type">
            <el-option
                v-for="item in childrenType"
                :key="item.id"
                :label="item.name"
                :value="item.name"/>
          </el-select>
        </el-form-item>
        <el-form-item label="生产日期" prop="buildDate">
          <el-date-picker
              v-model="addForm.buildDate"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="商品厂家" prop="supplier">
          <el-input v-model="addForm.supplier"></el-input>
        </el-form-item>
        <el-form-item label="商品数量" prop="quantity">
          <el-input v-model="addForm.quantity"></el-input>
        </el-form-item>
        <el-form-item label="商品单价" prop="price">
          <el-input v-model="addForm.price"></el-input>
        </el-form-item>
        <el-form-item label="配送范围" prop="delivery">
          <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 6}"
              placeholder="请输入内容"
              v-model="addForm.delivery">
          </el-input>
        </el-form-item>
        <el-form-item label="商品详情" prop="detail">
          <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 6}"
              placeholder="请输入内容"
              v-model="addForm.detail">
          </el-input>
        </el-form-item>
        </el-form>
        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="createSubmit()">确定</el-button>
        <el-button @click="addDialogVisible = false">取消</el-button>
      </span>
    </el-dialog>
    <el-dialog title="编辑" :visible.sync="editDialogVisible" width="40%">
      <!-- 内容主体 -->
      <el-form ref="editFormRef" :model="editForm" :rules="addFormRules" label-width="80px">
        <el-form-item label="商品名" prop="goodName">
          <el-input v-model="editForm.goodName"></el-input>
        </el-form-item>
        <el-form-item label="小标题" prop="smallTitle">
          <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 6}"
              placeholder="请输入内容"
              v-model="editForm.smallTitle">
          </el-input>
        </el-form-item>
        <el-form-item label="重量" prop="weight">
          <el-input v-model="editForm.weight"></el-input>
        </el-form-item>
        <el-form-item label="商品类别" prop="class">
          <el-select v-model="editForm.class" @change="typeChange">
            <el-option
                v-for="item in typeList"
                :key="item.id"
                :label="item.name"
                :value="item.name"/>
          </el-select>
        </el-form-item>
        <el-form-item label="商品小类" prop="type">
          <el-select v-model="editForm.type">
            <el-option
                v-for="item in childrenType"
                :key="item.id"
                :label="item.name"
                :value="item.name"/>
          </el-select>
        </el-form-item>
        <el-form-item label="生产日期" prop="buildDate">
          <el-date-picker
              v-model="editForm.buildDate"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="商品厂家" prop="vender">
          <el-input v-model="editForm.supplier"></el-input>
        </el-form-item>
        <el-form-item label="商品数量" prop="quantity">
          <el-input v-model="editForm.quantity"></el-input>
        </el-form-item>
        <el-form-item label="商品单价" prop="price">
          <el-input v-model="editForm.price"></el-input>
        </el-form-item>
        <el-form-item label="配送范围" prop="delivery">
          <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 6}"
              placeholder="请输入内容"
              v-model="editForm.delivery">
          </el-input>
        </el-form-item>
        <el-form-item label="商品详情" prop="detail">
          <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 6}"
              placeholder="请输入内容"
              v-model="editForm.detail">
          </el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editSubmit">确定</el-button>
        <el-button @click="editDialogVisible = false">取消</el-button>
      </span>
    </el-dialog>
    <el-dialog title="添加图片" :visible.sync="AddImgDialogVisible" width="20%">
      <el-form :model="imgForm">
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
  data() {
    // 限定只能为数字规则
    const isPrice = (rule, value, callback) => {
      const age = /^\d+(\.\d+)?$/;
      if (age.test(value)) {
        return callback();
      }
      callback(new Error("年龄只能为数字"));
    };
    const isNum = (rule, value, callback) => {
      const age = /^(0|[0-9]*)$/;
      if (age.test(value)) {
        return callback();
      }
      callback(new Error("年龄只能为数字"));
    };
    return {
      queryInfo: {
        pagenum: 1,
        pagesize: 2
      },
      selectId: '',
      searchInfo: '',
      addLoading: false,
      goodsList: [],
      allType: [],
      allTypes: [],
      typeList: [],
      childrenType: [],
      imageList: '',
      addDialogVisible: false,
      editDialogVisible: false,
      AddImgDialogVisible: false,
      imgForm: {
        file: '',
        id: ''
      },
      addForm: {
        goodName: '',
        smallTitle: '',
        weight: '',
        class: '',
        type: '',
        buildDate: '',
        supplier: '',
        status: '',
        quantity: '',
        price: '',
        file: ''
      },
      editForm: {},
      addFormRules: {
        goodName: [
          {required: true, message: '商品名不能为空', trigger: 'blur'},
          {min: 1, max: 50, message: '输入商品名不正确', trigger: 'blur'}
        ],
        class: [
          {required: true, message: '商品类别不能为空', trigger: 'blur'},
          {min: 2, max: 10, message: '输入商品类别格式不正确', trigger: 'blur'}
        ],
        buildDate: [
          {required: true, message: '生产日期不能为空', trigger: 'blur'}
        ],
        supplier: [
          {required: true, message: '商品厂家不能为空', trigger: 'blur'}
        ],
        quantity: [
          {required: true, message: '商品数量不能为空', trigger: 'blur'},
          {validator: isNum, message: '输入产品数量格式不正确', trigger: 'blur'}
        ],
        price: [
          {required: true, message: '商品单价不能为空', trigger: 'blur'},
          {validator: isPrice, message: '输入产品单价格式不正确', trigger: 'blur'}
        ]
      }
    }
  },
  watch: {
    'addForm.class': function (newValue, oldValue) {
      this.addForm.type = null
    }
  },
  created() {

  },
  mounted() {
    this.getGoodsList()
    this.getGoodType()
  },
  methods: {
    getGoodType() {
      axios.get('/category/list').then(res => {
        this.allType = res.data.data
        this.typeList = this.allType.filter(data => {
          if (data.parentId === 1)
            return {
              id: data.id,
              name: data.name
            }
        })
      })
    },
    getGoodsList() {
      axios.get('/goods/list').then(response => {
        this.goodsList = response.data.data;
        return response.data.res;
      }).catch(error => {
        this.$message.error(error.msg)
      });
    },
    searchSubmit() {
      this.searchGood(this.searchInfo)
    },
    createInfo(data) {
      axios.post('/goods/create', data).then(res => {
        this.$message.error(res.data.msg)
        this.addDialogVisible = false;
        this.getGoodsList();
      }).catch(error => {
        this.$message.error(error.msg)
      })
    },
    // 关闭对话框时清空input内数据
    closeDialog() {
      this.$refs.addFormRef.resetFields();
    },
    deleteGoodsInfoById(params) {
      axios({
        method: 'delete',
        url: '/goods/deleteGood',
        data: {
          id: params.id
        }
      }).then(res => {
        this.$message.success(res.data.msg)
        this.getGoodsList()
      }).catch(error => {
        this.$message.error(error.msg)
      });
    },
    updateGoodsInfoById(payLoad) {
      axios({
        method: 'put',
        url: '/goods/modify',
        data: payLoad
      }).then(res => {
        this.$message.success(res.data.msg)
        this.editDialogVisible = false;
        this.getGoodsList();
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    submitImg(payLoad) {
      axios({
        method: 'post',
        url: '/goods/saveImg',
        data: payLoad,
        headers: {'Content-type': 'multipart/form-data'}
      }).then(res => {
        this.$message.success(res.data.msg)
        this.editDialogVisible = false;
        this.getGoodsList();
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    changeStatusToRecovery(payLoad) {
      axios({
        method: 'post',
        url: '/goods/recovery',
        data: payLoad
      }).then(res => {
        this.$message.success(res.data.msg)
        this.editDialogVisible = false;
        this.getUserList();
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    changeStatusToDisable(payLoad) {
      axios({
        method: 'post',
        url: '/goods/disable',
        data: payLoad
      }).then(res => {
        this.$message.success(res.data.msg)
        this.editDialogVisible = false;
        this.getUserList();
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    searchGood(payLoad) {
      const data = {goodName: payLoad}
      axios({
        method: 'post',
        url: 'goods/search',
        data: data
      }).then(res => {
        if (res.data.code === 0) {
          this.$message.success(res.data.msg)
          this.goodsList = res.data.data
        } else {
          this.$message.error(res.data.msg)
          this.goodsList = res.data.data
        }
      }).catch(err => {
        this.$message.success(err.msg)
      })
    },
    // 监听pagesize改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getGoodsList()
    },
    async handleAdd() {
      this.addDialogVisible = true
    },
    handleAddImg(val) {
      this.AddImgDialogVisible = true
      this.selectId = val
    },
    createSubmit() {
      this.$refs.addFormRef.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交？', '提示', {}).then(() => {
            this.addLoading = true;
            let addPara = new URLSearchParams();
            addPara.append("goodName", this.addForm.goodName);
            addPara.append("smallTitle", this.addForm.smallTitle);
            addPara.append("weight", this.addForm.weight);
            addPara.append("class", this.addForm.class);
            addPara.append("type", this.addForm.type);
            addPara.append("buildDate", this.addForm.buildDate);
            addPara.append("supplier", this.addForm.supplier);
            addPara.append("quantity", this.addForm.quantity);
            addPara.append("price", this.addForm.price);
            addPara.append("detail", this.addForm.detail);
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
            this.updateGoodsInfoById(this.editForm)
          })
        }
      })
    },
    async handleDelete(key, keyInfo) {
      this.$confirm('将软删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => this.deleteGoodsInfoById(keyInfo))
          .catch(() => {
          })
    },
    async handleEdit(key, keyInfo) {
      this.editDialogVisible = true
      this.editForm = {
        id: keyInfo.id,
        goodName: keyInfo.goodName,
        class: keyInfo.class,
        type: keyInfo.type,
        buildDate: keyInfo.buildDate,
        supplier: keyInfo.supplier,
        quantity: keyInfo.quantity,
        price: keyInfo.price,
        weight: keyInfo.weight,
        smallTitle: keyInfo.smallTitle
      }
    },
    changeStatus(key, keyInfo) {
      if (key === true) {
        this.changeStatusToRecovery(keyInfo)
      } else if (key === false) {
        this.changeStatusToDisable(keyInfo)
      }
    },
    typeChange(key) {
      const selectType = this.allType.find(res => {
        if (res.name === key)
          return res
      })
      this.childrenType = this.allType.filter(data => {
        if (data.parentId === selectType.id)
          return data
      })
    },
    changeImg(file) {
      this.imgForm.file = file.raw
      this.imgForm.id = this.selectId
      let formData = new FormData()
      formData.append('files', this.imgForm.file)
      formData.append('id', this.imgForm.id)
      console.log(formData)
      console.log(this.imgForm)
      this.submitImg(formData)
    },
    createDetailImg(file) {
      this.addForm.file.push(file.raw)
    }
  }
}
</script>

<style scoped>

</style>
