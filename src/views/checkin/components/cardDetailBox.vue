<template>
  <el-dialog
      title="会员卡信息"
      :width="widthSize"
      :visible.sync="dialogVisible"
      class="customizeDetailsDialog"
      :beforeClose="dialogClosed"
    >
      <div v-if="cardList&&cardList.length===1" style="margin-top:30px;">
        <card-detail-msg1 
            ref="vipCardDetailsDialogDoc1"
            :vipCardData="cardList[0]"
            @changeSelecter="changeSelecter"
            :widthSize="'500px'"></card-detail-msg1>
      </div>
      <el-carousel arrow="always" :autoplay="false" v-else>
        <el-carousel-item v-for="(item,key) in cardList" :key="key">
           <card-detail-msg1
            ref="vipCardDetailsDialogDoc"
            :vipCardData="item"
            @changeSelecter="changeSelecter"
            :widthSize="'500px'"></card-detail-msg1>
        </el-carousel-item>
      </el-carousel>
    </el-dialog>
</template>
<script>
import cardDetailBox from './cardDetailBox'
import cardDetailMsg1 from './cardDetailMsg1'
export default {
  name: 'cardDetailBox',
  props: {
    widthSize: {
      type: String,
      default() {
        return '1100px'
      }
    }
  },
  data() {
    return {
      cardList: [],
      dialogVisible: false
    }
  },
  created() {
  },
  components: {
    cardDetailBox,
    cardDetailMsg1
  },
  methods: {
    showDialog(data) {
      this.cardList = data
      this.dialogVisible = true
      this.$nextTick(() => {
        if (data.length === 1) {
          // this.$refs.vipCardDetailsDialogDoc1.getVipDetail(data[0].id)
          this.$refs.vipCardDetailsDialogDoc1.getVipDetail(data[0])
        } else {
          for (let i = 0; i < data.length; i++) {
            let cur = 'vipCardDetailsDialogDoc'
            this.$refs[cur][i].getVipDetail(data[i])
          }
        }
      })
    },
    closeDialog() {
      this.dialogVisible = false
      this.cardList = []
    },
    dialogClosed() {
      this.dialogVisible = false
      this.cardList = []
    },
    changeSelecter(id, status) {
      this.$emit('changeSelecter', id, status)
    }
  }
}
</script>
<style lang="scss" scoped>
.customizeDetailsDialog{
  /deep/ .el-carousel__container{
    height: 650px;
  }
  /deep/ .el-dialog__body{
    padding: 0px;
  }
  /deep/ .el-carousel__arrow--left {
    left: 0px;
  }
  /deep/ .el-carousel__arrow--right {
    right: 0px;
  }
  /deep/ .el-carousel__button {
    background-color: #cccccc;
  }
}
</style>

