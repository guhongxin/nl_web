<template>
<div>
  <el-dialog
      title="私教信息确认"
      :visible.sync="addDialogVisible"
      @close="resetAddForm"
      width="900px" class="addOrder">
      <el-form autoComplete="on" :model="addForm" ref="addForm" label-position="right" label-width='95px' :rules="rules">
        <el-row>
        <el-col :span="12">
          <el-form-item label="客户姓名：" prop="name">
            <el-input v-model="addForm.name" :disabled="true" placeholder="查询或扫码后自动获取" style="width:300px"></el-input>
          </el-form-item>
          <el-form-item label="剩余课时：" prop="times">
            <el-input v-model="addForm.times" :disabled="true" placeholder="查询或扫码后自动获取" style="width:300px"></el-input>
          </el-form-item>
          <el-form-item label="上课日期：" prop="booking_start">
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
            <span class="por">
              <el-input v-model="addForm.coachName" :disabled="true" placeholder="选择教练" style="width:300px"></el-input>
              <span class="poa" @click="openChooseCoach">选择实际带课教练</span>
            </span>
          </el-form-item>
          <el-form-item label="课程名称：" prop="chousevalue">
            <el-select v-model="addForm.chousevalue" disabled @change="changecourse" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注内容：" prop="remark">
            <span class="por">
            <el-input v-model="addForm.remark" placeholder="请输入备注内容" style="width:300px" maxlength="20" v-on:input="getMarkLength"></el-input>
            <span class="poa" style="color:#ccc">{{markLength}}/20</span>
            </span>
          </el-form-item>
        </el-col>
        </el-row>
      </el-form>
      <div>
        <span class="red">*</span>
        <label class="el-form-item__label">上课时间：</label>
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
          <el-button type="primary" class="black" :loading="loading" :disabled="submite" @click="addCoach">确认无误，开始消课</el-button>
        </span>
      </div>
      <el-dialog
      title="实际上课教练"
      append-to-body
      :visible.sync="chooseDialogVisible"
      width="400px">
          <el-select v-model="coachoptionsvalue" @change="coachoptionschangecourse" style="width:100%;" placeholder="请选择实际上课教练">
            <el-option
              v-for="item in coachoptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <div slot="footer" class="dialog-footer">
            <el-button @click="chooseDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="allright" class="black">确定</el-button>
          </div>
      </el-dialog>
    </el-dialog>
    <destoryedCourse
      ref="destoryedCourse"
      @dialogClosed="destoryedCourseClosed"></destoryedCourse>
  </div>
