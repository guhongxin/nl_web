<template>
  <div class="header-box">
    <div class="title-box">
      <span class="logo"></span>
      <span class="title">员工业绩概览表</span>
      <div class="buttonBox">
        <el-button class="black" @click="printpage">打印</el-button>
      </div>
    </div>
    <table class="titleMessage" width="100%" border="0" cellspacing="0" cellpadding="0">
      <tbody>
        <tr>
          <td class="gray">员工</td>
          <td style="width: 360px;"><div class="myTd">{{headerContent.name}}</div></td>
          <td class="gray">统计时间</td>
          <td style="width: 360px;">{{headerContent.startTime}}至{{headerContent.endTime}}</td>
          <td class="gray">订单数</td>
          <td style="width: 60px;">{{headerContent.order}}</td>
          <td rowspan="2" class="gray" style="width:100px;">业绩总金额(元）</td>
          <td rowspan="2" style="border-right: none;">{{headerContent.money}}</td>
        </tr>
        <tr>
          <td class="gray">俱乐部名称</td>
          <td>{{headerContent.gym}}</td>
          <td class="gray">业绩类型</td>
          <td colspan='3'>{{headerContent.type}}</td>
        </tr>
      </tbody>
    </table>

  </div>
</template>

<script>
import { getSession } from '@/utils/auth'
export default {
  name: 'titleHeader',
  props: {
    headerContent: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
    }
  },
  created() {
    this.headerContent.gym = getSession('SET_GYM_NAME')
  },
  methods: {
    printpage() {
      this.$emit('printPages')
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.header-box {
  background: #D7E0E6;
  text-align: center;
  border: 1px solid #ddd;
  .title-box {
    height: 70px;
    line-height: 70px;
    .logo {
      float: left;
      display: inline-block;
      width: 340px;
      height: 50px;
      line-height: 50px;
      margin-top: 10px;
      margin-left: 10px;
      background: url('../../../../assets/logo_img/LOGOwhite.svg') no-repeat center;
      background-size: 100%;
    }
    .title {
      font-size: 30px;
      color: #333;
      margin-left: -270px;
    }
    .buttonBox {
      float: right;
      margin-right: 10px;
    }
  }
  .titleMessage {
    background: #fff;
    tr {
      height: 69px;
      // line-height: 69px;
      td {
        border: 1px solid #ddd;
        border-left: none;
        border-bottom: none;
      }
      .myTd {
        width: 330px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .gray {
        background: #F7F9FA;
      }
    }
  }
}
.black {
  background: #000;
  border: 1px solid #000;
  color: #fff;
}
</style>
