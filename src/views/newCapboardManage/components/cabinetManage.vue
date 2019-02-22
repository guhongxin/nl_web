<template>
  <div class="box">
    <div v-if="btnRoleList['1-2-2-1']" style="margin-top: 15px;overflow:hidden" class="cabinet-container">
      <el-button class="derive" @click="addCabinet"><i class="el-icon-plus"></i> 添加柜子区域</el-button>
    </div>
    <el-table stripe :key='tableKey' :data="tableList" v-loading="listLoading" element-loading-text="列表正在加载中" border fit highlight-current-row
      style="width: 100%;" class="check-table">

      <el-table-column align="center" type="selection" width="55px"></el-table-column>
      
      <el-table-column align="center" :label="'区域名称'" width="250" prop="scope.row.area">
        <template slot-scope="scope">
          <span v-text="scope.row.area"></span>
        </template>
      </el-table-column>
      
      <el-table-column align="center" :label="'柜子数量'" width="250" prop="scope.row.num">
        <template slot-scope="scope">
          <span v-text="scope.row.num"></span>
        </template>
      </el-table-column>
      
      <el-table-column align="center" :label="'已借出'" width="250" prop="scope.row.rentNum">
        <template slot-scope="scope">
          <span v-text="scope.row.rentNum"></span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="'已逾期'" width="250" prop="scope.row.isBinded">
        <template slot-scope="scope">
          <span v-text="scope.row.expireNum"></span>
        </template>
      </el-table-column>
      
      <el-table-column align="center" :label="'已禁用'" width="250" prop="scope.row.forbidNum">
        <template slot-scope="scope">
          <span v-text="scope.row.forbidNum"></span>
        </template>
      </el-table-column>

      <el-table-column align="center" fixed="right" :label="$t('table.actions')" min-width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" plain v-if="btnRoleList['1-2-2-3']&&scope.row.isBinded === 'y'" @click="editCabinet(scope.row.area, scope.row.num)">编辑
          </el-button>
          <el-button size="mini" type="success" plain v-if="btnRoleList['1-2-2-2']&&scope.row.isBinded === 'n'" @click="bindCabinet(scope.row.area, scope.row.num)">绑定
          </el-button>
          <!-- <el-button size="mini" type="info" plain>{{$t('table.delete')}}
          </el-button> -->
          <el-dropdown trigger="click" v-if="btnRoleList['1-2-2-4']">
            <el-button size="mini" type="info" plain>删除</el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="handleDelete(scope.$index, tableList)">确定</el-dropdown-item>
              <el-dropdown-item>取消</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
        :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <!-- 添加柜子区域 -->
    <el-dialog
      title="添加柜子区域"
      :visible.sync="centerDialogVisible"
      :close-on-click-modal="false"
      width="485px"
      class="add-cabinet-dialog" @close="addclose">
      <ul class="ul-box" ref="formbox">
        <li>
          <span>区域名称：</span>
          <el-input placeholder="请输入柜子所属的区域名称" v-model="name" :maxlength="16"></el-input>
        </li>
        <li>
          <span>柜子数量：</span>
          <el-input placeholder="请输入该区域的数量" v-model="num"></el-input>
        </li>
      </ul>
      <div class="cabnit-dialog-footer">
        <span slot="footer" class="dialog-footer">
          <el-button class="return" @click="addSure" :loading="loading">确定</el-button>
        </span>
      </div>
    </el-dialog>
    <!-- 柜子绑定 -->
    <el-dialog
      title="柜子绑定"
      :visible.sync="centerDialogVisible1"
      :close-on-click-modal="false"
      width="900px"
      class="bind-cabinet-dialog" @close="codeClose">
      <div class="message">
        <span>区域编号：</span><input type="text" v-model="bindMessage.area" readonly style="background:#fff;">
        <span>柜子数量：</span><input type="text" v-model="bindMessage.num" readonly style="background:#fff;">
      </div>
       <div class="tip-box">
          <el-checkbox v-model="checked_h" disabled size="medium">已绑定</el-checkbox>
          <el-checkbox v-model="checked_w" disabled size="medium">未绑定</el-checkbox>
        </div>
      <div class="box">
        <div class="box-top">
          <span v-text="bindMessage.area"></span>
          <input type="text" placeholder="请依次扫描绑定手牌" v-model="bindCode" @keyup.enter="bindBox(bindMessage.area)" ref="myInput">
        </div>
        <ul class="ul-cabinet">
          <li v-for="(list,index) in bindList" 
          :class="{'active':ind === index}" 
          @click="changeBor(index)" :key="index"><span>{{list.number}}</span><span v-if="list.code">({{list.code}})</span>
          <el-checkbox v-model="checked" disabled size="medium" v-if="list.checked"></el-checkbox></li>
        </ul>
      </div>
      <div class="cabnit-dialog-footer">
        <span slot="footer" class="dialog-footer">
          <el-button class="return" :loading="bindLoading" @click="bindSure">保存</el-button>
        </span>
      </div>
    </el-dialog>

    <!-- 柜子编辑 -->
    <el-dialog
      title="柜子编辑"
      :visible.sync="centerDialogVisible2"
      :close-on-click-modal="false"
      width="900px"
      class="bind-cabinet-dialog" @close="codeClose">
      <div class="message">
        <span>区域编号：</span><input type="text" v-model="bindMessage.area" readonly style="background:#fff;">
        <span>柜子数量：</span><input type="text" v-model="bindMessage.num" readonly style="background:#fff;">
      </div>
      <div class="box">
        <div class="box-top">
          <span v-text="bindMessage.area"></span>
          <input type="text" placeholder="请依次扫描绑定手牌" v-model="bindCode" @keyup.enter="bindBox(bindMessage.area)" ref="myInput">
        </div>
        <ul class="ul-cabinet">
          <li v-for="(list,index) in bindList" 
          :class="{'active':ind === index}" 
          @click="changeBor(index)" :key="index">{{list.number}}<span>({{list.code}})</span>
          <el-checkbox v-model="checked" disabled size="medium"></el-checkbox>
          </li>
        </ul>
      </div>
      <div class="cabnit-dialog-footer">
        <span slot="footer" class="dialog-footer">
          <el-button class="return" :loading="bindLoading" @click="bindSure">保存</el-button>
        </span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listCabinet, deleteCabinet } from '@/api/cabinet'
