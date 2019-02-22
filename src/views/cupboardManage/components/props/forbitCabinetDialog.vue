<template>
    <el-dialog
      title="禁用柜子"
      :visible.sync="dialogVisible"
      :width="widthSize"
      class="lenCabinet"
      :beforeClose='dialogClosed'>
      <ul class="ul-box" :loading="loading">
        <li class="forbidden_li">
          <span>禁用原因：</span>
          <textarea style="resize:none;" placeholder="可在此备注一些特殊情况（选填）" 
          v-model="DialogNoRend.forbitMark" class="textarea" 
          v-on:input="getLength"
          maxlength="20"></textarea>
          <span class="word_len">{{tipLength}}/20</span>
        </li>
      </ul>
      <div class="cabnit-dialog-footer">
        <span slot="footer" class="dialog-footer">
          <el-button class="return" :loading="loading" @click="disableCabinet">禁用</el-button>
        </span>
      </div>
    </el-dialog>
</template>

<script>
export default {
  name: 'lenCabinetDialog',
  props: {
    dialogVisible: {
      type: Boolean,
      default: function() {
        return false
      }
    },
    widthSize: {
      type: String,
      default() {
        return '200px'
      }
    },
    DialogNoRend: {
      type: Object,
      default() {
        return {}
      }
    },
    loading: false
  },
  data() {
    return {
      tipLength: 0
    }
  },
  mounted() {},
  methods: {
    getLength() {
      this.tipLength = this.DialogNoRend.forbitMark.length
    },
    dialogClosed() {
      this.$emit('dialogClosed')
    },
    backCabinet(lockerid, grid) {
      let data = { 'lockerid': lockerid, 'grid': grid }
      this.$emit('backCabinet', data)
    },
    cansleCabinet(item) {
      this.$emit('cansleCabinet', item)
    },
    disableCabinet() {
      this.$emit('forbitCabinet')
    }
  },
  computed: {}
}
</script>
<style lang="scss" scoped>
.el-dialog .el-dialog__body{
  padding: 20px 0;
  ul {
    padding: 0 20px;
    margin: 0;
    li{
      list-style: none;
      line-height: 40px;
      margin-bottom: 10px;
      position: relative;
      padding-left: 10px;
    }
  }
  .forbidden_li {
    position: relative;
    .word_len {
      position: absolute;
      bottom: -30px;
      right: 6px;
      color: #ccc;
    }
  }
}
.textarea {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  width: 330px;
  vertical-align: top;
  height: 45px;
}
.textarea::-webkit-input-placeholder{
  color: #ccc;
}
.cabnit-dialog-footer {
  margin-top: 45px;
  text-align: center;
  .return {
    background: #000;
    border: 1px solid #000;
    color: #fff;
  }
  .continue {
    color: #fff;
  }
}
</style>