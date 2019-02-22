<template>
   <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      :width="widthSize"
      class="customizeDetailsDialog"
      :beforeClose='dialogClosed'
    >
      <div class="dialog-body">
        <div class="dialog-content1">
          <el-row :gutter="20">
            <el-col :span="14">
              <el-form :model="customerInforForm" :rules="customerInforRules" 
                ref="customerInforForm" 
                class="demo-customerInforForm"
                label-width="60px">
                <el-form-item label="姓名" prop="name">
                  <el-input v-model="customerInforForm.name" :maxlength="20"></el-input>
                </el-form-item>
                <el-form-item label="性别" prop="sex">
                  <el-select v-model="customerInforForm.sex" placeholder="请选择性别" style="width:100%;">
                    <el-option label="男" :value="1"></el-option>
                    <el-option label="女" :value="2"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="生日"  prop="birthday">
                  <el-date-picker type="date" placeholder="选择日期" v-model="customerInforForm.birthday" style="width:100%;"></el-date-picker>
                </el-form-item>
                <el-form-item label="电话" prop="phone">
                  <span class="por">
                    <el-input v-model="customerInforForm.phone"></el-input>
                    <span class="poa">{{isRegister}}</span>
                  </span>
                </el-form-item>
                <el-form-item label="身份证" prop="id_card_no">
                  <el-input v-model="customerInforForm.id_card_no"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                  <el-input type="textarea" v-model="customerInforForm.remark" :autosize="{ minRows: 4, maxRows: 8}" :maxlength="500"></el-input>
                </el-form-item>
              </el-form>
            </el-col>
            <el-col :span="10">
              <label style="vertical-align: top;margin-right:10px">头像</label>
              <picture-img style="display: inline-block;"
                ref="imgbox"
                @imgUrl="getheadimgurl" 
                @clearimgurl="clearheadimgurl" ></picture-img>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="dialog-content2">
        <el-row :gutter="20">
          <el-col :span="8">
            <label>来源渠道</label>
            <el-select v-model="channel" placeholder="来源渠道" style="diplay:inline-block;width:116px;">
              <el-option
                v-for="item in options1"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="8">
            <label>所属会籍</label>
            <el-select v-model="consultant" placeholder="所属会籍" style="diplay:inline-block;width:116px;">
              <el-option
                v-for="item in consultantList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="8">
            <label>
              <label>健身目的</label>
              <el-select v-model="purpose" placeholder="健身目的" style="diplay:inline-block;width:116px;">
                <el-option
                  v-for="item in options2"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </label>
          </el-col>
        </el-row>
         <el-row :gutter="20" style="margin-top:10px;">
          <el-col :span="8">
            <label>意向程度</label>
            <el-select v-model="intent_level" placeholder="意向程度" style="diplay:inline-block;width:116px;">
              <el-option
                v-for="item in options3"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="8">
            <label>所属教练</label>
            <el-select v-model="coach_id" placeholder="所属教练" style="diplay:inline-block;width:116px;">
              <el-option
                v-for="item in coachList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-col>
        </el-row>
      </div>
      <!-- <div class="liubai"></div> -->
      <div class="dialog-bottom">
        <el-button type="info" style="margin-left:0px;background-color: rgb(51, 51, 51);color:#ffffff;" @click="popupsBtnOk" :loading="btnLoading">确定</el-button>
      </div>
    </el-dialog>
