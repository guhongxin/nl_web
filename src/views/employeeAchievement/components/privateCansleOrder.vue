
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
      <span style="margin-left:30px;font-weight:bolder;">教练：
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
      <el-button class="back" @click="handleViewReport" v-if="btnRoleList['6-4-2-1']"><i class="el-icon-tickets"></i> 查看报表</el-button>
    </div>
    <el-row class="chart-box">
      <!-- 饼状图 -->
      <el-col :xs="24" :sm="24" :lg="10">
        <div class="pie-chart">
          <pie-chart :chart-data="pieChartData"></pie-chart>
          <div class="pieDiv">
            <span style="margin-right:30px;">消课节数：<b>{{cansleNum}}节</b></span>
            <span>教练人数：<b>{{coachNum}}人</b></span>
          </div>
        </div>
      </el-col>
      <!-- 柱状图 -->
      <el-col :xs="24" :sm="24" :lg="14">
        <div class="bar-chart">
          <bar-chart :chart-data="barChartData"></bar-chart>
        </div>
      </el-col>
    </el-row>

    <div class="tagbox" v-if="tags.length">
      <div class="tablesmall" v-if="common.getClass('span', 'mar10').length">共查找到<span v-text="total"></span>条</div>
      <span class="mar10" v-if="tag" v-for="(tag, index) in tags" :key="index">
        <el-tag
        v-if="tag"
        closable
        :type="tag.type"
        @close="tagclose(tag, index)">
        {{tag.name}}
      </el-tag>
      </span>
    </div>
    <el-table ref="staffTable" @filter-change="filterChange" stripe :key='tableKey' :data="tableList" v-loading="listLoading" element-loading-text="列表正在加载中" fit highlight-current-row
      style="width: 100%;" header-cell-class-name="bindonce" border class="check-table">
      <el-table-column align="center"
      label="序号">
        <template slot-scope="scope">
          <span>{{scope.$index + 1}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="'消课时间'" width="200">
        <template slot-scope="scope">
          <span>{{scope.row.completed_at}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="'操作人'" width="120">
        <template slot-scope="scope">
          <span>{{scope.row.operator?scope.row.operator.name:''}}</span>
        </template>
      </el-table-column>

      <el-table-column label="课程信息" align="center" class-name="merge-th">
        <el-table-column align="center" :label="'课程名称'" column-key="course_id" width="120"
        prop="course_id" :filters="courseNameOption" filter-placement="bottom-end" :filter-multiple="false">
          <template slot-scope="scope">
            <span>{{scope.row.customer_course?scope.row.customer_course.course_name:''}}</span>
          </template>
        </el-table-column>
        <el-table-column column-key="coach_id" align="center" :label="'教练名称'" width="120">
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
        <el-table-column align="center" label="实际代课教练" width="140">
          <template slot-scope="scope">
            <span>{{scope.row.coach?scope.row.coach.name:''}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="消课单价<i title='实付金额/课程总节数' class='el-icon-question question' style='margin-left:3px;font-size:18px;color:#b4c7d5;cursor:pointer;'></i>" width="120">
          <template slot-scope="scope">
            <span>{{scope.row.customer_course?Number(scope.row.customer_course.real_price).toFixed(2):''}}</span>
          </template>
        </el-table-column>
      </el-table-column>
      
      <el-table-column label="备注" align="center">
        <template slot-scope="scope">
          <span></span>
        </template>
      </el-table-column>
    </el-table>

    <!-- 查看所有员工报表 -->
    <view-private-report 
      ref="viewPrivateReportDoc">
    </view-private-report>
    
  </div>
</template>

<script>
import { employeeList } from '@/api/employee'
import { privateCourseList } from '@/api/course'
import { privateCanslePie, privateCansleBar, privateCansleTable } from '@/api/statistics'
import viewPrivateReport from './props/viewPrivateCansleReport'
import PieChart from './props/PieChart'
import BarChart from './props/BarChart'
import { parseTime } from '@/utils/index'
export default {
  name: '',
  components: {
    PieChart,
    BarChart,
    viewPrivateReport
  },
  props: {
  },
  data() {
    return {
      btnRoleList: {},
      total: null,
      tableKey: 0,
      tableList: [],
      listLoading: false,
      tags: [],
      courseNameOption: [],
      cansleNum: '',
      coachNum: '',
      pieParams: {
        completed_at_egt: parseTime(new Date(), '{y}-{m}-{d}'),
        completed_at_lt: parseTime(new Date(new Date().getTime() + 86400000), '{y}-{m}-{d}')
      },
      barParams: {
        completed_at_egt: parseTime(new Date(), '{y}-{m}-{d}'),
        completed_at_lt: parseTime(new Date(new Date().getTime() + 86400000), '{y}-{m}-{d}'),
        group: 'day'
      },
      listQuery: {
        completed_at_egt: parseTime(new Date(), '{y}-{m}-{d}'),
        completed_at_lt: parseTime(new Date(new Date().getTime() + 86400000), '{y}-{m}-{d}')
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
      dateMode: '日统计', // 日期方式
      value: '日统计',
      openvalue: '日统计',
      dateType: 'date',
      chooseDate: new Date(),
      format: '',
      title: '请选择日期',
      staffId: [-1],
      // staffArray: [],
      staff: [],
      pieChartData: {
        titleData: [],
        data: []
      },
      barChartData: {
        dateTime: [],
        data: []
      },
      searchSelect: [{
        text: '教练名称',
        value: 'coach_id'
      }],
      isContainAll: true,
      staffName: ['全部']
    }
  },
  created() {
  },
  mounted() {
    this.getStaff()
    this.getPrivateCourse()
    this.__init()
    this.common.eachBtnRole(this.btnRoleList) // 按钮权限方法
  },
  methods: {
    __init() {
      this.pieChartList()
      this.barChartList()
      this.getList()
    },
    // 查询所有销售员工
    getStaff() {
      employeeList().then(response => {
        let data = response.data
        for (let i = 0; i < data.length; i++) {
          if (data[i].post === 1) { // 教练
            this.staff.push({ label: data[i].name, value: data[i].id })
          }
        }
        this.staff.unshift({ label: '全部', value: -1 })
      })
    },
    getPrivateCourse() {
      privateCourseList().then(response => {
        for (let i = 0; i < response.data.length; i++) {
          this.courseNameOption.push({ text: response.data[i].name, value: response.data[i].id + ',' + response.data[i].name, class: 'ccourse_id' })
        }
      })
    },
    // 饼状图
    pieChartList() {
      this.pieChartData.titleData = []
      privateCanslePie(this.pieParams).then(res => {
        if (res.data[0].length) {
          this.pieChartData.data = res.data[0]
          for (let i = 0; i < res.data[0].length; i++) {
            this.pieChartData.titleData.push(res.data[0][i].name)
          }
        } else {
          this.pieChartData.data = [{ name: '私教消课', value: 0 }]
        }
        this.cansleNum = res.data[1].value
        this.coachNum = res.data[2].value
      })
    },
    // 柱状图
    barChartList() {
      privateCansleBar(this.barParams).then(res => {
        let infot = res.data
        this.barChartData.dateTime = []
        this.barChartData.data = []
        var onlyLen = new Set()
        for (let item of infot) {
          let name = ''
          if (this.barParams.group === 'day') {
            name = item.x + ':00'
          } else if (this.barParams.group === 'week') {
            let week = ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
            name = week[item.x]
          } else if (this.barParams.group === 'year') {
            name = item.x + '月'
          } else {
            name = item.x
          }
          this.barChartData.dateTime.push(name)
          for (let current of item.info) {
            onlyLen.add(current.name)
          }
        }
        for (let item of onlyLen) {
          this.barChartData.data.push({
            name: item,
            type: 'bar',
            stack: 'ceshi',
            data: [],
            animationDuration: 6000
          })
        }
        for (let i = 0; i < infot.length; i++) {
          for (let j = 0; j < this.barChartData.data.length; j++) {
            var curname = this.barChartData.data[j].name
            var curval = 0
            for (var current of infot[i].info) {
              if (curname === current.name) {
                curval = current.value
                this.barChartData.data[j].data[i] = curval
              }
            }
          }
        }
      })
    },
    getList() {
      this.listLoading = true
      privateCansleTable(this.listQuery).then(res => {
        this.listLoading = false
        this.total = res.data.length
        this.tableList = res.data
      })
    },
    handleViewReport() {
      this.$refs.viewPrivateReportDoc.dialogShow(this.listQuery, this.cansleNum, this.staffName)
    },
    // 选择教练
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
        delete this.pieParams.coach_id_in
        delete this.barParams.coach_id_in
        delete this.listQuery.coach_id_in
        this.staffName = ['全部']
      } else {
        this.pieParams.coach_id_in = this.staffId.join(',')
        this.barParams.coach_id_in = this.pieParams.coach_id_in
        this.listQuery.coach_id_in = this.pieParams.coach_id_in
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
        this.pieParams.completed_at_egt = parseTime(new Date(this.chooseDate), '{y}-{m}-{d}')
        this.pieParams.completed_at_lt = parseTime(new Date(new Date(this.chooseDate).getTime() + 86400000), '{y}-{m}-{d}')
      } else if (this.dateType === 'week') {
        this.pieParams.completed_at_egt = parseTime(new Date(this.chooseDate) - (week - 1) * 86400000, '{y}-{m}-{d}')
        this.pieParams.completed_at_lt = parseTime(new Date(new Date(this.chooseDate).getTime() + (7 - week + 1) * 86400000), '{y}-{m}-{d}')
      } else if (this.dateType === 'month') {
        this.pieParams.completed_at_egt = nowYear + '-' + month + '-01'
        if (Number(month) === 12) {
          this.pieParams.completed_at_lt = (nowYear + 1) + '-' + '01-01'
        } else {
          this.pieParams.completed_at_lt = nowYear + '-' + (month >= 9 ? Number(month) + 1 : '0' + (Number(month) + 1)) + '-01'
        }
      } else if (this.dateType === 'year') {
        this.pieParams.completed_at_egt = nowYear + '-' + '01-01'
        this.pieParams.completed_at_lt = (Number(nowYear) + 1) + '-' + '01-01'
      }
      this.barParams.completed_at_egt = this.pieParams.completed_at_egt
      this.barParams.completed_at_lt = this.pieParams.completed_at_lt
      this.listQuery.completed_at_egt = this.pieParams.completed_at_egt
      this.listQuery.completed_at_lt = this.pieParams.completed_at_lt
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
          this.pieParams.completed_at_egt = parseTime(new Date(this.chooseDate), '{y}-{m}-{d}')
          this.pieParams.completed_at_lt = parseTime(new Date(new Date(this.chooseDate).getTime() + 86400000), '{y}-{m}-{d}')
          this.barParams.group = 'day'
          break
        }
        case 2: {
          this.dateType = 'week'
          this.format = 'yyyy 第 WW 周'
          this.title = '选择周'
          this.pieParams.completed_at_egt = parseTime(new Date(this.chooseDate) - (week - 1) * 86400000, '{y}-{m}-{d}')
          this.pieParams.completed_at_lt = parseTime(new Date(new Date(this.chooseDate).getTime() + (7 - week + 1) * 86400000), '{y}-{m}-{d}')
          this.barParams.group = 'week'
          break
        }
        case 3: {
          this.dateType = 'month'
          this.format = 'yyyy 年 MM 月'
          this.title = '选择月'
          this.pieParams.completed_at_egt = nowYear + '-' + month + '-01'
          if (Number(month) === 12) {
            this.pieParams.completed_at_egt = (nowYear + 1) + '-' + '01-01'
          } else {
            this.pieParams.completed_at_lt = nowYear + '-' + (month >= 9 ? Number(month) + 1 : '0' + (Number(month) + 1)) + '-01'
          }
          this.barParams.group = 'month'
          break
        }
        case 4:
          this.dateType = 'year'
          this.format = 'yyyy 年'
          this.title = '选择年'
          this.pieParams.completed_at_egt = nowYear + '-' + '01-01'
          this.pieParams.completed_at_lt = (Number(nowYear) + 1) + '-' + '01-01'
          this.barParams.group = 'year'
          break
      }
      this.barParams.completed_at_egt = this.pieParams.completed_at_egt
      this.barParams.completed_at_lt = this.pieParams.completed_at_lt
      this.listQuery.completed_at_egt = this.pieParams.completed_at_egt
      this.listQuery.completed_at_lt = this.pieParams.completed_at_lt
      this.__init()
    },
    tagclose(tag, index) {
      delete this.tags[index]
      if (tag.type === 'checkbox_time') {
        for (let o in tag.param) {
          delete this.listQuery[o]
        }
        this.getList()
      } else {
        delete this.listQuery[tag.type]
        this.common.getClass('li', 'c' + tag.type)[0].click()
      }
    },
    filterChange(data) {
      for (let key in data) {
        if (data[key].length !== 0) {
          if (data[key][0].split(',')) {
            this.listQuery[key] = data[key][0].split(',')[0]
          } else {
            this.listQuery[key] = data[key][0]
          }
          this.lotFilter(data, key)
        } else {
          this.lotFilter(data, key)
          delete this.listQuery[key]
        }
      }
      this.getList()
    },
    lotFilter(data, key) {
      let font = ''
      if (data[key].length) {
        if (data[key][0].split(',')) {
          font = data[key][0].split(',')[1]
        }
      }
      if (key === 'course_id') {
        this.hostFilter(data, key, 1, '课程名称：' + font)
      }
    },
    hostFilter(data, key, index, text) {
      if (data[key].length === 0) {
        delete this.tags[index]
      } else {
        this.$set(this.tags, index, { name: text, type: key })
      }
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
  margin-bottom: 30px;
  overflow: hidden;
  /deep/ .cursorbox {
    width: 19%;
  }
}
.chart-box {
  margin: 10px 0;
  border: 1px solid #ddd;
  height: 450px;
  display: flex;
  background: #fff;
  .pie-chart {
    border-right: 1px solid #ddd;
    position: relative;
    .pieDiv {
      position:absolute;
      bottom:55px;
      width:100%;
      text-align:center;
      font-size:14px;
      span {
        color: #999;
        b {
          color: #000;
        }
      }
    }
  }
}
.back {
  background: #000;
  border: 1px solid #000;
  color: #fff;
  margin-left: 15px;
}
</style>
