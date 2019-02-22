<template>
  <div class="login-container">
    <div class="login-contain">
    <el-form class="login-form" autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left">
      <div class="title-container">
        <h3 class="title">
          <img src="../../assets/logo_img/login-logo.svg" alt="">
        </h3>
      </div>
      <el-form-item prop="username">
        <span class="svg-container svg-container_login">
          <svg-icon icon-class="user" />
        </span>
        <el-input name="username" type="text" 
          v-model="loginForm.username" autoComplete="on" placeholder="请填写登录账号" 
          @change="userNameInput"/>
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <i class="fa fa-key fa-fw" />
        </span>
        <el-input name="password" :type="passwordType" @keyup.enter.native="handleLogin" v-model="loginForm.pass" autoComplete="on" placeholder="请填写登录密码" />
        <span class="show-pwd" :class="[passwordType == 'password'?'':'active']" @click="showPwd">
          <i class="el-icon-view"></i>
        </span>
      </el-form-item>

      <el-form-item v-if="venueList.length>1">
        <el-select v-model="loginForm.gym_id" placeholder="请选择场所" style="width:100%;padding-left:34px;" >
          <el-option
            v-for="(item, key) in venueList"
            :key="key"
            :label="item.name" 
            :value="item.id"></el-option>
        </el-select>
      </el-form-item>

      <div class="boxce-f">
        <span class="boxce-left" @click="$router.push({path: '/forgot'})">忘记密码</span>
        <a class="boxce-right" :href="shortUrl" target="_blank">生成桌面快捷方式 </a>
      </div>

      <el-button type="primary" style="width:100%;margin-bottom:30px;background:#000;color:#fff;border:2px solid #000;" :loading="loading" @click.native.prevent="handleLogin">{{$t('login.logIn')}}</el-button>
      <div class="boxce-z">
        <span>还没有账号？</span>
        <span class="boxce-right" @click="register">马上注册</span>
      </div>
      <br>
    </el-form>
    <div class="tipBox">
      <div class="">提示：部分功能无法兼容老版本的IE，建议安装专用浏览器进行使用</div>
      <ul>
        <li>
          <!-- <a target="_blank" href="https://browser.360.cn/ee/">
            <div><img src="../../assets/logo_img/llq1.jpg" /></div>
            <div class="title">360极速浏览器</div>
          </a> -->
        </li>
        <li v-if="plat == 'Win'">
          <a target="_blank" href="https://niulang-v2.oss-cn-beijing.aliyuncs.com/res/ChromeForWIN_58.0.3029.96.exe">
            <div><img src="../../assets/logo_img/llq3.jpg" /></div>
            <div class="title">专用浏览器</div>
          </a>
        </li>
        <li v-if="plat == 'Mac'">
          <a target="_blank" href="https://niulang-v2.oss-cn-beijing.aliyuncs.com/res/ChromeForMAC_58.0.3029.110.dmg">
            <div><img src="../../assets/logo_img/llq3.jpg" /></div>
            <div class="title">专用浏览器</div>
          </a>
        </li>
        <li>
          <!-- <a target="_blank" href="https://ie.sogou.com/">
            <div><img src="../../assets/logo_img/llq2.jpg" /></div>
            <div class="title">搜狗高速浏览器</div>
          </a> -->
        </li>
      </ul>
    </div>
    </div>
    
    <el-dialog :title="$t('login.thirdparty')" :visible.sync="showDialog" append-to-body>
      {{$t('login.thirdpartyTips')}}
      <br/>
      <br/>
      <br/>
      <social-sign />
    </el-dialog>

  </div>
</template>

<script>

