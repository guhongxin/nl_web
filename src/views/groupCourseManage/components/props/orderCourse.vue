<template>
  <div>
    <el-dialog
      title="预约团课"
      :visible.sync="dialogVisible"
      :width="widthSize" top="6vh"
      class="course-dialog"
      :beforeClose='dialogClosed'>
      <div v-if="stepOne===1">
        <el-steps :active="1" finish-status="success" simple>
          <el-step title="确认团课信息 1" ></el-step>
          <el-step title="查找客户 2" ></el-step>
          <el-step title="确认客户信息 3" ></el-step>
        </el-steps>
        <div class="form-box" style="margin-top:25px;margin-left: 50px;">
          <el-form :model="courseMsg" :rules="rules2" ref="reserCourseMsg">
            <el-form-item label="课程名称：" prop="name">
              <el-input v-model="courseMsg.name" placeholder="请输入课程名称" disabled></el-input>
            </el-form-item>
            <el-form-item label="教练姓名：" prop="coach_id" style="margin-left:40px">
              <el-select v-model="courseMsg.coach_id" placeholder="请选择教练" disabled>
                <el-option :label="item.label" :value="item.value" :key="index" v-for="(item,index) in coach"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="预约人数：" prop="price">
              <span :class="[ isGroup === '已成团' ? 'chengt' : '' ]">{{isGroup}}</span> <span style="display:inline-block;width:150px;">{{courseMsg.apply_num === null ? 0 : courseMsg.apply_num}}/{{courseMsg.max_person}}</span>
            </el-form-item>
            <el-form-item label="课程价格：" prop="price" style="margin-left:144px">
              <el-input v-model="courseMsg.price" placeholder="请输入课程价格" type="number" disabled></el-input>
            </el-form-item>
            <el-form-item label="上课地点：" prop="address">
              <el-input v-model="courseMsg.address" placeholder="请输入上课地点" disabled=""></el-input>
            </el-form-item>
            <el-form-item label="实付金额：" prop="real_pay" style="margin-left:40px">
              <el-input v-model="courseMsg.real_pay" placeholder="请输入实付金额" type="number"></el-input>
            </el-form-item>
            <el-form-item label="销售员工：" style="margin-left:10px">
              <el-select v-model="orderForm1.sell_id" placeholder="请选择销售员工">
                <el-option :label="item.label" :value="item.value" :key="index" v-for="(item,index) in staff"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="支付方式：" style="margin-left:50px;">
              <el-select v-model="orderForm1.payment_method" placeholder="请选择支付方式"  @change="paymethodChage">
                <el-option :label="item.label" :value="item.value" :key="index" v-for="(item,index) in payMethod"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="购买备注：" style="margin-left:10px;">
              <el-input v-model="orderForm1.remark" placeholder="请输入购买备注，最多100字" :maxlength="100"></el-input>
            </el-form-item>
            <el-form-item v-if="iscardsPaymeth" label="储值卡号：" style="margin-left:50px;">
              <el-input placeholder="请输入储值卡号"
                class="cards-box"
                v-model="petCardNo"
                :suffix-icon="cardInputIcon"
                @focus="cardInputFocus">
                <template slot="prepend"><i class="qr"></i></template>
                <el-button slot="append" icon="el-icon-search" @click="petCardNoInput"></el-button>
              </el-input>
            </el-form-item>
            <el-form-item label="上课时间：" prop="week" class="selectTime">
              <el-select v-model="courseMsg.week" placeholder="请选择时间" class="select" disabled>
                <el-option v-for="item in weekDate" :label="item.label" :value="item.value" :key="item.value"></el-option>
              </el-select>
              <el-time-picker style="width:432px"
                is-range
                v-model="timePicker"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                placeholder="选择时间" disabled>
              </el-time-picker>
            </el-form-item>
            <el-form-item v-if="haveSeat" label="席位选择：" style="margin-left:10px">
              <div class="sit-box" v-loading="getDataLoading">
                <div class="sit-title">前台大屏幕</div>
                <div class="sit-content">
                  <div class="sit-tab">
                    <div><img :src="sitWhite">有效</div>
                    <div><img :src="sitGray">已售</div>
                    <div><img :src="sitRed">禁用</div>
                  </div>
                  <ul class="sit-list" ref="seatList">
                    <li v-for="(item, index) in seatArr" :key="index" v-if="seatArr && seatArr.length>0"
                        @click="chooseSeat(item, index)">
                      <img :src="computedImg(item.status)">
                      <span :class="[item.status===0?'black':'white']">{{item.show_no||item.show_no===0?item.show_no:index + 1}}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </el-form-item>
          </el-form>
        </div>
        <div class="cabnit-dialog-footer" style="text-align:center;margin-top: 20px;">
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" :loading="loading" @click="StepOneBtn" :disabled="submitBug">下一步</el-button>
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
          <el-input type="number" placeholder="请输入客户手机号码，或者扫描其APP上的个人条形码" v-model="orderForm.customerPhone" class="input-with-select" @keyup.enter.native="messageByPhone">
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
          <el-form class="courseForm" ref="elfromstep3" :rules="rulesCustomer" :model="rulesCustomer">
            <el-form-item label="手机号码：" style="margin-left:12px;">
              <el-input v-model="orderForm.customerPhone" placeholder="请输入手机号码" disabled></el-input>
            </el-form-item>
            <el-form-item v-if="signMarks.addUser !== 0">
              <div class="tip" v-if="signMarks.tipShow === true">提示：如果客户信息有误，点击此处<span class="use-span" @click="editCustomer">启用修改</span></div>
              <div class="tip" v-if="signMarks.tipShow === false" style="line-height: 25px;">提示：手动修改信息成功后，会在系统中自动录入该客户信息 &nbsp;&nbsp;&nbsp;
                <!-- <a href="javascript:;" style="color:#1878E1" @click="addPersonMsg" v-if="!signMarks.isEdit">保存</a> -->
                <a href="javascript:;" style="color:#1878E1" @click="editPersonMsg" v-if="signMarks.isEdit">修改</a>
                <a href="javascript:;" style="color:#1878E1" @click="cancelModify">取消</a>
              </div>
            </el-form-item>
            <span class="notice">(已注册，<span v-if="signMarks.addUser != 0">已录入</span><span v-if="signMarks.addUser === 0" style="color:red;">未录入</span>，未锁定)</span>
            <el-form-item label="客户姓名：" prop="customerName">
              <el-input v-model="orderForm.customerName" placeholder="请输入客户姓名" :disabled="signMarks.tipShow" :maxlength="16"></el-input>
            </el-form-item>
            <el-form-item label="客户性别：" prop="customerSex" >
              <el-select v-model="orderForm.customerSex" placeholder="请选择性别" style="margin-left:0;" :disabled="signMarks.tipShow">
                <el-option label="男" :value="1" :key="1"></el-option>
                <el-option label="女" :value="2" :key="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="所属会籍："  prop="consultant_id" style="margin-left:12px;">
              <el-select filterable v-model="orderForm.consultant_id" placeholder="请选择会籍" style="margin-left:0;" :disabled="signMarks.tipShow">
                <el-option :label="item.label" :value="item.value" :key="index" v-for="(item,index) in staffHj"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <div class="cabnit-dialog-footer" style="text-align:center;">
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="toStepTwo" class="gray">上一步</el-button>
            <el-button type="primary" :disabled="signMarks.btnDisabled" :loading="loading" @click="buySure">确认预约</el-button>
          </span>
        </div>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import sitRed from '@/assets/icon/sit-red.png'
