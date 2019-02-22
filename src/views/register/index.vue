<template>
  <div>
    <div class="logo"></div>
    <div class="bg_top">创建您的SaaS ID</div>
    <div class="formbox one" v-show="active === 0">
      <h2 class="cenbox">账户基本信息</h2>
      <el-input v-model.trim="account_id"
        maxlength="20"
        size="medium" 
        class="botmar20" 
        placeholder="请填写登录账号(首字母必须为英文)"
        :class="{errInput: accountIdErr}"
        @change="accountInput"
        @blur="verifyAccount"
        ref="account_id"></el-input>
      <el-input v-model.trim="password" maxlength="16" size="medium" type="password" class="botmar20" placeholder="请填写登录密码(最少长度为8位)"  @keyup.space.native="test1($event)" @blur="inputCheckPassword"></el-input>
      <el-input v-model.trim="password_confirmation" type="password" size="medium" class="botmar20" placeholder="请再次填写登录密码" @blur='againCheckPassword' @keyup.space.native="test1($event)"></el-input>
      <el-input v-model.trim="name" size="medium" class="botmar20" placeholder="请填写您的场馆名称"  @blur="verifyVenueName"></el-input>
      <el-tooltip class="item" effect="dark" placement="right">
        <div slot="content">1. 输入后请在下拉框中选择地址<br/>2. 下拉框中若无具体地址，请选择相邻地址<br/>3. 切勿有重复的信息</div>
        <input name="address" id="address" maxlength="50" class="botmar20 loe el-input__inner el-input el-input--medium" type="text" placeholder="请输入地址，比如：光谷">
      </el-tooltip>
      <div id="searchResultPanel" style="border:1px solid #C0C0C0;height:auto; display:none;"></div>
      <div id="l-map" class="owntext"></div>
    </div>
    <div class="formbox tow" v-show="active === 1">
      <h2 class="cenbox">法人基本信息</h2>
      <el-input v-model="legal_person_name" size="medium" class="botmar20" placeholder="请填写法人姓名" maxlength="24"></el-input>
      <el-input v-model="legal_person_phone" size="medium" class="botmar20" placeholder="请填写法人手机号" @blur="inputCheckPhone" type="number"  oninput="if(value.length > 11)value = value.slice(0, 11)"></el-input>
      <el-input placeholder="请输入验证码" v-model="code" class="input-with-select resigt botmar20" type="number"  @blur="inputCheckCode" oninput="if(value.length > 4)value = value.slice(0, 4)">
        <el-button slot="append" type="primary" @click="sendCode" :disabled="sendcodebtn" style="">{{sendtext}}</el-button>
      </el-input>
    </div>
    <div class="formbox three" v-show="active === 2">
      <h2 class="cenbox">场馆基本信息</h2>
      <div class="changuanimgbox">
        <div class="changuanimgboxleft">
          <div class="changguantext">俱乐部LOGO</div>
          <moreImg :boxWidth="110" :boxHeihgt="110" :imgWidth="512" :imgHeight="512" 
            @imgUrl="getlogoimageUrl" @clearimgurl="reomveLogoimg" :isToken='true' :baseUrl="'/v1/home/oss_sign_url'"
            @uploadErro="uploadErro"></moreImg>
        </div>
        <div class="changuanimgboxright">
          <div class="changguantext">场馆图片</div>
          <moreImg 
            :boxWidth="200" :boxHeihgt="110" :imgWidth="750" :imgHeight="420" @imgUrl="getimageUrl" @clearimgurl="reomveimg" :isToken='true' 
            :baseUrl="'/v1/home/oss_sign_url'"
            @uploadErro="uploadErro"></moreImg>
        </div>
      </div>
      <div class="curbox">
        <div class="changguantext">俱乐部营业时间</div>
        <el-time-picker
          class="botmar20"
          size="medium"
          is-range
          @change="timeChoose"
          v-model="timeValue"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          placeholder="选择时间范围">
        </el-time-picker>
        <el-input v-model="phone" size="medium" placeholder="场馆办公电话（选填）" type="number"></el-input>
      </div>
      <div class="curbox">
        <div class="changguantext">俱乐部特色</div>
        <div class="specity">
          <div class="mocheckbox"  v-bind:class="{ isCheck: project.isCheck }" v-for="(project, key) in listProject" @click="checked(key)" :key="key">{{project.name}}</div>
        </div>
      </div>
      <!-- <div class="curbox">
        <div class="changguantext">俱乐部功能</div>
        <div class="specity">
          <div class="mocheckbox"  v-bind:class="{ isCheck: project.isCheck }" v-for="(project, key) in listFacil" @click="fiaclchecked(key)" :key="key">{{project.name}}</div>
        </div>
      </div> -->
      <!-- <div class="curbox">
        <div class="changguantext">使用本系统,即表示我接受牛啦的<a href="/static/Privacy_clause/Privacy_clause.html" target="_blank" style="color: #409EFF">服务条款</a>和<a href="/static/Privacy_clause/Privacy_clause.html" target="_blank" style="color: #409EFF">隐私政策</a></div>
      </div> -->
    </div>
    <!-- <div class="formbox four" v-show="active === 4">
      <div class="conplete">
        恭喜注册完成！请等待审核通过，会有短信提醒！
      </div>
    </div> -->
    <div class="registerProgress-content" v-show="active === 4" style="max-width:900px;margin:0px auto">
      <h2>注册完成</h2>
      <el-steps :active="2" simple class="el-stop">
        <el-step title="成功提交信息" icon="el-icon-edit">
        </el-step>
        <el-step title="信息审核中" icon="el-icon-upload"></el-step>
        <el-step title="审核完成" icon="el-icon-picture"></el-step>
      </el-steps>
      <p class="prompt">
				您的信息已提交成功，我们将在<span>3个工作日</span>内审核您的信息，请耐心等待，
				审核结果会以短信的形式发送到您的手机上，请注意查收
			</p>
      <div class="bottom-box">
        <!-- <el-button type="info" class='modifyInfor-btn' @click="modifyRegistInfor">修改信息</el-button> -->
        <el-button  @click="backLogin" style="background:#333;color:#fff;width:150px;height:40px">返回登录</el-button>
      </div>
    </div>
    <div class="buttoncenter" v-show="except" style="margin-top:10px;">
      <el-button v-if="complete" @click="prev" type="info" v-show="active > 0" style="width:150px; background: #DDDDDD; height:40px;border-color:#DDDDDD">上一步</el-button>
      <el-button v-if="complete" @click="next" :loading="loading" style="background:#333;color:#fff;width:150px;height:40px">{{btntext}}</el-button>
      <el-button v-if="!complete" onclick="history.go(-1)" style="background-color:#1AB394;border-color:#1AB394;color:#ffffff;">完成注册</el-button>
      <p class="bottom-prompt">
        已有账号？<span @click="backLogin">返回登录</span>
      </p>
      <div class="curbox" style="margin-top:10px">
        <div class="changguantext">使用本系统,即表示我接受牛啦的<a href="/static/Privacy_clause/Privacy_clause.html" target="_blank" style="color: #409EFF">服务条款</a>和<a href="/static/Privacy_clause/Privacy_clause.html" target="_blank" style="color: #409EFF">隐私政策</a></div>
      </div>
    </div>
    
    <div class="stepbox" v-show="except">
      <div class="step">
        <el-steps :active="active" finish-status="success" simple style="margin-top: 28px">
          <el-step title="Step 1">
           <!-- <i class="el-icon-step1" slot="icon"></i> -->
          </el-step>
          <el-step title="Step 2">
            <!-- <i class="el-icon-step2" slot="icon"></i> -->
          </el-step>
          <el-step title="Step 3">
            <!-- <i class="el-icon-step3" slot="icon"></i> -->
          </el-step>
        </el-steps>
      </div>
    </div>
    <send-code-prop
      :phone="legal_person_phone"
      :dialogVisible="onceAgainProp"
      @dialogClosed="sendCodePropClosed"
      @sentSuccess="sentSuccess"></send-code-prop>
  </div>
