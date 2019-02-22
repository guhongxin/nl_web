<template>
   <el-dialog
      title="会员卡详情"
      :visible.sync="dialogVisible"
      :width="widthSize"
      class="vipCardDetailsDialog customizeDetailsDialog"
      :beforeClose='dialogClosed'
    >
      <div class="dialog-body">
        <div class="vipCardDetails-frist">
          <vip-card-style :vipCardData="vipCardData" :isSecondCard="isSecondCard"></vip-card-style>
          <div class="vipCard-infor">
            <el-row :gutter="5" style="margin-bottom: 20px;">
              <el-col :span="12">
                <label>办理时间:
                  <span  style="width: 100px;overflow: hidden;
                    white-space: nowrap;text-overflow: ellipsis;display: inline-block;vertical-align: middle;">
                    {{common.customFormat(vipCardDetailsData.bought_at,'yyyy-MM-dd')}}
                  </span>
                </label>
              </el-col>
              <el-col :span="12"><label>当前状态:<span style="">{{vipCardDetailsData.status?'锁定' : '未锁定'}}</span></label></el-col>
            </el-row>
            <el-row :gutter="5" style="margin-bottom: 20px;">
              <el-col :span="12">
                <label>开卡时间:
                  <span>{{common.customFormat(vipCardDetailsData.start_date,'yyyy-MM-dd')}}</span>
                </label>
              </el-col>
              <el-col :span="12">
                <label>失效时间:
                  <!-- <span v-if="isSecondCard">{{common.customFormat(vipCardDetailsData.over_date,'yyyy-MM-dd')}}</span>
                  <span v-else>{{common.customFormat(vipCardDetailsData.end_date,'yyyy-MM-dd')}}</span> -->
                  <span>{{common.customFormat(vipCardDetailsData.end_date,'yyyy-MM-dd')}}</span>
                </label>
              </el-col>
            </el-row>
            <el-row :gutter="5" style="margin-bottom: 20px;">
              <el-col :span="12"><label>实付金额:<span>{{vipCardDetailsData.real_pay}}</span></label></el-col>
              <el-col :span="12">
                <label>销售员工:<span>{{vipCardDetailsData.order?vipCardDetailsData.order.sell_name:'-'}}</span></label>
               
              </el-col>
            </el-row>
            <el-row :gutter="5" style="margin-bottom: 20px;">
              <el-col :span="12"><label>支付方式:<span>{{getpayment_methodDictionary(vipCardDetailsData.order_detail)}}</span></label></el-col>
              <el-col :span="12">
                <label  v-if="isSecondCard===2">赠次:<span>{{vipCardDetailsData.give_day?vipCardDetailsData.give_day:0}}（次）</span></label>
                <label  v-else-if="isSecondCard===1">赠时:<span>{{vipCardDetailsData.give_day?vipCardDetailsData.give_day:0}}（天）</span></label>
                <label  v-else-if="isSecondCard===3">赠送金额:<span>{{vipCardDetailsData.give_day?vipCardDetailsData.give_day:0}}（元）</span></label>
              </el-col>
            </el-row>
            <el-row :gutter="5" style="margin-bottom: 20px;">
              <!-- <el-col :span="12"><label>磁卡ID:<span>{{vipCardDetailsData.magcard_id}}</span></label></el-col> -->
              <el-col :span="12"><label>办理员工:<span>{{vipCardDetailsData.employee?vipCardDetailsData.employee.name:'超级管理员'}}</span></label></el-col>
              <el-col :span="12" v-if="vipCardDetailsData.gyms&&vipCardDetailsData.master_id">
                <label>可使用分店:</label>
                <span v-if="vipCardDetailsData.gyms&&vipCardDetailsData.gyms.length<1">{{vipCardDetailsData.gyms[0]?vipCardDetailsData.gyms[0].name:''}}</span>
                <el-dropdown trigger="click" class="available-gym" v-else>
                  <span class="el-dropdown-link">
                    {{vipCardDetailsData.gyms?vipCardDetailsData.gyms[0]?vipCardDetailsData.gyms[0].name:'':''}}<i class="el-icon-caret-bottom el-icon--right"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item  v-for="(item, key) in vipCardDetailsData.gyms" :key="key">
                      <span>{{item.name}}</span>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </el-col>
            </el-row>
          </div>
        </div>
        <div class="vipCardDetails-two">
          <el-tabs type="border-card" @tab-click="borderCardBtn" class="untabmycalss">
            <el-tab-pane label="卡主信息" >
              <el-row :gutter="10">
                <el-col :span="6">
                  <div class="cardMasterImage">
                    <img :src="vipCardDetailsData.customer?vipCardDetailsData.customer.head_portrait?vipCardDetailsData.customer.head_portrait:defaulthead:defaulthead" style="width:100%;height:100%">
                  </div>
                </el-col>
                <el-col :span="18">
                  <div class="cardMasterInfor">
                    <el-row :gutter="10">
                      <el-col>
                        <h3 style="line-height: 0px;font-size: 24px;">{{vipCardDetailsData.customer?vipCardDetailsData.customer.name:''}}  &nbsp;&nbsp;&nbsp;&nbsp;性别:<span>{{vipCardDetailsData.customer?getSexzh(vipCardDetailsData.customer.sex):''}}</span></h3>
                      </el-col>
                    </el-row>
                    <el-row :gutter="30" style="margin-top:5px">
                      <el-col :span="24">
                        手机:<span style="margin-left:5px;">{{vipCardDetailsData.customer?vipCardDetailsData.phone:''}}</span>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="24">
                        身份证:<span style="margin-left:5px;">{{vipCardDetailsData.customer?vipCardDetailsData.customer.id_card_no:''}}</span>
                     </el-col>
                   </el-row>
                    <el-row>
                      <el-col :span="24">
                        生日:<span style="margin-left:5px;">{{vipCardDetailsData.customer?vipCardDetailsData.customer.birthday:''}}</span>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="24">
                        备注:<span class="remark-box"><span style="margin-left:5px;">{{vipCardDetailsData.customer?vipCardDetailsData.customer.remark:''}}</span></span>
                      </el-col>
                    </el-row>
                  </div>
                </el-col>
              </el-row>
              <div class="vipCardDetails-three">
                <el-row :gutter="5">
                  <el-col :span="5"><label>来源渠道:<span>{{vipCardDetailsData.customer?getChannel(vipCardDetailsData.customer.channel):''}}</span></label></el-col>
                  <el-col :span="5"> <label>健身目的:<span>{{vipCardDetailsData.customer?getPurpose(vipCardDetailsData.customer.purpose):''}}</span></label></el-col>
                  <el-col :span="4"><label>意向程度:<span>{{vipCardDetailsData.customer?getIntentlevel(vipCardDetailsData.customer.intent_level):''}}</span></label></el-col>
                  <el-col :span="6"><label>添加时间:<span style="font-size: 12px;">{{vipCardDetailsData.customer?gettimeFormat2(vipCardDetailsData.customer.created_at):''}}</span></label></el-col>
                  <el-col :span="4"><label>添加人:<span>{{vipCardDetailsData.customer?vipCardDetailsData.customer.employee_name:''}}</span></label></el-col>
                </el-row>
                <el-row :gutter="5">
                  <el-col :span="5"><label>所属会籍:<span>{{vipCardDetailsData.customer?vipCardDetailsData.customer.consultant?vipCardDetailsData.customer.consultant.name:'未分配':'未分配'}}</span></label></el-col>
                  <el-col :span="5"><label>所属教练:<span>{{vipCardDetailsData.customer?vipCardDetailsData.customer.coach?vipCardDetailsData.customer.coach.name:'未分配':'未分配'}}</span></label></el-col>
                  <el-col :span="4"><label>签到次数:<span>{{vipCardDetailsData.customer?vipCardDetailsData.customer.sign_count:''}}</span></label></el-col>
                  <el-col :span="6"> <label>最后跟进:<span style="font-size: 12px;">{{vipCardDetailsData.followUpTime}}</span></label></el-col>
                  <el-col :span="4"><label>跟进人:<span>{{vipCardDetailsData.followUpName}}</span></label></el-col>
                </el-row>
              </div>
            </el-tab-pane>
            <el-tab-pane label="成员列表">
              <el-table
                :data="tabData"
                border
                stripe
                style="width: 100%"
                class="check-table"
                v-loading="tabloading">
                <el-table-column
                  label="类型"
                  align="center"
                >
                  <template slot-scope="scope">
                    <span style="margin-left: 10px">{{scope.row.is_owner?'卡主':'成员'}}</span>
                  </template>
                </el-table-column>
                <el-table-column width="110px" align="center" :label="'头像'" style="display:flex;justify-content: center;padding-left:0px;padding-right:0px;">
                  <template slot-scope="scope">
                    <span style="display: inline-block;">
                      <img @click="common.bigImg($event)" :src="scope.row.head_portrait?scope.row.head_portrait:defaulthead" alt="icon" width="30" height="30" style="display: list-item;border-radius:50%;">
                    </span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop=""
                  label="姓名"
                  align="center"
                  width="160"
                >
                   <template slot-scope="scope">
                    <span style="margin-left: 10px">{{scope.row.name}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="性别"
                  align="center"
                  width="120"
                >
                  <template slot-scope="scope">
                    <span style="margin-left: 10px">{{getSexzh(scope.row.sex)}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop=""
                  label="手机号码"
                  width="160"
                  align="center">
                  <template slot-scope="scope">
                    <span style="margin-left: 10px">{{scope.row.phone}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="生日"
                  align="center" width="160">
                  <template slot-scope="scope">
                    <span style="margin-left: 10px">{{scope.row.birthday}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop=""
                  label="证件"
                  align="center"
                  width="160">
                  <template slot-scope="scope">
                    <span>{{scope.row.id_card_no}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop=""
                  label="备注"
                  align="center"
                  width="200">
                  <template slot-scope="scope">
                    <span :title="scope.row.remark">{{scope.row.remark? common.substring(scope.row.remark, 16):'-'}}</span>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="签到记录" v-if="!(isSecondCard===3)" class="pd20">
              <el-table
                :data="tabData"
                border
                stripe
                style="width: 100%;"
                class="check-table"
                v-loading="tabloading">
                <el-table-column
                  label="日期"
                  align="center"
                  width="160"
                >
                  <template slot-scope="scope">
                    <span style="margin-left: 10px">{{scope.row.created_at.split(' ')[0]}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="场馆名称"
                  align="center"
                  width="160"
                >
                  <template slot-scope="scope">
                    <span style="margin-left: 10px">{{scope.row.gym?scope.row.gym.name:''}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop=""
                  label="签到时间"
                  align="center"
                  width="120"
                >
                  <template slot-scope="scope">
                    <span style="margin-left: 10px">{{scope.row.sign_in_at? scope.row.sign_in_at.split(' ')[1]: '-'}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop=""
                  label="签退时间"
                  align="center"
                  width="120"
                >
                   <template slot-scope="scope">
                    <span style="margin-left: 10px">{{scope.row.sign_out_at? scope.row.sign_out_at.split(' ')[1]: '-'}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="姓名"
                  align="center"
                  width="120"
                >
                  <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.customer?scope.row.customer.name:'-'}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop=""
                  label="性别"
                  width="120"
                  align="center">
                  <template slot-scope="scope">
                    <span style="margin-left: 10px">{{getSexzh(scope.row.customer?scope.row.customer.sex:'')}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="手机号码"
                  align="center" width="160">
                  <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.customer?scope.row.customer.phone:'' }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop=""
                  label="手牌借用"
                  width="120"
                  align="center">
                  <template slot-scope="scope">
                    <!-- <span style="margin-left: 10px">{{ getCabinetstatus(scope.row.cabinet_bracelet ? scope.row.cabinet_bracelet.state : 0) }}</span> -->
                    <span v-if="scope.row.cabinet_bracelet">
                      <span>{{scope.row.cabinet_bracelet.locker_grid.key}}</span><span style="color:red;margin-left:10px;">未归还</span>
                    </span>
                    <span v-else>未借用</span>
                  </template>
                </el-table-column>
                 <el-table-column
                  prop=""
                  label="代签人"
                  width="120"
                  align="center">
                   <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.employee ? scope.row.employee.name : '-' }}</span>
                  </template>
                </el-table-column>
              </el-table>
                <div class="block">
                  <el-pagination
                    v-if="paginationShow"
                    @current-change="CheckInRecordPageChange"
                    :page-size="page_size"
                    :current-page.sync="page"
                    layout="total, prev, pager, next"
                    :total="tabData_total">
                  </el-pagination>
                </div>
            </el-tab-pane>
            <el-tab-pane label="停卡记录"  class="pd20" v-if="isSecondCard===1">
              <el-table
                :data="tabData"
                border
                stripe
                style="width: 100%"
                class="check-table"
                v-loading="tabloading">
                <el-table-column
                  label="操作时间"
                  align="center"
                  width="160"
                >
                  <template  slot-scope="scope">
                    <span>{{scope.row.created_at}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop=""
                  label="操作人"
                  align="center"
                  width="160"
                >
                  <template  slot-scope="scope">
                    <span>{{scope.row.employee?scope.row.employee.name:'超级管理员'}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop=""
                  label="状态"
                  align="center"
                >
                  <template  slot-scope="scope">
                    <span v-if="scope.row.status == 0">待处理</span>
                    <span v-if="scope.row.status == 1">已处理</span>
                    <span v-if="scope.row.status == 2">已取消({{scope.row.is_refund == 0? '未退款' : '已退款'}})</span>
                    <span v-if="scope.row.status == 3">中断停卡({{scope.row.broke_at}})</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop=""
                  label="停卡开始时间"
                  align="center"
                  width="120"
                >
                  <template  slot-scope="scope">
                    <span>{{scope.row.start_date}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop=""
                  label="停卡天数"
                  align="center"
                  width="120"
                >
                  <template  slot-scope="scope">
                    <span>{{scope.row.delay_day}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop=""
                  label="停卡结束时间"
                  width="120"
                  align="center">
                  <template  slot-scope="scope">
                    <span>{{scope.row.end_date}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop=""
                  label="实际停卡时间"
                  width="120"
                  align="center">
                  <template  slot-scope="scope">
                    <span>{{scope.row.start_date}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop=""
                  label="实付金额"
                  width="120"
                  align="center">
                  <template  slot-scope="scope">
                    <span>{{scope.row.order?scope.row.order.real_total_fee:''}}</span>
                  </template>
                </el-table-column>
                 <el-table-column
                  prop=""
                  label="销售员工"
                  width="160"
                  align="center">
                  <template  slot-scope="scope">
                    <span>{{scope.row.order?(scope.row.order.sell?scope.row.order.sell.name:'-'):'-'}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="支付方式"
                  align="center"
                  width="120">
                  <template  slot-scope="scope">
                    <span>{{scope.row.order?getpayment_methodDictionary(scope.row.order.payment_method):'-'}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop=""
                  label="备注"
                  width="200"
                  align="center">
                  <template  slot-scope="scope">
                    <span>{{scope.row.remark}}</span>
                  </template>
                </el-table-column>
              </el-table>
              <div class="block">
                <el-pagination
                  v-if="paginationShow"
                  @current-change="stopCardRecordPageChange"
                  :current-page.sync="page"
                  :page-size="page_size"
                  layout="total, prev, pager, next"
                  :total="tabData_total">
                </el-pagination>
              </div>
            </el-tab-pane>
            <el-tab-pane label="扣次记录"  class="pd20" v-if="isSecondCard===2">
              <el-table
                :data="tabData"
                border
                stripe
                style="width: 100%"
                class="check-table"
                v-loading="tabloading">
                <el-table-column
                  label="操作时间"
                  align="center">
                  <template  slot-scope="scope">
                    <span>{{scope.row.created_at}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop=""
                  label="操作人"
                  align="center">
                  <template  slot-scope="scope">
                    <span>{{scope.row.employee?scope.row.employee.name:'-'}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop=""
                  label="扣除次数"
                  align="center">
                  <template  slot-scope="scope">
                    <span>{{scope.row.times}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop=""
                  label="备注"
                  align="center">
                  <template  slot-scope="scope">
                    <span>{{scope.row.remark}}</span>
                  </template>
                </el-table-column>
              </el-table>
              <div class="block">
                <el-pagination
                  v-if="paginationShow"
                  @current-change="deductCardRecordPageChange"
                  :current-page.sync="page"
                  :page-size="page_size"
                  layout="total, prev, pager, next"
                  :total="tabData_total">
                </el-pagination>
              </div>
            </el-tab-pane>
            <el-tab-pane label="转卡记录"  class="pd20">
              <el-table
                :data="tabData"
                border
                stripe
                style="width: 100%"
                class="check-table"
                v-loading="tabloading">
                <el-table-column
                  label="操作时间"
                  align="center"
                  width="160"
                >
                  <template  slot-scope="scope">
                    <span>{{scope.row.created_at}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="操作人"
                  align="center"
                  width="120"
                >
                  <template  slot-scope="scope">
                    <span>{{scope.row.employee?scope.row.employee.name:'管理员'}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="原卡主姓名"
                  align="center"
                  width="120"
                >
                  <template  slot-scope="scope">
                    <span>{{scope.row.customer?scope.row.customer.name:'-'}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="原卡主手机"
                  align="center"
                  width="150"
                >
                  <template  slot-scope="scope">
                    <span>{{scope.row.customer?scope.row.customer.phone: '-'}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="新卡主姓名"
                  align="center"
                  width="120">
                  <template  slot-scope="scope">
                    <span>{{scope.row.new_customer?scope.row.new_customer.name : '-'}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="新卡主手机"
                  align="center"
                  width="150">
                  <template  slot-scope="scope">
                    <span>{{scope.row.new_customer?scope.row.new_customer.phone : '-'}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="实付金额"
                  align="center"
                  width="120">
                  <template  slot-scope="scope">
                    <span>{{scope.row.order?scope.row.order.real_total_fee:''}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="销售员工"
                  align="center"
                  width="120">
                  <template  slot-scope="scope">
                    <span>{{scope.row.order?(scope.row.order.sell?scope.row.order.sell.name:'-'):'-'}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="支付方式"
                  align="center"
                  width="120">
                  <template  slot-scope="scope">
                    <span>{{scope.row.order?getpayment_methodDictionary(scope.row.order.payment_method):'-'}}</span>
                  </template>

                </el-table-column>
                <el-table-column
                  prop="remark"
                  label="备注"
                  width="120"
                  align="center">
                  <template  slot-scope="scope">
                    <span>{{scope.row.order?scope.row.order.remark:'-'}}</span>
                  </template>
                </el-table-column>
              </el-table>
              <div class="block">
                <el-pagination
                  v-if="paginationShow"
                  @current-change="transferCardPageChange"
                  :page-size="page_size"
                  :current-page.sync="page"
                  layout="total, prev, pager, next"
                  :total="tabData_total">
                </el-pagination>
              </div>
            </el-tab-pane>
            <el-tab-pane label="续卡记录"  class="pd20" v-if="isSecondCard!==3">
              <el-table
                :data="tabData"
                border
                stripe
                style="width: 100%"
                class="check-table"
                v-loading="tabloading">
                <el-table-column
                  label="操作时间"
                  align="center"
                  width="160">
                  <template  slot-scope="scope">
                    <span>{{scope.row.created_at}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop=""
                  label="操作人"
                  align="center"
                  width="160">
                  <template  slot-scope="scope">
                    <span>{{scope.row.order?scope.row.order.employee_name:'-'}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop=""
                  label="原失效时间"
                  align="center"
                  width="120">
                  <template  slot-scope="scope">
                    <span>{{scope.row.origin_end_date}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="" label="新失效时间" align="center" width="120">
                  <template  slot-scope="scope">
                    <span>{{scope.row.renew_end_date}}</span>
                  </template>
                </el-table-column>
                <!-- <el-table-column prop="" label="增加天数" align="center" width="120">
                  <template  slot-scope="scope">
                    <span></span>
                  </template>
                </el-table-column> -->
                <template v-if="isSecondCard===2">
                  <el-table-column prop="" label="原来次数" align="center" width="120">
                    <template  slot-scope="scope">
                      <span>{{scope.row.origin_total_times}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="" label="新次数" align="center" width="120">
                    <template  slot-scope="scope">
                      <span>{{scope.row.now_total_times}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="" label="增加次数" align="center" width="120">
                    <template  slot-scope="scope">
                      <span>{{scope.row.renew_times}}</span>
                    </template>
                  </el-table-column>
                </template>
                <el-table-column prop="" label="实付金额" align="center" width="120">
                  <template  slot-scope="scope">
                    <span>{{scope.row.order?scope.row.order.real_total_fee:''}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="" label="销售员工" align="center" width="120">
                  <template  slot-scope="scope">
                    <span>{{scope.row.order?scope.row.order.sell_name:'-'}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="" label="支付方式" align="center" width="120">
                  <template  slot-scope="scope">
                    <span>{{scope.row.order?getpayment_methodDictionary(scope.row.order.payment_method):'-'}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="" label="备注" width="200" align="center">
                  <template  slot-scope="scope">
                    <span>{{scope.row.remark}}</span>
                  </template>
                </el-table-column>
              </el-table>
              <div class="block">
                <el-pagination
                  v-if="paginationShow"
                  @current-change="renewalCardRecordPageChange"
                  :current-page.sync="page"
                  :page-size="page_size"
                  layout="total, prev, pager, next"
                  :total="tabData_total">
                </el-pagination>
              </div>
            </el-tab-pane>
            <el-tab-pane label="充值记录" v-if="isSecondCard===3">
              <el-table
                :data="tabData"
                border
                stripe
                style="width: 100%"
                class="check-table"
                v-loading="tabloading">
                <el-table-column
                  label="操作时间"
                  align="center"
                  width="160">
                  <template  slot-scope="scope">
                    <span>{{scope.row.created_at}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop=""
                  label="操作人"
                  align="center"
                  width="160">
                  <template  slot-scope="scope">
                    <span>{{scope.row.order?scope.row.order.employee_name:''}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop=""
                  label="充值金额"
                  align="center"
                  width="120">
                  <template  slot-scope="scope">
                    <span>{{scope.row.renew_amount}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop=""
                  label="实付金额"
                  align="center"
                  width="120">
                  <template  slot-scope="scope">
                    <span>{{scope.row.order?scope.row.order.real_total_fee:''}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop=""
                  label="原剩余金额"
                  align="center"
                  width="120">
                  <template  slot-scope="scope">
                    <span>{{scope.row.origin_balance}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop=""
                  label="新剩余金额"
                  align="center"
                  width="120">
                  <template  slot-scope="scope">
                    <span>{{scope.row.now_balance}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop=""
                  label="销售员工"
                  align="center"
                  width="160">
                  <template  slot-scope="scope">
                    <span>{{scope.row.order?scope.row.order.sell_name:'-'}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop=""
                  label="支付方式"
                  align="center"
                  width="120">
                  <template  slot-scope="scope">
                    <span>{{scope.row.order?getpayment_methodDictionary(scope.row.order.payment_method):'-'}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop=""
                  label="备注"
                  align="center"
                  width="200">
                  <template  slot-scope="scope">
                    <span>{{scope.row.remark}}</span>
                  </template>
                </el-table-column>
              </el-table>
              <div class="block">
                <el-pagination
                  v-if="paginationShow"
                  @current-change="renewalCardRecordPageChange"
                  :current-page.sync="page"
                  :page-size="page_size"
                  layout="total, prev, pager, next"
                  :total="tabData_total">
                </el-pagination>
              </div>
            </el-tab-pane>
            <el-tab-pane label="消费记录" v-if="isSecondCard===3">
              <el-table
                :data="tabData"
                border
                stripe
                style="width: 100%"
                class="check-table"
                v-loading="tabloading">
                <el-table-column
                  label="操作时间"
                  align="center"
                  width="160">
                  <template  slot-scope="scope">
                    <span>{{scope.row.created_at}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop=""
                  label="操作人"
                  align="center"
                  width="160">
                  <template  slot-scope="scope">
                    <span>{{scope.row.employee?scope.row.employee.name:'-'}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop=""
                  label="消费金额"
                  align="center"
                  width="120">
                  <template  slot-scope="scope">
                    <span>{{scope.row.expense_amount}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop=""
                  label="消费用途"
                  align="center"
                  width="120">
                  <template  slot-scope="scope">
                    <span>{{scope.row.expense_desc}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop=""
                  label="原剩余金额"
                  align="center"
                  width="120">
                  <template  slot-scope="scope">
                    <span>{{scope.row.balance}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop=""
                  label="新剩余金额"
                  align="center"
                  width="120">
                  <template  slot-scope="scope">
                    <span>{{scope.row.new_balance}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop=""
                  label="销售员工"
                  align="center"
                  width="160">
                  <template  slot-scope="scope">
                    <span>{{scope.row.seller?scope.row.seller.name:'-'}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop=""
                  label="备注"
                  align="center"
                  width="200">
                  <template  slot-scope="scope">
                    <span>{{scope.row.remark}}</span>
                  </template>
                </el-table-column>
              </el-table>
              <div class="block">
                <el-pagination
                  v-if="paginationShow"
                  @current-change="deducCardexpensePageChange"
                  :current-page.sync="page"
                  :page-size="page_size"
                  layout="total, prev, pager, next"
                  :total="tabData_total">
                </el-pagination>
              </div>
            </el-tab-pane>
            <el-tab-pane label="办卡备注">
              <div class="cardMsg">{{vipCardDetailsData.remark}}</div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </el-dialog>
</template>
<script>
import VipCardStyle from '@/components/vipCardStyle'
import { vipCardDetails, checkInRecord2, stopCardRecord, transferCardsRecord, renewalCardList, deducCardList,
  deducCardexpenseList } from '@/api/vipcardGl'
import { cardStatus, channelDictionary, payment_methodDictionary } from '@/utils/comm'
import { parseTime } from '@/utils/index'
import { cardMemberList } from '@/api/cardMember'
export default {
  name: 'VipCardDetailDialog',
  props: {
    dialogVisible: {
      type: Boolean,
      default: function() {
        return false
      }
    },
    widthSize: {
      type: String,
      default() {
        return '200px'
      }
    },
    isSecondCard: {
      type: Number,
      default() {
        return 1
      }
    }
  },
  data() {
    return {
      vipCardData: {},
      vipCardDetailsData: {
        customer: {
          name: ''
        },
        employee: {
          name: ''
        }
      },
      tabData: [], // 列表数据
      tabData_total: 0, // 总数
      tabloading: false,
      page: 1,
      page_size: 10,
      paginationShow: true
    }
  },
  methods: {
    CheckInRecordPageChange(value) {
      this.page = value
      this.getCheckInRecord()
    },
    stopCardRecordPageChange(value) {
      this.page = value
      this.getStopCardRecord()
    },
    transferCardPageChange(value) {
      this.page = value
      this.gettransferCardRecord()
    },
    borderCardBtn(params) {
      // 详情标签页切换
      let _tab = params.label
      this.defaultPageCompent()
      switch (_tab) {
        case '签到记录':
          this.getCheckInRecord()
          break
        case '停卡记录':
          this.getStopCardRecord()
          break
        case '转卡记录':
          this.gettransferCardRecord()
          break
        case '扣次记录':
          this.getdeductCardRecord()
          break
        case '续卡记录':
          this.getrenewalCardRecord()
          break
        case '成员列表':
          this.getcardMemberList()
          break
        case '充值记录':
          this.getrenewalCardRecord()
          break
        case '消费记录':
          this.getdeducCardexpenseList()
          break
      }
    },
    dialogClosed() {
      this.defaultPageCompent()
      this.$emit('dialogClosed')
    },
    getSexzh(sex) {
      let result = ''
      switch (sex) {
        case 1:
          result = '男'
          break
        case 2:
          result = '女'
          break
        default:
          result = '-'
      }
      return result
    },
    getVipDetail(id) {
      this.vipCardDetailsData = {}
      this.vipCardDetailsData.id = id
      vipCardDetails(id).then(res => {
        let _data = res.data
        let _vipCardDetailsData = {
          id: _data.id,
          channel: _data.customer ? _data.customer.channel : '',
          purpose: _data.customer ? _data.customer.purpose : '',
          intent_level: _data.customer ? _data.customer.intent_level : '',
          bought_at: _data.bought_at,
          start_date: _data.start_date,
          end_date: _data.end_date,
          over_date: _data.over_date,
          real_pay: _data.order ? _data.order.real_total_fee : '-',
          give_day: _data.give_day,
          magcard_id: _data.magcard_id,
          employee: _data.employee,
          employee_name: _data.customer ? _data.customer.employee_name : '',
          consultant_name: _data.consultant_name,
          coach: _data.coach,
          sign_count: _data.customer ? _data.customer.sign_count : '',
          head_portrait: _data.customer ? _data.customer.head_portrait : '',
          name: _data.customer ? _data.customer.name : '',
          sex: _data.customer ? _data.customer.sex : '',
          phone: _data.customer ? _data.customer.phone : '',
          customer: _data.customer,
          birthday: _data.customer ? _data.customer.birthday : '',
          remark: _data.remark,
          id_card_no: _data.customer ? _data.customer.id_card_no : '',
          customer_id: _data.customer_id,
          seller: _data.order ? _data.order.sell_name : '',
          status: _data.status,
          card_no: _data.card_no,
          cardRemark: _data.remark,
          has_date: _data.has_date,
          order_detail: _data.order ? _data.order.payment_method : '',
          master_id: _data.master_id,
          gyms: _data.gyms,
          order: _data.order
        }
        let _followUp = {}
        // 最后跟进人和跟进时间 如果最会籍跟进时大于教练跟进时间 选择会籍信息 否则选择教练跟进信息
        if (_data.customer) {
          if (new Date(_data.customer.consultant_last_followed_at) > new Date(_data.customer.coach_last_followed_at)) {
            _followUp = {
              followUpName: _data.customer.consultant ? _data.customer.consultant.name : '',
              followUpTime: _data.customer.consultant_last_followed_at
            }
          } else {
            _followUp = {
              followUpName: _data.customer.coach ? _data.customer.coach.name : '',
              followUpTime: _data.customer.coach_last_followed_at
            }
          }
        }
        this.vipCardDetailsData = Object.assign({}, _vipCardDetailsData, _followUp)
        this.vipCardData = {
          card_no: _data.card_no,
          status: _data.status,
          real_pay: _data.order ? _data.order.real_total_fee : '',
          type: _data.type,
          card_name: _data.card_name,
          card_image: _data.card_image,
          end_date: _data.end_date,
          master_id: _data.master_id,
          gym: _data.gym // 会员卡那个场馆办理的
        }
        if (this.isSecondCard === 2) {
          this.vipCardData.use_times = _data.use_times
          this.vipCardData.total_times = _data.total_times
        } else if (this.isSecondCard === 1) {
          this.vipCardData.has_date = _data.has_date
        } else if (this.isSecondCard === 3) {
          this.vipCardData.has_date = _data.balance
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 签到记录
    getCheckInRecord() {
      let obj = {
        page: this.page,
        per_page: this.page_size,
        // card_no: this.vipCardDetailsData.card_no
      }
      this.tabloading = true
      checkInRecord2(this.vipCardDetailsData.id, obj).then(res => {
        this.tabloading = false
        this.tabData = res.data
        this.tabData_total = Number(res.headers.pagination.split(',')[1])
      }).catch(err => {
        console.log(err)
        this.tabloading = false
      })
    },
    // 停卡记录
    getStopCardRecord() {
      let obj = {
        vip_id: this.vipCardDetailsData.id,
        page: this.page,
        per_page: this.page_size
      }
      this.tabloading = true
      stopCardRecord(obj).then(res => {
        this.tabloading = false
        this.tabData = res.data
        this.tabData_total = Number(res.headers.pagination.split(',')[1])
      }).catch(err => {
        console.log(err)
        this.tabloading = false
      })
    },
    // 转卡记录
    gettransferCardRecord() {
      let obj = {
        vip_id: this.vipCardDetailsData.id,
        page: this.page,
        per_page: this.page_size
      }
      this.tabloading = true
      transferCardsRecord(obj).then(res => {
        this.tabloading = false
        this.tabData = res.data
        this.tabData_total = Number(res.headers.pagination.split(',')[1])
      }).catch(err => {
        this.tabloading = false
        console.log(err)
      })
    },
    getCardStatus(param) {
      return cardStatus(param)
    },
    getChannel(param) {
      return channelDictionary(param)
    },
    getPurpose(param) {
      let result = ''
      switch (param) {
        case 0:
          result = '减脂'
          break
        case 1:
          result = '增肌'
          break
        case 2:
          result = '塑形'
          break
        default:
          result = '不明'
      }
      return result
    },
    getIntentlevel(param) {
      let result = ''
      switch (param) {
        case 1:
          result = '强烈'
          break
        case 2:
          result = '一般'
          break
        default:
          result = '不明'
      }
      return result
    },
    defaultPageCompent() {
      this.tabData_total = 0
      this.tabData = []
      this.page = 1
      this.tabloading = false
      this.pageInit()
    },
    getCabinetstatus(param) {
      let result = ''
      switch (param) {
        case 1:
          result = '借用'
          break
        case 2:
          result = '禁用'
          break
        default:
          result = '未借用'
      }
      return result
    },
    gettimeFormat2(param) {
      return parseTime(new Date(param), '{y}-{m}-{d} {h}:{i}:{s}')
    },
    getpayment_methodDictionary(param) {
      return payment_methodDictionary(param)
    },
    deductCardRecordPageChange(param) {
      // 切换扣次记录页码
      this.page = param
      this.getdeductCardRecord()
    },
    renewalCardRecordPageChange(param) {
      // 切换续卡记录页码
      this.page = param
      this.getrenewalCardRecord()
    },
    pageInit() {
      this.paginationShow = false
      this.$nextTick(() => {
        this.paginationShow = true
      })
    },
    getdeductCardRecord() {
      // 获取扣次记录
      let obj = {
        page: this.page,
        per_page: this.page_size
      }
      let vip_id = this.vipCardDetailsData.id
      this.tabloading = true
      deducCardList(vip_id, obj).then(res => {
        let data = res.data
        this.tabData_total = Number(res.headers.pagination.split(',')[1])
        this.tabData = data
        this.tabloading = false
      }).catch(err => {
        console.log(err)
        this.tabloading = false
      })
    },
    getrenewalCardRecord() {
      // 获取续卡记录
      let obj = {
        page: this.page,
        per_page: this.page_size
      }
      let vip_id = this.vipCardDetailsData.id
      this.tabloading = true
      renewalCardList(vip_id, obj).then(res => {
        let data = res.data
        this.tabData_total = Number(res.headers.pagination.split(',')[1])
        this.tabData = data
        this.tabloading = false
      }).catch(err => {
        console.log(err)
        this.tabloading = false
      })
    },
    getcardMemberList() {
      // 获取成员列表
      let obj = {
        page: this.page,
        per_page: this.page_size
      }
      let vip_id = this.vipCardDetailsData.id
      this.tabloading = true
      cardMemberList(vip_id, obj).then(res => {
        this.tabloading = false
        let data = res.data
        this.tabData = data
      }).catch(err => {
        console.log(err)
        this.tabloading = false
      })
    },
    getdeducCardexpenseList() {
      // 获取扣费记录
      let obj = {
        page: this.page,
        per_page: this.page_size
      }
      let vip_id = this.vipCardDetailsData.id
      this.tabloading = true
      deducCardexpenseList(vip_id, obj).then(res => {
        let data = res.data
        this.tabloading = false
        this.tabData_total = Number(res.headers.pagination.split(',')[1])
        this.tabData = data
      }).catch(err => {
        console.log(err)
        this.tabloading = false
      })
    },
    deducCardexpensePageChange(param) {
      // 切换扣费记录页码
      this.page = param
      this.getdeducCardexpenseList()
    }
  },
  components: {
    VipCardStyle
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.pd20 {
  padding-bottom: 20px;
}
.cardMsg {
  min-height: 50px;
}
.customizeDetailsDialog {
  /deep/ .el-dialog {
    border-radius: 5px;
  }
  /deep/ .el-dialog__header {
    border: 1px solid #cccccc;
    border-radius: 5px 5px 0px 0px;
  }
  /deep/ .el-dialog__body {
    padding: 10px 10px;
    border-radius: 0px 0px 5px 5px;
  }
}
.vipCardDetailsDialog {
  .el-dialog__body {
    .dialog-body {
      width: 95%;
      margin: 0px auto;
      .vipCardDetails-frist {
        display: flex;
        .vipCard-infor {
          flex: 1;
          padding-left: 20px;
          label {
            span {
              margin-left: 5px;
            }
          }
        }
      }
      .vipCardDetails-two {
        overflow: hidden;
        .cardMasterImage {
          vertical-align: top;
          display: inline-block;
          width: 226px;
          height: 226px;
          border: 1px solid #999999;
          border-radius: 10px;
          overflow: hidden;
        }
        .cardMasterInfor {
          margin-left: 20px;
          display: inline-block;
          p:first-child {
            font-weight: 600;
            font-size: 24px;
            color: #000000;
            label {
              margin-left: 40px;
            }
          }
        }
        .has-gutter tr th {
          background-color: #cccccc;
          font-size: 14px;
          font-weight: 600;
          color: #333333;
        }
        .block {
          margin-top: 10px;
          .el-pagination {
            float: right;
          }
        }
      }
      .vipCardDetails-three {
        overflow: hidden;
        margin-top: 15px;
        padding-top: 10px;
        border-top: 1px solid #f0f0f0;
        label{
          span{
            margin-left: 5px;
          }
        }
      }
    }
  }
}
.available-gym {
  font-weight: 700;
}
.remark-box{
  width:90%;
  display:inline-block;
  vertical-align: text-top;
  max-height: 60px;
  overflow: hidden;
  overflow-y: auto;
  margin-left: 10px;
}
.untabmycalss{
  overflow: hidden;
}
</style>