import sitGray from '@/assets/icon/sit-gray.png'
import sitWhite from '@/assets/icon/sit-white.png'
import { privateCoachList, getAllStaff, newOrderGroupCourse, getHallsDetail } from '@/api/course'
import { getCustomersByPhone, addCustomers } from '@/api/customer'
import { testFloat2 } from '@/utils/validate'
import { cardsNoList } from '@/api/vipcardGl'
// import { parseTime } from '@/utils/index'
const realpayVerification = (rule, value, callback) => {
  if (!testFloat2(value)) {
    callback(new Error('实付金额为正数，且只可保留两位小数'))
  } else if (Number(value) > 99999999) {
    callback(new Error('实付金额小于99999999'))
  } else if (Number(value) === 0) {
    callback(new Error('实付金额必须大于0'))
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
      default() {
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
  computed: {
    cardInputIcon() {
      return this.hasCardsdNo ? this.cardsNoErr ? 'el-icon-error' : 'el-icon-success' : ''
    }
  },
  data() {
    return {
      sitRed, sitGray, sitWhite,
      stepOne: 1,
      phoneDialogVisible: false,
      customerDialogVisible: false,
      timePicker: [],
      courseMsg: {},
      signMarks: {
        disabled: true,
        tipShow: true,
        addUser: 0,
        btnDisabled: false,
        isEdit: true
      },
      isGroup: '',
      course_type: [{
        label: '增肌',
        value: 'Z'
      }, {
        label: '减脂',
        value: 'J'
      }, {
        label: '塑形',
        value: 'S'
      }],
      weekDate: [{
        label: '星期一',
        value: 1
      }, {
        label: '星期二',
        value: 2
      }, {
        label: '星期三',
        value: 3
      }, {
        label: '星期四',
        value: 4
      }, {
        label: '星期五',
        value: 5
      }, {
        label: '星期六',
        value: 6
      }, {
        label: '星期日',
        value: 7
      }],
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
      payMethod: [{
        label: '现金',
        value: '1'
      }, {
        label: '支付宝',
        value: '2'
      }, {
        label: '微信',
        value: '3'
      }, {
        label: '银行卡',
        value: '4'
      }, {
        label: '储值卡',
        value: '5'
      }],
      orderForm: {
        customerPhone: '',
        customerName: '',
        customerSex: '',
        consultant_id: '',
        customerId: '',
        intent_level: '',
        channel: '',
        purpose: ''
      },
      orderForm1: {
        price: '',
        payment_method: '1',
        sell_id: 2,
        schedule_id: '',
        customer_id: '',
        remark: '',
        seat_id: 0,
      },
      loading: false,
      // 表单验证规则
      rules2: {
        type: [{ required: true, message: '请选择课程' }],
        name: [
          { required: true, message: '请选择课程名称', trigger: 'change' },
          { min: 1, max: 16, message: '长度在 1 到 16 个字符', trigger: 'blur' }
        ],
        coach_id: [{ required: true, message: '请选择教练', trigger: 'change' }],
        address: [{ required: true, message: '请输入上课地点', trigger: 'change' }],
        price: [{ required: true, trigger: 'blur', validator: realpayVerification }],
        min_person: [{ required: true, message: '请输入上课人数', trigger: 'blur' }],
        max_person: [{ required: true, message: '请输入上课人数', trigger: 'blur' }],
        week: [{ required: true, message: '请输入上课时间', trigger: 'change' }],
        real_pay: [{ required: true, trigger: 'blur', validator: realpayVerification }]
      },
      rulesCustomer: {
        customerName: [{ required: true, message: '请输入客户姓名', trigger: 'blur' }],
        customerSex: [{ required: true, message: '请选择性别', trigger: 'change' }]
      },
      cardsId: undefined,
      petCardNo: '',
      cardsNoList: [],
      iscardsPaymeth: false,
      submitBug: false, // 提交有错误
      cardsNoErr: false, // 储值卡号错误
      hasCardsdNo: false, // 是否输入储值卡号
      ispetCardNoBtn: false, // 是否点击储值卡号查找按钮
      seatArr: [],
      getDataLoading: false,
      haveSeat: false
    }
  },
  mounted() {
    this.getCoaches()
    this.getStaff()
  },
  created() {
    this.courseMsg = this.courseForm
    this.courseMsg.real_pay = ''
    this.courseMsg.msg = ''
    if (this.timePicker === undefined || !(this.timePicker instanceof Array)) {
      this.timePicker = []
    }
    // this.timePicker[0] = parseTime(new Date(), '{y}-{m}-{d}') + ' ' + this.courseMsg.start_at
    // this.timePicker[1] = parseTime(new Date(), '{y}-{m}-{d}') + ' ' + this.courseMsg.end_at
    this.timePicker[0] = this.courseMsg.start_at
    this.timePicker[1] = this.courseMsg.end_at
    if (this.courseMsg.apply_num >= this.courseMsg.min_person) {
      this.isGroup = '已成团'
    } else if (this.courseMsg.apply_num < this.courseMsg.min_person) {
      this.isGroup = '未成团'
    }
    if (this.courseForm.hall_id) {
      this.gethallDetailMethods()
      this.haveSeat = true
    } else {
      this.haveSeat = false
    }
  },
  methods: {
    toStepOne() {
      this.stepOne = 1
    },
    toStepTwo() {
      this.stepOne = 2
    },
    dialogClosed() {
      this.resetStoreCardParam()
      this.$emit('dialogClosed')
    },
    changeValue(value) {
      let obj = {}
      obj = this.coach.find((item) => {
        return item.value === value
      })
      this.courseForm.coach_name = obj.label
    },
    timeformat(param) {
      let result = ''
      let date = new Date(param)
      let hh = date.getHours() > 9 ? date.getHours() : '0' + date.getHours()
      let mm = date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes()
      result = hh + ':' + mm + ':00'
      return result
    },
    // changeStaff(value) {
    //   let obj = {}
    //   obj = this.staff.find((item) => {
    //     return item.value === value
    //   })
    // },
    // 根据手机号码查询会员信息
    messageByPhone() {
      if (!/^1[0-9]{10}$/.test(this.orderForm.customerPhone.trim())) {
        this.common.message('warning', '请输入正确的电话号码')
        this.disabled = true
        return
      }
      getCustomersByPhone(this.orderForm.customerPhone).then(res => {
        let data = res.data
        this.signMarks.disabled = false
        this.signMarks.tipShow = true
        this.signMarks.addUser = 1
        if (Object.keys(data).length) {
          this.common.message('success', '已获得客户信息')
          this.orderForm.customerName = data.name
          this.orderForm.customerSex = data.sex
          this.orderForm.consultant_id = data.consultant_id // 会籍
          if (this.orderForm.consultant_id === 0) {
            this.orderForm.consultant_id = ''
          }
          this.orderForm.customerId = data.id
          this.orderForm.intent_level = data.intent_level
          this.orderForm.channel = data.channel
          this.orderForm.purpose = data.purpose
          this.signMarks.isEdit = true
          // if (!(this.staffHj.filter(item => item.value === this.orderForm.consultant_id).length)) {
          //   this.orderForm.consultant_id = ''
          // }
        } else {
          this.common.message('success', '暂无该客户信息，请手动录入信息')
          this.orderForm.customerName = ''
          this.orderForm.customerSex = ''
          this.orderForm.customerId = ''
          this.orderForm.consultant_id = ''
          this.signMarks.disabled = false
          this.signMarks.tipShow = false
          this.signMarks.addUser = 0 // 未录入
          this.signMarks.isEdit = false
        }
        this.stepOne = 3
      })
    },
    StepOneBtn() {
      this.orderForm1.debit_card_id = undefined
      if (!this.courseMsg.real_pay.trim()) {
        this.common.message('warning', '实付金额不能为空')
        return false
      } else if (this.courseMsg.real_pay < 0) {
        this.common.message('warning', '实付金额为正数')
        return false
      } else if (parseFloat(this.courseMsg.real_pay) % 1 !== 0 && (this.courseMsg.real_pay).toString().split('.')[1].length > 2) {
        this.common.message('warning', '实付金额最多保留2位小数')
        return false
      } else if (this.haveSeat && !this.orderForm1.seat_id) {
        this.common.message('warning', '请选择席位')
        return false
      }
      if (this.orderForm1.payment_method === '5') {
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
      if (Number(this.courseMsg.real_pay) > this.cardsNoList[0].balance) {
        this.common.message('error', '所选的储值卡剩余金额不足，请选择其它储值卡或更换支付方式')
        return false
      }
      this.orderForm1.debit_card_id = this.cardsId
      this.beginAfter()
    },
    beginAfter() {
      // 开始向后端传递数据
      this.$refs.reserCourseMsg.validate((valid) => {
        if (valid) {
          this.orderForm.customerPhone = ''
          this.orderForm.customerId = ''
          this.disabled = true
          this.stepOne = 2
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    cancelModify() {
      this.signMarks.tipShow = true
      this.signMarks.btnDisabled = false
    },
    // 点击启用修改
    editCustomer() {
      this.signMarks.tipShow = false
      this.signMarks.btnDisabled = true
      // this.signMarks.addUser = 2
    },
    // 修改会员信息
    editPersonMsg() {
      this.loading = true
      this.$store.dispatch('EditCustomer', this.orderForm).then((res) => {
        this.signMarks.tipShow = true
        this.signMarks.btnDisabled = false
        this.loading = false
        this.common.message('success', '修改成功')
        // this.signMarks.addUser = 1
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
      if (!this.orderForm.customerId) {
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
        addCustomers(userInfo).then((res) => {
          this.orderForm.customerId = res.data.id
          this.orderCourse()
        }).catch(() => {
          this.loading = false
        })
      } else {
        this.orderCourse()
      }
    },
    orderCourse() {
      this.orderForm1.customer_id = this.orderForm.customerId
      this.orderForm1.schedule_id = this.courseMsg.id
      this.orderForm1.price = this.courseMsg.real_pay
      this.loading = true
      newOrderGroupCourse(this.orderForm1).then((res) => {
        this.loading = false
        this.common.message('success', '预约成功')
        this.$emit('orderCourseBtn')
      }).catch(() => {
        this.loading = false
      })
    },
    // 获得所有教练
    getCoaches() {
      this.coach = []
      let data = { 'post': 1 } // post：1教练
      privateCoachList(data).then(response => {
        for (let i = 0; i < response.data.length; i++) {
          if (response.data[i].status === 1) {
            this.coach.push({
              'label': response.data[i].name,
              'value': response.data[i].id,
              'status': response.data[i].status
            })
          }
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
    },
    paymethodChage(param) {
      // 支付方式
      this.resetStoreCardParam()
      if (param === '5') {
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
    /* 获取席位信息 */
    gethallDetailMethods() {
      this.seatArr = []
      console.log(this.courseMsg)
      let data = {
        start_at: this.courseMsg.start_at,
        end_at: this.courseMsg.end_at,
        schedule_id: this.courseMsg.id
      }
      this.getDataLoading = true
      getHallsDetail(this.courseMsg.hall_id, data).then(res => {
        this.getDataLoading = false
        let width = Number(res.data.column_num) * 37
        this.$nextTick(() => {
          if (this.$refs.seatList) {
            this.$refs.seatList.style.width = width + 'px'
          }
        })
        this.seatArr = res.data.seats
      }).catch(res => {
        this.getDataLoading = false
      })
    },
    /* 选择席位 */
    chooseSeat(item, index) {
      this.$nextTick(() => {
        let list = this.$refs.seatList.getElementsByTagName('li')
        for (let i = 0; i < list.length; i++) {
          if (index === i && item.status === 0) {
            list[i].classList.add('active')
            this.orderForm1.seat_id = item.id
          } else {
            list[i].classList.remove('active')
          }
          if (item.status !== 0) {
            this.orderForm1.seat_id = 0
          }
        }
      })
    },
    /* 计算图片 */
    computedImg(status) {
      switch (status) {
        case 0:
          return this.sitWhite
        case 1:
          return this.sitRed
        case 100:
          return this.sitGray
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.course-dialog .form-box .selectTime /deep/ {
  .el-input__inner {
    width: 300px;
  }
  .el-input{
    width: 300px;
  }

}
.form-box {
  /deep/ .el-input-group__append {
    padding: 0px 17px;
  }
  /deep/ .el-input-group__prepend{
    padding: 0px 17px;
  }
}
.dialog-footer /deep/{
  .el-button--primary {
    background: #000;
    border: 1px solid #000;
  }
}
.course-dialog .form-box .cards-box {
  /deep/ .el-input__inner {
    width: 268px;
  }
}
.btn-box {
  border: 1px solid #ddd;
  padding: 15px;
  margin: 20px 0;
  button {
    background: #000;
    color: #fff;
    border: 1px solid #000;
  }
}
.notice {
  position: absolute;
  top: 185px;
  right: 110px;
  color: #1AB394;
}
.dialog-footer {
  button {
    background: #000;
    border: 1px solid #000;
  }
  .gray {
      background: #ccc;
      border: 1px solid #ccc;
  }
}
div.tip {
  margin-left: 112px;
}
.use-span {
  color: #1878E1;
  cursor: pointer;
}
.addBtn {
  margin-left: 10px;
  background: #333;
  border: 1px solid #333;
  color: #fff;
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
  margin-top: -3px;
  border-radius: 5px 0 0 5px;
}
.otherSearcher .el-select .el-input {
  width: 550px;
  padding-left: 0px;
}
  .sit-box {
    width: 735px;
    background: #F0F0F0;
    border: 1px solid #DCDFE6;
    border-radius: 4px;
    .sit-title {
      background: #F5F7FA;
      border-bottom: 1px solid #DCDFE6;
      text-align: center;
      font-family: PingFangSC-Semibold;
      font-size: 20px;
      color: #333333;
    }
    .sit-content {
      overflow-x: auto;
      .sit-tab {
        display: flex;
        width: 100%;
        justify-content: center;
        align-items: center;
        padding: 10px 0;
        > div {
          display: flex;
          margin: 0 15px;
          justify-content: center;
          align-items: center;
        }
        img {
          width: 20px;
          height: 20px;
          margin-right: 5px;
        }
      }
      .sit-list {
        list-style: none;
        font-size: 0;
        margin: 0 auto;
        padding: 0;
        overflow-x: hidden;
        li {
          display: inline-block;
          width: 30px;
          height: 30px;
          margin: 3px;
          font-size: 12px;
          position: relative;
          cursor: pointer;
          box-sizing: border-box;
          img {
            display: block;
            height: 100%;
            width: 28px;
            margin: 0 auto;
          }
          span {
            position: absolute;
            width: 100%;
            text-align: center;
            top: 8px;
            word-break: break-all;
            line-height: 12px;
            &.white {
              color: white;
            }
          }
          &.active {
            img {
              border: 1px dashed #e63a22;
            }
          }
        }
      }
    }
  }
</style>
