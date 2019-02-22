<template>
    <el-dialog
      title="编辑公开课"
      :visible.sync="dialogVisible"
      :beforeClose='dialogClosed'
      width="900px"
      class="course-dialog">
       <div class="form-box">
        <el-form :model="courseMsg" :rules="rules2" ref="courseModify">
          <el-form-item label="课程名称：" prop="name">
            <el-input v-model="courseMsg.name" placeholder="请输入课程名称" :maxlength="16"></el-input>
          </el-form-item>
          <el-form-item label="教练姓名：" prop="coach_id" style="margin-left:40px">
            <el-select v-model="courseMsg.coach_id" filterable placeholder="请选择教练" @change="changeValue" ref="coach_idDom">
              <el-option :label="item.label" :value="item.value" :key="index" v-for="(item,index) in coach"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="上课地点：" prop="address">
             <el-input v-model="courseMsg.address" placeholder="请输入上课地点" :maxlength="20"></el-input>
          </el-form-item>
          <el-form-item label="上课人数：" prop="min_person" class="min_person" style="margin-left:40px">
             <el-input v-model="courseMsg.min_person" placeholder="最少人数" type="number" min="1" max="1000"></el-input>
          </el-form-item>
          <el-form-item prop="max_person" class="min_person">
             <el-input v-model="courseMsg.max_person" placeholder="最多人数" type="number" min="courseMsg.min_person" max="1000"></el-input>
          </el-form-item>
          <el-form-item label="上课时间：" prop="week" class="selectTime">
            <el-select v-model="courseMsg.week" placeholder="请选择时间" class="select">
              <el-option v-for="item in weekDate" :label="item.label" :value="item.value" :key="item.value"></el-option>
            </el-select>
            <el-time-picker style="width:432px"
              is-range
              v-model="timePicker"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              placeholder="选择时间"
              format="HH:mm">
            </el-time-picker>
          </el-form-item>
        </el-form>
      </div>
      <div class="cabnit-dialog-footer" style="text-align:center;">
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" :loading="loading" @click="editCourseSure" class="black">确定</el-button>
        </span>
      </div>
    </el-dialog>
</template>

<script>
import { privateCoachList, editPublicCourse } from '@/api/course'
import { parseTime } from '@/utils/index'
export default {
  name: 'renewCabinetDialog',
  props: {
    dialogVisible: {
      type: Boolean,
      default: function() {
        return false
      }
    },
    courseForm: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  computed: {
  },
  data() {
    return {
      timePicker: [],
      courseMsg: {
        name: ''
      },
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
      coach: [],
      loading: false,
      // 表单验证规则
      rules2: {
        type: [{ required: true, message: '请选择课程' }],
        name: [
          { required: true, message: '请选择课程名称', trigger: 'blur' },
          { min: 1, max: 16, message: '长度在 1 到 16 个字符', trigger: 'blur' }
        ],
        coach_id: [{ required: true, message: '请选择教练', trigger: 'blur' }],
        address: [{ required: true, message: '请输入上课地点', trigger: 'blur' }],
        price: [{ required: true, message: '请输入课程价格', trigger: 'blur' }],
        min_person: [{ required: true, message: '请输入上课人数', trigger: 'blur' }],
        max_person: [{ required: true, message: '请输入上课人数', trigger: 'blur' }],
        week: [{ required: true, message: '请输入上课时间', trigger: 'change' }]
      }
    }
  },
  mounted() {
    this.getCoaches()
  },
  created() {
    this.courseMsg = this.courseForm
    if (this.timePicker === undefined || !(this.timePicker instanceof Array)) {
      this.timePicker = []
      this.timePicker[0] = parseTime(new Date(), '{y}-{m}-{d}') + ' ' + this.courseMsg.time_start
      this.timePicker[1] = parseTime(new Date(), '{y}-{m}-{d}') + ' ' + this.courseMsg.time_end
    } else {
      this.timePicker[0] = parseTime(new Date(), '{y}-{m}-{d}') + ' ' + this.courseMsg.time_start
      this.timePicker[1] = parseTime(new Date(), '{y}-{m}-{d}') + ' ' + this.courseMsg.time_end
    }
  },
  methods: {
    dialogClosed() {
      this.$emit('dialogClosed')
    },
    changeValue(value) {
      let obj = {}
      obj = this.coach.find((item) => {
        return item.value === value
      })
      this.courseForm.coach_name = obj.label
    },
    timeformat(param) {
      let result = ''
      let date = new Date(param)
      let hh = date.getHours() > 9 ? date.getHours() : '0' + date.getHours()
      let mm = date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes()
      result = hh + ':' + mm + ':00'
      return result
    },
    editCourseSure() {
      if (!this.courseMsg.name) {
        this.common.message('warning', '课程名称不能为空')
        return false
      }
      if (this.courseMsg.name.length > 16) {
        this.common.message('warning', '课程名称不能得超过16字符')
        return false
      }
      if (!this.courseMsg.coach_id) {
        this.common.message('warning', '教练名称不能为空')
        return false
      }
      if (!this.courseMsg.address) {
        this.common.message('warning', '上课地点不能为空')
        return false
      }
      if (!this.courseMsg.min_person) {
        this.common.message('warning', '最少人数不能为空')
        return false
      } else if (this.courseMsg.min_person < 1) {
        this.common.message('warning', '上课人数不能少于1人')
        return false
      } else if (this.courseMsg.min_person > 1000) {
        this.common.message('warning', '上课人数最多不得超过1000')
        return false
      } else if (!/^\d+$/.test(this.courseMsg.min_person)) {
        this.common.message('warning', '最少人数不能为小数')
        return false
      }
      if (!this.courseMsg.max_person) {
        this.common.message('warning', '最多人数不能为空')
        return false
      } else if (this.courseMsg.max_person < 1) {
        this.common.message('warning', '上课人数不能少于1人')
        return false
      } else if (this.courseMsg.max_person > 1000) {
        this.common.message('warning', '上课人数最多不得超过1000')
        return false
      } else if (!/^\d+$/.test(this.courseMsg.max_person)) {
        this.common.message('warning', '最多人数不能为小数')
        return false
      }
      if (this.courseMsg.min_person - this.courseMsg.max_person > 0) {
        this.common.message('warning', '上课最少人数不能大于上课最多人数')
        return false
      }
      if (!this.courseMsg.week) {
        this.common.message('warning', '上课时间不能为空')
        return false
      }
      if (!this.timePicker) {
        this.common.message('warning', '上课时间不能为空')
        return false
      }
      this.courseMsg.price = 0
      this.loading = true
      let _coach_name = this.$refs.coach_idDom.$children[0].$refs.input.value
      this.courseMsg.coach_name = _coach_name
      this.courseMsg.time_start = this.timeformat(this.timePicker[0])
      this.courseMsg.time_end = this.timeformat(this.timePicker[1])
      editPublicCourse(this.courseMsg).then((res) => {
        console.log('******', res)
        this.common.message('success', '编辑信息成功')
        this.loading = false
        this.$emit('editCourseBtn', res.data.week)
      }).catch(() => {
        this.loading = false
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
              'status': response.data[i].status
            })
          }
        }
      })
    },
    cansleCabinet() {
      this.$emit('cansleCabinet')
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
</style>