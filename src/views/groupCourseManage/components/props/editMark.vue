<template>
    <el-dialog
      title="修改备注"
      :visible.sync="dialogVisible"
      width="490px"
      append-to-body
      class="course-dialog" style="margin-top: 28vh;">
      <div class="remark-box">
        <textarea style="resize:none;" placeholder="可在此备注一些特殊情况" 
          v-model="editForm.remark" class="my-textarea"
          maxlength="100"></textarea>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" class="black" style="padding:10px 34px;" :loading="editLoading" @click="editCourseOrder">确定</el-button>
      </span>
    </el-dialog>
</template>

<script>
import { newEditCourseOrder } from '@/api/course'
export default {
  name: 'editRemark',
  props: {
  },
  computed: {
  },
  data() {
    return {
      editLoading: false,
      dialogVisible: false,
      editForm: {
        remark: ''
      },
      courseId: ''
    }
  },
  mounted() {
  },
  created() {
  },
  methods: {
    dialogShow(id, remark) {
      this.dialogVisible = true
      this.courseId = id
      this.editForm.remark = remark
    },
    editCourseOrder() {
      this.editLoading = true
      newEditCourseOrder(this.courseId, this.editForm).then(response => {
        this.editLoading = false
        this.common.message('success', '修改成功')
        this.dialogVisible = false
        this.$emit('editCourseOrderBtn')
      }).catch(() => {
        this.editLoading = false
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
.remark-box {
  text-align: center;
  .my-textarea {
    width: 430px;
    height: 110px;
    border: 1px solid #ddd;
    text-indent: 12px;
    outline: none;
  }
}
</style>