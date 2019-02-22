<template>
  <div>
    <div class="boxser">
      <rectbox :data="boxlist" v-on:choose="curChoose" v-on:openbox="curOpenbox" @overChange="curOverChange"></rectbox>
    </div>
    <div style="overflow:hidden" class="find-box4">
      <scan-input :select="searchSelect" :defaultSelect="searchSelect[0].value" @kedownOver="searchlist" :placeholder="placeholder" ref="scanIputDoc"></scan-input>
      <bulk-action :select="batchOperation" @changeBulk="searchGroup"></bulk-action>
    </div>
    <div class="tagbox" v-if="tags.length">
      <!-- <div class="tablesmall" v-if="common.getClass('span', 'mar10').length">共查找到<span v-text="total"></span>条</div> -->
      <div class="tablesmall" v-if="common.getClass('span', 'mar10').length">订单总数：<span v-text="total"></span>单</div>
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
      <el-table-column align="center" :label="'销售渠道'" column-key="source" prop="source" width="100"
      :filters="sellWayOptions"
      filter-placement="bottom-end" :filter-multiple="false">
        <template slot-scope="scope">
          <span>{{getSourse(scope.row.source)}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="下单时间<i onclick=openDate(event) title='下单时间' data=[1,'created_at_sdata','created_at_edata'] class='el-icon-date'></i>" sortable='custom' prop="create_sort" width="200">
        <template slot-scope="scope">
          <span>{{scope.row.created_at}}</span>
        </template>
      </el-table-column>
      <el-table-column column-key="sex" align="center" :label="'会员卡号'" prop="cardno" width="220">
        <template slot-scope="scope">
          <span>
            <span v-if="isMsCard(scope.row)" class="through">通</span>
            <span v-if="listQuery.bizType === 2">{{scope.row.vip_order_details?scope.row.vip_order_details[0]?scope.row.vip_order_details[0].card_no:'-':'-'}}</span>
            <span v-if="listQuery.bizType === 4">{{scope.row.vip_transfer_details?scope.row.vip_transfer_details[0]?scope.row.vip_transfer_details[0].customer_vip?scope.row.vip_transfer_details[0].customer_vip.card_no:'-':'-':'-'}}</span>
            <span v-if="listQuery.bizType === 7">{{scope.row.vip_renew_details?scope.row.vip_renew_details[0]?scope.row.vip_renew_details[0].customer_vip?scope.row.vip_renew_details[0].customer_vip.card_no:'-':'-':'-'}}</span>
            <span v-if="listQuery.bizType === 5">{{scope.row.vip_stop_details?scope.row.vip_stop_details[0]?scope.row.vip_stop_details[0].customer_vip?scope.row.vip_stop_details[0].customer_vip.card_no:'-':'-':'-'}}</span>
          </span>      
        </template>
      </el-table-column>
      <el-table-column align="center" :label="'卡种名称'" prop="card_type" column-key="card_type" width="120" 
      :filters="cardTypeOption" filter-placement="bottom-end" :filter-multiple="false">
        <template slot-scope="scope">
          <span v-if="listQuery.bizType === 2">{{scope.row.vip_order_details?scope.row.vip_order_details[0]?scope.row.vip_order_details[0].card_name:'-':'-'}}</span>
          <span v-if="listQuery.bizType === 4">{{scope.row.vip_transfer_details?scope.row.vip_transfer_details[0]?scope.row.vip_transfer_details[0].customer_vip?scope.row.vip_transfer_details[0].customer_vip.card_name:'-':'-':'-'}}</span>
          <span v-if="listQuery.bizType === 7">{{scope.row.vip_renew_details?scope.row.vip_renew_details[0]?scope.row.vip_renew_details[0].customer_vip?scope.row.vip_renew_details[0].customer_vip.card_name:'-':'-':'-'}}</span>
          <span v-if="listQuery.bizType === 5">{{scope.row.vip_stop_details?scope.row.vip_stop_details[0]?scope.row.vip_stop_details[0].customer_vip?scope.row.vip_stop_details[0].customer_vip.card_name:'-':'-':'-'}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="'客户姓名'" prop="customerName" width="120">
        <template slot-scope="scope">
          <div v-if="listQuery.bizType !== 4">
            <span v-if="!getDeleteCustomer(scope.row.customer?scope.row.customer.deleted_at:'')">{{scope.row.customer?scope.row.customer.name:''}}</span>
            <el-tooltip class="item" effect="dark" v-if="getDeleteCustomer(scope.row.customer?scope.row.customer.deleted_at:'')"  :content="`客户已删除，删除时间: ${scope.row.customer.deleted_at}`" placement="bottom">
              <el-button type="info" size="mini">{{scope.row.customer?scope.row.customer.name:'-'}}</el-button>
            </el-tooltip>
          </div>
          <div v-if="listQuery.bizType === 4">
            <span v-if="!getDeleteCustomer(scope.row.vip_transfer_details?scope.row.vip_transfer_details[0]?scope.row.vip_transfer_details[0].new_customer?scope.row.vip_transfer_details[0].new_customer.deleted_at:'-':'-':'-')">{{scope.row.vip_transfer_details?scope.row.vip_transfer_details[0]?scope.row.vip_transfer_details[0].new_customer?scope.row.vip_transfer_details[0].new_customer.name:'-':'-':'-'}}</span>
            <el-tooltip class="item" effect="dark" v-if="getDeleteCustomer(scope.row.vip_transfer_details?scope.row.vip_transfer_details[0]?scope.row.vip_transfer_details[0].new_customer?scope.row.vip_transfer_details[0].new_customer.deleted_at:'-':'-':'-')" :content="`客户已删除，删除时间: ${scope.row.vip_transfer_details?scope.row.vip_transfer_details[0]?scope.row.vip_transfer_details[0].new_customer?scope.row.vip_transfer_details[0].new_customer.deleted_at:'-':'-':'-'}`" placement="bottom">
              <el-button type="info" size="mini">{{scope.row.vip_transfer_details?scope.row.vip_transfer_details[0]?scope.row.vip_transfer_details[0].new_customer?scope.row.vip_transfer_details[0].new_customer.name:'-':'-':'-'}}</el-button>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="'手机号码'" prop="phone_sort" width="120">
        <template slot-scope="scope">
          <span v-if="listQuery.bizType !== 4">{{scope.row.customer_phone}}</span>
          <span v-if="listQuery.bizType === 4">{{scope.row.vip_transfer_details?scope.row.vip_transfer_details[0]?scope.row.vip_transfer_details[0].new_customer?scope.row.vip_transfer_details[0].new_customer.phone:'-':'-':'-'}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="'应付金额'" sortable='custom' prop="total_pay_sort" width="120">
        <template slot-scope="scope">
          <span>{{scope.row.total_fee}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="'实付金额'" sortable='custom' prop="real_pay_sort" width="120">
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
          <el-button type="primary" size="mini" @click="handleCheck(scope.row)" v-if="btnRoleList['6-2-1-2']" v-show="scope.row.source!==1">财务核对</el-button>
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
import { listVipCard } from '@/api/vipcard'
import { getFinanceList, groupFinanceCansle, cardStatistics } from '@/api/statistics'
import bulkAction from '@/components/bulkAction'
import rectbox from '@/components/rectbox'
import financialCheck from './props/financialCheck'
import dateRange from '@/components/dateRange'
export default {
  name: 'openCardOrder',
  components: {
    scanInput,
    bulkAction,
    rectbox,
    financialCheck,
    dateRange
  },
  data() {
    return {
      btnRoleList: {}, // 按钮权限
      placeholder: '请输入要查询的内容',
      searchSelect: [{
        text: '会员卡号',
        value: 'card_no'
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
      batchOperation: [{
        label: '批量作废',
        value: '',
        key: '6-2-1-1'
      }],
      tableKey: 0,
      tableList: [],
      total: null,
      listLoading: false,
      listQuery: {
        page: 1,
        per_page: 10,
        type: 0, // 开卡订单
        bizType: 2
      },
      groupIds: {
        ids: []
      },
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
      cardTypeOption: [],
      employeeOption: [],
      boxlist: [
        {
          text: '售卡',
          num: 0,
          checked: true,
          bocolor: 'rgb(26, 179, 148)',
          type: 2
        },
        {
          text: '转卡',
          num: 0,
          checked: false,
          bocolor: 'rgb(248, 172, 89)',
          type: 4
        },
        {
          text: '续卡',
          num: 0,
          checked: false,
          bocolor: 'rgb(241, 76, 48)',
          type: 7
        },
        {
          text: '停卡',
          num: 0,
          checked: false,
          bocolor: 'rgb(177, 197, 211)',
          type: 5
        }
      ],
      orderStatusOptions: [
        { text: '未支付', value: 0 + ',未支付', class: 'corder_status' },
        { text: '已取消', value: 10 + ',已取消', class: 'corder_status' },
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
      this.getList()
      this.getCardCount()
      this.cardTypeList()
      this.employeeList()
    },
    getList() {
      this.listLoading = true
      getFinanceList(this.listQuery).then(res => {
        this.tableList = res.data
        this.total = Number(res.headers.pagination.split(',')[1])
        this.listLoading = false
      })
    },
    getCardCount() {
      cardStatistics().then(res => {
        this.boxlist[0].num = res.data.count.vipCard
        this.boxlist[1].num = res.data.count.vipCardTransfer
        this.boxlist[2].num = res.data.count.vipCardRenew
        this.boxlist[3].num = res.data.count.vipCardStop
      })
    },
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
        case 0: return '未支付'
        case 10: return '已取消'
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
      delete this.listQuery.card_no
      delete this.listQuery.name
      delete this.listQuery.phone
      delete this.listQuery.real_pay
      if (obj.value === '') {
        delete this.tags[0]
      } else {
        let tagszh = {
          card_no: '会员卡号',
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
    curOverChange(obj) {
      // 右上角 筛选结果条件触发
      this.boxlist[obj.fatherIndex].rbtn = obj.label
      this.curChoose(obj.fatherIndex)
    },
    curChoose(index) {
      for (let v of this.boxlist) {
        v.checked = false
      }
      this.boxlist[index].checked = true
      this.listQuery.bizType = this.boxlist[index].type
      this.getList()
    },
    curOpenbox(index) {
      // 点击右上角筛选条件 触发
      console.log(this.boxlist[index].text)
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.per_page = val
      this.getList()
    },
    // 卡种名称
    cardTypeList() {
      listVipCard().then(response => {
        for (let i = 0; i < response.data.length; i++) {
          this.cardTypeOption.push({ text: response.data[i].name, value: response.data[i].id + ',' + response.data[i].name, class: 'ccard_type' })
        }
      })
    },
    // 销售员工
    employeeList() {
      employeeList().then(response => {
        for (let i = 0; i < response.data.length; i++) {
          this.employeeOption.push({ text: response.data[i].name, value: response.data[i].id + ',' + response.data[i].name, class: 'csell_id' })
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
            console.log(data[key][0])
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
      if (key === 'card_type') {
        this.hostFilter(data, key, 2, '卡种名称：' + font)
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
    },
    isMsCard(param) {
      // 获取是否是通卡
      if (param.vip_order_details && param.vip_order_details[0] && param.vip_order_details[0].vip_data && param.vip_order_details[0].vip_data.master_id) {
        return true
      } else {
        return false
      }
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
.through{
  width: 20px;
  height: 20px;
  display: inline-block;
  background: #1AB394;
  border-radius: 3px;
  color: #ffffff;
  line-height: 20px;
  margin-right: 3px;
  text-align: center;
}
</style>
