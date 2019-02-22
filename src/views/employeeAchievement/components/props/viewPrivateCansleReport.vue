<template>
  <el-dialog
    title="查看报表"
    :visible.sync="dialogVisible"
    width="1400px"
    class="report-dialog" :close-on-click-modal="false">
    <div ref="myDiv">
      <div>
        <private-header
        @downPages='downPages'
        @printPages='printPages'
        :headerContent='headerContent' :loading='excelLoading'></private-header>
      </div>

      <el-table ref="staffTable" stripe :key='tableKey' :data="tableList" v-loading="listLoading" element-loading-text="列表正在加载中" fit highlight-current-row
      style="width: 100%;margin-top:20px;" header-cell-class-name="bindonce" border class="check-table">
      <el-table-column align="center"
      label="序号">
        <template slot-scope="scope">
          <span>{{scope.$index + 1}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="'消课时间'" width="200">
        <template slot-scope="scope">
          <span>{{scope.row.created_at}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="'操作人'">
        <template slot-scope="scope">
          <span>{{scope.row.operator?scope.row.operator.name:''}}</span>
        </template>
      </el-table-column>

      <el-table-column label="课程信息" align="center" class-name="merge-th">
        <el-table-column align="center" :label="'课程名称'" column-key="course_id">
          <template slot-scope="scope">
            <span>{{scope.row.customer_course?scope.row.customer_course.course_name:''}}</span>
          </template>
        </el-table-column>
        <el-table-column column-key="coach_id" align="center" :label="'教练名称'">
          <template slot-scope="scope">
            <span>{{scope.row.booking_coach?scope.row.booking_coach.name:''}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="'课程价格'">
          <template slot-scope="scope">
            <span>{{scope.row.course_price?scope.row.course_price:'-'}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="'课程次数（剩/总）'" width="140">
          <template slot-scope="scope">
            <span>{{scope.row.customer_course?scope.row.customer_course.residue:''}}/{{scope.row.customer_course?scope.row.customer_course.quantity:''}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="'应付金额'">
          <template slot-scope="scope">
            <span>{{scope.row.customer_course?scope.row.customer_course.course_order?scope.row.customer_course.course_order.total_fee:'':''}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="'实付金额'">
          <template slot-scope="scope">
            <span>{{scope.row.customer_course?scope.row.customer_course.course_order?scope.row.customer_course.course_order.real_total_fee:'':''}}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="客户信息" align="center" class-name="merge-th">
        <el-table-column align="center" :label="'会员姓名'">
          <template slot-scope="scope">
            <span>{{scope.row.customer?scope.row.customer.name:''}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="'手机号码'" width="120">
          <template slot-scope="scope">
            <span>{{scope.row.customer?scope.row.customer.phone:''}}</span>
          </template>
        </el-table-column>
      </el-table-column>

      <el-table-column label="上课信息" align="center" class-name="merge-th">
        <el-table-column align="center" label="实际代课教练">
          <template slot-scope="scope">
            <span>{{scope.row.coach?scope.row.coach.name:''}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="消课单价">
          <template slot-scope="scope">
            <span>{{scope.row.customer_course?scope.row.customer_course.real_price:''}}</span>
          </template>
        </el-table-column>
      </el-table-column>
      
      <el-table-column label="备注" align="center">
        <template slot-scope="scope">
          <span></span>
        </template>
      </el-table-column>
    </el-table>
    </div>
  </el-dialog>
</template>

<script>
import XLSX from 'xlsx'
import { privateCansleTable } from '@/api/statistics'
import { setSession } from '@/utils/auth'
import privateHeader from './privateHeader'
import { parseTime } from '@/utils/index'
export default {
  name: 'viewStaffReport',
  components: {
    privateHeader
  },
  props: {
  },
  data() {
    return {
      dialogVisible: false,
      listLoading: false,
      excelLoading: false,
      headerContent: {
        coachName: '',
        startTime: '',
        endTime: '',
        number: '',
        gym: ''
      },
      listQuery: {
      },
      tableKey: 0,
      tableList: [],
      myTable: [],
      list: [
        ['序号', '消课时间', '操作人', '课程信息', '', '', '', '', '', '客户信息', '', '上课信息', '', '备注'],
        ['', '', '', '课程名称', '教练名称', '课程价格', '课程次数（剩/总)', '应付金额', '实付金额', '会员姓名', '手机号码', '实际带课教练', '消课单价', '']
      ]
    }
  },
  mounted() {
  },
  created() {
  },
  watch: {
  },
  computed: {
  },
  methods: {
    dialogShow(obj, num, coachs) {
      this.headerContent.startTime = obj.completed_at_egt
      this.headerContent.endTime = parseTime(new Date(obj.completed_at_lt) - 86400000, '{y}-{m}-{d}')
      this.headerContent.number = num
      this.headerContent.coachName = coachs.join('，')
      this.listQuery = Object.assign({}, obj)
      this.dialogVisible = true
      this.getList()
    },
    getList() {
      this.listLoading = true
      privateCansleTable(this.listQuery).then(res => {
        this.listLoading = false
        this.tableList = res.data
      })
    },
    aaa() {
      var arr = this.list
      let mergesArr = []
      arr[0].forEach((item, index) => {
        if (item) {
          mergesArr[mergesArr.length] = {
            s: {},
            e: {}
          }
          mergesArr[mergesArr.length - 1].s.c = index
          mergesArr[mergesArr.length - 1].s.r = 0
          mergesArr[mergesArr.length - 1].e.c = index
          mergesArr[mergesArr.length - 1].e.r = 0
        } else {
          mergesArr[mergesArr.length - 1].e.c = index
        }
      })
      mergesArr.forEach((item, index) => {
        if (arr[1][item.e.c] === '') {
          mergesArr[index].e.r = 1
        }
      })
      return mergesArr
    },
    printPages() {
      var printHtml = this.$refs.myDiv.outerHTML
      setSession('employeeAchivementtext', printHtml)
      window.open(this.staticurl + 'static/protocolprint/employeeAchivement.html')
    },
    downPages(wscols, xlsxName) {
      this.excelLoading = true
      for (let i = 0; i < this.tableList.length; i++) {
        let arr1 = [
          Number(i + 1),
          this.tableList[i].created_at,
          this.tableList[i].operator ? this.tableList[i].operator.name : '',
          this.tableList[i].customer_course ? this.tableList[i].customer_course.course_name : '',
          this.tableList[i].booking_coach ? this.tableList[i].booking_coach.name : '',
          this.tableList[i].course_price ? this.tableList[i].course_price : '-',
          this.tableList[i].customer_course.residue + '/' + this.tableList[i].customer_course.quantity,
          this.tableList[i].customer_course ? this.tableList[i].customer_course.course_order ? this.tableList[i].customer_course.course_order.total_fee : '' : '',
          this.tableList[i].customer_course ? this.tableList[i].customer_course.course_order ? this.tableList[i].customer_course.course_order.real_total_fee : '' : '',
          this.tableList[i].customer ? this.tableList[i].customer.name : '',
          this.tableList[i].customer ? this.tableList[i].customer.phone : '',
          this.tableList[i].coach ? this.tableList[i].coach.name : '',
          this.tableList[i].customer_course ? Number(this.tableList[i].customer_course.real_price).toFixed(2) : '',
          ''
        ]
        this.list.push(arr1)
      }
      const ws = XLSX.utils.aoa_to_sheet(this.list)
      ws['!cols'] = [{ wch: 5 }, { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 10 }, { wch: 20 }, { wch: 10 }, { wch: 10 }, { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 10 }, { wch: 20 }]
      ws['!merges'] = this.aaa()
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, '私教消课明细表')
      /* generate file and send to client */
      this.excelLoading = false
      XLSX.writeFile(wb, '私教消课明细表' + '.xlsx')
    }
    // formatJson(filterVal, jsonData) {
    //   return jsonData.map(v => filterVal.map(j => v[j]))
    // },
    // printPages1() {
    //   this.myTable = []
    //   require.ensure([], () => {
    //     const { export_json_to_excel } = require('../../../../vendor/Export2Excel')
    //     const tHeader = ['序号', '消课时间', '操作人', '课程名称', '教练名称', '课程价格', '课程次数（剩/总)', '应付金额', '实付金额', '会员姓名', '手机号码', '实际带课教练', '消课单价', '备注']
    //     const filterVal = ['no', 'time', 'oporater', 'courseName', 'coachName', 'coursePrice', 'courseTimes', 'total_fee', 'real_total_fee', 'customerName', 'phone', 'realCoach', 'price', 'remark']
    //     for (let i = 0; i < this.tableList.length; i++) {
    //       this.myTable.push({
    //         no: i + 1,
    //         time: this.tableList[i].created_at,
    //         oporater: this.tableList[i].operator ? this.tableList[i].operator.name : '',
    //         courseName: this.tableList[i].customer_course ? this.tableList[i].customer_course.course_name : '',
    //         coachName: this.tableList[i].booking_coach ? this.tableList[i].booking_coach.name : '',
    //         coursePrice: this.tableList[i].course_price ? this.tableList[i].course_price : '-',
    //         courseTimes: this.tableList[i].customer_course.residue + '/' + this.tableList[i].customer_course.quantity,
    //         total_fee: this.tableList[i].customer_course ? this.tableList[i].customer_course.course_order ? this.tableList[i].customer_course.course_order.total_fee : '' : '',
    //         real_total_fee: this.tableList[i].customer_course ? this.tableList[i].customer_course.course_order ? this.tableList[i].customer_course.course_order.real_total_fee : '' : '',
    //         customerName: this.tableList[i].customer ? this.tableList[i].customer.name : '',
    //         phone: this.tableList[i].customer ? this.tableList[i].customer.phone : '',
    //         realCoach: this.tableList[i].coach ? this.tableList[i].coach.name : '',
    //         price: this.tableList[i].customer_course ? this.tableList[i].customer_course.real_price : '',
    //         remark: ''
    //       })
    //     }
    //     const list = this.myTable
    //     const data = this.formatJson(filterVal, list)
    //     export_json_to_excel(tHeader, data, '私教消课明细表')
    //   })
    // }
  }
}
</script>
<style lang="scss" scoped>
.mytdTotal {
  line-height: 40px;
  background: #fff;
}
.mytd {
  border-bottom: 1px solid #ddd;
  line-height: 30px;
  background: #E7EAEC;
}
</style>