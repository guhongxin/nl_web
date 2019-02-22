<template>
  <!-- <div style="height:calc(100vh - 240px);" class='div-big-container'> -->
  <div class='div-big-container'>
    <div class="find-box4">
      <el-button type="primary" @click="addCourseSchedu" v-if="btnRoleList['3-4-1-1']"><i class="el-icon-plus"></i> 添加排期</el-button>
      <el-button type="primary" @click="editCourseSchedu" v-if="btnRoleList['3-4-1-2']"><i class="el-icon-edit"></i> 编辑排期</el-button>
      <el-button type="primary" @click="deleteTip" v-if="btnRoleList['3-4-1-3']"><i class="el-icon-delete"></i> 删除排期</el-button>
      <el-button type="primary" @click="orderCourse" v-if="btnRoleList['3-4-1-4']"><i class="el-icon-time"></i> 预约课程</el-button>
      <el-button type="primary" @click="orderWatch" v-if="btnRoleList['3-4-1-5']"><i class="el-icon-tickets"></i> 查看预约</el-button>
      <el-button type="primary" @click="printpage" v-if="btnRoleList['3-4-1-6']"><i class="el-icon-printer"></i> 打印课表</el-button>
    </div>
    <div class="table-top">
      <span class="arrow" @click="chooseTimeWeek(-1)"><i class="el-icon-arrow-left"></i></span>
      <span class="date">{{startDay}} ~ {{endDay}}</span>
      <span class="arrow" @click="chooseTimeWeek(1)"><i class="el-icon-arrow-right"></i></span>
    </div>
    <table class="myTable" style="width:100%;border-collapse:collapse;border-spacing: none;cellspacing:0;" ref="myDiv" v-loading="listLoading">
      <thead>
        <tr>
          <th v-for="(item,index) in theadList" :key="index" width="14%">
            <div>{{ item.week }}</div>
            <div class="date">{{ item.date }}</div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td v-on:dblclick="orderWatch">
            <table-list :courseList="monday"
              @childToParent="childToParent"
              ref="tableListDoc1">
            </table-list>
          </td>
          <td v-on:dblclick="orderWatch">
            <table-list :courseList="tuesday"
              @childToParent="childToParent"
              ref="tableListDoc2">
            </table-list>
          </td>
          <td v-on:dblclick="orderWatch">
            <table-list :courseList="wednesday"
              @childToParent="childToParent"
              ref="tableListDoc3">
            </table-list>
          </td>
          <td v-on:dblclick="orderWatch">
            <table-list :courseList="thursday"
              @childToParent="childToParent"
              ref="tableListDoc4">
            </table-list>
          </td>
          <td v-on:dblclick="orderWatch">
            <table-list :courseList="friday"
              @childToParent="childToParent"
              ref="tableListDoc5">
            </table-list>
          </td>
          <td v-on:dblclick="orderWatch">
            <table-list :courseList="saturday"
              @childToParent="childToParent"
              ref="tableListDoc6">
            </table-list>
          </td>
          <td v-on:dblclick="orderWatch">
            <table-list :courseList="sunday"
              @childToParent="childToParent"
              ref="tableListDoc7">
            </table-list>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- 添加团课排期 -->
    <course-schedu-dialog
      ref="addGroupCourseDoc"
      @addCourseDateBtn='addCourseDateBtn'>
    </course-schedu-dialog>

    <!-- 编辑团课排期 -->
    <edit-course-schedu-dialog
      :courseMsg='courseMsg'
      @editCourseDateBtn='editCourseDateBtn'
      ref="editGroupCourseDoc">
    </edit-course-schedu-dialog>

    <!-- 预约课程 -->
    <order-course-dialog
      v-if="centerDialogVisible3"
      :dialogVisible='centerDialogVisible3'
      :courseForm='courseMsg'
      :orderDay='orderDay'
      @dialogClosed='dialogClosedOrder'
      @orderCourseBtn='orderCourseSure'
      :widthSize="'1000px'">
    </order-course-dialog>

    <!-- 查看预约 -->
    <watch-order-dialog
      ref="orderDetailDoc"
      @orderCourse="orderCourse"
      @refreshTable="refreshTable">
    </watch-order-dialog>

    <!-- 删除 -->
    <el-dialog
      title="提示"
      :visible.sync="deleteDialogVisible"
      width="490px"
      class="course-dialog" style="margin-top: 28vh;" :close-on-click-modal="false">
      <div style="color:#000;text-align:center;font-size:18px;margin:20px 0;">确定要删除当前选中的排期信息？</div>
      <div style="color:#000;text-align:center;font-size:18px;">提示：删除后会取消该课程的所有预约</div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" class="black" style="padding:10px 34px;" @click="deleteCourseDate" :loading="delLoading">确定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { newGroupCourseDateList, deleteNewGroupCourseDate } from '@/api/course'
