<template>
    <el-dialog
      :title="title"
      :visible.sync="visibleDialog"
      :width="WH" 
      class="editeRole customizeDetailsDialog"
      :beforeClose="closed"
      >
      <el-form ref="editeFormbox" :model="editeFormData" autoComplete="on"  label-width="120px" class="editeFormbox">
        <el-form-item label="角色名称：">
          <el-input v-model="editeFormData.name"  placeholder="请输入角色名称" :maxlength="12"></el-input>
        </el-form-item>
        <el-form-item label="角色描述：">
          <el-input
            type="textarea"
            :rows="4"
            placeholder="请输入角色描述"
            :maxlength="20"
            v-model="editeFormData.desc" size="medium">
          </el-input>
          <span class="t-ctip" :class="{txtTs:editeFormData.desc?editeFormData.desc.length>=20:false}">{{editeFormData.desc?editeFormData.desc.length:0}}/20</span>
        </el-form-item>
        <div style="text-align:center;">
          <span slot="footer" class="dialog-footer">
            <el-button @click="btnOk" style="margin-left:0px;background-color: rgb(51, 51, 51);color:#ffffff;" :loading="btnOkLoading">确 定</el-button>
          </span>
        </div>
      </el-form>
    </el-dialog>
</template>
<script>
export default {
  name: 'editeRolePopue',
  props: {
    title: {
      type: String
    },
    visibleDialog: {
      type: Boolean
    },
    WH: {
      type: String,
      default() {
        return '500px'
      }
    }
  },
  data() {
    return {
      editeFormData: {
        desc: ''
      },
      btnOkLoading: false
    }
  },
  methods: {
    btnOk() {
      this.btnOkLoading = true
      this.$emit('btnOk', this.editeFormData)
    },
    closed() {
      this.$emit('befor-close')
    },
    setDefaults(param) {
      this.editeFormData = {
        id: param.id,
        name: param.name,
        desc: param.desc,
        menus: param.menus,
        permissions: param.permissions
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.customizeDetailsDialog {
  .el-dialog {
    border-radius: 5px;
  }
  .el-dialog__header {
    border: 1px solid #cccccc;
    border-radius: 5px 5px 0px 0px;
  }
  /deep/ .el-dialog__body {
    padding: 10px 10px;
    border-radius: 0px 0px 5px 5px;
    border-top: 1px solid #cccccc;
  }
}
  
.editeRole{
  .editeFormbox{
    width: 90%;
    margin: 0px auto;
    margin-top: 10px;
  }
}
.editeFormbox{
  .t-ctip {
    position: absolute;
    bottom: 0px;
    right: 8px;
  }
  .txtTs{
    color: red;
  }
}
</style>


