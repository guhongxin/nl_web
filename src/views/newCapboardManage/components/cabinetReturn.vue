<template>
  <div>
    <div class="boxser">
      <rectbox :data="boxlist" v-on:choose="curChoose" v-on:openbox="curOpenbox"></rectbox>
      <ul class="ul-tip">
        <li><span class="active0"></span> 未借出</li>
        <li><span class="active1"></span> 已借出</li>
        <li><span class="active2"></span> 已逾期</li>
        <li><span class="active3"></span> 已禁用</li>
      </ul>
    </div> 
    
    <div style="width: 500px; margin:20px 0;">
     <el-input placeholder="请输入手机号或者扫描其APP上的个人条码"  
        @change="search"
        v-model="searchPhone" @keyup.enter.native="search">
        <template slot="prepend">
          <i class="qr" style="top:-1px;left:-1px;"></i>
        </template>
        <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
      </el-input>
    </div>
    <div class="cabinetBox" v-for="(item, key) in area" :key="key">
      <div class="position">{{item.area}}</div>
      <ul class="cabinet-ul" >
        <li v-for="(cabinet,index) in showcabinet" :key="index" :class="'active' + cabinet.state" @click="openDialog(cabinet.state, cabinet.area, cabinet.number)" v-if="cabinet.area === item.area">
          <div>{{cabinet.number}}</div>
          <div v-if="cabinet.state == 4">逾期{{cabinet.day}}天</div>
          <div v-if="cabinet.state == 1">{{cabinet.gmt_start.split(' ')[0]}}</div>
          <div v-if="cabinet.state == 2">已禁用</div>
        </li>
      </ul>
    </div>

    <!-- (已借出)归还确认信息 -->
    <el-dialog
      title="归还确认信息"
      :visible.sync="centerDialogVisible1"
      :close-on-click-modal="true"
      width="485px"
      class="cabinet-dialog1">
      <ul class="ul-box">
        <li>
          <span>当前柜号：</span><span>{{DialogForm.areaCode}}</span>
          <span :class="[{ 'red': DialogForm.day }, 'delay']">已逾期{{DialogForm.day}}天</span>
        </li>
        <li>
          <span>当前状态：</span><span>已出租</span>
        </li>
        <li>
          <span>手牌编号：</span><span>{{DialogForm.code}}</span>
        </li>
        <li>
          <span>会员信息：</span>
          <img :src="head_portrait? head_portrait: defineHead"  alt="" width='50px' height="50px" style="border-radius:50%;vertical-align:top;">
          <!-- <img src="../../../assets/icon/person.png" alt="" width='60px' height='60px' style="border-radius:50%;vertical-align:top;"> -->
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
      <div class="cabnit-dialog-footer">
        <span slot="footer" class="dialog-footer">
          <el-button class="continue" @click="renew">续费</el-button>
          <el-button class="return" @click="back(DialogForm.code)">归还</el-button>
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
          <!-- <el-input type="textarea" placeholder="可在此备注一些特殊情况(选填)"  v-model="DialogForbidden.useMark"></el-input> -->
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
      class="cabinet-dialog4">
      <ul class="ul-box">
        <li>
          <span>当前柜号：</span><span>{{DialogNoRend.areaCode}}</span>
          <el-button type="danger" style="margin-left:10px;" @click="forbidden">禁用</el-button>
        </li>
        <li>
          <span>当前状态：</span><span>未出租</span>
        </li>
        <li>
          <span>手牌编号：</span><span>{{DialogNoRend.code}}</span>
        </li>
        <li>
          <span>选择客户：</span>
          <div class="otherSearch">
            <div class="sm"></div>
            <el-input placeholder="请输入手机号码/扫描APP上个人条形码" v-model="menberMessage.menber_phone" class="input-with-select" @keyup.enter.native="messageByPhone" type="number">
            </el-input>
          </div>
        </li>
        <li>
          <span class="not-null"><b>. </b><span>客户信息：</span></span>
          <div class="vip-box">
            <img :src="head_portrait" v-if="head_portrait!==null" alt="" width='50px' height="50px" style="border-radius:50%;">
            <img src="../../../assets/icon/person.png" v-if="head_portrait===null" alt="" width='50px' height="50px" style="border-radius:50%;">
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
          <el-input type="number" placeholder="请输入本次租实际收取的金额" v-model="menberMessage.real_pay"></el-input>
        </li>
        <li>
          <span>租用备注：</span>
          <!-- <el-input type="textarea" placeholder="可在此备注一些特殊情况" v-model="menberMessage.memo"></el-input> -->
          <textarea style="resize:none;" placeholder="可在此备注一些特殊情况" v-model="menberMessage.memo" class="textarea"></textarea>
        </li>
      </ul>
      <div class="cabnit-dialog-footer">
        <span slot="footer" class="dialog-footer">
          <el-button class="return" :loading="rentloading" @click="rentCabinet">确定</el-button>
        </span>
      </div>
    </el-dialog>
    <!-- (禁用)禁用柜子 -->
    <el-dialog
      title="禁用柜子"
      :visible.sync="centerDialogVisible4"
      :close-on-click-modal="true"
      width="485px"
      class="cabinet-dialog4">
      <ul class="ul-box" :loading="loading">
        <li class="forbidden_li">
          <span>禁用原因：</span>
          <!-- <el-input type="textarea" placeholder="可在此备注一些特殊情况（选填）" v-model="DialogNoRend.forbitMark"></el-input> -->
          <textarea style="resize:none;" placeholder="可在此备注一些特殊情况（选填）" 
          v-model="DialogNoRend.forbitMark" class="textarea" 
          v-on:input="getLength"
          maxlength="20"></textarea>
          <span class="word_len">{{tipLength}}/20</span>
        </li>
      </ul>
      <div class="cabnit-dialog-footer">
        <span slot="footer" class="dialog-footer">
          <el-button class="return" :loading="nouseloading" @click="disableCabinet">禁用</el-button>
        </span>
      </div>
    </el-dialog>
    <!-- (已借出)续费信息确认 -->
    <el-dialog
      title="续费信息确认"
      :visible.sync="centerDialogVisible5"
      :close-on-click-modal="true"
      width="485px"
      class="cabinet-dialog1">
      <ul class="ul-box">
        <li>
          <span>当前柜号：</span><span>{{DialogForm.areaCode}}</span>
          <span :class="[{ 'red': DialogForm.day }, 'delay']">已逾期{{DialogForm.day}}天</span>
        </li>
        <li>
          <span>当前状态：</span><span>已出租</span>
        </li>
        <li>
          <span>会员信息：</span>
          <img v-if="!head_portrait" src="../../../assets/icon/person.png" alt="" width='60px' height='60px' style="border-radius:50%;vertical-align:top;">
          <img v-if="head_portrait" :src="head_portrait" alt="" width='60px' height='60px' style="border-radius:50%;vertical-align:top;">
          <div class="personal">
            <span>{{DialogForm.menber_name}}</span><br>
            <span>{{DialogForm.menber_phone}}</span>
          </div>
        </li>
        <li>
          <span>开始时间：</span>
          <el-date-picker
            v-model="DialogForm.gmt_start"
            type="datetime"
            placeholder="选择开始时间" disabled ="disabled">
          </el-date-picker>
        </li>
        <li>
          <span class="not-null"><b>. </b>结束时间：</span>
          <el-date-picker
            v-model="DialogRenew.gmt_end"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择结束时间">
          </el-date-picker>
        </li>
        <li>
          <span>实付金额：</span>
          <el-input type="number" placeholder="请输入本次实际收取的金额" v-model="DialogRenew.real_pay"></el-input>
        </li>
        <li>
          <span>租用押金：</span>
          <el-input type="number" placeholder="请输入本次租柜的押金" v-model="DialogForm.charter_pay" disabled="disabled"></el-input>
          <!-- <el-input type="number" placeholder="请输入本次实际收取的金额" v-model="DialogForm.renew_rentMoney" disabled="disabled"></el-input> -->
        </li>
        <li>
          <span>租用备注：</span>
          <textarea style="resize:none;" placeholder="可在此备注一些特殊情况（选填）" v-model="DialogRenew.memo" class="textarea"></textarea>
        </li>
      </ul>
      <div class="cabnit-dialog-footer">
        <span slot="footer" class="dialog-footer">
          <el-button class="return" @click="renewCabinet(DialogForm.code)">续费</el-button>
        </span>
      </div>
    </el-dialog>
    <!-- 柜子归还 -->
    <el-dialog
      title="柜子归还"
      :visible.sync="centerDialogVisible6"
      :close-on-click-modal="true"
      width="485px"
      class="cabinet-dialog4">
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
import { cabinetMsgById } from '@/api/cabinet'
export default {
  name: 'cabnitReturn',
  components: {
    rectbox,
    otherInput
  },
  data() {
    return {
      renewDate: '',
      defineHead: require('../../../assets/icon/person.png'),
      centerDialogVisible1: false,
      centerDialogVisible2: false,
      centerDialogVisible3: false,
      centerDialogVisible4: false,
      centerDialogVisible5: false,
      centerDialogVisible6: false,
      loading: false,
      useloading: false,
      nouseloading: false,
      backloading: false,
      rentloading: false,
      area: '',
      searchPhone: '',
      tipLength: 0,
      allcabinet: '',
      showcabinet: [],
      cabinetList: {},
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
      menberMessage: { // 租借信息
        menber_phone: '', // 会员手机
        menber_id: '', // 客户ID
        text_phone: '会员手机',
        text_name: '会员姓名',
        code: '',
        start: '',
        end: '',
        real_pay: '',
        charter_pay: '',
        memo: ''
      },
      head_portrait: '',
      start2: '2018-03-21 13:52:03',
      end2: '',
      totalCabinet: {}
    }
  },
  computed: {
  },
  created() {
    this.__init()
  },
  methods: {
    __init() {
      this.getData()
    },
    // 根据index选择潜在客户类别，对应高亮显示
    curChoose(index) {
      for (let v of this.boxlist) {
        v.checked = false
      }
      this.boxlist[index].checked = true
      let list = []
      if (this.boxlist[index].text === '未借出') {
        for (let i = 0; i < this.allcabinet.length; i++) {
          if (this.allcabinet[i].state === 0) {
            list.push(this.allcabinet[i] ? this.allcabinet[i] : 0)
          }
        }
        this.showcabinet = list
      } else if (this.boxlist[index].text === '已借出') {
        for (let i = 0; i < this.allcabinet.length; i++) {
          if (parseInt(this.allcabinet[i].state) === 1 || parseInt(this.allcabinet[i].state) === 4) {
            list.push(this.allcabinet[i] ? this.allcabinet[i] : 0)
          }
        }
        this.showcabinet = list
      } else if (this.boxlist[index].text === '已禁用') {
        for (let i = 0; i < this.allcabinet.length; i++) {
          if (parseInt(this.allcabinet[i].state) === 2) {
            list.push(this.allcabinet[i] ? this.allcabinet[i] : 0)
          }
        }
        this.showcabinet = list
      } else if (this.boxlist[index].text === '总计') {
        this.showcabinet = this.allcabinet
      }
    },
    curOpenbox(index) {
      console.log(index)
    },
    // 柜子状态查询
    openDialog(status, area, number) {
      this.formState.area = area
      this.formState.number = number
      this.DialogForm.states = status
      const self = this
      this.$store.dispatch('CabinetStates', this.formState).then((res) => {
        // 已借出
        if (parseInt(status) === 4 || parseInt(status) === 1) {
          if (res.cabinetBracelet.customer) {
            self.head_portrait = res.cabinetBracelet.customer.head_portrait
          } else {
            self.head_portrait = ''
          }
          // self.head_portrait = res.cabinetBracelet.customer.head_portrait
          self.DialogForm.areaCode = res.cabinetBracelet.area + '-' + res.cabinetBracelet.number + '号'
          self.DialogForm.gmt_start = res.cabinetBracelet.gmt_start
          self.DialogForm.gmt_end = res.cabinetBracelet.gmt_end
          self.DialogForm.menber_name = res.memberCabinetRecord[0].member_name
          self.DialogForm.menber_phone = res.memberCabinetRecord[0].member_phone
          self.DialogForm.real_pay = res.memberCabinetRecord[0].real_pay
          self.DialogForm.charter_pay = res.memberCabinetRecord[0].charter_pay
          self.DialogForm.code = res.cabinetBracelet.code
          self.DialogForm.mark = res.cabinetBracelet.mark
          if (parseInt(status) === 4) {
            let nTime = new Date().getTime() - new Date(res.cabinetBracelet.gmt_end).getTime()
            let day = Math.ceil(nTime / 86400000)
            self.DialogForm.day = day
            self.centerDialogVisible1 = true
          } else if (parseInt(status) === 1) {
            self.DialogForm.day = 0
            self.centerDialogVisible1 = true
          }
        } else if (parseInt(status) === 2) {
          // 已禁用
          self.centerDialogVisible2 = true
          self.DialogForbidden.areaCode = area + '-' + number + '号'
          self.DialogForbidden.mark = res.mark
          self.DialogForbidden.forbitTime = res.updated_at
          self.DialogForbidden.code = res.code
          self.DialogForbidden.useMark = ''
        } else if (parseInt(status) === 0) {
          // 未出租
          self.centerDialogVisible3 = true
          self.DialogNoRend.areaCode = area + '-' + number + '号'
          self.DialogNoRend.mark = res.mark
          self.DialogNoRend.code = res.code
          self.menberMessage.code = res.code
          // 重置数据
          this.menberMessage.menber_phone = ''
          this.menberMessage.menber_id = ''
          this.menberMessage.text_phone = ''
          this.menberMessage.text_name = ''
          this.head_portrait = ''
          // 默认开始时间为当前时间
          this.menberMessage.start = new Date()
          let y = new Date().getFullYear()
          let m = new Date().getMonth() + 1
          let d = new Date().getDate()
          // 默认结束时间为23:59:59
          this.menberMessage.end = y + '-' + m + '-' + d + ' ' + '23:59:59'
          this.menberMessage.real_pay = ''
          this.menberMessage.charter_pay = ''
          this.menberMessage.memo = ''
        }
      }).catch(() => {
        this.loading = false
      })
    },
    // 启用柜子
    enableCabinet() {
      this.useloading = true
      this.$store.dispatch('UseCabinet', this.DialogForbidden).then(() => {
        this.useloading = false
        this.common.message('success', '柜子启用成功')
        this.getData()
        this.centerDialogVisible2 = false
      }).catch(() => {
        this.loading = false
      })
    },
    search() {
      if (!this.searchPhone) {
        this.common.message('warning', '请输入手机号码')
        return
      }
      getCustomersByPhone(this.searchPhone).then(res => {
        let data = res.data
        if (Object.keys(data).length) {
          this.menberMessage.text_phone = data.phone
          this.menberMessage.text_name = data.name
          this.menberMessage.menber_id = data.id
          this.head_portrait = data.head_portrait
          this.getCabinetById(data.id)
        } else {
          this.common.message('warning', '该客户无租柜信息')
        }
      }).catch(() => {
        this.common.message('warning', '该客户无租柜信息')
        console.log('失败')
      })
    },
    getCabinetById(id) {
      cabinetMsgById(id).then((res) => {
        if (Object.keys(res.data).length) {
          this.centerDialogVisible1 = true
          this.DialogForm.areaCode = res.data.cabinet.area + '-' + res.data.cabinet.number + '号'
          this.DialogForm.code = res.data.cabinet.code
          this.DialogForm.gmt_start = res.data.gmt_start
          this.DialogForm.gmt_end = res.data.gmt_end
          this.DialogForm.menber_name = res.data.member_name
          this.DialogForm.menber_phone = res.data.member_phone
          this.DialogForm.real_pay = res.data.real_pay
          this.DialogForm.charter_pay = res.data.charter_pay
          this.DialogForm.mark = res.data.memo
          this.searchPhone = ''
          if (new Date().getTime() - new Date(res.data.gmt_end).getTime()) {
            let nTime = new Date().getTime() - new Date(res.data.gmt_end).getTime()
            let day = Math.ceil(nTime / 86400000)
            this.DialogForm.day = day
          } else {
            this.DialogForm.day = 0
          }
        } else {
          this.common.message('warning', '该客户无租柜信息')
          console.log('失败')
        }
      }).catch(() => {
        this.common.message('warning', '该客户无租柜信息')
        console.log('失败')
      })
    },
    getLength() {
      this.tipLength = this.DialogNoRend.forbitMark.length
    },
    // 禁用柜子
    disableCabinet() {
      this.useloading = true
      this.$store.dispatch('NoUseCabinet', this.DialogNoRend).then(() => {
        this.useloading = false
        this.common.message('success', '禁用柜子成功')
        this.getData()
        this.centerDialogVisible4 = false
        this.centerDialogVisible3 = false
      }).catch(() => {
        this.useloading = false
      })
    },
    // 续费柜子
    renewCabinet(code) {
      this.DialogRenew.code = code
      if (!this.DialogRenew.gmt_end) {
        this.common.message('warning', '结束时间不能为空')
        return false
      }
      this.$store.dispatch('RenewCabinet', this.DialogRenew).then(() => {
        this.loading = false
        this.common.message('success', '续费成功')
        this.centerDialogVisible1 = false
        this.centerDialogVisible5 = false
        this.getData()
      }).catch(() => {
        this.loading = false
      })
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
            this.$message('暂无会员卡信息')
            this.menberMessage.text_phone = ''
            this.menberMessage.text_name = ''
            this.menberMessage.menber_id = ''
            this.head_portrait = ''
          }
        })
      }
    },
    // 柜子归还
    backCabinet() {
      this.useloading = true
      this.$store.dispatch('BackCabinet', this.DialogBack).then(() => {
        this.backloading = false
        this.common.message('success', '柜子归还成功')
        this.centerDialogVisible1 = false
        this.centerDialogVisible6 = false
        this.getData()
      }).catch(() => {
        this.backloading = false
      })
    },
    // // 时间选择
    // timeChoose(data) {
    //   this.allFormData.business_start = parseTime(data[0], '{h}:{i}')
    //   this.allFormData.business_end = parseTime(data[1], '{h}:{i}')
    // },
    // 租借信息确认
    rentCabinet() {
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
      if (!this.menberMessage.real_pay) {
        this.menberMessage.real_pay = 0
      }
      if (!this.menberMessage.charter_pay) {
        this.menberMessage.charter_pay = 0
      }
      this.menberMessage.start = parseTime(this.menberMessage.start, '{y}-{m}-{d} {h}:{i}:{s}')
      this.menberMessage.end = parseTime(this.menberMessage.end, '{y}-{m}-{d} {h}:{i}:{s}')
      this.rentloading = true
      this.$store.dispatch('RentCabinetMessage', this.menberMessage).then(() => {
        this.rentloading = false
        this.common.message('success', '租借成功')
        this.centerDialogVisible3 = false
        this.getData()
      }).catch(() => {
        this.rentloading = false
      })
    },
    forbidden() {
      this.centerDialogVisible4 = true
    },
    renew() {
      this.renewDataReset()
      this.centerDialogVisible5 = true
    },
    renewDataReset() {
      this.DialogRenew.real_pay = ''
      // this.DialogForm.renew_rentMoney = ''
      this.DialogRenew.gmt_end = ''
      this.DialogRenew.memo = ''
    },
    back(code) {
      this.DialogBack.code = code
      this.centerDialogVisible6 = true
    },
    getData() {
      let self = this
      self.showcabinet = []
      this.$store.dispatch('GetAllCabinet').then((response) => {
        this.loading = false
        this.area = response.areas
        this.allcabinet = response.cabinetBracelet
        this.count = response.count
        let total = 0
        if (self.count.length === 0) {
          self.boxlist[0].num = 0
          self.boxlist[1].num = 0
          self.boxlist[2].num = 0
          self.boxlist[3].num = 0
        } else {
          for (let i = 0; i < self.count.length; i++) {
            total += self.count[i].cabinetCount
            self.boxlist[0].num = total
            // status:0未出租，status:1已出租，status:2禁用
            if (self.count[i].state === 0) {
              self.boxlist[1].num = self.count[i].cabinetCount
            }
            if (self.count[i].state === 1) {
              self.boxlist[2].num = self.count[i].cabinetCount
            }
            if (self.count[i].state === 2) {
              self.boxlist[3].num = self.count[i].cabinetCount
            }
          }
        }
        for (let i = 0; i < self.allcabinet.length; i++) {
          for (let j = 0; j < self.area.length; j++) {
            if (self.allcabinet[i].area === self.area[j].area) {
              self.showcabinet.push(self.allcabinet[i])
            }
          }
        }
        for (let i = 0; i < self.showcabinet.length; i++) {
          if (self.showcabinet[i].state === 1 & self.showcabinet[i].gmt_end != null) {
            if (new Date(self.showcabinet[i].gmt_end).getTime() - new Date().getTime() < 0) {
              self.showcabinet[i].state = '4'
              let nTime = new Date().getTime() - new Date(self.showcabinet[i].gmt_end).getTime()
              let day = Math.ceil(nTime / 86400000)
              self.showcabinet[i].day = day
            }
          }
        }
      }).catch(() => {
        this.loading = false
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
}
.sm{
  width: 36px;
  display: inline-block;
  height: 36px;
  background: url("../../../assets/icon/qr.png") no-repeat;
  background-size: contain;
  vertical-align: middle;
  margin-right: -4px;
  margin-top: -4px;
  border-radius: 5px 0 0 5px;
}
.otherSearch .el-select .el-input {
  width: 180px;
  padding-left: 0px;
}
.red {
  color: red;
}
.el-dialog {
  ul {
    padding: 0;
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
        cursor: pointer;
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
    bottom: 0;
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
        vertical-align: middle;
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
      margin: 0.3%;
      margin-bottom: 0;
      margin-right: 0;
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
  margin-top: 60px;
  text-align: center;
}
.qr{
  width: 40px;
  position: absolute;
  left: 0;
  top: 0;
  height: 36px;
  background: url("../../../assets/icon/qr.png") no-repeat;
  background-size: contain;
}
</style>
