<template>
  <div class="registerProgress-box" style="min-width: 900px;">
    <div class="logo"></div>
    <div class="bg_top"></div>
    <h2>审核完成</h2>
    <el-steps :active="steps" simple class="el-stop" finish-status="success">
      <el-step title="成功提交信息"></el-step>
      <el-step title="信息审核中"></el-step>
      <el-step title="审核通过"></el-step>
    </el-steps>
    <div class="registerProgress-content">
      <h2>恭喜您,您提交的信息已通过审核,可点击下方<span @click="enterSystem">"进入系统"</span>按钮开始使用牛啦管理系统</h2>
    </div>
		<div class="bottom-content">
			<el-button type="info" class='modifyInfor-btn' @click="enterSystem">进入系统</el-button>
			<p class="bottom-prompt">
				已有账号？<span @click="backLogin">返回登录</span>
			</p>
		</div>
  </div>
</template>
<script>
import { setSession } from '@/utils/auth'
export default {
  name: 'oneEnterPage',
  data() {
    return {
      steps: 3
    }
  },
  methods: {
    backLogin() {
      this.$store.dispatch('FedLogOut').then(() => {
        this.$router.push({ path: '/login' })
      })
    },
    enterSystem() {
      let obj = {
        username: this.$store.getters.userName,
        password: this.$store.getters.userPassword,
      }
      this.$store.dispatch('LoginByUsername', obj).then((res) => {
        let data = res.account
        setSession('IS_CHECK_PASS', data.gym.is_check_pass)
        if (data.gym.is_check_pass === 1) {
          this.$router.push({ path: '/' })
        }
      }).catch((err) => {
        console.log(err)
      })
    }
  },
  destroyed() {}
}
</script>
<style rel="stylesheet/scss" lang="scss" >
.registerProgress-box /deep/ {
  h2 {
    text-align: center;
    margin-top: 50px;
  }
  .el-stop {
    width: 900px;
    height: 54px;
    margin: 0px auto;
    margin-top: 140px;
    .is-finish {
      color: #1ab394;
    }
  }
  .el-steps--simple {
    background: #fff;
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
  .registerProgress-content {
    margin-top: 30px;
    h2 {
      margin-top: 60px;
      text-align: center;
      color: #333333;
      font-size: 14px;
      font-weight: normal;
      span {
        color: #409eff;
        cursor: pointer;
      }
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
  .icon {
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
  }
}
</style>
