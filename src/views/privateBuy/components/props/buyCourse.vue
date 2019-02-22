<template>
  <div>
    <el-dialog
      title="预约团课"
      :visible.sync="dialogVisible"
      :width="widthSize"
      class="course-dialog"
      :beforeClose='dialogClosed'>
      <div v-if="stepOne===1">
        <el-steps :active="1" finish-status="success" simple>
            <el-step title="选择购买课程 1" ></el-step>
            <el-step title="查找客户 2" ></el-step>
            <el-step title="确认客户信息 3" ></el-step>
        </el-steps>
        <div class="form-box">
            <el-form :model="buyForm" :rules="buyRules" status-icon ref="buyFormStep" class="form1 buy-form">
            <el-form-item label="课程名称：" prop="course_id">
                <el-select v-model="buyForm.course_id" placeholder="请选择课程" style="margin-left:0;" @change="getCoatch">
                <el-option :label="item.label" :value="item.value" :key="index" v-for="(item,index) in privateCourse"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="课程次数：" prop="quantity" class="quantity">
                <el-input-number width="300px" v-model="buyForm.quantity" :min="1" :max="99999999" label="请选择次数"></el-input-number>
            </el-form-item>
            <el-form-item label="应付金额：" prop="should_pay" style="margin-left:12px;">
                <el-input v-model="should_pay" placeholder="应付金额" type="number" disabled="disabled"></el-input>
            </el-form-item>
            <el-form-item prop="sell_id" label="销售员工：" style="margin-left:12px;">
                <el-select v-model="buyForm.sell_id" placeholder="请选择销售员工">
                <el-option :label="item.label" :value="item.value" :key="item.value" :disabled="item.status === 3" v-for="item in staff"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="购买备注：" prop="desc" style="margin-left: 10px;">
                <el-input type="type" v-model="buyForm.remark" placeholder="请输入购买备注" :maxlength="20"></el-input>
            </el-form-item>
            </el-form>

            <el-form :model="buyForm" :rules="buyRules" status-icon ref="buyFormStep1" class="form2 buy-form2">
            <el-form-item label="教练姓名：" prop="coach_id">
                <el-select v-model="buyForm.coach_id" placeholder="请选择教练" style="margin-left:0;" @change="getCoatchPrice">
                <el-option :label="item.label" :value="item.value" :key="index" v-for="(item,index) in coach"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="失效日期：" prop="expired_at">
                <el-date-picker :picker-options="lostTime" type="date" placeholder="选择日期" v-model="buyForm.expired_at"></el-date-picker>
            </el-form-item>
            <el-form-item label="实付金额：" prop="real_total_fee">
                <el-input v-model="buyForm.real_total_fee" placeholder="实付金额" type="number" :min="1" class="pay-money-box"></el-input>
            </el-form-item>
            <el-form-item label="支付方式：" prop="payment_method" style="margin-left:12px;">
                <el-select v-model="buyForm.payment_method" placeholder="请选择支付方式">
                <el-option label="现金" value="1"></el-option>
                <el-option label="支付宝" value="2"></el-option>
                <el-option label="微信" value="3"></el-option>
                <el-option label="银行卡" value="4"></el-option>
                </el-select>
            </el-form-item>
            </el-form>
        </div>
        <div class="cabnit-dialog-footer" style="text-align:center;">
          <span slot="footer" class="dialog-footer">
              <el-button type="primary" @click="StepOneBtn">下一步</el-button>
          </span>
        </div>
      </div>

      <div v-if="stepOne===2">
        <el-steps :active="2" finish-status="success" simple>
          <el-step title="确认团课信息 1" ></el-step>
          <el-step title="查找客户 2" ></el-step>
          <el-step title="确认客户信息 3" ></el-step>
        </el-steps>
        <div class="otherSearcher">
          <div class="sm"></div>
          <el-input type="number" placeholder="请输入客户手机号码，或者扫描其APP上的个人条形码" v-model="buyForm.customerPhone" class="input-with-select" @keyup.enter.native="messageByPhone">
          <el-button slot="append" icon="el-icon-search" @click="messageByPhone"></el-button>
          </el-input>
        </div>
        <div class="cabnit-dialog-footer" style="text-align:center;">
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" class="gray" @click="toStepOne">上一步</el-button>
          </span>
        </div>
      </div>

      <div v-if="stepOne===3" class="buy-dialog">
        <el-steps :active="3" finish-status="success" simple>
          <el-step title="选择购买课程 1" ></el-step>
          <el-step title="查找客户 2" ></el-step>
          <el-step title="确认客户信息 3" ></el-step>
        </el-steps>
        <div class="form-box formStep3">
          <el-form :model="buyForm" :rules="buyRules" status-icon ref="buyForm" class=" buy-form">
            <el-form-item label="手机号码：">
              <el-input v-model="buyForm.customerPhone" placeholder="请输入手机号码" disabled></el-input>
            </el-form-item>
            <el-form-item v-if="disabled">
              <div class="tip" v-if="tipShow === true">提示：如果客户信息有误，点击此处<span class="use-span" @click="editCistomer">启用修改</span></div>
              <div class="tip" v-if="tipShow === false">提示：手动修改信息购买成功后，会在系统中自动录入该客户信息 &nbsp;&nbsp;&nbsp;
                <!-- <a href="javascript:;" style="color:#1878E1" @click="addCustomer" v-if="buyCustomerId === false">保存</a> -->
                <a href="javascript:;" style="color:#1878E1" @click="editPersonMsg" v-if="buyCustomerId === true">修改</a>   
                <a href="javascript:;" style="color:#1878E1" @click="cansle">取消</a></div>
            </el-form-item>
            <span class="notice" v-if="disabled">(已注册，已录入，未锁定)</span>
            <span class="notice" v-if="!disabled">(已注册，<span style="color:red;">未录入</span>，未锁定)</span>
            <el-form-item label="客户姓名：">
              <el-input v-model="buyForm.customerName" placeholder="请输入客户姓名" :disabled="hasCustomer" :maxlength="20"></el-input>
            </el-form-item>
            <el-form-item label="客户性别：">
              <el-select v-model="buyForm.customerSex" placeholder="请选择性别" style="margin-left:0;" :disabled="hasCustomer">
                <el-option label="男" :value="1" :key="1"></el-option>
                <el-option label="女" :value="2" :key="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="所属会籍：">
              <el-select filterable v-model="buyForm.consultant_id" placeholder="请选择销售员工" style="margin-left:0;" :disabled="hasCustomer">
                <el-option :label="item.label" :value="item.value" :key="item.value" :disabled="item.status === 3" v-for="item in staffHj"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <div class="cabnit-dialog-footer" style="text-align:center;">
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="toStepTwo" class="gray">上一步</el-button>
            <el-button type="primary" :disabled="btnDisabled" :loading="loading" @click="buySure">确认预约</el-button>
          </span>
        </div>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getAllCoatchBuy, getAllStaff, privateCourseList } from '@/api/course'
