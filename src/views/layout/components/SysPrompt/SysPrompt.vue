<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :width="wd"
    :before-close="handleClose"
    append-to-body
    :show-close="tileImage===1"
    class="customizeDetailsDialog1 sys-prompt-box">
    <div slot="title" class="sys-header">
      <template v-if="tileImage!==1">
        <img :src="message.article_record?message.article_record.article?message.article_record.article.image:'':''">
        <i class="sys-header-close el-icon-close" @click="handleClose"></i>
      </template>
      <p class="sys-header-title">{{message.article_record?message.article_record.article?message.article_record.article.title:'':''}}</p>
      <p class="sys-header-time">{{message.created_at}}</p>
    </div>
    <div class="sys-content">
      <!-- <div v-html="message.article_record?message.article_record.article?message.article_record.article.content:'':''"></div> -->
      {{message.article_record ? message.article_record.intro:'-'}}
    </div>
    <div class="dialog-footer" v-if="tileImage!==1">
      <el-button class="detailsBtn" @click="detailsBtn(message.article_record?message.article_record.push_url:'')">查看详情</el-button>
    </div>
    <view-detail ref="viewDetailDoc" @dialogClosed="handleClose">
    </view-detail>
  </el-dialog>
</template>
<script>
import ViewDetail from './viewDetail'
export default {
  name: 'sysPrompt',
  props: {
    wd: {
      type: String,
      default() {
        return '500px'
      }
    }
  },
  data() {
    return {
      dialogVisible: false,
      message: {},
      tileImage: false
    }
  },
  methods: {
    handleClose() {
      this.dialogVisible = false
      this.$emit('closePopup', this.message)
    },
    findDetails() {
      console.log('查看详情')
    },
    openModel(param) {
      this.dialogVisible = true
      this.message = param
      this.tileImage = param.article_record && param.article_record.type
      console.log('this.message', this.message)
    },
    detailsBtn(param) {
      // 查看详情
      console.log(param)
      this.$nextTick(() => {
        this.$refs.viewDetailDoc.openModel(param)
      })
    }
  },
  components: {
    ViewDetail
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.customizeDetailsDialog1 {
  /deep/ .el-dialog {
    border-radius: 5px;
  }
  /deep/ .el-dialog__header {
    border-radius: 5px 5px 0px 0px;
    padding: 0px;
    border-bottom: none;
  }
  /deep/ .el-dialog__body {
    padding: 0px 10px 15px;
    border-radius: 0px 0px 5px 5px;
    .sys-content {
      margin-bottom: 20px;
      img {
        max-width: 100%;
        overflow: hidden;
      }
      ul {
        padding-left: 17px;
      }
    }
  }
}
.sys-prompt-box {
  .sys-header{
    border-radius: 5px;
    overflow: hidden;
    position: relative;
    img {
      width: 100%;
    }
    .sys-header-title{
      font-size: 18px;
      color: #333333;
      letter-spacing: 0;
      padding: 0px 10px;
      font-weight: 600;
      line-height: 20px;
    }
    .sys-header-time{
      font-size: 12px;
      color: #999999;
      letter-spacing: 0;
      padding: 0px 10px;
    }
    .sys-header-close{
      color: #ffffff;
      position: absolute;
      top: 10px;
      right: 10px;
      font-weight: 800;
      cursor: pointer;
    }
  }
  .dialog-footer {
    text-align: center;
    .detailsBtn {
      background: #1AB394;
      width: 160px;
      color: #ffffff;
    }
  }
}
</style>
