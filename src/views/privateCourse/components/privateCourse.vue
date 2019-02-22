<template>
  <div class="app-container" v-loading="loadingAll">
    <div class="title-box">
      <div class="lf list">私教课程列表</div>
      <div class="title-box-head">
        <div class="lf message">私教课程信息
        </div>
        <el-button type="primary" class="save" v-if="btnRoleList['3-1-2']&&(isEdit === false)"  @click="editCourse" >编辑</el-button>
        <el-button type="success" class="save" v-if="isEdit === true" @click="saveCourse" :loading="saveCourseloading">保存</el-button>
      </div>
    </div>
    <div class="tabs-box cliseer">
      <el-tabs :tab-position="tabPosition" type="card" @tab-click="handleClick" v-model="activeName">
        <el-tab-pane disabled>
          <div class="div-btn-box" slot="label">
            <el-button type="primary" class="button" v-if="btnRoleList['3-1-1']" @click="addCourse">添加</el-button>
            <el-button type="primary" class="button" v-if="btnRoleList['3-1-3']" @click="deleteCourse">删除</el-button>
            <el-button type="primary" class="button up"  v-if="btnRoleList['3-1-4']" @click="upToTab"><i class="el-icon-sort-up"></i></el-button>
            <el-button type="primary" class="button down"  v-if="btnRoleList['3-1-4']" @click="downToTab"><i class="el-icon-sort-down"></i></el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane label="课程名称" disabled>
          <div slot="label" class="firstTab">
            <span>课程名称</span>
            <span class="rf">APP销售</span>
          </div>
        </el-tab-pane>

        <el-tab-pane v-for="(item, index) in tabList" :key="index" :name="item.activeName" :disabled="isEdit">
          <div slot="label">
            <span class="spanTitle" :title="item.name">{{item.name}}</span>
            <el-switch v-model="item.sale" class="rf" style="margin-top:20px;" @change="appOnSale(item, index)" :disabled="isEdit || gymIsPass"></el-switch>
          </div>
          <el-row style="overflow:hidden;margin-top:30px;">
            <el-col :xl="8" :lg="12">
              <el-form class="privateCourse-form" :label-position="labelPosition" :model="formLabelAlign" :rules="rules">
                <el-form-item label="课程名称：" prop="name">
                  <div v-show="isDisabled">{{formLabelAlign.name}}</div>
                  <el-input v-model="formLabelAlign.name" placeholder="请填写课程名称" type="text" v-show="!isDisabled" :maxlength="16"></el-input>
                </el-form-item>
                <el-form-item label="课程类型：" prop="type">
                  <div v-for="item in options" :key="item.value" v-if="formLabelAlign.type===item.value" v-show="isDisabled">{{item.label}}</div>
                  <el-select v-model="formLabelAlign.type" placeholder="请选择课程类型" v-show="!isDisabled">
                    <el-option :label="item.label" :value="item.value" :key="index" v-for="(item,index) in options"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="课程时长：" prop="time">
                  <div v-show="isDisabled">{{formLabelAlign.time}}&nbsp;&nbsp;<span>分钟</span></div>
                  <el-select v-model="formLabelAlign.time" placeholder="请选择课程时长（min）" v-show="!isDisabled">
                    <el-option :label="item" :value="item" :key="index" v-for="(item,index) in timeSelect"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item prop="saas_status" label-width="10px">
                  <el-checkbox v-model="formLabelAlign.is_hot" :disabled="isDisabled"></el-checkbox><span class="checkbox">热门显示</span>
                </el-form-item>
              </el-form>
            </el-col>
            <el-col :xl="8" :lg="12">
            <div class="introduce">
              <!-- <b class="b">*</b> -->
              <b class="title">课程介绍：</b>
              <!-- <span v-show="isDisabled" class="divTextArea">{{formLabelAlign.introduce}}</span> -->
              <textarea v-show="isDisabled" class="divTextArea" v-model="formLabelAlign.introduce" disabled style="resize:none;"></textarea>
              <textarea style="resize:none;" placeholder="请输入课程介绍" 
                v-model="formLabelAlign.introduce" v-show="!isDisabled" 
                v-on:input="getLength"
                maxlength="180"></textarea>
              <span class="word-tip">{{tipLength}}/180</span>
            </div>
            </el-col>
            <el-col :xl="8" :lg="12" style="margin-bottom: 16px;padding-left:22px;">
            <div class="cover">
              <b class="b">*</b><b class="title">课程封面：</b>
              <div class="upImg">
                <el-select v-model="courseImg" placeholder="请选择课程封面" class="select-courseImg" v-show="!isDisabled" @change="selectCourse">
                  <el-option :label="item.label" :value="item.value" :key="item.value" v-for="item in selectOption"></el-option>
                </el-select>
                <div class="imgBox" v-show="!isDisabled&courseImgMb"><img :src="formLabelAlign.image" height="180" width="360"></div>
                <img :src="formLabelAlign.image" height="180" width="360" v-show="isDisabled">
                <moreImg :boxWidth="360" :boxHeight="180" :imgWidth="710" :imgHeight="284" @imgUrl="getimageUrl" ref="imageCourse" @clearimgurl="reomveimg" v-show="!isDisabled&!courseImgMb"></moreImg>
              </div>
            </div>
            </el-col>
          </el-row>

          <div class="table-box">
            <div class="title">私教带课教练</div>
            <div style="margin: 15px 0;overflow:hidden" class="filter-container">
              <scan-input :select="searchSelect" :defaultSelect="searchSelect[0].value" @kedownOver="searchlist" ref="scanIputDoc" placeholder="请扫码/输入要查询的内容"></scan-input>
              <el-button type="primary" class="add-button lf" @click="addCoach(item.name, item.id)" v-if="btnRoleList['3-1-5']"><i class="el-icon-plus"></i>添加教练</el-button>
              <bulk-action :select="bulkAction" :searchValue="bulkValue" @changeBulk="searchGroup"></bulk-action>
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
            <el-table @filter-change="filterChange" @sort-change="sortChange" stripe :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="列表正在加载中" border fit highlight-current-row
              style="width: 100%;" @selection-change="selectionChange" class="check-table">
              <el-table-column align="center" type="selection" width="55px"></el-table-column>

              <el-table-column align="center" :label="'姓名'" width="120" prop="scope.row.name">
                <template slot-scope="scope">
                  <span>{{scope.row.coach.name}}</span>
                </template>
              </el-table-column>

              <el-table-column width="90px" align="center" :label="'头像'">
                <template slot-scope="scope">
                  <span><img :src="scope.row.coach.head_portrait?scope.row.coach.head_portrait:defaulthead" @click="common.bigImg($event)" alt="icon" width="30" height="30" style="display: list-item;border-radius:50%;margin-left:18px;"></span>
                </template>
              </el-table-column>
              
              <el-table-column column-key="sex" align="center" :label="'性别'" width="150"
              prop="sex" :filters="[{text: '男', value: '1', class: 'csex'}, {text: '女', value: '2', class: 'csex'}]" filter-placement="bottom-end" :filter-multiple="false">
                <template slot-scope="scope">
                  <span>{{scope.row.coach.sex === 1 ? '男' : '女'}}</span>
                </template>
              </el-table-column>
              
              <el-table-column align="center" :label="'电话号码'" width="200">
                <template slot-scope="scope">
                  <span>{{scope.row.coach.phone}}</span>
                </template>
              </el-table-column>

              <!-- <el-table-column column-key="post" align="center" :label="'角色'" width="150" prop="scope.row.sex"
              :filters="[{text: '教练', value: '1', class: 'cpost'}, {text: '会籍', value: '2'}, {text: '前台', value: '4'}, {text: '财务', value: '8'}, {text: '店长', value: '16'}]"
              filter-placement="bottom-end" :filter-multiple="false">
                <template slot-scope="scope">
                  <span v-if="scope.row.post === 1">教练</span>
                  <span v-if="scope.row.post === 2">会籍</span>
                  <span v-if="scope.row.post === 4">前台</span>
                  <span v-if="scope.row.post === 8">财务</span>
                  <span v-if="scope.row.post === 16">店长</span>
                  <span v-if="scope.row.coach.role?scope.row.coach.role.name:''">{{scope.row.coach.role.name}}</span>
                </template>
              </el-table-column> -->
              
              <el-table-column align="center" :label="'角色'" width="150" prop="role_id">
              <!-- column-key="role_id" :filters="roleList" filter-placement="bottom-end" :filter-multiple="false"> -->
                <template slot-scope="scope">
                  <el-tooltip class="item" effect="dark" v-if="scope.row.coach.role.deleted_at" :content="`该角色已删除，删除时间: ${scope.row.coach.role.deleted_at}`" placement="bottom">
                    <el-button type="info" size="mini">{{scope.row.coach.role===null?'-':scope.row.coach.role.name}}</el-button>
                  </el-tooltip>
                  <span v-else>{{scope.row.coach.role===null?'-':scope.row.coach.role.name}}</span>
                </template>
              </el-table-column>

              <el-table-column width="150px" align="center" :label="'价格'" sortable='custom' prop="price_sort">
                <template slot-scope="scope">
                  <span v-text="scope.row.price"></span>
                </template>
              </el-table-column>
              
              <el-table-column width="450px" align="center" :label="'个人介绍'" prop="scope.row.timestamp">
                <template slot-scope="scope">
                  <span v-text="scope.row.coach.introduce === null ? '-' : scope.row.coach.introduce"></span>
                </template>
              </el-table-column>
              
              <el-table-column align="center" fixed="right" :label="$t('table.actions')" min-width="230" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                  <el-button  plain size="mini" v-if="btnRoleList['3-1-9']" @click="handleBuy(scope.row)" class="btn1-style">购买</el-button>
                  <el-button plain size="mini" v-if="btnRoleList['3-1-7']" @click="handleEdit(scope.$index, scope.row)" class="btn2-style">{{$t('table.edit')}}</el-button>
                  <el-button type="info" plain size="mini" v-if="btnRoleList['3-1-8']" @click="handleDelete(scope.$index, list)">删除</el-button>
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
          </div>  
        </el-tab-pane>
        <el-tab-pane disabled>
          <div style="color:red;margin-left:-10px;" slot="label" v-if="gymIsPass===true">场馆未认证，暂无APP销售修改权限</div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 添加教练 -->
    <add-coach-dialog
      v-if="centerDialogVisible"
      :dialogVisible='centerDialogVisible'
      :addCoachForm='addCoachForm' 
      :privateCoatch="privateCoatch"
      :loading='loading'
      @dialogClosed='dialogClosesAddCoach'
      @dialogSure='addCoachSure'
      :widthSize="'800px'">
    </add-coach-dialog>

    <!-- 修改教练 -->
    <edit-coach-dialog
      v-if="centerDialogVisible1"
      :dialogVisible='centerDialogVisible1'
      :formLabelAlign='formLabelAlign'
      :editCoachForm='editCoachForm'
      :courseIdByCoach="courseIdByCoach"
      :privateCoatch="privateCoatch"
      :loading='loading'
      @dialogClosed='dialogClosesEditCoach'
      @dialogSure='editSure'
      :widthSize="'800px'">
    </edit-coach-dialog>

    <!-- 私教课添加 -->
    <el-dialog
      title="私教课添加"
      :visible.sync="centerDialogVisible2"
      width="800px"
      :close-on-click-modal="false" class="addCourseForm" @close="courseAddclose">
      <el-form :model="addCourseForm" label-width="108px" class="courseForm" :rules="rules2" ref="addCourseForm">
        <el-form-item label="课程名称：" prop="name">
          <el-input v-model="addCourseForm.name" placeholder="请填写课程名称" type="text" :maxlength="16"></el-input>
        </el-form-item>
        <el-form-item label="课程类型：" prop="type">
          <el-select v-model="addCourseForm.type" placeholder="请选择课程类型">
            <el-option :label="item.label" :value="item.value" :key="index" v-for="(item,index) in options"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="课程时长：" prop="time">
          <el-select v-model="addCourseForm.time" placeholder="请选择课程时长（min）">
            <el-option :label="item" :value="item" :key="index" v-for="(item,index) in timeSelect"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="热门显示：" prop="is_hot">
          <el-radio v-model="addCourseForm.is_hot" label="1">是</el-radio>
          <el-radio v-model="addCourseForm.is_hot" label="0">否</el-radio>
        </el-form-item>
        <el-form-item label="课程介绍：" prop="introduce" label-width="107px">
          <el-input type="textarea" v-model="addCourseForm.introduce" placeholder="请输入课程介绍(非必填)" maxlength="180"></el-input>
        </el-form-item>
        <el-form-item prop="image" style="position:relative;">
          <div style="position:absolute;left:-92px;"><b class="b">*</b><b class="title">课程图片：</b></div>
          <div class="upImg">
            <el-select v-model="courseAddImg" placeholder="请选择课程封面" class="select-courseImg" @change="selectAddCourse" style="margin-bottom:10px;">
              <el-option :label="item.label" :value="item.value" :key="item.value" v-for="item in selectOption"></el-option>
            </el-select>
            <moreImg :boxWidth="360" :boxHeight="180" :imgWidth="710" :imgHeight="355" @imgUrl="getAddimageUrl" @clearimgurl="reomveAddimg" ref="imgBox" v-if="!addCourseImgMb"></moreImg>
            <div style="width:360px;height:180px;" v-if="addCourseImgMb"><img :src="addCourseForm.image" width="100%" height="100%"/></div>
          </div>
        </el-form-item>
      </el-form>
      
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="loading" class="black" @click="addCourseSure">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 批量操作 -->
    <el-dialog
      title="提示"
      :visible.sync="groupDialogVisible"
      width="490px"
      class="buy-dialog"
      :close-on-click-modal="false" style="margin-top: 28vh;">
      <div style="color:#000;text-align:center;font-size:18px;margin:20px 0;">确定要删除吗？</div>
      <span slot="footer" class="dialog-footer">
      <el-button type="primary" class="black" @click="groupDeleteSure" :loading="loading">确定</el-button>
      </span>
    </el-dialog>
    
    <!-- 删除教练 -->
    <el-dialog
      title="提示"
      :visible.sync="deleteDialogVisible"
      width="490px"
      class="course-dialog" style="margin-top: 28vh;">
      <div style="color:#000;text-align:center;font-size:18px;margin:20px 0;">确定要删除该私教课教练吗？</div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" class="black" style="padding:10px 34px;" @click="deleteCoach" :loading="delLoading">确定</el-button>
      </span>
    </el-dialog>

    <!-- 删除课程 -->
    <el-dialog
      title="提示"
      :visible.sync="deleteCourseDialogVisible"
      width="490px"
      class="course-dialog" style="margin-top: 28vh;">
      <div style="color:#000;text-align:center;font-size:18px;margin:20px 0;">确定要删除该私教课程吗？</div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" class="black" style="padding:10px 34px;" @click="deleteCourseSure" :loading="delLoading">确定</el-button>
      </span>
    </el-dialog>

    <!-- 步骤一 -->
    <el-dialog
      title="购买私教"
      :visible.sync="centerDialogVisibleStep1"
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
            <el-input v-model="buyCourseName" disabled></el-input>
            <!-- <el-select v-model="buyForm.course_id" placeholder="请选择课程" style="margin-left:0;">
              <el-option :label="item.label" :value="item.value" :key="index" v-for="(item,index) in privateCourse"></el-option>
            </el-select> -->
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
            <el-input v-model="buyCoachName" disabled></el-input>
            <!-- <el-select v-model="buyForm.coach_id" placeholder="请选择教练" style="margin-left:0;">
              <el-option :label="item.label" :value="item.value" :key="index" v-for="(item,index) in privateCoatch"></el-option>
            </el-select> -->
          </el-form-item>
          <el-form-item label="失效日期：" prop="expired_at">
            <el-date-picker :picker-options="lostTime" type="date" placeholder="选择日期" v-model="buyForm.expired_at"></el-date-picker>
          </el-form-item>
          <el-form-item label="实付金额：" prop="real_total_fee">
            <el-input v-model="buyForm.real_total_fee" placeholder="实付金额" type="number" class="pay-money-box"></el-input>
          </el-form-item>
          <el-form-item label="支付方式：" prop="payment_method" style="margin-left:12px;">
            <el-select v-model="buyForm.payment_method" placeholder="请选择支付方式" @change="paymethodChage">
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
      :visible.sync="centerDialogVisibleStep2"
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
      </span>
    </el-dialog>

    <!-- 步骤三 -->
    <el-dialog
      title="购买私教"
      :visible.sync="centerDialogVisibleStep3"
      width="1000px"
      class="buy-dialog"
      :close-on-click-modal="false">
      <el-steps :active="3" finish-status="success" simple>
        <el-step title="选择购买课程 1" ></el-step>
        <el-step title="查找客户 2" ></el-step>
        <el-step title="确认客户信息 3" ></el-step>
      </el-steps>
      <div class="form-box formStep3">
        <el-form :model="buyForm" :rules="buyRules" status-icon ref="buyForm" class=" buy-form">
          <el-form-item label="手机号码：" style="margin-left:12px;">
            <el-input v-model="buyForm.customerPhone" placeholder="请输入手机号码" disabled></el-input>
            <!-- <div class="tip" v-if="tipShow === true">提示：如果客户信息有误，点击此处<span class="use-span" @click="editMessage">启用修改</span></div>
            <div class="tip" v-if="tipShow === false">提示：手动输入信息购买成功后，会在系统中自动录入该客户信息 &nbsp;&nbsp;&nbsp;
              <a href="javascript:;" style="color:#1878E1" @click="addCustomer" v-if="buyCustomerId === false">保存</a>
              <a href="javascript:;" style="color:#1878E1" @click="editPersonMsg" v-if="buyCustomerId === true">修改</a>
              <a href="javascript:;" style="color:#1878E1" @click="cansle">取消</a></div> -->
          </el-form-item>
          <el-form-item v-if="disabled">
            <div class="tip" v-if="tipShow === true">提示：如果客户信息有误，点击此处<span class="use-span" @click="editMessage">启用修改</span></div>
            <div class="tip" v-if="tipShow === false">提示：手动修改信息购买成功后，会在系统中自动录入该客户信息 &nbsp;&nbsp;&nbsp;
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
        <el-button type="primary" :loading="loading" :disabled="btnDesabled" @click="buyCourse">确认购买</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import rectbox from '@/components/rectbox'
