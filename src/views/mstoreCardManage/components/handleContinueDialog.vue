<template>
  <el-dialog
    title="会员卡续费"
    :visible.sync="dialogVisible"
    append-to-body
    class="customizeDetailsDialog"
    width="500px" top="8vh">
    <div class="dialog-body" style="width:100%;">
      <vip-card-style :vipCardData="vipCardData" :isSecondCard="isSecondCard"
                      style="width:95%;margin:0px auto;"></vip-card-style>
      <div class="dialog-body-two">
        <el-form :model="continueCardForm" label-width="100px" :rules="continueCardRule" ref="continueCardDoc">
          <!-- 次卡 -->
          <el-row v-if="isSecondCard" class="gray-back">
            <el-form-item label="增加次数:" prop="renew_times">
             <span class="por">
               <el-input
                 v-model="continueCardForm.renew_times"
                 @keyup.native="proving3"
                 @change.native="proving3"
                 placeholder="请输入大于等于1的整数"
                 type="number"
                 oninput="if(value.length > 8)value = value.slice(0, 8)"></el-input>
               <span class="poa">次</span>
             </span>
            </el-form-item>
            <el-form-item label="失效日期:">
              <el-date-picker
                style="display: inline-block;width: 70%;"
                v-model="continueCardForm.renew_end_date"
                type="date" :disabled="isChecked"
                :clearable="false"
                placeholder="请选择失效日期"
                :editable="true"
                :picker-options="initpicker"
                value-format="yyyy-MM-dd">
              </el-date-picker>
              <el-checkbox v-model="isChecked">永不过期</el-checkbox>
            </el-form-item>
          </el-row>
          <!-- 时效卡 -->
          <el-row v-if="!isSecondCard" class="gray-back">
            <el-form-item label="续卡方式:" prop="activMethod">
              <el-radio-group v-model="continueCardForm.prescriptionMethod">
                <el-radio label="1" border>增加天数</el-radio>
                <el-radio label="2" border>失效日期</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="增加天数:" prop="add_days">
               <span class="por">
                <el-input v-model="continueCardForm.add_days"
                          placeholder="请输入大于等于0的整数"
                          @keyup.native="proving1"
                          @change.native="proving1"
                          type="number"
                          :disabled="continueCardForm.prescriptionMethod == 2"
                          oninput="if(value.length > 7)value = value.slice(0, 7)"></el-input>
                <span class="poa">天</span>
              </span>
            </el-form-item>
            <el-form-item label="失效日期:">
              <el-date-picker
                :disabled="continueCardForm.prescriptionMethod == 1"
                v-model="continueCardForm.renew_end_date"
                type="date"
                :clearable="false"
                :picker-options="initpicker"
                placeholder="请选择失效日期" style="width:100%"
                :editable="false"
                value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-form-item>
          </el-row>


          <!-- base -->
          <el-form-item label="实付金额:" prop="real_total_fee">
             <span class="por">
               <el-input
                 v-model="continueCardForm.real_total_fee"
                 placeholder="请填写金额"
                 @keyup.native="proving2"
                 @change.native="proving2"
                 type="number"
                 oninput="if(value.length > 8)value = value.slice(0, 8)"></el-input>
               <span class="poa">元</span>
             </span>
          </el-form-item>
          <el-form-item label="销售员工:" prop="sell_id">
            <el-select v-model="continueCardForm.sell_id" filterable placeholder="请选择销售员工" style="width:100%">
              <el-option
                v-for="item in selectoptions"
                :disabled="item.status === 3"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="支付方式:" prop="payment_method">
            <el-select v-model="continueCardForm.payment_method" placeholder="请选择支付方式" style="width:100%">
              <el-option
                v-for="item in selloptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input type="textarea" v-model="continueCardForm.remark"
              placeholder="请在这里填写续卡备注" :autosize="{ minRows: 5, maxRows: 10}"
              :maxlength="20"></el-input>
          </el-form-item>
          <el-form-item style="text-align: center">
            <el-button :loading="loading" @click="continueCard" style="margin-left:-50px;background-color: rgb(51, 51, 51);color:#ffffff;">确定</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </el-dialog>
