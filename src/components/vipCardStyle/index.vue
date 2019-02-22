<template>
    <div class="vipCard-style">
            <div class="vipCard" :style="cardImage(vipCardData.card_image)">
              <div class="vipCard-head">
                <img :src='vipCardData.gym?vipCardData.gym.logo?vipCardData.gym.logo:defaulthead:defaulthead' />
                <p class="company">{{vipCardData.gym?vipCardData.gym.name:''}}</p>
                <div class="vipCard-status">
                  <!-- {{getCardStatus(vipCardData.status)}} -->
                  {{vipCardData.status?'锁定':'未锁定'}}
                </div>
              </div>
              <div class="vipCard-body">
                <p class="cardType">
                  <span v-if="vipCardData.master_id" class="through">通</span>{{vipCardData.card_name}}</span>
                  <span>({{cardTypeDictionary(vipCardData.type)}})</span>
                  <i v-if="isEditorCardBg" class="editCardIcon" @click="editorCardBtn"></i>
                </p>
                <div class="vipCard-NO">{{vipCardData.card_no}}</div>
                <div class="vipCard-Yxq">
                  有效期至:<span>{{common.customFormat(vipCardData.end_date, 'yyyy-MM-dd')}}</span>
                </div>
              </div>
            </div>
            <p>
              <label>¥{{vipCardData.real_pay}}</label>
              <label v-if="isSecondCard===2">剩余{{vipCardData.total_times - vipCardData.use_times}}次</label>
              <label v-if="isSecondCard===1">剩余{{vipCardData.has_date}}天</label>
              <label v-if="isSecondCard===3">剩余(金额)：￥{{vipCardData.has_date}}</label>
            </p>
          </div>
</template>
<script>
import { remnantDay, cardStatus, cardtype_Dictionary } from '@/utils/comm'
export default {
  name: 'VipCardStyle',
  props: {
    isSecondCard: {
      type: Number,
      default() {
        return 1
      }
    },
    vipCardData: {
      type: Object,
      default: function() {
        return {
          status: '',
          card_no: '',
          real_pay: '',
          end_date: '',
          start_date: '',
          card_image: ''
        }
      }
    },
    isEditorCardBg: {
      type: Boolean,
      default() {
        return false
      }
    }
  },
  methods: {
    getCardStatus(param) {
      return cardStatus(param)
    },
    getDays(param) {
      return remnantDay(param)
    },
    cardTypeDictionary(param) {
      return cardtype_Dictionary(param)
    },
    cardImage(url) {
      if (!url) {
        return undefined
      }
      let obj = {
        background: `url(${url}) 50% 50% no-repeat/cover`
      }
      return obj
    },
    editorCardBtn() {
      // 修改背景图片
      this.$emit('editorCardBtn')
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
      background-color: rgba(0, 0, 0, 0.05);
      height: 50px;
      position: relative;
      img{
        height: 40px;
        width: 40px;
        border-radius:50%;
        position: absolute;
        left: 15px;
        top: 5px;
      }
      .company{
        font-size: 14px;
        font-weight: 400;
        letter-spacing: 2px;
        font-style: italic;
        position: absolute;
        top: 0px;
        left: 62px;
        color: #ffffff;
      }
      .vipCard-status {
        position: absolute;
        right: 20px;
        top: 15px;
        color: #ffffff;
        font-size: 12px;
        font-weight: 600;
        letter-spacing: 2px;
      }
    }
    .vipCard-body{
      position: relative;
      height: 138px;
      .vipCard-NO {
        color: #ffffff;
        letter-spacing: 2px;
        font-style: italic;
        position: absolute;
        bottom: 10px;
        left: 10px;
      }
      .vipCard-Yxq {
        min-width: 150px;
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
      .cardType{
				position: absolute;
				margin: 20px auto;
        padding: 0px 20px;
				font-size: 16px;
				font-weight: 400;
				color: #ffffff;
        width: 100%;
        .editCardIcon{
          display: inline-block;
          width: 17px;
          height: 16px;
          background: url('../../assets/icon/editor_icon.png') no-repeat center;
          cursor: pointer;
          vertical-align: middle;
          margin-top: 5px;
          float: right;
        }
      }
    }  
  }
  p {
    label:first-child {
      font-size: 18px;
      font-weight: 600;
      color: #f14c30;
      span {
        font-size: 14px;
        margin-left: 10px;
      }
    }
    label:last-child {
      float: right;
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

