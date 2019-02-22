<template>
  <el-dialog
    title="查看明细"
    :visible.sync="dialogVisible"
    width="1400px"
    class="report-dialog" :close-on-click-modal="false">
    <div ref="myDiv">
      <div>
        <title-header 
        :headerContent='headerContent'
        @printPages='printPages'></title-header>
      </div>

      <div class="boxff">
        <div class="title">表一：员工业绩总表</div>
          <total-table 
          :tableList="tableList"></total-table>
      </div>

      <div class="boxff">
        <div class="title"><span class="spTitle">表二：会员卡业绩明细表</span> <span class="mysapn">总订单数：<i class="myI">{{cardOrder}}</i>单</span><span class="mysapn">总业绩：<i class="myI">{{cardMoney}}</i>元</span></div>
        <card-table 
          ref="cardDoc"></card-table>
      </div>

      <div class="boxff">
        <div class="title"><span class="spTitle">表三：私教课业绩明细表</span> <span class="mysapn">总订单数：<i class="myI">{{privateOrder}}</i>单</span><span class="mysapn">总业绩：<i class="myI">{{privateMoney}}</i>元</span></div>
        <private-table 
          ref="privateDoc"></private-table>
      </div>

      <div class="boxff">
        <div class="title">
          <span class="spTitle">表四：团课业绩明细表</span> 
          <span class="mysapn">总订单数：<i class="myI">{{groupOrder}}</i>单</span>
          <span class="mysapn">总业绩：<i class="myI">{{groupMoney}}</i>元</span>
        </div>
        <group-table 
          ref="groupDoc"></group-table>
      </div>

      <div class="boxff">
        <div class="title"><span class="spTitle">表五：其他业绩明细表</span>
          <span class="mysapn">总订单数：<i class="myI">{{otherOrder}}</i>单</span>
          <span class="mysapn">总业绩：<i class="myI">{{otherMoney}}</i>元</span>
        </div>
        <other-table 
          ref="otherDoc"></other-table>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { totalTypeSale } from '@/api/statistics'