import { parseTime } from '@/utils/index'
import { setSession } from '@/utils/auth'
import orderCourseDialog from './props/orderCourse'
import watchOrderDialog from './props/watchOrderList'
import courseScheduDialog from './props/courseSchedu'
import editCourseScheduDialog from './props/editCourseSchedu'
import tableList from './props/tableList'

export default {
  name: 'groupCourseManage',
  components: {
    orderCourseDialog,
    watchOrderDialog,
    courseScheduDialog,
    editCourseScheduDialog,
    tableList
  },
  data() {
    return {
      isEdit: true,
      courseAddress: '',
      btnRoleList: {},
      tableKey: 0,
      listLoading: true,
      loading: false,
      startDay: '', // 一周开始时间
      endDay: '', // 一周结束时间
      nowDay: '', // 当前时间
      nowWeek: '',
      orderDay: '',
      ind: '',
      week: '',
      nextIndex: 0,
      courseId: '',
      courseMsg: null,
      centerDialogVisible2: false,
      centerDialogVisible3: false,
      deleteDialogVisible: false,
      listQuery: {
        start_date: '',
        end_date: ''
      },
      totalTableList: '',
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: [],
      groupFull: false,
      theadList: [{
        week: '星期一',
        date: ''
      }, {
        week: '星期二',
        date: ''
      }, {
        week: '星期三',
        date: ''
      }, {
        week: '星期四',
        date: ''
      }, {
        week: '星期五',
        date: ''
      }, {
        week: '星期六',
        date: ''
      }, {
        week: '星期日',
        date: ''
      }],
      delLoading: false
    }
  },
  computed: {
  },
  created() {
    this.__init()
  },
  mounted() {
  },
  methods: {
    __init() {
      this.common.eachBtnRole(this.btnRoleList) // 按钮权限方法
      // 默认当前周
      this.chooseTimeWeek(0)
      this.resetRefrash()
    },
    addCourseBtn() {
      this.getList()
    },
    dialogClosedEdit() {
      this.centerDialogVisible2 = false
    },
    dialogClosedOrder() {
      this.centerDialogVisible3 = false
    },
    // 获得课程
    getList() {
      this.listLoading = true
      this.resetData()
      newGroupCourseDateList(this.listQuery).then(response => {
        this.listLoading = false
        this.totalTableList = response.data
        for (let i = 0; i < response.data.length; i++) {
          if (response.data[i].apply_num >= response.data[i].min_person) {
            response.data[i].group = '已成团'
          } else {
            response.data[i].group = '未成团'
          }
          if (response.data[i].apply_num - response.data[i].max_person >= 0) {
            response.data[i].isCT = true
            response.data[i].group = '满团'
          } else {
            response.data[i].isCT = false
          }
          if (response.data[i].week === 1) {
            this.monday.push(response.data[i])
          } else if (response.data[i].week === 2) {
            this.tuesday.push(response.data[i])
          } else if (response.data[i].week === 3) {
            this.wednesday.push(response.data[i])
          } else if (response.data[i].week === 4) {
            this.thursday.push(response.data[i])
          } else if (response.data[i].week === 5) {
            this.friday.push(response.data[i])
          } else if (response.data[i].week === 6) {
            this.saturday.push(response.data[i])
          } else if (response.data[i].week === 7) {
            this.sunday.push(response.data[i])
          }
        }
      })
    },
    // 刷新时取消选中状态
    resetRefrash() {
      this.$nextTick(() => {
        for (let i = 1; i < 8; i++) {
          this.$refs['tableListDoc' + i].clearInd() // 重置ind
        }
      })
      this.courseId = ''
    },
    // 重置数据
    resetData() {
      this.monday = []
      this.tuesday = []
      this.wednesday = []
      this.thursday = []
      this.friday = []
      this.saturday = []
      this.sunday = []
    },
    // 切换时间事件
    chooseTimeWeek(status) {
      let now = new Date() // 当前日期
      let nowDayOfWeek = now.getDay() - 1 // 今天本周的第几天
      let nowDay = now.getDate() // 当前日
      if (status === 1) { // 下一周
        this.nextIndex++
      } else if (status === -1) { // 上一周
        this.nextIndex--
      } else if (status === 0) { // 当前周
        this.nextIndex = 0
      }
      this.startDay = parseTime(new Date().setDate(nowDay - nowDayOfWeek + 7 * this.nextIndex), '{y}-{m}-{d}')
      this.endDay = parseTime(new Date().setDate(nowDay - nowDayOfWeek + 7 * (this.nextIndex + 1) - 1), '{y}-{m}-{d}')
      this.listQuery.start_date = parseTime(new Date().setDate(nowDay - nowDayOfWeek + 7 * this.nextIndex), '{y}-{m}-{d}') // 格式化日期
      this.listQuery.end_date = parseTime(new Date().setDate(nowDay - nowDayOfWeek + 7 * (this.nextIndex + 1) - 1), '{y}-{m}-{d}') // 格式化日期
      // 获得课程
      this.getList()
      for (let i = 0; i < this.theadList.length; i++) {
        this.theadList[i].date = parseTime(new Date().setDate(nowDay - nowDayOfWeek + 7 * this.nextIndex + i), '{m}-{d}')
      }
    },
    // 改变背景色
    childToParent(obj) {
      // console.log(obj)
      this.courseId = obj.courseId
      this.courseMsg = Object.assign({}, obj.courseMsg)
      this.groupFull = obj.groupFull // 是否满团
      this.nowDay = obj.nowDay // 上课开始时间
      this.nowWeek = obj.nowWeek // 获得上课星期
      for (let i = 1; i < 8; i++) {
        if (this.nowWeek !== i) {
          this.$refs['tableListDoc' + i].clearInd() // 重置ind
        }
      }
    },
    // 点击添加排期按钮
    addCourseSchedu() {
      this.$refs.addGroupCourseDoc.dialogShow()
    },
    addCourseDateBtn() {
      this.getList()
    },
    // 删除排期
    deleteTip() {
      if (this.courseId === '') {
        this.common.message('warning', '请选择课程！')
        return
      }
      this.deleteDialogVisible = true
    },
    deleteCourseDate() {
      this.delLoading = true
      deleteNewGroupCourseDate(this.courseId).then((res) => {
        this.delLoading = false
        this.common.message('success', '删除成功')
        this.deleteDialogVisible = false
        this.getList()
        this.courseId = ''
      }).catch(() => {
        this.delLoading = false
      })
    },
    // 修改课程排期
    editCourseSchedu() {
      if (this.courseId === '') {
        this.common.message('warning', '请选择课程！')
        return
      }
      if (this.courseMsg.apply_num) {
        this.common.message('info', '该课程已被预约，不能修改！')
        return
      }
      // 获得当前时间戳
      let timestamp = Date.parse(new Date())
      // 获得点击课程的时间戳
      let passstamp = Date.parse(new Date(this.courseMsg.start_at))
      if (passstamp < timestamp) {
        this.common.message('info', '无法修改当前时间之前的课程')
        return false
      }
      this.$refs.editGroupCourseDoc.dialogShow()
    },
    // 修改课程确定
    editCourseSure(obj) {
      this.centerDialogVisible2 = false
      this.getList()
      if (obj.week !== this.nowWeek) {
        this.courseId = ''
      }
    },
    // 修改成功
    editCourseDateBtn(val) {
      this.courseMsg.group_course_id = val
      this.getList()
    },
    // 预约课程step1
    orderCourse() {
      if (this.courseId === '') {
        this.common.message('warning', '请选择课程！')
        return
      }
      if (this.totalTableList.find(item => { return item.id === this.courseId }).isCT) {
        this.common.message('warning', '预约人数已达设置上限，如需预约，可先修改上课人数')
        return false
      }
      // 获得当前时间戳
      let timestamp = Date.parse(new Date())
      // 获得点击课程的时间戳
      let passstamp = Date.parse(new Date(this.courseMsg.start_at))
      if (passstamp < timestamp) {
        this.common.message('warning', '无法预约已经过去的课程')
        return false
      }
      this.centerDialogVisible3 = true
    },
    // 确定预约
    orderCourseSure() {
      this.centerDialogVisible3 = false
      this.$refs.orderDetailDoc.orderWatch(this.courseMsg)
      this.getList()
    },
    // 点击查看预约
    orderWatch() {
      if (this.courseId === '') {
        this.common.message('warning', '请选择课程！')
        return
      }
      this.$refs.orderDetailDoc.dialogShow()
      this.$refs.orderDetailDoc.orderWatch(this.courseMsg)
    },
    // 消课后刷新数据
    refreshTable() {
      this.getList()
    },
    // 打印
    printpage() {
      var printHtml = this.$refs.myDiv.outerHTML
      setSession('cousetext', printHtml)
      setSession('cousetitle', '团课课表')
      window.open(this.staticurl + 'static/protocolprint/couseprint.html')
    }
  },
  filters: {
  },
  destroyed() {
  }
}
</script>

