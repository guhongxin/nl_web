<template>
  <div class="box1">
    <div class="find-box4">
      <div style="overflow:hidden" class="filter-container">
        <scan-input :select="searchSelect" :defaultSelect="searchSelect[0].value" @kedownOver="searchlist" ref="scanIputDoc"></scan-input>
        <el-button class="derive" v-if="btnRoleList['1-2-4-1']" :loading="daoloading" @click="doExport"><i class="el-icon-printer"></i> 导出</el-button>
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
    <el-table @filter-change="filterChange" @sort-change="sortChange" stripe :key='tableKey' :data="tableList" v-loading="listLoading" element-loading-text="列表正在加载中" border fit highlight-current-row
      style="width: 100%;" class="check-table" id="subOutputRank-print">

      <el-table-column align="center" type="selection" width="55px"></el-table-column>
      
      <el-table-column width="250px" align="center" 
        label="禁用时间<i onclick='openDate(event)' data=[1,'disable_sdate','disable_edate'] title='禁用时间' class='el-icon-date'></i>"
        sortable='custom' prop="disable_date_sort">
        <template slot-scope="scope">
          <span>{{scope.row.created_at}}</span>
        </template>
      </el-table-column>
      
      <el-table-column column-key="locker_id" align="center"  :label="'柜子区域'" width="250" prop="scope.row.area" 
      :filters="areaOptions" filter-placement="bottom-end" :filter-multiple="false">
        <template slot-scope="scope">
          <span v-text="scope.row.locker.area"></span>
        </template>
      </el-table-column>
      
      <el-table-column align="center" :label="'柜子编号'" width="250" prop="scope.row.number">
        <template slot-scope="scope">
          <span v-text="scope.row.locker_grid.no"></span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="'禁用原因'" width="250" prop="scope.row.disable_remark">
        <template slot-scope="scope">
          <span v-text="scope.row.disable_remark === null ? '-' : scope.row.disable_remark"></span>
        </template>
      </el-table-column>
      
      <el-table-column column-key="creator_id_disable" align="center" :label="'禁用操作人'" width="250" prop="creator_id_disable"
      :filters="operator_nameOptions" filter-placement="bottom-end" :filter-multiple="false">
        <template slot-scope="scope">
          <span v-text="scope.row.disable_operator_name ? scope.row.disable_operator_name : '超级管理员'"></span>
        </template>
      </el-table-column>
      
      <el-table-column width="250px" align="center"
        label="启用时间<i onclick='openDate(event)' data=[4,'enable_sdate','enable_edate'] title='启用时间' class='el-icon-date'></i>"
        sortable='custom' prop="enable_date_sort">
        <template slot-scope="scope">
          <span v-text="scope.row.enabled_at === null ? '-' : scope.row.enabled_at"></span>
        </template>
      </el-table-column>
      
      <el-table-column align="center" :label="'启用备注'" width="477" prop="scope.row.enable_remark">
        <template slot-scope="scope">
          <span v-text="scope.row.enable_remark ? scope.row.enable_remark : '-'"></span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="'启用操作人'" min-width="250" prop="creator_id_enable"
      column-key="creator_id_enable" :filters="operator_enable" filter-placement="bottom-end" :filter-multiple="false">
        <template slot-scope="scope">
          <span v-text="scope.row.enable_operator_name ? scope.row.enable_operator_name : '超级管理员' " v-if="scope.row.enabled_at"></span>
          <span v-if="scope.row.enabled_at === null">-</span>
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
    <!-- 时间筛选 -->
    <dateRange @timeChange="timeChange"></dateRange>
  </div>
</template>

<script>
import scanInput from '@/components/scanInput'
import { listBanRecord, getAllCabinet } from '@/api/cabinet'
import { employeeList } from '@/api/employee'
import dateRange from '@/components/dateRange'

export default {
  name: 'disableRecord',
  components: {
    scanInput,
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
      operator_enable: [],
      listQuery: {
        page: 1,
        per_page: 10
      },
      employeeQuery: {
        page: 1,
        per_page: 1000
      },
      searchSelect: [{
        text: '禁用原因',
        value: 'disable_remark'
      }, {
        text: '启用备注',
        value: 'enable_remark'
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
          this.operator_nameOptions.push({ text: response.data[i].name, value: response.data[i].id + ',' + response.data[i].name, class: 'ccreator_id_disable' })
          this.operator_enable.push({ text: response.data[i].name, value: response.data[i].id + ',' + response.data[i].name, class: 'ccreator_id_enable' })
        }
        this.operator_nameOptions.unshift({ text: '超级管理员', value: '3,超级管理员', class: 'ccreator_id_disable' })
        this.operator_enable.unshift({ text: '超级管理员', value: '3,超级管理员', class: 'ccreator_id_enable' })
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
    // 导出
    doExport() {
      this.daoloading = true
      setTimeout(() => {
        this.daoloading = false
      }, 5000)
      this.common.message('warning', '导出不可频繁使用！请注意！')
      this.common.exportExcel('/v1/gym/lockers/export_disable', { fileName: '租柜禁用记录.xlsx' }, 'post')
    },
    // 打印
    doPrint() {
      let subOutputRankPrint = document.getElementById('subOutputRank-print')
      let newContent = subOutputRankPrint.innerHTML
      let oldContent = document.body.innerHTML
      document.body.innerHTML = newContent
      let wind = window.open('', 'newwindow', 'height=100%, width=1600px, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no')
      wind.print()
      wind.document.body.innerHTML = oldContent
      return false
    },
    curOpenbox(index) {
      console.log(this.boxlist[index].text)
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
      if (key === 'creator_id_disable') {
        if (!data[key].length) {
          this.hostFilter(data, key, 3, '')
          return
        }
        this.hostFilter(data, key, 3, '禁用操作人：' + data[key][0].split(',')[1])
      }
      if (key === 'creator_id_enable') {
        if (!data[key].length) {
          this.hostFilter(data, key, 5, '')
          return
        }
        this.hostFilter(data, key, 5, '启用操作人：' + data[key][0].split(',')[1])
      }
    },
    hostFilter(data, key, index, text) {
      if (data[key].length === 0) {
        delete this.tags[index]
      } else {
        this.$set(this.tags, index, { name: text, type: key })
      }
    },
    handleChange(value) {
      console.log(value)
    },
    getList() {
      this.listLoading = true
      listBanRecord(this.listQuery).then(response => {
        this.tableList = response.data
        this.total = Number(response.headers.pagination.split(',')[1])
        this.listLoading = false
      })
    },
    searchlist(obj) {
      delete this.listQuery.enable_remark
      delete this.listQuery.disable_remark
      if (obj.value) {
        if (obj.type === 'disable_remark') {
          this.listQuery.disable_remark = obj.value
          this.tags[0] = { 'name': `禁用原因:${this.listQuery.disable_remark}`, 'type': 'disable_remark' }
        } else if (obj.type === 'enable_remark') {
          this.listQuery.enable_remark = obj.value
          this.tags[0] = { 'name': `启用备注:${this.listQuery.enable_remark}`, 'type': 'enable_remark' }
        }
      } else {
        delete this.tags[0]
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
    handleEdit(index, row) {
      console.log(index, row)
    },
    handleDelete(index, row) {
      console.log(index, row)
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
  filters: {
  },
  destroyed() {
  }
}
</script>
