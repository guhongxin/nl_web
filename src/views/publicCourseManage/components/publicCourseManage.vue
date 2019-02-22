<template>
  <!-- <div class="app-container" style="height:calc(100vh - 260px);"> -->
  <div class="app-container div-big-container">
    <div class="btn-box">
        <el-button type="primary" @click="addCourse" v-if="btnRoleList['3-5-1']"><i class="el-icon-plus"></i> 添加课程</el-button>
        <el-button type="primary" @click="editCourse" v-if="btnRoleList['3-5-2']"><i class="el-icon-edit"></i> 编辑课程</el-button>
        <el-button type="primary" @click="deleteTip" v-if="btnRoleList['3-5-3']"><i class="el-icon-delete"></i> 删除课程</el-button>
        <el-button type="primary" @click="printpage" v-if="btnRoleList['3-5-4']"><i class="el-icon-printer"></i> 打印课表</el-button>
        <span class="Rrrefresh" @click="__init">
          <el-button icon="el-icon-refresh" circle></el-button>
        </span>
    </div>
    <div class="table-top">
      <span class="arrow" @click="chooseTimeWeek(-1)"><i class="el-icon-arrow-left"></i></span>
      <span class="date">{{startDay}} ~ {{endDay}}</span>
      <span class="arrow" @click="chooseTimeWeek(1)"><i class="el-icon-arrow-right"></i></span>
    </div>
    <table class="myTable" ref="myDiv" style="width:100%;border-collapse:collapse;border-spacing: none;cellspacing:0;" v-loading="listLoading">
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
          <td>
            <table-list :courseList="monday"
              @childToParent="childToParent"
              ref="tableListDoc1"></table-list>
          </td>
          <td>
            <table-list :courseList="tuesday" 
              @childToParent="childToParent" 
              ref="tableListDoc2"></table-list>
          </td>
          <td>
            <table-list :courseList="wednesday" 
              @childToParent="childToParent" 
              ref="tableListDoc3"></table-list>
          </td>
          <td>
            <table-list :courseList="thursday" 
              @childToParent="childToParent" 
              ref="tableListDoc4"></table-list>
          </td>
          <td>
            <table-list :courseList="friday" 
              @childToParent="childToParent" 
              ref="tableListDoc5"></table-list>
          </td>
          <td>
            <table-list :courseList="saturday" 
              @childToParent="childToParent" 
              ref="tableListDoc6"></table-list>
          </td>
          <td>
            <table-list :courseList="sunday" 
              @childToParent="childToParent" 
              ref="tableListDoc7"></table-list>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- 添加公开课 -->
    <add-public-course-dialog 
      ref="addPublicCourseDoc" 
      @addCourseBtn='addCourseBtn'>
    </add-public-course-dialog>

    <!-- 修改公开课 -->
    <edit-public-course-dialog
      v-if="centerDialogVisible2"
      :dialogVisible='centerDialogVisible2'
      :courseForm='courseMsg'
      @dialogClosed='dialogClosedEdit'
      @editCourseBtn='editCourseBtn'
      ref="editPublicCourseDoc">
    </edit-public-course-dialog>

    <!-- 删除 -->
    <el-dialog
      title="提示"
      :visible.sync="deleteDialogVisible"
      width="490px"
      class="course-dialog" style="margin-top: 28vh;" :close-on-click-modal="false">
      <div style="color:#000;text-align:center;font-size:18px;margin:20px 0;">确定要删除选中的公开课信息？</div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" class="black" style="padding:10px 34px;" @click="deleteCourse" :loading="delLoading">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { groupCourseList, deletePublicCourse } from '@/api/course'
