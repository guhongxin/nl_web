<template>
    <el-dialog
      title="编辑团课"
      :visible.sync="dialogVisible"
      :width="widthSize"
      class="course-dialog" :beforeClose='dialogClosed'>
       <div class="form-box">
        <el-form :model="courseMsg" :rules="rules2" ref="courseMsg">
          <el-form-item label="课程类型：" prop="effect">
            <el-select v-model="courseMsg.effect" placeholder="请选择课程类型">
              <el-option :label="item.label" :value="item.value" :key="index" v-for="(item,index) in course_type"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="课程名称：" prop="name" style="margin-left:40px">
            <el-input v-model="courseMsg.name" placeholder="请输入课程名称" :maxlength="16"></el-input>
          </el-form-item>
          <el-form-item label="教练姓名：" prop="coach_id">
            <el-select v-model="courseMsg.coach_id" filterable placeholder="请选择教练">
              <el-option :label="item.label" :value="item.value" :key="index" :disabled="item.status === 3" v-for="(item,index) in coach"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="课程价格：" prop="price" style="margin-left:40px">
             <el-input v-model="courseMsg.price" placeholder="请输入课程价格" type="number"></el-input>
          </el-form-item>
          <el-form-item label="上课地点：" prop="address">
             <el-input v-model="courseMsg.address" placeholder="请输入上课地点" :maxlength="20"></el-input>
          </el-form-item>
          <el-form-item label="上课人数：" prop="min_person" style="margin-left:40px" class="min_person">
             <el-input v-model="courseMsg.min_person" placeholder="最少人数" type="number" max="1000" min="1"></el-input>
          </el-form-item>
          <el-form-item label="" prop="max_person" class="min_person">
             <el-input v-model="courseMsg.max_person" placeholder="最多人数" type="number" max="1000" min="courseMsg.min_person"></el-input>
          </el-form-item>
          <el-form-item label="席位预约：" style="margin-left:10px">
            <el-switch v-model="courseMsg.needHalls" @change="changeSwitch" style="width: 300px;"></el-switch>
          </el-form-item>
          <el-form-item label="场地选择：" style="margin-left:50px">
            <el-select v-model="courseMsg.hall_id" placeholder="请选择场地" :disabled="!courseMsg.needHalls">
              <el-option :label="item.name" :value="item.id" :key="index" v-for="(item,index) in hallsList"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div class="dialog-footer">
        <span slot="footer">
          <el-button type="primary" :loading="loading" @click="editCourseSure" class="black" style="padding:10px 34px;">确定</el-button>
        </span>
      </div>
    </el-dialog>
</template>

<script>
import { privateCoachList, editNewGroupCourse } from '@/api/course'
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
  name: 'renewCabinetDialog',
  props: {
    dialogVisible: {
      type: Boolean,
      default: function() {
        return false
      }
    },
    widthSize: {
      type: String,
      default() {
        return '200px'
      }
    },
    courseForm: {
      type: Object,
      default() {
        return {}
      }
    },
    hallsList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  computed: {
  },
  data() {
    return {
      id: '',
      courseMsg: {
        price: '',
        effect: '',
        name: '',
        max_person: '',
        min_person: '',
        address: '',
        coach_id: '',
        needHalls: false,
        hall_id: null
      },
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
        effect: [{ required: true, message: '请选择课程', trigger: 'change' }],
        name: [
          { required: true, message: '请选择课程名称', trigger: 'change' },
          { min: 1, max: 16, message: '长度在 1 到 16 个字符', trigger: 'blur' }
        ],
        coach_id: [{ required: true, message: '请选择教练', trigger: 'change' }],
        address: [{ required: true, message: '请输入上课地点', trigger: 'change' }],
        price: [{ required: true, trigger: 'blur', validator: realpayVerification }],
        min_person: [{ required: true, message: '请输入上课人数', trigger: 'blur' }],
        max_person: [{ required: true, message: '请输入上课人数', trigger: 'blur' }],
        real_pay: [{ required: true, trigger: 'blur', validator: realpayVerification }]
      }
    }
  },
  mounted() {
    this.getCoaches()
    this.id = this.courseForm.id
    this.courseMsg.effect = this.courseForm.effect
    this.courseMsg.name = this.courseForm.name
    this.courseMsg.coach_id = this.courseForm.coach_id
    this.courseMsg.price = this.courseForm.price
    this.courseMsg.address = this.courseForm.address
    this.courseMsg.min_person = this.courseForm.min_person
    this.courseMsg.max_person = this.courseForm.max_person
    if (this.courseForm.hall_id) {
      this.courseMsg.needHalls = true
      this.courseMsg.hall_id = this.courseForm.hall_id
    } else {
      this.courseMsg.needHalls = false
      this.courseMsg.hall_id = null
    }
  },
  methods: {
    dialogClosed() {
      this.$emit('dialogClosed')
    },
    editCourseSure() {
      if (!this.courseMsg.effect) {
        this.common.message('warning', '课程类型不能为空')
        return false
      }
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
      if (!this.courseMsg.price) {
        this.common.message('warning', '课程价格不能为空')
        return false
      } else if (!/^\d+$/.test(this.courseMsg.price) && this.courseMsg.price.toString().split('.')[1].length > 2) {
        this.common.message('warning', '课程价格最多保留2位小数')
        return false
      }
      if (!this.courseMsg.address) {
        this.common.message('warning', '上课地点不能为空')
        return false
      }
      if (!this.courseMsg.min_person) {
        this.common.message('warning', '最少人数不能为空')
        return false
      } else if (this.courseMsg.min_person > 1000) {
        this.common.message('warning', '上课人数最多不得超过1000')
        return false
      } else if (parseInt(this.courseMsg.min_person) < 1) {
        this.common.message('warning', '上课人数不能少于1人')
        return false
      } else if (!/^\d+$/.test(this.courseMsg.min_person)) {
        this.common.message('warning', '最少人数不能为小数')
        return false
      }
      if (!this.courseMsg.max_person) {
        this.common.message('warning', '最多人数不能为空')
        return false
      } else if (this.courseMsg.max_person > 1000) {
        this.common.message('warning', '上课人数最多不得超过1000')
        return false
      } else if (parseInt(this.courseMsg.max_person) < 1) {
        this.common.message('warning', '上课人数不能少于1人')
        return false
      } else if (!/^\d+$/.test(this.courseMsg.max_person)) {
        this.common.message('warning', '最多人数不能为小数')
        return false
      }
      if (this.courseMsg.min_person - this.courseMsg.max_person > 0) {
        this.common.message('warning', '上课最少人数不能大于上课最多人数')
        return false
      }
      if (this.courseMsg.needHalls && !this.courseMsg.hall_id) {
        this.common.message('warning', '请选择场地')
        return false
      }
      this.$refs.courseMsg.validate((valid) => {
        if (valid) {
          this.loading = true
          /* if (!this.courseMsg.hall_id) {
            courseMsg.hall_id = null
          } */
          editNewGroupCourse(this.id, this.courseMsg).then((res) => {
            this.loading = false
            this.common.message('success', '修改成功')
            this.$emit('editCourseBtn')
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
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
              'status': response.data[i].status
            })
          }
        }
      })
    },
    cansleCabinet() {
      this.$emit('cansleCabinet')
    },
    changeSwitch(val) {
      if (!val) {
        this.courseMsg.hall_id = null
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
  text-align: center;
  margin-top: 30px;
  .el-button--primary {
    background: #000;
    border: 1px solid #000;
  }
}
</style>
