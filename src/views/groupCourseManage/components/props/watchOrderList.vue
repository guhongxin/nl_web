<template>
    <el-dialog
      title="团课预约详情"
      :visible.sync="dialogVisible"
      width="80%"
      class="course-dialog"
      @close="detailclose" :close-on-click-modal="false">
      <ul class="orderUl">
        <li style="padding-right: 25px;">课程名称：<span>{{courseMsg.name}}</span></li>
        <li>教练姓名：<span>{{courseMsg.coach?courseMsg.coach.name:''}}</span></li>
        <li>课程价格：<span>{{courseMsg.price}}</span></li>
        <li>上课时间：<span>({{getWeek(courseMsg.week)}}) {{getDate(courseMsg.start_at)}} {{getTime(courseMsg.start_at)}}-{{getTime(courseMsg.end_at)}}</span></li>
        <li>上课地点：<span>{{courseMsg.address}}</span></li>
        <li>{{isGroup}}：<span>{{courseMsg.apply_num === null ? 0 : courseMsg.apply_num}}/{{courseMsg.max_person}}</span></li>
      </ul>
      <div style="margin: 15px 0;overflow:hidden" class="filter-container">
        <scan-input ref="scanIputDoc" :placeholder="placeholder" :select="searchSelect" :defaultSelect="searchSelect[0].value" @kedownOver="searchlist"></scan-input>
        <el-button class="lf addBtn" v-if="btnRoleList['3-4-1-8']" @click="orderCourse(1)"><i class="el-icon-plus"></i> 添加预约</el-button>
        <bulk-action :select="bulkAction" @changeBulk="searchGroup"></bulk-action>
      </div>
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
      <el-table @filter-change="filterChange" @sort-change="sortChange" stripe :key='ordertableKey' :data="tableList" v-loading="orderlistLoading" element-loading-text="列表正在加载中" border fit highlight-current-row
          style="width: 100%;" @selection-change="selectionChange" class="check-table">
        <el-table-column align="center" type="selection" width="55px"></el-table-column>  
        <el-table-column align="center" label="添加时间<i onclick='openDate(event)' title='创建时间' class='el-icon-date'></i>" width="220" sortable="custom" prop="create_sort">
          <template slot-scope="scope">
            <span>{{scope.row.created_at}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" :label="'预约状态'" width="120" prop="orderStatus">
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
          <el-table-column align="center" :label="'性别'" prop="sex" column-key="sex"
          :filters="[{text: '男', value: '1', class: 'csex'}, {text: '女', value: '2', class: 'csex'}]" filter-placement="bottom-end" :filter-multiple="false">
            <template slot-scope="scope">
              <span>{{getSex(scope.row.customer?scope.row.customer.sex:'')}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" :label="'手机号码'" prop="phone" width="120">
            <template slot-scope="scope">
              <span>{{scope.row.customer?scope.row.customer.phone:''}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" :label="'是否注册'" prop="register" column-key="register" width="120"
          :filters="[{text: '是', value: '1', class: 'cregister'}, {text: '否', value: '2', class: 'cregister'}]" filter-placement="bottom-end" :filter-multiple="false">
            <template slot-scope="scope">
              <span>{{getIsRegister(scope.row.customer?scope.row.customer.is_register_app:'')}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" :label="'所属会籍'" prop="phone">
            <template slot-scope="scope">
              <span>{{scope.row.customer?scope.row.customer.consultant?scope.row.customer.consultant.name:'':''}}</span>
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
          <el-table-column align="center" label="实付金额" sortable="custom" prop="start_work_time" width="120">
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
          <el-table-column align="center" label="支付方式" column-key="pay_method" width="120">
          <!-- prop="pay_method" :filters="payMethodOption" filter-placement="bottom-end" :filter-multiple="false"> -->
            <template slot-scope="scope">
              <span>{{getPayMethod(scope.row.order?scope.row.order.payment_method:'')}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="备注" prop="start_work_time" width="200">
            <template slot-scope="scope">
              <span v-if="scope.row.order" :title="scope.row.order.remark" >{{scope.row.order?common.substring(scope.row.order.remark, 16):'-'}}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column align="center" label="添加人" prop="operator_id" column-key="operator_id" width="120">
          <!-- :filters="operatorOption" filter-placement="bottom-end" :filter-multiple="false"> -->
          <template slot-scope="scope">
            <span>{{scope.row.order?scope.row.order.employee_name:''}}</span>
          </template>
        </el-table-column>
        <el-table-column>
          <el-table-column align="center" label="操作" prop="start_work_time" width="200">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="handleEdit(scope.row.id, scope.row.order?scope.row.order.remark:'')" v-if="btnRoleList['3-4-1-9']">修改备注</el-button>
              <el-button size="mini" type="info" @click="handleCansle(scope.row.id)" v-show="showCansle(scope.row)" v-if="btnRoleList['3-4-1-10']">取消预约</el-button>
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>

      <div class="pagination-container" style="text-align:right">
        <el-pagination 
          v-if="paginationShow"
          background @size-change="handleSizeChange" @current-change="handleCurrentChange" 
          :current-page.sync="listQuery.page"
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
      <!-- <dateRange @timeChange="timeChange"></dateRange> -->
    </el-dialog>
</template>

<script>
import { groupCourseOrderList, newCansleGroupCourseOrder, newCourseScheduleById } from '@/api/course'
import { employeeList } from '@/api/employee'
import { parseTime } from '@/utils/index'
import bulkAction from '@/components/bulkAction'
import scanInput from '@/components/scanInput'
// import dateRange from '@/components/dateRange'
import editCourseOrderDialog from './editMark'
import cansleCourseOrderDialog from './cansleCourseOrder'
export default {
  name: 'renewCabinetDialog',
  props: {
    widthSize: {
      type: String,
      default() {
        return '200px'
      }
    }
  },
  computed: {
  },
  components: {
    bulkAction,
    scanInput,
    // dateRange,
    editCourseOrderDialog,
    cansleCourseOrderDialog
  },
  data() {
    return {
      btnRoleList: {},
      ordertableKey: 1,
      tags: [],
      tableList: [],
      sale_nameOptions: [],
      operator_nameOptions: [],
      dialogVisible: false,
      paginationShow: true,
      orderlistLoading: false,
      cansleDialogVisible: false,
      cansleLoading: false,
      editDialogVisible: false,
      editLoading: false,
      placeholder: '请扫码/输入要查询的内容',
      courseMsg: {},
      userInfo: {
        gmt_booking: '',
        group_course_id: '',
        coach_id: ''
      },
      editForm: {
        remark: ''
      },
      total: 0,
      isGroup: '',
      courseId: '',
      groupOprate: {
        reserve_ids: [],
        schedule_id: ''
      },
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
      bulkAction: [{
        label: '批量取消',
        value: 'delete',
        key: '3-4-1-7'
      }],
      listQuery: {
        page: 1,
        per_page: 10,
        schedule_id: ''
      },
      coachOption: [],
      employeeOption: [],
      operatorOption: [],
      payMethodOption: [
        { text: '现金', value: 1 + ',现金', class: 'cpay_method' },
        { text: '支付宝', value: 2 + ',支付宝', class: 'cpay_method' },
        { text: '微信', value: 3 + ',微信', class: 'cpay_method' },
        { text: '银行卡', value: 4 + ',银行卡', class: 'cpay_method' },
        { text: '储值卡', value: 5 + ',储值卡', class: 'cpay_method' }
      ]
    }
  },
  mounted() {
    this.common.eachBtnRole(this.btnRoleList) // 按钮权限方法
    this.coachNameList()
  },
  created() {
  },
  methods: {
    pageInit() {
      this.paginationShow = false
      this.$nextTick(() => {
        this.paginationShow = true
      })
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    dialogShow() {
      this.dialogVisible = true
    },
    orderWatch(obj) {
      this.courseMsg = obj
      this.groupOprate.schedule_id = this.courseMsg.id
      this.getList()
      this.getCourseScheduleById()
    },
    getList() {
      this.orderlistLoading = true
      this.listQuery.schedule_id = this.courseMsg.id
      if (this.courseMsg.apply_num >= this.courseMsg.min_person) {
        this.isGroup = '已成团'
      } else if (this.courseMsg.apply_num < this.courseMsg.min_person) {
        this.isGroup = '未成团'
      }
      this.tableList = []
      groupCourseOrderList(this.listQuery).then((res) => {
        this.orderlistLoading = false
        this.tableList = res.data
        this.total = Number(res.headers.pagination.split(',')[1])
      }).catch(() => {
        this.orderlistLoading = false
      })
    },
    getCourseScheduleById() {
      newCourseScheduleById(this.courseMsg.id).then((res) => {
        this.courseMsg.apply_num = res.data.apply_num
        if (res.data.apply_num >= res.data.min_person) {
          this.isGroup = '已成团'
        } else if (res.data.apply_num < res.data.min_person) {
          this.isGroup = '未成团'
        }
      }).catch(() => {
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
    getIsRegister(val) {
      if (val) {
        return '是'
      } else {
        return '否'
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
          return '-'
      }
    },
    getWeek(val) {
      switch (val) {
        case 1: {
          return '星期一'
        }
        case 2: {
          return '星期二'
        }
        case 3: {
          return '星期三'
        }
        case 4: {
          return '星期四'
        }
        case 5: {
          return '星期五'
        }
        case 6: {
          return '星期六'
        }
        case 7: {
          return '星期天'
        }
        default:
          return ''
      }
    },
    getPayMethod(val) {
      switch (val) {
        case 1: return '现金'
        case 2: return '支付宝'
        case 3: return '微信'
        case 4: return '银行卡'
        case 5: return '储值卡'
        default: return ''
      }
    },
    getDate(val) {
      if (val) {
        return parseTime(new Date(val), '{y}-{m}-{d}')
      }
    },
    getTime(val) {
      if (val) {
        return parseTime(new Date(val), '{h}:{i}')
      }
    },
    // 搜索查看预约
    searchlist(obj) {
      delete this.listQuery.customer_name_like
      delete this.listQuery.customer_phone
      delete this.listQuery.courseName
      delete this.listQuery.coach_name_like
      this.listQuery.page = 1
      if (obj.value === '') {
        delete this.tags[0]
      } else {
        let tagszh = {
          customer_name_like: '姓名',
          customer_phone: '手机号码',
          course_name_like: '课程名称',
          coach_name_like: '教练姓名'
        }
        this.tags[0] = { 'name': `${tagszh[obj.type]}:${obj.value}`, 'type': obj.type }
      }
      this.pageInit()
      this.listQuery[obj.type] = obj.value || undefined
      this.getList()
    },
    // 修改备注
    handleEdit(id, remark) {
      this.$refs.editCourseOrderDoc.dialogShow(id, remark)
    },
    editCourseOrderBtn() {
      this.getList()
    },
    // 取消预约
    handleCansle(id) {
      this.$refs.cansleCourseOrderDoc.dialogShow(id)
    },
    cansleCourseOrderBtn() {
      this.getList()
      this.getCourseScheduleById()
      this.$emit('refreshTable')
    },
    // cansleCourseOrder() {
    //   this.cansleLoading = true
    //   newCansleCourseOrder(this.courseId).then(response => {
    //     this.cansleLoading = false
    //     this.common.message('success', '取消成功')
    //     this.cansleDialogVisible = false
    //     this.getList()
    //     this.getCourseScheduleById()
    //   }).catch(() => {
    //     this.cansleLoading = false
    //   })
    // },
    // 点击checkbox获得对应id
    selectionChange(selection) {
      this.groupOprate.reserve_ids = []
      for (let i = 0; i < selection.length; i++) {
        this.groupOprate.reserve_ids.push(selection[i].id)
      }
    },
    // 批量操作
    searchGroup(value) {
      if (!this.groupOprate.reserve_ids.length) {
        this.common.message('warning', '请先选择预约项')
        return
      }
      newCansleGroupCourseOrder(this.groupOprate).then(res => {
        this.common.message('success', '取消成功！')
        this.getList()
        this.getCourseScheduleById()
        this.$emit('refreshTable')
      }).catch(() => {
        this.common.message('warning', '操作失败')
      })
    },
    orderCourse() {
      this.$emit('orderCourse')
    },
    detailclose() {
      // this.userInfo.column = ''
      // this.userInfo.value = ''
      this.listQuery = {
        page: 1,
        per_page: 10
      }
      this.$refs.scanIputDoc.clear()
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
    employeeNameList() {
      employeeList(this.employeeQuery).then(response => {
        for (let i = 0; i < response.data.length; i++) {
          this.operator_nameOptions.push({ text: response.data[i].name, value: response.data[i].id + ',' + response.data[i].name, class: 'coperator_id' })
          this.sale_nameOptions.push({ text: response.data[i].name, value: response.data[i].id + ',' + response.data[i].name, class: 'csale_id' })
        }
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
      this.getList()
    },
    lotFilter(data, key) {
      if (key === 'sex') {
        if (!data[key].length) {
          this.hostFilter(data, key, 2, '')
          return
        }
        this.hostFilter(data, key, 2, this.listQuery[key] === '1' ? '性别：男' : this.listQuery[key] === '2' ? '性别：女' : '性别：未知')
      }
      if (key === 'sale_id') {
        if (!data[key].length) {
          this.hostFilter(data, key, 4, '')
          return
        }
        this.hostFilter(data, key, 4, '销售员工：' + data[key][0].split(',')[1])
      }
      if (key === 'pay_method') {
        if (!data[key].length) {
          this.hostFilter(data, key, 5, '')
          return
        }
        let text = ''
        let prefix = '支付方式：'
        switch (this.listQuery[key]) {
          case '1': text = '现金'; break
          case '2': text = '支付宝'; break
          case '3': text = '微信'; break
          case '4': text = '银行卡'; break
          default: text = '无'; break
        }
        this.hostFilter(data, key, 5, prefix + text)
      }
      if (key === 'operator_id') {
        if (!data[key].length) {
          this.hostFilter(data, key, 6, '')
          return
        }
        this.hostFilter(data, key, 6, '操作人：' + data[key][0].split(',')[1])
      }
      if (key === 'register_app') {
        this.hostFilter(data, key, 3, this.listQuery[key] === '1' ? '是否注册app：已注册' : '是否注册app：未注册')
      }
    },
    hostFilter(data, key, index, text) {
      if (data[key].length === 0) {
        delete this.tags[index]
      } else {
        this.$set(this.tags, index, { name: text, type: key })
      }
    },
    handleSizeChange(val) {
      this.listQuery.per_page = val
      this.getList()
    },
    dialogClosed() {
      this.$emit('dialogClosed')
    },
    cansleCabinet() {
      this.$emit('cansleCabinet')
    },
    timeChange(param) {
      // 时间筛选
      let title = param.title
      let text = ''
      switch (title) {
        case '预约时间':
          text = param.title + ':' + param.rangevalue[0] + '~' + param.rangevalue[1]
          this.$set(this.tags, 1, { name: text, type: 'created_at' })
          break
      }
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
  }
}
</script>
<style lang="scss" scoped>
.course-dialog .form-box .selectTime /deep/ {
  .el-input__inner {
    width: 300px;
  }
  .el-input{
    width: 300px;
  }
}
.dialog-footer /deep/{
  .el-button--primary {
    background: #000;
    border: 1px solid #000;
  }
}
.addBtn {
  margin-left: 10px;
  background: #333;
  border: 1px solid #333;
  color: #fff;
}
.orderUl {
  margin: 0;
  border: 1px solid #ddd;
  display: flex;
  li {
    display: inline-block;
    line-height: 35px;
    border-right: 1px solid #ddd;
    text-align: center;
    flex: 1;
  }
  // li:first-child {
  //   width: 18%;
  // }
  li:first-child {
    padding-right: 10px;
  }
  li:nth-child(4) {
    flex: 2;
  }
  // li:nth-child(5) {
  //   width: 15%;
  // }
  li:last-child {
    border-right: none;
    width: 10%;
  }
}
.spanBtn {
  color: rgb(64,158,255);
  margin-right: 10px;
  cursor: pointer;
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
