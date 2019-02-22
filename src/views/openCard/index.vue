<template>
  <div class="app-container documentation-container">
    <el-row class="compatible" :gutter="20" style="min-height: calc(100vh - 124px)">
      <el-col :xl="10" :lg="12" ref="leftBox" id="left">
        <div style="background-color:#fff;padding:10px 20px;border-radius: 5px; min-height: 880px">
          <h4>
            会员卡信息
          </h4>
          <el-form ref="form" label-position="right" :model="form" :rules="formRules" label-width="90px">
          <div class="cardbox" :style="{background: `url(${cardphoto}) 50% 50% no-repeat / cover`}">
            <div style="overflow:hidden;margin-bottom: 10px;">
              <div class="choosecardbox">
                <el-form-item style="margin-bottom:0;margin-left: -80px;">
                  <el-cascader
                    :options="options"
                    v-model="selectedOptions"
                    :show-all-levels="false"
                    placeholder="选择会员卡"
                    @change="handleChange"
                  ></el-cascader>
                </el-form-item>
              </div>
              <div class="cardboxcardname">
                <div class="imgbox">
                  <img :src="logUrl" alt="icon">
                </div>
                <div class="imgtext">
                  {{gymName}}
                </div>
              </div>
            </div>
            <div class="cardtext"><span style="margin-right: 10px;"><span v-if="form.master_id" class="through">通</span>{{ form.card_name }}（{{cardtype}}）</span></div>
            <div class="cardno">NO: {{form.card_no}}</div>
            <div class="cardcalda">有效日期：{{timeFormat(form.end_date)}}</div>
          </div>
          <div class="pricebox">
            <div class="pricefont">￥{{ cardprice }} <span style="font-size:10px;color:#ccc" @click="isshowfloorprice?isshowfloorprice=false:isshowfloorprice=true"> ↓ <span v-show="isshowfloorprice">{{ costprice }}</span></span></div>
            <div class="pricesurplus" v-if="isStoredValCard">充值金额{{cardtimes}}元</div>
            <div class="pricesurplus" v-else>期限{{cardtimes}}{{unit}}</div>
          </div>
          <div class="cardformbox">
              <el-form-item prop="card_no">
                <span slot="label">会员卡号:</span>
                <el-input v-model.trim="form.card_no" clearable ref="cardNo" 
                  @keyup.native.enter="cardNumBlur($event)" placeholder="请点击右侧按钮生成或刷入磁卡ID" 
                  class="opencard-select"
                  @clear="cardNumbClear"
                  :maxlength="25">
                  <el-button slot="append" type="info" @click.native="setCardNum">自动生成</el-button>
                </el-input>
              </el-form-item>
              <div class="tip" style="margin-bottom: 20px;">提示：如果您的俱乐部使用的是实体芯片卡，可以点击上方输入框，通过读卡器来刷卡录入磁卡ID</div>
              <div class="active-box">
                <el-form-item label="开卡方式:" prop="activMethod">
                  <el-radio-group v-model="form.activMethod" @change="activMethodChange">
                    <el-radio label="1" border>立即开卡</el-radio>
                    <el-radio label="0" border >定时开卡</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item  prop="start_date" label="生效日期:">
                  <span slot="label">
                    <i class="pointred"></i>
                    开卡日期:
                  </span>
                  <el-date-picker
                      v-model="form.start_date"
                      type="date"
                      :clearable="false"
                      @change="startTime"
                      placeholder="请选择生效日期" 
                      style="width:100%"
                      :editable="false"
                      :disabled="isActivatNow">
                    </el-date-picker>
                </el-form-item>
                <el-form-item style="position: relative;">
                  <span slot="label">
                    <i class="pointred"></i>
                    失效日期:
                  </span>
                  <el-input v-if="isTimercard" v-model="form.end_date" :disabled="isTimercard" placeholder="请选择失效日期" class="overscontime opencard-select" >
                    <!-- <el-button slot="append" type="info" @click="resetTime">重置</el-button> -->
                  </el-input>
                  <el-date-picker
                    v-model="form.end_date"
                    type="date"
                    :clearable="false"
                    placeholder="请选择生效日期" style="width:100%;" 
                    :editable="false"
                    value-format="yyyy-MM-dd"
                    :disabled="contedchecked"
                    :picker-options="lostPickerOptions"
                    v-else>
                  </el-date-picker>
                  <el-checkbox v-if="!isTimercard" class="psoedd" v-model="contedchecked">永不过期</el-checkbox>
                </el-form-item>
              </div>
              <el-row>
                <el-col :span="10">
                  <el-form-item prop="give_day" v-if="isStoredValCard">
                    <span slot="label">赠送金额:</span>
                    <span class="por">
                      <el-input v-model="form.give_day" :maxlength="6" placeholder="请填写正整数(选填)"  @keyup.native="computed($event)"></el-input>
                      <span class="poa">元</span>
                    </span>
                  </el-form-item>
                  <el-form-item prop="give_day" v-else>
                    <span slot="label">赠送{{long}}:</span>
                    <span class="por">
                      <el-input v-model="form.give_day" :maxlength="6" placeholder="请填写正整数(选填)" @keyup.native="computed($event)"></el-input>
                      <span class="poa">{{unit}}</span>
                    </span>
                  </el-form-item>
                </el-col>
                <el-col :span="14">
                  <el-form-item prop="real_pay">
                    <span slot="label">实付金额:</span>
                    <span class="por">
                      <el-input 
                        v-model="form.real_pay" 
                        placeholder="请填写金额"
                        type="number"
                        oninput="if(value.length > 9)value = value.slice(0, 9)"></el-input>
                      <span class="poa">元</span>
                    </span>              
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="10">
                  <el-form-item  prop="payment_method">
                    <span slot="label">
                      <!-- <i class="pointred"></i> -->
                        支付方式:
                      </span>
                      <el-select v-model="form.payment_method" placeholder="请选择支付方式" style="width:100%" @change="paymethodChage">
                        <el-option
                          v-for="item in selloptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="14">
                  <el-form-item prop="sell_id">
                    <span slot="label">销售员工:</span>
                    <el-select v-model="form.sell_id" filterable placeholder="请选择销售员工" style="width:100%">
                      <el-option
                        v-for="item in selectoptions"
                        :disabled="item.status === 3"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item v-if="iscardsPaymeth" >
                <span slot="label">储值卡号:</span>
                <el-input placeholder="请输入储值卡号" 
                  v-model="petCardNo"
                  :suffix-icon="cardInputIcon"
                  @focus="cardInputFocus">
                  <template slot="prepend"><i class="qr"></i></template>
                  <el-button slot="append" icon="el-icon-search" @click="petCardNoInput"></el-button>
                </el-input>
              </el-form-item>
              <el-form-item prop="remark">
                <span slot="label">备注:</span>
                <el-input
                  type="textarea"
                  :rows="1"
                  style="width:100%;height:80px;position: relative;"
                  placeholder="请输入内容"
                  maxlength="100"
                  v-model="form.remark">
                </el-input>
              </el-form-item>
              <!-- <el-form-item prop="magcard_id">
                <span slot="label">磁卡ID:</span>
                <span>
                  <el-input v-model="form.magcard_id" placeholder="请填写磁卡ID" ></el-input>
                </span>
              </el-form-item> -->
          </div>
          </el-form>
        </div>
      </el-col>
      <el-col :xl="14" :lg="12" ref="rightBox">
         
        <div  style="background-color: #ffffff;padding:10px 20px;border-radius: 5px; min-height: 880px">
          <h4>第<span class="step-box">1</span>步：查找客户</h4>
          <!-- <div class="h2 btm20">
            会员信息
          </div> -->
          <el-row>
            <el-col :span="24">
              <el-input placeholder="请输入手机号或者扫描其APP上的个人条码"  
                v-model.trim="searphone"
                style="width:40%;min-width: 400px;"
                @keyup.native.enter="search">
                <template slot="prepend">
                  <i class="qr"></i>
                </template>
                <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
              </el-input>
            </el-col>
          </el-row>
          <br>
          <div class="tip">提示：使用查询功能可以快速读取系统中已存在的客户信息，如果该客户首次在您的俱乐部办卡，手动输入信息开卡成功后，会在系统中自动创建新的客户信息</div>
          <br>
          <br>
          <hr>
          <br>
          <el-row :gutter="20">
            <h4 style="margin-left:10px;">第<span class="step-box">2</span>步: 确认客户信息</h4>
            <el-col :xl="10" :lg="24">
              <el-form ref="formperson" label-position="right" :model="form" :rules="formRules" label-width="80px" class="formperson">
                <el-form-item prop="phone" style="position:relative">
                  <span slot="label">手机:</span>
                  <el-input v-model="form.phone" placeholder="请输入客户手机号码" type="number" :disabled="haveCustomerInfo" >
                  </el-input>
                  <span v-if="form.phone" :class="[haveCustomerInfo?'isentrybox':'onentrybox', 'entrymark']">{{haveCustomerInfo?"已录入":"未录入"}}</span>
                </el-form-item>
                <el-form-item prop="name">
                  <span slot="label">姓名:</span>
                  <el-input v-model="form.name" placeholder="请输入客户姓名" :maxlength="20" :disabled="customerInfoInput"></el-input>
                </el-form-item>
                <el-form-item prop="sex">
                  <span slot="label">
                    <i class="pointred"></i>
                    性别:
                  </span>
                  <el-select v-model="form.sex" placeholder="请选择" style="width:100%" :disabled="customerInfoInput">
                    <el-option
                      v-for="item in sexoptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                      >
                    </el-option>
                  </el-select>
                </el-form-item>
                <!-- <el-form-item prop="code">
                  <span slot="label">验证码:</span>
                  <el-input v-model="form.code" placeholder="请填写验证码" class="opencard-select" type="number">
                    <el-button slot="append" @click.native="sendCode" :disabled="sendcodebtn" type="info">{{sendtext}}</el-button>
                  </el-input>
                </el-form-item> -->
                <el-form-item prop="birth_date">
                  <span slot="label">生日:</span>
                  <el-date-picker
                    v-model="form.birth_date"
                    type="date"
                    :picker-options="brithdayPickerOptions"
                    placeholder="选择客户生日"
                    style="width:100%"
                    :disabled="customerInfoInput">
                  </el-date-picker>
                </el-form-item>
                <el-form-item prop="id_card_no">
                  <span slot="label">证件:</span>
                  <el-input v-model="form.id_card_no" placeholder="请输入客户身份证信息"
                    :disabled="customerInfoInput"></el-input>
                </el-form-item>
                <el-form-item prop="consultant_id">
                  <span slot="label">所属会籍:</span>
                  <el-select v-model="form.consultant_id" placeholder="所属会籍" style="diplay:inline-block;width:100%;" :disabled="customerInfoInput">
                    <el-option
                      v-for="item in consultantList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                      >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item prop="coach_id">
                  <span slot="label">所属教练:</span>
                  <el-select v-model="form.coach_id" placeholder="所属教练" style="diplay:inline-block;width:100%;" :disabled="customerInfoInput">
                    <el-option
                      v-for="item in coachList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                 
            
                <!-- <el-form-item prop="remark">
                  <span slot="label">备注:</span>
                  <el-input
                    type="textarea"
                    :rows="5"
                    style="width:100%;height:80px;position: relative;"
                    placeholder="请输入内容"
                    maxlength="20" 
                    v-model="form.remark"
                    :disabled="haveCustomerInfo">
                  </el-input>
                </el-form-item> -->
            </el-form>
            </el-col>
            <el-col :xl="14" :lg="24">
              <div style="margin-left: 5%; margin-top: -30px;">
              <el-col :span="10" class="upload-box">
                <b class="avatar-title" style="color:#606266">
                  <!-- <span style="color: #f56c6c">* </span> -->
                  头像：
                </b>
                <div style="margin-left: 50px; margin-top: 14px;position:relative">
                  <picture-img ref="takepic" @imgUrl="getimgurl" @clearimgurl="clearimgurl"></picture-img>
                  <div class="yying" v-if="customerInfoInput"></div>
                </div>
              </el-col>
              </div>
            </el-col>
          </el-row>
          <el-row style="margin-top:20px">
            <el-col :span="24" style="text-align: left;margin-top: 30px;margin-left:50px;">
              <el-button type="info" plain class="submitbtn" style="background-color:#909399" @click="resetFormData">重置</el-button>
              <el-button style="background-color:#333333" :loading="loading" class="submitbtn" @click="openCardBtn" :disabled="submitBug">确定</el-button>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>

    <!--提示-->
    <el-dialog
      title="提示"
      :visible.sync="tipDialogVisible"
      width="490px"
      :close-on-click-modal="false"
      class="course-dialog" style="margin-top: 28vh;">
      <div style="color:#000;text-align:center;font-size:18px;margin:20px 0;">办理客户卡前，请先添加至少1个卡种</div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" class="black" style="padding:10px 34px;" @click="GoTo">立即前往</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import scanInput from '@/components/scanInput'