</template>

<script>
import { testphone } from '@/utils/validate'
import moreImg from '@/components/moreImg'
import { parseTime } from '@/utils/index'
import { creatnoticeDom } from '@/utils/comm'
import { checkAccount, sendPhoneCodeCheck, checkVenueName } from '@/api/registProgress'
import SvgIcon from '@/components/SvgIcon'
import SendCodeProp from './components/sendCodeProp'
import { setSession } from '@/utils/auth'
export default {
  components: {
    moreImg,
    SvgIcon,
    SendCodeProp
  },
  name: 'register',
  data() {
    return {
      except: true,
      sendtext: '获取验证码',
      sendcodebtn: false,
      loading: false,
      account_id: '', // 登录账号
      password: '', // 登录密码
      password_confirmation: '', // 重复密码
      name: '', // 健身房名称
      address: '', // 健身房地址
      legal_person_name: '', // 法人姓名
      legal_person_phone: '', // 法人电话
      code: '', // 验证码
      phone: '', // 场馆电话
      feature: [],
      facility: [],
      allFormData: {},
      complete: true,
      active: 0,
      btntext: '继续',
      logo: '',
      images: [],
      input: '',
      timeValue: [new Date(2018, 1, 1, 9, 0), new Date(2018, 1, 1, 22, 0)],
      listProject: [],
      listFacil: [],
      accountIdErr: false,
      $code: '',
      accountVS: false,
      IsVenueName: false,
      token: '',
      expired_date: null,
      threeUp: false,
      backData: [],
      onceAgainProp: false // 再次发送验证码
    }
  },
  methods: {
    timeChoose(data) {
      this.allFormData.business_start = parseTime(data[0], '{h}:{i}')
      this.allFormData.business_end = parseTime(data[1], '{h}:{i}')
    },
    getlogoimageUrl(imgname) {
      this.logo = imgname
    },
    reomveLogoimg(data) {
      this.logo = data
    },
    getimageUrl(imgname) {
      this.images[0] = imgname
    },
    reomveimg(data) {
      this.images[0] = data
    },
    checked(index) {
      this.listProject[index].isCheck ? this.listProject[index].isCheck = false : this.listProject[index].isCheck = true
    },
    fiaclchecked(index) {
      this.listFacil[index].isCheck ? this.listFacil[index].isCheck = false : this.listFacil[index].isCheck = true
    },
    sendCode() {
      if (!testphone(this.legal_person_phone)) return
      let self = this
      let time = 59
      this.threeUp = false
      this.$store.dispatch('SendCode', this.legal_person_phone).then((res) => {
        this.$code = res.code
        self.sendcodebtn = true
        this.common.message('success', '验证码已发送，请注意查收')
        self.expired_date = null
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
      }).catch(() => {
        self.sendcodebtn = false
      })
    },
    verifyStep1() {
      if (!this.account_id.length) {
        this.common.message('warning', '账户不能为空')
        return false
      }
      if (!/^[a-zA-Z]\w+$/.test(this.account_id)) {
        this.common.message('warning', '账户首字母必须为英文，且不允许特殊符号')
        return false
      }
      if ((/[\u4E00-\u9FFF]+/g).test(this.account_id)) {
        this.common.message('warning', '登录账户不能包含中文')
        return false
      }
      if (!/^.{6,20}$/.test(this.account_id)) {
        this.common.message('warning', '账号 必须介于 6 - 20 个字符之间')
        return false
      }
      if (!this.accountVS) {
        this.common.message('error', '帐户名有误或已存在')
        return false
      }
      if (!this.password.length) {
        this.common.message('warning', '密码不能为空')
        return false
      }
      if (this.password.length < 8) {
        this.common.message('warning', '密码长度不能少于8位')
        return false
      }
      if (!this.password_confirmation.length) {
        this.common.message('warning', '请再次填写密码')
        return false
      }
      if (this.password !== this.password_confirmation) {
        this.common.message('error', '两次输入密码不一致')
        return false
      }
      if (!this.name.length) {
        this.common.message('warning', '场馆名称不能为空')
        return false
      }
      if (!this.IsVenueName) {
        this.common.message('error', '场馆名称已存在')
        return false
      }
      let curcity = document.getElementById('address').value
      if (!curcity.length) {
        this.common.message('warning', '场馆地址不能为空')
        return false
      }
      if (!this.allFormData.province || !this.allFormData.gps_lat || !this.allFormData.gps_lon) {
        this.common.message('error', '请填写正确的场馆地址，且必须从下拉框中选择地址')
        return false
      }
      this.address = curcity
      this.allFormData.account_id = this.account_id
      this.allFormData.password = this.password
      this.allFormData.password_confirmation = this.password_confirmation
      this.allFormData.name = this.name
      this.allFormData.address = this.address
      return true
    },
    validata() {
      if (!this.legal_person_name) {
        this.common.message('warning', '法人姓名不能为空')
        return false
      }
      if (this.legal_person_phone.length > 0) {
        if (!(/^1[0-9]\d{9}$/.test(this.legal_person_phone))) {
          this.common.message('warning', '请输入正确的电话号码')
        }
      }
      if (!testphone(this.legal_person_phone)) return
      if (!this.code) {
        this.common.message('warning', '验证码不能为空')
        return false
      }
      if (!(this.code.length === 4)) {
        this.common.message('warning', '验证码长度为4位')
        return false
      }
      return true
    },
    verifyStep2() {
      if (!this.validata()) {
        return false
      }
      // if (parseInt(this.code) !== this.$code) {
      //   this.common.message('warning', '请输入正确的验证码')
      //   return false
      // }
      this.allFormData.legal_person_name = this.legal_person_name
      this.allFormData.legal_person_phone = this.legal_person_phone
      this.allFormData.code = this.code
      let obj = {
        phone: this.legal_person_phone,
        code: this.code,
        scene: 1
      }
      return new Promise((reslove, reject) => {
        if (!this.expired_date) {
          sendPhoneCodeCheck(obj).then(res => {
            let data = res.data
            this.token = data.token
            setSession('Phone-Token', data.token)
            this.expired_date = data.expired.date
            reslove({ type: 'sendCode', status: true })
          }).catch(() => {
            reslove({ type: 'sendCode', status: false })
          })
        } else {
          // if (new Date(this.expired_date) < new Date()) {
          //   // 验证码过期
          //   this.common.message('warning', '验证码过期，请重新获取验证码')
          //   this.code = ''
          //   this.allFormData.code = ''
          //   this.$code = ''
          //   reslove({ type: 'testCode', status: false })
          // } else {
          //   reslove({ type: 'testCode', status: true })
          // }
          reslove({ type: 'testCode', status: true })
        }
      })
      // 手机验证码 - 验证获取token
    },
    verifyStep3() {
      // 验证码是否过期
      // if (new Date(this.expired_date) > new Date()) {
      //   this.$confirm(`验证码过期，是否从新获取验证码`, '提示', {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     type: 'warning'
      //   }).then(() => {
      //     this.onceAgainProp = true
      //   }).catch(() => {
      //     console.log(1)
      //   })
      //   return false
      // }
      if (!this.logo.length) {
        this.common.message('warning', '场馆LOGO不能为空')
        return false
      }
      if (!this.images.length) {
        this.common.message('warning', '场馆场馆图片不能为空')
        return false
      }
      if (!this.timeValue) {
        this.common.message('warning', '场馆场馆营业时间不能为空')
        return false
      }
      // if (this.phone.length > 0) {
      //   if (!/^[0-9]*[1-9][0-9]*$/.test(this.phone)) {
      //     this.common.message('warning', '场馆办公电话输入有误')
      //     return false
      //   }
      // }
      // 获取场馆特色
      for (let value of this.listProject) {
        if (value.isCheck) {
          this.feature.push(value.value)
        }
      }
      for (let value of this.listFacil) {
        if (value.isCheck) {
          this.facility.push(value.value)
        }
      }
      if (!this.feature.length) {
        this.common.message('warning', '请选择俱乐部特色')
        return false
      }
      /* if (!this.facility.length) {
        this.common.message('warning', '请选择俱乐部功能')
        return false
      } */
      this.allFormData.logo = this.logo
      this.allFormData.images = this.images
      // this.allFormData.timeValue = this.timeValue
      this.allFormData.phone = this.phone
      this.allFormData.feature = this.feature
      this.allFormData.facility = this.facility
      return true
    },
    savePhoneAndCode() {
      this.backData.push({ phone: this.legal_person_phone, code: this.code })
    },
    watchPhoneAndCode() {
      if (this.backData.length) {
        if (this.backData[0].phone !== this.legal_person_phone) {
          this.common.message('warning', '电话号码发生变更，请重新获取验证码')
          return false
        }
        if (this.backData[0].code !== this.code) {
          this.common.message('warning', '验证码发生变更，请重新获取验证码')
          return false
        }
      }
      return true
    },
    next() {
      if (this.active === 0) {
        if (this.verifyStep1()) {
          this.active++
          return
        } else {
          return false
        }
      }
      if (this.active === 1) {
        // if (!this.watchPhoneAndCode()) {
        //   return
        // }
        if (this.threeUp) {
          if (!this.validata()) {
            return false
          } else {
            this.active++
            this.btntext = '完成注册'
            this.savePhoneAndCode()
            return
          }
        } else {
          this.verifyStep2().then(res => {
            if (res.type === 'sendCode') {
              if (res.status) {
                this.active++
                this.btntext = '完成注册'
                this.savePhoneAndCode()
              }
            }
            if (res.type === 'testCode') {
              if (res.status) {
                this.active++
                this.btntext = '完成注册'
                this.savePhoneAndCode()
              }
            }
          })
        }
      }
      if (this.active === 2) {
        if (this.verifyStep3()) {
          this.active++
        } else {
          return false
        }
      }
      if (this.active === 3) {
        this.except = false
        this.timeChoose(this.timeValue)
        this.loading = true
        this.allFormData.token = this.token
        this.$store.dispatch('Register', this.allFormData).then((res) => {
          this.active = 4
          this.except = false
          this.complete = false
          this.loading = false
        }).catch((err) => {
          this.loading = false
          this.except = true
          this.btntext = '完成注册'
          this.active--
          if (err.response.data.error_code === 30003) {
            this.onceAgainProp = true
          }
        })
      }
    },
    prev() {
      this.active--
      if (this.active === 0) this.active = 0
      else this.btntext = '下一步'
      if (this.active === 1) this.threeUp = true
    },
    init() {
      this.$store.dispatch('GetFeatures').then((res) => {
        for (let key in res) {
          this.listProject.push({ name: res[key], value: key, isCheck: false })
        }
      }).catch((err) => {
        console.log(err)
      })
      this.$store.dispatch('GetFacilities').then((res) => {
        for (let key in res) {
          this.listFacil.push({ name: res[key], value: key, isCheck: false })
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    accountInput(param) {
      let reg = /^[a-zA-Z]/
      let reg1 = new RegExp('[\\u4E00-\\u9FFF]+', 'g')
      let reg2 = /^.{6,20}$/
      let errlevel = 0
      if (!reg.test(param)) {
        errlevel = 1
      } else {
        if (reg1.test(param)) {
          errlevel = 2
        } else {
          if (!reg2.test(param)) {
            errlevel = 3
          }
        }
      }
      let errText = ['登录账户名首位必须是英文字母', '登录账户不能包含中文', '账号 必须介于 6 - 20 个字符之间']
      let doc = this.$refs.account_id.$el.children[0]
      creatnoticeDom(doc, !errlevel, errText[errlevel - 1])
    },
    verifyAccount(e) {
      this.accountVS = false
      let doc = e.target
      let _val = doc.value
      if (!this.account_id) {
        this.common.message('error', '账户名不能为空！')
        return
      }
      if ((/[\u4E00-\u9FFF]+/g).test(this.account_id)) {
        this.common.message('warning', '登录账户不能包含中文')
        return false
      }
      checkAccount(this.account_id).then(res => {
        if (res.data.exists === true) {
          this.common.message('error', '账户名有误或已存在！')
        } else {
          this.accountVS = true
        }
      })
    },
    verifyVenueName(e) {
      this.IsVenueName = false
      if (!this.name) {
        this.common.message('error', '场馆名称不能为空！')
        return false
      }
      let obj = {
        name: this.name
      }
      checkVenueName(obj).then(res => {
        if (res.data.exists === true) {
          this.common.message('error', '场馆名称已存在！')
          this.IsVenueName = false
        } else {
          this.IsVenueName = true
        }
      })
    },
    test1(event) {
      var doc = event.target
      doc.value = doc.value.trim()
    },
    inputCheckPhone(e) {
      // 电话校验
      let doc = e.target
      let _val = doc.value
      creatnoticeDom(doc, testphone(_val), '请输入正确的电话号码')
    },
    inputCheckCode(e) {
      // 验证码长度验证
      let doc = e.target
      let _val = doc.value
      creatnoticeDom(doc, _val.length === 4, '请输入4位正确的验证码')
    },
    inputCheckPassword(e) {
      // 基本账户信息 填写登录密码
      let doc = e.target
      let _val = doc.value
      let reg = /.{8,}/
      creatnoticeDom(doc, reg.test(_val), '密码长度至少为8位')
    },
    againCheckPassword(e) {
      // 基本账户信息  再次填写登录密码
      let doc = e.target
      let _val = doc.value
      creatnoticeDom(doc, _val === this.password, '两次输入密码不一致')
    },
    backLogin() {
      // 返回登录页面
      this.$store.dispatch('FedLogOut').then(() => {
        this.$router.push({ path: '/login' })
      })
    },
    modifyRegistInfor() {
      this.$store.dispatch('FedLogOut').then(() => {
        let obj = Object.assign({}, this.accountInfor, { AdminToken: this.AdminToken })
        this.$router.push({ name: 'modifyRegister', params: obj })
      })
    },
    sendCodePropClosed() {
      // 关闭再次发送验证码弹窗
      this.onceAgainProp = false
    },
    uploadErro() {
      // 上传文件失败
      this.onceAgainProp = true
    },
    sentSuccess(param) {
      this.token = param.token
      setSession('Phone-Token', param.token)
      this.expired_date = param.expired_date
    }
  },
  created() {
    this.init()
  },
  destroyed() {
  },
  mounted() {
    var province = ''
    var city = ''
    var self = this
    function G(id) {
      return document.getElementById(id)
    }
    var Bm = setInterval(function() {
      if (typeof (BMap) !== 'undefined') {
        clearInterval(Bm)
        var map = new BMap.Map('l-map')
        // var top_right_navigation = new BMap.NavigationControl({
        //   anchor: BMAP_ANCHOR_TOP_RIGHT,
        //   type: BMAP_NAVIGATION_CONTROL_ZOOM
        // })
        map.centerAndZoom('北京', 10) // 初始化地图,设置城市和地图级别。
        // var point = new BMap.Point(114.311831,30.558428);
        // map.centerAndZoom(point,12);
        map.enableScrollWheelZoom() // 启用滚轮放大缩小，默认禁用
        // map.addControl(top_right_navigation);
        // map.removeControl(top_right_navigation);
        // map.enableContinuousZoom(); // 启用地图惯性拖拽，默认禁用
        // map.disableDragging();
        // var infoView = new BMap.InfoWindow("I am here");
        // var addr;
        var ac = new BMap.Autocomplete({
          'input': 'address',
          'location': map
        })
        ac.addEventListener('onhighlight', function(e) { // 鼠标放在下拉列表上的事件
          var str = ''
          var _value = e.fromitem.value
          var value = ''
          if (e.fromitem.index > -1) {
            value = _value.province + _value.city + _value.district + _value.street + _value.business
          }
          str = 'FromItem<br />index = ' + e.fromitem.index + '<br />value = ' + value

          value = ''
          if (e.toitem.index > -1) {
            _value = e.toitem.value
            value = _value.province + _value.city + _value.district + _value.street + _value.business
          }
          str += '<br />ToItem<br />index = ' + e.toitem.index + '<br />value = ' + value
          G('searchResultPanel').innerHTML = str
        })
        var myValue
        ac.addEventListener('onconfirm', function(e) { // 鼠标点击下拉列表后的事件
          var _value = e.item.value
          myValue = _value.province + _value.city + _value.district + _value.street + _value.business
          // city = _value.city
          // province = _value.province ? _value.province : city
          self.allFormData.province = _value.province
          self.allFormData.city = _value.city
          self.allFormData.district = _value.district
          G('searchResultPanel').innerHTML = 'onconfirm<br />index = ' + e.item.index + '<br />myValue = ' + myValue
          // document.getElementById('address').value = '北京市'
          setPlace()
        })
        /*eslint no-unused-vars: 0*/
        var marker
        var geoc = new BMap.Geocoder()
        var gps_lat = 0
        var gps_lon = 0
        var setPlace = function() {
          map.clearOverlays() // 清除地图上所有覆盖物
          function myFun() {
            var itemInfo = local.getResults().getPoi(0)
            if (!itemInfo) {
              alert('地址信息不全，请选择相邻地址')
              return
            }
            var pp = itemInfo.point // 获取第一个智能搜索的结果
            map.centerAndZoom(pp, 18)
            marker = new BMap.Marker(pp)
            map.addOverlay(marker) // 添加标注
            marker.enableDragging()
            gps_lat = marker.point.lat
            gps_lon = marker.point.lng
            let gggps = bd_decrypt(gps_lat, gps_lon)
            ban_city_district(itemInfo, self.allFormData)
            // self.allFormData.province = itemInfo.province || self.allFormData.province
            self.allFormData.gps_lat = gggps.lat
            self.allFormData.gps_lon = gggps.lon
            console.log(self.allFormData)
            marker.addEventListener('dragend', function(e) {
              geoc.getLocation(e.point, function(rs) {
                var addComp = rs.addressComponents
                document.getElementById('address').value = addComp.province + addComp.city + addComp.district + addComp.street + addComp.streetNumber
                if (addComp.province.length === 0) {
                  city = addComp.city
                } else {
                  city = addComp.city
                  province = addComp.province
                }
                self.allFormData.city = addComp.city
                self.allFormData.province = addComp.province ? addComp.province : addComp.city
                self.allFormData.district = addComp.district
                ban_city_district(addComp, self.allFormData)
                gps_lat = marker.point.lat
                gps_lon = marker.point.lng
                let gggps = bd_decrypt(gps_lat, gps_lon)
                self.allFormData.gps_lat = gggps.lat
                self.allFormData.gps_lon = gggps.lon
                console.log(self.allFormData)
              })
            })
          }
          /* eslint no-undef: 0 */
          var local = new BMap.LocalSearch(map, { // 智能搜索
            onSearchComplete: myFun
          })
          local.search(myValue)
        }
      }
    }, 30)
    // bd_decrypt(116.404, 39.915);
    var x_pi = 3.14159265358979324 * 3000.0 / 180.0
    // var gg_lat, gg_lon, bd_lat, bd_lon
    // 百度坐标转火星坐标(gcj02)
    function bd_decrypt(bd_lat, bd_lon) {
      var x = bd_lon - 0.0065
      var y = bd_lat - 0.006
      var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi)
      var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi)
      var gg_lon = z * Math.cos(theta)
      var gg_lat = z * Math.sin(theta)
      return { lon: gg_lon, lat: gg_lat }
    }
    function ban_city_district(params, obj) {
      switch (obj.city) {
        case '北京市':
        case '天津市':
        case '上海市':
        case '重庆市':
          obj.province = obj.city
          obj.city = obj.district
          break
        case '香港':
          obj.province = '香港特别行政区'
          obj.city = obj.district
          break
        case '澳门':
          obj.province = '澳门特别行政区'
          obj.city = obj.district
          break
        default:
          obj.province = params.province
      }
    }
    // 火星坐标转百度坐标
    /* function bd_encrypt(gg_lat, gg_lon) {
      var x = gg_lon
      var y = gg_lat
      var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi)
      var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi)
      bd_lon = z * Math.cos(theta) + 0.0065
      bd_lat = z * Math.sin(theta) + 0.006
      // console.log(bd_lat + ',' + bd_lon)
    } */
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scope>
.mocheckbox {
  width:70px;
  height: 36px;
  border: 1px solid #cccccc;
  border-radius: 4px;
  font-size: 14px;
  line-height: 36px;
  cursor: pointer;
  margin-right: 10px;
  float: left;
  margin-bottom: 10px;
}
.conplete {
  font-size: 26px;
  color: #1AB394;
  position: relative;
  top: 46%;
  h2 {
    margin-top: 60px;
    text-align: center;
    color: #333333;
  }
  .el-stop {
    width: 900px;
    height: 54px;
    margin: 0px auto;
    margin-top: 166px;
    .is-finish {
      color: #1ab394;
    }
  }
  .prompt {
    color: #333333;
    font-size: 12px;
    text-align: center;
    line-height: 20px;
    width: 400px;
    margin: 0px auto;
    margin-top: 24px;
    span {
      color: #409eff;
    }
  }
}
.changuanimgbox {
  overflow: hidden;
  .changuanimgboxleft {
    float: left;
  }
  .changuanimgboxright {
    float: right;
    .avatar-uploader-icon {
      width: 200px;
      position: relative;
    }
    .avatar {
      width: 200px;
    }
  }
}
.distip {
  font-size: 12px;
  display: block;
  position: absolute;
  top: 24px;
  width: 100%;
}
.el-date-editor .el-range-separator {
  width: 10%;
}
.el-date-editor .el-range-input {
  width: 37%;
}
.el-date-editor--timerange.el-input__inner, .el-time-range-picker {
  width: 320px;
}
.specity {
  overflow: hidden;
}

.curbox {
  margin-top: 25px;
}
.changguantext {
  margin-bottom: 5px;
  text-align: center;
  font-size: 12px;
  height: 18px;
}
.isCheck {
  color: #ffffff;
  background-color: #333333;
  border: 1px solid #333333;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 110px;
  height: 110px;
  line-height: 110px;
  text-align: center;
}
.avatar {
  width: 110px;
  height: 110px;
  display: block;
}
.owntext {
  width: 320px;
  height: 180px;
}
.el-steps--simple {
  background-color: #fff;
}
.logo {
  width: 90%;
  margin: 0 auto;
  height: 58px;
  background-image: url(../../assets/logo_img/LOGO.svg);
  background-repeat: no-repeat;
  background-position: left center;
  background-size: 250px;
}
.bg_top {
  width: 100%;
  height: 140px;
  background: url(../../assets/logo_img/reg-bg-top.png) no-repeat 100% 100%;
  background-size: cover;
  color: #fff;
  font-size: 36px;
  text-align: center;
  line-height: 140px;
}
.stepbox {
  border-top: 1px solid #eee;
  height: 86px;
  width: 70%;
  margin: 0 auto;
  .step {
    width: 50%;
    margin: 0 auto;
    // .el-icon-step1::before{
    //   content: '1';
    // }
    // .el-icon-step2::before{
    //   content: '2';
    // }
    // .el-icon-step3::before{
    //   content: '3';
    // }
  }
}
.buttoncenter {
  margin-bottom: 10px;
  width: 100%;
  text-align: center;
}
.formbox {
  width: 320px;
  margin: 0 auto;
  min-height: 570px;
  // height: calc(100vh - 343px);
  text-align: center;
}
.cenbox {
  line-height: 90px;
  height: 90px;
  margin: 0;
}
.botmar20 {
  margin-bottom: 20px;
  position: relative;
}
.loe {
  height: 36px;
}
.errInput{
  input{
    border-color: #f56c6c;
  }
}
.bottom-prompt {
  margin-top: 15px;
  font-size: 14px;
  span {
    color: #409eff;
    cursor: pointer;
  }
}
.registerProgress-content {
  h2 {
    margin-top: 60px;
    text-align: center;
    color: #333333;
  }
  .el-stop {
    width: 900px;
    height: 54px;
    margin: 0px auto;
    margin-top: 166px;
    .is-finish {
      color: #1ab394;
    }
  }
  .prompt {
    color: #333333;
    font-size: 12px;
    text-align: center;
    line-height: 20px;
    width: 400px;
    margin: 0px auto;
    margin-top: 24px;
    span {
      color: #409eff;
    }
  }
  .bottom-box{
    text-align: center;
    margin-top: 80px;
  }
}


</style>
