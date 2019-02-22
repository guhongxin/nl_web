<template>
  <el-dialog
    title="历史明细"
    :visible.sync="checklistDialogVisible"
    width="80%" :beforeClose="closeList"
    class="customizeDetailsDialog">
    <div style="overflow:hidden;margin-bottom: 20px;" class="filter-container">
      <scan-input ref="scanIputDoc" :select="searchSelect" :defaultSelect="searchSelect[0].value" @kedownOver="searchlist" placeholder="请输入要查询的内容" :searchValue="searchValue"></scan-input>
      <el-date-picker
        class="datePicker"
        v-model="selectdate"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :default-time="['12:00:00','12:00:00']"
        clearable
        @change="dateFind">
      </el-date-picker>
      <el-button class="derive" :loading="daoloading" @click="exportSign"><i class="el-icon-sold-out"></i> 导出</el-button>
      <!-- <el-button class="derive"><i class="el-icon-printer"></i> 打印</el-button> -->
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
    <el-table stripe :key='tableKey' :data="tableList" v-loading="listLoading" element-loading-text="列表正在加载中" border fit highlight-current-row
      style="width: 100%;" class="check-table" @filter-change="filterChange">
      <el-table-column align="center" type="selection" width="55px"></el-table-column>
      <el-table-column align="center" label="日期" width="130px">
        <template slot-scope="scope">
          <span>{{new Date(scope.row.created_at).getTime() | parseTime('{y}-{m}-{d}')}}</span>
        </template>
      </el-table-column>
      <el-table-column  align="center" label="时间" width="180px">
        <template slot-scope="scope">
          <span>
            <div class="ss">{{scope.row.signed_at}}</div>
          </span>
        </template>
      </el-table-column>
      <el-table-column  align="center" label="类型" width="120px" column-key="type" prop="type"
      :filters="typeOptions" filter-placement="bottom-end" :filter-multiple="false">
        <template slot-scope="scope">
          <span >
            <div v-if="scope.row.type === 0" class="green">入场</div>
            <div v-else class="red">出场</div>
          </span>
        </template>
      </el-table-column>
      
      <el-table-column align="center" :label="'姓名'" width="130px">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" v-if="scope.row.customer?scope.row.customer.deleted_at:''" :content="`客户已删除，删除时间: ${scope.row.customer?scope.row.customer.deleted_at:'-'}`" placement="bottom">
            <el-button type="info" size="mini">{{scope.row.customer?scope.row.customer.name:'-'}}</el-button>
          </el-tooltip>
          <span v-else>{{scope.row.customer?scope.row.customer.name:'-'}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="'性别'" prop="scope.row.sex" column-key="sex"
      :filters="[{text: '男', value: '1', class: 'csex'}, {text: '女', value: '2', class: 'csex'}]"
      filter-placement="bottom-end" :filter-multiple="false">
        <template slot-scope="scope">
          <span>{{scope.row.customer?scope.row.customer.sex === 1 ? '男' : '女':'-'}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="'手机号码'" width="130px">
        <template slot-scope="scope">
          <span>{{scope.row.customer?scope.row.customer.phone:'-'}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="'会员卡号'" width="200">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" v-if="scope.row.customervip?scope.row.customervip.deleted_at:''" :content="`该会员卡已删除，删除时间: ${scope.row.customervip.deleted_at}`" placement="bottom">
            <el-button type="info" size="mini">{{scope.row.customervip?scope.row.customervip.card_no:'-'}}</el-button>
          </el-tooltip>
          <span v-else>
            <span v-if="scope.row.customervip?scope.row.customervip.master_id:false" class="through">通</span>{{scope.row.customervip?scope.row.customervip.card_no:scope.row.card_no}}
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="'手牌借用'" width="130px" prop="scope.row.locker_grid">
      <!-- column-key="locker_grid" :filters="[{text: '未归还', value: '1', class: 'clocker_grid'}, {text: '未借用', value: '2', class: 'clocker_grid'}]"
      filter-placement="bottom-end" :filter-multiple="false" -->
        <template slot-scope="scope">
          <span v-if="scope.row.cabinet_bracelet">
            <span>{{scope.row.cabinet_bracelet.locker_grid.key}}</span><span style="color:red;margin-left:10px;">未归还</span>
          </span>
          <span v-else>未借用</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="'所属会籍'" prop="consultantId" width="130px" column-key="consultantId" 
        :filters="embership" filter-placement="bottom-end" :filter-multiple="false">
        <template slot-scope="scope">
          <span>{{scope.row.customer?scope.row.customer.consultant?scope.row.customer.consultant.name:'-':'-'}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="代签人" prop="employeeId" width="130px" column-key="employeeId"
        :filters="coperatorOptions" filter-placement="bottom-end" :filter-multiple="false" >
        <template slot-scope="scope">
          <span v-if="scope.row.employee?scope.row.employee.gym_id !== 0:''">{{scope.row.employee?scope.row.employee.name:'-'}}</span>
          <span v-else>{{scope.row.employee?scope.row.employee.name:'-'}}[超级管理员]</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination 
        v-if="paginationShow"
        background 
        @size-change="handleSizeChange" 
        @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
        :page-sizes="[10,20,30,50]" :page-size="listQuery.pre_page" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </el-dialog>
</template>

<script>
import { signListDialog } from '@/api/signin'
import { employeeList } from '@/api/employee'
import scanInput from '@/components/scanInput'
import { parseTime } from '@/utils/index'
import { getSession } from '@/utils/auth'
export default {
  name: 'checklist',
  components: {
    scanInput
  },
  props: {
    checklistDialogVisible: {
      type: Boolean
    }
  },
  data() {
    return {
      daoloading: false,
      tags: [],
      embership: [], // 会籍
      coperatorOptions: [], // 操作人
      select: '',
      searchval: '',
      searchValue: '',
      tableKey: 0,
      tableList: [],
      total: null,
      listLoading: true,
      helpSign: getSession('SET_USERNAME'),
      listQuery: {
        page: 1,
        pre_page: 10
      },
      selectdate: '',
      searchSelect: [{
        text: '手机号码',
        // value: 'phone'
        value: 'customer_phone'
      }, {
        text: '姓名',
        // value: 'name'
        value: 'customer_name_like'
      }, {
        text: '会员卡号',
        // value: 'cardno'
        value: 'card_no'
      }],
      num1: '',
      num2: '',
      paginationShow: true,
      typeOptions: [
        { text: '出场', value: 1 + ',出场', class: 'ctype' },
        { text: '入场', value: 0 + ',入场', class: 'ctype' },
      ]
    }
  },
  created() {
    this.employeeNameList()
  },
  mounted() {
  },
  methods: {
    parseTime,
    exportSign() {
      this.daoloading = true
      setTimeout(() => {
        this.daoloading = false
      }, 5000)
      this.common.message('warning', '导出不可频繁使用！请注意！')
      this.common.exportExcel('/v1/gym/sign/export_sign_record', { fileName: '出入场明细.xlsx' }, 'post')
    },
    dateShow(inDate, endDate) {
      if (!inDate) {
        return false
      } else {
        if (new Date(parseTime(inDate, '{y}-{m}-{d}')) - new Date(parseTime(endDate, '{y}-{m}-{d}')) === 0) {
          return true // 同一天
        } else {
          return false
        }
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
    filterSex(value, row, column) {
      this.listQuery.sex = value
      this.getList()
    },
    filterMan(value, row, column) {
      this.listQuery.salesman = value
      this.getList()
    },
    filterCard(value, row, column) {
      this.listQuery.coachTime = value
      this.getList()
    },
    getList() {
      this.listLoading = true
      this.listQuery.cur_date = parseTime(new Date(), '{y}-{m}-{d}')
      signListDialog(this.listQuery).then(response => {
        this.tableList = response.data
        console.log(this.tableList)
        this.total = Number(response.headers.pagination.split(',')[1])
        this.listLoading = false
      })
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.pre_page = val
      this.getList()
    },
    handleEdit(index, row) {
      console.log(index, row)
    },
    handleDelete(index, row) {
      console.log(index, row)
    },
    searchlist(obj) {
      delete this.listQuery.card_no
      delete this.listQuery.customer_phone
      delete this.listQuery.customer_name_like
      if (obj.value === '') {
        delete this.tags[0]
      } else {
        let tagzh = {
          customer_phone: '手机号码:',
          customer_name_like: '姓名:',
          card_no: '会员卡号:',
        }
        this.tags[0] = { 'name': `${tagzh[obj.type]}${obj.value}`, 'type': obj.type }
        this.listQuery[obj.type] = obj.value
      }
      this.listQuery.page = 1
      this.pageInit()
      this.getList()
    },
    closeList() {
      this.selectdate = []
      this.listQuery = {
        page: 1,
        pre_page: 10
      }
      this.$refs.scanIputDoc.clear()
      this.tags = []
      this.$emit('closeCheckList')
    },
    dateFind() {
      // 选择日期
      if (this.selectdate) {
        let data = this.selectdate
        this.listQuery.start_date = parseTime(data[0], '{y}-{m}-{d} {h}:{i}')
        this.listQuery.end_date = parseTime(data[1], '{y}-{m}-{d} {h}:{i}')
      } else {
        delete this.listQuery.start_date
        delete this.listQuery.end_date
      }
      this.listQuery.page = 1
      this.pageInit()
      this.getList()
    },
    employeeNameList() {
      this.coperatorOptions = []
      this.embership = []
      employeeList().then(response => {
        let data = response.data
        data.map(item => {
          // 获取操作人
          this.coperatorOptions.push({ text: item.name, value: item.id + ',' + item.name, class: 'cemployeeId' })
          // 获取操作人
          this.embership.push({ text: item.name, value: item.id + ',' + item.name, class: 'cconsultantId' })
        })
        this.coperatorOptions.unshift({ text: '超级管理员', value: '3,超级管理员', class: 'cemployeeId' })
      })
    },
    tagclose(tag, index) {
      this.common.tagFilter(this, tag, index, this.searchSelect)
    },
    filterChange(data) {
      for (let key in data) {
        if (data[key].length !== 0) {
          if (key === 'customer_sex' || key === 'locker_grid') {
            this.listQuery[key] = data[key][0]
          } else {
            this.listQuery[key] = data[key][0].split(',')[0]
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
        if (key !== 'sex') {
          font = data[key][0].split(',')[1]
        }
      }
      if (key === 'type') {
        this.hostFilter(data, key, 1, '类型：' + font)
      }
      if (key === 'sex') {
        let text = ''
        switch (this.listQuery[key]) {
          case '1': text = '男'; break
          case '2': text = '女'; break
          default: text = '未知'; break
        }
        this.hostFilter(data, key, 2, '性别：' + text)
      }
      if (key === 'locker_grid') {
        this.hostFilter(data, key, 3, this.listQuery[key] === '1' ? '手牌借用：未归还' : '手牌借用：未借用')
      }
      if (key === 'consultantId') {
        this.hostFilter(data, key, 4, '所属会籍：' + font)
      }
      if (key === 'employeeId') {
        this.hostFilter(data, key, 5, '代签人：' + font)
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
  },
  filters: {
  },
  destroyed() {
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.datePicker{
  margin-left: 20px;
}
.green {
  color: #5daf34;
}
.red {
  color: #f44b25;
}
.customizeDetailsDialog{
  /deep/ .el-dialog__body{
    padding: 20px 20px;
  }
}
.through{
  width: 20px;
  height: 20px;
  display: inline-block;
  background: #1AB394;
  border-radius: 3px;
  color: #ffffff;
  line-height: 20px;
  margin-right: 3px;
  text-align: center;
}
</style>
