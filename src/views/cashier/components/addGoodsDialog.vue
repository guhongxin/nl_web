<template>
   <el-dialog
      title="添加商品"
      :visible.sync="dialogVisible"
      :width="widthSize"
      class="goodsDialog" @close="addClose">
      <div class="dialog-body">
        <el-form label-width="100px" :model="addGoodsForm" :rules="goodsRule" ref="addGoodsDoc" class="goodsForm">
          <el-form-item label="商品条码：" prop="barcode">
            <el-input v-model="addGoodsForm.barcode" @blur="getBarCode" :min="0" maxlength="17"></el-input>
          </el-form-item>
          <el-form-item label="商品名称：" prop="name">
            <el-input v-model="addGoodsForm.name" maxlength="20"></el-input>
          </el-form-item>
          <el-form-item label="出售单价："  prop="price">
            <el-input v-model="addGoodsForm.price" type="number" oninput="if(value.length > 9)value = value.slice(0, 9)"></el-input>
          </el-form-item>
        </el-form>
          
        <div class="dialog-bottom">
          <el-button @click="cansle">取消</el-button>
          <el-button type="primary" style="background-color: rgb(51, 51, 51);color:#fff;border: 1px solid #000;" @click="btnOk" :loading="loading">确定</el-button>
        </div>
      </div>
    </el-dialog>
</template>

<script>
import { addGoods, getGoodsList } from '@/api/goods'
import { testFloat2, testNumberInt } from '@/utils/validate'
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
const validatereal_barcode = (rule, value, callback) => {
  if (!testNumberInt(value)) {
    callback(new Error('条码必须为纯数字'))
  } else if (value.toString().length > 17) {
    callback(new Error('输入条码个数不超过17位'))
  } else {
    callback()
  }
}
export default {
  // name: 'storagePopuo',
  props: {
    widthSize: {
      type: String,
      default() {
        return '400px'
      }
    }
  },
  watch: {
  },
  data() {
    return {
      loading: false,
      dialogVisible: false,
      tableList: [],
      addGoodsForm: {
        barcode: '',
        name: '',
        price: ''
      },
      goodsRule: {
        barcode: { required: true, trigger: 'blur', validator: validatereal_barcode },
        name: { required: true, message: '商品名称不能为空', trigger: 'blur' },
        price: { required: true, trigger: 'blur', validator: validatereal_pay }
      }
    }
  },
  computed: {
  },
  created() {
  },
  methods: {
    dialogShow() {
      this.dialogVisible = true
    },
    addClose() {
      this.addGoodsForm.barcode = ''
      this.addGoodsForm.name = ''
      this.addGoodsForm.price = ''
    },
    cansle() {
      this.dialogVisible = false
    },
    getBarCode() {
      getGoodsList(this.listQuery).then(response => {
        this.tableList = response.data
        var my = this
        this.tableList.filter(function(element, index, self) {
          if (element.barcode === my.addGoodsForm.barcode) {
            my.common.message('warning', '该商品条码已存在，请重新输入')
            return
          }
        })
      })
    },
    btnOk() {
      if (this.addGoodsForm.barcode.trim() === '') {
        this.common.message('warning', '商品条码不能为空')
        return
      } else if (!testNumberInt(this.addGoodsForm.barcode)) {
        this.common.message('warning', '条码必须为纯数字')
        return
      } else if (this.addGoodsForm.barcode.toString().length > 17) {
        this.common.message('warning', '输入条码个数不超过17位')
        return
      } else {
        for (let i = 0; i < this.tableList.length; i++) {
          if (String(this.tableList[i].barcode) === String(this.addGoodsForm.barcode)) {
            this.common.message('warning', '该商品条码已存在，请重新输入')
            return false
          }
        }
      }
      // if (this.addGoodsForm.name.trim() === '') {
      //   this.common.message('warning', '商品名称不能为空')
      //   return
      // }
      // if (this.addGoodsForm.price.trim() === '') {
      //   this.common.message('warning', '出货单价不能为空')
      //   return
      // } else if (!testFloat2(this.addGoodsForm.price)) {
      //   this.common.message('warning', '出售单价为正数并且只能保留2位小数')
      //   return
      // } else if (Number(this.addGoodsForm.price) > 99999999) {
      //   this.common.message('warning', '输入数字不能大于99999999')
      //   return
      // }
      this.$refs.addGoodsDoc.validate((valid) => {
        if (valid) {
          this.loading = true
          addGoods(this.addGoodsForm).then(res => {
            this.loading = false
            this.dialogVisible = false
            this.common.message('success', '商品基本信息添加成功！')
            this.$emit('dialogAddGoodsOk')
          }).catch(() => {
            this.common.message('error', '添加失败！')
            this.loading = false
          })
        } else {
          console.log('error submit!!')
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.goodsDialog {
  .goodsForm {
    // width: 
  }
}
.dialog-bottom {
  text-align:center;
  margin-top:50px;
}
</style>


