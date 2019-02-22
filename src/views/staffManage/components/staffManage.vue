<template>
  <div class="app-container documentation-container">
    <div class="boxser">
      <rectbox :data="boxlist" v-on:choose="curChoose" v-on:openbox="curOpenbox"></rectbox>
    </div>
    <div class="find-box4"> 
      <div style="overflow:hidden" class="filter-container">
        <scan-input :select="searchSelect" :defaultSelect="searchSelect[0].value" @kedownOver="searchlist" @changeOver="scaninputselect" :placeholder="placeholder" ref="scanIputDoc"></scan-input>
        <el-button class="lf staffAdd" @click="staffAdd" v-if="btnRoleList['4-1-1']"><i class="el-icon-plus"></i> 添加员工</el-button>
        <bulk-action :select="bulkAction" @changeBulk="searchGroup"></bulk-action>
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
    <el-table ref="staffTable" @filter-change="filterChange" @sort-change="sortChange" stripe :key='tableKey' :data="tableList" v-loading="listLoading" element-loading-text="列表正在加载中" fit highlight-current-row @selection-change="selectionChange"
      style="width: 100%;" header-cell-class-name="bindonce" border class="check-table">
      <el-table-column align="center" type="selection" width="55px"></el-table-column>
      <el-table-column align="center" :label="'姓名'" width="150">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column width="90px" align="center" :label="'头像'">
        <template slot-scope="scope">
          <span><img :src="scope.row.head_portrait?scope.row.head_portrait:defaulthead" @click="common.bigImg($event)" alt="icon" width="30" height="30" style="margin-left:20px;display: list-item;border-radius:50%;"></span>
        </template>
      </el-table-column>
      <el-table-column column-key="sex" align="center" :label="'性别'" width="120"
      prop="sex"
      :filters="[{text: '男', value: '1', class: 'csex'}, {text: '女', value: '2', class: 'csex'}]"
      filter-placement="bottom-end" :filter-multiple="false">
        <template slot-scope="scope">
          <span>{{scope.row.sex === 1 ? '男' : '女'}}</span>
        </template>
      </el-table-column>
      <el-table-column width="190px" align="center" :label="'绑定APP（手机号码）'" prop="phone">
        <template slot-scope="scope">
          <span @click="toBindApp(scope.row)" class="tag warning" v-if="scope.row.is_bind_app===false">未绑定</span>
          <span v-if="btnRoleList['4-1-10']"><span class="tag success" v-if="scope.row.is_bind_app===true" @click="toCansleBindApp(scope.row)">{{scope.row.phone}}</span></span>
        </template>
      </el-table-column>
     
      <el-table-column align="center" column-key="role_id" :label="'角色'" width="150" prop="scope.row.role.name" 
        :filters="roleList"
        filter-placement="bottom-end" :filter-multiple="false">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" v-if="scope.row.role?scope.row.role.deleted_at:false" :content="`该角色已删除，删除时间: ${scope.row.role.deleted_at}`" placement="bottom">
            <el-button type="info" size="mini">{{scope.row.role===null?'-':scope.row.role.name}}</el-button>
          </el-tooltip>
          <span v-else>{{scope.row.role===null?'-':scope.row.role.name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="'是否为教练'" width="150" prop="scope.row.post">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.isPost" active-text="" inactive-text="" @change="chooseIsPost(scope.$index, scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" label="上班时间" sortable="custom" prop="start_work_sort">
        <template slot-scope="scope">
          <span>{{scope.row.start_work_time}}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" label="下班时间" sortable="custom" prop="end_work_sort">
        <template slot-scope="scope">
          <span>{{scope.row.end_work_time}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column align="center" :label="'紧急联系人'" width="150" prop="scope.row.emergency_contact">
        <template slot-scope="scope">
          <span>{{scope.row.emergency_contact}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="'紧急联系人电话'" width="150" prop="scope.row.emergency_phone">
        <template slot-scope="scope">
          <span>{{scope.row.emergency_phone}}</span>
        </template>
      </el-table-column> -->
      <el-table-column width="200px" align="center"
      label="创建时间<i onclick='openDate(event)' data=[3,'created_at_sdate','created_at_edate'] title='创建时间' class='el-icon-date'></i>"
      sortable="custom" prop="created_at_sort">
        <template slot-scope="scope">
          <span>{{scope.row.created_at}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="'创建人'" width="150" prop="creater_id"
        column-key="creater_id" :filters="operatorOptions" 
        filter-placement="bottom-end" :filter-multiple="false">
        <template slot-scope="scope">
          <span>{{scope.row.creater_name?scope.row.creater_name:'超级管理员'}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" fixed="right" :label="$t('table.actions')" min-width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" plain
          @click="handleEdit(scope.$index, scope.row.id)" v-if="btnRoleList['4-1-2']">编辑</el-button>
          <el-button size="mini" type="danger" plain v-if="btnRoleList['4-1-3']&&(scope.row.status===1)"
          @click="handleDelete(scope.$index, scope.row)">禁用</el-button>
          <el-button size="mini" type="success" plain 
            v-if="btnRoleList['4-1-9']&&(scope.row.status===3)"
            @click="handleUse(scope.$index, scope.row)" >启用</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination 
        v-if="paginationShow"
        background 
        @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
        :page-sizes="[10,20,30,50]" :page-size="listQuery.per_page" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <!--  添加/编辑 -->
    <el-dialog :title="titleDialog" :visible.sync="dialogFormVisible" width="900px" class="staff-dialog" @close="addclose" :close-on-click-modal="false">
      <el-row>
        <el-col :span="12">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="108px" class="ruleForm">
          <el-form-item label="姓名:" prop="name">
            <el-input v-model="ruleForm.name" placeholder="请输入员工姓名" style="width:300px" :maxlength="12"></el-input>
          </el-form-item>
          <el-form-item label="角色:" prop="role">
            <el-select v-model="ruleForm.role" style="width:300px" placeholder="请选择角色">
              <el-option :label="item.name" :value="item.id" :key="item.id" v-for="item in options"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="性别:" prop="sex">
            <el-select v-model="ruleForm.sex" style="width:300px" placeholder="请选择性别">
              <el-option label="男" :value="1" :key="1"></el-option>
              <el-option label="女" :value="2" :key="2"></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="状态:" prop="status">
            <el-select v-model="ruleForm.status" style="width:300px" placeholder="请选择状态">
              <el-option :label="item.label" :value="item.value" :key="item.value" v-for="item in status"></el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item required label="工作时间:">
           <el-time-picker style="width:300px"
            is-range
            v-model="ruleForm.time"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间">
           </el-time-picker>
          </el-form-item>

          <!-- <el-form-item label="紧急联系人:" prop="egname">
            <el-input v-model="ruleForm.egname" placeholder="请输入会紧急联系人姓名" style="width:300px"></el-input>
          </el-form-item>
          <el-form-item label="联系人手机:" prop="egphone">
            <el-input v-model="ruleForm.egphone" placeholder="请输入会员手机号码" style="width:300px" type="number"></el-input>
          </el-form-item> -->
          <el-form-item label="是否为教练:" prop="post">
            <el-switch v-model="iscoach1"></el-switch>
          </el-form-item>
        </el-form>
        </el-col>
        <el-col :span="12">
          <div class="upload-box">
            <b class="avatar-title"><span style="color: #f56c6c">* </span>头像：</b>
            <div style="margin-left: 80px;">
              <picture-img ref="imgbox" @imgUrl="getheadimgurl" @clearimgurl="clearheadimgurl"></picture-img>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row v-show="iscoach1">
        <div class="hr"></div>
        <el-col :span="12">  
          <el-form :model="ruleForm" ref="form" label-width="108px" class="form">
            <el-form-item label="自我介绍:">
              <textarea style="resize:none;" placeholder="请输入自我介绍" 
                v-model="ruleForm.desc" class="descripts" 
                v-on:input="getLength"
                maxlength="180"></textarea>
            </el-form-item>
            <label class="tips">{{tipLength}}/180</label>
          </el-form>
        </el-col>

        <el-col :span="12" class="divBox">
          <b class="avatar-title">形象照：</b>
          <div class="imgshow imgal">
            <moreImg :boxWidth="168.1" :boxHeight="94.1" :imgWidth="750" :imgHeight="560" ref="smallBox1" @imgUrl="getimageUrl1" @clearimgurl="reomveimg1"></moreImg>
          </div>
          <div class="imgshow">
            <moreImg :boxWidth="168.1" :boxHeight="94.1" :imgWidth="750" :imgHeight="560" ref="smallBox2" @imgUrl="getimageUrl2" @clearimgurl="reomveimg2"></moreImg>
          </div>
          <div class="imgshow imgal">
            <moreImg :boxWidth="168.1" :boxHeight="94.1" :imgWidth="750" :imgHeight="560" ref="smallBox3" @imgUrl="getimageUrl3" @clearimgurl="reomveimg3"></moreImg>
          </div>
          <div class="imgshow">
            <moreImg :boxWidth="168.1" :boxHeight="94.1" :imgWidth="750" :imgHeight="560" ref="smallBox4" @imgUrl="getimageUrl4" @clearimgurl="reomveimg4"></moreImg>
          </div>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button class="submitBtn black" v-if="isEdit === true" type="primary" :loading="loading" @click="editSure">提交</el-button>
        <el-button class="submitBtn black" v-if="isEdit === false" type="primary" :loading="loading" @click="addSure">提交</el-button>
      </div>
    </el-dialog>

    <!-- 绑定App -->
    <el-dialog
      title="绑定App"
      v-if="appDialogVisible"
      :visible.sync="appDialogVisible"
      width="600px"
      class="course-dialog" style="margin-top: 28vh;">
      <div style="color:#000;text-align:center;font-size:18px;margin:20px auto; width:90%">
        <el-row :gutter="20">
          <el-col :span="5" style="padding-left:0px;padding-right:0px">
            <img src ="https://www.nlfit.cn/static/home/img/guanwng.png" height="100px" width="100px" />
            <p class="down-prompt">请扫描下载</p>
          </el-col>
          <el-col :span="19">
            <el-form :model="ruleForm" ref="form" label-width="80px" class="form bing-phone-box" @submit.native.prevent>
              <!-- 在 input中加上@keyup.enter.native 就可以使用回车事件
              但是会发现有时候，第一次回车就会刷新页面，再次回车，才触发回车事件。
              当一个 form 元素中只有一个输入框时，在该输入框中按下回车应提交该表单。如果希望阻止这一默认行为，可以在 标签上添加 @submit.native.prevent。 -->
              <el-form-item label="手机号码:">
                <el-input type="text" v-model="bindForm.phoneByApp" placeholder="请输入手机号码" @keyup.enter.native="bindSure" ></el-input>
              </el-form-item>
            </el-form>
            <p class="prompt">提示：绑定前，请先让员工下载安装"牛啦"APP
              <img src="https://www.nlfit.cn/static/home/img/43niulang_logo.png" height="16px" width="16px" />,然后
              使用注册时填写的手机号码进行绑定，成功后可使用APP账号密码登录SaaS管理系统
            </p>
          </el-col>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" class="black" style="padding:10px 34px;" :loading="bindloading" @click="bindSure">确定</el-button>
      </span>
    </el-dialog>

    <!-- 解绑App -->
    <el-dialog
      title="解绑App"
      v-if="appCansleDialogVisible"
      :visible.sync="appCansleDialogVisible"
      width="490px"
      class="course-dialog" style="margin-top: 28vh;">
      <div style="color:#000;text-align:center;font-size:18px;margin:20px auto; width:90%">
        <el-form :model="ruleForm" ref="form" label-width="80px" class="form">
          <el-form-item label="手机号码:">
            <el-input type="text" v-model="bindCansleForm.phoneByApp" placeholder="请输入手机号码" @keyup.enter.native="bindCansleSure" disabled></el-input>
          </el-form-item>
        </el-form>
        <!-- <p class="prompt">提示：<span>绑定成功后，可使用APP账号密码登录SaaS管理系统</span></p> -->
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" class="black" style="padding:10px 34px;" :loading="bindCansleloading" @click="bindCansleSure">解绑</el-button>
      </span>
    </el-dialog>

    <!-- 确认禁用 -->
    <el-dialog
      title="提示"
      v-if="deleteDialogVisible"
      :visible.sync="deleteDialogVisible"
      width="490px"
      class="course-dialog" style="margin-top: 28vh;">
      <div style="color:#000;text-align:center;font-size:18px;margin:20px 0;">确定禁用该员工？</div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" class="gray" style="width:80px;" @click="deleteDialogVisible=false">取消</el-button>
        <el-button type="primary" class="black" style="width:80px;" @click="deleteSure" :loading="delLoading">确定</el-button>
      </span>
    </el-dialog>

    <!-- 确认启用 -->
    <el-dialog
      title="提示"
      v-if="useDialogVisible"
      :visible.sync="useDialogVisible"
      width="490px"
      class="course-dialog" style="margin-top: 28vh;">
      <div style="color:#000;text-align:center;font-size:18px;margin:20px 0;">确定启用该员工？</div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" class="gray" style="width:80px;" @click="useDialogVisible=false">取消</el-button>
        <el-button type="primary" class="black" style="width:80px;" @click="useSure" :loading="delLoading">确定</el-button>
      </span>
    </el-dialog>
    <dateRange @timeChange="timeChange"></dateRange>
  </div>
</template>

<script>
import { employeeList, statistics, staffDetails, selectRole, bindAppByPhone, unbindAppByPhone, employeesGroupSet, employeesGroupCansle, employeesGroupUse, employeesGroupForbbite, employeeDisable, employeeEnable } from '@/api/employee'
import rectbox from '@/components/rectbox'
import dateRange from '@/components/dateRange'
import scanInput from '@/components/scanInput'
import bulkAction from '@/components/bulkAction'
import pictureImg from '@/components/pictureImg'
import moreImg from '@/components/moreImg'
import { parseTime } from '@/utils/index'
import { getEmployeeSelectVule } from '@/utils/comm'
import { testphone } from '@/utils/validate'
export default {
  name: 'staffManage',
  components: {
    rectbox,
    scanInput,
    bulkAction,
    pictureImg,
    moreImg,
    dateRange,
  },
  data() {
    // 手机号码验证
    const validatePhone = (rule, value, callback) => {
      if (!(testphone(value))) {
        callback(new Error('请输入正确的手机号码'))
      } else {
        callback()
      }
    }
    return {
      btnRoleList: {},
      appDialogVisible: false,
      appCansleDialogVisible: false,
      deleteDialogVisible: false,
      useDialogVisible: false,
      bindForm: {
        phoneByApp: '',
        id: ''
      },
      bindCansleForm: {
        phoneByApp: '',
        id: ''
      },
      tags: [],
      bindloading: false,
      bindCansleloading: false,
      delLoading: false,
      headicon: '',
      select: '',
      searchval: '',
      tableKey: 0,
      tableList: [],
      total: null,
      listLoading: true,
      loading: false,
      showReviewer: false,
      options: [], // 角色列表
      iscoach1: false,
      deleteForm: {},
      status: [{ // 状态
        label: '有效',
        value: 1
      }, {
        label: '禁用',
        value: 2
      }],
      post: [{ // 岗位
        label: '教练',
        value: 1
      }, {
        label: '会籍',
        value: 2
      }, {
        label: '前台',
        value: 4
      }, {
        label: '财务',
        value: 8
      }, {
        label: '店长',
        value: 16
      }],
      listQuery: {
        page: 1,
        per_page: 10,
        status: 1,
        column: undefined
      },
      searchSelect: [{ // 查询列表
        text: '手机号码',
        value: 'phone'
      }, {
        text: '姓名',
        value: 'name'
      }
      // , {
      //   text: '紧急联系人',
      //   value: 'emergency_contact'
      // }, {
      //   text: '紧急联系人电话',
      //   value: 'emergency_phone'
      // }
      // {
      //   text: '创建人',
      //   value: 'creater_name'
      // }
      ],
      boxlist: [{
        text: '有效',
        num: 0,
        checked: true,
        status: 1,
        bocolor: 'rgb(81, 169, 202)'
      }, {
        text: '禁用',
        num: 0,
        checked: false,
        status: 3,
        bocolor: 'rgb(26, 179, 148)'
      }],
      bulkAction: [{
        label: '批量设置教练',
        value: 'set',
        key: '4-1-5'
      }, {
        label: '批量取消教练',
        value: 'cansle',
        key: '4-1-6'
      }, {
        label: '批量禁用',
        value: 'forbbit',
        key: '4-1-7'
      }, {
        label: '批量启用',
        value: 'use',
        key: '4-1-8'
      },
      // {
      //   label: '批量删除',
      //   value: 'delete',
      //   key: '4-1-4'
      // }
      ],
      groupOprate: {
        ids: [],
        method: '',
        attribute: '',
        value: ''
      },
      titleDialog: '',
      tipLength: 0,
      isEdit: false, // 是否是编辑状态
      placeholder: '请扫码/输入要查询的内容',
      passwordType: 'password',
      photo1: '',
      photo2: '',
      photo3: '',
      photo4: '',
      ruleForm: {
        id: '',
        name: '',
        phone: '',
        egphone: '',
        egname: '',
        role: '',
        start: '',
        end: '',
        desc: '',
        head_pic: '',
        photos: [],
        time: [new Date(2018, 3, 10, 9, 0), new Date(2018, 3, 11, 23, 0)],
        post: '',
        sex: 1,
        status: '',
        password: '',
        vacation_data: '',
        vacation_time_from: '',
        vacation_time_to: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ],
        phone: [{ required: true, trigger: 'blur', validator: validatePhone }],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        role: [
          { required: true, message: '请选择角色', trigger: 'change' }
        ],
        post: [
          { required: true, message: '请选择岗位', trigger: 'change' }
        ]
      },
      searchGroupBtn: '',
      value1: true,
      value2: false,
      editIndex: '',
      dialogFormVisible: false,
      deleteItemSort: undefined,
      roleList: [],
      paginationShow: true,
      operatorOptions: []
    }
  },
  computed: {
  },
  created() {
    this.__init()
    this.getEmployeeAll()
  },
  mounted() {
  },
  methods: {
    __init() {
      this.common.eachBtnRole(this.btnRoleList) // 按钮权限方法
      this.$init()
      this.getRole()
    },
    getLength() {
      if (this.ruleForm.desc.length > 180) {
        this.common.message('warning', '请输入180字以内')
      }
      this.tipLength = this.ruleForm.desc.length
    },
    tagclose(tag, index) {
      this.common.tagFilter(this, tag, index, this.searchSelect)
    },
    sortChange(data) {
      this.common.sortFilter(this, data)
    },
    getheadimgurl(url) {
      this.ruleForm.head_pic = url
    },
    clearheadimgurl(data) {
      this.ruleForm.head_pic = data
    },
    getimageUrl1(imgname) {
      this.photo1 = imgname
    },
    reomveimg1(data) {
      this.photo1 = data
      this.ruleForm.photos[0] = data
    },
    getimageUrl2(imgname) {
      this.photo2 = imgname
    },
    reomveimg2(data) {
      this.photo2 = data
      this.ruleForm.photos[1] = data
    },
    getimageUrl3(imgname) {
      this.photo3 = imgname
    },
    reomveimg3(data) {
      this.photo3 = data
      this.ruleForm.photos[2] = data
    },
    getimageUrl4(imgname) {
      this.photo4 = imgname
    },
    reomveimg4(data) {
      this.photo4 = data
      this.ruleForm.photos[3] = data
    },
    // 切换卡片
    curChoose(index) {
      for (let v of this.boxlist) {
        v.checked = false
      }
      this.boxlist[index].checked = true
      this.listQuery.status = this.boxlist[index].status
      this.tableList = []
      this.getList()
    },
    curOpenbox(index) {
      console.log(this.boxlist[index].text)
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
      if (key === 'sex') {
        this.hostFilter(data, key, 1, this.listQuery[key] === '1' ? '性别：男' : '性别：女')
      }
      if (key === 'role_id') {
        let text = ''
        let obj = this.roleList.find(item => {
          return item.value === this.listQuery[key]
        })
        text = obj ? obj.text : ''
        this.hostFilter(data, key, 2, '角色：' + text)
      }
      if (key === 'creater_id') {
        let text = ''
        let obj = this.operatorOptions.find(item => {
          return item.value === this.listQuery[key]
        })
        text = obj ? obj.text : ''
        this.hostFilter(data, key, 4, text)
      }
    },
    hostFilter(data, key, index, text) {
      if (data[key].length === 0) {
        delete this.tags[index]
      } else {
        this.$set(this.tags, index, { name: text, type: key })
      }
    },
    // 获得角色
    getRole() {
      selectRole().then(response => {
        let data = response.data
        this.options = data
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
    getList() {
      this.listLoading = true
      this.tableList = []
      employeeList(this.listQuery).then(response => {
        for (let i = 0; i < response.data.length; i++) {
          this.tableList.push(response.data[i])
          if (response.data[i].post === 1) {
            this.tableList[i].isPost = true
          } else {
            this.tableList[i].isPost = false
          }
        }
        this.total = Number(response.headers.pagination.split(',')[1])
        this.listLoading = false
      })
    },
    getEmployeeAll() {
      employeeList().then(response => {
        for (let i = 0; i < response.data.length; i++) {
          this.operatorOptions.push({ text: response.data[i].name, value: response.data[i].id, class: 'ccreater_id' }) // 创建人
        }
        this.operatorOptions.unshift({ text: '超级管理员', value: '3,超级管理员', class: 'ccreater_id' })
      })
    },
    // 卡片
    getCount() {
      statistics().then(response => {
        this.boxlist[0].num = response.data.normal
        this.boxlist[1].num = response.data.dimission
      })
    },
    scaninputselect(value) {
      // 选项
    },
    searchlist(obj) {
      // if (obj.type === 'all') {
      //   delete this.listQuery.column
      //   delete this.listQuery.value
      // } else {
      if (obj.value === '') {
        delete this.tags[0]
      } else {
        let tagszh = {
          phone: '手机号码',
          name: '姓名'
        }
        this.tags[0] = { 'name': `${tagszh[ obj.type]}:${obj.value}`, 'type': obj.type }
      }
      this.listQuery.column = obj.type
      this.listQuery.value = obj.value
      // }
      this.listQuery.page = 1
      this.pageInit()
      this.getList()
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
      let actionTxt = ['批量设置教练', '批量取消教练', '批量禁用', '批量启用']
      let index = 0
      if (!this.groupOprate.ids.length) {
        this.common.message('warning', '请先选择员工')
        return
      }
      if (value === 'set') {
        this.$confirm(`是否${actionTxt[index]}?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          employeesGroupSet(this.groupOprate).then(res => {
            this.$init()
          }).catch(() => {
            this.common.Message('error', '操作失败！')
          })
        }).catch(() => {
          console.log('取消')
        })
      } else if (value === 'cansle') {
        index = 1
        this.$confirm(`是否${actionTxt[index]}?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          employeesGroupCansle(this.groupOprate).then(res => {
            this.$init()
          }).catch(() => {
            this.common.Message('error', '操作失败！')
          })
        }).catch(() => {
          console.log('取消')
        })
      } else if (value === 'forbbit') {
        index = 2
        this.$confirm(`是否${actionTxt[index]}?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          employeesGroupForbbite(this.groupOprate).then(res => {
            this.$init()
          }).catch(() => {
            this.common.Message('error', '操作失败！')
          })
        }).catch(() => {
          console.log('取消')
        })
      } else if (value === 'use') {
        index = 3
        this.$confirm(`是否${actionTxt[index]}?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          employeesGroupUse(this.groupOprate).then(res => {
            this.$init()
          }).catch(() => {
            this.common.Message('error', '操作失败！')
          })
        }).catch(() => {
          console.log('取消')
        })
      }
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.per_page = val
      this.getList()
    },
    // 添加/编辑弹框关闭时清楚数据
    addclose() {
      this.$refs.ruleForm.resetFields()
      this.ruleForm.desc = ''
      this.$refs.imgbox.deleteimgbtn()
      this.$refs.smallBox1.deleteimgbtn()
      this.$refs.smallBox2.deleteimgbtn()
      this.$refs.smallBox3.deleteimgbtn()
      this.$refs.smallBox4.deleteimgbtn()
    },
    handleEdit(index, id) {
      this.titleDialog = '编辑员工'
      this.isEdit = true
      this.editIndex = index
      this.dialogFormVisible = true
      this.ruleForm.id = id
      // 员工详情
      staffDetails(id).then(response => {
        this.ruleForm.name = response.data.name
        this.ruleForm.phone = response.data.phone
        // 获取角色
        this.ruleForm.role = getEmployeeSelectVule(this.options, response.data.role_id)
        this.ruleForm.post = response.data.post
        if (this.ruleForm.post === 1) {
          this.iscoach1 = true
        } else {
          this.iscoach1 = false
        }
        this.ruleForm.sex = response.data.sex
        this.ruleForm.status = response.data.status
        let starHour = response.data.start_work_time.split(':')[0]
        let starSeconds = response.data.start_work_time.split(':')[1]
        let endHour = response.data.end_work_time.split(':')[0]
        let endSeconds = response.data.end_work_time.split(':')[1]
        this.ruleForm.time = [new Date(2018, 1, 1, starHour, starSeconds), new Date(2018, 1, 1, endHour, endSeconds)]
        this.ruleForm.vacation_data = [response.data.vacation_time_from, response.data.vacation_time_to]
        this.ruleForm.egname = response.data.emergency_contact
        this.ruleForm.egphone = response.data.emergency_phone
        this.ruleForm.desc = response.data.introduce || ''
        this.tipLength = this.ruleForm.desc.length
        this.ruleForm.head_pic = response.data.head_portrait
        this.$nextTick(() => {
          this.$refs.imgbox.setImg(response.data.head_portrait)
          if (response.data.photos !== null) {
            let imgPhones = []
            for (let i = 0; i < response.data.photos.length; i++) {
              if (response.data.photos[i] !== '') {
                imgPhones.push(response.data.photos[i])
              }
            }
            if (imgPhones[0]) {
              this.$refs.smallBox1.setImg(imgPhones[0])
              this.ruleForm.photos[0] = imgPhones[0]
            }
            if (imgPhones[1]) {
              this.$refs.smallBox2.setImg(imgPhones[1])
              this.ruleForm.photos[1] = imgPhones[1]
            }
            if (imgPhones[2]) {
              this.$refs.smallBox3.setImg(imgPhones[2])
              this.ruleForm.photos[2] = imgPhones[2]
            }
            if (imgPhones[3]) {
              this.$refs.smallBox4.setImg(imgPhones[3])
              this.ruleForm.photos[3] = imgPhones[3]
            }
          }
        })
      })
    },
    editSure() {
      this.ruleForm.start = parseTime(this.ruleForm.time[0], '{h}:{i}:{s}')
      this.ruleForm.end = parseTime(this.ruleForm.time[1], '{h}:{i}:{s}')
      if (!this.ruleForm.vacation_data.length) {
        this.ruleForm.vacation_time_from = parseTime(this.ruleForm.vacation_data[0], '{y}-{m}-{d}')
        this.ruleForm.vacation_time_to = parseTime(this.ruleForm.vacation_data[1], '{y}-{m}-{d}')
      }
      if (!this.ruleForm.head_pic) {
        this.common.message('warning', '头像不能为空')
        return false
      }
      if (!this.ruleForm.name.trim()) {
        this.common.message('warning', '姓名不能为空')
        return false
      }
      if (this.ruleForm.name.trim().length > 20) {
        this.common.message('warning', '姓名长度过长')
        return false
      }
      if (this.photo1) {
        this.ruleForm.photos[0] = this.photo1
      }
      if (this.photo2) {
        this.ruleForm.photos[1] = this.photo2
      }
      if (this.photo3) {
        this.ruleForm.photos[2] = this.photo3
      }
      if (this.photo4) {
        this.ruleForm.photos[3] = this.photo4
      }
      if (!this.ruleForm.time) {
        this.common.message('warning', '上班时间不能为空')
        return false
      }
      this.ruleForm.photos = this.filterPhotos(this.ruleForm.photos)
      if (this.iscoach1) {
        this.ruleForm.post = 1
      } else {
        this.ruleForm.post = 0
      }
      this.loading = true
      this.$store.dispatch('EditEmployee', this.ruleForm).then((res) => {
        this.loading = false
        this.$notify({
          title: '成功',
          message: '修改成功',
          type: 'success',
          duration: 2000
        })
        this.dialogFormVisible = false
        this.tableList = []
        this.getList()
        // let data = res
        // if (data.post === 1) {
        //   data.isPost = true
        // } else {
        //   data.isPost = false
        // }
        // this.$set(this.tableList, this.editIndex, data)
        // this.tableList[this.editIndex] = data
      }).catch(() => {
        this.loading = false
      })
    },
    chooseIsPost(index, row) {
      let middleIsPost = !row.isPost
      let post = 0
      if (row.post !== 1) {
        post = 1
      }
      const data = {
        id: row.id,
        role: row.role_id,
        name: row.name,
        phone: row.phone,
        head_pic: row.head_portrait,
        start: row.start_work_time,
        end: row.end_work_time,
        status: row.status,
        post: post,
        egname: row.emergency_contact,
        egphone: row.emergency_phone,
        sex: row.sex,
        desc: row.introduce,
        photos: row.photos === null ? [] : row.photos
      }
      this.$store.dispatch('EditEmployee', data).then(() => {
        this.loading = false
        this.$notify({
          title: '成功',
          message: '修改成功',
          type: 'success',
          duration: 2000
        })
        this.dialogFormVisible = false
        if (post === 1) {
          row.post = 1
          row.isPost = true
          this.$set(this.tableList, index, row)
        } else {
          row.post = 0
          row.isPost = false
          this.$set(this.tableList, index, row)
        }
      }).catch(() => {
        this.loading = false
        row.isPost = middleIsPost
        this.$set(this.tableList, index, row)
      })
    },
    staffAdd() {
      this.titleDialog = '添加员工'
      this.isEdit = false
      this.dialogFormVisible = true
    },
    addSure() {
      if (!this.ruleForm.head_pic) {
        this.common.message('warning', '头像不能为空')
        return false
      }
      if (!this.ruleForm.name.trim()) {
        this.common.message('warning', '姓名不能为空')
        return false
      }
      if (this.ruleForm.name.trim().length > 20) {
        this.common.message('warning', '姓名长度过长')
        return false
      }
      if (this.iscoach1) {
        this.ruleForm.post = 1
      } else {
        this.ruleForm.post = 0
      }
      if (this.photo1) {
        this.ruleForm.photos[0] = this.photo1
      }
      if (this.photo2) {
        this.ruleForm.photos[1] = this.photo2
      }
      if (this.photo3) {
        this.ruleForm.photos[2] = this.photo3
      }
      if (this.photo4) {
        this.ruleForm.photos[3] = this.photo4
      }
      if (!this.ruleForm.time) {
        this.common.message('warning', '上班时间不能为空')
        return false
      }
      this.ruleForm.photos = this.filterPhotos(this.ruleForm.photos)
      this.ruleForm.start = parseTime(this.ruleForm.time[0], '{h}:{i}:{s}')
      this.ruleForm.end = parseTime(this.ruleForm.time[1], '{h}:{i}:{s}')
      this.loading = true
      this.$store.dispatch('AddEmployee', this.ruleForm).then((res) => {
        this.loading = false
        this.$notify({
          title: '成功',
          message: '添加成功',
          type: 'success',
          duration: 2000
        })
        this.dialogFormVisible = false
        this.tableList = []
        this.$init()
        // if (res.post === 1) {
        //   res.isPost = true
        // } else {
        //   res.isPost = false
        // }
        // this.tableList.unshift(res)
      }).catch(() => {
        this.loading = false
      })
    },
    filterPhotos(arr) {
      let newarr = []
      for (let item of arr) {
        if (item) {
          newarr.push(item)
        }
      }
      return newarr
    },
    // 禁用
    handleDelete(index, rows) {
      this.deleteForm = Object.assign({}, rows)
      this.deleteForm.nowIndex = index
      this.deleteDialogVisible = true
    },
    deleteSure() {
      // const data = {
      //   id: this.deleteForm.id,
      //   role: this.deleteForm.role_id,
      //   name: this.deleteForm.name,
      //   phone: this.deleteForm.phone,
      //   head_pic: this.deleteForm.head_portrait,
      //   start: this.deleteForm.start_work_time,
      //   end: this.deleteForm.end_work_time,
      //   status: 3,
      //   post: this.deleteForm.post,
      //   egname: this.deleteForm.emergency_contact,
      //   egphone: this.deleteForm.emergency_phone,
      //   sex: this.deleteForm.sex,
      //   desc: this.deleteForm.introduce,
      //   photos: this.deleteForm.photos === null ? [] : this.deleteForm.photos
      // }
      this.delLoading = true
      employeeDisable(this.deleteForm.id).then(res => {
        this.delLoading = false
        this.$notify({
          title: '成功',
          message: '禁用成功',
          type: 'success',
          duration: 2000
        })
        this.tableList[this.deleteForm.nowIndex].status = 2
        this.deleteDialogVisible = false
        this.$init()
      }).catch(() => {
        this.delLoading = false
      })
    },
    // 启用
    handleUse(index, rows) {
      this.deleteForm = Object.assign({}, rows)
      this.deleteForm.nowIndex = index
      this.useDialogVisible = true
    },
    useSure() {
      // const data = {
      //   id: this.deleteForm.id,
      //   role: this.deleteForm.role_id,
      //   name: this.deleteForm.name,
      //   phone: this.deleteForm.phone,
      //   head_pic: this.deleteForm.head_portrait,
      //   start: this.deleteForm.start_work_time,
      //   end: this.deleteForm.end_work_time,
      //   status: 1,
      //   post: this.deleteForm.post,
      //   egname: this.deleteForm.emergency_contact,
      //   egphone: this.deleteForm.emergency_phone,
      //   sex: this.deleteForm.sex,
      //   desc: this.deleteForm.introduce,
      //   photos: this.deleteForm.photos === null ? [] : this.deleteForm.photos
      // }
      this.delLoading = true
      employeeEnable(this.deleteForm.id).then(res => {
        this.delLoading = false
        this.$notify({
          title: '成功',
          message: '启用成功',
          type: 'success',
          duration: 2000
        })
        this.tableList[this.deleteForm.nowIndex].status = 1
        this.useDialogVisible = false
        this.$init()
      }).catch(() => {
        this.delLoading = false
      })
    },
    toCansleBindApp(param) {
      this.appCansleDialogVisible = true
      this.bindCansleForm.phoneByApp = param.phone
      this.bindCansleForm.id = param.id
    },
    // 绑定tag
    toBindApp(param) {
      this.appDialogVisible = true
      this.bindForm.phoneByApp = param.phone
      this.bindForm.id = param.id
    },
    // 修改绑定电话
    updateBindApp(phone, id) {
      this.appDialogVisible = true
      this.bindForm.id = id
      this.bindForm.phoneByApp = phone
    },
    bindCansleSure() {
      this.bindCansleloading = true
      unbindAppByPhone(this.bindCansleForm.id).then((res) => {
        if (res) {
          this.bindCansleloading = false
          this.appCansleDialogVisible = false
          this.common.message('success', '解绑成功')
          this.getList()
        }
        this.bindCansleloading = false
      }).catch(() => {
        this.bindCansleloading = false
      })
    },
    bindSure() {
      if (!this.bindForm.phoneByApp.trim()) {
        this.common.message('warning', '电话号码不能为空')
        return false
      }
      if (!testphone(this.bindForm.phoneByApp)) {
        this.common.message('warning', '电话号码不正确')
        return false
      }
      this.bindloading = true
      bindAppByPhone(this.bindForm).then((res) => {
        if (res) {
          this.bindloading = false
          this.appDialogVisible = false
          this.common.message('success', '绑定成功')
          this.getList()
        }
        this.bindloading = false
      }).catch(() => {
        this.bindloading = false
      })
    },
    $init() {
      this.getList()
      this.getCount()
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
  filters: {},
  destroyed() {
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg:#2d3a4b;
$light_gray:#eee;
$dark_gray:#889aa4;
.imgshow {
  float: left;
  margin-right: 4px;
  margin-bottom: 4px;
}
.imgal {
  margin-left: 70px;
}
.box{
  margin: 20px;
}
.boxser {
  overflow: hidden;
}
.staffAdd{
  background: rgb(51, 51, 51);
  margin-left: 20px;
  color: #fff;
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
.upload-demo {
  width: 220px;
  margin-left: 80px;
}
.cursoractive {
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
.staff-dialog /deep/{
  .el-dialog__header {
    border-bottom: 1px solid #ccc;
  }
}
.black {
  background: #000;
  border: 1px solid #000;
}
.ruleForm {
  margin-top: 30px;
}
.hr {
  width: 100%;
  height: 1px;
  background: #ccc;
  margin-bottom: 30px;
}
.descripts{
  width: 300px;
  height: 175px;
  border: 1px solid #ddd;
  outline: none;
}
.staff-dialog{
  .el-dialog {
    width: 960px;
  }
}
.dialog-footer {
  text-align: center;
}
.cursorbox {
  float: left;
}
.tips {
  display: block;
  width: 408px;
  text-align: right;
  margin-top: -20px;
  color: #ccc;
  font-weight: normal;
}
.upload-box {
  position: relative;
  margin-top: 30px;
  text-align: center;
  .avatar-title {
    position: absolute;
    top: 5px;
    left: 30px;
  }
}
.divBox {
  position: relative;
  .avatar-title{
    position: absolute;
    top: 5px;
    left: 15px;
  }
  .div-img-box {
     margin-left: 75px;
  }
  .div-upload1 {
    margin-left: 70px;
    margin-bottom: 10px;
    margin-right: 5px;
  }
  .div-upload {
    width: 168.1px;
    height: 94.1px;
    line-height: 94.1px;
    display: inline-block;
    border: 1px solid #ccc;
    text-align: center;
    .el-icon-upload2 {
      font-size: 24px;
      color: #ccc;
    }
  }
}
.show-pwd {
  position: absolute;
  right: 31px;
  top: 3px;
  font-size: 16px;
  color: $dark_gray;
  cursor: pointer;
  user-select: none;
}
.tag {
  padding: 1px 10px;
  border-radius: 4px;
  font-size: 14px;
}
.success {
  background-color: rgba(103,194,58,.1);
  border: 1px solid rgba(64,158,255,.2);
  color: #67c23a;
  cursor: pointer;
}
.warning {
  background-color: rgba(230,162,60,.1);
  border: 1px solid rgba(64,158,255,.2);
  color: #e6a23c;
  cursor: pointer;
}
.dialog-footer {
  .black {
    background: #000;
    border: 1px solid #000;
  }
  .gray {
    background:#ddd;
    border-color: #ddd;
  }
}

.prompt{
  font-size: 14px;
  color: #999999;
  text-align: left;
}
.down-prompt{
  font-size: 16px;
  line-height: 0px;
  margin-top: 8px;
}
.bing-phone-box{
  /deep/ .el-form-item{
    margin-bottom: 10px;
    /deep/ .el-form-item__label{
      text-align: left;
    }
  }
}
.check-table {
  /deep/ .success{
    background: rgba(26,179,148,0.10);
    border: 1px solid #1AB394;
    color: #1AB394;
  }
}
</style>
