<template>
  <div class="app-container documentation-container">
    <el-row class="topbox">
      <scan-input :select="searchSelect" :defaultSelect="searchSelect[0].value" @kedownOver="searchList"
        :placeholder="placeholder" 
        @chooseCustomer="chooseCustomer"
        @elautocompletefocus="elautocompletefocus"
        ref='scanIputDoc'></scan-input>
      <span class="twoline"> 
        <el-button class="lf staffAdd" v-if="btnRoleList['1-1-1']" @click="openSuperScreen"><i class="el-icon-menu"></i> 前台大屏</el-button>
        <el-button class="lf staffAdd" v-if="btnRoleList['1-1-2']" @click="$router.push({ name: 'opencard'})"><i class="el-icon-plus"></i> 会员办理</el-button>
        <el-button class="lf staffAdd" v-if="btnRoleList['1-1-3']" @click="hiddenGuestDialogVisible = true"><i class="el-icon-edit"></i> 潜客登记</el-button>
        <el-button class="lf staffAdd" v-if="btnRoleList['1-1-5']" @click="openOrder"><img src="../../assets/icon/sport.svg" style="vertical-align:middle;"/> 运动排行</el-button>
      </span>
    </el-row>
    <el-row class="topbox" style="border-top:none">
      <div class="h1 color3">借出手牌 <span class="delay"></span><span class="delay_word">已逾期</span></div>
      <div class="sendbox">
        <ul>
          <li v-for="(item, index) in boxlist" :key="index" @click="searchLend(item)" :title="item.locker?item.locker.area:'' + '-' + item.locker_grid?item.locker_grid.no:''" :class="{'delayLi': new Date() - new Date(item.expired_at) > 0}">{{item.locker_grid.key?item.locker_grid.key:'智'}}</li>
        </ul>
      </div>
    </el-row>
    <el-row class="topbox" style="border-top:none;padding-bottom:0;">
      <div class="h1 color3">今日公开课</div>
      <div class="openclassbox">
        <table>
          <tbody>
            <tr>
              <td v-for="(item, index) in grouplist" :key="index">
                <div class="openclasitembox">
                  <div class="time">{{item.time_start.substring(0,5)}}~{{item.time_end.substring(0,5)}}</div>
                  <div class="font">公开课：{{item.name}}</div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </el-row>
    <div style="height: 17px;"></div>
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
    <div class="topSignBox">
      <div class="lef">
        <span class="text">今日签到(人)：</span>
        <span class="num green">{{signinPerson}}</span>
        <span class="text textL">今日签退(人)：</span>
        <span class="num red">{{signoutPerson}}</span>
      </div>
      <div class="rig">
        <el-button class="checkRecord" v-if="btnRoleList['1-1-4']" @click="checklistBtn"><i class="el-icon-time"></i> 历史明细</el-button>
        <el-button class="checkRecord" v-if="btnRoleList['1-1-6']" @click="clearSignAll"><i class="qingchang"></i> 一键清场</el-button>
      </div>
    </div>
    <el-table ref="staffTable" 
      @filter-change="filterChange" 
      @sort-change="sortChange" stripe 
      :key='tableKey' :data="tableList" v-loading="listLoading" 
      element-loading-text="列表正在加载中" 
      border fit highlight-current-row
      style="width: 100%;" class="check-table">
      <el-table-column align="center" :label="'姓名'" width="200px" sortable prop="name">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" v-if="scope.row.customer?scope.row.customer.deleted_at:''" :content="`该客户已删除，删除时间: ${scope.row.customer.deleted_at}`" placement="bottom">
            <el-button type="info" size="mini">{{scope.row.customer?scope.row.customer.name:'-'}}</el-button>
          </el-tooltip>
          <span v-else>{{scope.row.customer?scope.row.customer.name:'-'}}</span>
        </template>
      </el-table-column>
      <el-table-column width="74px" align="center" :label="'头像'">
        <template slot-scope="scope">
          <span>
            <img 
              :src="scope.row.customer?(scope.row.customer.head_portrait?scope.row.customer.head_portrait:defaulthead):defaulthead" @click="getCustomerMsg(scope.row)"
              alt="icon" 
              width="40" height="40" 
              style="margin-left:8px;display:list-item;border-radius:50%;cursor:pointer;" />
          </span>
        </template>
      </el-table-column>
      <el-table-column column-key="customer_sex" align="center" :label="'性别'" width="120" prop="customer_sex"
      :filters="[{text: '男', value: '1', class: 'ccustomer_sex'}, {text: '女', value: '2', class: 'ccustomer_sex'}]"
      filter-placement="bottom-end" :filter-multiple="false">
        <template slot-scope="scope">
          <span>{{scope.row.customer?scope.row.customer.sex===1?'男':'女':''}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" :label="'手机号码'" prop="phone">
        <template slot-scope="scope">
          <span>{{scope.row.customer?scope.row.customer.phone:'-'}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="'会员卡号'" prop="scope.row.phone" width="250px">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" v-if="scope.row.customer_vip?scope.row.customer_vip.deleted_at:''" :content="`该会员卡已删除，删除时间: ${scope.row.customer_vip.deleted_at}`" placement="bottom">
            <el-button type="info" size="mini">{{scope.row.customer_vip?scope.row.customer_vip.card_no:'-'}}</el-button>
          </el-tooltip>
          <!-- <span v-else>{{scope.row.customer_vip?scope.row.customer_vip.card_no:scope.row.card_no}}</span> -->
          <span v-else><span v-if="scope.row.customer_vip?scope.row.customer_vip.master_id:false" class="through">通</span>{{scope.row.customer_vip?scope.row.customer_vip.card_no:scope.row.card_no}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="卡种类型" prop="scope.row.type">
        <template slot-scope="scope">
          <el-tag class="tags-styl">{{scope.row.customer_vip?scope.row.customer_vip.card_name:'-'}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="'签到/签退时间'" width="200" prop="">
        <template slot-scope="scope">
          <span v-if="scope.row.sign_in">
            <div class="ss" v-if="new Date(scope.row.sign_in) - new Date(new Date().setHours(0, 0, 0, 0)) > 0"><i class="circle dao">到</i>{{new Date(scope.row.sign_in).getTime() | parseTime('{h}:{i}')}}</div>
            <div class="ss" v-if="new Date(scope.row.sign_in) - new Date(new Date().setHours(0, 0, 0, 0)) < 0"><i class="circle dao">到</i>{{new Date(scope.row.sign_in).getTime() | parseTime('{y}-{m}-{d} {h}:{i}')}}</div>
          </span>
          <div class="ss" v-else><i class="circle dao">到</i> -- : --</div>
          <div class="ss"><i class="circle tui">退</i><span v-if="scope.row.status!==0">{{new Date(scope.row.sign_out).getTime() | parseTime('{h}:{i}')}}</span><span v-if="scope.row.status===0"> -- : --</span></div>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="'入场状态'" width="200" prop="status" column-key="status"
      :filters="[{text: '已出场', value: '1', class: 'cstatus'}, {text: '已入场', value: '0'}]"
      filter-placement="bottom-end" :filter-multiple="false">
        <template slot-scope="scope">
          <span v-if="scope.row.status===1||scope.row.status===2" class="red">已出场</span>
          <span v-if="scope.row.status===0" class="green">已入场</span>
        </template>
      </el-table-column>
      <el-table-column align="center" fixed="right" :label="$t('table.actions')" min-width="250" class-name="small-padding">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" plain v-show="scope.row.status===0" @click="handleOut(scope.$index, scope.row)">确认出场</el-button>
          <el-button size="mini" style="margin-left:0px;" type="success" plain v-show="scope.row.status===2||scope.row.status===1" @click="handleSignIn(scope.$index, scope.row)">确认入场</el-button>
          <el-button size="mini" plain class="return-btn"
          @click="handleLend(scope.$index, scope.row)" v-show="scope.row.cabinet_bracelet==null">借出手牌</el-button>
          <el-button size="mini" type="danger" plain 
          @click="handleBack(scope.$index, scope.row)" v-show="scope.row.cabinet_bracelet">归还手牌</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container" style="text-align:right;">
      <el-pagination 
        v-if="paginationShow"
        background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
        :page-sizes="[10,20,30,50]" :page-size="listQuery.pre_page" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <!-- 潜客登记 dialog-start -->
    <el-dialog
      title="潜客登记"
      :visible.sync="hiddenGuestDialogVisible"
      width="800px"
      center>
      <el-row :gutter="20">
        <el-form ref="hiddenGuestForm" 
          :model="hiddenGuestForm" 
          label-width="60px"
          :rules="hiddenGuestRules">
        <el-col :span="12">
          <el-form-item label="姓名:" prop="name">
            <el-input v-model="hiddenGuestForm.name" :maxlength="20" placeholder="请输入会员姓名"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="来源:" prop="channel">
            <el-select v-model="hiddenGuestForm.channel" class="w100" placeholder="请选择">
              <el-option
                v-for="item in channelList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="性别:" prop="sex">
            <el-select v-model="hiddenGuestForm.sex" class="w100" placeholder="请选择">
              <el-option
                v-for="item in sexList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="意向:" prop="intent_level">
            <el-select v-model="hiddenGuestForm.intent_level" class="w100" placeholder="请选择">
              <el-option
                v-for="item in intent_levelList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="手机:" prop="phone">
            <el-input v-model="hiddenGuestForm.phone" placeholder="请输入会员手机号码"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="目的:" prop="purpose">
            <el-select v-model="hiddenGuestForm.purpose" class="w100" placeholder="请选择">
              <el-option
                v-for="item in purposeList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="会籍:" prop="consultant_id">
            <el-select v-model="hiddenGuestForm.consultant_id" class="w100" placeholder="请选择会籍顾问">
              <el-option
                v-for="(item,key) in sellList"
                v-if="item.status !== 3"
                :key="key"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="备注:" prop="">
            <el-input v-model="hiddenGuestForm.remark" :maxlength="20" placeholder="请输入备注"></el-input>
          </el-form-item>
        </el-col>
        </el-form>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" class="zusubmit" @click="hiddenGuestBtn" :loading="hiddenGuestBtnLoading">提 交</el-button>
      </span>
    </el-dialog>

    <!-- 历史明细 -->
    <checklist 
      :checklistDialogVisible="checklistDialogVisible" 
      @closeCheckList="closeCheckList" 
      ref="checkListDoc">
    </checklist>

    <!-- 一键清场 -->
    <clear-sign-dialog
      ref="clearSignDoc" @cleanBtn="cleanBtn">
    </clear-sign-dialog>

    <!-- 借出手牌详情 -->
    <len-cabinet-dialog
      v-if="lenCabinetDialog"
      ref="lenCabinetDialog"
      :dialogVisible='lenCabinetDialog'
      :cabinetMsg='cabinetMsg' 
      :loading='backloading'
      :title='cabinetTitle'
      :always='always'
      @dialogClosed='dialogClosesLend'
      @backCabinet='backCabinetLend'
      @cansleCabinet='cansleCabinetLend'
      :widthSize="'500px'">
    </len-cabinet-dialog>

    <!-- 柜子归还 -->
    <el-dialog
      title="柜子归还"
      :visible.sync="backDialogVisible"
      :close-on-click-modal="true"
      width="485px"
      class="cabinet-dialog4" @close="backMsgclose">
      <ul class="ul-box">
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
    
    <!-- 续费信息确认 -->
    <renew-cabinet-dialog
      v-if="renewCenterDialogVisible"
      ref="renewCenterDialogVisible"
      :dialogVisible='renewCenterDialogVisible'
      :cabinetMsg='renewcabinetMsg' 
      :loading='backloading'
      :title='cabinetTitle'
      :selectoptions="selectoptions"
      :always='always'
      @dialogClosed='dialogClosesRenew'
      @renewCabinet='renewCabinet'
      :widthSize="'500px'">
    </renew-cabinet-dialog>

    <!-- 根据手机号码搜索会员详情 -->
    <customer-details-popups :title="'客户详情'"
      :contentData="contentData"
      :dialogVisible="popupsCustomerDetailsVisible"
      :widthSize="'950px'"
      ref='popupsDetailsCustomerDoc'
      @popupsClosed="popupsClosedcustomerDetails"
      @changeSelecter="changeSelecter"
      >
    </customer-details-popups>

    <!-- 确认借出手牌 -->
    <el-dialog
      title="手牌扫码"
      :visible.sync="lendDialogVisible"
      width="490px"
      class="course-dialog" style="margin-top: 28vh;" @close="addclose">
      <el-input placeholder="请扫描手牌编码或扫码"  
        v-model="menberMessage.code" @keyup.enter.native="lendCode">
        <template slot="prepend">
          <i class="qr"></i>
        </template>
        <el-button slot="append" icon="el-icon-search" @click="lendCode"></el-button>
      </el-input>
    </el-dialog>

    <!-- (未出租)租借信息确认 -->
    <el-dialog
      title="租借信息确认"
      :visible.sync="lendSureDialogVisible"
      :close-on-click-modal="false"
      width="485px"
      class="cabinet-dialog4" @close="cabinetclose">
      <ul class="ul-box">
        <li>
          <span>当前柜号：</span><span>{{menberMessage.area}}-{{menberMessage.num}}号</span>
        </li>
        <li>
          <span>当前状态：</span><span>未出租</span>
        </li>
        <li>
          <span>手牌编号：</span><span>{{menberMessage.code}}</span>
        </li>
        <li>
          <span class="not-null"><b>. </b><span>客户信息：</span></span>
          <div class="vip-box">
            <img :src="menberMessage.head_portrait? menberMessage.head_portrait: defineHead"  alt="" width='50px' height="50px" style="border-radius:50%;">
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
          <span>实收金额：</span>
          <el-input type="number" placeholder="请输入本次租实际收取的金额" v-model="menberMessage.real_pay"></el-input>
        </li>
        <li>
          <span>租用押金：</span>
          <el-input type="number" placeholder="请输入本次租柜的押金" v-model="menberMessage.charter_pay"></el-input>
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
          <el-select v-model="menberMessage.payment_method" placeholder="请选择支付方式">
            <el-option
              v-for="item in selloptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </li>
        <li>
          <span>租用备注：</span>
          <textarea style="resize:none;" placeholder="可在此备注一些特殊情况" v-model="menberMessage.memo" :maxlength="20" class="textarea"></textarea>
        </li>
      </ul>
      <div class="cabnit-dialog-footer" style="text-align:center;">
        <span slot="footer">
          <el-button type="primary" class="gray" @click="lendSureDialogVisible=false">取消</el-button>
          <el-button type="primary" class="black" @click="rentCabinet" :loading="delLoading">确定</el-button>
        </span>
      </div>
    </el-dialog>

    <!-- 确认出场 -->
    <el-dialog
      title="提示"
      :visible.sync="outDialogVisible"
      width="490px"
      class="course-dialog" style="margin-top: 28vh;">
      <div style="color:#000;text-align:center;font-size:18px;margin:20px 0;">确定要出场？</div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" class="black" style="padding:10px 34px;" @click="signOutSure" :loading="delLoading">确定</el-button>
      </span>
    </el-dialog>

    <!-- 确认入场 -->
    <el-dialog
      title="提示"
      :visible.sync="signInDialogVisible"
      width="490px"
      class="course-dialog" style="margin-top: 28vh;">
      <div style="color:#000;text-align:center;font-size:18px;margin:20px 0;">确定要入场？</div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" class="black" style="padding:10px 34px;" @click="signInSure" :loading="delLoading">确定</el-button>
      </span>
    </el-dialog>
    <!-- 卡详情 -->
    <card-detail-box
      ref="carddetialbox"
      @changeSelecter="changeSelecter"></card-detail-box>
    <!-- 会员详情 -->
    <customer-detail-box
      ref="customerdetailbox"
      @changeSelecter="changeSelecter">

    </customer-detail-box>
  </div>
</template>

<script>
import { getSignList, getTodaySignNum, SignOrOut, addHiddenGuest, phoneSignV2 } from '@/api/signin'
import { getCustomersByPhone } from '@/api/customer'
import { listSellVipCard1 } from '@/api/vipcard'
import { customerList } from '@/api/customer'
import { getTodayGroupCourses } from '@/api/course'
import scanInput from '@/components/scanInputSearch'
import checklist from './components/checklist'
import lenCabinetDialog from './components/lenCabinet'
import renewCabinetDialog from './components/renewCabinet'
import customerDetailsPopups from './components/customerDetailsPopups'
// import cardDetailMsg from './components/cardDetailMsg'
import clearSignDialog from './components/clearSign'
import CardDetailBox from './components/cardDetailBox'
import { phoneVerification } from '@/utils/comm'
import { findEmployees } from '@/api/vipcardGl'
import { parseTime } from '@/utils/index'
import { listRentRecord, getAllCabinet } from '@/api/cabinet'
import CustomerDetailBox from './components/customerDetailBox'
export default {
  name: 'checkin',
  components: {
    scanInput,
    checklist,
    lenCabinetDialog,
    renewCabinetDialog,
    customerDetailsPopups,
    // cardDetailMsg,
    clearSignDialog,
    CardDetailBox,
    CustomerDetailBox
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
    }]
    return {
      selectoptions: [],
      selloptions: selloptions,
      vipCardDetailsData: {},
      lostTime: '',
      defineHead: require('../../assets/icon/person.png'),
      btnRoleList: {}, // 按钮权限
      tags: [],
      customerId: '',
      grouplist: [],
      // customermessage: [],
      customermessageByName: {},
      checklistDialogVisible: false,
      lenCabinetDialog: false,
      lendDialogVisible: false,
      outDialogVisible: false,
      backDialogVisible: false,
      popupsCustomerDetailsVisible: false,
      vipCardDetailsDialogVisible: false,
      lendSureDialogVisible: false,
      signInDialogVisible: false,
      renewCenterDialogVisible: false,
      delLoading: false,
      rentloading: false,
      signinPerson: 0,
      signoutPerson: 0,
      contentData: [],
      cabinetTitle: '手牌信息',
      gym_sign_status: '', // 签到状态
      sign_card_no: '', // 签到卡
      searchSelect: [{ // 查询列表
        text: '会员卡号',
        value: 'card'
      }, {
        text: '手机号码',
        value: 'phone'
      }, {
        text: '会员姓名',
        value: 'name'
      }],
      cabinet: {
        area: '',
        number: ''
      },
      always: 'always',
      cabinetMsg: [],
      renewcabinetMsg: {},
      menberMessage: { // 租借信息
        head_portrait: '',
        menber_id: '', // 客户ID
        text_phone: '会员手机',
        text_name: '会员姓名',
        area: '',
        num: '',
        code: '',
        start: '',
        end: '',
        real_pay: '',
        charter_pay: '',
        payment_method: selloptions[0].value,
        sell_id: 2,
        memo: ''
      },
      placeholder: '请扫码/输入要查询的内容',
      sexList: [{
        value: 1,
        label: '男'
      }, {
        value: 2,
        label: '女'
      }],
      intent_levelList: [{
        value: 0,
        label: '不明'
      }, {
        value: 1,
        label: '强烈'
      }, {
        value: 2,
        label: '一般'
      }],
      channelList: [{
        value: 0,
        label: '无'
      }, {
        value: 1,
        label: '电话收集'
      }, {
        value: 2,
        label: '拉人到店'
      }, {
        value: 3,
        label: '自然访问'
      }, {
        value: 4,
        label: '会员介绍'
      }, {
        value: 5,
        label: '朋友介绍'
      }, {
        value: 6,
        label: 'APP'
      }, {
        value: 7,
        label: '内购'
      }, {
        value: 8,
        label: '宣传单'
      }, {
        value: 9,
        label: '网络推广'
      }, {
        value: 10,
        label: '团购'
      }, {
        value: 11,
        label: '杂志期刊'
      }, {
        value: 12,
        label: '新闻媒体'
      }, {
        value: 13,
        label: '户外广告'
      }, {
        value: 14,
        label: '其它'
      }],
      purposeList: [{
        value: 0,
        label: '减脂'
      }, {
        value: 1,
        label: '增肌'
      }, {
        value: 2,
        label: '塑形'
      }],
      sellList: [],
      DialogBack: { // 柜子归还
        return_memo: '',
        code: ''
      },
      customerDialogVisible: false,
      boxlist: [],
      select: '',
      searchval: '',
      tableKey: 0,
      tableList: [],
      total: null,
      listLoading: true,
      backloading: false,
      showReviewer: false,
      backMessage: {},
      chooseCustomerId: '',
      chooseCustomerInfor: {},
      listQuery: {
        page: 1,
        pre_page: 10
      },
      listCard: {
        page: 1,
        pre_page: 10,
        card_no: ''
      },
      // cardDetailList: {},
      cardQuery: {
        page: 1,
        pre_page: 10,
        column: 'phone',
        value: ''
      },
      signQuery: {
        vip_id: '',
        status: ''
      },
      signDate: '',
      searchGroupBtn: '',
      sexindex: 0,
      manindex: 0,
      cardIndex: 0,
      value1: true,
      iscoach: true,
      dialogFormVisible: false,
      hiddenGuestForm: {},
      hiddenGuestRules: {
        name: { required: true, message: '请输入姓名', trigger: 'blur' },
        channel: { required: true, message: '请选择来源', trigger: 'blur' },
        sex: { required: true, message: '请选择性别', trigger: 'blur' },
        intent_level: { required: true, message: '请选择意向等级', trigger: 'blur' },
        phone: [
          { required: true, message: '请输入电话号码', trigger: 'blur' },
          { validator: phoneVerification, trigger: 'blur' },
        ],
        purpose: { required: true, message: '请输选择锻炼目的', trigger: 'blur' },
        consultant_id: { required: true, message: '请选择会籍顾问', trigger: 'blur' },
      },
      hiddenGuestDialogVisible: false,
      paginationShow: true,
      hiddenGuestBtnLoading: false
    }
  },
  computed: {
  },
  created() {
    this.common.eachBtnRole(this.btnRoleList) // 按钮权限方法
    this.getList()
    this.lendCabinet()
    this.getGroupCourse()
    this.getTodayNum()
    this.getEmployeesList()
  },
  mounted() {
    // this.$refs.scanIputDoc.dataShow()
  },
  methods: {
    closeCheckList() {
      this.checklistDialogVisible = false
    },
    getGroupCourse() {
      getTodayGroupCourses().then(res => {
        this.grouplist = res.data
      })
    },
    openSuperScreen() {
      window.open(this.staticurl + 'static/superscreen/superControl.html')
    },
    openOrder() {
      window.open(this.staticurl + 'static/ranklist/index.html')
    },
    curChoose(index) {
      for (let v of this.boxlist) {
        v.checked = false
      }
      this.boxlist[index].checked = true
    },
    curOpenbox(index) {
      console.log(this.boxlist[index].text)
    },
    filterMan(value, row, column) {
      if (this.manindex === 0) {
        this.listQuery.salesman = value
        this.getList()
        this.salesmanindex = 1
      } else {
        return false
      }
    },
    tagclose(tag, index) {
      this.common.tagFilter(this, tag, index, this.searchSelect)
    },
    filterChange(data) {
      for (let key in data) {
        this.listQuery[key] = data[key][0]
        this.lotFilter(data, key)
      }
      this.listQuery.page = 1
      this.pageInit()
      this.getList()
    },
    lotFilter(data, key) {
      if (key === 'customer_sex') {
        let text = ''
        switch (this.listQuery[key]) {
          case '1': text = '男'; break
          case '2': text = '女'; break
          default: text = '未知'; break
        }
        this.hostFilter(data, key, 1, '性别：' + text)
      }
      if (key === 'status') {
        this.hostFilter(data, key, 2, this.listQuery[key] === '1' ? '入场状态：已入场' : '入场状态：已出场')
      }
    },
    hostFilter(data, key, index, text) {
      if (data[key].length === 0) {
        delete this.tags[index]
      } else {
        this.$set(this.tags, index, { name: text, type: key })
      }
    },
    sortChange(data) {
      delete this.listQuery[this.deleteItemSort]
      this.deleteItemSort = data.prop
      this.listQuery[data.prop] = data.order
      this.listQuery.page = 1
      this.pageInit()
    },
    // 一键清场
    cleanBtn() {
      this.getList()
    },
    // 借出手牌ALL
    lendCabinet() {
      let data = { status: 1 }
      listRentRecord(data).then((res) => {
        this.boxlist = res.data
      }).catch(() => {
        console.log('失败')
      })
    },
    // 重置租借信息
    cabinetclose() {
      this.cabinetMsg.return_pay = ''
      this.cabinetMsg.charter_pay = ''
      this.cabinetMsg.memo = ''
      this.menberMessage.real_pay = ''
      this.menberMessage.charter_pay = ''
      this.menberMessage.memo = ''
    },
    // 所有借出手牌
    searchLend(item) {
      this.cabinetMsg[0] = item // 租借信息
      // getGridMessage(item.locker_id, item.locker_grid_id).then(res => {
      //   let _data = res.data
      //   this.cabinetMsg[0].rent_remark = _data.locker_rent.renews.length ? _data.locker_rent.renews[_data.locker_rent.renews.length - 1].remark : _data.locker_rent.rent_remark
      // }).catch(err => {
      //   console.log(err)
      // })
      this.DialogBack.code = item.locker_grid.key
      this.cabinetTitle = '手牌信息'
      this.always = 'never'
      if (new Date(this.cabinetMsg[0].expired_at).getTime() - new Date().getTime() < 0) {
        let nTime = new Date().getTime() - new Date(this.cabinetMsg[0].expired_at).getTime()
        let day = Math.ceil(nTime / 86400000)
        this.cabinetMsg[0].day = day
      } else {
        this.cabinetMsg[0].day = 0
      }
      this.renewcabinetMsg = this.cabinetMsg[0] // 续费信息
      this.lenCabinetDialog = true
    },
    chooseCustomer(value) {
      this.chooseCustomerInfor = value
    },
    elautocompletefocus() {
      // 搜索输入框聚焦
      this.chooseCustomerInfor = {}
    },
    // 快速签到or签退
    changeSelecter(vipId, status) {
      this.signQuery.vip_id = vipId
      var tip = ''
      // 签到
      if (status === 1 || status === 2 || status === '') {
        this.signQuery.status = 0
        delete this.signQuery.current_date
        tip = '签到成功'
      // 签退
      } else if (status === 0) {
        this.signQuery.status = 1
        this.signQuery.current_date = this.signDate
        tip = '签退成功'
      }
      SignOrOut(this.signQuery).then(response => {
        this.common.message('success', tip)
        this.$nextTick(() => {
          this.$refs.scanIputDoc.clear()
          this.$refs.carddetialbox.closeDialog()
          this.$refs.customerdetailbox.closeDialog()
        })
        this.listQuery = {
          page: 1,
          pre_page: 10
        }
        this.pageInit()
        this.getList()
        this.getTodayNum()
        this.popupsCustomerDetailsVisible = false
        this.vipCardDetailsDialogVisible = false
      })
    },
    searchList(obj) {
      delete this.listQuery.customer_phone
      delete this.listQuery.customer_name_like
      delete this.listQuery.card_no
      if (obj.type === 'phone') {
        // 通过手机号码搜索
        if (!obj.value.trim()) {
          delete this.tags[0]
          this.pageInit()
          this.getList()
          return
        }
        this.listQuery.customer_phone = obj.value
        this.pageInit()
        // this.getListBuyPhone()
        this.getListBuyPhoneV2()
      }
      if (obj.type === 'name') {
        // 通过客户姓名搜索
        if (!obj.value.trim()) {
          delete this.tags[0]
          this.pageInit()
          this.getList()
          return
        }
        this.listQuery.customer_name_like = obj.value
        // this.listQuery = {
        //   customer_name_like: obj.value,
        //   pre_page: 10,
        //   page: 1
        // }
        this.pageInit()
        this.getListByName()
      }
      if (obj.type === 'card') {
        // 通过会员卡号搜索
        if (!obj.value) {
          delete this.tags[0]
          this.pageInit()
          this.getList()
          return
        }
        this.listQuery.card_no = obj.value
        this.pageInit()
        this.getListBuyCard1()
      }
    },
    // 获得table数据
    getList() {
      this.listLoading = true
      getSignList(this.listQuery).then(response => {
        this.tableList = response.data
        this.total = Number(response.headers.pagination.split(',')[1])
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
        this.tableList = []
      })
    },
    /**
    * 通过卡号去搜索，先到卡列表去查找，如果查找的卡数量等于2,就不查签到列表，如果卡数量为1就去签到列表去查找，
    * 如果找到就搜索，如果没有找到弹出签到弹窗，如果找到就是搜索
    */
    getListBuyCard1() {
      this.listLoading = true
      let obj = {
        card_no: this.listQuery.card_no
      }
      listSellVipCard1(obj).then(response => {
        if (response.data.length !== 0) {
          console.log('response.data', response.data)
          if (response.data.length === 2) {
            this.listLoading = false
            this.$nextTick(() => {
              this.$refs.carddetialbox.showDialog(response.data)
            })
          } else if (response.data.length === 1) {
            getSignList(this.listQuery).then(res => {
              this.listLoading = false
              if (res.data.length === 0) {
                this.$nextTick(() => {
                  this.$refs.carddetialbox.showDialog(response.data)
                })
              } else {
                this.tags[0] = { 'name': `会员卡号:${this.listQuery.card_no}`, 'type': 'card_no' }
                this.tableList = res.data
                this.total = Number(res.headers.pagination.split(',')[1])
              }
            }).catch(err => {
              console.log(err)
              this.listLoading = false
            })
          }
        } else {
          this.listLoading = false
          this.common.message('warning', '该客户不存在')
        }
      }).catch(err => {
        console.log(err)
        this.listLoading = false
      })
    },
    // 通过姓名搜索
    getListByName() {
      if (Object.keys(this.chooseCustomerInfor).length === 0) {
        this.$message({
          type: 'warning',
          message: '请从下拉中选取用户，再点击查找按钮！'
        })
        return false
      }
      this.listLoading = true
      // 1.列表筛选
      let obj = {
        customer_id: this.chooseCustomerInfor.id
      }
      getSignList(obj).then(response => {
        this.listLoading = false
        if (response.data.length === 0) {
          // 2.客户筛选
          this.sign_status = ''
          let _data = []
          _data[0] = this.chooseCustomerInfor
          this.$nextTick(() => {
            this.$refs.customerdetailbox.showDialog(_data)
          })
        } else {
          this.tags[0] = { 'name': `姓名:${this.listQuery.customer_name_like}`, 'type': 'customer_name_like' }
          this.tableList = response.data
          this.total = Number(response.headers.pagination.split(',')[1])
        }
      }).catch(() => {
        this.listLoading = false
        this.tableList = []
      })
    },
    // 通过手机号码搜索
    getListBuyPhoneV2() {
      this.listLoading = true
      let obj = {
        column: 'phone',
        value: this.listQuery.customer_phone,
        is_vip: 1
      }
      phoneSignV2(obj).then(response => {
        if (response.data.length !== 0) {
          console.log('response.data', response.data)
          if (response.data.length >= 2) {
            this.listLoading = false
            this.$nextTick(() => {
              this.$refs.customerdetailbox.showDialog(response.data)
            })
          } else if (response.data.length === 1) {
            getSignList(this.listQuery).then(res => {
              this.listLoading = false
              if (res.data.length === 0) {
                this.$nextTick(() => {
                  this.$refs.customerdetailbox.showDialog(response.data)
                })
              } else {
                this.tags[0] = { 'name': `电话号码:${this.listQuery.customer_phone}`, 'type': 'customer_phone' }
                this.tableList = res.data
                this.total = Number(res.headers.pagination.split(',')[1])
              }
            }).catch(err => {
              console.log(err)
              this.listLoading = false
            })
          }
        } else {
          this.listLoading = false
          this.common.message('warning', '该客户不存在')
        }
      }).catch(err => {
        console.log(err)
        this.listLoading = false
      })
    },
    // 根据手机号码搜索卡信息(客户管理查询接口)
    cardByPhone(row) {
      this.cardQuery.is_vip = 1
      let obj = {
        is_vip: 1,
        customer_id: row.customer_id
      }
      customerList(obj).then(response => {
        let data = response.data
        if (Object.keys(data).length) {
          // this.popupsCustomerDetailsVisible = true
          // this.customermessageByName = data[0]
          // this.$nextTick(() => {
          //   this.$refs.popupsDetailsCustomerDoc.setDefaultDate(this.customermessageByName)
          // })
          // this.setDefaultName()
          // this.getCustomerMsg({ customer_id: data[0].id })
          this.customermessage = data
          this.customermessageByName = data[0]
          this.popupsCustomerDetailsVisible = true
          this.$nextTick(() => {
            this.$refs.popupsDetailsCustomerDoc.setDefaultDate(this.customermessage[0])
          })
          this.setDefaultName()
        } else {
          this.$message('该客户暂无会员卡信息')
        }
      })
    },
    getCustomerMsg(row) {
      this.cardQuery.value = row.customer ? row.customer.phone ? row.customer.phone : '' : ''
      this.sign_status = row.status // 签到状态
      this.sign_card_no = row.card_no // 签到卡
      this.signDate = row.sign_in
      this.cardByPhone(row)
    },
    setDefaultName() {
      let _vips = []
      let type = ''
      let currentValue = this.customermessageByName.vips
      for (let i = 0; i < currentValue.length; i++) {
        if (currentValue[i].type === 1) {
          type = '时效卡'
        } else {
          type = '次卡'
        }
        let obj = {
          vipCardType: type,
          vipCardData: {
            type: currentValue[i].type,
            card_name: currentValue[i].card_name,
            total_times: currentValue[i].total_times,
            end_date: currentValue[i].end_date,
            over_date: currentValue[i].over_date,
            card_no: currentValue[i].card_no,
            card_image: currentValue[i].card_image,
            id: currentValue[i].id,
            status: currentValue[i].status, // 卡锁定状态，0：未锁定，1：锁定
            gym_sign_status: currentValue[i].gym_sign_status, // 卡状态 0：已入场，1或2：未入场
            is_active: currentValue[i].is_active, // 0，未激活，1激活，2.失效
            // leftTime: parseInt(currentValue[i].total_times) - parseInt(currentValue[i].use_times), // 次卡过期
            is_stoped: currentValue[i].is_stoped, // is_stoped:0 未停卡， 1：已停卡
            sign_card_no: this.sign_card_no,
            start_date: currentValue[i].start_date,
            master_id: currentValue[i].master_id,
            gym: currentValue[i].gym
          }
        }
        _vips.push(obj)
      }
      this.contentData = _vips
    },
    // setDefaultVule() {
    //   let _vips = []
    //   let type = ''
    //   let currentValue = []
    //   // 时效卡
    //   if (this.customermessage[0].limitation_card.length !== 0) {
    //     for (let i in this.customermessage[0].limitation_card) {
    //       currentValue.push(this.customermessage[0].limitation_card[i])
    //     }
    //   }
    //   // 次卡
    //   if (this.customermessage[0].times_card.length !== 0) {
    //     for (let i in this.customermessage[0].times_card) {
    //       currentValue.push(this.customermessage[0].times_card[i])
    //     }
    //   }
    //   for (let i = 0; i < currentValue.length; i++) {
    //     if (currentValue[i].type === 1) {
    //       type = '时效卡'
    //     } else {
    //       type = '次卡'
    //     }
    //     let obj = {
    //       vipCardType: type,
    //       vipCardData: {
    //         type: currentValue[i].type,
    //         card_name: currentValue[i].card_name,
    //         total_times: currentValue[i].total_times,
    //         end_date: currentValue[i].end_date,
    //         over_date: currentValue[i].over_date,
    //         card_no: currentValue[i].card_no,
    //         card_image: currentValue[i].card_image,
    //         id: currentValue[i].id,
    //         status: currentValue[i].status, // 卡锁定状态，0：未锁定，1：锁定
    //         gym_sign_status: currentValue[i].gym_sign_status, // 卡状态 0：已入场，1或2：未入场
    //         is_active: currentValue[i].is_active, // 0，未激活，1激活，2.失效
    //         // leftTime: parseInt(currentValue[i].total_times) - parseInt(currentValue[i].use_times), // 次卡过期
    //         is_stoped: currentValue[i].is_stoped, // is_stoped:0 未停卡， 1：已停卡
    //         sign_card_no: this.sign_card_no,
    //         start_date: currentValue[i].start_date,
    //         master_id: currentValue[i].master_id,
    //         gym: currentValue[i].gym
    //       }
    //     }
    //     _vips.push(obj)
    //   }
    //   this.contentData = _vips
    // },
    // 今日签到数
    getTodayNum() {
      getTodaySignNum().then(response => {
        this.signinPerson = response.data.status_0
        this.signoutPerson = response.data.status_1
      })
    },
    dialogClosesLend() {
      // 关闭停卡弹窗
      this.lenCabinetDialog = false
    },
    dialogClosesRenew() {
      this.renewCenterDialogVisible = false
    },
    // 重置归还备注
    backMsgclose() {
      this.DialogBack.return_memo = ''
    },
    // 点击归还按钮
    backCabinetLend(data) {
      this.backDialogVisible = true
      this.DialogBack.id = data.lockerid
      this.DialogBack.grid = data.grid
    },
    // 确定归还手牌
    backCabinet() {
      this.backloading = true
      this.$store.dispatch('BackCabinet', this.DialogBack).then(() => {
        this.backloading = false
        this.common.message('success', '手牌归还成功')
        this.lendCabinet()
        this.getList()
        this.lenCabinetDialog = false
        this.backDialogVisible = false
      }).catch(() => {
        this.backloading = false
      })
    },
    // 点击续费
    cansleCabinetLend(obj) {
      this.renewcabinetMsg = obj // 续费信息
      this.renewCenterDialogVisible = true
    },
    popupsClosedcustomerDetails() {
      // 关闭
      this.popupsCustomerDetailsVisible = false
    },
    dialogClosedDetails() {
      this.vipCardDetailsDialogVisible = false
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.pre_page = val
      this.getList()
    },
    handleEdit(index, row) {
      console.log(index, row)
    },
    // 借出手牌
    handleLend(index, row) {
      if (row.customer ? row.customer.deleted_at : 1) {
        this.common.message('info', '该客户已删除，无法进行此操作')
        return
      }
      let phone = row.customer ? row.customer.phone : ''
      this.messageByPhone(phone)
      // 默认开始时间为当前时间
      this.menberMessage.start = new Date()
      // let y = new Date().getFullYear()
      // let m = new Date().getMonth() + 1
      // let d = new Date().getDate()
      // this.menberMessage.end = y + '-' + m + '-' + d + ' ' + '23:59:59'
      // 默认结束时间为23:59:59
      this.menberMessage.end = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1)
    },
    // 根据手机号码查询会员信息
    messageByPhone(phone) {
      getCustomersByPhone(phone).then(res => {
        let data = res.data
        if (Object.keys(data).length) {
          // [...this.form] = [data]
          this.lendDialogVisible = true
          this.menberMessage.text_phone = data.phone
          this.menberMessage.text_name = data.name
          this.menberMessage.menber_id = data.id
          this.menberMessage.head_portrait = data.head_portrait
        } else {
          this.$message('暂无会员卡信息')
        }
      })
    },
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
      } else if (this.menberMessage.real_pay < 0) {
        this.common.message('warning', '实付金额不能小于0')
        return false
      } else if (this.menberMessage.real_pay > 99999999) {
        this.common.message('warning', '实付金额不能大于99999999')
        return false
      }
      if (!this.menberMessage.charter_pay) {
        this.menberMessage.charter_pay = 0
      } else if (this.menberMessage.charter_pay < 0) {
        this.common.message('warning', '租用押金不能小于0')
        return false
      } else if (this.menberMessage.charter_pay > 99999999) {
        this.common.message('warning', '租用押金不能大于99999999')
        return false
      }
      this.menberMessage.start = parseTime(this.menberMessage.start, '{y}-{m}-{d} {h}:{i}:{s}')
      this.menberMessage.end = parseTime(this.menberMessage.end, '{y}-{m}-{d} {h}:{i}:{s}')
      this.rentloading = true
      this.$store.dispatch('RentCabinetMessage', this.menberMessage).then(() => {
        this.rentloading = false
        this.common.message('success', '租借成功')
        this.lendSureDialogVisible = false
        this.lendDialogVisible = false
        this.lendCabinet()
        this.getList()
      }).catch(() => {
        this.rentloading = false
      })
    },
    addclose() {
      this.menberMessage.code = ''
    },
    // 出场
    handleOut(index, row) {
      if (row.customer ? row.customer.deleted_at : 1) {
        this.common.message('info', '该客户已删除，无法进行此操作')
      } else {
        this.outDialogVisible = true
        this.signQuery.vip_id = row.customer_vip_id
        this.signQuery.status = 1
        this.signQuery.current_date = row.sign_in
      }
    },
    signOutSure() {
      this.delLoading = true
      SignOrOut(this.signQuery).then(response => {
        this.common.message('success', '出场成功')
        this.getList()
        this.getTodayNum()
        this.outDialogVisible = false
        this.delLoading = false
      }).catch(() => {
        this.delLoading = false
      })
    },
    // 确认入场
    handleSignIn(index, row) {
      if (row.customer ? row.customer.deleted_at : 1) {
        this.common.message('info', '该客户已删除，无法进行此操作')
      } else {
        this.signInDialogVisible = true
        this.signQuery.vip_id = row.customer_vip_id
        this.signQuery.status = 0
      }
    },
    signInSure() {
      this.delLoading = true
      SignOrOut(this.signQuery).then(response => {
        this.common.message('success', '入场成功')
        this.getList()
        this.getTodayNum()
        this.signInDialogVisible = false
        this.delLoading = false
      }).catch(() => {
        this.delLoading = false
      })
    },
    // 归还手牌
    handleBack(index, row) {
      if (!row.customer) {
        this.common.message('info', '该客户已删除，无法进行此操作')
        return
      } else {
        this.lenCabinetDialog = true
        this.getCabinetById(row.customer.phone)
        this.cabinetTitle = '确认归还'
      }
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
          this.cabinetMsg = res.data
          for (let i = 0; i < this.cabinetMsg.length; i++) {
            if (new Date(this.cabinetMsg[i].expired_at).getTime() - new Date().getTime() < 0) {
              let nTime = new Date().getTime() - new Date(this.cabinetMsg[i].expired_at).getTime()
              let day = Math.ceil(nTime / 86400000)
              this.cabinetMsg[i].day = day
            } else {
              this.cabinetMsg[i].day = 0
            }
          }
          this.cabinetTitle = '确认归还'
          if (res.data.length > 1) {
            this.always = 'always'
          } else {
            this.always = 'never'
          }
        } else {
          this.cabinetMsg = []
          this.always = 'never'
        }
      }).catch(() => {
        console.log('失败')
      })
    },
    // 续费柜子
    renewCabinet() {
      this.lenCabinetDialog = false
      this.renewCenterDialogVisible = false
      this.lendCabinet()
      this.getList()
    },
    // lendSure() {
    //   this.lendDialogVisible = false
    // },
    // backSure() {
    //   this.backCabinetLend()
    //   this.backDialogVisible = false
    //   this.getList()
    // },
    lendCode() {
      if (this.menberMessage.code.trim()) {
        getAllCabinet().then((response) => {
          let data = response.data
          for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < data[i].grids.length; j++) {
              // status:0未出租，status:1已出租，status:2禁用
              if (data[i].grids[j].status === 0 && data[i].grids[j].key === String(this.menberMessage.code)) {
                this.menberMessage.area = data[i].area
                this.menberMessage.num = data[i].grids[j].no
                this.menberMessage.id = data[i].id
                this.menberMessage.grid = data[i].grids[j].id
                this.lendSureDialogVisible = true
                return
              }
              if (data[i].grids[j].status === 1 && data[i].grids[j].key === String(this.menberMessage.code)) {
                this.common.message('success', '该手牌绑定的租柜已被占用')
                return
              }
              if (data[i].grids[j].status === 2 && data[i].grids[j].key === String(this.menberMessage.code)) {
                this.common.message('success', '该手牌绑定的租柜已被禁用')
                return
              }
            }
          }
          this.common.message('success', '暂无该手环')
        }).catch(() => {
          this.loading = false
          this.common.message('success', '暂无该手环')
        })
      }
    },
    hiddenGuestBtn() {
      this.$refs['hiddenGuestForm'].validate((valid) => {
        if (valid) {
          console.log(this.hiddenGuestForm)
          let param = this.hiddenGuestForm
          this.hiddenGuestBtnLoading = true
          addHiddenGuest(param).then(res => {
            if (res) {
              this.$message({
                type: 'success',
                message: '恭喜你！登记成功'
              })
              this.hiddenGuestDialogVisible = false
              this.getList()
            }
            this.hiddenGuestBtnLoading = false
          }).catch(err => {
            console.log(err)
            this.hiddenGuestBtnLoading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getEmployeesList() {
      let obj = {
        per_page: 1000,
        page: 1
      }
      findEmployees(obj).then(res => {
        let data = res.data.filter(currentValue => {
          return currentValue.status === 1 || currentValue.status === 3
        })
        for (let val of data) {
          let name = ''
          if (val.status === 3) {
            name = val.name + '（已禁用）'
          } else {
            name = val.name
          }
          this.sellList.push({ id: val.id, name: name, status: val.status })
        }
        this.selectoptions = []
        let datas = res.data.filter(currentValue => {
          return currentValue.status === 1
        })
        this.selectoptions.push({ value: 2, label: '待分配', status: 0 })
        for (let val of datas) {
          this.selectoptions.push({ value: val.id, label: val.name, status: val.status })
        }
      }).catch(err => {
        console.log(err)
      })
    },
    checklistBtn() {
      this.checklistDialogVisible = true
      this.$refs.checkListDoc.getList()
    },
    // 一键清场
    clearSignAll() {
      this.$refs.clearSignDoc.dialogShow()
    },
    pageInit() {
      this.paginationShow = false
      this.$nextTick(() => {
        this.paginationShow = true
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
.qr {
  background-size: cover;
  width: 40px;
  border-radius: 5px 0 0 5px;
  top: -1px;
  position: absolute;
  left: 0;
  height: 36px;
  background: url("../../assets/icon/qr.png") no-repeat center;
}
.topSignBox {
  border: 1px solid #cccccc;
  border-bottom: none;
  height: 60px;
  line-height: 58px;
  .lef {
    float: left;
    margin-left:20px;
    .text {
      color: #333;
      font-weight: 700;
    }
    .textL {
      margin-left: 50px;
    }
    .num {
      font-size: 24px;
      vertical-align: middle;
    }
  }
  .rig {
    float: right;
    vertical-align: middle;
    margin-right: 20px;
    .checkRecord {
      background: #e7e7f0;
      border: 1px solid #e7e7f0;
      color: #8ea6b7;
      .qingchang {
        display: inline-block;
        vertical-align: middle;
        width: 14px;
        height: 14px;
        background: url('../../assets/icon/qingchang.png') no-repeat center;
        background-size: 13px 14px;
      }
    }
  }
}
.delay {
  display: inline-block;
  width: 18px;
  height: 18px;
  background: rgb(244,75,37);
  border: 1px solid #ddd;
  margin: -2px 5px 0 30px;
  vertical-align: middle;
}
.delay_word {
  color: #666;
  font-weight: normal;
}
.dialog-footer {
  .black {
    background: #000;
    border: 1px solid #000;
  }
  .gray {
    background: #ccc;
    border: 1px solid #ccc;
  }
}
.red {
  color: #f56c6c;
}
.green {
  color: #1AB394;
}
.cabnit-dialog-footer {
  text-align:center;
  .black {
    background: #000;
    border: 1px solid #000;
  }
  .gray {
    background: #ccc;
    border: 1px solid #ccc;
  }
}
.tags-styl {
  border: 1px solid #1AB394;
  background-color: #EAF7F5;
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
.zusubmit {
  background: #1AB394;
  width: 160px;
  font-size: 18px;
}
.ss {
  border-bottom: 1px solid #ebeef5;
  line-height: 36px;
}
.ss:last-child {
  border-bottom: none;
}
.color3 {
  font-weight: 700;
  color: #333333;
}
.circle {
  width: 23px;
  height: 23px;
  border-radius: 50%;
  font-style: normal;
  font-size: 12px;
  display: inline-block;
  line-height: 23px;
  margin-right: 5px;
}
.dao {
  background-color: #1AB394;
  color: #fff;
}
.tui {
  background-color: #E7EAEC;
  color: #999999;
}
.openclassbox {
  margin-top: 17px;
  overflow: auto; 
  &::-webkit-scrollbar-track-piece {
    background: #eeeeee;
  }
  &::-webkit-scrollbar{
      width: 6px;
      height: 6px;
      background-color: #f5f5f5;
  }
  &::-webkit-scrollbar-thumb {
    background: #1AB394;
    border-radius: 5px;
  }
  td {
    position: relative;
    .openclasitembox {
      width: 220px;
      height: 70px;
      box-sizing: border-box;
      background: #E7EAEC;
      border: 1px solid #CCCCCC;
      border-radius: 3px;
      margin-bottom: 17px;
      margin-right: 12px;
      .time, .font {
        margin-left: 12px;
      }
      .time {
        font-size: 20px;
        color: #1AB394;
        margin-top: 10px;
      }
      .font {
        margin-top: 9px;
        font-size: 14px;
        color: #333333;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}
.sendbox {
  margin-top: 5px;
  ul{
    margin: 0;
    padding: 0;
    li{
      list-style: none;
      width: 80px;
      height: 40px;
      text-align: center;
      background-color: #E7EAEC;
      border: 1px solid #CCCCCC;
      border-radius: 3px;
      float: left;
      line-height: 40px;
      box-sizing: border-box;
      font-size: 20px;
      color: #333333;
      margin-right: 12px;
      margin-top: 12px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      cursor: pointer;
    }
    .delayLi {
      background: rgb(244,75,37);
      color: #fff;
    }
  }
}
.staffAdd{
  background: rgb(51, 51, 51);
  margin-left: 20px;
  color: #fff;
}
.topbox {
  padding: 17px;
  border: 1px solid #cccccc;
  position: relative;
  .toprbox {
    position: absolute;
    right: 0;
    top: 0;
    height: 70px;
    text-align: center;
    margin-right: 1%;
    .lef, .rig{
      float: left;
    }
    .lef{
      margin-right: 10px;
      .num {
        color: #1AB394;
      }
    }
    .rig{
      .num {
        color: #EE6B54;
      }
    }
    .num{
      height: 46px;
      line-height: 50px;
      font-size: 36px;
    }
    .text{
      height: 20px;
      line-height: 20px;
      font-size: 14px;
      color: #999999;
    }
  }
}
.pointred {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background-color: #F14C30;
  display: inline-block;
  position: relative;
  top: -3px;
  right: 5px;
}
.w100 {
  width: 100%;
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
          color: #ccc;
          .vip-name {
            font-size: 16px;
          }
        }
      }
    }
  }
}
.check-table{
  margin-top: 0px;
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
@media screen and (max-width:1310px){
  .twoline {
    width: 100%;
    float: left;
    margin-top: 10px;
    button:first-child {
      margin-left: 0;
    }
  }
}
</style>
