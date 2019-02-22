<template>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="500px"
      class="course-dialog" style="margin-top: 28vh;"
      append-to-body>
      <div style="color:#000;text-align:center;font-size:18px;margin:20px 0;">{{tipMessage}}</div>
      <div style="color:#000;text-align:center;font-size:18px;margin:20px 0;" v-if="tipMessageDetail">{{tipMessageDetail}}</div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" class="black" style="padding:10px 34px;" @click="deleteSure" :loading="loading">确定</el-button>
      </span>
    </el-dialog>
</template>

<script>

export default {
  name: 'lenCabinetDialog',
  props: {
    tipMessage: {
      type: String,
      default() {
        return ''
      }
    },
    tipMessageDetail: {
      type: String,
      default() {
        return ''
      }
    }
  },
  data() {
    return {
      loading: false,
      dialogVisible: false
    }
  },
  mounted() {},
  methods: {
    dialogShow() {
      this.dialogVisible = true
    },
    dialogClose() {
      this.dialogVisible = false
      this.loading = false
    },
    dialogLoadingClose() {
      this.loading = false
    },
    dialogClosed() {
      this.$emit('dialogClosed')
    },
    deleteSure() {
      this.$emit('deleteSureBtn')
      this.loading = true
    }
  },
  computed: {}
}
</script>
<style lang="scss" scoped>
.dialog-footer {
  .black {
    background: #000;
    border: 1px solid #000;
  }
}
</style>