import pictureImg from '@/components/pictureImg'
import { listVipCard, addVipCardCustomer } from '@/api/vipcard'
import { employeeList } from '@/api/employee'
import { getCustomersByPhone, getSmsCode, addCustomers, getConfigSmsCode } from '@/api/customer'
import { modifyCustomer } from '@/api/customerGl'
import { parseTime } from '@/filters/index'
import { testFloat2, testphone, validateSfcode } from '@/utils/validate'
import { getSession } from '@/utils/auth'
import { cardsNoList } from '@/api/vipcardGl'
// 卡号验证
let isInit = false
let _phone = ''
const validateCardNo = (rule, value, callback) => {
  if (!value.length) {
    callback(new Error('请点击右方按钮自动生成卡号或刷入磁卡ID'))
  } else {
    callback()
  }
}
var my = null
// 实付金额
const validatereal_pay = (rule, value, callback) => {
  if (my.costprice === '') {
    my.real_pay = ''
    callback(new Error('请先选择会员卡'))
  }
  if (!testFloat2(value)) {
    callback(new Error('输入有误(保留2位小数)'))
  } else if (Number(value) >= 1000000) {
    callback(new Error('输入数字不能大于1000000'))
  } else if (Number(value) === 0) {
    callback(new Error('输入数字必须大于0'))
  } else if (Number(value) < Number(my.costprice)) {
    callback(new Error(`不得低于(低价)${my.costprice}元`))
  } else {
    callback()
  }
}
// 卡号验证
const validatename = (rule, value, callback) => {
  if (value === null || !value.length) {
    callback(new Error('请输入会员姓名'))
  } else {
    callback()
  }
}
// 卡号验证
const validatephone = (rule, value, callback) => {
  if (!testphone(value)) {
    callback(new Error('请输入正确的手机号码'))
  } else {
    callback()
  }
}
// 卡号验证
const validatecode = (rule, value, callback) => {
  if (!value.length) {
    callback(new Error('请填写验证码'))
  } else {
    callback()
  }
}
// 卡号验证
// const validateSf = (rule, value, callback) => {
//   if (!validateSfcode(value)) {
//     callback(new Error('请填写正确得身份证'))
//   } else {
//     callback()
//   }
// }
export default {
  name: 'opencard',
  components: {
    scanInput,
    pictureImg
  },
  data() {
    return {
      contedchecked: false,
      tipDialogVisible: false,
      selectedOptions: [],
      searphone: '',
      openCustomerInfo: null,
      brithdayPickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      sendtext: '发送验证码',
      sendcodebtn: false,
      loading: false, // 开卡按钮loading
      long: '时长',
      unit: '天',
      cardprice: '-',
      isshowfloorprice: false,
      costprice: '',
      cardtype: '-',
      cardtimes: '-',
      cardphoto: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpEOTM1RkM4RTMyNTExMUU4OUI0QkUzNTc5MzQzNTQ2OCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpEOTM1RkM4RjMyNTExMUU4OUI0QkUzNTc5MzQzNTQ2OCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkQ5MzVGQzhDMzI1MTExRTg5QjRCRTM1NzkzNDM1NDY4IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkQ5MzVGQzhEMzI1MTExRTg5QjRCRTM1NzkzNDM1NDY4Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+2gyx2gAAAA9JREFUeNpiOHDkDECAAQAEmAJR4w54IQAAAABJRU5ErkJggg==',
      form: {
        card_no: '', // 卡号码
        card_name: '-', // 卡种名称
        type: '', // 卡种 卡种类型:1-时效卡;2-次卡.
        name: '', // 顾客姓名（可选）
        activMethod: '1', // 激活方式
        customer_id: '', // 客户ID
        start_date: new Date().getTime(), // 生效日期
        end_date: '-', // 失效日期
        give_day: '', // 赠送的天数
        real_pay: '', // 实付金额
        sell_id: 2, // 销售员工ID
        magcard_id: '', // 磁卡ID
        payment_method: 1, // 支付方式：1.现金，2.支付宝，3.微信，4.银行卡， 5储值卡
        sex: 2, // 性别 0-未知;1-男;2-女（可选）
        phone: '', // 顾客手机
        birth_date: '', // 顾客生日（可选
        id_card_no: '', // 身份证（可选）
        code: '', // 验证码
        remark: '', // 备注（可选）
        photo: '', // 备注（可选）
        consultant_id: null, // 会籍（可选）
        coach_id: null // 教练（可选）
      },
      formRules: {
        card_no: [{ required: true, trigger: 'blur', validator: validateCardNo }],
        real_pay: [{ required: true, trigger: 'blur', validator: validatereal_pay }],
        // sell_id: [{ required: true, trigger: 'change', validator: validateconsultant_id }],
        name: [{ required: true, trigger: 'blur', validator: validatename }],
        phone: [{ required: true, trigger: 'blur', validator: validatephone }],
        code: [{ required: true, trigger: 'blur', validator: validatecode }],
        activMethod: [{ required: true, trigger: 'blur', message: '' }]
        // birth_date: [{ type: 'date', required: true, message: '请选择日期', trigger: 'change' }],
        // id_card_no: [{ required: true, trigger: 'blur', validator: validateSf }],
      },
      defaultendvalue: '',
      currentendvalue: '',
      defaultcardtimes: '',
      carditselfeadline: '', // 卡本身期限
      defaultstartvalue: new Date().getTime(),
      selloptions: [{
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
      }],
      sexoptions: [{
        value: 1,
        label: '男'
      }, {
        value: 2,
        label: '女'
      }],
      selectData: [{
        text: '手机号',
        value: 'phone'
      }],
      selectoptions: [],
      options: [{
        value: 'zhinan',
        label: '时效卡',
        children: []
      }, {
        value: 'cicard',
        label: '次卡',
        children: []
      }, {
        value: 'storedcard ',
        label: '储值卡',
        children: []
      }],
      allCardList: [],
      oncetimes: false,
      haveCustomerInfo: true,
      logUrl: '',
      gymName: '',
      cardNoCopy: '', // 复制一份会员卡号
      isTimercard: true, // 是否是时效卡
      isActivatNow: true,
      customerInfoInput: true,
      isStoredValCard: false,
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
  watch: {
    contedchecked(newval, oldval) {
      if (newval) {
        this.form.end_date = '9999-12-31'
      } else {
        this.form.end_date = this.defaultendvalue
      }
    }
  },
  created() {
    this.getlistVipCard()
    this.getEmployeeList()
    this.logUrl = getSession('SET_LOGO')
    this.gymName = getSession('SET_GYM_NAME')
    this.$nextTick(() => {
      this.setCardNum()
    })
  },
  mounted() {
    my = this
    this.$nextTick(() => {
      if (isInit && _phone) {
        this.searphone = _phone
        this.search()
      }
    })
  },
  computed: {
    lostPickerOptions() {
      let frttime = new Date(this.form.start_date).getTime()
      return { disabledDate(time) {
        return new Date(time).getTime() < frttime + 86400000
      } }
    },
    consultantList() {
      let result = this.selectoptions.filter(currentValue => {
        return currentValue.status === 1
      })
      return result
    },
    coachList() {
      let result = this.selectoptions.filter(currentValue => {
        return (currentValue.post === 1) && (currentValue.status === 1)
      })
      return result
    },
    cardInputIcon() {
      return this.hasCardsdNo ? this.cardsNoErr ? 'el-icon-error' : 'el-icon-success' : ''
    }
  },
  methods: {
    // getHeight() {
    //   let h1 = this.$refs.leftBox.$el.offsetHeight
    //   let h2 = this.$refs.rightBox.$el.offsetHeight
    //   if (h1 > h2) {
    //     this.$refs.rightBox.$el.style.height = h1 + 'px'
    //   } else {
    //     this.$refs.leftBox.$el.style.height = h2 + 'px'
    //   }
    // },
    cardNumBlur(event) {
      event.target.blur()
    },
    cardNumbClear() {},
    dateandidcard() {
      let fble = true
      if (this.form.birth_date) {
        console.log(this.form.birth_date)
      }
      if (this.form.id_card_no) {
        if (!validateSfcode(this.form.id_card_no)) {
          this.common.message('error', '请填写正确得身份证')
          fble = false
        }
      }
      return fble
    },
    openCardBtn() {
      let self = this
      if (this.form.card_name === '-') {
        this.common.message('error', '请选择会员卡!')
        return
      }
      if (this.form.end_date === null) {
        this.common.message('error', '请选择失效时间!')
        return
      }
      if (!this.dateandidcard()) {
        return
      }
      this.$refs.form.validate(valid => {
        if (valid) {
          // if (self.form.photo === '') {
          //   self.common.message('error', '请上传顾客头像!')
          //   return
          // }
          self.$refs.formperson.validate(validperson => {
            self.form.debit_card_id = undefined
            if (validperson) {
              if (!self.form.birth_date) {
                self.form.birth_date = undefined
              } else {
                self.form.birth_date = parseTime(new Date(self.form.birth_date).getTime(), '{y}-{m}-{d}')
              }
              if (self.form.payment_method === 5) {
                // 储值卡支付
                if (this.ispetCardNoBtn) {
                  // 如果点击根据储值卡查找按钮
                  this.storePay(self)
                } else {
                  this.petCardNoInput().then(res => {
                    if (res.success) {
                      this.storePay(self)
                    }
                  }).catch(err => {
                    console.log(err)
                  })
                }
              } else {
                this.beginAfter(self)
              }
            } else {
              console.log('error submit!!')
              return false
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    storePay(self) {
      if (!this.cardsId) {
        this.common.message('error', '请选择支付的储值卡号')
        return false
      }
      if (Number(self.form.real_pay) > this.cardsNoList[0].balance) {
        this.common.message('error', '所选的储值卡剩余金额不足，请选择其它储值卡或更换支付方式')
        return false
      }
      self.form.debit_card_id = this.cardsId
      this.beginAfter(self)
    },
    beginAfter(self) {
      // 开始向后端传递数据
      self.loading = true
      let _birth_date = self.form.birth_date
      getCustomersByPhone(self.form.phone).then(res => {
        let data = res.data
        if (Object.keys(data).length) {
          // 已存在用户,不去更新用户
          self.form.customer_id = res.data.id
          let _start_date = parseTime(self.form.start_date, '{y}-{m}-{d}') === '0-0-0' ? undefined : parseTime(self.form.start_date, '{y}-{m}-{d}')
          // let _end_date = this.timeFormat(self.form.end_date)
          // this.openCustomerInfo.consultant_id = data.consultant_id
          this.openCustomerInfo.phone = self.form.phone
          this.openCustomerInfo.name = self.form.name
          this.openCustomerInfo.sex = self.form.sex
          // delete this.openCustomerInfo.coach_id
          this.openCustomerInfo.birthday = _birth_date ? ((_birth_date === '0-0-0') ? null : _birth_date) : null
          this.openCustomerInfo.id_card_no = self.form.id_card_no
          this.openCustomerInfo.head_portrait = self.form.photo
          this.openCustomerInfo.consultant_id = self.form.consultant_id
          this.openCustomerInfo.coach_id = self.form.coach_id
          // 修改客户信息
          modifyCustomer(this.openCustomerInfo).then(res => {
            console.log('头像修改成功！')
          }).catch(err => {
            console.log(err)
          })
          // 开卡信息
          let _obj = {
            customer_id: self.form.customer_id,
            temp_id: self.form.temp_id,
            type: self.form.type,
            card_name: self.form.card_name,
            card_no: self.form.card_no ? self.form.card_no.trim() : '',
            status: 10,
            sell_id: self.form.sell_id,
            real_pay: self.form.real_pay,
            payment_method: self.form.payment_method,
            start_date: _start_date,
            end_date: self.form.end_date,
            give_day: self.form.give_day ? self.form.give_day : undefined,
            remark: self.form.remark === null ? '' : self.form.remark,
            debit_card_id: self.form.debit_card_id
          }
          // 储值卡是total_amount总金额，其它是total_times
          if (self.form.type !== 3) {
            _obj.total_times = self.cardtimes
          } else {
            _obj.total_amount = self.cardtimes
          }
          let _msg = this.isActivatNow ? '开卡成功' : '购卡成功'
          addVipCardCustomer(_obj).then(resl => {
            this.$notify({
              title: '成功',
              message: _msg,
              type: 'success'
            })
            self.resetFormData()
          }).catch(err => {
            self.loading = false
            console.log(err)
          })
        } else {
          // 不存在，先创建客户
          self.form.birthday = (_birth_date === '0-0-0') ? undefined : _birth_date
          self.creatCustpmerInfo().then(response => {
            if (response.data.id) {
              this.searphone = this.form.phone
              this.search()
              let _start_date = parseTime(self.form.start_date, '{y}-{m}-{d}') === '0-0-0' ? undefined : parseTime(self.form.start_date, '{y}-{m}-{d}')
              // 开卡信息
              let _obj = {
                customer_id: response.data.id,
                temp_id: self.form.temp_id,
                type: self.form.type,
                card_name: self.form.card_name,
                card_no: self.form.card_no === null ? '' : self.form.card_no.trim(),
                status: 10,
                sell_id: self.form.sell_id,
                real_pay: self.form.real_pay,
                payment_method: self.form.payment_method,
                start_date: _start_date,
                end_date: self.form.end_date,
                give_day: self.form.give_day ? self.form.give_day : undefined,
                remark: self.form.remark === null ? '' : self.form.remark,
                debit_card_id: self.form.debit_card_id // 储值卡号
              }
              // 储值卡是total_amount总金额，其它是total_times
              if (self.form.type !== 3) {
                _obj.total_times = self.cardtimes
              } else {
                _obj.total_amount = self.cardtimes
              }
              let _msg = this.isActivatNow ? '开卡成功' : '购卡成功'
              addVipCardCustomer(_obj).then(resl => {
                this.$notify({
                  title: '成功',
                  message: _msg,
                  type: 'success'
                })
                self.resetFormData()
              }).catch(err => {
                self.loading = false
                this.$notify({
                  title: '失败',
                  message: '开卡失败！',
                  type: 'error'
                })
                console.log(err)
              })
            } else {
              self.loading = false
            }
          }).catch(err => {
            console.log(err)
            self.loading = false
          })
        }
      })
    },
    resetFormData() {
      this.$refs.form.resetFields()
      this.$refs.formperson.resetFields()
      this.loading = false
      this.$refs.takepic.deleteimgbtn()
      this.haveCustomerInfo = true
      this.setCardNum()
      this.searphone = ''
      this.resetTime()
      this.isActivatNow = true
      this.customerInfoInput = true
      // 复位储值卡相关信息
      this.resetStoreCardParam()
    },
    sendCode() {
      if (!testphone(this.form.phone)) {
        this.common.message('error', '请输入正确的手机号码')
        return false
      }
      let self = this
      let time = 59
      if (this.haveCustomerInfo) {
        // 已经存在用户 getConfigSmsCode确认客户
        getConfigSmsCode(this.form.phone).then(res => {
          self.common.message('success', '短信发送成功请注意查收！')
          self.sendcodebtn = true
          let timecode = setInterval(function() {
            if (time === 0) {
              self.sendtext = '发送验证码'
              self.sendcodebtn = false
              clearInterval(timecode)
            } else {
              self.sendtext = `还剩${time--}秒`
              self.sendcodebtn = true
            }
          }, 1000)
        }).catch((err) => {
          console.log(err)
          self.sendcodebtn = false
        })
      } else {
        // 不存在用户 添加客户获取手机验证码getSmsCode
        getSmsCode(this.form.phone).then(res => {
          self.common.message('success', '短信发送成功请注意查收！')
          self.sendcodebtn = true
          let timecode = setInterval(function() {
            if (time === 0) {
              self.sendtext = '发送验证码'
              self.sendcodebtn = false
              clearInterval(timecode)
            } else {
              self.sendtext = `还剩${time--}秒`
              self.sendcodebtn = true
            }
          }, 1000)
        }).catch((err) => {
          console.log(err)
          self.sendcodebtn = false
        })
      }
    },
    getEmployeeList() {
      // 获取员工列表
      employeeList().then(res => {
        let data = res.data.filter(currentValue => {
          return currentValue.status === 1
        })
        this.selectoptions.push({ value: 2, label: '待分配', status: 0, post: 0 })
        for (let val of data) {
          this.selectoptions.push({ value: val.id, label: val.name, status: val.status, post: val.post })
        }
      })
    },
    computed(event) {
      if (this.form.give_day === '') {
        this.resetTime2()
        this.form.give_day = this.form.give_day.slice(0, -1)
      }
      switch (event.code) {
        case 'Backspace':
        case 'Delete':
        case 'Digit0':
        case 'Digit1':
        case 'Digit2':
        case 'Digit3':
        case 'Digit4':
        case 'Digit5':
        case 'Digit6':
        case 'Digit7':
        case 'Digit8':
        case 'Digit9':
        case 'Numpad0':
        case 'Numpad1':
        case 'Numpad2':
        case 'Numpad3':
        case 'Numpad4':
        case 'Numpad5':
        case 'Numpad6':
        case 'Numpad7':
        case 'Numpad8':
        case 'Numpad9': if (this.form.type === 1) {
          let etime = this.currentendvalue + ' 00:00:00'
          etime = new Date(etime).getTime() + this.form.give_day * 86400000
          this.form.end_date = parseTime(etime, '{y}-{m}-{d}')
          if (isNaN(parseInt(this.form.give_day))) {
            this.form.give_day = ''
          } else {
            this.cardtimes = Number(this.defaultcardtimes) + parseInt(this.form.give_day ? this.form.give_day : 0)
          }
          // this.cardtimes = Number(this.cardtimes) + parseInt(this.form.give_day ? this.form.give_day : 0)
        } else if (this.form.type === 2) {
            // 次卡
            if (isNaN(parseInt(this.form.give_day))) {
              this.form.give_day = ''
            } else {
              this.cardtimes = Number(this.defaultcardtimes) + parseInt(this.form.give_day)
            }
          } else {
            // 储值卡
            if (isNaN(parseInt(this.form.give_day))) {
              this.form.give_day = ''
            } else {
              this.cardtimes = Number(this.defaultcardtimes) + parseInt(this.form.give_day)
            }
          }
          break
        default: if (isNaN(parseInt(this.form.give_day))) {
          this.form.give_day = ''
        } else {
          this.form.give_day = Math.abs(parseInt(this.form.give_day))
        }
      }
    },
    startTime(value) {
      if (this.form.end_date === '-') {
        this.common.message('warning', '请先选择会员卡')
        return false
      }
      let curtime = new Date(value).getTime()
      if (this.form.type === 1) {
        curtime += this.cardtimes * 86400000
        this.form.end_date = parseTime(curtime, '{y}-{m}-{d}')
        this.currentendvalue = this.form.end_date
      }
      if (this.form.type === 2) {
        if (!this.contedchecked) {
          curtime += 365 * 86400000
          this.form.end_date = parseTime(curtime, '{y}-{m}-{d}')
          this.currentendvalue = this.form.end_date
        }
      }
    },
    getCradNum() {
      let data = new Date()
      let overdata = parseTime(data, '{y}{m}{d}') + '-' + data.getTime().toString()
      this.$refs.cardNo.focus()
      return overdata
    },
    setCardNum() {
      // 生成卡号按钮
      this.$refs['cardNo'].clear()
      this.form.card_no = this.getCradNum()
      this.$refs.cardNo.blur()
    },
    getimgurl(url) {
      this.form.photo = url
    },
    clearimgurl(data) {
      this.form.photo = data
    },
    search() {
      // 请输入手机号码/扫描条码查询信息
      this.customerInfoInput = false
      if (!this.searphone) {
        this.common.message('error', '请输入手机号码/扫描条码查询信息！')
        return
      }
      let self = this
      getCustomersByPhone(this.searphone).then(res => {
        let data = res.data
        if (Object.keys(data).length) {
          // 如果存在客户
          this.haveCustomerInfo = true
          this.openCustomerInfo = data
          self.form.id_card_no = data.id_card_no ? data.id_card_no : ''
          self.form.name = data.name ? data.name : ''
          self.form.phone = data.phone ? data.phone : ''
          // self.form.customer_id = data.consultant_id ? data.consultant_id : null
          // self.form.sell_id = data.sell_id ? data.sell_id : ''
          self.form.customer_id = data.id ? data.id : null
          self.form.sex = data.sex ? data.sex : ''
          self.form.birth_date = data.birthday ? new Date(data.birthday + ' 00:00:00') : ''
          self.form.photo = data.head_portrait ? data.head_portrait : ''
          self.form.coach_id = data.coach_id ? data.coach_id : ''
          self.form.consultant_id = data.consultant_id ? data.consultant_id : ''
          if (self.form.photo) {
            self.$refs.takepic.setImg(self.form.photo)
          } else {
            self.$refs.takepic.deleteimgbtn()
          }
        } else {
          // 如果不存在
          this.$message('此顾客是首次在您的俱乐部办卡，请手动录入卡开客户信息')
          self.form.name = null
          self.form.sex = 1
          self.form.phone = self.searphone
          self.form.birth_date = null
          self.form.id_card_no = ''
          self.form.photo = ''
          self.form.coach_id = ''
          self.form.consultant_id = ''
          this.$refs.takepic.deleteimgbtn()
          this.haveCustomerInfo = false
          // 开卡会员信息
          this.openCustomerInfo = {}
        }
      })
    },
    creatCustpmerInfo() {
      let data = {
        name: this.form.name,
        phone: this.form.phone,
        sex: this.form.sex,
        birthday: this.form.birth_date ? this.form.birth_date : null,
        id_card_no: this.form.id_card_no === null ? '' : this.form.id_card_no,
        head_portrait: this.form.photo,
        coach_id: this.form.coach_id ? this.form.coach_id : '',
        consultant_id: this.form.consultant_id ? this.form.consultant_id : ''
        // code: this.form.code
      }
      return addCustomers(data)
    },
    handleChange(value) {
      // 激活方式复位
      this.isStoredValCard = false
      this.form.activMethod = '1'
      this.isActivatNow = true
      this.contedchecked = false
      for (let i = 0; i < this.allCardList.length; i++) {
        if (this.allCardList[i].id === value[1]) {
          this.form.master_id = this.allCardList[i].master_id
          this.form.temp_id = value[1]
          this.cardprice = this.allCardList[i].price
          this.costprice = this.allCardList[i].floor_price
          this.cardphoto = this.allCardList[i].photo
          this.form.card_name = this.allCardList[i].name
          // this.carditselfeadline = this.allCardList[i].times // 卡本身的期限
          this.defaultcardtimes = this.allCardList[i].times // 卡本身的期限
          this.cardtimes = this.allCardList[i].times
          this.form.type = this.allCardList[i].type
          let curtime = new Date().getTime()
          this.form.start_date = curtime
          if (this.allCardList[i].type === 1) {
            this.cardtype = '时效卡'
            this.long = '时长'
            this.unit = '天'
            curtime += this.cardtimes * 86400000
            this.form.end_date = this.defaultendvalue = this.currentendvalue = parseTime(curtime, '{y}-{m}-{d}')
            this.isTimercard = true
          } else if (this.allCardList[i].type === 2) {
            this.cardtype = '次卡'
            this.long = '次数'
            this.unit = '次'
            curtime += 365 * 86400000
            this.form.end_date = this.defaultendvalue = this.currentendvalue = parseTime(curtime, '{y}-{m}-{d}')
            this.isTimercard = false
          } else {
            this.isStoredValCard = true
            this.cardtype = '储值卡'
            this.isTimercard = false // 是否是时效卡
            this.contedchecked = true
          }
          this.form.give_day = ''
        }
      }
    },
    resetTime() {
      if (this.form.end_date === '-') return false
      this.form.start_date = this.defaultstartvalue
      this.form.end_date = this.defaultendvalue
      this.cardtimes = this.defaultcardtimes
      this.form.give_day = ''
    },
    resetTime2() {
      if (this.form.end_date === '-') return false
      if (this.form.type !== 3) {
        this.form.end_date = this.defaultendvalue
      }
      this.cardtimes = this.defaultcardtimes
      this.form.give_day = ''
    },
    getlistVipCard() {
      // 获取会员卡
      let query = {
        page: 1,
        per_page: 2000,
        saas_status: 2 // SAAS市场状态：0.全部，1.下架，2.上架
      }
      listVipCard(query).then(res => {
        this.allCardList = res.data
        if (res.data.length) {
          for (let i = 0; i < res.data.length; i++) {
            let vlitem = res.data[i]
            if (vlitem.type === 1) {
              this.options[0].children.push({ value: vlitem.id, label: vlitem.name })
            } else if (vlitem.type === 2) {
              this.options[1].children.push({ value: vlitem.id, label: vlitem.name })
            } else {
              this.options[2].children.push({ value: vlitem.id, label: vlitem.name })
            }
          }
          if (this.options[0].children.length) {
            this.selectedOptions = ['zhinan', this.options[0].children[0].value]
            this.showCard(this.options[0].children[0].value)
          } else if (this.options[1].children.length) {
            this.selectedOptions = ['cicard', this.options[1].children[0].value]
            this.showCard(this.options[1].children[0].value)
          } else if (this.options[2].children.length) {
            this.selectedOptions = ['storedcard', this.options[1].children[0].value]
            this.showCard(this.options[2].children[0].value)
          }
        } else {
          this.tipDialogVisible = true
        }
      })
    },
    showCard(value) {
      // 默认显示一张卡
      for (let i = 0; i < this.allCardList.length; i++) {
        if (this.allCardList[i].id === value) {
          this.form.temp_id = value
          this.form.master_id = this.allCardList[i].master_id
          this.cardprice = this.allCardList[i].price
          this.costprice = this.allCardList[i].floor_price
          this.cardphoto = this.allCardList[i].photo
          this.form.card_name = this.allCardList[i].name
          this.cardtimes = this.allCardList[i].times
          // this.carditselfeadline = this.allCardList[i].times // 卡本身的期限
          this.defaultcardtimes = this.allCardList[i].times // 卡本身的期限
          this.form.type = this.allCardList[i].type
          let curtime = new Date().getTime()
          this.form.start_date = curtime
          if (this.allCardList[i].type === 1) {
            this.cardtype = '时效卡'
            this.long = '时长'
            this.unit = '天'
            curtime += this.cardtimes * 86400000
            this.form.end_date = this.defaultendvalue = this.currentendvalue = parseTime(curtime, '{y}-{m}-{d}')
            this.isTimercard = true
          } else if (this.allCardList[i].type === 2) {
            this.cardtype = '次卡'
            this.long = '次数'
            this.unit = '次'
            curtime += 365 * 86400000
            this.form.end_date = this.defaultendvalue = this.currentendvalue = parseTime(curtime, '{y}-{m}-{d}')
            this.isTimercard = false
          } else {
            this.isStoredValCard = true
            this.cardtype = '储值卡'
            this.isTimercard = false // 是否是时效卡
            this.contedchecked = true
          }
          this.form.give_day = ''
        }
      }
    },
    GoTo() {
      this.$router.push('/advanced/cardtypemanage')
    },
    timeFormat(param) {
      let result = ''
      if (!param || param === '-') {
        return undefined
      }
      let date = new Date(param)
      let _year = date.getFullYear()
      let _moth = date.getMonth() + 1 > 9 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1)
      let _day = date.getDate() > 9 ? date.getDate() : '0' + date.getDate()
      result = _year + '-' + _moth + '-' + _day
      return result
    },
    activMethodChange(value) {
      if (value === '1') {
        this.isActivatNow = true
      } else {
        this.isActivatNow = false
        this.contedchecked = false
      }
      this.resetTime()
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
  beforeRouteEnter(to, from, next) {
    if (from.path === '/form/createForm') {
      isInit = true
      _phone = to.params.phone
    }
    next()
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.psoedd {
  position: absolute;
  right: 9px;
  top: 0;
}
.overscontime /deep/ .el-input-group__append {
  background-color: white;
}
.tip {
  color: #d0d0d0;
  font-size: 14px;
}
.black {
  background: #000;
  border: 1px solid #000;
}
.active-box{
  margin: -10px;
  padding: 10px;
  background-color: #f7f9fa;
  border-radius: 5px;
  margin-bottom: 10px;
}
.cardbox {
  width: 90%;
  margin-left: 5%;
  height: 188px;
  max-width: 738px;
  border-radius: 10px;
  background-color: #c0c4cc;
  position: relative;
  .choosecardbox {
    float: right;
    width: 156px;
    margin: 10px 10px 0 0;
    .el-form-item__label {
      margin-left: 0;
    }
  }
  .cardboxcardname {
    float: left;
    line-height: 40px;
    height: 40px;
    margin-left: 10px;
    margin-top: 10px;
    overflow: hidden;
    color:#fff;
    .imgbox {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      overflow: hidden;
      float: left;
      margin-right: 5px;
      >img {
        float: left;
        width: 40px;
        height: 40px;
      }
    }
    .imgtext {
      float: left;
    }
  }
  .cardtext {
    color: #fff;
    font-size: 14px;
    margin-left: 10px;
  }
  .cardno {
    position: absolute;
    left: 10px;
    bottom: 15px;
    font-size: 10px;
    color: #ffffff;
  }
  .cardcalda {
    position: absolute;
    right: 10px;
    bottom: 10px;
    font-size: 10px;
    color: #ffffff;
    height: 24px;
    border-radius: 20px;
    background-color: rgba(#000000 , 0.1);
    width: 160px;
    text-align: center;
    line-height: 24px;
  }
}
.por {position: relative;}
.poa {position: absolute;
  right: 10px;
  top: -9px;}
.pricebox {
  overflow: hidden;
  margin: 20px 0 40px 0;
  width: 90%;
  margin-left: 5%;
}
.cardformbox {
  width: 90%;
  margin-left: 5%;
}
.pricefont {
  font-size: 20px;
  color: red;
  float: left;
}
.pricesurplus {
  float: right;
  font-size: 20px;
  color: #d0d0d0;
}
.upload-demo {
  width: 220px;
}
.submitbtn {
  width: 150px;
  height: 40px;
  color: white;
}
.upload-demo {
  margin-left: 86px;
}
.avatar {
  margin-top: 10px;
}
.avatar-title {
  position: relative;
  top: 40px;
  left: -10px;
}
.topbox {
  overflow: hidden;
  border: 1px solid #eeeeee;
  padding: 10px;
}
.pading20 {
  padding: 20px;
}
.el-form-item__content{
  width: 20% !important;
}
.btm20 {
  padding-bottom: 20px;
  font-weight: 600;
  color: #333333;
}
// .pointred {
//   width: 5px;
//   height: 5px;
//   border-radius: 50%;
//   background-color: #F14C30;
//   display: inline-block;
//   position: relative;
//   top: -3px;
//   right: 5px;
// }
.pointred{
  font-style: normal;
}
.pointred::before{
  content: '*';
  color: #f56c6c;
  margin-right: 0px;
}
.mr10 {
  margin-right: 10px;
}
.kacard .el-input {
  width: 80%;
}
.sendbox {
  display: inline-block;
  position: relative;
  width: 80%;
  .el-input {
    width: 100%;
  }
  .sendlist {
    position: absolute;
    right: 0;
    top: 0;
    border-left: 1px solid #dcdfe6;
    width: 120px;
    height: 36.67px;
    padding-left: 5%;
  }
}
.rel {
  position: relative;
}
.blackbtn {
  position: absolute;
  top: 1px;
  background: #333333;
  color: white;
}
.documentation-container{
  background-color: #f0f0f0;
  width: 100%;
  min-height: calc(100vh - 84px);
  /deep/ .el-input-group__prepend{
    padding: 0px 17px;
  }
  .qr{
    width: 36px;
    position: absolute;
    left: 0;
    top: -1px;
    height: 36px;
    background: url("../../assets/icon/qr.png") no-repeat center;
    background-size: cover;
    border-radius: 5px 0 0 5px;
  }
}
.through{
  width: 20px;
  height: 20px;
  display: inline-block;
  background: #1AB394;
  border-radius: 3px;
  color: #ffffff;
  line-height: 20px;
  margin-right: 3px;
  text-align: center;
}
h4 {
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
  background-color: rgba(245, 247, 250, 0.6);
  left: 0px;
  top: 0px;
  cursor: not-allowed;
}
.formperson{
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
