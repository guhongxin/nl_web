<template>
  <el-dialog
    title="日期筛选"
    :visible.sync="dateDialogVisible"
    width="646px"
    align="center"
    append-to-body>
    <el-date-picker
    time-arrow-control
    v-model="rangevalue"
    type="datetimerange"
    align="center"
    start-placeholder="开始日期"
    value-format="yyyy-MM-dd HH:mm:ss"
    end-placeholder="结束日期"
    :clearable="false"
    :editable="false"
    :default-time="['00:00:00', '23:59:59']">
  </el-date-picker>
  <span slot="footer" class="dialog-footer">
    <el-button @click="closeTimeRangeOver">取 消</el-button>
    <el-button type="primary" @click="chooseTimeRangeOver">筛 选</el-button>
  </span>
  </el-dialog>
</template>

<script>
  export default{
    name: 'dateRange',
    data() {
      return {
        rangevalue: [],
        dateDialogVisible: false,
        title: ''
      }
    },
    mounted() {
      let self = this
      window.openDate = function(event) {
        event.preventDefault()
        event.stopPropagation()
        self.title = event.target.title
        /* eslint no-eval: "error" */
        /* eslint-env node */
        self.data = evalReplace(event.target.getAttribute('data'))
        self.dateDialogVisible = true
      }
      function evalReplace(fn) { // eval一样
        let Fn = Function
        return new Fn('return ' + fn)()
      }
    },
    methods: {
      chooseTimeRangeOver() {
        if (!this.rangevalue.length) {
          this.common.message('error', '请选择时间后再筛选')
          return false
        }
        let obj = {
          rangevalue: this.rangevalue,
          title: this.title,
          data: this.data
        }
        this.$emit('timeChange', obj)
        this.dateDialogVisible = false
        this.rangevalue = []
        this.title = ''
      },
      closeTimeRangeOver() {
        this.rangevalue = []
        this.title = ''
        this.dateDialogVisible = false
      }
    }
  }
</script>
