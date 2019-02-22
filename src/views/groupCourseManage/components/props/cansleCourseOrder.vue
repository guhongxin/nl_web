<template>
    <el-dialog
      title="取消预约"
      :visible.sync="dialogVisible"
      width="490px"
      append-to-body
      class="course-dialog" style="margin-top: 28vh;">
        <div style="color:#000;text-align:center;font-size:18px;margin:20px 0;">确定要取消当前选中的预约信息？</div>
        <div style="color:#000;text-align:center;font-size:18px;margin-bottom:20px;">提示：取消后，该预约的实付金额将不计入业绩统计</div>
        <div style="color:#000;text-align:center;font-size:18px;">客户在APP中的付款，会在次日零点自动原路退换</div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" class="black" style="padding:10px 34px;" :loading="cansleLoading" @click="cansleCourseOrder">确定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { newCansleCourseOrder } from '@/api/course'
export default {
  name: 'editRemark',
  props: {
  },
  computed: {
  },
  data() {
    return {
      cansleLoading: false,
      dialogVisible: false,
      courseId: ''
    }
  },
  mounted() {
  },
  created() {
  },
  methods: {
    dialogShow(id) {
      this.dialogVisible = true
      this.courseId = id
    },
    cansleCourseOrder() {
      this.cansleLoading = true
      newCansleCourseOrder(this.courseId).then(response => {
        this.cansleLoading = false
        this.common.message('success', '取消成功')
        this.dialogVisible = false
        this.$emit('cansleCourseOrderBtn')
      }).catch(() => {
        this.cansleLoading = false
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.dialog-footer /deep/{
  text-align: center;
  margin-top: 30px;
  .black {
    background: #000;
    border: 1px solid #000;
  }
}
</style>