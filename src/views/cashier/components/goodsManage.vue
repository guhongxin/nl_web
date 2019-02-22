<template>
  <div>
    <div class="find-box2">
      <div style="overflow:hidden" class="filter-container">
        <scan-input :select="searchSelect" :defaultSelect="searchSelect[0].value" @kedownOver="searchlist" ref="scanIputDoc"></scan-input>

        <el-button v-if="btnRoleList['1-5-4-3']" class="lf staffAdd" @click="handleAddGoods"><i class="el-icon-plus"></i> 添加商品</el-button>
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

    <el-table @filter-change="filterChange" @sort-change="sortChange" stripe :key='tableKey' :data="tableList" v-loading="listLoading" 
    element-loading-text="列表正在加载中" fit highlight-current-row style="width: 100%;" class="check-table" border>

      <el-table-column align="center" :label="'商品名称'" prop="name">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      
       <el-table-column align="center" label="条码" prop="barcode">
        <template slot-scope="scope">
          <span>{{scope.row.barcode}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="'出售单价（元）'" width="200" sortable="custom" prop="sort_price">
        <template slot-scope="scope">
          <span>{{scope.row.price}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="'销量'" width="100" sortable='custom' prop="sales_sort">
        <template slot-scope="scope">
          <span>{{scope.row.sales}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="'库存'" width="100" sortable='custom' prop="stock_sort">
        <template slot-scope="scope">
          <span>{{scope.row.stock}}</span>
        </template>
      </el-table-column>
     
      <el-table-column width="300px" align="center" 
        label="添加时间<i onclick='openDate(event)' data=[1,'created_at_sdate','created_at_edate'] title='添加时间' class='el-icon-date'></i>"
        sortable='custom' prop="created_at_sort">
        <template slot-scope="scope">
          <span>{{scope.row.created_at}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column align="center" label="操作人" column-key="employee_id" prop="employee_id"
        :filters="coperatorOptions" filter-placement="bottom-end" :filter-multiple="false">
        <template slot-scope="scope">
          <span>{{scope.row.employee_name?scope.row.employee_name:'超级管理员'}}</span>
        </template>
      </el-table-column> -->
      <el-table-column width="300px" align="center" 
      label="修改时间<i onclick='openDate(event)' data=[2,'updated_at_sdate','updated_at_edate'] title='修改时间' class='el-icon-date'></i>"
      sortable='custom' prop="updated_at_sort">
        <template slot-scope="scope">
          <span>{{scope.row.updated_at}}</span>
        </template>
      </el-table-column>

  
      <!-- <el-table-column align="center" label="单价（元）" prop="price" sortable='custom' width="130px">
        <template slot-scope="scope">
          <span>{{scope.row.price}}</span>
        </template>
      </el-table-column> -->
     
      <el-table-column align="center" fixed="right" :label="$t('table.actions')" class-name="small-padding fixed-width" min-width="320">
        <template slot-scope="scope">
          <el-button size="mini" v-if="btnRoleList['1-5-4-2']" type="success" plain @click="storageBtn(scope.row)">入库 
          </el-button>
          <el-button size="mini" v-if="btnRoleList['1-5-4-1']" type="primary" plain @click="handleEdit(scope.$index, scope.row)">编辑 
          </el-button>
          <el-button size="mini" v-if="btnRoleList['1-5-4-4']" type="warning" plain @click="handleCheck(scope.row)">库存核对 
          </el-button>
          <el-button size="mini" v-if="btnRoleList['1-5-4-5']" type="danger" plain @click="handleDelete(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination
        v-if="paginationShow"
        background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
        :page-sizes="[10,20,30,50]" :page-size="listQuery.per_page" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <!-- 详情 -->
    <el-dialog
      width="400px"
      title="商品详情"
      :visible.sync="innerVisible"
      append-to-body
      @close="itemhandleClose">
      <el-row v-if="tiemstock" style="margin-bottom:10px;">
        <el-col :span="12"><div class="grid-content" style="text-align:center;font-size:16px;color:#606266;font-weight:600;">商品：{{ saleName }}</div></el-col>
        <el-col :span="12"><div class="grid-content" style="text-align:center;font-size:16px;color:#606266;font-weight:600;">库存：{{ saleNum }}</div></el-col>
      </el-row>
      <el-form :model="addItemForm" ref="addItemForm" autoComplete="on" :rules="addItemFormRule" class="buy-form" label-width="100px">
        <el-form-item label="入库数量：" prop="quantity">
          <el-input-number v-model="addItemForm.quantity" @change="computedRealPrice" :min="1" :max="10" label=""></el-input-number>
        </el-form-item>
        <el-form-item prop="stock_price">
          <span slot="label">进货单价：</span>
          <el-input v-model="addItemForm.stock_price" @keyup.native="computedRealPrice" placeholder="请输入商品价格"></el-input>
        </el-form-item>
        <el-form-item label="实付金额：" prop="real_total_fee">
          <el-input v-model="addItemForm.real_total_fee" placeholder="请输入商品名称" ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="innerVisible = false">取 消</el-button>
        <el-button v-if="tiemstock" type="primary" :loading='itemloading' @click="onceaddbtn">确 定</el-button>
        <el-button v-else type="primary" :loading='itemloading' @click="additemBtn">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑 -->
    <el-dialog
      width="400px"
      title="编辑"
      :visible.sync="editDialogVisible"
      append-to-body
      @close="edithandleClose">
      <el-form :model="editform" ref="editform" autoComplete="on" :rules="addFormRule" class="buy-form" label-width="100px">
        <el-form-item label="商品条码：" prop="barcode">
          <el-input v-model="editform.barcode" type="number"></el-input>
        </el-form-item>
        <el-form-item label="商品名称：" prop="name">
          <el-input v-model="editform.name" placeholder="请输入商品名称"></el-input>
        </el-form-item>
        <el-form-item label="出售单价：" prop="price">
          <el-input v-model="editform.price" placeholder="请输入商品售价"></el-input>
        </el-form-item>
      </el-form>
      <div style="text-align:center;">
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>                                                                             
          <el-button @click="edititemBtn" class="derive" :loading="edititemBtnLoading">确 定</el-button>
        </span>
      </div>
    </el-dialog>

    <!-- 添加商品 -->
    <addGoodsDialog ref="addGoodsDoc"
    @dialogAddGoodsOk="dialogAddGoodsOk"></addGoodsDialog>
    
    <!-- 入库 -->
    <storage-popuo
      v-if="entryStorageVisible"
      :dialogVisible="entryStorageVisible"
      :widthSize="'800px'"
      :barCode="barCode"
      :jumpover="true"
      @dialogClosed='entryReportPoupClosed' 
      @testReportEntryPopupOK="testReportEntryPopupOK"></storage-popuo>

    <!-- 删除 -->
    <delete-dialog 
      :tipMessage="deleteMessage"
      ref="deleteDialogDoc"
      @deleteSureBtn='deleteCustomerSure'></delete-dialog>
    
    <!-- 财务核对 -->
    <financial-check 
      ref="financialCheckDoc"
      @financeCheckBtn='financeCheckBtn'></financial-check>

    <!-- 时间筛选 -->
    <dateRange @timeChange="timeChange"></dateRange>
  </div>
</template>

<script>
import { getGoodsList, deleteGoods, addItemGoods, editGoods } from '@/api/goods'
import { employeeList } from '@/api/employee'
import { testFloat2, testNumberInt } from '@/utils/validate'
import scanInput from '@/components/scanInput'
import addGoodsDialog from './addGoodsDialog'
import storagePopuo from './storagePoPuo'
import dateRange from '@/components/dateRange'
import deleteDialog from '@/components/deleteDialog'
import financialCheck from './financialCheck'

const validatePrice = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('出货单价不能为空'))
  } else if (!testFloat2(value)) {
    callback(new Error('出货单价为正数，且只可保留两位小数'))
  } else if (Number(value) > 99999999) {
    callback(new Error('出货单价必须小于99999999'))
  } else if (Number(value) === 0) {
    callback(new Error('出货单价必须大于0'))
  }
  callback()
}
const validateStock_price = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('入库单价不能为空'))
  }
  if (!testFloat2(value)) {
    callback(new Error('入库单价输入有误'))
  }
  callback()
}
const validateReal_total_fee = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('实付金额不能为空'))
  }
  if (!testFloat2(value)) {
    callback(new Error('实付金额输入有误'))
  }
  callback()
}
const validateName = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('商品名称不能为空'))
  }
  callback()
}
const validateBarcode = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('商品条码不能为空'))
  } else if (!testNumberInt(value)) {
    callback(new Error('条码必须为纯数字'))
  } else if (value.toString().length > 17) {
    callback(new Error('输入条码个数不超过17位'))
  } else {
    callback()
  }
}
const validateQuantity = (rule, value, callback) => {
  if (value === '' || value === 0 || typeof (value) === 'undefined') {
    callback(new Error('入库数量不能为空或者0'))
  }
  callback()
}

