<template>
    <el-dialog
      title="财务核对"
      :visible.sync="dialogVisible"
      width="500px"
      class="course-dialog" @close="addclose" :close-on-click-modal="false">
      <div class="financia-box">
        <div class="financial-form">
          <el-form :model="examineMsg" :rules="rules" ref="examineMsg">
            <el-form-item label="审核状态：" prop="type">
              <el-radio-group v-model="examineMsg.type">
                <el-radio label="1">有效</el-radio>
                <el-radio label="2">作废</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="实付金额：" prop="real_total_fee" label-width="100px">
              <el-input v-model="examineMsg.real_total_fee" placeholder="请输入实付金额"></el-input>
            </el-form-item>
            <el-form-item label="支付方式：" prop="payment_method" label-width="100px">
              <el-select v-model="examineMsg.payment_method" placeholder="请选择支付方式"  @change="paymethodChage">
                <el-option :label="item.label" :value="item.value" :key="index" v-for="(item,index) in payMethod"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-if="iscardsPaymeth" label="储值卡号：" label-width="100px">
              <el-input placeholder="请输入储值卡号"  
                v-model="petCardNo"
                :suffix-icon="cardInputIcon"
                @focus="cardInputFocus">
                <template slot="prepend"><i class="qr"></i></template>
                <el-button slot="append" icon="el-icon-search" @click="petCardNoInput"></el-button>
              </el-input>
            </el-form-item>
            <el-form-item label="销售员工：" prop="sell_id" label-width="100px">
              <el-select v-model="examineMsg.sell_id" filterable placeholder="请选择销售员工" @change="changestaff">
                <el-option :label="item.label" :value="item.value" :key="index" v-for="(item,index) in staffs"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="备注：" prop="remark" label-width="100px">
              <el-input v-model="examineMsg.remark" placeholder="请填写修改原因" :maxlength="20"></el-input>
            </el-form-item>
            <el-form-item label="操作记录：" prop="operate" style="margin-left:15px;">
              <!-- 操作记录 -->
              <div v-if="operationList.length" class="operateBox">
                <operation-record :operationList='operationList'>
                </operation-record>
              </div>
              <span v-else>无</span>
            </el-form-item>
          </el-form>
        </div>

      </div>
      <div style="text-align:center;">
        <span slot="footer" class="dialog-footer">
          <el-button type="info" @click="dialogVisible=false">取消</el-button>
          <el-button type="primary" :loading="loading" class="black" @click="btnSure" :disabled="submitBug">确定</el-button>
        </span>
      </div>
    </el-dialog>
</template>

