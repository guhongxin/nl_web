<template>
  <div class="box boxer">
    <div class="find-box4">
      <div style="overflow:hidden" class="filter-container">
        <scan-input :select="searchSelect" :defaultSelect="searchSelect[0].value" @kedownOver="searchlist" ref="scanIputDoc"></scan-input>
        <el-button class="derive" @click="doExport('会员修改')" v-if="btnRoleList['7-1-1-1']" :loading="domnloading"><i class="el-icon-printer"></i> 导出</el-button>
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

      <el-table-column label="操作对象" align="center" class-name="merge-th">
          <el-table-column align="center" :label="'手机号码'" prop="phone">
            <template slot-scope="scope">
              <span>{{scope.row.optobj?scope.row.optobj.phone:'-'}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" :label="'姓名'" prop="name">
            <template slot-scope="scope">
              <span>{{scope.row.optobj?scope.row.optobj.name:'-'}}</span>
            </template>
          </el-table-column>
      </el-table-column>

      <el-table-column align="center" :label="'说明'" class-name="small-padding fixed-width" prop="scope.row.remark">
        <template slot-scope="scope">
          <!--<span>{{scope.row.remark?scope.row.remark:'-'}}</span>-->
          <!--@click="opendbatchDetail($event, scope.row)"-->
          <span class="remark-text" v-html="computedRemark(scope.row)"></span>
        </template>
      </el-table-column>

      <!-- <el-table-column align="center" fixed="right" :label="$t('table.actions')" min-width="150" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" plain
           @click="dialogFormVisible1 = true">详情</el-button>
        </template>
      </el-table-column> -->
    </el-table>

    <div class="pagination-container">
      <el-pagination
        v-if="paginationShow"
        background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
        :page-sizes="[10,20,30,50]" :page-size="listQuery.per_page" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog title="编辑员工考情" :visible.sync="dialogFormVisible1" class="menber-dialog">
      <ul class="attendanceBox">
        <li class="li-first">
          <span>员工姓名：</span><span>{{staffName}}</span>
        </li>
        <li>
          <span>签到时间：</span>
          <el-time-picker style="width:180px;"
            v-model="value1"
            :picker-options="{
              selectableRange: '18:30:00 - 20:30:00'
            }"
            placeholder="任意时间点">
          </el-time-picker>
        </li>
        <li>
          <span>签退时间：</span>
          <el-time-picker style="width:180px;"
            v-model="value2"
            :picker-options="{
              selectableRange: '18:30:00 - 20:30:00'
            }"
            placeholder="任意时间点">
          </el-time-picker>
        </li>
      </ul>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogFormVisible = false">提 交</el-button>
      </div>
    </el-dialog>
    <!-- 时间筛选 -->
    <dateRange @timeChange="timeChange"></dateRange>
    <operation-record ref="operationRecord" title="客户修改详情"></operation-record>
  </div>
</template>

