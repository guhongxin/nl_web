<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :width="widthSize"
    class="addAccNumb customizeDetailsDialog"
    :beforeClose='dialogClosed'
    append-to-body>
    <el-form :model="loginForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="登录账号" prop="account_id">
        <el-input name="account_id" type="text"
          maxlength="20"
          :disabled="isSuperTube"
          v-model="loginForm.account_id" autoComplete="on" placeholder="请输入您要添加的超管账号" />
      </el-form-item>
      <el-form-item v-if="isEditemsSAdmin">
        <template slot="label">
          <el-checkbox v-model="reset_password"></el-checkbox>
          重置密码
        </template>
        <el-input name="password"
          :type="passwordType" v-model="loginForm.password" autoComplete="on" :disabled="!reset_password"/>
        <span class="show-pwd1" v-if="!reset_password">
          <i class="el-icon-view"></i>
        </span>
        <span v-else class="show-pwd" :class="[passwordType == 'password'?'':'active']" @click="showPwd">
          <i class="el-icon-view"></i>
        </span>
      </el-form-item>
      <el-form-item prop="password" v-else label="登录密码" >
        <el-input name="password"
          :type="passwordType" v-model="loginForm.password" autoComplete="on" placeholder="请输入您要添加的超管密码" />
          <span  class="show-pwd" :class="[passwordType == 'password'?'':'active']" @click="showPwd">
            <i class="el-icon-view"></i>
          </span>
      </el-form-item>
      <el-row :gutter="20">
        <el-col :span="14">
          <el-form-item label="超管名称" prop="name">
            <el-input name="name" type="text" 
              v-model="loginForm.name" autoComplete="on" placeholder="请输入您要添加的超管名称" 
              :disabled="isSuperTube"/>
          </el-form-item>
        </el-col>
        <el-col :span="10" style="text-align: right;">
          <el-form-item label="总店管理" prop="master_manager">
            <el-radio-group v-model="loginForm.master_manager">
              <el-radio border label="否" value="1"></el-radio>
              <el-radio border label="是" value="2"></el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="分店管理" prop="gym_ids">
        <el-checkbox-group v-model="loginForm.gym_ids">
          <el-checkbox  v-for="item in gymsList" 
            :key="item.id" 
            :label="item.name"
            :disabled="isGymdefault?item.id === GymdefaultId :false"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <div class="bottom-box">
      <el-button @click="submitForm('ruleForm')" style="width:150px;background-color:#333333;color:#ffffff" v-if="!isEditemsSAdmin" :loading="btnLoading">确定</el-button>
      <el-button @click="editForm('ruleForm')" style="width:150px;background-color:#333333;color:#ffffff" v-else :loading="btnLoading">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { addmsSAdmin, modifyEmployee } from '@/api/mstoreSuperAdmin'
