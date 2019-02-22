<template>
  <div>
    <!-- <div class="find-box4"> -->
    <!-- <div class="boxser">
      <rectbox :data="boxlist" v-on:choose="curChoose" v-on:openbox="curOpenbox"></rectbox>
    </div>  -->
    <div class="find-box4">
      <div style="overflow:hidden" class="filter-container">
        <scan-input :select="searchSelect" :defaultSelect="searchSelect[0].value" @kedownOver="searchlist" :placeholder="placeholder" ref="scanIputDoc"></scan-input>
      </div>
    </div>
    <!-- </div> -->
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
    <el-table ref="staffTable" @filter-change="filterChange" @sort-change="sortChange" stripe :key='tableKey' :data="tableList" v-loading="listLoading" element-loading-text="列表正在加载中" fit highlight-current-row
      style="width: 100%;" header-cell-class-name="bindonce" border class="check-table">
      <el-table-column align="center"
      label="预约时间<i onclick='openDate(event)' data=[1,'created_at_sdate','created_at_edate'] title='预约时间' class='el-icon-date'></i>"
      width="220" sortable="custom" prop="create_sort">
        <template slot-scope="scope">
          <span>{{scope.row.created_at}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="'预约状态'" width="120" prop="orderStatus">
        <!-- column-key="orderStatus" :filters="orderStatusOption" filter-placement="bottom-end" :filter-multiple="false" -->
        <template slot-scope="scope">
          <span :class="'color' + scope.row.business_status">{{getOrderStatus(scope.row.business_status)}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="'上课时间'" width="220" prop="orderStatus">
        <template slot-scope="scope">
          <span>{{getCourseTime(scope.row)}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="'席位编号'" width="100" prop="seatID">
        <template slot-scope="scope">
          <span>{{computedSeat(scope.row)}}</span>
        </template>
      </el-table-column>

      <el-table-column label="课程信息" align="center" class-name="merge-th">
        <el-table-column align="center" :label="'课程类型'" column-key="effect" width="120"
        prop="effect" :filters="courseTypeOption" filter-placement="bottom-end" :filter-multiple="false">
          <template slot-scope="scope">
            <span>{{getCourseType(scope.row.effect)}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="'课程名称'" column-key="group_course_id" width="120"
        prop="group_course_id" :filters="courseNameOption" filter-placement="bottom-end" :filter-multiple="false">
          <template slot-scope="scope">
            <span>{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column column-key="coach_id" align="center" :label="'教练名称'" width="120"
        prop="coach_id" :filters="coachOption" filter-placement="bottom-end" :filter-multiple="false">
          <template slot-scope="scope">
            <span>{{scope.row.coach?scope.row.coach.name:''}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="'课程价格'" prop="price_sort" sortable="custom" width="120" >
          <template slot-scope="scope">
            <span>{{scope.row.price}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" column-key="role_id" :label="'上课地点'" prop="scope.row.role.name">
          <template slot-scope="scope">
            <span>{{scope.row.address}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="'上课人数'" prop="scope.row.post">
          <template slot-scope="scope">
            <span>{{scope.row.min_person}}-{{scope.row.max_person}}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="客户信息" align="center" class-name="merge-th">
        <el-table-column align="center" :label="'姓名'" prop="operator_id">
          <template slot-scope="scope">
            <span>{{scope.row.customer?scope.row.customer.name:''}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="'头像'" prop="operator_id">
          <template slot-scope="scope">
            <span><img :src="scope.row.customer?scope.row.customer.head_portrait?scope.row.customer.head_portrait:defaulthead:defaulthead" @click="common.bigImg($event)" alt="icon" width="30" height="30" style="margin-left:20px;display: list-item;border-radius:50%;"></span>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="'性别'" prop="customer_sex" column-key="customer_sex">
        <!-- :filters="[{text: '男', value: '1', class: 'csex'}, {text: '女', value: '2', class: 'csex'}]" filter-placement="bottom-end" :filter-multiple="false"> -->
          <template slot-scope="scope">
            <span>{{getSex(scope.row.customer?scope.row.customer.sex:'')}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="'手机号码'" prop="phone" width="120">
          <template slot-scope="scope">
            <span>{{scope.row.customer?scope.row.customer.phone:''}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="'是否注册'" prop="register" column-key="register" width="120">
        <!-- :filters="[{text: '是', value: '1', class: 'cregister'}, {text: '否', value: '2', class: 'cregister'}]" filter-placement="bottom-end" :filter-multiple="false"> -->
          <template slot-scope="scope">
            <span>{{getIsRegister(scope.row.customer?scope.row.customer.is_register_app:'')}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="'所属会籍'" prop="phone">
          <template slot-scope="scope">
            <span>{{scope.row.customer?scope.row.customer.consultant?scope.row.customer.consultant.name:'-':'-'}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="'所属教练'" prop="coachId" column-key="coachId" width="120">
        <!-- :filters="coachOption" filter-placement="bottom-end" :filter-multiple="false"> -->
          <template slot-scope="scope">
            <span>{{scope.row.customer?scope.row.customer.coach?scope.row.customer.coach.name:'':'-'}}</span>
          </template>
        </el-table-column>
      </el-table-column>

      <el-table-column label="销售信息" align="center" class-name="merge-th">
        <el-table-column align="center" label="实付金额" prop="start_work_time" width="120">
          <template slot-scope="scope">
            <span>{{scope.row.order?scope.row.order.real_total_fee:''}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="销售员工" prop="sell_employee" column-key="sell_employee" width="120">
        <!-- :filters="employeeOption" filter-placement="bottom-end" :filter-multiple="false"> -->
          <template slot-scope="scope">
            <span>{{scope.row.order?scope.row.order.sell_name:''}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="支付方式" column-key="payMethod" width="120">
        <!-- prop="payMethod" :filters="payMethodOption" filter-placement="bottom-end" :filter-multiple="false"> -->
          <template slot-scope="scope">
            <span>{{getPayMethod(scope.row.order?scope.row.order.payment_method:'')}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="备注" prop="start_work_time" >
          <template slot-scope="scope">
            <span v-if="scope.row.order" :title="scope.row.order.remark" >{{scope.row.order?common.substring(scope.row.order.remark, 16):'-'}}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column align="center" label="添加人" column-key="operator_id" width="120">
        <!-- prop="operator_id" :filters="operatorOption" filter-placement="bottom-end" :filter-multiple="false"> -->
        <template slot-scope="scope">
          <span>{{scope.row.order?scope.row.order.employee_name:''}}</span>
        </template>
      </el-table-column>
      <el-table-column>
        <el-table-column align="center" label="操作" prop="start_work_time" width="200">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="handleEdit(scope.row.id, scope.row.order?scope.row.order.remark:'')" v-if="btnRoleList['3-4-3-1']">修改备注</el-button>
            <el-button size="mini" type="info" @click="handleCansle(scope.row.id)" v-show="showCansle(scope.row)" v-if="btnRoleList['3-4-3-2']">取消预约</el-button>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination
        v-if="paginationShow"
        background
        @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
        :page-sizes="[10,20,30,50]" :page-size="listQuery.per_page" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <!-- 修改备注 -->
    <edit-course-order-dialog
      ref="editCourseOrderDoc"
      @editCourseOrderBtn="editCourseOrderBtn">
    </edit-course-order-dialog>

    <!-- 取消预约 -->
    <cansle-course-order-dialog
      ref="cansleCourseOrderDoc"
      @cansleCourseOrderBtn="cansleCourseOrderBtn">
    </cansle-course-order-dialog>

    <!-- 时间筛选 -->
    <dateRange @timeChange="timeChange"></dateRange>
  </div>
</template>

<script>
import scanInput from '@/components/scanInput'
import rectbox from '@/components/rectbox'
import { groupCourseStat, groupCourseOrderList, groupCourseNameList } from '@/api/course'
import { employeeList } from '@/api/employee'
import editCourseOrderDialog from './props/editMark'
import cansleCourseOrderDialog from './props/cansleCourseOrder'
import { parseTime } from '@/utils/index'
import dateRange from '@/components/dateRange'

export default {
  name: 'leagueLecture',
  components: {
    scanInput,
    rectbox,
    editCourseOrderDialog,
    cansleCourseOrderDialog,
    dateRange
  },
  data() {
    return {
      tags: [],
      btnRoleList: {},
      placeholder: '请扫码或输入要查询的内容',
      tableKey: 0,
      tableList: [],
      courseMsg: null,
      listLoading: false,
      courseId: '',
      searchSelect: [{ // 查询列表
        text: '客户姓名',
        value: 'customer_name_like'
      }, {
        text: '手机号码',
        value: 'customer_phone'
      }, {
        text: '课程名称',
        value: 'course_name_like'
      }, {
        text: '教练姓名',
        value: 'coach_name_like'
      }],
      paginationShow: true,
      listQuery: {
        page: 1,
        per_page: 10
      },
      total: null,
      boxlist: [{
        text: '全部',
        num: 0,
        checked: true,
        status: 0,
        bocolor: 'rgb(28, 132, 198)'
      }, {
        text: '待成团',
        num: 0,
        checked: false,
        status: 1,
        bocolor: 'rgb(255, 204, 0)'
      }, {
        text: '待进行',
        num: 0,
        checked: false,
        status: 2,
        bocolor: 'rgb(0, 121, 245)'
      }, {
        text: '进行中',
        num: 0,
        checked: false,
        status: 3,
        bocolor: 'rgb(0, 0, 0)'
      }, {
        text: '未成团',
        num: 0,
        checked: false,
        status: 4,
        bocolor: 'rgb(255, 0, 0)'
      }],
      editForm: {
        remark: ''
      },
      // orderStatusOption: [
      //   { text: '待成团', value: 1 + ',待成团', class: 'corderStatus' },
      //   { text: '待进行', value: 2 + ',待进行', class: 'corderStatus' },
      //   { text: '进行中', value: 3 + ',进行中', class: 'corderStatus' },
      //   { text: '已完成', value: 4 + ',已完成', class: 'corderStatus' },
      //   { text: '未成团', value: 5 + ',未成团', class: 'corderStatus' },
      //   { text: '已取消', value: 6 + ',已取消', class: 'corderStatus' }
      // ],
      courseTypeOption: [
        { text: '增肌', value: 'Z' + ',增肌', class: 'ceffect' },
        { text: '减脂', value: 'J' + ',减脂', class: 'ceffect' },
        { text: '塑形', value: 'S' + ',塑形', class: 'ceffect' },
      ],
      payMethodOption: [
        { text: '现金', value: 1 + ',现金', class: 'cpayMethod' },
        { text: '支付宝', value: 2 + ',支付宝', class: 'cpayMethod' },
        { text: '微信', value: 3 + ',微信', class: 'cpayMethod' },
        { text: '银行卡', value: 4 + ',银行卡', class: 'cpayMethod' }
      ],
      courseNameOption: [],
      coachOption: [],
      employeeOption: [],
      operatorOption: []
    }
  },
  computed: {
  },
  created() {
  },
  mounted() {
    this.__init()
  },
  methods: {
    __init() {
      this.common.eachBtnRole(this.btnRoleList) // 按钮权限方法
      this.coachNameList()
      this.courseNameList()
      this.getList()
      this.getTabList()
    },
    searchlist(obj) {
      delete this.listQuery.customer_name_like
      delete this.listQuery.customer_phone
      delete this.listQuery.courseName
      delete this.listQuery.coach_name_like
      // delete this.listQuery.money
      // delete this.listQuery.remark
      if (obj.value === '') {
        delete this.tags[0]
      } else {
        let tagszh = {
          customer_name_like: '姓名',
          customer_phone: '手机号码',
          course_name_like: '课程名称',
          coach_name_like: '教练姓名'
        }
        this.tags[0] = { 'name': `${tagszh[ obj.type]}:${obj.value}`, 'type': obj.type }
        this.listQuery[obj.type] = obj.value
      }
      this.listQuery.page = 1
      this.pageInit()
      this.getList()
    },
    getList() {
      this.listLoading = true
      groupCourseOrderList(this.listQuery).then(response => {
        this.tableList = response.data
        this.listLoading = false
        this.total = Number(response.headers.pagination.split(',')[1])
      })
    },
    // 头部数据统计
    getTabList() {
      groupCourseStat().then(res => {
        this.boxlist[0].num = res.data[0]
        this.boxlist[1].num = res.data[1]
        this.boxlist[2].num = res.data[2]
        this.boxlist[3].num = res.data[3]
        this.boxlist[4].num = res.data[4]
      })
    },
    getCourseTime(obj) {
      if (obj.schedule) {
        return parseTime(new Date(obj.schedule.start_at), '{y}-{m}-{d} {h}:{i}') + '-' + parseTime(new Date(obj.schedule.end_at), '{h}:{i}')
      }
    },
    showCansle(obj) {
      if (obj.business_status === 6 || obj.business_status === 5 || obj.business_status === 0 || obj.business_status === 3) {
        return false
      } else {
        return true
      }
    },
    getOrderStatus(val) {
      switch (val) {
        case 1: {
          return '待成团'
        }
        case 2: {
          return '待进行'
        }
        case 3: {
          return '进行中'
        }
        case 4: {
          return '未成团'
        }
        case 5: {
          return '已完成'
        }
        case 6: {
          return '已取消'
        }
        default:
          return '-'
      }
    },
    getCourseType(val) {
      switch (val) {
        case 'Z': {
          return '增肌'
        }
        case 'J': {
          return '减脂'
        }
        case 'S': {
          return '塑型'
        }
        default:
          return ''
      }
    },
    getSex(val) {
      switch (val) {
        case 1: {
          return '男'
        }
        case 2: {
          return '女'
        }
        default:
          return ''
      }
    },
    getIsRegister(val) {
      if (val) {
        return '是'
      } else {
        return '否'
      }
    },
    getPayMethod(val) {
      switch (val) {
        case 1: {
          return '现金'
        }
        case 2: {
          return '支付宝'
        }
        case 3: {
          return '微信'
        }
        case 4: {
          return '银行卡'
        }
        case 5: {
          return '储值卡'
        }
        default:
          return ''
      }
    },
    // 切换卡片
    curChoose(index) {
      for (let v of this.boxlist) {
        v.checked = false
      }
      this.boxlist[index].checked = true
      // this.listQuery.reservation_status = this.boxlist[index].status
      // this.getList()
    },
    curOpenbox(index) {
      console.log(this.boxlist[index].text)
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.pre_page = val
      this.getList()
    },
    handleEdit(id, remark) {
      this.$refs.editCourseOrderDoc.dialogShow(id, remark)
    },
    editCourseOrderBtn() {
      this.getList()
    },
    handleCansle(id) {
      this.$refs.cansleCourseOrderDoc.dialogShow(id)
    },
    cansleCourseOrderBtn() {
      this.getList()
      // this.getTabList()
    },
    coachNameList() {
      employeeList().then(response => {
        for (let i = 0; i < response.data.length; i++) {
          if (response.data[i].post === 1) {
            this.coachOption.push({ text: response.data[i].name, value: response.data[i].id + ',' + response.data[i].name, class: 'ccoach_id' })
          }
          this.employeeOption.push({ text: response.data[i].name, value: response.data[i].id + ',' + response.data[i].name, class: 'csell_employee' })
          this.operatorOption.push({ text: response.data[i].name, value: response.data[i].id + ',' + response.data[i].name, class: 'coperator_id' })
        }
      })
    },
    courseNameList() {
      groupCourseNameList().then(response => {
        for (let i = 0; i < response.data.length; i++) {
          this.courseNameOption.push({ text: response.data[i].name, value: response.data[i].id + ',' + response.data[i].name, class: 'cgroup_course_id' })
        }
      })
    },
    pageInit() {
      this.paginationShow = false
      this.$nextTick(() => {
        this.paginationShow = true
      })
    },
    tagclose(tag, index) {
      this.common.tagFilter(this, tag, index, this.searchSelect)
    },
    sortChange(data) {
      this.common.sortFilter(this, data)
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
      this.listQuery.page = 1
      this.pageInit()
      this.getList()
    },
    lotFilter(data, key) {
      let font = ''
      if (data[key].length) {
        if (data[key][0].split(',')) {
          font = data[key][0].split(',')[1]
        }
      }
      if (key === 'effect') {
        this.hostFilter(data, key, 2, '课程类型：' + font)
      }
      if (key === 'group_course_id') {
        this.hostFilter(data, key, 3, '课程名称：' + font)
      }
      if (key === 'coach_id') {
        this.hostFilter(data, key, 4, '教练名称：' + font)
      }
      if (key === 'sell_employee') {
        this.hostFilter(data, key, 5, '销售员工：' + font)
      }
      if (key === 'customer_sex') {
        let text = ''
        switch (this.listQuery[key]) {
          case '1': text = '男'; break
          case '2': text = '女'; break
          default: text = '未知'; break
        }
        this.hostFilter(data, key, 6, text)
      }
      if (key === 'coachId') {
        this.hostFilter(data, key, 7, '所属教练：' + font)
      }
      if (key === 'payMethod') {
        this.hostFilter(data, key, 8, '支付方式：' + font)
      }
      if (key === 'operator_id') {
        this.hostFilter(data, key, 9, '添加人：' + font)
      }
    },
    hostFilter(data, key, index, text) {
      if (data[key].length === 0) {
        delete this.tags[index]
      } else {
        this.$set(this.tags, index, { name: text, type: key })
      }
    },
    timeChange(param) {
      this.common.chooseTimerFilter(param, this)
    },
    computedSeat(row) {
      if (row.seat) {
        if (row.seat.show_no) {
          return row.seat.show_no
        } else {
          return row.seat.id
        }
      } else {
        return '-'
      }
    }
  },
  filters: {},
  destroyed() {
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.addCourse {
  margin-left: 10px;
  border: 1px solid #333;
  background: #333;
  color: #fff;
}
.boxser {
  overflow: hidden;
}
.dialog-footer {
  .black {
    background: #000;
    border: 1px solid #000;
  }
}
.spanBtn {
  color: rgb(64,158,255);
  cursor: pointer;
  margin: 10px;
}
.spanBtn:hover {
  color: #000;
}
.spanBtngray {
  color: #666;
  cursor: pointer;
}
.spanBtngray:hover {
  color: #000;
}
.check-table {
  /deep/ .merge-th{
    border-bottom: 1px solid #cccccc;
  }
}
.color1 {
  color: rgb(255, 204, 0);
}
.color2 {
  color: rgb(0, 121, 245);
}
.color3 {
  color: rgb(59, 59, 59);
}
.color4 {
  color: rgb(255, 0, 0);
}
.color5 {
  color: rgb(78, 220, 113);
}
.color6 {
  color: #ccc;
}
</style>
