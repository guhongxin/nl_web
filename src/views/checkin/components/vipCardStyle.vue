<template>
    <div class="vipCard-style">
      <div class="vipCard" :style="cardImage(vipCardData.card_image)">
        <div class="vipCard-head">
          <img :src='vipCardData.gym?vipCardData.gym.logo?vipCardData.gym.logo:defaulthead:defaulthead' />
          <p class="company">{{vipCardData.gym?vipCardData.gym.name:''}}</p>
          <div class="czbox" v-if="!(vipCardData.type===3)">
            <!-- gym_sign_status: 0 已入场 ；status:0未锁定 status:1已锁定；  is_stoped: 0 正常，1 停卡，2 预约停卡 ； type:1时效卡-->
            <el-button type="warning" plain @click="changeSel(vipCardData.id, vipCardData.gym_sign_status)" v-if="canCheckIn(vipCardData)==='isCheckOut'" 
              :disabled="isDisabled">签退</el-button>
            <el-button :type="isDisabled?'info':'primary'" :disabled="isDisabled" plain @click="changeSel(vipCardData.id, vipCardData.gym_sign_status)" 
              v-if="canCheckIn(vipCardData)==='isCheckIn'">签到</el-button>
            <el-button type="info" plain disabled v-if="canCheckIn(vipCardData)==='noActive'">未开卡</el-button>
            <el-button type="info" plain v-if="canCheckIn(vipCardData)==='isStoped'" disabled>已停卡</el-button>
            <el-button type="info" plain v-if="canCheckIn(vipCardData)==='isLocked'" disabled>已锁定</el-button>
            <img :src="delayCard" class="delayCard" v-if="canCheckIn(vipCardData)==='outDate'"/> <!--失效-->
          </div>
          <div class="czbox1" v-else>
            <el-button type="info" plain disabled >储值卡不能进行签到操作</el-button>
          </div>
        </div>
        <div class="vipCard-body">
          <p class="cardType"><span style="margin-right: 10px;"><span v-if="vipCardData.master_id" class="through">通</span>{{vipCardData.card_name}}</span><span>({{cardTypeDictionary(vipCardData.type)}})</span></p>
          <div class="vipCard-NO">{{vipCardData.card_no}}</div>
          <div class="vipCard-Yxq">
            有效期至:<span v-if="vipCardData.type===1">{{common.customFormat(vipCardData.end_date, 'yyyy-MM-dd')}}</span><span v-else>{{common.customFormat(vipCardData.over_date, 'yyyy-MM-dd')}}</span>
          </div>
        </div>
      </div>

      <div class="delayCardShadow" v-if="canCheckIn(vipCardData)==='outDate'"></div>
    </div>
</template>
<script>
export default {
  name: 'VipCardStyle',
  props: {
    vipCardData: {
      type: Object,
      default: function() {
        return {
          status: '',
          card_no: '',
          end_date: '',
          start_date: '',
          card_image: ''
        }
      }
    },
    isDisabled: {
      type: Boolean,
      default() {
        return false
      }
    }
  },
  created() {},
  data() {
    return {
      options: [{
        label: '出场',
        value: '1'
      }, {
        label: '入场',
        value: '0'
      }],
      selectActive: '',
      delayCard: 'http://niulang-v2.oss-cn-beijing.aliyuncs.com/2018-07-19/gym5b5008b59bd891531971765.png'
    }
  },
  methods: {
    // 签退or签到
    canCheckIn(vipCardData) {
      if (vipCardData.is_active === 1) { // 已激活
        if (vipCardData.is_stoped !== 1) { // 未停卡
          if (vipCardData.status === 0) { // 未锁定
            if (vipCardData.gym_sign_status === 0) { // 签退
              return 'isCheckOut'
            } else { // 签到
              return 'isCheckIn'
            }
          } else { // 已锁定
            return 'isLocked'
          }
        } else { // 已停卡
          return 'isStoped'
        }
      } else if (vipCardData.is_active === 0) { // 未激活
        return 'noActive'
      } else if (vipCardData.is_active === 2) { // 已失效
        return 'outDate'
      }
    },
    canchickIn() {
    },
    getDays(startTime, endTime) {
      let _statstamp = new Date(startTime).getTime()
      let _endstamp = new Date(endTime).getTime()
      let result = parseInt((_endstamp - _statstamp) / (24 * 3600000))
      return result
    },
    cardTypeDictionary(param) {
      let result = ''
      switch (param) {
        case 1:
          result = '时效卡'
          break
        case 2:
          result = '次卡'
          break
        case 3:
          result = '储值卡'
          break
        default:
          result = '其它'
      }
      return result
    },
    changeSel(val, sign_status) {
      let msg = sign_status ? '确认入场' : '确认出场'
      this.$confirm(`是否${msg}?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$emit('changeSelect', val, sign_status)
      }).catch(() => {
        console.log('取消')
      })
    },
    cardImage(url) {
      if (!url) {
        return undefined
      }
      let obj = {
        background: `url(${url}) 50% 50% no-repeat`,
        backgroundSize: 'cover'
      }
      return obj
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.through{
  width: 20px;
  height: 20px;
  display: inline-block;
  background: #1AB394;
  border-radius: 3px;
  color: #ffffff;
  line-height: 20px;
  margin-right: 3px;
  text-align: center;
}
.vipCard-style {
  flex: 1;
  position: relative;
  .delayCardShadow {
    width: 100%;
    height: 188px;
    border-radius: 10px;
    background-color:  rgba(167,167,167,0.6);
    position: absolute;
    top: 0;
    left: 0;
  }
  .vipCard {
    height: 188px;
    border-radius: 10px;
    background-color: #c0c4cc;
    .vipCard-head {
      width: 100%;
      border-radius: 10px 10px 0px 0px;
      background-color: rgba(255, 255,255, 0.05);
      height: 50px;
      position: relative;
      img{
        height: 40px;
        width: 40px;
        position: absolute;
        left: 15px;
        top: 5px;
        border-radius:50%;
      }
      .company{
        font-size: 14px;
        font-weight: 400;
        letter-spacing: 2px;
        font-style: italic;
        position: absolute;
        top: 0px;
        left: 60px;
        color: #ffffff;
      }
      .czbox{
        width: 80px;
        height: 40px;
        position: absolute;
        right: 10px;
        top: 8px;
        .delayCard {
          margin-top: 70px;
          left: 0;
          width: 65px;
          height: 50px;
        }
      }
      .czbox1{
        height: 40px;
        position: absolute;
        right: 10px;
        top: 8px;
        .delayCard {
          margin-top: 70px;
          left: 0;
          width: 65px;
          height: 50px;
        }
      }
    }
    .vipCard-body{
      position: relative;
      height: 138px;
      .cardType{
        position: absolute;
        left: 20px;
        top: 0px;
        font-size: 16px;
        font-weight: 400;
        line-height: 16px;
        color: #ffffff;
      }
      .vipCard-NO {
        color: #ffffff;
        letter-spacing: 2px;
        font-style: italic;
        position: absolute;
        bottom: 10px;
        left: 10px;
      }
      .vipCard-Yxq {
        width: 150px;
        height: 20px;
        border-radius: 10px;
        background-color: rgba(255, 255, 255, 0.5);
        position: absolute;
        bottom: 10px;
        right: 10px;
        font-size: 12px;
        color: #ffffff;
        letter-spacing: 1px;
        line-height: 20px;
        text-align: center;
      }
    }
  }
}
</style>

