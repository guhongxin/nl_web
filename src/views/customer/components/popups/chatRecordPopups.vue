<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :width="widthSize"
    class="customizeDetailsDialog"
    :beforeClose='dialogClosed'
  >
    <template v-if="chartRecord!==null&&chartRecord.length">  
      <div class="chart-list-view" id="chartListId">
        <chat-record-item 
          v-for="(item, key) in chartData"
          :key="key"
          :contactName='item.employee.name'
          :contactImg='item.employee.head_portrait'
          :contactTime="item.created_at"
          :leaveMessage="item.content"
          :audioSrc="item.video"></chat-record-item>
      </div>
      <div style="text-align: right;margin-top:20px;">
        <el-pagination
          background
          small
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="chatQuery.page"
          :page-size="chatQuery.per_page"
          layout="total, prev, pager, next"
          :total="total">
        </el-pagination>
      </div>
    </template>
    <no-data v-else></no-data>
  </el-dialog>
</template>
<script>
import ChatRecordItem from '@/components/chatRecordItem'
import noData from '@/components/noData'
import { customerWord } from '@/api/customerGl'
// import noData from '@/components/noData'
// http://pic.ibaotu.com/00/57/84/15P888piCEdn.mp3
var BenzAMRRecorder = require('benz-amr-recorder')
export default {
  name: 'chatRecordPopups',
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
        return '25%'
      }
    }
  },
  data() {
    return {
      prevAudio: null,
      nextAudio: null,
      chartData: [],
      arm: [],
      chartId: 0,
      chatQuery: {
        page: 1,
        per_page: 10
      },
      chartRecord: [],
      total: 0
    }
  },
  created() {},
  methods: {
    dialogClosed() {
      this.$emit('popupsClosed')
    },
    initArm(Url) {
      console.log(Url)
      let obj = new BenzAMRRecorder()
      obj.initWithUrl(Url).then(function() {})
      return obj
    },
    getChartList(id, type) {
      this.chartId = id
      this.chatQuery.type = type
      customerWord(this.chartId, this.chatQuery).then(res => {
        this.chartRecord = res.data
        this.total = Number(res.headers.pagination.split(',')[1])
        this.chartData = []
        for (let j = 0; j < this.chartRecord.length; j++) {
          if (!this.chartRecord[j].video) {
            this.chartData.push(this.chartRecord[j])
          } else {
            if (this.chartRecord[j].video.length > 0) {
              if (this.chartRecord[j].video[0].Url === '') {
                this.chartData.push(this.chartRecord[j])
              } else {
                this.$set(this.arm, j, this.initArm(this.chartRecord[j].video[0].Url))
                this.$set(this.chartRecord[j].video[0], 'arm', this.arm[j])
                this.chartData.push(this.chartRecord[j])
              }
            }
          }
        }
      }).catch(err => {
        console.log(err)
      })
    },
    handleSizeChange() {
      console.log('每页显示条数改变')
    },
    handleCurrentChange(value) {
      this.chatQuery.page = value
      this.getChartList(this.chartId, this.chatQuery.type)
    }
  },
  components: {
    ChatRecordItem,
    noData
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
    border-radius: 0px 0px 5px 5px;
    border-top: 1px solid #cccccc;
  }
}
.customizeDetailsDialog {
  .chart-list-view{
    width: 95%;
    margin: 0px auto;
    height: 450px;
    overflow: hidden;
    overflow-y: auto;
  }
  /*滚动条样式*/
  .chart-list-view::-webkit-scrollbar {/*滚动条整体样式*/
      width: 4px;     /*高宽分别对应横竖滚动条的尺寸*/
      height: 4px;
  }
  .chart-list-view::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
      border-radius: 5px;
      -webkit-box-shadow: inset 0 0 4px rgba(26,179,148,0.8);
      background: rgba(26,179,148,0.8);
  }
  .chart-list-view::-webkit-scrollbar-track {/*滚动条里面轨道*/
      -webkit-box-shadow: inset 0 0 4px rgba(26,179,148,0.8);
      border-radius: 0;
      background: rgba(26,179,148,0.1);
  }
}
</style>

