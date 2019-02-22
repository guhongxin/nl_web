<template>
  <div class="documentation-container">
    <div class="find-box2">
    <div style="overflow:hidden" class="filter-container">
      <!-- <div style="width: 300px; float: left;"><el-input placeholder="请输入要查询的文章标题" v-model="searchTitle" v-on:keyup.enter.native="search" class="input-with-select">
        <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
        </el-input>
      </div> -->
      <scan-input :select="searchSelect" @changeOver="scaninputselect" @kedownOver="scaninputover" :defaultSelect="chooseSelect" :placeholder="'请输入要查询的文章标题'" ref="scanIputDoc"></scan-input>
      <bulk-action :select="bulkdata" @changeBulk="changeBulk"></bulk-action>
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
    <el-table @selection-change="selectionChange" @filter-change="filterChange" @sort-change="sortChange" 
    stripe :key='tableKey' :data="tableList" v-loading="listLoading" element-loading-text="列表正在加载中" border fit highlight-current-row style="width: 100%;" class="check-table">
      <el-table-column align="center" type="selection" width="55px"></el-table-column>

      <el-table-column align="center" :label="'文章标题'" width="300" prop="article">
        <template slot-scope="scope">
          <span>{{scope.row.article?scope.row.article.title:'-'}}</span>
        </template>
      </el-table-column>
	  
	    <el-table-column width="200px" align="center" 
        label="推送日期<i onclick='openDate(event)' data=[1,'created_at_sdate','created_at_edate'] class='el-icon-date' title='推送日期'></i>"
        sortable="custom" prop="created_at">
        <template slot-scope="scope">
          <span>{{scope.row.created_at}}</span>
        </template>
      </el-table-column>

	    <el-table-column align="center"  :label="'推送对象'" width="200" prop="push_obj" 
        column-key="push_obj" :filters="pushOptions"
        filter-placement="bottom-end" :filter-multiple="false">
        <template slot-scope="scope">
          <span>{{scope.row.push_obj?scope.row.push_obj:'-'}}</span>
        </template>
      </el-table-column>
	  
	    <el-table-column width="200px" align="center" 
        label="更新日期<i onclick='openDate(event)' data=[3,'updated_at_sdate','updated_at_edate'] class='el-icon-date' title='更新日期'></i>"
        sortable="custom" prop="updated_at">
        <template slot-scope="scope">
          <span>{{scope.row.updated_at}}</span>
        </template>
      </el-table-column>

	    <el-table-column align="center"  :label="'更新人'" width="200" prop="employee_id"
      column-key="updateEmployee" :filters="employeeOptions" filter-placement="bottom-end" :filter-multiple="false">
        <template slot-scope="scope">
          <span>{{scope.row.employee?scope.row.employee.name:'-'}}</span>
        </template>
      </el-table-column>

	    <el-table-column align="center" :label="'阅读次数'" width="200" sortable="custom" prop="view_count">
        <template slot-scope="scope">
          <span>{{scope.row.view_count?scope.row.view_count:'-'}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" fixed="right" :label="$t('table.actions')" min-width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="success" plain
          @click="handleView(scope.$index, scope.row)" v-if="btnRoleList['5-3-2-3']">查看</el-button>
          <el-button size="mini" type="danger" plain
          @click="handleDelete(scope.$index, scope.row)" v-if="btnRoleList['5-3-2-5']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination 
        v-if="paginationShow"
        background 
        @size-change="handleSizeChange" 
        @current-change="handleCurrentChange" 
        :current-page.sync="listQuery.page"
        :page-sizes="[10,20,30,50]" :page-size="listQuery.pre_page" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <!-- 文章预览 -->
    <!-- <el-dialog title="文章预览" :visible.sync="dialogVisible" width="460px" height="600px">
      <iframe :src="articleurl" width="414" height="537" frameborder="0"></iframe>
    </el-dialog> -->
    <el-dialog
      :visible.sync="watchDialogVisible"
      width="650px"
      class="watch-el-dialog">
      <div>
        <div class="left">
          <div class="erweimaBox">
            <canvas ref="qrimg"></canvas>
            <span>扫一扫，直接在手机打开</span>
          </div>
          <div class="hrefBox"><input type="text" :value="articleurl" id="biao"><b @click="copyUrl">复制</b></div>
        </div>
        <div class="right">
          <div class="box">
            <div class="top">文章预览</div>
            <div class="title">{{watchArticalForm.title}}</div>
            <div style="text-align:center"><img :src="watchArticalForm.image" alt="" class="img"></div>
            <div class="content" v-html="watchArticalForm.content + shengming" style="width:96%;margin: 0 auto;"></div>
          </div>
        </div>
      </div>
    </el-dialog>

    <!-- 删除 -->
    <el-dialog
      title="提示"
      :visible.sync="deleteDialogVisible"
      width="490px"
      class="my-el-dialog" style="margin-top: 28vh;">
      <div style="color:#000;text-align:center;font-size:18px;margin:20px 0;">确定要删除该推送吗？</div>
      <span slot="footer" class="dialog-footer">
        <el-button style="padding:10px 34px;" @click="deleteDialogVisible = false">取消</el-button>
        <el-button type="primary" class="black" style="padding:10px 34px;" @click="deleteSure" :loading="delLoading">确定</el-button>
      </span>
    </el-dialog>

    <dateRange @timeChange="timeChange"></dateRange>
  </div>
</template>

<script>
import { articleRecordList, delRecordArticle, deleteBatchRecordArticle, viewArticle } from '@/api/article'
import { employeeList } from '@/api/employee'
import scanInput from '@/components/scanInput'
import bulkAction from '@/components/bulkAction'
import qrCodeWithLogo from 'qr-code-with-logo'
import dateRange from '@/components/dateRange'

export default {
  name: 'pushRecord',
  components: {
    scanInput,
    bulkAction,
    dateRange
  },
  data() {
    return {
      tags: [],
      employeeOptions: [],
      pushOptions: [
        { text: '所有客户', value: 1 + ',' + '所有客户', class: 'cpush_obj' },
        { text: '所有会员', value: 2 + ',' + '所有会员', class: 'cpush_obj' },
        { text: '即将到期会员', value: 3 + ',' + '即将到期会员', class: 'cpush_obj' },
        { text: '已过期会员', value: 4 + ',' + '已过期会员', class: 'cpush_obj' },
        { text: '最近生日会员', value: 5 + ',' + '最近生日会员', class: 'cpush_obj' },
        { text: '私教会员', value: 6 + ',' + '私教会员', class: 'cpush_obj' },
        { text: '潜在客户', value: 7 + ',' + '潜在客户', class: 'cpush_obj' }
      ],
      btnRoleList: {}, // tab/btn权限
      bulkdata: [{
        label: '批量删除',
        value: 'delete',
        key: '5-3-2-6'
      }],
      shengming: '',
      deleteids: [],
      dialogVisible: false,
      deleteDialogVisible: false,
      watchDialogVisible: false,
      watchArticalForm: {},
      articleurl: '',
      searchTitle: '',
      select: '',
      searchval: '',
      tableKey: 0,
      tableList: null,
      total: null,
      listLoading: true,
      showReviewer: false,
      delLoading: false,
      listQuery: {
        page: 1,
        pre_page: 10
      },
      searchGroupBtn: '',
      sexindex: 0,
      manindex: 0,
      cardIndex: 0,
      deleteId: '',
      deleteIndex: '',
      value1: true,
      iscoach: true,
      searchSelect: [{
        text: '文章标题',
        value: 'title'
      }],
      paginationShow: true
    }
  },
  computed: {
    chooseSelect() {
      return this.searchSelect[0].value
    }
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
      this.getList()
    },
    getEmployeeAll() {
      employeeList().then(response => {
        for (let i = 0; i < response.data.length; i++) {
          this.employeeOptions.push({ text: response.data[i].name, value: response.data[i].id + ',' + response.data[i].name, class: 'cemployee_id' }) // 创建人
        }
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
      if (key === 'push_obj') {
        this.hostFilter(data, key, 2, '推送对象：' + font)
      }
      if (key === 'employee_id') {
        this.hostFilter(data, key, 4, '更新人：' + font)
      }
    },
    hostFilter(data, key, index, text) {
      if (data[key].length === 0) {
        delete this.tags[index]
      } else {
        this.$set(this.tags, index, { name: text, type: key })
      }
    },
    // 批量删除
    changeBulk(value) {
      if (this.deleteids.length === 0) {
        this.common.message('warning', '请选择批量删除的项')
        return false
      }
      if (value === 'delete') {
        this.$confirm('是否批量删除选中的数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteBatchArticleBtn()
        }).catch(() => {
          console.log('取消批量删除')
        })
      }
    },
    deleteBatchArticleBtn() {
      deleteBatchRecordArticle(this.deleteids).then(res => {
        this.getList()
      }).catch(() => {
        this.common.message('error', '请求失败')
      })
    },
    // 点击checkbox获得对应id
    selectionChange(selection) {
      this.deleteids = []
      for (let i = 0; i < selection.length; i++) {
        this.deleteids.push(selection[i].id)
      }
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
      articleRecordList(this.listQuery).then(response => {
        this.tableList = response.data
        this.total = Number(response.headers.pagination.split(',')[1])
        this.listLoading = false
      })
    },
    search() {
      let val = this.searchTitle
      this.listQuery.title = this.searchTitle
      if (val === '') {
        delete this.listQuery.title
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
      this.listQuery.pre_page = val
      this.getList()
    },
    // 推送删除
    handleDelete(index, rows) {
      this.deleteId = rows.id
      this.deleteIndex = index
      this.deleteDialogVisible = true
    },
    deleteSure() {
      delRecordArticle(this.deleteId).then(res => {
        this.getList()
        // this.tableList.splice(this.deleteIndex, 1)
        this.deleteDialogVisible = false
      }).catch(() => {
        this.common.message('error', '删除失败！')
      })
    },
    // 复制功能
    copyUrl() {
      var Url = document.getElementById('biao')
      Url.select() // 选择对象
      document.execCommand('Copy') // 执行浏览器复制命令
      this.common.message('success', '已复制好，可贴粘！')
    },
    // 文章预览
    handleView(index, row) {
      this.shengming = "<div style='color: #ccc;margin-top:30px;' id='shengming'><wf>声明：本文由入驻俱乐部的作者撰写，除牛啦官方账号外，观点仅代表作者本人，不代表牛啦立场。</wf></div>"
      this.watchDialogVisible = true
      viewArticle(row.id).then(res => {
        this.watchArticalForm = {
          title: res.data.title,
          image: res.data.article.image,
          content: res.data.article.content
        }
        this.articleurl = res.data.push_url
        // 链接转二维码
        this.$nextTick(() => {
          let canvas = this.$refs.qrimg
          qrCodeWithLogo.toCanvas({
            canvas: canvas,
            content: this.articleurl,
            width: 200
          })
        })
      }).catch(() => {
        this.watchArticalForm = {
          title: '',
          image: '',
          content: ''
        }
        this.common.message('error', '该文章已删除！')
      })
    },
    scaninputselect(value) {
      console.log(value)
    },
    scaninputover(obj) {
      delete this.listQuery[obj.type]
      if (obj.value === '') {
        delete this.tags[0]
      } else {
        let tagszh = {
          title: '文章标题'
        }
        this.tags[0] = { 'name': `${tagszh[ obj.type]}:${obj.value}`, 'type': obj.type }
        this.listQuery[obj.type] = obj.value
      }
      this.listQuery.page = 1
      this.pageInit()
      this.getList()
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
  },
  destroyed() {
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg:#2d3a4b;
$light_gray:#eee;
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
.watch-el-dialog /deep/ .el-dialog {
  background: transparent;
  -webkit-box-shadow: none;
  .el-dialog__header {
    border-bottom: none;
  }
  .el-dialog__headerbtn .el-dialog__close {
    color: #fff;
    font-size: 22px;
  }
  .left {
    width: 210px;
    float: left;
    .erweimaBox {
      height: 230px;
      text-align:center;
      background: #fff;
      margin-top: 80px;
      img {
        width: 180px;
        margin-top: 10px;
        vertical-align: middle;
      }
      span {
        display: inline-block;
      }
    }
    .hrefBox {
      background: #f5f5f5;
      padding: 10px;
      input {
        border: 1px solid #ddd;
        padding: 3px;
        width: 150px;
      }
      b {
        color: #409EFF;
        font-size: 14px;
        margin-left: 5px;
        font-weight: normal;
        cursor: pointer;
      }
    }
  }
  .right {
    width: 335px;
    height: 700px;
    float: left;
    margin-left: 15px;
    background: url('../../../assets/icon/phone.png') no-repeat;
    background-size: cover;
    .box {
      // background: #ddd;
      width: 298px;
      height: 530px;
      margin-top: 83px;
      margin-left: 20px;
      overflow-y: auto;
      text-align: left;
      .top {
        height: 42px;
        line-height: 42px;
        text-align: center;
        background: #ddd;
        border-bottom: 1px solid #000;
      }
      .title {
        margin: 15px 10px;
        color: #000;
        font-size: 15px;
        font-weight: bold;
        text-align: center;
        text-indent: 0;
      }
      .img {
        width: 260px;
      }
      .content {
        width: 100%;
      }
    }
    /*滚动条样式*/
    .box::-webkit-scrollbar {/*滚动条整体样式*/
      width: 1px;     /*高宽分别对应横竖滚动条的尺寸*/
      height: 4px;
    }
    .box::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
      border-radius: 5px;
      -webkit-box-shadow: inset 0 0 5px rgba(255,255,255,1);
      background: rgba(255,255,255,1);
    }
    .box::-webkit-scrollbar-track {/*滚动条里面轨道*/
      -webkit-box-shadow: inset 0 0 5px rgba(255,255,255,0.2);
      border-radius: 0;
      background: rgba(255,255,255,0.2);
    }
  }
}
.dialog-footer {
  text-align: center;
  .black {
    background: #000;
    border: 1px solid #000;
  }
  .gray {
    background: #ddd;
    border: 1px solid #ddd;
  }
}
</style>
