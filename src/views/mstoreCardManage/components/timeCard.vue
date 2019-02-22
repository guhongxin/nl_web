<template>
  <div>
    <div class="boxser">
      <rectbox :data="boxlist" v-on:choose="curChoose" v-on:openbox="curOpenbox" @overChange="curOverChange"></rectbox>
    </div>
    <div class="find-box3">
      <div style="overflow:hidden" class="filter-container">
        <scan-input :select="searchSelect" :defaultSelect="searchSelect[0].value" @kedownOver="searchlist" ref="scanIputDoc"></scan-input>
        <bulk-action :select="batchFileter" @changeBulk="searchGroup" :isBtnRoleList="true"></bulk-action>
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
    <el-table @filter-change="filterChange" @sort-change="sortChange" stripe :key='tableKey' @selection-change="selectionChange" class="check-table" :data="listData" v-loading="listLoading"
      element-loading-text="列表正在加载中" border fit highlight-current-row>
      <el-table-column align="center" type="selection"></el-table-column>
      <el-table-column align="center" :label="'会员卡号'"  prop="card_no" width="240px">
        <template slot-scope="scope">
          <span><span class="through">通</span>{{scope.row.card_no}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="'卡种名称'" prop="card_name" width="200px">
        <template slot-scope="scope">
          <span>{{scope.row.card_name}}</span>
        </template>
      </el-table-column>
      <el-table-column width="110px" align="center" :label="'头像'" style="display:flex;justify-content: center;padding-left:0px;padding-right:0px;">
        <template slot-scope="scope">
          <span style="display: inline-block;">
            <img @click="common.bigImg($event)" :src="scope.row.customer?(scope.row.customer.head_portrait?scope.row.customer.head_portrait:defaulthead):defaulthead" alt="icon" width="30" height="30" style="display: list-item;border-radius:50%;">
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="'姓名'"  prop="customer" width="180">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" v-if="scope.row.customer&&scope.row.customer.deleted_at" :content="`客户已删除，删除时间: ${scope.row.customer?scope.row.customer.deleted_at:'-'}`" placement="bottom">
            <el-button type="info" size="mini">{{scope.row.customer?scope.row.customer.name:'-'}}</el-button>
          </el-tooltip>
          <span v-else>{{scope.row.customer ? scope.row.customer.name : '-'}}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" :label="'手机号码'">
        <template slot-scope="scope">
          <span>{{scope.row.customer?scope.row.customer.phone:'-'}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'办理时间'" width="200" align="center" sortable='custom' prop="created_at_sort">
        <template slot-scope="scope">
         {{common.customFormat(scope.row.bought_at, 'yyyy-MM-dd')}}
        </template>
      </el-table-column>
      <el-table-column :label="'开卡时间'" width="200" align="center" sortable='custom' prop="start_date_sort">
        <template slot-scope="scope">
         {{common.customFormat(scope.row.start_date, 'yyyy-MM-dd')}}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" :label="'失效时间'" width="200" align="center" sortable='custom' prop="over_date_sort">
        <template slot-scope="scope">
         {{common.customFormat(scope.row.over_date, 'yyyy-MM-dd')}}
        </template>
      </el-table-column>
      <el-table-column :label="'总天数'" width="120" align="center" prop="allDay">
        <template slot-scope="scope">
         {{getDay(scope.row.start_date, scope.row.end_date)}}
        </template>
      </el-table-column>
      <el-table-column :label="'剩余天数'" width="120" align="center" prop="leftDay">
        <template slot-scope="scope">
         {{scope.row.has_date}}
        </template>
      </el-table-column>
      <el-table-column :label="'赠时'" width="120" align="center">
        <template slot-scope="scope">
         {{scope.row.give_day?scope.row.give_day : '-'}}
        </template>
      </el-table-column>
      <el-table-column align="center" :label="'销售分店'" width="150">
        <template slot-scope="scope">
          <span>{{scope.row.gym?scope.row.gym.name:'-'}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'卡锁定'" width="150" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            :active-value="1"
            :inactive-value="0"
            inactive-color="#E7EAEC"
            active-color="#f56c6c"
            :disabled="isTimesStorageStation"
            @change='cardLock(scope.row.status, scope.$index, scope.row)'>
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column :label="'备注'" width="200" align="center">
        <template slot-scope="scope">
         {{scope.row.remark}}
        </template>
      </el-table-column>
      <el-table-column align="center" fixed="right" :label="$t('table.actions')" class-name="small-padding fixed-width" width="150">
        <template slot-scope="scope">
          <template v-if="listQuery.status===7">
            <!-- <el-dropdown-item  @click.native="restoreCardBtn(scope.row)" >恢复</el-dropdown-item> -->
            <el-button size="mini" type="info" @click="dgrecycleBin(scope.row)">删除</el-button>
          </template>
          <template v-else>
            <el-button size="mini" type="primary" @click="handleDetails(scope.row)">{{$t('table.details')}}</el-button>
            <el-button size="mini" type="info" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container" style="text-align:right;;padding-bottom:20px">
      <el-pagination 
        v-if="paginationShow"
        background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
        :page-sizes="[10, 20, 30, 40, 50]" :page-size="listQuery.per_page" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

 
    <!-- 详情 -->
    <vip-card-detail-dialog
      v-if="vipCardDetailsDialogVisible"
      :dialogVisible='vipCardDetailsDialogVisible'
      @dialogClosed='dialogClosedDetails'
      ref="vipCardDetailsDialogDoc"
      :isSecondCard="1"
      :widthSize="'1000px'"
    > </vip-card-detail-dialog>
   
    <upload-dialog
      v-if="updloadDialogVisible"
      :dialogVisible="updloadDialogVisible"
      :widthSize="'700px'"
      @dialogClosed="uploadDialogClosed"
      @UploadComplete="UploadComplete"
      @uploadCencel="uploadCencel">
    </upload-dialog>
    <!-- 导入Excel数据错误提示弹窗 -->
    <input-excel-err-dialog
      v-if="inputExcelErrDialogVisible"
      :dialogVisible="inputExcelErrDialogVisible"
      :widthSize="'1000px'"
      @dialogClosed="inputExcelErrDialogClosed"
      @dialogBtnOk="dialogBtnOk"
      :sid="sid">
    </input-excel-err-dialog>

    <input-excel-progress
      :dialogVisible="excelProgress"
      :schedule="pressData"
      :total="excelDataTotal"
      :alreadyTotal="alreadyUpload"
      :iSerror="excelIsError"
      @retryBtn="retryBtn"
      ></input-excel-progress>

    <!-- 删除通卡 -->
    <delete-dialog 
      :tipMessage="'确定要删除选中的通卡?'"
      ref="deleteDialogDoc"
      @deleteSureBtn='deleteCardSure'></delete-dialog>
    <!-- 硬删除通卡 -->
    <delete-dialog 
      :tipMessage="'确定要硬删除回收站中的通卡?'"
      ref="deleteDialogDoc1"
      @deleteSureBtn='deleteCardSure1'></delete-dialog>

  </div>
</template>

<script>
import rectbox from '@/components/rectbox'
import scanInput from '@/components/scanInput'
import bulkAction from '@/components/bulkAction'
import VipCardDetailDialog from './VipCardDetailDialog'
import InputExcelErrDialog from './InputExcelErrDialog'
import InputExcelProgress from './inputExcelProgress'

import UploadDialog from './uploadDialog'
import { remnantDay, cardStatus } from '@/utils/comm'
import { msCardList, msCardTypeNumb, deletemsCard, batchDeletemsCard, msCardstatusToggle, msCardInpormtDetails, msCardInpormtRetryAll, msdeforceDeleteCard } from '@/api/mstoreCard'
import deleteDialog from '@/components/deleteDialog'

export default {
  name: 'timeCard',
  components: {
    rectbox,
    scanInput,
    bulkAction,
    VipCardDetailDialog,
    UploadDialog,
    InputExcelErrDialog,
    InputExcelProgress,
    deleteDialog
  },
  data() {
    return {
      tags: [],
      updloadDialogVisible: false,
      searchSelect: [{
        text: '会员卡号',
        value: 'card_no_like'
      },
      {
        text: '卡种名称',
        value: 'card_name_like'
      }],
      batchOperation: [{
        label: '批量删除',
        value: 'delete',
        isShow: 'a123456'
      }, {
        label: '批量导入',
        value: 'excel_Import',
        isShow: 'a1234567'
      },
      {
        label: '导出全部',
        value: 'excel_Outport',
        isShow: 'a1234567'
      }],
      select: '',
      tableKey: 0,
      listData: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        per_page: 10,
        status: undefined,
        title: undefined,
        type: 1,
        day: undefined,
        overed_day: undefined
      },
      boxlist: [
        {
          text: '全部',
          num: 0,
          checked: true,
          bocolor: 'rgb(28, 132, 198)',
          type: undefined,
          filter: 'all'
        },
        {
          text: '有效卡',
          num: 0,
          checked: false,
          bocolor: 'rgb(81, 169, 202)',
          type: 1,
          filter: 'effective'
        },
        {
          text: '即将失效',
          num: 0,
          checked: false,
          bocolor: 'rgb(65, 189, 190)',
          rbtn: '最近5天',
          type: 2,
          filter: 'overing',
          select: [{
            label: '最近5天'
          }, {
            label: '最近30天'
          }, {
            label: '最近90天'
          }]
        },
        {
          text: '已失效',
          num: 0,
          checked: false,
          bocolor: 'rgb(26, 179, 148)',
          type: 3,
          filter: 'overed',
          rbtn: '全部',
          select: [{
            label: '全部'
          }, {
            label: '最近5天'
          }, {
            label: '最近30天'
          }, {
            label: '最近90天'
          }]
        },
        {
          text: '未开卡',
          num: 0,
          checked: false,
          bocolor: 'rgb(241, 76, 48)',
          type: 5,
          filter: 'unactive'
        },
        {
          text: '停卡中',
          num: 0,
          checked: false,
          bocolor: 'rgb(177, 197, 211)',
          type: 4,
          filter: 'stopped'
        },
        {
          text: '预约停卡',
          num: 0,
          checked: false,
          bocolor: '#DDDDDD',
          type: 6,
          filter: 'delay_stop'
        },
        {
          text: '回收站',
          num: 0,
          checked: false,
          bocolor: '#CCCCCC',
          type: 7,
          filter: 'deleted'
        }
      ],
      vipCardDetailsDialogVisible: false,
      groupOprate: {
        ids: []
      },
      action: '',
      headers: null,
      sellList: [],
      listCount: {
        type: 1,
        day: 5, // 即将到期天数 默认5天
        overed_day: undefined // 已过期天数
      },
      paginationShow: true,
      isTimesStorageStation: false,
      inputExcelErrDialogVisible: false, // 导入错误提醒
      sid: '',
      excelProgress: false, // 显示进度
      pressData: 0,
      excelDataTotal: 0, // 导入Excel总条数
      alreadyUpload: 0, // 已经上传tiaos
      excelIsError: false,
      deleteId: 0 // 删除通卡的id
    }
  },
  computed: {
    batchFileter() {
      let _isShow = this.listQuery.status ? this.listQuery.status + '' : 'a'
      let result = this.batchOperation.filter(item => {
        return item.isShow.indexOf(_isShow) !== -1
      })
      return result
    }
  },
  created() {
    this.__init()
  },
  mounted() {
  },
  methods: {
    __init() {
      this.$init()
    },
    searchlist(obj) {
      if (obj.value === '') {
        delete this.tags[0]
      } else {
        let tagszh = {
          card_no_like: '会员卡号:',
          template_name_like: '卡种名称:'
        }
        this.$set(this.tags, 0, { 'name': `${tagszh[obj.type]}${obj.value}`, 'type': obj.type })
      }
      delete this.listQuery.card_no_like
      delete this.listQuery.card_name_like
      this.listQuery[obj.type] = obj.value
      this.listQuery.page = 1
      this.pageInit()
      this.getList()
    },
    curOverChange(obj) {
      // 右上角 筛选结果条件触发
      this.boxlist[obj.fatherIndex].rbtn = obj.label
      this.curChoose(obj.fatherIndex)
    },
    curChoose(index) {
      for (let v of this.boxlist) {
        v.checked = false
      }
      this.boxlist[index].checked = true
      this.listQuery.status = this.boxlist[index].type
      this.isTimesStorageStation = this.listQuery.status === 7
      let _scope_value = this.boxlist[index].rbtn ? this.boxlist[index].rbtn.replace(/[^0-9]/ig, '') : ''
      let _scopeValue = _scope_value.length > 0 ? Number(_scope_value) : undefined
      if (this.boxlist[index].type === 2) {
        this.listCount.day = _scopeValue
        delete this.listQuery.overed_day
        this.listQuery.day = _scopeValue
      } else if (this.boxlist[index].type === 3) {
        this.listCount.overed_day = _scopeValue
        delete this.listQuery.day
        this.listQuery.overed_day = _scopeValue
      } else {
        delete this.listQuery.overed_day
        delete this.listQuery.day
      }
      this.getRectData()
      this.getList()
    },
    curOpenbox(index) {
      // 点击右上角筛选条件 触发
      console.log(this.boxlist[index].text)
    },
    getList() {
      // 获取时效卡列表
      this.listLoading = true
      msCardList(this.listQuery).then(response => {
        this.listData = response.data
        this.total = Number(response.headers.pagination.split(',')[1])
        this.listLoading = false
      })
    },
    getRectData() {
      // 获取会员卡数量
      let obj = this.listCount
      msCardTypeNumb(obj).then(response => {
        let data = response.data
        for (let key in data) {
          for (let item of this.boxlist) {
            if (item.filter === key) {
              item.num = data[key]
            }
          }
        }
      })
    },
    handleCurrentChange(val) {
      // 改变当前页码
      this.listQuery.page = val
      this.getList()
    },
    handleSizeChange(val) {
      // 改变每页数量
      this.listQuery.per_page = val
      this.getList()
    },
    /**
    * 详情弹窗
    */
    handleDetails(row) {
      // 弹出
      this.vipCardDetailsDialogVisible = true
      this.$nextTick(() => {
        this.$refs.vipCardDetailsDialogDoc.getVipDetail(row)
      })
    },
    dialogClosedDetails() {
      // 关闭
      this.vipCardDetailsDialogVisible = false
    },
    handleDelete(row) {
      // 删除
      this.deleteId = row.id
      this.$nextTick(() => {
        this.$refs.deleteDialogDoc.dialogShow()
      })
    },
    deleteCardSure() {
      deletemsCard(this.deleteId).then(res => {
        this.$message({
          type: 'success',
          message: '删除该张通卡成功'
        })
        this.$refs.deleteDialogDoc.dialogClose()
        this.$init()
      }).catch(err => {
        console.log(err)
        this.$refs.deleteDialogDoc.dialogLoadingClose()
      })
    },
    /**
    * 批量操作
    */
    selectionChange(selection) {
      // 表格左侧多选勾选按钮
      this.groupOprate.ids = []
      for (let i = 0; i < selection.length; i++) {
        this.groupOprate.ids.push(selection[i].id)
      }
    },
    searchGroup(value) {
      // 批量操作
      if (value === 'delete') {
        if (this.groupOprate.ids.length === 0) {
          this.$message({
            type: 'warning',
            message: '请先选择会员卡'
          })
          return false
        }
        this.$confirm('是否批量删除选中的数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          batchDeletemsCard(this.groupOprate).then(res => {
            if (res) {
              this.$message({
                type: 'success',
                message: '批量删除通卡成功'
              })
              this.$init()
            }
          }).catch(err => {
            console.log(err)
          })
        }).catch(() => {
          console.log('取消删除')
        })
      } else if (value === 'excel_Import') {
        // 批量导入
        this.updloadDialogVisible = true
      } else if (value === 'excel_Outport') {
        // 批量导出
        let obj = {
          type: this.listQuery.type,
          // status: this.listQuery.status,
          fileName: '导出全部通卡.xlsx'
        }
        this.common.exportExcel('/api/v2/gym/hq/cards/unities/export', obj)
      }
    },
    UploadComplete(uploadExcelData) {
      this.excelDataTotal = 0
      this.alreadyUpload = 0
      this.pressData = 0
      this.common.importExcel1('/api/v2/gym/hq/cards/unities/upload', uploadExcelData).then((res) => {
        console.log('res', res)
        this.excelProgress = true
        this.excelDataTotal = res.total
        this.excelId = res.id
        this.$cardInpormtDetails()
      }).catch(err => {
        // 上传失败
        this.inputExcelErrDialogVisible = true
        this.sid = err.id
      })
      this.updloadDialogVisible = false
    },
    uploadCencel() {
      this.updloadDialogVisible = false
    },
    $init() {
      this.getRectData()
      this.getList()
    },
    $remnantDay(param) {
      return remnantDay(param)
    },
    $fileName(param) {
      let result = ''
      switch (param) {
        case 1:
          result = '导出有效会员卡.xlsx'
          break
        case 2:
          result = '导出即将到期会员卡.xlsx'
          break
        case 3:
          result = '导出已过期会员卡.xlsx'
          break
        case 4:
          result = '导出停卡中会员卡.xlsx'
          break
        case 5:
          result = '导出未卡开会员卡.xlsx'
          break
        case 6:
          result = '导出预约停卡会员卡.xlsx'
          break
        case 7:
          result = '导出回收站会员卡.xlsx'
          break
        default:
          result = '导出所有会员卡.xlsx'
          break
      }
      return result
    },
    cardStatus(param) {
      return cardStatus(param)
    },
    getDay(param1, param2) {
      let _startTime = new Date(param1)
      let _endTime = new Date(param2)
      let result = (_endTime - _startTime) / 86400000
      return result
    },
    uploadDialogClosed() {
      // 关闭上传下载弹窗
      this.updloadDialogVisible = false
    },
    inputExcelErrDialogClosed() {
      // 导入数据错误提醒弹窗关闭
      this.inputExcelErrDialogVisible = false
    },
    dialogBtnOk() {
      // 查看错误详情
      this.inputExcelErrDialogVisible = false
    },
    pageInit() {
      this.paginationShow = false
      this.$nextTick(() => {
        this.paginationShow = true
      })
    },
    tagclose(tag, index) {
      this.common.tagFilter(this, tag, index, this.searchSelect)
    },
    sortChange(data) {
      delete this.listQuery[this.middleParam]
      this.middleParam = data.prop
      if (data.prop) {
        this.listQuery[data.prop] = data.order ? (/asc/.test(data.order) ? 'asc' : 'desc') : null
      }
      this.listQuery.page = 1
      this.getList()
    },
    filterChange(data) {
      console.log(data)
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
      if (key === 'operator_id') {
        if (!data[key].length) {
          this.hostFilter(data, key, 1, '')
          return
        }
        this.hostFilter(data, key, 1, '销售人：' + font)
      }
    },
    hostFilter(data, key, index, text) {
      if (data[key].length === 0) {
        delete this.tags[index]
      } else {
        this.$set(this.tags, index, { name: text, type: key })
      }
    },
    $cardInpormtDetails() {
      this.importCardTimer = setInterval(() => {
        msCardInpormtDetails(this.excelId).then(response => {
          let _data = response.data
          this.websoketFun(_data)
        }).catch(err => {
          console.log(err)
          this.excelProgress = false
          clearInterval(this.importCardTimer)
        })
      }, 2000)
    },
    websoketFun(param) {
      if (param) {
        if (param.executed_fails && (param.executed_fails + param.executed) === param.times) {
          // 插入数据库批次是否完成
          this.excelIsError = true
          clearInterval(this.importCardTimer)
        } else {
          this.prevAlreadyTotal = param.inserted_rows
          this.alreadyUpload = param.inserted_rows
          if (this.alreadyUpload <= this.excelDataTotal) {
            this.pressData = Math.floor(this.alreadyUpload * 100 / this.excelDataTotal)
          } else {
            this.pressData = 100
          }
          if (this.alreadyUpload === this.excelDataTotal) {
            setTimeout(() => {
              this.excelProgress = false
              this.$init()
            }, 1000)
            clearInterval(this.importCardTimer)
          }
        }
      }
    },
    retryBtn() {
      this.excelIsError = false
      msCardInpormtRetryAll(this.excelId).then(res => {
        this.$cardInpormtDetails()
      }).catch(err => {
        console.log(err)
      })
    },
    cardLock(status, index, row) {
      // 卡锁定切换
      let middleIsPost = status === 1 ? 0 : 1
      let obj = {
        id: row.id,
        status: status
      }
      let msg = status === 1 ? '锁卡成功' : '解锁成功'
      msCardstatusToggle(obj).then(res => {
        this.$message({
          type: 'success',
          message: msg
        })
        this.getList()
      }).catch(err => {
        console.log(err)
        row.status = middleIsPost
        this.$set(this.listData, index, row)
      })
    },
    dgrecycleBin(row) {
      // 多店回收站硬删除
      this.deleteId = row.id
      this.$nextTick(() => {
        this.$refs.deleteDialogDoc1.dialogShow()
      })
    },
    deleteCardSure1() {
      msdeforceDeleteCard(this.deleteId).then(res => {
        this.$message({
          type: 'success',
          message: '硬删除该张通卡成功'
        })
        this.$refs.deleteDialogDoc1.dialogClose()
        this.$init()
      }).catch(err => {
        console.log(err)
        this.$refs.deleteDialogDoc1.dialogLoadingClose()
      })
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  destroyed() {
    clearInterval(this.importCardTimer)
  }
}
</script>


<style rel="stylesheet/scss" lang="scss" scoped>
$bg: #2d3a4b;
$light_gray: #eee;
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
.qr {
  width: 36px;
  position: absolute;
  left: 0;
  top: 0;
  height: 36px;
  background: url("../../../assets/icon/qr.png") no-repeat;
  background-size: contain;
}
.cursorbox {
  float: left;
  width: 10%;
  min-width: 160px;
  height: 98px;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.3);
  margin: 2px 5px 5px 5px;
  .text {
    font-size: 14px;
    color: #cccccc;
    height: 40px;
    line-height: 30px;
    box-sizing: border-box;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    padding-left: 10px;
    border-top: 6px solid #1c84c6;
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
  background-color: #1c84c6;
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
.filter-container{
  .down-box {
    background-color: #333333;
    color: #ffffff;
    display: inline-block;
    width: 110px;
    height: 36px;
    border-radius: 5px;
    text-align: center;
    line-height: 36px;
    margin-left: 10px;
    font-size: 14px;
  }
}
.through{
  width: 20px;
  height: 20px;
  display: inline-block;
  background: #1AB394;
  border-radius: 3px;
  color: #ffffff;
  line-height: 20px;
  margin-right: 3px;
  text-align: center;
}
</style>
