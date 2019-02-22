<template>
  <el-dialog
    title="修改教练信息"
    :visible.sync="dialogVisible"
    :width="widthSize"
    class="addCoachForm"
    :beforeClose='dialogClosed'>

      <el-form :model="editCoachForm" label-width="108px" class="coachForm" :rules="addCoachRuls" ref="editCoachDoc">
        <el-form-item label="私教课程:">
          <el-input v-model="formLabelAlign.name" style="width:300px" disabled></el-input>
        </el-form-item>
        <el-form-item label="课程教练:" prop="coach_id">
          <el-select v-model="editCoachForm.coach_id" placeholder="请选择课程教练" style="width:300px">
            <el-option :label="item.label" :value="item.value" :key="index" v-for="(item,index) in privateCoatch"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="课程价格:" prop="price">
          <el-input type="number" v-model="editCoachForm.price" placeholder="请输入课程价格" style="width:300px"></el-input>
        </el-form-item>
      </el-form>
       
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogSure" :loading="loading" class="black">确 定</el-button>
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
    courseIdByCoach: {
      type: Number,
      default: function() {
        return ''
      }
    },
    editCoachForm: {
      type: Object,
      default: function() {
        return {}
      }
    },
    privateCoatch: {
      type: Array,
      default: function() {
        return []
      }
    },
    formLabelAlign: {
      type: Object,
      default: function() {
        return {}
      }
    },
    loading: false
  },
  data() {
    return {
      coachId: '',
      addCoachRuls: {
        price: [{ required: true, trigger: 'blur', validator: realpayVerification }],
        coach_id: [{ required: true, message: '课程教练不能为空', trigger: 'change' }]
      }
    }
  },
  mounted() {
    this.getcoachId()
  },
  computed: {
    // coachId: function() {
    //   return this.coachName
    // }
  },
  methods: {
    dialogClosed() {
      this.$emit('dialogClosed')
    },
    dialogSure() {
      this.$refs.editCoachDoc.validate((valid) => {
        if (valid) {
          this.$emit('dialogSure', this.editCoachForm.coach_id)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getcoachId() {
      this.coachId = this.courseIdByCoach
    }
  }
}
</script>
<style lang="scss" scoped>
.dialog-footer /deep/ .black {
  background: #000;
  border: 1px solid #000;
}
</style>