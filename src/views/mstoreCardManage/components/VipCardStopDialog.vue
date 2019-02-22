<template>
    <el-dialog
      title="停卡"
      :visible.sync="dialogVisible"
      :width="widthSize"
      class="stopCardDialog customizeDetailsDialog"
      :beforeClose='dialogClosed'
      append-to-body>
      <div class="dialog-body" style="width:100%;">
        <vip-card-style :vipCardData="vipCardData" :isSecondCard="isSecondCard" style="width:95%;margin:0px auto;"></vip-card-style>
        <div class="dialog-body-two">
          <p>
            <span class="ljStopCardNumb">累计停卡<span>{{stop_count}}</span>次数</span>
            <span class="ljStopCardTime">累计停卡时长<span>{{stop_day?stop_day:0}}</span>天</span>
          </p>
          <el-form :model="stopCardForm"  
            ref="stopCardForm" 
            :rules="rules"
            class="stopCardForm cardForm">
            <el-form-item label="停卡时间" label-width="100px" prop="stopCardTime">
              <el-date-picker
                v-model="stopCardForm.stopCardTime"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :disabled="stopDialogInputDisable"
                :picker-options="pickerOptions0">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="实付金额" placeholder="请填写实付金额" label-width="100px" prop="real_pay">
              <el-input v-model="stopCardForm.real_pay" :disabled="stopDialogInputDisable"></el-input>
            </el-form-item>
            <el-form-item label="销售员工" label-width="100px" prop="sell_name">
              <el-select v-model="stopCardForm.sell_name" filterable placeholder="请选择销售员工" :disabled="stopDialogInputDisable" @change="changeEmployee">
                 <el-option
                  v-for="(item, key) in employeesList"
                  :key="key"
                  :label="item.name"
                  :value="item.id+','+item.name"
                  >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="支付方式" label-width="100px" prop="paymethod">
              <el-select v-model="stopCardForm.paymethod"  placeholder="请选择支付方式"  :disabled="stopDialogInputDisable">
                <el-option label="现金" value="1"></el-option>
                <el-option label="支付宝" value="2"></el-option>
                <el-option label="微信" value="3"></el-option>
                <el-option label="银行卡" value="4"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="备注" label-width="100px" prop="remark">
              <el-input type="textarea" v-model="stopCardForm.remark" 
                placeholder="选填" :autosize="{ minRows: 5, maxRows: 10}" :disabled="stopDialogInputDisable"
                :maxlength="20"></el-input>
            </el-form-item>
            <el-form-item style="text-align: center;">
              <el-button v-if="stopDialogInputDisable" @click="cancelAppointBtn"  style="background-color: rgb(51, 51, 51);color:#ffffff;">结束停卡</el-button>
              <el-button v-else @click="stopCardOKbtn"  style="background-color: rgb(51, 51, 51);color:#ffffff;" >确定</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <el-dialog
        class="innerbox"
        width="400px"
        title="是否退还手续费"
        :visible.sync="innerVisible"
        append-to-body>
          <div style="margin-left:15px;">
            <el-radio v-model="radio" label="0">否</el-radio>
            <el-radio v-model="radio" label="1">是</el-radio>
          </div>
          <div style="text-align: right;margin-top:10px">
            <el-button @click="innerVisible=false"  style="background-color: rgb(51, 51, 51);color:#ffffff;" size="mini">取消</el-button>
            <el-button @click="stopBtn"  style="background-color: rgb(51, 51, 51);color:#ffffff;" size="mini">确定</el-button>
          </div>
      </el-dialog>
    </el-dialog>
