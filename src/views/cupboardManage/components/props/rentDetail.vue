<template>
  <el-dialog
    title="详情"
    :visible.sync="centerDialogVisible"
    :close-on-click-modal="true"
    width="800px"
    class="cabinet-dialog">
      <el-table stripe :key='tableKey' :data="tableList" v-loading="listLoading" element-loading-text="列表正在加载中" border fit highlight-current-row id="subOutputRank-print"
      style="width: 100%;" class="check-table" >

      <el-table-column align="center" :label="'租用结束时间'" width="220" prop="scope.row.expired_at">
        <template slot-scope="scope">
          <span v-text="scope.row.renewed_at"></span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="'操作人'" width="150" prop="scope.row.operator_name">
        <template slot-scope="scope">
          <span v-text="scope.row.operator_name ? scope.row.operator_name : '超级管理员'"></span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="'实收金额'" width="150" prop="scope.row.total_fee">
        <template slot-scope="scope">
          <span v-text="scope.row.total_fee"></span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="'租借备注'" width="238" prop="scope.row.remark">
        <template slot-scope="scope">
          <span v-text="!scope.row.remark ? '-' : scope.row.remark"></span>
        </template>
      </el-table-column>

    </el-table>

    <div class="pagination-container" style="text-align:right;">
      <el-pagination
        background 
        @size-change="handleSizeChange" 
        @current-change="handleCurrentChange" 
        :current-page.sync="listQuery.page"
        :page-sizes="[10,20,30,50]" :page-size="listQuery.per_page" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    </el-dialog>
</template>
<script>
import { renewListRecord } from '@/api/cabinet'
export default {
  props: {
  },
  data() {
    return {
      tableKey: 1,
      centerDialogVisible: false,
      listLoading: false,
      tableList: null,
      total: null,
      id: '',
      listQuery: {
        per_page: 10,
        page: 1
      }
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    // 弹框出现
    getRenewDate: function(id) {
      this.id = id
      this.centerDialogVisible = true
      this.getList(id)
    },
    getList(id) {
      this.listLoading = true
      this.listQuery.locker_rent_id = id
      renewListRecord(this.listQuery).then((res) => {
        if (res.data.length) {
          this.total = Number(res.headers.pagination.split(',')[1])
        }
        this.listLoading = false
        this.tableList = res.data
      }).catch(() => {
        this.listLoading = false
      })
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList(this.id)
    },
    handleSizeChange(val) {
      this.listQuery.per_page = val
      this.getList(this.id)
    }
  },
  computed: {
  },
  components: {
  }
}
</script>

<style lang="scss" scoped>
.cabinet-dialog /deep/ {
  .el-dialog__header {
    border-bottom: 1px solid #ddd;
  }
}
</style>