import { parseTime } from '@/utils/index'
import addPublicCourseDialog from './props/addCourse'
import editPublicCourseDialog from './props/editCourse'
import tableList from './props/tableList'
import { setSession } from '@/utils/auth'
export default {
  name: 'publicCourseManage',
  components: {
    addPublicCourseDialog,
    editPublicCourseDialog,
    tableList
  },
  data() {
    return {
      btnRoleList: {},
      tableKey: 0,
      listLoading: false,
      delLoading: false,
      loading: false,
      isActive: false,
      startDay: '',
      endDay: '',
      ind: '',
      week: '',
      nextIndex: 0,
      courseId: '',
      courseMsg: null,
      centerDialogVisible2: false,
      centerDialogVisible3: false,
      deleteDialogVisible: false,
      listQuery: {
        type: 0,
        gmt_booking_from: '',
        gmt_booking_to: ''
      },
      totalTableList: '',
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: [],
      weekDate: [{
        label: '星期一',
        value: 1
      }, {
        label: '星期二',
        value: 2
      }, {
        label: '星期三',
        value: 3
      }, {
        label: '星期四',
        value: 4
      }, {
        label: '星期五',
        value: 5
      }, {
        label: '星期六',
        value: 6
      }, {
        label: '星期日',
        value: 7
      }],
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
      time: []
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
    // 打印
    printpage() {
      // outerHTML除了包含innerHTML的全部内容外, 还包含对象标签本身。
      var printHtml = this.$refs.myDiv.outerHTML
      // var couseText = printHtml.replace(/(data-v-[\s\S]{12})/g, '')
      setSession('cousetext', printHtml)
      setSession('cousetitle', '公开课课表')
      window.open(this.staticurl + 'static/protocolprint/couseprint.html')
    },
    // 获得课程
    getList() {
      this.listLoading = true
      groupCourseList(this.listQuery).then(response => {
        this.resetData()
        this.totalTableList = response.data
        for (let i = 0; i < response.data.length; i++) {
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
        this.listLoading = false
      })
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
      } else if (status === -1) { // 下一周
        this.nextIndex--
      } else if (status === 0) { // 当前周
        this.nextIndex = 0
      }
      this.startDay = parseTime(new Date().setDate(nowDay - nowDayOfWeek + 7 * this.nextIndex), '{y}-{m}-{d}')
      this.endDay = parseTime(new Date().setDate(nowDay - nowDayOfWeek + 7 * (this.nextIndex + 1) - 1), '{y}-{m}-{d}')
      this.listQuery.gmt_booking_from = parseTime(new Date().setDate(nowDay - nowDayOfWeek + 7 * this.nextIndex), '{y}-{m}-{d}') + ' 00:00:00' // 格式化日期
      this.listQuery.gmt_booking_to = parseTime(new Date().setDate(nowDay - nowDayOfWeek + 7 * (this.nextIndex + 1) - 1), '{y}-{m}-{d}') + ' 23:59:59' // 格式化日期
      for (let i = 0; i < this.theadList.length; i++) {
        this.theadList[i].date = parseTime(new Date().setDate(nowDay - nowDayOfWeek + 7 * this.nextIndex + i), '{m}-{d}')
      }
      // 获得课程
      this.getList()
      if (status !== 0 && status !== '' && this.courseId) { // 切换日期时获得选中课程时间
        this.getDateAndWeek()
      }
    },
    // 改变背景色
    childToParent(obj) {
      this.courseId = obj.courseId
      this.courseMsg = obj.courseMsg
      this.groupFull = obj.groupFull // 是否满团
      this.nowDay = obj.nowDay // 上课开始时间
      this.nowWeek = obj.nowWeek
      this.getDateAndWeek()
      for (let i = 1; i < 8; i++) {
        if (this.nowWeek !== i) {
          this.$refs['tableListDoc' + i].clearInd() // 重置ind
        }
      }
    },
    getDateAndWeek() {
      // 获得预约详情中的星期和日期
      if (this.startDay.split('-')[0]) {
        this.orderDay = this.startDay.split('-')[0] // 获得年
      }
      for (let i = 1; i < this.theadList.length + 1; i++) {
        if (this.nowWeek === i) {
          this.orderWeekDay = this.theadList[i - 1].week
          this.orderDay += '-' + this.theadList[i - 1].date // 获得选中课程日期
        }
      }
      this.courseMsg.orderDay = this.orderDay
      this.courseMsg.orderWeekDay = this.orderWeekDay
    },
    deleteTip() {
      if (this.courseId === '') {
        this.common.message('warning', '请选择课程！')
        return
      }
      this.deleteDialogVisible = true
    },
    // 删除课程
    deleteCourse() {
      this.delLoading = true
      deletePublicCourse(this.courseId).then((res) => {
        this.delLoading = false
        this.getList()
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
        this.deleteDialogVisible = false
        this.courseId = ''
      }).catch(() => {
        this.delLoading = false
      })
    },
    dialogClosedEdit() {
      this.centerDialogVisible2 = false
    },
    // 点击添加按钮
    addCourse() {
      this.$refs.addPublicCourseDoc.dialogShow()
    },
    addCourseBtn() {
      this.getList()
    },
    // 修改课程
    editCourse() {
      if (this.courseId === '') {
        this.common.message('warning', '请选择课程！')
        return
      }
      this.centerDialogVisible2 = true
    },
    // 修改课程确定
    editCourseBtn(week) {
      this.centerDialogVisible2 = false
      this.chooseTimeWeek()
      this.$refs['tableListDoc' + week].setInd(this.courseMsg.id) // 编辑时间过后，重置ind
    },
    resetRefrash() {
      this.$nextTick(() => {
        for (let i = 1; i < 8; i++) {
          this.$refs['tableListDoc' + i].clearInd() // 重置ind
        }
      })
      this.courseId = ''
    }
  },
  filters: {
  },
  destroyed() {
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
* {
  margin: none;
  padding: none;
}
.div-big-container {
  height: calc(100vh - 260px);
}
.course-dialog .form-box .selectTime /deep/ {
  .el-input__inner {
    width: 300px;
  }
  .el-input{
    width: 300px;
  }
}
.btn-box {
  border: 1px solid #cccccc;
  padding: 15px;
  margin: 20px 0;
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
.myTable {
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
          -webkit-box-shadow: inset 0 0 1px rgba(0,0,0,0);
          background: rgba(0,0,0,0.2);
      }
      .big-box::-webkit-scrollbar-track {/*滚动条里面轨道*/
          -webkit-box-shadow: inset 0 0 1px rgba(0,0,0,0);
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
        width: 100%;
        background-color: #fff;
        p.name {
          font-weight: bold;
          font-size: 18px;
          color: #000;
        }
        p {
          position: relative;
          color: #666;
          // min-width: 160px;
          // width: 160px;
          // overflow: hidden;
          // text-overflow:ellipsis;
          // white-space: nowrap;
          span {
            position: absolute;
            top: 0;
            right: -3px;
          }
          // .isCT {
          //   position: absolute;
          //   top: 0;
          //   right: 28px;
          // }
          // .number {
          //   position: absolute;
          //   top: 0;
          //   right: -3px;
          // }
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
}
</style>
