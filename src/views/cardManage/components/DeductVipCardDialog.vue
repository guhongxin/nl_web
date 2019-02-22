<template>
   <el-dialog
      :title="title"
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
            <el-form-item label="扣次" label-width="80px" prop="use_times" v-if="isSecondCard===2">
              <el-input-number v-model="deductVipCardform.use_times" @keyup.native="inputKeyUp" :min="1" label="描述文字"></el-input-number>
            </el-form-item>
             <el-form-item label="扣费" label-width="80px" prop="use_money" v-else-if="isSecondCard===3">
              <!-- <el-input-number v-model="deductVipCardform.use_money" @keyup.native="inputKeyUp1($event, 0, 999999)" :min="0" label="请输入消费金额"></el-input-number> -->
              <el-input v-model="deductVipCardform.use_money" @keyup.native="inputKeyUp1($event, 0, 999999)"  :maxLength="6"></el-input>
            </el-form-item>
            <el-form-item label="备注" label-width="80px" style="width:100%"  prop="remark">
              <el-input type="textarea" v-model="deductVipCardform.remark" :autosize="{ minRows: 5, maxRows: 10}" :maxlength="20"></el-input>
            </el-form-item>
            <el-form-item style="text-align: center;margin-lef:0px;">
              <el-button @click="deductVipCardOKbtn" style="background-color: rgb(51, 51, 51);color:#ffffff" :loading="btnLoading">确定</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-dialog>
</template>
<script>
import VipCardStyle from '@/components/vipCardStyle'
import { vipCardDetails, deductVipCardGl, deductCardMoney } from '@/api/vipcardGl'
export default {
  name: 'deductVipCardDialog',
  props: {
    widthSize: {
      type: String,
      default() {
        return '200px'
      }
    },
    title: {
      type: String,
      default() {
        return '会员卡扣次数'
      }
    }
  },
  data() {
    return {
      vipCardData: {},
      vipCardDetailsData: {},
      deductVipCardform: {
        use_times: '1',
        remark: '',
        use_money: '0'
      },
      rule1: {},
      dialogVisible: false,
      isSecondCard: 0,
      btnLoading: false
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
          real_pay: _data.order ? _data.order.real_total_fee : '',
          start_date: _data.start_date,
          type: _data.type,
          card_name: _data.card_name,
          card_image: _data.card_image,
          end_date: _data.end_date,
          use_times: _data.use_times,
          total_times: _data.total_times,
          master_id: _data.master_id,
          gym: _data.gym, // 会员卡那个场馆办理的
          has_date: _data.balance // 储值卡剩余金额
        }
      }).catch(err => {
        console.log(err)
      })
    },
    inputKeyUp(e) {
      e.target.value = e.target.value.replace(/\D|\./g, '')
    },
    deductVipCardOKbtn() {
      let obj = {}
      // isSecondCard=3是储值卡操作
      let _id = this.vipCardDetailsData.id
      if (this.isSecondCard !== 3) {
        if (!this.deductVipCardform.use_times) {
          this.$message({ message: '扣卡次数不能为空', type: 'error' })
          return false
        }
        obj = {
          use_times: this.deductVipCardform.use_times,
          remark: this.deductVipCardform.remark
        }
        this.btnLoading = true
        deductVipCardGl(_id, obj).then(res => {
          if (res) {
            this.$message({
              message: '扣次成功',
              type: 'success'
            })
            this.btnLoading = false
            this.$refs.deductVipCardform.resetFields()
            this.dialogClosed()
            this.$emit('deductVipCardBtnOK')
          }
        }).catch(err => {
          this.btnLoading = false
          console.log(err)
        })
      } else {
        if (!this.deductVipCardform.use_money) {
          this.$message({ message: '扣费不能为空', type: 'error' })
          return false
        }
        if (Number(this.vipCardDetailsData.balance) < Number(this.deductVipCardform.use_money)) {
          this.$message({ message: '扣费金额不能大于剩余金额', type: 'error' })
          return false
        }
        obj = {
          amount: this.deductVipCardform.use_money,
          remark: this.deductVipCardform.remark
        }
        this.btnLoading = true
        deductCardMoney(_id, obj).then(res => {
          if (res) {
            this.$message({
              message: '扣费成功',
              type: 'success'
            })
            this.btnLoading = false
            this.$refs.deductVipCardform.resetFields()
            this.dialogClosed()
            this.$emit('deductVipCardBtnOK')
          }
        }).catch(err => {
          this.btnLoading = false
          console.log(err)
        })
      }
    },
    inputKeyUp1(e, min, max, moduleVale) {
      let doc = e.target
      let _value = this.common.check(doc, min, max)
      this.deductVipCardform.use_money = _value
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