import { getCustomersByPhone, addCustomers } from '@/api/customer'
import { testFloat2 } from '@/utils/validate'
import { parseTime } from '@/utils/index'
// 电话号码
const validatePhone = (rule, value, callback) => {
  if (!(/^1[3|4|5|8][0-9]\d{4,8}$/.test(value))) {
    callback(new Error('请输入正确的手机号码'))
  } else {
    callback()
  }
}
// 实付金额
const validateMoney2 = (rule, value, callback) => {
  if (!testFloat2(value)) {
    callback(new Error('实付金额为正数，且只可保留两位小数'))
  } else if (Number(value) > 99999999) {
    callback(new Error('实付金额小于99999999'))
  } else {
    callback()
  }
}
// 时间
const validateExpired = (rule, value, callback) => {
  if (!value) {
    callback(new Error('失效日期不能为空'))
  } else {
    callback()
  }
}
export default {
  name: 'renewCabinetDialog',
  components: {
  },
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
    orderDay: {
      type: String,
      default() {
        return ''
      }
    },
    courseForm: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      stepOne: 1,
      should_payComput: '',
      lostTime: {
        disabledDate(time) {
          return time.getTime() < Date.now()
        }
      },
      coach: [],
      staff: [{
        'label': '待分配',
        'value': 2,
        'status': 0
      }], // 员工
      staffHj: [{
        'label': '待分配',
        'value': '',
        'status': 0
      }], // 会籍
      buyForm: {
        course_id: '',
        payment_method: '1',
        sell_id: 2,
        customerPhone: '',
        customerName: '',
        remark: '',
        customerId: '', // 会籍
        customerSex: '',
        real_total_fee: '', // 实付金额
        coach_id: '',
        expired_at: '', // 有效期
        consultant_id: '', // 会籍
        intent_level: '', // 意向等级
        quantity: '', // 课程次卡
        channel: '', // 来源渠道
        purpose: '' // 健身目的
      },
      courseOptions: [],
      privateCourse: [], // 私教课程
      hasCustomer: false,
      disabled: true,
      tipShow: true,
      btnDisabled: false,
      loading: false,
      // 表单验证规则
      buyRules: {
        course_id: [{ required: true, message: '请选择课程', trigger: 'change' }],
        coach_id: [{ required: true, message: '请选择教练', trigger: 'change' }],
        expired_at: [{ required: true, message: '不能为空', trigger: 'blur', validator: validateExpired }],
        real_total_fee: [{ required: true, trigger: 'blur', validator: validateMoney2 }],
        sex: [{ required: true, message: '请选择性别', trigger: 'change' }],
        phone: [{ required: true, trigger: 'blur', validator: validatePhone }],
        hj: [{ required: true, message: '请选择会籍', trigger: 'change' }],
        intent_level: [{ required: true, message: '请选择意向等级', trigger: 'change' }],
        channel: [{ required: true, message: '请选择来源渠道', trigger: 'change' }],
        purpose: [{ required: true, message: '请选择健身目的', trigger: 'change' }],
        quantity: [{ required: true, message: '请选择次卡', trigger: 'change' }]
      }
    }
  },
  computed: {
    should_pay() {
      return this.buyForm.quantity * this.should_payComput
    }
  },
  mounted() {
    this.courseNameList()
    this.getStaff()
  },
  created() {
  },
  methods: {
    toStepOne() {
      this.stepOne = 1
    },
    toStepTwo() {
      this.stepOne = 2
    },
    dialogClosed() {
      this.$emit('dialogClosed')
    },
    // 根据手机号码查询会员信息
    messageByPhone() {
      if (!this.buyForm.customerPhone) {
        this.common.message('warning', '手机号码不能为空')
        return false
      }
      if (!/^[1][3,4,5,7,8][0-9]{9}$/.test(this.buyForm.customerPhone.trim())) {
        this.common.message('warning', '请输入正确的电话号码')
        return
      }
      getCustomersByPhone(this.buyForm.customerPhone).then(res => {
        let data = res.data
        if (Object.keys(data).length) {
          // [...this.form] = [data]
          this.hasCustomer = true
          this.disabled = true
          this.tipShow = true

          this.buyForm.customerName = data.name
          this.buyForm.customerSex = data.sex
          this.buyForm.consultant_id = data.consultant_id
          this.buyForm.customerId = data.id
          this.buyCustomerId = true
          if (!(this.staffHj.filter(item => item.value === this.buyForm.consultant_id).length)) {
            this.buyForm.consultant_id = ''
          }
          this.common.message('success', '已获得客户信息')
        } else {
          this.buyForm.customerName = ''
          this.buyForm.customerSex = ''
          this.buyForm.consultant_id = ''
          this.common.message('success', '暂无该客户信息，请手动录入信息')
          this.hasCustomer = false
          this.disabled = false
          this.tipShow = false
          this.buyForm.customerId = ''
          this.buyCustomerId = false
        }
        this.stepOne = 3
      })
    },
    StepOneBtn() {
      if (!this.buyForm.course_id) {
        this.common.message('warning', '课程名称不能为空')
        return false
      }
      if (!this.buyForm.coach_id) {
        this.common.message('warning', '教练姓名不能为空')
        return false
      }
      if (!this.buyForm.sell_id) {
        this.buyForm.sell_id = 2
        // this.common.message('warning', '销售员工姓名不能为空')
        // return false
      }
      if (!this.buyForm.expired_at) {
        this.common.message('warning', '失效日期不能为空')
        return false
      } else if (new Date() - new Date(this.buyForm.expired_at) > 0) {
        this.common.message('warning', '失效日期不能小于当前时间')
        return false
      }
      if (!this.buyForm.real_total_fee) {
        this.common.message('warning', '实付金额不能为空')
        return false
      } else if (!testFloat2(this.buyForm.real_total_fee)) {
        this.common.message('warning', '实付金额为正数，且只可保留两位小数')
        return false
      } else if (Number(this.buyForm.real_total_fee) > 99999999) {
        this.common.message('warning', '付金额小于99999999')
        return false
      }
      if (!this.buyForm.payment_method) {
        this.common.message('warning', '支付方式不能为空')
        return false
      }
      let payMoneyBox = document.querySelector('.pay-money-box')
      if (payMoneyBox.lastChild.tagName === 'P') {
        this.common.message('warning', payMoneyBox.lastChild.innerHTML)
        return false
      }
      this.buyForm.expired_at = parseTime(this.buyForm.expired_at, '{y}-{m}-{d}')
      this.stepOne = 2
    },
    cancelModify() {
      this.signMarks.tipShow = true
      this.signMarks.btnDisabled = false
    },
    // 点击启用修改
    editCustomer() {
      this.hasCustomer = false
      this.disabled = true
      this.tipShow = false
      this.btnDesabled = true // 不能预约
    },
    // 修改会员信息
    editPersonMsg() {
      this.loading = true
      this.$store.dispatch('EditCustomer', this.orderForm).then((res) => {
        this.signMarks.tipShow = true
        this.signMarks.btnDisabled = false
        this.loading = false
        this.common.message('success', '修改成功')
      }).catch(() => {
        this.loading = false
      })
    },
    // 添加用户
    addPersonMsg() {
      let userInfo = {
        phone: this.orderForm.customerPhone,
        name: this.orderForm.customerName,
        sex: this.orderForm.customerSex,
        consultant_id: this.orderForm.consultant_id
      }
      if (!userInfo.name) {
        this.common.message('warning', '客户姓名不能为空')
        return
      }
      if (!userInfo.sex) {
        this.common.message('warning', '客户性别不能为空')
        return
      }
      this.loading = true
      addCustomers(userInfo).then((res) => {
        this.signMarks.tipShow = true
        this.loading = false
        this.signMarks.addUser = 1
        this.common.message('success', '客户信息录入成功')
        this.orderForm.customerId = res.data.id
      }).catch(() => {
        this.loading = false
      })
    },
    // 确定预约
    buySure() {
      this.$emit('buyCourseBtn')
    },
    // 查询价格
    getCoatchPrice() {
      for (let i = 0; i < this.coach.length; i++) {
        if (this.buyForm.coach_id === this.coach[i].value) {
          this.should_payComput = this.coach[i].price
        }
      }
    },
    courseNameList() {
      privateCourseList(this.courseQuery).then(response => {
        for (let i = 0; i < response.data.length; i++) {
          // 过滤app销售的课程
          // if (response.data[i].app_status === 2) {
          this.courseOptions.push({ text: response.data[i].name, value: response.data[i].id + ',' + response.data[i].name, class: 'ccourse_id' })
          // 获得所有上架的私教课程
          this.privateCourse.push({
            'label': response.data[i].name,
            'value': response.data[i].id
          })
          // }
        }
      })
    },
    // 查询所有教练,必须在选了课程之后才有
    getCoatch() {
      this.coach = []
      this.buyForm.coach_id = ''
      getAllCoatchBuy(this.buyForm.course_id).then(response => {
        if (response.data.length > 0) {
          for (let i = 0; i < response.data.length; i++) {
            if (response.data[i].coach) {
              this.coach.push({
                'label': response.data[i].coach.name,
                'value': response.data[i].id,
                'price': response.data[i].price
              })
            }
          }
        } else {
          this.common.message('warning', '该课程暂无教练')
        }
      })
    },
    // 查询所有销售员工
    getStaff() {
      getAllStaff().then(response => {
        for (let i = 0; i < response.data.length; i++) {
          if (response.data[i].status === 1) {
            this.staff.push({
              'label': response.data[i].name,
              'value': response.data[i].id,
              'status': response.data[i].status
            })
            this.staffHj.push({
              'label': response.data[i].name,
              'value': response.data[i].id,
              'status': response.data[i].status
            })
          }
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.quantity /deep/ .el-input-number__increase {
  right: -99px;
}
.dialog-footer /deep/{
  .el-button--primary {
    background: #000;
    border: 1px solid #000;
  }
}
// .quantity /deep/ .el-input-number--medium {
//   width: 199px;
// }
.form-box {
  margin-top: 50px;
  overflow: hidden;
  .form1 {
    margin-left: 30px;
  }
  .form1, .form2 {
    float: left;
    width: 48%;
    b {
      font-size: 18px;
      font-weight: normal;
    }
  }
}
.otherSearcher {
  width: 700px;
  margin: 60px auto;
}
.sm{
  width: 36px;
  display: inline-block;
  height: 36px;
  background: url("../../../../assets/icon/qr.png") no-repeat;
  background-size: contain;
  vertical-align: middle;
  margin-right: -4px;
  margin-top: -4px;
  border-radius: 5px 0 0 5px;
}
.otherSearcher .el-select .el-input {
  width: 550px;
  padding-left: 0px;
}
</style>