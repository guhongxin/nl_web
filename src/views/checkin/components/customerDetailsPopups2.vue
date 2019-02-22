<template>
  <div class="customerDetails-box">
    <div class="dialog-content1">
      <el-row :gutter="30">
        <el-col :span="8">
          <div class="img-box">
            <img :src='contentData1.head_portrait?contentData1.head_portrait:defaulthead' >
          </div>
        </el-col>
        <el-col :span="16">
          <el-row :gutter="10">
              <el-col>
                <h3>{{contentData1.name}}  &nbsp;&nbsp;&nbsp;&nbsp;性别:<span>{{getSex_zh(contentData1.sex)}}</span></h3>
              </el-col>
          </el-row>
          <el-row :gutter="30" style="margin-top:5px">
            <el-col :span="24">
              <label>
                手机号码:<span>{{contentData1.phone}}</span><span class="bz" style="margin-left:5px">({{contentData1.is_register_app?"已注册":"未注册"}})</span>
              </label>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <label>
                身份证:<span>{{contentData1.id_card_no?contentData1.id_card_no:'-'}}</span>
              </label>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <label>
                生日:<span>{{contentData1.birthday}}</span>
              </label>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <label>
                备注:<div class="remark-box"><span>{{contentData1.remark}}</span></div>
              </label>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
    <div class="dialog-content2">
      <el-row :gutter="5">
        <el-col :span="5"><label>来源渠道:<span>{{contentData2.channel}}</span></label></el-col>
        <el-col :span="5"> <label>健身目的:<span>{{contentData2.purpose}}</span></label></el-col>
        <el-col :span="4"><label>意向程度:<span>{{contentData2.intent_level}}</span></label></el-col>
        <el-col :span="6"><label>添加时间:<span style="font-size:12px;">{{contentData2.created_at?gettimeFormat2(contentData2.created_at):''}}</span></label></el-col>
        <el-col :span="4"><label>添加人:<span>{{contentData2.employee_name?contentData2.employee_name:'管理员'}}</span></label></el-col>
      </el-row>
      <el-row :gutter="5">
        <el-col :span="5"><label>所属会籍:<span>{{contentData2.consultant_name}}</span></label></el-col>
        <el-col :span="5"><label>所属教练:<span>{{contentData2.coach_name}}</span></label></el-col>
        <el-col :span="4"><label>签到次数:<span>{{contentData2.sign_count}}</span></label></el-col>
        <el-col :span="6"> <label>最后跟进:<span style="font-size:12px;">{{gettimeFormat2(contentData2.followUpTime)}}</span></label></el-col>
        <el-col :span="4"><label>跟进人:<span>{{contentData2.followUpName}}</span></label></el-col>
      </el-row>
    </div>
    <div class='dialog-content3'>
      <el-row :gutter="20">
        <el-col v-for="(item,key) in contentData" :key="key" :span="12" style="margin-top:10px;">
          <vip-card-style :vipCardData="item.vipCardData" @changeSelect="changeSelecter"></vip-card-style>
        </el-col>
      </el-row> 
    </div>
  </div>
</template>
<script>
import vipCardStyle from './vipCardStyle'
import { timeFormat2 } from '@/utils/comm'
export default {
  name: 'customerDetailsPopups',
  props: {
    contentData: {
      type: Array
    },
    contentData2: {
      type: Object
    },
    contentData1: {
      type: Object
    }
  },
  created() {
  },
  data() {
    return {
      head_portrait: '',
    }
  },
  methods: {
    changeSelecter(id, status) {
      this.$emit('changeSelecter', id, status)
    },
    getSex_zh(param) {
      let result = ''
      switch (param) {
        case 0:
          result = '未知'
          break
        case 1:
          result = '男'
          break
        case 2:
          result = '女'
          break
      }
      return result
    },
    gettimeFormat2(param) {
      return timeFormat2(param)
    }
  },
  components: {
    vipCardStyle
  }
}
</script>
<style lang="scss" scoped>
.customerDetails-box{
  margin: 0px 40px;
}
.dialog-content1{
  margin-top: 15px;
  .img-box{
    width: 150px;
    height: 150px;
    border: 1px solid #CCCCCC;
    border-radius: 5px;
    overflow: hidden;
    margin-left: 50px;
    img{
      width: 100%;
      height: 100%;
    }
  }
  h3{
    margin-top: 4px;
    color: #000000;
    font-size: 16px;
  }
  &:nth-child(n + 3){
    margin-top: 5px;
  }
  .el-row label{
    color: #000;
    font-weight: normal;
    span{
      margin-left: 5px;
    }
    .bz{
      color: #1AB394;
      font-weight: normal;
      margin-left: 5px;
    }
  }
}
.dialog-content2{
  width: 95%;
  border-top: 1px solid #D8D8D8;
  border-bottom: 1px solid #D8D8D8;
  overflow: hidden;
  padding-top: 10px;
  padding-bottom: 10px;
  margin: 0px auto;
  margin-top: 10px;
  box-sizing: border-box;
  color: #666;
  /deep/ label{
    font-weight: normal;
    span{
      margin-left: 5px;
    }
  }
}
.dialog-content3{
  padding: 20px 15px;
  max-height: 450px;
  overflow: hidden;
  overflow-y: auto
}
.remark-box{
  width:90%;
  display:inline-block;
  vertical-align: text-top;
  max-height: 60px;
  overflow: hidden;
  overflow-y: auto;
  margin-left: 10px;
}
</style>

