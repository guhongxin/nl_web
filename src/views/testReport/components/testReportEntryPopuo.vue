<template>
   <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      :width="widthSize"
      :close-on-click-modal="false"
      class="testReportEntryPopup customizeDetailsDialog"
      :beforeClose='dialogClosed'
    >
      <div class="dialog-body">
        <div v-if="IsCustomerInfor">
          <el-steps :active="step" finish-status="success" simple>
            <el-step title="查找客户" ></el-step>
            <el-step :title="disabled?'确认客户信息':'修改客户信息'" ></el-step>
            <el-step title="添加体测" ></el-step>
          </el-steps>
          <!-- 步骤1 -->
          <div v-if="step===1" class="step1-content" >
              <el-input placeholder="请输入手机号码" v-model="phone" @keyup.enter.native="netStepBtn1(phone)" >
                <template slot="prepend">
                  <i class="qr"></i>
                </template>
                <el-button slot="append" icon="el-icon-search" @click="netStepBtn1(phone)"></el-button>
              </el-input>
              <p class="err-prompt" v-if='phoneFormatErr'>请输入正确的电话号码</p>
              <div class="step1-content-bottom"> 
                  <!-- <el-button type="primary" style="background: #333333;width:160px" @click="netStepBtn1" :disabled="NofindAction">下一步</el-button> -->
              </div>
          </div>
          <!-- 步骤2 -->
          <div v-else-if="step===2" class="step2-content">
            <el-form label-width="120px" :model="stepFromData2">
              <el-form-item label="手机号码：" class="phone">
                <el-input v-model="stepFromData2.phone" disabled></el-input>
                <span class="status-prompt">({{stepFromData2.is_register_app?'已注册':'未注册'}} {{isLr?'已录入':'未录入'}})</span>
              </el-form-item>
              <p class="prompt" v-if='disabled'>提示：如果客户信息有误，<span @click="setStepBtn2">点击此处进行修改</span></p>
              <p class="prompt" v-else>提示：手动输入信息购买成功后，会再系统中自动录入该客户信息</p>
              <el-form-item label="客户姓名：">
                <el-input v-model="stepFromData2.name" :disabled="disabled" :maxlength="20"></el-input>
              </el-form-item>
              <el-form-item label="客户性别：">
                <el-select v-model="stepFromData2.sex" placeholder="请选择" :disabled="disabled">
                  <el-option label="男" value="1"></el-option>
                  <el-option label="女" value="2"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="所属会籍：">
                <el-select v-model="stepFromData2.employees" placeholder="请选择" :disabled="disabled">
                  <el-option
                    v-for="(item,key) in employeesList"
                    :key="key"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
            <div class="step2-content-bottom" v-if="disabled"> 
                <el-button @click="backUp" >上一步</el-button>
                <el-button type="primary" style="background: #333333;border:1px solid #333;" @click="netStepBtn2">下一步</el-button>
            </div>
            <div class="step2-content-bottom" v-else> 
                <el-button  @click="cancelSetBtn2">取消</el-button>
                <el-button type="primary" style="background: #333333;;border:1px solid #333;" @click="saveSetBtn2">保存</el-button>
            </div>
          </div>
          <!-- 步骤3 -->
          <div v-else-if="step===3" class="step3-content">
            <el-form :model="stepFromData3" :rules="stepFromRules3" ref="reportForm" label-width="100px" class="demo-reportForm">
              <el-row :gutter="10">
                <el-col :span="12">
                  <el-form-item label="体测时间：" prop="examTime">
                    <!-- <el-date-picker
                      v-model="stepFromData3.examTime"
                      type="date"
                      placeholder="选择体测日期">
                    </el-date-picker> -->
                    <el-date-picker
                      v-model="stepFromData3.examTime"
                      type="datetime"
                      :picker-options="lostTime"
                      :default-time="nowTime"
                      placeholder="选择体测日期"
                      >
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="年龄：" prop="age">
                    <el-input v-model="stepFromData3.age" type="number" placeholder="请输入客户年龄" oninput="if(/-/g.test(value)){value = value.replace(/-/g, '')}"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="10">
                <el-col :span="12">
                  <el-form-item label="身高：" prop="height" label-suffix="cm">
                    <el-input v-model="stepFromData3.height" placeholder="请输入身高（cm）" oninput="if(value.length > 6) {value = value.slice(0, 6)}">
                      <template slot="append">cm</template>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="体重：" prop="weight">
                    <el-input v-model="stepFromData3.weight" placeholder="请输入体重（kg）" oninput="if(value.length > 6) {value = value.slice(0, 6)}">
                      <template slot="append">kg</template>
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="10">
                <el-col :span="12">
                  <el-form-item label="蛋白质：" prop="protein">
                    <el-input v-model="stepFromData3.protein" placeholder="请输入蛋白质数值" oninput="if(/-/g.test(value)){value = value.replace(/-/g, '')} else if(value.length > 6) {value = value.slice(0, 6)} else if(value > 100) {value = 100}" >
                      <template slot="append">%</template>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="基础代谢：" prop="fat">
                    <el-input v-model="stepFromData3.calories_base" placeholder="请输入基础代谢" oninput="if(/-/g.test(value)){value = value.replace(/-/g, '')} else if(value.length > 6) {value = value.slice(0, 6)} else if(value > 10000) {value = 10000}">
                      <template slot="append">kcal</template>
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="10">
                <el-col :span="12">
                  
                  <el-form-item label="水分：" prop="body_water">
                    <el-input v-model="stepFromData3.body_water" placeholder="请输入人体水分" oninput="if(/-/g.test(value)){value = value.replace(/-/g, '')} else if(value.length > 6) {value = value.slice(0, 6)} else if(value > 100) {value = 100}">
                      <template slot="append">%</template>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="体脂率：" prop="fat">
                    <el-input v-model="stepFromData3.fat" placeholder="请输入体脂率" oninput="if(/-/g.test(value)){value = value.replace(/-/g, '')} else if(value.length > 6) {value = value.slice(0, 6)} else if(value > 100) {value = 100}">
                      <template slot="append">%</template>
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <!-- <el-row :gutter="10">
                <el-col :span="12">
                  <el-form-item label="舒张压：" prop="min_blood_pressure">
                    <el-input v-model="stepFromData3.min_blood_pressure" placeholder="请输入舒张压" oninput="if(value.length > 5)value = value.slice(0, 5)">
                      <template slot="append">kPa</template>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="收缩压：" prop="max_blood_pressure">
                    <el-input v-model="stepFromData3.max_blood_pressure" placeholder="请输入收缩压" oninput="if(value.length > 5)value = value.slice(0, 5)">
                      <template slot="append">kPa</template>
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row> -->
              <el-row :gutter="10">
                <el-col :span="12">
                  <el-form-item label="内脏脂肪：" prop="infat">
                    <el-input v-model="stepFromData3.infat" placeholder="请输入内脏脂肪数值" oninput="if(/-/g.test(value)){value = value.replace(/-/g, '')} else if(value.length > 6) {value = value.slice(0, 6)} else if(value > 100) {value = 100}">
                      <template slot="append">%</template>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="骨量：" prop="bone">
                    <el-input v-model="stepFromData3.bone" placeholder="请输入骨骼占比" oninput="if(/-/g.test(value)){value = value.replace(/-/g, '')} else if(value.length > 6) {value = value.slice(0, 6)} else if(value > 100) {value = 100}">
                      <template slot="append">%</template>
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="10">
                <el-col :span="12">
                  <el-form-item label="皮下脂肪：" prop="sub_fat">
                    <el-input v-model="stepFromData3.sub_fat" placeholder="请输入皮下脂肪数值" oninput="if(/-/g.test(value)){value = value.replace(/-/g, '')} else if(value.length > 6) {value = value.slice(0, 6)} else if(value > 100) {value = 100}">
                      <template slot="append">%</template>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="骨骼肌：" prop="muscle">
                    <el-input v-model="stepFromData3.muscle" placeholder="请输入骨骼肌率（%）" oninput="if(/-/g.test(value)){value = value.replace(/-/g, '')} else if(value.length > 6) {value = value.slice(0, 6)} else if(value > 100) {value = 100}">
                      <template slot="append">%</template>
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="10">
                <el-col :span="12">
                  <el-form-item label="静态心率：" prop="resting_heart_rate">
                    <el-input v-model="stepFromData3.resting_heart_rate" placeholder="请输入静态心率" oninput="if(/-/g.test(value)){value = value.replace(/-/g, '')} else if(value.length > 6) {value = value.slice(0, 6)}">
                      <!-- <template slot="append">%</template> -->
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="腰臀比：" prop="waist_hip">
                    <el-input v-model="stepFromData3.waist_hip" placeholder="请输入腰臀比" oninput="if(/-/g.test(value)){value = value.replace(/-/g, '')} else if(value.length > 6) {value = value.slice(0, 6)} else if(value > 100) {value = 100}">
                      <template slot="append">%</template>
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <!-- <el-row :gutter="10">
                <el-col :span="12">
                  <el-form-item label="体质等级：" prop="body_level">
                    <el-input v-model="stepFromData3.body_level" placeholder="请输入体质等级" oninput="if(/-/g.test(value)){value = value.replace(/-/g, '')} else if(value.length > 6) {value = value.slice(0, 6)}"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                </el-col>
              </el-row> -->
            </el-form>
            <div class="step3-content-bottom">
              <el-button @click="backUp">上一步</el-button>
              <el-button type="primary" style="background-color: rgb(51, 51, 51);color:#ffffff;;border:1px solid #333;" @click="btnOk" :loading="btnOkLoading">确认</el-button>
            </div>
          </div>
        </div>
        <div v-else>
          <el-steps :active="step2" finish-status="success" simple class="registClient">
            <el-step title="查找客户" ></el-step>
            <el-step title="注册新用户" ></el-step>
            <el-step title="确认客户信息" ></el-step>
          </el-steps>
           <!-- 步骤1 -->
          <div v-if="step2===1" class="step1-content" >
              <el-input placeholder="请输入手机号码" v-model="phone" @change="QRcodeEnter(phone)" >
                <template slot="prepend">
                  <i class="qr"></i>
                </template>
                <el-button slot="append" icon="el-icon-search"></el-button>
              </el-input>
              <p class="err-prompt" v-if='phoneFormatErr'>请输入正确的电话号码</p>
              <div class="step1-content-bottom"> 
                  <el-button type="primary" style="background: #333;border:1px solid #333;width:160px" @click="netStep2Btn" :disabled="NofindAction">下一步</el-button>
              </div>
          </div>
            <!-- 步骤2 -->
          <div v-else-if="step2===2" class="step2-content">
            <el-form label-width="120px" :model="stepFromData2" :rules="stepFromRules2">
              <el-form-item label="手机号码：" class="phone">
                <el-input v-model="stepFromData2.phone" disabled></el-input>
                <span class="status-prompt">({{stepFromData2.is_register_app?'已注册':'未注册'}} {{isLr?'已录入':'未录入'}})</span>
              </el-form-item>
              <el-form-item label="客户姓名：" prop="name">
                <el-input v-model="stepFromData2.name" :maxlength="20"></el-input>
              </el-form-item>
              <el-form-item label="客户性别：" prop="sex">
                <el-select v-model="stepFromData2.sex" placeholder="请选择" >
                  <el-option label="男" value="1"></el-option>
                  <el-option label="女" value="2"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="所属会籍：" prop="employees">
                <el-select v-model="stepFromData2.employees" placeholder="请选择" >
                  <el-option
                    v-for="(item, key) in employeesList"
                    :key="key"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
            <div class="step2-content-bottom"> 
                <el-button @click="backUp2" >上一步</el-button>
                <el-button type="primary" style="background: #333333;;border:1px solid #333;" @click="netStep2Btn2">下一步</el-button>
            </div>
          </div>
        </div>
       
      </div>
    </el-dialog>
