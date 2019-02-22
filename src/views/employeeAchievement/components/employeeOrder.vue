<template>
  <div class="dashboard-editor-container">
    <div class="selecter-b">
      <label>
        时间：
        <el-radio-group v-model="dateMode" @change="radioGroupChage" fill="#1AB394" >
          <el-radio-button v-for="(item,key) in options" :key="key" :label="item.label"></el-radio-button>
        </el-radio-group>
      </label>
      <el-date-picker
        v-model="chooseDate"
        :type="dateType"
        :format="format"
        :clearable="false"
        :editable="false"
        :picker-options="{firstDayOfWeek:1}"
        :placeholder="title" 
        @change="changeTime"
        class="date-picker-box">
      </el-date-picker>
      <span style="margin-left:30px;font-weight:bolder;">员工：
        <el-select v-model="staffId" 
          placeholder="请选择"
          multiple
          collapse-tags
          @change="changeStaff"
          style="width:180px">
          <el-option
            v-for="(item, key) in staff"
            :key="key"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>  
      </span>
      <el-button class="back" @click="viewStaffReport" v-if="btnRoleList['6-4-1-1']"><i class="el-icon-tickets"></i> 查看概览</el-button>
    </div>

    <!-- tab切换 -->
    <div class="panel-group-box">
      <rectbox :data="boxlist" 
        v-on:choose="curChoose" 
        v-on:openbox="curOpenbox" 
        @overChange="curOverChange">
      </rectbox>
      <!-- <panel-group @handleSetLineChartData="handleSetLineChartData" :panel-value='panelValue' ref="panelGroup"></panel-group> -->
    </div>

    <!-- 折线图 -->
    <el-row style="background:#fff;padding:16px 16px 0;border:1px solid #ccc;border-bottom:none">
      <line-chart 
      :chart-data="lineChartData">
      </line-chart>
    </el-row>

    <el-table stripe 
      row-class-name='cashierTable' class="check-table"
      :key='tableKey'
      :data="tableList"
      v-loading="listLoading" 
      element-loading-text="列表正在加载中"
      border
      fit highlight-current-row
      style="width: 100%;">
      <el-table-column align="center" :label="'序号'" prop="source" width="120">
        <template slot-scope="scope">
          <span>{{scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="员工" prop="create_sort" width="150">
        <template slot-scope="scope">
          <span>{{scope.row.employee.name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="'会员卡业绩'" prop="cardno">
        <el-table-column align="center" :label="'类别'" prop="cardno" width="150">
          <template slot-scope="scope">
            <div class="mytdTotal">
              <i class="el-icon-circle-plus isIcon" v-if="!scope.row.cardTotal.isShow" @click="toShow(scope.$index, tableList, 'card')"></i>
              <i class="el-icon-remove isIcon" v-if="scope.row.cardTotal.isShow" @click="toHide(scope.$index, tableList, 'card')"></i>合计
            </div>
            <div class="mytd" v-for="(item, index) in scope.row.card" :key="index" v-if="scope.row.cardTotal.isShow">{{item.name}}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="'订单数'" sortable prop="cardno" width="150">
          <template slot-scope="scope">
            <div class="mytdTotal blue" @click="totalSingleTypeReport(scope.row.employee.id, 'card', scope.row.employee.name, scope.row.cardTotal.num, scope.row.cardTotal.money)">{{scope.row.cardTotal.num}}</div>
            <div class="mytd blue" v-for="(item, index) in scope.row.card" :key="index" @click="singleTypeReport(scope.row.employee.id, item.type)" v-if="scope.row.cardTotal.isShow">
              {{item.num}}
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="'实付金额'" sortable prop="cardno" width="150">
          <template slot-scope="scope">
            <div class="mytdTotal">{{scope.row.cardTotal.money}}</div>
            <div class="mytd" v-for="(item, index) in scope.row.card" :key="index" v-if="scope.row.cardTotal.isShow">{{item.money}}</div>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column align="center" :label="'私教课业绩'" prop="coach_id">
        <el-table-column align="center" :label="'类别'" prop="coach_id" width="120">
          <template slot-scope="scope">
            <span>{{scope.row.privateCourse.name}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="'订单数'" prop="coach_id" sortable width="120">
          <template slot-scope="scope">
            <span class="blue" @click="singleTypeReport(scope.row.employee.id, 3)">{{scope.row.privateCourse.num}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="'实付金额'" prop="coach_id" sortable width="120">
          <template slot-scope="scope">
            <span>{{scope.row.privateCourse.money}}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column align="center" label="团课业绩" prop="course_time_sort">
        <el-table-column align="center" label="类别" prop="course_time_sort">
          <template slot-scope="scope">
            <span>{{scope.row.groupCourse.name}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="订单数" prop="course_time_sort" sortable width="120">
          <template slot-scope="scope">
            <span class="blue" @click="singleTypeReport(scope.row.employee.id, 6)">{{scope.row.groupCourse.num}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="'实付金额'" prop="coach_id" sortable width="120">
          <template slot-scope="scope">
            <span>{{scope.row.groupCourse.money}}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column align="center" label="其他业绩" prop="course_time_sort">
        <el-table-column align="center" label="类别" prop="course_time_sort">
          <template slot-scope="scope">
            <div class="mytdTotal">
              <i class="el-icon-circle-plus isIcon" v-if="!scope.row.otherTotal.isShow" @click="toShow(scope.$index, tableList, 'other')"></i>
              <i class="el-icon-remove isIcon" v-if="scope.row.otherTotal.isShow" @click="toHide(scope.$index, tableList, 'other')"></i>合计
            </div>
            <div class="mytd" v-for="(item, index) in scope.row.other" :key="index" v-if="scope.row.otherTotal.isShow">{{item.name}}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="订单数" prop="course_time_sort" sortable width="120">
          <template slot-scope="scope">
            <div class="mytdTotal blue" @click="totalSingleTypeReport(scope.row.employee.id, 'other', scope.row.employee.name, scope.row.otherTotal.num, scope.row.otherTotal.money)">{{scope.row.otherTotal.num}}</div>
            <div class="mytd blue" v-for="(item, index) in scope.row.other" :key="index" @click="singleTypeReport(scope.row.employee.id, item.type)" v-if="scope.row.otherTotal.isShow">{{item.num}}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="'实付金额'" prop="coach_id" sortable width="120">
          <template slot-scope="scope">
            <div class="mytdTotal">{{scope.row.otherTotal.money}}</div>
            <div class="mytd" v-for="(item, index) in scope.row.other" :key="index" v-if="scope.row.otherTotal.isShow">{{item.money}}</div>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column align="center" label="总业绩" prop="course_time_sort">
        <el-table-column align="center" label="总订单数" prop="course_time_sort" sortable width="120">
          <template slot-scope="scope">
            <span>{{scope.row.total.num}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="'总实付金额'" prop="coach_id" sortable width="120">
          <template slot-scope="scope">
            <span>{{scope.row.total.money}}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column align="center" :label="'操作'" min-width="120" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="staffReportDetail(scope.row.employee.id, scope.row.employee.name, scope.row.total.num, scope.row.total.money)" v-if="btnRoleList['6-4-1-2']">查看明细</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- <div class="pagination-container">
      <el-pagination 
        v-if="paginationShow"
        background 
        @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
        :page-sizes="[10,20,30,50]" :page-size="listQuery.per_page" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div> -->

    <!-- 查看所有员工报表 -->
    <view-staff-report 
      ref="viewStaffReportDoc">
    </view-staff-report>

    <!-- 查看单个员工所有业绩详情 -->
    <staff-report-detail
      ref="staffReportDetailDoc" v-if="showStaffReportDetailDoc">
    </staff-report-detail>

    <!-- 订单明细（单个类别下的单个类别，例：会员卡-开卡） -->
    <single-type-report
      ref="singleTypeReportDoc">
    </single-type-report>

    <!-- 订单明细（单个类别的合计，例：会员卡） -->
    <total-single-type-report
      ref="totalSingleTypeReportDoc">
    </total-single-type-report>
  </div>
</template>

<script>
import { getAllStaff } from '@/api/course'
import { totalTypeSale, saleRunChar, salesPerformance } from '@/api/statistics'
import viewStaffReport from './props/viewStaffReport'
import staffReportDetail from './props/staffReportDetail'
import singleTypeReport from './props/singleTypeReport'
import totalSingleTypeReport from './props/totalSingleTypeReport'
import rectbox from '@/components/rectbox'
import LineChart from './props/LineChart'
import { parseTime } from '@/utils/index'
export default {
  name: '',
  components: {
    // PanelGroup,
    rectbox,
    LineChart,
    viewStaffReport,
    staffReportDetail,
    singleTypeReport,
    totalSingleTypeReport
  },
  props: {
  },
  data() {
    return {
      showStaffReportDetailDoc: false,
      btnRoleList: {},
      tableKey: 0,
      lineChartData: {
        lineVisitis: {
          lineData: []
        },
        titleData: ['总业绩走势'],
        dateTime: []
      },
      isShow: false,
      panelValue: {
        income: 0,
        opencard: 0,
        customer: 0,
        signIn: 0
      },
      options: [{
        value: 1,
        label: '日统计'
      }, {
        value: 2,
        label: '周统计'
      }, {
        value: 3,
        label: '月统计'
      }, {
        value: 4,
        label: '年统计'
      }],
      openCard: 0,
      stopCard: 0,
      renewCard: 0,
      transCard: 0,
      cabinet: 0,
      shop: 0,
      boxlist: [
        {
          text: '总业绩',
          num: 0,
          checked: true,
          bocolor: 'rgb(24, 120, 255)',
          type: '1,2,3,4,5,6,7,8,9',
          filter: 'all'
        },
        {
          text: '会员卡业绩',
          num: 0,
          checked: false,
          bocolor: 'rgb(46, 199, 201)',
          rbtn: '全部',
          type: '2,4,5,7',
          filter: 'overing',
          select: [{
            label: '全部',
            value: '2,4,5,7'
          }, {
            label: '售卡',
            value: '2'
          }, {
            label: '转卡',
            value: '4'
          }, {
            label: '停卡',
            value: '5'
          }, {
            label: '续卡',
            value: '7'
          }]
        },
        {
          text: '私教课业绩',
          num: 3,
          checked: false,
          bocolor: 'rgb(182, 162, 222)',
          type: 3,
          filter: 'unactive'
        },
        {
          text: '团课业绩',
          num: 0,
          checked: false,
          bocolor: 'rgb(90, 177, 239)',
          type: 6,
          filter: 'unactive'
        },
        {
          text: '其他业绩',
          num: 0,
          checked: false,
          bocolor: 'rgb(216, 122, 128)',
          type: '1,8,9',
          filter: 'overed',
          rbtn: '全部',
          select: [{
            label: '全部',
            value: '1,8,9'
          }, {
            label: '购物',
            value: '1'
          }, {
            label: '租柜',
            value: '8,9'
          }]
        },
      ],
      dateMode: '日统计', // 日期方式
      value: '日统计',
      openvalue: '日统计',
      dateType: 'date',
      chooseDate: new Date(),
      format: '',
      title: '请选择日期',
      staffId: [-1],
      staff: [],
      tableList: [],
      listLoading: false,
      total: 0,
      listQuery: {
        // page: 1,
        // per_page: 10,
        date_egt: parseTime(new Date(), '{y}-{m}-{d}'),
        date_lt: parseTime(new Date(new Date().getTime() + 86400000), '{y}-{m}-{d}')
      },
      tabQuery: {
        date_egt: parseTime(new Date(), '{y}-{m}-{d}'),
        date_lt: parseTime(new Date(new Date().getTime() + 86400000), '{y}-{m}-{d}')
      },
      lineQuery: {
        date_egt: parseTime(new Date(), '{y}-{m}-{d}'),
        date_lt: parseTime(new Date(new Date().getTime() + 86400000), '{y}-{m}-{d}'),
        group: 'day',
        type: '1,2,3,4,5,6,7,8,9'
      },
      staffName: ['全部'],
      isContainAll: true,
      paginationShow: true
    }
  },
  mounted() {
    this.getStaff()
    // this.__init()
  },
  created() {
    console.log(this.$route.query)
    if (this.$route.query.date_egt) {
      this.chooseDate = new Date(this.$route.query.date_egt)
      this.lineQuery.date_egt = this.$route.query.date_egt
      this.lineQuery.date_lt = this.$route.query.date_lt
      this.listQuery.date_egt = this.$route.query.date_egt
      this.listQuery.date_lt = this.$route.query.date_lt
      this.tabQuery.date_egt = this.$route.query.date_egt
      this.tabQuery.date_lt = this.$route.query.date_lt
      this.lineQuery.group = this.$route.query.group
      this.lineQuery.type = this.boxlist[this.$route.query.type].value
      for (let v of this.boxlist) {
        v.checked = false
      }
      this.boxlist[this.$route.query.type].checked = true
      if (this.$route.query.group === 'day') {
        this.dateMode = '日统计'
        this.changeType(1)
      } else if (this.$route.query.group === 'week') {
        this.dateMode = '周统计'
        this.changeType(2)
      } else if (this.$route.query.group === 'month') {
        this.dateMode = '月统计'
        this.changeType(3)
      } else if (this.$route.query.group === 'year') {
        this.dateMode = '年统计'
        this.changeType(4)
      }
    } else {
      this.__init()
    }
  },
  watch: {
  },
  computed: {
  },
  methods: {
    __init() {
      this.common.eachBtnRole(this.btnRoleList) // 按钮权限方法
      this.totalTypeSale()
      this.saleRunLineChart()
      this.getList()
    },
    // 不同业务的总销售额
    totalTypeSale() {
      totalTypeSale(this.tabQuery).then(res => {
        this.boxlist[1].num = (Number(res.data[2].real_total_fee) + Number(res.data[4].real_total_fee) + Number(res.data[5].real_total_fee) + Number(res.data[7].real_total_fee)).toFixed(2)
        this.boxlist[2].num = (Number(res.data[3].real_total_fee)).toFixed(2)
        this.boxlist[3].num = (Number(res.data[6].real_total_fee)).toFixed(2)
        this.boxlist[4].num = (Number(res.data[1].real_total_fee) + Number(res.data[8].real_total_fee) + Number(res.data[9].real_total_fee)).toFixed(2)
        this.boxlist[0].num = (Number(this.boxlist[1].num) + Number(this.boxlist[2].num) + Number(this.boxlist[3].num) + Number(this.boxlist[4].num)).toFixed(2)
        this.openCard = Number(res.data[2].real_total_fee).toFixed(2)
        this.stopCard = Number(res.data[5].real_total_fee).toFixed(2)
        this.renewCard = Number(res.data[7].real_total_fee).toFixed(2)
        this.transCard = Number(res.data[4].real_total_fee).toFixed(2)
        this.cabinet = (Number(res.data[8].real_total_fee) + Number(res.data[9].real_total_fee)).toFixed(2)
        this.shop = Number(res.data[1].real_total_fee).toFixed(2)
      })
    },
    // 折线图
    saleRunLineChart() {
      this.lineChartData.lineVisitis.lineData = []
      this.lineChartData.dateTime = []
      saleRunChar(this.lineQuery).then(res => {
        if (this.lineQuery.group === 'day') {
          for (let i = 0; i < res.data.length; i++) {
            this.lineChartData.dateTime.push(res.data[i].hour)
          }
        }
        if (this.lineQuery.group === 'week') {
          this.lineChartData.dateTime.push('星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期天')
        }
        if (this.lineQuery.group === 'month') {
          for (let i = 0; i < res.data.length; i++) {
            this.lineChartData.dateTime.push(res.data[i].date)
          }
        }
        if (this.lineQuery.group === 'year') {
          for (let i = 0; i < res.data.length; i++) {
            this.lineChartData.dateTime.push(res.data[i].month)
          }
        }
        for (let i = 0; i < res.data.length; i++) {
          this.lineChartData.lineVisitis.lineData.push(res.data[i].real_total_fee)
        }
      })
    },
    // 销售业绩
    getList() {
      this.listLoading = true
      salesPerformance(this.listQuery).then(res => {
        this.listLoading = false
        this.tableList = []
        for (let i = 0; i < res.data.length; i++) {
          let cardNum = res.data[i][2].order_count + res.data[i][4].order_count + res.data[i][5].order_count + res.data[i][7].order_count
          let cardMoney = (Number(res.data[i][2].real_total_fee) + Number(res.data[i][4].real_total_fee) + Number(res.data[i][5].real_total_fee) + Number(res.data[i][7].real_total_fee)).toFixed(2)
          let otherNum = Number(res.data[i][8].order_count) + res.data[i][9].order_count + res.data[i][1].order_count
          let otherMoney = (Number(res.data[i][8].real_total_fee) + Number(res.data[i][9].real_total_fee) + Number(res.data[i][1].real_total_fee)).toFixed(2)
          let totalNum = cardNum + otherNum + res.data[i][3].order_count + res.data[i][6].order_count
          let totalMoney = Number(cardMoney) + Number(otherMoney) + Number(res.data[i][3].real_total_fee) + Number(res.data[i][6].real_total_fee)
          this.tableList.push({
            employee: res.data[i].employee,
            cardTotal: { num: cardNum, money: cardMoney, isShow: false },
            card: [
              { name: '售卡', num: res.data[i][2].order_count, money: Number(res.data[i][2].real_total_fee).toFixed(2), type: 2 },
              { name: '转卡', num: res.data[i][4].order_count, money: Number(res.data[i][4].real_total_fee).toFixed(2), type: 4 },
              { name: '停卡', num: res.data[i][5].order_count, money: Number(res.data[i][5].real_total_fee).toFixed(2), type: 5 },
              { name: '续卡', num: res.data[i][7].order_count, money: Number(res.data[i][7].real_total_fee).toFixed(2), type: 7 }],
            privateCourse: { name: '售课', num: res.data[i][3].order_count, money: Number(res.data[i][3].real_total_fee) },
            groupCourse: { name: '售课', num: res.data[i][6].order_count, money: Number(res.data[i][6].real_total_fee).toFixed(2) },
            otherTotal: { num: otherNum, money: otherMoney, isShow: false },
            other: [
              { name: '租柜', num: Number(res.data[i][8].order_count) + Number(res.data[i][9].order_count), money: (Number(res.data[i][8].real_total_fee) + Number(res.data[i][9].real_total_fee)).toFixed(2), type: '8,9' },
              { name: '购物', num: res.data[i][1].order_count, money: Number(res.data[i][1].real_total_fee).toFixed(2), type: 1 }],
            total: { num: totalNum, money: totalMoney.toFixed(2) }
          })
        }
      })
    },
    // 查询所有销售员工
    getStaff() {
      getAllStaff().then(response => {
        let data = response.data
        data.map(item => {
          // 获取操作人
          this.staff.push({ label: item.name, value: item.id })
        })
        this.staff.unshift({ label: '全部', value: -1 })
      })
    },
    toShow(index, obj, type) {
      if (type === 'card') {
        this.tableList[index].cardTotal.isShow = true
      } else if (type === 'other') {
        this.tableList[index].otherTotal.isShow = true
      }
    },
    toHide(index, obj, type) {
      if (type === 'card') {
        this.tableList[index].cardTotal.isShow = false
      } else if (type === 'other') {
        this.tableList[index].otherTotal.isShow = false
      }
    },
    radioGroupChage(value) {
      let obj = this.options.filter(item => {
        return item.label === value
      })
      this.changeType(obj[0].value)
    },
    // 时间选择
    changeTime(val) {
      let month = parseTime(new Date(val), '{y}-{m}').split('-')[1]
      let nowYear = parseTime(new Date(val), '{y}-{m}').split('-')[0]
      let week = new Date(this.chooseDate).getDay()
      if (this.dateType === 'date') {
        this.tabQuery.date_egt = parseTime(new Date(val), '{y}-{m}-{d}')
        this.tabQuery.date_lt = parseTime(new Date(new Date(val).getTime() + 86400000), '{y}-{m}-{d}')
      } else if (this.dateType === 'week') {
        this.tabQuery.date_egt = parseTime(new Date(val) - (week - 1) * 86400000, '{y}-{m}-{d}')
        this.tabQuery.date_lt = parseTime(new Date(new Date(val).getTime() + (7 - week + 1) * 86400000), '{y}-{m}-{d}')
      } else if (this.dateType === 'month') {
        this.tabQuery.date_egt = nowYear + '-' + month + '-01'
        if (Number(month) === 12) {
          this.tabQuery.date_lt = (nowYear + 1) + '-' + '01-01'
        } else {
          this.tabQuery.date_lt = nowYear + '-' + (Number(month) >= 9 ? Number(month) + 1 : '0' + (Number(month) + 1)) + '-01'
        }
        console.log(this.tabQuery)
      } else if (this.dateType === 'year') {
        this.tabQuery.date_egt = nowYear + '-' + '01-01'
        this.tabQuery.date_lt = (Number(nowYear) + 1) + '-' + '01-01'
      }
      this.lineQuery.date_egt = this.tabQuery.date_egt
      this.lineQuery.date_lt = this.tabQuery.date_lt
      this.listQuery.date_egt = this.tabQuery.date_egt
      this.listQuery.date_lt = this.tabQuery.date_lt
      this.__init()
    },
    // 时间类型选择
    changeType(value) {
      let month = parseTime(this.chooseDate, '{y}-{m}').split('-')[1]
      let nowYear = parseTime(this.chooseDate, '{y}-{m}').split('-')[0]
      let week = new Date(this.chooseDate).getDay()
      switch (value) {
        case 1: {
          this.dateType = 'date'
          this.format = 'yyyy 年 MM 月 dd 日'
          this.title = '请选择日期'
          this.tabQuery.date_egt = parseTime(new Date(this.chooseDate), '{y}-{m}-{d}')
          this.tabQuery.date_lt = parseTime(new Date(new Date(this.chooseDate).getTime() + 86400000), '{y}-{m}-{d}')
          this.lineQuery.group = 'day'
          break
        }
        case 2: {
          this.dateType = 'week'
          this.format = 'yyyy 第 WW 周'
          this.title = '选择周'
          this.tabQuery.date_egt = parseTime(new Date(this.chooseDate) - (week - 1) * 86400000, '{y}-{m}-{d}')
          this.tabQuery.date_lt = parseTime(new Date(new Date(this.chooseDate).getTime() + (7 - week + 1) * 86400000), '{y}-{m}-{d}')
          this.lineQuery.group = 'week'
          break
        }
        case 3: {
          this.dateType = 'month'
          this.format = 'yyyy 年 MM 月'
          this.title = '选择月'
          this.tabQuery.date_egt = nowYear + '-' + month + '-01'
          if (Number(month) === 12) {
            this.tabQuery.date_lt = (nowYear + 1) + '-' + '01-01'
          } else {
            this.tabQuery.date_lt = nowYear + '-' + (month > 9 ? Number(month) + 1 : month) + '-01'
          }
          this.lineQuery.group = 'month'
          break
        }
        case 4:
          this.dateType = 'year'
          this.format = 'yyyy 年'
          this.title = '选择年'
          this.tabQuery.date_egt = nowYear + '-' + '01-01'
          this.tabQuery.date_lt = (Number(nowYear) + 1) + '-' + '01-01'
          this.lineQuery.group = 'year'
          break
      }
      this.lineQuery.date_egt = this.tabQuery.date_egt
      this.lineQuery.date_lt = this.tabQuery.date_lt
      this.listQuery.date_egt = this.tabQuery.date_egt
      this.listQuery.date_lt = this.tabQuery.date_lt
      this.__init()
    },
    curOverChange(obj) {
      // 右上角 筛选结果条件触发
      this.boxlist[obj.fatherIndex].rbtn = obj.label
      this.curChoose(obj.fatherIndex, obj)
    },
    curChoose(index, obj) {
      console.log(index)
      for (let v of this.boxlist) {
        v.checked = false
      }
      if (obj) {
        if (index === 1) {
          if (obj.value === '2') {
            this.boxlist[1].num = this.openCard
          } else if (obj.value === '4') {
            this.boxlist[1].num = this.transCard
          } else if (obj.value === '5') {
            this.boxlist[1].num = this.stopCard
          } else if (obj.value === '7') {
            this.boxlist[1].num = this.renewCard
          } else {
            this.boxlist[1].num = (Number(this.openCard) + Number(this.transCard) + Number(this.stopCard) + Number(this.renewCard)).toFixed(2)
          }
        }
        if (index === 4) {
          if (obj.value === '1') {
            this.boxlist[4].num = this.shop
          } else if (obj.value === '8,9') {
            this.boxlist[4].num = this.cabinet
          } else {
            this.boxlist[4].num = (Number(this.shop) + Number(this.cabinet)).toFixed(2)
          }
        }
        this.lineQuery.type = obj.value
      } else {
        this.lineQuery.type = this.boxlist[index].type
      }
      this.boxlist[index].checked = true
      if (this.boxlist[index].type === '1,2,3,4,5,6,7,8,9') {
        this.lineChartData.titleData = ['总业绩走势']
      } else if (this.boxlist[index].type === '2,4,5,7') {
        this.lineChartData.titleData = ['会员卡业绩走势']
      } else if (String(this.boxlist[index].type) === '3') {
        this.lineChartData.titleData = ['私教课业绩走势']
      } else if (String(this.boxlist[index].type) === '6') {
        this.lineChartData.titleData = ['团课业绩走势']
      } else if (this.boxlist[index].type === '1,8,9') {
        this.lineChartData.titleData = ['其他业绩走势']
      }
      this.saleRunLineChart()
    },
    curOpenbox(index) {
      // 点击右上角筛选条件 触发
      this.lineQuery.type = this.boxlist[index].value
    },
    changeStaff(val) {
      this.staffName = []
      // 定义一个变量，用来存储当前下拉框是否选中了全部
      if (this.isContainAll) {
        // 只有下拉框的值发生了变化才会进入此方法
        // 如果之前选中了全部，则变化后肯定不包含全部了
        this.isContainAll = false
        // 则删除第一个全部
        this.staffId.splice(0, 1)
      } else {
        // 如果之前没有选中全部
        // 判断此次是否选中了全部
        this.isContainAll = this.staffId.some(value => value === -1)
        // 如果此次选中了全部
        if (this.isContainAll) {
          // 则去除其他，只保留全部，默认value=-1 是全部
          this.staffId = [-1]
        } else {
          // 如果当前不包含全部，则判断是否其他的七个日期全选了
          if (this.staffId.length === this.staff.length - 1) {
            // 如果其他员工全选了，则也将当前置为全部
            this.staffId = [-1]
            this.isContainAll = true
          }
        }
      }
      // 当没有选中任何教练时，将当前置为全部
      if (this.staffId.length === 0) {
        this.staffId = [-1]
        this.isContainAll = true
      }
      // 如果选择全部
      if (this.isContainAll === true) {
        // 删除员工字段
        delete this.tabQuery.sell_id
        delete this.lineQuery.sell_id
        delete this.listQuery.sell_id
        this.staffName = ['全部']
      } else {
        this.tabQuery.sell_id = this.staffId.join(',')
        this.lineQuery.sell_id = this.tabQuery.sell_id
        this.listQuery.sell_id = this.tabQuery.sell_id
        // 获得选中教练的姓名
        for (let i = 0; i < this.staffId.length; i++) {
          let obj = this.staff.find((item) => {
            return item.value === this.staffId[i]
          })
          this.$set(this.staffName, i, obj.label)
        }
      }
      this.__init()
    },
    viewStaffReport() {
      let order = 0
      let money = 0
      for (let j = 0; j < this.tableList.length; j++) {
        order = order + Number(this.tableList[j].total.num)
        money = money + Number(this.tableList[j].total.money)
      }
      this.$refs.viewStaffReportDoc.dialogShow(this.listQuery, order, money, this.staffName)
    },
    staffReportDetail(id, name, order, money) {
      this.showStaffReportDetailDoc = true
      this.$nextTick(() => {
        this.$refs.staffReportDetailDoc.dialogShow(id, name, this.listQuery, order, money)
      })
    },
    singleTypeReport(id, type) {
      this.$refs.singleTypeReportDoc.dialogShow(id, type, this.listQuery)
    },
    totalSingleTypeReport(id, type, name, order, money) {
      this.$refs.totalSingleTypeReportDoc.dialogShow(id, type, name, this.listQuery, order, money)
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
    }
  }
}
</script>
<style lang="scss" scoped>
.dashboard-editor-container {
  // padding: 0 32px 0 0;
  background-color: #f0f0f0;
  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    border: 1px solid #cccccc;
  }
}
.selecter-b {
  // height: 46px;
  // width: 100%;
  line-height: 44px;
  background: #fff;
  padding: 10px 20px;
  border: 1px solid #cccccc;
  label {
    color: #333333;
  }
}
.check-table {
  margin-top: 10px;
}
.panel-group-box {
  background: #fff;
  border: 1px solid #cccccc;
  border-top: none;
  padding: 20px;
  // margin-left: -32px;
  // margin-right: -32px;
  margin-bottom: 30px;
  overflow: hidden;
  /deep/ .cursorbox {
    width: 19%;
  }
}
.back {
  background: #000;
  border: 1px solid #000;
  color: #fff;
  margin-left: 15px;
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
.blue {
  color: #1878E1;
  cursor: pointer;
}
.isIcon {
  margin-right: 5px;
  color: #999;
  cursor: pointer;
}
</style>