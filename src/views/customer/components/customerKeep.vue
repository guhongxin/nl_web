<template>
  <div>
    <div class="boxser">
      <rectbox :data="boxlist" v-on:choose="curChoose" v-on:openbox="curOpenbox" @overChange="curOverChange"></rectbox>
    </div>
    <div class="find-box3">
      <div style="overflow:hidden" class="filter-container">
        <scan-input :select="searchSelect" :defaultSelect="searchSelect[0].value" @kedownOver="searchlist" ref="scanIputDoc"></scan-input>
        <el-tooltip class="item" effect="dark" content="筛选销售人" placement="top" :effect="'light'" :hide-after="1000">
          <el-cascader :options="optionsWith" @change="optionsWithOK" v-model="optionsWithvalue" placeholder="请选择" style="float: left; margin-left:20px;"></el-cascader>
        </el-tooltip>
        <bulk-action :select="batchOperation" @changeBulk="searchGroup"></bulk-action>
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
    <el-table @filter-change="filterChange"
      class="check-table"
      @selection-change="selectionChange" 
      @sort-change="sortChange" stripe 
      :key='tableKey' :data="tableList" 
      v-loading="listLoading" element-loading-text="列表正在加载中" border 
      fit highlight-current-row
      style="width: 100%;">
      <el-table-column align="center" type="selection" width="55px"></el-table-column>
      <el-table-column align="center" :label="'姓名'" width="180px" prop="scope.row.name">
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
      :filters="[{text: '男', value: '1', class: 'csex'}, {text: '女', value: '2'}]"
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
      :filters="consultantOptions" filter-placement="bottom-end" :filter-multiple="false">
        <template slot-scope="scope">
          <el-tag class="cursor" :type="scope.row.consultant?'warning':''" @click.native="distributSalesBtn(scope.row)">{{scope.row.consultant?scope.row.consultant.name:'未分配'}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column column-key="coach" align="center" :label="'所属教练'" width="120" prop="coach" 
      :filters="coachOptions" filter-placement="bottom-end" :filter-multiple="false">
        <template slot-scope="scope">
          <el-tag class="cursor" :type="scope.row.coach?'warning':''" @click.native="distributCoachBtn(scope.row)">{{scope.row.coach?scope.row.coach.name:'未分配'}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" 
        label="创建时间<i onclick='openDate(event)' data=[5,'created_at_sdate','created_at_edate'] title='创建时间' class='el-icon-date'></i>"
        sortable='custom' prop="created_at_sort">
        <template slot-scope="scope">
          <span>{{scope.row.created_at}}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" :label="'时效卡'">
        <template slot-scope="scope">
          <div class="more-tag" v-if="scope.row.limitation_card.length">
            <div class="bg-tag" style="width:90px;" v-if="scope.row.limitation_card.length>1"></div>
            <el-tag class="tags-styl tags-wz" @click="handleUpdate(scope.row)" style="width:90px;">{{scope.row.limitation_card[0]?common.customFormat(scope.row.limitation_card[0].end_date, 'yyyy-MM-dd'):''}}</el-tag>
          </div>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" :label="'次卡'">
        <template slot-scope="scope">
          <div class="more-tag" v-if="scope.row.times_card.length">
            <div class="bg-tag" style="width:90px;" v-if="scope.row.times_card.length>1"></div>
            <el-tag class="tags-styl tags-wz" style="width:90px;" @click="handleUpdate(scope.row)">剩余{{scope.row.times_card[0]?(scope.row.times_card[0].total_times - scope.row.times_card[0].use_times):''}}次</el-tag>
          </div>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" :label="'私教次数'" prop="course_residue">
        <template slot-scope="scope">
          <el-tag @click="handleUpdate(scope.row)" class="tags-styl">剩余{{scope.row.course_residue}}次</el-tag>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" :label="'最近入场'" sortable='custom' prop="last_signed_at_sort">
        <template slot-scope="scope">
          <span>{{scope.row.last_signed_at?scope.row.last_signed_at:'-'}}</span>
        </template>
      </el-table-column>
      <el-table-column width="180px" align="center" :label="'会籍跟进'" sortable='custom' prop="consultant_last_followed_at_sort">
        <template slot-scope="scope">
          <el-tag type="info" class="cursor" v-if="btnRoleList['2-1-2-6']" @click.native="rowDbClick(scope.row.id,1)">{{scope.row.consultant_last_followed_at?scope.row.consultant_last_followed_at:'-'}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column width="180px" align="center" :label="'教练跟进'" sortable='custom' prop="coach_last_followed_at_sort">
        <template slot-scope="scope">
          <el-tag type="info" class="cursor" v-if="btnRoleList['2-1-2-7']" @click.native="rowDbClick(scope.row.id,2)">{{scope.row.coach_last_followed_at?scope.row.coach_last_followed_at:'-'}}</el-tag>
        </template>
      </el-table-column>
       <el-table-column column-key="channel" align="center" :label="'来源渠道'" width="150" prop="scope.row.channel" 
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
      <el-table-column align="center" :label="'备注'" width="150" prop="scope.row.remark">
        <template slot-scope="scope">
          <span :title="scope.row.remark">{{scope.row.remark? common.substring(scope.row.remark, 16):'-'}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="'签到次数'" width="120" sortable='custom' prop="sign_count_sort">
        <template slot-scope="scope">
          <span>{{scope.row.sign_count}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.actions')" min-width="180" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" v-if="btnRoleList['2-1-2-1']" size="mini" @click="distributSalesBtn(scope.row)">分配会籍</el-button>
          <el-button size="mini" v-if="btnRoleList['2-1-2-2']" @click="distributCoachBtn(scope.row)">分配教练</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination
        v-if="paginationShow"
        background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
        :page-sizes="[10,20,30,50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <chat-record-popups :title="'聊天记录'"
      ref="chatRecordDoc"
      v-if="popupsChatRecordVisible"
      :dialogVisible="popupsChatRecordVisible"
      :widthSize="'500px'"
      @popupsClosed="popupsClosedChatRecord">
    </chat-record-popups>

    <assign-popups :title="'分配会籍'" 
      v-if='popupsSalesVisible'
      :dialogVisible="popupsSalesVisible"
      @popupsClosed="popupsClosedSales" 
      :selectList="salesList"
      :widthSize="'450px'"
      :formlabel="'分配会籍'"
      :placeholder="'请选择会籍名称'"
      ref='popupsSalesDoc'
      @assignPopupsBtnOk="popupsSalesBtnOk"></assign-popups>

    <assign-popups :title="'分配教练'"
      v-if='popupsCoachVisible'
      :dialogVisible="popupsCoachVisible"
      @popupsClosed="popupsClosedCoach" 
      :selectList="getCoachList(salesList)"
      :widthSize="'450px'"
      :formlabel="'教练名称'"
      :placeholder="'请选择教练名称'"
       ref='popupsCoachDoc'
      @assignPopupsBtnOk="popupsCoachBtnOk"></assign-popups>

    <assign-popups :title="'批量分配会籍'" 
      :dialogVisible="popupsbatchSalesVisible"
      @popupsClosed="popupsClosedbatchSales" 
      :selectList="salesList"
      :widthSize="'450px'"
      :formlabel="'分配会籍'"
      :placeholder="'请选择会籍名称'"
      ref='popupsbatchSalesDoc'
      @assignPopupsBtnOk="popupsbatchSalesBtnOk"></assign-popups>

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
  </div>
</template>

<script>
import { customerList, countList } from '@/api/customer'
import rectbox from '@/components/rectbox'
import scanInput from '@/components/scanInput'
import bulkAction from '@/components/bulkAction'
import AssignPopups from '@/components/assignPopups'
import ChatRecordPopups from './popups/chatRecordPopups'
import dateRange from '@/components/dateRange'
import { employeeList, modifyCustomer, customersBatchDestroy, customerBatSetCon, customerBatSetCoach } from '@/api/customerGl'
import { channelDictionary, getEmployeeSelectVule } from '@/utils/comm'
// const typeArr = ['all', 'new', 'bind_coach', 'not_sign', 'new_value', 'unexpired', 'expired', 'expiring_lease', 'birthday', 'only_trashed', 'unbind_consultant', 'unbind_coach', 'bind_coach', 'not_maintain', 'not_maintain_value']

export default {
  name: 'customerKeep',
  components: {
    rectbox,
    scanInput,
    bulkAction,
    AssignPopups,
    ChatRecordPopups,
    dateRange
  },
  data() {
    return {
      btnRoleList: {}, // 按钮权限
      tags: [],
      consultantOptions: [],
      coachOptions: [],
      select: '',
      searchval: '',
      tableKey: 0,
      tableList: null,
      total: null,
      listLoading: true,
      optionsWithvalue: [''],
      allemp: [],
      listQuery: {
        page: 1,
        per_page: 10,
        is_vip: 1,
        scope: 'unbind_consultant',
        scope_value: 0
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
        text: '未绑定会籍',
        num: 0,
        type: 'unbind_consultant',
        checked: true,
        bocolor: 'rgb(28, 132, 198)'
      }, {
        text: '未绑定教练',
        num: 0,
        type: 'unbind_coach',
        checked: false,
        bocolor: 'rgb(28, 132, 198)'
      }, {
        text: '未维护',
        num: 0,
        type: 'not_maintain',
        checked: false,
        bocolor: 'rgb(65, 189, 190)',
        rbtn: '最近5天',
        select: [{
          label: '最近5天'
        }, {
          label: '最近30天'
        }, {
          label: '最近90天'
        }]
      }, {
        text: '未签到',
        num: 0,
        type: 'not_sign',
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
      // {
      //   text: '即将失效',
      //   num: 0,
      //   type: 'expiring_lease',
      //   checked: false,
      //   bocolor: 'rgb(248, 172, 89)',
      //   rbtn: '最近30天',
      //   select: [{
      //     label: '最近5天'
      //   }, {
      //     label: '最近30天'
      //   }, {
      //     label: '最近90天'
      //   }]
      // }, {
      //   text: '已失效',
      //   num: 0,
      //   type: 'expired',
      //   checked: false,
      //   bocolor: 'rgb(241, 76, 48)',
      //   rbtn: '全部',
      //   select: [{
      //     label: '全部'
      //   }, {
      //     label: '最近5天'
      //   }, {
      //     label: '最近30天'
      //   }, {
      //     label: '最近90天'
      //   }]
      // },
      {
        text: '最近生日',
        num: 0,
        type: 'birthday',
        checked: false,
        bocolor: 'rgb(177, 197, 211)',
        rbtn: '最近30天',
        select: [{
          label: '最近5天'
        }, {
          label: '最近30天'
        }, {
          label: '最近90天'
        }]
      },
      // {
      //   text: '未过期会员',
      //   num: 0,
      //   type: 'unexpired',
      //   checked: false,
      //   bocolor: 'rgb(28, 132, 198)'
      // },
      {
        text: '私教会员',
        num: 0,
        type: 'bind_coach',
        checked: false,
        bocolor: 'rgb(26, 179, 148)'
      }],
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
        key: '2-1-2-3'
      }, {
        label: '批量分配教练',
        value: 'coach_id',
        key: '2-1-2-4'
      }, {
        label: '批量删除',
        value: 'delete',
        key: '2-1-2-5'
      }],
      searchGroupBtn: '',
      popupsSalesVisible: false,
      salesList: [],
      popupsCoachVisible: false,
      modifyCustomer: {},
      popupsbatchSalesVisible: false,
      popupsbatchCoachVisible: false,
      popupsChatRecordVisible: false,
      groupOprate: {
        ids: []
      },
      purposeList: [{
        text: '无', value: '0', class: 'cchannel'
      }, {
        text: '电话收集', value: '1'
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
        unbind_consultant: 3, // 未绑定会籍
        unbind_coach: 3, // 未绑定教练
        not_maintain: 3, // 未维护
        not_maintain_value: 5,
        not_sign: 5, // 未签到
        expiring_lease: 30, // 即将到期
        expired: 0, // 已过期
        birthday: 30, // 最近生日
        unexpired: 3, // 未过期会员
        bind_coach: 3 // 私教会员
      },
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
        console.log(value)
      }
    },
    optionsWith() {
      return [{
        value: 2,
        label: '售卡',
        children: this.allemp
      }, {
        value: 3,
        label: '私教课',
        children: this.allemp
      }, {
        value: 6,
        label: '团课',
        children: this.allemp
      }, {
        value: '',
        label: '全部'
      }]
    },
  },
  mounted() {
  },
  methods: {
    __init() {
      this.common.eachBtnRole(this.btnRoleList) // 按钮权限方法
      this.getSalesList()
      this.getList()
      this.getCount()
    },
    /**
     * 聊天记录
     */
    rowDbClick(id, type) {
      // 弹出
      this.popupsChatRecordVisible = true
      this.$nextTick(() => {
        this.$refs.chatRecordDoc.getChartList(id, type)
      })
    },
    popupsClosedChatRecord() {
      // 关闭
      this.popupsChatRecordVisible = false
    },
    sortChange(data) {
      this.common.sortFilter(this, data)
    },
    tagclose(tag, index) {
      this.common.tagFilter(this, tag, index, this.searchSelect)
    },
    curOverChange(obj) {
      this.boxlist[obj.fatherIndex].rbtn = obj.label
      this.curChoose(obj.fatherIndex)
    },
    curChoose(index) {
      for (let v of this.boxlist) {
        v.checked = false
      }
      this.boxlist[index].checked = true
      this.listQuery.scope = this.boxlist[index].type
      this.listQuery.is_vip = 1
      let _scope_value = this.boxlist[index].rbtn ? this.boxlist[index].rbtn.replace(/[^0-9]/ig, '') : ''
      let _scopeValue = _scope_value.length > 0 ? _scope_value : '0'
      this.listQuery.scope_value = _scopeValue
      // tab查找
      if (this.boxlist[index].type === 'unbind_consultant') {
        this.listCount['unbind_consultant'] = 3
      } else if (this.boxlist[index].type === 'unbind_coach') {
        this.listCount['unbind_coach'] = 3
      } else if (this.boxlist[index].type === 'not_maintain') {
        this.listCount['not_maintain_value'] = Number(_scopeValue)
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
      console.log(this.boxlist[index].text)
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
          default: text = '无'; break
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
    optionsWithOK(value) {
      if (value[0] === '') {
        delete this.listQuery.order_type // 1.购买商品,2.开卡,3.私教课,4.转卡,5.停卡,6.团课,7.会员卡续费,8.租柜,9.续柜
        delete this.listQuery.sell_id // 销售ID
      } else {
        this.listQuery.order_type = value[0]
        this.listQuery.sell_id = value[1]
      }
      this.getList()
      this.pageInit()
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
      this.listQuery.limit = val
      this.getList()
    },
    /**
    * 分配会籍弹窗
    */
    distributSalesBtn(row) {
      // 显示
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
          this.$message({
            message: '分配会籍成功',
            type: 'success'
          })
          this.getList()
          this.getCount()
        }
      }).catch(err => {
        console.log(err)
        this.$message({
          message: '分配会籍失败',
          type: 'warning'
        })
      })
    },
    /**
     * 分配教练弹窗
     */
    distributCoachBtn(row) {
      //  显示
      this.popupsCoachVisible = true
      this.modifyCustomer = row
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
          this.$message({
            message: '分配教练成功',
            type: 'success'
          })
          this.getList()
          this.getCount()
        }
      }).catch(err => {
        console.log(err)
      })
      this.popupsCoachVisible = false
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
              this.getList()
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
        for (let item of this.salesList) {
          this.allemp.push({ value: item.id, label: item.name })
        }
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
      this.$confirm('是否批量修改会籍?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        customerBatSetCon(obj).then(res => {
          if (res) {
            this.common.message('success', '批量修改成功')
            this.popupsbatchSalesVisible = false
            this.getList()
            this.getCount()
          }
        }).catch(err => {
          console.log(err)
        })
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
      this.$confirm('是否批量修改教练?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        customerBatSetCoach(obj).then(res => {
          if (res) {
            this.common.message('success', '批量修改成功')
            this.popupsbatchCoachVisible = false
            this.getList()
            this.getCount()
          }
        }).catch(err => {
          console.log(err)
        })
      })
    },
    getchannel(param) {
      return channelDictionary(param)
    },
    pageInit() {
      this.paginationShow = false
      this.$nextTick(() => {
        this.paginationShow = true
      })
    },
    timeChange(param) {
      this.common.chooseTimerFilter(param, this)
    }
  },
  created() {
    this.__init()
    this.coachNameList()
  },
  filters: {
  },
  destroyed() {
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.cursor {
  cursor: pointer;
}
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
  min-width: 160px;
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
