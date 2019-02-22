<template>
  <div class="box boxer">
    <div class="find-box4">
      <div v-if="btnRoleList['1-2-2-1']" style="overflow:hidden" class="cabinet-container">
        <el-button class="derive" @click="addCabinet" style="margin-left:0px;"><i class="el-icon-plus"></i> 添加柜子区域</el-button>
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
    <el-table stripe :key='tableKey' :data="tableList" v-loading="listLoading" element-loading-text="列表正在加载中" border fit highlight-current-row
      style="width: 100%;" class="check-table" @filter-change="filterChange" @sort-change="sortChange">

      <el-table-column align="center" :label="'柜子类型'" width="250">
        <template slot-scope="scope">
          <span v-text="scope.row.is_intelligent?'智能':'普通'"></span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="'区域名称'" width="250" prop="scope.row.area"
      column-key="locker_id" :filters="areaOptions" filter-placement="bottom-end" :filter-multiple="false">
        <template slot-scope="scope">
          <span v-text="scope.row.area"></span>
        </template>
      </el-table-column>
      
      <el-table-column align="center" :label="'柜子数量'" width="250" prop="quantity">
        <template slot-scope="scope">
          <span v-text="scope.row.quantity"></span>
        </template>
      </el-table-column>
      
      <el-table-column align="center" :label="'已借出'" width="250" prop="rented_count">
        <template slot-scope="scope">
          <span v-text="scope.row.rented_count"></span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="'已逾期'" width="250" prop="overdue_count">
        <template slot-scope="scope">
          <span v-text="scope.row.overdue_count"></span>
        </template>
      </el-table-column>
      
      <el-table-column align="center" :label="'已禁用'" width="250" prop="disabled_count">
        <template slot-scope="scope">
          <span v-text="scope.row.disabled_count"></span>
        </template>
      </el-table-column>

      <el-table-column align="center" fixed="right" :label="$t('table.actions')" min-width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" plain v-if="btnRoleList['1-2-2-3']&&scope.row.is_intelligent" @click="editBrainCabinet(scope.row)">编辑
          </el-button>
          <el-button size="mini" type="primary" plain v-if="btnRoleList['1-2-2-3']&&!scope.row.is_intelligent" @click="editCabinet(scope.row)">编辑
          </el-button>
          <el-button size="mini" type="info" plain v-if="btnRoleList['1-2-2-4']" @click="handleDelete(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination v-if="paginationShow" background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
        :page-sizes="[10,20,30, 50]" :page-size="listQuery.per_page" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <!-- 添加柜子区域 -->
    <add-cabinet-dialog
      v-if="centerDialogVisible"
      :dialogVisible='centerDialogVisible'
      @dialogClosed='dialogClosedAdd'
      @addCabinetBtn='addCabinetBtn'
      :widthSize="'500px'"></add-cabinet-dialog>

    <!-- 智能柜编辑 -->
    <edit-cabinet-dialog
      v-if="editDialogVisible"
      :dialogVisible='editDialogVisible'
      :editCabinetForm='editCabinetBrainForm'
      @dialogClosed='dialogClosedEdit'
      @editCabinetBtn='editCabinetBtn'
      ref="dialogCabinetDoc"
      :widthSize="'500px'"></edit-cabinet-dialog>

    <!--柜子解绑-->
    <delete-cabinet-dialog
      ref="unbindcabinet"
      :loading="delLoading"
      :title="deleteTitle"
      :tipMessage="unBindMessage"
      @dialogClosed="dialogClosedDelete"
      @deleteSureBtn="unBindSure"
      :widthSize="'500px'"></delete-cabinet-dialog>

    <!--删除柜子-->
    <delete-cabinet-dialog
      :tipMessage="deleteMessage"
      :tipMessageDetail="tipMessageDetail"
      ref="deleteDialogDoc"
      @deleteSureBtn="deleteCabinetSure"></delete-cabinet-dialog>

    <!-- 普通柜子编辑 -->
    <el-dialog
      title="柜子编辑1"
      :visible.sync="centerDialogVisible2"
      :close-on-click-modal="false"
      width="900px"
      class="bind-cabinet-dialog" @close="codeClose">
      <div class="message">
        <!--<span>区域名称：</span><input :disabled="cupboardNameDisabled" type="text" v-model="bindMessage.area" style="background:#fff;">
        <el-button class="black" @click="editCabinetName" :loading="loading">保存</el-button>-->
        <span>区域名称：</span><el-input :disabled="cupboardNameDisabled" style="width: 240px;" size="small" v-model="bindMessage.area"></el-input>
        <i class="el-icon-edit-outline edit-name" v-if="cupboardNameDisabled" @click="cupboardNameDisabled = false"></i>
        <span class="el-checkbox__input is-disabled is-checked edit-name" v-if="!cupboardNameDisabled" :loading="loading" @click="editCabinetName"><span class="el-checkbox__inner"></span></span>
        <span>柜子数量：</span><input type="text" v-model="bindMessage.num" disabled>
      </div>
      <div class="box">
        <div class="box-top">
          <el-input placeholder="请扫描或输入手牌号后“点击回车”进行绑定"
            v-model="gridForm.key" ref="myInput" @keyup.enter.native="bindSure">
            <template slot="prepend">
              <i class="qr"></i>
            </template>
          </el-input>
          <el-button type="success" @click.native="bindSure" plain :loading="bindSureLoading">绑定</el-button>
          <el-button type="danger" @click="unbindCabinet" plain>解绑</el-button>
          <div class="topTip">
            <el-checkbox v-model="haschecked" disabled size="medium">已绑定</el-checkbox>
            <el-checkbox v-model="nochecked" disabled size="medium">未绑定</el-checkbox>
          </div>
        </div>
        <div class="overFlow-box">
          <ul class="ul-cabinet">
            <li v-for="(list,index) in bindList"
            :class="{'active':ind === index, 'isbind':list.key}"
            @click="changeBor(list,index)" @dblclick="unbindCabinet(list,index)" :key="index">{{list.no}}<span v-if="list.key">（{{list.key}}）</span>
            <el-checkbox v-model="checked" disabled size="medium" v-if="list.key"></el-checkbox>
            </li><span class="addCabinetNum" @click="addCabinettNum">+</span>
          </ul>
        </div>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { listCabinet, deleteCabinet, bindCabinetSure, editCabinetNew, addGridNum, cabinetDetailNew, getAllCabinet } from '@/api/cabinet'
