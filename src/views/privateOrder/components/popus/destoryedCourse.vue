<template>
   <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="700px"
      :close-on-click-modal="false"
      class="testReportEntryPopup customizeDetailsDialog"
      :beforeClose="dialogClosed"
    >
      <div class="dialog-body">
        <div>
          <el-steps :active="step" finish-status="success" simple>
            <el-step title="确认教练信息" ></el-step>
            <el-step title="确认会员信息" ></el-step>
            <el-step title="完成消课" ></el-step>
          </el-steps>
          <!-- 步骤1 -->
          <div v-if="step===1" class="step1-content" >
             <div class="ohone onebg"></div>
             <p style="text-align:center;font-weight:600;">请教练在牛啦APP中点击“确认上课”, 自动跳转第二步</p>
          </div>
          <!-- 步骤2 -->
          <div v-else-if="step===2" class="step2-content">
            <div class="booxe">
              <el-input v-model="phone" placeholder="请输入会员手机号码" :disabled="true" readonly></el-input>
              <div>&nbsp;</div>
              <el-input v-model="code" placeholder="请填写验证码" class="opencard-select">
                <el-button slot="append" @click.native="sendCode" :disabled="sendcodebtn" type="info">{{sendtext}}</el-button>
              </el-input>
              <div>&nbsp;</div>
              <span slot="footer" class="dialog-footer">
                <el-button @click="dialogClosed">取消</el-button>
                <el-button type="primary" @click="btnCoachCancelCourse" class="blackSure">消课</el-button>
              </span>
            </div>
          </div>
          <!-- 步骤3 -->
          <div v-else-if="step===3" class="step3-content">
            <div class="ohone threebg" @click="dialogClosed">
              <p class="ohonefonts">完成消课</p>
            </div>
            <p style="text-align:center;font-weight:600;">&nbsp;</p>
          </div>
        </div>
      </div>
    </el-dialog>
</template>
<script>
import { getConfigSmsCode } from '@/api/customer'
import { coachCancelByBuyCourse } from '@/api/coach'
import { testphone } from '@/utils/validate'
import { privateCourseDetails } from '@/api/course'
export default {
  name: 'destoryedCourse',
  data() {
    return {
      step: 1,
      dialogVisible: false,
      title: '消课',
      sendcodebtn: false,
      phone: '',
      code: '',
      sendtext: '发送验证码',
      cencelId: '',
      tiome: '',
      timecode: '',
      startTime: '',
      endTime: '',
      coachId: '',
      remark: '',
      id: '',
      CourseId: '',
      type: '',
      complete: true
    }
  },
  created() {},
  watch: {
    step(newVal, oldVal) {
      if (newVal > 1) {
        clearInterval(this.tiome)
      }
    }
  },
  methods: {
    // 需要传入电话和ID
    initModel(phone, cencelId, startTime, endTime, coachId, remark, id, type, CourseId) {
      this.step = 1
      this.dialogVisible = true
      this.phone = phone
      this.cencelId = cencelId
      this.coachId = coachId
      this.startTime = startTime
      this.endTime = endTime
      this.remark = remark
      this.type = type
      this.id = id
      this.CourseId = CourseId
      this.startCheck()
      this.privateCourseDetails(id)
    },
    startCheck() {
      this.tiome = setInterval(() => {
        this.privateCourseDetails(this.id)
      }, 2000)
    },
    privateCourseDetails(id) {
      privateCourseDetails(id).then((res) => {
        if (res.data.status === 1) {
          this.step = 2
        }
      })
    },
    sendCode() {
      if (!testphone(this.phone)) {
        this.common.message('error', '请输入正确的手机号码')
        return false
      }
      let self = this
      let time = 59
      getConfigSmsCode(this.phone).then(res => {
        self.common.message('success', '短信发送成功请注意查收！')
        self.sendcodebtn = true
        this.timecode = setInterval(function() {
          if (time === 0) {
            self.sendtext = '发送验证码'
            self.sendcodebtn = false
            clearInterval(self.timecode)
          } else {
            self.sendtext = `还剩${time--}秒`
            self.sendcodebtn = true
          }
        }, 1000)
      }).catch((err) => {
        console.log(err)
        self.sendcodebtn = false
      })
    },
    btnCoachCancelCourse() {
      if (!this.code.length) {
        this.common.message('error', '验证码不能为空！')
        return
      }
      let data = { coach_id: this.coachId, started_at: this.startTime, ended_at: this.endTime, id: this.id, remark: this.remark, code: this.code, customerCourseId: this.CourseId }
      console.log(data)
      // 私教消课
      coachCancelByBuyCourse(data).then((res) => {
        this.common.notify('成功', 'success', '消课成功！')
        this.complete = false
        this.dialogClosed()
        this.step = 3
      }).catch((err) => {
        console.log(err)
        self.sendcodebtn = false
      })
    },
    dialogClosed() {
      if (this.type === 'buy' && this.complete) {
        this.$confirm('关闭窗口后，可在“私教预约”中继续消课，或者取消预约', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          showClose: false,
          type: 'warning'
        }).then(() => {
          this.colseALL()
        })
      } else if (this.type === 'booking') {
        this.colseALL()
      } else {
        this.colseALL()
      }
    },
    colseALL() {
      clearInterval(this.timecode)
      this.dialogVisible = false
      this.phone = ''
      this.code = ''
      this.startTime = ''
      this.endTime = ''
      this.coachId = ''
      this.remark = ''
      this.type = ''
      this.complete = true
      this.customerCourseId = ''
      this.$emit('dialogClosed')
      this.sendcodebtn = false
      this.sendtext = '发送验证码'
      clearInterval(this.tiome)
    }
  }
}
</script>
<style lang="scss" scoped>
.ohone {
  height: 305px;
  width: 207px;
  margin: 30px auto 0 auto;
  cursor: pointer;
}
.ohonefonts {text-align: center;color:#1ab394;top: 220px;position: relative; }
.onebg {background: url("../../../../assets/image/ohone.png") no-repeat center center;}
.threebg {background: url("../../../../assets/image/boox.png") no-repeat center center;}
.booxe {
  width: 320px;
  text-align: center;
  margin: 117px auto 116px auto;
}
.blackSure {
  background: #000;
  border: 1px solid #000;
}
</style>


