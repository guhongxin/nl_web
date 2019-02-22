<template>
  <div class="documentation-container">
    <div class="find-box2">
    <div style="overflow:hidden;" class="filter-container">
      <!-- <div style="width: 300px; float: left;"><el-input placeholder="请输入要查询的文章标题" v-model="searchTitle" v-on:keyup.enter.native="search" class="input-with-select">
        <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
        </el-input>
      </div> -->
      <scan-input :select="searchSelect" @changeOver="scaninputselect" @kedownOver="scaninputover" :defaultSelect="chooseSelect" :placeholder="'请输入要查询的文章标题'"></scan-input>
      <el-button class="lf staffAdd" @click="dialogediterVisible = true; isadd = true" v-if="btnRoleList['5-3-1-1']"><i class="el-icon-plus"></i> 添加文章</el-button>
      <bulk-action :select="bulkdata" @changeBulk="changeBulk"></bulk-action>
    </div>
    </div>
    
    <el-row :gutter="20" class="image-box">
      <el-col :span="4" v-for='(item, index) in tableList' :key='index' style="margin-bottom:20px;min-width: 320px" >
        <image-card 
        :data="item"
        @editBtn="handleEdit(item)"
        @viewBtn="handleView(item)"
        @shareBtn="handleSend(item)"
        @deleteBtn="handleDelete(item,index)"
        :editBtnShow = "btnRoleList['5-3-1-2']"
        :viewBtnShow = "btnRoleList['5-3-1-3']"
        :shareBtnShow = "btnRoleList['5-3-1-4']"
        :deleteBtnShow = "btnRoleList['5-3-1-5']"
        ></image-card>
      </el-col>
    </el-row>
    <div class="pagination-container">
      <el-pagination 
        v-if="paginationShow"
        background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
        :page-sizes="[12,24,36,48]" :page-size="listQuery.pre_page" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <input type="file" id="UpImg" accept="image/*" style="display: none">

    <el-dialog :visible.sync="dialogediterVisible" @close="clearBox" :width="'790px'" center>
      <span slot="title">文章操作</span>
      <div slot="footer" class="dialog-footer" style="margin-top: -55px;">
        <el-form :model="articleform" label-width="80px" ref="articleform" :rules="rules">
          <el-form-item label="文章名称" prop="title">
            <el-input v-model.trim="articleform.title" auto-complete="off" :maxlength="20"></el-input>
          </el-form-item>
          <div style="overflow:hidden;">
            <el-form-item label="文章封面" prop="image" style="float:left;">
              <div>
                <more-img ref="imgbox" :boxWidth="280" :boxHeight="112" :imgWidth="710" :imgHeight="284" @imgUrl="getImgUrl" @clearimgurl="cimgrul"></more-img>
              </div>
            </el-form-item>
            
            <el-form-item label="文章摘要" prop="desc" style="float:right;">
              <textarea style="resize:none;" placeholder="请输入文章摘要" 
                v-model="articleform.intro" class="descripts"
                v-on:input="getLength"
                maxlength="120">
              </textarea>
              <span class="tipcontent">{{tipLength}}/120</span>
            </el-form-item>
          </div>
          <el-form-item label="文章内容" prop="content">
            <div style="width:700px;margin-bottom: 20px">
              <textarea name="content" id="demoeditor" cols="30" rows="10"></textarea>
            </div>
          </el-form-item>
        </el-form>
        <el-button @click="dialogediterVisible = false">取 消</el-button>
        <el-button v-if="isadd" type="primary" :loading="addLoading" @click="addArticleBtn">确 定</el-button>
        <el-button v-else type="primary" :loading="editLoading" @click="editArticleBtn">提 交</el-button>
      </div>
    </el-dialog>

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
          <!-- <div class="erweimaBox">
            <canvas ref="qrimg"></canvas>
            <span>扫一扫，直接在手机打开</span>
          </div> -->
          <!-- <div class="hrefBox"><input type="text" :value="articleurl" id="biao"><b @click="copyUrl">复制</b></div> -->
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

    <!-- 文章推送 -->
    <el-dialog title="文章推送" :visible.sync="dialogSelectVisible" width="420px" height="600px">
      <el-select v-model="selectvalue" placeholder="请选择">
        <el-option
          v-for="item in selectoptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button type="primary" @click="sendbtn" :loading="pushLoading" :disabled="leftCount===0">确 定</el-button>
      <el-button @click="dialogSelectVisible = false">取 消</el-button>
      <div class="pushTitle">您本月还能群发<span>{{leftCount}}</span>次</div>
    </el-dialog>

    <!-- 删除 -->
    <el-dialog
      title="提示"
      :visible.sync="deleteDialogVisible"
      width="490px"
      class="my-el-dialog" style="margin-top: 28vh;">
      <div style="color:#000;text-align:center;font-size:18px;margin:20px 0;">确定要删除该文章吗？</div>
      <div style="text-align:center;">
        <span slot="footer" class="dialog-footer">
          <el-button style="info" @click="deleteDialogVisible = false">取消</el-button>
          <el-button type="primary" class="black" @click="deleteSure" :loading="delLoading">确定</el-button>
        </span>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { articleList, addArticle, deleteArticle, deleteBatchArticle, editArticle, sendArticle, viewArticleManage, articlePushNum } from '@/api/article'
