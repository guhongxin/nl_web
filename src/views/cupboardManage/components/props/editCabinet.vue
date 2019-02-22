<template>
  <el-dialog
    title="编辑柜子区域"
    :visible.sync="dialogVisible"
    :width="widthSize"
    class="add-cabinet-dialog"
    :beforeClose='dialogClosed'
    >
      <ul class="ul-box" ref="formbox">
        <li>
          <span>区域名称：</span>
          <el-input placeholder="请输入柜子所属的区域名称" v-model="editCabinetForm.area" :maxlength="16"></el-input>
        </li>
        <li>
          <span>设备编号：</span>
          <el-input placeholder="请选择设备编号" v-if="editCabinetForm.device" v-model="editCabinetForm.device.device_id" disabled></el-input>
        </li>
        <li>
          <span>柜子数量：</span>
          <el-input :placeholder="placeholder" v-model="editCabinetForm.quantity" disabled></el-input>
        </li>
      </ul>
      <div class="cabnit-dialog-footer">
        <span slot="footer" class="dialog-footer">
          <el-button class="black" @click="editCabinetBtn" :loading="loading">确定</el-button>
        </span>
      </div>
    </el-dialog>
</template>
<script>
import { cabinetDetailNew, editCabinetNew } from '@/api/cabinet'
export default {
  // name: 'cabinetEditDialog',
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
      editCabinetForm: {},
      placeholder: '请输入柜子数量',
      loading: false,
      isIntelligence: false,
      addCabinetForm: {
      },
      cabinetId: '',
      deviceList: [] // 设备编号
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    getCabinetDetail(id) {
      this.cabinetId = id
      cabinetDetailNew(id).then(res => {
        this.editCabinetForm = res.data
      }).catch(err => {
        console.log(err)
      })
    },
    dialogClosed() {
      this.$emit('dialogClosed')
    },
    editCabinetBtn() {
      if (!this.editCabinetForm.area.length) {
        this.common.message('warning', '区域名称不能为空')
        return false
      }
      let data = { 'area': this.editCabinetForm.area }
      editCabinetNew(this.cabinetId, data).then(res => {
        this.common.message('success', '柜子修改成功')
        this.loading = false
        this.$emit('editCabinetBtn')
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