</template>
<script>
import VipCardStyle from '@/components/vipCardStyle'
import { vipCardDetails, stopVipCard, stopCardInfor, cencelVipCardGl } from '@/api/vipcardGl'
import { timeFormat } from '@/utils/comm'
import { testFloat2 } from '@/utils/validate'
const realpayVerification = (rule, value, callback) => {
  if (!testFloat2(value)) {
    callback(new Error('实付金额为数字，且只可保留两位小数'))
  } else if (Number(value) > 99999999) {
    callback(new Error('实付金额小于99999999'))
  } else {
    callback()
  }
}
export default {
  name: 'VipCardStopDialog',
  props: {
    widthSize: {
      type: String,
      default() {
        return '200px'
      }
    },
    employeesData: {
      type: Array
    }
  },
  data() {
    return {
      vipCardData: {},
      stopCardForm: {
        stopCardTime: [],
        paymethod: '1',
        remark: '',
        sell_name: '2,待分配',
        real_pay: ''
      },
      stop_count: null,
      stop_day: null,
      ljStopCardDays: '',
      vipCardDetailsData: {},
      stopDialogInputDisable: false, // 是否处于停卡状态
      vipCardId: 0,
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() < Date.now()
        }
      },
      innerVisible: false,
      isRefund: 0, // true 退款 false 不退款
      radio: '0',
      rules: {
        stopCardTime: [{ required: true, message: '请选择停卡时间', trigger: 'change' }],
        real_pay: [
          { required: true, message: '请输入金额', trigger: 'blur' },
          { validator: realpayVerification, trigger: 'blur' }
        ]
        // sell_name: [{ required: true, message: '请选择销售员工', trigger: 'change' }],
        // paymethod: [{ required: true, message: '请选择支付方式', trigger: 'blur' }]
      },
      dialogVisible: false,
      isSecondCard: false
    }
  },
  methods: {
    dialogClosed() {
      this.$refs.stopCardForm.resetFields()
      this.dialogVisible = false
      this.$emit('dialogClosed')
    },
    stopCardOKbtn() {
      if (!this.stopCardForm.stopCardTime.length) {
        this.common.message('error', '请选择停卡时间!')
        return
      }
      if (!this.stopCardForm.real_pay) {
        this.common.message('error', '请填写实付金额!')
        return
      }
      if (!testFloat2(this.stopCardForm.real_pay)) {
        this.common.message('error', '实付金额为数字，且最多保留两位小数!')
        return
      }
      if (!this.stopCardForm.sell_name) {
        this.common.message('error', '请选择销售员工')
        return
      }
      if (!this.stopCardForm.paymethod) {
        this.common.message('error', '请选择支付方式')
        return
      }
      if ((new Date(this.stopCardForm.stopCardTime[0])).getTime() >= (new Date(this.stopCardForm.stopCardTime[1])).getTime()) {
        this.common.message('error', '停卡时间必须大于开卡时间')
        return
      }
      let obj = {
        id: this.vipCardDetailsData.id,
        customer_id: this.vipCardDetailsData.customer_id,
        vip_id: this.vipCardDetailsData.id,
        delay_day: (new Date(timeFormat(this.stopCardForm.stopCardTime[1])) - new Date(timeFormat(this.stopCardForm.stopCardTime[0]))) / 86400000,
        start_date: timeFormat(this.stopCardForm.stopCardTime[0]),
        end_date: timeFormat(this.stopCardForm.stopCardTime[1]),
        sell_id: Number(this.stopCardForm.sell_name.split(',')[0]),
        sell_name: this.stopCardForm.sell_name.split(',')[1],
        real_pay: Number(this.stopCardForm.real_pay),
        payment_method: Number(this.stopCardForm.paymethod),
        remark: this.stopCardForm.remark
      }
      stopVipCard(obj).then(res => {
        if (res) {
          this.$message({
            message: '停卡成功',
            type: 'success'
          })
          this.$refs.stopCardForm.resetFields()
          this.dialogClosed()
          this.$emit('stopVipCardbtnOK')
        }
      }).catch(err => {
        console.log(err)
      })
    },
    openModel(param, flag) {
      this.dialogVisible = true
      this.getVipDetail(param)
      this.isSecondCard = flag
    },
    getVipDetail(param) {
      let _isStoped = param.is_stoped
      this.vipCardId = param.id
      this.stopDialogInputDisable = (_isStoped === 2 || _isStoped === 1)
      if (_isStoped === 2 || _isStoped === 1) {
        this.getVipDetailTop(param.id)
        stopCardInfor(param.id).then(res => {
          let data = res.data
          this.stop_day = data.delay_day
          this.stopCardForm.stopCardTime = [new Date(data.start_date), new Date(data.end_date)]
          this.stopCardForm.real_pay = data.order.real_total_fee
          this.stopCardForm.sell_name = data.sell_employee.name
          this.stopCardForm.remark = data.remark
          this.stopCardForm.paymethod = data.order.payment_method + ''
        }).catch(err => {
          console.log(err)
        })
      } else {
        this.getVipDetailTop(param.id)
      }
    },
    cancelAppointBtn() {
      // 取消激活
      this.innerVisible = true
    },
    stopBtn() {
      let obj = {
        isRefund: Number(this.radio),
        id: this.vipCardId,
        is_stoped: 0
      }
      cencelVipCardGl(obj).then(res => {
        this.$message({
          message: '取消停卡成功',
          type: 'success'
        })
        this.innerVisible = false
        this.dialogClosed()
        this.$emit('stopVipCardbtnOK')
      }).catch(err => {
        console.log(err)
      })
    },
    changeEmployee(value) {
      if (value.split(',')[0] === '') {
        setTimeout(() => {
          this.$router.push('/components/staffmanage')
        }, 100)
      }
    },
    getVipDetailTop(id) {
      vipCardDetails(id).then(res => {
        let _data = res.data
        this.vipCardDetailsData = _data
        this.vipCardData = {
          card_no: _data.card_no,
          status: _data.status,
          end_date: _data.end_date,
          real_pay: _data.real_pay,
          start_date: _data.start_date,
          type: _data.type,
          card_name: _data.card_name,
          card_image: _data.card_image,
          has_date: _data.has_date
        }
        this.stop_count = _data.stop_count
        this.stop_day = _data.delay_day[0].num
      }).catch(err => {
        console.log(err)
      })
    }
  },
  computed: {
    employeesList() {
      let result = [{ id: 2, name: '待分配', status: 0 }]
      let data = this.employeesData.filter(currentValue => {
        return currentValue.status === 1
      })
      for (let val of data) {
        result.push({ id: val.id, name: val.name, status: val.status })
      }
      if (!result.length) {
        result.push({ id: '', name: '暂无数据，请先添加员工', status: '' })
      }
      return result
    }
  },
  components: {
    VipCardStyle
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.customizeDetailsDialog {
  /deep/ .el-dialog {
    border-radius: 5px;
  }
  /deep/ .el-dialog__header {
    border: 1px solid #cccccc;
    border-radius: 5px 5px 0px 0px;
  }
  /deep/ .el-dialog__body {
    padding: 10px 10px;
    border-radius: 0px 0px 5px 5px;
  }
}
.stopCardDialog {
  .el-dialog__body {
    .dialog-body-two {
      width: 95%;
      border-top: 1px solid #cccccc;
      margin: 0px auto;
      p {
        font-size: 14px;
        color: #000000;
        font-weight: 600;
        .ljStopCardTime {
          float: right;
        }
      }
      .cardForm {
        .el-select {
          width: 100%;
        }
        .el-date-editor {
          width: 100%;
        }
        .el-range-separator {
          margin-right: 2px;
        }
        label {
          font-weight: 600;
          font-size: 14px;
        }
        /deep/ .el-date-editor .el-range-separator{
          padding: 0px;
        }
      }
    }
  }
}
.isRefund-box{
  background-color: rgb(51, 51, 51);
  color:#ffffff;
}
.innerbox{
  /deep/ .el-dialog {
    border-radius: 5px;
  }
  /deep/ .el-dialog__header {
    border: 1px solid #cccccc;
    border-radius: 5px 5px 0px 0px;
  }
  /deep/ .el-dialog__body {
    padding: 10px 10px;
    border-radius: 0px 0px 5px 5px;
  }
}
</style>


