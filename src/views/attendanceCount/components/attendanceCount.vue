<template>
  <div class="box">
    <div style="margin-top: 15px;overflow:hidden" class="filter-container">
      <scan-input></scan-input>
      <el-date-picker
        class="datePicker"
        v-model="date"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期">
      </el-date-picker>
      <el-button class="derive"><i class="el-icon-printer"></i> 导出</el-button>
    </div>
    <el-table stripe :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="列表正在加载中" border fit highlight-current-row
      style="width: 100%;" class="check-table">
      <el-table-column align="center" type="selection" width="55px"></el-table-column>
      
      <el-table-column align="center" :label="'姓名'" width="160" sortable prop="scope.row.name">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" :label="'照片'">
        <template slot-scope="scope">
          <span><img :src="scope.row.headIcon" alt="icon" width="30" height="30" style="margin-left:35px;display: list-item;border-radius:50%;"></span>
        </template>
      </el-table-column>
      <el-table-column align="center"  :label="'性别'" width="160" prop="scope.row.sex" 
      :filters="[{text: '男', value: '1'}, {text: '女', value: '2'}]"
      :filter-method="filterSex" filter-placement="bottom-end">
        <template slot-scope="scope">
          <span>{{scope.row.sex === 1 ? '男' : '女'}}</span>
        </template>
      </el-table-column>
      <el-table-column width="160px" align="center" :label="'手机号码'" sortable prop="scope.row.phone">
        <template slot-scope="scope">
          <span>{{scope.row.phone}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center"  :label="'角色'" width="160" prop="scope.row.sex" 
      :filters="[{text: '店长', value: '1'}, {text: '教练', value: '2'}]"
      :filter-method="filterCard">
        <template slot-scope="scope">
          <span>{{scope.row.sex === 1 ? '店长' : '教练'}}</span>
        </template>
      </el-table-column>
      <el-table-column width="160px" align="center" label="上班时间" sortable prop="scope.row.timestamp">
        <template slot-scope="scope">
          <span>{{scope.row.timestamp | parseTime('{h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column width="160px" align="center" label="下班时间" sortable prop="scope.row.timestamp">
        <template slot-scope="scope">
          <span>{{scope.row.timestamp | parseTime('{h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="'迟到次数'" width="160" sortable prop="scope.row.name">
        <template slot-scope="scope">
          <span>{{scope.row.coachTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="'早退次数'" width="160" sortable prop="scope.row.name">
        <template slot-scope="scope">
          <span>{{scope.row.coachTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="'缺卡次数'" width="160" sortable prop="scope.row.name">
        <template slot-scope="scope">
          <span>{{scope.row.coachTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="'旷工次数'" width="160" sortable prop="scope.row.name">
        <template slot-scope="scope">
          <span>{{scope.row.coachTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" fixed="right" :label="$t('table.actions')" min-width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" plain
           @click="dialogFormVisible = true">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
        :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    
    <el-dialog title="编辑员工考情" :visible.sync="dialogFormVisible" width="700px" class="attendance-dialog">
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
    
  </div>
</template>

<script>
import { fetchList } from '@/api/article'
import rectbox from '@/components/rectbox'
import scanInput from '@/components/scanInput'
import bulkAction from '@/components/bulkAction'
export default {
  name: 'attendanceCount',
  components: {
    rectbox,
    scanInput,
    bulkAction
  },
  data() {
    return {
      select: '',
      searchval: '',
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      sexindex: 0,
      manindex: 0,
      cardIndex: 0,
      dialogFormVisible: false,
      staffName: '员工01',
      date2: '2018-03-01',
      date: '',
      num1: '',
      num2: '',
      value1: new Date(2016, 9, 10, 18, 40),
      value2: new Date(2016, 9, 10, 18, 40)
    }
  },
  computed: {
  },
  created() {
    this.getList()
  },
  mounted() {
    const self = this
    this.$nextTick(function() {
      self.common.onceEle('bindonce', '性别', function() {
        self.sexindex = 0
      })
      self.common.onceEle('bindonce', '所属会籍', function() {
        self.salesmanindex = 0
      })
    })
  },
  methods: {
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
      if (this.sexindex === 0) {
        this.listQuery.sex = value
        this.getList()
        this.sexindex = 1
      } else {
        return false
      }
    },
    filterMan(value, row, column) {
      if (this.manindex === 0) {
        this.listQuery.salesman = value
        this.getList()
        this.salesmanindex = 1
      } else {
        return false
      }
    },
    filterCard(value, row, column) {
      if (this.cardIndex === 0) {
        this.listQuery.coachTime = value
        this.getList()
        this.cardIndex = 1
      } else {
        return false
      }
    },
    handleChange(value) {
      console.log(value)
    },
    getList() {
      this.listLoading = true
      console.log(this.listQuery)
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleEdit(index, row) {
      console.log(index, row)
    },
    handleDelete(index, row) {
      console.log(index, row)
    }
  },
  filters: {
  },
  destroyed() {
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.box{
  margin: 20px;
}
.datePicker{
  margin-left: 20px;
}
.derive{
  background: rgb(51, 51, 51);
  margin-left: 20px;
  color: #fff;
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
.cursoractive {
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
.pagination-container {
  text-align: right;
}
.ruleForm {
  margin-top: 30px;
}
.el-date-editor .el-range-separator {
  width: 8%;
}
.el-input-number--medium {
  width: 153px;
}
.dialog-footer {
  text-align: center;
  padding: 10px 20px 30px;
}
.attendanceBox {
  overflow: hidden;
  margin-top: 20px;
  li {
    width: 50%;
    font-size: 18px;
    list-style: none;
    margin-bottom: 40px;
    float: left;
  }
  .li-first{
    width: 100%;
  }
}

</style>
