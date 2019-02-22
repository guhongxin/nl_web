<template>
   <!-- 转卡 -->
    <el-dialog
      title="转卡"
      :visible.sync="dialogVisible"
      :width="widthSize"
      class="transferCardDialog customizeDetailsDialog"
      :beforeClose='dialogClosed'
      append-to-body
    >
      <div class="dialog-body">
          <el-row :gutter="20">
            <el-col :span="10">
              <div style="background-color:#ffffff;height:685px;" class="vipCard-infor">
                <h3>会员卡信息</h3>
                <vip-card-style :vipCardData="vipCardData" :isSecondCard="isSecondCard" style="width:90%;margin:0px auto;"></vip-card-style>
                <h3>转卡服务信息</h3>
                <el-form :model="transferCardInforForm"
                  label-position="right"
                  ref="transferCardInforForm"
                  :rules="rules1" 
                  class="transferCardInforForm">
                  <el-form-item label="实付金额" placeholder="请填写实付金额" label-width="100px" prop="real_pay">
                    <el-input v-model="transferCardInforForm.real_pay" @keyup.native="inputKeyUp1($event, 0, 99999999)" placeholder="请输入金额"></el-input>
                  </el-form-item>
                  <el-form-item label="销售员工" label-width="100px" prop="sellInfro">
                    <el-select v-model="transferCardInforForm.sellInfro" placeholder="请选择销售员工" @change="changeEmployee">
                      <el-option
                        v-for="(item, key) in employeesList"
                        :key="key"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="支付方式" label-width="100px" prop="paymethod">
                    <el-select v-model="transferCardInforForm.paymethod"  placeholder="请选择支付方式" @change="paymethodChage">
                      <el-option label="现金" value="1"></el-option>
                      <el-option label="支付宝" value="2"></el-option>
                      <el-option label="微信" value="3"></el-option>
                      <el-option label="银行卡" value="4"></el-option>
                      <el-option label="储值卡" value="5"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item  :label="'储值卡号'" label-width="100px" v-if="iscardsPaymeth" >
                    <el-input placeholder="请输入储值卡号"  v-model="petCardNo"
                      :suffix-icon="cardInputIcon"
                      @focus="cardInputFocus">
                      <template slot="prepend"><i class="qr"></i></template>
                      <el-button slot="append" icon="el-icon-search" @click="petCardNoInput"></el-button>
                    </el-input>
                  </el-form-item>
                  <el-form-item :label="'转卡备注'" label-width="100px" prop="remark1">
                    <el-input type="textarea" v-model="transferCardInforForm.remark1" :maxlength="20"></el-input>
                  </el-form-item>
                </el-form>
              </div>
              
            </el-col>
            <el-col :span="14" >
               <div style="background-color:#ffffff;" class="vipCard-infor">
                <!-- <h3>受卡会员信息</h3> -->
                <h3>第<span class="step-box">1</span>步：查找会员</h3>
                <div style="margin-top: 15px;width:92%;">
                  <el-input placeholder="请输入手机号码" v-model="skryxiFind" @change="QRcodeEnter" >
                    <template slot="prepend">
                      <i class="qr"></i>
                    </template>
                    <el-button slot="append" icon="el-icon-search" @click="QRcodeEnter"></el-button>
                  </el-input>
                  <p class="tishi">
                    使用查询功能可以快速读取系统中已存在的客户信息，如果该客户首次在您的俱乐部办卡，手动输入信息转卡成功后，会在系统中自动创建新的客户信息 
                  </p>
                </div>
                <h3 style="margin-left:10px; border-top: 1px solid #dddddd; padding-top:15px;">第<span class="step-box">2</span>步：确认会员信息</h3>
                <div class="skryxi">
                  <div class="skryxi-from">
                    <el-form :model="skryxiForm"  label-width="80px" class="demo-skryxiForm" ref="skryxiForm" :rules="rules2">
                      <el-form-item label="手机号码" prop="phone">
                        <el-input v-model.trim="skryxiForm.phone" placeholder="请输入客户手机号码" :disabled="isSearchCoustomer"></el-input>
                        <span v-if="skryxiForm.phone" :class="[isSearchCoustomer?'isentrybox':'onentrybox', 'entrymark']">{{isSearchCoustomer?"已录入":"未录入"}}</span>
                      </el-form-item>
                      <el-form-item label="姓名" prop="name">
                        <el-input v-model="skryxiForm.name" placeholder="请输入客户姓名" :disabled="customerInfoInput" :maxlength="20"></el-input>
                      </el-form-item>
                      <el-form-item label="性别" prop="sex">
                        <el-select v-model="skryxiForm.sex" style="width:100%" placeholder="请选择客户性别" :disabled="customerInfoInput">
                          <!-- <el-option label="未知" value="0"></el-option> -->
                          <el-option label="男" value="1"></el-option>
                          <el-option label="女" value="2"></el-option>
                        </el-select>
                      </el-form-item>
                     
                      <!-- <el-form-item label="验证码" prop="verifiCode">
                        <el-input v-model="skryxiForm.verifiCode" placeholder="请输入短信验证码" style="width:59%;"></el-input>
                        <el-button @click.prevent="getverifiCode" style="padding:10px;width:96px" :disabled="countdown>0">{{getverifiCodeText}}</el-button>
                      </el-form-item> -->
                      <!-- <el-form-item label="手机号码" prop="vipPhone">
                        <el-input v-model="skryxiForm.vipPhone" placeholder="请输入会员手机号码"></el-input>
                      </el-form-item> -->
                      <el-form-item label="生日" prop="birth_date">
                        <el-date-picker type="date" placeholder="选择会员生日" v-model="skryxiForm.birth_date" style="width: 100%;" :disabled="customerInfoInput"></el-date-picker>
                      </el-form-item>
                      <el-form-item label="证件" prop="id_card_no">
                        <el-input v-model="skryxiForm.id_card_no" placeholder="请输入会员身份证信息" :disabled="customerInfoInput"></el-input>
                      </el-form-item>
                      <el-form-item prop="consultant_id">
                        <span slot="label">所属会籍:</span>
                        <el-select v-model="skryxiForm.consultant_id" placeholder="所属会籍" style="diplay:inline-block;width:100%;" :disabled="customerInfoInput">
                          <el-option
                            v-for="item in consultantList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                            >
                          </el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item prop="coach_id">
                        <span slot="label">所属教练:</span>
                        <el-select v-model="skryxiForm.coach_id" placeholder="所属教练" style="diplay:inline-block;width:100%;" :disabled="customerInfoInput">
                          <el-option
                            v-for="item in coachList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                          </el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label="备注" prop="remark">
                        <el-input type="textarea" v-model="skryxiForm.remark" :disabled="customerInfoInput" :maxlength="20"></el-input>
                      </el-form-item>
                    </el-form>
                  </div>
                  <div class="skryxi-image">
                    <b class="avatar-title" style="color:#606266">
                      <!-- <span style="color: #f56c6c">* </span> -->
                      头像：
                    </b>
                    <picture-img ref="imgbox" 
                      @imgUrl="getheadimgurl" 
                      @clearimgurl="clearheadimgurl"
                      style="display: inline-block;vertical-align: text-top;margin-left: 5px;"></picture-img>
                    <div class="yying" v-if="customerInfoInput"></div>
                  </div>
                </div>
                <div class="skryxi-bottom">
                  <el-button @click='skryxiFormReast'>重置</el-button>
                  <el-button type="primary" @click="skryxiFormBtnOK" :loading="btnLoading" style="background-color: rgb(51, 51, 51);color:#ffffff;" :disabled="submitBug">确定</el-button>
                </div>
               </div>
            </el-col>
          </el-row>
      </div>
    </el-dialog>
