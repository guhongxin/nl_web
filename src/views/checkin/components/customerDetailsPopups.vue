<template>
   <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      :width="widthSize"
      class="customizeDetailsDialog"
      :beforeClose='dialogClosed'
    >
    <div class="dialog-content1">
      <el-row :gutter="30">
        <el-col :span="6">
          <div class="img-box">
            <img :src='contentData1.head_portrait?contentData1.head_portrait:defaulthead' >
          </div>
        </el-col>
        <el-col :span="18">
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
  </el-dialog>
</template>
<script>
import vipCardStyle from './vipCardStyle'
import { channelDictionary, purposeDictionary, intent_levelDictionary, timeFormat2 } from '@/utils/comm'
export default {
  name: 'customerDetailsPopups',
  props: {
    dialogVisible: {
      type: Boolean,
      default() {
        return true
      }
    },
    title: {
      type: String
    },
    widthSize: {
      type: String,
      default() {
        return '25%'
      }
    },
    salesData: {
      type: Array
    },
    contentData: {
      type: Array
    }
  },
  created() {
  },
  data() {
    return {
      head_portrait: '',
      contentData1: {},
      contentData2: {},
      contentData3: [],
      sellList: [],
      isSecondCard: false
    }
  },
  methods: {
    dialogClosed() {
      this.$emit('popupsClosed')
    },
    changeSelecter(id, status) {
      this.$emit('changeSelecter', id, status)
    },
    setDefaultDate(params) {
      this.contentData1 = {
        name: params.name,
        sex: params.sex,
        phone: params.phone,
        id_card_no: params.id_card_no,
        birthday: params.birthday,
        remark: params.remark,
        head_portrait: params.head_portrait,
        is_register_app: params.is_register_app
      }
      let _contentData2 = {
        channel: channelDictionary(params.channel),
        purpose: purposeDictionary(params.purpose),
        intent_level: intent_levelDictionary(params.intent_level),
        employee_name: params.employee_name,
        created_at: params.created_at,
        consultant_name: params.consultant ? params.consultant.name : '-',
        coach_name: params.coach ? params.coach.name : '-',
        sign_count: params.sign_count,
      }
      let _followUp = {}
      if (params) {
        if (new Date(params.consultant_last_followed_at) > new Date(params.coach_last_followed_at)) {
          _followUp = {
            followUpName: params.consultant ? params.consultant.name : '-',
            followUpTime: params.consultant_last_followed_at
          }
        } else {
          _followUp = {
            followUpName: params.coach ? params.coach.name : '-',
            followUpTime: params.coach_last_followed_at
          }
        }
      }
      this.contentData2 = Object.assign({}, _contentData2, _followUp)
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
.customizeDetailsDialog {
  /deep/ .el-dialog {
    border-radius: 5px;
  }
  /deep/ .el-dialog__header {
    border: 1px solid #cccccc;
    border-radius: 5px 5px 0px 0px;
  }
  /deep/ .el-dialog__body {
    border-radius: 0px 0px 5px 5px;
    border-top: 1px solid #cccccc;
    padding: 10px 20px;
  }
}
.customizeDetailsDialog {
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
  }
}
.remark-box {
  width: 90%;
  display: inline-block;
  vertical-align: text-top;
  max-height: 60px;
  overflow: hidden;
  overflow-y: auto;
}
</style>

