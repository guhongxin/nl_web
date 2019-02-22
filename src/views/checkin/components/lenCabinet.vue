<template>
    <el-dialog
      title="手牌信息"
      :visible.sync="dialogVisible"
      :width="widthSize"
      class="lenCabinet"
      :beforeClose='dialogClosed'>
     
        <div class="block">
          <el-carousel trigger="click" height="570px" :autoplay="false" :arrow="always" indicator-position="none">
            <el-carousel-item v-for="(item,index) in cabinetMsg" :key="index">
              <ul class="ul-box">
                <li>
                  <span>当前柜号：</span><span>{{item.locker?item.locker.area:''}} - {{item.locker_grid?item.locker_grid.no:''}}号</span>
                  <span :class="[{ 'red': item.day }, 'delay']">已逾期{{item.day}}天</span>
                </li>
                <li>
                  <!-- <span>当前状态：</span><span>已出租</span> -->
                  <span>手牌编号：</span><span>{{item.locker_grid?item.locker_grid.key:''}}</span>
                </li>
                <li>
                  <span>会员信息：</span>
                  <img v-if="item.customer?!item.customer.head_portrait:''" src="../../../assets/icon/person.png" alt="" width='60px' height='60px' style="border-radius:50%;vertical-align:top;">
                  <img v-if="item.customer?item.customer.head_portrait:''" :src="item.customer?item.customer.head_portrait:''" alt="" width='60px' height='60px' style="border-radius:50%;vertical-align:top;">
                  <div class="personal">
                    <span>{{item.customer?item.customer.name:''}}</span><br>
                    <span>{{item.customer?item.customer.phone:''}}</span>
                  </div>
                </li>
                <li>
                  <span>开始时间：</span><span>{{item.started_at}}</span>
                </li>
                <li>
                  <span>结束时间：</span><span>{{item.expired_at}}</span>
                </li>
                <li>
                  <span>租用押金：</span><span>{{item.cash_pledge}}</span>
                </li>
                <li>
                  <span>实付金额：</span><span>{{item.total_fee}}</span>
                </li>
                <li>
                  <span>租用备注：</span><span v-text="item.rent_remark?item.rent_remark:'-'"></span>
                </li>
              </ul>
              <div class="t-c">
              <span slot="footer" class="cabinet-dialog-footer">
                  <el-button type="primary" class="continue" @click="cansleCabinet(item)">续 费</el-button>
                  <el-button type="primary" class="black" @click="backCabinet(item.locker.id, item.locker_grid.id)" :loading="loading">归 还</el-button>
              </span>
              </div>
            <div class="indicator" v-if="always==='always'">{{index + 1}} / {{cabinetMsg.length}}</div>
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
    cabinetMsg: {
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
</style>