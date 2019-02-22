<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :width="widthSize"
    class="cardTypePorp customizeDetailsDialog"
    :beforeClose='dialogClosed'
    append-to-body>
    <el-form ref="formbox" autoComplete="on" :model="formData" :rules="formRules" label-width="95px" class="form-box">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="卡种名称" prop="name">
            <el-input v-model="formData.name"  placeholder="请填写卡种名称" maxlength="12"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="卡种封面" prop="cardImg">
            <div>
              <el-select placeholder="请选择卡种封面" v-model="formData.cardImg" @change="selectCard" style="width: 100%">
                <el-option :label="item.label" :value="item.value" :key="item.value" v-for="item in selectOption"></el-option>
              </el-select>
              <div class="cardDiv" v-if="cardImgMb"><img :src="formData.photo" width="100%" height="100%"></div>
              <more-img v-if="!cardImgMb" ref="imgbox" :boxWidth="272" :boxHeight="112" :imgWidth="710" :imgHeight="284" @imgUrl="getImgUrl" @clearimgurl="cimgrul"></more-img>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="卡种类型" prop="type">
            <el-select style="width: 100%" v-model="formData.type" :disabled="disabled" placeholder="请选择卡种类型">
              <el-option label="时效卡" :value="1"></el-option>
              <el-option label="次卡" :value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="formData.type == 1 ? '天数' : '次数'" prop="times">
            <span class="por">
              <el-input v-model="formData.times" :placeholder="formData.type == 1 ? '请填写天数' : '请填写次数'" oninput="if(value.length > 7)value = value.slice(0, 7)"></el-input>
              <span class="poa">{{formData.type == 1 ? '天' : '次'}}</span>
            </span>
          </el-form-item>
        </el-col>
      </el-row>
        <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="底价" prop="floor_price">
            <el-input v-model="formData.floor_price"  placeholder="请填写底价" type="number" oninput="if(value.length > 8)value = value.slice(0, 8)"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="价格" prop="price">
            <el-input v-model="formData.price"  placeholder="请填写价格" type="number" oninput="if(value.length > 8)value = value.slice(0, 8)"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
        <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="SAAS销售" prop="saas_status">
            <el-select style="width: 100%" v-model="formData.saas_status" placeholder="请选择SAAS市场销售">
              <el-option :label="item.label" :value="item.value" v-for="(item,index) in option" :key="index"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="APP销售" prop="app_status">
            <el-select style="width: 100%" v-model="formData.app_status" placeholder="请选择APP市场销售" :disabled="!IsAuthPass">
              <el-option :label="item.label" :value="item.value" v-for="(item,index) in option" :key="index"></el-option>
            </el-select>
            <!-- <div class="tipMsg" v-if="!IsAuthPass">注：通过认证后才能在“牛啦”APP中发布课程信息</div> -->
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="formData.remark" type="textarea" placeholder="请输入备注信息" :rows="1" :maxlength="20"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <p style="padding: 0px 15px;font-size: 14px;color: #606266;font-weight: bold;">支持的分店 (包括“售卡” 与 “使用”)</p>
        <el-col>
          <el-form-item prop="gym_ids" :label-width="'0px'">
            <el-checkbox-group v-model="formData.gym_ids">
              <el-checkbox  v-for="item in gymsList" :key="item.id" :label="item.name"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
      </el-row>
      <div style="text-align:center;">
        <span slot="footer" class="dialog-footer">
          <el-button v-if="isAddCardType" :loading="btnloading" @click="addsubmit" type="success">确 定</el-button>
          <el-button v-else :loading="btnloading" @click="editsubmit" type="success">更 新</el-button>
        </span>
      </div>
    </el-form>
  </el-dialog>
