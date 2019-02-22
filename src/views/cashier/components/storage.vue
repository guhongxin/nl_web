<template>
  <div>
    <div class="find-box2">
    <div style="overflow:hidden" class="filter-container">
      <scan-input :select="searchSelect" :defaultSelect="searchSelect[0].value" @kedownOver="searchlist" ref="scanIputDoc"></scan-input>
      <el-button v-if="btnRoleList['1-5-2-1']" class="lf staffAdd" @click="goodsIdshow"><i class="el-icon-plus"></i> 商品入库</el-button>
      <!-- <el-dropdown trigger="click" @visible-change="goodsIdshow">
        <el-button v-if="btnRoleList['1-5-2-1']" class="lf staffAdd"><i class="el-icon-plus"></i> 商品入库</el-button>
        <el-dropdown-menu slot="dropdown" class="no-padding no-border inputBlack">
          <el-form class="form-container" :model="goods">
            <el-form-item label-width="0px" style="margin-bottom: 0px" prop="goodsID">
              <el-input v-focus="true" @keyup.enter.native="searchGoodId" placeholder="请输入内容" v-model.trim="goods.goodsID">
                <template slot="prepend">商品条码</template>
              </el-input>
            </el-form-item>
          </el-form>
        </el-dropdown-menu>
      </el-dropdown> -->
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
    
    <el-table @filter-change="filterChange" @sort-change="sortChange" stripe :key='tableKey' :data="tableList" v-loading="listLoading" element-loading-text="列表正在加载中" fit highlight-current-row
      style="width: 100%;" class="check-table" border>

      <el-table-column align="center" :label="'商品名称'" prop="name">
        <template slot-scope="scope">
          <span>{{scope.row.goods?scope.row.goods.name:'-'}}</span>
        </template>
      </el-table-column>
      
      <el-table-column align="center" label="条码" prop="barcode">
        <template slot-scope="scope">
          <span>{{scope.row.data?scope.row.data.barcode:'-'}}</span>
        </template>
      </el-table-column>
      
      <el-table-column width="300px" align="center" 
        label="入库时间<i onclick='openDate(event)' data=[1,'created_at_sdate','created_at_edate'] title='入库时间' class='el-icon-date'></i>" 
        sortable='custom' prop="created_at_sort">
        <template slot-scope="scope">
          <span>{{scope.row.created_at}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="'入库数量'" width="200" sortable='custom' prop="quantity_sort">
        <template slot-scope="scope">
          <span>{{scope.row.quantity}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="'进货单价（元）'" width="200" sortable='custom' prop="price_sort">
        <template slot-scope="scope">
          <span>{{scope.row.price}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="实付金额" sortable='custom' prop="real_pay_sort">
        <template slot-scope="scope">
          <span>{{scope.row.real_total_fee}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作人" column-key="employee_id" prop="employee_id"
        :filters="coperatorOptions" filter-placement="bottom-end" :filter-multiple="false">
        <template slot-scope="scope">
          <span>{{scope.row.employee?scope.row.employee.name:'超级管理员'}}</span>
        </template>
      </el-table-column>
     
      <!-- <el-table-column align="center" fixed="right" :label="$t('table.actions')" min-width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" v-if="btnRoleList['1-5-2-2']" type="primary" plain @click="handleEdit(scope.$index, scope.row)">编辑 
          </el-button>
          <el-dropdown trigger="click">
            <el-button size="mini" v-if="btnRoleList['1-5-2-3']" type="danger" plain>删除</el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="handleDelete(scope.$index, tableList)">确定</el-dropdown-item>
              <el-dropdown-item>取消</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
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
    
    <!-- <el-dialog
      title="添加商品"
      :visible.sync="dialogAddVisible"
      width="400px"
      :close-on-click-modal="false"
      @close="handleClose">
      <div class="form-box">
        <el-form :model="addForm" ref="addForm" autoComplete="on" :rules="addFormRule" class="buy-form">
          <el-form-item label-width="0px" style="margin-bottom: 0px" prop="goodsID">
            <el-input v-focus="true" @keyup.enter.native="searchGoodId" placeholder="请输入内容" v-model.trim="goods.goodsID">
              <template slot="prepend" class="test">商品条码</template>
            </el-input>
          </el-form-item>
          <el-form-item label="商品条码：" prop="barcode">
            <el-input v-model="addForm.barcode" placeholder="请输入/扫描商品条码"></el-input>
          </el-form-item>
          <el-form-item prop="price" class="t-c">
            <span slot="label">出货单价：</span>
            <el-input v-model="addForm.price" placeholder="请输入商品价格"></el-input>
          </el-form-item>
          <el-form-item label="商品名称：" prop="name" class="t-c">
            <el-input v-model="addForm.name" placeholder="请输入商品名称"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogAddVisible = false">取 消</el-button>
        <el-button type="primary" :loading='loading' @click="addBtn">确 定</el-button>
      </span>
    </el-dialog> -->

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
          <el-input-number v-model="addItemForm.quantity" @change="computedRealPrice" :min="1" :max="10" label="" @keyup.native="inputKeyUp"></el-input-number>
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

    <el-dialog
        width="400px"
        title="编辑"
        :visible.sync="editDialogVisible"
        append-to-body
        @close="edithandleClose">
        <el-form :model="editform" ref="editform" autoComplete="on" :rules="addFormRule" class="buy-form" label-width="100px">
          <el-form-item label="商品名称：" prop="name">
            <el-input v-model="editform.name" placeholder="请输入商品名称"></el-input>
          </el-form-item>
          <el-form-item label="出货单价：" prop="price">
            <el-input v-model="editform.price" placeholder="请输入商品售价" type="number"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="edititemBtn">确 定</el-button>
        </span>
      </el-dialog>
      <storage-popuo
        v-if="entryStorageVisible"
        :dialogVisible="entryStorageVisible"
        :widthSize="'800px'" @dialogClosed='entryReportPoupClosed' @testReportEntryPopupOK="testReportEntryPopupOK"></storage-popuo>
    <!-- 时间筛选 -->
    <dateRange @timeChange="timeChange"></dateRange>
  </div>
</template>

<script>
import { goodsList, searchGoodsInfoByBarcode, addGoods, deleteGoods, addItemGoods, editGoods } from '@/api/goods'
import { employeeList } from '@/api/employee'
import { testFloat2 } from '@/utils/validate'
import scanInput from '@/components/scanInput'
import storagePopuo from './storagePoPuo'
import dateRange from '@/components/dateRange'

const validatePrice = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('价格不能为空'))
  }
  if (!testFloat2(value)) {
    callback(new Error('价格输入有误'))
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
  }
  callback()
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
    storagePopuo,
    dateRange
  },
  data() {
    return {
      tags: [],
      coperatorOptions: [],
      btnRoleList: {}, // 按钮权限
      saleNum: '',
      saleName: '',
      entryStorageVisible: false,
      editform: {
        price: '',
        name: '',
      },
      addForm: {
        price: '',
        name: '',
        barcode: ''
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
      dialogAddVisible: false,
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
        value: 'goods_name_like'
      }, {
        text: '条码',
        value: 'goods_barcode'
      }],
      searchGroupBtn: '',
      iteminfo: {},
      loading: false,
      itemloading: false,
      tiemstock: false,
      paginationShow: true
    }
  },
  computed: {
  },
  methods: {
    __init() {
      this.common.eachBtnRole(this.btnRoleList) // 按钮权限方法
      this.getList()
    },
    edititemBtn() {
      let self = this
      this.$refs.editform.validate(valid => {
        if (valid) {
          editGoods(self.editform).then(response => {
            self.editDialogVisible = false
            self.$set(self.tableList, self.editform.editindex, response.data)
            this.common.notify('成功', 'success', '编辑成功！')
          }).catch(err => {
            if (err.response.data.status_code === 404) {
              this.common.notify('失败', 'error', err.response.data.message)
            } else {
              console.log(err.response.data)
            }
          })
        } else {
          this.common.notify('错误', 'error', '编辑失败！')
        }
      })
    },
    handleDelete(index, rows) {
      deleteGoods(rows[index].id).then(() => {
        rows.splice(index, 1)
      }).catch(() => {
        this.common.message('error', '删除失败！')
      })
    },
    handleEdit(index, row) {
      this.editform = Object.assign({}, row, { editindex: index })
      this.editform.name = this.editform.goods_name
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
    addBtn() {
      this.loading = true
      this.$refs.addForm.validate(valid => {
        if (valid) {
          addGoods(this.addForm).then(res => {
            this.loading = false
            this.innerVisible = true
            this.addItemForm.goods_id = res.data.id
            this.iteminfo = res.data
            this.dialogAddVisible = false
            this.common.notify('成功', 'success', '商品基本信息添加成功！继续添加详情！')
          }).catch(() => {
            this.common.notify('错误', 'error', '添加失败！')
            this.loading = false
          })
        }
      })
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
      // this.$refs.editform.resetFields()
    },
    searchGoodId() {
      let itemval = this.goods.goodsID
      if (!itemval) {
        return
      }
      searchGoodsInfoByBarcode(itemval).then(res => {
        let item = Object.values(res.data)
        if (item.length) {
          this.innerVisible = true
          this.saleName = res.data.name
          this.saleNum = res.data.stock
          this.addItemForm.goods_id = res.data.id
          this.tiemstock = true
        } else {
          this.tiemstock = false
          this.common.notify('提示', 'info', '未能找到商品，请添加！')
          this.addForm.barcode = itemval
          this.dialogAddVisible = true
        }
      })
      /* .catch(err => {
        if (err.response.data.status_code === 404) {
          this.tiemstock = false
          this.common.notify('提示', 'info', '未能找到商品，请添加！')
          this.addForm.barcode = itemval
          this.dialogAddVisible = true
        }
      }) */
    },
    goodsIdshow(status) {
      console.log(11)
      this.entryStorageVisible = true
      // if (status) {
      //   this.goods.goodsID = ''
      // }
    },
    entryReportPoupClosed() {
      // 关闭
      this.entryStorageVisible = false
    },
    testReportEntryPopupOK() {
      this.getList()
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
      goodsList(this.listQuery).then(response => {
        this.tableList = response.data
        this.total = Number(response.headers.pagination ? response.headers.pagination.split(',')[1] : '0')
        this.listLoading = false
      })
    },
    searchlist(obj) {
      delete this.listQuery.goods_name_like
      delete this.listQuery.goods_barcode
      if (obj.value === '') {
        delete this.tags[0]
      } else {
        let tagszh = {
          goods_name_like: '商品名称',
          goods_barcode: '条码'
        }
        this.tags[0] = { 'name': `${tagszh[obj.type]}:${obj.value}`, 'type': obj.type }
        this.listQuery[obj.type] = obj.value
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
    pageInit() {
      this.paginationShow = false
      this.$nextTick(() => {
        this.paginationShow = true
      })
    },
    inputKeyUp(e) {
      e.target.value = e.target.value.replace(/\D|\./g, '')
    },
    timeChange(param) {
      this.common.chooseTimerFilter(param, this)
    }
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
