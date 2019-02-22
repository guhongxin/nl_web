<template>
  <div>
    <div class="myDiv">
    <el-table stripe 
      row-class-name='cashierTable' class="check-table"
      :key='tableKey'
      :data="tableList"
      v-loading="listLoading" 
      element-loading-text="列表正在加载中"
      border fit highlight-current-row
      style="width: 100%;">
      <el-table-column align="center" :label="'序号'" prop="source">
        <template slot-scope="scope">
          <span>{{scope.$index+(listQuery.page - 1) * listQuery.per_page + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="订单编号" prop="create_sort" width='180'>
        <template slot-scope="scope">
          <span>{{scope.row.trade_no}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="类别" prop="create_sort">
        <template slot-scope="scope">
          <span>{{getType(scope.row.type)}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="会员卡号" prop="create_sort" width='200'>
        <template slot-scope="scope">
          <span v-if="scope.row.type===2">{{scope.row.vip_order_details[0]?scope.row.vip_order_details[0].card_no:''}}</span>
          <span v-if="scope.row.type===4">{{scope.row.vip_transfer_details[0].customer_vip?scope.row.vip_transfer_details[0].customer_vip.card_no:''}}</span>
          <span v-if="scope.row.type===5">{{scope.row.vip_stop_details[0].customer_vip?scope.row.vip_stop_details[0].customer_vip.card_no:''}}</span>
          <span v-if="scope.row.type===7">{{scope.row.vip_renew_details[0].customer_vip?scope.row.vip_renew_details[0].customer_vip.card_no:''}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="卡种名称" prop="create_sort">
        <template slot-scope="scope">
          <span v-if="scope.row.type===2">{{scope.row.vip_order_details[0]?scope.row.vip_order_details[0].card_name:''}}</span>
          <span v-if="scope.row.type===4">{{scope.row.vip_transfer_details[0].customer_vip?scope.row.vip_transfer_details[0].customer_vip.card_name:''}}</span>
          <span v-if="scope.row.type===5">{{scope.row.vip_stop_details[0].customer_vip?scope.row.vip_stop_details[0].customer_vip.card_name:''}}</span>
          <span v-if="scope.row.type===7">{{scope.row.vip_renew_details[0].customer_vip?scope.row.vip_renew_details[0].customer_vip.card_name:''}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="会员姓名" prop="create_sort">
        <template slot-scope="scope">
          <span>{{scope.row.customer_name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="手机号码" prop="create_sort">
        <template slot-scope="scope">
          <span>{{scope.row.customer_phone}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="办理时间" prop="create_sort" width='180'>
        <template slot-scope="scope">
          <span v-if="scope.row.type===2">{{scope.row.vip_order_details[0]?scope.row.vip_order_details[0].created_at:''}}</span>
          <span v-if="scope.row.type===4">{{scope.row.vip_transfer_details[0]?scope.row.vip_transfer_details[0].created_at:''}}</span>
          <span v-if="scope.row.type===5">{{scope.row.vip_stop_details[0]?scope.row.vip_stop_details[0].created_at:''}}</span>
          <span v-if="scope.row.type===7">{{scope.row.vip_renew_details[0]?scope.row.vip_renew_details[0].created_at:''}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="支付方式" prop="create_sort">
        <template slot-scope="scope">
          <span>{{getPayMethod(scope.row.payment_method)}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="实付金额" prop="create_sort">
        <template slot-scope="scope">
          <span>{{scope.row.real_total_fee}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="'备注'" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <span></span>
        </template>
      </el-table-column>
    </el-table>
    </div>
    <div class="pagination-container pageBox">
      <el-pagination 
        v-if="paginationShow"
        background 
        @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
        :page-sizes="[100,200,500,800,1000]" :page-size="listQuery.per_page" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import { orderLists } from '@/api/statistics'
export default {
  name: 'totalTable',
  props: {
  },
  data() {
    return {
      tableKey: 0,
      listLoading: false,
      paginationShow: true,
      total: null,
      tableList: [],
      listQuery: {
        page: 1,
        per_page: 100,
        type: '2,4,5,7'
      }
    }
  },
  created() {
    this.listQuery = Object.assign(this.listQuery, this.params)
  },
  mounted() {
    // this.getList()
  },
  methods: {
    getList(obj) {
      this.listQuery = Object.assign(this.listQuery, obj)
      this.listLoading = true
      orderLists(this.listQuery).then(res => {
        this.listLoading = false
        this.tableList = res.data.data
        this.total = res.data.total
      })
    },
    getType(val) {
      switch (val) {
        case 2: {
          return '售卡'
        }
        case 4: {
          return '转卡'
        }
        case 5: {
          return '停卡'
        }
        case 7: {
          return '续卡'
        }
        default:
          return ''
      }
    },
    getPayMethod(val) {
      switch (val) {
        case 1: {
          return '现金'
        }
        case 2: {
          return '支付宝'
        }
        case 3: {
          return '微信'
        }
        case 4: {
          return '银行卡'
        }
        case 5: {
          return '储值卡'
        }
        default:
          return ''
      }
    },
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
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.myDiv {
  max-height: 300px;
  overflow-y: auto;
}
</style>

