<template>
  <div class="app-container">
    <div class="boxser">
    <rectbox :data="boxlist" v-on:choose="curChoose"></rectbox>
    </div>
    <div class="find-box4">     
      <div style="overflow:hidden" class="filter-container">
        <scan-input :select="searchSelect" :defaultSelect="searchSelect[0].value" @kedownOver="searchlist" ref="scanIputDoc"></scan-input>
        <el-button type="primary" class="add-button lf" v-if="btnRoleList['3-3-1']" @click="addDialogVisible = true"><i class="el-icon-plus"></i>添加预约</el-button>
        <!-- <bulk-action></bulk-action> -->
        <el-checkbox v-model="evaluatechecked" v-if="listQuery.status===2 ||listQuery.status===4" class="evaluatechecked-box" @change="onlyEvaluation">只查看有评价的({{evaluateNumb}})</el-checkbox>
        <span class="Rrrefresh" @click="__init">
          <el-button icon="el-icon-refresh" circle></el-button>
        </span>
      </div>
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
    <el-table @filter-change="filterChange" @sort-change="sortChange" stripe :key='tableKey' :data="tableList" v-loading="listLoading" element-loading-text="列表正在加载中" border fit highlight-current-row
      style="width: 100%;" class="check-table">
      <el-table-column align="center" type="selection" width="55px"></el-table-column>

      <el-table-column width="160px" align="center"
      label="添加时间<i onclick='openDate(event)' data=[1,'created_at_sdate','created_at_edate'] title='预约时间' class='el-icon-date'></i>"
      sortable='custom' prop="created_at_sort">
        <template slot-scope="scope">
          <span>{{scope.row.created_at}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column width="150px" align="center" :label="'状态'" prop="status" column-key="status"
      :filters="statusOptions" filter-placement="bottom-end" :filter-multiple="false"> -->
      <el-table-column width="150px" align="center" :label="'预约状态'" prop="status">
        <template slot-scope="scope">
          <span v-if="scope.row.status === 0" style="color: #1878E1;">待进行</span>
          <span v-if="scope.row.status === 1" style="color: #F14C30;">待进行</span>
          <span v-if="scope.row.status === 2" style="color: #1AB394;">已完成</span>
          <span v-if="scope.row.status === 3" style="color: #999999;">已取消</span>
        </template>
      </el-table-column>
      <el-table-column label="课程信息" align="center">
        <!-- 不要删注释的地方 -->
        <!-- <el-table-column align="center" :label="'课程类型'" width="120" prop="type">
          <template slot-scope="scope">
            <span>{{getCourseType(scope.row.customer_course?scope.row.customer_course.course_data?scope.row.customer_course.course_data.fit_type:'':'')}}</span>
          </template>
        </el-table-column> -->
        <el-table-column column-key="course_id" align="center" :label="'课程名称'" width="120" prop="scope.row.course_name" 
        :filters="courseOptions" filter-placement="bottom-end" :filter-multiple="false">
          <template slot-scope="scope">
            <span>{{scope.row.course_name}}</span>
          </template>
        </el-table-column>
        <el-table-column column-key="coach_id" align="center" :label="'教练名称'" width="120" prop="scope.row.booking_coach_name" 
        :filters="coachOptions" filter-placement="bottom-end" :filter-multiple="false">
          <template slot-scope="scope">
            <span size="mini">{{scope.row.booking_coach?scope.row.booking_coach.name:'-'}}</span>
          </template>
        </el-table-column>

        <el-table-column width="150px" align="center" :label="'课程价格'" sortable="custom" prop="course_price_sort">
          <template slot-scope="scope">
            <span>{{scope.row.course_price?scope.row.course_price:'-'}}</span>
          </template>
        </el-table-column>

        <el-table-column width="200px" align="center" :label="'课程次数（剩/总）'">
          <template slot-scope="scope">
            <span>{{scope.row.total - scope.row.use}}/{{scope.row.total}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column width="200px" align="center" :label="'失效时间'">
          <template slot-scope="scope">
            <span>{{scope.row.customer_course?scope.row.customer_course.expired_at:''}}</span>
          </template>
        </el-table-column> -->
        <el-table-column width="150px" align="center" :label="'应付金额'" prop="course_price_sort">
          <template slot-scope="scope">
            <span>{{scope.row.customer_course?scope.row.customer_course.course_order?scope.row.customer_course.course_order.total_fee:'-':'-'}}</span>
          </template>
        </el-table-column>
        <el-table-column width="150px" align="center" :label="'实付金额'" prop="course_price_sort">
          <template slot-scope="scope">
            <span>{{scope.row.customer_course?scope.row.customer_course.course_order?scope.row.customer_course.course_order.real_total_fee:'-':'-'}}</span>
          </template>
        </el-table-column>
      </el-table-column>

      <el-table-column label="客户信息" align="center">
        <el-table-column align="center" :label="'姓名'" width="100" prop="scope.row.customer">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" v-if="scope.row.customer ? scope.row.customer.deleted_at : ''" :content="`客户已删除，删除时间: ${scope.row.customer.deleted_at}`" placement="bottom">
              <el-button type="info" size="mini">{{scope.row.customer?scope.row.customer.name:'-'}}</el-button>
            </el-tooltip>
            <span v-else>{{scope.row.customer?scope.row.customer.name:'-'}}</span>
          </template>
        </el-table-column>

        <el-table-column width="110px" align="center" :label="'头像'" style="display:flex;justify-content: center;padding-left:0px;padding-right:0px;">
          <template slot-scope="scope">
            <span style="display: inline-block;">
              <img @click="common.bigImg($event)" :src="scope.row.customer?scope.row.customer.head_portrait?scope.row.customer.head_portrait:defaulthead:defaulthead" alt="icon" width="30" height="30" style="display: list-item;border-radius:50%;">
            </span>
          </template>
        </el-table-column>
        <el-table-column width="110px" align="center" :label="'性别'" column-key="sex"
        prop="sex" :filters="[{text: '男', value: '1', class: 'csex'}, {text: '女', value: '2', class: 'csex'}]" filter-placement="bottom-end" :filter-multiple="false">
          <template slot-scope="scope">
            <span>{{scope.row.customer?getsexzh(scope.row.customer.sex):'-'}}</span>
          </template>
        </el-table-column>
        <el-table-column width="150px" align="center" :label="'电话号码'" prop="scope.row.customer">
          <template slot-scope="scope">
            <span>{{scope.row.customer?scope.row.customer.phone:'-'}}</span>
          </template>
        </el-table-column>
        <el-table-column width="110px" align="center" :label="'是否注册'" column-key="register_app" prop="register_app"
        :filters="[{text: '已注册', value: '1', class: 'cregister_app'}, {text: '未注册', value: '2', class: 'cregister_app'}]"
        filter-placement="bottom-end" :filter-multiple="false">
          <template slot-scope="scope">
            <span v-if="scope.row.customer&&scope.row.customer.is_register_app">已注册</span>
            <span v-else  style="color: #F14C30">未注册</span>
          </template>
        </el-table-column>
        <el-table-column width="150px" align="center" :label="'所属会籍'" prop="consultant" column-key="consultant_id" 
          :filters="embership" filter-placement="bottom-end" :filter-multiple="false">
          <template slot-scope="scope">
            <span>{{scope.row.customer?scope.row.customer.consultant?scope.row.customer.consultant.name:'-':'-'}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column width="150px" align="center" :label="'所属教练'" prop="consultant">
          <template slot-scope="scope">
            <span>{{scope.row.customer?scope.row.customer.coach?scope.row.customer.coach.name:'-':'-'}}</span>
          </template>
        </el-table-column> -->
      </el-table-column>
      
      <el-table-column label="上课信息" align="center">
        <el-table-column width="340px" align="center"
        label="预约上课时间<i onclick='openDate(event)' data=[6,'booking_start_sdate','booking_start_edate'] title='预约上课时间' class='el-icon-date'></i>"
        sortable="custom" prop="booking_start_sort">
          <template slot-scope="scope">
            <span>{{scope.row.booking_start}} 至 {{scope.row.booking_end}}</span>
          </template>
        </el-table-column>
        <el-table-column column-key="actual_coach_id" align="center" :label="'实际带课教练'" width="150" prop="coach_name" 
        :filters="coachOptions1" filter-placement="bottom-end" :filter-multiple="false">
          <template slot-scope="scope">
            <!-- <div v-for='(items, key) in getCoachName(scope.row.coach_name, scope.row.coach)' 
              :key='key'>
              <el-tooltip class="item" effect="dark" v-if="items.noModific" :content="`原教练名为: ${items.oldCoachName}`" placement="bottom">
                <el-button type="danger" size="mini">{{items.newCoachName}}</el-button>
              </el-tooltip>
              <span v-else size="mini">{{scope.row.coach_name}}</span>
            </div> -->
            <span>{{scope.row.coach?scope.row.coach.name?scope.row.coach.name:'-':'-'}}</span>
          </template>
        </el-table-column>
        <el-table-column width="340px" align="center"
        label="实际上课时间<i onclick='openDate(event)' data=[8,'started_at_sdate','started_at_edate'] title='实际上课时间' class='el-icon-date'></i>"
        prop="scope.row.started_at">
          <template slot-scope="scope">
            <span>{{scope.row.started_at?scope.row.started_at:'-'}} 至 {{scope.row.ended_at?scope.row.ended_at:'-'}}</span>
          </template>
        </el-table-column>
      </el-table-column>

      <el-table-column column-key="operator_id" width="150px" align="center" :label="'添加人'" prop="operator_name"
        :filters="coperatorOptions" filter-placement="bottom-end" :filter-multiple="false" >
        <template slot-scope="scope">
          <span>{{scope.row.operator_name?scope.row.operator_name:'超级管理员'}}</span>
        </template>
      </el-table-column>
      
      <el-table-column align="center" fixed="right" :label="$t('table.actions')" min-width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" plain type="warning" v-if="scope.row.status === 2" @click="ViewEvaluatBtn(scope.row)">查看评价</el-button>
          <el-button size="mini" plain type="info" :disabled="true" v-if="scope.row.status === 3">已取消</el-button>
          <el-button size="mini" plain type="danger" v-if="btnRoleList['3-3-2']&&((scope.row.status === 0) || (scope.row.status === 1))" @click="btnCoachCancel(scope.row.id)">取消预约</el-button>
          <!-- <el-dropdown trigger="click" v-if="btnRoleList['3-3-2']&&(scope.row.status === 0)">
            <el-button size="mini" type="danger" plain>取消预约</el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="btnCoachCancel(scope.row.id)">确定</el-dropdown-item>
              <el-dropdown-item>取消</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown> -->
          <el-button size="mini" plain type="success" v-if="scope.row.status === 0 || scope.row.status === 1" @click="handlePrivateCence(scope.$index, scope.row)">消课</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container" style="text-align:right;">
      <el-pagination background
        v-if="paginationShow"
        @size-change="handleSizeChange" 
        @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
        :page-sizes="[10,20,30,50]" :page-size="listQuery.per_page" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog
      title="私教预约"
      :visible.sync="addDialogVisible"
      @close="resetAddForm"
      width="900px" class="addOrder">
      <div class="addtopbox">
        <el-input placeholder="请输入手机号或者扫描其APP上的个人条码" v-model.trim="skryxiFind" @keyup.enter.native="getcusinfo">
          <template slot="prepend">
            <i class="qr"></i>
          </template>
          <el-button slot="append" icon="el-icon-search" @click.native="getcusinfo"></el-button>
        </el-input>
      </div>
      <el-form autoComplete="on" :model="addForm" ref="addForm" label-position="right" label-width='95px' :rules="rules">
        <el-row>
        <el-col :span="12">
          <el-form-item label="客户姓名：" prop="name">
            <el-input v-model="addForm.name" :disabled="true" placeholder="查询或扫码后自动获取" style="width:300px"></el-input>
          </el-form-item>
          <el-form-item label="剩余课时：" prop="times">
            <el-input v-model="addForm.times" :disabled="true" placeholder="查询或扫码后自动获取" style="width:300px"></el-input>
          </el-form-item>
          <el-form-item label="预约日期：" prop="booking_start">
            <el-date-picker
              v-model="addForm.booking_start"
              type="date"
              :editable="false"
              :clearable="false"
              placeholder="选择日期时间"
              :picker-options="pickerOptions1"
              @change="changeDate">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="教练姓名：" prop="coachName">
            <!-- <el-select v-model="coachName" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select> -->
            <el-input v-model="addForm.coachName" :disabled="true" placeholder="查询或扫码后自动获取" style="width:300px"></el-input>
          </el-form-item>
          <el-form-item label="课程名称：" prop="chousevalue">
            <el-select v-model="addForm.chousevalue" @change="changecourse" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注内容：" prop="remark">
            <el-input v-model="addForm.remark" placeholder="请输入备注内容" style="width:300px" maxlength="100" v-on:input="getMarkLength"></el-input>
            <div class="tip">{{markLength}}/100</div>
          </el-form-item>
        </el-col>
        </el-row>
      </el-form>
      <div>
        <span class="red">*</span>
        <label class="el-form-item__label">预约时间：</label>
        <span class="el-form-item__content">
          <ul class="timeList">
            <li :class="{'disable': item.select, 'ischoose': item.isChoose, 'over': item.over, 'overdouble': item.overdouble, 'redouble': item.redouble }" v-for="(item, index) in earlyTime" :key="index" @click="selectTime(item)">{{item.time}}</li>
          </ul>
          <div style="float: right;">
            <span class="tuli"><span class="istuli isearly"></span>过时</span>
            <span class="tuli"><span class="istuli ischoose"></span>已约</span>
          </div>          
        </span>
      </div>
      <div style="text-align:center;">
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" class="black" :loading="loading" :disabled="submite" @click="addCoach">确 定</el-button>
        </span>
      </div>
    </el-dialog>
    <!-- 查看评价 -->
    <evaluat-popus 
      v-if="evaluatPopusShow"
      :dialogVisible="evaluatPopusShow" 
      @dialogClosed="evaluatPopusClosed"
      @evaluatPopusBtnOK="evaluatPopusBtnOK"
      :widthSize='"700px"'
      ref='evaluatPopusDoc'></evaluat-popus>
    <privateCencel
      ref="privateCencel"
      @dialogClosed="closedprivateCencel"></privateCencel>

    <!-- 取消预约 -->
    <delete-dialog 
      :tipMessage="deleteMessage"
      ref="deleteDialogDoc"
      @deleteSureBtn='deleteCancelSure'></delete-dialog>
    <!-- 时间筛选 -->
    <dateRange @timeChange="timeChange"></dateRange>
  </div>
</template>

<script>
import { courseConsumeList, consumeCountList, privateCourseList } from '@/api/course'
import { employeeList, staffDetails } from '@/api/employee'
import { coachAdd, coachCancel } from '@/api/coach'
import { getCustomersByPhone, getCustomersInfoById } from '@/api/customer'
import { parseTime } from '@/filters'
import rectbox from '@/components/rectbox'
import scanInput from '@/components/scanInput'
import bulkAction from '@/components/bulkAction'
import EvaluatPopus from './popus/evaluatpopus'
import privateCencel from '@/views/privateBuy/components/props/privateCencel'
import deleteDialog from '@/components/deleteDialog'
import dateRange from '@/components/dateRange'
export default {
  name: 'privateOrder',
  components: {
    rectbox,
    scanInput,
    bulkAction,
    EvaluatPopus,
    privateCencel,
    deleteDialog,
    dateRange
  },
  data() {
    return {
      btnRoleList: {},
      deleteMessage: '确定要取消该预约吗?',
      cansleId: '',
      currentCoachTime: '',
      pickerOptions1: {
        disabledDate(time) {
          // return (time.getTime() + 86400000) < Date.now()
        },
      },
      currentCoachId: '',
      markLength: 0,
      addForm: {
        name: '',
        times: '',
        remark: '',
        coachName: '',
        chousevalue: '',
        booking_start: Date.now()
      },
      skryxiFind: '',
      addDialogVisible: false,
      tags: [],
      statusOptions: [
        { text: '待进行', value: 0 + ',' + '待进行', class: 'cstatus' },
        { text: '已取消', value: 3 + ',' + '已取消', class: 'cstatus' },
        { text: '待评价', value: 1 + ',' + '待评价', class: 'cstatus' }
      ],
      select: '',
      searchval: '',
      tableKey: 0,
      tableList: null,
      total: null,
      listLoading: true,
      showReviewer: false,
      loading: false,
      listQuery: {
        page: 1,
        per_page: 10
      },
      courseQuery: {
        page: 1,
        per_page: 1000
      },
      coachQuery: {
        post: 1,
        page: 1,
        per_page: 1000
      },
      employeeQuery: {
        page: 1,
        per_page: 1000
      },
      courseOptions: [], // 课程
      coachOptions: [], // 代理教练
      coachOptions1: [], // 实际代课教练
      employeeOptions: [],
      searchSelect: [{
        text: '手机号码',
        value: 'phone_like'
      }, {
        text: '姓名',
        value: 'name_like'
      }, {
        text: '课程名称',
        value: 'course_name_like'
      }, {
        text: '带课教练',
        value: 'coach_name_like'
      }, {
        text: '所属会籍',
        value: 'con_name_like'
      }, {
        text: '操作人',
        value: 'opt_name_like'
      }],
      boxlist: [{
        text: '全部',
        num: 0,
        type: 'all',
        checked: true,
        bocolor: 'rgb(28, 132, 198)'
      }, {
        text: '待进行',
        num: 0,
        type: 'normal',
        status: '0,1',
        checked: false,
        bocolor: 'rgb(81, 169, 202)'
      }, {
        text: '已完成',
        num: 0,
        type: 'completed',
        status: 2,
        checked: false,
        bocolor: 'rgb(248, 172, 89)'
      },
      // {
      //   text: '已评价',
      //   num: 0,
      //   type: 'commented',
      //   status: 4,
      //   checked: false,
      //   bocolor: 'rgb(26, 179, 148)'
      // },
      {
        text: '已取消',
        num: 0,
        type: 'cancel',
        status: 3,
        checked: false,
        bocolor: 'rgb(241, 76, 48)'
      }],
      options: [],
      searchGroupBtn: '',
      coperatorOptions: [], // 操作人
      embership: [], // 会籍
      course: [],
      earlyTime: [],
      cencelId: '',
      curTime: '',
      star: 0,
      end: 0,
      rules: {
        name: [
          { required: true, message: '请输入客户姓名', trigger: 'blur' },
        ],
        times: [
          { required: true, message: '请输入剩余课时', trigger: 'change' }
        ],
        booking_start: [
          { required: true, message: '请选择预约日期', trigger: 'change' }
        ],
        chousevalue: [
          { required: true, message: '请选择课程', trigger: 'change' }
        ],
        coachName: [
          { required: true, message: '请输入教练名称', trigger: 'change' }
        ]
        // remark: [
        //   { required: true, message: '请输入备注', trigger: 'change' },
        //   { min: 1, max: 16, message: '长度在 1 到 16 个字符', trigger: 'blur' }
        // ]
      },
      evaluatPopusShow: false, // 显示评价弹窗
      paginationShow: true,
      evaluatechecked: false,
      evaluateNumb: null // 以评价数量
    }
  },
  computed: {
    submite() {
      let a = false
      return this.curTime ? a : !a
    }
  },
  created() {
    this.__init()
  },
  mounted() {
  },
  methods: {
    getMarkLength() {
      this.markLength = this.addForm.remark.length
    },
    __init() {
      this.common.eachBtnRole(this.btnRoleList) // 按钮权限方法
      this.getList()
      this.getCount()
      this.courseNameList()
      this.employeeNameList()
      this.gettimelsit(8.3, 22)
    },
    getCourseType(type) {
      switch (type) {
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
    handlePrivateCence(index, row) {
      this.$refs.privateCencel.initModel({ id: row.id, customerCourseId: row.customer_course_id, type: 'booking', booking_start: row.booking_start, booking_end: row.booking_end })
    },
    getStaffMsg(id) {
      staffDetails(id).then(response => {
        let star = response.data.start_work_time.split(':')[0]
        let end = response.data.end_work_time.split(':')[0]
        this.star = parseInt(star)
        this.end = parseInt(end)
        this.gettimelsit(parseInt(star), parseInt(end))
      })
    },
    closedprivateCencel() {
      this.getList()
      this.getCount()
    },
    getCoachName(oldCoachName, coach) {
      // 获取代理教练人姓名
      let result = []
      let obj = {}
      if (!coach || oldCoachName === coach.name) {
        obj = {
          oldCoachName: oldCoachName,
          noModific: false
        }
      } else {
        obj = {
          oldCoachName: oldCoachName,
          newCoachName: coach.name,
          noModific: true
        }
      }
      result.push(obj)
      return result
    },
    changeDate(value) {
      if (!this.currentCoachId) {
        this.common.message('error', '请先扫码或输入电话号码获取信息！')
        this.addForm.booking_start = Date.now()
        return
      }
      if (new Date(value).getTime() > new Date().getTime()) {
        for (let item of this.earlyTime) {
          item.select = false
          item.over = false
          item.overdouble = false
          item.isChoose = false
        }
      }
      if (new Date(value).getTime() < new Date().getTime()) {
        for (let item of this.earlyTime) {
          item.select = true
          item.over = false
          item.overdouble = false
          item.isChoose = false
        }
      }
      if (parseTime(new Date(value).getTime(), '{y}-{m}-{d}') === parseTime(new Date().getTime(), '{y}-{m}-{d}')) {
        this.gettimelsit(this.star ? this.star : 9, this.end ? this.end : 22)
      }
      this.getcourseConsumeList(this.currentCoachId)
    },
    selectTime(choose) {
      // if (choose.select) return
      if (!this.skryxiFind) {
        this.common.message('error', '请先扫码或输入电话号码获取信息！')
        return
      }
      if (!this.addForm.booking_start) {
        this.common.message('error', '请先选择日期！')
        return
      }
      this.curTime = choose.time
      let start = this.formatMinute(choose.time)
      let end = start + this.currentCoachTime
      let indexlist = []
      for (let [key, timeimte] of Object.entries(this.earlyTime)) {
        if (this.formatMinute(timeimte.time) >= start && this.formatMinute(timeimte.time) <= end) {
          if (timeimte.isChoose) {
            this.common.message('error', '该时间段内已有预约！')
            timeimte.redouble = true
          } else {
            timeimte.over = true
            timeimte.overdouble = false
          }
          indexlist.push(key)
        } else {
          timeimte.over = false
          timeimte.overdouble = false
          timeimte.redouble = false
        }
      }
      this.earlyTime[indexlist[0]].overdouble = true
      this.earlyTime[indexlist[0]].over = false
      this.earlyTime[indexlist[indexlist.length - 1]].overdouble = true
      this.earlyTime[indexlist[indexlist.length - 1]].over = false
    },
    gettimelsit(start, end) {
      this.earlyTime = []
      let o = 0
      let curTimes = new Date().getTime()
      let listtimes = parseTime(curTimes, '{y}-{m}-{d}')
      while (end >= start) {
        o++
        let itemValue = ''
        if (o % 2 === 0) {
          if (end < 10) {
            itemValue = '0' + end + ':00'
          } else {
            itemValue = end + ':00'
          }
        } else {
          if (end < 10) {
            itemValue = '0' + end + ':30'
          } else {
            itemValue = end + ':30'
          }
        }
        if (o % 2 === 0) {
          end--
        }
        let timese = listtimes + ' ' + itemValue + ':00'
        let timess = new Date(timese).getTime()
        let select = false
        if (timess < curTimes) select = true
        this.earlyTime.push({ time: itemValue, select: select, isChoose: false, over: false, overdouble: false, redouble: false })
      }
      this.earlyTime.shift()
      this.earlyTime.reverse()
    },
    btnCoachCancel(id) {
      this.cansleId = id
      this.$refs.deleteDialogDoc.dialogShow()
      // coachCancel(id).then(res => {
      //   this.common.message('success', '取消预约成功！')
      //   this.getCount()
      //   this.getList()
      // }).catch((err) => {
      //   console.log(err)
      //   this.common.message('error', '取消预约失败！')
      //   this.getCount()
      //   this.getList()
      // })
    },
    deleteCancelSure() {
      coachCancel(this.cansleId).then(res => {
        this.common.message('success', '取消预约成功！')
        this.$refs.deleteDialogDoc.dialogClose()
        this.getCount()
        this.getList()
      }).catch((err) => {
        console.log(err)
        this.common.message('error', '取消预约失败！')
        this.$refs.deleteDialogDoc.dialogLoadingClose()
        this.getCount()
        this.getList()
      })
    },
    resetAddForm() {
      this.$refs.addForm.resetFields()
      this.skryxiFind = ''
      this.markLength = 0
      this.currentCoachId = ''
      this.addForm.coachName = ''
      this.options = []
      this.gettimelsit(8, 22)
    },
    addCoach() {
      if (!this.skryxiFind.length) {
        this.common.notify('错误', 'error', '请先扫码或输入电话号码获取信息！')
        return
      }
      if (this.addForm.booking_start === '') {
        this.common.notify('错误', 'error', '请选择预约时间，注意不要于已约时间重复！')
        return
      }
      // if (!this.addForm.chousevalue) {
      //   this.common.message('warning', '该客户暂无购买课程！')
      //   return
      // }
      this.loading = true
      let obj = {
        booking_start: parseTime(new Date(this.addForm.booking_start).getTime(), '{y}-{m}-{d}') + ' ' + this.curTime + ':00', customer_course_id: this.addForm.chousevalue,
        remark: this.addForm.remark
      }
      coachAdd(obj).then(res => {
        this.common.notify('成功', 'success', '私教预约成功！')
        this.addDialogVisible = false
        this.loading = false
        this.getList()
        this.getCount()
      }).catch(() => {
        this.loading = false
      })
    },
    changecourse(value) {
      for (let item of this.course) {
        if (item.id === value) {
          this.addForm.coachName = item.coach_name
          this.addForm.times = (item.quantity - item.use) + '次'
          this.currentCoachId = item.coach_id
          this.currentCoachTime = item.course_data.time
          this.addForm.booking_start = Date.now()
          // this.changeDate(this.addForm.booking_start)
        }
      }
      this.getStaffMsg(this.currentCoachId)
      console.log(this.currentCoachId)
    },
    getcusinfo() {
      if (this.skryxiFind.length) {
        getCustomersByPhone(this.skryxiFind).then(res => {
          if (!Object.keys(res.data).length) {
            this.common.message('warning', '没有找到客户信息！')
            return
          }
          this.addForm.name = res.data.name
          if (res.data.id) {
            getCustomersInfoById(res.data.id).then(req => {
              if (!Object.keys(req.data).length) {
                this.common.message('warning', '未搜索到该客户购买私教信息！')
                return
              }
              this.course = req.data
              this.options = []
              for (let value of req.data) {
                this.options.push({ value: value.id, label: value.course_name })
              }
              this.addForm.chousevalue = req.data[req.data.length - 1].id
              this.addForm.coachName = req.data[req.data.length - 1].coach_name
              this.addForm.times = (req.data[req.data.length - 1].quantity - req.data[req.data.length - 1].use) + '次'
              this.currentCoachId = req.data[req.data.length - 1].coach_id
              this.currentCoachTime = req.data[req.data.length - 1].course_data.time
              this.getcourseConsumeList(req.data[req.data.length - 1].coach_id)
              this.getStaffMsg(this.currentCoachId)
              this.changeDate(Date.now())
            })
          }
        })
      }
    },
    getcourseConsumeList(coach_id) {
      // let curtime = parseTime(new Date(this.addForm.booking_start).getTime(), '{y}-{m}-{d} {h}:{i}:{s}')
      let curtime = parseTime(new Date(this.addForm.booking_start).getTime(), '{y}-{m}-{d}') + ' 00:00:00'
      let lartime = curtime.split(' ')[0] + ' 23:59:59'
      courseConsumeList({ page: 1, per_page: 50, status: 0, coach_id: coach_id, booking_gte: curtime, booking_lte: lartime }).then(res => {
        if (res.data.length > 0) {
          for (let item of res.data) {
            let end = item.booking_end.split(' ')[1].substr(0, 5)
            let start = item.booking_start.split(' ')[1].substr(0, 5)
            for (let timeimte of this.earlyTime) {
              if (this.formatMinute(timeimte.time) >= this.formatMinute(start) && this.formatMinute(timeimte.time) <= this.formatMinute(end)) {
                timeimte.select = true
                timeimte.isChoose = true
              }
            }
          }
        } else {
          for (let timeimte of this.earlyTime) {
            /*
              timeimte.select = true
              timeimte.isChoose = true
            */
            timeimte.over = false
            timeimte.overdouble = false
            timeimte.redouble = false
          }
        }
      })
    },
    formatMinute(a) {
      return Number(a.split(':')[0]) * 60 + Number(a.split(':')[1])
    },
    courseNameList() {
      // 查询私教课程
      privateCourseList(this.courseQuery).then(response => {
        for (let i = 0; i < response.data.length; i++) {
          this.courseOptions.push({ text: response.data[i].name, value: response.data[i].id + ',' + response.data[i].name, class: 'ccourse_id' })
        }
      })
    },
    coachNameList() {
      employeeList(this.employeeQuery).then(response => {
        for (let i = 0; i < response.data.length; i++) {
          this.coachOptions.push({ text: response.data[i].name, value: response.data[i].id + ',' + response.data[i].name, class: 'ccoach_id' })
        }
      })
    },
    employeeNameList() {
      this.coperatorOptions = []
      this.embership = []
      employeeList(this.employeeQuery).then(response => {
        let data = response.data
        data.map(item => {
          if (item.post === 1) {
            // 获取教练
            this.coachOptions.push({ text: item.name, value: item.id + ',' + item.name, class: 'ccoach_id' })
            this.coachOptions1.push({ text: item.name, value: item.id + ',' + item.name, class: 'cactual_coach_id' })
          }
          // 获取操作人
          this.coperatorOptions.push({ text: item.name, value: item.id + ',' + item.name, class: 'coperator_id' })
          // 获取操作人
          this.embership.push({ text: item.name, value: item.id + ',' + item.name, class: 'cconsultant_id' })
        })
        this.coperatorOptions.unshift({ text: '超级管理员', value: '3,超级管理员', class: 'coperator_id' })
      })
    },
    tagclose(tag, index) {
      this.common.tagFilter(this, tag, index, this.searchSelect)
    },
    curChoose(index) {
      this.evaluatechecked = false
      for (let v of this.boxlist) {
        v.checked = false
      }
      this.boxlist[index].checked = true
      this.listQuery.status = this.boxlist[index].status
      this.listQuery.scope_value = this.boxlist[index].rbtn ? this.boxlist[index].rbtn.replace(/[^0-9]/ig, '') : undefined
      this.getList()
    },
    sortChange(data) {
      this.common.sortFilter(this, data)
    },
    filterChange(data) {
      for (let key in data) {
        if (data[key].length !== 0) {
          this.listQuery[key] = data[key][0].split(',')[0]
          this.lotFilter(data, key)
        } else {
          this.listQuery[key] = undefined
          this.lotFilter(data, key)
        }
      }
      this.listQuery.page = 1
      this.pageInit()
      this.getList()
    },
    lotFilter(data, key) {
      let font = ''
      if (data[key].length) {
        font = data[key][0].split(',')[1]
      }
      if (key === 'course_id') {
        this.hostFilter(data, key, 4, '课程：' + font)
      }
      if (key === 'coach_id') {
        this.hostFilter(data, key, 5, '教练：' + font)
      }
      if (key === 'actual_coach_id') {
        this.hostFilter(data, key, 7, '实际带课教练：' + font)
      }
      if (key === 'consultant_id') {
        this.hostFilter(data, key, 9, '会籍：' + font)
      }
      if (key === 'operator_id') {
        this.hostFilter(data, key, 10, '操作人：' + font)
      }
      if (key === 'sex') {
        this.hostFilter(data, key, 2, this.listQuery[key] === '1' ? '性别：男' : this.listQuery[key] === '2' ? '性别：女' : '性别：未知')
      }
      if (key === 'register_app') {
        this.hostFilter(data, key, 3, this.listQuery[key] === '1' ? '是否注册：已注册' : '是否注册：未注册')
      }
      if (key === 'status') {
        this.hostFilter(data, key, 7, '状态：' + font)
      }
    },
    hostFilter(data, key, index, text) {
      if (data[key].length === 0) {
        delete this.tags[index]
      } else {
        this.$set(this.tags, index, { name: text, type: key })
      }
    },
    getList() {
      this.listLoading = true
      courseConsumeList(this.listQuery).then(response => {
        if (response.data.length) {
          this.tableList = response.data
          this.total = Number(response.headers.pagination.split(',')[1])
          this.listLoading = false
        } else {
          this.tableList = response.data
          this.total = 0
          this.listLoading = false
        }
      })
    },
    getCount() {
      let param = {
        all: 3,
        normal: 3,
        commenting: 3,
        complete: 3,
        cancel: 3
      }
      let self = this
      consumeCountList(param).then(response => {
        let res = response.data
        this.evaluateNumb = res.commented
        for (let i = 0; i < self.boxlist.length; i++) {
          let item = self.boxlist[i]
          for (let key in res) {
            if (item.type === key) {
              self.boxlist[i].num = res[key]
            }
          }
        }
      })
    },
    searchlist(obj) {
      delete this.listQuery.column
      delete this.listQuery.value
      if (obj.value === '') {
        delete this.tags[0]
      } else {
        let tagszh = {
          phone_like: '手机号码',
          name_like: '姓名',
          course_name_like: '课程名称',
          coach_name_like: '带课教练',
          con_name_like: '所属会籍',
          opt_name_like: '操作人',
        }
        this.tags[0] = { 'name': `${tagszh[ obj.type]}:${obj.value}`, 'type': obj.type }
      }
      if (obj.type === 'course_name_like') {
        if (obj.value) {
          this.listQuery.course_name_like = obj.value
        }
      } else if (obj.type === 'coach_name_like') {
        if (obj.value) {
          this.listQuery.coach_name_like = obj.value
        }
      } else {
        delete this.listQuery.course_name_like
        delete this.listQuery.coach_name_like
        if (obj.value) {
          this.listQuery.column = obj.type
          this.listQuery.value = obj.value
        }
      }
      this.listQuery.page = 1
      this.pageInit()
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.per_page = val
      this.getList()
    },
    getsexzh(param) {
      let result = ''
      switch (param) {
        case 1:
          result = '男'
          break
        case 2:
          result = '女'
          break
      }
      return result
    },
    ViewEvaluatBtn(row) {
      // 打开查看评价弹窗
      this.evaluatPopusShow = true
      this.$nextTick(() => {
        this.$refs.evaluatPopusDoc.getPrivateCourseDetails(row.id)
      })
    },
    evaluatPopusClosed() {
      // 关闭评价弹窗
      this.evaluatPopusShow = false
    },
    evaluatPopusBtnOK() {
      // 评价详情点击确定按钮
      this.evaluatPopusShow = false
    },
    pageInit() {
      this.paginationShow = false
      this.$nextTick(() => {
        this.paginationShow = true
      })
    },
    onlyEvaluation() {
      if (this.evaluatechecked) {
        this.listQuery.status = 4
      } else {
        this.listQuery.status = 2
      }
      this.getList()
    },
    timeChange(param) {
      this.common.chooseTimerFilter(param, this)
    }
  },
  filters: {
  },
  destroyed() {
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.qr {
  background-size: cover;
  background-position: center;
  width: 40px;
  top: -1px;
  border-radius: 5px 0 0 5px;
}
.addOrder /deep/ .el-form-item__label {
  color: #000;
  padding: 0 10px 0 0;
}
.addOrder /deep/ .el-select>.el-input {
  width: 300px
}
.addOrder /deep/ .el-date-editor.el-input, .el-date-editor.el-input__inner {
  width: 300px;
}
.black {
  background: #000;
  border: 1px solid #000;
  width: 160px;
}
.blackSure {
  background: #000;
  border: 1px solid #000;
  width: 110px;
}
.tip {
  text-align: right;
  color: #ccc;
  padding-right: 32px;
}
.red {
  float: left;
  color: red;
  margin-top: 10px;
  margin-right: 5px;
}
$bg:#2d3a4b;
$light_gray:#eee;
.evaluatechecked-box{
  margin-left: 20px;
  margin-top: 10px;
}
.timeList {
  padding: 0;
  margin: 0;
  overflow: hidden;
  li {
    list-style: none;
    float: left;
    padding: 0 10px;
    border: 1px solid #cccccc;
    cursor: pointer;
    margin-right: 10px;
    margin-bottom: 10px;
    color: #606266;
    &.disable {
      background-color: #cccccc;
    }
    &.ischoose {
      background-color: #2d2d2d;
      color: #eee;
    }
    &.over {
      background-color: #ad7;
      color: white;
    }
    &.overdouble {
      background-color: rgb(39, 177, 39);
      color: white;
    }
    &.redouble {
      background-color: rgb(2, 58, 2);
      color: white;
    }
  }
}
.tuli {font-size: 12px;    vertical-align: bottom;}
.istuli {
  display: inline-block;
  height: 12px;
  width: 12px;
  margin-right: 4px;
}
.ischoose {
  background-color: #2d2d2d;
}
.isearly {
  background-color: #cccccc;
}
.addtopbox {
  padding-bottom: 20px;
  border-bottom: 1px solid #dddddd;
  margin-bottom: 26px;
}
.boxser {
  overflow: hidden;
}
.searchgroup {
  width: 500px;
}
.searchGroupset {
  margin-left: 20px;
  width: 110px;
  .el-input__inner {
    background-color: #333333;
    color: white;
  }
  input::placeholder {
    color: white;
  }
}
.add-button {
  background: #000;
	color: #fff;
	margin-left: 20px;
  border: none;
  margin-top: 1px;
}
</style>
