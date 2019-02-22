<template>
    <el-dialog
      title="申请提现"
      :visible.sync="dialogVisible"
      width="800px"
      class="course-dialog" @close="addclose" :close-on-click-modal="false">
      <div class="form-box">
        <div class="my-box1">
          <span class="mySpan">提现账户</span>
          <el-table stripe class="my-table" :data="tableList" border fit highlight-current-row style="width:670px;display:inline-block;">
            <el-table-column align="center" :label="'账户名称'">
              <template slot-scope="scope">
                <span>{{scope.row.name}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" :label="'开户行-支行'">
              <template slot-scope="scope">
                <span>{{scope.row.bank}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" :label="'账号'">
              <template slot-scope="scope">
                <span>{{scope.row.no}}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="my-box2">
          <span class="mySpan">提现金额</span>
          <div class="input-box">
            <el-input v-model="accountWithdraw.gym_withdraw_amount" placeholder="请输入金额" type="number" @change="financeMoney" :max="gym_balance" @blur="inputCheck"></el-input>
            <div class="lf-box"><span>手续费（费率0.6%）：</span>￥{{money | NumFormat}}</div>
            <div class="rf-box">当前账户余额：<span>￥{{gym_balance | NumFormat}}</span><span class="tixian" @click="financeAll">全部提现</span></div>
          </div>
        </div>
        <div class="my-box3">
          <span class="explain">提现说明</span>
          <ul>
            <li>1.提现账户为实名认证时填写的银行卡<span class="modifyAcount" @click="goTo">修改认证</span></li>
            <li :class="{ 'blink': isActive2 }">2.每月最多提现2次 <span v-show="isDisabled">当月提现次数已经使用完</span></li>
            <li :class="{ 'blink': isActive1 }">3.每次最低提现金额不少于100元</li>
            <li>4.提现到账时间一般为1-3个工作日</li>
          </ul>
        </div>
      </div>
      <div class="put-dialog-footer" style="text-align:center;">
        <span slot="footer" class="dialog-footer">
          <el-button type="info" class="gray" @click="dialogVisible=false">取消</el-button>
          <el-button type="primary" :loading="loading" class="black" @click="btnSure" :disabled="isDisabled">确定</el-button>
        </span>
      </div>
    </el-dialog>
</template>

<script>
import { financeAccount, getFinanceWithdraw } from '@/api/statistics'
import { getSession } from '@/utils/auth'
// import { testFloat2 } from '@/utils/validate'
export default {
  name: 'putForward',
  props: {
  },
  data() {
    return {
      dialogVisible: false,
      loading: false,
      gym_balance: '',
      tableList: [],
      accountWithdraw: {
        gym_id: '',
        gym_bank_id: '',
        gym_withdraw_amount: '',
        gym_withdraw_fee: 0.00,
        gym_withdraw_fee_rate: '0.6%',
        amount_withoutfee: ''
      },
      isActive2: false,
      isDisabled: true
    }
  },
  mounted() {
  },
  created() {
  },
  watch: {
  },
  computed: {
    money: function() {
      return this.accountWithdraw.gym_withdraw_amount * 0.006
    },
    isActive1: function() {
      let active = false
      if (this.accountWithdraw.gym_withdraw_amount) {
        if (this.accountWithdraw.gym_withdraw_amount < 100) {
          active = true
        } else {
          active = false
        }
      }
      return active
    }
  },
  filters: {
    NumFormat: function(value) {
      if (!value) {
        return '0.00'
      } else {
        value = Number(value).toFixed(2)
      }
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
    },
  },
  methods: {
    dialogShow() {
      this.getList()
    },
    // 当前健身房收入金额汇总
    getList() {
      let id = getSession('SET_GYM_ID')
      financeAccount(id).then(res => {
        this.gym_balance = res.data.bizAccount ? res.data.bizAccount.gym_balance : ''
        this.accountWithdraw.gym_bank_id = res.data.bank ? res.data.bank.id : ''
        this.accountWithdraw.gym_id = res.data.bank ? res.data.bizAccount.gym_id : getSession('SET_GYM_ID')
        this.$set(this.tableList, 0, res.data.bank)
        if (res.data.bank) {
          this.dialogVisible = true
        } else {
          this.common.message('warning', '该俱乐部暂无账户信息，请实名认证！')
        }
        if (res.data.count >= 2) {
          this.isDisabled = true
          this.isActive2 = true
        } else {
          this.isDisabled = false
          this.isActive2 = false
        }
      })
    },
    inputCheck(e) {
      let doc = e.target
      let _val = doc.value
      if (_val < 0) {
        this.accountWithdraw.gym_withdraw_amount = 100
      }
    },
    financeMoney(val) {
      if (Number(val) > Number(this.gym_balance)) {
        // this.accountWithdraw.gym_withdraw_amount = this.gym_balance
        this.common.message('warning', '账户余额不足')
      } else if (Number(val) < 100) {
        this.common.message('warning', '每次最低提现金额不少于100元')
      }
    },
    financeAll() {
      this.accountWithdraw.gym_withdraw_amount = this.gym_balance
    },
    addclose() {
      this.accountWithdraw.gym_withdraw_amount = ''
      this.accountWithdraw.gym_withdraw_fee = ''
    },
    btnSure() {
      if (this.accountWithdraw.gym_withdraw_amount > Number(this.gym_balance)) {
        this.common.message('warning', '账户余额不足')
        return
      }
      if (!this.accountWithdraw.gym_withdraw_amount) {
        this.common.message('warning', '提现金额不能为空')
        return
      }
      if (Number(this.accountWithdraw.gym_withdraw_amount) < 100) {
        this.common.message('warning', '每次最低提现金额不少于100元')
        return
      }
      this.accountWithdraw.gym_withdraw_fee = this.money
      this.accountWithdraw.gym_withdraw_amount = Number(this.accountWithdraw.gym_withdraw_amount)
      this.accountWithdraw.amount_withoutfee = this.accountWithdraw.gym_withdraw_amount - this.accountWithdraw.gym_withdraw_fee
      this.loading = true
      getFinanceWithdraw(this.accountWithdraw).then(res => {
        this.loading = false
        this.dialogVisible = false
        this.common.message('success', '提现成功')
        this.$emit('withdrawBtn')
      }).catch(() => {
        this.loading = false
      })
    },
    goTo() {
      this.$router.push('/advanced/venue')
    }
  }
}
</script>
<style lang="scss" scoped>
/* 定义keyframe动画，命名为blink */
@keyframes blink{
  0%{opacity: 1;}
  100%{opacity: 0;} 
}
/* 添加兼容性前缀 */
@-webkit-keyframes blink {
    0% { opacity: 1; }
    100% { opacity: 0; }
}
@-moz-keyframes blink {
    0% { opacity: 1; }
    100% { opacity: 0; }
}
@-ms-keyframes blink {
    0% {opacity: 1; } 
    100% { opacity: 0;}
}
@-o-keyframes blink {
    0% { opacity: 1; }
    100% { opacity: 0; }
}
/* 定义blink类*/
.blink{
    color: #dd4814;
    animation: blink 2s linear infinite;  
    /* 其它浏览器兼容性前缀 */
    -webkit-animation: blink 1s linear infinite;
    -moz-animation: blink 1s linear infinite;
    -ms-animation: blink 1s linear infinite;
    -o-animation: blink 1s linear infinite;
}
.form-box {
  color: #333;
}
.mySpan {
  vertical-align: top;
  margin-right: 20px;
  color: #000;
}
.my-box2 {
  margin-top: 40px;
  .input-box {
    width: 670px;
    display: inline-block;
    overflow: hidden;
    .lf-box {
      float:left;
      color: #999;
      margin-top: 15px;
    }
    .rf-box {
      float: right;
      color: #999;
      margin-top: 15px;
      .tixian {
        color: #0099ff;
        margin-left: 10px;
        cursor:pointer;
      }
    }
  }
}
.my-box3 {
  width: 670px;
  color: #000;
  margin-left:80px;
  position: relative;
  margin-top: 30px;
  .explain {
    position: absolute;
    top: -11px;
    left: 10px;
  }
  ul {
    margin: 0;
    padding: 30px 20px;
    border: 1px solid #ddd;
    background: #f2f2f2;
    li {
      list-style: none;
      line-height: 30px;
      .modifyAcount {
        cursor: pointer;
        color: #0099ff;
        margin-left: 10px;
      }
    }
  }
}
.my-table /deep/ {
  thead{
    color: #333;
    font-weight: normal;
    th {
      background: #f2f2f2;
      font-weight: normal;
      line-height: 20px;
    }
  }
  .el-table__body td {
    background: #fff;
  }
}
.put-dialog-footer {
  border-top: 1px solid #ddd;
  margin-top: 20px;
  padding-top: 20px;
}
.dialog-footer /deep/{
  .el-button--primary {
    background: #000;
    border: 1px solid #000;
  }
}
</style>