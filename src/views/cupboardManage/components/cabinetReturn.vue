<template>
  <div>
    <div class="boxser">
      <rectbox :data="boxlist" v-on:choose="curChoose" v-on:openbox="curOpenbox" style="cursor:pointer;"></rectbox>
      <ul class="ul-tip">
        <li><span class="active0"></span> 未借出</li>
        <li><span class="active1"></span> 已借出</li>
        <li><span class="active2"></span> 已逾期</li>
        <li><span class="active3"></span> 已禁用</li>
      </ul>
    </div> 
    <div class="find-box">
      <div style="width: 500px;" >
        <el-input placeholder="请输入手机号或者扫描其APP上的个人条码"  
          @change="search"
          v-model="searchPhone" @keyup.enter.native="search">
          <template slot="prepend">
            <i class="qr"></i>
          </template>
          <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
        </el-input>
      </div>
    </div>
    
    <div class="cabinetBox" v-for="(item, key) in allCabinetList" :key="key">
      <div class="position"><span class="zhi" v-if="item.is_intelligent">智</span><span class="pu" v-else>普</span>{{item.area}}</div>
      <ul class="cabinet-ul" v-if="item.is_intelligent">
        <li v-for="(cabinet,index) in item.grids" :key="index" v-if="cabinet.checked" :class="'active' + cabinet.status" @click="openDialog(cabinet, 'zhi')">
          <div>{{cabinet.no}}</div>
          <div v-if="cabinet.status == 4">逾期{{delayDay(cabinet.locker_rent.expired_at)}}天</div>
          <div v-if="cabinet.status == 1">{{cabinet.locker_rent.started_at.split(' ')[0]}}</div>
          <div v-if="cabinet.status == 2">已禁用</div>
        </li>
      </ul>
      <ul class="cabinet-ul pu-li" v-if="!item.is_intelligent">
        <li v-for="(cabinet,index) in item.grids" :key="index" :class="'active' + cabinet.status" @click="openDialog(cabinet, 'pu')" v-if="cabinet.key" v-show="cabinet.checked">
          <div>{{cabinet.no}}</div>
          <div v-if="cabinet.status == 4">逾期{{delayDay(cabinet.locker_rent.expired_at)}}天</div>
          <div v-if="cabinet.status == 1">{{cabinet.locker_rent.started_at.split(' ')[0]}}</div>
          <div v-if="cabinet.status == 2">已禁用</div>
        </li>
      </ul>

    </div>

    <!-- (已借出)归还确认信息 -->
    <el-dialog
      title="归还确认信息"
      :visible.sync="centerDialogVisible1"
      :close-on-click-modal="true"
      width="494px"
      class="cabinet-dialog1" @close="backclose">
      <ul class="ul-box">
        <li>
          <span>当前柜号：</span><span>{{DialogForm.areaCode}}</span>
          <span :class="[{ 'red': DialogForm.day }, 'delay']">已逾期{{DialogForm.day}}天</span>
        </li>
        <li>
          <span>当前状态：</span><span>已出租</span>
        </li>
        <li v-if="!is_intelligent">
          <span>手牌编号：</span><span>{{DialogForm.code}}</span>
        </li>
        <li>
          <span>客户信息：</span>
          <img :src="head_portrait? head_portrait: defineHead"  alt="" width='50px' height="50px" style="border-radius:50%;vertical-align:top;">
          <div class="personal">
            <span>{{DialogForm.menber_name}}</span><br>
            <span>{{DialogForm.menber_phone}}</span>
          </div>
        </li>
        <li>
          <span>开始时间：</span><span>{{DialogForm.gmt_start}}</span>
        </li>
        <li>
          <span>结束时间：</span><span>{{DialogForm.gmt_end}}</span>
        </li>
        <li>
          <span>实付金额：</span><span>{{DialogForm.real_pay}}</span>
        </li>
        <li>
          <span>租用押金：</span><span>{{DialogForm.charter_pay}}</span>
        </li>
        <li>
          <span>租用备注：</span><span v-text="DialogForm.mark === '' ? '-' : DialogForm.mark"></span>
        </li>
      </ul>
      <div class="cabnit-dialog-footer" v-if="!is_intelligent">
        <span slot="footer" class="dialog-footer">
          <el-button class="continue" @click="renewSingle()">续费</el-button>
          <el-button class="return" @click="backSingle(cabinetItem, DialogForm.code)">归还</el-button>
        </span>
      </div>
    </el-dialog>

    <!-- (已禁用)启用柜子 -->
    <el-dialog
      title="启用柜子"
      :visible.sync="centerDialogVisible2"
      :close-on-click-modal="true"
      width="485px"
      class="cabinet-dialog2">
      <ul class="ul-box">
        <li>
          <span>当前柜号：</span><span>{{DialogForbidden.areaCode}}</span>
        </li>
        <li>
          <span>当前状态：</span><span>已禁用</span>
        </li>
        <li>
          <span>手牌编号：</span><span>{{DialogForbidden.code}}</span>
        </li>
        <li>
          <span>禁用原因：</span><span v-text="DialogForbidden.mark === null ? '-' : DialogForbidden.mark"></span>
        </li>
        <li>
          <span>禁用时间：</span><span>{{DialogForbidden.forbitTime}}</span>
        </li>
        <li>
          <span>启用备注：</span>
          <textarea style="resize:none;" placeholder="可在此备注一些特殊情况(选填)"  v-model="DialogForbidden.useMark" class="textarea"></textarea>
        </li>
      </ul>
      <div class="cabnit-dialog-footer">
        <span slot="footer" class="dialog-footer">
          <el-button class="return" :loading="useloading" @click="enableCabinet">启用</el-button>
        </span>
      </div>
    </el-dialog>

    <!-- (未出租)租借信息确认 -->
    <el-dialog
      title="租借信息确认"
      :visible.sync="centerDialogVisible3"
      :close-on-click-modal="true"
      width="485px"
      class="cabinet-dialog4" @close="rentDataReset">
      <ul class="ul-box">
        <li>
          <span>当前柜号：</span><span>{{DialogNoRend.areaCode}}</span>
          <el-button type="danger" style="margin-left:10px;" @click="forbidden" v-if="!is_intelligent">禁用</el-button>
        </li>
        <li>
          <span>当前状态：</span><span>未出租</span>
        </li>
        <li v-if="!is_intelligent">
          <span>手牌编号：</span><span>{{DialogNoRend.code?DialogNoRend.code:'-'}}</span>
        </li>
        <li v-if="!is_intelligent">
          <span>选择客户：</span>
          <div class="otherSearch">
            <div class="sm"></div>
            <el-input placeholder="输入手机号/扫描APP个人条形码" v-model="menberMessage.menber_phone" class="input-with-select" @keyup.enter.native="messageByPhone" type="number">
              <el-button slot="append" icon="el-icon-search" @click.native="messageByPhone"></el-button>
            </el-input>
          </div>
        </li>
        <li>
          <span class="not-null"><b>. </b><span>客户信息：</span></span>
          <div class="vip-box">
            <img :src="head_portrait" v-if="head_portrait" alt="" width='50px' height="50px" style="border-radius:50%;">
            <img src="../../../assets/icon/person.png" v-else alt="" width='50px' height="50px" style="border-radius:50%;">
            <div class="vip-message">
              <span class="vip-name" v-text="menberMessage.text_name"></span><br>
              <span v-text="menberMessage.text_phone"></span>
            </div>
          </div>
        </li>
        <li>
          <span class="not-null"><b>. </b><span>开始时间：</span></span>
          <el-date-picker
            v-model="menberMessage.start"
            type="datetime"
            placeholder="选择开始时间" :editable="false">
          </el-date-picker>
        </li>
        <li>
          <span class="not-null"><b>. </b><span>结束时间：</span></span>
          <el-date-picker
            v-model="menberMessage.end"
            type="datetime"
            placeholder="选择结束时间" :editable="false">
          </el-date-picker>
        </li>
        <li>
          <span>租用押金：</span>
          <el-input type="number" placeholder="请输入本次租柜的押金" v-model="menberMessage.charter_pay"></el-input>
        </li>
        <li>
          <span>实收金额：</span>
          <el-input placeholder="请输入本次租实际收取的金额" v-model="menberMessage.real_pay" @keyup.native="inputKeyUp1($event, 0, 999999)"></el-input>
        </li>
        <li>
          <span>销售人员：</span>
          <el-select v-model="menberMessage.sell_id" filterable placeholder="请选择销售员工">
            <el-option
              v-for="item in selectoptions"
              :disabled="item.status === 3"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </li>
        <li>
          <span>支付方式：</span>
          <el-select v-model="menberMessage.payment_method" placeholder="请选择支付方式" @change="paymethodChage">
            <el-option
              v-for="item in selloptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </li>
        <li v-if="iscardsPaymeth">
          <span>储值卡号：</span>
          <el-input placeholder="请输入储值卡号"  
            v-model="petCardNo"
            :suffix-icon="cardInputIcon"
            @focus="cardInputFocus">
            <template slot="prepend"><i class="qr"></i></template>
            <el-button slot="append" icon="el-icon-search" @click="petCardNoInput"></el-button>
          </el-input>
        </li>
        <li>
          <span>租用备注：</span>
          <textarea style="resize:none;" placeholder="可在此备注一些特殊情况" v-model="menberMessage.memo" :maxlength="20" class="textarea"></textarea>
        </li>
      </ul>
      <div class="cabnit-dialog-footer" v-if="!is_intelligent">
        <span slot="footer" class="dialog-footer">
          <el-button class="return" :loading="rentloading" @click="rentCabinet" :disabled="submitBug">确定</el-button>
        </span>
      </div>
    </el-dialog>

    <!-- (禁用)禁用柜子 -->
    <forbit-cabinet-dialog
      v-if="centerDialogVisible4"
      ref="centerDialogVisible4"
      :dialogVisible='centerDialogVisible4'
      :DialogNoRend='DialogNoRend' 
      :loading='backloading'
      @dialogClosed='dialogCloseForbit'
      @forbitCabinet='disableCabinet'
      :widthSize="'500px'">
    </forbit-cabinet-dialog>

    <!-- 续费信息确认(手机号码) -->
    <renew-cabinet-dialog
      v-if="renewCenterDialogVisible"
      ref="renewCenterDialogVisible"
      :dialogVisible='renewCenterDialogVisible'
      :cabinetMsg='renewcabinetMsg' 
      :loading='backloading'
      :title='cabinetTitle'
      :selectoptions="selectoptions"
      @dialogClosed='dialogClosesRenew'
      @renewCabinet='renewCabinet'
      :widthSize="'500px'">
    </renew-cabinet-dialog>

    <!-- 续费信息确认(点击)由于查询的数据格式不一致，所以写了2个续费组件 -->
    <renew-cabinet-dialog-single
      v-if="renewCenterDialogVisible1"
      ref="renewCenterDialogVisible1"
      :dialogVisible='renewCenterDialogVisible1'
      :cabinetMsg='cabinetItem' 
      :loading='backloading'
      :title='cabinetTitle'
      :selectoptions="selectoptions"
      @dialogClosed='dialogClosesRenewSingle'
      @renewCabinet='renewCabinetSingle'
      :widthSize="'500px'">
    </renew-cabinet-dialog-single>

    <!--根据手机号码查询租柜信息-->
    <cabinet-by-phone-dialog
      v-if="centerDialogVisibleByPhone"
      ref="centerDialogVisibleByPhone"
      :dialogVisible='centerDialogVisibleByPhone'
      :searchCabinetList='searchCabinetList' 
      :loading='backloading'
      :always='always'
      @dialogClosed='dialogClosesCabinetByPhone'
      @backCabinet='back'
      @cansleCabinet='renew'
      :widthSize="'500px'">
    </cabinet-by-phone-dialog>

    <!-- 柜子归还 -->
    <el-dialog
      title="柜子归还"
      :visible.sync="centerDialogVisible6"
      :close-on-click-modal="true"
      width="485px"
      class="cabinet-dialog4" @close="backMsgclose">
      <ul class="ul-box" :loading="loading">
        <li>
          <span>归还备注：</span>
          <textarea style="resize:none;" placeholder="可在此备注一些特殊情况（选填）" v-model="DialogBack.return_memo" class="textarea"></textarea>
        </li>
      </ul>
      <div class="cabnit-dialog-footer">
        <span slot="footer" class="dialog-footer">
          <el-button class="return" :loading="backloading" @click="backCabinet">归还</el-button>
        </span>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import rectbox from '@/components/rectbox'
