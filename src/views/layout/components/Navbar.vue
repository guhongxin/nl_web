<template>
  <el-menu class="navbar" mode="horizontal" v-bind:style="{overflow: defaultOverflow}">
    <div class="dii1" v-if="isSelect(gymType)">
      <el-select v-model="currentGym" placeholder="请选择" class="gymsList-box" @change="changeCurrentGym">
        <template v-if="!(gymType==='4')">
          <el-option
            :label="ismstoreGl(gymType)?'总店管理':'分店'"
            :value="0">
          </el-option>
        </template>
        <!-- <el-option
          v-if="GYM_NAME !== item.name"
          v-for="item in gymsList"
          :key="item.id"
          :label="'分店管理-'+item.name"
          :value="item.id">
        </el-option> -->
        <el-option
          v-for="item in gymsList"
          :key="item.id"
          :label="'分店管理-'+item.name"
          :value="item.id">
        </el-option>
      </el-select>
    </div>
    <div class="dii" v-else>{{GYM_NAME}}</div>
    <div class="right-menu">
      <!-- <i class="el-icon-download xiaoxi" @click="downloadDialogVisible = true;defaultOverflow = 'visible'" title="下载集成客户端"></i> -->
      <!-- <i class="el-icon-bell xiaoxi" @click="openMessage" title="系统消息" v-if="!isSelect(gymType)">
        <sup class="messageNotific" v-if="isSup"></sup>
      </i> -->
      <i class="el-icon-bell xiaoxi" @click="openMessage" title="系统消息" v-if="isMessage(gymType)">
        <sup class="messageNotific" v-if="isSup"></sup>
      </i>
      <!-- <el-tooltip effect="dark" :content="$t('navbar.screenfull')" placement="bottom"> -->
        <screenfull class="screenfull right-menu-item" title="全屏"></screenfull>
      <!-- </el-tooltip> -->

      <!-- <lang-select class="international right-menu-item"></lang-select> -->
  
      <el-dropdown class="avatar-container right-menu-item" trigger="click">
        <div class="avatar-wrapper">
          <img class="user-avatar" :src="CURRENT_GYM_ID===0?msavater:avater">
          <i class="el-icon-caret-bottom"></i>
        </div>
        <el-dropdown-menu slot="dropdown" class="myDropownMune">
          <el-dropdown-item style="color: #fff;background: #393e44;">
            <div>
              <span>当前帐号：</span>
              <span>{{gymAcount}}</span>
            </div>
            <div>
              <span>帐号类型：</span>
              <span :class="{'noEmployee': isEmployee}">{{accountType}}</span>
            </div>
          </el-dropdown-item>
            <router-link :to="mydesktop">
              <el-dropdown-item style="background: #292d31;color: #999;">
                我的桌面
              </el-dropdown-item>
            </router-link>
          <a @click="centerDialogVisible = true;defaultOverflow = 'visible'" v-if="isEmployee">
            <el-dropdown-item style="background: #292d31;color: #999;">
              {{$t('navbar.modifyPwd')}}
            </el-dropdown-item>
          </a>

          <el-dropdown-item class="lineTop" style="border-top:1px solid #606469;background: #292d31;padding-bottom:3px;color:#999;">
            <span @click="logout" style="display:block;">{{$t('navbar.logOut')}}</span>
          </el-dropdown-item>
          <!-- <el-dropdown-item class="lineTop" style="border-top:1px solid #606469;background: #292d31;padding-bottom:3px;color:#999;">
            <span @click="cancel" style="display:block;">注销</span>
          </el-dropdown-item> -->
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <el-dialog
      title="修改密码"
      :close-on-click-modal="false"
      :visible.sync="centerDialogVisible" class="modifyPwd-dialog" width="800px" @close="defaultOverflow = 'hidden'" :modal-append-to-body="false">
      <el-form class="modifyPwd-form" :model="forgotForm" :rules="loginRules" ref="forgotForm" label-width="150px">
        <el-form-item prop="oldpassword" label="请输入旧密码:">
          <el-input name="password" :type="oldpasswordType" v-model="forgotForm.oldpassword" placeholder="请输入旧密码" @keyup.native="upperCase($event, 1)"/><br/>
          <el-tag type="warning" v-if="caseInput&&ind===1" class="elTag">大写键盘已打开</el-tag>
          <span v-else class="show-pwd" :class="[oldpasswordType == 'password'?'':'active']" @click="oldshowPwd">
            <i class="el-icon-view"></i>
          </span>
        </el-form-item>

        <el-form-item prop="newpassword" label="请输入新密码:">
          <el-input name="password" :type="newpasswordType" v-model="forgotForm.newpassword" placeholder="请输入新密码" @keyup.native="upperCase($event, 2)"/>
          <el-tag type="warning" v-if="caseInput&&ind===2" class="elTag">大写键盘已打开</el-tag>
          <span v-else class="show-pwd" :class="[newpasswordType == 'password'?'':'active']" @click="newshowPwd">
            <i class="el-icon-view"></i>
          </span>
        </el-form-item>

        <el-form-item prop="repassword" label="请再次输入新密码:">
          <el-input name="repassword" :type="agpasswordType" v-model="forgotForm.repassword" placeholder="请再次输入新密码" @keyup.native="upperCase($event, 3)"/>
          <el-tag type="warning" v-if="caseInput&&ind===3" class="elTag">大写键盘已打开</el-tag>
          <span v-else class="show-pwd" :class="[agpasswordType == 'password'?'':'active']" @click="agshowPwd">
            <i class="el-icon-view"></i>
          </span>
        </el-form-item>
      </el-form>
      
      <div style="text-align:center;">
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="handleEditPwd">确认修改</el-button>
        </span>
      </div>
    </el-dialog>

    <el-dialog
      title="下载应用" :visible.sync="downloadDialogVisible" width="800px"  class="modifyPwd-dialog" :modal-append-to-body="false">
      <div class="downbox">
        <div class="downleft down">
          <div class="downimg macos"></div>
          <div class="downmask">macOS</div>
          <div class="downtext1">下载应用</div>
          <div class="downtext2">体验更加流畅</div>
          <a href="javascript:;" class="downbutton">敬请期待</a>
        </div>
        <div class="downright down">
          <div class="downimg window"></div>
          <div class="downmask">Windows</div>
          <div class="downtext1">下载应用</div>
          <div class="downtext2">体验更加流畅</div>
          <a class="downbutton" v-if="pingtai == 64" href="https://niulang-v2.oss-cn-beijing.aliyuncs.com/res/牛啦.zip">下载</a>
          <a class="downbutton" v-if="pingtai == 32" href="https://niulang-v2.oss-cn-beijing.aliyuncs.com/res/牛啦(32bit).zip">下载</a>
        </div>
      </div>
    </el-dialog>
    <div class="messageBox" v-bind:style="{ right: defaultRight + 'px' }" @click.stop="msgClick">
      <!-- <ul>
        <dl>@after-appear=""</dl>
      </ul> -->
      <div class="messageNumber-box" v-if="">消息<span>({{messageNumber}})</span></div>
      <el-collapse accordion @change="collapseChange" class="el-collapse-box">
        <el-collapse-item :name="item.id+'-'+ item.status1 + '-' + index" v-for="(item, index) in messageData" :key="item.id">
          <template slot="title">
            <i class='message-icon' :class="[item.status?'read-Infor':'unRead-Infor']"></i>
            <img :src="getChannelIcon(item.article_record)" class="channel-icon"/>
            <el-tooltip class="item" effect="dark" :content="item.article_record?getMessageTitle(item.article_record):''" placement="bottom">
              <span style="vertical-align:middle;margin-left:5px;">{{item.article_record?common.substring(getMessageTitle(item.article_record), 10):'-'}}</span>
            </el-tooltip>
            <span style="float:right;margin-right:5px;">{{item.created_at}}</span>
          </template>
          <div class="message-conent">
            <p class="message-title">{{item.article_record?item.article_record.title:'-'}}</p>
            <p>{{item.article_record?item.article_record.intro:'-'}}</p>
            <div class="message-conent-bottom">
              <div class="message-box" target="_blank" @click="detailsBtn(item.article_record.push_url)" v-if="item.article_record.push_url">【查看详情】
                <el-tooltip class="item" effect="dark" :content="item.article_record?item.article_record.push_url:''" placement="bottom">
                  <span>{{item.article_record?common.substring(item.article_record.push_url, 30):'-'}}</span>
                </el-tooltip>
              </div>
              <i class="el-icon-delete dustbin" title="删除" @click="deleteBtn(item.id)"></i>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
      <el-pagination
        v-if="paginationShow"
        small
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-size="per_page"
        layout="total, prev, pager, next"
        :total="total">
      </el-pagination>
    </div>
    <sys-prompt
      v-if="sysprompt"
      ref="syspromptDoc"
      @closePopup="closePopup"></sys-prompt>
    <view-detail ref="viewDetailDoc1"></view-detail>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import Hamburger from '@/components/Hamburger'