import { setSession } from '@/utils/auth'
import titleHeader from './titleHeader'
import totalTable from './totalTable'
import cardTable from './cardTable'
import privateTable from './privateTable'
import groupTable from './groupTable'
import otherTable from './otherTable'
import { parseTime } from '@/utils/index'
export default {
  name: 'staffReportDetail',
  components: {
    titleHeader,
    totalTable,
    cardTable,
    privateTable,
    groupTable,
    otherTable
  },
  props: {
  },
  data() {
    return {
      headerContent: {
        name: '',
        startTime: '',
        endTime: '',
        order: '',
        type: '会员卡业绩（售卡、转卡、停卡、续卡），私教课业绩（售课），团课业绩（售课），其他业绩（购物、租柜）',
        money: '',
        gym: ''
      },
      dialogVisible: false,
      listLoading: false,
      tableKey: 0,
      tableList: [],
      totalTable: [],
      cardOrder: 0,
      cardMoney: 0,
      privateOrder: 0,
      privateMoney: 0,
      groupOrder: 0,
      groupMoney: 0,
      otherOrder: 0,
      otherMoney: 0,
      totalOrder: 0,
      totalMoney: 0,
      // cardTable: [],
      // privateTable: [],
      // groupTable: [],
      // otherTable: [],
      listQuery: {
        date_egt: '',
        date_lt: '',
        sell_id: ''
      }
    }
  },
  mounted() {
  },
  created() {
  },
  watch: {
  },
  computed: {
  },
  // updated() {
  // },
  methods: {
    dialogShow(id, name, obj, order, money) {
      this.headerContent.name = name
      this.headerContent.startTime = obj.date_egt
      this.headerContent.endTime = parseTime(new Date(obj.date_lt) - 86400000, '{y}-{m}-{d}')
      this.headerContent.order = order
      this.headerContent.money = Number(money).toFixed(2)
      this.listQuery.date_egt = obj.date_egt
      this.listQuery.date_lt = obj.date_lt
      this.listQuery.sell_id = id
      this.dialogVisible = true
      this.totalTypeSale()
      this.$nextTick(() => {
        this.$refs.cardDoc.getList(this.listQuery)
        this.$refs.privateDoc.getList(this.listQuery)
        this.$refs.groupDoc.getList(this.listQuery)
        this.$refs.otherDoc.getList(this.listQuery)
      })
    },
    totalTypeSale() {
      this.addClose()
      totalTypeSale(this.listQuery).then(res => {
        this.cardMoney = (Number(res.data[2].real_total_fee) + Number(res.data[4].real_total_fee) + Number(res.data[5].real_total_fee) + Number(res.data[7].real_total_fee)).toFixed(2)
        this.privateMoney = (Number(res.data[3].real_total_fee)).toFixed(2)
        this.groupMoney = (Number(res.data[6].real_total_fee)).toFixed(2)
        this.otherMoney = (Number(res.data[1].real_total_fee) + Number(res.data[8].real_total_fee) + Number(res.data[9].real_total_fee)).toFixed(2)
        this.totalMoney = (Number(this.cardMoney) + Number(this.privateMoney) + Number(this.groupMoney) + Number(this.otherMoney)).toFixed(2)
        this.tableList.push({ order: '订单数', card: this.cardOrder, course: this.privateOrder, group: this.groupOrder, other: this.otherOrder, total: this.totalOrder })
        this.tableList.push({ order: '业绩金额', card: this.cardMoney, course: this.privateMoney, group: this.groupMoney, other: this.otherMoney, total: this.totalMoney })
      })
    },
    // getList() {
    //   this.addClose()
    //   orderLists(this.listQuery).then(res => {
    //     for (let i = 0; i < res.data.length; i++) {
    //       if (res.data[i].type === 2) {
    //         this.cardTable.push(res.data[i]) // 售卡
    //       } else if (res.data[i].type === 4) { // 转卡
    //         this.cardTable.push(res.data[i])
    //       } else if (res.data[i].type === 5) { // 停卡
    //         this.cardTable.push(res.data[i])
    //       } else if (res.data[i].type === 7) { // 续卡
    //         this.cardTable.push(res.data[i])
    //       }
    //       if (res.data[i].type === 3) { // 私教课
    //         this.privateTable.push(res.data[i])
    //       }
    //       if (res.data[i].type === 6) { // 团课
    //         this.groupTable.push(res.data[i])
    //       }
    //       if (res.data[i].type === 1) { // 购物
    //         this.otherTable.push(res.data[i])
    //       } else if (res.data[i].type === 8) { // 租柜
    //         this.otherTable.push(res.data[i])
    //       } else if (res.data[i].type === 9) { // 续柜
    //         this.otherTable.push(res.data[i])
    //       }
    //     }
    //     this.cardOrder = this.cardTable.length
    //     this.privateOrder = this.privateTable.length
    //     this.groupOrder = this.groupTable.length
    //     this.otherOrder = this.otherTable.length
    //     this.totalOrder = Number(this.cardOrder) + Number(this.privateOrder) + Number(this.groupOrder) + Number(this.otherOrder)
    //     this.totalTypeSale()
    //   })
    // },
    addClose() {
      // this.cardTable = []
      // this.privateTable = []
      // this.groupTable = []
      // this.otherTable = []
      this.tableList = []
      this.cardMoney = 0
      this.privateMoney = 0
      this.groupMoney = 0
      this.otherMoney = 0
      this.totalMoney = 0
    },
    printPages() {
      var printHtml = this.$refs.myDiv.outerHTML
      setSession('employeeAchivementtext', printHtml)
      window.open(this.staticurl + 'static/protocolprint/employeeAchivement.html')
    }
  }
}
</script>
<style lang="scss" scoped>
.boxff {
  margin: 40px 0;
  width: 100%;
}
.title {
  font-size: 16px;
  color: #333;
  font-weight: bold;
  margin-bottom: 10px;
  margin-left: 5px;
}
.title .spTitle {
  display: inline-block;
  width: 200px;
}
.title .mysapn {
  margin-left: 50px;
}
.title .mysapn .myI {
  color: #EE6723;
  font-style: normal;
  margin-right: 5px;
}
</style> 