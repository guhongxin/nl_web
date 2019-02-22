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
        <el-col :span="8">
          <div class="img-box">
            <img :src="customermessage[0]?(customermessage[0].head_portrait?customermessage[0].head_portrait:defaulthead):defaulthead" >
          </div>
        </el-col>
        <el-col :span="16">
          <el-row :gutter="10">
              <el-col :span="6">
                <h3>{{customermessage[0]?customermessage[0].name:'-'}}</h3>
              </el-col>
              <el-col :span="8">
                <h3>
                  性别: <span>{{customermessage[0]?getsex_zh(customermessage[0].sex) : '-'}}</span>
                </h3>
              </el-col>
          </el-row>
          <el-row :gutter="30" style="margin-top:5px">
            <el-col :span="24">
              <label>
                手机号码:<span>{{customermessage[0]?customermessage[0].phone:'-'}}</span><span class="bz"></span>
              </label>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <label>
                身份证:<span>{{customermessage[0]?customermessage[0].id_card_no:'-'}}</span>
              </label>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <label>
                生日:<span>{{customermessage[0]?customermessage[0].birthday:'-'}}</span>
              </label>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <label>
                备注:<span>{{customermessage[0]?customermessage[0].remark:'-'}}</span>
              </label>
            </el-col>
          </el-row>
        </el-col>
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
    customermessage: {
      type: Array
    },
    contentData: {
      type: Array
    }
  },
  data() {
    return {
      head_portrait: ''
    }
  },
  created() {
  },
  methods: {
    dialogClosed() {
      this.$emit('popupsClosed')
    },
    changeSelecter(id, status) {
      this.$emit('changeSelecter', id, status)
    },
    // setDefaultVule() {
    //   let _vips = []
    //   let type = ''
    //   let currentValue = this.customermessage[0].limitation_card
    //   if (this.customermessage.times_card.length !== 0) {
    //     currentValue.push(this.customermessage[0].times_card)
    //   }
    //   for (let i = 0; i < currentValue.length; i++) {
    //     if (currentValue.type === 1) {
    //       type = '时效卡'
    //     } else {
    //       type = '次卡'
    //     }
    //     let obj = {
    //       vipCardType: type,
    //       VipCardData: {
    //         type: currentValue.type,
    //         card_name: currentValue.card_name,
    //         total_times: currentValue.total_times,
    //         end_date: currentValue.end_date,
    //         card_no: currentValue.card_no,
    //         card_image: currentValue.card_image
    //       }
    //     }
    //     _vips.push(obj)
    //   }
    //   this.contentData = _vips
    //   console.log(this.contentData)
    // }
    getsex_zh(params) {
      let result = ''
      switch (params) {
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
    }
  },
  components: {
    vipCardStyle
  }
}
</script>
<style lang="scss" scoped>
.customizeDetailsDialog {
  .el-dialog {
    border-radius: 5px;
  }
  .el-dialog__header {
    border: 1px solid #cccccc;
    border-radius: 5px 5px 0px 0px;
  }
  .el-dialog__body {
    border-radius: 0px 0px 5px 5px;
    border-top: 1px solid #cccccc;
  }
}
.customizeDetailsDialog {
  .dialog-content1{
    margin-top: 15px;
    .img-box{
      width: 150px;
      height: 150px;
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
      color: #000;
      font-size: 20px;
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
    label{
      span{
        margin-left: 5px;
      }
    }
  }
  .dialog-content3{
    padding: 20px 15px;
  }
}
</style>

