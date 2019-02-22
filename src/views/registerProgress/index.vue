<template>
  <div class="registerProgress-box" style="min-width: 900px;">
    <div class="logo"></div>
    <div class="bg_top">创建您的SaaS ID</div>
		<div class="registerProgress-content">
			<h2>注册进度</h2>
			<el-steps :active="steps" simple class="el-stop" finish-status="success">
				<el-step title="成功提交信息"></el-step>
				<el-step title="信息审核中"></el-step>
        <el-step title="审核完成" v-if="steps<4"></el-step>
        <el-step title="审核失败" v-if="steps===4" status="error">
          <!-- <i class="el-icon-close" slot="icon"></i> -->
        </el-step>
			</el-steps>
			<p class="prompt" v-if="steps<4">
				您的信息已提交成功，我们将在<span>3个工作日</span>内审核您的信息，请耐心等待，
				审核结果会以短信的形式发送到您的手机上，请注意查收
			</p>
      <p v-else class="prompt">
        <span style="display:block;font-size:18px;margin-bottom:10px;">错误原因：<span style="color:#f56c6c">{{remark}}</span></span>
        很抱歉，您提交的信息未通过审核，可按照审核结果中的提示进行修改，然后重新进行提交，我们会优先进行再次审核
      </p>
		</div>
		<div class="bottom-content">
			<el-button type="info" class='modifyInfor-btn' @click="modifyRegistInfor">修改信息</el-button>
			<p class="bottom-prompt">
				已有账号？<span @click="backLogin">返回登录</span>
			</p>
		</div>
  </div>
</template>
<script>
// import { registerAudit } from '@/api/registProgress'
import { getGymInfor } from '@/api/login'
import { getSession } from '@/utils/auth'
let isInit = false
export default {
  name: 'registerProgress',
  data() {
    return {
      steps: 1,
      accountInfor: [],
      remark: null,
      AdminToken: ''
    }
  },
  beforeRouteEnter(to, from, next) {
    // if (from.path === '/modifyRegister' || from.path === '/') {
    if (from.path === '/modifyRegister') {
      isInit = false
      next({ path: '/login' })
    } else {
      isInit = true
      next()
    }
  },
  created() {
    if (isInit) {
      this.$init()
    }
  },
  methods: {
    backLogin() {
      this.$store.dispatch('FedLogOut').then(() => {
        this.$router.push({ path: '/login' })
      })
    },
    $init() {
      this.AdminToken = getSession('Admin-Token')
      if (!this.AdminToken) {
        this.$alert('登录已失效，请重新通过登录页面重新登录查看注册进度', '提示', {
          confirmButtonText: '确定',
          showClose: false,
          callback: action => {
            this.$router.push({ path: '/login' })
          }
        })
        return false
      }
      this.$getGymInfor()
    },
    modifyRegistInfor() {
      this.$store.dispatch('FedLogOut').then(() => {
        let obj = Object.assign({}, this.accountInfor, { AdminToken: this.AdminToken })
        this.$router.push({ name: 'modifyRegister', params: obj })
      })
    },
    $getGymInfor() {
      getGymInfor(this.AdminToken).then(res => {
        let data = res.data
        this.accountInfor = data
        let _is_check_pass = data.is_check_pass
        if (_is_check_pass === 2) {
          this.steps = 4
        } else if (_is_check_pass === 1) {
          this.steps = 3
        } else if (_is_check_pass === 0) {
          this.steps = 2
        }
        this.remark = data.remark
      }).catch(err => {
        console.log(err)
      })
    }
  },
  destroyed() {
    this.$store.dispatch('FedLogOut').then(() => {
      console.log('退出')
    })
  },
  components: {}
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.el-stop /el-icon-error/ {
  color:  red;
}
.el-icon-close {
  height: 24px;
  width: 35px;
  padding: 0 3px 0 3px;
  line-height: 22px;
  border: 2px solid red;
  border-radius: 50%;
}
.registerProgress-box {
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
      font-size: 14px;
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
  .bottom-content {
    margin-top: 280px;
    text-align: center;
    .modifyInfor-btn {
      width: 150px;
      height: 40px;
      background-color: #333333;
    }
    .bottom-prompt {
      margin-top: 15px;
      font-size: 14px;
      span {
        color: #409eff;
        cursor: pointer;
      }
    }
  }
  .steperr-box{
    .el-step__main .el-step__title.is-success{
      color: #f56c6c;
    }
    .el-step__head.is-success{
      color: #f56c6c;
      border-color: #f56c6c;
    }
    // .el-step__icon-inner:before{
    //   content: ''
    // }
  }
  // .icon {
  //   width: 1em;
  //   height: 1em;
  //   vertical-align: -0.15em;
  //   fill: currentColor;
  //   overflow: hidden;
  //   display: inline-block;
  // }
}
</style>

