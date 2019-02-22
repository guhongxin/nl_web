<template>
  <el-dialog
      title="会员信息"
      :width="widthSize"
      :visible.sync="dialogVisible"
      class="customizeDetailsDialog"
      :beforeClose="dialogClosed"
    >
      <div v-if="customerList&&customerList.length===1" style="max-height:730px;margin-top:30px;padding-bottom:30px;">
        <customer-details-popups2
          :contentData1="setcontentData1(customerList[0])"
          :contentData2="setDefaultDate(customerList[0])"
          :contentData="setcontentData(customerList[0])"
          @changeSelecter="changeSelecter">
        </customer-details-popups2>
      </div>
      <el-carousel arrow="always" :autoplay="false" v-else>
        <el-carousel-item v-for="(item,key) in customerList" :key="key">
          <customer-details-popups2
           :contentData1="setcontentData1(item)"
           :contentData2="setDefaultDate(item)"
           :contentData="setcontentData(item)"
           @changeSelecter="changeSelecter">
          </customer-details-popups2>
        </el-carousel-item>
      </el-carousel>
    </el-dialog>
</template>
<script>
import customerDetailsPopups2 from './customerDetailsPopups2'
import { channelDictionary, purposeDictionary, intent_levelDictionary } from '@/utils/comm'
export default {
  name: 'customerDetailBox',
  props: {
    widthSize: {
      type: String,
      default() {
        return '1100px'
      }
    },
    contentData: {
      type: Array
    }
  },
  data() {
    return {
      customerList: [],
      dialogVisible: false
    }
  },
  created() {
  },
  components: {
    customerDetailsPopups2
  },
  methods: {
    showDialog(data) {
      this.customerList = data
      this.dialogVisible = true
    },
    closeDialog() {
      this.dialogVisible = false
      this.customerList = []
    },
    dialogClosed() {
      this.dialogVisible = false
      this.customerList = []
    },
    changeSelecter(id, status) {
      this.$emit('changeSelecter', id, status)
    },
    setcontentData1(params) {
      let contentData1 = {
        name: params.name,
        sex: params.sex,
        phone: params.phone,
        id_card_no: params.id_card_no,
        birthday: params.birthday,
        remark: params.remark,
        head_portrait: params.head_portrait,
        is_register_app: params.is_register_app
      }
      return contentData1
    },
    setDefaultDate(params) {
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
      let contentData2 = Object.assign({}, _contentData2, _followUp)
      return contentData2
    },
    setcontentData(params) {
      let _vips = []
      let type = ''
      let currentValue = params.vips
      for (let i = 0; i < currentValue.length; i++) {
        if (currentValue[i].type === 1) {
          type = '时效卡'
        } else {
          type = '次卡'
        }
        let obj = {
          vipCardType: type,
          vipCardData: {
            type: currentValue[i].type,
            card_name: currentValue[i].card_name,
            total_times: currentValue[i].total_times,
            end_date: currentValue[i].end_date,
            over_date: currentValue[i].over_date,
            card_no: currentValue[i].card_no,
            card_image: currentValue[i].card_image,
            id: currentValue[i].id,
            status: currentValue[i].status, // 卡锁定状态，0：未锁定，1：锁定
            gym_sign_status: currentValue[i].gym_sign_status, // 卡状态 0：已入场，1或2：未入场
            is_active: currentValue[i].is_active, // 0，未激活，1激活，2.失效
            // leftTime: parseInt(currentValue[i].total_times) - parseInt(currentValue[i].use_times), // 次卡过期
            is_stoped: currentValue[i].is_stoped, // is_stoped:0 未停卡， 1：已停卡
            sign_card_no: this.sign_card_no,
            start_date: currentValue[i].start_date,
            master_id: currentValue[i].master_id,
            gym: currentValue[i].gym
          }
        }
        _vips.push(obj)
      }
      let contentData = _vips
      return contentData
    }
  }
}
</script>
<style lang="scss" scoped>
.customizeDetailsDialog{
  /deep/ .el-carousel__container{
    height: 730px;
  }
  /deep/ .el-dialog__body{
    padding: 0px;
  }
  /deep/ .el-carousel__arrow--left {
    left: 0px;
  }
  /deep/ .el-carousel__arrow--right {
    right: 0px;
  }
  /deep/ .el-carousel__button {
    background-color: #cccccc;
  }
}
</style>

