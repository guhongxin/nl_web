<template>
<span>
  <div class='dialog-content3'>
    <el-row :gutter="20">
      <el-col v-for="(item,key) in contentData3" :key="key" :span="12" style="margin-top:10px;">
        <component v-bind:is="item.vipCardType" :vipCardData="item.VipCardData" @goOpenCard="goOpenCard" @selectAction="selectAction"></component>
      </el-col>
    </el-row>
  </div>
  <!-- 停卡 -->
    <vip-card-stop-dialog 
      ref="vipCardStopDialogDoc"
      @stopVipCardbtnOK='stopCardCardTj'
      :widthSize="'500px'"
      :employeesData="salesData"
      ></vip-card-stop-dialog>
    <!-- 扣次  -->
    <deduct-vip-card-dialog
      :title="dectVipDialogTitle"
      ref="dialogClosedeductVipCardDoc"
      @deductVipCardBtnOK='deductVipCardTj'
      :widthSize="'500px'"></deduct-vip-card-dialog>
    <!-- 转卡 -->
    <transfer-card-dialog 
      ref="dialogtransferCardDoc"
      @skryxiFormBtnOK='transferCardCardTj'
      :widthSize="'1300px'"
      :employeesData="salesData"></transfer-card-dialog>
      <!-- 续卡 -->
    <handleContinueDialog
      ref="handleContinueDoc"></handleContinueDialog>
    <!-- 编辑 -->
    <vip-card-edit-dialog
      @editVipCardbtn='editVipCardTj'
      ref="dialogClosedEditDoc"
      :widthSize="'500px'"
      :employeesData="salesData"></vip-card-edit-dialog>