import scanInput from '@/components/scanInput'
import deleteCabinetDialog from '@/components/deleteDialog'
import addCabinetDialog from './props/addCabinet'
import editCabinetDialog from './props/editCabinet'
import addCabinetNumDialog from './props/addCabinetNum'
// import { testNumber } from '@/utils/validate'

export default {
  name: 'cabinetManage',
  components: {
    scanInput,
    addCabinetDialog,
    editCabinetDialog,
    addCabinetNumDialog,
    deleteCabinetDialog
  },
  data() {
    return {
      tags: [],
      areaOptions: [],
      deleteTitle: '提示',
      deleteMessage: '是否确定删除该柜子区域？',
      unBindMessage: '是否确定解绑？',
      tipMessageDetail: '',
      paginationShow: true,
      deleteId: '',
      deleteArea: '',
      codeObj: {},
      btnRoleList: {}, // 按钮权限
      editCabinetBrainForm: null,
      haschecked: true,
      nochecked: false,
      select: '',
      searchval: '',
      tableKey: 0,
      cabinetKey: '',
      list: null,
      total: null,
      listLoading: true,
      bindLoading: false,
      delLoading: false,
      tableList: null,
      // listQuery: {
      //   page: 1,
      //   limit: 10,
      //   importance: undefined,
      //   title: undefined,
      //   type: undefined,
      //   sort: '+id'
      // },
      listQuery: {
        page: 1,
        per_page: 10
      },
      centerDialogVisible: false,
      unBindDialogVisible: false,
      centerDialogVisible2: false,
      editDialogVisible: false,
      gridDialogVisible: false,
      deleteCabinetDialogVisible: false,
      bindMessage: {
        area: '',
        num: ''
      },
      gridForm: {
        key: '',
        no: ''
      },
      cabinetId: '',
      gridId: '',
      active: false, // 绑定class
      ind: '', //
      checked: true, //
      bindList: [],
      bindBoxList: [],
      isClick: false,
      checked_h: true,
      checked_w: false,
      bindCode: '',
      allFormData: {},
      loading: false,
      cupboardNameDisabled: true,
      bindSureLoading: false
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
    addCabinet() {
      this.centerDialogVisible = true
    },
    addCabinetBtn() {
      // 提交添加窗口
      this.getList()
      this.centerDialogVisible = false
    },
    dialogClosedAdd() {
      this.centerDialogVisible = false
    },
    editBrainCabinet(obj) {
      this.editDialogVisible = true
      this.$nextTick(() => {
        this.$refs.dialogCabinetDoc.getCabinetDetail(obj.id)
      })
    },
    editCabinetBtn() {
      // 提交修改窗口
      this.getList()
      this.editDialogVisible = false
    },
    dialogClosedEdit() {
      this.editDialogVisible = false
    },
    dialogClosedDelete() {
      this.unBindDialogVisible = false
    },
    dialogClosedDeleteCabinet() {
      this.deleteCabinetDialogVisible = false
    },
    // 获得table数据
    getList() {
      this.listLoading = true
      listCabinet(this.listQuery).then(response => {
        this.tableList = response.data
        if (this.tableList.length) {
          this.total = Number(response.headers.pagination.split(',')[1])
        } else {
          this.total = 0
        }
        this.listLoading = false
      })
    },
    addclose() {
    },
    // 添加格子
    addCabinettNum() {
      this.gridForm.no = this.bindList.length + 1
      this.gridForm.key = ''
      addGridNum(this.cabinetId, this.gridForm).then(res => {
        // this.gridId = this.bindList[this.ind].id // 格子id
        this.getAllCabinetGrid(this.cabinetId)
        this.getList()
      }).catch(err => {
        console.log(err)
      })
    },
    // 编辑普通柜子
    editCabinet(obj) {
      this.bindMessage.area = obj.area
      this.centerDialogVisible2 = true
      this.cabinetId = obj.id // 柜子id
      this.getAllCabinetGrid(this.cabinetId)
    },
    getAllCabinetGrid(locker_id) {
      cabinetDetailNew(locker_id).then((res) => {
        this.bindList = res.data.grids
        this.bindMessage.num = res.data.grids.length
      }).catch(() => {
        console.log('失败')
      })
    },
    codeClose() {
      this.ind = ''
      this.gridForm.key = ''
      this.gridForm.no = ''
    },
    // 点击格子
    changeBor(obj, index) {
      this.gridForm.no = obj.no // 格子序号
      this.gridId = obj.id // 格子id
      this.cabinetKey = obj.key // 记录格子是否绑定
      this.isClick = true
      this.ind = index // 记录格子位置
      this.bindCode = ''
      this.$refs.myInput.focus()
    },
    // 解绑
    unBindSure() {
      this.gridId = this.bindList[this.ind].id // 格子id
      this.gridForm.no = this.bindList[this.ind].no // 格子序号
      bindCabinetSure(this.cabinetId, this.gridId, this.gridForm).then(res => {
        this.common.message('success', '解绑成功')
        this.$refs.unbindcabinet.dialogClose()
        this.resetData()
        if (this.ind < this.bindList.length) { // 获得下一个格子信息
          this.cabinetKey = this.bindList[this.ind].key
        } else {
          this.gridForm.no = ''
          this.cabinetKey = ''
        }
        this.$refs.myInput.focus()
        this.getAllCabinetGrid(this.cabinetId)
      }).catch(err => {
        console.log(err)
        this.isClick = false
        this.$refs.unbindcabinet.dialogLoadingClose()
      })
    },
    unbindCabinet(obj, index) {
      if (!this.gridForm.no) {
        this.common.message('warning', '请选择柜子')
        return
      }
      if (this.cabinetKey || this.cabinetKey === 0 || this.cabinetKey === '0') {
        this.$refs.unbindcabinet.dialogShow()
      } else {
        this.common.message('warning', '请选择已绑定柜子')
      }
    },
    // 绑定柜子确定
    bindSure() {
      if (!this.gridForm.no) {
        this.common.message('warning', '请选择柜子')
        return
      }
      if (!this.gridForm.key) { // 如果key为空
        if (this.cabinetKey) { // 如果该格子已绑定手牌
          this.unBindDialogVisible = true // 解绑
        } else {
          this.common.message('warning', '该柜子还未绑定手牌') // 如果该格子未绑定手牌
        }
        return
      }
      if (this.gridForm.key.length > 8) {
        this.common.message('warning', '手牌长度最多8位')
        return
      }
      this.gridId = this.bindList[this.ind].id
      this.gridForm.no = this.bindList[this.ind].no // 格子序号
      this.bindSureLoading = true
      bindCabinetSure(this.cabinetId, this.gridId, this.gridForm).then(res => {
        this.common.message('success', '绑定成功')
        this.resetData() // 重置数据
        this.getAllCabinetGrid(this.cabinetId) // 获得所有格子数量
        if (this.ind < this.bindList.length) { // 获得下一个格子信息
          this.cabinetKey = this.bindList[this.ind].key // 记录下一个格子是否绑定手牌
        } else {
          this.gridId = ''
          this.gridForm.no = '' // 格子序号
          this.cabinetKey = ''
        }
        this.bindSureLoading = false
      }).catch(err => {
        console.log(err)
        this.isClick = false
        this.bindSureLoading = false
      })
    },
    resetData() {
      this.bindList[this.ind].key = this.gridForm.key
      this.bindList[this.ind].checked = true
      this.gridForm.key = ''
      this.ind += 1
    },
    // 编辑柜子名字
    editCabinetName() {
      if (!this.bindMessage.area) {
        this.common.message('warning', '区域名称不能为空')
        return false
      }
      let data = { 'area': this.bindMessage.area }
      this.loading = true
      editCabinetNew(this.cabinetId, data).then(res => {
        this.common.message('success', '柜子区域名称修改成功')
        this.cupboardNameDisabled = true
        this.getList()
        this.loading = false
      }).catch(err => {
        console.log(err)
        this.cupboardNameDisabled = true
        this.loading = false
      })
    },
    // 删除
    handleDelete(obj) {
      this.deleteId = obj.id
      this.deleteArea = obj.area
      if (obj.rented_count) {
        this.common.message('info', '该租柜区域下有借出柜子信息，不能删除！')
      } else {
        this.$refs.deleteDialogDoc.dialogShow()
      }
    },
    deleteCabinetSure() {
      deleteCabinet(this.deleteArea, this.deleteId).then(res => {
        this.common.message('success', '删除成功！')
        this.$refs.deleteDialogDoc.dialogClose()
        this.getList()
      }).catch((err) => {
        this.common.message('error', err.data.message)
      })
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
    pageInit() {
      this.paginationShow = false
      this.$nextTick(() => {
        this.paginationShow = true
      })
    },
    tagclose(tag, index) {
      this.common.tagFilter(this, tag, index)
    },
    sortChange(data) {
      this.common.sortFilter(this, data)
    },
    filterChange(data) {
      for (let key in data) {
        this.listQuery[key] = data[key][0]
        this.lotFilter(data, key)
      }
      this.listQuery.page = 1
      this.getList()
    },
    lotFilter(data, key) {
      if (key === 'locker_id') {
        if (!data[key].length) {
          this.hostFilter(data, key, 1, '')
          return
        }
        this.hostFilter(data, key, 1, '区域：' + data[key][0].split(',')[1])
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
    }
  },
  filters: {
  },
  destroyed() {
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.qr{
  width: 40px;
  position: absolute;
  left: 0px;
  top: 0px;
  border-radius: 5px 0 0 5px;
  height: 35px;
  background: url("../../../assets/icon/qr.png") no-repeat;
  background-size: cover;
  background-position: center center;
}
.boxer{
  background-color: transparent;
  padding: 0px;
}
.topTip {
  display: inline-block;
  float: right;
  margin-right: 20px;
}
.add-cabinet-dialog {
  ul {
    list-style: none;
    padding: 0;
    li {
      margin-bottom: 30px;
    }
  }
  .black {
    border: 1px solid #000;
    background: #000;
    color: #fff;
    width: 160px;
    margin-top: 100px;
  }
}
.black {
  border: 1px solid rgb(51,51,51);
  background: rgb(51,51,51);
  color: #fff;
  margin-right: 110px;
}
.edit-name {
  font-size: 24px;
  color: #409EFF;
  margin-right: 115px;
  cursor: pointer;
  vertical-align: middle;
  &.el-checkbox__input {
    width: 24px;
    height: 24px;
    cursor: pointer;
    .el-checkbox__inner{
      width: 24px;
      height: 24px;
      cursor: pointer;
      &::after {
        height: 12px;
        left: 7px;
        top: 2px;
        width: 5px;
      }
    }
  }
}
.addCabinetNum {
  display: inline-block;
  width: 117px;
  border: 1px solid #ddd;
  border-left: none;
  height: 45px;
  line-height: 45px;
  text-align: center;
  font-size: 24px;
  color: #333;
  cursor: pointer;
}

.bind-cabinet-dialog {
  .message {
    padding-left: 20px;
    input {
      border-radius: 3px;
      border: 1px solid #E7EAEC;
      margin-bottom: 20px;
      width: 240px;
      height: 36px;
      text-indent: 16px;
      background: #E7EAEC;
    }
  }
  .overFlow-box {
    height: 315px;
    overflow-y: auto;
  }
  /*滚动条样式*/
  .overFlow-box::-webkit-scrollbar {/*滚动条整体样式*/
      width: 4px;     /*高宽分别对应横竖滚动条的尺寸*/
      height: 4px;
  }
  .overFlow-box::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
      border-radius: 5px;
      -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
      background: rgba(63,195,113,0.9);
  }
  .overFlow-box::-webkit-scrollbar-track {/*滚动条里面轨道*/
      -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
      border-radius: 0;
      background: rgba(63,195,113,0.1);
  }
  .box {
    border-top: 1px solid #ddd;
    .box-top {
      background: #E7EAEC;
      height: 60px;
      line-height: 60px;
      padding-left: 20px;
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
      border-left:1px solid #ddd;
      li {
        float: left;
        width: 14.285%;
        // width: 116.4px;
        text-align: center;
        height: 45px;
        line-height: 45px;
        border: 1px solid #ddd;
        border-left: 0;
        cursor: pointer;
        position: relative;
        color: #999;
        .el-checkbox {
          position: absolute;
          top: -15px;
          right: 0px;
        }
      }
      .isbind {
        color: #000;
      }
      .active {
        border: 1px solid rgb(63,195,113);
      }
    }
  }
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
// .cabinet-container{
//   border:1px solid #ddd;
//   padding: 10px 0;
//   margin-bottom: 15px;
// }
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
.bindBtn {
  background: rgb(51,51,51);
  border: 1px solid rgb(51,51,51);
  margin-left: 5px;
}
</style>
