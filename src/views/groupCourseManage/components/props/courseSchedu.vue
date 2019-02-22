<template>
    <el-dialog
      title="添加排期"
      :visible.sync="dialogVisible"
      width="900px"
      class="course-dialog" @close="addClose">
      <div class="form-box">

        <div class="box-one">
          <b class="b">*</b><span>团课课程</span>
          <el-radio-group v-model="radio1" class="my-radio" @change="handleRadio" v-if="isShow">
            <el-radio :label="1">添加新课程</el-radio>
            <el-radio :label="0">添加已有课程</el-radio>
          </el-radio-group>
          <el-select v-model="value" placeholder="请选择" class="my-select" v-if="isShow" :disabled="isChoose" @change="chooseCourse">
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
                <el-option :label="item.label" :value="item.value" :key="index" v-for="(item,index) in course_type"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="课程名称：" prop="name" style="margin-left: 30px;">
              <el-input v-model="courseForm.name" placeholder="请输入课程名称" :maxlength="16" :disabled="disabled"></el-input>
            </el-form-item>
            <el-form-item label="教练姓名：" prop="coach_id">
              <el-select v-model="courseForm.coach_id" placeholder="请选择教练" :disabled="disabled" @change="changeCoach">
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
              <el-switch v-model="courseForm.needHalls" style="width: 270px;" :disabled="disabled" @change="changeSwitch"></el-switch>
            </el-form-item>
            <el-form-item label="场地选择：" prop="hall_id" style="margin-left:30px;">
              <el-select v-model="courseForm.hall_id" placeholder="请选择场地" :disabled="!courseForm.needHalls || disabled">
                <el-option :label="item.name" :value="item.id" :key="index" v-for="(item,index) in hallsList"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>

        <div class="box-three">
          <b class="b">*</b><span>起始日期</span>
          <el-date-picker class="my-date-picker"
            v-model="time"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期" :picker-options="pickerOptions">
          </el-date-picker>
          <span class="tips">提示：该课程会在起止日期内，每周自动重复</span>
        </div>

        <div class="box-four">
          <b class="b">*</b><span>上课时间</span>
          <el-checkbox-group v-model="checkList" class="my-checkbox-group" @change="handleChecked">
            <el-checkbox :label="item.id" v-for="(item,index) in week" :key="index">{{item.label}}</el-checkbox>
          </el-checkbox-group>
        </div>

        <div class="box-five">
          <el-table stripe class="my-table" :data="tableList" border fit highlight-current-row>
            <el-table-column align="center" :label="'星期'">
              <template slot-scope="scope">
                <span>{{scope.row.week}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" :label="'开始时间'" width="260">
              <template slot-scope="scope">
                 <el-time-select
                  placeholder="起始时间"
                  v-model="scope.row.start_time"
                  :picker-options="{
                    start: work_start_time,
                    step: '00:15',
                    end: work_end_time
                  }">
                </el-time-select>
              </template>
            </el-table-column>
            <el-table-column align="center" :label="'结束时间'" width="260">
              <template slot-scope="scope">
                <el-time-select
                  placeholder="结束时间"
                  v-model="scope.row.end_time"
                  :picker-options="{
                    start: work_start_time,
                    step: '00:15',
                    end: work_end_time,
                    minTime: scope.row.start_time
                  }">
                </el-time-select>
              </template>
            </el-table-column>
            <el-table-column align="center" :label="'操作'">
              <template slot-scope="scope">
                <span :class="scope.$index?'my-span':'graySpan'" @click="handleTime(scope.$index)">时间同上</span>
              </template>
            </el-table-column>
          </el-table>
        </div>

      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" class="black" style="padding:10px 34px;" :loading="loading" @click="courseDataSure">确定</el-button>
      </span>
    </el-dialog>
</template>