import scanInput from '@/components/scanInput'
import { testNumber } from '@/utils/validate'

export default {
  name: 'cabinetManage',
  components: {
    scanInput
  },
  data() {
    return {
      codeObj: {},
      btnRoleList: {}, // 按钮权限
      select: '',
      searchval: '',
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      bindLoading: false,
      tableList: null,
      listQuery: {
        page: 1,
        limit: 10,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      centerDialogVisible: false,
      centerDialogVisible1: false,
      centerDialogVisible2: false,
      bindMessage: {
        area: '',
        num: ''
      },
      active: false, // 绑定class
      ind: '', //
      checked: true, //
      bindList: [],
      bindBoxList: [],
      isClick: false,
      checked_h: true,
      checked_w: false,
      bindCode: '',
      name: '',
      num: '',
      allFormData: {},
      loading: false
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
    },
    addCabinet() {
      this.centerDialogVisible = true
    },
    // 添加柜子
    addSure() {
      if (!this.name.length) {
        this.common.message('warning', '区域名称不能为空')
        return false
      }
      if (!this.num.length) {
        this.common.message('warning', '柜子数量不能为空')
        return false
      } else {
        if (!testNumber(this.num)) {
          this.common.message('warning', '柜子数量为正整数')
          return false
        }
      }
      this.allFormData.name = this.name
      this.allFormData.num = this.num
      this.$store.dispatch('AddCabinetArea', this.allFormData).then((res) => {
        this.common.message('success', '柜子区域添加成功')
        this.loading = false
        this.getList()
        this.centerDialogVisible = false
      }).catch(() => {
        this.loading = false
      })
    },
    addclose() {
      this.loading = false
      this.name = ''
      this.num = ''
    },
    // 获得table数据
    getList() {
      this.listLoading = true
      listCabinet().then(response => {
        this.tableList = response.data
        this.total = this.tableList.length
        this.listLoading = false
        // this.initTable()
      })
    },
    // 绑定柜子排序
    bindCabinet(area, num) {
      this.bindMessage.area = area
      this.bindMessage.num = num
      this.$store.dispatch('BindCabinet', area).then((res) => {
        this.bindList = res
        this.centerDialogVisible1 = true
      }).catch(() => {
        this.rentloading = false
      })
    },
    // 编辑柜子排序
    editCabinet(area, num) {
      this.bindMessage.area = area
      this.bindMessage.num = num
      this.centerDialogVisible2 = true
      this.$store.dispatch('BindCabinet', area).then((res) => {
        this.bindList = res
        for (let i = 0; i < this.bindList.length; i++) {
          this.bindList[i].checked = true
          this.bindBoxList.push({ 'area': area, 'number': this.bindList[i].number, 'code': this.bindList[i].code })
        }
      }).catch(() => {
      })
    },
    codeClose() {
      this.bindBoxList = []
    },
    // 绑定柜子number
    bindBox(area) {
      // 如果没有选中柜子
      if (!this.isClick) {
        this.common.message('warning', '请选择柜子')
        this.bindCode = ''
        return false
      }
      if (this.isClick) {
        // 如果没有输入手牌号
        if (!this.bindCode) {
          this.common.message('warning', '条码不正确')
          return false
        } else {
          if (this.ind < this.bindList.length) {
            this.bindList[this.ind] = { 'checked': true, 'number': this.bindList[this.ind].number, 'code': this.bindCode }
            this.bindBoxList[this.ind] = { 'area': area, 'number': this.bindList[this.ind].number, 'code': this.bindCode }
            this.ind += 1
            this.bindCode = ''
          }
        }
      }
    },
    // 绑定柜子确定
    bindSure() {
      let codeArr = []
      for (let i = 0; i < this.bindList.length; i++) {
        if (!this.bindList[i].checked) {
          this.common.message('warning', '请绑定所有手牌')
          return false
        }
        codeArr.push(this.bindList[i].code)
        this.isRepeat(codeArr)
      }
      console.log(this.codeObj)
      if (this.codeObj.length < this.bindList.length) {
        this.common.message('warning', '手牌号码不能重复')
        return false
      }
      this.bindLoading = true
      this.$store.dispatch('BindCabinetSure', this.bindBoxList).then((res) => {
        this.bindLoading = false
        this.common.message('success', '绑定成功')
        this.getList()
        this.bindBoxList = []
        this.centerDialogVisible1 = false
        this.centerDialogVisible2 = false
      }).catch(() => {
        this.bindLoading = false
        this.isClick = false
      })
    },
    isRepeat(arr) {
      this.codeObj = []
      for (var i in arr) {
        if (this.codeObj.indexOf(arr[i]) === -1) {
          this.codeObj.push(arr[i])
        }
      }
    },
    // 删除
    handleDelete(index, rows) {
      const self = this
      deleteCabinet(rows[index].area).then(res => {
        rows.splice(index, 1)
        self.common.message('success', '删除成功！')
      }).catch((err) => {
        this.common.message('error', err.data.message)
      })
    },
    // 点击柜子
    changeBor(index) {
      this.ind = index
      this.isClick = true
      this.bindCode = ''
      this.$refs.myInput.focus()
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
      if (this.sexindex === 0) {
        this.listQuery.sex = value
        this.getList()
        this.sexindex = 1
      } else {
        return false
      }
    },
    handleChange(value) {
      console.log(value)
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
    }
  },
  filters: {
  },
  destroyed() {
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.add-cabinet-dialog {
  ul {
    list-style: none;
    padding: 0;
    li {
      margin-bottom: 30px;
    }
  }
}
.bind-cabinet-dialog {
  .message {
    padding-left: 20px;
    input {
      border-radius: 3px;
      border: 1px solid #ddd;
      margin-bottom: 20px;
      width: 240px;
      height: 36px;
      margin-right: 50px;
      text-indent: 16px;
      background: #ddd;
    }
  }
  .box {
    border: 1px solid #ddd;
    border-bottom: 0;
    border-right: 0;
    .box-top {
      background: #E7EAEC;
      height: 60px;
      line-height: 60px;
      padding-left: 40px;
      input {
        border-radius: 3px;
        border: 1px solid #ddd;
        width: 240px;
        height: 36px;
        padding-left: 10px;
      }
    }
    .ul-cabinet {
      list-style: none;
      overflow: hidden;
      text-align: left;
      padding: 0;
      margin: 0;
      li {
        float: left;
        width: 117px;
        text-align: center;
        height: 45px;
        line-height: 45px;
        border: 1px solid #ddd;
        border-left: 0;
        cursor: pointer;
        position: relative;
        .el-checkbox {
          position: absolute;
          top: -15px;
          right: 0px;
        }
      }
      .active {
        border: 1px solid rgb(63,195,113);
      }
    }
  }
}
.box{
  margin: 20px;
}
.tip-box {
  text-align: right;
  padding-right: 20px;
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

.pagination-container {
  text-align: right;
}
.blue {
  color: #1878E1;
 }
.cabinet-container{
  border:1px solid #ddd;
  padding: 10px 0;
  margin-bottom: 15px;
}
.cabnit-dialog-footer {
  margin-top: 60px;
  text-align: center;
}
.cursorbox {
  float: left;
  width: 10%;
  height: 98px;
  min-width: 160px;
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
</style>