<script>
import operationRecord from './operationRecord'
import { testFloat2 } from '@/utils/validate'
import { financeMessage, financeChecks } from '@/api/statistics'
import { employeeList } from '@/api/employee'
import { cardsNoList } from '@/api/vipcardGl'
const realpayVerification = (rule, value, callback) => {
  if (!testFloat2(value)) {
    callback(new Error('实付金额为正数，且只可保留两位小数'))
  } else if (Number(value) > 99999999) {
    callback(new Error('实付金额小于99999999'))
  } else {
    callback()
  }
}
export default {
  name: '',
  components: {
    operationRecord
  },
  props: {
  },
  data() {
    return {
      dialogVisible: false,
      loading: false,
      payMethod: [{
        label: '现金',
        value: 1
      }, {
        label: '支付宝',
        value: 2
      }, {
        label: '微信',
        value: 3
      }, {
        label: '银行卡',
        value: 4
      }, {
        label: '储值卡',
        value: 5
      }],
      staffs: [{
        label: '待分配',
        value: 2,
        status: 0
      }],
      operationList: [
      ],
      examineMsg: {
        id: '',
        type: 1,
        real_total_fee: '',
        payment_method: '',
        sell_id: '',
        sell_name: '',
        remark: ''
      },
      rules: {
        type: [{ required: true, message: '请选择审核状态' }],
        real_total_fee: [{ required: true, trigger: 'blur', validator: realpayVerification }],
        payment_method: [{ required: true, message: '请选择支付方式', trigger: 'change' }],
        sell_id: [{ required: true, message: '请输入销售员工', trigger: 'change' }]
      },
      cardsId: undefined,
      petCardNo: '',
      cardsNoList: [],
      iscardsPaymeth: false,
      _cardsNoList: null, // 暂存储值信息
      submitBug: false, // 提交有错误
      cardsNoErr: false, // 储值卡号错误
      hasCardsdNo: false, // 是否输入储值卡号
      ispetCardNoBtn: false // 是否点击储值卡号查找按钮
    }
  },
  mounted() {
  },
  created() {
    this.employeeList()
  },
  watch: {
  },
  computed: {
    cardInputIcon() {
      return this.hasCardsdNo ? this.cardsNoErr ? 'el-icon-error' : 'el-icon-success' : ''
    }
  },
  methods: {
    dialogShow(obj) {
      // this.dialogVisible = true
      this.examineMsg.id = obj.id
      this.examineMsg.type = this.getStatus(obj.deleted_at)
      this.examineMsg.real_total_fee = Object.assign(obj.real_total_fee)
      this.examineMsg.payment_method = obj.payment_method
      this.submitBug = false
      // 储值卡支付
      if (this.examineMsg.payment_method === 5) {
        this.iscardsPaymeth = true
        if (obj.debit_card) {
          this.cardsId = obj.debit_card.id
          this.petCardNo = obj.debit_card.card_no
          this._cardsNoList = obj.debit_card
          this.cardsNoList[0] = this._cardsNoList
        }
      } else {
        this.iscardsPaymeth = false
      }
      this.examineMsg.sell_id = obj.sell_id
      this.examineMsg.sell_name = obj.sell_name
      this.getList()
    },
    addclose() {
      this.resetStoreCardParam()
      this._cardsNoList = null
      this.examineMsg.remark = ''
    },
    getList() {
      // 操作记录
      financeMessage(this.examineMsg.id).then(res => {
        this.operationList = res.data
        this.dialogVisible = true
      })
    },
    changestaff(val) {
      let obj = this.staffs.find((item) => {
        return item.value === val
      })
      this.examineMsg.sell_name = obj.label
    },
    employeeList() {
      employeeList().then(response => {
        for (let i = 0; i < response.data.length; i++) {
          this.staffs.push({ 'value': response.data[i].id, 'label': response.data[i].name })
        }
      })
    },
    getStatus(val) {
      if (val) {
        return '2'
      } else {
        return '1'
      }
    },
    btnSure() {
      this.examineMsg.debit_card_id = undefined
      this.examineMsg.debit_card_no = undefined
      if (!testFloat2(this.examineMsg.real_total_fee)) {
        this.common.message('warning', '实付金额为正数，且只可保留两位小数')
        return
      } else if (Number(this.examineMsg.real_total_fee) > 99999999) {
        this.common.message('warning', '实付金额小于99999999')
        return
      }
      if (this.examineMsg.payment_method === 5) {
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
      if (Number(this.examineMsg.real_total_fee) > Number(this.cardsNoList[0].balance)) {
        this.common.message('error', '所选的储值卡剩余金额不足，请选择其它储值卡或更换支付方式')
        return false
      }
      this.examineMsg.debit_card_id = this.cardsId
      this.examineMsg.debit_card_no = this.cardsNoList[0].card_no
      this.beginAfter()
    },
    beginAfter() {
      // 开始向后端传递数据
      this.loading = true
      financeChecks(this.examineMsg.id, this.examineMsg).then(res => {
        this.loading = false
        this.dialogVisible = false
        this.common.message('success', '财务核对成功')
        this.$emit('financeCheckBtn')
      }).catch(err => {
        this.loading = false
        console.log(err)
      })
    },
    paymethodChage(param) {
      // 支付方式
      this.resetStoreCardParam()
      if (param === 5) {
        // 获取储值卡有效列
        this.iscardsPaymeth = true
        // 如果之前是储值卡支付，切换到储值卡支付
        if (this._cardsNoList) {
          this.cardsId = this._cardsNoList.id
          this.petCardNo = this._cardsNoList.card_no
          this.cardsNoList[0] = this._cardsNoList
        }
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
    }
  }
}
</script>
<style lang="scss" scoped>
.financia-box /deep/ {
  .financial-form {
    width: 400px;
    margin: 0 auto;
    .el-input {
      width: 300px;
    }
    /deep/ .el-input-group__append {
      padding: 0px 17px
    }
    /deep/ .el-input-group__prepend {
      padding: 0px 17px
    }
  }
}
.operateBox {
  display: inline-block;
  width: 300px;
}
.qr{
  width: 36px;
  position: absolute;
  left: 0;
  top: -1px;
  height: 36px;
  background: url("../../../../assets/icon/qr.png") no-repeat center;
  background-size: cover;
  border-radius: 5px 0 0 5px;
}
</style>