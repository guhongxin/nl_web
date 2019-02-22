<template>
   <!-- 查看评价 -->
    <el-dialog
      title="查看评价"
      :visible.sync="dialogVisible"
      :width="widthSize"
      class="evaluatpopus customizeDetailsDialog"
      :beforeClose='dialogClosed'
      append-to-body>
      <div class="dialog-body">
        <div class="content">
          <h3>会员信息</h3>
          <el-row :gutter="20">
            <el-col :span="8">
              <p>会员姓名：<span>{{privateDetails.customer?privateDetails.customer.name:'-'}}</span></p>
              <p>会员性别：<span>{{privateDetails.customer?setSexZh(privateDetails.customer.sex):'-'}}</span></p>
              <p>手机号码：<span>{{privateDetails.customer?privateDetails.customer.phone:'-'}}</span></p>
            </el-col>
            <el-col :span="6">
              <img :src='privateDetails.customer?privateDetails.customer.head_portrait?privateDetails.customer.head_portrait:defaulthead:defaulthead' 
                class="img-box"/>
            </el-col>
          </el-row>
        </div>
        <div class="content">
          <h3>课程信息</h3>
          <el-row :gutter="20">
            <el-col :span="14">
              <p>课程名称：<span>{{privateDetails.course_name}}</span></p>
              <p>上课时间：<span>{{privateDetails.started_at?privateDetails.started_at:'-'}}</span></p>
            </el-col>
            <el-col :span="10">
              <p>课程次数：<span>{{privateDetails.customer_course?privateDetails.customer_course.quantity:'-'}}</span></p>
              <p>剩余次数：<span>{{privateDetails.customer_course?(privateDetails.customer_course.quantity - privateDetails.customer_course.use):''}}</span></p>
            </el-col>
          </el-row>
        </div>
         <div class="content">
          <h3>评价记录</h3>
          <el-row :gutter="20">
            <el-col :span="14">
              <p>评价内容：
                <span style="display:inline-block;width:74%;vertical-align: text-top;line-height:20px;">
                  {{privateDetails.comment? privateDetails.comment.content: '未评价'}}
                </span>
              </p>
            </el-col>
            <el-col :span="10">
              <p>专业评分：
                <el-rate
                  v-model="professionalRating"
                  disabled
                  text-color="#ff9900">
                </el-rate>
              </p>
              <p>服务评分：
                <el-rate
                  v-model="serviceRating"
                  disabled
                  text-color="#ff9900">
                </el-rate>
              </p>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="bottom-box">
        <el-button type="primary" @click="evaluatPopusBtnOK" style="background-color: rgb(51, 51, 51);border:1px solid #000;color:#fff;">确定</el-button>
      </div>
    </el-dialog>
</template>
<script>
import { privateCourseDetails } from '@/api/course'
export default {
  name: 'evaluatpopus',
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
        return '400px'
      }
    }
  },
  data() {
    return {
      privateDetails: {},
      professionalRating: 0,
      serviceRating: 0
    }
  },
  methods: {
    dialogClosed() {
      this.$emit('dialogClosed')
    },
    evaluatPopusBtnOK() {
      this.$emit('evaluatPopusBtnOK')
    },
    getPrivateCourseDetails(id) {
      privateCourseDetails(id).then(res => {
        let _data = res.data
        this.privateDetails = _data
      }).catch(err => {
        console.log(err)
      })
    },
    setSexZh(param) {
      let result = ''
      switch (param) {
        case 1:
          result = '男'
          break
        case 2:
          result = '女'
          break
        default:
          result = '-'
      }
      return result
    }
  },
  watch: {
    privateDetails: {
      handler(newValue, oldValue) {
        console.log('***', newValue)
        if (!newValue.comment || newValue.comment.details.lenghth > 0) {
          this.professionalRating = 0
          this.serviceRating = 0
        } else {
          newValue.comment.details.map(item => {
            if (item.type === 1) {
              this.professionalRating = item.score
            } else if (item.type === 2) {
              this.serviceRating = item.score
            }
          })
        }
      },
      deep: true
    }
  },
  components: {}
}
</script>
<style lang="scss" scoped>
.customizeDetailsDialog {
  /deep/ .el-dialog {
    border-radius: 5px;
  }
  /deep/ .el-dialog__header {
    border: 1px solid #cccccc;
    border-radius: 5px 5px 0px 0px;
  }
  /deep/ .el-dialog__body{
    padding: 0px;
  }
}
.evaluatpopus{
  .dialog-body{
    width: 100%;
    padding-left: 10px;
    padding-right: 10px;
    .content:not(:last-of-type){
      border-bottom: 1px solid #CCCCCC;
    }
    .content{
      padding: 20px 18px;
      h3{
        font-size: 20px;
        color: #333333;
        line-height: 0px;
      }
      p{
        font-size: 14px;
        color: #000000;
        letter-spacing: 0;
        line-height: 16px;
        span{
          font-size: 14px;
          color: #333333;
          line-height: 14px;
          margin-left: 16px;
        }
        .el-rate{
          display: inline-block;
          span{
            margin-left: 5px;
          }
        }
      }
      .img-box{
        border-radius: 50%;
        height: 90px;
        width: 90px;
      }
    }
  }
  .bottom-box{
    padding: 10px 10px;
    text-align: center;
  }
}

</style>