</template>
<script>
import PictureImg from '@/components/pictureImg'
import { timeFormat } from '@/utils/comm'
import { phoneVerification, getEmployeeSelectVule } from '@/utils/comm'
import { modifyCustomer } from '@/api/customerGl'
export default {
  name: 'editCustomerPopups',
  props: {
    dialogVisible: {
      type: Boolean,
      default() {
        return false
      }
    },
    title: {
      type: String
    },
    widthSize: {
      type: String,
      default() {
        return '25%'
      }
    },
    selectList: {
      type: Array
    },
    coachData: {
      type: Array
    },
    salesData: {
      type: Array
    }
  },
  data() {
    return {
      isRegister: '',
      customerInforForm: {},
      customerInforRules: {
        phone: [{
          validator: phoneVerification, trigger: 'blur'
        }, {
          required: true, message: '请输入电话号码', trigger: 'blur'
        }]
      },
      channel: '',
      options1: [{
        label: '无',
        value: 0
      }, {
        label: '电话收集',
        value: 1
      }, {
        label: '拉人到店',
        value: 2
      }, {
        label: '自然访问',
        value: 3
      }, {
        label: '客户推荐',
        value: 4
      }, {
        label: '朋友介绍',
        value: 5
      }, {
        label: 'APP',
        value: 6
      }, {
        label: '内购',
        value: 7
      }, {
        label: '宣传单',
        value: 8
      }, {
        label: '网络推广',
        value: 9
      }, {
        label: '团购',
        value: 10
      }, {
        label: '杂志期刊',
        value: 11
      }, {
        label: '新闻媒体',
        value: 12
      }, {
        label: '户外广告',
        value: 13
      }, {
        label: '其它',
        value: 14
      }],
      consultant: '',
      purpose: '',
      options2: [{
        label: '减脂',
        value: 0
      }, {
        label: '增肌',
        value: 1
      }, {
        label: '塑形',
        value: 2
      }],
      intent_level: '',
      options3: [{
        label: '不明',
        value: 0
      }, {
        label: '强烈',
        value: 1
      }, {
        label: '一般',
        value: 2
      }],
      coach_id: '',
      imageUrl: '',
      btnLoading: false
    }
  },
  created() {},
  methods: {
    dialogClosed() {
      this.$emit('popupsClosed')
    },
    popupsBtnOk() {
      if (this.customerInforForm.phone === '') {
        this.common.message('warning', '电话号码不能为空')
        return false
      } else if (!(/^1[0-9]{10}$/.test(this.customerInforForm.phone))) {
        this.common.message('warning', '请输入正确的电话号码')
        return false
      }
      if (this.customerInforForm.id_card_no) {
        if (!this.common.isCardNo(this.customerInforForm.id_card_no)) {
          this.common.message('warning', '身份证号码填写错误')
          return false
        }
      }
      let obj = {
        id: this.customerInforForm.id,
        name: this.customerInforForm.name,
        sex: this.customerInforForm.sex,
        phone: this.customerInforForm.phone,
        id_card_no: this.customerInforForm.id_card_no ? this.customerInforForm.id_card_no : '',
        remark: this.customerInforForm.remark,
        channel: this.channel,
        consultant_id: this.consultant ? this.consultant : 0,
        purpose: this.purpose,
        intent_level: this.intent_level,
        coach_id: this.coach_id ? this.coach_id : 0,
        head_portrait: this.imageUrl,
        birthday: this.customerInforForm.birthday ? timeFormat(this.customerInforForm.birthday) : null
      }
      this.btnLoading = true
      modifyCustomer(obj).then(res => {
        if (res) {
          this.common.message('success', '编辑信息成功')
          this.$emit('EditCustomerPopupsBtnOk', obj)
        }
        this.btnLoading = false
      }).catch(err => {
        console.log(err)
        this.btnLoading = false
      })
    },
    setDefaultVule(param) {
      if (param.is_register_app) {
        this.isRegister = '已注册'
      } else {
        this.isRegister = '未注册'
      }
      this.customerInforForm = {
        id: param.id,
        name: param.name,
        sex: param.sex,
        birthday: param.birthday,
        id_card_no: param.id_card_no ? param.id_card_no : '',
        remark: param.remark,
        phone: param.phone
      }
      this.channel = param.channel
      // 会籍
      this.consultant = param.consultant_id ? getEmployeeSelectVule(this.consultantList, param.consultant_id) : undefined
      this.purpose = param.purpose
      this.intent_level = param.intent_level
      // 教练
      this.coach_id = param.coach_id ? getEmployeeSelectVule(this.coachList, param.coach_id) : undefined
      this.imageUrl = param.head_portrait
      this.$nextTick(() => {
        if (!this.imageUrl) return
        this.$refs.imgbox.setImg(param.head_portrait)
      })
    },
    getheadimgurl(param) {
      console.log('上传图片', param)
      this.imageUrl = param
    },
    clearheadimgurl() {
      console.log('清除')
      this.imageUrl = ''
    }
  },
  computed: {
    consultantList() {
      let result = this.salesData.filter(currentValue => {
        return currentValue.status === 1
      })
      return result
    },
    coachList() {
      let result = this.coachData.filter(currentValue => {
        return (currentValue.post === 1) && (currentValue.status === 1)
      })
      return result
    }
  },
  components: {
    PictureImg
  }
}
</script>
<style lang="scss" scoped>
.por {position: relative;}
.poa {position: absolute;
  right: 10px;
  top: -9px;
  color: rgb(241, 76, 48);}
.customizeDetailsDialog {
  /deep/ .el-dialog {
    border-radius: 5px;
  }
  /deep/ .el-dialog__header {
    border: 1px solid #cccccc;
    border-radius: 5px 5px 0px 0px;
  }
  /deep/ .el-dialog__body {
    border-radius: 0px 0px 5px 5px;
    border-top: 1px solid #cccccc;
  }
 
}
.customizeDetailsDialog {
  .dialog-body{
    margin-top: 20px;
    width: 90%;
    margin: 0px auto;
    .dialog-content1 .el-form-item__content{
      display: inline-block;
      width: 100%;
    }
  }
  .dialog-content2{
    width: 95%;
    border-top: 1px solid #cccccc;
    padding-top: 10px;
    margin: 0 auto;
  }
  .dialog-bottom{
    text-align: center;
    margin-top: 20px;
    margin-bottom: 20px;
  }
}

</style>

