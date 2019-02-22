<template>
  <div class="box">
    <div style="margin-top: 15px;overflow:hidden" class="filter-container">
      <scan-input :select="searchSelect" :defaultSelect="searchSelect[0].value" @kedownOver="searchlist"></scan-input>
      <el-button class="derive" v-if="btnRoleList['1-2-3-1']" :loading="daoloading" @click="doExport"><i class="el-icon-printer"></i> 导出</el-button>
      <!-- <el-button class="derive" @click="doPrint"><i class="el-icon-printer"></i> 打印</el-button> -->
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
    <el-table @filter-change="filterChange" stripe :key='tableKey' :data="tableList" v-loading="listLoading" element-loading-text="列表正在加载中" border fit highlight-current-row id="subOutputRank-print"
      style="width: 100%;" class="check-table" >

      <el-table-column align="center" type="selection" width="55px"></el-table-column>
      
      <el-table-column align="center"  :label="'创建时间'" width="220" prop="scope.row.created_at">
        <template slot-scope="scope">
          <span v-text="scope.row.created_at"></span>
        </template>
      </el-table-column>
      
      <el-table-column align="center"  :label="'会员姓名'" width="120" prop="scope.row.member_name">
        <template slot-scope="scope">
          <span v-text="scope.row.member_name"></span>
        </template>
      </el-table-column>
      
      <!-- <el-table-column align="center"  :label="'会员卡号'" width="150" prop="">
        <template slot-scope="scope">
          <span v-text=""></span>
        </template>
      </el-table-column> -->

      <el-table-column align="center" :label="'手机'" width="220" prop="scope.row.member_phone">
        <template slot-scope="scope">
          <span v-text="scope.row.member_phone"></span>
        </template>
      </el-table-column>
      
      <el-table-column column-key="area" align="center" :label="'柜子区域'" width="150" prop="scope.row.area"
      :filters="areaOptions" filter-placement="bottom-end" :filter-multiple="false">
        <template slot-scope="scope">
          <span v-text="scope.row.area"></span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="'柜子编号'" width="150" prop="scope.row.number">
        <template slot-scope="scope">
          <span v-text="scope.row.number"></span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="'租用开始时间'" width="220" prop="scope.row.gmt_start">
        <template slot-scope="scope">
          <span v-text="scope.row.gmt_start"></span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="'租用结束时间'" width="220" prop="scope.row.gmt_end">
        <template slot-scope="scope">
          <span v-text="scope.row.gmt_end"></span>
        </template>
      </el-table-column>

      <el-table-column column-key="operator_id" align="center" :label="'操作人'" width="150" prop="scope.row.operator_name"
      :filters="operator_nameOptions" filter-placement="bottom-end" :filter-multiple="false">
        <template slot-scope="scope">
          <span v-text="scope.row.operator_name ? scope.row.operator_name : '超级管理员'"></span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="'实收金额'" width="150" prop="scope.row.real_pay">
        <template slot-scope="scope">
          <span v-text="scope.row.real_pay"></span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="'实际归还时间'" width="200" prop="scope.row.actual_return_time">
        <template slot-scope="scope">
          <span v-text="scope.row.actual_return_time === null ? '-' : scope.row.actual_return_time"></span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="'押金'" width="150" prop="scope.row.charter_pay">
        <template slot-scope="scope">
          <span v-text="scope.row.charter_pay"></span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="'租借备注'" width="220" prop="scope.row.memo">
        <template slot-scope="scope">
          <span v-text="scope.row.memo === null ? '-' : scope.row.memo"></span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="'归还备注'" min-width="220" prop="scope.row.return_memo">
        <template slot-scope="scope">
          <span v-text="scope.row.return_memo === null ? '-' : scope.row.return_memo"></span>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
        :page-sizes="[10,20,30,50]" :page-size="listQuery.per_page" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    
  </div>
</template>

<script>
import { listRentRecord, areaQuery } from '@/api/cabinet'
import { employeeList } from '@/api/employee'
import scanInput from '@/components/scanInput'

export default {
  name: 'rentRecord',
  components: {
    scanInput
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
        value: 'member_phone'
      }, {
        text: '姓名',
        value: 'member_name'
      }, {
        text: '租借备注',
        value: 'memo'
      }, {
        text: '归还备注',
        value: 'return_memo'
      }]
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
      areaQuery().then(response => {
        for (let i = 0; i < response.data.length; i++) {
          this.areaOptions.push({ text: response.data[i].area, value: response.data[i].area, class: 'carea' })
        }
      })
    },
    employeeNameList() {
      employeeList(this.employeeQuery).then(response => {
        for (let i = 0; i < response.data.length; i++) {
          this.operator_nameOptions.push({ text: response.data[i].name, value: response.data[i].id + ',' + response.data[i].name, class: 'coperator_id' })
        }
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
    handleChange(value) {
      // console.log(value)
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
        }
      }
      this.listQuery.page = 1
      this.getList()
    },
    lotFilter(data, key) {
      if (key === 'area') {
        this.hostFilter(data, key, 0, '区域：' + data[key][0])
      }
      if (key === 'operator_id') {
        this.hostFilter(data, key, 1, '操作人：' + data[key][0].split(',')[1])
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
      listRentRecord(this.listQuery).then(response => {
        this.tableList = response.data
        // console.log('this.tableList', this.tableList)
        this.total = Number(response.headers.pagination.split(',')[1])
        this.listLoading = false
      })
    },
    searchlist(obj) {
      this.listQuery.column = obj.type
      this.listQuery.value = obj.value
      this.listQuery.page = 1
      this.getList()
    },
    // 导出
    doExport() {
      this.daoloading = true
      setTimeout(() => {
        this.daoloading = false
      }, 5000)
      this.common.message('warning', '导出不可频繁使用！请注意！')
      this.common.exportExcel('/v1/gym/cabinet_record_return_excel_exports')
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
    }
  },
  filters: {
  },
  destroyed() {
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
