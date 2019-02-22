<template>
  <el-dialog
    :title="'查看详情'"
    :visible.sync="dialogVisible"
    :width="widthSize"
    class="customizeDetailsDialog"
    :beforeClose='dialogClosed'
    append-to-body @click.native.stop="msgClick">
   <iframe id="iframe" :src="url" frameborder="0" ></iframe>
  </el-dialog>
</template>
<script>
export default {
  name: 'viewDetail',
  props: {
    widthSize: {
      type: String,
      default() {
        return '500px'
      }
    }
  },
  data() {
    return {
      url: '',
      dialogVisible: false
    }
  },
  methods: {
    dialogClosed() {
      this.dialogVisible = false
      this.$emit('dialogClosed')
    },
    openModel(param) {
      this.url = param
      this.dialogVisible = true
    },
    msgClick() {}
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
    border-radius: 0px 0px 5px 5px;
    border-top: 1px solid #cccccc;
  }
}
#iframe {
  width: 100%;
  height: 800px;
  margin: 0px auto;
}
</style>
