<template>
    <el-dialog
      title="归还确认信息"
      :visible.sync="dialogVisible"
      :width="widthSize"
      class="lenCabinet"
      :beforeClose='dialogClosed'>
      <div class="block">
        <el-carousel trigger="click" height="595px" :autoplay="false" :arrow="always" indicator-position="none">
          <el-carousel-item v-for="(item,index) in searchCabinetList" :key="index">
            <ul class="ul-box">
              <li>
                <span>当前柜号：</span><span>{{item.locker.area + '-' + item.locker_grid.no}}</span>
                <span :class="[{ 'red': getDelayDay(item.expired_at) }, 'delay']">已逾期{{getDelayDay(item.expired_at)}}天</span>
              </li>
              <li>
                <span>当前状态：</span><span>已出租</span>
              </li>
              <li>
                <span>手牌编号：</span><span>{{item.locker_grid.key}}</span>
              </li>
              <li>
                <span>客户信息：</span>
                <img :src="item.customer? item.customer.head_portrait: defineHead"  alt="" width='50px' height="50px" style="border-radius:50%;vertical-align:top;">
                <div class="personal">
                  <span>{{item.customer.name}}</span><br>
                  <span>{{item.customer.phone}}</span>
                </div>
              </li>
              <li>
                <span>开始时间：</span><span>{{item.started_at}}</span>
              </li>
              <li>
                <span>结束时间：</span><span>{{item.expired_at}}</span>
              </li>
              <li>
                <span>实付金额：</span><span>{{item.total_fee}}</span>
              </li>
              <li>
                <span>租用押金：</span><span>{{item.cash_pledge}}</span>
              </li>
              <li>
                <span>租用备注：</span><span v-text="item.rent_remark === '' ? '-' : item.rent_remark"></span>
              </li>
            </ul>
            <div class="cabnit-dialog-footer">
              <span slot="footer" class="dialog-footer">
                <el-button class="continue" @click="cansleCabinet(item)">续费</el-button>
                <el-button class="return" @click="backCabinet(item.locker.id, item.locker_grid.id)">归还</el-button>
              </span>
            </div>
            <div class="indicator" v-if="searchCabinetList.length>1">{{index + 1}} / {{searchCabinetList.length}}</div>
          </el-carousel-item>
        </el-carousel>
      </div>
    </el-dialog>
</template>

<script>
export default {
  name: 'lenCabinetDialog',
  props: {
    dialogVisible: {
      type: Boolean,
      default: function() {
        return false
      }
    },
    widthSize: {
      type: String,
      default() {
        return '200px'
      }
    },
    always: {
      type: String,
      default() {
        return 'never'
      }
    },
    searchCabinetList: {
      type: Array,
      default: function() {
        return {}
      }
    },
    loading: false
  },
  data() {
    return {
    }
  },
  mounted() {},
  methods: {
    getDelayDay(date) {
      if (new Date().getTime() - new Date(date).getTime() > 0) {
        let nTime = new Date().getTime() - new Date(date).getTime()
        var day = Math.ceil(nTime / 86400000)
      } else {
        day = 0
      }
      return day
    },
    dialogClosed() {
      this.$emit('dialogClosed')
    },
    backCabinet(lockerid, grid) {
      let data = { 'lockerid': lockerid, 'grid': grid }
      this.$emit('backCabinet', data)
    },
    cansleCabinet(item) {
      this.$emit('cansleCabinet', item)
    }
  },
  computed: {}
}
</script>
<style lang="scss" scoped>
.lenCabinet /deep/ {
  .el-dialog .el-dialog__body{
   padding: 20px 0;
  }
}
.indicator {
  margin: 0 auto;
  text-align: center;
  width: 50px;
  height: 30px;
  line-height: 30px;
  background: rgba(124,124,124,0.8);
  color: #fff;
  border-radius: 3px;
  margin-top: 30px;
}
.t-c {
  text-align: center;
  margin-top: 45px;
}
.cabinet-dialog-footer {
  .gray {
    background: #ddd;
    border: 1px solid #ddd;
  }
  .black {
    background: #000;
    border:1px solid #000;
  }
}
.contain {
  width: 300px;
  margin: 0 auto;
  padding-left: 50px;
}
.headimg {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
.lenCabinet /deep/ {
  .el-carousel__arrow--left {
    left: 0;
  }
  .el-carousel__arrow--right {
    right: 0;
  }
}
ul {
  padding: 0 30px;
  margin: 0;
  li{
    list-style: none;
    line-height: 40px;
    margin-bottom: 10px;
    position: relative;
    padding-left: 10px;
    .delay {
      position: absolute;
      top: 0;
      right: 10px;
    }
    .red {
      color: red;
    }
    .personal {
      position: absolute;
      top: 10px;
      left: 150px;
      line-height: 20px;
    }
  }
}
.continue {
  background: #1AB394;
  border: #1AB394;
}
.cabnit-dialog-footer {
  margin-top: 45px;
  text-align: center;
  .return {
    background: #000;
    border: 1px solid #000;
    color: #fff;
  }
  .continue {
    color: #fff;
  }
}
</style>