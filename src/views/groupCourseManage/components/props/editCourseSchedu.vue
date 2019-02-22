<template>
    <el-dialog
      title="编辑排期"
      :visible.sync="dialogVisible"
      width="900px"
      class="course-dialog" @close="addClose">
      <div class="form-box">

        <div class="box-one">
          <b class="b">*</b><span>团课课程</span>
          <el-radio-group v-model="radio1" class="my-radio" @change="handleRadio">
            <el-radio :label="0">选择已有课程</el-radio>
            <el-radio :label="1">替换为新课程</el-radio>
          </el-radio-group>
          <el-select v-model="value" placeholder="请选择" class="my-select" @change="chooseCourse" :disabled="isChoose" >
            <el-option
              v-for="item in courseOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>

        <div class="box-two">
          <el-form :model="courseForm" :rules="rules1" ref="courseForm">
            <el-form-item label="课程类型：" prop="effect">
              <el-select v-model="courseForm.effect" placeholder="请选择课程类型" :disabled="disabled">
                <el-option :label="item.label" :value="item.value" :key="index" v-for="(item,index) in course_type" ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="课程名称：" prop="name" style="margin-left: 30px;">
              <el-input v-model="courseForm.name" placeholder="请输入课程名称" :maxlength="16" :disabled="disabled"></el-input>
            </el-form-item>
            <el-form-item label="教练姓名：" prop="coach_id">
              <el-select v-model="courseForm.coach_id" filterable placeholder="请选择教练" :disabled="disabled" @change="changeCoach">
                <el-option :label="item.label" :value="item.value" :key="index" :disabled="item.status === 3" v-for="(item,index) in coach"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="课程价格：" prop="price" style="margin-left: 30px;">
              <el-input v-model="courseForm.price" placeholder="请输入课程价格" type="number" :disabled="disabled"></el-input>
            </el-form-item>
            <el-form-item label="上课地点：" prop="address">
              <el-input v-model="courseForm.address" placeholder="请输入上课地点" :maxlength="20" :disabled="disabled"></el-input>
            </el-form-item>
            <el-form-item label="上课人数：" prop="min_person" class="min_person" style="margin-left: 32px;">
              <el-input v-model="courseForm.min_person" placeholder="最少人数" type="number" min="1" max="1000" :disabled="disabled"></el-input>
            </el-form-item>
            <el-form-item label="" prop="max_person" class="min_person">
              <el-input v-model="courseForm.max_person" placeholder="最多人数" type="number" min="1" max="1000" :disabled="disabled"></el-input>
            </el-form-item>
            <el-form-item label="席位预约：" class="self-left">
              <el-switch v-model="courseForm.needHalls" :disabled="disabled" style="width: 270px;" @change="changeSwitch"></el-switch>
            </el-form-item>
            <el-form-item label="场地选择：" prop="hall_id" style="margin-left:30px;">
              <el-select v-model="courseForm.hall_id" placeholder="请选择场地" :disabled="!courseForm.needHalls || disabled">
                <el-option :label="item.name" :value="item.id" :key="index" v-for="(item,index) in hallsList"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>

        <div class="box-three">
          <b class="b">*</b><span>上课时间</span>
          <el-date-picker class="my-date-picker"
            v-model="course_date"
            type="date"
            placeholder="选择日期" @change="changeDate" :picker-options="pickerOptions">
          </el-date-picker>

          <span class="span-r">{{weekNow}}</span>

          <el-time-select class="my-time-select"
            placeholder="起始时间"
            v-model="time_start"
            :editable="false"
            :picker-options="{
              start: work_start_time,
              step: '00:15',
              end: work_end_time
            }">
          </el-time-select>
          至
          <el-time-select class="my-time-select"
            placeholder="结束时间"
            v-model="time_end"
            :editable="false"
            :picker-options="{
              start: work_start_time,
              step: '00:15',
              end: work_end_time,
              minTime: time_start
            }">
          </el-time-select>
          <span class="tips">提示：仅修改本节课的排期</span>
        </div>

      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" class="black" style="padding:10px 34px;" :loading="loading" @click="editCourseBtn">确定</el-button>
      </span>
    </el-dialog>
