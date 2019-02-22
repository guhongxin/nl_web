<template>
  <el-dialog
    title="查看报表"
    :visible.sync="dialogVisible"
    width="1400px"
    class="report-dialog" :close-on-click-modal="false">
    <div ref="myDiv">
      <div>
        <title-header
        @printPages='printPages'
        :headerContent='headerContent'></title-header>
      </div>

      <div class="table-box">
        <el-table stripe 
          row-class-name='cashierTable' class="check-table"
          :key='tableKey'
          :data="tableList"
          v-loading="listLoading" 
          element-loading-text="列表正在加载中"
          border
          fit highlight-current-row
          style="width: 100%;">
          <el-table-column align="center" :label="'序号'" prop="source">
            <template slot-scope="scope">
              <span>{{scope.$index + 1}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="员工" prop="create_sort">
            <template slot-scope="scope">
              <span>{{scope.row.employee.name}}</span>
            </template>
          </el-table-column>
          <el-table-column column-key="sex" align="center" :label="'会员卡业绩'" prop="cardno">
            <el-table-column column-key="sex" align="center" :label="'类别'" prop="cardno">
              <template slot-scope="scope">
                <div class="mytdTotal">合计</div>
                <div class="mytd" v-for="(item, index) in scope.row.card" :key="index">{{item.name}}</div>
              </template>
            </el-table-column>
            <el-table-column column-key="sex" align="center" :label="'订单数'" prop="cardno">
              <template slot-scope="scope">
                <div class="mytdTotal">{{scope.row.cardTotal.num}}</div>
                <div class="mytd" v-for="(item, index) in scope.row.card" :key="index">{{item.num}}</div>
              </template>
            </el-table-column>
            <el-table-column column-key="sex" align="center" :label="'实付金额'" prop="cardno">
              <template slot-scope="scope">
                <div class="mytdTotal">{{scope.row.cardTotal.money}}</div>
                <div class="mytd" v-for="(item, index) in scope.row.card" :key="index">{{item.money}}</div>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column align="center" :label="'私教课业绩'" prop="coach_id">
            <el-table-column align="center" :label="'类别'" prop="coach_id">
              <template slot-scope="scope">
                <span>售课</span>
              </template>
            </el-table-column>
            <el-table-column align="center" :label="'订单数'" prop="coach_id">
              <template slot-scope="scope">
                <span>{{scope.row.privateCourse.num}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" :label="'实付金额'" prop="coach_id">
              <template slot-scope="scope">
                <span>{{scope.row.privateCourse.money}}</span>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column align="center" label="团课业绩" prop="course_time_sort">
            <el-table-column align="center" label="类别" prop="course_time_sort">
              <template slot-scope="scope">
                <span>售课</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="订单数" prop="course_time_sort">
              <template slot-scope="scope">
                <span>{{scope.row.groupCourse.num}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" :label="'实付金额'" prop="coach_id">
              <template slot-scope="scope">
                <span>{{scope.row.groupCourse.money}}</span>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column align="center" label="其他业绩" prop="course_time_sort">
            <el-table-column column-key="sex" align="center" :label="'类别'" prop="cardno">
              <template slot-scope="scope">
                <div class="mytdTotal">合计</div>
                <div class="mytd" v-for="(item, index) in scope.row.other" :key="index">{{item.name}}</div>
              </template>
            </el-table-column>
            <el-table-column column-key="sex" align="center" :label="'订单数'" prop="cardno">
              <template slot-scope="scope">
                <div class="mytdTotal">{{scope.row.otherTotal.num}}</div>
                <div class="mytd" v-for="(item, index) in scope.row.other" :key="index">{{item.num}}</div>
              </template>
            </el-table-column>
            <el-table-column column-key="sex" align="center" :label="'实付金额'" prop="cardno">
              <template slot-scope="scope">
                <div class="mytdTotal">{{scope.row.otherTotal.money}}</div>
                <div class="mytd" v-for="(item, index) in scope.row.other" :key="index">{{item.money}}</div>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column align="center" label="总业绩" prop="course_time_sort">
            <el-table-column align="center" label="总订单数" prop="course_time_sort">
              <template slot-scope="scope">
                <span>{{scope.row.total.num}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" :label="'总实付金额'" prop="coach_id">
              <template slot-scope="scope">
                <span>{{scope.row.total.money}}</span>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column align="center" :label="'备注'" min-width="80" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <span></span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- <div class="pagination-container">
      <el-pagination 
        v-if="paginationShow"
        background 
        @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
        :page-sizes="[10,50,100,200,1000]" :page-size="listQuery.per_page" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div> -->
    
  </el-dialog>
</template>

<script>
import { salesPerformance } from '@/api/statistics'
import { setSession } from '@/utils/auth'
import titleHeader from './titleHeader'
import { parseTime } from '@/utils/index'
export default {
  name: 'viewStaffReport',
  components: {
    titleHeader
  },
  props: {
  },
  data() {
    return {
      dialogVisible: false,
      listLoading: false,
      headerContent: {
        name: '',
        startTime: '',
        endTime: '',
        order: '',
        type: '会员卡业绩（售卡、转卡、停卡、续卡），私教课业绩（售课），团课业绩（售课），其他业绩（购物、租柜）',
        money: '',
        gym: ''
      },
      total: null,
      listQuery: {
      },
      tableKey: 0,
      tableList: [],
      paginationShow: true
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
    dialogShow(obj, order, money, staffName) {
      this.headerContent.startTime = obj.date_egt
      this.headerContent.endTime = parseTime(new Date(obj.date_lt) - 86400000, '{y}-{m}-{d}')
      this.headerContent.order = order
      this.headerContent.money = Number(money).toFixed(2)
      this.headerContent.name = staffName.join('，')
      this.listQuery = obj
      this.dialogVisible = true
      this.getList()
    },
    getList() {
      this.listLoading = true
      salesPerformance(this.listQuery).then(res => {
        this.listLoading = false
        this.tableList = []
        // if (!this.listQuery.sell_id) {
        //   this.headerContent.name = '全部'
        // }
        for (let i = 0; i < res.data.length; i++) {
          let cardNum = res.data[i][2].order_count + res.data[i][4].order_count + res.data[i][5].order_count + res.data[i][7].order_count
          let cardMoney = (Number(res.data[i][2].real_total_fee) + Number(res.data[i][4].real_total_fee) + Number(res.data[i][5].real_total_fee) + Number(res.data[i][7].real_total_fee)).toFixed(2)
          let otherNum = Number(res.data[i][8].order_count) + res.data[i][9].order_count + res.data[i][1].order_count
          let otherMoney = (Number(res.data[i][8].real_total_fee) + Number(res.data[i][9].real_total_fee) + Number(res.data[i][1].real_total_fee)).toFixed(2)
          let totalNum = cardNum + otherNum + res.data[i][3].order_count + res.data[i][6].order_count
          let totalMoney = (Number(cardMoney) + Number(otherMoney) + Number(res.data[i][3].real_total_fee) + Number(res.data[i][6].real_total_fee)).toFixed(2)
          this.tableList.push({
            employee: res.data[i].employee,
            cardTotal: { num: cardNum, money: cardMoney },
            card: [
              { name: '售卡', num: res.data[i][2].order_count, money: Number(res.data[i][2].real_total_fee).toFixed(2) },
              { name: '转卡', num: res.data[i][4].order_count, money: Number(res.data[i][4].real_total_fee).toFixed(2) },
              { name: '停卡', num: res.data[i][5].order_count, money: Number(res.data[i][5].real_total_fee).toFixed(2) },
              { name: '续卡', num: res.data[i][7].order_count, money: Number(res.data[i][7].real_total_fee).toFixed(2) }],
            privateCourse: { name: '售课', num: res.data[i][3].order_count, money: Number(res.data[i][3].real_total_fee).toFixed(2) },
            groupCourse: { name: '售课', num: res.data[i][6].order_count, money: Number(res.data[i][6].real_total_fee).toFixed(2) },
            otherTotal: { num: otherNum, money: otherMoney },
            other: [
              { name: '租柜', num: Number(res.data[i][8].order_count) + Number(res.data[i][9].order_count), money: (Number(res.data[i][5].real_total_fee) + Number(res.data[i][9].real_total_fee)).toFixed(2) },
              { name: '购物', num: res.data[i][1].order_count, money: Number(res.data[i][1].real_total_fee).toFixed(2) }],
            total: { num: totalNum, money: totalMoney }
          })
        }
      })
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      // this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.per_page = val
      // this.getList()
    },
    pageInit() {
      this.paginationShow = false
      this.$nextTick(() => {
        this.paginationShow = true
      })
    },
    printPages() {
      var printHtml = this.$refs.myDiv.outerHTML
      setSession('employeeAchivementtext', printHtml)
      window.open(this.staticurl + 'static/protocolprint/employeeAchivement.html')
    }
  }
}
</script>
<style lang="scss" scoped>
.table-box {
  max-height: 400px;
  overflow: auto;
  margin-top: 20px;
}
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