<template>
  <div class="box1" style="padding:20px;">
    <div class="find-box4" >
      <div style="overflow:hidden" class="filter-container">
        <scan-input :select="searchSelect" :defaultSelect="searchSelect[0].value" @kedownOver="searchlist" ref="scanIputDoc"></scan-input>
        <el-button class="derive" v-if="btnRoleList['7-4-1']" @click="doExport('公开课记录')" :loading="domnloading"><i class="el-icon-printer"></i> 导出</el-button>
        <!-- <el-button class="derive"><i class="el-icon-printer"></i> 打印</el-button> -->
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
      style="width: 100%;" class="check-table reacord-table">
      <!-- <el-table-column align="center" type="selection" width="55px"></el-table-column> -->

      <el-table-column align="center"
        label="操作时间<i onclick='openDate(event)' data=[1,'created_at_sdate','created_at_edate'] title='操作时间' class='el-icon-date'></i>"
        sortable="custom" prop="created_at">
        <template slot-scope="scope">
          <span>{{scope.row.created_at}}</span>
        </template>
      </el-table-column>

      <el-table-column column-key="employee_id" align="center" :label="'操作人'" prop="scope.row.employee_name"
      :filters="operator_nameOptions" filter-placement="bottom-end" :filter-multiple="false">
        <template slot-scope="scope">
          <span>{{scope.row.employee_name?scope.row.employee_name:'管理员'}}</span>
        </template>
      </el-table-column>

      <el-table-column column-key="type" align="center" :label="'操作类型'" prop="scope.row.type"
                       :filters="filterArr" filter-placement="bottom-end" :filter-multiple="false">
        <template slot-scope="scope">
          <!--<span v-if="scope.row.type===1">添加</span>
          <span v-if="scope.row.type===2">修改</span>
          <span v-if="scope.row.type===3">删除</span>
          <span v-if="scope.row.type===4">批量操作</span>-->
          <span>{{computedLogType(scope.row.action)}}</span>
        </template>
      </el-table-column>

      <el-table-column label="课程名称" align="center" prop="courseName" column-key="courseName">
          <!-- :filters="courseOptions" filter-placement="bottom-end" :filter-multiple="false"> -->
            <template slot-scope="scope">
              <span>{{scope.row.optobj?scope.row.optobj.name:'-'}}</span>
            </template>
          <!-- </el-table-column> -->
          <!-- <el-table-column align="center" :label="'课程类型'" prop="scope.row.ext">
            <template slot-scope="scope">
              <span>{{scope.row.ext?(scope.row.ext.old?getfit_type(scope.row.ext.old.fit_type):getfit_type(scope.row.ext.fit_type)):'-'}}</span>
            </template>
          </el-table-column> -->
      </el-table-column>

      <el-table-column align="center" :label="'说明'" class-name="small-padding fixed-width" prop="scope.row.remark">
        <template slot-scope="scope">
          <!--<span>{{scope.row.remark?scope.row.remark:'-'}}</span>-->
          <span class="remark-text">{{computedRemark(scope.row)}}</span>
        </template>
      </el-table-column>

    </el-table>

    <div class="pagination-container">
      <el-pagination
        v-if="paginationShow"
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="listQuery.page"
        :page-sizes="[10,20,30,50]" :page-size="listQuery.per_page" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <!-- 时间筛选 -->
    <dateRange @timeChange="timeChange"></dateRange>
  </div>
</template>

<script>
import { logList } from '@/api/operationLog'
import { employeeList } from '@/api/employee'
import { groupCourseList } from '@/api/course'
import rectbox from '@/components/rectbox'
import scanInput from '@/components/scanInput'
import bulkAction from '@/components/bulkAction'
import dateRange from '@/components/dateRange'

const { actionValue, remarkConfig } = require('./../../../utils/logComfig')

