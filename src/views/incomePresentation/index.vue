<template>
  <div class="box">
    <div  class="find-box4">
      <div class="myAcountBox">
        <span class="title">账户余额：</span><span class="money">￥{{gym_balance | NumFormat}}</span><span class="desc">（在牛啦APP中的销售收入）</span>
      </div>
      <div style="margin-top: 15px;overflow:hidden" class="filter-container">
        <scan-input :select="searchSelect" :defaultSelect="searchSelect[0].value" @kedownOver="searchlist" :placeholder="placeholder" ref="scanIputDoc"></scan-input>
        <el-button type="primary" class="tixianBtn" v-if="btnRoleList['6-3-1']" @click="putForward"><i class="el-icon-plus"></i>申请提现</el-button>
      </div>
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
    
    <el-table @filter-change="filterChange" stripe class="check-table" @sort-change="sortChange"
      :key='tableKey' :data="tableList" v-loading="listLoading" element-loading-text="列表正在加载中" border fit highlight-current-row style="width: 100%;">
      <el-table-column align="center" label="申请时间<i onclick=openDate(event) title='下单时间' data=[1,'created_at_sdata','created_at_edata'] class='el-icon-date'></i>" sortable="custom" prop="create_sort">
        <template slot-scope="scope">
          <span>{{scope.row.created_at}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="'提现金额'" sortable="custom" prop="amount_sort">
        <template slot-scope="scope">
          <span>{{scope.row.gym_withdraw_amount}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="'手续费'" sortable="custom" prop="fee_sort">
        <template slot-scope="scope">
          <span>{{scope.row.gym_withdraw_fee}}</span>
        </template>
      </el-table-column>

      <el-table-column label="提现账户" align="center">
        <el-table-column align="center" :label="'账户名称'" prop="phone">
          <template slot-scope="scope">
            <span>{{scope.row.bank?scope.row.bank.name:''}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" :label="'开户行-支行'" prop="name">
          <template slot-scope="scope">
            <span>{{scope.row.bank?scope.row.bank.bank:''}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" :label="'账号'" prop="name">
          <template slot-scope="scope">
            <span>{{scope.row.bank?scope.row.bank.no:''}}</span>
          </template>
        </el-table-column>
      </el-table-column>

      <el-table-column column-key="gym_withdraw_status" align="center" :label="'提现状态'" prop="gym_withdraw_status"
      :filters="orderStatusOptions" filter-placement="bottom-end" :filter-multiple="false">
        <template slot-scope="scope">
          <span>{{getWithdrawStatus(scope.row.gym_withdraw_status)}}</span>
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

    <!-- 申请提现 -->
    <put-forward-dialog 
      ref="putForwardDoc"
      @withdrawBtn="withdrawBtn">
    </put-forward-dialog>

    <!-- 时间筛选 -->
    <dateRange @timeChange="timeChange"></dateRange>
  </div>
</template>

<script>
import scanInput from '@/components/scanInput'
import { employeeList } from '@/api/employee'
import putForwardDialog from './props/putForward'
import { getWithdrawList, financeAccount } from '@/api/statistics'
import { getSession } from '@/utils/auth'
import dateRange from '@/components/dateRange'
export default {
  name: 'incomePresentation',
  components: {
    scanInput,
    putForwardDialog,
    dateRange
  },
  data() {
    return {
      btnRoleList: {}, // 按钮权限
      placeholder: '请输入要查询的内容',
      searchSelect: [{
        text: '账号',
        value: 'bank_account'
      }, {
        text: '账户名称',
        value: 'bank_account_name'
      }, {
        text: '开户行-支行',
        value: 'bank_name'
      }, {
        text: '提现金额',
        value: 'gym_withdraw_amount'
      }, {
        text: '手续费',
        value: 'gym_withdraw_fee'
      }],
      tableKey: 0,
      tableList: [],
      total: null,
      listLoading: false,
      listQuery: {
        page: 1,
        per_page: 10
      },
      tags: [],
      coachOption: [],
      employeeOption: [],
      orderStatusOptions: [
        { text: '待结算', value: 0 + ',待结算', class: 'cgym_withdraw_status' },
        { text: '银行处理中', value: 1 + ',银行处理中', class: 'cgym_withdraw_status' },
        { text: '已到账', value: 2 + ',已到账', class: 'cgym_withdraw_status' }
      ],
      gym_balance: '',
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
      this.employeeList()
      this.getTotalAccount() // 账户总额
    },
    getList() {
      this.listLoading = true
      let id = getSession('SET_GYM_ID')
      getWithdrawList(id, this.listQuery).then(res => {
        this.tableList = res.data
        this.total = Number(res.headers.pagination.split(',')[1])
        this.listLoading = false
      })
    },
    getWithdrawStatus(val) {
      switch (val) {
        case 0:
          return '待结算'
        case 1:
          return '银行处理中'
        case 2:
          return '已到账'
        default:
          break
      }
    },
    // 当前健身房收入金额汇总
    getTotalAccount() {
      let id = getSession('SET_GYM_ID')
      financeAccount(id).then(res => {
        this.gym_balance = res.data.bizAccount ? res.data.bizAccount.gym_balance : ''
      })
    },
    // 提现
    putForward() {
      this.$refs.putForwardDoc.dialogShow()
    },
    withdrawBtn() {
      this.getList()
      this.getTotalAccount() // 账户总额
    },
    searchlist(obj) {
      delete this.listQuery.bank_account
      delete this.listQuery.bank_account_name
      delete this.listQuery.bank_name
      delete this.listQuery.gym_withdraw_amount
      delete this.listQuery.gym_withdraw_fee
      if (obj.value === '') {
        delete this.tags[0]
      } else {
        let tagszh = {
          bank_account: '账号',
          bank_account_name: '账户名称',
          bank_name: '开户行-支行',
          gym_withdraw_amount: '提现金额',
          gym_withdraw_fee: '手续费'
        }
        this.tags[0] = { 'name': `${tagszh[ obj.type]}:${obj.value}`, 'type': obj.type }
        this.listQuery[obj.type] = obj.value
      }
      this.listQuery.page = 1
      this.pageInit()
      this.getList()
    },
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
          this.employeeOption.push({ text: response.data[i].name, value: response.data[i].id + ',' + response.data[i].name, class: 'csell_employee' })
          if (response.data[i].post === 1) {
            this.coachOption.push({ text: response.data[i].name, value: response.data[i].id + ',' + response.data[i].name, class: 'ccoach' })
          }
        }
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
      if (key === 'gym_withdraw_status') {
        this.hostFilter(data, key, 1, '提现状态：' + font)
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
    NumFormat: function(value) {
      if (!value) {
        return '0.00'
      } else {
        value = Number(value).toFixed(2)
      }
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
  },
  destroyed() {}
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg:#2d3a4b;
$light_gray:#eee;
.boxser {
  overflow: hidden;
}
.myAcountBox {
  .title {
    font-weight: bold;
    font-size: 18px;
  }
  .money {
    font-size: 18px;
    font-weight: bold;
    color: #ff0000;
    margin-left: 10px;
  }
  .desc {
    color: #999;
    font-size: 14px;
    margin-left: 10px;
  }
}
.tixianBtn {
  background: #333;
  border: 1px solid #333;
  margin-left: 20px;
}
</style>
