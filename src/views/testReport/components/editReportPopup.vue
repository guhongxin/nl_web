<template>
   <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      :width="widthSize"
      class="editReportPopup customizeDetailsDialog"
      :beforeClose='dialogClosed'
    >
      <div class="dialog-body">
        <el-form :model="reportData" :rules="reportRules" ref="reportForm" label-width="100px" class="demo-reportForm">
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="体侧时间：" prop="examTime">
                <!-- <el-date-picker
                  v-model="reportData.examTime"
                  type="date"
                  placeholder="选择体测日期">
                </el-date-picker> -->
                <el-date-picker
                  :picker-options="lostTime"
                  v-model="reportData.examTime"
                  type="datetime"
                  placeholder="选择体测日期"
                  >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="年龄：" prop="age">
                <el-input v-model="reportData.age" placeholder="选择输入客户年龄" oninput="if(/-/g.test(value)){value = value.replace(/-/g, '')}}"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="身高：" prop="height">
                <el-input v-model="reportData.height" placeholder="选择输入身高（cm）" oninput="if(/-/g.test(value)){value = value.replace(/-/g, '')} else if(value.length > 6) {value = value.slice(0, 6)}">
                  <template slot="append">cm</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="体重：" prop="weight">
                <el-input v-model="reportData.weight" placeholder="选择输入体重（kg）"  oninput="if(/-/g.test(value)){value = value.replace(/-/g, '')} else if(value.length > 6) {value = value.slice(0, 6)}">
                  <template slot="append">kg</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="蛋白质：" prop="protein">
                <el-input v-model="reportData.protein" placeholder="选择输入蛋白质数值"  oninput="if(/-/g.test(value)){value = value.replace(/-/g, '')} else if(value.length > 6) {value = value.slice(0, 6)} else if(value > 100) {value = 100}">
                  <template slot="append">%</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="基础代谢：" prop="fat">
                <el-input v-model="reportData.calories_base" placeholder="请输入基础代谢"  oninput="if(/-/g.test(value)){value = value.replace(/-/g, '')} else if(value.length > 6) {value = value.slice(0, 6)} else if(value > 10000) {value = 10000}">
                  <template slot="append">kcal</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="水分：" prop="body_water">
                <el-input v-model="reportData.body_water" placeholder="选择输入人体水分"  oninput="if(/-/g.test(value)){value = value.replace(/-/g, '')} else if(value.length > 6) {value = value.slice(0, 6)} else if(value > 100) {value = 100}">
                  <template slot="append">%</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="体脂率：" prop="fat">
                <el-input v-model="reportData.fat" placeholder="选择输入体脂率"  oninput="if(/-/g.test(value)){value = value.replace(/-/g, '')} else if(value.length > 6) {value = value.slice(0, 6)} else if(value > 100) {value = 100}">
                  <template slot="append">%</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="舒张压：" prop="min_blood_pressure" placeholder="选择输入舒张压" oninput="if(value.length > 5)value = value.slice(0, 5)">
                <el-input v-model="reportData.min_blood_pressure">
                  <template slot="append">kPa</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="收缩压：" prop="max_blood_pressure">
                <el-input v-model="reportData.max_blood_pressure" placeholder="选择输入收缩压" oninput="if(value.length > 5)value = value.slice(0, 5)">
                  <template slot="append">kPa</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row> -->
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="内脏脂肪：" prop="infat">
                <el-input v-model="reportData.infat" placeholder="选择输入内脏脂肪数值"  oninput="if(/-/g.test(value)){value = value.replace(/-/g, '')} else if(value.length > 6) {value = value.slice(0, 6)} else if(value > 100) {value = 100}">
                  <template slot="append">%</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="骨量：" prop="bone">
                <el-input v-model="reportData.bone" placeholder="选择输入骨骼占比"  oninput="if(/-/g.test(value)){value = value.replace(/-/g, '')} else if(value.length > 6) {value = value.slice(0, 6)} else if(value > 100) {value = 100}">
                  <template slot="append">%</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="皮下脂肪：" prop="sub_fat">
                <el-input v-model="reportData.sub_fat" placeholder="选择输入皮下脂肪数值"  oninput="if(/-/g.test(value)){value = value.replace(/-/g, '')} else if(value.length > 6) {value = value.slice(0, 6)} else if(value > 100) {value = 100}">
                  <template slot="append">%</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="骨骼肌：" prop="muscle">
                <el-input v-model="reportData.muscle" placeholder="选择输入骨骼肌率（%）"  oninput="if(/-/g.test(value)){value = value.replace(/-/g, '')} else if(value.length > 6) {value = value.slice(0, 6)} else if(value > 100) {value = 100}">
                  <template slot="append">%</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="静态心率：" prop="resting_heart_rate">
                <el-input v-model="reportData.resting_heart_rate" placeholder="选择输入静态心率"  oninput="if(/-/g.test(value)){value = value.replace(/-/g, '')} else if(value.length > 6) {value = value.slice(0, 6)}">
                  <!-- <template slot="append">%</template> -->
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="腰臀比：" prop="waist_hip">
                <el-input v-model="reportData.waist_hip" placeholder="选择输入腰臀比"  oninput="if(/-/g.test(value)){value = value.replace(/-/g, '')} else if(value.length > 6) {value = value.slice(0, 6)} else if(value > 300) {value = 300}">
                  <template slot="append">%</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="体质等级：" prop="body_level">
                <el-input v-model="reportData.body_level"  placeholder="请输入体质等级" oninput="if(/-/g.test(value)){value = value.replace(/-/g, '')} else if(value.length > 6) {value = value.slice(0, 6)}"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
            </el-col>
          </el-row> -->
        </el-form>
        <div class="bottom-box">
          <el-button @click="cancelBtn">取消</el-button>
          <el-button type="primary" style="background-color: rgb(51, 51, 51);color:#fff;border: 1px solid #333;" @click="editReportOk" :loading="editReportOkLoading">确认</el-button>
        </div>
      </div>
    </el-dialog>