export default {
  name: 'publicRecord',
  components: {
    rectbox,
    scanInput,
    bulkAction,
    dateRange
  },
  data() {
    let filterArr = actionValue.filter(v => {
      return v.type === 'publicRecord'
    })
    filterArr.forEach(v => {
      v.class = 'ctype'
      v.value = String(v.num)
    })
    return {
      btnRoleList: {}, // tab/btn权限
      tags: [],
      courseOptions: [],
      select: '',
      searchval: '',
      tableKey: 0,
      tableList: null,
      total: null,
      listLoading: true,
      operator_nameOptions: [],
      listQuery: {
        action: 4,
        page: 1,
        per_page: 10,
        logable_type: 'App\\FreeGroupCourse'
      },
      employeeQuery: {
        page: 1,
        per_page: 1000
      },
      searchSelect: [{
        text: '操作人',
        value: 'employee_name'
      }, {
        text: '说明',
        value: 'remark'
      }],
      paginationShow: true,
      filterArr: filterArr,
      domnloading: false
    }
  },
  created() {
    this.common.eachBtnRole(this.btnRoleList) // 按钮权限方法
    this.getList()
    this.employeeNameList()
    // this.getCourseAll()
  },
  computed: {
    getype() {
      let getype = this.common.getType(remarkConfig)
      return getype
    }
  },
  methods: {
    getCourseAll() {
      let data = { type: 0 }
      groupCourseList(data).then(response => {
        let data = response.data
        if (data.length > 0) {
          for (let i = 0; i < data.length; i++) {
            this.courseOptions.push({ text: response.data[i].name, value: response.data[i].id + ',' + response.data[i].name, class: 'ccourseName' })
          }
        }
      })
    },
    sortChange(data) {
      this.common.sortFilter(this, data)
    },
    employeeNameList() {
      employeeList(this.employeeQuery).then(response => {
        for (let i = 0; i < response.data.length; i++) {
          this.operator_nameOptions.push({ text: response.data[i].name, value: response.data[i].id + ',' + response.data[i].name, class: 'cemployee_id' })
        }
        this.operator_nameOptions.unshift({ text: '超级管理员', value: '3,超级管理员', class: 'cemployee_id' })
      })
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
      console.log(key)
      let font = ''
      if (data[key].length) {
        font = data[key][0].split(',')[1]
      }
      if (key === 'employee_id') {
        this.hostFilter(data, key, 2, '操作人：' + font)
      }
      if (key === 'type') {
        if (!data[key].length) {
          this.hostFilter(data, key, 3, '')
          return
        }
        let text = ''
        let prefix = '操作类型：'
        /* switch (this.listQuery[key]) {
          case '1': text = '添加'; break
          case '2': text = '修改'; break
          case '3': text = '删除'; break
          case '4': text = '批量操作'; break
          default: text = '无'; break
        } */
        text = this.filterArr.filter(v => {
          return v.value === this.listQuery[key]
        })
        text = text[0] ? text[0].text : '无'
        this.hostFilter(data, key, 3, prefix + text)
      }
      if (key === 'courseName') {
        this.hostFilter(data, key, 4, '课程名称：' + font)
      }
    },
    hostFilter(data, key, index, text) {
      if (data[key].length === 0) {
        delete this.tags[index]
      } else {
        this.$set(this.tags, index, { name: text, type: key })
      }
    },
    curChoose(index) {
      for (let v of this.boxlist) {
        v.checked = false
      }
      this.boxlist[index].checked = true
    },
    curOpenbox(index) {
      console.log(this.boxlist[index].text)
    },
    handleChange(value) {
      console.log(value)
    },
    getList() {
      this.listLoading = true
      logList(this.listQuery).then(response => {
        this.tableList = response.data
        this.total = Number(response.headers.pagination.split(',')[1])
        this.listLoading = false
      })
    },
    searchlist(obj) {
      if (obj.value === '') {
        delete this.tags[0]
      } else {
        let tagszh = {
          employee_name: '操作人',
          remark: '说明'
        }
        this.tags[0] = { 'name': `${tagszh[ obj.type]}:${obj.value}`, 'type': obj.type }
      }
      this.listQuery.column = obj.type
      this.listQuery.value = obj.value
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
    getfit_type(param) {
      let result = ''
      switch (param) {
        case 'J':
          result = '减脂'
          break
        case 'Z':
          result = '增肌'
          break
        case 'S':
          result = '塑形'
          break
      }
      return result
    },
    pageInit() {
      this.paginationShow = false
      this.$nextTick(() => {
        this.paginationShow = true
      })
    },
    timeChange(param) {
      this.common.chooseTimerFilter(param, this)
    },
    /* 计算操作类型 */
    computedLogType(actionType) {
      let actionArr = actionValue.filter(v => {
        return v.num === actionType
      })
      if (actionArr.length === 1) {
        return actionArr[0].text
      } else {
        return '--'
      }
    },
    /* 计算说明 */
    computedRemark(row) {
      let that = this
      let actionArr = actionValue.filter(v => {
        return v.num === row.action
      })
      if (actionArr.length === 1 && actionArr[0].template !== '-') {
        let selfactionArr = { ...actionArr[0] }
        /* 单独处理编辑 */
        if (selfactionArr.isEdit) {
          return that.computedEditValue(row)
        }
        /* 除编辑以外的模板 */
        /* 判断模板是否唯一 获取对应模板 */
        let template
        if (Array.isArray(selfactionArr.template)) {
          let templateIndex = 0
          if (row.ext.new.type === 2) {
            templateIndex = 1
          }
          template = selfactionArr.template[templateIndex]
          selfactionArr.keyArr = [selfactionArr.keyArr[templateIndex]]
        } else {
          template = selfactionArr.template
        }
        /* 判断keyArr是否存在 */
        if (selfactionArr.keyArr) {
          selfactionArr.keyArr.forEach(v => {
            let value = that.computedValue(row, v)
            let flagIndex = template.indexOf('${flag}')
            if (flagIndex >= 0 && flagIndex === template.indexOf('${flag}-timeBrfore')) {
              template = template.replace(/\$\{flag\}-timeBrfore/, value.slice(0, 11))
            } else if (flagIndex >= 0 && flagIndex === template.indexOf('${flag}-timeAfter')) {
              template = template.replace(/\$\{flag\}-timeAfter/, value.slice(-8))
            } else if (flagIndex >= 0) {
              template = template.replace(/\$\{flag\}/, value)
            }
          })
          return template
        } else {
          return '--'
        }
      } else {
        return '--'
      }
    },
    computedValue(value, v) {
      let objkeyArr = v.split('.')
      let result = ''
      if (objkeyArr.length >= 2) { /* 常规取值 */
        result = this.common.getKeyarrValue(objkeyArr, value.ext)
      } else if (v === 'use_times' || v === 'total_times') { /* 计算次数 */
        (value.ext.new[v] || value.ext.new[v] === 0) && (value.ext.old[v] || value.ext.old[v] === 0) ? result = value.ext.new[v] - value.ext.old[v] : result = 0
      } else if (v === 'end_date') { /* 计算相差天数 */
        result = this.datedifference(value.ext.new[v], value.ext.old[v])
      } else if (v === 'card_num') { /* 批量操作 */
        result = value.ext.length
      }
      return result
    },
    computedEditValue(value) {
      if (value && value.ext && value.ext.dirty) {
        let selfactionArr = { ...value.ext.dirty }
        let txt = ''
        let getype = this.getype
        delete selfactionArr['updated_at']
        delete selfactionArr['coach_id'] // 教练ID
        for (var key in selfactionArr) {
          txt += (getype(key) + '：' + (value.ext.old[key] ? value.ext.old[key] : '') + '→' + (value.ext.dirty[key] ? value.ext.dirty[key] : '') + ' \n ')
        }
        return txt
      }
      return '--'
    },
    doExport(filename) {
      require.ensure([], () => { // 用 webpack Code Splitting xlsl还是很大的
        const { export_json_to_excel } = require('@/vendor/Export2Excel')
        const tHeader = ['序号', '操作时间', '操作人', '操作类型', '课程名称', '说明'] // excel 表格头
        const filterVal = ['index', 'created_at', 'employee_name', 'type', 'optobj_fit_name', 'remark']
        this.domnloading = true
        let obj = {
          action: 4,
          page: 1,
          per_page: 1000,
          logable_type: 'App\\FreeGroupCourse'
        }
        logList(obj).then(response => {
          let data = response.data
          let list = []
          data.forEach((item, index) => {
            let middleObj = {
              index: index + 1,
              created_at: item.created_at,
              employee_name: item.employee_name,
              type: this.computedLogType(item.action),
              optobj_fit_name: item.optobj ? item.optobj.name : '-',
              remark: this.computedRemark(item)
            }
            list.push(middleObj)
          })
          const _data = this.common.formatJson(filterVal, list) // 自行洗数据 按序排序的一个array数组
          export_json_to_excel(tHeader, _data, filename)
          this.domnloading = false
        }).catch(err => {
          console.log(err)
          this.domnloading = false
        })
      })
    }
  },
  filters: {
  },
  destroyed() {
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
 .boxer {
    background-color: transparent;
    padding: 0px;
  }
  .el-table /deep/  .cell {
    white-space: pre-line;
    /deep/ .remark-text {
      display: block;
      line-height: 20px !important;
      font-size: 12px;
      white-space: pre-line;
      text-align: left;
    }
  }
</style>