import scanInput from '@/components/scanInput'
import bulkAction from '@/components/bulkAction'
import moreImg from '@/components/moreImg'
import addCoachDialog from './addCoachDialog'
import editCoachDialog from './editCoachDialog'
import { testFloat2 } from '@/utils/validate'
import { getAllCoatch, privateCourseList, privateCoachList, addPrivateCoach, editPrivateCoach, deletePrivateCoach, deleteGroupPrivateCoach, editPrivateCourse, addPrivateCourse, deletePrivateCourse, courseSortTab, getAllStaff, editBuyCustomer } from '@/api/course'
import { getCustomersByPhone, addCustomers } from '@/api/customer'
import { selectRole } from '@/api/employee'
import { parseTime } from '@/utils/index'
import { testphone } from '@/utils/validate'
import { getSession } from '@/utils/auth'
import { cardsNoList } from '@/api/vipcardGl'
export default {
  name: 'privateCourse',
  components: {
    rectbox,
    scanInput,
    bulkAction,
    moreImg,
    addCoachDialog,
    editCoachDialog
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
      lostTime: {
        disabledDate(time) {
          return time.getTime() < Date.now()
        }
      },
      roleList: [],
      deleteCourseDialogVisible: false,
      courseAddImg: '',
      btnRoleList: {},
      tags: [],
      timeSelect: [],
      tabPosition: 'left',
      activeName: 'index0',
      labelPosition: 'right',
      listLoading: false,
      loadingAll: false,
      loading: false,
      delLoading: false,
      tableKey: 0,
      list: null,
      courseId: '',
      addCourseImgMb: false,
      total: null,
      showReviewer: false,
      allCourseMsg: null,
      placeholder: '请扫码/输入要查询的内容',
      down: [], // 私教课列表已下架
      sales: [], // 私教课列表已上架
      tabList: [],
      sortForm: {
        id: '',
        type: ''
      },
      tipLength: 0,
      centerDialogVisible: false,
      centerDialogVisible1: false,
      centerDialogVisible2: false,
      groupDialogVisible: false,
      deleteDialogVisible: false,
      centerDialogVisibleStep1: false,
      centerDialogVisibleStep2: false,
      centerDialogVisibleStep3: false,
      privateCoatch: [], // 私教教练
      subStatus: '',
      // coachName: '',
      courseIdByCoach: '',
      isEdit: false, // 编辑之前状态
      isDisabled: true,
      courseImgMb: false,
      delIndex: '',
      addCoachForm: {
        coach_id: '',
        course_name: '',
        price: '',
        course_id: '',
      },
      editCoachForm: {
        coach_id: '',
        price: ''
      },
      listQuery: {
        page: 1,
        per_page: 10
        // sex: undefined
      },
      formLabelAlign: {
        id: '',
        name: '',
        type: '',
        time: '',
        is_hot: true,
        introduce: '',
        image: '',
        app_status: '1' // 1.下架 2.上架
      },
      switchStatus1: false,
      switchStatus2: true,
      addCourseForm: {
        name: '',
        type: '',
        time: '',
        is_hot: '0',
        introduce: '',
        image: '',
        saas_status: ''
      },
      bulkAction: [{ // 批量操作
        label: '批量删除',
        value: 'delete',
        key: '3-1-6'
      }],
      groupOprate: { // 批量操作
        delete: []
      },
      bulkValue: '',
      allCourseDown: [],
      allCourseSale: [],
      staff: [{ // 销售员工默认id：2
        'label': '待分配',
        'value': 2,
        'status': 0
      }], // 员工
      staffHj: [{ // 所属会籍默认id：0
        'label': '待分配',
        'value': '',
        'status': 0
      }],
      disabled: false,
      hasCustomer: true,
      btnDesabled: false,
      index: 1,
      privateCourse: [],
      tipShow: true,
      should_payComput: '',
      buyCourseName: '',
      buyCoachName: '',
      buyCustomerId: '',
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
      // 表单验证规则
      rules: {
        name: [
          { required: true, message: '请填写课程名称' },
          { min: 1, max: 16, message: '长度在 1 到 16 个字符', trigger: 'blur' }
        ],
        type: [{ required: true, message: '请选择课程类型', trigger: 'change' }],
        time: [{ required: true, message: '请填写课程时长', trigger: 'change' }],
        is_hot: [{ required: true, message: '请选择课程是否热门', trigger: 'change' }],
        introduce: [{ required: true, message: '请填写课程介绍', trigger: 'blur' }]
      },
      rules2: {
        name: [
          { required: true, message: '请填写课程名称' },
          { min: 1, max: 16, message: '长度在 1 到 16 个字符', trigger: 'blur' }
        ],
        type: [{ required: true, message: '请选择课程类型', trigger: 'change' }],
        time: [{ required: true, message: '请填写课程时长', trigger: 'change' }],
        image: [{ message: '请上传课程图片', trigger: 'change' }],
        is_hot: [{ required: true, message: '请选择课程是否热门', trigger: 'change' }]
      },
      selectOption: [{
        label: '减脂',
        value: 1,
        href: 'https://niulang-v2.oss-cn-beijing.aliyuncs.com/2018-06-12/gym5b1f43209d9ff1528775456.png'
      }, {
        label: '增肌',
        value: 2,
        href: 'https://niulang-v2.oss-cn-beijing.aliyuncs.com/2018-06-12/gym5b1f4349b76b31528775497.png'
      }, {
        label: '塑型',
        value: 3,
        href: 'https://niulang-v2.oss-cn-beijing.aliyuncs.com/2018-06-12/gym5b1f4341908861528775489.png'
      }, {
        label: '自定义',
        value: 4
      }],
      options: [{
        label: '减脂',
        value: 'J'
      }, {
        label: '增肌',
        value: 'Z'
      }, {
        label: '塑型',
        value: 'S'
      }],
      value: '',
      gymIsPass: '',
      courseImg: '',
      searchSelect: [{
        text: '手机号码',
        value: 'cphone_like'
      }, {
        text: '姓名',
        value: 'cname_like'
      }],
      paginationShow: true,
      cardsId: undefined,
      petCardNo: '',
      cardsNoList: [],
      iscardsPaymeth: false,
      submitBug: false, // 提交有错误
      cardsNoErr: false, // 储值卡号错误
      hasCardsdNo: false, // 是否输入储值卡号
      ispetCardNoBtn: false, // 是否点击储值卡号查找按钮
      saveCourseloading: false
    }
  },
  computed: {
    should_pay() {
      let total = this.buyForm.quantity * this.should_payComput
      return total.toFixed(2)
    },
    cardInputIcon() {
      return this.hasCardsdNo ? this.cardsNoErr ? 'el-icon-error' : 'el-icon-success' : ''
    }
  },
  created() {
    this.common.eachBtnRole(this.btnRoleList) // 按钮权限方法
    if (getSession('gymIsPass') === '1') { // 已审核
      this.gymIsPass = false
    } else {
      this.gymIsPass = true
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.getList(this.showWhichData, '')
      this.timeSelects()
    })
    this.getStaff()
    this.getPrivateCoach()
    this.getRole()
  },
  methods: {
    timeSelects() {
      for (let i = 1; i < 13; i++) {
        this.timeSelect.push(30 * i)
      }
    },
    // 获得角色
    getRole() {
      selectRole().then(response => {
        let data = response.data
        data.map(item => {
          let obj = {
            value: item.id + '',
            text: item.name,
            class: 'crole_id'
          }
          this.roleList.push(obj)
        })
      })
    },
    sortChange(data) {
      delete this.listQuery[this.deleteItemSort]
      this.deleteItemSort = data.prop
      this.listQuery[data.prop] = /asc/.test(data.order) ? 'asc' : 'desc'
      this.listQuery.page = 1
      this.pageInit()
      console.log(this.listQuery)
      // this.common.sortFilter(this, data)
      // 获得教练table
      this.getCoatchNameList(this.activeName.split('-')[1])
    },
    tagclose(tag, index) {
      delete this.tags[index]
      delete this.listQuery[tag.type]
      this.listQuery.page = 1
      this.pageInit()
      if (!this.common.getClass('li', 'c' + tag.type)[0]) {
        for (let i = 0; i < this.tabList.length; i++) {
          this.$refs.scanIputDoc[i].clear()
        }
        this.getCoatchNameList(this.activeName.split('-')[1])
      } else {
        this.common.getClass('li', 'c' + tag.type)[0].click()
      }
    },
    filterChange(data) {
      for (let key in data) {
        this.listQuery[key] = data[key][0]
        this.lotFilter(data, key)
      }
      this.listQuery.page = 1
      this.pageInit()
      // 获得教练table
      this.getCoatchNameList(this.activeName.split('-')[1])
    },
    lotFilter(data, key) {
      if (key === 'sex') {
        this.hostFilter(data, key, 1, this.listQuery[key] === '1' ? '性别：男' : this.listQuery[key] === '2' ? '性别：女' : '性别：未知')
      }
      if (key === 'role_id') {
        let text = ''
        let obj = this.roleList.find(item => {
          return item.value === this.listQuery[key]
        })
        text = obj ? obj.text : ''
        this.hostFilter(data, key, 2, '角色：' + text)
      }
    },
    hostFilter(data, key, index, text) {
      if (data[key].length === 0) {
        delete this.tags[index]
      } else {
        this.$set(this.tags, index, { name: text, type: key })
      }
    },
    searchlist(obj) {
      if (obj.value === '') {
        delete this.tags[0]
      } else {
        let tagszh = {
          cphone_like: '手机号码',
          cname_like: '姓名'
        }
        this.tags[0] = { 'name': `${tagszh[ obj.type]}:${obj.value}`, 'type': obj.type }
      }
      this.listQuery.page = 1
      this.pageInit()
      this.listQuery[obj.type] = obj.value || undefined
      this.getCoatchNameList(this.activeName.split('-')[1])
    },
    selectCourse(value) {
      switch (value) {
        case 1:
          this.courseImgMb = true
          this.formLabelAlign.image = this.selectOption[0].href
          break
        case 2:
          this.courseImgMb = true
          this.formLabelAlign.image = this.selectOption[1].href
          break
        case 3:
          this.courseImgMb = true
          this.formLabelAlign.image = this.selectOption[2].href
          break
        case 4:
          this.courseImgMb = false
          break
      }
    },
    selectAddCourse(value) {
      switch (value) {
        case 1:
          this.addCourseImgMb = true
          this.addCourseForm.image = this.selectOption[0].href
          break
        case 2:
          this.addCourseImgMb = true
          this.addCourseForm.image = this.selectOption[1].href
          break
        case 3:
          this.addCourseImgMb = true
          this.addCourseForm.image = this.selectOption[2].href
          break
        case 4:
          this.addCourseImgMb = false
          this.addCourseForm.image = ''
          break
      }
    },
    getimageUrl(url) {
      this.formLabelAlign.image = url
    },
    reomveimg(data) {
      this.formLabelAlign.image = data
    },
    getAddimageUrl(imgname) {
      this.addCourseForm.image = imgname
    },
    reomveAddimg(data) {
      this.addCourseForm.image = data
    },
    courseAddclose() {
      this.$refs.addCourseForm.resetFields()
      this.addCourseImgMb = false
      this.courseAddImg = ''
      this.addCourseForm.image = ''
      if (this.$refs.imgBox) {
        this.$refs.imgBox.deleteimgbtn()
      }
    },
    // 点击左侧tab
    handleClick(tab, event) {
      if (this.isEdit) {
        this.common.message('warning', '请先保存当前课程，再进行相关操作')
        return
      }
      for (let v of this.tabList) {
        v.checked = false
      }
      privateCourseList().then(response => {
        this.allCourseMsg = response.data
      })
      // 获得私教课程ID
      let courseId = tab.name.split('-')[1]
      // 获得表单form
      this.showTabMessage(courseId)
    },
    showTabMessage(courseId) {
      this.getCoatchNameList(courseId) // 获得教练table
      for (let i = 0; i < this.allCourseMsg.length; i++) {
        if (parseInt(this.allCourseMsg[i].id) === parseInt(courseId)) {
          this.formLabelAlign.id = this.allCourseMsg[i].id
          this.formLabelAlign.name = this.allCourseMsg[i].name
          this.formLabelAlign.type = this.allCourseMsg[i].fit_type
          this.formLabelAlign.time = this.allCourseMsg[i].time
          this.formLabelAlign.app_status = this.allCourseMsg[i].app_status
          if (parseInt(this.allCourseMsg[i].is_hot) === 1) {
            this.formLabelAlign.is_hot = true
          } else {
            this.formLabelAlign.is_hot = false
          }
          this.formLabelAlign.introduce = this.allCourseMsg[i].introduce
          this.tipLength = this.allCourseMsg[i].introduce.length
          this.formLabelAlign.image = this.allCourseMsg[i].image
          let self = this
          this.$nextTick(() => {
            self.$refs.imageCourse[i].setImg(this.formLabelAlign.image)
          })
        }
      }
    },
    dialogClosesAddCoach() {
      this.centerDialogVisible = false
      this.addclose()
    },
    addclose() {
      this.addCoachForm.price = ''
      this.addCoachForm.coach_id = ''
    },
    // 添加教练
    addCoach(name, id) {
      this.centerDialogVisible = true
      this.addCoachForm.course_name = name
      this.addCoachForm.course_id = id
      this.addCoachForm.price = this.addCoachForm.price.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')
      this.getPrivateCoach()
    },
    // 添加教练确定
    addCoachSure() {
      let curdata = this.addCoachForm
      if (!curdata.price) {
        this.common.message('error', '请填写课程单价！')
        return
      }
      if (!testFloat2(curdata.price)) {
        this.common.message('error', '课程单价只能位数字且最多保留两位小数！')
        return
      }
      if (!curdata.coach_id) {
        this.common.message('error', '请选择带课教练')
        return
      }
      this.loading = true
      addPrivateCoach(this.addCoachForm).then((res) => {
        this.loading = false
        this.$notify({
          title: '成功',
          message: '添加成功',
          type: 'success',
          duration: 2000
        })
        this.centerDialogVisible = false
        this.getCoatchNameList(this.addCoachForm.course_id)
        this.addclose()
      }).catch(() => {
        this.loading = false
      })
    },
    // 查询私教课程
    getPrivateCourse() {
      privateCourseList().then(response => {
        for (let i = 0; i < response.data.length; i++) {
          this.privateCourse.push({
            'label': response.data[i].name,
            'value': response.data[i].id
          })
        }
      })
    },
    // 查询所有教练
    getPrivateCoach() {
      this.privateCoatch = []
      let data = { 'post': 1 }
      privateCoachList(data).then(response => {
        if (response.data.length) {
          for (let i = 0; i < response.data.length; i++) {
            if (response.data[i].post === 1) { // post:1,教练
              if (response.data[i].status === 1) {
                this.privateCoatch.push({
                  'label': response.data[i].name,
                  'value': response.data[i].id,
                  'status': response.data[i].status
                })
              }
            }
          }
        } else {
          this.privateCoatch.push({
            'label': '暂无数据，请先‘添加员工’',
            'value': -1
          })
        }
      })
    },
    // 修改私教教练
    handleEdit(index, row) {
      this.subStatus = index
      this.editCoachForm.price = Object.assign({}, row).price
      this.courseIdByCoach = Object.assign({}, row).id // 修改id
      this.editCoachForm.coach_id = Object.assign({}, row).coach_id // 教练id
      this.centerDialogVisible1 = true
    },
    dialogClosesEditCoach() {
      this.centerDialogVisible1 = false
    },
    // 修改教练确定
    editSure(coachId) {
      this.loading = true
      let self = this
      this.editCoachForm.coachId = coachId
      this.editCoachForm.price = this.editCoachForm.price.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')
      editPrivateCoach(this.courseIdByCoach, this.editCoachForm).then((res) => {
        this.$notify({
          title: '成功',
          message: '修改成功',
          type: 'success',
          duration: 2000
        })
        this.centerDialogVisible1 = false
        this.getCoatchNameList(this.activeName.split('-')[1])
        self.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 删除私教教练
    handleDelete(index, rows) {
      this.deleteDialogVisible = true
      this.delIndex = index
    },
    deleteCoach() {
      this.delLoading = true
      deletePrivateCoach(this.list[this.delIndex].id).then(res => {
        this.delLoading = false
        this.deleteDialogVisible = false
        this.list.splice(this.delIndex, 1)
        this.common.message('success', '删除成功！')
      }).catch(() => {
        this.common.message('error', '删除失败！')
      })
    },
    // 点击checkbox获得对应id
    selectionChange(selection) {
      this.groupOprate.delete = []
      for (let i = 0; i < selection.length; i++) {
        this.groupOprate.delete.push(selection[i].id)
      }
    },
    // 批量操作
    searchGroup(value) {
      if (!this.groupOprate.delete.length) {
        this.common.message('warning', '请先选择私教教练')
        return false
      }
      this.groupDialogVisible = true
    },
    // 批量删除确定
    groupDeleteSure() {
      deleteGroupPrivateCoach(this.groupOprate).then(res => {
        this.common.message('success', '删除成功')
        this.getCoatchNameList(this.activeName.split('-')[1])
        this.groupDialogVisible = false
      }).catch(() => {
        this.common.Message('error', '删除失败！')
      })
    },
    // 查询左侧课程列表
    getList(callback, courseId) {
      this.listLoading = true
      this.tabList = []
      privateCourseList().then(response => {
        let data = response.data
        if (data.length > 0) {
          let onSale = true
          for (let i = 0; i < data.length; i++) {
            if (data[i].app_status === 1) { // 下架
              onSale = false
            } else {
              onSale = true
            }
            this.tabList.push({
              'name': data[i].name,
              'checked': false,
              'activeName': 'index-' + data[i].id,
              'id': data[i].id,
              'saas_status': data[i].saas_status,
              'sale': onSale,
              'image': data[i].image,
              'introduce': data[i].introduce,
              'fit_type': data[i].fit_type,
              'is_hot': data[i].is_hot,
              'app_status': data[i].app_status,
              'time': data[i].time
            })
          }
          this.allCourseMsg = data
          if (courseId === '') {
            callback(this.tabList[0].id) // 如果没有courseId，默认第一个
          } else {
            callback(courseId)
          }
        }
      })
    },
    showWhichData(courseId) {
      // 获得教练table
      this.getCoatchNameList(courseId)
      this.activeName = 'index-' + courseId
      for (let i = 0; i < this.allCourseMsg.length; i++) {
        if (parseInt(this.allCourseMsg[i].id) === parseInt(courseId)) {
          this.formLabelAlign.id = this.allCourseMsg[i].id
          this.formLabelAlign.name = this.allCourseMsg[i].name
          this.formLabelAlign.type = this.allCourseMsg[i].fit_type
          this.formLabelAlign.time = this.allCourseMsg[i].time
          this.formLabelAlign.app_status = this.allCourseMsg[i].app_status
          if (parseInt(this.allCourseMsg[i].is_hot) === 1) {
            this.formLabelAlign.is_hot = true
          } else {
            this.formLabelAlign.is_hot = false
          }
          this.formLabelAlign.introduce = this.allCourseMsg[i].introduce
          this.tipLength = this.allCourseMsg[i].introduce.length
          this.formLabelAlign.image = this.allCourseMsg[i].image
          let self = this
          this.$nextTick(() => {
            self.$refs.imageCourse[i].setImg(this.formLabelAlign.image)
          })
          this.listLoading = false
        }
      }
    },
    // 查询私教课教练
    getCoatchNameList(id) {
      this.listLoading = true
      this.listQuery.course_id = id
      getAllCoatch(this.listQuery).then(response => {
        this.list = response.data
        this.listLoading = false
        this.total = Number(response.headers.pagination.split(',')[1])
      })
    },
    // 编辑课程
    editCourse() {
      this.isEdit = true
      this.isDisabled = false
    },
    getLength() {
      if (this.formLabelAlign.introduce.length > 180) {
        this.common.message('warning', '请输入180字以内')
      }
      this.tipLength = this.formLabelAlign.introduce.length
    },
    // 保存课程编辑
    saveCourse() {
      if (this.formLabelAlign.is_hot === true) {
        this.formLabelAlign.is_hot = '1'
      } else {
        this.formLabelAlign.is_hot = '0'
      }
      if (!this.formLabelAlign.name) {
        this.common.message('warning', '课程名称不能为空！')
        return
      }
      if (this.formLabelAlign.name.length > 16) {
        this.common.message('warning', '课程名称长度为1到16字符')
        return
      }
      if (!this.formLabelAlign.time) {
        this.common.message('warning', '课程时长不能为空！')
        return
      }
      if (!this.formLabelAlign.image) {
        this.common.message('warning', '课程图片不能为空！')
        return
      }
      this.loadingAll = true
      this.saveCourseloading = true
      editPrivateCourse(this.formLabelAlign).then(res => {
        this.isEdit = false
        this.isDisabled = true
        this.loadingAll = false
        // 更新左侧tab
        this.getList(this.showWhichData, this.formLabelAlign.id)
        this.common.message('success', '修改成功！')
        this.saveCourseloading = false
      }).catch(() => {
        this.loading = false
        this.loadingAll = false
        this.saveCourseloading = false
      })
    },
    // 添加私教课程
    addCourse() {
      this.centerDialogVisible2 = true
    },
    // 添加私教课程确定
    addCourseSure() {
      if (!this.addCourseForm.name.trim()) {
        this.common.message('warning', '课程名称不能为空！')
        return
      }
      if (this.addCourseForm.name.length > 16) {
        this.common.message('warning', '课程名称长度为1到16字符')
        return
      }
      if (!this.addCourseForm.type) {
        this.common.message('warning', '课程类型不能为空！')
        return
      }
      if (!this.addCourseForm.time) {
        this.common.message('warning', '课程时长不能为空！')
        return
      }
      if (!this.addCourseForm.is_hot) {
        this.common.message('warning', '课程是否热门不能为空！')
        return
      }
      if (!this.addCourseForm.image) {
        this.common.message('warning', '课程图片不能为空！')
        return
      }
      this.loadingAll = true
      this.loading = true
      addPrivateCourse(this.addCourseForm).then(res => {
        this.loadingAll = false
        this.$notify({
          title: '成功',
          message: '添加成功',
          type: 'success',
          duration: 2000
        })
        // 更新左侧tab
        this.loading = false
        this.getList(this.showWhichData, res.data.id)
        this.centerDialogVisible2 = false
      }).catch(() => {
        this.loadingAll = false
        this.loading = false
      })
    },
    deleteCourse() {
      this.deleteCourseDialogVisible = true
    },
    // 删除课程
    deleteCourseSure() {
      this.delLoading = true
      this.loadingAll = true
      deletePrivateCourse(this.formLabelAlign.id).then(res => {
        this.delLoading = false
        // 更新左侧tab
        this.getList(this.showWhichData, '')
        this.loadingAll = false
        this.deleteCourseDialogVisible = false
        this.common.message('success', '删除成功！')
      }).catch(() => {
        this.delLoading = false
        this.loadingAll = false
        this.common.message('error', '删除失败！')
      })
    },
    // app销售：上架、下架
    appOnSale(obj, index) {
      console.log(obj)
      console.log(index)
      let data = {
        'name': obj.name,
        'is_hot': obj.is_hot,
        'time': obj.time,
        'fit_type': obj.fit_type,
        'image': obj.image,
        'introduce': obj.introduce,
        'id': obj.id
      }
      if (this.gymIsPass === true) {
        this.common.message('warning', '暂无权限操作')
        return
      }
      if (this.isEdit) {
        this.common.message('warning', '请先保存当前课程，再进行相关操作')
        return
      }
      if (obj.sale === true) {
        data.app_status = 2 // 上架
      } else {
        data.app_status = 1 // 下架
      }
      this.loadingAll = true
      editPrivateCourse(data).then(res => {
        this.common.message('success', '修改成功！')
        this.loadingAll = false
      }).catch(() => {
        if (obj.sale === true) {
          this.tabList[index].sale = false
        } else {
          this.tabList[index].sale = true
        }
        this.loadingAll = false
      })
    },
    // 向上排序
    upToTab() {
      // 查询元素在数组中的位置
      var index = this.findIndex()
      if (index > 0) {
        // 交换位置
        let item1 = this.tabList[index]
        let item2 = this.tabList[index - 1]
        this.$set(this.tabList, index - 1, item1)
        this.$set(this.tabList, index, item2)
        index--
        // tab切换
        this.activeName = this.tabList[index].activeName
        this.sortForm.id = this.tabList[index].id
        this.sortForm.type = 'up'
        this.courseSort()
      }
    },
    // 向下排序
    downToTab() {
      // 查询元素在数组中的位置
      var index = this.findIndex()
      if (index < this.tabList.length - 1) {
        // 交换位置
        let item1 = this.tabList[index]
        let item2 = this.tabList[index + 1]
        this.$set(this.tabList, index + 1, item1)
        this.$set(this.tabList, index, item2)
        index++
        this.activeName = this.tabList[index].activeName
        this.sortForm.id = this.tabList[index].id
        this.sortForm.type = 'down'
        this.courseSort()
      }
    },
    findIndex() {
      var x = this.formLabelAlign.id
      for (var i = 0, n = this.tabList.length; i < n; i++) {
        if (this.tabList[i].id === x) {
          return i
        }
      }
      return -1
    },
    courseSort() {
      this.loadingAll = true
      courseSortTab(this.sortForm).then(res => {
        this.loadingAll = false
      }).catch(() => {
        this.loadingAll = false
      })
    },
    curChoose(index) {
      for (let v of this.boxlist) {
        v.checked = false
      }
      this.boxlist[index].checked = true
    },
    handleBuy(row) {
      this.centerDialogVisibleStep1 = true
      let buyCoachId = row.id
      this.buyForm.coach_id = Object.assign({}, row).id
      this.should_payComput = row.price
      this.buyCourseName = this.formLabelAlign.name
      this.buyCoachName = row.coach.name
      this.buyForm.course_id = this.activeName.split('-')[1]
      if (this.index !== 1) {
        this.addclose1()
        this.buyForm.customerPhone = ''
      }
      this.index++
      this.buyForm.coach_id = buyCoachId // 教练id
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
          this.hasCustomer = true
          this.disabled = true
          this.tipShow = true
          this.buyForm.customerName = data.name
          this.buyForm.customerSex = data.sex
          this.buyForm.consultant_id = data.consultant_id
          this.buyForm.customerId = data.id
          this.common.message('success', '已获得客户信息')
          this.buyCustomerId = true
          if (!(this.staffHj.filter(item => item.value === this.buyForm.consultant_id).length)) {
            this.buyForm.consultant_id = ''
          }
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
      let payMoneyBox = document.querySelector('.pay-money-box')
      if (payMoneyBox.lastChild.tagName === 'P') {
        this.common.message('warning', payMoneyBox.lastChild.innerHTML)
        return false
      }
      if (!this.buyForm.sell_id) {
        this.buyForm.sell_id = 2
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
      this.centerDialogVisibleStep2 = true
    },
    toStepOne() {
      this.buyForm.expired_at = new Date(this.buyForm.expired_at)
      this.centerDialogVisibleStep1 = true
      this.centerDialogVisibleStep2 = false
    },
    stepTwo() {
      if (!this.buyForm.customerPhone) {
        this.common.message('warning', '手机号码不能为空')
        return false
      }
      this.centerDialogVisibleStep3 = true
      this.centerDialogVisibleStep2 = false
    },
    toStepTwo() {
      this.centerDialogVisibleStep3 = false
      this.centerDialogVisibleStep2 = true
    },
    // 点击修改会员信息
    editMessage() {
      this.hasCustomer = false
      this.disabled = true
      this.tipShow = false
      this.btnDesabled = true // 不能购买
    },
    // 修改会员信息
    editPersonMsg() {
      this.loading = true
      editBuyCustomer(this.buyForm).then((res) => {
        this.hasCustomer = true
        this.tipShow = true
        this.btnDesabled = false
        this.loading = false
        this.common.message('success', '修改成功')
      }).catch(() => {
        this.loading = false
      })
    },
    // 购买私教
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
          this.buyCourseSure()
        }).catch(() => {
          this.loading = false
        })
      } else {
        this.buyCourseSure()
      }
    },
    buyCourseSure() {
      this.loading = true
      this.$store.dispatch('CourseBuy', this.buyForm).then(() => {
        this.loading = false
        this.common.message('success', '购买成功')
        this.addclose1()
        this.centerDialogVisibleStep3 = false
        this.centerDialogVisibleStep1 = false
      }).catch(() => {
        this.loading = false
      })
    },
    cansle() {
      this.hasCustomer = true
      this.tipShow = true
      this.btnDesabled = false
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
    curOpenbox(index) {
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
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getCoatchNameList(this.activeName.split('-')[1])
    },
    handleSizeChange(val) {
      this.listQuery.per_page = val
      this.getCoatchNameList(this.activeName.split('-')[1])
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
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.b {
  color: rgb(245,108,108);
  margin-right: 5px;
  vertical-align: middle;
}
.checkbox {
  margin-left: 5px;
}
.cliseer {
  /deep/ .el-tabs__nav {
    height: 82vh;
  }
  /deep/ .el-tabs--left.el-tabs--card .el-tabs__nav{
    border-bottom: none;
  }
  /deep/ .el-tabs--card>.el-tabs__header .el-tabs__nav{
    border: none;
  }
  /deep/ .el-tabs--card>.el-tabs__header{
    border-bottom: none;
  }
  /deep/ .el-tabs--left.el-tabs--card .el-tabs__item.is-left {
    border-right: none;
  }
  /deep/ .el-tabs__content{
    background-color: #fff;
  }
  /deep/ .el-tabs--left .el-tabs__header.is-left{
    margin-right: 0px;
  }
}
.quantity /deep/ .el-input-number--medium {
  width: 199px;
}
.otherSearcher {
  width: 700px;
  margin: 60px auto;
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
  .el-select .el-input {
    width: 550px;
    padding-left: 0px;
  }
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
  overflow: hidden;
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
.dialog-footer {
  .black {
    background: #000;
    border: 1px solid #000;
  }
  .gray {
    background: #ccc;
    border: 1px solid #ccc;
  }
  .button {
    background: #000;
    border: 1px solid #000;
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
.black {
  background: #000;
  border: 1px solid #000;
}
.title-box {
  color: #333;
  font-size: 20px;
  line-height: 70px;
  overflow: hidden;
  border: 1px solid #cccccc;
  border-bottom: none;
  .save {
    float: right;
    margin-top: 16px;
    margin-right: 20px;
    // background: #1AB394;
    cursor: pointer;
  }
  .list {
    width: 240px;
    height: 70px; 
    border-right: 1px solid #cccccc;
    background: #E7EAEC;
    padding-left: 15px;
    box-sizing: border-box;
  }
  .message {
    padding-left: 15px;
  }
}
.lf {
  float: left;
}
.tabs-box {
  position: relative;
  background-color: #F4F6F9;
  border: 1px solid #cccccc;
  .div-btn-box {
    margin-left: -10px;
    border-bottom: 1px dashed #cccccc;
    .button {
      background: #333;
      border: 1px solid #333;
      cursor: pointer;
      padding: 8px 16px;
      border-radius: 0;
    }
    .up, .down {
      padding: 8px 8px;
      border-radius: 0;
    }
    .up {
      margin-right: -2px;
      border-right: 1px solid #000;
    }
    .down {
      margin-left: -2px;
    }
  }
  .table-box {
    padding: 25px 15px;
    border-top: 1px solid #cccccc;
    .title {
      color: #333;
      font-size: 20px;
    }
    .add-button {
      background: #333;
      margin-left: 15px;
      margin-top: 1px;
      border: none;
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
  }
  .privateCourse-form {
    margin-left: 20px;
  }
  .introduce {
    text-align: left;
    height: 246px;
    textarea {
      border: 1px solid #cccccc;
      width: 300px;
      height: 180px;
      vertical-align: top;
      padding: 5px;
      border-radius: 4px;
      font-size: 15px;
      line-height: 22px;
    }
    textarea:disabled {
      background-color: #f5f7fa;
    }
    .el-box {
      display: inline-block;
      position: relative;
    }
    .b {
      color: #F14C30;
      font-size: 10px;
      margin-top: -1px;
      margin-right: 10px;
    }
    .title {
      font-size: 14px;
    }
    .word-tip {
      position: absolute;
      bottom: -20px;
      right: 10px;
      color: #999;
      font-size: 14px;     
    }
  }
  .cover {
    overflow: hidden;
    .b {
      color: #F14C30;
      font-size: 14px;
      margin-top: 0px;
      margin-right: 5px;
    }
    .title {
      font-size: 14px;
    }
    .upImg {
      margin-left: 94px;
      text-align: left;
      margin-top: -16px;
      position: relative;
      .select-courseImg {
        margin-bottom: 10px;
      }
      .imgBox {
        width: 300px;
        height: 180px;
        border: 1px solid #cccccc;
      }
      .divBox {
        position: absolute;
        top: 0;
        width: 360px;
        height: 180px;
        background: rgba(245,247,250,0.6);
      }
    }
  }
}
.dialog-footer {
  text-align: center;
  .dialog-footer button{
    background: #000;
    border: 1px solid #000;
  }
}
.courseForm {
  width: 500px;
  margin: 0 auto;
}
.firstTab {
  color: #000;
}
.rf {
  float: right;
}
.tabs-box .introduce {
  textarea.divTextArea {
    display: inline-block;
    line-height: 21px;
    width: 300px;
    height: 180px;
    font-size: 14px;
    vertical-align: top;
    text-align: left;
    color: #333;
    border: 1px solid #fff;
    margin-top: -7px;
  }
  textarea:disabled {
    background-color: #fff;
  }
}
.spanTitle {
  display: inline-block;
  width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.por {position: relative;}
.poa {position: absolute;
  right: 10px;
  top: -9px;}
.cliseer {
  /deep/ .el-tabs--left.el-tabs--card .el-tabs__nav{
    border-bottom: none;
  }
  /deep/ .el-tabs--card>.el-tabs__header .el-tabs__nav{
    border: none;
  }
  /deep/ .el-tabs--card>.el-tabs__header{
    border-bottom: none;
  }
  /deep/ .el-tabs--left.el-tabs--card .el-tabs__item.is-left {
    border-right: none;
  }
  /deep/ .el-tabs__content{
    background-color: #fff;
  }
  /deep/ .el-tabs--left .el-tabs__header.is-left{
    margin-right: 0px;
  }
}
.title-box-head{
  background-color: #fff;
  height: 70px;
}
.btn1-style{
  background: rgba(26,179,148,0.10);
  border: 1px solid #1AB394;
  color: #1AB394;
}
.btn1-style:hover,.btn1-style:focus{
   background: rgba(26,179,148,1);
   color: #fff;
}
.btn2-style{
  background: rgba(24,120,225,0.10);
  border: 1px solid #1878E1;
  color: #1878E1;
}
.btn2-style:hover,.btn2-style:focus{
  background: rgba(24,120,225,1);
  color: #fff;
}
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
</style>
