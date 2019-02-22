<template>
  <div class="poede">
    <!-- <el-button class="dapr black" icon="el-icon-document" type="primary">导出</el-button> -->
    <el-button class="dapl black" icon="el-icon-sort" v-if="btnRoleList['1-4-1-6']" @click="updloadDialogVisible = true" type="primary">导入</el-button>
    <div class="boxser">
      <rectbox :data="boxlist" v-on:choose="curChoose" v-on:openbox="curOpenbox" @overChange="curOverChange"></rectbox>
    </div>
    <div class="find-box3">
      <div style="overflow:hidden" class="filter-container">
        <!-- <scan-input :select="searchSelect" @changeOver="scaninputselect" @kedownOver="scaninputover" :defaultSelect="chooseSelect"></scan-input> -->
        <remote-search-input :select="searchSelect" @changeOver="scaninputselect" @kedownOver="scaninputover" :defaultSelect="chooseSelect"
          :fun1='getsellListSearch' ref="scanIputDoc"></remote-search-input>
        <bulk-action :select="batchFileter" @changeBulk="searchGroup"></bulk-action>
        <!-- <a href="/static/excel/数据导入模板.xlsx" download="数据导入模板" class="down-box" v-if="btnRoleList['1-4-1-10']">下载模板</a> -->
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
          <span><span v-if="scope.row.master_id" class="through">通</span>{{scope.row.card_no}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="'卡种名称'" prop="card_name" width="120px">
        <template slot-scope="scope">
          <span>{{scope.row.card_name}}</span>
        </template>
      </el-table-column>
      <el-table-column width="110px" align="center" :label="'头像'" style="display:flex;justify-content: center;padding-left:0px;padding-right:0px;">
        <template slot-scope="scope">
          <span style="display: inline-block;">
            <img @click="common.bigImg($event)" :src="scope.row.customer?(scope.row.customer.head_portrait?scope.row.customer.head_portrait:defaulthead):defaulthead" alt="icon" width="30" height="30" style="display: list-item;border-radius:50%;">
          </span>
          <span v-if="scope.row.members_count>1" class="members-count-box">{{scope.row.members_count}}</span>
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
    <!--   <el-table-column align="center"  :label="'性别'" width="90" prop="scope.row.sex"
      :filters="[{text: '男', value: '1'}, {text: '女', value: '2'}]"
      :filter-method="filterSex">
        <template slot-scope="scope">
          <span>{{scope.row.sex === 1 ? '男' : '女'}}</span>
        </template>
      </el-table-column> -->
      <el-table-column width="150px" align="center" :label="'手机号码'">
        <template slot-scope="scope">
          <span>{{scope.row.customer?scope.row.customer.phone:'-'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="办理时间<i onclick='openDate(event)' data=[2,'bought_at_egt','bought_at_elt'] title='办理时间' class='el-icon-date'></i>"
        width="200" align="center" sortable='custom' prop="bought_at_sort">
        <template slot-scope="scope">
         {{common.customFormat(scope.row.bought_at, 'yyyy-MM-dd')}}
        </template>
      </el-table-column>
      <el-table-column label="开卡时间<i onclick='openDate(event)' data=[3,'start_sdate','start_edate'] title='开卡时间' class='el-icon-date'></i>"
        width="200" align="center" sortable='custom' prop="start_date_sort">
        <template slot-scope="scope">
         {{common.customFormat(scope.row.start_date, 'yyyy-MM-dd')}}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="失效时间<i onclick='openDate(event)' data=[4,'end_sdate','end_edate'] title='失效时间' class='el-icon-date'></i>"
        width="200" align="center" sortable='custom' prop="end_date_sort">
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
      <el-table-column :label="'赠时(天)'" width="120" align="center">
        <template slot-scope="scope">
         {{scope.row.give_day?scope.row.give_day : '-'}}
        </template>
      </el-table-column>
      <el-table-column align="center" :label="'销售人'" width="150" column-key="sell_id" prop="sell_id"
        :filters="coperatorOptions" filter-placement="bottom-end" :filter-multiple="false">
        <template slot-scope="scope">
          <span>{{scope.row.order?scope.row.order.sell_name:'-'}}</span>
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
      <!-- <el-table-column align="center"  :label="'所属教练'" width="90" prop="scope.row.salesman"
      :filters="[{text: '已分配', value: '1'}, {text: '未分配', value: '2'}]"
      :filter-method="filterSalesman">
        <template slot-scope="scope">
          <span>{{scope.row.salesman === 1 ? '未分配' : '已分配'}}</span>
        </template>
      </el-table-column>
      <el-table-column width="250px" align="center" label="时间<i class='el-icon-date'></i>" prop="start_date">
        <template slot-scope="scope">
          <span>{{scope.row.start_date}} ~ {{scope.row.end_date}}</span>
        </template>
      </el-table-column> -->


      <el-table-column align="center" fixed="right" :label="$t('table.actions')" class-name="small-padding fixed-width" width="150">
        <template slot-scope="scope">
          <!-- <el-button type="primary" size="mini" @click="handleEdit(scope.$index, scope.row)">{{$t('table.edit')}}</el-button> -->
          <el-button type="primary" size="mini" @click="handleDetails(scope.$index, listData)">{{$t('table.details')}}</el-button>
          <el-dropdown trigger="click">
            <el-button size="mini" plain>更多</el-button>
            <el-dropdown-menu slot="dropdown">
              <template v-if="listQuery.status!==7&&listQuery.status!==5">
                <el-dropdown-item  v-if="btnRoleList['1-4-1-1']" @click.native="handleStopCard(scope.$index, listData)" >停卡</el-dropdown-item>
                <el-dropdown-item  v-if="btnRoleList['1-4-1-2']" @click.native="handleTransferCard(scope.$index, listData)">转卡</el-dropdown-item>
                <el-dropdown-item  v-if="btnRoleList['1-4-1-18']"  @click.native="handleContinue(scope.$index, listData)" >续卡</el-dropdown-item>
                <el-dropdown-item  v-if="btnRoleList['1-4-1-3']" @click.native="editCard(scope.$index, listData)">编辑</el-dropdown-item>
                <el-dropdown-item  v-if="btnRoleList['1-4-1-4']"  @click.native="handleDelete(scope.$index, listData)" >删除</el-dropdown-item>
                <el-dropdown-item  @click.native="cardMember(scope.row)" >成员</el-dropdown-item>
                <!-- <el-dropdown-item  v-if="listQuery.status===5&&btnRoleList['1-4-1-11']" @click.native="activCardBtn(scope.row)" >开卡</el-dropdown-item> -->
              </template>
              <template v-if="listQuery.status===7">
                <el-dropdown-item  v-if="btnRoleList['1-4-1-12']" @click.native="restoreCardBtn(scope.row)" >恢复</el-dropdown-item>
                <el-dropdown-item  v-if="btnRoleList['1-4-1-17']" @click.native="dgrecycleBin(scope.row)" >删除</el-dropdown-item>
              </template>
              <template v-if="listQuery.status===5">
                <el-dropdown-item  v-if="btnRoleList['1-4-1-2']" @click.native="handleTransferCard(scope.$index, listData)">转卡</el-dropdown-item>
                <el-dropdown-item  v-if="btnRoleList['1-4-1-18']"  @click.native="handleContinue(scope.$index, listData)" >续卡</el-dropdown-item>
                <el-dropdown-item  v-if="btnRoleList['1-4-1-3']" @click.native="editCard(scope.$index, listData)">编辑</el-dropdown-item>
                <el-dropdown-item  v-if="btnRoleList['1-4-1-4']"  @click.native="handleDelete(scope.$index, listData)" >删除</el-dropdown-item>
                <el-dropdown-item  v-if="btnRoleList['1-4-1-11']" @click.native="activCardBtn(scope.row)" >开卡</el-dropdown-item>
                <el-dropdown-item  @click.native="cardMember(scope.row)" >成员</el-dropdown-item>
              </template>
            </el-dropdown-menu>
          </el-dropdown>
          <!-- <el-button size="mini" v-if="listQuery.status===5&&btnRoleList['1-4-1-11']" @click.native="activCardBtn(scope.row)">开卡</el-button> -->
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container" style="text-align:right;">
      <el-pagination 
        v-if="paginationShow"
        background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
        :page-sizes="[10,20,30,50]" :page-size="listQuery.per_page" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog
      title="编辑会员卡"
      :visible.sync="editDialogVisible"
      width="400px" class="addRole" @close="addclose">
      <el-form ref="formbox" autoComplete="on" :model="updateFormData" :rules="updateFormRules" label-width="80px">
        <el-form-item label="卡种名称" prop="updateFormData">
          <el-input v-model="updateFormData.card_name" disabled placeholder="请填写卡种名称"></el-input>
        </el-form-item>
        <el-form-item label="客户名称"  prop="updateFormData">
          <el-input v-model="updateFormData.card_name" disabled placeholder="请填写卡种名称"></el-input>
        </el-form-item>
        <el-form-item label="客户名称"  prop="updateFormData">
          <el-input v-model="updateFormData.customer.phone" placeholder="请填写卡种名称"></el-input>
        </el-form-item>
        <div style="text-align:center;">
          <span slot="footer" class="dialog-footer">
            <el-button @click="editsubmit">更 新</el-button>
          </span>
        </div>
      </el-form>
    </el-dialog>
    <!-- 详情 -->
    <vip-card-detail-dialog
      v-if="vipCardDetailsDialogVisible"
      :dialogVisible='vipCardDetailsDialogVisible'
      @dialogClosed='dialogClosedDetails'
      ref="vipCardDetailsDialogDoc"
      :isSecondCard="1"
      :widthSize="'1000px'"
    > </vip-card-detail-dialog>
    <!-- 编辑 -->
    <vip-card-edit-dialog
      @editVipCardbtn='editVipCardTj'
      ref="dialogClosedEditDoc"
      :widthSize="'500px'"
      :employeesData="sellList"></vip-card-edit-dialog>
    <!-- 转卡 -->
    <transfer-card-dialog
      ref="dialogtransferCardDoc"
      @skryxiFormBtnOK='transferCardCardTj'
      :widthSize="'1300px'"
      :employeesData="sellList"
    ></transfer-card-dialog>
    <!-- 续卡 -->
      <handleContinueDialog
      @continueSuccess="continueSuccess"
      ref="handleContinueDoc">
      </handleContinueDialog>
    <!-- 停卡 -->
    <vip-card-stop-dialog
      ref="vipCardStopDialogDoc"
      @stopVipCardbtnOK='stopCardCardTj'
      :widthSize="'500px'"
      :employeesData="sellList"></vip-card-stop-dialog>
    <upload-dialog
      v-if="updloadDialogVisible"
      :dialogVisible="updloadDialogVisible"
      :widthSize="'700px'"
      @dialogClosed="uploadDialogClosed"
      @UploadComplete="UploadComplete"
      @uploadCencel="uploadCencel">
    </upload-dialog>
    <!-- 回收站操作 -->
    <recycle-bin-dialog
      v-if="recycleBinDialog"
      :dialogVisible="recycleBinDialog"
      @dialogClosed="recycleBinDialogClosed"
      @recycleBinBtnOk="recycleBinBtnOk"
      :title="'确定是否要批量彻底删除选中的会员卡'">
    </recycle-bin-dialog>
    <!-- 单个回收站删除操作 -->
    <recycle-bin-dialog
      v-if="dgrecycleBinDialog"
      :dialogVisible="dgrecycleBinDialog"
      @dialogClosed="dgrecycleBinDialogClosed"
      @recycleBinBtnOk="dgrecycleBinBtnOk"
      :title="'确定是否要彻底删除选中的会员卡'">
    </recycle-bin-dialog>
    <!-- 清空回收站 -->
    <recycle-bin-dialog
      v-if="clearrecyclebinDialog"
      :dialogVisible="clearrecyclebinDialog"
      @dialogClosed="clearrecyclebinDialogClosed"
      @recycleBinBtnOk="clearrecyclebinBtnOk"
      :title="'是否清空回收站'">
    </recycle-bin-dialog>
    <!-- 导入Excel数据错误提示弹窗 -->
    <input-excel-err-dialog
      v-if="inputExcelErrDialogVisible"
      :dialogVisible="inputExcelErrDialogVisible"
      :widthSize="'1000px'"
      @dialogClosed="inputExcelErrDialogClosed"
      @dialogBtnOk="dialogBtnOk"
      :sid="sid">
    </input-excel-err-dialog>
    <!-- 导入Excel数据错误详情弹窗 -->
    <!-- <input-excel-err-detail-dialog
      v-if="inputExcelErrDetailDialogVisible"
      :dialogVisible="inputExcelErrDetailDialogVisible"
      :widthSize="'1000px'"
      :sid="sid"
      @dialogClosed="inputExcelErrDetailDialogClosed"
      ></input-excel-err-detail-dialog> -->
    <input-excel-progress
      :dialogVisible="excelProgress"
      :schedule="pressData"
      :total="excelDataTotal"
      :alreadyTotal="alreadyUpload"
      :iSerror="excelIsError"
      @retryBtn="retryBtn"
      ></input-excel-progress>

    <!-- 删除会员卡 -->
    <delete-dialog 
      :tipMessage="deleteMessage"
      ref="deleteDialogDoc"
      @deleteSureBtn='deleteCardSure'></delete-dialog>

    <!-- 回收站-恢复 -->
    <delete-dialog 
      :tipMessage="recoveryMessage"
      ref="recoveryDialogDoc"
      @deleteSureBtn='recoveryCustomerSure'></delete-dialog>

    <!-- 回收站-删除 -->
    <delete-dialog 
      :tipMessage="deletionMessage"
      ref="deletionDialogDoc"
      @deleteSureBtn='deletionCustomerSure'></delete-dialog>
    
    <!-- 时间筛选 -->
    <dateRange @timeChange="timeChange"></dateRange>
    <!-- 成员列表 -->
    <card-member-dialog
      ref="cardmemberDoc"
      @dialogClosed="cardmemberDialogClosed"></card-member-dialog>
  </div>
</template>

<script>
import {
  listSellVipCard,
  listRectBoxData,
  deleteCardData,
  listBatchVipCard,
  batchLockVipCard,
  batchUnlockVipCard
} from '@/api/vipcard'
import { employeeList } from '@/api/employee'
import rectbox from '@/components/rectbox'
import scanInput from '@/components/scanInput'
import bulkAction from '@/components/bulkAction'
import VipCardDetailDialog from './VipCardDetailDialog'
import VipCardEditDialog from './VipCardEditDialog'
import TransferCardDialog from './TransferCardDialog'
import VipCardStopDialog from './VipCardStopDialog'
import handleContinueDialog from './handleContinueDialog'
import UploadDialog from './uploadDialog'
import { remnantDay, cardStatus } from '@/utils/comm'
import { findEmployees, lockVipCardGl, unlockVipCardGl, reliveCard, oneReliveCard, activeCard, cardbatforcedel,
  dgcardbatforcedel, clearrecyclebin,
  // movetorecyclebin,
  cardInpormtDetails,
  cardInpormtRetryAll, batCardOpen } from '@/api/vipcardGl'
import RemoteSearchInput from '@/components/remotesearchInput'
import RecycleBinDialog from './recycleBinDialog'
import InputExcelErrDialog from './InputExcelErrDialog'
import InputExcelProgress from './inputExcelProgress'
import deleteDialog from '@/components/deleteDialog'
import dateRange from '@/components/dateRange'
// import InputExcelErrDetailDialog from './InputExcelErrDetailDialog'
import CardMemberDialog from './CardMemberDialog'

const validateCardName = (rule, value, callback) => {
  if (!value.length) {
    callback(new Error('请输入正确的用户名'))
  } else {
    callback()
  }
}

export default {
  name: 'timeCard',
  components: {
    rectbox,
    scanInput,
    bulkAction,
    VipCardDetailDialog,
    VipCardEditDialog,
    TransferCardDialog,
    VipCardStopDialog,
    UploadDialog,
    RemoteSearchInput,
    RecycleBinDialog,
    InputExcelErrDialog,
    handleContinueDialog,
    InputExcelProgress,
    deleteDialog,
    dateRange,
    CardMemberDialog
  },
  data() {
    return {
      tags: [],
      deleteMessage: '确定删除该会员卡?',
      deleteId: '',
      recoveryMessage: '确定恢复该会员卡?',
      recoveryId: {
        ids: []
      },
      deletionMessage: '确定是否彻底删除该会员卡?',
      coperatorOptions: [],
      btnRoleList: {}, // 按钮权限
      updloadDialogVisible: false,
      editDialogVisible: false,
      updateFormData: {
        card_name: '',
        card_no: '',
        customer: {
          name: '',
          phone: ''
        },
        employee: {
          name: ''
        }
      },
      updateFormRules: {
        card_name: [
          { required: true, trigger: 'blur', validator: validateCardName }
        ]
      },
      searchSelect: [
        {
          text: '会员卡号',
          value: 'card_no'
        },
        {
          text: '手机号码',
          value: 'phone'
        },
        {
          text: '姓名',
          value: 'name'
        },
        {
          text: '卡种名称',
          value: 'card_name'
        },
        {
          text: '销售人',
          value: 'sell_id'
        }
      ],
      batchOperation: [{
        label: '批量删除',
        value: 'delete',
        key: '1-4-1-5',
        isShow: 'a123456'
      },
      // {
      //   label: '导入数据',
      //   value: 'excel_Import',
      //   key: '1-4-1-6',
      //   isShow: 'a123456'
      // },
      {
        label: '导出时效卡',
        value: 'excel_Outport',
        key: '1-4-1-7',
        isShow: 'a1234567'
      },
      {
        label: '批量锁定',
        value: 'batch_CardLock',
        key: '1-4-1-8',
        isShow: 'a123456'
      }, {
        label: '批量解锁',
        value: 'batch_CardUnlock',
        key: '1-4-1-9',
        isShow: 'a123456'
      }, {
        label: '批量开卡',
        value: 'batch_openCard',
        key: '1-4-1-19',
        isShow: '5'
      },
      // , {
      //   label: '删除全部',
      //   value: 'delete_all',
      //   key: '1-4-1-14'
      // }
      {
        label: '批量恢复',
        value: 'batch_Restore',
        key: '1-4-1-13',
        isShow: '7'
      }, {
        label: '批量删除',
        value: 'batch_delete_TimesStorageStation',
        key: '1-4-1-15',
        isShow: '7'
      }, {
        label: '删除全部',
        value: 'delete_TimesStorageStation_all',
        key: '1-4-1-16',
        isShow: '7'
      }],
      select: '',
      searchval: '',
      tableKey: 0,
      listData: null,
      total: null,
      listLoading: true,
      showReviewer: false,
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
          bocolor: 'rgb(26, 179, 148)',
          type: 1,
          filter: 'effective'
        },
        {
          text: '即将失效',
          num: 0,
          checked: false,
          bocolor: 'rgb(248, 172, 89)',
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
          bocolor: 'rgb(241, 76, 48)',
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
          bocolor: 'rgb(177, 197, 211)',
          type: 5,
          filter: 'unactive'
        },
        {
          text: '停卡中',
          num: 0,
          checked: false,
          bocolor: 'rgb(177, 197, 211)',
          type: 4,
          filter: 'stoping'
        },
        {
          text: '预约停卡',
          num: 0,
          checked: false,
          bocolor: '#DDDDDD',
          type: 6,
          filter: 'to_stoped'
        },
        {
          text: '回收站',
          num: 0,
          checked: false,
          bocolor: '#CCCCCC',
          type: 7,
          filter: 'is_deleted'
        }
      ],
      searchGroupBtn: '',
      sexindex: 0,
      salesmanindex: 0,
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
      isTimesStorageStation: false,
      recycleBinDialog: false,
      inputExcelErrDialogVisible: false, // 导入错误提醒
      inputExcelErrDetailDialogVisible: false, // 导入错误提醒详情
      sid: '',
      dgrecycleBinDialog: false,
      dgrecycleId: null, // 单个删除Id
      clearrecyclebinDialog: false,
      paginationShow: true,
      excelProgress: false, // 显示进度
      excelDataTotal: 0, // 导入Excel总条数
      alreadyUpload: 0, // 已经上传tiaos
      pressData: 0,
      excelIsError: false,
      excelId: 0
    }
  },
  computed: {
    searchGroupValue: {
      get() {
        return '批量操作'
      },
      set(value) {
        this.searchGroupBtn = value
      }
    },
    chooseSelect() {
      return this.searchSelect[0].value
    },
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
    this.employeeNameList()
  },
  mounted() {
  },
  methods: {
    __init() {
      this.common.eachBtnRole(this.btnRoleList) // 按钮权限方法
      this.getsellList() // 获取员工列表
      this.$init()
    },
    continueSuccess() {
      // 续卡成功提交
      this.$init()
    },
    scaninputover(obj) {
      this.searchSelect.map(item => {
        if (this.listQuery.hasOwnProperty(item.value)) {
          delete this.listQuery[item.value]
        }
      })
      if (obj.value === '') {
        delete this.tags[0]
      } else {
        let tagszh = {
          card_no: '会员卡号:',
          phone: '手机号码:',
          name: '姓名:',
          card_name: '卡种名称:',
          sell_id: '销售人:'
        }
        this.tags[0] = { 'name': `${tagszh[obj.type]}${obj.value}`, 'type': obj.type }
      }
      this.listQuery.page = 1
      this.pageInit()
      if (obj.type !== 'sell_id') {
        this.listQuery[obj.type] = obj.value ? obj.value : null
        this.getList()
      } else {
        if (obj.value !== '') {
          let _sellInfor = this.sellList.find(currentValue => {
            return currentValue.name === obj.value
          })
          if (_sellInfor) {
            this.listQuery[obj.type] = _sellInfor.id
            this.getList()
            // this.listQuery[obj.type] = _sellInfor ? _sellInfor.id : null
          } else {
            this.listData = []
          }
        } else {
          this.getList()
        }
      }
    },
    scaninputselect(value) {
      console.log(value)
    },
    editsubmit() {
      console.log('update')
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
      listSellVipCard(this.listQuery).then(response => {
        this.listData = response.data
        this.total = Number(response.headers.pagination.split(',')[1])
        this.listLoading = false
      })
    },
    getsellList() {
      // 获取所有的员工
      let obj = {
        per_page: 1000,
        page: 1
      }
      findEmployees(obj).then(res => {
        this.sellList = res.data
      }).catch(err => {
        console.log(err)
      })
    },
    getsellListSearch(name) {
      // 获取所有的员工
      let obj = {
        per_page: 1000,
        page: 1
      }
      let _obj = Object.assign({}, obj, name)
      return new Promise((resolve, reject) => {
        findEmployees(_obj).then(res => {
          resolve(res.data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    addclose() {
      this.$refs.formbox.resetFields()
    },
    getRectData() {
      // 获取会员卡数量
      let obj = this.listCount
      listRectBoxData(obj).then(response => {
        let data = response.data
        for (let key in data.count) {
          for (let item of this.boxlist) {
            if (item.filter === key) {
              item.num = data.count[key]
            }
          }
        }
      })
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.per_page = val
      this.getList()
    },
    /**
    * 详情弹窗
    */
    handleDetails(index, data) {
      // 弹出
      this.vipCardDetailsDialogVisible = true
      let _data = data[index]
      this.$nextTick(() => {
        this.$refs.vipCardDetailsDialogDoc.getVipDetail(_data.id)
      })
    },
    dialogClosedDetails() {
      // 关闭
      this.vipCardDetailsDialogVisible = false
    },
    handleStopCard(index, data) {
      if (data[index].customer) {
        if (data[index].customer.deleted_at) {
          this.common.message('info', '该会员已删除，无法进行停卡操作')
          return
        }
        if (data[index].is_active === 0) {
          this.common.message('info', '未开卡，无法进行停卡操作')
          return
        }
      }
      // 弹出停卡弹窗
      let _data = data[index]
      this.$nextTick(() => {
        this.$refs.vipCardStopDialogDoc.openModel(_data, 1)
      })
    },
    stopCardCardTj() {
      // 提交停卡
      this.$init()
    },
    handleTransferCard(index, data) {
      if (data[index].customer) {
        if (data[index].customer.deleted_at) {
          this.common.message('info', '该会员已删除，无法进行转卡操作')
          return
        }
      }
      // 弹出转卡弹窗
      let _data = data[index]
      this.$nextTick(() => {
        this.$refs.dialogtransferCardDoc.openModel(_data.id, 1)
      })
    },
    handleContinue(index, data) {
      if (data[index].customer) {
        if (data[index].customer.deleted_at) {
          this.common.message('info', '该会员已删除，无法进行续卡操作')
          return
        }
      }
      // 弹出续卡弹框
      let _data = data[index]
      this.$refs.handleContinueDoc.openModel(_data.id, 1)
    },
    transferCardCardTj() {
      // 提交转卡窗口
      this.getList()
    },
    editCard(index, data) {
      // 弹出编辑弹窗
      let _data = data[index]
      this.$nextTick(() => {
        this.$refs.dialogClosedEditDoc.openModel(_data.id, 1)
      })
    },
    editVipCardTj() {
      // 提交编辑窗口
      this.$init()
    },
    handleDelete(index, rows) {
      // 删除
      this.deleteId = rows[index].id
      this.$refs.deleteDialogDoc.dialogShow()
    },
    deleteCardSure() {
      deleteCardData(this.deleteId).then(res => {
        this.common.message('success', '删除成功！')
        this.$refs.deleteDialogDoc.dialogClose()
        this.$init()
      }).catch((err) => {
        this.common.message('error', err.data.message)
        this.$refs.deleteDialogDoc.dialogLoadingClose()
      })
    },
    /**
    * 批量操作
    */
    selectionChange(selection) {
      this.groupOprate.ids = []
      for (let i = 0; i < selection.length; i++) {
        this.groupOprate.ids.push(selection[i].id)
      }
    },
    searchGroup(value) {
      // 批量删除
      if (value === 'delete') {
        if (!this.groupOprate.ids.length) {
          this.common.message('warning', '请先选择会员卡')
          return
        }
        this.groupOprate.method = 'delete'
        this.$confirm('是否批量删除选中的会员卡?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          listBatchVipCard(this.groupOprate).then(res => {
            if (res) {
              this.common.message('success', '批量删除成功')
              this.$init()
            }
          }).catch(err => {
            console.log(err)
          })
        })
      }
      // 导入
      if (value === 'excel_Import') {
        this.updloadDialogVisible = true
      }
      // 导出
      if (value === 'excel_Outport') {
        let obj = {
          type: this.listQuery.type,
          status: this.listQuery.status,
          fileName: this.$fileName(this.listQuery.status)
        }
        this.common.exportExcel('/v1/gym/excel_export', obj)
      }
      // 批量锁定
      if (value === 'batch_CardLock') {
        if (!this.groupOprate.ids.length) {
          this.common.message('warning', '请先选择会员卡')
          return
        }
        let obj = {
          method: 'save',
          attribute: 'status',
          value: 1,
          ids: this.groupOprate.ids
        }
        this.$confirm('是否批量锁定选中的会员卡?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          batchLockVipCard(obj).then(res => {
            if (res) {
              this.common.message('success', '批量锁卡成功')
              this.$init()
            }
          }).catch(err => {
            console.log(err)
          })
        })
      }
      // 批量解锁
      if (value === 'batch_CardUnlock') {
        if (!this.groupOprate.ids.length) {
          this.common.message('warning', '请先选择会员卡')
          return
        }
        let obj = {
          method: 'save',
          attribute: 'status',
          value: 0,
          ids: this.groupOprate.ids
        }
        batchUnlockVipCard(obj).then(res => {
          if (res) {
            this.common.message('success', '批量解锁成功')
            this.$init()
          }
        }).catch(err => {
          console.log(err)
        })
      }
      // 批量开卡
      if (value === 'batch_openCard') {
        console.log('批量开卡')
        if (!this.groupOprate.ids.length) {
          this.common.message('warning', '请先选择会员卡')
          return
        }
        console.log('this.groupOprate', this.groupOprate)
        this.$confirm('是否批量开卡?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          batCardOpen(this.groupOprate).then(res => {
            this.common.message('success', '批量开卡成功')
            this.$init()
          })
        }).catch(() => {
          console.log('取消开卡')
        })
      }
      // 删除全部 不选择
      // if (value === 'delete_all') {
      //   this.$confirm('是否将所有的会员卡移动到回收站?', '提示', {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     type: 'warning'
      //   }).then(() => {
      //     let obj = {
      //       type: this.listQuery.type
      //     }
      //     movetorecyclebin(obj).then(res => {
      //       this.common.message('success', '将所有的会员卡移动到回收站成功')
      //       this.$init()
      //     }).catch(err => {
      //       console.log(err)
      //     })
      //   }).catch(() => {
      //     console.log('取消')
      //   })
      // }
      // 批量恢复
      if (value === 'batch_Restore') {
        if (!this.groupOprate.ids.length) {
          this.common.message('warning', '请先选择会员卡')
          return
        }
        let obj = {
          ids: this.groupOprate.ids
        }
        this.restoreAction('是否批量恢复选中的会员卡?', obj)
      }
      // 回收站删除操
      // 回收站删除选中的数据
      if (value === 'batch_delete_TimesStorageStation') {
        if (!this.groupOprate.ids.length) {
          this.common.message('warning', '请先选择要删除回收站会员卡')
          return
        }
        // this.recycleBinDialog = true
        this.$confirm('是否彻底删除选中的会员卡?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.recycleBinBtnOk()
        }).catch(() => {
          console.log('取消')
        })
      }
      // 清空回收站
      if (value === 'delete_TimesStorageStation_all') {
        // this.clearrecyclebinDialog = true
        this.$confirm('是否要清空回收站?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.clearrecyclebinBtnOk()
        }).catch(() => {
          console.log('取消')
        })
      }
    },
    UploadComplete(uploadExcelData) {
      // this.common.importExcel('/v1/gym/excel_import', uploadExcelData).then((res) => {
      this.excelDataTotal = 0
      this.alreadyUpload = 0
      this.pressData = 0
      this.common.importExcel('/v1/gym/customer_vips/upload', uploadExcelData).then((res) => {
        console.log('res', res)
        this.excelProgress = true
        this.excelDataTotal = res.total
        this.excelId = res.id
        this.$cardInpormtDetails()
      }).catch(err => {
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
          result = '导出有效的时效卡.xlsx'
          break
        case 2:
          result = '导出即将到期的时效卡.xlsx'
          break
        case 3:
          result = '导出已失效的时效卡.xlsx'
          break
        case 4:
          result = '导出停卡中的时效卡.xlsx'
          break
        case 5:
          result = '导出未卡开的时效卡.xlsx'
          break
        case 6:
          result = '导出预约停卡的时效卡.xlsx'
          break
        case 7:
          result = '导出回收站里的时效卡.xlsx'
          break
        default:
          result = '导出所有时效卡.xlsx'
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
    cardLock(value, index, param) {
      let middleIsPost = param.status === 1 ? 0 : 1
      let status = value ? 1 : 0
      let obj = {
        id: param.id,
        status: status
      }
      let message = status ? '锁定' : '解锁'
      if (status) {
        lockVipCardGl(obj).then(res => {
          this.$message({
            message: `会员卡${message}成功`,
            type: 'success'
          })
          this.getList()
        }).catch(err => {
          console.log(err)
          param.status = middleIsPost
          this.$set(this.listData, index, param)
        })
      } else {
        unlockVipCardGl(obj).then(res => {
          this.$message({
            message: `会员卡${message}成功`,
            type: 'success'
          })
          this.getList()
        }).catch(err => {
          console.log(err)
          param.status = middleIsPost
          this.$set(this.listData, index, param)
        })
      }
    },
    activCardBtn(params) {
      let _id = params.id
      this.$confirm(`是否重新开卡卡号为${params.card_no}会员卡`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        activeCard(_id).then(res => {
          this.$message({
            message: '开卡成功',
            type: 'success'
          })
          this.$init()
        }).catch(err => {
          console.log(err)
        })
      }).catch(() => {
        console.log(1)
      })
    },
    uploadDialogClosed() {
      // 关闭上传下载弹窗
      this.updloadDialogVisible = false
    },
    // 回收站--恢复
    restoreCardBtn(row) {
      this.recoveryId = row.id
      this.$refs.recoveryDialogDoc.dialogShow()
    },
    recoveryCustomerSure() {
      oneReliveCard(this.recoveryId).then(res => {
        this.$message({
          message: '恢复成功',
          type: 'success'
        })
        this.$init()
        this.$refs.recoveryDialogDoc.dialogClose()
      }).catch(err => {
        console.log(err)
        this.$refs.recoveryDialogDoc.dialogLoadingClose()
      })
    },
    // 回收站--删除
    dgrecycleBin(row) {
      this.dgrecycleId = row.id
      this.$refs.deletionDialogDoc.dialogShow()
    },
    deletionCustomerSure() {
      dgcardbatforcedel(this.dgrecycleId).then(res => {
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        this.$init()
        this.$refs.deletionDialogDoc.dialogClose()
      }).catch(err => {
        console.log(err)
        this.$refs.deletionDialogDoc.dialogLoadingClose()
      })
    },
    recycleBinDialogClosed() {
      // 回收站删除弹窗 关闭
      this.recycleBinDialog = false
    },
    inputExcelErrDialogClosed() {
      // 导入数据错误提醒弹窗关闭
      this.inputExcelErrDialogVisible = false
    },
    dialogBtnOk() {
      // 查看错误详情
      this.inputExcelErrDialogVisible = false
      this.inputExcelErrDetailDialogVisible = true
    },
    inputExcelErrDetailDialogClosed() {
      // 详情关闭
      this.inputExcelErrDetailDialogVisible = false
    },
    recycleBinBtnOk() {
      cardbatforcedel(this.groupOprate).then(res => {
        this.common.message('success', '删除回收站会员卡成功')
        this.recycleBinDialog = false
        this.$init()
      }).catch(err => {
        console.log(err)
      })
    },
    dgrecycleBinDialogClosed() {
      this.dgrecycleBinDialog = false
    },
    restoreAction(msg, param) {
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let _id = param
        reliveCard(_id).then(res => {
          this.$message({
            message: '恢复成功',
            type: 'success'
          })
          this.$init()
        })
      }).catch(() => {
        console.log('取消恢复')
      })
    },
    dgrecycleBinBtnOk() {
      // 单个删除确认
      dgcardbatforcedel(this.dgrecycleId).then(res => {
        this.common.message('success', '单个删除回收站会员卡成功')
        this.dgrecycleBinDialog = false
        this.$init()
      }).catch(err => {
        console.log(err)
      })
    },
    clearrecyclebinDialogClosed() {
      this.clearrecyclebinDialog = false
    },
    clearrecyclebinBtnOk() {
      let obj = {
        type: this.listQuery.type
      }
      clearrecyclebin(obj).then(res => {
        this.common.message('success', '清空回收站成功')
        this.clearrecyclebinDialog = false
        this.$init()
      }).catch(err => {
        console.log(err)
      })
    },
    pageInit() {
      this.paginationShow = false
      this.$nextTick(() => {
        this.paginationShow = true
      })
    },
    employeeNameList() {
      this.coperatorOptions = []
      employeeList().then(response => {
        let data = response.data
        data.map(item => {
          // 获取操作人
          this.coperatorOptions.push({ text: item.name, value: item.id + ',' + item.name, class: 'csell_id' })
        })
        this.coperatorOptions.unshift({ text: '未分配', value: '2,未分配', class: 'csell_id' })
      })
    },
    tagclose(tag, index) {
      this.common.tagFilter(this, tag, index, this.searchSelect)
    },
    sortChange(data) {
      this.common.sortFilter(this, data)
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
      if (key === 'sell_id') {
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
        cardInpormtDetails(this.excelId).then(response => {
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
      cardInpormtRetryAll(this.excelId).then(res => {
        this.$cardInpormtDetails()
      }).catch(err => {
        console.log(err)
      })
    },
    timeChange(param) {
      this.common.chooseTimerFilter(param, this)
    },
    cardMember(row) {
      // 查看成员列表
      this.$nextTick(() => {
        this.$refs.cardmemberDoc.openModel(row)
      })
    },
    cardmemberDialogClosed() {
      // 关闭成员列表
      this.$init()
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
.members-count-box{
  width: 20px;
  height: 20px;
  background-color: #51A9CA;
  border-radius: 5px;
  text-align: center;
  line-height: 20px;
  color: #ffffff;
  font-size: 12px;
  display: inline-block;
  position: absolute;
  right: 27px;
  top: 23px;
}
</style>
