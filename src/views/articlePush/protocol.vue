<template>
  <div class="app-container documentation-container">
    <div class="tabmycalss">
      <div class="el-tabs__header is-top">
        <div class="el-tabs__nav-wrap is-top">
          <div class="el-tabs__nav-scroll">
            <div role="tablist" class="el-tabs__nav" style="transform: translateX(0px);">
              <div class="el-tabs__active-bar is-top" style="width: 80px;" :style="{transform: 'translateX('+ Xline +'px)'}"></div>
              <div role="tab" 
                class="el-tabs__item is-top" 
                :class="{'is-active': item.select}" 
                v-for="(item, index) in tabList" 
                :key="index" @click="selectTab(index, item.type)">
                  {{item.text}}
              </div>
            </div>
          </div>
          <div class="resize-triggers">
            <div class="expand-trigger">
              <div style="width: 100%;"></div>
            </div>
            <div class="contract-trigger"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="find-box2">
      <div style="overflow:hidden" class="filter-container">
        <scan-input :select="searchSelect" :defaultSelect="searchSelect[0].value" @kedownOver="searchlist"></scan-input>
        <el-button class="lf staffAdd" @click="openPaint" v-if="btnRoleList['5-4-1-1']"><i class="el-icon-printer"></i> 打印协议</el-button>
        <el-button class="lf staffAdd" @click="undisableEdit" v-if="btnRoleList['5-4-1-2']"><i class="el-icon-edit"></i> 编辑协议</el-button>
        <el-button class="lf staffAdd" @click="reset" v-if="btnRoleList['5-4-1-3']"><i class="el-icon-edit"></i> 协议重置</el-button>
      </div>
    </div>
    <div class="box" id="userDetialbox" v-show="haveinfo">
      <div class="tiels">
        <div class="tiels_name">客户姓名</div>
        <div class="tiels_til" id="username">{{username}}</div>
      </div>
      <!-- <div class="tiels vn">
        <div class="tiels_name">客户性别</div>
        <div class="tiels_til" id="usersex">{{usersex}}</div>
      </div> -->
      <div class="tiels ph">
        <div class="tiels_name">客户电话</div>
        <div class="tiels_til" id="userphone">{{userphone}}</div>
      </div>
      <div class="tiels ca" id="cardbox">
        <div class="tiels_name">会员卡种</div>
        <select class="tiels_til slo" id="usercard"><option v-for="(item, index) in cardList" :key="index" :value="index">{{item.card_name}}</option></select>
      </div>
    </div>
    <div style="width:100%;margin-bottom: 20px">
      <textarea name="" id="demoeditor" cols="30" rows="10"></textarea>
    </div>
    <div style="float: right" v-show="edit">
      <el-button style="width: 120px" type="info" plain @click="disableEdit">取消</el-button>
      <el-button style="width: 120px" type="primary" @click="editCardProtocol">保存</el-button>
    </div>        
    <input type="file" id="UpImg" accept="image/*" style="display: none">
  </div>
</template>

