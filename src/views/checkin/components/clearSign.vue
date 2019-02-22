<template>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="490px"
      append-to-body
      class="course-dialog" style="margin-top: 28vh;">
        <div style="color:#000;text-align:center;font-size:18px;margin:20px 0;">点击确定后，将签退场内所有会员？</div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" class="black" style="padding:10px 34px;" @click="clearSignAll" :loading="loading">确定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { cleanSign } from '@/api/signin'
export default {
  name: 'clearSign',
  props: {
  },
  computed: {
  },
  data() {
    return {
      dialogVisible: false,
      loading: false
    }
  },
  mounted() {
  },
  created() {
  },
  methods: {
    dialogShow() {
      this.dialogVisible = true
    },
    clearSignAll() {
      this.loading = true
      cleanSign().then((res) => {
        this.loading = false
        this.common.message('success', '一键清场成功')
        this.$emit('cleanBtn')
        this.dialogVisible = false
      }).catch(() => {
        this.loading = false
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