import otherInput from '@/components/otherInput'
import { parseTime } from '@/utils/index'
import { getCustomersByPhone } from '@/api/customer'
import renewCabinetDialog from './props/renewCabinetDialog'
import renewCabinetDialogSingle from './props/renewCabinetDialogSingle'
import cabinetByPhoneDialog from './props/cabinetByPhoneDialog'
import forbitCabinetDialog from './props/forbitCabinetDialog'
import { employeeList } from '@/api/employee'
import { cabinetStatusNum, getGridMessage, listRentRecord, getAllCabinet } from '@/api/cabinet'
import { cardsNoList } from '@/api/vipcardGl'
export default {
  name: 'cabnitReturn',
  components: {
    rectbox,
    otherInput,
    renewCabinetDialog,
    renewCabinetDialogSingle,
    cabinetByPhoneDialog,
    forbitCabinetDialog
  },
  data() {
    let selloptions = [{
      value: 1,
      label: '现金'
    }, {
      value: 2,
      label: '支付宝'
    }, {
      value: 3,
      label: '微信'
    }, {
      value: 4,
      label: '银行卡'
    }, {
      value: 5,
      label: '储值卡'
    }]
    return {
      selectoptions: [],
      selloptions: selloptions,
      renewcabinetMsg: {},
      cabinetTitle: '续费信息确认',
      expiredTime: '',
      renewDate: '',
      defineHead: require('../../../assets/icon/person.png'),
      centerDialogVisible1: false,
      centerDialogVisible2: false,
      centerDialogVisible3: false,
      centerDialogVisible4: false,
      centerDialogVisible5: false,
      centerDialogVisible6: false,
      renewCenterDialogVisible: false,
      renewCenterDialogVisible1: false,
      centerDialogVisibleByPhone: false,
      loading: false,
      useloading: false,
      backloading: false,
      rentloading: false,
      area: '',
      always: 'always',
      searchPhone: '',
      allcabinet: '',
      is_intelligent: false,
      showcabinet: [],
      cabinetList: {},
      searchCabinetList: [],
      allCabinetList: [],
      cabinetTotalData: {},
      boxlist: [{
        text: '总计',
        num: 0,
        checked: true,
        bocolor: 'rgb(24, 120, 225)'
      }, {
        text: '未借出',
        num: 0,
        checked: false,
        bocolor: 'rgb(122, 184, 207)'
      }, {
        text: '已借出',
        num: 0,
        checked: false,
        bocolor: 'rgb(26, 179, 148)'
      }, {
        text: '已禁用',
        num: 0,
        checked: false,
        bocolor: 'rgb(221, 221, 221)'
      }],
      count: '',
      formState: {},
      DialogForm: {
        areaCode: '', // 当前柜号
        states: '', // 状态
        gmt_start: '', // 开始时间
        gmt_end: '', // 结束时间
        menber_name: '', // 会员名
        menber_phone: '', // 会员手机
        real_pay: '', // 实付金额
        charter_pay: '', // 租用押金
        mark: '', // 租用备注
        day: '', // 逾期天数
        renew_endTime: '', // 续费结束时间
        renew_realMoney: '', // 续费实付金额
        renew_rentMoney: '', // 续费租用押金
        renew_remark: '', // 续费租用备注
        code: '' // 手环
      },
      DialogNoRend: { // 未租出
        areaCode: '',
        mark: '',
        code: '',
        forbitMark: '' // 禁用备注
      },
      DialogForbidden: { // 已禁用
        areaCode: '',
        mark: '',
        forbitTime: '',
        code: '',
        useMark: '' // 租用备注
      },
      DialogRenew: { // 续租
        code: '',
        memo: '',
        real_pay: '',
        gmt_end: ''
      },
      DialogBack: { // 归还
        code: '',
        return_memo: ''
      },
      cabinetItem: {},
      menberMessage: { // 租借信息
        menber_phone: '', // 会员手机
        menber_id: '', // 客户ID
        text_phone: '客户手机',
        text_name: '客户姓名',
        code: '',
        start: '',
        end: '',
        real_pay: '',
        charter_pay: '',
        payment_method: selloptions[0].value,
        sell_id: 2,
        memo: ''
      },
      head_portrait: '',
      start2: '2018-03-21 13:52:03',
      end2: '',
      totalCabinet: {},
      cardsId: undefined,
      petCardNo: '',
      cardsNoList: [],
      iscardsPaymeth: false,
      submitBug: false, // 提交有错误
      cardsNoErr: false, // 储值卡号错误
      hasCardsdNo: false, // 是否输入储值卡号
      ispetCardNoBtn: false // 是否点击储值卡号查找按钮
    }
  },
  computed: {
    cardInputIcon() {
      return this.hasCardsdNo ? this.cardsNoErr ? 'el-icon-error' : 'el-icon-success' : ''
    }
  },
  created() {
    this.__init()
    this.getEmployeeList()
  },
  methods: {
    __init() {
      this.getData()
      this.getReactData()
    },
    filterser(states = []) {
      for (let i = 0; i < this.allcabinet.length; i++) {
        for (let j = 0; j < this.allCabinetList[i].grids.length; j++) {
          let current = this.allCabinetList[i].grids[j]
          if (states.length) {
            let tiaojian = ''
            for (let cur of states) {
              tiaojian += (current.status === cur || '')
            }
            if (tiaojian) {
              current.checked = true
            } else {
              current.checked = false
            }
          } else {
            current.checked = true
          }
          this.$set(this.allCabinetList[i].grids, j, current)
        }
      }
    },
    getEmployeeList() {
      employeeList().then(res => {
        this.selectoptions = []
        let data = res.data.filter(currentValue => {
          return currentValue.status === 1
        })
        this.selectoptions.push({ value: 2, label: '待分配', status: 0 })
        for (let val of data) {
          this.selectoptions.push({ value: val.id, label: val.name, status: val.status })
        }
      })
    },
    // 根据index选择潜在客户类别，对应高亮显示，筛选对应status:0未借出，status:2已禁用，，status:【1，4】已借出
    curChoose(index) {
      for (let v of this.boxlist) {
        v.checked = false
      }
      this.boxlist[index].checked = true
      if (this.boxlist[index].text === '未借出') {
        this.filterser([0])
      } else if (this.boxlist[index].text === '已借出') {
        this.filterser([1, 4])
      } else if (this.boxlist[index].text === '已禁用') {
        this.filterser([2])
      } else if (this.boxlist[index].text === '总计') {
        this.filterser()
      }
    },
    curOpenbox(index) {
      console.log(index)
    },
    rentDataReset() {
      this.head_portrait = ''
      this.DialogNoRend = {}
      this.menberMessage.menber_phone = ''
      this.menberMessage.text_name = '客户姓名'
      this.menberMessage.text_phone = '客户手机'
      this.menberMessage.menber_id = ''
      this.resetStoreCardParam()
      this.$set(this.menberMessage, 'payment_method', 1)
      this.$set(this.menberMessage, 'sell_id', 2)
    },
    backclose() {
      this.DialogForm = {
        areaCode: '', // 当前柜号
        states: '', // 状态
        gmt_start: '', // 开始时间
        gmt_end: '', // 结束时间
        menber_name: '', // 会员名
        menber_phone: '', // 会员手机
        real_pay: '', // 实付金额
        charter_pay: '', // 租用押金
        mark: '', // 租用备注
        day: '', // 逾期天数
        renew_endTime: '', // 续费结束时间
        renew_realMoney: '', // 续费实付金额
        renew_rentMoney: '', // 续费租用押金
        renew_remark: '', // 续费租用备注
        code: '' // 手环
      }
    },
    // 柜子状态查询
    openDialog(obj, string) {
      if (string === 'zhi') {
        this.is_intelligent = true
      } else {
        this.is_intelligent = false
      }
      if (obj.status === 0) { // 未租住
        this.rentDataReset()
        getGridMessage(obj.locker_id, obj.id).then(res => {
          this.DialogNoRend.areaCode = res.data.locker.area + '-' + res.data.no
          this.DialogNoRend.code = res.data.key
          this.menberMessage.id = obj.locker_id
          this.menberMessage.grid = obj.id
          // 默认开始时间为当前时间
          this.menberMessage.start = new Date()
          // 默认结束时间为23:59:59
          this.menberMessage.end = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1)
          this.menberMessage.real_pay = ''
          this.menberMessage.charter_pay = ''
          this.menberMessage.memo = ''
          this.head_portrait = ''
        }).catch(err => {
          console.log(err)
        })
        this.centerDialogVisible3 = true
      } else if (obj.status === 1 || obj.status === 4) { // 已出租
        getGridMessage(obj.locker_id, obj.id).then(res => {
          let _data = res.data
          this.cabinetItem = res.data
          this.DialogForm.areaCode = _data.locker.area + '-' + _data.no
          this.DialogForm.gmt_start = _data.locker_rent.started_at
          this.DialogForm.gmt_end = _data.locker_rent.expired_at
          this.DialogForm.menber_name = _data.locker_rent.customer ? _data.locker_rent.customer.name : ''
          this.DialogForm.menber_phone = _data.locker_rent.customer ? _data.locker_rent.customer.phone : ''
          this.DialogForm.real_pay = _data.locker_rent.total_fee
          this.DialogForm.charter_pay = _data.locker_rent.cash_pledge
          this.DialogForm.code = _data.key
          this.DialogForm.mark = _data.locker_rent.rent_remark
          // this.DialogForm.mark = _data.locker_rent.renews.length ? _data.locker_rent.renews[_data.locker_rent.renews.length - 1].remark : _data.locker_rent.rent_remark
          this.head_portrait = _data.locker_rent.customer ? _data.locker_rent.customer.head_portrait : ''
          if (new Date().getTime() - new Date(_data.locker_rent.expired_at).getTime() > 0) {
            let nTime = new Date().getTime() - new Date(_data.locker_rent.expired_at).getTime()
            let day = Math.ceil(nTime / 86400000)
            this.DialogForm.day = day
            this.cabinetItem.day = day
          } else {
            this.DialogForm.day = 0
            this.cabinetItem.day = 0
          }
        }).catch(err => {
          console.log(err)
        })
        this.centerDialogVisible1 = true
      } else if (obj.status === 2) { // 已禁用
        getGridMessage(obj.locker_id, obj.id).then(res => {
          let _data = res.data
          this.DialogForbidden.areaCode = _data.locker.area + '-' + _data.no
          this.DialogForbidden.mark = _data.locker_disable.disable_remark
          this.DialogForbidden.forbitTime = _data.locker_disable.created_at
          this.DialogForbidden.code = _data.key
          this.DialogForbidden.useMark = ''
          this.DialogForbidden.id = _data.locker_id
          this.DialogForbidden.grid = obj.id
        }).catch(err => {
          console.log(err)
        })
        this.centerDialogVisible2 = true
      }
    },
    delayDay(date) {
      let nTime = new Date().getTime() - new Date(date).getTime()
      let day = Math.ceil(nTime / 86400000)
      return day
    },
    // 启用柜子
    enableCabinet() {
      this.useloading = true
      this.$store.dispatch('UseCabinet', this.DialogForbidden).then(() => {
        this.useloading = false
        this.common.message('success', '柜子启用成功')
        this.__init()
        this.centerDialogVisible2 = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 根据手机号码搜索租柜
    search() {
      this.is_intelligent = false
      if (!this.searchPhone) {
        this.common.message('warning', '请输入手机号码')
        return
      }
      this.getCabinetById(this.searchPhone)
    },
    getDelayDay(date) {
      if (new Date().getTime() - new Date(date).getTime() > 0) {
        let nTime = new Date().getTime() - new Date(date).getTime()
        var day = Math.ceil(nTime / 86400000)
      } else {
        day = 0
      }
      return day
    },
    getCabinetById(phone) {
      const data = {
        'customer_phone': phone,
        'status': 1,
        'per_page': 10,
        'page': 1
      }
      listRentRecord(data).then((res) => {
        if (Object.keys(res.data).length) {
          this.centerDialogVisibleByPhone = true
          this.searchCabinetList = res.data
          if (res.data.length > 1) {
            this.always = 'always'
          } else {
            this.always = 'never'
          }
        } else {
          this.common.message('warning', '该客户无租柜信息')
          console.log('失败')
        }
        this.searchPhone = ''
      }).catch(() => {
        this.common.message('warning', '该客户无租柜信息')
        console.log('失败')
      })
    },
    // 禁用柜子
    disableCabinet() {
      this.useloading = true
      this.DialogNoRend.id = this.menberMessage.id
      this.DialogNoRend.grid = this.menberMessage.grid
      this.$store.dispatch('NoUseCabinet', this.DialogNoRend).then(() => {
        this.useloading = false
        this.common.message('success', '禁用柜子成功')
        this.__init()
        this.centerDialogVisible4 = false
        this.centerDialogVisible3 = false
        this.DialogNoRend.forbitMark = ''
      }).catch(() => {
        this.useloading = false
      })
    },
    dialogCloseForbit() {
      this.centerDialogVisible4 = false
      this.DialogNoRend.forbitMark = ''
    },
    dialogClosesCabinetByPhone() {
      this.centerDialogVisibleByPhone = false
    },
    dialogClosesRenew() {
      this.renewCenterDialogVisible = false
    },
    dialogClosesRenewSingle() {
      this.renewCenterDialogVisible1 = false
    },
    // 续费柜子
    renewCabinet() {
      this.centerDialogVisible1 = false
      this.centerDialogVisibleByPhone = false
      this.renewCenterDialogVisible = false
      this.__init()
    },
    // 续费柜子(点击)
    renewCabinetSingle() {
      this.centerDialogVisible1 = false
      this.renewCenterDialogVisible1 = false
      this.__init()
    },
    // 根据手机号码查询会员信息
    messageByPhone() {
      let reg = /^1[345678]\d{9}$/
      if (!this.menberMessage.menber_phone) {
        this.common.message('warning', '请输入电话号码')
        this.menberMessage.text_phone = ''
        this.menberMessage.text_name = ''
        this.menberMessage.menber_id = ''
        return false
      } else if (!reg.test(this.menberMessage.menber_phone)) {
        this.common.message('warning', '请输入正确的电话号码')
        this.menberMessage.text_phone = ''
        this.menberMessage.text_name = ''
        this.menberMessage.menber_id = ''
        return false
      } else {
        getCustomersByPhone(this.menberMessage.menber_phone).then(res => {
          let data = res.data
          if (Object.keys(data).length) {
            // [...this.form] = [data]
            this.menberMessage.text_phone = data.phone
            this.menberMessage.text_name = data.name
            this.menberMessage.menber_id = data.id
            this.head_portrait = data.head_portrait
          } else {
            // this.$message('此顾客是首次在您的俱乐部办卡，请手动录入信息')
            this.$message('客户不存在或已被删除')
            this.menberMessage.text_phone = ''
            this.menberMessage.text_name = ''
            this.menberMessage.menber_id = ''
            this.head_portrait = ''
          }
        })
      }
    },
    backMsgclose() {
      this.DialogBack.return_memo = ''
    },
    // 柜子归还
    backCabinet() {
      this.backloading = true
      console.log(this.DialogBack)
      this.$store.dispatch('BackCabinet', this.DialogBack).then(() => {
        this.backloading = false
        this.common.message('success', '柜子归还成功')
        this.centerDialogVisible1 = false
        this.centerDialogVisible6 = false
        this.centerDialogVisibleByPhone = false
        this.__init()
      }).catch(() => {
        this.backloading = false
      })
    },
    // 租借信息确认
    rentCabinet() {
      this.menberMessage.debit_card_id = undefined
      if (!this.menberMessage.start) {
        this.common.message('warning', '开始时间不能为空')
        return false
      }
      if (!this.menberMessage.end) {
        this.common.message('warning', '结束时间不能为空')
        return false
      }
      if (new Date(this.menberMessage.start).getTime() - new Date(this.menberMessage.end).getTime() > 0) {
        this.common.message('warning', '开始时间不能大于结束时间')
        return false
      }
      if (!this.menberMessage.menber_id) {
        this.common.message('warning', '会员信息不能为空')

        return false
      }
      if (Number(this.menberMessage.charter_pay) === 0) {
        this.menberMessage.charter_pay = 0.01
        this.common.message('warning', '租用押金必须大于0')
      } else if (Number(this.menberMessage.charter_pay) <= 0) {
        this.common.message('warning', '租用押金必须大于0')
        return false
      } else if (Number(this.menberMessage.charter_pay) > 99999999) {
        this.common.message('warning', '租用押金不能大于99999999')
        return false
      }
      if (Number(this.menberMessage.real_pay) === 0) {
        this.menberMessage.real_pay = 0.01
        this.common.message('warning', '实付金额必须大于0')
        return false
      } else if (Number(this.menberMessage.real_pay) <= 0) {
        this.common.message('warning', '实付金额必须大于0')
        return false
      } else if (Number(this.menberMessage.real_pay) > 99999999) {
        this.common.message('warning', '实付金额不能大于99999999')
        return false
      }
      if (this.menberMessage.payment_method === 5) {
        // 储值卡支付
        if (this.ispetCardNoBtn) {
          // 已经点击储值卡按钮查找
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
      if (Number(this.menberMessage.real_pay) > this.cardsNoList[0].balance) {
        this.common.message('error', '所选的储值卡剩余金额不足，请选择其它储值卡或更换支付方式')
        return false
      }
      this.menberMessage.debit_card_id = this.cardsId
      this.beginAfter()
    },
    beginAfter() {
      // 开始向后端传递数据
      this.menberMessage.start = parseTime(new Date(this.menberMessage.start), '{y}-{m}-{d} {h}:{i}:{s}')
      this.menberMessage.end = parseTime(new Date(this.menberMessage.end), '{y}-{m}-{d} {h}:{i}:{s}')
      this.rentloading = true
      this.$store.dispatch('RentCabinetMessage', this.menberMessage).then(() => {
        this.rentloading = false
        this.common.message('success', '租借成功')

        this.centerDialogVisible3 = false
        this.__init()
      }).catch(() => {
        this.rentloading = false
      })
    },
    forbidden() {
      this.centerDialogVisible4 = true
    },
    renewSingle() {
      this.renewCenterDialogVisible1 = true
    },
    renew(item, expired_at) {
      this.renewcabinetMsg = item // 获得租柜信息
      if (new Date(this.renewcabinetMsg.expired_at).getTime() - new Date().getTime() < 0) {
        let nTime = new Date().getTime() - new Date(this.renewcabinetMsg.expired_at).getTime()
        let day = Math.ceil(nTime / 86400000)
        this.renewcabinetMsg.day = day
      } else {
        this.renewcabinetMsg.day = 0
      }
      this.renewCenterDialogVisible = true
    },
    renewDataReset() {
      this.DialogRenew.real_pay = ''
      this.DialogRenew.gmt_end = ''
      this.DialogRenew.memo = ''
    },
    back(item) {
      // this.DialogBack.code = code
      this.DialogBack.id = item.lockerid // lockerid
      this.DialogBack.grid = item.grid
      this.centerDialogVisible6 = true
    },
    backSingle(item, code) {
      this.DialogBack.code = code
      this.DialogBack.id = item.locker_id // lockerid
      this.DialogBack.grid = item.id
      this.centerDialogVisible6 = true
    },
    getReactData() {
      cabinetStatusNum().then(res => {
        this.boxlist[0].num = res.data.all ? res.data.all : 0
        this.boxlist[1].num = res.data.unrented ? res.data.unrented : 0
        this.boxlist[2].num = res.data.rented ? res.data.rented : 0
        this.boxlist[3].num = res.data.disable ? res.data.disable : 0
      }).catch(err => {
        console.log(err)
      })
    },
    getData() {
      getAllCabinet().then((response) => {
        this.loading = false
        this.allCabinetList = response.data
        this.allcabinet = response.data
        for (let i = 0; i < response.data.length; i++) {
          for (let j = 0; j < response.data[i].grids.length; j++) {
            response.data[i].grids[j].checked = true
            if (response.data[i].grids[j].status === 1) {
              if (new Date().getTime() - new Date(response.data[i].grids[j].locker_rent.expired_at).getTime() > 0) {
                this.allCabinetList[i].grids[j].status = 4
              }
            }
          }
        }
      }).catch(() => {
        this.loading = false
      })
    },
    paymethodChage(param) {
      // 支付方式
      this.resetStoreCardParam()
      if (param === 5) {
        // 获取储值卡有效列
        this.iscardsPaymeth = true
      } else {
        this.iscardsPaymeth = false
      }
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
    },
    inputKeyUp1(e, min, max, moduleVale) {
      let doc = e.target
      let _value = this.common.check(doc, min, max)
      this.menberMessage.real_pay = _value
    }
  },
  filters: {
  },
  destroyed() {
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.cabinet-dialog1 /deep/ {
  .el-dialog .el-dialog__body{
   padding: 20px 0;
  }
  .el-carousel__arrow--left {
    left: 0;
  }
  .el-carousel__arrow--right {
    right: 0;
  }
}
.cabinet-dialog2 /deep/ {
  .el-dialog .el-dialog__body{
    padding: 20px 0;
  }
}
.cabinet-dialog3 /deep/ {
  .el-dialog .el-dialog__body{
    padding: 20px 0;
  }
}
.cabinet-dialog4 /deep/ {
  .el-dialog .el-dialog__body{
    padding: 20px 0;
  }
}
.indicator {
  margin: 0 auto;
  text-align: center;
  width: 50px;
  height: 30px;
  line-height: 30px;
  background: rgba(124,124,124,0.8);
  color: #fff;
  border-radius: 3px;
  margin-top: 30px;
}
.forbidden_li {
  position: relative;
  .word_len {
    position: absolute;
    bottom: -30px;
    right: 30px;
    color: #ccc;
  }
}
.textarea {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  width: 330px;
  vertical-align: top;
  height: 45px;
}
.textarea::-webkit-input-placeholder{
  color: #ccc;
}
.otherSearch {
  width: 330px;
  display: inline-block;
  position: relative;
}
.sm{
  width: 36px;
  display: inline-block;
  height: 36px;
  background: url("../../../assets/icon/qr.png") no-repeat;
  background-size: contain;
  vertical-align: middle;
  border-radius: 5px 0 0 5px;
  position: absolute;
  z-index: 1;
  top: 2px;
}
.input-with-select {
  padding-left: 30px;
}
.otherSearch .el-select .el-input {
  width: 100%;
  padding-left: 0px;
}
.red {
  color: red;
}
.el-dialog {
  ul {
    padding: 0 20px;
    margin: 0;
    li{
      list-style: none;
      line-height: 40px;
      margin-bottom: 10px;
      position: relative;
      padding-left: 10px;
      span.not-null {
        // margin-left: -15px;
        position: relative;
        b {
          color: #F14C30;
          font-size: 28px;
          position: absolute;
          top: -19px;
          left: -10px;
        }
      }
      .delay {
        position: absolute;
        top: 0;
        right: 10px;
      }
      .personal {
        position: absolute;
        top: 10px;
        left: 150px;
        line-height: 20px;
      }
      .vip-box {
        border: 1px solid #ddd;
        width: 330px;
        height: 80px;
        display: inline-block;
        vertical-align: top;
        border-radius: 3px;
        position: relative;
        line-height: 20px;
        padding: 13px;
        .vip-message {
          position: absolute;
          top: 20px;
          left: 80px;
          color: #333;
          .vip-name {
            font-size: 16px;
          }
        }
      }
    }
  }
}
.boxser {
  overflow: hidden;
  position: relative;
  .ul-tip {
    overflow: hidden;
    position: absolute;
    bottom: 10px;
    right: 0;
    margin: 0;
    padding: 0;
    li {
      float: left;
      list-style: none;
      color: #999;
      margin:0 20px;
      line-height: 20px;
      span {
        display: inline-block;
        width: 20px;
        height:20px;
        border:1px solid #ccc;
        vertical-align: bottom;
      }
      span.active1 {
        background: #1AB394;
      }
      span.active2 {
        background: #F14C30;
      }
      span.active3 {
        background: #ddd;
      }
      span.active0 {
        background: #fff;
      }
    }
  }
}
.cabinetBox {
  border:1px solid #ccc;
  margin-top: 20px;
  .position{
    padding-left: 20px;
    height: 60px;
    line-height: 60px;
    border-bottom: 1px solid #ccc;
    font-size: 24px;
    .zhi {
      display: inline-block;
      width: 26px;
      height: 26px;
      line-height: 26px;
      background: #1878E1;
      color: #fff;
      text-align: center;
      vertical-align: middle;
      margin-right: 5px;
      font-size: 14px;
    }
    .pu {
      display: inline-block;
      width: 26px;
      height: 26px;
      line-height: 26px;
      background: #333;
      color: #fff;
      text-align: center;
      vertical-align: middle;
      margin-right: 5px;
      font-size: 14px;
      margin-top: -4px;
    }
  }
  .cabinet-ul {
    overflow: hidden;
    text-align: center;
    margin: 0;
    padding: 0;
    padding-bottom: 0.3%;
    li {
      height: 60px;
      line-height: 25px;
      box-sizing:border-box;
      -moz-box-sizing:border-box; /* Firefox */
      -webkit-box-sizing:border-box; /* Safari */
      width: 9.67%;
      color: #fff;
      border: 1px solid #ccc;
      list-style: none;
      // margin: 0.3%;
      // margin-bottom: 0;
      // margin-right: 0;
      float: left;
      cursor: pointer;
    }
    li.active1 {
      background: #1AB394;
    }
    li.active2 {
      background: #ddd;
    }
    li.active4 {
      background: #F14C30;
    }
    li.active0 {
      background: #fff;
      line-height: 60px;
      color: #000;
    }
  }
}
.cabnit-dialog-footer {
  margin-top: 45px;
  text-align: center;
}
.qr{
  width: 40px;
  position: absolute;
  left: 0;
  top: -1px;
  height: 36px;
  background: url("../../../assets/icon/qr.png") no-repeat center center;
  background-size: cover;
  border-radius: 5px 0 0 5px;
}
</style>
