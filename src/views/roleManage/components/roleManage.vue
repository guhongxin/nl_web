<template>
  <div class="app-container documentation-container">
    <div class="find-box4">
      <div style="overflow:hidden" class="filter-container">
        <div style="overflow:hidden">
          <!-- <el-input placeholder="请输入要查询的角色名称" v-model="searchRoleName" v-on:keyup.enter.native="search" class="input-with-select">
            <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
          </el-input> -->
          <scan-input :select="searchSelect" :defaultSelect="searchSelect[0].value" @kedownOver="searchlist" :placeholder="placeholder" ref="scanIputDoc"></scan-input>
          <el-button class="lf staffAdd" @click="addrole" v-if="btnRoleList['5-2-1']"><i class="el-icon-plus"></i> 添加角色</el-button>
          <bulk-action :select="bulkAction" @changeBulk="searchGroup" v-if="btnRoleList['5-2-5']"></bulk-action>
          <span class="Rrrefresh" @click="__init">
            <el-button icon="el-icon-refresh" circle></el-button>
          </span>
        </div>
       </div>
      <!-- <bulk-action></bulk-action> -->
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
    <el-table @filter-change="filterChange" @sort-change="sortChange" stripe :key='tableKey' :data="tableDataList" v-loading="listLoading" element-loading-text="列表正在加载中" border fit highlight-current-row
      style="width: 100%;" class="check-table" @selection-change="selectionChange">
      <el-table-column align="center" type="selection" width="55px"></el-table-column>

      <el-table-column align="center" :label="'角色名称'" width="200" prop="name" 
      column-key="name" :filters="nameOptions" filter-placement="bottom-end" :filter-multiple="false">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>

  	  <el-table-column align="center" :label="'角色描述'" width="600" prop="scope.row.desc">
        <template slot-scope="scope">
          <span>{{scope.row.desc?scope.row.desc:'-'}}</span>
        </template>
      </el-table-column>

  	  <el-table-column width="200px" align="center" 
        label="添加时间<i onclick='openDate(event)' data=[2,'created_at_sdate','created_at_edate'] class='el-icon-date' title='添加时间'></i>"
        sortable="custom" prop="created_at_sort">
        <template slot-scope="scope">
          <span>{{scope.row.created_at}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="'添加人'" width="200" prop="creater_id"
      column-key="creater_id" :filters="createrOptions" filter-placement="bottom-end" :filter-multiple="false">
        <template slot-scope="scope">
          <span>{{scope.row.opter?scope.row.opter.name:'管理员'}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="'员工数量'" width="150" sortable='custom' prop="sort_emp_count">
        <template slot-scope="scope">
          <span>{{scope.row.employee_count}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" fixed="right" :label="$t('table.actions')" min-width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="success" plain
          @click="allocate(scope.$index, scope.row)" v-if="btnRoleList['5-2-2']">权限分配</el-button>
          <el-button size="mini" type="primary" plain
          @click="handleEdit(scope.$index, scope.row)" v-if="btnRoleList['5-2-3']">编辑</el-button>
          <el-button size="mini" type="danger" plain
          @click="handleDelete(scope.$index, scope.row)" v-if="btnRoleList['5-2-4']">删除</el-button>
          <!-- <el-dropdown trigger="click">
            <el-button size="mini" type="danger" plain  v-if="btnRoleList['5-2-4']">删除</el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="handleDelete(scope.$index, scope.row)">确定</el-dropdown-item>
              <el-dropdown-item>取消</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown> -->
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination 
        v-if="paginationShow"
        background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
        :page-sizes="[10,20,30,50]" :page-size="listQuery.per_page" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    
    <el-dialog
      title="添加角色"
      :visible.sync="addDialogVisible"
      :close-on-click-modal="false" 
      width="600px" class="addRole"
      @close="addclose"
      >
      <el-form ref="formbox" :model="formData" autoComplete="on" label-width="80px">
        <div class="t-c">
          角色名称：
          <el-input
            placeholder="请输入角色名称"
            v-model="formData.name" :maxlength="12">
          </el-input>
        </div>
        <div class="t-c">
          权限模板：
          <el-select v-model="selectTemplate" placeholder="请选择" size="medium" @change="selectTemplateChange" @focus='selectTemplateFoce'>
            <el-option-group
              v-for="group in options"
              :key="group.label"
              :label="group.label">
              <el-option
                v-for="item in group.options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :disabled="item.able">
              </el-option>
            </el-option-group>
          </el-select>
        </div>
        <div class="t-c">
          &nbsp;&nbsp;角色描述：
          <el-input
            type="textarea"
            :rows="2"
            :maxlength="20"
            placeholder="请输入角色描述，长度不可超过20个"
            v-model="formData.desc" size="medium">
          </el-input>
          <span class="t-ctip" :class="{txtTs:formData.desc.length===20}">{{formData.desc.length}}/20</span>
        </div>
        <div style="text-align:center;">
          <span slot="footer" class="dialog-footer">
            <el-button @click="addPermissions" class="black" :loading="addPermissionsLoading">确 定</el-button>
          </span>
        </div>
      </el-form>
    </el-dialog>

    <el-dialog
      title="权限分配"
      :visible.sync="centerDialogVisible1"
      width="900px" class="jurisdiction"
      :before-close="jurisdictionDialog"
      >
      <el-tabs v-model="activeName1" type="border-card" @tab-click="handleClick" class="tabend" :tab-position="tabPosition">
        <el-tab-pane v-if="item.label !== '404'" :label="item.label" :disabled="item.id === 'apppower'" :name="item.label" v-for="(item, index) in allroletree" :key="index">
          <div class="button-box">
            <!-- <el-button class="all-juris" type="primary" @click="chooseone(index, item)">选择首层</el-button> -->
            <!-- <el-button class="all-juris" type="primary" @click="choosesecond(index, item)">选择次层</el-button> -->
            <el-button class="all-juris" type="primary" @click="setCheckedKeys(index, item)">本页全部</el-button>
            <!-- <el-button class="all-juris" type="primary" @click="setCheckedKeys(index, item)">选择本页全部</el-button>
            <el-button class="all-juris" type="primary" @click="chooseDomAll(index, item)">选择节点全部</el-button> -->
            <el-button class="clear" @click="resetChecked(index)">清空</el-button>
          </div>
          <el-tree
            :data="item.children"
            show-checkbox
            default-expand-all
            :check-strictly="false"
            node-key="id"
            ref="tree"
            highlight-current
            :props="defaultProps">
          </el-tree>
          <!-- <div v-if="item.children" v-for="(child, childindex) in item.children" :key="childindex" class="b-box font-w">
            <el-checkbox v-model="child.tab.tab_check">{{child.tab.tab_name}}</el-checkbox>
            <div v-if="item.children[childindex].btn_list" v-for="(btnitem, btnindex) in item.children[childindex].btn_list" :key="btnindex" class="b-box t-box">
              <el-checkbox v-model="btnitem.btn_check">{{btnitem.btn_name}}</el-checkbox>
            </div>
          </div> -->
        </el-tab-pane>
      </el-tabs>
      <el-button class="btn-sure" @click="getCheckedNodes" :loading="getCheckedNodesLoading">确定</el-button>
    </el-dialog>
    <!-- 删除 -->
    <el-dialog
      title="提示"
      :visible.sync="deleteDialogVisible"
      width="490px"
      class="course-dialog" style="margin-top: 28vh;">
      <div style="color:#000;text-align:center;font-size:18px;margin:20px 0;">确定要删除选中的角色模板？</div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" class="black" style="padding:10px 34px;" @click="deleteSure" :loading="delLoading">确定</el-button>
      </span>
    </el-dialog>

    <edite-role-popue
      :title="'编辑角色'"
      :visibleDialog="editeRoleDialogVisible"
      @befor-close="editeRoleDialogClose"
      ref="editeRoleDoc"
      @btnOk='editeRoleDialogbtnOk'>
    </edite-role-popue>
    <dateRange @timeChange="timeChange"></dateRange>
  </div>
</template>

<script>
import { roleList, deleteRolesBatch, updateRoles, addRoles, updateAuthor, deleteRoles } from '@/api/role'
import { employeeList } from '@/api/employee'
import bulkAction from '@/components/bulkAction'
import roletree from '@/role/roletree'
import EditeRolePopue from './editeRolePopue'
import ScanInput from '@/components/scanInput'
import dateRange from '@/components/dateRange'
// import { setSession } from '@/utils/auth'

export default {
  name: 'roleManage',
  components: {
    bulkAction,
    EditeRolePopue,
    ScanInput,
    dateRange
  },
  data() {
    return {
      tags: [],
      nameOptions: [], // 角色名称
      createrOptions: [], // 添加人
      btnRoleList: {},
      listbtnd: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      formData: {
        name: '',
        desc: '',
        menus: []
      },
      allroletree: roletree,
      searchRoleName: '',
      loading: false,
      addDialogVisible: false,
      deleteDialogVisible: false,
      select: '',
      searchval: '',
      tableKey: 0,
      tableDataList: null,
      total: null,
      listLoading: true,
      showReviewer: false,
      listQuery: {
        page: 1,
        per_page: 10
      },
      options: [{
        label: '',
        options: []
      }, {
        label: '我的模板',
        options: []
      }],
      selectTemplate: null,
      searchGroupBtn: '',
      sexindex: 0,
      manindex: 0,
      cardIndex: 0,
      value1: true,
      delLoading: false,
      deleteId: '',
      centerDialogVisible: false,
      centerDialogVisible1: false,
      name: '',
      desc: '',
      activeName1: roletree[1].label,
      tabPosition: 'left',
      checked: false,
      iscoach: true,
      $menus: [],
      $permissions: [],
      editeRoleDialogVisible: false,
      isRowRole: false, // 判断是否是添加行为或者行内分配权限行为
      editeFormData: {
        id: undefined,
        name: undefined,
        desc: undefined,
        menus: undefined,
        permissions: undefined
      },
      searchSelect: [{ // 查询列表
        text: '角色名称',
        value: 'name'
      }, {
        text: '角色描述',
        value: 'desc'
      }, {
        text: '添加人',
        value: 'creater_name'
      }],
      placeholder: '输入要查询的内容',
      bulkAction: [{
        label: '批量删除',
        value: 'delete',
        key: '5-2-5'
      }],
      groupOprate: {
        ids: []
      },
      mobileDefaultRole: [
        { id: '业绩统计', path: 'apppower', permissons: [] },
        { id: '客户管理', path: 'apppower', permissons: [] },
        { id: '私教管理', path: 'apppower', permissons: [] },
        // { id: '团课管理', path: 'apppower', permissons: [] }
        // { id: '运营实况', path: 'apppower', permissons: [] },
        // { id: '数据报表', path: 'apppower', permissons: [] }
      ],
      paginationShow: true,
      addPermissionsLoading: false, // 添加角色
      getCheckedNodesLoading: false
    }
  },
  computed: {
  },
  created() {
    this.__init()
    this.getCreaterAll() // 获得表头添加人
  },
  mounted() {
  },
  methods: {
    __init() {
      this.common.eachBtnRole(this.btnRoleList) // 按钮权限方法
      this.getList()
    },
    allocate(index, row) {
      [this.editeFormData.id, this.editeFormData.name, this.editeFormData.desc] = [row.id, row.name, row.desc]
      this.centerDialogVisible1 = true
      this.isRowRole = true
      let role = row.menus.map(x => {
        if (!x.path || x.path === 'apppower') {
          return x.id
        }
      })
      console.log(role)
      this.$nextTick(() => {
        for (let item of this.$refs.tree) {
          item.setCheckedKeys(role)
        }
      })
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    getCheckedNodes() {
      let allRole = []
      let leng = roletree.length
      let i = 0
      this.$menus = []
      while (leng > i) {
        let ar = this.$refs.tree[i].getCheckedNodes(false)
        let halfar = this.$refs.tree[i].getHalfCheckedNodes(false)
        for (let item of ar) {
          allRole.push(item)
        }
        for (let item of halfar) {
          allRole.push(item)
        }
        i++
      }
      if (!allRole.length) {
        this.common.notify('注意', 'error', '您未选择任何权限，不可操作')
        return
      }
      for (let cur of allRole) {
        let curtime = cur.id.split('-')
        if (curtime.length === 2) {
          for (let allcur of roletree) {
            if (curtime[0] === allcur.id) {
              allRole.push(allcur)
            }
          }
        }
      }
      let last = [...new Set(allRole)]
      let overRole = last.map(x => { return { path: x.path, id: x.id, permissons: x.permissons } })
      let _permissions = []
      for (let ies of overRole) {
        if (ies.permissons && ies.permissons.length) {
          for (let op of ies.permissons) {
            _permissions.push(op)
          }
        }
      }
      // 新增权限模板选择其它
      // if ((this.selectTemplate === 0) && !(this.selectTemplate === null)) {
      //   this.$menus = overRole // menus Array  菜单
      //   this.$permissions = _permissions // permissions Array  权限码
      // } else {
      //   [this.editeFormData.menus, this.editeFormData.permissions] = [overRole, _permissions]
      //   console.log(this.editeFormData)
      //   this.updateAuthorOK(this.editeFormData)
      // }
      [this.editeFormData.menus, this.editeFormData.permissions] = [overRole, _permissions]
      this.updateAuthorOK(this.editeFormData)
      // setSession('role', JSON.stringify(overRole))
      this.centerDialogVisible1 = false
    },
    getCheckedKeys(index) {
      console.log(this.$refs.tree[index].getCheckedKeys())
    },
    chooseone(index, object) {
      let arr = [object.id]
      for (let i = 0; i < object.children.length; i++) {
        arr.push(object.children[i].id)
      }
      this.$refs.tree[index].setCheckedKeys(arr)
    },
    choosesecond(index, object) {
      let arr = [object.id]
      for (let i = 0; i < object.children.length; i++) {
        arr.push(object.children[i].id)
        if (object.children[i].children) {
          for (let j = 0; j < object.children[i].children.length; j++) {
            arr.push(object.children[i].children[j].id)
          }
        }
      }
      console.log(arr)
      this.$refs.tree[index].setCheckedKeys(arr)
    },
    setCheckedKeys(index, object) {
      this.listbtnd = [object.id]
      this.diguibianl(object)
      this.$refs.tree[index].setCheckedKeys(this.listbtnd)
    },
    diguibianl(object) {
      let self = this
      if (object.children) {
        for (let item of object.children) {
          self.listbtnd.push(item.id)
          if (item.children) {
            self.diguibianl(item)
          }
        }
      }
    },
    resetChecked(index) {
      this.listbtnd = []
      this.$refs.tree[index].setCheckedKeys([])
    },
    allCheck(item, type) {
      item.tab.tab_check = type
      if (item.children.length) {
        for (let pageitem of item.children) {
          pageitem.tab.tab_check = type
        }
      }
    },
    getRoleAll() {
      roleList().then(response => {
        this.nameOptions = []
        for (let i = 0; i < response.data.length; i++) {
          this.$set(this.nameOptions, i, { text: response.data[i].name, value: response.data[i].id + ',' + response.data[i].name, class: 'cname' })
        }
      })
    },
    getCreaterAll() {
      employeeList().then(response => {
        // for (let i = 0; i < response.data.length; i++) {
        //   this.createrOptions.push(this.nameOptions, i, { text: response.data[i].name, value: response.data[i].id + ',' + response.data[i].name, class: 'ccreater_name' })
        // }
        for (let i = 0; i < response.data.length; i++) {
          this.createrOptions.push({ text: response.data[i].name, value: response.data[i].id + ',' + response.data[i].name, class: 'ccreater_id' }) // 创建人
        }
        this.createrOptions.unshift({ text: '超级管理员', value: '3,超级管理员', class: 'ccreater_id' })
      })
    },
    tagclose(tag, index) {
      this.common.tagFilter(this, tag, index, this.searchSelect)
    },
    sortChange(data) {
      this.common.sortFilter(this, data)
    },
    filterChange(data) {
      for (let key in data) {
        if (data[key].length !== 0) {
          this.listQuery[key] = data[key][0].split(',')[0]
          this.lotFilter(data, key)
        } else {
          this.listQuery[key] = undefined
          this.lotFilter(data, key)
        }
      }
      this.listQuery.page = 1
      this.pageInit()
      this.getList()
    },
    lotFilter(data, key) {
      let font = ''
      if (data[key].length) {
        font = data[key][0].split(',')[1]
      }
      if (key === 'name') {
        this.hostFilter(data, key, 1, '角色名称：：' + font)
      }
      if (key === 'creater_id') {
        this.hostFilter(data, key, 3, '添加人：' + font)
      }
    },
    hostFilter(data, key, index, text) {
      if (data[key].length === 0) {
        delete this.tags[index]
      } else {
        this.$set(this.tags, index, { name: text, type: key })
      }
    },
    addclose() {
      this.$refs.formbox.resetFields()
      this.loading = false
    },
    addrole() {
      this.isRowRole = false
      this.selectTemplate = null
      this.options[0].options = []
      this.options[1].options = []
      // 新增权限 生成下拉选择项
      let _length = this.tableDataList.length
      if (_length > 0) {
        for (let i = 0; i < this.tableDataList.length; i++) {
          let obj = {
            label: this.tableDataList[i].name,
            desc: this.tableDataList[i].desc,
            menus: this.tableDataList[i].menus,
            permissions: this.tableDataList[i].permissions,
            value: i + 1
          }
          this.options[1].options.push(obj)
        }
      } else {
        this.options[1].options.push({ label: '无模板', able: true })
      }
      this.options[0].options = [{ value: 0, label: '自定义模板' }]
      this.formData.name = ''
      this.formData.desc = ''
      this.addDialogVisible = true
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
    filterSex(value, row, column) {
      if (this.sexindex === 0) {
        this.listQuery.sex = value
        this.getList()
        this.sexindex = 1
      } else {
        return false
      }
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
    filterCard(value, row, column) {
      if (this.cardIndex === 0) {
        this.listQuery.coachTime = value
        this.getList()
        this.cardIndex = 1
      } else {
        return false
      }
    },
    getList() {
      this.listLoading = true
      roleList(this.listQuery).then(response => {
        this.tableDataList = response.data
        this.total = Number(response.headers.pagination.split(',')[1])
        this.listLoading = false
      })
      this.getRoleAll() // 获得表头角色
    },
    search() {
      if (this.searchRoleName) {
        this.listQuery.column = 'name'
        this.listQuery.value = this.searchRoleName
      } else {
        delete this.listQuery.column
        delete this.listQuery.value
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
    handleDelete(index, row) {
      this.deleteId = row.id
      this.deleteDialogVisible = true
      // deleteRolesBatch({ ids }).then(res => {
      //   this.common.notify('提示', 'success', '删除模板成功')
      //   this.getList()
      // }).catch(err => {
      //   console.log(err)
      // })
    },
    deleteSure() {
      this.delLoading = true
      deleteRoles(this.deleteId).then(res => {
        this.delLoading = false
        this.common.message('success', '删除角色成功！')
        this.deleteDialogVisible = false
        this.getList()
      }).catch(err => {
        this.delLoading = false
        console.log(err)
      })
    },
    /**
    * 编辑
    **/
    handleEdit(index, row) {
      // 编辑
      this.editeRoleDialogVisible = true
      this.$refs.editeRoleDoc.setDefaults(row)
    },
    editeRoleDialogClose() {
      // 关闭编辑弹窗
      this.editeRoleDialogVisible = false
    },
    editeRoleDialogbtnOk(param) {
      // 点击编辑弹窗确定按钮
      console.log('param', param)
      updateRoles(param).then(res => {
        this.$message({
          message: '修改信息成功',
          type: 'success'
        })
        this.$refs.editeRoleDoc.btnOkLoading = false
        this.editeRoleDialogVisible = false
        this.getList()
      }).catch(err => {
        console.log(err)
      })
    },
    handleClick(tab) {
      // console.log(tab)
    },
    /**
    * 新增权限
    **/
    addPermissions() {
      let _selectTemplate
      let obj
      if (this.selectTemplate === 0) {
        // 新增权限 选择其它点击确认
        // _selectTemplate = this.options[0].options[this.options[0].options.length - 1]
        // obj = {
        //   name: this.formData.name,
        //   desc: this.formData.desc,
        //   menus: this.$menus,
        //   permissions: this.$permissions
        // }
        let _mobileMenus = JSON.stringify(this.mobileDefaultRole)
        obj = {
          name: this.formData.name,
          desc: this.formData.desc,
          menus: [],
          permissions: []
        }
        // 设置默认值
        obj.menus = [...JSON.parse(_mobileMenus)]
      } else {
        // 新增权限 选择系统模板里面的项
        _selectTemplate = this.options[1].options[this.selectTemplate - 1]
        console.log('_selectTemplate', _selectTemplate)
        obj = {
          name: this.formData.name,
          desc: this.formData.desc,
          menus: _selectTemplate ? (_selectTemplate.menus ? _selectTemplate.menus : []) : [],
          permissions: _selectTemplate ? (_selectTemplate.permissions ? _selectTemplate.permissions : []) : []
        }
      }
      if (!obj.name) {
        this.common.message('error', '角色名称不能为空')
        return
      }
      if (this.selectTemplate === null) {
        this.common.message('error', '请选择权限模板')
        return
      }
      if (!obj.menus) {
        this.common.message('error', '请选择权限模板')
        return
      }
      if (obj.desc.length > 15) {
        this.common.message('error', '角色描述不可超过15个字符！')
        return
      }
      this.addPermissionsLoading = true
      addRoles(obj).then(res => {
        this.$message({
          message: '添加权限模板成功',
          type: 'success'
        })
        this.getList()
        this.addDialogVisible = false
        if (this.selectTemplate === 0) {
          this.allocate(0, res.data)
        }
        this.addPermissionsLoading = false
      }).catch(err => {
        console.log(err)
        this.addPermissionsLoading = false
      })
    },
    selectTemplateChange(value) {
      // 新增权限 选择其它弹出弹窗
      console.log('value', value)
      /*
      if (value === 0) {
        this.centerDialogVisible1 = true
        this.$nextTick(() => {
          for (let item of this.$refs.tree) {
            item.setCheckedKeys([])
          }
        })
      }
      */
    },
    selectTemplateFoce(e) {
      // 选择模板下拉 失去焦点触发
      this.selectTemplate = null
    },
    jurisdictionDialog() {
      this.selectTemplate = ''
      this.centerDialogVisible1 = false
    },
    searchlist(obj) {
      delete this.listQuery.column
      delete this.listQuery.value
      // 搜索
      if (obj.value === '') {
        delete this.tags[0]
      } else {
        let tagszh = {
          name: '角色名称',
          desc: '角色描述',
          creater_name: '添加人',
        }
        this.tags[0] = { 'name': `${tagszh[ obj.type]}:${obj.value}`, 'type': obj.type }
        this.listQuery.column = obj.type
        this.listQuery.value = obj.value
      }
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
      console.log('this.groupOprate', this.groupOprate)
      if (value === 'delete') {
        if (this.groupOprate.ids.length === 0) {
          this.common.message('warning', '请先选择员工')
          return
        }
        this.$confirm(`是否批量删除角色?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteRolesBatch(this.groupOprate).then(res => {
            this.common.message('success', '删除成功')
            this.getList()
          })
        }).catch(() => {
          console.log('取消')
        })
      }
    },
    updateAuthorOK(param) {
      this.getCheckedNodesLoading = true
      updateAuthor(param).then(res => {
        this.$message({
          message: '修改信息成功',
          type: 'success'
        })
        this.getList()
        this.getCheckedNodesLoading = false
      }).catch(err => {
        console.log(err)
        this.getCheckedNodesLoading = false
      })
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
$bg:#2d3a4b;
$light_gray:#eee;
.el-tree {
  overflow: hidden;
  /deep/ &>.el-tree-node{
    margin-bottom: 30px;
    >.el-tree-node__children>.el-tree-node{
      float: left;
    }
  }
}
.el-tabs {
  /deep/ .el-tabs__content {
    max-height: 720px;
    overflow: auto;
  }
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
.t-c {
  text-align: center;
  margin: 30px auto;
  // width: 400px;
  position: relative;
  .t-ctip {
    position: absolute;
    bottom: 5px;
    right: 90px;
  }
  .txtTs{
    color: red;
  }
}
.el-form{
  .t-c:not(:nth-of-type(3)){
    &::before{
      content: '*';
      color: red;
    }
  }
}
.tabend {
  /deep/ .is-disabled {
    font-size: 12px;
    background: #dcdfe6;
    color: #606266;
    font-weight: bolder;
    line-height: 30px;
    height: 30px;
  }
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
.pagination-container {
  text-align: right;
}
.cursorbox {
  float: left;
}
.jurisdiction {
  .clear {
    background: #000;
    color: #fff;
  }
  .button-box {
    margin-top: 20px;
    margin-bottom: 30px;
  }
  .b-box {
    margin-bottom: 30px;
  }
  .s-box {
    margin-bottom: 10px;
  }
  .t-box {
    margin-left: 30px;
  }
  .btn-sure {
    position: absolute;
    left: 15px;
    bottom: 30px;
    width: 160px;
    color: #fff;
    background: #1AB394;
  }
  /deep/ .el-tabs__item{
    padding-left: 20px;
  }
}
.dialog-footer .black {
  border: 1px solid #000;
  background: #000;
}
</style>
