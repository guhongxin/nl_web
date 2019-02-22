<template>
  <el-dialog
      title="编辑会员卡"
      :visible.sync="dialogVisible"
      :width="widthSize"
      class="editCardDialog customizeDetailsDialog"
      :beforeClose="dialogClosed"
      append-to-body>
      <div class="dialog-body" style="width:100%;">
        <!-- <vip-card-style :vipCardData="vipCardData" 
          :isSecondCard="istimesCard"
          :isEditorCardBg="true"
          @editorCardBtn="editorCardBtn"
          ref="VipCardTemplate"
          style="width:90%;margin:0px auto;"
          ></vip-card-style> -->
        <vip-card-style :vipCardData="vipCardData" 
          :isSecondCard="istimesCard"
          ref="VipCardTemplate"
          :isEditorCardBg="true"
          @editorCardBtn="editorCardBtn"
          style="width:90%;margin:0px auto;"></vip-card-style>
        <div class="dialog-body-two" style="padding-top:30px;">
          <el-form :model="editVipCardForm"  ref="editVipCardForm"  
            :rules="editVipCardRules"
            class="editVipCardForm cardForm">
            <el-form-item label="会员卡号" prop="card_no" label-width="80px">
              <el-input v-model="editVipCardForm.card_no" style="width:73%;margin-right:16px;"></el-input>
              <el-button type="primary" @click="creatCardNo">生成</el-button>
            </el-form-item>
            <div class="vipCard-Yxq">提示：如果您的俱乐部使用的是实体芯片卡，可以点击上方输入框，通过读卡器刷卡来录入磁卡ID</div>
            <el-form-item label="卡种名称" placeholder="请填写卡种名称"  prop="card_name" label-width="80px">
              <el-input v-model="editVipCardForm.card_name" type="text"></el-input>
            </el-form-item>
            <el-form-item label="卡种封面" prop="cardImg" v-if="isEditCardImage" label-width="80px">
              <div>
                <el-select placeholder="请选择卡种封面" v-model="editVipCardForm.cardImg" @change="selectCard">
                  <el-option :label="item.label" :value="item.value" :key="item.value" v-for="item in selectOption"></el-option>
                </el-select>
                <div class="cardDiv" v-if="cardImgMb"><img :src="editVipCardForm.photo" width="100%" height="100%"></div>
                <more-img v-if="!cardImgMb" ref="imgbox" :boxWidth="377" :boxHeight="112" :imgWidth="710" :imgHeight="284" @imgUrl="getImgUrl" @clearimgurl="cimgrul"></more-img>
              </div>
            </el-form-item>
            <el-form-item label="开卡时间" prop="start_date" label-width="80px">
              <el-date-picker
                ref="starttime"
                v-model="editVipCardForm.start_date"
                type="date"
                :editable="false"
                :clearable="false"
                value-format="yyyy-MM-dd"
                placeholder="选择开卡日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="失效时间" prop="end_date" label-width="80px">
              <el-date-picker
                v-model="editVipCardForm.end_date"
                type="date"
                :editable="false"
                :clearable="false"
                :picker-options="lostPickerOptions"
                :disabled="setchecked"
                :style="{width: istimesCard !== 1 ? '70%': '100%'}"
                value-format="yyyy-MM-dd"
                class="typetimes"
                placeholder="选择失效日期">
              </el-date-picker>
              <el-checkbox style="margin-left: 20px;" v-if="istimesCard!==1" v-model="setchecked">永不过期</el-checkbox>
              <div v-if="setchecked" style="font-size: 10px; color: #409EFF;margin-bottom: -20px;">勾选"永不过期"后"失效日期"无效!</div>
            </el-form-item>
            <!-- <el-form-item label="实付金额" placeholder="请填写实付金额"  prop="real_pay" label-width="80px">
              <el-input v-model="editVipCardForm.real_pay" type="number"></el-input>
            </el-form-item> -->
            <!-- <el-form-item label="销售员工" prop="sellerId" label-width="80px">
              <el-select v-model="editVipCardForm.sellerId" placeholder="请选择销售员工">
                <el-option
                  v-for="(item, key) in employeesList"
                  :key="key"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item> -->
            <!-- <el-form-item label="支付方式" prop="paymethod" label-width="80px">
              <el-select v-model="editVipCardForm.paymethod"  placeholder="请选择支付方式工" >
                <el-option label="现金" value="1"></el-option>
                <el-option label="支付宝" value="2"></el-option>
                <el-option label="微信" value="3"></el-option>
                <el-option label="银行卡" value="4"></el-option>
              </el-select>
            </el-form-item> -->
            <!-- <el-form-item label="磁卡ID" prop="magcard_id" label-width="100px">
              <el-input v-model="editVipCardForm.magcard_id" placeholder="请输入磁卡ID" ></el-input>
            </el-form-item> -->
            <el-form-item label="备注" label-width="80px" prop="remark">
              <el-input type="textarea" v-model="editVipCardForm.remark" placeholder="选填" :autosize="{ minRows: 5, maxRows: 10}" :maxlength="100"></el-input>
            </el-form-item>
            <!-- <div class="prompt">
              提示：如果您的俱乐部使用的是实体芯片卡，可以点击上方输入框，通过读卡器刷卡来录入磁卡ID
            </div> -->
            <el-form-item style="text-align: center">
              <el-button @click="editVipCardbtn" :loading="loading" style="margin-left:0px;background-color: rgb(51, 51, 51);color:#ffffff;">确定</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <image-cropper 
        v-bind:width.sync="imgWidth" 
        v-bind:height.sync="imgHeight" 
        :nature="nature" 
        :url="baseUrl" 
        @close='close' 
        @crop-upload-success="cropSuccess" 
        langType="zh"
        :isToken="isToken"
        :token="token"
        :key="imagecropperKey" 
        v-show="imagecropperShow"
        @uploadErro="uploadErro"></image-cropper>
    </el-dialog>