<script>
import { groupCourseNameList, newAddGroupCourse, newAddGroupCourseDate, privateCoachList, gethallsList } from '@/api/course'
import { testFloat2 } from '@/utils/validate'
import { parseTime } from '@/utils/index'
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
    courseScheduMsg: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      disabled: false,
      isChoose: true,
      isShow: true,
      dialogVisible: false,
      loading: false,
      radio1: 1,
      courseOptions: [],
      allCourseMsg: [],
      value: '',
      time: '',
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      checkList: [],
      week: [
        { id: 1 + ',星期一', label: '星期一' },
        { id: 2 + ',星期二', label: '星期二' },
        { id: 3 + ',星期三', label: '星期三' },
        { id: 4 + ',星期四', label: '星期四' },
        { id: 5 + ',星期五', label: '星期五' },
        { id: 6 + ',星期六', label: '星期六' },
        { id: 7 + ',星期日', label: '星期日' },
      ],
      tableList: [],
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
      courseData: {
        course_id: '',
        start_date: '',
        end_date: '',
        weekly: {},
      },
      coach: [],
      work_start_time: '',
      work_end_time: '',
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
        effect: [{ required: true, message: '请选择课程', trigger: 'change' }],
        name: [
          { required: true, message: '请选择课程名称', trigger: 'change' },
          { min: 1, max: 16, message: '长度在 1 到 16 个字符', trigger: 'blur' }
        ],
        coach_id: [{ required: true, message: '请选择教练', trigger: 'change' }],
        address: [{ required: true, message: '请输入上课地点', trigger: 'change' }],
        price: [{ required: true, trigger: 'blur', validator: realpayVerification }],
        min_person: [{ required: true, message: '请输入上课人数', trigger: 'blur' }],
        max_person: [{ required: true, message: '请输入上课人数', trigger: 'blur' }]
      },
      hallsList: []
    }
  },
  created() {
    this.getCourseAll()
    this.getCoaches()
  },
  watch: {
    courseScheduMsg: function(newValue, oldValue) {
      this.courseShow()
    }
  },
  methods: {
    // 获得所有课程
    getCourseAll() {
      groupCourseNameList().then(response => {
        this.allCourseMsg = response.data // 获得所有课程
        for (let i = 0; i < response.data.length; i++) {
          this.courseOptions.push({ label: response.data[i].name, value: response.data[i].id })
        }
      })
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
        this.courseForm.hall_id = chooseData[0].hall_id
        this.courseForm.needHalls = true
      } else {
        this.courseForm.hall_id = null
        this.courseForm.needHalls = false
      }
      this.changeCoach(this.courseForm.coach_id)
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
    },
    courseDataSure() {
      if (!this.time) {
        this.common.message('warning', '起始日期不能为空')
        return
      } else {
        this.courseData.start_date = parseTime(new Date(this.time[0]), '{y}-{m}-{d}')
        this.courseData.end_date = parseTime(new Date(this.time[1]), '{y}-{m}-{d}')
      }
      if (!this.checkList.length) {
        this.common.message('warning', '上课时间不能为空')
        return
      } else {
        this.courseData.weekly = {}
        for (let i = 0; i < this.tableList.length; i++) {
          if (!this.tableList[i].start_time) {
            this.common.message('warning', '上课开始时间不能为空')
            return
          } else if (!this.tableList[i].end_time) {
            this.common.message('warning', '上课结束时间不能为空')
            return
          } else if (this.tableList[i].start_time && this.tableList[i].end_time) {
            let key = String(this.tableList[i].id)
            this.courseData.weekly[key] = { 'start_time': this.tableList[i].start_time + ':00', 'end_time': this.tableList[i].end_time + ':00' }
          }
        }
      }
      if (this.radio1 === 1) { // 添加新课程
        this.addCourseSure()
      }
      if (this.radio1 === 0) { // 添加已有课程
        if (!this.courseForm.coach_id) {
          this.common.message('warning', '请选择课程')
          return
        }
        // if (this.courseScheduMsg) { // 用于团课课程-排期
        //   this.courseData.course_id = this.courseScheduMsg.id
        // }
        this.addCourseDate()
      }
    },
    addCourseSure() {
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
      if (this.courseForm.needHalls && !this.courseForm.hall_id) {
        this.common.message('warning', '请选择场地')
        return false
      }
      this.$refs.courseForm.validate((valid) => {
        if (valid) {
          this.loading = true
          newAddGroupCourse(this.courseForm).then((res) => {
            this.courseData.course_id = res.data.id
            this.addCourseDate()
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    addCourseDate() {
      this.loading = true
      newAddGroupCourseDate(this.courseData).then((res) => {
        this.loading = false
        this.common.message('success', '添加排期成功')
        this.dialogVisible = false
        this.$emit('addCourseDateBtn')
      }).catch(() => {
        this.loading = false
      })
    },
    // 重置
    addClose() {
      this.value = ''
      // this.courseData.course_id = ''
      this.$refs.courseForm.resetFields()
      this.time = ''
      this.checkList = []
      this.tableList = []
    },
    isShowTrue() {
      this.isShow = true
    },
    isShowFalse() {
      this.isShow = false
      this.disabled = true
      this.radio1 = 0 // 排期已有的课程
    },
    dialogShow() {
      this.dialogVisible = true
      this.gethallsListMethods()
    },
    courseShow() {
      if (this.courseScheduMsg) {
        // console.log(this.courseScheduMsg)
        this.courseData.course_id = this.courseScheduMsg.id
        this.courseForm.name = this.courseScheduMsg.name
        this.courseForm.price = this.courseScheduMsg.price
        this.courseForm.address = this.courseScheduMsg.address
        this.courseForm.coach_id = this.courseScheduMsg.coach_id
        this.courseForm.max_person = this.courseScheduMsg.max_person
        this.courseForm.min_person = this.courseScheduMsg.min_person
        this.courseForm.effect = this.courseScheduMsg.effect
        this.courseScheduMsg.hall_id ? this.courseForm.needHalls = true : this.courseForm.needHalls = false
        this.courseForm.hall_id = this.courseScheduMsg.hall_id ? this.courseScheduMsg.hall_id : null
        this.changeCoach(this.courseForm.coach_id)
      }
    },
    handleRadio(val) {
      if (val === 1) {
        this.disabled = false
        this.isChoose = true
        this.value = ''
        this.courseData.course_id = ''
        this.$refs.courseForm.resetFields()
      } else {
        this.disabled = true
        this.isChoose = false
      }
    },
    // 时间同上
    handleTime(index) {
      if (index !== 0) {
        this.tableList[index].start_time = this.tableList[index - 1].start_time
        this.tableList[index].end_time = this.tableList[index - 1].end_time
      }
    },
    // 选择week
    handleChecked(val) {
      let arr = []
      for (let i = 0; i < val.length; i++) {
        let obj = { id: val[i].split(',')[0], week: val[i].split(',')[1], start_time: '', end_time: '' }
        arr.push(obj)
      }
      if (!this.tableList.length) {
        this.tableList = arr
      } else {
        const result = this.tableList.filter(item => arr.indexOf(item.id) === -1) // 找出相同项
        for (let i = 0; i < arr.length; i++) {
          for (let j = 0; j < result.length; j++) {
            if (arr[i].id === result[j].id) {
              this.$set(arr, i, result[j])
            }
          }
        }
        this.tableList = arr
      }
    },
    /* 获取席位列表 */
    gethallsListMethods() {
      // let that = this
      gethallsList().then(res => {
        this.hallsList = res.data
        /* var seatItem = that.hallsList.filter(function(v) {
          return v.id === that.courseForm.hall_id
        })[0]
        if (!seatItem && that.courseForm.hall_id) {
          that.courseForm.hall_id = '该模板已被删除'
        } */
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
      width: 420px;
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
  /deep/ .self-left {
    .el-form-item__label {
      padding-left: 10px;
      box-sizing: content-box;
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
  }
  .tips {
    color: #ff3131;
    font-size: 12px;
  }
}
.box-four {
  .b {
    margin-right: 5px;
    color: #f56c6c;
  }
  .my-checkbox-group {
    display: inline-block;
    margin-left: 15px;
  }
}
.box-five {
  margin-top: 20px;
  .my-table /deep/ {
    thead{
      color: #333;
      font-weight: normal;
      th {
        background: #f2f2f2;
        font-weight: normal;
        line-height: 20px;
      }
    }
    .el-table__body td {
      background: #fff;
    }
  }
  .my-span {
    color: #409EFF;
    cursor: pointer;
  }
  .graySpan {
    color: #ccc;
  }
}
</style>
