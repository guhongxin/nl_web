<template>
  <div>
    <el-table
      stripe 
      class="check-table"
      row-class-name='cashierTable' :key='tableKey'
      :data="tableList"
      v-loading="listLoading" 
      element-loading-text="列表正在加载中"
      border fit highlight-current-row>
      <el-table-column align="center" :label="'项目'" prop="source">
        <template slot-scope="scope">
          <span>{{scope.row.order}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="会员卡业绩" prop="create_sort">
        <template slot-scope="scope">
          <span>{{scope.row.card}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="私教课业绩" prop="create_sort">
        <template slot-scope="scope">
          <span>{{scope.row.course}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="团课业绩" prop="create_sort">
        <template slot-scope="scope">
          <span>{{scope.row.group}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="其他业绩" prop="create_sort">
        <template slot-scope="scope">
          <span>{{scope.row.other}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="总计" prop="total">
        <template slot-scope="scope">
          <span>{{scope.row.total}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="'备注'" prop="ramark" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <span></span>
        </template>
      </el-table-column>
    </el-table> 
  </div>
</template>
<script>
export default {
  name: 'totalTable',
  props: {
    tableList: {
      type: Array
    },
  },
  data() {
    return {
      tableKey: 0,
      listLoading: false
    }
  },
  created() {
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
</style>