</template>

<script>
import { parseTime } from '@/utils/index'
import { privateCoachList, groupCourseNameList, editNewGroupCourseDate, newAddGroupCourse, newCourseScheduleById, gethallsList } from '@/api/course'
import { testFloat2 } from '@/utils/validate'
const realpayVerification = (rule, value, callback) => {
  if (!testFloat2(value)) {
    callback(new Error('实付金额为正数，且只可保留两位小数'))
  } else if (Number(value) > 99999999) {
    callback(new Error('实付金额小于99999999'))
  } else if (Number(value) === 0) {
    callback(new Error('实付金额必须大于0'))
  } else {
    callback()
  }
}
export default {
  name: 'courseSchedu',
  props: {
    courseMsg: {
      type: Object
    },
  },
  computed: {
  },
  data() {
    return {
      disabled: true,
      dialogVisible: false,
      isChoose: false,
      loading: false,
      radio1: 0,
      courseOptions: [],
      value: '',
      course_date: '',
      weekNow: '',
      time_start: '',
      time_end: '',
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      courseForm: { // 添加
        name: '',
        price: '',
        address: '',
        coach_id: '',
        max_person: '',
        min_person: '',
        effect: '',
        needHalls: false,
        hall_id: ''
      },
      work_start_time: '',
      work_end_time: '',
      courseData: {
        course_id: '',
        course_date: '',
        start_time: '',
        end_time: ''
      },
      coach: [],
      course_type: [{
        label: '增肌',
        value: 'Z'
      }, {
        label: '减脂',
        value: 'J'
      }, {
        label: '塑形',
        value: 'S'
      }],
      // 表单验证规则
      rules1: {
        effect: [{ required: true, message: '请选择课程', trigger: 'blur' }],
        name: [
          { required: true, message: '请选择课程名称', trigger: 'blur' },
          { min: 1, max: 16, message: '长度在 1 到 16 个字符', trigger: 'blur' }
        ],
        coach_id: [{ required: true, message: '请选择教练', trigger: 'change' }],
        address: [{ required: true, message: '请输入上课地点', trigger: 'blur' }],
        price: [{ required: true, trigger: 'blur', validator: realpayVerification }],
        min_person: [{ required: true, message: '请输入上课人数', trigger: 'blur', max: '1000' }],
        max_person: [{ required: true, message: '请输入上课人数', trigger: 'blur' }]
      },
      hallsList: []
    }
  },
  mounted() {
  },
  created() {
    this.getCourseAll()
    this.getCoaches()
    this.gethallsListMethods()
  },
  methods: {
    // 获得所有课程
    getCourseAll() {
      this.courseOptions = []
      groupCourseNameList().then(response => {
        this.allCourseMsg = response.data // 获得所有课程
        for (let i = 0; i < response.data.length; i++) {
          this.courseOptions.push({ label: response.data[i].name, value: response.data[i].id })
        }
      })
    },
    // 获得所有教练
    getCoaches() {
      this.coach = []
      let data = { 'post': 1 } // post：1教练
      privateCoachList(data).then(response => {
        for (let i = 0; i < response.data.length; i++) {
          if (response.data[i].status === 1) {
            this.coach.push({
              'label': response.data[i].name,
              'value': response.data[i].id,
              'status': response.data[i].status,
              'start_work_time': response.data[i].start_work_time,
              'end_work_time': response.data[i].end_work_time
            })
          }
        }
      })
    },
    changeCoach(val) {
      let obj = this.coach.find((item) => {
        return item.value === val
      })
      this.work_start_time = obj.start_work_time.substring(0, 5)
      this.work_end_time = obj.end_work_time.substring(0, 5)
      console.log(this.work_start_time)
    },
    /* 选择替换课程 */
    chooseCourse(val) {
      this.courseData.course_id = val
      let chooseData = this.allCourseMsg.filter(function(item) {
        return item.id === val
      })
      this.courseForm.name = chooseData[0].name
      this.courseForm.price = chooseData[0].price
      this.courseForm.address = chooseData[0].address
      this.courseForm.coach_id = chooseData[0].coach_id
      this.courseForm.max_person = chooseData[0].max_person
      this.courseForm.min_person = chooseData[0].min_person
      this.courseForm.effect = chooseData[0].effect
      if (chooseData[0].hall_id) { /* 显示绑定的场地 */
        this.courseForm.needHalls = true
        this.courseForm.hall_id = chooseData[0].hall_id
      } else {
        this.courseForm.needHalls = false
        this.courseForm.hall_id = null
      }
      this.changeCoach(this.courseForm.coach_id)
    },
    getCourseScheduleById() {
      newCourseScheduleById(this.courseMsg.id).then((res) => {
        this.value = res.data.group_course_id
        this.getWeek(String(res.data.week))
        this.course_date = parseTime(new Date(res.data.start_at), '{y}-{m}-{d}')
        this.time_start = parseTime(new Date(res.data.start_at), '{h}:{i}')
        this.time_end = parseTime(new Date(res.data.end_at), '{h}:{i}')
      }).catch(() => {
      })
    },
    dialogShow() {
      this.dialogVisible = true
      this.getCourseScheduleById()
      this.getCourseAll()
      // 渲染课程
      // console.log(this.courseMsg)
      this.courseData.course_id = this.courseMsg.group_course_id
      this.courseForm.name = this.courseMsg.name
      this.courseForm.price = this.courseMsg.price
      this.courseForm.address = this.courseMsg.address
      this.courseForm.coach_id = this.courseMsg.coach_id
      this.courseForm.max_person = this.courseMsg.max_person
      this.courseForm.min_person = this.courseMsg.min_person
      this.courseForm.effect = this.courseMsg.effect
      if (this.courseMsg.hall_id) {
        this.courseForm.needHalls = true
        this.courseForm.hall_id = this.courseMsg.hall_id
      } else {
        this.courseForm.needHalls = false
        this.courseForm.hall_id = null
      }
      this.changeCoach(this.courseForm.coach_id)
    },
    changeDate(val) {
      let week = ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
      this.weekNow = week[new Date(val).getDay()]
    },
    getWeek(val) {
      switch (val) {
        case '1': {
          this.weekNow = '星期一'
          return
        }
        case '2': {
          this.weekNow = '星期二'
          return
        }
        case '3': {
          this.weekNow = '星期三'
          return
        }
        case '4': {
          this.weekNow = '星期四'
          return
        }
        case '5': {
          this.weekNow = '星期五'
          return
        }
        case '6': {
          this.weekNow = '星期六'
          return
        }
        case '7': {
          this.weekNow = '星期天'
          return
        }
        default:
          return ''
      }
    },
    handleRadio(val) {
      if (val === 0) {
        this.disabled = true
        this.isChoose = false
        this.courseData.course_id = this.courseMsg.group_course_id
        this.chooseCourse(this.value)
      } else {
        this.disabled = false
        this.isChoose = true
        // this.value = ''
        // this.$refs.courseForm.resetFields()
        this.resetData()
        this.courseData.course_id = ''
        console.log(this.$refs.courseForm)
      }
    },
    resetData() {
      this.courseForm.name = ''
      this.courseForm.price = ''
      this.courseForm.address = ''
      this.courseForm.coach_id = ''
      this.courseForm.max_person = ''
      this.courseForm.min_person = ''
      this.courseForm.effect = ''
    },
    addClose() {
      this.radio1 = 0
      this.handleRadio(0)
    },
    editCourseBtn() {
      if (this.radio1 === 0) { // 选择已有课程
        this.editCourseDate()
      } else {
        this.courseData.course_id = this.courseMsg.group_course_id
        this.editCourseMsg()
      }
    },
    editCourseMsg() {
      if (!this.courseForm.effect) {
        this.common.message('warning', '课程类型不能为空')
        return false
      }
      if (!this.courseForm.name) {
        this.common.message('warning', '课程名称不能为空')
        return false
      }
      if (this.courseForm.name.length > 16) {
        this.common.message('warning', '课程名称不能得超过16字符')
        return false
      }
      if (!this.courseForm.coach_id) {
        this.common.message('warning', '教练名称不能为空')
        return false
      }
      if (!this.courseForm.price) {
        this.common.message('warning', '课程价格不能为空')
        return false
      }
      if (!/^\d+$/.test(this.courseForm.price) && this.courseForm.price.toString().split('.')[1].length > 2) {
        this.common.message('warning', '课程价格最多保留2位小数')
        return false
      }
      if (!this.courseForm.address) {
        this.common.message('warning', '上课地点不能为空')
        return false
      }
      if (!this.courseForm.min_person) {
        this.common.message('warning', '最少人数不能为空')
        return false
      } else if (this.courseForm.min_person > 1000) {
        this.common.message('warning', '上课人数最多不得超过1000')
        return false
      } else if (this.courseForm.min_person < 1) {
        this.common.message('warning', '上课人数不能少于1人')
        return false
      } else if (!/^\d+$/.test(this.courseForm.min_person)) {
        this.common.message('warning', '最少人数不能为小数')
        return false
      }
      if (!this.courseForm.max_person) {
        this.common.message('warning', '最多人数不能为空')
        return false
      } else if (this.courseForm.max_person > 1000) {
        this.common.message('warning', '上课人数最多不得超过1000')
        return false
      } else if (this.courseForm.max_person < 1) {
        this.common.message('warning', '上课人数不能少于1人')
        return false
      } else if (!/^\d+$/.test(this.courseForm.max_person)) {
        this.common.message('warning', '最多人数不能为小数')
        return false
      }
      if (this.courseForm.min_person - this.courseForm.max_person > 0) {
        this.common.message('warning', '上课最少人数不能大于上课最多人数')
        return false
      }
      this.$refs.courseForm.validate((valid) => {
        if (valid) {
          this.loading = true
          newAddGroupCourse(this.courseForm).then((res) => {
            this.loading = false
            this.courseData.course_id = res.data.id
            this.editCourseDate()
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    editCourseDate() {
      if (!this.course_date) {
        this.common.message('warning', '上课日期不能为空')
        return
      }
      if (!this.time_start) {
        this.common.message('warning', '上课开始时间不能为空')
        return
      }
      if (!this.time_end) {
        this.common.message('warning', '上课结束时间不能为空')
        return
      }
      this.courseData.course_date = parseTime(new Date(this.course_date), '{y}-{m}-{d}')
      this.courseData.start_time = this.time_start + ':00'
      this.courseData.end_time = this.time_end + ':00'
      this.loading = true
      editNewGroupCourseDate(this.courseMsg.id, this.courseData).then((res) => {
        this.loading = false
        this.common.message('success', '修改成功')
        this.dialogVisible = false
        this.$emit('editCourseDateBtn', res.data.group_course_id)
      }).catch(() => {
        this.loading = false
      })
    },
    /* 获取席位列表 */
    gethallsListMethods() {
      gethallsList().then(res => {
        this.hallsList = res.data
      })
    },
    changeSwitch(val) {
      if (!val) {
        this.courseForm.hall_id = null
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.dialog-footer /deep/{
  text-align:center;
  .black {
    background: #000;
    border: 1px solid #000;
  }
}
.box-one {
  .b {
    margin-right: 5px;
    color: #f56c6c;
  }
  .my-radio {
    margin: 0 30px;
  }
  .my-select /deep/ {
    float: right;
    .el-input {
      width: 410px;
    }
    .el-input--medium .el-input__inner {
      height: 30px;
      line-height: 30px;
    }
  }
}
.course-dialog .form-box {
  .box-two /deep/ {
    margin: 20px 0;
    background: #f2f2f2;
    text-align: center;
    padding-top: 20px;
    .el-input__inner {
      width: 255px;
    }
    .el-input{
      width: 255px;
    }
    .min_person {
      .el-input {
        width: 127px;
        .el-input__inner {
          width: 127px;
        }
      }
    }
  }
}
.box-three {
  margin: 30px 0 30px 0;
  .b {
    margin-right: 5px;
    color: #f56c6c;
  }
  .my-date-picker {
    margin: 0 15px;
    width: 150px;
  }
  .my-time-select {
    width: 150px;
  }
  .span-r {
    margin-right: 15px;
  }
  .tips {
    color: #ff3131;
    font-size: 12px;
  }
}
</style>
