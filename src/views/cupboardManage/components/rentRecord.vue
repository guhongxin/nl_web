<template>
  <div class="box1">
    <div class="find-box4">
      <div style="overflow:hidden" class="filter-container">
        <scan-input :select="searchSelect" :defaultSelect="searchSelect[0].value" @kedownOver="searchlist" ref="scanIputDoc"></scan-input>
        <el-button class="derive" v-if="btnRoleList['1-2-3-1']" :loading="daoloading" @click="doExport"><i class="el-icon-printer"></i> 导出</el-button>
        <!-- <el-button class="derive" @click="doPrint"><i class="el-icon-printer"></i> 打印</el-button> -->
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
    <el-table @filter-change="filterChange" @sort-change="sortChange" stripe :key='tableKey' :data="tableList" v-loading="listLoading" element-loading-text="列表正在加载中" border fit highlight-current-row id="subOutputRank-print"
      style="width: 100%;" class="check-table" @row-click="handleRowClick">

      <el-table-column align="center" type="selection" width="55px"></el-table-column>
      
      <el-table-column align="center" label="创建时间<i onclick=openDate(event) title='创建时间' data=[1,'start_date','end_date'] class=el-icon-date></i>" width="220" prop="created_at_sort" sortable='custom'>
        <template slot-scope="scope">
          <span v-text="scope.row.created_at" :class="{ blue: scope.row.last_renew_id }"></span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="'会员姓名'" width="120" prop="scope.row.member_name">
        <template slot-scope="scope">
          <span v-text="scope.row.customer?scope.row.customer.name:''" :class="{ blue: scope.row.last_renew_id }"></span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="'手机号码'" width="220" prop="scope.row.member_phone">
        <template slot-scope="scope">
          <span v-text="scope.row.customer?scope.row.customer.phone:''" :class="{ blue: scope.row.last_renew_id }"></span>
        </template>
      </el-table-column>
      
      <el-table-column column-key="locker_id" align="center" :label="'柜子区域'" width="150" prop="scope.row.locker.area"
      :filters="areaOptions" filter-placement="bottom-end" :filter-multiple="false">
      <!-- <el-table-column align="center" :label="'柜子区域'" width="150" prop="locker_area"> -->
        <template slot-scope="scope">
          <span v-text="scope.row.locker?scope.row.locker.area:''" :class="{ blue: scope.row.last_renew_id }"></span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="'柜子编号'" width="150" prop="scope.row.locker_grid.no">
        <template slot-scope="scope">
          <span v-text="scope.row.locker_grid?scope.row.locker_grid.no:''" :class="{ blue: scope.row.last_renew_id }"></span>
        </template>
      </el-table-column>

      <el-table-column align="center" width="220" prop="started_at_sort" sortable='custom' 
        label="租用开始时间<i onclick='openDate(event)' data=[3,'rent_sdate','rent_edate'] title='租用开始时间' class='el-icon-date'></i>">
        <template slot-scope="scope">
          <span v-text="scope.row.started_at" :class="{ blue: scope.row.last_renew_id }"></span>
        </template>
      </el-table-column>

      <el-table-column align="center" 
        label="租用结束时间<i onclick='openDate(event)' data=[4,'rent_end_sdate','rent_end_edate'] title='租用结束时间' class='el-icon-date'></i>"
        width="220" prop="expired_at_sort" sortable='custom'>
        <template slot-scope="scope">
          <span v-text="scope.row.expired_at" :class="{ blue: scope.row.last_renew_id }"></span>
        </template>
      </el-table-column>

      <el-table-column column-key="opt_id" align="center" :label="'操作人'" width="150" prop="opt_id"
      :filters="operator_nameOptions" filter-placement="bottom-end" :filter-multiple="false">
        <template slot-scope="scope">
          <span v-text="scope.row.order ? scope.row.order.employee_name : '-'" :class="{ blue: scope.row.last_renew_id }"></span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="'实收金额'" width="150" prop="total_fee_sort" sortable='custom'>
        <template slot-scope="scope">
          <span v-text="scope.row.total_fee" :class="{ blue: scope.row.last_renew_id }"></span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="支付方式" width="150">
        <template slot-scope="scope">
          <span v-text="scope.row.order?getPayment(scope.row.order.payment_method):''" :class="{ blue: scope.row.last_renew_id }"></span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="销售员工" width="150">
        <template slot-scope="scope">
          <span v-text="scope.row.order?scope.row.order.sell_name:''" :class="{ blue: scope.row.last_renew_id }"></span>
        </template>
      </el-table-column>
      <el-table-column align="center" 
        label="实际归还时间<i onclick='openDate(event)' data=[6,'return_sdate','return_edate'] title='实际归还时间' class='el-icon-date'></i>"
        width="200" prop="repaid_at_sort" sortable='custom'>
        <template slot-scope="scope">
          <span v-text="scope.row.repaid_at === null ? '-' : scope.row.repaid_at" :class="{ blue: scope.row.last_renew_id }"></span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="'押金'" width="150" prop="cash_pledge_sort" sortable='custom'>
        <template slot-scope="scope">
          <span v-text="scope.row.cash_pledge" :class="{ blue: scope.row.last_renew_id }"></span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="'租借备注'" width="220" prop="scope.row.rent_remark">
        <template slot-scope="scope">
          <span v-text="!scope.row.rent_remark ? '-' : scope.row.rent_remark" :class="{ blue: scope.row.last_renew_id }"></span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="'归还备注'" min-width="220" prop="scope.row.repay_remark">
        <template slot-scope="scope">
          <span v-text="!scope.row.repay_remark ? '-' : scope.row.repay_remark" :class="{ blue: scope.row.last_renew_id }"></span>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination
        v-if="paginationShow"
        background
        @prev-click="handlePrev"
        @size-change="handleSizeChange" 
        @current-change="handleCurrentChange" 
        :current-page.sync="listQuery.page"
        :page-sizes="[10,20,30,50]" :page-size="listQuery.per_page" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <rent-detail ref="rentDetailDoc"></rent-detail>
    <!-- 时间筛选 -->
    <dateRange @timeChange="timeChange"></dateRange>
  </div>
