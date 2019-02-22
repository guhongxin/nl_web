<template>
  <div class="app-container">
    <div class="find-box4">
      <div style="overflow:hidden" class="filter-container">
        <scan-input :select="searchSelect" :defaultSelect="searchSelect[0].value" @kedownOver="searchlist" :placeholder="placeholder"  ref="scanIputDoc"></scan-input>
        <el-button type="primary" class="add-button lf"  v-if="btnRoleList['3-2-1']" @click="clickToBuy"><i class="el-icon-plus"></i>添加购买</el-button>
        <bulk-action :select="bulkAction" :searchValue="bulkValue" @changeBulk="searchGroup"></bulk-action>
        <span class="Rrrefresh" @click="__init">
          <el-button icon="el-icon-refresh" circle></el-button>
        </span>
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
    <el-table @filter-change="filterChange" @sort-change="sortChange" stripe :key='tableKey' :data="tableList" v-loading="listLoading" element-loading-text="列表正在加载中" border fit highlight-current-row
      style="width: 100%;" @selection-change="selectionChange" class="check-table">
      <el-table-column align="center" type="selection" width="55px"></el-table-column>

      <el-table-column width="180px" align="center"
      label="购买时间<i onclick='openDate(event)' data=[1,'created_at_sdate','created_at_edate'] title='购买时间' class='el-icon-date'></i>"
      sortable='custom' prop="sort_created_at">
        <template slot-scope="scope">
          <span>{{scope.row.created_at}}</span>
        </template>
      </el-table-column>
      <el-table-column label="课程信息" align="center">
        <!-- 不要删注释的地方 -->
        <!-- <el-table-column align="center" :label="'课程类型'" width="120" prop="type">
          <template slot-scope="scope">
            <span>{{getCourseType(scope.row.course_data?scope.row.course_data.fit_type:'')}}</span>
          </template>
        </el-table-column> -->

        <el-table-column column-key="course_id" align="center" :label="'课程名称'" width="120" prop="course_id" 
        :filters="courseOptions" filter-placement="bottom-end" :filter-multiple="false">
          <template slot-scope="scope">
            <span>{{scope.row.course_name}}</span>
          </template>
        </el-table-column>
        
        <el-table-column column-key="coach_id" align="center" :label="'教练姓名'" width="120" prop="coach_id" 
        :filters="coachOptions" filter-placement="bottom-end" :filter-multiple="false">
          <template slot-scope="scope">
            <!-- <div v-for='(items, key) in getCoachName(scope.row.coach_name, scope.row.coach)' 
              :key='key'>
              <el-tooltip class="item" effect="dark" v-if="items.noModific" :content="`原教练名为: ${items.newCoachName}`" placement="bottom">
                <el-button type="danger" size="mini">{{items.oldCoachName}}</el-button>
              </el-tooltip> -->
              <span size="mini">{{scope.row.coach_name}}</span>
          </template>
        </el-table-column>
        
        <el-table-column width="150px" align="center" :label="'课程价格'" prop="price">
          <template slot-scope="scope">
            <span>{{scope.row.price}}</span>
          </template>
        </el-table-column>
        <el-table-column width="170px" align="center" :label="'课程次数（剩/总）'" sortable='custom' prop="sort_quantity">
          <template slot-scope="scope">
            <span>{{scope.row.quantity - scope.row.use}}/{{scope.row.quantity}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="center"
        label="失效时间<i onclick='openDate(event)' data=[5,'expired_at_sdate','expired_at_edate'] title='失效时间' class='el-icon-date'></i>"
        sortable='custom' prop="sort_expired_at">
          <template slot-scope="scope">
            <span>{{scope.row.expired_at?scope.row.expired_at.split(' ')[0]:''}}</span>
          </template>
        </el-table-column>
			</el-table-column>
      <el-table-column label="客户信息" align="center">
        <el-table-column align="center" :label="'姓名'" width="120" prop="">
          <template slot-scope="scope">
            <span v-if="scope.row.customer">
              <span>{{scope.row.customer?scope.row.customer.name:'-'}}</span>
            </span>
            <span v-else>{{scope.row.customer_name}}</span>
          </template>
        </el-table-column>
        <el-table-column width="110px" align="center" :label="'头像'" style="display:flex;justify-content: center;padding-left:0px;padding-right:0px;">
          <template slot-scope="scope">
            <span style="display: inline-block;">
              <img @click="common.bigImg($event)" :src="scope.row.customer?scope.row.customer.head_portrait?scope.row.customer.head_portrait:defaulthead:defaulthead" alt="icon" width="30" height="30" style="display: list-item;border-radius:50%;">
            </span>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="'性别'" width="120" column-key="sex"
        prop="sex" :filters="[{text: '男', value: '1', class: 'csex'}, {text: '女', value: '2', class: 'csex'}]" filter-placement="bottom-end" :filter-multiple="false">
          <template slot-scope="scope">
            <span v-if="scope.row.customer">{{scope.row.customer.sex === 1 ? '男' : '女'}}</span>
            <span v-if="scope.row.customer===null">-</span>
          </template>
        </el-table-column>
        
        <el-table-column width="130px" align="center" :label="'电话号码'" prop="scope.row.customer">
          <template slot-scope="scope">
            <span>{{scope.row.customer?scope.row.customer.phone:'-'}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column width="130px" align="center" :label="'是否注册'" prop="register">
          <template slot-scope="scope">
            <span v-if="scope.row.customer?scope.row.customer.is_register_app:''">已注册</span>
            <span v-else  style="color: #F14C30">未注册</span>
          </template>
        </el-table-column> -->
        <el-table-column width="150px" align="center" :label="'所属会籍'" prop="consultant_id" column-key="consultant_id"
        :filters="consultantOption" filter-placement="bottom-end" :filter-multiple="false">
          <template slot-scope="scope">
            <span>{{scope.row.customer?scope.row.customer.consultant?scope.row.customer.consultant.name:'-':'-'}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column width="130px" align="center" :label="'所属教练'" prop="register">
          <template slot-scope="scope">
            <span>{{scope.row.customer?scope.row.customer.coach?scope.row.customer.coach.name:'-':'-'}}</span>
          </template>
        </el-table-column> -->
      </el-table-column>
			
      <el-table-column label="销售信息" align="center">
        <el-table-column width="150px" align="center" :label="'应付金额'" prop="total_fee">
          <template slot-scope="scope">
            <span>{{scope.row.course_order?scope.row.course_order.total_fee:'-'}}</span>
          </template>
        </el-table-column>
        <el-table-column width="150px" align="center" :label="'实付金额'" prop="real_total_fee">
          <template slot-scope="scope">
            <span>{{scope.row.course_order?scope.row.course_order.real_total_fee:'-'}}</span>
          </template>
        </el-table-column>
        <el-table-column width="150px" align="center" :label="'销售员工'" prop="sell_id" column-key="sell_id"
        :filters="sell_employee" filter-placement="bottom-end" :filter-multiple="false">
          <template slot-scope="scope">
            <span>{{scope.row.course_order.sell?scope.row.course_order.sell.name:'-'}}</span>
          </template>
        </el-table-column>
        <el-table-column width="150px" align="center" :label="'支付方式'" column-key="payment_method" prop="payment_method" 
        :filters="payment_method" filter-placement="bottom-end" :filter-multiple="false">
          <template slot-scope="scope">
            <span v-if="scope.row.course_order&&scope.row.course_order.payment_method===1">现金</span>
            <span v-if="scope.row.course_order&&scope.row.course_order.payment_method===2">支付宝</span>
            <span v-if="scope.row.course_order&&scope.row.course_order.payment_method===3">微信</span>
            <span v-if="scope.row.course_order&&scope.row.course_order.payment_method===4">银行卡</span>
            <span v-if="scope.row.course_order&&scope.row.course_order.payment_method===5">储值卡</span>
          </template>
        </el-table-column>
        
        <el-table-column width="150px" align="center" :label="'备注'" prop="remark">
          <template slot-scope="scope">
            <span :title="scope.row.remark">{{scope.row.remark? common.substring(scope.row.remark, 16):'-'}}</span>
          </template>
        </el-table-column>
      </el-table-column>

      <el-table-column width="150px" align="center" :label="'添加人'" prop="operator_id" column-key="operator_id"
      :filters="oparetaOption" filter-placement="bottom-end" :filter-multiple="false">
        <template slot-scope="scope">
          <span>{{scope.row.operator_name}}</span>
        </template>
      </el-table-column>
      
      <el-table-column align="center" fixed="right" :label="$t('table.actions')" min-width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" plain size="mini" @click="handleEdit(scope.$index, scope.row)" v-if="btnRoleList['3-2-2']">{{$t('table.edit')}}</el-button>
          <el-button type="success" plain size="mini" @click="handlePrivateCence(scope.$index, scope.row)" v-if="btnRoleList['3-2-4']">消课</el-button>
          <el-button type="danger" plain size="mini" @click="handleDelete(scope.$index, scope.row)" v-if="btnRoleList['3-2-3']">删除</el-button>
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

    <!-- 步骤一 -->
    <!-- <buy-course-dialog 
      v-if="centerDialogVisible1"
      :dialogVisible='centerDialogVisible1'
      @dialogClosed='dialogClosedBuy'
      @buyCourseBtn='buyCourseSure'
      :widthSize="'1000px'">
    </buy-course-dialog> -->

    <el-dialog
      title="购买私教"
      :visible.sync="centerDialogVisible1"
      width="1000px"
      class="buy-dialog"
      :close-on-click-modal="false" @close="addclose1">
      <el-steps :active="1" finish-status="success" simple>
        <el-step title="选择购买课程 1" ></el-step>
        <el-step title="查找客户 2" ></el-step>
        <el-step title="确认客户信息 3" ></el-step>
      </el-steps>
      <div class="form-box">
        <el-form :model="buyForm" :rules="buyRules" status-icon ref="buyFormStep" class="form1 buy-form">
          <el-form-item label="课程名称：" prop="course_id">
            <el-select v-model="buyForm.course_id" placeholder="请选择课程" style="margin-left:0;" @change="getCoatch">
              <el-option :label="item.label" :value="item.value" :key="index" v-for="(item,index) in privateCourse"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="课程次数：" prop="quantity" class="quantity">
             <el-input-number width="300px" v-model="buyForm.quantity" :min="1" :max="99999999" label="请选择次数" @keyup.native="inputKeyUp"></el-input-number>
          </el-form-item>
          <el-form-item label="应付金额：" prop="should_pay" style="margin-left:12px;">
            <el-input v-model="should_pay" placeholder="应付金额" type="number" disabled="disabled"></el-input>
          </el-form-item>
          <el-form-item prop="sell_id" label="销售员工：" style="margin-left:12px;">
            <el-select v-model="buyForm.sell_id" placeholder="请选择销售员工">
              <el-option :label="item.label" :value="item.value" :key="item.value" :disabled="item.status === 3" v-for="item in staff"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="购买备注：" label-width="112px" prop="desc">
            <el-input type="type" v-model="buyForm.remark" placeholder="请输入购买备注" :maxlength="100"></el-input>
          </el-form-item>
        </el-form>

        <el-form :model="buyForm" :rules="buyRules" status-icon ref="buyFormStep1" class="form2 buy-form2">
          <el-form-item label="教练姓名：" prop="coach_id">
            <el-select v-model="buyForm.coach_id" placeholder="请选择教练" style="margin-left:0;" @change="getCoatchPrice">
              <el-option :label="item.label" :value="item.value" :key="index" v-for="(item,index) in coach"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="失效日期：" prop="expired_at">
            <el-date-picker :picker-options="lostTime" type="date" placeholder="选择日期" v-model="buyForm.expired_at"></el-date-picker>
          </el-form-item>
          <el-form-item label="实付金额：" prop="real_total_fee">
            <el-input v-model="buyForm.real_total_fee" placeholder="实付金额" type="number" :min="1" class="pay-money-box"></el-input>
          </el-form-item>
          <el-form-item label="支付方式：" prop="payment_method" style="margin-left:12px;">
            <el-select v-model="buyForm.payment_method" placeholder="请选择支付方式"  @change="paymethodChage">
              <el-option label="现金" value="1"></el-option>
              <el-option label="支付宝" value="2"></el-option>
              <el-option label="微信" value="3"></el-option>
              <el-option label="银行卡" value="4"></el-option>
              <el-option label="储值卡" value="5"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="iscardsPaymeth" label="储值卡号：" style="margin-left:12px;">
            <el-input placeholder="请输入储值卡号"
              v-model="petCardNo"
              :suffix-icon="cardInputIcon"
              @focus="cardInputFocus">
              <template slot="prepend"><i class="qr"></i></template>
              <el-button slot="append" icon="el-icon-search" @click="petCardNoInput"></el-button>
            </el-input>
          </el-form-item>
        </el-form>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="stepOne" :disabled="submitBug">下一步</el-button>
      </span>
    </el-dialog>

    <!-- 步骤二 -->
    <el-dialog
      title="购买私教"
      :visible.sync="centerDialogVisible2"
      width="1000px"
      class="buy-dialog"
      :close-on-click-modal="false">
      <el-steps :active="2" finish-status="success" simple>
        <el-step title="选择购买课程 1" ></el-step>
        <el-step title="查找客户 2" ></el-step>
        <el-step title="确认客户信息 3" ></el-step>
      </el-steps>
      <div class="otherSearcher">
        <div class="sm"></div>
        <el-input type="number" placeholder="请输入手机号码/扫描APP上个人条形码" v-model="buyForm.customerPhone" class="input-with-select" @keyup.enter.native="messageByPhone">
        <el-button slot="append" icon="el-icon-search" @click="messageByPhone"></el-button>
        </el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="toStepOne" class="gray">上一步</el-button>
        <!-- <el-button type="primary" class="black" @click="messageByPhone">下一步</el-button> -->
      </span>
    </el-dialog>

    <!-- 步骤三 -->
    <el-dialog
      title="购买私教"
      :visible.sync="centerDialogVisible3"
      width="1000px"
      class="buy-dialog"
      :close-on-click-modal="false" @close="addclose">
      <el-steps :active="3" finish-status="success" simple>
        <el-step title="选择购买课程 1" ></el-step>
        <el-step title="查找客户 2" ></el-step>
        <el-step title="确认客户信息 3" ></el-step>
      </el-steps>
      <div class="form-box formStep3">
        <el-form :model="buyForm" :rules="buyRules" status-icon ref="buyForm" class=" buy-form">
          <el-form-item label="手机号码：" style="margin-left:12px;">
            <el-input v-model="buyForm.customerPhone" placeholder="请输入手机号码" disabled></el-input>
          </el-form-item>
          <el-form-item v-if="disabled">
            <div class="tip" v-if="tipShow === true">提示：如果客户信息有误，点击此处<span class="use-span" @click="editMessage">启用修改</span></div>
            <div class="tip" v-if="tipShow === false">提示：手动修改信息购买成功后，会在系统中自动录入该客户信息 &nbsp;&nbsp;&nbsp;
              <!-- <a href="javascript:;" style="color:#1878E1" @click="addCustomer" v-if="buyCustomerId === false">保存</a> -->
              <a href="javascript:;" style="color:#1878E1" @click="editPersonMsg" v-if="buyCustomerId === true">修改</a>   
              <a href="javascript:;" style="color:#1878E1" @click="cansle">取消</a></div>
          </el-form-item>
          <span class="notice" v-if="disabled">(已注册，已录入，未锁定)</span>
          <span class="notice" v-if="!disabled">(已注册，<span style="color:red;">未录入</span>，未锁定)</span>
          <el-form-item label="客户姓名：" prop="customerName">
            <el-input v-model="buyForm.customerName" placeholder="请输入客户姓名" :disabled="hasCustomer" :maxlength="20"></el-input>
          </el-form-item>
          <el-form-item label="客户性别：" prop="customerSex">
            <el-select v-model="buyForm.customerSex" placeholder="请选择性别" style="margin-left:0;" :disabled="hasCustomer">
              <el-option label="男" :value="1" :key="1"></el-option>
              <el-option label="女" :value="2" :key="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属会籍：" style="margin-left:12px;">
            <el-select filterable v-model="buyForm.consultant_id" placeholder="请选择销售员工" style="margin-left:0;" :disabled="hasCustomer">
              <el-option :label="item.label" :value="item.value" :key="item.value" :disabled="item.status === 3" v-for="item in staffHj"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="toStepTwo" class="gray">上一步</el-button>
        <el-button type="primary" :loading="loading" @click="buyCourse" :disabled="btnDesabled">确认购买</el-button>
      </span>
    </el-dialog>

    <!-- 编辑 -->
    <el-dialog
      title="编辑私教购买信息"
      :visible.sync="centerDialogVisible4"
      width="500px"
      class="buy-dialog"
      :close-on-click-modal="true" @close="editclose">
      <div class="form-box formStep3">
        <el-form :model="editForm" status-icon class=" buy-form">
          <el-form-item label="课程名称：">
            <el-select v-model="editForm.course_id" placeholder="请选择课程" style="margin-left:0;" @change="getEditCoach">
              <el-option :label="item.label" :value="item.value" :key="index" v-for="(item,index) in privateCourse" :disabled="item.disabled"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="教练姓名：">
            <el-select v-model="editForm.coach_id" placeholder="请选择教练" style="margin-left:0;">
              <el-option :label="item.label" :value="item.value" :key="index" v-for="(item,index) in coach"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="失效时间：">
            <el-date-picker type="date" placeholder="选择日期" value-format="yyyy-MM-dd HH:mm:ss" v-model="editForm.expired_at"></el-date-picker>
          </el-form-item>
          <el-form-item label=" 购买备注：">
            <el-input type="textarea" v-model="editForm.remark" placeholder="请输入购买备注" :maxlength="100"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
       <el-button type="primary" class="black" @click="editSure" :loading="loading">确定</el-button>
      </span>
    </el-dialog>

    <!-- 批量操作 -->
    <el-dialog
      title="提示"
      :visible.sync="centerDialogVisible5"
      width="490px"
      class="buy-dialog"
      :close-on-click-modal="false" style="margin-top: 28vh;">
      <div style="color:#000;text-align:center;font-size:18px;margin:20px 0;">确定要删除吗？</div>
      <span slot="footer" class="dialog-footer">
       <el-button type="primary" class="black" @click="remarkSure" :loading="loading">确定</el-button>
      </span>
    </el-dialog>

    <!-- 删除 -->
    <el-dialog
      title="提示"
      :visible.sync="centerDialogVisibleDelete"
      width="490px"
      class="buy-dialog"
      :close-on-click-modal="false" style="margin-top: 28vh;">
      <div style="color:#000;text-align:center;font-size:18px;margin:20px 0;">确定要删除选中的私教课购买信息？</div>
      <span slot="footer" class="dialog-footer">
       <el-button type="primary" class="black" @click="deleteSure" :loading="loading">确定</el-button>
      </span>
    </el-dialog>
    <privateCencel
    ref="privateCencel"
    @dialogClosed="closedprivateCencel"></privateCencel>
    <!-- 时间筛选 -->
    <dateRange @timeChange="timeChange"></dateRange>
  </div>
</template>

<script>
import { courseBuyList, privateCourseList, getAllCoatchBuy, getAllStaff, deletePrivateBuy, editPrivateBuy, remarkOporate, editBuyCustomer } from '@/api/course'
import { getCustomersByPhone, addCustomers } from '@/api/customer'
import { employeeList } from '@/api/employee'
import rectbox from '@/components/rectbox'
import scanInput from '@/components/scanInput'
import bulkAction from '@/components/bulkAction'
import { parseTime } from '@/utils/index'
import { creatnoticeDom } from '@/utils/comm'
import { testFloat2 } from '@/utils/validate'
import buyCourseDialog from './props/buyCourse'
import privateCencel from './props/privateCencel'
import { testphone } from '@/utils/validate'
import dateRange from '@/components/dateRange'
import { cardsNoList } from '@/api/vipcardGl'
export default {
  name: 'privateBuy',
  components: {
    rectbox,
    scanInput,
    bulkAction,
    buyCourseDialog,
    privateCencel,
    dateRange
  },
  data() {
    // 电话号码
    const validatePhone = (rule, value, callback) => {
      if (!testphone(value)) {
        callback(new Error('请输入正确的手机号码'))
      } else {
        callback()
      }
    }
    // 实付金额
    const validateMoney2 = (rule, value, callback) => {
      if (!testFloat2(value)) {
        callback(new Error('实付金额为正数，且只可保留两位小数'))
      } else if (Number(value) > 99999999) {
        callback(new Error('实付金额小于99999999'))
      } else if (Number(value) === 0) {
        callback(new Error('实付金额必须大于0'))
      } else {
        callback()
      }
    }
    // 时间
    const validateExpired = (rule, value, callback) => {
      if (!value) {
        callback(new Error('失效日期不能为空'))
      } else {
        callback()
      }
    }
    return {
      btnRoleList: {},
      payment_method: [
        { text: '现金', value: 1 + ',现金', class: 'cpayment_method' },
        { text: '支付宝', value: 2 + ',支付宝', class: 'cpayment_method' },
        { text: '微信', value: 3 + ',微信', class: 'cpayment_method' },
        { text: '银行卡', value: 4 + ',银行卡', class: 'cpayment_method' },
        { text: '储值卡', value: 5 + ',储值卡', class: 'cpayment_method' }
      ],
      // { text: response.data[i].name, value: response.data[i].id + ',' + response.data[i].name, class: 'ccourse_id' }
      courseList: [],
      deleteIndex: '',
      deleteId: '',
      centerDialogVisibleDelete: false,
      tags: [],
      sell_employee: [],
      consultantOption: [],
      oparetaOption: [],
      lostTime: {
        disabledDate(time) {
          return time.getTime() < Date.now()
        }
      },
      disabled: false,
      select: '',
      searchval: '',
      tableKey: 0,
      tableList: null,
      total: null,
      listLoading: true,
      showReviewer: false,
      searchGroupBtn: '',
      sexindex: 0,
      salesmanindex: 0,
      centerDialogVisible1: false,
      centerDialogVisible2: false,
      centerDialogVisible3: false,
      centerDialogVisible4: false,
      centerDialogVisible5: false,
      buyCustomerId: false,
      disable: 'disabled',
      tipShow: true,
      btnDesabled: false,
      hasCustomer: true,
      placeholder: '请扫码/输入要查询的内容',
      privateCourse: [], // 私教课程
      coach: [], // 教练
      staff: [{ // 员工
        'label': '待分配',
        'value': 2,
        'status': 0
      }],
      staffHj: [{ // 会籍
        'label': '待分配',
        'value': '',
        'status': 0
      }],
      loading: false,
      subStatus: '',
      index: 1,
      bulkAction: [{ // 批量操作
        label: '批量删除',
        value: 'delete',
        key: '3-2-5'
      }],
      groupOprate: { // 批量操作
        ids: []
      },
      should_payComput: '',
      bulkValue: '',
      listQuery: {
        page: 1,
        per_page: 10
      },
      courseQuery: {
        page: 1,
        per_page: 1000,
        saas_status: 2
      },
      coachQuery: {
        post: 1
      },
      consultantQuery: {
        post: 2,
        page: 1,
        per_page: 1000
      },
      employeeQuery: {
        page: 1,
        per_page: 1000
      },
      courseOptions: [],
      coachOptions: [],
      consultantOptions: [],
      employee_nameOptions: [],
      searchSelect: [{
        text: '手机号码',
        value: 'customer_phone'
      }, {
        text: '姓名',
        value: 'customer_name'
      }],
      boxlist: [{
        text: '全部',
        num: 1903,
        checked: true,
        bocolor: 'rgb(28, 132, 198)'
      }, {
        text: '待进行',
        num: 1896,
        checked: false,
        bocolor: 'rgb(81, 169, 202)'
      }, {
        text: '待评价',
        num: 9,
        checked: false,
        bocolor: 'rgb(26, 179, 148)'
      }, {
        text: '已完成',
        num: 20,
        checked: false,
        bocolor: 'rgb(248, 172, 89)'
      }, {
        text: '已取消',
        num: 18,
        checked: false,
        bocolor: 'rgb(241, 76, 48)'
      }],
      buyForm: {
        course_id: '',
        payment_method: '1',
        sell_id: 2,
        customerPhone: '',
        customerName: '',
        remark: '',
        customerId: '', // 会籍
        customerSex: '',
        real_total_fee: '', // 实付金额
        coach_id: '',
        expired_at: '', // 有效期
        consultant_id: '', // 会籍
        intent_level: '', // 意向等级
        quantity: '', // 课程次卡
        channel: '', // 来源渠道
        purpose: '' // 健身目的
      },
      editForm: { // 编辑字段
        id: '',
        course_id: '',
        coach_id: '',
        expired_at: '',
        remark: ''
      },
      // 表单验证规则
      buyRules: {
        course_id: [{ required: true, message: '请选择课程', trigger: 'change' }],
        // payment_method: [{ required: true, message: '请选择支付方式', trigger: 'change' }],
        coach_id: [{ required: true, message: '请选择教练', trigger: 'change' }],
        expired_at: [{ required: true, message: '不能为空', trigger: 'blur', validator: validateExpired }],
        real_total_fee: [{ required: true, trigger: 'blur', validator: validateMoney2 }],
        sex: [{ required: true, message: '请选择性别', trigger: 'change' }],
        phone: [{ required: true, trigger: 'blur', validator: validatePhone }],
        hj: [{ required: true, message: '请选择会籍', trigger: 'change' }],
        intent_level: [{ required: true, message: '请选择意向等级', trigger: 'change' }],
        channel: [{ required: true, message: '请选择来源渠道', trigger: 'change' }],
        purpose: [{ required: true, message: '请选择健身目的', trigger: 'change' }],
        quantity: [{ required: true, message: '请填写课程次数', trigger: 'change' }],
        customerName: [{ required: true, message: '请输入客户姓名', trigger: 'blur' }],
        customerSex: [{ required: true, message: '请选择性别', trigger: 'change' }]
      },
      paginationShow: true,
      specialValue: '',
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
    searchGroupValue: {
      get() {
        return '批量操作'
      },
      set(value) {
        this.searchGroupBtn = value
        console.log(value)
      }
    },
    should_pay() {
      let total = this.buyForm.quantity * this.should_payComput
      return total.toFixed(2)
    },
    cardInputIcon() {
      return this.hasCardsdNo ? this.cardsNoErr ? 'el-icon-error' : 'el-icon-success' : ''
    }
  },
  created() {
    this.__init()
  },
  mounted() {
  },
  methods: {
    handlePrivateCence(index, row) {
      this.$refs.privateCencel.initModel({ id: row.id, type: 'buy' })
    },
    __init() {
      this.common.eachBtnRole(this.btnRoleList) // 按钮权限方法
      this.getList()
      this.getStaff()
      this.courseNameList()
      this.coachNameList()
    },
    closedprivateCencel() {
      this.getList()
      this.pageInit()
    },
    getCourseType(type) {
      switch (type) {
        case 'Z': {
          return '增肌'
        }
        case 'J': {
          return '减脂'
        }
        case 'S': {
          return '塑型'
        }
        default:
          return ''
      }
    },
    myMoney(e) {
      let doc = e.target
      let _val = doc.value
      if (this.buyForm.real_total_fee < 0) {
        this.buyForm.real_total_fee = this.should_pay
      }
      creatnoticeDom(doc, !(Number(_val) > 99999999), '实付金额小于99999999')
    },
    sortChange(data) {
      this.common.sortFilter(this, data)
    },
    courseNameList() {
      this.privateCourse = []
      this.courseOptions = []
      privateCourseList(this.courseQuery).then(response => {
        for (let i = 0; i < response.data.length; i++) {
          // 过滤app销售的课程
          // if (response.data[i].app_status === 2) {
          this.courseOptions.push({ text: response.data[i].name, value: response.data[i].id + ',' + response.data[i].name, class: 'ccourse_id' })
          // 获得所有上架的私教课程
          this.privateCourse.push({
            'label': response.data[i].name,
            'value': response.data[i].id
          })
          this.courseList.push({
            'label': response.data[i].name,
            'value': response.data[i].id
          })
        }
      })
    },
    coachNameList() {
      employeeList(this.coachQuery).then(response => {
        for (let i = 0; i < response.data.length; i++) {
          this.coachOptions.push({ text: response.data[i].name, value: response.data[i].id + ',' + response.data[i].name, class: 'ccoach_id' })
        }
      })
      employeeList().then(response => {
        for (let i = 0; i < response.data.length; i++) {
          this.sell_employee.push({ text: response.data[i].name, value: response.data[i].id + ',' + response.data[i].name, class: 'csell_id' })
          this.consultantOption.push({ text: response.data[i].name, value: response.data[i].id + ',' + response.data[i].name, class: 'cconsultant_id' })
          this.oparetaOption.push({ text: response.data[i].name, value: response.data[i].id + ',' + response.data[i].name, class: 'coperator_id' })
        }
        this.oparetaOption.unshift({ text: '超级管理员', value: '3,超级管理员', class: 'coperator_id' })
      })
    },
    // consultantNameList() {
    //   employeeList(this.consultantQuery).then(response => {
    //     for (let i = 0; i < response.data.length; i++) {
    //       this.consultantOptions.push({ text: response.data[i].name, value: response.data[i].id, class: 'cconsultant_id' })
    //     }
    //   })
    // },
    // employeeNameList() {
    //   employeeList(this.employeeQuery).then(response => {
    //     for (let i = 0; i < response.data.length; i++) {
    //       this.employee_nameOptions.push({ text: response.data[i].name, value: response.data[i].id, class: 'cemployee_id' })
    //     }
    //   })
    // },
    // dateChange(val) {
    //   if (val.getTime() < new Date().getTime()) {
    //     this.common.message('warning', '失效日期不能是过去的时间')
    //   }
    // },
    tagclose(tag, index) {
      this.common.tagFilter(this, tag, index, this.searchSelect)
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
      if (key === 'course_id') {
        this.hostFilter(data, key, 3, '课程名称：' + font)
      }
      if (key === 'coach_id') {
        this.hostFilter(data, key, 4, '代课教练：' + font)
      }
      if (key === 'sex') {
        this.hostFilter(data, key, 2, this.listQuery[key] === '1' ? '性别：男' : this.listQuery[key] === '2' ? '性别：女' : '性别：未知')
      }
      if (key === 'payment_method') {
        this.hostFilter(data, key, 7, '支付方式：' + font)
      }
      if (key === 'sell_id') {
        this.hostFilter(data, key, 6, '销售员工：' + font)
      }
      if (key === 'consultant_id') {
        this.hostFilter(data, key, 8, '所属会籍：' + font)
      }
      if (key === 'operator_id') {
        this.hostFilter(data, key, 9, '操作人：' + font)
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
      courseBuyList(this.listQuery).then(response => {
        this.tableList = response.data
        this.total = Number(response.headers.pagination.split(',')[1])
        this.listLoading = false
      })
    },
    // 点击购买
    clickToBuy() {
      this.centerDialogVisible1 = true
      if (this.index !== 1) {
        this.addclose()
        this.buyForm.customerPhone = ''
      }
      this.index++
    },
    dialogClosedBuy() {
      this.centerDialogVisible1 = false
    },
    // 添加/编辑弹框关闭时清楚数据
    addclose() {
      // this.$refs.buyForm.resetFields()
    },
    addclose1() {
      this.$refs.buyFormStep.resetFields()
      this.$refs.buyFormStep1.resetFields()
      this.resetStoreCardParam()
      if (this.$refs.buyForm) {
        this.$refs.buyForm.resetFields()
      }
      this.buyForm.remark = ''
    },
    // 根据手机号码查询会员信息
    messageByPhone() {
      if (!this.buyForm.customerPhone) {
        this.common.message('warning', '手机号码不能为空')
        return false
      }
      if (!testphone(this.buyForm.customerPhone.trim())) {
        this.common.message('warning', '请输入正确的电话号码')
        return
      }
      getCustomersByPhone(this.buyForm.customerPhone).then(res => {
        let data = res.data
        if (Object.keys(data).length) {
          // [...this.form] = [data]
          this.hasCustomer = true
          this.disabled = true
          this.tipShow = true
          this.buyForm.customerName = data.name
          this.buyForm.customerSex = data.sex
          this.buyForm.consultant_id = data.consultant_id
          this.buyForm.customerId = data.id
          this.buyCustomerId = true
          if (!(this.staffHj.filter(item => item.value === this.buyForm.consultant_id).length)) {
            this.buyForm.consultant_id = ''
          }
          this.common.message('success', '已获得客户信息')
        } else {
          this.buyForm.customerName = ''
          this.buyForm.customerSex = ''
          this.buyForm.consultant_id = ''
          this.common.message('success', '暂无该客户信息，请手动录入信息')
          this.hasCustomer = false
          this.disabled = false
          this.tipShow = false
          this.buyForm.customerId = ''
          this.buyCustomerId = false
        }
        this.stepTwo()
      })
    },
    cansle() {
      this.hasCustomer = true
      this.tipShow = true
      this.btnDesabled = false // 能预约
    },
    addCustomer() {
      let userInfo = {
        phone: this.buyForm.customerPhone,
        name: this.buyForm.customerName,
        sex: this.buyForm.customerSex,
        consultant_id: this.buyForm.consultant_id
      }
      this.loading = true
      addCustomers(userInfo).then((res) => {
        this.hasCustomer = true
        this.tipShow = true
        this.disabled = true
        this.loading = false
        this.common.message('success', '客户信息录入成功')
        this.buyForm.customerId = res.data.id
      }).catch(() => {
        this.loading = false
      })
    },
    // 查询私教课程
    // getPrivateCourse() {
    //   privateCourseList(this.courseQuery).then(response => {
    //     for (let i = 0; i < response.data.length; i++) {
    //       this.privateCourse.push({
    //         'label': response.data[i].name,
    //         'value': response.data[i].id
    //       })
    //     }
    //   })
    // },
    // 查询所有教练,必须在选了课程之后才有
    getCoatch() {
      this.coach = []
      this.buyForm.coach_id = ''
      getAllCoatchBuy(this.buyForm.course_id).then(response => {
        if (response.data.length > 0) {
          for (let i = 0; i < response.data.length; i++) {
            if (response.data[i].coach) {
              this.coach.push({
                'label': response.data[i].coach.name,
                'value': response.data[i].id,
                'price': response.data[i].price
              })
            }
          }
        } else {
          this.common.message('warning', '该课程暂无教练')
        }
      })
    },
    // 查询价格
    getCoatchPrice() {
      for (let i = 0; i < this.coach.length; i++) {
        if (this.buyForm.coach_id === this.coach[i].value) {
          this.should_payComput = this.coach[i].price
        }
      }
    },
    // 查询所有销售员工
    getStaff() {
      getAllStaff().then(response => {
        for (let i = 0; i < response.data.length; i++) {
          if (response.data[i].status === 1) {
            this.staff.push({
              'label': response.data[i].name,
              'value': response.data[i].id,
              'status': response.data[i].status
            })
            this.staffHj.push({
              'label': response.data[i].name,
              'value': response.data[i].id,
              'status': response.data[i].status
            })
          }
        }
      })
    },
    // 点击修改会员信息
    editMessage() {
      this.hasCustomer = false
      this.disabled = true
      this.tipShow = false
      this.btnDesabled = true // 不能预约
    },
    // 修改会员信息
    editPersonMsg() {
      this.loading = true
      editBuyCustomer(this.buyForm).then((res) => {
        this.hasCustomer = true
        this.tipShow = true
        this.btnDesabled = false // 能预约
        this.loading = false
        this.common.message('success', '修改成功')
      }).catch(() => {
        this.loading = false
      })
    },
    // 购买私教
    buyCourseSure() {
      this.getList()
      this.centerDialogVisible1 = false
    },
    buyCourse() {
      if (!this.buyForm.customerId) {
        let userInfo = {
          phone: this.buyForm.customerPhone,
          name: this.buyForm.customerName,
          sex: this.buyForm.customerSex,
          consultant_id: this.buyForm.consultant_id
        }
        if (!userInfo.name) {
          this.common.message('warning', '客户姓名不能为空')
          return
        }
        if (!userInfo.sex) {
          this.common.message('warning', '客户性别不能为空')
          return
        }
        this.loading = true
        addCustomers(userInfo).then((res) => {
          this.buyForm.customerId = res.data.id
          this.buyCourseEmp()
        }).catch(() => {
          this.loading = false
        })
      } else {
        this.buyCourseEmp()
      }
    },
    buyCourseEmp() {
      const self = this
      this.$refs.buyForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('CourseBuy', this.buyForm).then(() => {
            this.common.message('success', '购买成功')
            this.getList()
            this.addclose1()
            this.centerDialogVisible3 = false
            this.centerDialogVisible1 = false
            self.loadingTimer = setTimeout(function() {
              self.loading = false
              clearTimeout(self.loadingTimer)
            }, 1000)
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 删除私教购买
    handleDelete(index, rows) {
      this.deleteIndex = index
      this.deleteId = rows.id
      this.centerDialogVisibleDelete = true
    },
    deleteSure() {
      this.loading = true
      deletePrivateBuy(this.deleteId).then(res => {
        this.tableList.splice(this.deleteIndex, 1)
        this.common.message('success', '删除成功')
        this.centerDialogVisibleDelete = false
        this.loading = false
      }).catch(() => {
        // this.common.message('error', '删除失败！')
        this.loading = false
      })
    },
    editclose() {
    },
    // 修改私教购买
    handleEdit(index, row) {
      let coachdata = {}
      let coursedata = {}
      this.subStatus = index
      this.privateCourse = this.courseList
      this.editForm.id = Object.assign({}, row).id
      this.editForm.course_id = Object.assign({}, row).course_id
      this.editForm.coach_id = Object.assign({}, row).coach_id
      this.editForm.remark = Object.assign({}, row).remark
      this.editForm.expired_at = parseTime(Object.assign({}, row).expired_at, '{y}-{m}-{d} {h}:{m}:{s}')
      // this.getEditCoach()
      getAllCoatchBuy(this.editForm.course_id).then(response => {
        this.coach = []
        for (let i = 0; i < response.data.length; i++) {
          if (response.data[i].coach) {
            this.coach.push({
              'label': response.data[i].coach.name,
              'value': response.data[i].coach.id
            })
          }
        }
      }).catch(() => {
      })
      // 如果该课程已经被删除
      // this.courseNameList()
      if (!(this.privateCourse.filter(item => item.value === this.editForm.course_id).length)) {
        coursedata = {
          'label': Object.assign({}, row).course_name,
          'value': Object.assign({}, row).course_id,
          'disabled': true
        }
        coachdata = {
          'label': Object.assign({}, row).coach_name,
          'value': Object.assign({}, row).coach_id,
          'disabled': true
        }
        this.privateCourse.push(coursedata)
        this.coach[0] = coachdata
      }
      this.centerDialogVisible4 = true
    },
    // 修改私教购买确定
    editSure() {
      let self = this
      if (!this.editForm.course_id) {
        this.common.message('warning', '私教课程不能为空')
        return
      }
      if (!this.editForm.coach_id) {
        this.common.message('warning', '教练不能为空')
        return
      }
      self.loading = true
      console.log(self.editForm)
      editPrivateBuy(self.editForm).then(response => {
        self.centerDialogVisible4 = false
        self.loading = false
        this.common.message('success', '编辑信息成功')
        this.getList()
        // let index = self.subStatus
        // 替换修改的那一行
        // let data = self.tableList[index]
        // data.course_name = response.data.course_name
        // data.coach_name = response.data.coach_name
        // data.course_id = response.data.course_id
        // data.coach_id = response.data.coach_id
        // self.$set(self.tableList, index, data)
      }).catch(() => {
        self.loading = false
      })
    },
    getEditCoach() {
      this.editForm.coach_id = ''
      this.coach = []
      getAllCoatchBuy(this.editForm.course_id).then(response => {
        for (let i = 0; i < response.data.length; i++) {
          if (response.data[i].coach) {
            this.coach.push({
              'label': response.data[i].coach.name,
              'value': response.data[i].coach.id
            })
          }
        }
      })
    },
    // 点击checkbox获得对应id
    selectionChange(selection) {
      this.groupOprate.ids = []
      for (let i = 0; i < selection.length; i++) {
        this.groupOprate.ids.push(selection[i].id)
      }
    },
    // 批量操作
    searchGroup(value) {
      if (!this.groupOprate.ids.length) {
        this.common.message('warning', '请先选择已购买私教')
        return
      }
      if (value === 'delete') {
        this.centerDialogVisible5 = true
      }
    },
    // 批量操作删除确定
    remarkSure() {
      remarkOporate(this.groupOprate).then(res => {
        this.centerDialogVisible5 = false
        this.common.message('success', '批量删除成功')
        this.getList()
      }).catch(() => {
        // this.common.message('error', '操作失败！')
      })
    },
    stepOne() {
      this.buyForm.debit_card_id = undefined
      if (!this.buyForm.course_id) {
        this.common.message('warning', '课程名称不能为空')
        return false
      }
      if (!this.buyForm.coach_id) {
        this.common.message('warning', '教练姓名不能为空')
        return false
      }
      if (!this.buyForm.quantity) {
        this.common.message('warning', '课程次数不能为空')
        return false
      }
      if (!this.buyForm.sell_id) {
        this.buyForm.sell_id = 2
        // this.common.message('warning', '销售员工姓名不能为空')
        // return false
      }
      if (!this.buyForm.expired_at) {
        this.common.message('warning', '失效日期不能为空')
        return false
      } else if (new Date() - new Date(this.buyForm.expired_at) > 0) {
        this.common.message('warning', '失效日期不能小于当前时间')
        return false
      }
      if (!this.buyForm.real_total_fee) {
        this.common.message('warning', '实付金额不能为空')
        return false
      } else if (!testFloat2(this.buyForm.real_total_fee)) {
        this.common.message('warning', '实付金额为正数，且只可保留两位小数')
        return false
      } else if (Number(this.buyForm.real_total_fee) > 99999999) {
        this.common.message('warning', '付金额小于99999999')
        return false
      } else if (Number(this.buyForm.real_total_fee) === 0) {
        this.common.message('warning', '付金额必须大于0')
        return false
      }
      if (!this.buyForm.payment_method) {
        this.common.message('warning', '支付方式不能为空')
        return false
      }
      let payMoneyBox = document.querySelector('.pay-money-box')
      if (payMoneyBox.lastChild.tagName === 'P') {
        this.common.message('warning', payMoneyBox.lastChild.innerHTML)
        return false
      }
      if (this.buyForm.payment_method === '5') {
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
      if (Number(this.buyForm.real_total_fee) > this.cardsNoList[0].balance) {
        this.common.message('error', '所选的储值卡剩余金额不足，请选择其它储值卡或更换支付方式')
        return false
      }
      this.buyForm.debit_card_id = this.cardsId
      this.beginAfter()
    },
    beginAfter() {
      // 开始向后端传递数据
      this.buyForm.expired_at = parseTime(this.buyForm.expired_at, '{y}-{m}-{d}')
      this.centerDialogVisible2 = true
    },
    toStepOne() {
      // 把时间改成控件需要的格式
      this.buyForm.expired_at = new Date(this.buyForm.expired_at)
      this.centerDialogVisible1 = true
      this.centerDialogVisible2 = false
    },
    stepTwo() {
      if (!this.buyForm.customerPhone) {
        this.common.message('warning', '手机号码不能为空')
        return false
      }
      this.centerDialogVisible3 = true
      this.centerDialogVisible2 = false
    },
    toStepTwo() {
      this.centerDialogVisible3 = false
      this.centerDialogVisible2 = true
    },
    searchlist(obj) {
      if (obj.value === '') {
        delete this.listQuery.column
        delete this.listQuery.value
        delete this.tags[0]
      } else {
        this.listQuery.column = obj.type
        this.listQuery.value = obj.value
        this.listQuery.page = 1
        let tagszh = {
          customer_phone: '手机号码',
          customer_name: '姓名'
        }
        this.tags[0] = { 'name': `${tagszh[ obj.type]}:${obj.value}`, 'type': obj.type }
      }
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
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    getCoachName(oldCoachName, coach) {
      // 获取代理教练人姓名
      let result = []
      let obj = {}
      if (!coach || oldCoachName === coach.name) {
        obj = {
          oldCoachName: oldCoachName,
          noModific: false
        }
      } else {
        obj = {
          oldCoachName: oldCoachName,
          newCoachName: coach.name,
          noModific: true

        }
      }
      result.push(obj)
      return result
    },
    pageInit() {
      this.paginationShow = false
      this.$nextTick(() => {
        this.paginationShow = true
      })
    },
    inputKeyUp(e) {
      e.target.value = e.target.value.replace(/\D|\./g, '')
    },
    timeChange(param) {
      this.common.chooseTimerFilter(param, this)
    },
    paymethodChage(param) {
      // 支付方式
      this.resetStoreCardParam()
      if (param === '5') {
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
    }
  },
  filters: {
  },
  destroyed() {
    clearTimeout(self.loadingTimer)
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg:#2d3a4b;
$light_gray:#eee;
.quantity /deep/ .el-input-number--medium {
  width: 199px;
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
.add-button {
  background: #333;
	color: #fff;
	margin-left: 20px;
  border: none;
  margin-top: 1px;
}
.lf{float: left;}
.qr{
  width: 36px;
  position: absolute;
  left: 0;
  top: -1px;
  height: 36px;
  background: url("../../../assets/icon/qr.png") no-repeat center;
  background-size: cover;
  border-radius: 5px 0 0 5px;
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
.formStep3 {
  .tip {
    color: #ccc;
    margin-left: 112px;
    .use-span {
      color: #1878E1;
      cursor: pointer;
    }
  }
  .notice {
    position: absolute;
    top: 200px;
    right: 110px;
    color: #1AB394;
  }
}
.form-box {
  margin-top: 50px;
  overflow: hidden;
  .form1 {
    margin-left: 30px;
  }
  .form1, .form2 {
    float: left;
    width: 48%;
    b {
      font-size: 18px;
      font-weight: normal;
    }
    
  }
  /deep/ .el-input-group__append {
    padding: 0px 17px
  }
  /deep/ .el-input-group__prepend {
    padding: 0px 17px
  }
}
.dialog-footer 
  .gray {
    background: #ccc;
    border: 1px solid #ccc;
  }
  .button {
    background: #000;
    border: 1px solid #000;
}
.otherSearcher {
  width: 700px;
  margin: 60px auto;
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
.otherSearcher .el-select .el-input {
  width: 550px;
  padding-left: 0px;
}
.form-box .el-input {
  color: #333;
}
</style>
