<template>
   <el-dialog
      title="商品入库"
      :visible.sync="dialogVisible"
      :width="widthSize"
      class="testReportEntryPopup customizeDetailsDialog"
      :beforeClose='dialogClosed'
    >
      <div class="dialog-body">
        <div>
          <el-steps :active="step" finish-status="success" simple>
            <el-step title="查找商品" ></el-step>
            <el-step :title="disabled?'确认商品信息':'修改商品信息'" ></el-step>
            <el-step title="录入库存" ></el-step>
          </el-steps>
          <!-- 步骤1 -->
          <div v-if="step===1" class="step1-content" >
            <el-input placeholder="请扫描或输入商品条形码" v-model.trim="goodsID" @keyup.enter.native="searchGoodId" :maxlength="50">
              <template slot="prepend">
                <i class="qr"></i>
              </template>
              <el-button slot="append" icon="el-icon-search" @click="searchGoodId"></el-button>
            </el-input>
          </div>
          <!-- 步骤2 -->
          <div v-else-if="step===2" class="step2-content">
            <el-form label-width="120px" :model="stepFromData2" :rules="stepfromRules2" ref="stepFromData2">
              <el-form-item label="商品条码：" class="phone">
                <el-input v-model="goodsID" disabled></el-input>
                <span class="status-prompt" v-if="disabled">(已录入的商品)</span>
                <span class="status-prompt" v-if="!disabled">(未录入的商品)</span>
              </el-form-item>
              <p class="prompt" v-if='hasGoods===true'>提示：如以下商品信息有误，请点击此处<span @click="setStepBtn2">启用修改</span></p>
              <p class="prompt" v-if="hasGoods===false&&onceCancel">提示：手动输入信息入库成功后，会在系统中自动录入该商品信息 &nbsp;&nbsp;&nbsp;
                <a href="javascript:;" style="color:#1878E1" @click="saveSetBtn2">保存</a>   
                <a href="javascript:;" style="color:#1878E1" @click="cansle">取消</a></p>
              <el-form-item label="商品名称：" prop="name">
                <el-input v-model="stepFromData2.name" :disabled="hasGoods" maxlength="20"></el-input>
              </el-form-item>
              <el-form-item label="出售单价："  prop="price">
                <el-input v-model="stepFromData2.price" :disabled="hasGoods" type="number" oninput="if(value.length > 9)value = value.slice(0, 9)"></el-input>
              </el-form-item>
            </el-form>
            <!-- <div class="step2-content-bottom" v-if="hasGoods===false"> 
              <el-button  @click="cansle" v-if="disabled">取消</el-button>
              <el-button  @click="backUp" v-if="!disabled">上一步</el-button>
              <el-button type="primary" style="background: #333333;" @click="saveSetBtn2" :loading="loading">保存</el-button>
            </div> -->
            <div class="step2-content-bottom">
                <!-- <el-button @click="backUp" :disabled="!hasGoods">上一步</el-button> -->
                <el-button @click="backUp" v-if="!jumpover">上一步</el-button>
                <el-button type="primary" :disabled="isRemodify" style="background: #333;border:1px solid #333;" @click="netStepBtn2">下一步</el-button>
            </div>
          </div>
          <!-- 步骤3 -->
          <div v-else-if="step===3" class="step3-content">
            <el-form :model="stepFromData2" ref="reportForm" label-width="100px" class="demo-reportForm" :rules="stepfromRules3">
              <el-row :gutter="10">
                <el-col :span="12">
                  <el-form-item label="商品名称：" prop="name">
                    <el-input v-model="stepFromData2.name" placeholder="请输入商品名称" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="出售单价：" prop="price">
                    <el-input v-model="stepFromData2.price" disabled></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="10">
                <el-col :span="12">
                  <el-form-item label="当前库存：" prop="oldNum">
                    <el-input v-model="stepFromData2.stock" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="入库数量：" prop="newNum">
                    <el-input-number v-model="number" :min="1" style="width:100%" @change="getTotalPrice"  :max="99999999" @keyup.native="inputKeyUp"></el-input-number>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="10">
                <el-col :span="12">
                  <el-form-item label="进货单价：" prop="inNum">
                    <el-input v-model="stepFromData2.stock_price" type="number" :min="1" placeholder="请输入进货单价" @blur="getTotalPrice1"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="实付金额：" prop="realPrice">
                    <el-input v-model="realPrice" type="number" placeholder="请输入实付金额"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <div class="step3-content-bottom">
              <el-button @click="backUp">上一步</el-button>
              <el-button type="primary" style="background-color: rgb(51, 51, 51);color:#fff;border: 1px solid #333;" @click="btnOk" :loading="loading">确认入库</el-button>
            </div>
          </div>
        </div>
        
      </div>
    </el-dialog>
</template>

