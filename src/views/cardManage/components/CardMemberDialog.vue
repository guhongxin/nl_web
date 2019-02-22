<template>
 <el-dialog
    title="成员列表"
    v-if="dialogVisible"
    :visible.sync="dialogVisible"
    :width="widthSize"
    class="CardMemberDialog customizeDetailsDialog"
    :beforeClose='dialogClosed'
  > 
    <div class="table-box">
      <el-table
        :data="memberList"
        border
        style="width: 100%"
        stripe 
        :key='tableKey'
        class="check-table" v-loading="listLoading"
        element-loading-text="列表正在加载中" fit highlight-current-row>
        <el-table-column prop="memberType" label="类型" width="150" align="center">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{scope.row.is_owner?'卡主':'成员'}}</span>
          </template>
        </el-table-column>
        <el-table-column width="110px" align="center" :label="'头像'" style="display:flex;justify-content: center;padding-left:0px;padding-right:0px;">
          <template slot-scope="scope">
            <span style="display: inline-block;">
              <img @click="common.bigImg($event)" :src="scope.row.head_portrait?scope.row.head_portrait:defaulthead" alt="icon" width="30" height="30" style="display: list-item;border-radius:50%;">
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="姓名" width="120" align="center">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="sex" label="性别" width="120" align="center">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{getSexzh(scope.row.sex)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="手机号码" width="150" align="center">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{scope.row.phone}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="brth" label="生日" width="120" align="center">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{scope.row.birthday}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="zip" label="证件" width="180" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.id_card_no}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" width="200" align="center">
          <template slot-scope="scope">
            <span :title="scope.row.remark">{{scope.row.remark? common.substring(scope.row.remark, 16):'-'}}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="200" align="center">
          <template slot-scope="scope">
            <template v-if="!scope.row.is_owner">
              <el-button @click="handleClick(scope.row)" type="primary" size="small" plain>编辑</el-button>
              <el-button type="danger" size="small" @click="deleteMember(scope.row)" plain>删除</el-button>
            </template>
            <span v-else>-</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="margin-top:15px;overflow: hidden;">
      <el-button class="lf staffAdd" @click="addMemberBtn"><i class="el-icon-plus"></i>添加成员</el-button>
    </div>
    <div class="member-infor-from" v-if="memberInforFrom">
      <el-form :model="memberInfor" status-icon :rules="rules1" 
        ref="memberInforForm" label-width="55px" class="demo-ruleForm" label-position="left">
        <el-row :gutter="20">
          <el-col :span="6">
             <el-form-item label="姓名:" prop="name">
              <el-input type="text" v-model="memberInfor.name"></el-input>
            </el-form-item>
            <el-form-item label="性别:" prop="sex">
              <el-select v-model="memberInfor.sex" style="width:100%" >
                <!-- <el-option label="未知" value="0"></el-option> -->
                <el-option label="男" value="1"></el-option>
                <el-option label="女" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <div class="skryxi-image">
              <b class="avatar-title" style="color:#606266">
                <!-- <span style="color: #f56c6c">* </span> -->
                头像：
              </b>
              <more-img 
                class="img-box"
                :boxWidth="100" :boxHeight="100" @imgUrl="getheadimgurl" :imgWidth='220' 
                :imgHeight='220' @clearimgurl="clearheadimgurl" ref="imgbox"></more-img>
            </div>
          </el-col>
          <el-col :span="6">
            <el-form-item label="手机:" prop="phone">
              <el-input type="number" v-model="memberInfor.phone"></el-input>
            </el-form-item>
             <el-form-item label="生日:" prop="birthday">
              <el-date-picker type="date" placeholder="选择会员生日" 
                v-model="memberInfor.birthday" 
                style="width: 100%;"
                value-format="yyyy-MM-dd"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="证件:" prop="id_card_no">
              <el-input type="number" v-model="memberInfor.id_card_no" placeholder="请输入会员身份证信息"></el-input>
            </el-form-item>
            <el-form-item label="备注:" prop="remark">
              <el-input type="textarea"
                :rows="1"
                v-model="memberInfor.remark" :maxlength="20"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item class="button-form-item">
          <el-button type="primary" @click="submitForm('ruleForm2')" :loading="btnLoading">{{btnTxt}}</el-button>
        </el-form-item>
      </el-form>
    </div>
     <!-- 删除会员卡 -->
    <delete-dialog 
      :tipMessage="'确认删除选中的成员'"
      ref="deleteDialogDoc"
      @deleteSureBtn='deleteCardSure'></delete-dialog>
  </el-dialog>
