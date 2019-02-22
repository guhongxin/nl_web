<template>
    <el-dialog
      title="错误提示"
      :visible.sync="dialogVisible"
      :width="widthSize"
      class="inputExcelErrDialog customizeDetailsDialog"
      :beforeClose='dialogClosed'
    >
      <div class="content">
        <p>因检测到如下错误，未执行导入操作</p>
        <!-- <p>上传文件中存在数据格式问题</p> -->
      </div>
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
            width="60" align="center">
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
              <span>{{tst(scope.row.card_no)[0]}}</span>
              <span style="color:rgb(241,76,48)" v-if="tst(scope.row.card_no)[1]">{{tst(scope.row.card_no)[1]}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            label="姓名"
            align="center"
            width="180">
            <template slot-scope="scope">
              <span>{{tst(scope.row.name)[0]}}</span>
              <span style="color:rgb(241,76,48)" v-if="tst(scope.row.name)[1]">{{tst(scope.row.name)[1]}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="phone"
            label="手机号码"
            width="150px" align="center">
            <template slot-scope="scope">
              <span>{{tst(scope.row.phone)[0]}}</span>
              <span style="color:rgb(241,76,48)" v-if="tst(scope.row.phone)[1]">{{tst(scope.row.phone)[1]}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="type"
            label="会员卡类型" width="120px"  align="center">
            <template slot-scope="scope">
              <span>{{tst(scope.row.type)[0]}}</span>
              <span style="color:rgb(241,76,48)" v-if="tst(scope.row.type)[1]">{{tst(scope.row.type)[1]}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="card_name"
            label="会员卡名称"
            width="120px"  align="center">
            <template slot-scope="scope">
              <span>{{tst(scope.row.card_name)[0]}}</span>
              <span style="color:rgb(241,76,48)" v-if="tst(scope.row.card_name)[1]">{{tst(scope.row.card_name)[1]}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="total_times"
            label="次卡剩余次数"
            width="120px"  align="center">
            <template slot-scope="scope">
              <span>{{tst(scope.row.total_times)[0]}}</span>
              <span style="color:rgb(241,76,48)" v-if="tst(scope.row.total_times)[1]">{{tst(scope.row.total_times)[1]}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="created_at"
            label="办理日期"
            width="200" align="center">
            <template slot-scope="scope">
              <span>{{tst(scope.row.created_at)[0]}}</span>
              <span style="color:rgb(241,76,48)" v-if="tst(scope.row.created_at)[1]">{{tst(scope.row.created_at)[1]}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="start_date"
            label="开卡日期"
            width="200" align="center">
            <template slot-scope="scope">
              <span>{{tst(scope.row.start_date)[0]}}</span>
              <span style="color:rgb(241,76,48)" v-if="tst(scope.row.start_date)[1]">{{tst(scope.row.start_date)[1]}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="end_date"
            label="失效日期"
            width="200" align="center">
            <template slot-scope="scope">
              <span>{{tst(scope.row.end_date)[0]}}</span>
              <span style="color:rgb(241,76,48)" v-if="tst(scope.row.end_date)[1]">{{tst(scope.row.end_date)[1]}}</span>
            </template>
          </el-table-column>
           <el-table-column
            prop="real_pay"
            label="实收金额"
            width="150" align="center">
            <template slot-scope="scope">
              <span>{{tst(scope.row.real_pay)[0]}}</span>
              <span style="color:rgb(241,76,48)" v-if="tst(scope.row.real_pay)[1]">{{tst(scope.row.real_pay)[1]}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="payment_method"
            label="支付方式"
            width="150" align="center">
            <template slot-scope="scope">
              <span>{{tst(scope.row.payment_method)[0]}}</span>
              <span style="color:rgb(241,76,48)" v-if="tst(scope.row.payment_method)[1]">{{tst(scope.row.payment_method)[1]}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="sex"
            label="性别"
            width="100" align="center">
            <template slot-scope="scope">
              <span>{{tst(scope.row.sex)[0]}}</span>
              <span style="color:rgb(241,76,48)" v-if="tst(scope.row.sex)[1]">{{tst(scope.row.sex)[1]}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="birthday"
            label="生日"
            width="150" align="center">
            <template slot-scope="scope">
              <span>{{tst(scope.row.birthday)[0]}}</span>
              <span style="color:rgb(241,76,48)" v-if="tst(scope.row.birthday)[1]">{{tst(scope.row.birthday)[1]}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="id_card_no"
            label="身份证号"
            width="180" align="center">
            <template slot-scope="scope">
              <span>{{tst(scope.row.id_card_no)[0]}}</span>
              <span style="color:rgb(241,76,48)" v-if="tst(scope.row.id_card_no)[1]">{{tst(scope.row.id_card_no)[1]}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="remark"
            label="备注"
            width="200" align="center">
            <template slot-scope="scope">
              <span>{{tst(scope.row.remark)[0]}}</span>
              <span style="color:rgb(241,76,48)" v-if="tst(scope.row.remark)[1]">{{tst(scope.row.remark)[1]}}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination-container" style="text-align: left">
        <el-button type="primary" @click="handleDownload" :loading="domnloading">下载Excel</el-button>
        <el-pagination background  @current-change="handleCurrentChange" 
          :current-page.sync="page"
          :page-size="per_page"
          layout="total, prev, pager, next" 
          :total="total"
          style="display: inline-block;float:right">
        </el-pagination>
      </div>
      <!-- <span slot="footer" class="dialog-footer">
        <el-button @click="dialogClosed">取 消</el-button>
        <el-button type="primary" @click="dialogBtnOk">查看完整信息</el-button>
      </span> -->
    </el-dialog>
</template>
<script>
// 导入数据错误详情弹窗
// import { cardInpormtErrInfor } from '@/api/vipcardGl'
import { newcardInpormtErrInfor } from '@/api/vipcardGl'
import { payment_methodDictionary } from '@/utils/comm'
export default {
  name: 'inputExcelErrDialog',
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
      type: Number
    }
  },
  data() {
    return {
      listLoading: false,
      tableData: [],
      per_page: 10,
      page: 1,
      total: 0,
      domnloading: false
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
        data_import_id: this.sid,
        per_page: this.per_page,
        page: this.page
      }
      this.listLoading = true
      newcardInpormtErrInfor(obj).then(res => {
        this.tableData = []
        let data = res.data
        this.total = Number(res.headers.pagination.split(',')[1])
        data.map((item) => {
          let middleObj = {
            type: item.data.type === 1 ? '时效卡' : '次卡',
            payment_method: payment_methodDictionary(item.data.payment_method),
            sex: item.data.sex === 1 ? '男' : '女',
            excel_col: item.col
          }
          for (let key in item.data) {
            if (item.errors.hasOwnProperty(key)) {
              item.data[key] = item.data[key] + `(${item.errors[key][0]})`
            } else {
              item.data[key] = item.data[key]
            }
          }
          let _obj = Object.assign({}, item.data, middleObj)
          this.tableData.push(_obj)
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
        const tHeader = ['序号', '会员卡号', '姓名', '手机号码', '会员卡类型', '会员卡名称', '时效卡剩余天数/次卡剩余次数', '办理日期', '开卡日期', '失效日期', '实收金额', '支付方式', '性别', '生日', '身份证号', '备注'] // excel 表格头
        const filterVal = ['excel_col', 'card_no', 'name', 'phone', 'type', 'card_name', 'total_times', 'created_at', 'start_date', 'end_date', 'real_pay', 'payment_method', 'sex', 'birthday', 'id_card_no', 'remark']
        let obj = {
          data_import_id: this.sid,
          per_page: this.total,
          page: 1
        }
        this.domnloading = true
        newcardInpormtErrInfor(obj).then(res => {
          let data = res.data
          let list = []
          data.map((item) => {
            let middleObj = {
              type: item.data.type === 1 ? '时效卡' : '次卡',
              payment_method: payment_methodDictionary(item.data.payment_method),
              sex: item.data.sex === 1 ? '男' : '女',
              excel_col: item.col
            }
            for (let key in item.data) {
              if (item.errors.hasOwnProperty(key)) {
                item.data[key] = item.data[key] + `(${item.errors[key][0]})`
              } else {
                item.data[key] = item.data[key] + ''
              }
            }
            let _obj = Object.assign({}, item.data, middleObj)
            list.push(_obj)
          })
          const _data = this.formatJson(filterVal, list) // 自行洗数据 按序排序的一个array数组
          export_json_to_excel(tHeader, _data, '错误数据')
          this.domnloading = false
        }).catch(err => {
          console.log(err)
          this.domnloading = false
        })
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    tst(param) {
      if (typeof param === 'number') {
        param = param.toString()
      }
      let _param = param || ''
      let result = []
      if (_param.indexOf('(') === -1) {
        result[0] = _param
      } else {
        result[0] = _param.substring(0, _param.indexOf('('))
        result[1] = _param.substring(_param.indexOf('('))
      }
      return result
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.customizeDetailsDialog {
  /deep/ .el-dialog {
    border-radius: 5px;
  }
  /deep/ .el-dialog__header {
    border: 1px solid #cccccc;
    border-radius: 5px 5px 0px 0px;
  }
  /deep/ .el-dialog__body {
    padding: 10px 10px;
    border-radius: 0px 0px 5px 5px;
  }
}
.inputExcelErrDialog {
  .content {
    text-align: center;
    p {
      font-size: 16px;
      span {
        color: red;
      }
    }
  }
}
</style>