import { mapGetters } from 'vuex'
const accountVer = (rule, value, callback) => {
  if (!/^[a-zA-Z]\w+$/.test(value)) {
    callback(new Error('账户首字母必须为英文，且不允许特殊符号'))
  } else if (!/^.{6,20}$/.test(this.account_id)) {
    this.common.message('warning', '账号 必须介于 6 - 20 个字符之间')
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
  name: 'addAccNumb',
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
    },
    isEditemsSAdmin: { // 默认为新增管理员
      type: Boolean,
      default() {
        return false
      }
    },
    title: {
      type: String,
      default() {
        return '添加账号'
      }
    }
  },
  data() {
    return {
      loginForm: {
        master_manager: '否',
        gym_ids: []
      },
      rules: {
        account_id: [{
          required: true, message: '请输入登录账号', trigger: 'blur'
        }, {
          validator: accountVer, trigger: 'blur'
        }],
        password: [{
          required: true, message: '请输入超管密码', trigger: 'blur'
        }, {
          validator: password_validator, trigger: 'blur'
        }],
        name: [{ required: true, message: '超管名称', trigger: 'blur' }],
        master_manager: [{ required: true, message: '总店管理', trigger: 'change' }],
        gym_ids: [{ type: 'array', required: true, message: '请至少选择一家分店', trigger: 'change' }]
      },
      btnloading: false,
      isSuperTube: false,
      reset_password: false,
      employeeId: 0,
      btnLoading: false,
      passwordType: 'password',
      isGymdefault: false, // 是否勾选默认的的场馆
      GymdefaultId: 0
    }
  },
  created() {},
  methods: {
    dialogClosed() {
      this.$emit('dialogClosed')
    },
    submitForm(formName) {
      // 新增管理员
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          let _ids = []
          this.loginForm.gym_ids.map(item => {
            let _gym_id = this.gymsList.find(item1 => {
              return item1.name === item
            })
            _ids.push(_gym_id.id)
          })
          let obj = Object.assign({},
            this.loginForm,
            { master_manager: this.loginForm.master_manager === '是' ? 1 : 0 },
            { gym_ids: _ids })
          addmsSAdmin(obj).then(res => {
            this.$message({
              message: '新增管理员成功',
              type: 'success'
            })
            this.btnLoading = false
            this.$emit('btnOK')
          }).catch(err => {
            console.log(err)
            this.btnLoading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    editForm(formName) {
      // 编辑管理员
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.reset_password && !this.loginForm.password) {
            this.$message({
              message: '密码不能为空',
              type: 'warning'
            })
            return false
          }
          this.btnLoading = true
          let _ids = []
          this.loginForm.gym_ids.map(item => {
            let _gym_id = this.gymsList.find(item1 => {
              return item1.name === item
            })
            _ids.push(_gym_id.id)
          })
          let obj = Object.assign({},
            this.loginForm,
            { master_manager: this.loginForm.master_manager === '是' ? 1 : 0 },
            { id: this.employeeId, reset_password: this.reset_password },
            { gym_ids: _ids })
          modifyEmployee(obj).then(res => {
            this.$message({
              message: '编辑管理员成功',
              type: 'success'
            })
            this.btnLoading = false
            this.$emit('btnOK')
          }).catch(err => {
            this.btnLoading = false
            console.log(err)
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getInitVal(param) {
      // 编辑管理员，获取管理员相关信息
      this.isSuperTube = param.type === 4 || param.type === 6
      this.employeeId = param.id
      this.isGymdefault = param.type === 4 || param.type === 6 // 是否设置场馆
      this.GymdefaultId = param.gym_id // 默认场馆gym_id
      let _gym_ids = []
      if (param.gyms) {
        param.gyms.map(item => {
          _gym_ids.push(item.name)
        })
      }
      // 如果是4或者6设置默认场馆为本身
      if (this.isGymdefault) {
        let _gym = this.$store.getters.gymsList.filter(item => {
          return item.id === this.GymdefaultId
        })
        if (_gym_ids.indexOf(_gym[0].name) === -1) {
          _gym_ids.push(_gym[0].name)
        }
      }
      this.loginForm = {
        account_id: param.account.account_id,
        name: this.isSuperTube ? '分店超管不支持修改名称' : param.name,
        master_manager: this.Ismstore(param.type),
        gym_ids: _gym_ids
      }
    },
    Ismstore(param) {
      // 是否是总店
      if (param === 3 || param === 5 || param === 6) {
        return '是'
      }
      return '否'
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = 'text'
      } else {
        this.passwordType = 'password'
      }
    }
  },
  computed: mapGetters({
    gymsList: 'gymsList'
  })
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
.bottom-box{
  text-align: center;
  margin-bottom: 10px;
}
.show-pwd {
    position: absolute;
    right: 10px;
    top: 2px;
    font-size: 16px;
    color: #cccccc;
    cursor: pointer;
    user-select: none;
    &.active {
      color: #000;
    }
  }
.show-pwd1{
  position: absolute;
  right: 10px;
  top: 2px;
  font-size: 16px;
  color: #cccccc;
  user-select: none;
  cursor: not-allowed;
}
</style>

