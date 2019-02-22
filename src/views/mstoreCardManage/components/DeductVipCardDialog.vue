<template>
   <el-dialog
      title="会员卡扣次数"
      :visible.sync="dialogVisible"
      :width="widthSize"
      class="deductVipCardDialog customizeDetailsDialog"
      :beforeClose='dialogClosed'
      append-to-body
    >
      <div class="dialog-body">
        <vip-card-style :vipCardData="vipCardData" :isSecondCard="isSecondCard" style="width:100%;margin:0px auto;"></vip-card-style>
        <div class="dialog-body-two" style="padding-top:30px;">
          <el-form ref="deductVipCardform" :model="deductVipCardform" :rules="rule1">
            <el-form-item label="扣卡" label-width="80px" prop="use_times">
              <el-input-number v-model="deductVipCardform.use_times" @keyup.native="inputKeyUp" :min="1" label="描述文字"></el-input-number>
            </el-form-item>
            <el-form-item label="备注" label-width="80px" style="width:100%"  prop="remark">
              <el-input type="textarea" v-model="deductVipCardform.remark" :autosize="{ minRows: 5, maxRows: 10}" :maxlength="20"></el-input>
            </el-form-item>
            <el-form-item style="text-align: center;margin-lef:0px;">
              <el-button @click="deductVipCardOKbtn" style="background-color: rgb(51, 51, 51);color:#ffffff">确定</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-dialog>
</template>
<script>
import VipCardStyle from '@/components/vipCardStyle'
import { vipCardDetails, deductVipCardGl } from '@/api/vipcardGl'
export default {
  name: 'deductVipCardDialog',
  props: {
    widthSize: {
      type: String,
      default() {
        return '200px'
      }
    }
  },
  data() {
    return {
      vipCardData: {},
      vipCardDetailsData: {},
      deductVipCardform: {
        use_times: 1,
        remark: ''
      },
      rule1: {},
      dialogVisible: false,
      isSecondCard: false
    }
  },
  methods: {
    dialogClosed() {
      this.$refs.deductVipCardform.resetFields()
      this.dialogVisible = false
      this.$emit('dialogClosed')
    },
    openModel(id, flag) {
      this.dialogVisible = true
      this.getVipDetail(id)
      this.isSecondCard = flag
    },
    getVipDetail(id) {
      vipCardDetails(id).then(res => {
        let _data = res.data
        this.vipCardDetailsData = res.data
        this.vipCardData = {
          card_no: _data.card_no,
          status: _data.status,
          real_pay: _data.real_pay,
          start_date: _data.start_date,
          type: _data.type,
          card_name: _data.card_name,
          card_image: _data.card_image,
          end_date: _data.end_date,
          use_times: _data.use_times,
          total_times: _data.total_times
        }
      }).catch(err => {
        console.log(err)
      })
    },
    inputKeyUp(e) {
      e.target.value = e.target.value.replace(/\D|\./g, '')
    },
    deductVipCardOKbtn() {
      if (!this.deductVipCardform.use_times) {
        this.$message({ message: '扣卡次数不能为空', type: 'error' })
        return false
      }
      let obj = {
        use_times: this.deductVipCardform.use_times,
        remark: this.deductVipCardform.remark
      }
      let _id = this.vipCardDetailsData.id
      deductVipCardGl(_id, obj).then(res => {
        if (res) {
          this.$message({
            message: '编辑信息成功',
            type: 'success'
          })
          this.$refs.deductVipCardform.resetFields()
          this.dialogClosed()
          this.$emit('deductVipCardBtnOK')
        }
      }).catch(err => {
        console.log(err)
      })
    }
  },
  components: {
    VipCardStyle
  }
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
  /deep/ .el-dialog__body {
    padding: 10px 10px;
    border-radius: 0px 0px 5px 5px;
  }
}
.deductVipCardDialog {
  .el-dialog__body {
    .dialog-body-two {
      width: 95%;
      border-top: 1px solid #cccccc;
      margin: 0px auto;
      p {
        font-size: 14px;
        color: #000000;
        font-weight: 600;
        .ljStopCardTime {
          float: right;
        }
      }
      .cardForm {
        .el-select {
          width: 100%;
        }
        .el-date-editor {
          width: 100%;
        }
        .el-range-separator {
          margin-right: 2px;
        }
        label {
          font-weight: 600;
          font-size: 14px;
        }
        .el-form-item__content {
          text-align: center;
          margin-left: 0px;
        }
        
      }
      .el-input-number{
        width: 100%;
      }
    }
  }
}
</style>


