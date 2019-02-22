<template>
    <div class="vipCard-style">
      <div class="vipCard" :style="cardImage(vipCardData.card_image)">
        <div class="vipCard-head">
          <img :src='vipCardData.gym?vipCardData.gym.logo?vipCardData.gym.logo:defaulthead:defaulthead' />
          <p class="company">{{vipCardData.gym?vipCardData.gym.name:''}}</p>
          <div class="czbox" v-if="isSelect">
            <el-select v-model="selectActive" placeholder="操作选项" @change="selectAction">
              <el-option
                v-for="item in selectOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="vipCard-body">
          <p class="cardType"><span v-if="vipCardData.master_id" class="through">通</span>{{vipCardData.card_name}}</span><span>({{cardTypeDictionary(vipCardData.type)}})</span></p>
          <div class="vipCard-NO">{{vipCardData.card_no}}</div>
          <div class="vipCard-Yxq">
            有效期至:<span>{{common.customFormat(vipCardData.end_date, 'yyyy-MM-dd')}}</span>
          </div>
        </div>
      </div>
    </div>
</template>
<script>
import { cardtype_Dictionary } from '@/utils/comm'
export default {
  name: 'VipCardStyle1',
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
    isSelect: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      options: [[{
        label: '停卡',
        value: '时效卡停卡'
      }, {
        label: '转卡',
        value: '时效卡转卡'
      }, {
        label: '续卡',
        value: '时效卡续卡'
      }, {
        label: '编辑',
        value: '时效卡编辑'
      }],
      [{
        label: '扣次',
        value: '次卡扣次'
      }, {
        label: '转卡',
        value: '次卡转卡'
      }, {
        label: '续卡',
        value: '次卡续卡'
      }, {
        label: '编辑',
        value: '次卡编辑'
      }],
      [{
        label: '扣费',
        value: '储值卡扣费'
      }, {
        label: '转卡',
        value: '储值卡转卡'
      }, {
        label: '续费',
        value: '储值卡续费'
      }, {
        label: '编辑',
        value: '储值卡编辑'
      }]],
      selectActive: '',
      selectOptions: []
    }
  },
  created() {
    this.selectOptions = this.options[this.vipCardData.type - 1]
    if (this.vipCardData.is_active === 0) {
      this.selectOptions.push({
        label: '开卡',
        value: `开卡`
      })
    }
  },
  methods: {
    getDays(startTime, endTime) {
      let _statstamp = new Date(startTime).getTime()
      let _endstamp = new Date(endTime).getTime()
      let result = parseInt((_endstamp - _statstamp) / (24 * 3600000))
      return result
    },
    cardTypeDictionary(param) {
      return cardtype_Dictionary(param)
    },
    selectAction(param) {
      let obj = Object.assign({}, { selectType: param }, this.vipCardData)
      this.$emit('selectAction', obj)
      this.selectActive = ''
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
.vipCard-style {
  flex: 1;
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
        left: 65px;
        color: #ffffff;
      }
      .czbox{
        width: 110px;
        height: 40px;
        position: absolute;
        right: 10px;
        top: 8px;
      }
    }
    .vipCard-body{
      position: relative;
      height: 138px;
      .cardType{
        position: absolute;
        left: 15px;
        top: 0px;
        font-size: 16px;
        font-weight: 400;
        color: #ffffff;
        line-height: 0px;
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
</style>