import scanInput from '@/components/scanInput'
import moreImg from '@/components/moreImg'
import bulkAction from '@/components/bulkAction'
import KindEditor from '#/kindeditor/kindeditor'
import ImageCard from './imageCard/imageCard'
import { getSelectDocArr } from '@/utils/comm'
// import QrCodeWithLogo from 'qr-code-with-logo'

export default {
  name: 'articalManage',
  components: {
    scanInput,
    bulkAction,
    moreImg,
    ImageCard
  },
  data() {
    return {
      btnRoleList: {}, // tab/btn权限
      shengming: '',
      selectvalue: 1,
      pushLoading: false,
      addLoading: false,
      editLoading: false,
      selectoptions: [{
        value: 1,
        label: '所有客户'
      }, {
        value: 2,
        label: '所有会员'
      }, {
        value: 3,
        label: '即将到期会员（30天内）'
      }, {
        value: 4,
        label: '已过期会员'
      }, {
        value: 5,
        label: '最近生日会员（30天内）'
      }, {
        value: 6,
        label: '私教会员'
      }, {
        value: 7,
        label: '潜在客户'
      }],
      leftCount: 4,
      dialogVisible: false,
      watchDialogVisible: false,
      dialogSelectVisible: false,
      deleteDialogVisible: false,
      articleurl: '',
      isadd: true,
      bulkdata: [{
        label: '批量删除',
        value: 'delete',
        key: '5-3-1-6'
      }],
      articleform: {
        title: '',
        image: '',
        intro: '',
        content: ''
      },
      dialogediterVisible: false,
      watchArticalForm: {},
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
        pre_page: 12
      },
      searchGroupBtn: '',
      content: '',
      cardIndex: 0,
      value1: true,
      iscoach: true,
      deleteids: [],
      deleteId: '',
      deleteIndex: '',
      staticarticle: '/static/sharearticle/index.html?id=',
      staticPushData: '',
      tipLength: 0,
      searchSelect: [{
        text: '文章标题',
        value: 'title'
      }],
      rules: {
        title: [{ required: true, message: '请输入文章标题', trigger: 'blur' }],
        image: [{ required: true, message: '请上传文章封面', trigger: 'blur' }],
        content: [{ required: true, message: '请输入文章摘要', trigger: 'blur' }]
      },
      paginationShow: true
    }
  },
  created() {
    this.__init()
  },
  mounted() {
    this.$nextTick(function() {
      this.initEditor()
    })
  },
  methods: {
    __init() {
      this.common.eachBtnRole(this.btnRoleList) // 按钮权限方法
      this.getList()
    },
    getLength() {
      if (this.articleform.intro.length > 120) {
        this.common.message('warning', '请输入120字以内')
      }
      this.tipLength = this.articleform.intro.length
    },
    clearBox() {
      this.resetArticle()
    },
    sortChange(data) {
      this.common.sortFilter(this, data)
    },
    changeBulk(value) {
      if (value === 'delete') {
        let selection = getSelectDocArr('.image-box label', 'is-checked')
        if (selection.length === 0) {
          this.common.message('warning', '请选择要删除的文章')
          return
        }
        let deleteids = []
        for (let item of selection) {
          deleteids.push(this.tableList[item].id)
        }
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteBatchArticle(deleteids).then(res => {
            let docArry = document.querySelectorAll('.image-box label .is-checked')
            docArry.forEach(item => {
              item.classList.remove('is-checked')
            })
            this.pageInit()
            this.getList()
          }).catch(() => {
            this.common.message('error', '请求失败')
          })
        }).catch(() => {
          console.log(1)
        })
      }
    },
    addArticleBtn() {
      // 新增
      // this.getEditorContent()
      if (!this.getEditorContent()) {
        this.common.message('warning', `文章内容不能超过5000字,目前文章内容有${this.content.length}字,请删除多余的字再提交`)
        return false
      }
      if (!this.articleform.title.length) {
        this.common.message('warning', '文章标题不能为空')
        return
      }
      if (!this.articleform.image.length) {
        this.common.message('warning', '文章封面不能为空')
        return
      }
      if (!this.articleform.content.length) {
        this.common.message('warning', '文章内容不能为空')
        return
      }
      if (!this.articleform.intro.length) {
        if (this.content.length) {
          this.articleform.intro = this.content.length > 54 ? this.content.slice(0, 54) : this.content
        } else {
          this.articleform.intro = this.articleform.title
        }
      }
      this.addLoading = true
      addArticle(this.articleform).then(res => {
        this.common.message('success', '文章提交成功！')
        this.tableList.unshift(res.data)
        this.resetArticle()
        this.dialogediterVisible = false
        this.addLoading = false
        this.getList()
      }).catch(() => {
        this.addLoading = false
        this.common.message('error', '添加失败')
      })
    },
    resetArticle() {
      this.articleform.title = ''
      this.articleform.intro = ''
      this.$refs.imgbox.deleteimgbtn()
      this.articleform.image = ''
      this.tipLength = 0
      this.setEditorContent('')
    },
    getImgUrl(url) {
      this.articleform.image = url
    },
    cimgrul(data) {
      this.articleform.image = data
    },
    initEditor() {
      let myvue = this
      window.editor = KindEditor.create('#demoeditor', {
        resizeType: 1,
        allowPreviewEmoticons: false,
        allowImageUpload: true,
        autoHeightMode: false,
        height: '200px',
        width: '670px',
        items: [
          'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold', 'italic', 'underline',
          'removeformat', '|', 'justifyleft', 'justifycenter', 'justifyright', 'insertorderedlist',
          'insertunorderedlist', '|', 'emoticons', 'link', 'source', '_uploadImg'
        ],
      })
      KindEditor.lang({
        _uploadImg: '插入图片'
      })
      KindEditor.plugin('_uploadImg', function(K) {
        let self = this
        let name = '_uploadImg'
        let fileInput = document.getElementById('UpImg')
        self.clickToolbar(name, function() {
          fileInput.focus()
          fileInput.click()
        })
        myvue.common.baseUploadImg(fileInput, function(imgurl) {
          window.editor.insertHtml('<img class="img" src="' + imgurl + '" style="width:100%" />')
        })
      })
    },
    getEditorContent() {
      this.articleform.content = window.editor.html()
      this.content = window.editor.text()
      // 获得纯文本去掉图片
      this.content = this.content.replace(/<\/?(img|a)[^>]*>/gi, '')
      if (this.content.length > 5000) {
        return false
      }
      return true
    },
    setEditorContent(value) {
      this.articleform.content = value
      window.editor.html(value)
    },
    curChoose(index) {
      for (let v of this.boxlist) {
        v.checked = false
      }
      this.boxlist[index].checked = true
    },
    deleteBatchArticleBtn() {
      deleteBatchArticle(this.deleteids).then(res => {
        this.getList()
      }).catch(() => {
        this.common.message('error', '请求失败')
      })
    },
    curOpenbox(index) {
      console.log(this.boxlist[index].text)
    },
    filterSex(value, row, column) {
      this.listQuery.sex = value
      this.getList()
    },
    getList() {
      this.listLoading = true
      articleList(this.listQuery).then(response => {
        this.tableList = response.data
        this.total = Number(response.headers.pagination.split(',')[1])
        this.listLoading = false
      }).catch(() => {
        this.common.message('error', '请求失败')
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
    sendbtn() {
      for (let i = 0; i < this.selectoptions.length; i++) {
        if (this.selectoptions[i].value === this.selectvalue) {
          this.staticPushData.push_obj = this.selectoptions[i].value
          this.staticPushData.push_type = this.selectoptions[i].label
        }
      }
      this.pushLoading = true
      sendArticle(this.staticPushData).then((res) => {
        if (res.data.code === '3000090') {
          this.common.message('warning', res.data.msg)
          return
        } else {
          this.pushLoading = false
          this.$notify({
            title: '成功',
            message: '文章推送成功',
            type: 'success'
          })
          this.dialogSelectVisible = false
          this.getList()
        }
      }).catch(() => {
        this.pushLoading = false
      })
    },
    // 复制功能
    copyUrl() {
      var Url = document.getElementById('biao')
      Url.select() // 选择对象
      document.execCommand('Copy') // 执行浏览器复制命令
      this.common.message('success', '已复制好，可贴粘！')
    },
    editArticleBtn() {
      // 修改
      if (!this.getEditorContent()) {
        this.common.message('warning', `文章内容不能超过5000字,目前文章内容有${this.content.length}字,请删除多余的字再提交`)
        return false
      }
      if (!this.articleform.title.length) {
        this.common.message('warning', '文章标题不能为空')
        return
      }
      if (!this.articleform.image.length) {
        this.common.message('warning', '文章封面不能为空')
        return
      }
      if (!this.articleform.intro.length) {
        this.articleform.intro = this.content.length > 54 ? this.content.slice(0, 54) : this.content
      }
      if (!this.articleform.content.length) {
        this.common.message('warning', '文章内容不能为空')
        return
      }
      this.editLoading = true
      editArticle(this.editid, this.articleform).then(res => {
        this.$notify({
          title: '成功',
          message: '修改成功',
          type: 'success'
        })
        this.dialogediterVisible = false
        this.editLoading = false
        this.resetArticle()
        this.getList()
      }).catch(() => {
        this.common.message('error', '修改失败')
        this.editLoading = false
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
    handleEdit(row) {
      this.isadd = false
      this.editid = row.id
      this.articleform.title = row.title
      this.articleform.intro = row.intro
      this.tipLength = row.intro.length
      this.articleform.image = row.image
      this.$refs.imgbox.setImg(row.image)
      this.setEditorContent(row.content)
      this.dialogediterVisible = true
    },
    // 查看
    handleView(row) {
      this.watchArticalForm = row
      this.shengming = "<div style='color: #ccc;margin-top:30px;' id='shengming'><wf>声明：本文由入驻俱乐部的作者撰写，除牛啦官方账号外，观点仅代表作者本人，不代表牛啦立场。</wf></div>"
      this.watchDialogVisible = true
      viewArticleManage(row.id).then(res => {
        // this.articleurl = res.data.push_url
        // 链接转二维码
        // this.$nextTick(() => {
        //   let canvas = this.$refs.qrimg
        //   QrCodeWithLogo.toCanvas({
        //     canvas: canvas,
        //     content: this.articleurl,
        //     width: 200
        //   })
        // })
      }).catch(() => {
        this.common.message('error', '查询失败！')
      })
    },
    // 推送
    handleSend(row) {
      this.dialogSelectVisible = true
      this.pushArticalByMonth()
      this.staticPushData = {
        article_id: row.id,
        title: row.title,
      }
    },
    pushArticalByMonth() {
      articlePushNum().then(res => {
        this.leftCount = res.data.num > 4 ? 0 : 4 - res.data.num
      }).catch(() => {
      })
    },
    // 删除
    handleDelete(rows, index) {
      this.deleteDialogVisible = true
      this.deleteId = rows.id
      this.deleteIndex = index
    },
    deleteSure() {
      this.delLoading = true
      deleteArticle(this.deleteId).then(res => {
        this.getList()
        // this.tableList.splice(this.deleteIndex, 1)
        this.deleteDialogVisible = false
        this.common.message('success', '删除成功')
        this.delLoading = false
      }).catch(() => {
        this.common.message('error', '删除失败！')
        this.delLoading = false
      })
    },
    // 点击checkbox获得对应id
    selectionChange(index) {
      this.deleteids = []
    },
    scaninputselect(value) {
      console.log(value)
    },
    scaninputover(obj) {
      delete this.listQuery[obj.type]
      if (obj.value) {
        this.listQuery[obj.type] = obj.value
      }
      this.listQuery.page = 1
      this.pageInit()
      this.getList()
      // this.listQuery.page = 1
      // this.pageInit()
      // this.listQuery[obj.type] = obj.value
      // this.getList()
    },
    pageInit() {
      this.paginationShow = false
      this.$nextTick(() => {
        this.paginationShow = true
      })
    }
  },
  filters: { },
  computed: {
    chooseSelect() {
      return this.searchSelect[0].value
    }
  },
  destroyed() {
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg:#2d3a4b;
$light_gray:#eee;
.my-el-dialog /deep/ {
  .el-dialog__header {
    border-bottom: 1px solid #ddd;
  }
}
.b {
  float: left;
  vertical-align: middle;
  color: red;
  margin-top: 12px;
}
.active {
  display: none;
}
.watch-el-dialog /deep/ {
  .el-dialog__header {
    border-bottom: none;
  }
}
.pushTitle {
  margin-top: 10px;
  margin-left: 3px;
  span {
    color: #409EFF
  }
}
.descripts {
  border: 1px solid #ddd;
  border-radius: 5px;
  height: 112px;
  width: 260px;
}
.tipcontent {
  position: absolute;
  bottom: 10px;
  right: 10px;
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
    margin-left: 215px;
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