</template>
<script>
import VipCardStyle from '@/components/vipCardStyle'
import { vipCardDetails, neweditVipCardGl } from '@/api/vipcardGl'
import { sfcodeVerification } from '@/utils/comm'
// import { getEmployeeSelectVule } from '@/utils/comm'
import { parseTime } from '@/filters/index'
import ImageCropper from '@/components/ImageCropper'
import moreImg from '@/components/moreImg'
export default {
  name: 'VipCardEditDialog',
  props: {
    widthSize: {
      type: String,
      default() {
        return '200px'
      }
    },
    employeesData: {
      type: Array
    },
    imgWidth: {
      type: Number,
      default: 230
    },
    imgHeight: {
      type: Number,
      default: 110
    },
    nature: {
      type: Boolean,
      default: false
    },
    isToken: {
      type: Boolean,
      default() {
        return false
      }
    },
    baseUrl: {
      type: String,
      default: '/v1/gym/oss_sign_url'
    },
    token: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      loading: false,
      vipCardData: {},
      setchecked: false,
      timesold: '',
      editVipCardRules: {
        card_no: [{ required: true, message: '请输入会员卡号或者点击右侧按钮生成', trigger: 'blur' }],
        // real_pay: [{ required: true, trigger: 'blur', validator: realpayVerification }],
        // sellerId: [{ required: true, message: '请选择员工', trigger: 'change' }],
        // paymethod: [{ required: true, message: '请选择支付方式', trigger: 'change' }],
        cardId: [{ required: true, message: '', trigger: 'blur' }],
        magcard_id: { validator: sfcodeVerification, trigger: 'blur' },
        start_date: [{ required: true, message: '请选择开卡时间', trigger: 'blur' }],
        card_name: [{ required: true, message: '请填写卡种名称', trigger: 'blur' }],
      },
      editVipCardForm: {
        // sellerId: null,
        // paymethod: null,
        // real_pay: null,
        start_date: '',
        end_date: '',
        card_no: '',
        card_name: '',
        cardImg: 1,
        photo: 'https://niulang-v2.oss-cn-beijing.aliyuncs.com/2018-06-13/gym5b208cf355c911528859891.png'
      },
      vipCardDetailsData: {},
      dialogVisible: false,
      istimesCard: 1,
      imagecropperShow: false, // 显示上传图片
      imagecropperKey: 0,
      card_image: undefined, // 卡封面
      isEditCardImage: false, // 是否编辑卡种封面
      selectOption: [{
        label: '模版一',
        value: 1,
        href: 'https://niulang-v2.oss-cn-beijing.aliyuncs.com/2018-06-13/gym5b208cf355c911528859891.png'
      }, {
        label: '模版二',
        value: 2,
        href: 'https://niulang-v2.oss-cn-beijing.aliyuncs.com/2018-06-13/gym5b208d081faa11528859912.png'
      }, {
        label: '模板三',
        value: 3,
        href: 'https://niulang-v2.oss-cn-beijing.aliyuncs.com/2018-06-13/gym5b208d93959101528860051.png'
      }, {
        label: '模板四',
        value: 4,
        href: 'https://niulang-v2.oss-cn-beijing.aliyuncs.com/2018-06-13/gym5b208d9c6342b1528860060.png'
      }, {
        label: '自定义',
        value: 5
      }],
      cardImgMb: true
    }
  },
  methods: {
    dialogClosed() {
      this.$refs['editVipCardForm'].resetFields()
      this.dialogVisible = false
      this.isEditCardImage = false
      this.$set(this.editVipCardForm, 'photo', 'https://niulang-v2.oss-cn-beijing.aliyuncs.com/2018-06-13/gym5b208cf355c911528859891.png')
    },
    editVipCardbtn() {
      if (new Date(this.editVipCardForm.start_date) >= new Date(this.editVipCardForm.end_date)) {
        this.common.message('error', '失效时间不得小于或等于开卡时间！')
        return
      }
      this.$refs['editVipCardForm'].validate((valid) => {
        if (valid) {
          let obj = {
            id: this.vipCardDetailsData.id,
            // sell_id: this.editVipCardForm.sellerId,
            status: this.vipCardDetailsData.status,
            // real_pay: this.editVipCardForm.real_pay,
            // payment_method: Number(this.editVipCardForm.paymethod),
            remark: this.editVipCardForm.remark ? this.editVipCardForm.remark : '',
            start_date: parseTime(new Date(this.editVipCardForm.start_date).getTime(), '{y}-{m}-{d}'),
            end_date: this.editVipCardForm.end_date,
            card_no: this.editVipCardForm.card_no,
            card_name: this.editVipCardForm.card_name
          }
          obj.card_image = this.isEditCardImage ? this.editVipCardForm.photo : this.card_image // 卡封面
          this.loading = true
          neweditVipCardGl(obj).then(res => {
            if (res) {
              this.loading = false
              this.$message({
                message: '编辑信息成功',
                type: 'success'
              })
              this.dialogClosed()
              this.$emit('editVipCardbtn')
            }
          }).catch(err => {
            this.loading = false
            console.log(err)
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    openModel(id, flag) {
      this.dialogVisible = true
      this.getVipDetail(id)
      this.istimesCard = flag
    },
    getVipDetail(param) {
      this.card_image = undefined
      vipCardDetails(param)
        .then(res => {
          let _data = res.data
          this.timer = _data.end_date
          this.vipCardDetailsData = res.data
          this.vipCardData = {
            card_no: _data.card_no,
            status: _data.status,
            real_pay: _data.order ? _data.order.real_total_fee : '-',
            type: _data.type,
            card_name: _data.card_name,
            card_image: _data.card_image,
            start_date: _data.start_date,
            end_date: _data.end_date,
            // has_date: _data.has_date,
            master_id: _data.master_id,
            gym: _data.gym, // 会员卡那个场馆办理的
          }
          this.card_image = _data.card_image // 卡封面
          this.timesold = _data.end_date
          if (this.istimesCard === 2) {
            this.vipCardData.use_times = _data.use_times
            this.vipCardData.total_times = _data.total_times
          } else if (this.istimesCard === 1) {
            this.vipCardData.has_date = _data.has_date
          } else if (this.istimesCard === 3) {
            this.vipCardData.has_date = _data.balance
          }
          // this.$set(this.editVipCardForm, 'sellerId', _data.seller ? getEmployeeSelectVule(this.employeesList, _data.sell_id) : null)
          // this.$set(this.editVipCardForm, 'sellerId', _data.sell_id)
          // this.$set(this.editVipCardForm, 'real_pay', _data.real_pay)
          // this.$set(this.editVipCardForm, 'paymethod', _data.order_detail.payment_method + '')
          this.$set(this.editVipCardForm, 'remark', _data.remark)
          this.$set(this.editVipCardForm, 'card_no', _data.card_no)
          this.$set(this.editVipCardForm, 'start_date', _data.start_date)
          this.$set(this.editVipCardForm, 'end_date', _data.end_date)
          this.$set(this.editVipCardForm, 'has_date', _data.has_date)
          this.$set(this.editVipCardForm, 'card_name', _data.card_name)
          this.setchecked = _data.over_date === '9999-12-31'
        }).catch(err => {
          console.log(err)
        })
    },
    creatCardNo() {
      let data = new Date()
      let overdata = parseTime(data, '{y}{m}{d}') + '-' + data.getTime().toString()
      this.editVipCardForm.card_no = overdata
    },
    editorCardBtn() {
      // 编辑会员卡背景图片
      // this.imagecropperShow = true
      this.isEditCardImage = !this.isEditCardImage
    },
    close() {
      this.imagecropperShow = false
    },
    cropSuccess(resData) {
      // 上传图片成功
      this.imagecropperShow = false
      this.imagecropperKey += 1
      this.chooseimgbox = false
      this.card_image = resData.url + resData.name
      this.$set(this.vipCardData, 'card_image', this.card_image)
    },
    uploadErro() {
      this.$emit('uploadErro')
    },
    selectCard() {
      // 选择卡种封面
      let index = this.editVipCardForm.cardImg
      if (index === 5) {
        this.cardImgMb = false
        this.editVipCardForm.photo = ''
      } else {
        this.cardImgMb = true
        this.editVipCardForm.photo = this.selectOption[index - 1].href
      }
    },
    getImgUrl(url) {
      this.editVipCardForm.photo = url
    },
    cimgrul(url) {
      this.editVipCardForm.photo = url
    }
  },
  computed: {
    employeesList() {
      let result = []
      let data = this.employeesData.filter(currentValue => {
        return currentValue.status === 1
      })
      for (let val of data) {
        result.push({ id: val.id, name: val.name, status: val.status })
      }
      // result.unshift({ id: 1, name: '牛啦APP', status: 1 })
      result.unshift({ id: 2, name: '待分配', status: 1 })
      // result.unshift({ id: 3, name: '超级管理员', status: 1 })
      return result
    },
    lostPickerOptions() {
      let frttime = new Date(this.editVipCardForm.start_date + ' 00:00:00').getTime() + 86400
      return { disabledDate(time) {
        return time < frttime
      } }
    }
  },
  watch: {
    setchecked(newval, oldval) {
      if (newval) {
        this.editVipCardForm.end_date = '9999-12-31'
      } else {
        // this.editVipCardForm.end_date = this.timesold
        this.timer = (this.timer === '9999-12-31' ? parseTime(Date.now(), '{y}-{m}-{d}') : this.timer)
        this.editVipCardForm.end_date = this.timer
      }
    }
  },
  components: {
    VipCardStyle,
    ImageCropper,
    moreImg
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
}
.vipCard-Yxq {
  font-size: 12px;
  color: #ccc;
  line-height: 14px;
  margin-top: -10px;
  margin-bottom: 23px;
}
.editCardDialog {
  .el-dialog__body {
    .dialog-body-two {
      width: 95%;
      border-top: 1px solid #cccccc;
      margin: 0px auto;
      p {
        font-size: 14px;
        color: #000000;
        font-weight: 600;
        .ljStopCardTime {
          float: right;
        }
      }
      .cardForm {
        .el-select {
          width: 100%;
        }
        .el-date-editor {
          width: 100%;
        }
        .el-range-separator {
          margin-right: 2px;
        }
        label {
          font-weight: 600;
          font-size: 14px;
        }
        .el-form-item__content {
          text-align: center;
          margin-left: 0px;
        }
        .el-textarea__inner {
          height: 80px;
        }
      }
    }
  }
  .editVipCardForm .prompt {
    width: 80%;
    margin: 0px auto;
    font-size: 10px;
    color: #999999;
  }
}
.cardDiv{
  // width: 290px;
  height: 112px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
</style>
