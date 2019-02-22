<template>
  <el-dialog
    title="查看报表"
    :visible.sync="dialogVisible"
    width="1400px"
    class="course-dialog" @close="addclose" :close-on-click-modal="false">
    <div style="overflow:hidden;margin-bottom: 10px;">
      <scan-input :select="searchSelect" :defaultSelect="searchSelect[0].value" @kedownOver="searchlist" :placeholder="placeholder" ref="scanIputDoc"></scan-input>
      <el-button class="black" @click="printPages">打印</el-button>
      <el-button class="black" @click="downPages" :loading="excelLoading">导出</el-button>
    </div>
    <div class="tagbox" v-if="tags.length">
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
    
    <div ref="myDiv" class="myDiv" id="otherTable">
      <!-- 会员卡 -->
      <el-table @filter-change="filterChange" stripe 
        class="check-table"
        @sort-change="sortChange"
        :key='tableKey'
        :data="tableList"
        v-loading="listLoading" 
        element-loading-text="列表正在加载中"
        border
        fit highlight-current-row
        style="width: 100%;" v-if="type===2 || type===4 || type===5 || type===7">
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
        <el-table-column align="center" label="会员卡号" prop="create_sort" width='210'>
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
        <el-table-column align="center" label="手机号码" prop="create_sort" width="120">
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
            <span>{{scope.row.total_fee}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="'备注'" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <span></span>
          </template>
        </el-table-column>
      </el-table>

      <!-- 私教课 -->
      <el-table @filter-change="filterChange" stripe 
        class="check-table"
        @sort-change="sortChange"
        :key='tableKey'
        :data="tableList"
        v-loading="listLoading" 
        element-loading-text="列表正在加载中"
        border
        fit highlight-current-row
        style="width: 100%;" v-if="type===3">
        <el-table-column align="center" :label="'序号'" prop="source">
          <template slot-scope="scope">
            <span>{{scope.$index+(listQuery.page - 1) * listQuery.per_page + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="订单编号" prop="create_sort" width="200">
          <template slot-scope="scope">
            <span>{{scope.row.trade_no}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="类别" prop="create_sort">
          <template slot-scope="scope">
            <span>售课</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="课程名称" prop="create_sort">
          <template slot-scope="scope">
            <span>{{scope.row.course_order_details[0]?scope.row.course_order_details[0].course_data.name:''}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="课程次数" prop="create_sort">
          <template slot-scope="scope">
            <span>{{scope.row.course_order_details[0]?scope.row.course_order_details[0].quantity:''}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="会员姓名" prop="create_sort">
          <template slot-scope="scope">
            <span>{{scope.row.customer_name}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="手机号码" prop="create_sort" width="120">
          <template slot-scope="scope">
            <span>{{scope.row.customer_phone}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="购买时间" prop="create_sort" width="180">
          <template slot-scope="scope">
            <span>{{scope.row.course_order_details[0]?scope.row.course_order_details[0].course_data.created_at:''}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="支付方式" prop="create_sort">
          <template slot-scope="scope">
            <span>{{getPayMethod(scope.row.payment_method)}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="课程教练" prop="create_sort">
          <template slot-scope="scope">
            <span>{{scope.row.course_order_details[0]?scope.row.course_order_details[0].coach?scope.row.course_order_details[0].coach.name:scope.row.course_order_details[0].coach_name:''}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="应付金额" prop="create_sort">
          <template slot-scope="scope">
            <span>{{scope.row.course_order_details[0]?scope.row.course_order_details[0].price:''}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="实付金额 " prop="create_sort">
          <template slot-scope="scope">
            <span>{{scope.row.total_fee}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="'备注'" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <span></span>
          </template>
        </el-table-column>
      </el-table>

      <!-- 团课 -->
      <el-table @filter-change="filterChange" stripe 
        class="check-table"
        @sort-change="sortChange"
        :key='tableKey'
        :data="tableList"
        v-loading="listLoading" 
        element-loading-text="列表正在加载中"
        border
        fit highlight-current-row
        style="width: 100%;" v-if="type===6">
        <el-table-column align="center" :label="'序号'" prop="source">
          <template slot-scope="scope">
            <span>{{scope.$index+(listQuery.page - 1) * listQuery.per_page + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="订单编号" prop="create_sort" width="200">
          <template slot-scope="scope">
            <span>{{scope.row.trade_no}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="类别" prop="create_sort">
          <template slot-scope="scope">
            <span>团课</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="课程名称" prop="create_sort">
          <template slot-scope="scope">
            <span>{{scope.row.group_course_details[0]?scope.row.group_course_details[0].name:''}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="会员姓名" prop="create_sort">
          <template slot-scope="scope">
            <span>{{scope.row.customer_name}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="手机号码" prop="create_sort" width="150">
          <template slot-scope="scope">
            <span>{{scope.row.customer_phone}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="购买时间" prop="create_sort" width="200">
          <template slot-scope="scope">
            <span>{{scope.row.group_course_details[0]?scope.row.group_course_details[0].created_at:''}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="支付方式" prop="create_sort">
          <template slot-scope="scope">
            <span>{{getPayMethod(scope.row.payment_method)}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="教练" prop="create_sort">
          <template slot-scope="scope">
            <span>{{scope.row.group_course_details[0]?scope.row.group_course_details[0].coach?scope.row.group_course_details[0].coach.name:'':''}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="应付金额" prop="create_sort">
          <template slot-scope="scope">
            <span>{{scope.row.total_fee}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="实付金额 " prop="create_sort">
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

      <!-- 其他 -->
      <el-table @filter-change="filterChange" stripe
        row-class-name='cashierTable' class="check-table"
        @sort-change="sortChange"
        :key='tableKey'
        :data="tableList"
        v-loading="listLoading" 
        element-loading-text="列表正在加载中"
        border
        fit highlight-current-row
        style="width: 100%;" v-if="type===1 || type==='8,9'">
        <el-table-column align="center" :label="'序号'" prop="source">
          <template slot-scope="scope">
            <span>{{scope.$index+(listQuery.page - 1) * listQuery.per_page + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="订单编号" prop="create_sort" width="200">
          <template slot-scope="scope">
            <span>{{scope.row.trade_no}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="类别" prop="create_sort">
          <template slot-scope="scope">
            <span>{{getType(scope.row.type)}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="商品名称" prop="create_sort">
          <template slot-scope="scope">
            <div class="mytd" v-for="(item, index) in scope.row.goods_order_details" :key="index" v-if="scope.row.type===1">{{item.name}}</div>
            <span v-if="scope.row.type!==1">租柜</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="数量" prop="create_sort">
          <template slot-scope="scope">
            <div class="mytd" v-for="(item, index) in scope.row.goods_order_details" :key="index" v-if="scope.row.type===1">{{item.quantity}}</div>
            <span v-if="scope.row.type!==1">1</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="单价" prop="create_sort">
          <template slot-scope="scope">
            <div class="mytd" v-for="(item, index) in scope.row.goods_order_details" :key="index" v-if="scope.row.type===1">{{item.price}}</div>
            <span v-if="scope.row.type===8">{{scope.row.locker_rent_details[0]?scope.row.locker_rent_details[0].total_fee:''}}</span>
            <span v-if="scope.row.type===9">{{scope.row.locker_renew_details[0]?scope.row.locker_renew_details[0].total_fee:''}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="会员姓名" prop="create_sort">
          <template slot-scope="scope">
            <span>{{scope.row.customer_name}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="手机号码" prop="create_sort" width="150">
          <template slot-scope="scope">
            <span>{{scope.row.customer_phone}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="租借/购买时间" prop="create_sort" width="180">
          <template slot-scope="scope">
            <span v-if="scope.row.type===1">{{scope.row.goods_order_details[0]?scope.row.goods_order_details[0].created_at:''}}</span>
            <span v-if="scope.row.type===8">{{scope.row.locker_rent_details[0]?scope.row.locker_rent_details[0].created_at:''}}</span>
            <span v-if="scope.row.type===9">{{scope.row.locker_renew_details[0]?scope.row.locker_renew_details[0].created_at:''}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="支付方式" prop="create_sort">
          <template slot-scope="scope">
            <span>{{getPayMethod(scope.row.payment_method)}}</span>
          </template>
        </el-table-column>
        
        <el-table-column align="center" label="实付金额 " prop="create_sort">
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
    <div class="pagination-container">
      <el-pagination 
        v-if="paginationShow"
        background 
        @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
        :page-sizes="[100,200,500,800,1000]" :page-size="listQuery.per_page" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    
  </el-dialog>
</template>

<script>
import { setSession } from '@/utils/auth'
import XLSX from 'xlsx'
import { orderLists } from '@/api/statistics'
import scanInput from '@/components/scanInput'
export default {
  name: 'singleTypeReport',
  components: {
    scanInput
  },
  props: {
  },
  data() {
    return {
      tags: [],
      dialogVisible: false,
      tableKey: 0,
      tableList: [],
      type: '',
      listLoading: false,
      excelLoading: false,
      listQuery: {
        page: 1,
        per_page: 100,
        date_egt: '',
        date_lt: '',
        sell_id: ''
      },
      placeholder: '请扫码/输入要查询的内容',
      searchSelect: [{
        text: '手机号码',
        value: 'customer_phone_like'
      }, {
        text: '会员姓名',
        value: 'customer_name_like'
      }],
      paginationShow: true,
      total: null,
      myTable: [],
      list: [
        ['序号', '订单编号', '类别', '商品名称', '数量', '单价', '会员姓名', '手机号码', '租借/购买时间', '支付方式', '实付金额', '备注']
      ]
    }
  },
  created() {
  },
  methods: {
    dialogShow(id, type, obj) {
      this.listQuery.type = type
      this.listQuery.date_egt = obj.date_egt
      this.listQuery.date_lt = obj.date_lt
      this.listQuery.sell_id = id
      this.type = type
      this.dialogVisible = true
      this.getList()
    },
    getList() {
      this.tableList = []
      this.listLoading = true
      orderLists(this.listQuery).then(res => {
        this.total = res.data.total
        this.listLoading = false
        this.tableList = res.data.data
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    printPages() {
      var printHtml = this.$refs.myDiv.outerHTML
      setSession('employeeAchivementtext', printHtml)
      window.open(this.staticurl + 'static/protocolprint/employeeAchivement.html')
    },
    downPages1(wscols, xlsxName) {
      this.excelLoading = true
      let arr1 = []
      for (let i = 0; i < this.tableList.length; i++) {
        for (let j = 0; j < this.tableList[i].goods_order_details.length; j++) {
          if (j === 0) {
            arr1 = [
              i + (this.listQuery.page - 1) * this.listQuery.per_page + 1,
              this.tableList[i].trade_no,
              this.getType(this.tableList[i].type),
              this.tableList[i].goods_order_details[j].name,
              this.tableList[i].goods_order_details[j].quantity,
              this.tableList[i].goods_order_details[j].price,
              this.tableList[i].customer_name,
              this.tableList[i].customer_phone,
              this.getTime(this.tableList[i]),
              this.getPayMethod(this.tableList[i].payment_method),
              this.tableList[i].real_total_fee,
              ''
            ]
          } else {
            arr1 = [
              '',
              '',
              '',
              this.tableList[i].goods_order_details[j].name,
              this.tableList[i].goods_order_details[j].quantity,
              this.tableList[i].goods_order_details[j].price,
              '',
              '',
              '',
              '',
              '',
              ''
            ]
          }
          this.list.push(arr1)
        }
      }
      const ws = XLSX.utils.aoa_to_sheet(this.list)
      ws['!cols'] = [{ wch: 5 }, { wch: 20 }, { wch: 10 }, { wch: 20 }, { wch: 10 }, { wch: 10 }, { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 10 }, { wch: 20 }]
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, '查看报表')
      /* generate file and send to client */
      this.excelLoading = false
      XLSX.writeFile(wb, '查看报表' + '.xlsx')
    },
    downPages() {
      this.myTable = []
      this.excelLoading = true
      require.ensure([], () => {
        const { export_json_to_excel } = require('../../../../vendor/Export2Excel')
        if (this.type === 2 || this.type === 4 || this.type === 5 || this.type === 7) {
          const tHeader = ['序号', '订单编号', '类别', '会员卡号', '卡种名称', '会员姓名', '手机号码', '办理时间', '支付方式', '实付金额', '备注']
          const filterVal = ['no', 'orderNum', 'type', 'cardNo', 'cardType', 'customerName', 'phone', 'time', 'payMethod', 'real_total_fee', 'remark']
          for (let i = 0; i < this.tableList.length; i++) {
            this.myTable.push({
              no: i + (this.listQuery.page - 1) * this.listQuery.per_page + 1,
              orderNum: this.tableList[i].trade_no,
              type: this.getType(this.tableList[i].type),
              cardNo: this.getCardNo(this.tableList[i]),
              cardType: this.getCardName(this.tableList[i]),
              customerName: this.tableList[i].customer_name,
              phone: this.tableList[i].customer_phone,
              time: this.getTime(this.tableList[i]),
              payMethod: this.getPayMethod(this.tableList[i].payment_method),
              real_total_fee: this.tableList[i].total_fee,
              remark: ''
            })
          }
          const list = this.myTable
          const data = this.formatJson(filterVal, list)
          export_json_to_excel(tHeader, data, '查看报表')
          this.excelLoading = false
        }
        if (this.type === 3) {
          const tHeader = ['序号', '订单编号', '类别', '课程名称', '课程次数', '会员姓名', '手机号码', '购买时间', '支付方式', '课程教练', '应付金额', '实付金额', '备注']
          const filterVal = ['no', 'orderNum', 'type', 'courseName', 'courseNum', 'customerName', 'phone', 'time', 'payMethod', 'coach', 'total_fee', 'real_total_fee', 'remark']
          for (let i = 0; i < this.tableList.length; i++) {
            this.myTable.push({
              no: i + (this.listQuery.page - 1) * this.listQuery.per_page + 1,
              orderNum: this.tableList[i].trade_no,
              type: this.getType(this.tableList[i].type),
              courseName: this.tableList[i].course_order_details[0] ? this.tableList[i].course_order_details[0].course_data.name : '',
              courseNum: this.tableList[i].course_order_details[0] ? this.tableList[i].course_order_details[0].quantity : '',
              customerName: this.tableList[i].customer_name,
              phone: this.tableList[i].customer_phone,
              time: this.tableList[i].course_order_details[0] ? this.tableList[i].course_order_details[0].course_data.created_at : '',
              payMethod: this.getPayMethod(this.tableList[i].payment_method),
              coach: this.tableList[i].course_order_details[0] ? this.tableList[i].course_order_details[0].coach ? this.tableList[i].course_order_details[0].coach.name : this.tableList[i].course_order_details[0].coach_name : '',
              total_fee: this.tableList[i].course_order_details[0] ? this.tableList[i].course_order_details[0].price : '',
              real_total_fee: this.tableList[i].total_fee,
              remark: ''
            })
          }
          const list = this.myTable
          const data = this.formatJson(filterVal, list)
          export_json_to_excel(tHeader, data, '查看报表')
          this.excelLoading = false
        }
        if (this.type === 6) {
          const tHeader = ['序号', '订单编号', '类别', '课程名称', '会员姓名', '手机号码', '购买时间', '支付方式', '教练', '应付金额', '实付金额', '备注']
          const filterVal = ['no', 'orderNum', 'type', 'courseName', 'customerName', 'phone', 'time', 'payMethod', 'coach', 'total_fee', 'real_total_fee', 'remark']
          for (let i = 0; i < this.tableList.length; i++) {
            this.myTable.push({
              no: i + (this.listQuery.page - 1) * this.listQuery.per_page + 1,
              orderNum: this.tableList[i].trade_no,
              type: this.getType(this.tableList[i].type),
              courseName: this.tableList[i].group_course_details[0] ? this.tableList[i].group_course_details[0].name : '',
              customerName: this.tableList[i].customer_name,
              phone: this.tableList[i].customer_phone,
              time: this.tableList[i].group_course_details[0] ? this.tableList[i].group_course_details[0].created_at : '',
              payMethod: this.getPayMethod(this.tableList[i].payment_method),
              coach: this.tableList[i].group_course_details[0] ? this.tableList[i].group_course_details[0].coach ? this.tableList[i].group_course_details[0].coach.name : '' : '',
              total_fee: this.tableList[i].course_order_details[0] ? this.tableList[i].course_order_details[0].price : '',
              real_total_fee: this.tableList[i].total_fee,
              remark: ''
            })
          }
          const list = this.myTable
          const data = this.formatJson(filterVal, list)
          export_json_to_excel(tHeader, data, '查看报表')
          this.excelLoading = false
        }
        if (this.type === 1) {
          this.downPages1()
        }
        if (this.type === '8,9') {
          const tHeader = ['序号', '订单编号', '类别', '商品名称', '数量', '单价', '会员姓名', '手机号码', '租借/购买时间', '支付方式', '实付金额', '备注']
          const filterVal = ['no', 'orderNum', 'type', 'goodsName', 'number', 'price', 'customerName', 'phone', 'time', 'payMethod', 'real_total_fee', 'remark']
          for (let i = 0; i < this.tableList.length; i++) {
            this.myTable.push({
              no: i + (this.listQuery.page - 1) * this.listQuery.per_page + 1,
              orderNum: this.tableList[i].trade_no,
              type: this.getType(this.tableList[i].type),
              goodsName: '租柜',
              number: 1,
              price: this.getPrice(this.tableList[i]),
              customerName: this.tableList[i].customer_name,
              phone: this.tableList[i].customer_phone,
              time: this.getTime(this.tableList[i]),
              payMethod: this.getPayMethod(this.tableList[i].payment_method),
              real_total_fee: this.tableList[i].real_total_fee,
              remark: ''
            })
          }
          const list = this.myTable
          const data = this.formatJson(filterVal, list)
          export_json_to_excel(tHeader, data, '查看报表')
          this.excelLoading = false
        }
      })
    },
    getPrice(obj) {
      let price = ''
      if (obj.type === 8) {
        price = obj.locker_rent_details[0] ? obj.locker_rent_details[0].total_fee : ''
        return price
      }
      if (obj.type === 9) {
        price = obj.locker_renew_details[0] ? obj.locker_renew_details[0].total_fee : ''
        return price
      }
    },
    getTime(obj) {
      let time = ''
      if (obj.type === 2) {
        time = obj.vip_order_details[0] ? obj.vip_order_details[0].created_at : ''
        return time
      }
      if (obj.type === 4) {
        time = obj.vip_transfer_details[0] ? obj.vip_transfer_details[0].created_at : ''
        return time
      }
      if (obj.type === 5) {
        time = obj.vip_stop_details[0] ? obj.vip_stop_details[0].created_at : ''
        return time
      }
      if (obj.type === 7) {
        time = obj.vip_renew_details[0] ? obj.vip_renew_details[0].created_at : ''
        return time
      }
      if (obj.type === 1) {
        time = obj.goods_order_details[0] ? obj.goods_order_details[0].created_at : ''
        return time
      }
      if (obj.type === 8) {
        time = obj.locker_rent_details[0] ? obj.locker_rent_details[0].created_at : ''
        return time
      }
      if (obj.type === 9) {
        time = obj.locker_renew_details[0] ? obj.locker_renew_details[0].created_at : ''
        return time
      }
    },
    getCardNo(obj) {
      let cardNo = ''
      if (obj.type === 2) {
        cardNo = obj.vip_order_details[0] ? obj.vip_order_details[0].card_no : ''
        return cardNo
      }
      if (obj.type === 4) {
        cardNo = obj.vip_transfer_details[0].customer_vip ? obj.vip_transfer_details[0].customer_vip.card_no : ''
        return cardNo
      }
      if (obj.type === 5) {
        cardNo = obj.row.vip_stop_details[0].customer_vip ? obj.vip_stop_details[0].customer_vip.card_no : ''
        return cardNo
      }
      if (obj.type === 7) {
        cardNo = obj.vip_renew_details[0].customer_vip ? obj.vip_renew_details[0].customer_vip.card_no : ''
        return cardNo
      }
    },
    getCardName(obj) {
      let cardName = ''
      if (obj.type === 2) {
        cardName = obj.vip_order_details[0] ? obj.vip_order_details[0].card_name : ''
        return cardName
      }
      if (obj.type === 4) {
        cardName = obj.vip_transfer_details[0].customer_vip ? obj.vip_transfer_details[0].customer_vip.card_name : ''
        return cardName
      }
      if (obj.type === 5) {
        cardName = obj.row.vip_stop_details[0].customer_vip ? obj.vip_stop_details[0].customer_vip.card_name : ''
        return cardName
      }
      if (obj.type === 7) {
        cardName = obj.vip_renew_details[0].customer_vip ? obj.vip_renew_details[0].customer_vip.card_name : ''
        return cardName
      }
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
        case 1: {
          return '购物'
        }
        case 8: {
          return '租柜'
        }
        case 9: {
          return '租柜'
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
    addclose() {
    },
    searchlist(obj) {
      delete this.listQuery.customer_name_like
      delete this.listQuery.customer_phone_like
      if (obj.value === '') {
        delete this.tags[0]
      } else {
        let tagszh = {
          customer_phone_like: '手机号码',
          customer_name_like: '客户姓名',
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
    },
    hostFilter(data, key, index, text) {
      if (data[key].length === 0) {
        delete this.tags[index]
      } else {
        this.$set(this.tags, index, { name: text, type: key })
      }
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
.mytd {
  border-bottom: 1px solid #dfdfdf;
  line-height: 30px;
}
.black {
  background:#000;
  border: 1px solid #000;
  color: #fff;
  margin-left: 10px;
}
.myDiv {
  max-height: 500px;
  overflow-y: auto;
}
</style>

