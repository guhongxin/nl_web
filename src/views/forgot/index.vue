<template>
  <div class="app-container" style="padding:0px">
    <div class="logo"></div>
    <div class="bg_top">找回您的密码</div>
    <div class="forgot-box">
      <div class="title">找回密码</div>
      <div class="tips">为了保障您的<span class="blue">账号安全</span>，需要对您绑定的手机进行验证。</div>
      <el-form class="forgot-form" autoComplete="on" :model="forgotForm" :rules="loginRules" ref="forgotForm" label-position="left">
      
        <el-form-item prop="username">
          <el-input name="username" type="text" v-model="forgotForm.username" autoComplete="on" placeholder="请填写登录账号" />
        </el-form-item>

        <el-form-item prop="phone">
          <el-input name="phone" type="text" @keyup.enter.native="handleLogin" v-model="forgotForm.phone" autoComplete="on" placeholder="请填写您的手机号码" class="phone" ref="phone"/>
        </el-form-item>
        
        <el-form-item prop="code" class="comfireCode" >
          <el-input name="code" type="text" v-model="forgotForm.code" autoComplete="on" placeholder="请输入验证码" style="width:60%" />
          <el-button class="codeBtn" v-show="sendAuthCode" type="primary" @click="getCode">获取验证码</el-button>
          <el-button class="codeBtn" v-show="!sendAuthCode" :disabled="sendDisabled" type="primary" @click="getCode">{{count}} 秒后重新发送</el-button>
        </el-form-item>

        <el-form-item prop="password">
          <el-input name="password" type="password" v-model="forgotForm.password" autoComplete="on" placeholder="请填写新的登录密码" />
        </el-form-item>

        <el-form-item prop="repassword">
          <el-input name="repassword" type="password" v-model="forgotForm.repassword" autoComplete="on" placeholder="请再次填写新的登录密码" />
        </el-form-item>
        
      </el-form>
      <div class="btn-box">
        <!-- <el-button type="primary" class="back" @click="login">返回登录</el-button> -->
        <el-button type="primary" class="editpwd" :loading="loading" @click.native.prevent="handleForgot">修改密码</el-button>
        <p class="bottom-prompt">已有账号？<span @click="login">返回登录</span></p>
      </div>
    </div>
  </div>
</template>

<script>
import { testphone } from '@/utils/validate'
export default {
  name: 'forgot',
  data() {
    // 用户名验证
    const validateUsername = (rule, value, callback) => {
      if (!value.length) {
        callback(new Error('请输入正确的用户名'))
      } else {
        callback()
      }
    }
    // 手机号码验证
    const validatePhone = (rule, value, callback) => {
      if (!testphone(value)) {
        callback(new Error('请输入正确的手机号码'))
      } else {
        callback()
      }
    }
    // 密码验证
    const validatePassword = (rule, value, callback) => {
      if (value.length < 8) {
        callback(new Error('密码不得少于8位'))
      } else {
        callback()
      }
    }
    // 重复密码验证
    const validaterePassword = (rule, value, callback) => {
      if (value.length < 8) {
        callback(new Error('密码不得少于8位'))
      } else if (this.forgotForm.password !== this.forgotForm.repassword) {
        callback(new Error('两次密码不一致'))
      } else {
        callback()
      }
    }
    return {
      // form表单
      forgotForm: {
        username: '',
        phone: '',
        code: '',
        password: '',
        repassword: ''
      },
      // 表单验证规则
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        phone: [{ required: true, trigger: 'blur', validator: validatePhone }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        repassword: [{ required: true, trigger: 'blur', validator: validaterePassword }]
      },
      sendAuthCode: true,
      sendDisabled: false,
      count: '',
      timer: null,
      loading: false
    }
  },
  created() {
  },
  methods: {
    // 发送手机验证码
    getCode() {
      // 手机号码验证
      if (!testphone(this.forgotForm.phone)) return
      let TIME_COUNT = 59
      let self = this
      this.$store.dispatch('GetCode', this.forgotForm.phone).then((res) => {
        // 验证码倒计时
        if (!self.timer) {
          self.count = TIME_COUNT
          self.timer = setInterval(() => {
            if (self.count > 0 && self.count <= TIME_COUNT) {
              self.sendAuthCode = false
              self.count--
              self.sendDisabled = true
            } else {
              self.sendAuthCode = true
              clearInterval(self.timer)
              self.timer = null
            }
          }, 1000)
        }
        // 提示信息
        this.common.message('success', '验证码已发送，请注意查收')
      }).catch((err) => {
        this.sendAuthCode = true
        console.log(err)
      })
    },
    login() {
      this.$router.push({ path: '/login' })
    },
    // 忘记密码
    handleForgot() {
      this.$refs.forgotForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('ForgotByPassword', this.forgotForm).then((res) => {
            this.loading = false
            this.$alert('密码找回成功，请返回重新登陆！', '密码找回成功', {
              showClose: false,
              confirmButtonText: '确定',
              callback: action => {
                this.$router.push({ path: '/' })
              }
            })
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
  }
}
</script>  

<style rel="stylesheet/scss" lang="scss" scoped>
.logo {
  height: 58px;
  background-image: url(../../assets/logo_img/LOGO.svg);
  background-repeat: no-repeat;
  background-size: 260px;
  background-position: 20px center;
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
.forgot-box {
  width: 400px;
  margin: 60px auto;
  text-align: center;
  .title {
    font-size: 24px;
    color: #333;
    margin-bottom: 40px;
  }
  .tips {
    font-size: 12px;
    margin-bottom: 10px;
    .blue {
      color: #1878E1;
    }
  }
  .btn-box {
    margin-top: 200px;
    .back {
      background: #ddd;
      border: 1px solid #ddd;
    }
    .editpwd {
      width: 150px;
      height: 40px;
      background: #333333;
      color: #FFFFFF;
      letter-spacing: -0.43px;
      border: 1px solid #000;
    }
  }
  .codeBtn {
    width: 140px;
    margin-left: 15px;
  }
}
.forgot-form .el-input{
  width: 100%;
}
.comfireCode{
  text-align: left;
}
.bottom-prompt {
    margin-top: 15px;
    font-size: 14px;
    span {
      color: #409eff;
      cursor: pointer;
    }
  }
</style>
