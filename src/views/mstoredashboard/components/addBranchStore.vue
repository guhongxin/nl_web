<template>
  <el-dialog
    title="添加分店"
    :visible.sync="dialogVisible"
    :width="widthSize"
    class="customizeDetailsDialog addBranchStore"
    :beforeClose='dialogClosed'
    append-to-body>
    <el-form :model="loginForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="登录账号" prop="account_id">
        <el-input name="account_id" type="text" 
          v-model="loginForm.account_id" autoComplete="on" placeholder="请填写登录账号" />
      </el-form-item>
      <el-form-item label="登录密码" prop="password">
        <el-input name="password" type="password" v-model="loginForm.password" autoComplete="on" placeholder="请填写登录密码" />
      </el-form-item>
    </el-form>
    <p class="register-box">还没有分店账号?<span @click="goRegister">马上注册</span></p>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogClosed">取 消</el-button>
      <el-button type="primary" @click="addBStoreBtn" :loading="btnloading">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
const account_id_validator = (rule, value, callback) => {
  if (!value || value.length === 0) {
    callback(new Error('登录账号不能为空'))
  } else if (!/^[a-zA-Z]\w+$/.test(value)) {
    callback(new Error('登录账户首字母必须为英文，且不允许特殊符号!'))
  } else if ((/[\u4E00-\u9FFF]+/g).test(value)) {
    callback(new Error('登录账户不能包含中文!'))
  } else if (!/^.{6,20}$/.test(value)) {
    callback(new Error('账号 必须介于 6 - 20 个字符之间!'))
  } else {
    callback()
  }
}
const password_validator = (rule, value, callback) => {
  if (!value || value.length === 0) {
    callback(new Error('登录密码不能为空'))
  } else if (value.length < 8) {
    callback(new Error('登录密码长度不能少于8位!'))
  } else {
    callback()
  }
}
export default {
  name: 'addBranchStore',
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
        return '50%'
      }
    }
  },
  data() {
    return {
      loginForm: {},
      rules: {
        account_id: [{ required: true, trigger: 'blur', validator: account_id_validator }],
        password: [{ required: true, trigger: 'blur', validator: password_validator }]
      },
      btnloading: false
    }
  },
  methods: {
    dialogClosed() {
      this.$emit('dialogClosed')
    },
    addBStoreBtn() {
      console.log('loginForm', this.loginForm)
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.btnloading = true
          this.$store.dispatch('add_manage_gyms', this.loginForm).then(res => {
            if (res.success) {
              this.$message({
                type: 'success',
                message: '添加分店成功'
              })
              // 重新拉取场馆列表
              this.$store.dispatch('get_manage_gyms')
              this.btnloading = false
              this.$emit('addBStoreBtn')
            }
          }).catch(err => {
            console.log(err)
            this.btnloading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    goRegister() {
      this.$store.dispatch('LogOut').then(() => {
        this.$router.push({ path: '/register' })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
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
.demo-ruleForm{
  padding: 20px 15px 0px;
}
.register-box{
  text-align: right;
  padding: 10px 20px;
  span{
    cursor: pointer;
    margin-left: 10px;
    color: #409EFF;
  }
}
</style>
