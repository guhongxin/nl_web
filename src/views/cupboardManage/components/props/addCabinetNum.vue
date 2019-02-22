<template>
  <el-dialog
    title="添加"
    :visible.sync="dialogVisible"
    :width="widthSize"
    class="add-cabinet-dialog"
    :beforeClose='dialogClosed'
    >
      <ul class="ul-box" ref="formbox">
        <li>
          <span>柜子序号：</span>
          <el-input placeholder="请输入添加柜子序号" v-model="addGridForm.no"></el-input>
        </li>
        <li>
          <span style="margin-left:14px;">手牌号：</span>
          <el-input placeholder="请输入柜子手牌号" v-model="addGridForm.key" type="number"></el-input>
        </li>
      </ul>
      <div class="cabnit-dialog-footer">
        <span slot="footer" class="dialog-footer">
          <el-button class="black" @click="addCabinetNumBtn" :loading="loading">确定</el-button>
        </span>
      </div>
    </el-dialog>
</template>
<script>
import { addGridNum } from '@/api/cabinet'
export default {
  name: 'cabinetEditDialog',
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
    },
    cabinetId: {
      type: Number
    }
  },
  data() {
    return {
      addGridForm: {
        id: '',
        no: '',
        key: ''
      },
      loading: false,
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    dialogClosed() {
      this.$emit('dialogClosed')
    },
    addCabinetNumBtn() {
      if (!this.addGridForm.no) {
        this.common.message('warning', '添加序号不能为空')
        return false
      }
      if (!this.addGridForm.key) {
        this.common.message('warning', '手牌号不能为空')
        return false
      }
      this.addGridForm.id = this.cabinetId
      addGridNum(this.addGridForm).then(res => {
        this.common.message('success', '柜子添加成功')
        this.loading = false
        this.$emit('addCabinetNumBtn', res.data)
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
