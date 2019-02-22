<template>
    <el-dialog
      title="手牌信息"
      :visible.sync="dialogVisible" v-if="dialogVisible"
      :width="widthSize"
      class="cabinet-dialog1"
      :beforeClose='dialogClosed'>
      <div class="dialog-body">
      <!-- 续费信息确认 -->
        <ul class="ul-box">
            <li>
            <span>当前柜号：</span><span>{{cabinetMsg.locker?cabinetMsg.locker.area:''}}-{{cabinetMsg.locker_grid?cabinetMsg.locker_grid.no:cabinetMsg.no}}</span>
            <span :class="[{ 'red': cabinetMsg.day }, 'delay']">已逾期{{cabinetMsg.day}}天</span>
            </li>
            <li>
            <span>手牌编号：</span><span>{{cabinetMsg.locker_grid?cabinetMsg.locker_grid.key:cabinetMsg.key}}</span>
            </li>
            <li>
            <span>客户信息：</span>
            <img :src="cabinetMsg.customer?cabinetMsg.customer.head_portrait? cabinetMsg.customer.head_portrait: defineHead: defineHead" alt="" width='60px' height='60px' style="border-radius:50%;vertical-align:top;"/>
            <div class="personal">
                <span>{{cabinetMsg.customer?cabinetMsg.customer.name:''}}</span><br>
                <span>{{cabinetMsg.customer?cabinetMsg.customer.phone:''}}</span>
            </div>
            </li>
            <li>
            <span>开始时间：</span>
            <el-date-picker
                v-model="cabinetMsg.started_at"
                type="datetime"
                placeholder="选择开始时间" disabled ="disabled">
            </el-date-picker>
            </li>
            <li>
            <span class="not-null"><b>. </b>结束时间：</span>
            <el-date-picker
                v-model="DialogRenew.gmt_end"
                type="datetime"
                :picker-options="lostTime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择结束时间">
            </el-date-picker>
            </li>
            <li>
            <span>租用押金：</span>
            <el-input type="number" placeholder="请输入本次租柜的押金" v-model="cabinetMsg.cash_pledge" disabled="disabled"></el-input>
            </li>
            <li>
            <span>实付金额：</span>
            <el-input placeholder="请输入本次实际收取的金额" v-model="DialogRenew.real_pay" @keyup.native="inputKeyUp1($event, 0, 999999)"></el-input>
            </li>
            <li>
              <span>销售人员：</span>
              <el-select v-model="DialogRenew.sell_id" filterable placeholder="请选择销售员工">
                <el-option
                  v-for="item in selectoptions"
                  :disabled="item.status === 3"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </li>
            <li>
              <span>支付方式：</span>
              <el-select v-model="DialogRenew.payment_method" placeholder="请选择支付方式" @change="paymethodChage">
                <el-option
                  v-for="item in selloptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </li>
            <li v-if="iscardsPaymeth">
              <span>储值卡号：</span>
              <el-input placeholder="请输入储值卡号"  
                v-model="petCardNo"
                :suffix-icon="cardInputIcon"
                @focus="cardInputFocus">
                <template slot="prepend"><i class="qr"></i></template>
                <el-button slot="append" icon="el-icon-search" @click="petCardNoInput"></el-button>
              </el-input>
            </li>
            <li>
            <span>租用备注：</span>
            <textarea style="resize:none;" placeholder="可在此备注一些特殊情况（选填）" v-model="DialogRenew.memo" :maxlength="20" class="textarea"></textarea>
            </li>
        </ul>
      </div>
      <div class="cabnit-dialog-footer" style="text-align:center;">
        <span slot="footer" class="dialog-footer">
          <el-button class="return" @click="renewCabinet(cabinetMsg.locker.id, cabinetMsg.locker_grid_id)" :loading="loading" :disabled="submitBug">续费</el-button>
        </span>
      </div>
    </el-dialog>
</template>