export default {
  name: 'customerPotential',
  components: {
    scanInput,
    addGoodsDialog,
    storagePopuo,
    dateRange,
    deleteDialog,
    financialCheck
  },
  data() {
    return {
      tags: [],
      deleteMessage: '确定删除该商品？',
      deleteId: '',
      coperatorOptions: [],
      btnRoleList: {}, // 按钮权限
      saleNum: '',
      saleName: '',
      editform: {
        barcode: '',
        price: '',
        name: '',
      },
      addFormRule: {
        price: [{ required: true, trigger: 'blur', validator: validatePrice }],
        name: [{ required: true, trigger: 'blur', validator: validateName }],
        barcode: [{ required: true, trigger: 'blur', validator: validateBarcode }]
      },
      addItemForm: {
        quantity: '',
        stock_price: '',
        real_total_fee: '',
        goods_id: ''
      },
      addItemFormRule: {
        quantity: [{ required: true, trigger: 'blur', validator: validateQuantity }],
        stock_price: [{ required: true, trigger: 'blur', validator: validateStock_price }],
        real_total_fee: [{ required: true, trigger: 'blur', validator: validateReal_total_fee }]
      },
      goods: {
        goodsID: '',
      },
      // dialogAddVisible: false,
      innerVisible: false,
      editDialogVisible: false,
      select: '',
      searchval: '',
      tableKey: 0,
      tableList: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        per_page: 10
      },
      searchSelect: [{
        text: '商品名称',
        value: 'name_like'
      }, {
        text: '条码',
        value: 'barcode'
      }],
      searchGroupBtn: '',
      iteminfo: {},
      loading: false,
      itemloading: false,
      tiemstock: false,
      paginationShow: true,
      entryStorageVisible: false,
      barCode: '',
      edititemBtnLoading: false
    }
  },
  computed: {
  },
  methods: {
    __init() {
      this.common.eachBtnRole(this.btnRoleList) // 按钮权限方法
      this.getList()
    },
    sortChange(data) {
      this.common.sortFilter(this, data)
    },
    edititemBtn() {
      let self = this
      this.$refs.editform.validate(valid => {
        if (valid) {
          this.edititemBtnLoading = true
          editGoods(self.editform).then(response => {
            self.editDialogVisible = false
            self.$set(self.tableList, self.editform.editindex, response.data)
            this.common.message('success', '编辑成功！')
            this.edititemBtnLoading = false
          }).catch(err => {
            this.edititemBtnLoading = false
            if (err.response.data.status_code === 404) {
              this.common.message('error', err.response.data.message)
            } else {
              console.log(err.response.data)
            }
          })
        } else {
          console.log('编辑失败！')
        }
      })
    },
    // 财务核对
    handleCheck(obj) {
      this.$refs.financialCheckDoc.dialogShow(obj)
    },
    financeCheckBtn() {
      this.getList()
    },
    // 删除商品
    handleDelete(row) {
      this.deleteId = row.id
      this.$refs.deleteDialogDoc.dialogShow()
    },
    deleteCustomerSure() {
      deleteGoods(this.deleteId).then(res => {
        this.common.message('success', '删除成功！')
        this.$refs.deleteDialogDoc.dialogClose()
        this.getList()
      }).catch((err) => {
        console.log(err)
        this.$refs.deleteDialogDoc.dialogLoadingClose()
      })
    },
    handleEdit(index, row) {
      this.editform = Object.assign({}, row, { editindex: index })
      this.editDialogVisible = true
    },
    computedRealPrice(v) {
      let doc = v.target
      let reg = /^[0-9/.]+$/
      if (!reg.test(doc.value)) {
        this.addItemForm.stock_price = doc.value.substring(0, doc.value.length - 1)
      }
      if (!this.addItemForm.quantity || !this.addItemForm.stock_price) {
        return
      }
      if (v.keyCode === 110 || v.keyCode === 190) {
        return
      }
      if (!testFloat2(this.addItemForm.stock_price)) {
        this.common.message('error', '入库单价输入有误，若有小数请忽略此信息')
        return
      }
      this.addItemForm.real_total_fee = this.addItemForm.quantity * this.addItemForm.stock_price
    },
    onceaddbtn() {
      this.itemloading = true
      this.$refs.addItemForm.validate(valid => {
        if (valid) {
          addItemGoods(this.addItemForm).then(req => {
            this.common.notify('成功', 'success', '库存更新成功！')
            this.innerVisible = false
            this.itemloading = false
            this.getList()
          })
        }
      })
    },
    additemBtn() {
      this.itemloading = true
      this.$refs.addItemForm.validate(valid => {
        if (valid) {
          addItemGoods(this.addItemForm).then(req => {
            this.tableList.unshift(Object.assign({}, this.iteminfo, req.data.goods))
            this.common.notify('成功', 'success', '商品已经成功添加！')
            this.innerVisible = false
            this.itemloading = false
          })
        }
      })
    },
    handleClose() {
      this.$refs.addForm.resetFields()
    },
    itemhandleClose() {
      this.$refs.addItemForm.resetFields()
    },
    edithandleClose() {
      this.editform.name = ''
      this.editform.price = ''
      this.editform.barcode = ''
      // this.$refs.editform.resetFields()
    },
    // searchGoodId() {
    //   let itemval = this.goods.goodsID
    //   if (!itemval) {
    //     return
    //   }
    //   searchGoodsInfoByBarcode(itemval).then(res => {
    //     let item = Object.values(res.data)
    //     if (item.length) {
    //       this.innerVisible = true
    //       this.saleName = res.data.name
    //       this.saleNum = res.data.stock
    //       this.addItemForm.goods_id = res.data.id
    //       this.tiemstock = true
    //     } else {
    //       this.tiemstock = false
    //       this.common.notify('提示', 'info', '未能找到商品，请添加！')
    //       this.addForm.barcode = itemval
    //       this.dialogAddVisible = true
    //     }
    //   })
    //   /* .catch(err => {
    //     if (err.response.data.status_code === 404) {
    //       this.tiemstock = false
    //       this.common.notify('提示', 'info', '未能找到商品，请添加！')
    //       this.addForm.barcode = itemval
    //       this.dialogAddVisible = true
    //     }
    //   }) */
    // },
    goodsIdshow(status) {
      if (status) {
        this.goods.goodsID = ''
      }
    },
    // 根据index选择潜在客户类别，对应高亮显示
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
    filterSalesman(value, row, column) {
      if (this.salesmanindex === 0) {
        this.listQuery.salesman = value
        this.getList()
        this.salesmanindex = 1
      } else {
        return false
      }
    },
    getList() {
      this.listLoading = true
      getGoodsList(this.listQuery).then(response => {
        this.tableList = response.data
        this.total = Number(response.headers.pagination.split(',')[1])
        this.listLoading = false
      })
    },
    // 添加商品
    handleAddGoods() {
      this.$refs.addGoodsDoc.dialogShow()
    },
    dialogAddGoodsOk() {
      this.getList()
    },
    searchlist(obj) {
      this.searchSelect.map(item => {
        delete this.listQuery[item.value]
      })
      if (obj.value.length === 0) {
        delete this.listQuery[obj.type]
        delete this.tags[0]
      } else {
        let tagszh = {
          name_like: '商品名称',
          barcode: '条码'
        }
        this.listQuery[obj.type] = obj.value
        this.tags[0] = { 'name': `${tagszh[obj.type]}:${obj.value}`, 'type': obj.type }
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
    pageInit() {
      this.paginationShow = false
      this.$nextTick(() => {
        this.paginationShow = true
      })
    },
    storageBtn(row) {
      this.barCode = row.barcode
      this.entryStorageVisible = true
    },
    entryReportPoupClosed() {
      // 关闭
      this.entryStorageVisible = false
      this.getList()
    },
    testReportEntryPopupOK() {
      this.getList()
    },
    timeChange(param) {
      // 时间筛选
      this.common.chooseTimerFilter(param, this)
    },
    employeeNameList() {
      this.coperatorOptions = []
      employeeList().then(response => {
        let data = response.data
        data.map(item => {
          // 获取操作人
          this.coperatorOptions.push({ text: item.name, value: item.id + ',' + item.name, class: 'cemployee_id' })
        })
        this.coperatorOptions.unshift({ text: '超级管理员', value: '3,超级管理员', class: 'cemployee_id' })
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
        // if (data[key].length !== 0) {
        //   this.lotFilter(data, key)
        // } else {
        //   this.lotFilter(data, key)
        //   delete this.listQuery[key]
        // }
      }
      this.listQuery.page = 1
      this.pageInit()
      this.getList()
    },
    lotFilter(data, key) {
      let font = ''
      if (data[key].length) {
        if (data[key][0].split(',')) {
          font = data[key][0].split(',')[1]
        }
      }
      if (key === 'employee_id') {
        if (!data[key].length) {
          this.hostFilter(data, key, 2, '')
          return
        }
        this.hostFilter(data, key, 2, '操作人：' + font)
      }
    },
    hostFilter(data, key, index, text) {
      if (data[key].length === 0) {
        delete this.tags[index]
      } else {
        this.$set(this.tags, index, { name: text, type: key })
      }
    },
    // inputNub(e) {
    //   // 入库单价不能输入非数字或者小数点开头
    //   let doc = e.target
    //   let reg = /^[0-9/.]+$/
    //   if (!reg.test(doc.value)) {
    //     this.addForm.price = doc.value.substring(0, doc.value.length - 1)
    //   }
    // },
    // inputNub1(e) {
    //   // 入库单价不能输入非数字或者小数点开头
    //   let doc = e.target
    //   let reg = /^[0-9/.]+$/
    //   if (!reg.test(doc.value)) {
    //     this.addItemForm.real_total_fee = doc.value.substring(0, doc.value.length - 1)
    //   }
    // }
  },
  created() {
    this.__init()
    this.employeeNameList()
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
.derive{
  background: rgb(51, 51, 51);
  color: #fff;
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
.lf{float: left;}
.qr{
  width: 36px;
  position: absolute;
  left: 0;
  top: 0;
  height: 36px;
  background: url("../../../assets/icon/qr.png") no-repeat;
  background-size: contain;
}
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
.lock{
  color: rgb(241, 76, 48);
}
.no-lock{
  color: rgb(28, 132, 198);
}
.pagination-container{
  text-align:right;
}
.staffAdd{
  background: rgb(51, 51, 51) !important;
  margin-left: 20px;
  color: #fff !important;
}
.form-box .el-form-item__content .el-input-group__prepend{
  background-color: #333333;
  color: #ffffff;
}
</style>
