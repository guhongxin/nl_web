<template>
  <el-dialog
    title="提示"
    :visible.sync="dialogVisible"
    :width="widthSize"
    class="uploadDialog customizeDetailsDialog"
    :beforeClose='dialogClosed'>
    <div class="dialog-body" style="width:100%;">
      <div class="frist-step">
        <h3>第一步：<span>下载模板</span></h3>
        <a :href="downloadurl" download="数据导入模板" class="down-box">点此下载</a>
        <p>下载后,请使用Excel2007及以上版本或WPS打开</p>
        <p>请将你以获得的会员数据复制到该表格中并严格填写,请勿随意更改表格中的内容</p>
        <p>编辑完成后,请直接保存在该表格中</p>
        <p>表格中包含示例数据，以此为参考</p>
      </div>
      <div class="two-step">
        <h3>第二步：<span>上传资料</span></h3>
        <p>请将你已经编辑好的表格上传，系统会自动分析，确认格式无误后再上传</p>
        <excelup ref="uploadexcel" @on-selected-file="UploadComplete" @cencel-upload="uploadCencel"></excelup>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import excelup from '@/components/excelup'
export default {
  name: 'uploadDialog',
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
        return '50%'
      }
    },
    cardType: {
      type: 0,
      default() {
        return 0
      }
    }
  },
  data() {
    return {
      downloadurl: this.staticurl + 'static/excel/牛啦会员卡导入模板.xlsx'
    }
  },
  methods: {
    dialogClosed() {
      this.$emit('dialogClosed')
    },
    UploadComplete(params) {
      this.$emit('UploadComplete', params)
    },
    uploadCencel() {
      this.$emit('uploadCencel')
    }
  },
  components: {
    excelup
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
    padding: 10px 20px;
    border-radius: 0px 0px 5px 5px;
  }
  /deep/ .el-dialog__footer{
    text-align: center;
  }
}
.uploadDialog{
  .down-box {
    background-color: #333333;
    color: #ffffff;
    display: inline-block;
    width: 110px;
    height: 36px;
    border-radius: 5px;
    text-align: center;
    line-height: 36px;
    font-size: 14px;
  }
  .two-step{
    margin-top: 25px;
    #file{
      display: none;
    }
  }
  .dialog-body{
    h3{
      color: #1C84C6;
    }
  }
  .dialog-footer{
    text-align: center;
  }
}

</style>