<script>
import { logList } from '@/api/operationLog'
import { employeeList } from '@/api/employee'
import scanInput from '@/components/scanInput'
import dateRange from '@/components/dateRange'
import operationRecord from '@/components/operationRecord'
const { actionValue, remarkConfig } = require('./../../../utils/logComfig')
import XLSX from 'xlsx'
export default {
  name: 'menberModify',
  components: {
    scanInput,
    dateRange,
    operationRecord
  },
  data() {
    let filterArr = actionValue.filter(v => {
      return v.type === 'member-modification'
    })
    filterArr.forEach(v => {
      v.class = 'ctype'
      v.value = String(v.num)
    })
    return {
      btnRoleList: {}, // tab/btn权限
      tags: [],
      select: '',
      searchval: '',
      tableKey: 0,
      tableList: null,
      total: null,
      listLoading: true,
      operator_nameOptions: [],
      listQuery: {
        action: 1,
        page: 1,
        per_page: 10,
        logable_type: 'App\\Vip'
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
      dialogFormVisible1: false,
      staffName: '员工01',
      value1: new Date(2016, 9, 10, 18, 40),
      value2: new Date(2016, 9, 10, 18, 40),
      paginationShow: true,
      filterArr: filterArr,
      domnloading: false
    }
  },
  created() {
    this.common.eachBtnRole(this.btnRoleList) // 按钮权限方法
    this.getList()
    this.employeeNameList()
  },
  computed: {
    getype() {
      remarkConfig['name'] = '客户名称'
      let getype = this.common.getType(remarkConfig)
      return getype
    }
  },
  methods: {
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
      if (key === 'employee_id') {
        if (!data[key].length) {
          this.hostFilter(data, key, 2, '')
          return
        }
        this.hostFilter(data, key, 2, '操作人：' + data[key][0].split(',')[1])
      }
      if (key === 'type') {
        if (!data[key].length) {
          this.hostFilter(data, key, 3, '')
          return
        }
        let text = ''
        let prefix = '操作类型：'
        text = this.filterArr.filter(v => {
          return v.value === this.listQuery[key]
        })
        text = text[0] ? text[0].text : '无'
        this.hostFilter(data, key, 3, prefix + text)
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
    doExport(filename) {
      require.ensure([], () => { // 用 webpack Code Splitting xlsl还是很大的
        console.time('aa')
        const tHeader = [
          ['序号', '操作时间', '操作人', '操作类型', '操作对象', '', '说明'],
          ['', '', '', '', '手机号码', '姓名', '']
        ] // excel 表格头
        this.domnloading = true
        let obj = {
          action: 1,
          logable_type: 'App\\Vip',
          page: 1,
          per_page: 1000
        }
        logList(obj).then(response => {
          let data = response.data
          let list = []
          data.forEach((item, index) => {
            let middleArry = [
              index + 1,
              item.created_at,
              item.employee_name,
              this.computedLogType(item.action),
              item.optobj ? item.optobj.phone : '',
              item.optobj ? item.optobj.name : '',
              this.computedRemark(item).replace(/<.*?>/g, '')
            ]
            list.push(middleArry)
          })
          let tHData = [...tHeader, ...list]
          const ws = XLSX.utils.aoa_to_sheet(tHData)
          const wb = XLSX.utils.book_new()
          ws['!cols'] = [{ wch: 5 }, { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 60 }]
          ws['!merges'] = this.common.MergeExcelHard(tHData)
          XLSX.utils.book_append_sheet(wb, ws, filename)
          XLSX.writeFile(wb, filename + '.xlsx')
          this.domnloading = false
          console.timeEnd('aa')
        }).catch(err => {
          console.log(err)
          this.domnloading = false
        })
      })
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
              if (v === '0.new.coach.phone' || v === '0.new.consultant.phone') {
                if (!value) value = '未绑定'
              }
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
        delete selfactionArr['over_date']
        delete selfactionArr['group_course_id']
        delete selfactionArr['course_data']
        delete selfactionArr['course_id']
        delete selfactionArr['coach_id']
        delete selfactionArr['consultant_id']
        for (var key in selfactionArr) {
          txt += (getype(key) + '：' + (value.ext.old[key] ? value.ext.old[key] : '') + '→' + value.ext.dirty[key] + ' \n ')
        }
        return txt
      }
      return '--'
    },
    /* 批量弹窗 */
    opendbatchDetail(e, row) {
      console.log(row)
      if (row.action === 806) { // 客户记录-批量删除
        if (e.path[0].classList.length === 0 && e.path[1].classList.length && e.path[1].classList[0] === 'remark-text') {
          let keyArr = [
            {
              key: 'new.name',
              label: '客户姓名'
            }, {
              key: 'new.head_portrait',
              label: '头像'
            }, {
              key: 'new.phone',
              label: '手机号码'
            }, {
              key: 'new.coach_name',
              label: '所属会籍'
            }, {
              key: 'new.quantity',
              label: '所属教练'
            }
          ]
          this.$refs.operationRecord.openModel(keyArr, row.ext)
        }
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.boxer{
  background-color: transparent;
  padding: 0px;
}
.reacord-table{
  /deep/ .merge-th{
    border-bottom: 1px solid #cccccc;
  }
  /deep/ .remark-text {
    font-size: 12px;
    line-height: 12px !important;
    white-space: pre-line;
  }
}
</style>
