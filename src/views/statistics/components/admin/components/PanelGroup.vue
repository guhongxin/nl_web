<template>
  <el-row class="panel-group" :gutter="40">
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" :class="[{'income': income}]" @click="handleSetLineChartData('income')" >
        <div :class="['card-panel-icon-wrapper', 'icon-people', {'income': income}]">
          <span class="icon-i-新增收入"></span>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">新增收入</div>
          <count-to class="card-panel-num" :startVal="0" :endVal="panelValue.income?panelValue.income:panelValue.income" :duration="2600" v-if="panelValue.income%1===0"></count-to>
          <span  class="panelValue-box" style="font-size:20px;" v-else>{{panelValue.income | NumFormat}}</span>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" :class="[{'cardNum': cardNum}]" @click="handleSetLineChartData('cardNum')">
        <div :class="['card-panel-icon-wrapper', 'icon-message', {'cardNum': cardNum}]">
          <span class="icon-i-新增开卡"></span>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">新增会员</div>
          <count-to class="card-panel-num" :startVal="0" :endVal="panelValue.opencard?panelValue.opencard:0" :duration="3000"></count-to>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" :class="[{'customer': customer}]" @click="handleSetLineChartData('customer')">
        <div :class="['card-panel-icon-wrapper', 'icon-money', {'customer':customer}]">
          <span class="icon-i-新增潜客"></span>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">新增潜客</div>
          <count-to class="card-panel-num" :startVal="0" :endVal="panelValue.customer?panelValue.customer:0" :duration="3200"></count-to>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" :class="[{'signIn': signIn}]" @click="handleSetLineChartData('signIn')">
        <div :class="['card-panel-icon-wrapper', 'icon-shoppingCard', {'signIn':signIn}]">
          <span class="icon-i-新增签到"></span>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">新增签到</div>
          <count-to class="card-panel-num" :startVal="0" :endVal="panelValue.signIn?panelValue.signIn:0" :duration="3600"></count-to>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'

export default {
  components: {
    CountTo
  },
  props: ['panelValue'],
  data() {
    return {
      income: true,
      cardNum: false,
      customer: false,
      signIn: false,
    }
  },
  filters: {
    NumFormat: function(value) {
      value = Number(value).toFixed(2)
      if (!value) return '0.00'
      // var intPart = Number(value).toFixed(0) // 获取整数部分
      var intPart = Math.trunc(value) // 获取整数部分
      var intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') // 将整数部分逢三一断
      var floatPart = '.00' // 预定义小数部分
      var value2Array = value.split('.')
      // =2表示数据有小数位
      if (value2Array.length === 2) {
        floatPart = value2Array[1].toString() // 拿到小数部分
        if (floatPart.length === 1) { // 补0,实际上用不着
          return intPartFormat + '.' + floatPart + '0'
        } else {
          return intPartFormat + '.' + floatPart
        }
      } else {
        return intPartFormat + floatPart
      }
    }
  },
  methods: {
    handleSetLineChartData(type) {
      this.income = false
      this.cardNum = false
      this.customer = false
      this.signIn = false
      if (type === 'income') {
        this.income = true
      } else if (type === 'cardNum') {
        this.cardNum = true
      } else if (type === 'customer') {
        this.customer = true
      } else if (type === 'signIn') {
        this.signIn = true
      }
      this.$emit('handleSetLineChartData', type)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.panel-group {
  margin-top: 0px;
  .card-panel-col{
    margin-bottom: 0px;
  }
  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 0 2px 4px 0 rgba(0,0,0,0.30);
    &.income {
      background: #2EC7C9;
      .card-panel-description .card-panel-num{
        color: #ffffff;
      }
      .card-panel-description .card-panel-text{
        font-size: 14px;
         color: #ffffff;
      }
      .panelValue-box{
        color: #ffffff;
      }
    }
    .panelValue-box{
      color: #333333;
    }
    &.cardNum {
      background: #36a3f7;
      .card-panel-description .card-panel-num{
        color: #ffffff;
      }
      .card-panel-description .card-panel-text{
        font-size: 14px;
         color: #ffffff;
      }
    }
    &.customer {
      background: #f4516c;
      .card-panel-description .card-panel-num{
        color: #ffffff;
      }
      .card-panel-description .card-panel-text{
        font-size: 14px;
         color: #ffffff;
      }
    }
    &.signIn {
      background: #34bfa3;
      .card-panel-description .card-panel-num{
        color: #ffffff;
      }
      .card-panel-description .card-panel-text{
        font-size: 14px;
         color: #ffffff;
      }
    }
    .card-panel-icon-wrapper {
      font-size: 50px; 
    }
    .card-panel-icon-wrapper {
      color: #fff;
    }
    .icon-people {
      background: #2EC7C9;
    }
    .icon-message {
      background: #36a3f7;
    }
    .icon-money {
      background: #f4516c;
    }
    .icon-shoppingCard {
      background: #34bfa3
    }
    &:hover {
      // .card-panel-icon-wrapper {
      //   color: #fff;
      // }
      // .icon-people {
      //   background: #40c9c6;
      // }
      // .icon-message {
      //   background: #36a3f7;
      // }
      // .icon-money {
      //   background: #f4516c;
      // }
      // .icon-shoppingCard {
      //   background: #34bfa3
      // }
    }
    // .icon-people {
    //   color: #40c9c6;
    // }
    // .icon-message {
    //   color: #36a3f7;
    // }
    // .icon-money {
    //   color: #f4516c;
    // }
    // .icon-shoppingCard {
    //   color: #34bfa3
    // }
    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }
    .card-panel-icon {
      float: left;
      font-size: 48px;
    }
    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;
      .card-panel-text {
        line-height: 18px;
        color:#666666;
        font-size: 14px;
        margin-bottom: 12px;
        text-align: right;
      }
      .card-panel-num {
        color: #333333;
        font-size: 24px;
        text-align: right;
        display: inline-block;
        width: 100%;
      }
    }
  }
}

</style>