</template>
<script>
import MoreImg from '@/components/moreImg'
import { cardMemberList, addcardMember, deletecardMember, modifycardMember } from '@/api/cardMember'
import { validateSfcode } from '@/utils/validate'
import deleteDialog from '@/components/deleteDialog'
export default {
  name: 'cardMemberDialog',
  props: {
    widthSize: {
      type: String,
      default() {
        return '50%'
      }
    }
  },
  data() {
    return {
      memberList: [],
      tableKey: 0,
      listLoading: false,
      memberInforFrom: false,
      memberInfor: {
        sex: '1'
      },
      rules1: {
        name: { required: true, message: '请输入成员姓名', trigger: 'blur' },
        sex: { required: true, message: '请选择性别', trigger: 'change' }
      },
      imageUrl: '',
      btnTxt: '提交',
      dialogVisible: false,
      cardId: 0,
      btnLoading: false,
      deleteId: 0
    }
  },
  methods: {
    dialogClosed() {
      this.resetMemberInfor()
      this.dialogVisible = false
      this.cardId = 0
      this.$emit('dialogClosed')
    },
    resetMemberInfor() {
      // 清空编辑成员信息列表
      this.imageUrl = ''
      this.memberInfor = {
        sex: '1'
      }
      this.memberInforFrom = false
      this.$nextTick(() => {
        if (this.$refs.imgbox) {
          this.$refs.imgbox.deleteimgbtn()
        }
      })
    },
    addMemberBtn() {
      this.memberInforFrom = true
      this.btnTxt = '提交'
      this.memberInfor = {
        sex: '1'
      }
      this.$nextTick(() => {
        this.$refs.imgbox.deleteimgbtn()
      })
    },
    submitForm() {
      if (this.memberInfor.phone) {
        // 如果电话号码不为空就校验电话号码
        if (!/^1[0-9]{10}$/.test(this.memberInfor.phone)) {
          this.$message({
            type: 'warning',
            message: '电话号码输入错误，请重新再输入电话号码'
          })
          return false
        }
      }
      if (this.memberInfor.id_card_no) {
        // 如果身份证不为空，就校验身份证信息
        if (!validateSfcode(this.memberInfor.id_card_no)) {
          this.$message({
            type: 'warning',
            message: '身份证输入错误，请重新身份证信息'
          })
          return false
        }
      }
      this.$refs.memberInforForm.validate((valid) => {
        if (valid) {
          this.btnLoading = true
          let obj = Object.assign({}, this.memberInfor, { head_portrait: this.imageUrl, vip_id: this.cardId })
          if (this.btnTxt === '提交') {
            // 新增
            addcardMember(obj).then(res => {
              this.$message({
                type: 'success',
                message: '新增成员成功'
              })
              this.getcardMemberList({ id: this.cardId })
              this.resetMemberInfor()
              this.btnLoading = false
            }).catch(err => {
              console.log(err)
              this.btnLoading = false
            })
          } else {
            // 编辑
            modifycardMember(obj.id, obj).then(res => {
              this.$message({
                type: 'success',
                message: '修改成员信息成功'
              })
              this.getcardMemberList({ id: this.cardId })
              this.resetMemberInfor()
              this.btnLoading = false
            }).catch(err => {
              console.log(err)
              this.btnLoading = false
            })
          }
        } else {
          return false
        }
      })
    },
    getheadimgurl(param) {
      // 图片地址
      this.imageUrl = param
    },
    clearheadimgurl() {
      // 清除图片地址
      this.imageUrl = ''
    },
    handleClick(params) {
      // 编辑成员信息
      if (this.$refs['memberInforForm']) {
        this.$refs['memberInforForm'].resetFields()
      }
      this.memberInforFrom = true
      this.btnTxt = '保存'
      this.memberInfor = {
        id: params.id,
        name: params.name,
        sex: params.sex + '',
        phone: params.phone,
        birthday: params.birthday,
        id_card_no: params.id_card_no,
        remark: params.remark
      }
      this.imageUrl = params.head_portrait
      this.$nextTick(() => {
        if (this.imageUrl) {
          this.$refs.imgbox.setImg(this.imageUrl)
        } else {
          this.$refs.imgbox.deleteimgbtn()
        }
      })
    },
    deleteMember(params) {
      // 删除成员信
      this.deleteId = params.id
      this.$refs.deleteDialogDoc.dialogShow()
    },
    deleteCardSure() {
      // 确认删除
      deletecardMember(this.deleteId).then(res => {
        this.$message({
          type: 'success',
          message: '删除成员成功'
        })
        this.$refs.deleteDialogDoc.dialogClose()
        this.resetMemberInfor()
        this.memberInforFrom = false
        this.btnTxt = '提交'
        this.getcardMemberList({ id: this.cardId })
      }).catch(err => {
        this.common.message('error', err.data.message)
        this.$refs.deleteDialogDoc.dialogLoadingClose()
      })
    },
    openModel(param, flag) {
      this.dialogVisible = true
      this.getcardMemberList(param)
    },
    getcardMemberList(param) {
      // 获取成员列表
      let obj = {
        page: 1,
        per_page: 10
      }
      this.cardId = param.id
      this.listLoading = true
      cardMemberList(this.cardId, obj).then(res => {
        this.listLoading = false
        let data = res.data
        this.memberList = data
      }).catch(err => {
        console.log(err)
        this.listLoading = false
      })
    },
    getSexzh(sex) {
      let result = ''
      switch (sex) {
        case 1:
          result = '男'
          break
        case 2:
          result = '女'
          break
        default:
          result = '-'
      }
      return result
    }
  },
  components: {
    MoreImg,
    deleteDialog
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
    overflow: hidden;
  }
}
.CardMemberDialog {
  overflow: hidden;
  .staffAdd{
    background: rgb(51, 51, 51);
    color: #fff;
  }
  .member-infor-from{
    border-top: 1px solid #cccccc;
    padding-top: 10px;
    padding-bottom: 10px;
    margin-top: 15px;
    .img-box{
      display: inline-block;
      vertical-align: text-top;
    }
    .button-form-item{
      text-align: center;
      margin-left: 0px;
    }
  }
}
.table-box{
  width: 100%;
  max-height: 300px;
  overflow: hidden;
  overflow-y: auto;
}
</style>

