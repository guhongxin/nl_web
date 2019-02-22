<template>
  <el-table :data="chartData" style="width: 100%;border: none" class="myTable statistics-table check-table">
    <el-table-column label="" show-overflow-tooltip align="center">
      <template slot-scope="scope">
        {{scope.row.name}}
      </template>
    </el-table-column>
    <el-table-column label="累计" align="center">
      <template slot-scope="scope">
        <span v-if="scope.row.float">{{scope.row.total | NumFormat}}</span>
        <span v-if="!scope.row.float">{{scope.row.total | NumInt}}</span>
      </template>
    </el-table-column>
    <el-table-column :label="chartHead[0]" align="center">
      <template slot-scope="scope">
        <span v-if="scope.row.float">{{scope.row.week | NumFormat}}</span>
        <span v-if="!scope.row.float">{{scope.row.week | NumInt}}</span>
      </template>
    </el-table-column>
    <el-table-column :label="chartHead[1]" align="center">
      <template slot-scope="scope">
        <span v-if="scope.row.float">{{scope.row.lastWeek | NumFormat}}</span>
        <span v-if="!scope.row.float">{{scope.row.lastWeek | NumInt}}</span>
      </template>
    </el-table-column>
   <!--  <el-table-column label="Status" width="100" align="center">
      <template slot-scope="scope">
        <el-tag :type="scope.row.status | statusFilter"> {{scope.row.status}}</el-tag>
      </template>
    </el-table-column> -->
  </el-table>
</template>

<script>
export default {
  props: {
    chartData: {
      type: Array
    },
    chartHead: {
      type: Array
    }
  },
  data() {
    return {
    }
  },
  filters: {
    NumFormat: function(value) {
      value = Number(value).toFixed(2)
      if (!value) return '0.00'
      // var intPart = Number(value).toFixed(0) // 获取整数部分
      var intPart = Math.trunc(value) // 获取整数部分
      var intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') // 将整数部分逢三一断
      var floatPart = '.00' // 预定义小数部分
      var value2Array = value.split('.')
      // =2表示数据有小数位
      if (value2Array.length === 2) {
        floatPart = value2Array[1].toString() // 拿到小数部分
        if (floatPart.length === 1) { // 补0,实际上用不着
          return intPartFormat + '.' + floatPart + '0'
        } else {
          return intPartFormat + '.' + floatPart
        }
      } else {
        return intPartFormat + floatPart
      }
    },
    NumInt: function(value) {
      value = parseInt(value)
      if (!value) return '0'
      var intPart = Number(value).toFixed(0) // 获取整数部分
      var intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') // 将整数部分逢三一断
      return intPartFormat
    }
  },
  created() {
    // this.fetchData()
  },
  methods: {
    fetchData() {
      // fetchList().then(response => {
      //   this.list = response.data.items.slice(0, 7)
      // })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.myTable, .el-table {
  &::before {
    height: 0;
  }
}
</style>