</span>
</template>
<script>
import VipCardStyle1 from '@/components/vipCardStyle/VipCardStyle1'
import OpenVipCardStyle from '@/components/vipCardStyle/OpenVipCardStyle'
import handleContinueDialog from '@/views/cardManage/components/handleContinueDialog' // 续卡
import VipCardStopDialog from '@/views/cardManage/components/VipCardStopDialog' // 停卡弹窗
import DeductVipCardDialog from '@/views/cardManage/components/DeductVipCardDialog' // 扣次
import TransferCardDialog from '@/views/cardManage/components/TransferCardDialog' // 转卡
import VipCardEditDialog from '@/views/cardManage/components/VipCardEditDialog' // 编辑
import { activeCard } from '@/api/vipcardGl'
export default {
  props: {
    salesData: {
      type: Array
    }
  },
  data() {
    return {
      contentData3: [],
      contentData1: {},
      dectVipDialogTitle: '会员卡扣次数'
    }
  },
  methods: {
    goOpenCard() { // 跳转至开卡
      let curs = this.$store.getters.roles[1]
      if (curs) {
        let goopencard = false
        if (curs !== 'd') {
          for (let item of curs.role) {
            if (item.id === '1-3-0' || item.id === '1-3') {
              goopencard = true
            }
          }
        } else {
          goopencard = true
        }
        if (goopencard) {
          this.dialogClosed()
          this.$router.push({
            name: 'opencard',
            params: {
              phone: this.contentData1.phone
            }
          })
        } else {
          this.common.message('error', '无开卡权限！')
        }
      } else {
        this.dialogClosed()
        // this.$router.push('/charts/opencard')
        this.$router.push({
          name: 'opencard',
          params: {
            phone: this.contentData1.phone
          }
        })
      }
    },
    dialogClosed() {
      this.$emit('popupsClosed')
    },
    selectAction(param) {
      // 单个会员卡左侧下拉触发
      this.whichPorp(param)
    },
    whichPorp(param) {
      console.log('param', param)
      switch (param.selectType) {
        case '时效卡停卡':
          this.$nextTick(() => {
            this.$refs.vipCardStopDialogDoc.openModel(param, 1)
          })
          break
        case '次卡扣次':
          this.$nextTick(() => {
            this.dectVipDialogTitle = '会员卡扣次数'
            this.$refs.dialogClosedeductVipCardDoc.openModel(param.id, 2)
          })
          break
        case '储值卡扣费':
          this.$nextTick(() => {
            this.dectVipDialogTitle = '会员卡扣费'
            this.$refs.dialogClosedeductVipCardDoc.openModel(param.id, 3)
          })
          break
        case '时效卡转卡':
          this.$nextTick(() => {
            this.$refs.dialogtransferCardDoc.openModel(param.id, 1)
          })
          break
        case '次卡转卡':
          this.$nextTick(() => {
            this.$refs.dialogtransferCardDoc.openModel(param.id, 2)
          })
          break
        case '储值卡转卡':
          this.$nextTick(() => {
            this.$refs.dialogtransferCardDoc.openModel(param.id, 3)
          })
          break
        case '时效卡续卡':
          this.$nextTick(() => {
            this.$refs.handleContinueDoc.openModel(param.id, 1)
          })
          break
        case '次卡续卡':
          this.$nextTick(() => {
            this.$refs.handleContinueDoc.openModel(param.id, 2)
          })
          break
        case '储值卡续费':
          this.$nextTick(() => {
            this.$refs.handleContinueDoc.openModel(param.id, 3)
          })
          break
        case '时效卡编辑':
          this.$nextTick(() => {
            this.$refs.dialogClosedEditDoc.openModel(param.id, 1)
          })
          break
        case '次卡编辑':
          this.$nextTick(() => {
            this.$refs.dialogClosedEditDoc.openModel(param.id, 2)
          })
          break
        case '储值卡编辑':
          this.$nextTick(() => {
            this.$refs.dialogClosedEditDoc.openModel(param.id, 3)
          })
          break
        case '开卡':
          this.$nextTick(() => {
            let _id = param.id
            this.$confirm(`是否重新开卡卡号为${param.card_no}会员卡`, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              activeCard(_id).then(res => {
                this.$message({
                  message: '开卡成功',
                  type: 'success'
                })
                this.$emit('stopCardCardTj')
              }).catch(err => {
                console.log(err)
              })
            }).catch(() => {
              console.log(1)
            })
          })
          break
      }
    },
    setDefaultVule(params) {
      this.contentData1 = {
        name: params.name,
        sex: params.sex,
        phone: params.phone,
        id_card_no: params.id_card_no,
        birthday: params.birthday,
        remark: params.remark,
        head_portrait: params.head_portrait,
        is_register_app: params.is_register_app
      }
      let _vips = []
      params.vips.map(currentValue => {
        let obj = {
          vipCardType: 'VipCardStyle1',
          VipCardData: {
            id: currentValue.id,
            type: currentValue.type,
            card_name: currentValue.card_name,
            total_times: currentValue.total_times,
            end_date: currentValue.end_date,
            card_no: currentValue.card_no,
            card_image: currentValue.card_image,
            is_stoped: currentValue.is_stoped,
            is_active: currentValue.is_active,
            master_id: currentValue.master_id,
            gym: currentValue.gym // 会员卡那个场馆办理的
          }
        }
        _vips.push(obj)
      })
      _vips.push({
        vipCardType: 'OpenVipCardStyle',
      })
      this.contentData3 = _vips
    },
    stopCardCardTj() {
      // 提交停卡
      this.$emit('stopCardCardTj')
    },
    deductVipCardTj() {
      // 提交扣次
      this.$emit('stopCardCardTj')
    },
    transferCardCardTj() {
      // 提交转卡
      this.$emit('stopCardCardTj')
    },
    editVipCardTj() {
      // 编辑提交
      this.$emit('stopCardCardTj')
    }
  },
  components: {
    OpenVipCardStyle,
    VipCardStyle1,
    VipCardStopDialog,
    DeductVipCardDialog,
    TransferCardDialog,
    handleContinueDialog,
    VipCardEditDialog
  }
}
</script>

<style lang="scss" scoped>
</style>