import SocialSign from './socialsignin'
import { getVenueList } from '@/api/login'
import { setSession } from '@/utils/auth'
// import { testphone } from '@/utils/validate'
import shajs from 'sha.js'
import bcrypt from 'bcryptjs'
export default {
  components: { SocialSign },
  name: 'login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!value.length) {
        callback(new Error('请输入正确的用户名'))
        return
      }
      if (/^[a-zA-Z]/.test(value)) {
        callback()
      } else {
        if (!/^1[0-9]{10}$/.test(value)) {
          callback(new Error('请输入正确的用户名'))
          // callback(new Error('请输入正确的电话号码'))
        } else {
          callback()
        }
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不得少于6位'))
      } else {
        callback()
      }
    }
    return {
      plat: 'Win',
      shortUrl: process.env.BASE_API + 'v1/gym/short_cut',
      loginForm: {
        username: '',
        pass: '',
        password: '',
        gym_id: undefined
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        pass: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      passwordType: 'password',
      loading: false,
      showDialog: false,
      venueList: []
    }
  },
  methods: {
    getplat() {
      this.plat = this.detectOS()
    },
    detectOS() {
      let isWin = (navigator.platform === 'Win32') || (navigator.platform === 'Windows')
      let isMac = (navigator.platform === 'Mac68K') || (navigator.platform === 'MacPPC') || (navigator.platform === 'Macintosh') || (navigator.platform === 'MacIntel')
      if (isMac) return 'Mac'
      if (isWin) return 'Win'
      return 'other'
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
    },
    register() {
      this.$router.push({ path: '/register' })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          if (this.loginForm.gym_id) {
            this.loginForm.password = this.emplooypwd(this.loginForm.username, this.loginForm.pass)
          } else {
            this.loginForm.password = this.loginForm.pass
          }
          this.loading = true
          this.$store.dispatch('LoginByUsername', this.loginForm).then((res) => {
            this.loading = false
            let data = res.account
            if (data.gym) {
              setSession('IS_CHECK_PASS', data.gym.is_check_pass)
              if (data.gym.is_check_pass === 1) {
                if (/^1[0-9]{10}$/.test(this.loginForm.username)) {
                  setSession('employeeLogin', 1)
                } else {
                  setSession('employeeLogin', 0)
                }
                this.$router.push({ path: '/' })
              } else if (data.gym.is_check_pass === 2) {
                // 认证不通过
                this.$router.push({ name: 'registerProgress', params: data })
              } else {
                // 等待认证
                this.$router.push({ name: 'registerProgress', params: data })
              }
            } else {
              setSession('IS_CHECK_PASS', 1)
              this.$router.push({ path: '/' })
            }
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('表单输入错误')
          return false
        }
      })
    },
    userNameInput(param) {
      if (param.length === 0) return
      if (/^[a-zA-Z]/.test(param)) {
        this.loginForm.gym_id = undefined
        this.venueList = []
        return
      }
      if (/^1[0-9]{10}$/.test(param)) {
        getVenueList(param).then(res => {
          this.venueList = res.data
          this.loginForm.gym_id = this.venueList[0].id
          /* if (res.data.length === 1) {
            this.loginForm.gym_id = this.venueList[0].id
          } */
        }).catch(err => {
          console.log(err)
        })
      } else {
        this.loginForm.gym_id = undefined
        this.venueList = []
      }
    },
    emplooypwd(account, pwd) {
      let string1 = shajs('sha512').update(pwd).digest('hex')
      let string2 = shajs('sha256').update(account).digest('hex')
      let string3 = string1 + string2
      let salt = '$2a$10$pWvbRc6R.x7nzT4GJVmUDO'
      let string4 = bcrypt.hashSync(string3, salt)
      let string5 = string4 + account + 'niulanger'
      let Stringfinal = shajs('sha1').update(string5).digest('hex')
      return Stringfinal
    },
    afterQRScan() {
      // const hash = window.location.hash.slice(1)
      // const hashObj = getQueryObject(hash)
      // const originUrl = window.location.origin
      // history.replaceState({}, '', originUrl)
      // const codeMap = {
      //   wechat: 'code',
      //   tencent: 'code'
      // }
      // const codeName = hashObj[codeMap[this.auth_type]]
      // if (!codeName) {
      //   alert('第三方登录失败')
      // } else {
      //   this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
      //     this.$router.push({ path: '/' })
      //   })
      // }
    }
  },
  created() {
    this.getplat()
  },
  destroyed() {
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
$bg:#2d3a4b;
$light_gray:#eee;

/* reset element-ui css */
.boxce {
  width: 100%;
  overflow: hidden;
  .boxce-left {
    float: left;
    color: #999;
    cursor: pointer;
  }
  .boxce-left:hover{
    color: #eee;
  }
  .boxce-right {
    float: right;
    color: #1878E1;
    cursor: pointer;
  }
}
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 80%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: #333;
      height: 47px;
      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: #fff !important;
      }
    }
  }
  .el-form-item {
    border: 1px solid #ddd;
    // background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #333;
    .el-select--medium{
      width: 100%;
      .el-input{
        width: 100%;
      }
    }
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$dark_gray:#889aa4;
$light_gray:#eee;
input:-webkit-autofill , textarea:-webkit-autofill, select:-webkit-autofill {
	-webkit-text-fill-color: #ededed !important;
	-webkit-box-shadow: 0 0 0px 1000px transparent  inset !important;
    background-color:transparent;
    background-image: none;
     transition: background-color 50000s ease-in-out 0s; //背景色透明  生效时长  过渡效果  启用时延迟的时间
}
input {
	 background-color:transparent;
}
.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background-image: url('../../assets/login_bgimg/bg.jpg');
  background-size: 100% 100%;
  .login-contain {
    position: absolute;
    left: 0;
    top: 50%;
    right: 0;
    width: 520px;
    margin: 0px auto;
    margin-top: -218px;
    // padding: 20px 40px;
    .login-form {
      width: 436px;
      margin: 0px auto;
      background: #fff;
      padding: 20px 40px;
    }
    .tipBox {
      width: 436px;
      margin: 20px auto;
      margin-top: 30px;
      color: #cacaca;
      font-size: 13px;
      ul {
        list-style: none;
        margin-top: 20px;
        padding: 0;
        overflow: hidden;
        li {
          // float: left;
          width: 30%;
          margin: 0 auto;
          text-align: center;
          font-size: 12px;
          color: #1878E1;
          div.title {
            margin-top:10px;
          }
          img {
            width: 46px;
            height: 46px;
          }
        }
      }
    }
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
    &_login {
      font-size: 20px;
    }
  }
  .title-container {
    position: relative;
    h3 {
      text-align: center;
      margin-bottom: 20px;
      img {
        width: 120px;
      }
    }
    .set-language {
      color: #fff;
      position: absolute;
      top: 5px;
      right: 0px;
    }
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 6px;
    font-size: 16px;
    color: #cccccc;
    cursor: pointer;
    user-select: none;
    &.active {
      color: #000;
    }
  }
  .thirdparty-button {
    position: absolute;
    right: 35px;
    bottom: 28px;
  }
  .boxce-f {
    width: 100%;
    margin-bottom: 30px;
    overflow: hidden;
    font-size: 14px;
    .boxce-left {
      float: right;
      color: #333;
      cursor: pointer;
    }
    .boxce-left:hover{
      color: #cccccc;
    }
  }
  .boxce-z {
   text-align: center;
   font-size: 14px;
    .boxce-right {
      color: #1878E1;
      cursor: pointer;
    }
  }
}
.login-form /deep/ {
  input:-webkit-autofill , textarea:-webkit-autofill, select:-webkit-autofill {
	-webkit-text-fill-color: #333 !important;
	-webkit-box-shadow: 0 0 0px 1000px #fff  inset !important;
    background-color:#fff;
    background-image: none;
    transition: background-color 50000s ease-in-out 0s; //背景色透明  生效时长  过渡效果  启用时延迟的时间
  }
  input {
    background-color:#fff;
    color: #333;
  }
}

</style>