</template>

<script>
import { listRentRecord, getAllCabinet } from '@/api/cabinet'
import { employeeList } from '@/api/employee'
import scanInput from '@/components/scanInput'
import rentDetail from './props/rentDetail'
import dateRange from '@/components/dateRange'
import { payment_methodDictionary } from '@/utils/comm'
export default {
  name: 'rentRecord',
  components: {
    scanInput,
    rentDetail,
    dateRange
  },
  data() {
    return {
      btnRoleList: {}, // 按钮权限
      tags: [],
      select: '',
      searchval: '',
      tableKey: 0,
      tableList: null,
      total: null,
      listLoading: true,
      daoloading: false,
      areaOptions: [],
      operator_nameOptions: [],
      listQuery: {
        page: 1,
        per_page: 10
      },
      employeeQuery: {
        page: 1,
        per_page: 1000
      },
      searchSelect: [{
        text: '手机号码',
        value: 'customer_phone'
      }, {
        text: '会员姓名',
        value: 'customer_name_like'
      }, {
        text: '租借备注',
        value: 'rent_remark'
      }, {
        text: '归还备注',
        value: 'repay_remark'
      }],
      paginationShow: true
    }
  },
  computed: {
  },
  created() {
    this.__init()
  },
  mounted() {
  },
  methods: {
    __init() {
      this.common.eachBtnRole(this.btnRoleList) // 按钮权限方法
      this.getList()
      this.employeeNameList()
      this.areaList()
    },
    areaList() {
      getAllCabinet().then((response) => {
        for (let i = 0; i < response.data.length; i++) {
          this.areaOptions.push({ text: response.data[i].area, value: response.data[i].id + ',' + response.data[i].area, class: 'clocker_id' })
        }
      }).catch(() => {
        this.loading = false
      })
    },
    employeeNameList() {
      employeeList(this.employeeQuery).then(response => {
        for (let i = 0; i < response.data.length; i++) {
          this.operator_nameOptions.push({ text: response.data[i].name, value: response.data[i].id + ',' + response.data[i].name, class: 'copt_id' })
        }
        this.operator_nameOptions.unshift({ text: '超级管理员', value: '3,超级管理员', class: 'copt_id' })
      })
    },
    tagclose(tag, index) {
      this.common.tagFilter(this, tag, index, this.searchSelect)
    },
    curChoose(index) {
      for (let v of this.boxlist) {
        v.checked = false
      }
      this.boxlist[index].checked = true
    },
    curOpenbox(index) {
      // console.log(this.boxlist[index].text)
    },
    handleTimeFilter(data) {
      // console.log(value)
    },
    sortChange(data) {
      this.common.sortFilter(this, data)
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
      if (key === 'locker_id') {
        if (!data[key].length) {
          this.hostFilter(data, key, 2, '')
          return
        }
        this.hostFilter(data, key, 2, '区域名称：' + data[key][0].split(',')[1])
      }
      if (key === 'opt_id') {
        if (!data[key].length) {
          this.hostFilter(data, key, 5, '')
          return
        }
        this.hostFilter(data, key, 5, '操作人：' + data[key][0].split(',')[1])
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
      // this.areaOptions = []
      listRentRecord(this.listQuery).then(response => {
        if (response.data.length) {
          this.total = Number(response.headers.pagination.split(',')[1])
        }
        this.tableList = response.data
        this.listLoading = false
      })
    },
    searchlist(obj) {
      delete this.listQuery.customer_phone
      delete this.listQuery.customer_name_like
      delete this.listQuery.rent_remark
      delete this.listQuery.repay_remark
      if (obj.value) {
        if (obj.type === 'customer_phone') {
          this.listQuery.customer_phone = obj.value
          this.tags[0] = { 'name': `手机号码:${this.listQuery.customer_phone}`, 'type': 'customer_phone' }
        } else if (obj.type === 'customer_name_like') {
          this.listQuery.customer_name_like = obj.value
          this.tags[0] = { 'name': `会员姓名:${this.listQuery.customer_name_like}`, 'type': 'customer_name_like' }
        } else if (obj.type === 'rent_remark') {
          this.listQuery.rent_remark = obj.value
          this.tags[0] = { 'name': `租借备注:${this.listQuery.rent_remark}`, 'type': 'rent_remark' }
        } else if (obj.type === 'repay_remark') {
          this.listQuery.repay_remark = obj.value
          this.tags[0] = { 'name': `归还备注:${this.listQuery.repay_remark}`, 'type': 'repay_remark' }
        }
      } else {
        delete this.tags[0]
      }
      this.listQuery.page = 1
      this.pageInit()
      this.getList()
    },
    // 导出
    doExport() {
      this.daoloading = true
      setTimeout(() => {
        this.daoloading = false
      }, 5000)
      this.common.message('warning', '导出不可频繁使用！请注意！')
      this.common.exportExcel('/v1/gym/lockers/export_rent', { fileName: '租柜租还记录.xlsx' }, 'post')
    },
    // 打印
    doPrint() {
      let subOutputRankPrint = document.getElementById('subOutputRank-print')
      // console.log(subOutputRankPrint.innerHTML)
      let newContent = subOutputRankPrint.innerHTML
      let oldContent = document.body.innerHTML
      document.body.innerHTML = newContent
      let wind = window.open('', 'newwindow', 'height=100%, width=1600px, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no')
      wind.print()
      wind.document.body.innerHTML = oldContent
      return false
    },
    // 查看续租详情
    handleRowClick(row, event, column) {
      if (row.last_renew_id) {
        this.$refs.rentDetailDoc.getRenewDate(row.id)
      }
    },
    handlePrev(val) {
      console.log(111111)
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.per_page = val
      this.getList()
    },
    handleEdit(index, row) {
      // console.log(index, row)
    },
    handleDelete(index, row) {
      // console.log(index, row)
    },
    pageInit() {
      this.paginationShow = false
      this.$nextTick(() => {
        this.paginationShow = true
      })
    },
    timeChange(param) {
      // 时间筛选
      this.common.chooseTimerFilter(param, this)
    },
    getPayment(param) {
      return payment_methodDictionary(param)
    }
  },
  filters: {
  },
  destroyed() {
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.blue {
  color: #1878E1;
  cursor: pointer;
 }
</style>