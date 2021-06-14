<template>
  <div>
<!--     面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/rule' }">积分规则修改</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-form>
        <el-form-item label="兑换积分规则">
          <el-select v-model="ruleData.changeRule">
            <el-option
                v-for="item in changeRulesSelect"
                :key="item"
                :label="item"
                :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="获取积分规则">
          <el-select v-model="ruleData.getRule">
            <el-option
                v-for="item in getRulesSelect"
                :key="item"
                :label="item"
                :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <span :formatter="formatDate">上次修改时间：{{updateTime}}</span>
        </el-form-item>
      </el-form>
      <el-button type="primary" round style="margin: 80px 0 0 250px" @click="submitRule">提交</el-button>
    </el-card>
  </div>
</template>

<script>
  import axios from "axios";
  export default{
    data(){
      return{
        changeRulesSelect:[50,60,70,80,90,100,120,140,160,180,200],
        getRulesSelect:[5,10,20,30,40,50,60,70,80,90,100],
        ruleData:{
          changeRule:'',
          getRule:''
        },
        updateTime:''
      }
    },
    mounted() {
      this.getRuleInfo()
    },
    methods: {
      getRuleInfo(){
        axios.get('/rule/ruleInfo').then( res => {
          this.ruleData = res.data.data[0];
          this.updateTime = this.formatDate(this.ruleData.updateTime)
        }).catch( error => {
          console.log(error);
        });
      },
      modifyRule(){
        axios({
          method: 'put',
          url:'/rule/modify',
          data:this.ruleData
        }).then( res =>{
          if(res.data.code === 0){
            this.$message.success(res.data.msg)
            this.getRuleInfo()
          }else{
            this.$message.error(res.data.msg)
          }
        }).catch( err =>{
          this.$message.success(err.msg)
        })
      },
      submitRule(){
        this.$confirm('确认提交？', '提示', {}).then(() => {
          this.modifyRule()
        })
      },
      formatDate(row) {
        console.log(row)
        if (row === null) {
          return
        } else {
          let date = new Date(parseInt(row) * 1000);
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
    }
  }
</script>

<style scoped>

</style>