</template>
<script>
import VipCardStyle from '@/components/vipCardStyle'
import { vipCardDetails, getPhoneCustomers, transferVipCard, cardsNoList } from '@/api/vipcardGl'
import { phoneVerification, timeFormat } from '@/utils/comm'
// import { testphone } from '@/utils/validate'
import { modifyCustomer } from '@/api/customerGl'
import { getConfigSmsCode, addCustomers, getSmsCode } from '@/api/customer'
import PictureImg from '@/components/pictureImg'
import { testFloat2, testphone } from '@/utils/validate'
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
  name: 'TransferCardDialog',
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
      skryxiForm: {},
      imageUrl: '',
      skryxiFind: '',
      vipCardData: {},
      transferCardInforForm: {
        real_pay: '',
        sellInfro: 2,
        paymethod: '1',
        remark1: ''
      },
      transferCustomer: {
        sellInfro: ''
      },
      rules1: {
        real_pay: [
          { required: true, message: '请输入金额', trigger: 'blur' },
          { validator: realpayVerification, trigger: 'blur' }
        ]
      },
      vipCardDetailsData: {},
      rules2: {
        sex: { required: true, message: '请选择性别', trigger: 'blur' },
        name: { required: true, message: '请输入姓名', trigger: 'blur' },
        phone: [
          { required: true, message: '请输入电话号码', trigger: 'blur' },
          { validator: phoneVerification, trigger: 'blur' }
        ],
        verifiCode: { required: true, message: '请输入验证码', trigger: 'blur' },
        vipPhone: [
          { required: true, message: '请输入会员电话号码', trigger: 'blur' },
          { validator: phoneVerification, trigger: 'blur' }
        ],
        remark: {},
      },
      isSearchCoustomer: true, // 是否搜索到客户
      getverifiCodeText: '获取验证码',
      countdown: 0,
      customerInfoInput: true,
      dialogVisible: false,
      isSecondCard: false,
      btnLoading: false,
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
  methods: {
    getverifiCode() {
      let that = this
      that.countdown = 60
      if (!this.skryxiForm.phone) {
        this.$message({ message: '请输入电话号码', type: 'warning' })
        return
      }
      if (!/^1[0-9]{10}$/.test(this.skryxiForm.phone)) {
        this.$message({ message: '请输入正确的电话号码', type: 'warning' })
        return
      }
      if (this.isSearchCoustomer) {
        // 确认客户获取手机验证码
        getConfigSmsCode(this.skryxiForm.phone).then(res => {
          // let _data = res.data
          if (res) {
            // this.$set(this.skryxiForm, 'verifiCode', _data.code + '')
            this.$message({
              message: '验证码发送成功',
              type: 'success',
              duration: 1000
            })
            this.verifiCodeTimer = setInterval(function() {
              if (that.countdown > 1) {
                that.getverifiCodeText = `还剩${--that.countdown}秒`
              } else {
                that.countdown = 0
                that.getverifiCodeText = '获取验证码'
                clearInterval(that.verifiCodeTimer)
              }
            }, 1000)
          }
        }).catch(err => {
          that.countdown = 0
          that.getverifiCodeText = '获取验证码'
          console.log(err)
        })
      } else {
        // 添加客户获取手机验证码
        getSmsCode(this.skryxiForm.phone).then(res => {
          // let _data = res.data
          if (res) {
            this.$message({
              message: '验证码发送成功',
              type: 'success',
              duration: 1000
            })
            this.verifiCodeTimer = setInterval(function() {
              if (that.countdown > 1) {
                that.getverifiCodeText = `还剩${--that.countdown}秒`
              } else {
                that.countdown = 0
                that.getverifiCodeText = '获取验证码'
                clearInterval(that.verifiCodeTimer)
              }
            }, 1000)
            // this.$set(this.skryxiForm, 'verifiCode', _data.code + '')
          }
        }).catch(err => {
          that.countdown = 0
          that.getverifiCodeText = '获取验证码'
          console.log(err)
        })
      }
    },
    uploadSkryImage() {},
    beforeuploadSkryImage() {},
    dialogClosed() {
      this.skryxiFormReast()
      this.dialogVisible = false
      // 复位储值卡相关信息
      this.resetStoreCardParam()
    },
    skryxiFormReast() {
      this.isSearchCoustomer = false
      this.customerInfoInput = true
      this.skryxiFind = ''
      this.$refs['transferCardInforForm'].resetFields()
      this.imageUrl = ''
      this.$refs.imgbox.deleteimgbtn()
      this.$refs['skryxiForm'].resetFields()
      // 复位储值卡相关信息
      this.resetStoreCardParam()
    },
    skryxiFormBtnOK() {
      // 确认转卡
      this.transferCardInforForm.debit_card_id = undefined
      if (this.skryxiForm.id_card_no) {
        if (!this.common.isCardNo(this.skryxiForm.id_card_no)) {
          this.common.message('warning', '身份证号码填写错误')
          return false
        }
      }
      this.$refs['skryxiForm'].validate((valid) => {
        if (valid) {
          this.$refs['transferCardInforForm'].validate((valid1) => {
            if (valid1) {
              if (this.transferCardInforForm.paymethod === '5') {
                // 储值卡支付
                if (this.ispetCardNoBtn) {
                  // 如果点击根据储值卡查找按钮
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
            } else {
              return false
            }
          })
        } else {
          return false
        }
      })
    },
    storePay() {
      if (!this.cardsId) {
        this.common.message('error', '请选择支付的储值卡号')
        return false
      }
      if (Number(this.transferCardInforForm.real_pay) > Number(this.cardsNoList[0].balance)) {
        this.common.message('error', '所选的储值卡剩余金额不足，请选择其它储值卡或更换支付方式')
        return false
      }
      this.transferCardInforForm.debit_card_id = this.cardsId
      this.beginAfter()
    },
    beginAfter() {
      // 开始向后端传递数据
      this.btnLoading = true
      let _new_customer_id = this.transferCustomer.id
      if (_new_customer_id > 0) {
        // 如果存在new_ceustomer 先更新用户信息
        let obj = {
          id: _new_customer_id,
          name: this.skryxiForm.name,
          phone: this.skryxiForm.phone,
          sex: this.skryxiForm.sex,
          birthday: timeFormat(this.skryxiForm.birth_date),
          id_card_no: this.skryxiForm.id_card_no,
          remark: this.skryxiForm.remark,
          head_portrait: this.imageUrl,
          coach_id: this.skryxiForm.coach_id ? this.skryxiForm.coach_id : '',
          consultant_id: this.skryxiForm.consultant_id ? this.skryxiForm.consultant_id : '',
        }
        modifyCustomer(obj).then(res => {
          console.log('头像修改成功！')
        }).catch(err => {
          console.log(err)
        })
        this.transferCard(_new_customer_id)
      } else {
        // 如果不存在new_ceustomer 添加用户 然后再录入
        let obj = {
          name: this.skryxiForm.name,
          phone: this.skryxiForm.phone,
          sex: this.skryxiForm.sex,
          birthday: timeFormat(this.skryxiForm.birth_date),
          id_card_no: this.skryxiForm.id_card_no,
          remark: this.skryxiForm.remark,
          head_portrait: this.imageUrl,
          coach_id: this.skryxiForm.coach_id ? this.skryxiForm.coach_id : '',
          consultant_id: this.skryxiForm.consultant_id ? this.skryxiForm.consultant_id : '',
        }
        // 添加用户
        addCustomers(obj).then(res => {
          let _data = res.data
          if (_data) {
            let _customerId = _data.id
            this.transferCard(_customerId)
          }
        }).catch(err => {
          this.btnLoading = false
          console.log(err)
        })
      }
    },
    transferCard(newCustomerId) {
      let obj = {
        id: this.vipCardDetailsData.id,
        new_customer_id: newCustomerId,
        real_pay: Number(this.transferCardInforForm.real_pay),
        payment_method: Number(this.transferCardInforForm.paymethod),
        // sell_id: Number(this.transferCardInforForm.sellInfro.split(',')[0]),
        sell_id: Number(this.transferCardInforForm.sellInfro),
        remark: this.transferCardInforForm.remark1,
        // code: this.skryxiForm.verifiCode,
        phone: this.skryxiForm.phone,
        debit_card_id: this.transferCardInforForm.debit_card_id
      }
      transferVipCard(obj).then(res => {
        if (res) {
          this.$message({
            message: '转卡成功',
            type: 'success'
          })
          this.$refs.transferCardInforForm.resetFields()
          this.$refs.skryxiForm.resetFields()
          this.imageUrl = ''
          this.dialogClosed()
          this.$emit('skryxiFormBtnOK')
          this.btnLoading = false
        }
      }).catch(err => {
        console.log(err)
        this.btnLoading = false
      })
    },
    openModel(id, flag) {
      this.dialogVisible = true
      this.getVipDetail(id)
      this.isSecondCard = flag
    },
    getVipDetail(id) {
      vipCardDetails(id).then(res => {
        let _data = res.data
        this.vipCardDetailsData = _data
        this.vipCardData = {
          card_no: _data.card_no === null ? '' : _data.card_no,
          status: _data.status,
          real_pay: _data.order ? _data.order.real_total_fee : '',
          type: _data.type,
          card_name: _data.card_name,
          card_image: _data.card_image,
          end_date: _data.end_date,
          master_id: _data.master_id,
          gym: _data.gym // 会员卡那个场馆办理的
        }
        this.customer_phone = _data.customer.phone
        if (this.isSecondCard === 2) {
          this.vipCardData.use_times = _data.use_times
          this.vipCardData.total_times = _data.total_times
        } else if (this.isSecondCard === 1) {
          this.vipCardData.has_date = _data.has_date
        } else if (this.isSecondCard === 3) {
          this.vipCardData.has_date = _data.balance
        }
      }).catch(err => {
        console.log(err)
      })
    },
    QRcodeEnter() {
      if (!testphone(this.skryxiFind)) {
        return false
      }
      if (this.customer_phone === this.skryxiFind) {
        this.common.message('warning', '不能把该卡转给自己,请重新输入其它电话号码')
        return false
      }
      // 清空一些数据
      this.transferCustomer = {}
      this.customerInfoInput = false
      this.imageUrl = ''
      this.$refs.imgbox.deleteimgbtn()
      this.customerInfoInput = false
      this.imageUrl = ''
      this.$refs.imgbox.deleteimgbtn()
      getPhoneCustomers(this.skryxiFind).then(res => {
        let _data = res.data
        if (_data.id) {
          // 根据电话去搜索客户,找到
          this.transferCustomer = _data
          this.imageUrl = _data.head_portrait
          // 如果有图像，就设置客户图像
          if (this.imageUrl) {
            this.$refs.imgbox.setImg(_data.head_portrait)
          }
          this.skryxiForm = {
            name: _data.name,
            phone: _data.phone,
            birth_date: _data.birthday,
            id_card_no: _data.id_card_no,
            sex: this.getSexzh(_data.sex),
            remark: _data.remark,
            coach_id: _data.coach_id ? _data.coach_id : '',
            consultant_id: _data.consultant_id ? _data.consultant_id : ''
          }
          this.isSearchCoustomer = true
        } else {
          this.skryxiForm = {
            name: null,
            phone: this.skryxiFind,
            birth_date: null,
            id_card_no: '',
            sex: '1',
            coach_id: '',
            consultant_id: ''
          }
          this.imageUrl = ''
          this.$refs.imgbox.deleteimgbtn()
          // 根据电话去搜索客户,未找到，那就是输入
          this.isSearchCoustomer = false
          this.$message({
            message: '用户未找到',
            type: 'warning',
            duration: 1000
          })
        }
      }).catch(err => {
        console.log(err)
      })
    },
    getSexzh(sex) {
      let result = ''
      switch (sex) {
        case 1:
          result = '1'
          break
        case 2:
          result = '2'
          break
        default:
          result = '未知'
      }
      return result
    },
    getheadimgurl(param) {
      this.imageUrl = param
    },
    clearheadimgurl() {
      this.imageUrl = ''
    },
    changeEmployee(value) {
      if (!value) {
        setTimeout(() => {
          this.$router.push('/components/staffmanage')
        }, 100)
      }
    },
    inputKeyUp1(e, min, max, moduleVale) {
      let doc = e.target
      let _value = this.common.check(doc, min, max)
      this.transferCardInforForm.real_pay = _value
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
      let oldstoreCardNo = this.vipCardDetailsData.card_no
      if (this.vipCardDetailsData.type === 3 && oldstoreCardNo === this.petCardNo) {
        this.$message({
          type: 'warning',
          message: '储值卡不能对自己进行付款操作，请更换储值卡号'
        })
        return false
      }
      return new Promise((resolve, reject) => {
        this.submitBug = false
        this.cardsNoErr = false
        if (!this.petCardNo) {
          this.$message({
            type: 'warning',
            message: '请输入储值卡号'
          })
          reject({ success: false })
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
    },
    consultantList() {
      let result = this.employeesData.filter(currentValue => {
        return currentValue.status === 1
      })
      return result
    },
    coachList() {
      let result = this.employeesData.filter(currentValue => {
        return (currentValue.post === 1) && (currentValue.status === 1)
      })
      return result
    },
    cardInputIcon() {
      return this.hasCardsdNo ? this.cardsNoErr ? 'el-icon-error' : 'el-icon-success' : ''
    }
  },
  components: {
    VipCardStyle,
    PictureImg
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.qr{
  width: 36px;
  position: absolute;
  left: 0;
  top: -1px;
  height: 36px;
  background: url("../../../assets/icon/qr.png") no-repeat center;
  background-size: cover;
  border-radius: 5px 0 0 5px;
}
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
  /deep/ .el-icon-error{
    color: red
  }
  /deep/ .el-icon-success{
    color: #1ab394
  }
}
.skryxi-bottom {
  text-align: center;
  .el-button--medium {
    width: 140px;
  }
}
.transferCardDialog {
  .el-dialog__body {
    width: 100%;
    background-color: #f0f0f0;
    padding: 10px 20px;
    .dialog-body {
      width: 100%;
      padding-left: 10px;
      padding-right: 10px;
      .vipCard-infor {
        overflow: hidden;
        h3 {
          width: 92%;
          color: #333333;
        }
        .transferCardInforForm {
          width: 80%;
          // margin: 0px auto;
          .el-form-item__label {
            text-align: left;
          }
          .el-select {
            width: 100%;
          }
          .el-textarea__inner {
            height: 80px;
          }
        }
        /deep/ .el-input-group__prepend {
          padding: 0px 17px;
        }
        .tishi {
          color: #999999;
          font-size: 10px;
          margin-top: 10px;
        }
        .skryxi {
          width: 90%;
          // margin: 0px auto;
          padding-top: 15px;
          display: flex;
          .skryxi-from {
            flex: 1;
            .el-textarea__inner {
              height: 80px;
            }
          }
          .skryxi-image {
            position: relative;
            flex: 1;
            text-align: center;
            .avatar-uploader {
              margin-left: 10px;
              display: inline-block;
              vertical-align: text-top;
              .el-upload {
                margin: 0px auto;
                border: 1px dashed #d9d9d9;
                border-radius: 6px;
                cursor: pointer;
                position: relative;
                overflow: hidden;
              }
              .el-upload:hover {
                border-color: #409eff;
              }
            }
            .avatar-uploader-icon {
              font-size: 28px;
              color: #8c939d;
              width: 178px;
              height: 178px;
              line-height: 178px;
              text-align: center;
            }
            .avatar {
              width: 178px;
              height: 178px;
              display: block;
            }
          }
        }
        .skryxi-bottom {
          margin-bottom: 20px;
          text-align: center;
        }
      }
    }
  }
  h3 {
    .step-box{
      display: inline-block;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      border: 2px solid rgb(26, 179, 148);
      text-align: center;
      line-height: 20px;
      margin-left: 5px;
      margin-right: 5px; 
      color: rgb(26, 179, 148);
    }
  }
  .yying{
    position: absolute;
    width: 220px;
    height: 220px;
    border-radius: 5px;
    background-color: rgba(245, 247, 250,0.6);
    left: 80px;
    top: 1px;
    cursor: not-allowed;
  }
  .entrymark{
    position: absolute;
    right: 10px;
    top: 0px;
  }
  .isentrybox{
    color: rgb(26, 179, 148);
    float: right;
  }
  .onentrybox{
    color: rgb(241, 76, 48);
    float: right;
  }
}
</style>


