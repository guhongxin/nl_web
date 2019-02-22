<template>
  <el-dialog
    title="添加柜子区域"
    :visible.sync="dialogVisible"
    :width="widthSize"
    class="add-cabinet-dialog"
    :beforeClose='dialogClosed'
    >
      <ul class="ul-box" ref="formbox">
        <li>
          <span>柜子类型：</span>
          <el-radio-group v-model="intelligence" @change="changeIntelligence">
            <el-radio label="1">普通</el-radio>
            <el-radio label="2">智能</el-radio>
          </el-radio-group>
        </li>
        <li>
          <span>区域名称：</span>
          <el-input placeholder="请输入柜子所属的区域名称" v-model="addCabinetForm.area" :maxlength="16"></el-input>
        </li>
        <li v-if="isIntelligence">
          <span>设备编号：</span>
          <el-select v-model="addCabinetForm.device_id" :placeholder="placeholderName" @change="changeDevice">
            <el-option
              v-for="(item,index) in deviceList"
              :key="index"
              :label="item.device_id"
              :value="item.id">
            </el-option>
          </el-select>
        </li>
        <li>
          <span>柜子数量：</span>
          <el-input :placeholder="placeholder" v-model="addCabinetForm.quantity" :disabled="isIntelligence"></el-input>
        </li>
      </ul>
      <div class="cabnit-dialog-footer">
        <span slot="footer" class="dialog-footer">
          <el-button class="black" @click="addCabinetBtn" :loading="loading">确定</el-button>
        </span>
      </div>
    </el-dialog>
</template>
<script>
import { testNumber } from '@/utils/validate'
import { addCabinetNew, getCabinetDeviceNew } from '@/api/cabinet'
export default {
  name: 'VipCardEditDialog',
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
    }
  },
  data() {
    return {
      intelligence: '1',
      placeholder: '请输入柜子数量',
      loading: false,
      isIntelligence: false,
      placeholderName: '请选择设备编号',
      addCabinetForm: {
        area: '',
        quantity: '',
        device_id: ''
      },
      deviceList: [] // 设备变好
    }
  },
  created() {
    this.getDeviceList()
  },
  mounted() {
  },
  methods: {
    // 选择智能柜还是普通柜
    changeIntelligence(value) {
      this.addCabinetForm.quantity = ''
      switch (parseInt(value)) {
        case 1:
          this.isIntelligence = false
          this.placeholder = '请输入柜子数量(最多999个)'
          break
        case 2:
          this.isIntelligence = true
          this.placeholder = '根据输入的设备编号自动获取'
          break
      }
    },
    // 选择设备对应不同的柜子数量
    changeDevice(value) {
      let obj = {}
      obj = this.deviceList.find((item) => {
        return item.id === value
      })
      this.addCabinetForm.quantity = obj.attr.storageNum
    },
    dialogClosed() {
      this.$emit('dialogClosed')
    },
    getDeviceList() {
      getCabinetDeviceNew().then(res => {
        this.deviceList = res.data
        if (this.deviceList.length) {
          this.placeholderName = '请输入柜子所属的区域名称'
        } else {
          this.placeholderName = '未查询到智能柜的采购信息'
        }
      }).catch(err => {
        console.log(err)
      })
    },
    addCabinetBtn() {
      if (this.intelligence === '1') {
        delete this.addCabinetForm.device_id
        if (!this.addCabinetForm.quantity.length) {
          this.common.message('warning', '柜子数量不能为空')
          return false
        } else {
          if (!testNumber(this.addCabinetForm.quantity)) {
            this.common.message('warning', '柜子数量为正整数')
            return false
          }
          if (testNumber(this.addCabinetForm.quantity) - 999 >= 0) {
            this.common.message('warning', '柜子数量最多为999个')
            return false
          }
        }
      } else {
        delete this.addCabinetForm.quantity
        if (!this.addCabinetForm.device_id) {
          this.common.message('warning', '设备编号不能为空')
          return false
        }
      }
      if (!this.addCabinetForm.area.length) {
        this.common.message('warning', '区域名称不能为空')
        return false
      }
      this.loading = true
      addCabinetNew(this.addCabinetForm).then(res => {
        this.common.message('success', '柜子区域添加成功')
        this.loading = false
        this.$emit('addCabinetBtn')
      }).catch(err => {
        console.log(err)
        this.loading = false
      })
    }
  },
  computed: {
  },
  components: {
  }
}
</script>

<style lang="scss" scoped>
.add-cabinet-dialog {
  ul {
    list-style: none;
    padding: 0;
    li {
      margin-bottom: 30px;
    }
  }
  .cabnit-dialog-footer {
    margin-top: 60px;
    text-align: center;
    .black {
      border: 1px solid #000;
      background: #000;
    }
  }
}
</style>