</template>
<script>
import { parseTime } from '@/filters'
// import { getCustomersInfoById } from '@/api/customer'
import { coachAdd } from '@/api/coach'
import { employeeList } from '@/api/employee'
import { detailPrivateBuy, privateCourseDetails } from '@/api/course'
import destoryedCourse from '@/views/privateOrder/components/popus/destoryedCourse'
export default {
  name: 'privateCencel',
  components: {
    destoryedCourse
  },
  data() {
    return {
      addDialogVisible: false,
      addForm: {
        name: '',
        times: '',
        booking_start: Date.now(),
        coachName: '',
        chousevalue: '',
      },
      pickerOptions1: {
        disabledDate(time) {
          // return (time.getTime() + 86400000) < Date.now()
        },
      },
      earlyTime: [],
      markLength: 0,
      options: [],
      coachoptions: [],
      coachoptionsvalue: '',
      loading: false,
      skryxiFind: '',
      chooseDialogVisible: false,
      rules: {
        name: [
          { required: true, message: '请输入客户姓名', trigger: 'blur' },
        ],
        times: [
          { required: true, message: '请输入剩余课时', trigger: 'change' }
        ],
        booking_start: [
          { required: true, message: '请选择上课日期', trigger: 'change' }
        ],
        chousevalue: [
          { required: true, message: '请选择课程', trigger: 'change' }
        ],
        coachName: [
          { required: true, message: '请输入教练名称', trigger: 'change' }
        ],
        // remark: [
        //   { required: true, message: '请输入备注', trigger: 'change' },
        //   { min: 1, max: 16, message: '长度在 1 到 16 个字符', trigger: 'blur' }
        // ]
      },
      curTime: '',
      itemCoachName: '',
      itemCoachId: '',
      phone: '',
      cencelId: '',
      overstart: '', // 实际上课实际开始
      endstart: '', // 实际下课时间结束
      customerCourseId: '',
      id: '',
      type: '',
      booking_start: '', // 私教预约开始时间
      booking_end: '', // 私教预约结束时间
    }
  },
  computed: {
    submite() {
      let a = false
      return this.curTime ? a : !a
    }
  },
  methods: {
    initModel(data) {
      this.addDialogVisible = true
      this.customerCourseId = data.customerCourseId
      this.id = data.id
      this.booking_start = data.booking_start
      this.booking_end = data.booking_end
      if (data.customerCourseId && data.type === 'booking') {
        this.getcusinfo(data.customerCourseId)
      } else {
        this.getcusinfo(data.id)
      }
      this.type = data.type
    },
    destoryedCourseClosed() {
      this.addDialogVisible = false
      this.$emit('dialogClosed')
      this.resetAddForm()
    },
    coachoptionschangecourse(item) {
      this.itemCoachId = item.split(',')[0]
      this.itemCoachName = item.split(',')[1]
    },
    allright() {
      if (this.itemCoachId && this.itemCoachName) {
        this.currentCoachId = this.itemCoachId
        this.addForm.coachName = this.itemCoachName
      }
      this.chooseDialogVisible = false
    },
    openChooseCoach() {
      this.chooseDialogVisible = true
      this.coachoptions = []
      employeeList().then(response => {
        for (let i = 0; i < response.data.length; i++) {
          if (response.data[i].status === 1) { // 有效
            this.coachoptions.push({ label: response.data[i].name, value: response.data[i].id + ',' + response.data[i].name, class: 'ccoach_id' })
          }
        }
      })
    },
    getcusinfo(id) {
      if (id) {
        detailPrivateBuy(id).then(req => {
          this.addForm.name = req.data.customer.name
          this.phone = req.data.customer.phone
          this.cencelId = req.data.course_id
          this.options = []
          this.addForm.chousevalue = req.data.course_id
          this.options.push({ value: req.data.course_id, label: req.data.course_name })
          this.addForm.coachName = req.data.coach_name
          this.addForm.times = (req.data.quantity - req.data.use) + '次'
          this.currentCoachId = req.data.coach_id
          this.currentCoachTime = req.data.course_data.time
          this.gettimelsit(8, 24)
          if (this.type === 'booking') {
            this.changeDate(this.booking_start) // 设置默认选择预约时间范围背景颜色
            this.addForm.booking_start = this.booking_start // 私教购买默认选择预约时间
            let defilttime = parseTime(new Date(this.booking_start).getTime(), '{h}:{i}') // 私教购买默认选择预约时间
            for (let item of this.earlyTime) {
              if (defilttime === item.time) {
                this.selectTime(item)
              }
            }
          } else {
            this.changeDate(Date.now())
          }
        }).catch((err) => {
          this.$alert(err.response.data.message, '注意！', {
            confirmButtonText: '确定',
            showClose: false,
            callback: action => {
              this.addDialogVisible = false
            }
          })
        })
      }
    },
    getPrivateCourseDetails(id) {
      privateCourseDetails(id).then((res) => {
        console.log(res)
      })
    },
    selectTime(choose) {
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
            this.common.message('info', '注意：时间段有重合')
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
      this.overstart = parseTime(new Date(this.addForm.booking_start).getTime(), '{y}-{m}-{d}') + ' ' + this.earlyTime[indexlist[0]].time + ':00'
      this.endstart = parseTime(new Date(this.addForm.booking_start).getTime(), '{y}-{m}-{d}') + ' ' + this.earlyTime[indexlist[indexlist.length - 1]].time + ':00'
    },
    formatMinute(a) {
      return Number(a.split(':')[0]) * 60 + Number(a.split(':')[1])
    },
    addCoach() {
      if (this.addForm.booking_start === '') {
        this.common.message('error', '请选择上课时间')
        return
      }
      this.loading = true
      if (this.type === 'booking') {
        this.$refs.destoryedCourse.initModel(this.phone, this.cencelId, this.overstart, this.endstart, this.currentCoachId, this.addForm.remark, this.id, this.type, this.customerCourseId)
      } else if (this.type === 'buy') {
        coachAdd({ booking_start: this.overstart, customer_course_id: this.id }).then(res => {
          this.loading = false
          this.$refs.destoryedCourse.initModel(this.phone, this.cencelId, this.overstart, this.endstart, this.currentCoachId, this.addForm.remark, res.data.id, this.type, res.data.customer_course_id)
        }).catch(() => {
          this.loading = false
        })
      } else {
        this.loading = false
      }
    },
    resetAddForm() {
      this.$refs.addForm.resetFields()
      this.markLength = 0
      this.currentCoachId = ''
      this.addForm.coachName = ''
      this.phone = ''
      this.cencelId = ''
      this.overstart = ''
      this.endstart = ''
      this.currentCoachId = ''
      this.type = ''
      this.loading = false
      this.curTime = ''
      this.options = []
      this.customerCourseId = ''
      this.booking_start = '' // 私教预约开始时间
      this.booking_end = '' // 私教预约结束时间
      this.gettimelsit(8, 24)
    },
    changeDate(value) {
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
        this.gettimelsit(8, 24)
      }
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
    getMarkLength() {
      this.markLength = this.addForm.remark.length
    },
  }
}
</script>
<style lang="scss" scoped>
.por {position: relative;}
.poa {position: absolute;
  cursor: pointer;
  right: 10px;
  color: #409EFF;
  top: -9px;}
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
