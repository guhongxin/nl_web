<template>
  <div>
    <el-table @filter-change="filterChange" :data="chartData" 
      style="width: 100%;border: none;" class="recordTable statistics-table check-table">
      <el-table-column label="" align="center">
        <template slot-scope="scope">
          <span v-text="scope.$index + 1" v-if="scope.$index > 2"></span>
          <img src="../../../../../assets/icon/index1.png" width="26px" style="margin-top:6px;" v-if="scope.$index === 0">
          <img src="../../../../../assets/icon/index2.png" width="26px" style="margin-top:6px;" v-if="scope.$index === 1">
          <img src="../../../../../assets/icon/index3.png" width="26px" style="margin-top:6px;" v-if="scope.$index === 2">
        </template>
      </el-table-column>
      <el-table-column column-key="type" prop="scope.row.type"
        class-name="tth"
        :label="'<span class=wnndn>'+chartTitle+'</span>'"  
        align="center" 
        :filters="option"
        filter-placement="bottom-end" :filter-multiple="false"
        width="150">
        <template slot-scope="scope">
          {{scope.row.name}}
        </template>
      </el-table-column>
      <el-table-column :label="chartHead[0]" align="center">
        <template slot-scope="scope">
          {{scope.row.money | NumFormat}}
        </template>
      </el-table-column>
    </el-table>
    
  </div>
</template>

<script>
export default {
  props: {
    chartData: {
      type: Array
    },
    chartHead: {
      type: Array
    },
    chartTitle: {
      type: String
    }
  },
  data() {
    return {
      option: [
        { text: '会员卡业绩排名', value: '2,4,5,7' },
        { text: '私教课业绩排名', value: '3' },
        { text: '团课业绩排名', value: '6' },
        { text: '其他业绩排名', value: '1,8,9' }
      ]
    }
  },
  filters: {
    NumFormat: function(value) {
      if (!value) return '0.00'
      value = parseFloat(value).toFixed(2)
      // var intPart = Number(value).toFixed(0)
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
    }
  },
  created() {
  },
  methods: {
    filterChange(data) {
      this.$emit('changeTable', data.type[0])
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" >
.myDiv {
  background: #fff;
  line-height: 30px;
  font-size: 14px;
  color: #1878E1;
  position: absolute;
  bottom: 0;
  span {
    cursor: pointer;
    margin-left: 15px;
  }
}
.wnndn {
  width: 150px;
  height: 34px;
  border: 1px solid #cccccc;
  background-color: #ffffff;
  line-height: 34px;
  text-align: center;
  display: inline-block;
  border-radius: 5px;
  margin-left: -10px;
  color: #333333;
}
.tth {
  .cell {
    position: relative;
    .el-table__column-filter-trigger{
      position: absolute;
      top: 7px;
      right: 10px;
    }
  }
}
</style>
