<template>
  <el-dialog
      title="商品列表"
      :visible.sync="dialogVisible"
      :width="widthSize"
      class="customizeDetailsDialog goodsListDialog"
      :beforeClose='dialogClosed'
    >
      <el-table
        :data="goodData.data"
        stripe
        style="width: 100%">
        <el-table-column
          prop="name"
          label="商品名称"
          width="100" align="center">
        </el-table-column>
        <el-table-column
          prop="price"
          label="价格"
          width="100" align="center">
        </el-table-column>
        <el-table-column
          prop="stock"
          label="库存"
          width="100" align="center">
        </el-table-column>
        <el-table-column
          prop="barcode"
          label="条形码"
          width="100">
        </el-table-column>
        <el-table-column align="center" :label="$t('table.actions')" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" plain @click="handleEdit(scope.row)" :disabled="scope.row.stock===0">选择</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container" style="text-align:right;">
        <el-pagination background
          @current-change="handleCurrentChange" 
          :current-page.sync="goodListpage"
          :page-size="goodListper_page" layout="total, prev, pager, next" :total="goodData.total">
        </el-pagination>
    </div>
  </el-dialog>
</template>
<script>
// 商品列表
export default {
  name: 'dialogVisible',
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
        return '600px'
      }
    },
    goodData: {
      type: Object,
      default() {
        return {
          data: [],
          total: 0
        }
      }
    }
  },
  data() {
    return {
      goodListpage: 1,
      goodListper_page: 10
    }
  },
  created() {
    console.log(this.goodData)
  },
  methods: {
    dialogClosed() {
      this.$emit('dialogClosed')
    },
    handleEdit(row) {
      this.$emit('handleEdit', row)
    },
    handleCurrentChange(value) {
      // 页码改变
      this.goodListpag = value
      this.$emit('handleCurrentChange', this.goodListpag)
    }
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
</style>
