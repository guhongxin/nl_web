<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :width="widthSize" 
    :beforeClose='dialogClosed'
    class="customizeDetailsDialog recycleBinDialog">
    <!-- 法人电话 -->
    <!-- <el-form :model="formData" style="margin:30px auto;padding-left:15px;padding-right:60px;" label-width="120px">
      <el-form-item label="法人手机：">
        <el-input v-model="formData.phone" readonly="true" disabled></el-input>
        <p class="prompt">提示:执行该操作将<span>彻底删除</span>会员卡信息，需验证法人手机号码</p>
      </el-form-item>
      <el-form-item label="验证码：">
        <el-input placeholder="请填写验证码" class="opencard-select"  v-model="code" type="number" style="display:inline-block;width:58%">
        </el-input>
        <el-button type="primary"  @click.native="sendCode" :disabled="sendcodebtn">{{sendtext}}</el-button>
      </el-form-item>
    </el-form> -->
    <div style="margin-top:20px;text-align: center;margin-bottom:10px;">
      <el-button @click="blackSure" style="margin-left:0px;background-color: rgb(51, 51, 51);color:#ffffff;">确认删除</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { setSession } from '@/utils/auth'
export default {
  name: 'recycleBinDialog',
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
        return '500px'
      }
    },
    title: {
      type: String,
      default() {
        return '硬删除'
      }
    }
  },
  data() {
    return {
      sendtext: '发送验证码',
      sendcodebtn: false,
      code: '',
      formData: {}
    }
  },
  created() {
    this.formData.phone = setSession('SET_LEGAL_PERSON_PHONE')
  },
  methods: {
    dialogClosed() {
      this.$emit('dialogClosed')
    },
    sendCode() {
      console.log('发送验证码')
    },
    blackSure() {
      this.$emit('recycleBinBtnOk')
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
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
  .prompt {
    margin-top: 5px;
    font-size: 10px;
    line-height: 22px;
    color: #999999;
    span{
      color: red;
    }
  }
}
</style>


