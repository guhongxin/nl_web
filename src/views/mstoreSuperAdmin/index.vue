<template>
  <div class="mstoreSuperAdmin">
    <div class="mstoreSuperAdmin-box">
      <h3>系统提示：超级管理员账号具有负责分店的最高权限</h3>
      <div class="filter-container">
        <scan-input :select="searchSelect" :defaultSelect="searchSelect[0].value" @kedownOver="searchlist" ref="scanIputDoc"></scan-input>
        <el-button class="lf staffAdd" @click="addcard"><i class="el-icon-plus"></i>添加账号</el-button>
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
    <el-table
      :data="superAdminList"
      v-loading="listLoading" 
      element-loading-text="列表正在加载中" 
      border 
      fit 
      highlight-current-row
      class="check-table"
      style="min-width: 100%">
      <el-table-column
        label="登录账号" align="center" min-width="200">
        <template slot-scope="scope">
          <span>{{scope.row.account?scope.row.account.account_id:'-'}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="名称" align="center" min-width="200">
        <template slot-scope="scope">
          <span>{{getName(scope.row)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="账号权限" align="center" class-name="merge-th">
        <el-table-column
          label="总店管理" align="center" min-width="100">
          <template slot-scope="scope">
            <span>{{Ismstore(scope.row.type)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="分店管理" align="center" min-width="300">
          <template slot-scope="scope">
            <span v-for="(item, key) in scope.row.gyms" :key="key">
              {{item.name}}
            </span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column
        label="创建人" align="center" min-width="200">
        <template slot-scope="scope">
          {{scope.row.creater?scope.row.creater.name:'系统'}}
        </template>
      </el-table-column>
      <el-table-column
        prop="created_at"
        label="创建时间<i class='el-icon-date'></i>" align="center"  min-width="200">
        <template slot-scope="scope">
          <span>{{scope.row.created_at?scope.row.created_at:'-'}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="操作" align="center" fixed="right"  min-width="150" class-name="small-padding fixed-min-width">
        <template slot-scope="scope">
          <template v-if="scope.row.type===5">
            <span>-</span>
          </template>
          <template v-else-if="scope.row.type===4||scope.row.type===6">
            <el-button size="mini" type="primary"
              @click="handleEdit(scope.row)" v-if="!(scope.row.account?scope.row.account.status:0)">编辑</el-button>
            <span v-else>账号已被禁用</span>
          </template>
          <template v-else>
            <el-button size="mini" type="primary"
              @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="mini" type="info"
              @click="deleteBtn(scope.row)">删除</el-button>
          </template>
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
    <add-acc-numb
      ref="addaccNumbDoc"
      v-if="addAccNumbShow"
      :dialogVisible="addAccNumbShow"
      :widthSize="'700px'"
      @dialogClosed="addAccNumbClosed"
      @btnOK="AccbtnOK"
      :title="title"
      :isEditemsSAdmin="isEditemsSAdmin"></add-acc-numb>
    <!-- 删除超管账号 -->
    <delete-dialog 
      :tipMessage="'确定要删除选中的超管账号?'"
      ref="deleteDialogDoc"
      @deleteSureBtn='deleteCardSure'></delete-dialog>
  </div>
</template>
<script>
// 多店管理--超级管理员
import scanInput from '@/components/scanInput'
import bulkAction from '@/components/bulkAction'
import AddAccNumb from './components/addAccNumb'
import { msSAdminList, deletemsSAdmin } from '@/api/mstoreSuperAdmin'
import deleteDialog from '@/components/deleteDialog'
export default {
  name: 'mstoreSuperAdmin',
  components: {
    scanInput,
    bulkAction,
    AddAccNumb,
    deleteDialog
  },
  data() {
    return {
      searchSelect: [{
        text: '登录账号',
        value: 'account_id_like'
      }, {
        text: '姓名',
        value: 'name_like'
      }],
      superAdminList: [],
      listLoading: false,
      paginationShow: true,
      listQuery: {
        page: 1,
        per_page: 10
      },
      total: 0,
      addAccNumbShow: false,
      tags: [],
      isEditemsSAdmin: false, // 是否是编辑还是新增管理员 false-新增 true-编辑
      title: '添加账号',
      deleteId: 0 // 要删除的管理员id
    }
  },
  created() {
    this.getmsSAdminList()
  },
  methods: {
    searchlist(obj) {
      // 搜索
      if (obj.value === '') {
        delete this.tags[0]
      } else {
        let tagszh = {
          account_id_like: '登录账号:',
          name_like: '姓名:'
        }
        this.tags[0] = { 'name': `${tagszh[obj.type]}${obj.value}`, 'type': obj.type }
      }
      delete this.listQuery.account_id_like
      delete this.listQuery.name_like
      this.listQuery[obj.type] = obj.value
      this.listQuery.page = 1
      this.pageInit()
      this.getmsSAdminList()
    },
    addcard() {
      // 新增管理员
      this.title = '新增管理员'
      this.addAccNumbShow = true
      this.isEditemsSAdmin = false
    },
    addAccNumbClosed() {
      this.addAccNumbShow = false
      this.isEditemsSAdmin = false
    },
    handleEdit(param) {
      // 编辑管理员
      this.title = '编辑管理员'
      this.addAccNumbShow = true
      this.isEditemsSAdmin = true
      this.$nextTick(() => {
        this.$refs.addaccNumbDoc.getInitVal(param)
      })
    },
    deleteBtn(row) {
      this.deleteId = row.id
      this.$nextTick(() => {
        this.$refs.deleteDialogDoc.dialogShow()
      })
    },
    deleteCardSure() {
      deletemsSAdmin(this.deleteId).then(res => {
        if (res) {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.$refs.deleteDialogDoc.dialogClose()
          this.getmsSAdminList()
        }
      }).catch(err => {
        console.log(err)
        this.$refs.deleteDialogDoc.dialogLoadingClose()
      })
    },
    handleSizeChange(val) {
      // 切换每页显示数据条数
      this.listQuery.per_page = val
      this.getmsSAdminList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getmsSAdminList()
    },
    getmsSAdminList() {
      // 获取多店超级管理员列表
      this.listLoading = true
      msSAdminList(this.listQuery).then(res => {
        this.listLoading = false
        this.superAdminList = res.data
        this.total = Number(res.headers.pagination.split(',')[1])
      }).catch(err => {
        console.log(err)
        this.listLoading = false
      })
    },
    Ismstore(param) {
      // 是否是总店
      if (param === 3 || param === 6 || param === 5) {
        return '是'
      }
      return '否'
    },
    pageInit() {
      // 分页器初始化
      this.paginationShow = false
      this.$nextTick(() => {
        this.paginationShow = true
      })
    },
    tagclose(tag, index) {
      this.common.tagFilter(this, tag, index, this.searchSelect)
    },
    AccbtnOK() {
      // 新增管理员
      this.isEditemsSAdmin = false
      this.addAccNumbShow = false
      this.listQuery.page = 1
      this.pageInit()
      this.getmsSAdminList()
    },
    getName(row) {
      // 获取名称
      let result = ''
      switch (row.type) {
        case 2:
        case 3:
          result = `超管[${row.name}]`
          break
        case 4:
        case 6:
          result = `分店超管`
          break
        case 5:
          result = `总店超管`
          break
        default: result = '其它'
      }
      return result
    }
  }
}
</script>
<style lang="scss" scoped>
  .mstoreSuperAdmin-box{
    background-color: #ffffff;
    border: 1px solid #CCCCCC;
    margin-bottom: 20px;
    h3{
      font-size: 20px;
      padding-left: 20px;
      color: #333333;
    }
    .filter-container{
      border-top: 1px solid #CCCCCC;
      overflow: hidden;
      padding: 15px;
      .staffAdd{
        background: rgb(51, 51, 51);
        margin-left: 20px;
        color: #fff;
      }
    }
 }
 .pagination-container{
    margin-top: 0px;
    text-align: right;
    padding: 30px 15px 20px;
  }
  .mstoreSuperAdmin{
    /deep/ .merge-th{
      border-bottom: 1px solid #cccccc;
    }
  }
</style>

