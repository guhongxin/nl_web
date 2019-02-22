<template>
  <div class="app-container">
    <div class="boxser" style="overflow:hidden;">
      <rectbox :data="boxlist" v-on:choose="curChoose" v-on:openbox="curOpenbox"></rectbox>
    </div>
    <div class="find-box4">
      <div style="overflow:hidden" class="filter-container">
        <scan-input :select="searchSelect" :defaultSelect="searchSelect[0].value" @kedownOver="searchlist" v-model="searchRoleName" ref="scanIputDoc"></scan-input>
        <el-button type="primary" class="add-button lf" @click="testReportEntry" v-if="btnRoleList['3-6-1']"><i class="el-icon-plus"></i> 体测录入</el-button>
        <bulk-action :select="batchOperation" @changeBulk="searchGroup"></bulk-action>
        <span class="Rrrefresh" @click="__init">
          <el-button icon="el-icon-refresh" circle></el-button>
        </span>
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
    <el-table @sort-change="sortChange" @filter-change="filterChange" stripe :key='tableKey' :data="tableList"
      v-loading="listLoading" element-loading-text="列表正在加载中"
      border fit highlight-current-row
      @selection-change="selectionChange"
      style="width: 100%;" class="check-table">
      <el-table-column align="center" type="selection" width="55px"></el-table-column>

      <el-table-column align="center" :label="'姓名'" width="150" prop="name">
        <template slot-scope="scope">
          <span>{{scope.row.customer?scope.row.customer.name:'-'}}</span>
        </template>
      </el-table-column>

      <el-table-column width="150px" align="center" :label="'手机号码'" prop="phone">
        <template slot-scope="scope">
          <span>{{scope.row.phone}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="'性别'" width="120" prop="sex" column-key="sex"
       :filters="[{text: '男', value: '1', class: 'csex'}, {text: '女', value: '2', class: 'csex'}]" filter-placement="bottom-end" :filter-multiple="false">
        <template slot-scope="scope">
          <span v-if="scope.row.customer">{{scope.row.customer.sex === 1 ? '男' : scope.row.customer.sex === 2 ? '女' : '未知'}}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>

      <el-table-column width="150px" align="center" :label="'年龄'" sortable="custom" prop="age">
        <template slot-scope="scope">
          <span>{{scope.row.age}}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" :label="'身高'" sortable="custom" prop="height">
        <template slot-scope="scope">
          <span>{{scope.row.height?scope.row.height+'cm':''}}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" :label="'体重'" sortable="custom" prop="weight">
        <template slot-scope="scope">
          <span>{{scope.row.weight?scope.row.weight+'kg':''}}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" :label="'体型'" prop="type"
      :filters="typeOptions" filter-placement="bottom-end" :filter-multiple="false" column-key="type">
        <template slot-scope="scope">
          <span>{{getBodyType(scope.row.normal)}}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" :label="'体脂'" sortable="custom" prop="fat">
        <template slot-scope="scope">
          <span>{{scope.row.fat?(Math.round(scope.row.fat*100) / 100)+'%':'-'}}</span>
        </template>
      </el-table-column>

      <el-table-column width="150px" align="center" :label="'骨骼肌率'" sortable="custom" prop="muscle">
        <template slot-scope="scope">
          <span>{{scope.row.muscle?scope.row.muscle+'%':'-'}}</span>
          <!-- <span>{{scope.row.muscle?(Math.round(scope.row.muscle*100) / 100):'-'}}</span> -->
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center"
        label="最近体测时间<i onclick='openDate(event)' data=[3,'examTime_sdate','examTime_edate'] title='最近体测时间' class='el-icon-date'></i>"
        sortable="custom" prop="examTime">
        <template slot-scope="scope">
          <span>{{scope.row.examTime ? scope.row.examTime:'-'}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center"  :label="'分配教练'" width="150" prop="coachId" column-key="coachId"
      :filters="coachOptions" filter-placement="bottom-end" :filter-multiple="false">
        <template slot-scope="scope">
          <span>{{scope.row.customer ? scope.row.customer.coach?scope.row.customer.coach.name:'-' :'-'}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center"  :label="'来源'" width="150" prop="source">
        <template slot-scope="scope">
          <span>{{computedName(scope.row.source)}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" fixed="right" :label="$t('table.actions')" min-width="280" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" plain size="mini" @click="editReportBtn(scope.row)"  v-if="btnRoleList['3-6-2']">编辑</el-button>
          <el-button size="mini" plain type="danger" @click="deletBtn(scope.row)"  v-if="btnRoleList['3-6-3']">删除</el-button>
          <el-dropdown trigger="click" style="margin-left:10px;">
            <el-button size="mini" type="primary" plain>查看</el-button>
            <el-dropdown-menu slot="dropdown">
              <template>
                <el-dropdown-item @click.native="apptestReportParent(scope.row)" v-if="btnRoleList['3-6-6']">app查看</el-dropdown-item>
                <el-dropdown-item @click.native="testReportParent(scope.row)" v-if="btnRoleList['3-6-5']">pc查看</el-dropdown-item>
              </template>
            </el-dropdown-menu>
          </el-dropdown>
          <!-- <el-button type="primary" plain size="mini"  @click="apptestReportParent(scope.row)" v-if="btnRoleList['3-6-6']">app查看</el-button>
          <el-button type="primary" plain size="mini"  @click="testReportParent(scope.row)" v-if="btnRoleList['3-6-5']">pc查看</el-button> -->
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container" style="text-align:right;">
      <el-pagination
        v-if="paginationShow"
        background
        @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
        :page-sizes="[10,20,30,50]" :page-size="listQuery.per_page" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <edit-report-popup
      v-if="editReportdialogVisible"
      :examId='reportData.id'
      :title="'编辑体测'"
      :dialogVisible="editReportdialogVisible"
      :widthSize="'700px'"
      @editReporPoupOK="$editReporPoupOK"
      @dialogClosed='editReporPoupClosed'
     >
    </edit-report-popup>
    <test-report-entry-popuo
      :title="'添加体测'"
      v-if="entryReportdialogVisible"
      :dialogVisible="entryReportdialogVisible"
      :widthSize="'800px'"
      @testReportEntryPopupOK="$testReportEntryPopupOK"
      @dialogClosed='entryReportPoupClosed'></test-report-entry-popuo>
    <!-- 时间筛选 -->
    <dateRange @timeChange="timeChange"></dateRange>
    <!-- APP 查看体测 -->
    <test-body-report-prop 
      v-if="testbodyreportpropdialogVisible"
      :dialogVisible="testbodyreportpropdialogVisible"
      @popupsClosed="testbodyreportpropdialogClosed"
      :source="bodyreportSource"
      ref="testBodyReportDoc"></test-body-report-prop>

    <!-- 删除体测报告 -->
    <delete-dialog 
      :tipMessage="deleteMessage"
      ref="deleteDialogDoc"
      @deleteSureBtn='deleteCardSure'></delete-dialog>

  </div>
</template>

<script>
import { listTestReport, countList } from '@/api/coach'
import { employeeList } from '@/api/employee'
import rectbox from '@/components/rectbox'
import scanInput from '@/components/scanInput'
import bulkAction from '@/components/bulkAction'
import pictureImg from '@/components/pictureImg'
import dateRange from '@/components/dateRange'
import { testNumber } from '@/utils/validate'
import deleteDialog from '@/components/deleteDialog'

import EditReportPopup from './editReportPopup'
import testReportEntryPopuo from './testReportEntryPopuo'
import { batchDeletPhysicalTest } from '@/api/testReport'
import TestBodyReportProp from './testBodyReportProp'
// import { parseTime } from '@/utils/index'
import { body_typeDictionary } from '@/utils/comm'
export default {
  name: 'testReport',
  components: {
    rectbox,
    scanInput,
    bulkAction,
    pictureImg,
    EditReportPopup,
    testReportEntryPopuo,
    dateRange,
    TestBodyReportProp,
    deleteDialog
  },
  data() {
    return {
      tags: [],
      deleteMessage: '确定要删除该条体测报告吗?',
      deleteObj: {
        method: 'delete',
        ids: []
      },
      typeOptions: [
        { text: '标准', value: 0 + ',' + '标准', class: 'ctype' },
        { text: '隐形肥胖', value: 1 + ',' + '隐形肥胖', class: 'ctype' },
        { text: '偏胖', value: 2 + ',' + '偏胖', class: 'ctype' },
        { text: '肥胖', value: 3 + ',' + '肥胖', class: 'ctype' },
        { text: '偏瘦', value: 4 + ',' + '偏瘦', class: 'ctype' },
        { text: '偏瘦肌肉', value: 5 + ',' + '偏瘦肌肉', class: 'ctype' },
        { text: '标准肌肉', value: 6 + ',' + '标准肌肉', class: 'ctype' },
        { text: '非常肌肉', value: 7 + ',' + '非常肌肉', class: 'ctype' },
        { text: '运动不足', value: 8 + ',' + '运动不足', class: 'ctype' }
      ],
      coachOptions: [], // 分配教练
      btnRoleList: {},
      tableKey: 0,
      list: null,
      total: null,
      listLoading: false,
      loading: false,
      searchRoleName: '',
      listQuery: {
        page: 1,
        per_page: 10
      },
      coachQuery: {
        post: 1
      },
      searchSelect: [{
        text: '手机号码',
        value: 'phone'
      }, {
        text: '姓名',
        value: 'name'
      }],
      boxlist: [{
        text: '全部',
        num: 0,
        type: 'all',
        checked: true,
        bocolor: 'rgb(28, 132, 198)'
      }, {
        text: '标准',
        num: 0,
        type: 'normal',
        status: '1',
        checked: false,
        bocolor: 'rgb(81, 169, 202)'
      }, {
        text: '偏胖',
        num: 0,
        type: 'too_fat',
        status: '2',
        checked: false,
        bocolor: 'rgb(26, 179, 148)'
      }, {
        text: '偏瘦',
        num: 0,
        type: 'too_thin',
        status: '3',
        checked: false,
        bocolor: 'rgb(248, 172, 89)'
      }],
      form: {
        name: '', // 姓名
        sex: '', // 性别
        phone: '', // 手机
        age: '', // 年龄
        avatar: '', // 头像
        height: '', // 身高
        weight: '', // 体重
        body_fat: '', // 体脂
        water: '', // 水分
        fat: '', // 脂肌
        bone: '', // 骨量
        muscle: '', // 肌肉
        waist: '', // 腰臀比
        protein: '', // 蛋白质
        systolic: '', // 收缩压
        diastolic: '', // 舒张压
        visceral: '', // 内脏脂肪
        subcutaneous: '', // 皮下脂肪
        heart_rate: '', // 静态心率
        fat_grade: '', // 体质等级
        test_time: '' // 体测时间
      },
      centerDialogVisible: false,
      tableList: [],
      // coachOptions: [],
      editReportdialogVisible: false,
      entryReportdialogVisible: false,
      reportData: {
        id: 0
      },
      batchOperation: [{
        label: '批量删除',
        value: 'delete',
        key: '3-6-4'
      }],
      groupOprate: {
        ids: []
      },
      paginationShow: true,
      testbodyreportpropdialogVisible: false, // 查看弹窗
      bodyreportSource: 0 // 体测报告来源
    }
  },
  computed: {
  },
  created() {
    this.__init()
  },
  mounted() {
    this.coachNameList()
  },
  methods: {
    __init() {
      this.common.eachBtnRole(this.btnRoleList) // 按钮权限方法
      this.getList()
      this.getCount()
    },
    coachNameList() {
      let data = { post: 1 }
      employeeList(data).then(response => {
        for (let i = 0; i < response.data.length; i++) {
          this.coachOptions.push({ text: response.data[i].name, value: response.data[i].id + ',' + response.data[i].name, class: 'ccoachId' })
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
          this.listQuery[key] = data[key][0].split(',')[0]
          this.lotFilter(data, key)
        } else {
          this.listQuery[key] = undefined
          this.lotFilter(data, key)
        }
      }
      this.listQuery.page = 1
      this.pageInit()
      this.getList()
    },
    lotFilter(data, key) {
      let font = ''
      if (data[key].length) {
        font = data[key][0].split(',')[1]
      }
      if (key === 'sex') {
        this.hostFilter(data, key, 1, this.listQuery[key] === '1' ? '性别：男' : this.listQuery[key] === '2' ? '性别：女' : '性别：未知')
      }
      if (key === 'type') {
        this.hostFilter(data, key, 2, '体型：' + font)
      }
      if (key === 'coachId') {
        this.hostFilter(data, key, 4, '分配教练：' + font)
      }
    },
    hostFilter(data, key, index, text) {
      if (data[key].length === 0) {
        delete this.tags[index]
      } else {
        this.$set(this.tags, index, { name: text, type: key })
      }
    },
    testTime(data) {
      this.form.test_time = '2018-03-19 16:21:35'
    },
    testSubmit() {
      if (!this.form.name.length) {
        this.common.message('warning', '姓名不能为空')
        return false
      }
      if (!this.form.sex) {
        this.common.message('warning', '性别不能为空')
        return false
      }
      if (!this.form.phone) {
        this.common.message('warning', '电话号码不能为空')
        return false
      }
      if (!/^[0-9]*[1-9][0-9]*$/.test(this.form.phone) || this.form.phone.length !== 11) {
        this.common.message('warning', '电话号码不正确')
        return false
      }
      if (!this.form.age) {
        this.common.message('warning', '年龄不能为空')
        return false
      } else {
        if (!testNumber(this.form.age)) {
          this.common.message('warning', '年龄为正整数')
          return false
        }
      }
      if (!this.form.test_time) {
        this.common.message('warning', '体测时间不能为空')
        return false
      }
      this.loading = true
      this.$store.dispatch('TestInput', this.form).then((res) => {
        this.common.message('success', '体测录入成功')
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    getimgurl(url) {
      this.form.avatar = url
    },
    clearimgurl(data) {
      this.form.avatar = data
    },
    curChoose(index) {
      for (let v of this.boxlist) {
        v.checked = false
      }
      this.boxlist[index].checked = true
      this.listQuery.type = this.boxlist[index].status
      this.listQuery.scope_value = this.boxlist[index].rbtn ? this.boxlist[index].rbtn.replace(/[^0-9]/ig, '') : undefined
      this.getList()
    },
    curOpenbox(index) {
      console.log(this.boxlist[index].text)
    },
    getList() {
      this.listLoading = true
      listTestReport(this.listQuery).then(response => {
        this.tableList = response.data
        this.total = Number(response.headers.pagination.split(',')[1])
        this.listLoading = false
      })
    },
    getCount() {
      let self = this
      countList().then(response => {
        let res = response.data
        for (let i = 0; i < self.boxlist.length; i++) {
          let item = self.boxlist[i]
          for (let key in res.count) {
            if (item.type === key) {
              self.boxlist[i].num = res.count[key]
            }
          }
        }
      })
    },
    searchlist(obj) {
      if (obj.value === '') {
        delete this.tags[0]
      } else {
        let tagszh = {
          phone: '手机号码',
          name: '姓名'
        }
        this.tags[0] = { 'name': `${tagszh[ obj.type]}:${obj.value}`, 'type': obj.type }
      }
      this.searchSelect.map(item => {
        delete this.listQuery[item.value]
      })
      this.listQuery.page = 1
      this.listQuery[obj.type] = obj.value
      this.pageInit()
      this.getList()
    },
    handleCurrentChange(val) {
      console.log('val', val)
      this.listQuery.page = val
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.per_page = val
      this.getList()
    },
    /**
     * 编辑体测
     */
    editReportBtn(params) {
      // 显示
      if (params.source !== 0) {
        this.common.message('warning', '第三方体测数据不可编辑！')
        return
      }
      this.reportData = params
      this.editReportdialogVisible = true
    },
    editReporPoupClosed() {
      // 关闭
      this.editReportdialogVisible = false
    },
    /**
    * 体测录入
    * */
    testReportEntry() {
      // 显示
      this.entryReportdialogVisible = true
    },
    // 体侧报告
    testReportParent(row) {
      if (row.source === 0) {
        window.open('../../../../static/bodyExam/report.html?id=' + row.id)
      } else if (row.source === 1) { /* 悠久 */
        window.open('../../../../static/health/report.html?id=' + row.id)
      } else if (row.source === 2) { /* 维塑 */
        window.open('../../../../static/visfitlb/physicalReport.html?id=' + row.id)
      } else {
        this.$message({
          type: 'info',
          message: '参数获取失败!'
        })
      }
    },
    // 显示第三方来源
    computedName(source) {
      let text = ''
      switch (source) {
        case 0:
          text = '牛啦体测'
          break
        case 1:
          text = '佑久体测'
          break
        case 2:
          text = '维塑体测'
          break
        default:
          text = '第三方体测'
          break
      }
      return text
    },
    entryReportPoupClosed() {
      // 关闭
      this.entryReportdialogVisible = false
    },
    /**
    * 删除
    * */
    deletBtn(params) {
      this.deleteObj = {
        method: 'delete',
        ids: []
      }
      this.deleteObj.ids.push(params.id)
      this.$refs.deleteDialogDoc.dialogShow()
    },
    deleteCardSure() {
      batchDeletPhysicalTest(this.deleteObj).then(res => {
        this.common.message('success', '删除成功！')
        this.$refs.deleteDialogDoc.dialogClose()
        this.getList()
        this.getCount()
      }).catch((err) => {
        this.common.message('error', err.data.message)
        this.$refs.deleteDialogDoc.dialogLoadingClose()
      })
    },
    /**
    * 批量删除
    * */
    selectionChange(selection) {
      this.groupOprate.ids = []
      for (let i = 0; i < selection.length; i++) {
        this.groupOprate.ids.push(selection[i].id)
      }
    },
    searchGroup(value) {
      if (value === 'delete') {
        if (!this.groupOprate.ids.length) {
          this.common.message('warning', '请选择要删除的数据')
          return
        }
        this.groupOprate.method = 'delete'
        this.$confirm('是否批量删除选中的数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          batchDeletPhysicalTest(this.groupOprate).then(res => {
            if (res) {
              this.$init()
            }
          }).catch(err => {
            console.log(err)
          })
        })
      } else {
        this.groupOprate.method = 'save'
        if (value === 'excel_Outport') {
          let obj = {
            type: this.listQuery.type,
            status: this.listQuery.status
          }
          this.common.exportExcel('/v1/gym/excel_export', obj)
        } else if (value === 'excel_Import') {
          console.log('excel 导入')
        }
      }
    },
    $init() {
      this.getCount()
      this.getList()
    },
    $testReportEntryPopupOK() {
      this.$init()
    },
    $editReporPoupOK() {
      this.$init()
    },
    getBodyType(param) {
      return body_typeDictionary(param)
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
    apptestReportParent(param) {
      this.testbodyreportpropdialogVisible = true
      this.bodyreportSource = param.source
      this.$nextTick(() => {
        this.$refs.testBodyReportDoc.setURL(param.id)
      })
    },
    testbodyreportpropdialogClosed() {
      // 关闭app体测弹窗
      this.testbodyreportpropdialogVisible = false
    }
  },
  filters: {
  },
  destroyed() {
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.boxser {
  overflow: hidden;
}
.searchgroup {
  width: 500px;
}
.searchGroupset {
  margin-left: 20px;
  width: 110px;
  .el-input__inner {
    background-color: #333333;
    color: white;
  }
  input::placeholder {
    color: white;
  }
}
.add-button {
  background: #333;
  color: #fff;
  margin-left: 20px;
  border: none;
  margin-top: 1px;
}
.lf{float: left;}
.searchgroup .el-select .el-input {
  width: 140px;
  padding-left: 36px;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
  overflow: hidden;
}
.cursorbox {
  float: left;
  width: 10%;
  height: 98px;
  box-shadow: 0 2px 5px 0 rgba(0,0,0,0.30);
  margin: 2px 5px 5px 5px;
  .text {
    font-size: 14px;
    color: #cccccc;
    height: 40px;
    line-height: 30px;
    box-sizing: border-box;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    padding-left: 10px;
    border-top: 6px solid #1C84C6;
  }
  .font {
    font-size: 28px;
    color: #333333;
    line-height: 58px;
    height: 58px;
    text-align: center;
  }
}
.cursoractive{
  background-color: #1C84C6;
  .text {
    background-color: rgba(0, 0, 0, 0.1);
    color: #ffffff;
    line-height: 40px;
    border-top: none;
  }
  .font {
    color: #ffffff;
  }
}
.testReport-dialog {
  .title {
    font-size: 20px;
    margin: 20px 0;
  }
  .form-box {
    overflow: hidden;
    border-bottom: 1px solid #ddd;
    .form1 {
      float: left;
      width: 60%;
    }
    .upimg-box {
      position: relative;
      float: left;
      width: 40%;
      .imgUp {
        width: 220px;
        height: 220px;
        box-sizing: border-box;
        text-align: center;
        display: inline-block;
        vertical-align: top;
        i {
          font-size: 43px;
          color: #ddd;
        }
        em {
          font-style: normal;
          color: #1C84C6;
        }
      }
    }
  }
  .form-box2 {
    overflow: hidden;
    .form2 {
      float: left;
      width: 50%;
    }
  }
}
</style>