</template>
<script>
import { mapState } from 'vuex'
import moreImg from '@/components/moreImg'
import { addmsCardType, editmsCardType } from '@/api/mstoreCardType'
const priceValidator = (rule, value, callback) => {
  if (!value || value.length === 0) {
    callback(new Error('价格不能为空'))
  } else if (Number(value) < Number(my.formData.floor_price)) {
    callback(new Error('价格不能低于低价!'))
  } else {
    callback()
  }
}
let my = null
export default {
  name: 'cardTypePorp',
  props: {
    title: {
      type: String,
      default() {
        return '编辑卡种'
      }
    },
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
    IsAuthPass: {
      type: Number,
      default() {
        return 1
      }
    },
    isAddCardType: { // 是否添加卡种
      type: Boolean,
      default() {
        return true
      }
    }
  },
  data() {
    return {
      btnloading: false,
      formData: {
        type: 1,
        saas_status: 2,
        app_status: 1,
        cardImg: 1,
        photo: 'https://niulang-v2.oss-cn-beijing.aliyuncs.com/2018-06-13/gym5b208cf355c911528859891.png',
        gym_ids: []
      },
      formRules: {
        name: [{ required: true, message: '请输入卡种名称', trigger: 'blur' }],
        cardImg: [{ required: true, message: '请选择会员卡模板', trigger: 'change' }],
        type: [{ required: true, message: '请选择卡种类型', trigger: 'change' }],
        times: [{ required: true, message: '请输入有效值', trigger: 'blur' }],
        floor_price: [{ required: true, message: '价格不能为空', trigger: 'blur' }],
        price: [{ required: true, trigger: 'blur', validator: priceValidator }],
        saas_status: [{ required: true, message: '请选择SaSS销售类型', trigger: 'change' }],
        app_status: [{ required: true, message: '请选择APP销售类型', trigger: 'change' }],
        gym_ids: [{ type: 'array', required: true, message: '请至少选择一家分店', trigger: 'change' }]
      },
      cardImgMb: true,
      option: [{
        label: '下架',
        value: 1
      }, {
        label: '上架',
        value: 2
      }],
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
      disabled: false,
      cardTypeId: 0, // 编辑会员卡id
    }
  },
  created() {
    my = this
  },
  methods: {
    dialogClosed() {
      this.$emit('dialogClosed')
      this.fromReset()
    },
    fromReset() {
      // 表单复位
      this.cardImgMb = true
      this.formData.photo = 'https://niulang-v2.oss-cn-beijing.aliyuncs.com/2018-06-13/gym5b208cf355c911528859891.png'
      this.$refs.formbox.resetFields()
    },
    selectCard() {
      let index = this.formData.cardImg
      if (index === 5) {
        this.cardImgMb = false
        this.formData.photo = ''
      } else {
        this.cardImgMb = true
        this.formData.photo = this.selectOption[index - 1].href
      }
    },
    getImgUrl(url) {
      this.formData.photo = url
    },
    cimgrul(url) {
      this.formData.photo = url
    },
    addsubmit() {
      // 新增提交
      if (!this.formData.photo) {
        this.$message({
          type: 'warning',
          message: '卡种封面不能为空'
        })
        return false
      }
      this.$refs.formbox.validate((valid) => {
        if (valid) {
          this.btnloading = true
          let _ids = []
          this.formData.gym_ids.map(item => {
            let _gym_id = this.gymsList.find(item1 => {
              return item1.name === item
            })
            _ids.push(_gym_id.id)
          })
          let obj = Object.assign({}, this.formData, { gym_ids: _ids })
          addmsCardType(obj).then(res => {
            this.btnloading = false
            this.$message({
              message: '新增通卡卡种成功',
              type: 'success'
            })
            this.fromReset()
            this.$emit('cardTypePorpBtnOk')
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
    editsubmit() {
      // 修改提交
      if (!this.formData.photo) {
        this.$message({
          type: 'warning',
          message: '卡种封面不能为空'
        })
        return false
      }
      this.$refs.formbox.validate((valid) => {
        if (valid) {
          this.btnloading = true
          let _ids = []
          this.formData.gym_ids.map(item => {
            let _gym_id = this.gymsList.find(item1 => {
              return item1.name === item
            })
            _ids.push(_gym_id.id)
          })
          let obj = Object.assign({}, this.formData, { id: this.cardTypeId, gym_ids: _ids })
          editmsCardType(obj).then(res => {
            this.btnloading = false
            this.$message({
              message: '编辑通卡卡种成功',
              type: 'success'
            })
            this.fromReset()
            this.$emit('cardTypePorpBtnOk')
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
    getInitVal(param) {
      // 编辑通卡赋初始值
      this.cardTypeId = param.id
      let _gym_ids = []
      if (param.gyms) {
        param.gyms.map(item => {
          _gym_ids.push(item.name)
        })
      }
      this.formData = {
        name: param.name,
        type: param.type,
        saas_status: param.saas_status,
        app_status: param.app_status,
        photo: param.photo,
        gym_ids: _gym_ids,
        floor_price: param.floor_price,
        price: param.price,
        times: param.times,
        remark: param.remark
      }
      let _selectOption = this.selectOption.filter(item => {
        let _herf = item.href ? item.href.split('//')[1] : _herf
        return param.photo.indexOf(_herf) !== -1
      })
      if (!_selectOption[0]) {
        this.cardImgMb = false
        this.$nextTick(() => {
          this.$refs.imgbox.setImg(param.photo)
        })
      }
      this.$set(this.formData, 'cardImg', _selectOption[0] ? _selectOption[0].value : 5)
    }
  },
  components: {
    moreImg
  },
  computed: mapState({
    gymsList: state => {
      return state.manageGyms.gymsList
    }
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
.form-box{
  padding: 20px 15px;
  .cardDiv{
    // width: 290px;
    height: 112px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  .por {
    position: relative;
    .poa {
      position: absolute;
      right: 10px;
      top: -9px;
    }
  }
  .dialog-footer button{
    width: 150px;
  }
}
</style>