</template>
<script>
import { customerBnPhone, findEmployees, updateCustomers, addCustomers, physicalTestInput } from '@/api/testReport'
import { getEmployeeSelectVule } from '@/utils/comm'
import { parseTime } from '@/utils/index'
import { testFloat2 } from '@/utils/validate'
const validateHeight = (rule, value, callback) => {
  if (!value) {
    callback(new Error('不能为空'))
  } else {
    if (!testFloat2(value)) {
      callback(new Error('身高只能为正数或者就可保留两位的小数'))
    } else {
      if (value < 40) {
        callback(new Error('身高不得小于40'))
      }
      if (value > 300) {
        callback(new Error('身高不得大于300'))
      }
    }
  }
}
const validateWeight = (rule, value, callback) => {
  if (!value) {
    callback(new Error('不能为空'))
  } else {
    if (!testFloat2(value)) {
      callback(new Error('仅可保留两位小数'))
    } else {
      if (value > 300) {
        callback(new Error('体重不得大于300'))
      }
    }
  }
}
const validateage = (rule, value, callback) => {
  if (!value) {
    callback(new Error('不能为空'))
  } else if (Number(value) < 6 || Number(value) > 200) {
    callback(new Error('年龄范围6-200岁'))
  } else if (!/^\d+$/.test(value)) {
    callback(new Error('年龄不能为小数'))
  } else {
    if (value <= 0) {
      callback(new Error('年龄不能为0'))
    }
    if (value > 150) {
      callback(new Error('年龄不得大于150'))
    }
  }
}
export default {
  name: 'testReportEntryPopup',
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
    }
  },
  data() {
    return {
      lostTime: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      nowTime: parseTime(new Date(), '{h}:{i}:{s}'),
      step: 1,
      phone: '',
      stepFromData2: {
        sex: '',
        employees: null,
        is_register_app: false
      },
      stepFromRules2: {
        name: { required: true, message: '请选择所属会籍', trigger: 'blur' },
        employees: { required: true, message: '请选择所属会籍', trigger: 'change' }
      },
      disabled: true,
      employeesList: [],
      stepFromData3: {},
      stepFromRules3: {
        examTime: { required: true, message: '请选择体检日期', trigger: 'blur' },
        age: { required: true, trigger: 'blur', validator: validateage },
        height: { required: true, trigger: 'blur', validator: validateHeight },
        weight: { required: true, trigger: 'blur', validator: validateWeight }
      },
      customerInfor: {},
      IsCustomerInfor: true,
      NofindAction: true,
      phoneFormatErr: false,
      step2: 1,
      isLr: false,
      btnOkLoading: false
    }
  },
  created() {
    findEmployees({ per_page: 1000, page: 1 }).then(res => {
      let data = res.data
      this.employeesList = data.filter(currentValue => {
        // 查找状态为1的员工
        return currentValue.status === 1
      })
    }).then(err => {
      console.log(err)
    })
  },
  methods: {
    defaultValue() {
      this.step = 1
      this.step2 = 1
      this.phone = ''
      this.disabled = true
      this.NofindAction = true
      this.IsCustomerInfor = true
      this.phoneFormatErr = false
    },
    dialogClosed() {
      this.defaultValue()
      this.$emit('dialogClosed')
    },
    QRcodeEnter(value) {
      // 输入电话去查找
      if (!/^1[0-9]{10}$/.test(value)) {
        this.phoneFormatErr = true
        return false
      }
      customerBnPhone(value).then(res => {
        let data = res.data
        this.phoneFormatErr = false
        this.NofindAction = false
        if (data.id) {
          this.isLr = true // 已入录
          this.common.message('success', '已获得客户信息')
          this.customerInfor = data
          this.stepFromData2 = {
            id: data.id,
            phone: this.phone,
            name: data.name,
            sex: data.sex + '',
            employees: getEmployeeSelectVule(this.employeesList, data.consultant_id),
            is_register_app: data.is_register_app
          }
          this.IsCustomerInfor = true
          this.step = this.step + 1
        } else {
          this.isLr = false
          this.common.message('warning', '请手动录入信息')
          this.stepFromData2 = {
            name: '',
            sex: '1',
            employees: null,
            is_register_app: false
          }
          this.stepFromData2.phone = this.phone
          this.step2 = 2
          this.IsCustomerInfor = false
        }
      }).catch(err => {
        console.log(err)
      })
    },
    backUp() {
      this.step = this.step - 1
    },
    netStepBtn1(param) {
      this.QRcodeEnter(param)
    },
    setStepBtn2() {
      this.disabled = false
    },
    cancelSetBtn2() {
      this.stepFromData2 = {
        id: this.customerInfor.id,
        phone: this.customerInfor.phone,
        name: this.customerInfor.name,
        sex: this.customerInfor.sex + '',
        employees: this.customerInfor.consultant_id
      }
      this.disabled = true
    },
    saveSetBtn2() {
      // 点击保存按钮，修改用户信息
      let obj = {
        id: this.stepFromData2.id,
        phone: this.stepFromData2.phone,
        name: this.stepFromData2.name,
        sex: Number(this.stepFromData2.sex),
        consultant_id: this.stepFromData2.employees ? Number(this.stepFromData2.employees) : undefined
      }
      updateCustomers(obj).then(res => {
        let data = res.data
        this.stepFromData2 = {
          id: data.id,
          phone: data.phone,
          name: data.name,
          sex: data.sex + '',
          employees: data.consultant_id
        }
        this.disabled = true
      }).catch(err => {
        console.log(err)
      })
    },
    netStepBtn2() {
      this.step = this.step + 1
    },
    netStep2Btn() {
      this.step2 = this.step2 + 1
      this.stepFromData2.name = ''
      this.stepFromData2.sex = null
      this.stepFromData2.employees = null
    },
    backUp2() {
      this.step2 = this.step2 - 1
    },
    netStep2Btn2() {
      // 客户不存在，添加客户
      let obj = {
        name: this.stepFromData2.name,
        sex: Number(this.stepFromData2.sex),
        phone: this.stepFromData2.phone,
        consultant_id: this.stepFromData2.employees ? Number(this.stepFromData2.employees) : undefined
      }
      addCustomers(obj).then(res => {
        let data = res.data
        this.step = 2
        this.IsCustomerInfor = true
        this.disabled = true
        this.stepFromData2 = {
          id: data.id,
          phone: data.phone,
          name: data.name,
          sex: data.sex + '',
          employees: data.consultant_id
        }
        this.netStepBtn2()
      }).catch(err => {
        console.log(err)
      })
    },
    btnOk() {
      if (!this.stepFromData3.examTime) {
        this.common.message('warning', '体测时间不能为空')
        return false
      }
      if (!this.stepFromData3.age) {
        this.common.message('warning', '年龄不能为空')
        return false
      } else if (Number(this.stepFromData3.age) < 6 || Number(this.stepFromData3.age) > 200) {
        this.common.message('warning', '年龄范围6-200岁')
        return false
      } else if (!/^\d+$/.test(this.stepFromData3.age)) {
        this.common.message('warning', '年龄不能为小数')
        return false
      }
      if (!this.stepFromData3.height) {
        this.common.message('warning', '身高不能为空')
        return false
      }
      if (!this.stepFromData3.weight) {
        this.common.message('warning', '体重不能为空')
        return false
      }
      let obj = {
        customer_id: this.stepFromData2.id,
        name: this.stepFromData2.name,
        phone: this.stepFromData2.phone,
        examTime: parseTime(new Date(this.stepFromData3.examTime), '{y}-{m}-{d} {h}:{i}:{s}'),
        age: Number(this.stepFromData3.age),
        height: Number(this.stepFromData3.height),
        weight: Number(this.stepFromData3.weight),
        protein: this.stepFromData3.protein,
        fat: Number(this.stepFromData3.fat),
        max_blood_pressure: this.stepFromData3.max_blood_pressure,
        body_water: this.stepFromData3.body_water,
        min_blood_pressure: this.stepFromData3.min_blood_pressure,
        // fat_weight: this.stepFromData3.fat_weight,
        infat: this.stepFromData3.infat,
        bone: this.stepFromData3.bone,
        sub_fat: Number(this.stepFromData3.sub_fat),
        muscle: this.stepFromData3.muscle,
        resting_heart_rate: this.stepFromData3.resting_heart_rate,
        waist_hip: this.stepFromData3.waist_hip,
        body_level: this.stepFromData3.body_level,
        calories_base: this.stepFromData3.calories_base
      }
      this.btnOkLoading = true
      physicalTestInput(obj).then(res => {
        if (res) {
          this.common.message('success', '体测录入成功')
          this.dialogClosed()
          this.$emit('testReportEntryPopupOK')
        }
        this.btnOkLoading = false
      }).catch(err => {
        console.log(err)
        this.common.message('error', '体测录入失败')
        this.btnOkLoading = false
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.qr {
  background-position: center;
  background-size: cover;
  width: 40px;
  border-radius: 5px 0 0 5px;
  top: -1px;
}
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
.testReportEntryPopup {
  .el-dialog__body {
    border-top: 1px solid #cccccc;
  }
  .dialog-body {
    width: 95%;
    margin: 0px auto;
    margin-top: 15px;
    .el-steps{
      margin-bottom: 15px;
      .el-step__main{
        .el-step__title{
          font-size: 14px;
        }
      }
      .el-step{
        position: relative;
        .el-step__head{
          position: absolute;
          top: 1px;
          left: -20px;
        }
      }
    }
    .step1-content{
      width: 60%;
      margin: 0px auto;
      margin-top: 40px;
      .el-input .el-input-group__prepend{
        padding: 0px;
      }
      .el-input .el-input-group__prepend + input{
        margin-left: 34px;
      }
      .step1-content-bottom{
        text-align: center;
        margin-top: 50px;
        margin-bottom: 30px;
      }
      .err-prompt{
        font-size: 12px;
        color: #f56c6c;
        margin-top: 0px;
      }
    }
    .step2-content{
      width: 50%;
      margin: 0px auto;
      margin-top: 40px;
      .prompt{
        padding-left: 120px;
        font-size: 12px;
        margin-bottom: 30px;
        margin-top: -20px;
        span{
          color: #1878E1;
          cursor: pointer;
        }
      }
      .el-select{
        width: 100%;
      }
      .step2-content-bottom{
        text-align: center;
        margin-top: 50px;
        margin-bottom: 30px;
      }
      .phone{
        position: relative;
        .status-prompt{
          color: #1AB394;
          position: absolute;
          top: 0px;
          right: -100px;
        }
      }
    }
    .step3-content{
      width: 90%;
      margin: 0px auto;
      margin-top: 40px;
      .step3-content-bottom{
        text-align: center;
        margin-top: 50px;
        margin-bottom: 30px;
      }
    }
  }
}
</style>