<script>
import { listSellVipCard } from '@/api/vipcard'
import { parseTime } from '@/filters'
import { watchProtocol, editProtocol, resetProtocol } from '@/api/protocol'
import scanInput from '@/components/scanInput'
import KindEditor from '#/kindeditor/kindeditor'
import { setSession, removeSession } from '@/utils/auth'
export default {
  name: 'protocol',
  components: {
    scanInput
  },
  data() {
    return {
      btnRoleList: {},
      tabList: [{
        text: '开卡协议',
        type: 'M',
        select: true
      }, {
        text: '私教协议',
        type: 'P',
        select: false
      }],
      Xline: 0,
      searchSelect: [{
        text: '手机号码',
        value: 'phone'
      }],
      cardList: [],
      username: '',
      // usersex: '',
      userphone: '',
      haveinfo: false,
      edit: false,
      protocolLongName: '会员入会协议',
      currentType: 'M'
    }
  },
  computed: {
  },
  methods: {
    init() {
      let myvue = this
      window.editor = KindEditor.create('#demoeditor', {
        resizeType: 1, // 2或1或0，2时可以拖动改变宽度和高度，1时只能改变高度，0时不能拖动
        allowPreviewEmoticons: false, // true时鼠标放在表情上可以预览表情。
        allowImageUpload: true, // true时显示图片上传按钮
        autoHeightMode: false, // 值为true，并引入autoheight.js插件时自动调整高度。
        filterMode: false, // 开启不过滤
        height: '500px',
        width: '100%',
        items: [
          'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold', 'italic', 'underline',
          'removeformat', '|', 'justifyleft', 'justifycenter', 'justifyright', 'insertorderedlist',
          'insertunorderedlist', '|', 'emoticons', 'link', 'source', '_uploadImg', 'zkname', 'sex',
          'phone', 'protocol', 'startprotocol', 'endprotocol', 'card', 'zheng'
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
          window.editor.insertHtml('<img class="img" src="' + imgurl + '" style="max-width:100%" />')
        })
      })
      /* 替换姓名标签 */
      KindEditor.lang({
        zkname: '插入替换 姓名 标签'
      })
      KindEditor.plugin('zkname', function(K) {
        let self = this
        let name = 'zkname'
        self.clickToolbar(name, function() {
          window.editor.insertHtml(`<span  class="zkname"><a href="javascript:;" style="color:blue;">会员名称</a></span>`)
        })
      })
      /* 替换性别标签 */
      KindEditor.lang({
        sex: '插入替换 性别 标签'
      })
      KindEditor.plugin('sex', function(K) {
        let self = this
        let name = 'sex'
        self.clickToolbar(name, function() {
          window.editor.insertHtml(`<span  class="sex"><a href="javascript:;" style="color:blue;">会员性别</a></span>`)
        })
      })
      /* 替换电话号码标签 */
      KindEditor.lang({
        phone: '插入替换 电话号码 标签'
      })
      KindEditor.plugin('phone', function(K) {
        let self = this
        let name = 'phone'
        self.clickToolbar(name, function() {
          window.editor.insertHtml(`<span  class="phone"><a href="javascript:;" style="color:blue;">会员电话</a></span>`)
        })
      })
      /* 替换协议签订日期标签 */
      KindEditor.lang({
        protocol: '插入替换 协议签订日期 标签'
      })
      KindEditor.plugin('protocol', function(K) {
        let self = this
        let name = 'protocol'
        self.clickToolbar(name, function() {
          window.editor.insertHtml(`<span  class="protocol"><a href="javascript:;" style="color:blue;">协议签订日期</a></span>`)
        })
      })
      /* 替换协议生效日期标签 */
      KindEditor.lang({
        startprotocol: '插入替换 协议生效日期 标签'
      })
      KindEditor.plugin('startprotocol', function(K) {
        let self = this
        let name = 'startprotocol'
        self.clickToolbar(name, function() {
          window.editor.insertHtml(`<span  class="startprotocol"><a href="javascript:;" style="color:blue;">协议生效日期</a></span>`)
        })
      })
      /* 替换协议结束日期标签 */
      KindEditor.lang({
        endprotocol: '插入替换 协议结束日期 标签'
      })
      KindEditor.plugin('endprotocol', function(K) {
        let self = this
        let name = 'endprotocol'
        self.clickToolbar(name, function() {
          window.editor.insertHtml(`<span  class="endprotocol"><a href="javascript:;" style="color:blue;">协议结束日期</a></span>`)
        })
      })
      /* 替换卡种标签 */
      KindEditor.lang({
        card: '插入替换 卡种 标签'
      })
      KindEditor.plugin('card', function(K) {
        let self = this
        let name = 'card'
        self.clickToolbar(name, function() {
          window.editor.insertHtml(`<span  class="card"><a href="javascript:;" style="color:blue;">会员卡</a></span>`)
        })
      })
      /* 替换证书号标签 */
      KindEditor.lang({
        zheng: '插入替换 证书号 标签'
      })
      KindEditor.plugin('zheng', function(K) {
        let self = this
        let name = 'zheng'
        self.clickToolbar(name, function() {
          window.editor.insertHtml(`<span  class="zheng"><a href="javascript:;" style="color:blue;">证书号</a></span>`)
        })
      })
      this.getProtocol('M', window.editor)
      let idi = setInterval(() => {
        if (typeof (window.editor.readonly) !== 'undefined') {
          clearInterval(idi)
          this.disableEdit(window.editor)
        }
      }, 60)
    },
    // 协议重置
    reset() {
      resetProtocol(this.currentType).then(res => {
        this.common.notify('成功', 'success', '协议重置成功！')
        this.getProtocol(this.currentType, window.editor)
      })
    },
    // selectTab(index, type) {
    //   for (let item of this.tabList) {
    //     item.select = false
    //   }
    //   this.tabList[index].select = true
    //   this.Xline = 76 * index
    //   if (type === 'M') {
    //     this.getProtocol('M', window.editor)
    //     this.protocolLongName = '会员入会协议'
    //     this.currentType = 'M'
    //   } else if (type === 'P') {
    //     this.getProtocol('P', window.editor)
    //     this.protocolLongName = '私教协议'
    //     this.currentType = 'P'
    //   }
    // },
    selectTab(index, type) {
      for (let item of this.tabList) {
        item.select = false
      }
      this.tabList[index].select = true
      if (index === 0) {
        this.Xline = 100 * index + 15
      } else if (index === 1) {
        this.Xline = 100 * index + 30
      }
      if (type === 'M') {
        this.getProtocol('M', window.editor)
        this.protocolLongName = '会员入会协议'
        this.currentType = 'M'
      } else if (type === 'P') {
        this.getProtocol('P', window.editor)
        this.protocolLongName = '私教协议'
        this.currentType = 'P'
      }
    },
    openPaint() {
      document.getElementById('username').innerText
      let username = document.getElementById('username').innerText
      // let usersex = document.getElementById('usersex').innerText
      let userphone = document.getElementById('userphone').innerText
      if (!username.length || !userphone.length) {
        this.common.message('error', '请先使用手机号码获取用户信息！')
        return
      }
      let cardele = document.getElementById('usercard')
      if (this.currentType === 'M') {
        if (cardele.selectedIndex < 0) {
          this.common.message('error', '该用户未办理会员卡！')
          return
        }
        let cardName = cardele.options[cardele.selectedIndex].text
        let valueindex = cardele.options[cardele.selectedIndex].value
        let startprotocol = this.cardList[valueindex].start_date
        let endprotocol = this.cardList[valueindex].end_date
        setSession('cardName', cardName)
        setSession('startprotocol', startprotocol)
        setSession('endprotocol', endprotocol)
      }
      if (this.currentType === 'P') {
        removeSession('cardName')
        let startprotocol = parseTime(new Date().getTime(), '{y}-{m}-{d} {h}:{i}:{s}')
        let yearTime = new Date().getTime() + 31536000000
        let endprotocol = parseTime(yearTime, '{y}-{m}-{d} {h}:{i}:{s}')
        setSession('startprotocol', startprotocol)
        setSession('endprotocol', endprotocol)
      }
      let editorHtml = window.editor.html()
      if (window.editor.isEmpty()) {
        this.common.message('error', '协议内容不能为空！')
        return
      }
      setSession('username', username)
      setSession('userphone', userphone)
      setSession('protocolTime', parseTime(new Date().getTime(), '{y}-{m}-{d} {h}:{i}:{s}')) // 签订时间
      setSession('protocolLongName', this.protocolLongName) // 协议标题
      setSession('editorHtml', editorHtml) // 协议内容
      window.open(this.staticurl + 'static/protocolprint/preview.html')
    },
    editCardProtocol() {
      let name = ''
      if (this.currentType === 'M') {
        name = '开卡协议'
      }
      if (this.currentType === 'P') {
        name = '私教协议'
      }
      if (!name.length) {
        this.common.message('error', '未知类型协议')
        return
      }
      editProtocol(this.currentType, name, window.editor.html()).then(res => {
        this.common.notify('成功', 'success', '编辑成功！')
        this.disableEdit()
      })
    },
    getProtocol(type, editor) {
      watchProtocol(type).then(res => {
        editor.html(res.data.content)
      })
    },
    searchlist(obj) {
      let data = {
        page: 1,
        per_page: 50,
        [obj.type]: obj.value
      }
      if (obj.value === '') { // 如果不输入信息
        this.haveinfo = false
        this.username = '' // 清空搜索信息
        this.userphone = ''
        return
      }
      listSellVipCard(data).then(res => {
        this.cardList = []
        if (!res.data.length) {
          this.haveinfo = false
          this.common.message('warning', '未搜索到任何信息!')
          return
        } else {
          if (!res.data[0].customer) {
            this.common.message('error', '脏数据无法获取用户信息！')
            this.haveinfo = false
            return
          }
          this.cardList = res.data
          this.username = res.data[0].customer.name
          this.userphone = res.data[0].customer.phone
          this.haveinfo = true
          setSession('usersex', res.data[0].customer.sex === 1 ? '男' : '女')
        }
      })
    },
    disableEdit(editor) {
      this.getProtocol(this.currentType, window.editor) // 获取协议
      let item = window.editor ? window.editor : editor
      this.edit = false
      item.readonly(true)
    },
    undisableEdit() {
      this.edit = true
      window.editor.readonly(false)
    }
  },
  created() {
    this.common.eachBtnRole(this.btnRoleList) // 按钮权限方法
  },
  mounted() {
    this.init()
  },
  destroyed() {
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.el-tabs__item {
  padding: 0;
  padding-right: 20px;
}
.filter-container /deep/ .staffAdd{
  background: rgb(51, 51, 51);
  margin-left: 20px;
  color: #fff;
}
.lf{float: left;}
.box {
  width: 100%;
  margin: 10px auto 20px auto;
  overflow-x: hidden;
  overflow-y: auto;
}
.tiels {
  width: 200px;
  float: left;
}
.tiels_name {
  font-size: 18px;
  color: #999999;
  margin-bottom: 10px;
}
.tiels_til {
  font-size: 40px;
  color: #333333;
  overflow: hidden;
  word-wrap: break-word;
}
.vn {
  width: 153px;
}
.ph {
  width: 315px;
  margin-left: 15px;
}
.ca {
  width: 25%;
}
.slo {
  width: 93%;
  border: 0;
  background-color: #f3f3f3;
  border-bottom: 1px solid #ccc;
  outline: none;
  height: 57px;
}
</style>