</template>
<script>
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
  import VipCardStyle from '@/components/vipCardStyle'
  import { parseTime } from '@/filters/index'
  import { vipCardDetails, continueVipCardGl } from '@/api/vipcardGl'
  import { employeeList } from '@/api/employee'
  export default {
    name: 'handleContinueDialog',
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
      }]
      return {
        timer: Date.now(),
        dialogVisible: false,
        loading: false,
        continueCardForm: {
          real_total_fee: 0,
          sell_id: 2,
          payment_method: selloptions[0].value,
          remark: '',
          prescriptionMethod: '1', // 时效卡-续卡方式
          add_days: 0, // 时效卡-增加天数
          renew_times: '1', // 次卡-增加次数
          renew_end_date: '', // 失效时间
          id: ''
        },
        continueCardRule: {
          real_total_fee: [
            { required: true, message: '请输入金额', trigger: 'blur' },
            { validator: realpayVerification, trigger: 'blur' },
          ],
          renew_times: [
            { required: true, message: '请输入增加次数', trigger: 'blur' }
          ]
        },
        isChecked: false,
        rules: {},
        vipCardData: {},
        vipCardDetailsData: {},
        isSecondCard: false,
        selectoptions: [],
        selloptions: selloptions,
      }
    },
    watch: {
      isChecked(newval, oldval) {
        if (newval) {
          this.continueCardForm.renew_end_date = '9999-12-31'
        } else {
          this.timer = (this.timer === '9999-12-31' ? parseTime(Date.now(), '{y}-{m}-{d}') : this.timer)
          this.continueCardForm.renew_end_date = this.timer
        }
      }
    },
    created() {
      this.getEmployeeList()
    },
    methods: {
      resetData() {
        this.continueCardForm = {
          real_total_fee: 0,
          sell_id: 2,
          payment_method: 1,
          remark: '',
          prescriptionMethod: '1',
          add_days: 0,
          renew_times: '1',
          renew_end_date: '',
          id: ''
        }
      },
      proving1() {
        if (!this.continueCardForm.add_days.length) {
          return false
        }
        let currentValue = Math.abs(~~parseInt(this.continueCardForm.add_days))
        // this.continueCardForm.add_days = currentValue === 0 ? '' : currentValue
        this.continueCardForm.add_days = currentValue
        let etime = this.timer
        etime = new Date(etime).getTime() + this.continueCardForm.add_days * 86400000
        this.continueCardForm.renew_end_date = parseTime(etime, '{y}-{m}-{d}')
      },
      proving2() {
        let currentValue = Math.abs(parseFloat(this.continueCardForm.real_total_fee))
        this.continueCardForm.real_total_fee = currentValue
      },
      proving3() {
        if (!this.continueCardForm.renew_times.length) {
          return false
        }
        let currentValue = Math.abs(~~parseInt(this.continueCardForm.renew_times))
        this.continueCardForm.renew_times = currentValue
      },
      // 续卡提交
      continueCard() {
        if (!this.isSecondCard) {
          this.continueCardForm.renew_times = undefined
        } else {
          if (!this.continueCardForm.renew_times) {
            this.common.message('error', '请输入正确的值(增加次数大于0的正整数)')
            return
          }
        }
        this.$refs['continueCardDoc'].validate((valid) => {
          if (valid) {
            this.loading = true
            continueVipCardGl(this.continueCardForm).then(res => {
              this.loading = false
              this.dialogVisible = false
              this.common.message('success', '续卡成功！')
              this.resetData()
              this.$emit('continueSuccess', this.isSecondCard)
            }).catch(() => {
              this.loading = false
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      // 弹框出现
      openModel: function(id, flag) {
        this.dialogVisible = true
        this.getVipDetail(id)
        this.isSecondCard = flag
      },
      // 获取员工列表
      getEmployeeList() {
        employeeList().then(res => {
          this.selectoptions = []
          let data = res.data.filter(currentValue => {
            return currentValue.status === 1
          })
          this.selectoptions.push({ value: 2, label: '待分配', status: 0 })
          for (let val of data) {
            this.selectoptions.push({ value: val.id, label: val.name, status: val.status })
          }
        })
      },
      getVipDetail(id) {
        vipCardDetails(id).then(res => {
          let _data = res.data
          this.timer = _data.end_date
          this.vipCardDetailsData = _data
          this.continueCardForm.id = _data.id
          this.continueCardForm.renew_end_date = _data.end_date
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
          if (this.isSecondCard) {
            this.vipCardData.use_times = _data.use_times
            this.vipCardData.total_times = _data.total_times
            this.isChecked = _data.end_date === '9999-12-31'
          }
        }).catch(err => {
          console.log(err)
        })
      },
    },
    computed: {
      initpicker() {
        let timers = new Date(this.timer)
        return { disabledDate(time) {
          return time < timers
        } }
      }
    },
    components: {
      VipCardStyle
    }
  }
</script>
<style lang="scss" scoped>
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
  .dialog-body-two {
    border-top: 1px solid #cccccc;
    width: 90%;
    margin: 0 auto;
    padding-top: 15px;
  }
  .por {
    position: relative;
  }

  .poa {
    position: absolute;
    right: 10px;
    top: -9px;
  }

  .gray-back {
    background-color: #f7f9fa;
    padding: 5px 0;
    margin-bottom: 5px;
    .el-radio {
      background-color: white;
    }
  }

  .el-form-item {
    width: 95%;
  }
</style>