</template>
<script>
// import { timeFormat } from '@/utils/comm'
const validatePrice = (rule, value, callback) => {
  if (!value.toString().length) {
    callback(new Error('不能为空'))
  } else {
    if (/^-/.test(value)) {
      callback(new Error('请输入正数'))
    } else {
      callback()
    }
  }
}
const validateAge = (rule, value, callback) => {
  if (!value.toString().length) {
    callback(new Error('不能为空'))
  } else if (Number(value) < 6 || Number(value) > 200) {
    callback(new Error('年龄范围6-200岁'))
  } else if (!/^\d+$/.test(value)) {
    callback(new Error('年龄不能为小数'))
  } else {
    callback()
  }
}
import { parseTime } from '@/utils/index'
import { updatePhysicalTest, bodyExamFind } from '@/api/testReport'
export default {
  name: 'editReportPopup',
  props: {
    title: {
      type: String
    },
    dialogVisible: {
      type: Boolean,
      default() {
        return false
      }
    },
    widthSize: {
      type: String,
      default() {
        return '50%'
      }
    },
    examId: {
      type: Number
    }
  },
  data() {
    return {
      lostTime: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      reportRules: {
        examTime: { required: true, message: '请选择体检日期', trigger: 'blur' },
        age: { required: true, trigger: 'blur', validator: validateAge },
        height: { required: true, trigger: 'blur', validator: validatePrice },
        weight: { required: true, trigger: 'blur', validator: validatePrice }
      },
      reportData: {},
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      editReportOkLoading: false
    }
  },
  created() {
    bodyExamFind(this.examId).then(res => {
      this.reportData = res.data
    })
  },
  methods: {
    dialogClosed() {
      this.$refs.reportForm.resetFields()
      this.$emit('dialogClosed')
    },
    cancelBtn() {
      this.dialogClosed()
    },
    editReportOk() {
      if (!this.reportData.examTime) {
        this.common.message('warning', '体测时间不能为空')
        return false
      }
      if (!this.reportData.age) {
        this.common.message('warning', '年龄不能为空')
        return false
      } else if (Number(this.reportData.age) < 6 || Number(this.reportData.age) > 200) {
        this.common.message('warning', '年龄范围6-200岁')
        return false
      } else if (!/^\d+$/.test(this.reportData.age)) {
        this.common.message('warning', '年龄不能为小数')
        return false
      }
      if (!this.reportData.height) {
        this.common.message('warning', '身高不能为空')
        return false
      }
      if (!this.reportData.weight) {
        this.common.message('warning', '体重不能为空')
        return false
      }
      let obj = {
        id: this.reportData.id,
        name: this.reportData.name,
        phone: this.reportData.phone,
        // examTime: timeFormat(this.reportData.examTime),
        examTime: parseTime(new Date(this.reportData.examTime), '{y}-{m}-{d} {h}:{i}:{s}'),
        age: Number(this.reportData.age),
        height: Number(this.reportData.height),
        weight: Number(this.reportData.weight),
        protein: this.reportData.protein,
        fat: Number(this.reportData.fat),
        max_blood_pressure: this.reportData.max_blood_pressure,
        body_water: this.reportData.body_water,
        min_blood_pressure: this.reportData.min_blood_pressure,
        // fat_weight: this.reportData.fat_weight,
        infat: this.reportData.infat,
        bone: this.reportData.bone,
        sub_fat: Number(this.reportData.sub_fat),
        muscle: this.reportData.muscle,
        resting_heart_rate: this.reportData.resting_heart_rate,
        waist_hip: this.reportData.waist_hip,
        body_level: this.reportData.body_level,
        calories_base: this.reportData.calories_base
      }
      this.editReportOkLoading = true
      updatePhysicalTest(obj).then(res => {
        if (res) {
          this.common.message('success', '编辑信息成功')
          this.$emit('editReporPoupOK')
          this.dialogClosed()
        }
        this.editReportOkLoading = false
      }).catch(err => {
        console.log(err)
        this.editReportOkLoading = false
        this.common.message('error', '体测录入失败')
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.customizeDetailsDialog {
  .el-dialog {
    border-radius: 5px;
  }
  .el-dialog__header {
    border: 1px solid #cccccc;
    border-radius: 5px 5px 0px 0px;
  }
  .el-dialog__body {
    padding: 10px 10px;
    border-radius: 0px 0px 5px 5px;
  }
}
.editReportPopup{
  .el-dialog__body {
    border-top: 1px solid #cccccc;
  }
  .dialog-body{
    width: 95%;
    margin: 0px auto;
    margin-top: 15px;
  }
  .bottom-box{
    text-align: center;
    padding-top: 15px;
    padding-bottom: 15px;
  }
}
</style>


