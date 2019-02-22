<template>
  <div>
    <div class="find-box2">
      <div style="overflow:hidden" class="filter-container">
        <scan-input :select="searchSelect" :defaultSelect="searchSelect[0].value" @kedownOver="searchlist" ref="scanIputDoc"></scan-input>
      </div>
    </div>
    <div class="tagbox" v-if="tags.length">
      <div class="tablesmall" v-if="common.getClass('span', 'mar10').length">共查找到<span v-text="total"></span>条</div>
      <span class="mar10" v-if="tag"  v-for="(tag, index) in tags" :key="index">
        <el-tag
        v-if="tag"
        closable
        :type="tag.type"
        @close="tagclose(tag, index)">
        {{tag.name}}
      </el-tag>
      </span>
    </div>
    <el-table @filter-change="filterChange" @sort-change="sortChange" stripe :key='tableKey' :data="tableList" v-loading="listLoading" element-loading-text="列表正在加载中" border fit highlight-current-row
      style="width: 100%;" row-class-name='cashierTable' class="check-table">
      
      <el-table-column width="200px" align="center" 
        label="确认收款时间<i onclick='openDate(event)' data=[1,'completed_at_sdate','completed_at_edate'] title='收款时间' class='el-icon-date'></i>" 
        sortable="custom" prop="completed_at_sort">
        <template slot-scope="scope">
          <span>{{scope.row.payed_at?scope.row.payed_at:'-'}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="'商品名称'" width="267" prop="">
        <template slot-scope="scope">
          <div class="mytd" v-for="(item, index) in scope.row.details" :key="index">{{item.name}}</div>
        </template>
      </el-table-column>

      <el-table-column align="center" label="条码" prop="barcode" width="250">
        <template slot-scope="scope">
          <div class="mytd" v-for="(item, index) in scope.row.details" :key="index">{{item.barcode}}</div>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="'单价（元）'" width="120" prop="price">
        <template slot-scope="scope">
          <div class="mytd" v-for="(item, index) in scope.row.details" :key="index">{{item.price}}</div>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="'购买数量'" width="120" prop="quantity">
        <template slot-scope="scope">
          <div class="mytd" v-for="(item, index) in scope.row.details" :key="index">{{item.quantity}}</div>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="'小计（元）'" width="120" prop="totalPrice">
        <template slot-scope="scope">
          <div class="mytd" v-for="(item, index) in scope.row.details" :key="index">{{ common.float2(item.price, item.quantity) }}</div>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="'应付款'" width="200" sortable='custom' prop="total_fee_sort">
        <template slot-scope="scope">
          <span>{{scope.row.total_fee}}</span>
        </template>
      </el-table-column>
	  
	    <el-table-column align="center" :label="'实付款'" width="200" sortable='custom' prop="real_pay_sort">
        <template slot-scope="scope">
          <span>{{scope.row.real_total_fee}}</span>
        </template>
      </el-table-column>

      <el-table-column column-key="payment_method" align="center" :label="'付款方式'" width="200" prop="payment_method" 
      :filters="payment_method"
      filter-placement="bottom-end" :filter-multiple="false">
        <template slot-scope="scope">
          <span v-if="scope.row.payment_method === 1">现金</span>
          <span v-if="scope.row.payment_method === 2">支付宝</span>
          <span v-if="scope.row.payment_method === 3">微信</span>
          <span v-if="scope.row.payment_method === 4">银行卡</span>
          <span v-if="scope.row.payment_method === 5">储值卡</span>
        </template>
      </el-table-column>
	  
	    <el-table-column align="center" :label="'会员手机'" width="150" prop="phone">
        <template slot-scope="scope">
          <span>{{scope.row.customer?scope.row.customer.phone:'-'}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="'销售人'" prop="phone">
        <template slot-scope="scope">
          <span>{{scope.row.sell?scope.row.sell.name:'-'}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="'出库备注'" width="200" prop="remark">
        <template slot-scope="scope">
          <span>{{scope.row.remark?scope.row.remark:'-'}}</span>
        </template>
      </el-table-column>
     
      <el-table-column min-width="130" align="center" label="操作人" prop="employee_id" column-key="employee_id"
        :filters="coperatorOptions" filter-placement="bottom-end" :filter-multiple="false">
        <template slot-scope="scope">
          <span>{{scope.row.employee_name?scope.row.employee_name:'管理员'}}</span>
        </template>
      </el-table-column>
      
    </el-table>

    <div class="pagination-container">
      <el-pagination 
        v-if="paginationShow"
        background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
        :page-sizes="[10,20,30,50]" :page-size="listQuery.per_page" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <!-- 时间筛选 -->
    <dateRange @timeChange="timeChange"></dateRange>
  </div>
</template>

<script>
import { goodsRecordList } from '@/api/goods'
import { employeeList } from '@/api/employee'
import rectbox from '@/components/rectbox'
import scanInput from '@/components/scanInput'
import dateRange from '@/components/dateRange'

export default {
  name: 'customerPotential',
  components: {
    rectbox,
    scanInput,
    dateRange
  },
  data() {
    return {
      tags: [],
      payment_method: [
        { text: '现金', value: 1 + ',现金', class: 'cpayment_method' },
        { text: '支付宝', value: 2 + ',支付宝', class: 'cpayment_method' },
        { text: '微信', value: 3 + ',微信', class: 'cpayment_method' },
        { text: '银行卡', value: 4 + ',银行卡', class: 'cpayment_method' },
        { text: '储值卡', value: 5 + ',储值卡', class: 'cpayment_method' }
      ],
      coperatorOptions: [],
      select: '',
      searchval: '',
      tableKey: 0,
      tableList: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        per_page: 10
      },
      searchSelect: [{
        text: '商品名称',
        value: 'name'
      }, {
        text: '手机号码',
        value: 'phone'
      }, {
        text: '条码',
        value: 'barcode'
      }],
      options: [{
        value: 'delete',
        label: '批量删除'
      }, {
        value: 'inset',
        label: '批量导入'
      }, {
        value: 'output',
        label: '批量导出'
      }],
      searchGroupBtn: '',
      paginationShow: true
    }
  },
  computed: {
    searchGroupValue: {
      get() {
        return '批量操作'
      },
      set(value) {
        this.searchGroupBtn = value
        console.log(value)
      }
    }
  },
  methods: {
    __init() {
      this.getList()
    },
    employeeNameList() {
      this.coperatorOptions = []
      employeeList().then(response => {
        let data = response.data
        data.map(item => {
          // 获取操作人
          this.coperatorOptions.push({ text: item.name, value: item.id + ',' + item.name, class: 'cemployee_id' })
        })
        this.coperatorOptions.unshift({ text: '超级管理员', value: '3,超级管理员', class: 'cemployee_id' })
      })
    },
    sortChange(data) {
      this.common.sortFilter(this, data)
    },
    tagclose(tag, index) {
      this.common.tagFilter(this, tag, index, this.searchSelect)
    },
    // 根据index选择潜在客户类别，对应高亮显示
    curChoose(index) {
      for (let v of this.boxlist) {
        v.checked = false
      }
      this.boxlist[index].checked = true
    },
    curOpenbox(index) {
      console.log(this.boxlist[index].text)
    },
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 1) {
        return [1, 2]
      } else if (columnIndex === 2) {
        return [0, 0]
      }
    },
    filterChange(data) {
      for (let key in data) {
        if (data[key].length !== 0) {
          if (data[key][0].split(',')) {
            this.listQuery[key] = data[key][0].split(',')[0]
          } else {
            this.listQuery[key] = data[key][0]
          }
          this.lotFilter(data, key)
        } else {
          this.lotFilter(data, key)
          delete this.listQuery[key]
        }
      }
      this.listQuery.page = 1
      this.pageInit()
      this.getList()
    },
    lotFilter(data, key) {
      let font = ''
      if (data[key].length) {
        if (data[key][0].split(',')) {
          font = data[key][0].split(',')[1]
        }
      }
      if (key === 'employee_id') {
        if (!data[key].length) {
          this.hostFilter(data, key, 3, '')
          return
        }
        this.hostFilter(data, key, 3, '操作人：' + font)
      }
      if (key === 'payment_method') {
        this.hostFilter(data, key, 2, '付款方式：' + font)
      }
    },
    hostFilter(data, key, index, text) {
      if (data[key].length === 0) {
        delete this.tags[index]
      } else {
        this.$set(this.tags, index, { name: text, type: key })
      }
    },
    getList() {
      this.listLoading = true
      goodsRecordList(this.listQuery).then(response => {
        this.tableList = response.data
        this.total = Number(response.headers.pagination.split(',')[1])
        this.listLoading = false
      })
    },
    searchlist(obj) {
      delete this.listQuery.column
      delete this.listQuery.value
      if (obj.value.length === 0) {
        delete this.tags[0]
      } else {
        this.listQuery.column = obj.type
        this.listQuery.value = obj.value
        let tagszh = {
          name: '商品名称',
          phone: '手机号码',
          barcode: '条码'
        }
        this.tags[0] = { 'name': `${tagszh[obj.type]}:${obj.value}`, 'type': obj.type }
      }
      this.listQuery.page = 1
      this.pageInit()
      this.getList()
    },
    /*
	objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
	    if (rowIndex % 2 === 0) {
	      return {
	        rowspan: 2,
	        colspan: 1
	      };
	    } else {
	      return {
	        rowspan: 0,
	        colspan: 0
	      };
	    }
	  }
    },*/
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.per_page = val
      this.getList()
    },
    pageInit() {
      this.paginationShow = false
      this.$nextTick(() => {
        this.paginationShow = true
      })
    },
    timeChange(param) {
      this.common.chooseTimerFilter(param, this)
    }
  },
  created() {
    this.__init()
    this.employeeNameList()
  },
  filters: {
  },
  destroyed() {
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.mytd {
  border-bottom: 1px solid #dfdfdf;
  line-height: 44px;
}
.boxser {
  overflow: hidden;
}
.searchgroup {
  width: 500px;
}
.searchGroupset {
  margin-left: 20px;
  width: 110px;
  .el-input__inner {
    background-color: #333333;
    color: white;
  }
  input::placeholder {
    color: white;
  }
}
.lf{float: left;}
.qr{
  width: 36px;
  position: absolute;
  left: 0;
  top: 0;
  height: 36px;
  background: url("../../../assets/icon/qr.png") no-repeat;
  background-size: contain;
}
.searchgroup .el-select .el-input {
  width: 140px;
  padding-left: 36px;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
  overflow: hidden;
}
.cursorbox {
  float: left;
  width: 10%;
  height: 98px;
  box-shadow: 0 2px 5px 0 rgba(0,0,0,0.30);
  margin: 2px 5px 5px 5px;
  .text {
    font-size: 14px;
    color: #cccccc;
    height: 40px;
    line-height: 30px;
    box-sizing: border-box;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    padding-left: 10px;
    border-top: 6px solid #1C84C6;
  }
  .font {
    font-size: 28px;
    color: #333333;
    line-height: 58px;
    height: 58px;
    text-align: center;
  }
}
.cursoractive{
  background-color: #1C84C6;
  .text {
    background-color: rgba(0, 0, 0, 0.1);
    color: #ffffff;
    line-height: 40px;
    border-top: none;
  }
  .font {
    color: #ffffff;
  }
}
.lock{
  color: rgb(241, 76, 48);
}
.no-lock{
  color: rgb(28, 132, 198);
}
.pagination-container{
  text-align:right;
}
</style>
