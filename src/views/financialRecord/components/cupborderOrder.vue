<template>
  <div>
    <!-- <div class="boxser">
      <rectbox :data="boxlist" v-on:choose="curChoose" v-on:openbox="curOpenbox" @overChange="curOverChange"></rectbox>
    </div> -->
    <div style="overflow:hidden" class="find-box4">
      <scan-input :select="searchSelect" :defaultSelect="searchSelect[0].value" @kedownOver="searchlist" :placeholder="placeholder" ref="scanIputDoc"></scan-input>
      <bulk-action :select="batchOperation" @changeBulk="searchGroup"></bulk-action>
    </div>
    <div class="tagbox" v-if="tags.length">
      <div class="tablesmall" v-if="common.getClass('span', 'mar10').length">共查找到<span v-text="total"></span>条</div>
      <span class="mar10" v-if="tag" v-for="(tag, index) in tags" :key="index">
        <el-tag
        v-if="tag"
        closable
        :type="tag.type"
        @close="tagclose(tag, index)">
        {{tag.name}}
      </el-tag>
      </span>
    </div>
    
    <el-table @filter-change="filterChange" stripe 
      class="check-table"
      @sort-change="sortChange"
      @selection-change="selectionChange"
      :key='tableKey'
      :data="tableList"
      v-loading="listLoading" 
      element-loading-text="列表正在加载中"
      border
      fit highlight-current-row
      style="width: 100%;">
      <el-table-column align="center" type="selection" width="55px"></el-table-column>
      <el-table-column align="center" :label="'销售渠道'" column-key="source" prop="source" width="120"
      :filters="sellWayOptions" filter-placement="bottom-end" :filter-multiple="false">
        <template slot-scope="scope">
          <span>{{getSourse(scope.row.source)}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="下单时间<i onclick=openDate(event) title='下单时间' data=[1,'created_at_sdata','created_at_edata'] class='el-icon-date'></i>" sortable="custom" prop="create_sort" width="200">
        <template slot-scope="scope">
          <span>{{scope.row.created_at}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="'柜子区域'" prop="customerName">
        <template slot-scope="scope">
          <span v-if="scope.row.type === 8">{{scope.row.locker_rent_details?scope.row.locker_rent_details[0]?scope.row.locker_rent_details[0].locker?scope.row.locker_rent_details[0].locker.area:'':'':''}}</span>
          <span v-if="scope.row.type === 9">{{scope.row.locker_renew_details?scope.row.locker_renew_details[0]?scope.row.locker_renew_details[0].locker?scope.row.locker_renew_details[0].locker.area:'':'':''}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="'柜子编号'" prop="price_sort">
        <template slot-scope="scope">
          <span v-if="scope.row.type === 8">{{scope.row.locker_rent_details?scope.row.locker_rent_details[0]?scope.row.locker_rent_details[0].locker_grid?scope.row.locker_rent_details[0].locker_grid.no:'':'':''}}</span>
          <span v-if="scope.row.type === 9">{{scope.row.locker_renew_details?scope.row.locker_renew_details[0]?scope.row.locker_renew_details[0].rent.locker_grid?scope.row.locker_renew_details[0].rent.locker_grid.no:'':'':''}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="'客户姓名'" prop="customerName">
        <template slot-scope="scope">
          <span v-if="!getDeleteCustomer(scope.row.customer?scope.row.customer.deleted_at:'')">{{scope.row.customer?scope.row.customer.name:''}}</span>
          <el-tooltip class="item" effect="dark" v-if="getDeleteCustomer(scope.row.customer?scope.row.customer.deleted_at:'')"  :content="`客户已删除，删除时间: ${scope.row.customer.deleted_at}`" placement="bottom">
            <el-button type="info" size="mini">{{scope.row.customer?scope.row.customer.name:'-'}}</el-button>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="'手机号码'" prop="phone_sort" width="120">
        <template slot-scope="scope">
          <span>{{scope.row.customer_phone}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="'应付金额'" sortable="custom" prop="total_pay_sort" width="120">
        <template slot-scope="scope">
          <span>{{scope.row.total_fee}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="'实付金额'" sortable="custom" prop="real_pay_sort" width="120">
        <template slot-scope="scope">
          <span>{{scope.row.real_total_fee}}</span>
        </template>
      </el-table-column>
      <el-table-column column-key="sell_id" align="center" :label="'销售员工'" prop="sell_id" width="120"
      :filters="employeeOption" filter-placement="bottom-end" :filter-multiple="false">
        <template slot-scope="scope">
          <span>{{scope.row.sell?scope.row.sell.name:''}}</span>
        </template>
      </el-table-column>
      <el-table-column column-key="payment_method" align="center" :label="'支付方式'" prop="payment_method" width="120"
      :filters="payMethodOptions" filter-placement="bottom-end" :filter-multiple="false">
        <template slot-scope="scope">
          <span>{{getPayMethod(scope.row.payment_method)}}</span>
        </template>
      </el-table-column>
      <el-table-column column-key="order_status" align="center" :label="'订单状态'" prop="order_status" width="120"
      :filters="orderStatusOptions" filter-placement="bottom-end" :filter-multiple="false">
        <template slot-scope="scope">
          <span>{{getOrderStatus(scope.row.order_status)}}</span>
        </template>
      </el-table-column>
      <el-table-column column-key="check_status" align="center" :label="'审核状态'" prop="check_status" width="120"
      :filters="checkOptions" filter-placement="bottom-end" :filter-multiple="false">
        <template slot-scope="scope">
          <span :class="{'red': scope.row.deleted_at}">{{getCheckStatus(scope.row.deleted_at)}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="'操作'" min-width="120" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleCheck(scope.row)" v-if="btnRoleList['6-2-5-2']" v-show="scope.row.source!==1">财务核对</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination 
        v-if="paginationShow"
        background 
        @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
        :page-sizes="[10,20,30,50]" :page-size="listQuery.per_page" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <!-- 财务核对 -->
    <financial-check 
      ref="financialCheckDoc"
      @financeCheckBtn='financeCheckBtn'>
    </financial-check>

    <!-- 时间筛选 -->
    <dateRange @timeChange="timeChange"></dateRange>
  </div>
</template>

<script>
import scanInput from '@/components/scanInput'
import { employeeList } from '@/api/employee'
import { getFinanceList, groupFinanceCansle } from '@/api/statistics'
import bulkAction from '@/components/bulkAction'
// import rectbox from '@/components/rectbox'
import financialCheck from './props/financialCheck'
import dateRange from '@/components/dateRange'
export default {
  name: 'shopOrder',
  components: {
    scanInput,
    bulkAction,
    financialCheck,
    // rectbox,
    dateRange
  },
  data() {
    return {
      btnRoleList: {}, // 按钮权限
      placeholder: '请输入要查询的内容',
      searchSelect: [{
        text: '柜子区域',
        value: 'locker_area'
      }, {
        text: '柜子编号',
        value: 'locker_id'
      }, {
        text: '客户姓名',
        value: 'name'
      }, {
        text: '手机号码',
        value: 'phone'
      }, {
        text: '实付金额',
        value: 'real_pay'
      }],
      tableKey: 0,
      tableList: [],
      total: null,
      listLoading: false,
      listQuery: {
        page: 1,
        per_page: 10,
        type: 4
      },
      batchOperation: [{
        label: '批量作废',
        value: '',
        key: '6-2-5-1'
      }],
      groupIds: {
        ids: []
      },
      boxlist: [
        {
          text: '租柜',
          num: 0,
          checked: true,
          bocolor: 'rgb(26, 179, 148)',
          type: 8
        },
        {
          text: '续柜',
          num: 0,
          checked: false,
          bocolor: 'rgb(248, 172, 89)',
          type: 9
        }
      ],
      sellWayOptions: [
        { text: 'Saas', value: 0 + ',Saas', class: 'csource' },
        { text: 'App', value: 1 + ',App', class: 'csource' },
        { text: '导入', value: 2 + ',App', class: 'csource' }
      ],
      checkOptions: [
        { text: '有效', value: 1 + ',有效', class: 'ccheck_status' },
        { text: '作废', value: 2 + ',作废', class: 'ccheck_status' }
      ],
      tags: [],
      coachOption: [],
      employeeOption: [],
      orderStatusOptions: [
        { text: '未完成', value: 0 + ',未完成', class: 'corder_status' },
        // { text: '已取消', value: 10 + ',已取消', class: 'corder_status' },
        { text: '已完成', value: 20 + ',已完成', class: 'corder_status' }
      ],
      payMethodOptions: [
        { text: '现金', value: 1 + ',现金', class: 'cpayment_method' },
        { text: '支付宝', value: 2 + ',支付宝', class: 'cpayment_method' },
        { text: '微信', value: 3 + ',微信', class: 'cpayment_method' },
        { text: '银行卡', value: 4 + ',银行卡', class: 'cpayment_method' },
        { text: '储值卡', value: 5 + ',储值卡', class: 'cpayment_method' }
      ],
      paginationShow: true
    }
  },
  computed: {
  },
  created() {
    this.__init()
  },
  mounted() {},
  methods: {
    __init() {
      this.common.eachBtnRole(this.btnRoleList) // 按钮权限方法
      this.employeeList()
      this.getList()
      // this.getCardCount()
    },
    getList() {
      this.listLoading = true
      getFinanceList(this.listQuery).then(res => {
        this.tableList = res.data
        this.total = Number(res.headers.pagination.split(',')[1])
        this.listLoading = false
      })
    },
    // getCardCount() {
    //   cardStatistics().then(res => {
    //     this.boxlist[0].num = res.data.count.lockerRent
    //     this.boxlist[1].num = res.data.count.lockerRenew
    //   })
    // },
    // 销售渠道
    getSourse(val) {
      switch (val) {
        case 0: return 'Saas'
        case 1: return 'App'
        case 2: return '导入'
        default: ''
      }
    },
    // 支付方式
    getPayMethod(val) {
      switch (val) {
        case 1: return '现金'
        case 2: return '支付宝'
        case 3: return '微信'
        case 4: return '银行卡'
        case 5: return '储值卡'
      }
    },
    // 订单状态
    getOrderStatus(val) {
      switch (val) {
        case 0: return '未完成'
        // case 10: return '已取消'
        case 20: return '已完成'
      }
    },
    // 审核状态
    getCheckStatus(val) {
      if (val) {
        return '作废'
      } else {
        return '有效'
      }
    },
    getDeleteCustomer(val) {
      if (val) {
        return true
      } else {
        return false
      }
    },
    searchlist(obj) {
      delete this.listQuery.locker_area
      delete this.listQuery.locker_id
      delete this.listQuery.name
      delete this.listQuery.phone
      delete this.listQuery.real_pay
      if (obj.value === '') {
        delete this.tags[0]
      } else {
        let tagszh = {
          locker_area: '柜子区域',
          locker_id: '柜子编号',
          name: '客户姓名',
          phone: '手机号码',
          real_pay: '实付金额'
        }
        this.tags[0] = { 'name': `${tagszh[ obj.type]}:${obj.value}`, 'type': obj.type }
        this.listQuery[obj.type] = obj.value
      }
      this.listQuery.page = 1
      this.pageInit()
      this.getList()
    },
    // curOverChange(obj) {
    //   // 右上角 筛选结果条件触发
    //   this.boxlist[obj.fatherIndex].rbtn = obj.label
    //   this.curChoose(obj.fatherIndex)
    // },
    // curChoose(index) {
    //   for (let v of this.boxlist) {
    //     v.checked = false
    //   }
    //   this.boxlist[index].checked = true
    //   this.listQuery.bizType = this.boxlist[index].type
    //   this.getList()
    // },
    // curOpenbox(index) {
    //   // 点击右上角筛选条件 触发
    //   console.log(this.boxlist[index].text)
    // },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.per_page = val
      this.getList()
    },
    // 销售员工
    employeeList() {
      employeeList().then(response => {
        for (let i = 0; i < response.data.length; i++) {
          this.employeeOption.push({ text: response.data[i].name, value: response.data[i].id + ',' + response.data[i].name, class: 'csell_id' })
          if (response.data[i].post === 1) {
            this.coachOption.push({ text: response.data[i].name, value: response.data[i].id + ',' + response.data[i].name, class: 'ccoach_id' })
          }
        }
      })
    },
    // 财务核对
    handleCheck(obj) {
      this.$refs.financialCheckDoc.dialogShow(obj)
    },
    financeCheckBtn() {
      this.getList()
    },
    // 批量操作
    selectionChange(selection) {
      this.groupIds.ids = []
      for (let i = 0; i < selection.length; i++) {
        this.groupIds.ids.push(selection[i].id)
      }
      // this.groupIds.ids = selection.id
      console.log(selection)
    },
    searchGroup(value) {
      if (!this.groupIds.ids.length) {
        this.common.message('warning', '请先选择数据')
        return
      }
      this.$confirm('是否批量作废选中的数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        groupFinanceCansle(this.groupIds).then(res => {
          if (res) {
            this.common.message('success', '批量作废成功')
            this.getList()
          }
        }).catch(err => {
          console.log(err)
        })
      })
    },
    sortChange(data) {
      this.common.sortFilter(this, data)
    },
    tagclose(tag, index) {
      this.common.tagFilter(this, tag, index, this.searchSelect)
    },
    filterChange(data) {
      for (let key in data) {
        if (data[key].length !== 0) {
          if (data[key][0].split(',')) {
            this.listQuery[key] = data[key][0].split(',')[0]
          } else {
            this.listQuery[key] = data[key][0]
          }
        } else {
          this.listQuery[key] = undefined
          this.lotFilter(data, key)
        }
        this.lotFilter(data, key)
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
      if (key === 'source') {
        this.hostFilter(data, key, 1, '销售渠道：' + font)
      }
      if (key === 'coach_id') {
        this.hostFilter(data, key, 2, '上课教练：' + font)
      }
      if (key === 'sell_id') {
        this.hostFilter(data, key, 3, '销售员工：' + font)
      }
      if (key === 'payment_method') {
        this.hostFilter(data, key, 4, '支付方式：' + font)
      }
      if (key === 'order_status') {
        this.hostFilter(data, key, 5, '订单状态：' + font)
      }
      if (key === 'check_status') {
        this.hostFilter(data, key, 6, '审核状态：' + font)
      }
    },
    hostFilter(data, key, index, text) {
      if (data[key].length === 0) {
        delete this.tags[index]
      } else {
        this.$set(this.tags, index, { name: text, type: key })
      }
    },
    timeChange(param) {
      // 时间筛选
      this.common.chooseTimerFilter(param, this)
    },
    pageInit() {
      this.paginationShow = false
      this.$nextTick(() => {
        this.paginationShow = true
      })
    }
  },
  filters: {
  },
  destroyed() {}
}
</script>

<style rel="stylesheet/scss" lang="scss">
$bg:#2d3a4b;
$light_gray:#eee;
.boxser {
  overflow: hidden;
}
.red {
  color: #ff0000;
}
</style>
