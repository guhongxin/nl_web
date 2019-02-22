<template>
  <div>
    <div style="overflow:hidden" class="find-box4">
      <scan-input :select="searchSelect" :defaultSelect="searchSelect[0].value" @kedownOver="searchlist" :placeholder="placeholder" ref="scanIputDoc"></scan-input>
      <el-button @click="addCourse" v-if="btnRoleList['3-4-2-1']" class="addCourse"><i class="el-icon-plus"></i> 添加课程</el-button>
      <el-button @click="$refs.seatManagement.openModel()" class="addCourse">席位管理</el-button>
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
    <el-table ref="staffTable" @filter-change="filterChange" @sort-change="sortChange" stripe :key='tableKey' :data="tableList" v-loading="listLoading" element-loading-text="列表正在加载中" fit highlight-current-row
      style="width: 100%;" header-cell-class-name="bindonce" border class="check-table">
      <el-table-column align="center" :label="'课程类型'" width="150" column-key="effect"
      prop="effect" :filters="courseTypeOption" filter-placement="bottom-end" :filter-multiple="false">
        <template slot-scope="scope">
          <span>{{getCourseType(scope.row.effect)}}</span>
        </template>
      </el-table-column>

      <el-table-column width="150px" align="center" :label="'课程名称'" column-key="id"
      prop="id" :filters="courseOption" filter-placement="bottom-end" :filter-multiple="false">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>

      <el-table-column column-key="coach_id" align="center" :label="'教练名称'" width="120"
      prop="coach_id" :filters="coachOption" filter-placement="bottom-end" :filter-multiple="false">
        <template slot-scope="scope">
          <span>{{scope.row.coach?scope.row.coach.name:'-'}}</span>
        </template>
      </el-table-column>

      <el-table-column width="190px" align="center" :label="'课程价格'" prop="price_sort" sortable="custom">
        <template slot-scope="scope">
          <span>{{scope.row.price}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" column-key="role_id" :label="'上课地点'" width="150" prop="scope.row.role.name">
        <template slot-scope="scope">
          <span>{{scope.row.address}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="'上课人数'" width="150" prop="scope.row.post">
        <template slot-scope="scope">
          <span>{{scope.row.min_person}} - {{scope.row.max_person}}</span>
        </template>
      </el-table-column>

      <el-table-column width="150px" align="center" label="APP销售" prop="is_app_sale">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.isAppSell" active-text="" inactive-text="" @change="changeAppSell(scope.row)" :disabled="gymIsPass"></el-switch>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="'席位预约'" width="150" prop="scope.row.post">
        <template slot-scope="scope">
          <span :class="[scope.row.hall_id?'text-green':'text-red']">{{scope.row.hall_id?'开启':'关闭'}}</span>
        </template>
      </el-table-column>

      <el-table-column width="200px" align="center" label="添加时间<i onclick='openDate(event)' title='创建时间' class='el-icon-date'></i>" sortable="custom" prop="create_sort">
        <template slot-scope="scope">
          <span>{{scope.row.created_at}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="'添加人'" width="150" prop="employee_id" column-key="employee_id"
      :filters="operatorOption" filter-placement="bottom-end" :filter-multiple="false">
        <template slot-scope="scope">
          <span>{{scope.row.employee?scope.row.employee.name:'超级管理员'}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" fixed="right" :label="$t('table.actions')" min-width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleEdit(scope.row)" v-if="btnRoleList['3-4-2-2']">编辑</el-button>
          <el-button size="mini" type="success" @click="handleCourseSchedu(scope.row)" v-if="btnRoleList['3-4-2-3']">排期</el-button>
          <el-button size="mini" type="warning" @click="handleDelete(scope.row.id)" v-if="btnRoleList['3-4-2-4']">删除</el-button>
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

    <!-- 添加团课 -->
    <add-course-dialog
      @addCourseBtn='addCourseBtn'
      :hallsList="hallsList"
      :widthSize="'900px'"
      ref="addGroupCourseDoc">
    </add-course-dialog>

    <!-- 添加团课排期 -->
    <course-schedu-dialog
      :courseScheduMsg="courseScheduMsg"
      ref="addGroupCourseDateDoc">
    </course-schedu-dialog>

    <!-- 编辑团课 -->
    <edit-course-dialog
      v-if="centerDialogVisible2"
      :dialogVisible='centerDialogVisible2'
      :courseForm='courseMsg'
      @dialogClosed='dialogClosedEdit'
      @editCourseBtn='editCourseSure'
      :hallsList="hallsList"
      :widthSize="'900px'">
    </edit-course-dialog>

    <!-- 删除 -->
    <el-dialog
      title="删除团课"
      :visible.sync="deleteDialogVisible"
      width="490px"
      class="course-dialog" style="margin-top: 28vh;" :close-on-click-modal="false">
      <div style="color:#000;text-align:center;font-size:18px;margin:20px 0;">确定要删除当前选中的课程及其排期信息？</div>
      <div style="color:#000;text-align:center;font-size:18px;">提示：删除后会取消该课程的所有预约</div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" class="black" style="padding:10px 34px;" :loading="delLoading" @click="deleteGroupCourse">确定</el-button>
      </span>
    </el-dialog>

    <!--席位管理-->
    <seat-management @closeSeatModel="closeSeatModel" ref="seatManagement"></seat-management>

  </div>
</template>

<script>
import scanInput from '@/components/scanInput'
import addCourseDialog from './props/addCourse'
import editCourseDialog from './props/editCourse'
import courseScheduDialog from './props/courseSchedu'
import seatManagement from './props/seatManagement'
import { employeeList } from '@/api/employee'
import { newGroupCourseList, groupCourseNameList, deleteNewGroupCourse, appSellNewGroupCourse, gethallsList } from '@/api/course'
import { getSession } from '@/utils/auth'
export default {
  name: 'leagueLecture',
  components: {
    scanInput,
    addCourseDialog,
    editCourseDialog,
    courseScheduDialog,
    seatManagement
  },
  data() {
    return {
      tags: [],
      gymIsPass: true,
      btnRoleList: {},
      placeholder: '请扫码或输入要查询的内容',
      tableKey: 0,
      tableList: [],
      courseMsg: null,
      courseScheduMsg: null,
      deleteId: '',
      is_app_sale: 0,
      listLoading: false,
      delLoading: false,
      deleteDialogVisible: false,
      centerDialogVisible2: false,
      searchSelect: [{ // 查询列表
        text: '课程名称',
        value: 'name_like'
      }, {
        text: '教练姓名',
        value: 'coach_name_like'
      }, {
        text: '上课地点',
        value: 'address_like'
      }],
      paginationShow: true,
      listQuery: {
        page: 1,
        per_page: 10
      },
      total: null,
      courseTypeOption: [
        { text: '增肌', value: 'Z' + ',增肌', class: 'ceffect' },
        { text: '减脂', value: 'J' + ',减脂', class: 'ceffect' },
        { text: '塑形', value: 'S' + ',塑形', class: 'ceffect' },
      ],
      coachOption: [],
      operatorOption: [],
      courseOption: [],
      hallsList: []
    }
  },
  computed: {
  },
  created() {
    if (getSession('gymIsPass') === '1') { // 已审核
      this.gymIsPass = false
    } else {
      this.gymIsPass = true
    }
  },
  mounted() {
    this.__init()
    this.gethallsListMethods()
  },
  methods: {
    __init() {
      this.common.eachBtnRole(this.btnRoleList) // 按钮权限方法
      this.courseNameList()
      this.coachNameList()
      this.getList()
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
    searchlist(obj) {
      delete this.listQuery.name_like
      delete this.listQuery.coach_name_like
      delete this.listQuery.address_like
      if (obj.value === '') {
        delete this.tags[0]
      } else {
        let tagszh = {
          name_like: '课程名称',
          coach_name_like: '教练姓名',
          address_like: '上课地点'
        }
        this.tags[0] = { 'name': `${tagszh[ obj.type]}:${obj.value}`, 'type': obj.type }
        this.listQuery[obj.type] = obj.value
      }
      this.listQuery.page = 1
      this.pageInit()
      this.getList()
    },
    getList() {
      this.listLoading = true
      this.tableList = []
      newGroupCourseList(this.listQuery).then(response => {
        for (let i = 0; i < response.data.length; i++) {
          this.tableList.push(response.data[i])
          if (response.data[i].is_app_sale === 1) {
            this.tableList[i].isAppSell = true
          } else {
            this.tableList[i].isAppSell = false
          }
        }
        // this.tableList = response.data
        this.listLoading = false
        this.total = Number(response.headers.pagination.split(',')[1])
      })
    },
    // 点击添加按钮
    addCourse() {
      this.$refs.addGroupCourseDoc.dialogShow()
    },
    addCourseBtn() {
      this.getList()
    },
    // 修改课程确定
    handleEdit(obj) {
      this.courseMsg = Object.assign(obj)
      this.centerDialogVisible2 = true
    },
    dialogClosedEdit() {
      this.centerDialogVisible2 = false
    },
    editCourseSure(obj) {
      this.centerDialogVisible2 = false
      this.getList()
    },
    // 排期
    handleCourseSchedu(obj) {
      this.courseScheduMsg = Object.assign(obj)
      this.$refs.addGroupCourseDateDoc.dialogShow()
      this.$refs.addGroupCourseDateDoc.isShowFalse()
    },
    handleDelete(id) {
      this.deleteId = id
      this.deleteDialogVisible = true
    },
    // 删除
    deleteGroupCourse() {
      this.delLoading = true
      deleteNewGroupCourse(this.deleteId).then((res) => {
        this.delLoading = false
        this.common.message('success', '删除成功')
        this.getList()
        this.deleteDialogVisible = false
      }).catch(() => {
        this.delLoading = false
      })
    },
    // app销售
    changeAppSell(obj) {
      let id = obj.id
      if (obj.isAppSell) {
        this.is_app_sale = 1
      } else {
        this.is_app_sale = 0
      }
      let data = { is_app_sale: parseInt(this.is_app_sale) }
      appSellNewGroupCourse(id, data).then((res) => {
        this.common.message('success', '修改成功')
        this.getList()
      }).catch(() => {
      })
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.pre_page = val
      this.getList()
    },
    courseNameList() {
      groupCourseNameList().then(response => {
        for (let i = 0; i < response.data.length; i++) {
          this.courseOption.push({ text: response.data[i].name, value: response.data[i].id + ',' + response.data[i].name, class: 'cid' })
        }
      })
    },
    coachNameList() {
      employeeList().then(response => {
        for (let i = 0; i < response.data.length; i++) {
          if (response.data[i].post === 1) {
            this.coachOption.push({ text: response.data[i].name, value: response.data[i].id + ',' + response.data[i].name, class: 'ccoach_id' })
          }
          this.operatorOption.push({ text: response.data[i].name, value: response.data[i].id + ',' + response.data[i].name, class: 'cemployee_id' })
        }
      })
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
      this.common.sortFilter(this, data)
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
        if (key !== 'customer_sex') {
          font = data[key][0].split(',')[1]
        }
      }
      if (key === 'effect') {
        this.hostFilter(data, key, 1, '课程类型：' + font)
      }
      if (key === 'id') {
        this.hostFilter(data, key, 2, '课程类名称：' + font)
      }
      if (key === 'coach_id') {
        this.hostFilter(data, key, 3, '教练名称：' + font)
      }
      if (key === 'employee_id') {
        this.hostFilter(data, key, 4, '添加人：' + font)
      }
    },
    hostFilter(data, key, index, text) {
      if (data[key].length === 0) {
        delete this.tags[index]
      } else {
        this.$set(this.tags, index, { name: text, type: key })
      }
    },
    /* 获取席位列表 */
    gethallsListMethods() {
      gethallsList().then(res => {
        this.hallsList = res.data
      })
    },
    closeSeatModel() {
      this.gethallsListMethods()
    }
  },
  filters: {},
  destroyed() {
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.addCourse {
  margin-left: 10px;
  border: 1px solid #333;
  background: #333;
  color: #fff;
}
.spanBtn {
  color: rgb(64,158,255);
  cursor: pointer;
  margin: 10px;
}
.spanBtn:hover {
  color: #000;
}
.dialog-footer {
  .black {
    background: #000;
    border: 1px solid #000;
  }
}
.text-red {
  color: #F14C30;
}
.text-green {
  color: #1AB394;
}
</style>
