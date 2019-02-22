<template>
  <div>
    <div class="boxser">
    <rectbox :data="boxlist" v-on:choose="curChoose" v-on:openbox="curOpenbox" @overChange="curOverChange"></rectbox>
    </div>         
    <div class="find-box3"> 
      <div style="overflow:hidden" class="filter-container">
        <scan-input :select="searchSelect" :defaultSelect="searchSelect[0].value" @kedownOver="searchlist" ref="scanIputDoc"></scan-input>
        <bulk-action :select="batchFileter" @changeBulk="searchGroup"></bulk-action>
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
    <el-table @filter-change="filterChange" stripe 
      class="check-table"
      @selection-change="selectionChange"
      @sort-change="sortChange"
      :key='tableKey' 
      :data="tableList" 
      v-loading="listLoading" 
      element-loading-text="列表正在加载中"
      border
      fit highlight-current-row
      style="width: 100%;">
      <el-table-column align="center" type="selection" width="55px"></el-table-column>
      <el-table-column align="center" :label="'姓名'" width="180px">
        <template slot-scope="scope">
          <span>{{scope.row.name?scope.row.name:'-'}}</span>
        </template>
      </el-table-column>
      <el-table-column width="55px" align="center" :label="'头像'">
        <template slot-scope="scope">
          <span><img :src="scope.row.head_portrait?scope.row.head_portrait:defaulthead" @click="common.bigImg($event)" alt="icon" width="30" height="30" style="display: list-item;border-radius:50%;"></span>
        </template>
      </el-table-column>
      <el-table-column column-key="sex" align="center" :label="'性别'" width="90" prop="scope.row.sex"
      :filters="[{text: '男', value: '1', class: 'csex'}, {text: '女', value: '2', class: 'csex'}]"
      filter-placement="bottom-end" :filter-multiple="false">
        <template slot-scope="scope">
          <span>{{scope.row.sex === 1 ? '男' : scope.row.sex === 2 ? '女' : '未知'}}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" :label="'手机号码'" prop="scope.row.phone">
        <template slot-scope="scope">
          <span>{{scope.row.phone}}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" :label="'是否注册APP'" prop="is_register_app" column-key="register_app"
      :filters="[{text: '已注册', value: '1', class: 'cregister_app'}, {text: '未注册', value: '2', class: 'cregister_app'}]"
      filter-placement="bottom-end" :filter-multiple="false">
        <template slot-scope="scope">
          <span v-if="scope.row.is_register_app" style="color:rgb(26, 179, 148)">已注册</span>
          <span v-else style="color: rgb(241, 76, 48)">未注册</span>
        </template>
      </el-table-column>
      <el-table-column column-key="consultant" align="center" :label="'所属会籍'" width="120" prop="consultant"
      :filters="consultantOptions"
      filter-placement="bottom-end" :filter-multiple="false">
        <template slot-scope="scope">
          <el-tag class="cursor" :type="scope.row.consultant?'warning':''" @click.native="distributSalesBtn(scope.row)">{{scope.row.consultant?scope.row.consultant.name:'未分配'}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column column-key="coach" align="center" :label="'所属教练'" width="120" prop="coach"
      :filters="coachOptions"
      filter-placement="bottom-end" :filter-multiple="false">
        <template slot-scope="scope">
          <el-tag class="cursor" :type="scope.row.coach?'warning':''" @click.native="distributCoachBtn(scope.row)">{{scope.row.coach?scope.row.coach.name:'未分配'}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column width="160px" align="center" 
        label="创建时间<i onclick='openDate(event)' data=[5,'created_at_sdate','created_at_edate'] title='创建时间' class='el-icon-date'></i>"
        sortable="custom" prop="created_at_sort">
        <template slot-scope="scope">
          <span>{{scope.row.created_at}}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" :label="'时效卡'">
        <template slot-scope="scope">
          <div class="more-tag" v-if="scope.row.limitation_card.length">
            <div class="bg-tag" style="width:90px;" v-if="scope.row.limitation_card.length>1" ></div>
            <el-tag class="tags-styl tags-wz" style="width:90px;">{{scope.row.limitation_card[0]?common.customFormat(scope.row.limitation_card[0].end_date, 'yyyy-MM-dd'):'-'}}</el-tag>
          </div>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" :label="'次卡'">
        <template slot-scope="scope">
          <div class="more-tag" v-if="scope.row.times_card.length">
            <div class="bg-tag" style="width:90px;" v-if="scope.row.times_card.length>1"></div>
            <el-tag class="tags-styl tags-wz" style="width:90px;">剩余{{scope.row.times_card[0]?(scope.row.times_card[0].total_times - scope.row.times_card[0].use_times):'-'}}次</el-tag>
          </div>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" :label="'私教次数'">
        <template slot-scope="scope">
          <el-tag class="tags-styl">剩余{{scope.row.course_residue}}次</el-tag>
        </template>
      </el-table-column>
       <el-table-column column-key="channel" align="center" :label="'来源渠道'" width="120" prop="scope.row.channel" 
      :filters="purposeList"
      filter-placement="bottom-end" :filter-multiple="false">
        <template slot-scope="scope">
          <span>{{getchannel(scope.row.channel)}}</span>
        </template>
      </el-table-column>
      <el-table-column column-key="purpose" align="center" :label="'健身目的'" width="120" prop="scope.row.purpose" 
      :filters="[{text: '减脂', value: '0', class: 'cpurpose'}, {text: '增肌', value: '1'}, {text: '塑形',value: '2'}]"
      filter-placement="bottom-end" :filter-multiple="false"> 
        <template slot-scope="scope">
          <span>{{scope.row.purpose === 0 ? '减脂' : scope.row.purpose === 1 ? '增肌' : '塑形'}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="'签到次数'" width="110" sortable="custom" prop="sign_count_sort">
        <template slot-scope="scope">
          <span>{{scope.row.sign_count}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="'备注'" width="150" prop="scope.row.remark">
        <template slot-scope="scope">
          <span :title="scope.row.remark">{{scope.row.remark? common.substring(scope.row.remark, 16):'-'}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" fixed="right" :label="$t('table.actions')" min-width="150" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" v-if="btnRoleList['2-1-1-1']" size="mini" @click="customerDetailsBtn(scope.row)">{{$t('table.details')}}</el-button>
          <template v-if="listQuery.scope !=='only_trashed'">
            <el-dropdown trigger="click">
              <el-button size="mini" plain>更多</el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-if="btnRoleList['2-1-1-4']" @click.native="distributSalesBtn(scope.row)" >分配会籍</el-dropdown-item>
                <el-dropdown-item v-if="btnRoleList['2-1-1-5']" @click.native="distributCoachBtn(scope.row)">分配教练</el-dropdown-item>
                <el-dropdown-item v-if="btnRoleList['2-1-1-2']" @click.native="customerEditBtn(scope.row)">编辑</el-dropdown-item>
                <el-dropdown-item v-if="btnRoleList['2-1-1-3']" @click.native="customerDeleteBtn(scope.row)" >删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
          <el-button  v-if="(listQuery.scope ==='only_trashed')&&btnRoleList['2-1-1-9']" size="mini" @click="activaCustomerBtn(scope.row)">恢复</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container"  style="text-align:right;">
      <el-pagination
        v-if="paginationShow"
        background @size-change="handleSizeChange" 
        @current-change="handleCurrentChange" 
        :current-page.sync="listQuery.page"
        :page-sizes="[10,20,30,50]" :page-size="listQuery.per_page" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <el-dialog
      title="提示"
      :visible.sync="dialogEditVisible"
      width="800px"
      :close-on-click-modal="true"
      @close="handleClose">
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogEditVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogEditVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配会籍弹窗 -->
    <assign-popups :title="'分配会籍'"
      v-if="popupsSalesVisible"
      :dialogVisible="popupsSalesVisible"
      @popupsClosed="popupsClosedSales" 
      :selectList="salesList"
      :widthSize="'450px'"
      :formlabel="'分配会籍'"
      :placeholder="'请选择会籍名称'"
      ref='popupsSalesDoc'
      @assignPopupsBtnOk="popupsSalesBtnOk"></assign-popups>
    <!-- 分配教练弹窗 -->
    <assign-popups :title="'分配教练'" 
      v-if="popupsCoachVisible"
      :dialogVisible="popupsCoachVisible"
      @popupsClosed="popupsClosedCoach" 
      :selectList="getCoachList(salesList)"
      :widthSize="'450px'"
      :formlabel="'教练名称'"
      :placeholder="'请选择教练名称'"
       ref='popupsCoachDoc'
      @assignPopupsBtnOk="popupsCoachBtnOk"></assign-popups>
      <!-- 客户信息编辑弹窗 -->
      <edit-customer-popups :title="'客户信息编辑'"
        v-if="popupsEditCustomerVisible"
        :dialogVisible="popupsEditCustomerVisible"
        :widthSize="'760px'"
        ref='popupsEditCustomerDoc'
        :coachData="getCoachList(salesList)"
        :salesData="salesList"
        @popupsClosed="popupsClosedEditCustomer"
        @EditCustomerPopupsBtnOk="popupsEditCustomerBtnOk"></edit-customer-popups>
      <!-- 客户详情弹窗 -->
      <customer-details-popups :title="'客户详情'"
        v-if="popupsCustomerDetailsVisible"
        :dialogVisible="popupsCustomerDetailsVisible"
        :widthSize="'900px'"
        ref='popupsDetailsCustomerDoc'
        :salesData="salesList"
        @popupsClosed="popupsClosedcustomerDetails"
        @stopCardCardTj="stopCardCardTj">
      </customer-details-popups>
      <!--批量分配会籍弹窗 -->
      <assign-popups :title="'批量分配会籍'" 
        :dialogVisible="popupsbatchSalesVisible"
        @popupsClosed="popupsClosedbatchSales" 
        :selectList="salesList"
        :widthSize="'450px'"
        :formlabel="'分配会籍'"
        :placeholder="'请选择会籍名称'"
        ref='popupsbatchSalesDoc'
        @assignPopupsBtnOk="popupsbatchSalesBtnOk"></assign-popups>
      <!--批量分配教练弹窗 -->
      <assign-popups :title="'批量分配教练'" 
        :dialogVisible="popupsbatchCoachVisible"
        @popupsClosed="popupsClosedbatchCoach" 
        :selectList="getCoachList(salesList)"
        :widthSize="'450px'"
        :formlabel="'教练名称'"
        :placeholder="'请选择教练名称'"
        ref='popupsbatchCoachDoc'
        @assignPopupsBtnOk="popupsbatchCoachBtnOk"></assign-popups>
      <!-- 时间筛选 -->
      <dateRange @timeChange="timeChange"></dateRange>
      <!-- 删除客户 -->
      <delete-dialog 
        :tipMessage="deleteMessage"
        :tipMessageDetail="tipMessageDetail"
        ref="deleteDialogDoc"
        @deleteSureBtn='deleteCustomerSure'></delete-dialog>

      <!-- 回收站-恢复 -->
      <delete-dialog 
        :tipMessage="recoveryMessage"
        ref="recoveryDialogDoc"
        @deleteSureBtn='recoveryCustomerSure'></delete-dialog>
  </div>
</template>

<script>
import { customerList, countList } from '@/api/customer'
import rectbox from '@/components/rectbox'
import scanInput from '@/components/scanInput'
import bulkAction from '@/components/bulkAction'
import AssignPopups from '@/components/assignPopups'
import EditCustomerPopups from './popups/editCustomerPopups'
import CustomerDetailsPopups from './popups/customerDetailsPopups'
import dateRange from '@/components/dateRange'
import deleteDialog from '@/components/deleteDialog'
// const typeArr = ['all', 'bind_coach', 'new_value', 'unexpired', 'expiring_lease', 'birthday', 'only_trashed',
//  'unbind_consultant', 'unbind_coach', 'bind_coach', 'not_maintain', 'not_maintain_value']
import { employeeList, modifyCustomer, deleteCustomer, customersBatchDestroy, customerBatSetCon, customerBatSetCoach, customerRestore, customerBatchRestore } from '@/api/customerGl'
import { channelDictionary, getEmployeeSelectVule } from '@/utils/comm'
export default {
  name: 'customerManage',
  components: {
    rectbox,
    scanInput,
    bulkAction,
    AssignPopups,
    EditCustomerPopups,
    CustomerDetailsPopups,
    dateRange,
    deleteDialog
  },
  data() {
    return {
      btnRoleList: {}, // 按钮权限
      dialogEditVisible: false,
      tags: [],
      deleteMessage: '确定删除该客户吗?',
      tipMessageDetail: '提示：同时会删除该客户的所有会员卡',
      deleteId: '',
      recoveryMessage: '确定恢复该客户吗?',
      consultantOptions: [],
      coachOptions: [],
      select: '',
      searchval: '',
      tableKey: 0,
      tableList: null,
      total: null,
      listLoading: true,
      showReviewer: false,
      listQuery: {
        page: 1,
        per_page: 10,
        is_vip: 1
      },
      searchSelect: [{
        text: '手机号码',
        value: 'phone'
      }, {
        text: '姓名',
        value: 'name'
      }, {
        text: '会员卡号',
        value: 'card_no'
      }, {
        text: '备注',
        value: 'remark'
      }, {
        text: '所属会籍',
        value: 'consultant_name'
      }, {
        text: '所属教练',
        value: 'coach_name'
      }],
      boxlist: [{
        text: '全部会员',
        num: 0,
        type: 'all',
        checked: true,
        bocolor: 'rgb(28, 132, 198)'
      }, {
        text: '私教会员',
        num: 0,
        type: 'bind_coach',
        checked: false,
        bocolor: 'rgb(81, 169, 202)'
      },
      // {
      //   text: '未过期会员',
      //   num: 0,
      //   type: 'unexpired',
      //   checked: false,
      //   bocolor: 'rgb(65, 189, 190)'
      // },
      {
        text: '新增加会员',
        num: 0,
        type: 'new',
        checked: false,
        bocolor: 'rgb(26, 179, 148)',
        rbtn: '最近5天',
        select: [{
          label: '最近5天'
        }, {
          label: '最近30天'
        }, {
          label: '最近90天'
        }]
      },
      {
        text: '即将失效',
        num: 0,
        type: 'expiring_lease',
        checked: false,
        bocolor: 'rgb(248, 172, 89)',
        rbtn: '最近5天',
        select: [{
          label: '最近5天'
        }, {
          label: '最近30天'
        }, {
          label: '最近90天'
        }]
      }, {
        text: '已失效',
        num: 0,
        type: 'expired',
        checked: false,
        bocolor: 'rgb(241, 76, 48)',
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
        text: '最近生日',
        num: 0,
        type: 'birthday',
        checked: false,
        bocolor: 'rgb(177, 197, 211)',
        rbtn: '最近5天',
        select: [{
          label: '最近5天'
        }, {
          label: '最近30天'
        }, {
          label: '最近90天'
        }]
      }
      // {
      //   text: '回收站',
      //   num: 0,
      //   type: 'only_trashed',
      //   checked: false,
      //   bocolor: '#CCCCCC'
      // }
      ],
      options: [{
        value: 'delete',
        label: '批量删除'
      }, {
        value: 'inset',
        label: '批量导入'
      }, {
        value: 'output',
        label: '批量导出'
      }],
      batchOperation: [{
        label: '批量分配会籍',
        value: 'consultant_id',
        key: '2-1-1-6',
        isTimesStorageStation: false
      }, {
        label: '批量分配教练',
        value: 'coach_id',
        key: '2-1-1-7',
        isTimesStorageStation: false
      }, {
        label: '批量删除',
        value: 'delete',
        key: '2-1-1-8',
        isTimesStorageStation: false
      }
      // , {
      //   label: '批量恢复',
      //   value: 'batch_Restore',
      //   key: '2-1-1-10',
      //   isTimesStorageStation: true
      // }
      ],
      searchGroupBtn: '',
      popupsSalesVisible: false,
      salesList: [],
      popupsCoachVisible: false,
      modifyCustomer: {},
      popupsEditCustomerVisible: false,
      popupsCustomerDetailsVisible: false,
      popupsbatchSalesVisible: false,
      popupsbatchCoachVisible: false,
      groupOprate: {
        ids: []
      },
      purposeList: [{
        text: '无', value: '0', class: 'cchannel'
      }, {
        text: '电话收集', value: '1', class: 'cchannel'
      }, {
        text: '拉人到店', value: '2'
      }, {
        text: '自然访问', value: '3'
      }, {
        text: '会员介绍', value: '4'
      }, {
        text: '朋友介绍', value: '5'
      }, {
        text: 'App', value: '6'
      }, {
        text: '内购', value: '7'
      }, {
        text: '宣传单', value: '8'
      }, {
        text: '网络推广', value: '9'
      }, {
        text: '团购', value: '10'
      }, {
        text: '杂志期刊', value: '11'
      }, {
        text: '新闻媒体', value: '12'
      }, {
        text: '户外广告', value: '13'
      }, {
        text: '其它', value: '14'
      }],
      listCount: {
        all: 3, // 全部会员
        bind_coach: 3, // 私教客户
        unexpired: 3, // 未过期会员
        new: 3,
        new_value: 5, // 新增加会员
        expiring_lease: 5, // 即将到期
        expired: 0, // 已过期
        birthday: 5, // 最近生日
        only_trashed: 3 // 回收站
      },
      isTimesStorageStation: false,
      paginationShow: true
    }
  },
  computed: {
    searchGroupValue: {
      get() {
        return '批量操作'
      },
      set(value) {
        this.searchGroupBtn = value
        // console.log(value)
      }
    },
    batchFileter() {
      let result = this.batchOperation.filter((item) => {
        return item.isTimesStorageStation === this.isTimesStorageStation
      })
      return result
    }
  },
  created() {
    this.__init()
    this.coachNameList()
  },
  mounted() {},
  methods: {
    __init() {
      this.common.eachBtnRole(this.btnRoleList) // 按钮权限方法
      this.getSalesList()
      this.$initData()
    },
    sortChange(data) {
      // delete this.listQuery[this.deleteItemSort]
      // this.deleteItemSort = data.prop
      // if (data.prop) {
      //   this.listQuery.sort_column = data.prop
      //   this.listQuery.sort_way = /asc/.test(data.order) ? 'asc' : 'desc'
      // } else {
      //   delete this.listQuery[data.prop]
      // }
      // this.listQuery.page = 1
      // this.pageInit()
      // this.getList()
      this.common.sortFilter(this, data)
    },
    handleClose() {},
    handleEdit(index, row) {
      this.dialogEditVisible = true
    },
    tagclose(tag, index) {
      this.common.tagFilter(this, tag, index, this.searchSelect)
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
      this.listQuery.scope = this.boxlist[index].type
      this.isTimesStorageStation = this.listQuery.scope === 'only_trashed'
      this.listQuery.is_vip = 1
      let _scope_value = this.boxlist[index].rbtn ? this.boxlist[index].rbtn.replace(/[^0-9]/ig, '') : ''
      let _scopeValue = _scope_value.length > 0 ? _scope_value : '0'
      this.listQuery.scope_value = _scopeValue
      if (this.boxlist[index].type === 'new') {
        this.listCount['new_value'] = Number(_scopeValue)
      } else if (this.boxlist[index].type === 'only_trashed') {
        this.listCount['only_trashed'] = 3
      } else if (this.boxlist[index].type === 'all') {
        this.listCount['all'] = 3
      } else if (this.boxlist[index].type === 'bind_coach') {
        this.listCount['bind_coach'] = 3
      } else if (this.boxlist[index].type === 'unexpired') {
        this.listCount['unexpired'] = 3
      } else {
        this.listCount[this.boxlist[index].type] = Number(_scopeValue)
      }
      this.getList()
      this.getCount()
    },
    curOpenbox(index) {
      // console.log(this.boxlist[index].text)
    },
    // 获得所有会籍和教练
    coachNameList() {
      let data = { post: 1 }
      employeeList(data).then(response => {
        this.coachOptions.push({ text: '未分配', value: 0 + ',' + '未分配', class: 'ccoach' })
        for (let i = 0; i < response.data.length; i++) {
          this.coachOptions.push({ text: response.data[i].name, value: response.data[i].id + ',' + response.data[i].name, class: 'ccoach' })
        }
      })
      employeeList().then(response => {
        this.consultantOptions.push({ text: '未分配', value: 0 + ',' + '未分配', class: 'cconsultant' })
        for (let i = 0; i < response.data.length; i++) {
          this.consultantOptions.push({ text: response.data[i].name, value: response.data[i].id + ',' + response.data[i].name, class: 'cconsultant' })
        }
      })
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
      if (key === 'sex') {
        this.hostFilter(data, key, 1, this.listQuery[key] === '1' ? '性别：男' : this.listQuery[key] === '2' ? '性别：女' : '性别：未知')
      }
      if (key === 'consultant') {
        this.hostFilter(data, key, 3, '所属会籍：' + font)
      }
      if (key === 'coach') {
        this.hostFilter(data, key, 4, '所属教练：' + font)
      }
      if (key === 'channel') {
        let text = ''
        let prefix = '来源渠道：'
        switch (this.listQuery[key]) {
          case '1': text = '电话收集'; break
          case '2': text = '拉人到店'; break
          case '3': text = '自然访问'; break
          case '4': text = '客户推荐'; break
          case '5': text = '预约'; break
          default: text = '无'; break
        }
        this.hostFilter(data, key, 6, prefix + text)
      }
      if (key === 'purpose') {
        let text = ''
        let prefix = '健身目的：'
        switch (this.listQuery[key]) {
          case '0': text = '减脂'; break
          case '1': text = '增肌'; break
          case '2': text = '塑形'; break
          default: text = '无'
        }
        this.hostFilter(data, key, 7, prefix + text)
      }
      if (key === 'register_app') {
        this.hostFilter(data, key, 2, this.listQuery[key] === '1' ? '是否注册app：已注册' : '是否注册app：未注册')
      }
    },
    hostFilter(data, key, index, text) {
      if (data[key].length === 0) {
        delete this.tags[index]
      } else {
        this.$set(this.tags, index, { name: text, type: key })
      }
    },
    getList() {
      this.listLoading = true
      customerList(this.listQuery).then(response => {
        this.tableList = response.data
        if (response.headers.pagination) {
          this.total = Number(response.headers.pagination.split(',')[1])
        } else {
          this.total = 0
        }
        this.listLoading = false
      })
    },
    getCount() {
      let obj = this.listCount
      let self = this
      countList(obj).then(response => {
        let res = response.data
        for (let i = 0; i < self.boxlist.length; i++) {
          let item = self.boxlist[i]
          for (let key in res.count) {
            if (item.type === key) {
              if (typeof (res.count[key]) === 'object') {
                let count = 0
                // for (let prop in res.count[key]) {
                //   count += res.count[key][prop]
                // }
                count = res.count[key][1]
                self.boxlist[i].num = count
              } else {
                self.boxlist[i].num = res.count[key]
              }
            }
          }
        }
      })
    },
    searchlist(obj) {
      delete this.listQuery.column
      delete this.listQuery.value
      if (obj.value === '') {
        delete this.tags[0]
      } else {
        let tagszh = {
          phone: '手机号码',
          name: '姓名',
          card_no: '会员卡号',
          remark: '备注',
          consultant_name: '所属会籍',
          coach_name: '所属教练',
        }
        this.tags[0] = { 'name': `${tagszh[ obj.type]}:${obj.value}`, 'type': obj.type }
        this.listQuery.column = obj.type
        this.listQuery.value = obj.value
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
    /**
     * 会员详情弹窗
     */
    customerDetailsBtn(row) {
      // 打开
      this.popupsCustomerDetailsVisible = true
      this.$nextTick(() => {
        this.$refs.popupsDetailsCustomerDoc.setDefaultVule(row)
      })
    },
    popupsClosedcustomerDetails() {
      // 关闭
      this.$initData()
      this.popupsCustomerDetailsVisible = false
    },
    /**
     * 分配会籍弹窗
     */
    distributSalesBtn(row) {
      // 显示
      if (this.isTimesStorageStation) {
        // 是否是在回收站
        return true
      }
      this.popupsSalesVisible = true
      this.$nextTick(() => {
        this.$refs.popupsSalesDoc.setDefaultVule(row.consultant_id ? getEmployeeSelectVule(this.salesList, row.consultant_id) : null)
      })
      this.modifyCustomer = row
    },
    popupsClosedSales() {
      // 关闭
      this.popupsSalesVisible = false
    },
    popupsSalesBtnOk(param) {
      //  提交
      this.popupsSalesVisible = false
      let query = {
        id: this.modifyCustomer.id,
        phone: this.modifyCustomer.phone,
        name: this.modifyCustomer.name,
        sex: this.modifyCustomer.sex,
        consultant_id: param.value,
        coach_id: this.modifyCustomer.coach_id,
        intent_level: this.modifyCustomer.intent_level,
        channel: this.modifyCustomer.channel,
        purpose: this.modifyCustomer.purpose
      }
      modifyCustomer(query).then(res => {
        if (res) {
          this.common.message('success', '分配会籍成功')
          this.$initData()
        }
      }).catch(err => {
        console.log(err)
      })
    },
    /**
     * 分配教练弹窗
     */
    distributCoachBtn(row) {
      //  显示
      if (this.isTimesStorageStation) {
        // 是否是在回收站
        return true
      }
      this.popupsCoachVisible = true
      this.modifyCustomer = row
      // console.log('row.coach_id', row.coach_id)
      this.$nextTick(() => {
        this.$refs.popupsCoachDoc.setDefaultVule(row.coach_id ? getEmployeeSelectVule(this.getCoachList(this.salesList), row.coach_id) : null)
      })
    },
    popupsClosedCoach() {
      //  关闭
      this.popupsCoachVisible = false
    },
    popupsCoachBtnOk(param) {
      // 提交
      let query = {
        id: this.modifyCustomer.id,
        phone: this.modifyCustomer.phone,
        name: this.modifyCustomer.name,
        sex: this.modifyCustomer.sex,
        consultant_id: this.modifyCustomer.consultant_id,
        coach_id: param.value,
        intent_level: this.modifyCustomer.intent_level,
        channel: this.modifyCustomer.channel,
        purpose: this.modifyCustomer.purpose
      }
      modifyCustomer(query).then(res => {
        if (res) {
          this.common.message('success', '分配教练成功')
          this.getList()
        }
      }).catch(err => {
        console.log(err)
      })
      this.popupsCoachVisible = false
    },
    /**
     * 编辑会员弹窗
     */
    customerEditBtn(row) {
      // 显示
      this.popupsEditCustomerVisible = true
      this.$nextTick(() => {
        this.$refs.popupsEditCustomerDoc.setDefaultVule(row)
      })
    },
    popupsClosedEditCustomer() {
      // 关闭
      this.popupsEditCustomerVisible = false
    },
    popupsEditCustomerBtnOk() {
      // 提交
      this.popupsEditCustomerVisible = false
      this.$initData()
    },
    /**
     * 删除会员
     */
    customerDeleteBtn(row) {
      // 删除会员
      this.deleteId = row.id
      this.$refs.deleteDialogDoc.dialogShow()
    },
    deleteCustomerSure() {
      deleteCustomer(this.deleteId).then(res => {
        this.common.message('success', '删除成功！')
        this.$refs.deleteDialogDoc.dialogClose()
        this.$initData()
      }).catch((err) => {
        console.log(err)
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
      if (!this.groupOprate.ids.length) {
        this.common.message('warning', '请先选择会员')
        return
      }
      if (value === 'delete') {
        this.groupOprate.method = 'delete'
        this.$confirm('是否批量删除选中的数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          customersBatchDestroy(this.groupOprate).then(res => {
            if (res) {
              this.common.message('success', '批量删除成功')
              this.$initData()
            }
          }).catch(err => {
            console.log(err)
          })
        })
      } else {
        this.groupOprate.method = 'save'
        if (value === 'consultant_id') {
          this.groupOprate.attribute = 'consultant_id'
          this.popupsbatchSalesVisible = true
        } else if (value === 'coach_id') {
          this.groupOprate.attribute = 'coach_id'
          this.popupsbatchCoachVisible = true
        } else if (value === 'batch_Restore') {
          // 批量恢复
          console.log('this.groupOprate.ids', this.groupOprate.ids)
          let obj = {
            ids: this.groupOprate.ids
          }
          this.$confirm('是否恢复该会员?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            customerBatchRestore(obj).then(res => {
              this.$message({
                message: '恢复成功',
                type: 'success'
              })
              this.$initData()
            }).catch(err => {
              console.log(err)
            })
          }).catch(() => {
            console.log(1)
          })
        }
      }
    },
    /**
    * 获得员工
    */
    getSalesList() {
      let query = {
        per_page: 1000,
        page: 1
      }
      employeeList(query).then(res => {
        this.salesList = res.data.filter(currentValue => {
          return currentValue.status === 1
        })
      }).catch(err => {
        console.log(err)
      })
    },
    /**
    * 获得教练
    * */
    getCoachList(param) {
      let coachList = param.filter(currentValue => {
        return (currentValue.post === 1) && (currentValue.status === 1)
      })
      return coachList
    },
    /**
    * 批量修改会籍
    */
    popupsClosedbatchSales() {
      // 关闭
      this.popupsbatchSalesVisible = false
    },
    popupsbatchSalesBtnOk(param) {
      let _value = param.value
      if (_value === '') {
        this.$message({
          message: '请选择会籍',
          type: 'warning'
        })
        return
      }
      let obj = {
        ids: this.groupOprate.ids,
        con_id: _value
      }
      customerBatSetCon(obj).then(res => {
        if (res) {
          this.common.message('success', '批量修改成功')
          this.popupsbatchSalesVisible = false
          this.getList()
        }
      }).catch(err => {
        console.log(err)
      })
    },
    /**
    * 批量修改教练
    */
    popupsClosedbatchCoach() {
      this.popupsbatchCoachVisible = false
    },
    popupsbatchCoachBtnOk(param) {
      let _value = param.value
      if (_value === '') {
        this.$message({
          message: '请选择教练',
          type: 'warning'
        })
        return
      }
      let obj = {
        ids: this.groupOprate.ids,
        coach_id: _value
      }
      customerBatSetCoach(obj).then(res => {
        if (res) {
          this.common.message('success', '批量修改成功')
          this.popupsbatchCoachVisible = false
          this.getList()
        }
      }).catch(err => {
        console.log(err)
      })
    },
    $initData() {
      this.getCount()
      this.getList()
    },
    getchannel(param) {
      return channelDictionary(param)
    },
    // 回收站-恢复
    activaCustomerBtn(row) {
      this.deleteId = row.id
      this.$refs.recoveryDialogDoc.dialogShow()
    },
    recoveryCustomerSure() {
      customerRestore(this.deleteId).then(res => {
        this.$message({
          message: '恢复成功',
          type: 'success'
        })
        this.$initData()
        this.$refs.recoveryDialogDoc.dialogClose()
      }).catch(err => {
        console.log(err)
        this.$refs.recoveryDialogDoc.dialogLoadingClose()
      })
    },
    stopCardCardTj() {
      // 提交停卡 关闭详情
      this.popupsCustomerDetailsVisible = false
      this.$initData()
    },
    pageInit() {
      this.paginationShow = false
      this.$nextTick(() => {
        this.paginationShow = true
      })
    },
    timeChange(param) {
      // 时间筛选
      this.common.chooseTimerFilter(param, this)
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
  destroyed() {}
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg:#2d3a4b;
$light_gray:#eee;
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
.cursor{
  cursor: pointer;
}
.cursorbox {
  float: left;
  width: 10%;
  min-width: 160px;
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
.more-tag{
  position: relative;
  height: 40px;
  margin: 4px auto;
  z-index: 1;
  .tags-wz{
    z-index: 2;
    position: absolute;
    top: 6px;
    left: 10px;
  }
  .bg-tag{
    width: 58px;
    height: 28px;
    border-radius: 4px;
    background-color: rgba(26,179,148,0.10);
    border: 1px solid #1AB394;
    position: absolute;
    top: 2px;
    left: 14px;
    z-index: 1;
  }
}
.tags-styl{
  border: 1px solid #1AB394;
  background-color: #EAF7F5;
}
</style>