<script>
import { cardsNoList } from '@/api/vipcardGl'
export default {
  name: 'renewCabinetDialog',
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
    cabinetMsg: {
      type: Object,
      default: function() {
        return {}
      }
    },
    selectoptions: {
      type: Array,
      default: []
    }
  },
  computed: {
    cardInputIcon() {
      return this.hasCardsdNo ? this.cardsNoErr ? 'el-icon-error' : 'el-icon-success' : ''
    }
  },
  data() {
    let selloptions = [{
      value: 1,
      label: '现金'
    }, {
      value: 2,
      label: '支付宝'
    }, {
      value: 3,
      label: '微信'
    }, {
      value: 4,
      label: '银行卡'
    }, {
      value: 5,
      label: '储值卡'
    }]
    return {
      selloptions: selloptions,
      lostTime: '',
      defineHead: require('../../../../assets/icon/person.png'),
      loading: false,
      DialogRenew: { // 续租
        code: '',
        memo: '',
        real_pay: '',
        gmt_end: '',
        payment_method: selloptions[0].value,
        sell_id: 2,
      },
      cardsId: undefined,
      petCardNo: '',
      cardsNoList: [],
      iscardsPaymeth: false,
      submitBug: false, // 提交有错误
      cardsNoErr: false, // 储值卡号错误
      hasCardsdNo: false, // 是否输入储值卡号
      ispetCardNoBtn: false // 是否点击储值卡号查找按钮
    }
  },
  mounted() {
    let cons = this.cabinetMsg.expired_at
    this.lostTime = {
      disabledDate(time) {
        // return time.getTime() < new Date(cons).getTime() - 8.64e7
        return time.getTime() < new Date(cons).getTime()
      }
    }
  },
  created() {
  },
  methods: {
    dialogClosed() {
      this.resetStoreCardParam()
      this.$emit('dialogClosed')
    },
    renewCabinet(lockerid, grid) {
      this.DialogRenew.lockerid = lockerid
      this.DialogRenew.grid = grid
      this.DialogRenew.debit_card_id = undefined
      this.DialogRenew.real_pay = this.DialogRenew.real_pay || '0'
      if (!this.DialogRenew.gmt_end) {
        this.common.message('warning', '结束时间不能为空')
        return false
      } else if (new Date(this.DialogRenew.gmt_end) - new Date(this.cabinetMsg.expired_at) <= 0) {
        this.common.message('warning', '结束时间必须晚于' + this.cabinetMsg.expired_at)
        return false
      }
      if (Number(this.DialogRenew.real_pay) <= 0) {
        this.common.message('warning', '实付金额必须大于0')
        return false
      }
      if (Number(this.DialogRenew.real_pay) > 99999999) {
        this.common.message('warning', '实付金额不能大于99999999')
        return false
      }
      if (this.DialogRenew.payment_method === 5) {
        // 储值卡支付
        if (this.ispetCardNoBtn) {
          // 已经点击储值卡按钮查找
          this.storePay()
        } else {
          // 没有点击根据储值卡查找按钮，先去找这张储值卡
          this.petCardNoInput().then(res => {
            if (res.success) {
              this.storePay()
            }
          }).catch(err => {
            console.log(err)
          })
        }
      } else {
        this.beginAfter()
      }
    },
    storePay() {
      if (!this.cardsId) {
        this.common.message('error', '请选择支付的储值卡号')
        return false
      }
      if (Number(this.DialogRenew.real_pay) > this.cardsNoList[0].balance) {
        this.common.message('error', '所选的储值卡剩余金额不足，请选择其它储值卡或更换支付方式')
        return false
      }
      this.DialogRenew.debit_card_id = this.cardsId
      this.beginAfter()
    },
    beginAfter() {
      // 开始向后端传递数据
      this.loading = true
      this.$store.dispatch('RenewCabinet', this.DialogRenew).then(() => {
        this.loading = false
        this.common.message('success', '续费成功')
        this.$emit('renewCabinet')
      }).catch(() => {
        this.loading = false
      })
    },
    cansleCabinet() {
      this.$emit('cansleCabinet')
    },
    paymethodChage(param) {
      // 支付方式
      this.resetStoreCardParam()
      if (param === 5) {
        // 获取储值卡有效列
        this.iscardsPaymeth = true
      } else {
        this.iscardsPaymeth = false
      }
    },
    petCardNoInput() {
      // 根据储值卡号去查找储值卡
      return new Promise((resolve, reject) => {
        this.submitBug = false
        this.cardsNoErr = false
        if (!this.petCardNo) {
          reject({ success: false })
          this.$message({
            type: 'warning',
            message: '请输入储值卡号'
          })
          return false
        }
        this.ispetCardNoBtn = true
        cardsNoList({ card_no: this.petCardNo }).then(res => {
          this.hasCardsdNo = true
          let data = res.data
          if (data && data.length > 0) {
            if (data[0].card_status !== 0) {
              this.cardsNoErr = true
              let _msg = ''
              switch (data[0].card_status) {
                case 1: _msg = '储值卡已锁定，请重新输入其它储值卡号'
                  break
                case 2: _msg = '储值卡未开卡，请重新输入其它储值卡号'
                  break
                case 3: _msg = '储值卡已失效，请重新输入其它储值卡号'
                  break
              }
              this.$message({
                type: 'warning',
                message: _msg
              })
              this.submitBug = true
              reject({ success: false })
              return false
            }
            this.cardsNoErr = false
            this.cardsNoList = data
            this.cardsId = data[0].id
            resolve({ success: true })
          } else {
            this.$message({
              type: 'warning',
              message: '输入储值卡号不存在，请重新输入'
            })
            this.submitBug = true
            this.cardsNoErr = true
            reject({ success: false })
          }
        }).catch(err => {
          console.log(err)
          this.hasCardsdNo = true
          this.submitBug = true
          this.cardsNoErr = true
          reject({ success: false })
        })
      })
    },
    resetStoreCardParam() {
      // 复位储值卡相关参数
      this.cardsId = undefined
      this.petCardNo = ''
      this.cardsNoList = []
      this.submitBug = false
      this.cardsNoErr = false
      this.hasCardsdNo = false
      this.ispetCardNoBtn = false
      this.iscardsPaymeth = false
    },
    cardInputFocus() {
      this.cardsNoErr = false
      this.hasCardsdNo = false
      this.ispetCardNoBtn = false
      this.submitBug = false
    },
    inputKeyUp1(e, min, max, moduleVale) {
      let doc = e.target
      let _value = this.common.check(doc, min, max)
      this.DialogRenew.real_pay = _value
    }
  }
}
</script>
<style lang="scss" scoped>
.dialog-footer {
  .black {
    background: #000;
    border: 1px solid #000;
  }
  .gray {
    background: #ccc;
    border: 1px solid #ccc;
  }
}
.red {
  color: #f56c6c;
}
.green {
  color: #1AB394;
}
.cabnit-dialog-footer {
  .black {
    background: #000;
    border: 1px solid #000;
  }
  .gray {
    background: #ccc;
    border: 1px solid #ccc;
  }
}
.tags-styl {
  border: 1px solid #1AB394;
  background-color: #EAF7F5;
}
.textarea {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  width: 360px;
  vertical-align: top;
  height: 45px;
}
.textarea::-webkit-input-placeholder{
  color: #ccc;
}
.zusubmit {
  background: #1AB394;
  width: 160px;
  font-size: 18px;
}
.ss {
  border-bottom: 1px solid #ebeef5;
  line-height: 36px;
}
.ss:last-child {
  border-bottom: none;
}
.color3 {
  color: #333333;
}
.circle {
  width: 23px;
  height: 23px;
  border-radius: 50%;
  font-style: normal;
  font-size: 12px;
  display: inline-block;
  line-height: 23px;
  margin-right: 5px;
}
.dao {
  background-color: #1AB394;
  color: #fff;
}
.tui {
  background-color: #E7EAEC;
  color: #999999;
}
.openclassbox {
  margin-top: 17px;
  overflow: auto; 
  &::-webkit-scrollbar-track-piece {
    background: #eeeeee;
  }
  &::-webkit-scrollbar{
      width: 6px;
      height: 6px;
      background-color: #f5f5f5;
  }
  &::-webkit-scrollbar-thumb {
    background: #1AB394;
    border-radius: 5px;
  }
  td {
    position: relative;
    .openclasitembox {
      width: 220px;
      height: 70px;
      box-sizing: border-box;
      background: #E7EAEC;
      border: 1px solid #CCCCCC;
      border-radius: 3px;
      margin-bottom: 17px;
      margin-right: 12px;
      .time, .font {
        margin-left: 12px;
      }
      .time {
        font-size: 20px;
        color: #1AB394;
        margin-top: 10px;
      }
      .font {
        margin-top: 9px;
        font-size: 14px;
        color: #333333;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}
.sendbox {
  margin-top: 5px;
  ul{
    margin: 0;
    padding: 0 20px;
    li{
      list-style: none;
      width: 80px;
      height: 60px;
      text-align: center;
      background-color: #E7EAEC;
      border: 1px solid #CCCCCC;
      border-radius: 3px;
      float: left;
      line-height: 40px;
      box-sizing: border-box;
      font-size: 20px;
      color: #333333;
      margin-right: 12px;
      margin-top: 12px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      cursor: pointer;
    }
  }
}
.staffAdd{
  background: rgb(51, 51, 51);
  margin-left: 20px;
  color: #fff;
}
.lf{float: left;}
.topbox {
  padding: 17px;
  border: 1px solid #eeeeee;
  position: relative;
  .toprbox {
    position: absolute;
    right: 0;
    top: 0;
    height: 70px;
    text-align: center;
    margin-right: 1%;
    .lef, .rig{
      float: left;
    }
    .lef{
      margin-right: 10px;
      .num {
        color: #1AB394;
      }
    }
    .rig{
      .num {
        color: #EE6B54;
      }
    }
    .num{
      height: 46px;
      line-height: 50px;
      font-size: 36px;
    }
    .text{
      height: 20px;
      line-height: 20px;
      font-size: 14px;
      color: #999999;
    }
  }
}
.pointred {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background-color: #F14C30;
  display: inline-block;
  position: relative;
  top: -3px;
  right: 5px;
}
.w100 {
  width: 100%;
}
.el-dialog {
  ul {
    padding: 0 20px;
    margin: 0;
    li{
      list-style: none;
      line-height: 40px;
      margin-bottom: 10px;
      position: relative;
      padding-left: 10px;
      span.not-null {
        // margin-left: -15px;
        position: relative;
        b {
          color: #F14C30;
          font-size: 28px;
          position: absolute;
          top: -19px;
          left: -10px;
        }
      }
      .delay {
        position: absolute;
        top: 0;
        right: 10px;
      }
      .personal {
        position: absolute;
        top: 10px;
        left: 150px;
        line-height: 20px;
      }
      .vip-box {
        border: 1px solid #ddd;
        width: 330px;
        height: 80px;
        display: inline-block;
        vertical-align: top;
        border-radius: 3px;
        position: relative;
        line-height: 20px;
        padding: 13px;
        cursor: pointer;
        .vip-message {
          position: absolute;
          top: 20px;
          left: 80px;
          color: #ccc;
          .vip-name {
            font-size: 16px;
          }
        }
      }
    }
  }
}
.qr{
  width: 40px;
  position: absolute;
  left: 0;
  top: -1px;
  height: 36px;
  background: url("../../../../assets/icon/qr.png") no-repeat center center;
  background-size: cover;
  border-radius: 5px 0 0 5px;
}
</style>