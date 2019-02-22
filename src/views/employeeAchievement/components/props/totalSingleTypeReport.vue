<template>
  <el-dialog
    title="查看报表"
    :visible.sync="dialogVisible"
    width="1405px"
    class="report-dialog" :close-on-click-modal="false">
    <div ref="myDiv">
      <div>
        <title-header
        :headerContent='headerContent'
        @printPages='printPages'></title-header>
      </div>
      
      <div class="table-box">
        <card-table 
          v-if="type==='card'" ref="tableDoc"></card-table>
        <other-table 
          v-if="type==='other'" ref="tableDoc"></other-table>
      </div>
      
    </div>
  </el-dialog>
</template>

<script>
import { setSession } from '@/utils/auth'
import titleHeader from './titleHeader'
import cardTable from './cardTable'
import otherTable from './otherTable'
import { parseTime } from '@/utils/index'
export default {
  name: 'totalSingleTypeReport',
  components: {
    titleHeader,
    cardTable,
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
        type: '',
        money: '',
        gym: ''
      },
      dialogVisible: false,
      listLoading: false,
      total: null,
      listQuery: {
        date_egt: '',
        date_lt: '',
        sell_id: ''
      },
      type: '',
      tableKey: 0,
      tableList: [],
      paginationShow: true
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
  methods: {
    dialogShow(id, type, name, obj, order, money) {
      this.headerContent.name = name
      this.headerContent.startTime = obj.date_egt
      this.headerContent.endTime = parseTime(new Date(obj.date_lt) - 86400000, '{y}-{m}-{d}')
      this.headerContent.order = order
      this.headerContent.money = Number(money).toFixed(2)
      if (type === 'card') {
        this.headerContent.type = '会员卡业绩（售卡、转卡、停卡、续卡）'
        // this.listQuery.type = '2,4,5,7'
      }
      if (type === 'other') {
        this.headerContent.type = '其他业绩（购物，租柜）'
        // this.listQuery.type = '1,8,9'
      }
      this.listQuery.date_egt = obj.date_egt
      this.listQuery.date_lt = obj.date_lt
      this.listQuery.sell_id = id
      this.type = type
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.tableDoc.getList(this.listQuery)
      })
    },
    // getList() {
    //   this.tableList = []
    //   orderLists(this.listQuery).then(res => {
    //     this.tableList = res.data.data
    //     this.total = res.data.total
    //   })
    // },
    getType(val) {
      switch (val) {
        case 2: {
          return '售卡'
        }
        case 4: {
          return '转卡'
        }
        case 5: {
          return '停卡'
        }
        case 7: {
          return '续卡'
        }
        case 1: {
          return '购物'
        }
        case 8: {
          return '租柜'
        }
        case 9: {
          return '租柜'
        }
        default:
          return ''
      }
    },
    getPayMethod(val) {
      switch (val) {
        case 1: {
          return '现金'
        }
        case 2: {
          return '支付宝'
        }
        case 3: {
          return '微信'
        }
        case 4: {
          return '银行卡'
        }
        case 5: {
          return '储值卡'
        }
        default:
          return ''
      }
    },
    printPages() {
      var printHtml = this.$refs.myDiv.outerHTML
      setSession('employeeAchivementtext', printHtml)
      window.open(this.staticurl + 'static/protocolprint/employeeAchivementTypeAll.html')
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
    }
  }
}
</script>
<style lang="scss" scoped>
.table-box {
  margin-top: 20px;
}
</style>