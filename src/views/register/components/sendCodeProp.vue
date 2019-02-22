<template>
  <el-dialog
    title="发送验证码"
    :visible.sync="dialogVisible"
    :width="widthSize" 
    :beforeClose='dialogClosed'
    class="customizeDetailsDialog sendCodeProp">
    <!-- 法人电话 -->
    <el-input v-model="phone" readonly="true" disabled></el-input>
    <div>&nbsp;</div>
    <el-input placeholder="请填写验证码" class="opencard-select"  v-model="code" 
      oninput="if(value.length > 4)value = value.slice(0, 4)" 
      @blur="inputCheckCode"
      type="number">
      <el-button slot="append" type="info"  @click.native="sendCode" :disabled="sendcodebtn">{{sendtext}}</el-button>
    </el-input>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClosed">取 消</el-button>
      <el-button type="primary" class="blackSure" @click="blackSure">确认</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { creatnoticeDom } from '@/utils/comm'
import { sendPhoneCodeCheck } from '@/api/registProgress'
// import { setSession } from '@/utils/auth'
export default {
  name: 'sendCodeProp',
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
        return '320px'
      }
    },
    phone: {
      type: String
    }
  },
  data() {
    return {
      sendtext: '发送验证码',
      sendcodebtn: false,
      code: ''
    }
  },
  methods: {
    dialogClosed() {
      this.$emit('dialogClosed')
    },
    sendCode() {
      this.sendcodebtn = true
      let time = 59
      this.$store.dispatch('SendCode', this.phone).then((res) => {
        this.common.message('success', '验证码已发送，请注意查收')
        let timecode = setInterval(() => {
          if (time === 0) {
            this.sendtext = '发送验证码'
            this.sendcodebtn = false
            clearInterval(timecode)
          } else {
            this.sendtext = `还剩${time--}秒`
            this.sendcodebtn = true
          }
        }, 1000)
      }).catch(() => {
        this.sendcodebtn = false
      })
      console.log('发送验证码')
    },
    inputCheckCode(e) {
      // 验证码长度验证
      let doc = e.target
      let _val = doc.value
      creatnoticeDom(doc, _val.length === 4, '请输入4位正确的验证码')
    },
    blackSure() {
      let obj = {
        phone: this.phone,
        code: this.code,
        scene: 1
      }
      sendPhoneCodeCheck(obj).then(res => {
        let data = res.data
        // setSession('Phone-Token', data.token)
        let param = {
          token: data.token,
          expired_date: data.expired.date
        }
        this.$emit('sentSuccess', param)
        this.dialogClosed()
      }).catch((err) => {
        console.log('err', err)
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped >
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
}
</style>


