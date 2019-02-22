<template>
    <el-dialog
      title="添加公开课"
      :visible.sync="dialogVisible"
      width="900px"
      class="course-dialog" @close="addclose">
      <div class="form-box">
        <el-form :model="courseForm" :rules="rules1" ref="courseForm">
          <el-form-item label="课程名称：" prop="name">
            <el-input v-model="courseForm.name" placeholder="请输入课程名称" :maxlength="16"></el-input>
          </el-form-item>
          <el-form-item label="教练姓名：" prop="coach_id" style="margin-left:40px">
            <el-select v-model="courseForm.coach_id" filterable placeholder="请选择教练" @change="changeValue">
              <el-option :label="item.label" :value="item.value" :key="index" :disabled="item.status === 3" v-for="(item,index) in coach"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="上课地点：" prop="address">
             <el-input v-model="courseForm.address" placeholder="请输入上课地点" :maxlength="20"></el-input>
          </el-form-item>
          <el-form-item label="上课人数：" prop="min_person" class="min_person" style="margin-left:40px">
             <el-input v-model="courseForm.min_person" placeholder="最少人数" type="number" min="1" max="1000"></el-input>
          </el-form-item>
          <el-form-item prop="max_person" class="min_person">
             <el-input v-model="courseForm.max_person" placeholder="最多人数" type="number" min="1" max="1000"></el-input>
          </el-form-item>
          <el-form-item label="上课时间：" prop="week" class="selectTime">
            <el-select v-model="courseForm.week" placeholder="请选择时间" class="select">
              <el-option label="星期一" value="1"></el-option>
              <el-option label="星期二" value="2"></el-option>
              <el-option label="星期三" value="3"></el-option>
              <el-option label="星期四" value="4"></el-option>
              <el-option label="星期五" value="5"></el-option>
              <el-option label="星期六" value="6"></el-option>
              <el-option label="星期日" value="7"></el-option>
            </el-select>
            <el-time-picker style="width:432px"
              is-range
              v-model="time"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              placeholder="选择时间"
              format="HH:mm" >
            </el-time-picker>
          </el-form-item>
        </el-form>
      </div>
      <div class="cabnit-dialog-footer" style="text-align:center;">
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" :loading="loading" @click="addCourseSure" class="black">确定</el-button>
        </span>
      </div>
    </el-dialog>
</template>

<script>
import { addPublicCourse, privateCoachList } from '@/api/course'
export default {
  name: 'renewCabinetDialog',
  props: {
  },
  computed: {
  },
  data() {
    return {
      dialogVisible: false,
      courseForm: { // 添加
        type: 0,
        price: 0,
        fit_type: '',
        name: '',
        max_person: '',
        min_person: '',
        address: '',
        week: '',
        time_start: '',
        time_end: '',
        coach_id: ''
      },
      coach: [],
      time: null, // 时间控件
      loading: false,
      // 表单验证规则
      rules1: {
        type: [{ required: true, message: '请选择课程类型' }],
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
  },
  methods: {
    dialogShow() {
      this.dialogVisible = true
    },
    changeValue(value) {
      let obj = {}
      obj = this.coach.find((item) => {
        return item.value === value
      })
      this.courseForm.coach_name = obj.label
    },
    addclose() {
      this.time = null
      this.courseForm.max_person = 0
      this.$refs.courseForm.resetFields()
    },
    timeformat(param) {
      let result = ''
      let date = new Date(param)
      let hh = date.getHours() > 9 ? date.getHours() : '0' + date.getHours()
      let mm = date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes()
      result = hh + ':' + mm + ':00'
      return result
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
    addCourseSure() {
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
      if (!this.courseForm.address) {
        this.common.message('warning', '上课地点不能为空')
        return false
      }
      if (!this.courseForm.min_person) {
        this.common.message('warning', '最少人数不能为空')
        return false
      } else if (this.courseForm.min_person < 1) {
        this.common.message('warning', '上课人数不能少于1人')
        return false
      } else if (this.courseForm.min_person > 1000) {
        this.common.message('warning', '上课人数最多不得超过1000')
        return false
      } else if (!/^\d+$/.test(this.courseForm.min_person)) {
        this.common.message('warning', '最少人数不能为小数')
        return false
      }
      if (!this.courseForm.max_person) {
        this.common.message('warning', '最多人数不能为空')
        return false
      } else if (this.courseForm.max_person < 1) {
        this.common.message('warning', '上课人数不能少于1人')
        return false
      } else if (this.courseForm.max_person > 1000) {
        this.common.message('warning', '上课人数最多不得超过1000')
        return false
      } else if (!/^\d+$/.test(this.courseForm.max_person)) {
        this.common.message('warning', '最多人数不能为小数')
        return false
      }
      if (this.courseForm.min_person - this.courseForm.max_person > 0) {
        this.common.message('warning', '上课最少人数不能大于上课最多人数')
        return false
      }
      if (!this.courseForm.week) {
        this.common.message('warning', '上课时间不能为空')
        return false
      }
      if (!this.time) {
        this.common.message('warning', '上课时间不能为空')
        return false
      } else {
        this.courseForm.time_start = this.timeformat(this.time[0])
        this.courseForm.time_end = this.timeformat(this.time[1])
      }
      this.loading = true
      addPublicCourse(this.courseForm).then((res) => {
        this.loading = false
        this.common.message('success', '添加成功')
        this.$emit('addCourseBtn')
        this.dialogVisible = false
      }).catch(() => {
        this.loading = false
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