<script>
import { searchGoodsInfoByBarcode, addItemGoods, addGoods, editGoods } from '@/api/goods'
import { testFloat2 } from '@/utils/validate'
import { creatnoticeDom } from '@/utils/comm'
// 实付金额
const validatereal_pay = (rule, value, callback) => {
  if (!testFloat2(value)) {
    callback(new Error('出售单价为正数并且只能保留2位小数'))
  } else if (Number(value) > 99999999) {
    callback(new Error('输入数字不能大于99999999'))
  } else if (Number(value) === 0) {
    callback(new Error('输入数字必须大于0'))
  } else {
    callback()
  }
}
export default {
  // name: 'storagePopuo',
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
        return '700px'
      }
    },
    barCode: {
      type: String,
    },
    jumpover: {
      type: Boolean,
      default() {
        return false
      }
    }
  },
  watch: {
    // 'stepFromData2.stock_price'(newValue, oldValue) {
    //   if (~~(newValue)) {
    //     this.stepFromData2.stock_price = 0
    //   } else if (Number(newValue) < 0) {
    //     this.stepFromData2.stock_price = 0
    //   }
    // }
  },
  data() {
    return {
      step: 1,
      goodsID: '', // 商品条形码
      disabled: false,
      step2: 1,
      hasGoods: true,
      stepFromData2: {
        stock_price: 1
      },
      stepfromRules2: {
        name: { required: true, message: '商品名称不能为空', trigger: 'blur' },
        price: { required: true, trigger: 'blur', validator: validatereal_pay }
      },
      number: 1,
      realPrice: 1,
      loading: false,
      addForm: {
        price: '',
        name: '',
        barcode: ''
      },
      editform: {},
      addFormItem: {},
      stepFromData3: {},
      stepfromRules3: {},
      onceCancel: false, // 输入条形码，未收到 第一次隐藏取消按钮
      isRemodify: false // 是否启用修改
    }
  },
  computed: {
    // realPrice() {
    //   // 观察属性是不能给它赋值
    //   console.log(this.stepFromData2.stock_price, this.number)
    //   return this.stepFromData2.stock_price * this.number
    // }
  },
  created() {
    if (this.jumpover) {
      this.goodsID = this.barCode
      this.searchGoodId()
    }
  },
  methods: {
    getTotalPrice(e) {
      if (!e) {
        this.common.message('error', '入库数量不能为空')
        return false
      }
      if (/^\d+\.\d+$/.test(e)) {
        this.common.message('error', '入库数量不能为小数')
        return false
      }
      this.realPrice = Math.round(this.stepFromData2.stock_price * 1000 * this.number) / 1000
    },
    getTotalPrice1(e) {
      let doc = e.target
      let _val = doc.value
      if (!testFloat2(_val)) {
        creatnoticeDom(doc, false, '实付金额为正数，且只可保留两位小数')
        return
      }
      creatnoticeDom(doc, !(Number(_val) > 99999999), '实付金额小于99999999')
      this.realPrice = Math.round(this.stepFromData2.stock_price * 1000 * this.number) / 1000
    },
    defaultValue() {
      this.step = 1
      this.step2 = 1
      this.goodsID = ''
      this.disabled = true
    },
    searchGoodId() {
      let itemval = this.goodsID
      if (!itemval) {
        this.common.message('warning', '请扫描或输入商品条形码！')
        return
      }
      searchGoodsInfoByBarcode(itemval).then(res => {
        let item = Object.values(res.data)
        if (item.length) {
          this.stepFromData2 = Object.assign({}, res.data, this.stepFromData2)
          // this.realPrice = this.stepFromData2.price
          this.hasGoods = true
          this.disabled = true
          this.onceCancel = true
        } else {
          this.hasGoods = false
          this.disabled = false
          this.stepFromData2 = { stock_price: 1 }
          this.common.notify('提示', 'info', '未能找到商品，请添加！')
          this.onceCancel = false
        }
        this.step = 2
        this.step2 = 1
      })
    },
    // handleChange(value) {
    //   this.realPrice = this.stepFromData2.price * this.number
    // },
    dialogClosed() {
      this.defaultValue()
      this.$emit('dialogClosed')
    },
    cansle() {
      this.$refs.stepFromData2.resetFields()
      this.hasGoods = true
      this.isRemodify = false
    },
    backUp() {
      this.step = this.step - 1
    },
    netStepBtn1() {
      this.step = this.step + 1
    },
    setStepBtn2() {
      this.hasGoods = false
      this.isRemodify = true
    },
    cancelSetBtn2() {
      this.dialogClosed()
    },
    saveSetBtn2() {
      this.isRemodify = false
      this.addForm = {
        price: this.stepFromData2.price,
        name: this.stepFromData2.name,
        barcode: this.goodsID
      }
      this.$refs['stepFromData2'].validate((valid) => {
        if (valid) {
          if (this.stepFromData2.id) {
            this.editform = {
              price: this.stepFromData2.price,
              name: this.stepFromData2.name,
              barcode: this.goodsID,
              id: this.stepFromData2.id
            }
            this.loading = true
            editGoods(this.editform).then(response => {
              this.loading = false
              this.common.notify('成功', 'success', '编辑成功！')
              this.hasGoods = true
              if (!this.onceCancel) {
                this.step = this.step + 1
              }
              this.onceCancel = true
            }).catch(err => {
              if (err.response.data.status_code === 404) {
                this.common.notify('失败', 'error', err.response.data.message)
              } else {
                console.log(err.response.data)
              }
            })
          } else {
            addGoods(this.addForm).then(res => {
              this.loading = false
              this.hasGoods = true
              this.stepFromData2 = Object.assign({}, res.data, this.stepFromData2)
              this.stepFromData2.stock = 0
              // this.realPrice = this.stepFromData2.price
              if (!this.onceCancel) {
                this.step = this.step + 1
              }
              this.onceCancel = true
              this.common.notify('成功', 'success', '商品基本信息添加成功！')
            }).catch(() => {
              this.common.notify('错误', 'error', '添加失败！')
              this.loading = false
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    netStepBtn2() {
      if (!this.onceCancel) {
        this.saveSetBtn2()
        return false
      }
      this.step = this.step + 1
      // this.realPrice = this.stepFromData2.price
    },
    netStep2Btn() {
      this.step2 = this.step2 + 1
      this.stepFromData2.name = ''
    },
    backUp2() {
      this.step2 = this.step2 - 1
    },
    netStep2Btn2() {
    },
    btnOk() {
      if (!this.stepFromData2.stock_price) {
        this.common.message('warning', '进货单价不能为空')
        return false
      }
      if (!testFloat2(this.stepFromData2.stock_price)) {
        this.common.message('warning', '进货单价为正数并且只能保留2位小数')
        return false
      }
      if (Number(this.stepFromData2.stock_price) >= 99999999.99) {
        this.common.message('warning', '输入单价不能大于99999999.99')
        return false
      }
      if (!testFloat2(this.realPrice)) {
        this.common.message('warning', '实付金额为正数并且只能保留2位小数')
        return false
      }
      if (Number(this.realPrice) >= 99999999.99) {
        this.common.message('warning', '输入单价不能大于99999999.99')
        return false
      }
      if (!this.number) {
        this.common.message('error', '入库数量不能为空')
        return false
      }
      if (/^\d+\.\d+$/.test(this.number)) {
        this.common.message('error', '入库数量不能为小数')
        return false
      }
      this.$refs['reportForm'].validate((valid) => {
        if (valid) {
          this.addFormItem = {
            quantity: this.number,
            stock_price: parseFloat(this.stepFromData2.stock_price),
            real_total_fee: this.realPrice,
            goods_id: this.stepFromData2.id
          }
          this.loading = true
          addItemGoods(this.addFormItem).then(req => {
            this.common.notify('成功', 'success', '库存更新成功！')
            this.loading = false
            this.dialogClosed()
            this.$emit('testReportEntryPopupOK')
          })
        }
      })
    },
    inputKeyUp(e) {
      e.target.value = e.target.value.replace(/\D|\./g, '')
    }
  }
}
</script>
<style lang="scss" scoped>
.customizeDetailsDialog {
  .el-dialog {
    border-radius: 5px;
  }
  .el-dialog__header {
    border: 1px solid #cccccc;
    border-radius: 5px 5px 0px 0px;
  }
  .el-dialog__body {
    padding: 10px 10px;
    border-radius: 0px 0px 5px 5px;
  }
}
.qr {
  background-size: cover;
  background-position: center;
  width: 40px;
  top: -1px;
  border-radius: 5px 0 0 5px;
}
.testReportEntryPopup {
  .el-dialog__body {
    border-top: 1px solid #cccccc;
  }
  .dialog-body {
    width: 95%;
    margin: 0px auto;
    margin-top: 15px;
    .el-steps{
      margin-bottom: 15px;
      .el-step__main{
        .el-step__title{
          font-size: 14px;
        }
      }
      .el-step{
        position: relative;
        .el-step__head{
          position: absolute;
          top: 1px;
          left: -20px;
        }
      }
    }
    .step1-content{
      width: 60%;
      margin: 0px auto;
      margin-top: 40px;
      margin-bottom: 50px;
      .el-input .el-input-group__prepend{
        padding: 0px;
      }
      .el-input .el-input-group__prepend + input{
        margin-left: 34px;
      }
      .step1-content-bottom{
        text-align: center;
        margin-top: 50px;
        margin-bottom: 30px;
      }
      .err-prompt{
        font-size: 12px;
        color: #f56c6c;
        margin-top: 0px;
      }
    }
    .step2-content{
      width: 50%;
      margin: 0px auto;
      margin-top: 40px;
      .prompt{
        padding-left: 120px;
        font-size: 12px;
        margin-bottom: 30px;
        margin-top: -20px;
        span{
          color: #1878E1;
          cursor: pointer;
        }
      }
      .el-select{
        width: 100%;
      }
      .step2-content-bottom{
        text-align: center;
        margin-top: 50px;
        margin-bottom: 30px;
      }
      .phone{
        position: relative;
        .status-prompt{
          color: #1AB394;
          position: absolute;
          top: 0px;
          right: -165px;
        }
      }
    }
    .step3-content{
      width: 90%;
      margin: 0px auto;
      margin-top: 40px;
      .step3-content-bottom{
        text-align: center;
        margin-top: 50px;
        margin-bottom: 30px;
      }
    }
  }
}
</style>


