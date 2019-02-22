<template>
	<div class="testBodyReport">
		<el-table
			:data="tableData"
		  stripe 
      class="check-table reacord-table"
      v-loading="listLoading" 
      element-loading-text="列表正在加载中"
      border
      fit highlight-current-row
      style="width: 100%;">
			<el-table-column
				prop="examTime"
        label="体测时间<i class='el-icon-date'></i>"
				align="center"
				>
        <template slot-scope="scope">
          <span>{{scope.row.examTime ? common.customFormat(scope.row.examTime,"yyyy-MM-dd"):'-'}}</span>
        </template>
			</el-table-column>
			<el-table-column
				prop="age"
				label="年龄"
				align="center"
			>
        <template slot-scope="scope">
          <span>{{scope.row.age}}</span>
        </template>
			</el-table-column>
			<el-table-column
				prop="normal"
				label="体型"
				align="center"
			>
        <template slot-scope="scope">
          <span>{{getBodyType(scope.row.normal)}}</span>
        </template>
			</el-table-column>
		  <el-table-column
				prop="fat"
				label="体脂"
				align="center"
			>
        <template slot-scope="scope">
          <span>{{scope.row.fat?(Math.round(scope.row.fat*100) / 100)+'%':'-'}}</span>
        </template>
			</el-table-column>
      <el-table-column
				prop="muscle"
				label="肌肉"
				align="center"
			>
        <template slot-scope="scope">
          <span>{{scope.row.muscle?scope.row.muscle+'%':'-'}}</span>
        </template>
			</el-table-column>
      <el-table-column align="center"  :label="'来源'" width="150" prop="source">
        <template slot-scope="scope">
          <span>{{computedName(scope.row.source)}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" fixed="right" :label="$t('table.actions')" min-width="150" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="customerDetailsBtn(scope.row)">app查看</el-button>
          <el-button type="primary" size="mini" @click="testReportParent(scope.row)">pc查看</el-button>
        </template>
      </el-table-column>
		</el-table>
    <div class="pagination-container"  style="text-align:right;">
      <el-pagination
        v-if="paginationShow"
        background 
        :page-size="per_page"
        @current-change="handleCurrentChange" 
        :current-page.sync="page"
        layout="total, prev, pager, next" :total="total">
      </el-pagination>
    </div>
    <test-body-report-prop
      v-if="testbodyreportpropdialogVisible"
      :dialogVisible="testbodyreportpropdialogVisible"
      @popupsClosed="testbodyreportpropdialogClosed" 
      ref="testBodyReportDoc"
      :source="bodyreportSource">
    </test-body-report-prop>
	</div>
</template>
<script>
import { body_typeDictionary } from '@/utils/comm'
import { bodyExamList } from '@/api/testReport'
import testBodyReportProp from '@/views/testReport/components/testBodyReportProp'
export default {
  name: 'testBodyReport',
  data() {
    return {
      tableData: [],
      listLoading: false,
      paginationShow: true,
      page: 1,
      per_page: 10,
      total: 0,
      testbodyreportpropdialogVisible: false,
      customer_id: 0,
      bodyreportSource: 0
    }
  },
  methods: {
    getBodyType(param) {
      return body_typeDictionary(param)
    },
    getList(id) {
      this.customer_id = id
      this.listLoading = true
      let obj = {
        customer_id: id,
        page: this.page,
        per_page: this.per_page
      }
      bodyExamList(obj).then(res => {
        let data = res.data
        console.log(data)
        this.tableData = data
        this.total = Number(res.headers.pagination.split(',')[1])
        this.listLoading = false
      }).catch(err => {
        console.log(err)
        this.listLoading = false
      })
    },
    handleCurrentChange(value) {
      this.page = value
      this.getList(this.customer_id)
    },
    testReportParent(row) {
      if (row.source === 0) {
        window.open('../../../../static/bodyExam/report.html?id=' + row.id)
      } else if (row.source === 1) { /* 悠久 */
        window.open('../../../../static/health/report.html?id=' + row.id)
      } else if (row.source === 2) { /* 维塑 */
        window.open('../../../../static/visfitlb/physicalReport.html?id=' + row.id)
      } else {
        this.$message({
          type: 'info',
          message: '参数获取失败!'
        })
      }
    },
    customerDetailsBtn(row) {
      this.testbodyreportpropdialogVisible = true
      this.bodyreportSource = row.source
      this.$nextTick(() => {
        this.$refs.testBodyReportDoc.setURL(row.id)
      })
    },
    testbodyreportpropdialogClosed() {
      this.testbodyreportpropdialogVisible = false
    },
    // 显示第三方来源
    computedName(source) {
      let text = ''
      switch (source) {
        case 0:
          text = '牛啦体测'
          break
        case 1:
          text = '佑久体测'
          break
        case 2:
          text = '维塑体测'
          break
        default:
          text = '第三方体侧'
          break
      }
      return text
    }
  },
  components: {
    testBodyReportProp
  }
}
</script>
<style lang="scss" scoped>
.testBodyReport {
  /deep/ .el-table .cell {
    line-height: 20px;
  }
}
</style>