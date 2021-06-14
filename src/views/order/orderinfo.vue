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
      </el-row>
      <el-table :data="orderList" style="width: 100%" border stripe>
        <el-table-column type="index" label="#"/>
        <el-table-column prop="id" label="订单编号" width="70%"/>
        <el-table-column prop="username" label="用户名称" width="80%"/>
        <el-table-column prop="totalPrice" label="订单总价" width="80%"/>
        <el-table-column prop="type" label="支付方式" width="80%" :formatter="payType"/>
        <el-table-column prop="phone" label="用户联系方式" width="100%"/>
        <el-table-column prop="createTime" label="创建时间" width="160%" :formatter="formatDate"/>
        <el-table-column prop="updateTime" label="更新时间" width="160%" :formatter="formatDate"/>
        <el-table-column prop="address" label="地址"/>
        <el-table-column prop="status" label="订单状态" width="100%" :formatter="orderStatus"/>
        <el-table-column prop="operation" label="操作" width="120%">
          <template slot-scope="scope">
            <el-button type="text" @click="showDetail(scope.row)">详情</el-button>
            <el-button type="primary" size="mini" @click="handleSendOut(scope.row)">发货</el-button>
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
    <el-dialog
        title="订单详情"
        :visible.sync="showOrderDetail"
        width="80%">
      <el-table :data="orderDetail">
        <el-table-column
            label="商品编号"
            prop="goodId">
        </el-table-column>
        <el-table-column
            label="商品图片"
            prop="image_url">
          <template slot-scope="scope">
            <el-image :src="scope.row.image_url" style="width: 20%;height: 20%"/>
          </template>
        </el-table-column>
        <el-table-column
            label="商品名"
            prop="goodName">
        </el-table-column>
        <el-table-column
            label="数量"
            prop="count">
        </el-table-column>
        <el-table-column
            label="单价"
            prop="price">
        </el-table-column>
      </el-table>
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
        pagenum: 1,
        pagesize: 2
      },
      searchInfo:'',
      addLoading: false,
      orderList: [],
      orderDetail:{},
      showOrderDetail:false
    }
  },
  created() {

  },
  mounted() {
    this.getOrderList()
  },
  methods: {
    orderStatus(row){
      if (row.status == 1) {
        return '未发货';
      } else if(row.status == 2){
        return '已发货';
      } else if(row.status ==3){
        return '已收货';
      }
    },
    payType(row){
      if (row.type === 0) {
        return '金额支付';
      } else if(row.type === 1){
        return '积分兑换';
      }
    },
    getOrderList(){
      axios.get('/order/list').then( res => {
        this.orderList = res.data.data
      })
    },
    sendOutOrder(payLoad){
      axios({
        method: 'post',
        url:'/order/sendOut',
        data:payLoad
      }).then( res=> {
        this.$message.success(res.data.msg)
        this.getOrderList()
      })
    },
    searchOrder(payLoad){
      const data = {username:payLoad}
      axios({
        method: 'post',
        url:'/order/search',
        data:data
      }).then( res =>{
        if(res.data.code === 0){
          this.$message.success(res.data.msg)
          this.orderList = res.data.data
        }else{
          this.$message.error(res.data.msg)
          this.orderList = null
        }
      }).catch( err =>{
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
    searchSubmit(){
      this.searchOrder(this.searchInfo)
    },
    showDetail(val){
      this.showOrderDetail = true
      this.orderDetail = val.children
    },
    handleSendOut(val){
      this.sendOutOrder(val)
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
