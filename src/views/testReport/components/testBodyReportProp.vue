<template>
  <el-dialog
    :title="'查看详情'"
    :visible.sync="dialogVisible"
    :width="widthSize"
    class="customizeDetailsDialog"
    :beforeClose='dialogClosed'
    append-to-body>
   <iframe id="iframe" :src="url" frameborder="0" ></iframe>
  </el-dialog>
</template>
<script>
import { getParamQ } from '@/api/testReport'
export default {
  name: 'testBodyReportProp',
  props: {
    dialogVisible: {
      type: Boolean,
      default() {
        return true
      }
    },
    title: {
      type: String
    },
    widthSize: {
      type: String,
      default() {
        return '500px'
      }
    },
    source: {
      type: Number,
      default() {
        return 0
      }
    }
  },
  data() {
    return {
      url: ''
    }
  },
  methods: {
    dialogClosed() {
      this.$emit('popupsClosed')
    },
    setURL(id) {
      if (this.source === 0) {
        this.url = `./static/sharepage/bodyExam.html?id=${id}&type=saas`
      } else if (this.source === 1) { /* 悠久 */
        this.url = `./static/health/index.html?id=${id}`
      } else if (this.source === 2) { /* 维塑 */
        getParamQ(id).then(res => {
          let data = res.data
          let gymdata = data.body[data.body.length - 1]
          if (gymdata.gym_body_exam_data) {
            let Q = gymdata.gym_body_exam_data.q || gymdata.gym_body_exam_data['q'] || gymdata.gym_body_exam_data[0]['q']
            if (gymdata && Q) {
              this.url = `./static/visfitlb/index.html?q=${Q}`
            }
          } else {
            console.log('缺少“gym_body_exam_data”字段！')
          }
        }).catch(err => {
          console.log(err)
        })
      } else {
        this.$message({
          type: 'info',
          message: '参数获取失败!'
        })
      }
    }
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