// import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
import { messageList1, viewMessages, deleteMessages, messageNumb } from '@/api/message'
import { changegym } from '@/api/mstoregym'
import { getSession, setSession } from '@/utils/auth'
// import LangSelect from '@/components/LangSelect'
import SysPrompt from './SysPrompt/SysPrompt'
import '@/icons/svg/qq.svg'
import ViewDetail from './SysPrompt/viewDetail'
export default {
  components: {
    // ErrorLog,
    Hamburger,
    Screenfull,
    SysPrompt,
    ViewDetail
  },
  data() {
    // 验证旧密码
    const validateOldPassword = (rule, value, callback) => {
      if (value.length < 8) {
        callback(new Error('密码不得少于8位'))
      } else {
        callback()
      }
    }
    // 验证新密码
    const validateNewPassword = (rule, value, callback) => {
      if (value.length < 8) {
        callback(new Error('密码不得少于8位'))
      } else {
        callback()
      }
    }
    // 验证重复密码
    const validaterePassword = (rule, value, callback) => {
      if (value.length < 8) {
        callback(new Error('密码不得少于8位'))
      } else if (this.forgotForm.newpassword !== this.forgotForm.repassword) {
        callback(new Error('两次密码不一致'))
      } else {
        callback()
      }
    }
    return {
      gymType: getSession('EMPLOYEE_TYPE'),
      currentGym: getSession('EMPLOYEE_TYPE') === '4' ? Number(getSession('SET_GYM_ID')) : getSession('CURRENT_GYM_ID') ? Number(getSession('CURRENT_GYM_ID')) : 0,
      gymAcount: '',
      accountType: '',
      pingtai: 64,
      ind: '',
      caseInput: false,
      isEmployee: true,
      avater: getSession('SET_LOGO'),
      msavater: getSession('SET_MSTORE_LOGO'), // 多店log
      GYM_NAME: getSession('SET_GYM_NAME'),
      CURRENT_GYM_ID: getSession('CURRENT_GYM_ID') ? Number(getSession('CURRENT_GYM_ID')) : 0, // 当前的CURRENT_GYM_ID,在多店页面CURRENT_GYM_ID为0或者undefined
      showMessageBox: false,
      centerDialogVisible: false,
      downloadDialogVisible: false,
      // form表单
      forgotForm: {
        oldpassword: '',
        newpassword: '',
        repassword: ''
      },
      // 表单验证规则
      loginRules: {
        oldpassword: [{ required: true, trigger: 'blur', validator: validateOldPassword }],
        newpassword: [{ required: true, trigger: 'blur', validator: validateNewPassword }],
        repassword: [{ required: true, trigger: 'blur', validator: validaterePassword }]
      },
      defaultRight: -400,
      defaultOverflow: 'hidden',
      messageData: [],
      isSup: false,
      page: 1,
      per_page: 10,
      total: 0,
      firstTime: false,
      oldpasswordType: 'password',
      newpasswordType: 'password',
      agpasswordType: 'password',
      mydesktop: '/', // 我的桌面
      messageNumber: 0,
      paginationShow: true,
      sysprompt: false
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'name',
      'avatar',
      'gymsList'
    ])
  },
  created() {
    this.firstTime = true
    let _CURRENT_GYM_ID = getSession('CURRENT_GYM_ID')
    this.mydesktop = _CURRENT_GYM_ID ? Number(_CURRENT_GYM_ID) ? '/dashboard' : '/' : '/'
    if (!/[23]/.test(this.gymType)) {
      this.$initData()
      this.getmessageNumb() // 获取消息数量
    }
    this.gymAcount = getSession('gymAcount') // 当前账号
    // if (getSession('employeeLogin') === '1') { // 员工登陆
    //   this.isEmployee = false
    //   this.accountType = '员工'
    // } else {
    //   this.isEmployee = true
    //   this.accountType = '管理员'
    // }
    switch (getSession('EMPLOYEE_TYPE')) {
      case '1':
        this.isEmployee = true
        this.accountType = '普通员工'
        break
      case '2':
        this.isEmployee = true
        this.accountType = '分店管理员'
        break
      case '3':
        this.isEmployee = true
        this.accountType = '分店超级管理员'
        break
      case '4':
        this.isEmployee = true
        this.accountType = '分店管理员'
        break
      case '5':
        this.isEmployee = true
        this.accountType = '总店超级管理员'
        break
      case '6':
        this.isEmployee = true
        this.accountType = '分店超级管理员'
        break
      default:
        this.isEmployee = false
        this.accountType = ''
    }
    // 给body绑定事件
    this.$nextTick(() => {
      document.body.addEventListener('click', this.bodyClick, false)
    })
  },
  mounted() {
    let agent = navigator.userAgent.toLowerCase()
    if (agent.indexOf('win64') >= 0 || agent.indexOf('wow64') >= 0) {
      this.pingtai = 64
    } else {
      this.pingtai = 32
    }
  },
  methods: {
    // 大写键盘
    upperCase(e, index) {
      this.ind = index
      if (e.keyCode === 20) {
        this.toggle()
      }
    },
    toggle() {
      if (this.caseInput === false) {
        this.caseInput = true
      } else {
        this.caseInput = false
      }
    },
    toggleSideBar() {
      this.$store.dispatch('toggleSideBar')
    },
    // 修改密码
    handleEditPwd() {
      this.$refs.forgotForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('EditByPassword', this.forgotForm).then(() => {
            this.loading = false
            this.$alert('密码修改成功，请返回重新登陆！', '修改密码成功', {
              showClose: false,
              confirmButtonText: '确定',
              callback: action => {
                this.logout()
              }
            })
          }).catch(() => {
            this.common.message('error', '修改失败')
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload()// In order to re-instantiate the vue-router object to avoid bugs
      })
    },
    openMessage() {
      if (this.defaultRight === 0) {
        // 信息弹框关闭
        this.showMessageBox = false
        this.defaultRight = -400
        this.defaultOverflow = 'hidden'
        this.firstTime = false
      } else {
        // 消息弹窗展开
        this.showMessageBox = true
        this.defaultRight = 0
        this.defaultOverflow = 'visible'
        if (this.firstTime) {
          return
        }
        // this.getMessageList()
      }
    },
    collapseChange(param) {
      // 读取信息内容
      if (!param) {
        return false
      }
      let arr = param.split('-')
      if (arr[1] === '1') {
        return false
      }
      let id = Number(arr[0])
      let _index = Number(arr[2])
      this.$set(this.messageData[_index], 'status', 1)
      viewMessages(id).then(res => {
        // this.getMessageList()
      }).catch(err => {
        console.log(err)
      })
    },
    deleteBtn(param) {
      // 删除消息
      let ids = param
      this.$confirm('是否删除该条消息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteMessages(ids).then(res => {
          this.page = 1
          this.pageInit()
          this.getmessageNumb()
          this.getMessageList()
        }).catch(err => {
          console.log(err)
        })
      }).catch((err) => {
        console.log(err)
      })
    },
    getMessageList() {
      let param = {
        page: this.page,
        per_page: this.per_page
      }
      this.messageData = []
      return new Promise((resolve, reject) => {
        messageList1(param).then(res => {
          let data = res.data
          this.isSup = data.some(currentValue => {
            return currentValue.status === 0
          })
          data.forEach(item => {
            item.status1 = item.status
            let obj = Object.assign({}, item)
            this.messageData.push(obj)
          })
          this.total = Number(res.headers.pagination.split(',')[1])
          // 是否强制弹窗
          let Mandpopup = data.find(item => {
            return !item.status && item.article_record && item.article_record.alert === 1
          })
          if (!Mandpopup) {
            return false
          }
          resolve({ success: true, message: '弹出弹窗', data: Mandpopup })
        }).catch(err => {
          console.log(err)
        })
      })
    },
    $initData() {
      this.getMessageList().then(res => {
        if (res.success) {
          this.sysprompt = true
          this.$nextTick(() => {
            this.$refs.syspromptDoc.openModel(res.data)
          })
        }
      })
    },
    handleCurrentChange(value) {
      this.page = value
      this.getMessageList()
    },
    changeCurrentGym(value) {
      // 切换场馆
      setSession('CURRENT_GYM_ID', value)
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      if (value === 0) {
        this.$nextTick(() => {
          this.$router.push({ path: '/mstoredashboard' })
          loading.close()
        })
      } else {
        changegym(value).then(res => {
          let data = res.data
          setSession('IS_AUTH_PASS', data.is_auth_pass)
          setSession('IS_CHECK_PASS', data.is_check_pass)
          setSession('SET_GYM_NAME', data.name)
          setSession('SET_LEGAL_PERSON_PHONE', data.legal_person_phone)
          setSession('SET_LOGO', data.logo)
          setSession('gymIsPass', JSON.stringify(data.is_auth_pass))
          setSession('SET_GYM_ID', data.id) // 切换场馆，重新设置GYM_ID
          this.avater = getSession('SET_LOGO')
          this.msavater = getSession('SET_MSTORE_LOGO')
          this.CURRENT_GYM_ID = getSession('CURRENT_GYM_ID') ? Number(getSession('CURRENT_GYM_ID')) : 0
          this.$store.dispatch('set_datedesktop')
          loading.close()
          this.$router.push({ path: '/dashboard' })
        }).catch(err => {
          console.log(err)
          let _path = this.$route.path
          if (/mstore/.test(_path)) {
            this.currentGym = 0
          } else {
            this.currentGym = Number(getSession('SET_GYM_ID'))
          }
          loading.close()
        })
      }
    },
    isSelect(param) {
      let str = '2356'
      if (param === '4') {
        if (this.gymsList.length > 1) {
          return true
        } else {
          return false
        }
      }
      return str.indexOf(param) !== -1
    },
    ismstoreGl(param) {
      let str = '356'
      return str.indexOf(param) !== -1
    },
    isMessage(param) {
      return !/[23]/.test(param)
    },
    cancel() {
      window.localStorage.clear()
      window.sessionStorage.clear()
      window.location.reload()
    },
    oldshowPwd() {
      if (this.oldpasswordType === 'password') {
        this.oldpasswordType = 'text'
      } else {
        this.oldpasswordType = 'password'
      }
    },
    newshowPwd() {
      if (this.newpasswordType === 'password') {
        this.newpasswordType = 'text'
      } else {
        this.newpasswordType = 'password'
      }
    },
    agshowPwd() {
      if (this.agpasswordType === 'password') {
        this.agpasswordType = 'text'
      } else {
        this.agpasswordType = 'password'
      }
    },
    getmessageNumb() {
      // 获取数量
      messageNumb().then(res => {
        let data = res.data
        this.messageNumber = data.count ? data.count.num : 0
      }).catch(err => {
        console.log(err)
      })
    },
    pageInit() {
      this.paginationShow = false
      this.$nextTick(() => {
        this.paginationShow = true
      })
    },
    closePopup(param) {
      // 关闭自动弹窗
      this.sysprompt = false
      viewMessages(param.id).then(res => {
        this.page = 1
        this.pageInit()
        this.getmessageNumb()
        this.getMessageList()
      }).catch(err => {
        console.log(err)
      })
    },
    detailsBtn(param) {
      // 查看详情
      console.log(param)
      this.$nextTick(() => {
        this.$refs.viewDetailDoc1.openModel(param)
      })
    },
    getMessageTitle(param) {
      let result = ''
      result = (param.channel ? param.channel.channel_name : '') + ': ' + (param.article ? param.article.title : '')
      return result
    },
    getChannelIcon(param) {
      let src = ''
      src = param.channel ? param.channel.channel_icon : ''
      return src
    },
    bodyClick(e) {
      // 点击body，当消息展开就关闭
      let doc = e.target
      if (/xiaoxi/.test(doc.className)) {
        return
      }
      this.$nextTick(() => {
        let messageBox = document.querySelector('.messageBox')
        let elMenu_horizontal = document.querySelector('#app .el-menu--horizontal')
        if (messageBox.style && messageBox.style.right === '0px') {
          elMenu_horizontal.style.overflow = 'hidden'
          this.defaultRight = -400
        }
      })
    },
    msgClick() {}
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.gymsList-box {
  width: 300px;
}
.dii {
  float: left;
  color: rgb(163, 165, 166);
  background: #000;
  height: 33px;
  line-height: 29px;
  padding: 0 18px;
  margin-top: 8px;
  margin-left: 250px;
  border-radius: 5px;
}
.dii1 {
  float: left;
  height: 33px;
  line-height: 29px;
  padding: 0 18px;
  margin-top: 8px;
  margin-left: 250px;
  /deep/ .el-input__inner{
    background-color: #000;
    border: 1px solid transparent;
    border-radius: 6px;
    color: #fff;
  }
}
.elTag {
  margin-left: 260px;
}
.downbox {
  width: 74%;
  margin: 0 auto;
  overflow: hidden;
  text-align: center;
  color: #333;
  .downmask {
    font-size: 24px;
    margin-top: 10px;
  }
  .macos {
    background: url('../../../assets/image/Apple@2x.png') no-repeat center;
    background-size: contain;
  }
  .window {
    background: url('../../../assets/image/windows@2x.png') no-repeat center;
    background-size: contain;
  }
  .down {
    border: 2px solid #dddddd;
    border-radius: 6px;
    width: 240px;
  }
  .downimg {
    height: 80px;
    width: 100%;
    margin-top: 36px;
  }
  .downtext1 {
    font-size: 14px;
    margin-top: 16px;
  }
  .downtext2 {
    font-size: 14px;
    margin-bottom: 16px;
  }
  .downbutton {
    height: 40px;
    line-height: 40px;
    border: 1px solid #1AB394;
    border-radius: 6px;
    display: block;
    width: 80%;
    margin: 0 auto;
    margin-bottom: 36px;
    color: #1AB394;
    transition: 0.25s all ease;
    &:hover {
      color: #fff;
      background-color: #1AB394;
    }
  }
  .downleft {
    float: left;
  }
  .downright {
    float: right;
  }
}
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  position: fixed;
  width: 100%;
  top:0;
  z-index: 1002;
  background-color: #333333;
  background-image: url('../../../assets/logo_img/LOGOwhite.svg');
  background-repeat: no-repeat;
  background-position: 20px;
  box-shadow: 0 1px 5px #000;
  background-size: 200px;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .breadcrumb-container{
    float: left;
  }
  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }
  .right-menu {
    float: right;
    height: 100%;
    &:focus{
     outline: none;
    }
    .right-menu-item {
      display: inline-block;
      margin: 0 8px;
    }
    .screenfull {
      height: 20px;
    }
    .international{
      vertical-align: top;
    }
    .theme-switch {
      vertical-align: 15px;
    }
    .avatar-container {
      height: 50px;
      margin-right: 50px;
      .avatar-wrapper {
        cursor: pointer;
        margin-top: 5px;
        position: relative;
        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }
        .el-icon-caret-bottom {
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
          color: #ececec;
        }
      }
    }
  }
}
.modifyPwd-form {
  margin: 50px auto 100px;
  position: relative;
  width: 62%;
  /deep/ .el-form-item__error{
    left: 0px;
  }
}
.xiaoxi {
  display: block;
  height: 50px;
  width: 50px;
  float: left;
  line-height: 50px;
  text-align: center;
  color: #ececec;
  font-size: 26px;
  cursor: pointer;
  position: relative;
  .messageNotific{
    display: inline-block;
    width: 8px;
    height: 8px;
    background-color: #f56c6c;
    border-radius: 50%;
    position: absolute;
    top: 10px;
    right: 9px;
  }
}
.messageBox {
  transition: 0.2s all ease;
  border: 1px solid #fafafa;
  width: 400px;
  position: absolute;
  background-color: #ffffff;
  top: 50px;
  z-index: 5;
  height: calc(100vh - 50px);
  overflow: auto;
  box-shadow: 0px 6px 12px 0px #cccccc;
  overflow: hidden;
  padding: 5px 5px;
  .message-icon{
    width: 20px;
    height: 48px;
    display: inline-block;
    vertical-align: middle;
    margin-right: 5px;
  }
  .read-Infor{
    background: url('../../../assets/icon/unreadInfor.svg') no-repeat center;  
    background-size: contain;
  }
  .unRead-Infor{
    background: url('../../../assets/icon/readInfor.svg') no-repeat center;
    background-size: contain;
  }
  /deep/ .el-collapse-item__header{
    color: #000000;
  }
  .message-conent{
    border: 1px solid #cccccc;
    padding: 0px 10px 10px;
    overflow: hidden;
    .message-title{
      font-size: 14px;
      color: #333333;
      letter-spacing: 0;
      line-height: 18px;
      font-weight: 600;
    }
    .message-subtitle{
      text-align: right;
      margin-right: 60px;
      font-size: 10px;
      line-height: 0px;
    }
    .message-conent-bottom{
      margin-bottom: 10px;
    }
  }
  .el-pagination{
    position: absolute;
    bottom: -28px;
    right: 0px;
  }
}
.show-pwd {
    position: absolute;
    right: 10px;
    top: 2px;
    font-size: 16px;
    color: #cccccc;
    cursor: pointer;
    user-select: none;
    &.active {
      color: #000;
    }
  }
.messageNumber-box{
  height: 50px;
  line-height: 50px;
  font-size: 18px;
  color: #333333;
  letter-spacing: 0;
  font-weight: 600;
  span{
    margin-left: 10px;
  }
}
.message-box{
  font-size: 14px;
  color: #1878E1;
  display: inline;
  cursor: pointer;
}
.dustbin{
  float: right;
  margin-top: 5px;
  cursor: pointer;
}
.el-collapse-box{
  height: 100%;
  overflow: auto;
}
.channel-icon{
  height: 20px;
  width: 20px;
  vertical-align: middle;
}
</style>
