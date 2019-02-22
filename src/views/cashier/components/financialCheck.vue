<template>
    <el-dialog
      title="库存核对"
      :visible.sync="dialogVisible"
      width="500px"
      class="course-dialog" @close="addclose" :close-on-click-modal="false">
      <div class="financia-box">
        <div class="financial-form">
          <el-form :model="examineMsg" :rules="rules" ref="examineMsg">
            <el-form-item label="商品名称：" prop="name">
              <span>{{name}}</span>
              <p class="my-p"><i class="my-i">*</i>当前库存<span>{{nowStorage}}</span></p>
            </el-form-item>
            <el-form-item label="核对类型：" prop="type">
              <el-radio-group v-model="examineMsg.type" @change="getStatus">
                <el-radio label="1">加库</el-radio>
                <el-radio label="2">减库</el-radio>
              </el-radio-group>
              <p class="my-p"><i class="my-i">*</i>核后库存<span>{{checkStorage}}</span></p>
            </el-form-item>
            <el-form-item label="调整数量：" prop="stock">
              <el-input-number v-model="examineMsg.stock" :precision="0" :step="1" :min="0" :max="maxStock" @change="changeNumber"></el-input-number>
              <!-- <el-input v-model="examineMsg.number" placeholder="请输入数量"></el-input> -->
            </el-form-item>
            <el-form-item label="备注：" prop="remark" style="margin-left:40px;">
              <el-input v-model="examineMsg.remark" placeholder="请填写调整原因" :maxlength="20"></el-input>
            </el-form-item>
            <el-form-item label="操作记录：" prop="operate" style="margin-left:15px;">
              <!-- 操作记录 -->
              <div v-if="operationList.length" class="operateBox">
                <operation-record :operationList='operationList'>
                </operation-record>
              </div>
              <span v-else>无</span>
            </el-form-item>
          </el-form>
        </div>

      </div>
      <div style="text-align:center;">
        <span slot="footer" class="dialog-footer">
          <el-button type="info" @click="dialogVisible=false">取消</el-button>
          <el-button type="primary" :loading="loading" class="black" @click="btnSure">确定</el-button>
        </span>
      </div>
    </el-dialog>
</template>

<script>
import operationRecord from './operationRecord'
import { checkGoods, checkDetails } from '@/api/goods'
const realpayVerification = (rule, value, callback) => {
  var re = /(^[1-9](\d+)?(\.\d{0})?$)|(^(0){1}$)|(^\d\.\d{0}?$)/
  if (!re.test(value)) {
    callback(new Error('调整数量不能为小数'))
  } else if (Number(value) > 99999999) {
    callback(new Error('调整数量小于99999999'))
  } else if (Number(value) === 0) {
    callback(new Error('调整数量不能为0'))
  } else {
    callback()
  }
}
export default {
  name: '',
  components: {
    operationRecord
  },
  props: {
  },
  data() {
    return {
      dialogVisible: false,
      loading: false,
      nowStorage: 0,
      checkStorage: 0,
      maxStock: 99999999,
      operationList: [
      ],
      name: '',
      examineMsg: {
        id: '',
        type: '1',
        stock: '',
        remark: ''
      },
      rules: {
        type: [{ required: true, message: '请选择审核状态' }],
        stock: [{ required: true, trigger: 'blur', validator: realpayVerification }],
        name: [{ required: true, message: '', trigger: 'change' }],
        sell_id: [{ required: true, message: '请输入销售员工', trigger: 'change' }]
      }
    }
  },
  mounted() {
  },
  created() {
  },
  watch: {
  },
  computed: {
  },
  methods: {
    dialogShow(obj) {
      this.dialogVisible = true
      this.examineMsg.id = obj.id
      this.name = obj.name
      this.nowStorage = obj.stock
      this.checkStorage = obj.stock
      this.getList()
    },
    addclose() {
      this.examineMsg.stock = 0
      this.maxStock = 99999999
      this.examineMsg.type = '1'
      this.examineMsg.remark = ''
    },
    getList() {
      // 操作记录
      checkDetails(this.examineMsg.id).then(res => {
        this.operationList = res.data
        this.dialogVisible = true
      })
    },
    getStatus(val) {
      if (val === '1') { // 加库
        this.maxStock = 99999999
        this.checkStorage = this.nowStorage + this.examineMsg.stock
      } else {
        if (this.nowStorage === 0) {
          // this.checkStorage = 0
          this.maxStock = 0
          this.examineMsg.stock = 0
          this.common.message('warning', '当前库存不足')
        } else if (this.examineMsg.stock - this.nowStorage > 0) {
          this.maxStock = this.nowStorage
          this.examineMsg.stock = this.nowStorage
          this.checkStorage = 0
        } else {
          this.maxStock = this.nowStorage
          this.checkStorage = this.nowStorage - this.examineMsg.stock
        }
      }
    },
    changeNumber(val) {
      if (this.examineMsg.type === '1') {
        this.checkStorage = this.nowStorage + val
      } else {
        this.checkStorage = this.nowStorage - val
      }
    },
    btnSure() {
      var re = /(^[1-9](\d+)?(\.\d{0})?$)|(^(0){1}$)|(^\d\.\d{0}?$)/
      if (!re.test(this.examineMsg.stock)) {
        this.common.message('warning', '调整数量不能为小数')
        return
      } else if (Number(this.examineMsg.stock) > 99999999) {
        this.common.message('warning', '调整数量小于99999999')
        return
      } else if (this.examineMsg.stock === 0) {
        this.common.message('warning', '调整数量不能为0')
        return
      }
      if (this.nowStorage === 0 && this.examineMsg.type === '2') {
        this.common.message('warning', '当前库存不足')
        return
      }
      this.loading = true
      checkGoods(this.examineMsg.id, this.examineMsg).then(res => {
        this.loading = false
        this.dialogVisible = false
        this.common.message('success', '库存核对成功')
        this.$emit('financeCheckBtn')
      }).catch(err => {
        this.loading = false
        console.log(err)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.financia-box /deep/ {
  .financial-form {
    width: 400px;
    margin: 0 auto;
    .el-form-item__content {
      position: relative;
      .el-input {
        width: 300px;
      }
    }
    .el-input-number {
      width: 300px;
    }
  }
}
.operateBox {
  display: inline-block;
  width: 300px;
}
.my-p {
  display: inline-block;
  position: absolute;
  top: -15px;
  right: 2px;
  .my-i {
    color: #f56c6c;
    margin-right: 4px;
    vertical-align: middle;
    font-style: normal;
    font-weight: bold;
  }
  span {
    margin-left: 10px;
  }
}
</style>