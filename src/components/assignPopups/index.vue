<template>
  <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      :width="widthSize"
      class="editCardDialog customizeDetailsDialog"
      :beforeClose='dialogClosed'
    >
      <div class="dialog-body">
       <el-form ref="dialogDataform" :model="dialogDataform" label-width="80px">
        <el-form-item :label="formlabel">
          <el-select v-model="dialogDataform.value" :placeholder="placeholder" @change='selectChange'> 
            <el-option v-for="(item, key) in selectList" 
              :label="item.name" 
              :value="item.id" :key="key"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      </div>
      <div class="dialog-bottom">
        <el-button type="info" style="margin-left:0px;background-color: rgb(51, 51, 51);color:#ffffff;" @click="popupsBtnOk">确定</el-button>
      </div>
    </el-dialog>
</template>

<script>
export default {
  name: 'assignPopups',
  props: {
    dialogVisible: {
      type: Boolean,
      default() {
        return false
      }
    },
    title: {
      type: String
    },
    formlabel: {
      type: String
    },
    widthSize: {
      type: String,
      default() {
        return '25%'
      }
    },
    selectList: {
      type: Array,
      default() {
        return {
          item: null,
          id: null
        }
      }
    },
    placeholder: {
      type: String
    }
  },
  data() {
    return {
      dialogDataform: {
        value: ''
      }
    }
  },
  methods: {
    dialogClosed() {
      this.dialogDataform.value = ''
      this.$emit('popupsClosed')
    },
    popupsBtnOk() {
      this.$emit('assignPopupsBtnOk', this.dialogDataform)
    },
    setDefaultVule(param) {
      this.dialogDataform.value = param
    },
    selectChange(param) {
      // this.dialogDataform.value = param
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
  .el-dialog__body {
    padding: 10px 10px;
    border-radius: 0px 0px 5px 5px;
    border-top: 1px solid #cccccc;
  }
}
.customizeDetailsDialog {
  .dialog-body{
    margin-top: 10px;
    width: 80%;
    margin: 0px auto;
  }
  .dialog-bottom{
    text-align: center;
    margin-top: 10px;
  }
}



</style>

