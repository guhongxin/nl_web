<template>
    <el-dialog
      title="错误提示"
      :visible.sync="dialogVisible"
      :width="widthSize"
      class="InputExcelErrDetailDialog customizeDetailsDialog"
      :beforeClose='dialogClosed'
    >
      <div class="content">
        <el-table
          :data="tableData"
          border
          style="width: 100%"
          stripe
          v-loading="listLoading" 
          element-loading-text="列表正在加载中" fit highlight-current-row>
          <el-table-column
            prop="excel_col"
            label="行号"
            width="300" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.excel_col}}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column
            prop="error"
            label="错误原因"
            width="300" align="center">
            <template slot-scope="scope">
              <span style="color: red">{{scope.row.error}}</span>
            </template>
          </el-table-column> -->
          <el-table-column
            prop="card_no"
            label="会员卡号"
            width="240px"
            align="center">
            <template slot-scope="scope">
              <span>{{scope.row.card_no}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            label="姓名"
            align="center"
            width="180">
            <template slot-scope="scope">
              <span>{{scope.row.name}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="phone"
            label="手机号码"
            width="150px" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.phone}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="type"
            label="会员卡类型" width="120px"  align="center">
            <template slot-scope="scope">
              <span>{{scope.row.type}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="card_name"
            label="会员卡名称"
            width="120px"  align="center">
            <template slot-scope="scope">
              <span>{{scope.row.card_name}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="total_times"
            label="次卡剩余次数"
            width="120px"  align="center">
            <template slot-scope="scope">
              <span>{{scope.row.total_times}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="created_at"
            label="开卡日期"
            width="200" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.created_at}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="start_date"
            label="生效期间"
            width="200" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.start_date}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="end_date"
            label="失效期间"
            width="200" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.end_date}}</span>
            </template>
          </el-table-column>
           <el-table-column
            prop="real_pay"
            label="实收金额"
            width="150" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.real_pay}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="payment_method"
            label="支付方式"
            width="150" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.payment_method}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="sex"
            label="性别"
            width="100" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.sex}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="birthday"
            label="生日"
            width="150" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.birthday}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="id_card_no"
            label="身份证号"
            width="180" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.id_card_no}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="remark"
            label="备注"
            width="200" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.remark}}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination-container">
        <el-button type="primary" @click="handleDownload">下载Excel</el-button>
        <el-pagination background  @current-change="handleCurrentChange" 
          :current-page.sync="page"
          :page-size="per_page"
          layout="total, prev, pager, next" 
          :total="total"
          style="display: inline-block;float:right">
        </el-pagination>
      </div>
    </el-dialog>
</template>
<script>
// 导入数据错误提醒弹窗
import { cardInpormtErrInfor } from '@/api/vipcardGl'
import { payment_methodDictionary } from '@/utils/comm'
export default {
  name: 'InputExcelErrDetailDialog',
  props: {
    dialogVisible: {
      type: Boolean,
      default: function() {
        return false
      }
    },
    widthSize: {
      type: String,
      default() {
        return '200px'
      }
    },
    sid: {
      type: String
    }
  },
  data() {
    return {
      listLoading: false,
      tableData: [],
      per_page: 10,
      page: 1,
      total: 0
    }
  },
  created() {
    this.getVipLog()
  },
  methods: {
    dialogClosed() {
      this.$emit('dialogClosed')
    },
    dialogBtnOk() {
      this.$emit('dialogBtnOk')
    },
    getVipLog() {
      let obj = {
        sid: this.sid,
        per_page: this.per_page,
        page: this.page
      }
      this.listLoading = true
      cardInpormtErrInfor(obj).then(res => {
        this.tableData = []
        let data = res.data
        this.total = Number(res.headers.pagination.split(',')[1])
        data.map((item) => {
          let middleObj = {
            type: item.excel_data.type === 1 ? '时效卡' : '次卡',
            payment_method: payment_methodDictionary(item.excel_data.payment_method),
            sex: item.excel_data.sex === 1 ? '男' : '女',
            excel_col: item.excel_col
          }
          for (let key in item.excel_data) {
            if (item.error.hasOwnProperty(key)) {
              item.excel_data[key] = item.excel_data[key] + `(${item.error[key][0]})`
            } else {
              item.excel_data[key] = item.excel_data[key]
            }
          }
          let obj = Object.assign({}, item.excel_data, middleObj)
          this.tableData.push(obj)
        })
        this.listLoading = false
      }).catch(err => {
        console.log(err)
        this.listLoading = false
      })
    },
    handleCurrentChange(value) {
      this.page = value
      this.getVipLog()
    },
    handleDownload() {
      require.ensure([], () => { // 用 webpack Code Splitting xlsl还是很大的
        const { export_json_to_excel } = require('@/vendor/Export2Excel')
        const tHeader = ['会员卡号', '姓名', '手机号码', '会员卡类型', '会员卡名称', '次卡剩余次数', '开卡日期', '生效日期', '失效日期', '实收金额', '支付方式', '性别', '生日', '身份证号', '备注', '错误原因'] // excel 表格头
        const filterVal = ['card_no', 'name', 'phone', 'type', 'card_name', 'total_times', 'created_at', 'start_date', 'end_date', 'real_pay', 'payment_method', 'sex', 'birthday', 'id_card_no', 'remark', 'error']
        const list = this.tableData
        const data = this.formatJson(filterVal, list) // 自行洗数据 按序排序的一个array数组
        export_json_to_excel(tHeader, data, '错误数据')
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    }
  }
}
</script>

<style lang="scss" scoped>
.customizeDetailsDialog {
  /deep/ .el-dialog {
    border-radius: 5px;
  }
  /deep/ .el-dialog__header {
    border: 1px solid #cccccc;
    border-radius: 5px 5px 0px 0px;
  }
  /deep/ .el-dialog__body {
    padding: 15px 20px;
    border-radius: 0px 0px 5px 5px;
  }
}

</style>
