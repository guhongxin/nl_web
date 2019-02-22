<template>
  <div>
    <div class="find-box" style="border-bottom:none">
      <div style="overflow:hidden" class="filter-container">
        <scan-input ref="scaninput" :select="searchSelect" :defaultSelect="searchSelect[0].value" @kedownOver="searchInfo" :placeholder="placeholder"></scan-input>
        <el-button class="derive" @click="resetGoodsDetial"><i class="el-icon-delete"></i> 清空需购商品</el-button>
      </div>
    </div>
    <el-row class="goods-out">
  	  <el-col :span="18">
  		<div class="title-tip">选择支付方式</div>
  		<ul class="pay-method">
  			<li data-type="现金" @click="show(1)"></li>
  			<li data-type="银行卡" @click="show(4)"></li>
  			<li data-type="微信" @click="show(3)"></li>
  			<li data-type="支付宝" @click="show(2)"></li>
        <li data-type="储值卡" @click="show(5)"></li>
  		</ul>
  	  </el-col>
  	  <el-col :span="6">
  		<div class="title-tip">应付金额</div>
  		<div class="total-money">￥{{totlePrice}}</div>
  	  </el-col>
  	</el-row>

    <el-table stripe :key='1' :data="tableList" 
      fit highlight-current-row 
      border
      class="check-table table-border-right">

      <!-- <el-table-column align="center" type="selection" width="55px"></el-table-column> -->
      <el-table-column align="center"  :label="'商品名称'" prop="scope.row.sex">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center"  :label="'条码'"  prop="scope.row.barcode">
        <template slot-scope="scope">
          <span>{{scope.row.barcode}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="'单价（元）'"  prop="">
        <template slot-scope="scope">
          <span>{{scope.row.price}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="'库存'"  prop="">
        <template slot-scope="scope">
          <span>{{scope.row.stock}}</span>
        </template>
      </el-table-column>
      
      <el-table-column align="center" :label="'购买数量'" width="350" prop="number">
        <template slot-scope="scope">
			    <el-input-number v-model="scope.row.number" 
            @change="handleChange"
            class="goodnumber"
            @keyup.native="inputKeyUp"
            :min="1" :max="scope.row.stock"  label="描述文字"></el-input-number>
        </template>
      </el-table-column>
      
      <el-table-column align="center" :label="'小计（元）'" width="250" prop="">
        <template slot-scope="scope">
          <span>{{(scope.row.number * (scope.row.price * 100) / 100).toFixed(2)}}</span>
        </template>
      </el-table-column>
      
      <el-table-column align="center" fixed="right" :label="$t('table.actions')" min-width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="info" plain @click="handleDelete(scope.$index, tableList)" style="color:#333333;background: #E7EAEC;border: 1px solid #CCCCCC;width:80px;">移除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <el-dialog
      title="收款确认"
      :visible.sync="centerDialogVisible"
      width="900px"
      class="goods-dialog"
      :before-close="resetPayMethodDialog" @close="closeReset">
      <el-row class="pay-dialog">
        <el-col :span="12" class="pay-box">
          <div class="title-tip">收取<span>（{{payTypes}}）</span></div>
          <div class="total-money">￥{{totlePrice}}</div>
        </el-col>
        <el-col :span="12" class="pay-box">
          <div class="title-tip">购买客户</div>
          <div class="pay-menber" @click="opencustomerlist">
           <span class="menber-img"><img :src="customerHeadIcon" alt=""></span>
           <div class="message">
             <span class="title">{{customerName}}</span>
             <span class="phone">手机号码：<span>{{customerPhone}}</span></span>
           </div>
          </div>
        </el-col>
      </el-row>
      <div class="pay-msgBox">
        <div class="pay-money">
          <span for="">销售员工</span>
          <div></div>
          <el-select class="input" v-model="outGoodsDetial.sell_id" style="width: 100%" filterable placeholder="请选择/搜索销售人">
            <el-option
              v-for="(item, key) in selectoptions"
              :key="key"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="pay-money">
          <span for="">实付金额（元）</span>
          <el-input placeholder="请输入金额" v-model="rightInput" type="number" class="input pay-money-box" @blur="inputCheck" >
          </el-input>
        </div>
        <div class="pay-money" v-if="payTypes==='储值卡支付'">
          <span for="">储值卡号</span>
          <el-input v-model="petCardNo" placeholder="请输入储值卡号" 
            :suffix-icon="cardInputIcon"
            @focus="cardInputFocus"
            class="input pay-money-box">
            <template slot="prepend"><i class="qr"></i></template>
            <el-button slot="append" icon="el-icon-search" @click="petCardNoInput"></el-button>
          </el-input>
        </div>
        <div class="pay-message">
          <span for="">出库备注（选填）</span>
          <el-input placeholder="用于说明特殊情况备注" v-model="mark" class="input" :maxlength="20">
          </el-input>
        </div>
      </div>

      <div style="text-align:center;margin-top:15px;">
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="goodsOutLastStap" :loading="goodsOutLastStapLoading" :disabled="submitBug">确认收款</el-button>
        </span>
      </div>
    </el-dialog>

    <el-dialog
      title="客户选择"
      :visible.sync="centerDialogVisible1"
      width="1100px" class="menber-choose">
      <div class="menber-scaninput" style="overflow:hidden">
        <scan-input :select="customerSearchSelect" :defaultSelect="customerSearchSelect[0].value" @kedownOver="customerSearchInfo"></scan-input>
      </div>
      
      <el-table stripe :key='1' :data="customerListData" v-loading="listLoading" element-loading-text="列表正在加载中" fit highlight-current-row
        border
        class="check-table table-border-right"
        style="width: 100%;height:558px;overflow-y:auto;margin-top:10px">
          <el-table-column align="center" :label="'客户名称'">
            <template slot-scope="scope">
              <span>{{scope.row.name}}</span>
            </template>
          </el-table-column>
          
          <el-table-column width="50px" :label="'头像'" style="text-align: center;">
            <template slot-scope="scope">
              <span><img :src="scope.row.head_portrait?scope.row.head_portrait:defaulthead" alt="icon" width="30" height="30" style="display: list-item;border-radius:50%;"></span>
            </template>
          </el-table-column>
          
          <el-table-column align="center" :label="'手机号码'">
            <template slot-scope="scope">
              <span>{{scope.row.phone}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" :label="'会员卡号'">
            <template slot-scope="scope">
              <span>{{scope.row.vips[0]?scope.row.vips[0].card_no : '无会员卡'}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" :label="'操作'" min-width="80" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" plain @click="chooseOver(scope.$index, scope.row)">选择
              </el-button>
            </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <div class="pagination-container">
          <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
            :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div>
      </span>
    </el-dialog>
    
    <!-- 商品列表 -->
    <goods-list
      :dialogVisible="GoodsListdialogVisible" 
      v-if="goodData.data.length"
      @dialogClosed="dialogClosed"
      :goodData="goodData"
      @handleEdit="handleEdit"
      @handleCurrentChange="handleCurrentChange1"></goods-list>
  </div>
</template>

<script>
import { customerList } from '@/api/customer'
import { searchGoodsInfoByBarcode, outGoods, getGoodsList } from '@/api/goods'
import scanInput from '@/components/scanInput'
import { employeeList } from '@/api/employee'
import GoodsList from './goodsList'
import { creatnoticeDom } from '@/utils/comm'
import { testFloat2 } from '@/utils/validate'
import { cardsNoList } from '@/api/vipcardGl'
export default {
  name: 'goodsOut',
  components: {
    scanInput,
    GoodsList
  },
  data() {
    return {
      searchSelect: [{
        text: '条码',
        value: 'barcode'
      }, {
        text: '商品名称',
        value: 'name_like'
      }],
      customerSearchSelect: [{
        text: '手机号码',
        value: 'phone'
      }, {
        text: '姓名',
        value: 'name'
      }],
      selectoptions: [],
      customerHeadIcon: '',
      customerName: '选择客户',
      customerPhone: '无',
      customerId: '',
      select: '',
      searchval: '',
      tableKey: 0,
      customerListData: null,
      total: null,
      listLoading: true,
      centerDialogVisible: false,
      centerDialogVisible1: false,
      payTypes: '',
      rightInput: 0,
      mark: '',
      num1: 1,
      tableList: [],
      listQuery: {
        page: 1,
        per_page: 10
      },
      placeholder: '请扫描商品编号/条形码/输入要添加的内容',
      outGoodsDetial: {
        customer_id: undefined,
        goods: [],
        payment_method: null,
        remark: '',
        real_total_fee: '',
        payment_online: null,
        sell_id: 2,
        source: 0
      },
      once: 0, // 防止多次扫描同一类产品，会出现库存冲突问题！
      goodsOutLastStapLoading: false, // 等待
      GoodsListdialogVisible: true, // 商品列表弹窗
      goodsListQuery: {
        page: 1,
        per_page: 10
      },
      goodData: {
        data: []
      }, // 商品名称搜索的列表
      cardsId: undefined, // 储值卡id
      cardsNoList: [], // 有效储值
      petCardNo: '', // 会员卡号
      submitBug: false, // 提交有错误
      cardsNoErr: false, // 储值卡号错误
      hasCardsdNo: false, // 是否输入储值卡号
      ispetCardNoBtn: false // 是否点击储值卡号查找按钮
    }
  },
  computed: {
    totlePrice() {
      let money = 0
      for (let i = 0; i < this.tableList.length; i++) {
        money += (this.tableList[i].number * (Number(this.tableList[i].price) * 100) / 100)
      }
      return ((parseFloat(money) * 100) / 100).toFixed(2)
    },
    cardInputIcon() {
      return this.hasCardsdNo ? this.cardsNoErr ? 'el-icon-error' : 'el-icon-success' : ''
    }
  },
  created() {
    this.getEmployeeList()
  },
  mounted() {
  },
  methods: {
    __init() {
      // 获取员工
      this.tableList = []
      this.getEmployeeList()
    },
    getEmployeeList() {
      // 每次请求员工时，将员工清空
      this.selectoptions = []
      employeeList().then(res => {
        let data = res.data.filter(currentValue => {
          return currentValue.status === 1
        })
        this.selectoptions.push({ value: 2, label: '待分配' })
        for (let val of data) {
          this.selectoptions.push({ value: val.id, label: val.name })
        }
      })
    },
    closeReset() {
      this.outGoodsDetial.remark = ''
      this.mark = ''
      this.cardsId = undefined
    },
    // 搜索购买会员
    customerSearchInfo(obj) {
      this.listQuery.column = obj.type
      this.listQuery.value = obj.value
      this.listQuery.page = 1
      this.opencustomerlist()
    },
    // 选择购买会员列表
    opencustomerlist() {
      this.centerDialogVisible1 = true
      this.getCustomerList()
    },
    getCustomerList() {
      // 获取会员列表
      customerList(this.listQuery).then(response => {
        this.customerListData = response.data
        this.total = Number(response.headers.pagination.split(',')[1])
        this.listLoading = false
      })
    },
    // 最后结算
    goodsOutLastStap() {
      this.outGoodsDetial.debit_card_id = undefined
      if (!this.rightInput) {
        this.common.message('error', '实付金额输入有误！')
        return
      }
      let payMoneyBox = document.querySelector('.pay-money-box')
      if (payMoneyBox.lastChild.tagName === 'P') {
        this.common.message('warning', payMoneyBox.lastChild.innerHTML)
        return false
      }
      this.outGoodsDetial.real_total_fee = this.rightInput
      this.outGoodsDetial.remark = this.mark
      this.outGoodsDetial.customer_id = this.customerId
      if (this.outGoodsDetial.sell_id === null) {
        this.common.message('warning', '请选择销售员工！')
        return
      }
      if (this.outGoodsDetial.payment_method === 5) {
        // 储值卡支付
        if (this.ispetCardNoBtn) {
          // 如果点击根据储值卡查找按钮
          this.storePay()
        } else {
          // 没有点击根据储值卡查找按钮，先去找这张储值卡
          this.petCardNoInput().then(res => {
            if (res.success) {
              this.storePay()
            }
          }).catch(err => {
            console.log(err)
          })
        }
      } else {
        this.beginAfter()
      }
    },
    storePay() {
      if (!this.cardsId) {
        this.common.message('error', '请选择支付的储值卡号')
        return false
      }
      if (Number(this.outGoodsDetial.real_total_fee) > this.cardsNoList[0].balance) {
        this.common.message('error', '所选的储值卡剩余金额不足，请选择其它储值卡或更换支付方式')
        return false
      }
      this.outGoodsDetial.debit_card_id = this.cardsId
      this.beginAfter()
    },
    beginAfter() {
      // 开始向后端传递数据
      let that = this
      this.goodsOutLastStapLoading = true
      outGoods(this.outGoodsDetial).then(res => {
        this.common.notify('成功', 'success', '已成功付款！')
        this.resetGoodsDetial()
        this.loadTimer = setTimeout(function() {
          that.goodsOutLastStapLoading = false
        }, 500)
      }).catch((err) => {
        let message = err.response
        this.common.message('error', message.data.message)
        this.goodsOutLastStapLoading = false
      })
    },
    handleDelete(index, rows) {
      rows.splice(index, 1)
    },
    resetGoodsDetial() {
      this.outGoodsDetial.customer_id = undefined
      this.outGoodsDetial.goods = []
      this.outGoodsDetial.payment_method = null
      this.outGoodsDetial.remark = ''
      this.outGoodsDetial.real_total_fee = ''
      this.outGoodsDetial.payment_online = null
      this.outGoodsDetial.sell_id = 2
      this.customerHeadIcon = ''
      this.customerName = '选择客户'
      this.customerPhone = '无'
      this.customerId = ''
      this.tableList.splice(0, this.tableList.length)
      this.centerDialogVisible = false
    },
    resetPayMethod() {
      // 复位支付弹窗
      this.outGoodsDetial.sell_id = 2
      this.customerHeadIcon = ''
      this.customerName = '选择客户'
      this.customerPhone = '无'
      this.customerId = ''
      this.rightInput = ''
      this.mark = ''
    },
    searchInfo(obj) {
      if (!obj.value.trim()) {
        this.common.message('warning', '请扫描商品编号/条形码/输入要添加的内容！')
        return
      }
      if (this.once === 0) {
        this.once = 1
        if (obj.type === 'barcode') {
          searchGoodsInfoByBarcode(obj.value).then(res => {
            this.once = 0
            if (Object.keys(res.data).length) {
              if (res.data.stock === 0) {
                this.common.message('warning', '该商品暂无库存！')
              } else {
                res.data.number = 1
                this.tableList.push(res.data)
                this.$refs.scaninput.clear()
              }
            } else {
              this.common.message('error', '此商品未录入至系统中！')
            }
          })
        } else if (obj.type === 'name_like') {
          // 输入商品名称查找
          this.goodsListQuery.name_like = obj.value
          this.GetGoodsList().then(res => {
            this.once = 0
            this.GoodsListdialogVisible = true
            this.goodData = res
          }).catch(err => {
            this.once = 0
            this.common.message('error', err.message)
          })
        }
      }
    },
    handleChange(value) {
      if (value === undefined) {
        this.common.message('warning', '购买数量不能为空！')
      }
    },
    show(val) {
      this.resetStoreCardParam()
      if (!this.tableList.length) {
        this.common.message('error', '注意：暂无商品加入列表！无法支付！')
        return
      }
      switch (val) {
        case 1:
          this.payTypes = '现金支付'
          this.outGoodsDetial.payment_online = 0
          break
        case 2:
          this.payTypes = '支付宝支付'
          this.outGoodsDetial.payment_online = 0
          break
        case 3:
          this.payTypes = '微信支付'
          this.outGoodsDetial.payment_online = 0
          break
        case 4:
          this.payTypes = '银行卡支付'
          this.outGoodsDetial.payment_online = 0
          break
        case 5:
          this.payTypes = '储值卡支付'
          this.outGoodsDetial.payment_online = 0
          break
      }
      this.outGoodsDetial.payment_method = val
      this.outGoodsDetial.goods = []
      for (let value of this.tableList) {
        this.outGoodsDetial.goods.push({ goods_id: value.id, quantity: value.number })
      }
      this.centerDialogVisible = true
      this.rightInput = this.totlePrice
    },
    chooseOver(index, row) {
      this.customerHeadIcon = row.head_portrait
      this.customerName = row.name
      this.customerPhone = row.phone
      this.customerId = row.id
      // this.outGoodsDetial.sell_id = row.employee_id
      this.centerDialogVisible1 = false
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getCustomerList()
    },
    handleSizeChange(val) {
      this.listQuery.per_page = val
      this.getCustomerList()
    },
    resetPayMethodDialog() {
      // 关闭支付弹窗
      this.resetPayMethod()
      this.centerDialogVisible = false
    },
    GetGoodsList() {
      // 搜索商品列表
      return new Promise((resolve, reject) => {
        getGoodsList(this.goodsListQuery).then(res => {
          let _data = res.data
          if (Object.keys(res.data).length) {
            let obj = {
              total: Number(res.headers.pagination.split(',')[1]),
              data: _data,
            }
            resolve(obj)
          } else {
            reject({ message: '此商品未录入至系统中' })
          }
        }).catch(err => {
          console.log(err)
          reject({ message: '此商品未录入至系统中' })
        })
      })
    },
    dialogClosed() {
      // 关闭商品列表
      this.GoodsListdialogVisible = false
      this.goodsListQuery.page = 1
    },
    handleEdit(param) {
      // 商品列表选择按钮
      let obj = Object.assign({}, param, { number: 1 })
      this.tableList.push(obj)
      this.$refs.scaninput.clear()
      this.dialogClosed()
    },
    handleCurrentChange1(param) {
      // 商品列表页码改变
      this.goodsListQuery.page = param
      this.GetGoodsList()
    },
    inputCheck(e) {
      let doc = e.target
      let _val = doc.value
      if (!testFloat2(_val) || _val === '0') {
        creatnoticeDom(doc, false, '实付金额必须大于0，且只可保留两位小数')
        return
      }
      creatnoticeDom(doc, !(Number(_val) > 99999999), '实付金额小于99999999')
    },
    inputKeyUp(e) {
      e.target.value = e.target.value.replace(/\D|\./g, '')
    },
    petCardNoInput() {
      // 根据储值卡号去查找储值卡
      return new Promise((resolve, reject) => {
        this.submitBug = false
        this.cardsNoErr = false
        if (!this.petCardNo) {
          reject({ success: false })
          this.$message({
            type: 'warning',
            message: '请输入储值卡号'
          })
          return false
        }
        this.ispetCardNoBtn = true
        cardsNoList({ card_no: this.petCardNo }).then(res => {
          this.hasCardsdNo = true
          let data = res.data
          if (data && data.length > 0) {
            if (data[0].card_status !== 0) {
              this.cardsNoErr = true
              let _msg = ''
              switch (data[0].card_status) {
                case 1: _msg = '储值卡已锁定，请重新输入其它储值卡号'
                  break
                case 2: _msg = '储值卡未开卡，请重新输入其它储值卡号'
                  break
                case 3: _msg = '储值卡已失效，请重新输入其它储值卡号'
                  break
              }
              this.$message({
                type: 'warning',
                message: _msg
              })
              this.submitBug = true
              reject({ success: false })
              return false
            }
            this.cardsNoErr = false
            this.cardsNoList = data
            this.cardsId = data[0].id
            resolve({ success: true })
          } else {
            this.$message({
              type: 'warning',
              message: '输入储值卡号不存在，请重新输入'
            })
            this.submitBug = true
            this.cardsNoErr = true
            reject({ success: false })
          }
        }).catch(err => {
          console.log(err)
          this.hasCardsdNo = true
          this.submitBug = true
          this.cardsNoErr = true
          reject({ success: false })
        })
      })
    },
    resetStoreCardParam() {
      // 复位储值卡相关参数
      this.cardsId = undefined
      this.petCardNo = ''
      this.cardsNoList = []
      this.submitBug = false
      this.cardsNoErr = false
      this.hasCardsdNo = false
      this.ispetCardNoBtn = false
      this.iscardsPaymeth = false
    },
    cardInputFocus() {
      this.cardsNoErr = false
      this.hasCardsdNo = false
      this.ispetCardNoBtn = false
      this.submitBug = false
    }
  },
  filters: {
  },
  destroyed() {
    // 清除提交等待时间定时器
    clearTimeout(this.loadTimer)
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.goods-dialog {
  /deep/ .el-dialog__header{
    border-bottom: 1px solid #cccccc;
  }
}
.searchgroup .el-select .el-input {
  width: 140px;
  padding-left: 36px;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
  overflow: hidden;
}
.goods-out {
	border:1px solid #ddd;
	padding: 10px;
	margin-bottom: 10px;
	.total-money {
		font-size: 64px;
		color: #F14C30;
		margin-left: -10px;
	}
	.title-tip {
		font-size: 20px;
	}
	.pay-method {
		overflow: hidden;
		li {
			float: left;
			width: 140px;
			height: 50px;
			list-style: none;
			margin-right: 15px;
			cursor: pointer;
			&:first-child {
				background-image: url('../../../assets/cashier/cashier-1.png');
			}
			&:nth-child(2) {
				background-image: url('../../../assets/cashier/cashier-2.png');
			}
			&:nth-child(3) {
				background-image: url('../../../assets/cashier/cashier-3.png');
			}
      &:nth-child(4) {
				background-image: url('../../../assets/cashier/cashier-4.png');
			}
			&:last-child {
				background-image: url('../../../assets/cashier/cashier-5.png');
			}
			&:hover {
				background-color: #ccc;
			}
		}
	}
}
.pay-dialog {
  .pay-box {
    padding-left: 30px;
    .title-tip {
      font-size: 36px;
      line-height: 80px;
      text-align: left;
    }
    .total-money {
      color: #F14C30;
      font-size: 64px;
      line-height: 80px;
      margin-left: -10px;
    }
    .pay-menber {
      width: 300px;
      height: 80px;
      border: 1px solid #ccc;
      background-color: #E7EAEC;
      .menber-img {
        display: block;
        width: 60px;
        height: 60px;
        background-image: url('../../../assets/cashier/people.png');
        background-size: cover;
        margin-left: 10px;
        margin-top: 10px;
        float: left;
        cursor: pointer;
        img {
          width: 60px;
          height: 60px;
          border-radius: 50%;
        }
      }
      .message {
        display: block;
        position: relative;
        height: 68px;
        line-height: 30px;
        width: 210px;
        margin-left: 10px;
        cursor: pointer;
        float: left;
        margin-top: 10px;
        .title {
          font-size: 18px;
          font-weight: bold;
        }
        .phone {
          font-size: 14px;
          position: absolute;
          bottom: 10px;
          left: 0;
        }
      }
    }
  }
}
.pay-msgBox {
  font-size: 20px;
  width: 800px;
  margin: 80px auto;
  margin-bottom: 0;
  .pay-money {
    margin-top: 30px;
    .input {
      margin-top: 10px;
    }
  }
  .pay-message {
    margin-top: 30px;
    .input{
      height: 40px;
      line-height:40px;
      margin-top:10px;
    }
  }
}
.blue {
  color: #1878E1;
 }
// .table-box{
//   /deep/ .el-table__header-wrapper thead th{
//     background-color: #ccc;
//   }
// }
.qr{
  width: 40px;
  position: absolute;
  left: 0;
  top: -1px;
  height: 36px;
  background: url("../../../assets/icon/qr.png") no-repeat center;
  background-size: cover;
  border-radius: 5px 0 0 5px;
}
</style>