<style rel="stylesheet/scss" midia="print" lang="scss" scoped>
* {
  margin: none;
  padding: none;
}
.div-big-container {
  height: calc(100vh - 200px);
}
.chengt {
  color: #85B31A;
}
.course-dialog .form-box .selectTime /deep/ {
  .el-input__inner {
    width: 300px;
  }
  .el-input{
    width: 300px;
  }
}
.find-box4 {
  button {
    background: #000;
    color: #fff;
    border: 1px solid #000;
  }
}
.table-top {
  background: #E7EAEC;
  padding: 18px 0;
  border: 1px solid #cccccc;
  text-align: center;
  color: #666;
  .arrow {
    display: inline-block;
    width: 28px;
    height: 28px;
    line-height: 28px;
    border-radius: 50%;
    background: #D7E0E6;
    cursor: pointer;
  }
  .arrow:hover {
    background: #333;
    color: #fff;
  }
  span.date {
    font-size: 20px;
    color: #333;
    vertical-align: middle;
    margin: 0 80px;
  }
}
.notice {
  position: absolute;
  top: 185px;
  right: 110px;
  color: #1AB394;
}
.myTable {
  // border: 1px solid #ddd;
  height: 100%;
  border-bottom: none;
  thead {
    background: #E7EAEC;
    tr th{
      padding: 12px 0;
      border: 1px solid #cccccc;
      background: #E7EAEC;
      .date {
        color: #999;
        font-weight: normal;
        line-height: 25px;
      }
    }
  }
  tbody {
    td {
      font-size: 14px;
      vertical-align:top;
      padding-left: 0;
      cursor: pointer;
      .big-box::-webkit-scrollbar {/*滚动条整体样式*/
          width: 0;     /*高宽分别对应横竖滚动条的尺寸*/
          height: 100%;
      }
      .big-box::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
          border-radius: 1px;
          box-shadow: inset 0 0 1px rgba(0,0,0,0);
          background: rgba(0,0,0,0.2);
      }
      .big-box::-webkit-scrollbar-track {/*滚动条里面轨道*/
          box-shadow: inset 0 0 1px rgba(0,0,0,0);
          border-radius: 0;
          background: transparent;
      }
      .active {
        background: rgba(238,103,35,0.3);
      }
      div.inner-box:hover {
        background: rgba(238,103,35,0.3);
      }
      div.inner-box {
        border: 1px solid #cccccc;
        border-top: none;
        padding: 15px 10px;
        background-color: #fff;
        p.name {
          font-weight: bold;
          font-size: 18px;
          color: #000;
        }
        p.address {
          width: 160px;
          overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
        }
        p {
          position: relative;
          color: #999;
          span.courseName {
            display: inline-block;
            // width: 150px;
            // overflow: hidden;
            // text-overflow:ellipsis;
            // white-space: nowrap;
          }
          span.money {
            position: absolute;
            top: -25px;
            right: -3px;
          }
          .isCT {
            position: absolute;
            top: 0;
            right: 46px;
          }
          .mant {
            color: #F7732D;
          }
          .chengt {
            color: #85B31A;
          }
          .number {
            position: absolute;
            top: 0;
            right: -3px;
          }
          .active {
            color: #F7732D;
          }
          .money {
            color: #1AB394;
          }
        }
      }
    }
  }
}
.dialog-footer {
  button {
    background: #000;
    border: 1px solid #000;
  }
  .gray {
      background: #ccc;
      border: 1px solid #ccc;
  }
}
.otherSearcher {
  width: 700px;
  margin: 60px auto;
}
.sm{
  width: 36px;
  display: inline-block;
  height: 36px;
  background: url("../../../assets/icon/qr.png") no-repeat;
  background-size: contain;
  vertical-align: middle;
  margin-right: -4px;
  margin-top: -4px;
  border-radius: 5px 0 0 5px;
}
.otherSearcher .el-select .el-input {
  width: 550px;
  padding-left: 0px;
}
div.tip {
  margin-left: 100px;
}
.use-span {
  color: #1878E1;
  cursor: pointer;
}
.addBtn {
  margin-left: 10px;
  background: #333;
  border: 1px solid #333;
  color: #fff;
}
.orderUl {
  margin: 0;
  // overflow: hidden;
  border: 1px solid #ddd;
  padding: 5px 0;
  li {
    display: inline-block;
    line-height: 35px;
    border-right: 1px solid #ddd;
    width: 14%;
    text-align: center;
  }
  li:last-child {
    border-right: none;
  }
  li:nth-child(4) {
    width: 28%;
  }
}
</style>
