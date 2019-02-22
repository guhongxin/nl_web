<template>
  <el-dialog
    title="添加教练"
    :visible.sync="dialogVisible"
    :width="widthSize"
    class="addCoachForm"
    :beforeClose='dialogClosed'>
      <el-form :model="addCoachForm" ref="addCoachForm" label-width="108px" class="coachForm" :rules="addCoachRuls">
        <el-form-item label="课程名称:">
        <el-input v-model="addCoachForm.course_name" placeholder="请输入课程价格" style="width:300px" disabled></el-input>
        </el-form-item>
        <el-form-item label="课程单价:" prop="price">
        <el-input type="number" v-model="addCoachForm.price" placeholder="请输入课程价格" style="width:300px"></el-input>
        </el-form-item>
        <el-form-item label="带课教练:" prop="coach_id">
        <el-select v-model="addCoachForm.coach_id" style="width:300px" placeholder="请选择教练" filterable @change="changeEmployee">
            <el-option :label="item.label" :value="item.value" :key="index" v-for="(item,index) in privateCoatch"></el-option>
        </el-select>
        </el-form-item>
      </el-form>
      
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" class="black" @click="dialogSure" :loading="loading">确 定</el-button>
      </span>
      
  </el-dialog>
</template>

<script>
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
  name: 'addCoachDialog',
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
        return '800px'
      }
    },
    privateCoatch: {
      type: Array,
      default: function() {
        return []
      }
    },
    addCoachForm: {
      type: Object,
      default: function() {
        return {}
      }
    },
    loading: false
  },
  data() {
    return {
      addCoachRuls: {
        price: [{ required: true, trigger: 'blur', validator: realpayVerification }],
        coach_id: [{ required: true, message: '请选择带课教练', trigger: 'change' }]
      }
    }
  },
  mounted() {},
  methods: {
    dialogClosed() {
      this.$emit('dialogClosed')
    },
    dialogSure() {
      this.$refs.addCoachForm.validate((valid) => {
        if (valid) {
          this.$emit('dialogSure')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    changeEmployee(value) {
      console.log(value)
      if (value === -1) {
        setTimeout(() => {
          this.$router.push('/components/staffmanage')
        }, 100)
      }
    }
  },
  computed: {}
}
</script>
<style lang="scss" scoped>
.dialog-footer /deep/ .black {
  background: #000;
  border: 1px solid #000;
}
</style>