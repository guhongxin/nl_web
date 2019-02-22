import Vue from 'vue'
import axios from 'axios'
import { getSession } from '@/utils/auth'
import { Message, Notification, Loading } from 'element-ui'
import btnlist from './role/btnlist' // Internationalization
/*
页面中只有一个组件用到focus指令
<el-input v-focus="true"></el-input>
页面中有多个组件用到focus指令
此时，需要传入class和tag来定位具体的元素
<el-input-number v-focus="{ cls: 'el-input-number',tag: 'input', foc: focus.count }"  v-on:blur="focus.count=false"></el-input-number>
 */
Vue.directive('focus', function(el, option) {
  let defClass = 'el-input'
  let defTag = 'input'
  var value = option.value || true
  if (typeof value === 'boolean') {
    value = { cls: defClass, tag: defTag, foc: value }
  } else {
    value = { cls: value.cls || defClass, tag: value.tag || defTag, foc: value.foc || false }
  }
  if (el.classList.contains(value.cls) && value.foc) {
    el.getElementsByTagName(value.tag)[0].focus()
  }
})
function haveHttps() {
  if (window.location.protocol === 'https:') {
    return true
  } else {
    return false
  }
}
class Common {
  constructor() {
    this.Message = ''
    this.loacal = window.location.hostname
    // this.loacal = '192.168.1.250:18887'
    this.whows = haveHttps() ? 'wss' : 'ws'
    this.gymid = getSession('SET_GYM_ID')
    this.token = getSession('Admin-Token')
  }

  /**
   * message box
   * @param type ('success', 'warning', 'error', '')
   * @param text (Any)
   * @returns null
   */
  message(type, text) {
    Message({
      message: text,
      type: type
    })
  }
  /**
   * message box
   * @param type ('success', 'warning', 'error', '')
   * @param text (Any)
   * @returns null
   */
  notify(title, type, text) {
    Notification({
      title: title,
      type: type,
      message: text,
      duration: 3 * 1000
    })
  }

  /**
   * bindResetValue
   * @param className (String)
   * @param equleText (String)
   * @param callback  (Function)
   * @returns null
   */
  onceEle(className, equleText, callback) {
    let sexbox = [...document.getElementsByClassName(className)]
    sexbox.forEach((item) => {
      if (item.innerText === equleText) {
        item.onclick = callback
        item.getElementsByClassName('el-table__column-filter-trigger')[0].onclick = callback
      }
    })
  }
  bigImg(ele) {
    let url = ''
    let text = ''
    if (event) {
      url = event.target.getAttribute('src')
      text = "<div style='position: fixed; top:0; left:0; right:0; bottom:0;z-index:1002;background-color: rgba(0,0,0,0.7);' onclick='javascript:try{this.parentNode.removeNode(this)} catch (err) {this.parentNode.remove(this)}'><img src=" + url + " style='max-width: 700px;margin: 10% auto 0 auto;display: block;' /></div>"
    } else {
      text = "<div style='position: fixed; top:0; left:0; right:0; bottom:0;z-index:1002;background-color: rgba(0,0,0,0.7);'></div>"
    }
    let other = document.createElement('span')
    other.innerHTML = text
    try {
      document.body.appendChild(other)
    } catch (err) {
      document.body.append(other)
    }
  }
  baseUploadImg(fileInput, callback) {
    fileInput.addEventListener('change', function() {
      let itemfile = fileInput.files[0]
      let url = '/v1/gym/oss_sign_url'
      axios.post(url, {
        type: itemfile.type,
        // content_md5: md5
        api_token: getSession('Admin-Token')
      }).then(res => {
        let xhr = new XMLHttpRequest()
        xhr.open('PUT', res.data.url)
        xhr.setRequestHeader('Content-Type', 'application/file')
        xhr.upload.onprogress = function(evt) {
          if (evt.lengthComputable) {
            let progress = Math.ceil(100 * Math.round(evt.loaded) / evt.total)
            console.log('正在提交.' + progress + '%') // 在控制台打印上传进度
            callback.progress(progress)
          }
        }
        xhr.onload = function(e) {
          let imgurl = 'https://' + res.data.bucket + '.' + res.data.endpoint + '/' + res.data.filename
          callback(imgurl)
        }
        xhr.onerror = function(e) {
          self.message('error', '图片上传出错！请重试')
        }
        xhr.send(itemfile)
      }).catch(err => {
        console.log(err)
      })
    }, false)
  }
  getClass(tagName, className) { // 获得标签名为tagName,类名className的元素
    if (document.getElementsByClassName) { // 支持这个函数
      return document.getElementsByClassName(className)
    } else {
      let tags = document.getElementsByTagName(tagName) // 获取标签
      let tagArr = [] // 用于返回类名为className的元素
      for (let i = 0; i < tags.length; i++) {
        if (tags[i].class === className) {
          tagArr[tagArr.length] = tags[i] // 保存满足条件的元素
        }
      }
      return tagArr
    }
  }
  exportExcel(url, params, type = 'get') {
    axios({ // 用axios发送post请求
      method: type,
      url: url, // 请求地址
      headers: { 'Authorization': 'Bearer ' + getSession('Admin-Token') },
      responseType: 'blob', // 表明返回服务器返回的数据类型
      params: params
    }).then((res) => { // 处理返回的文件流
      const content = res.data
      const blob = new Blob([content])
      if (!params) {
        params = {}
      }
      const fileName = params.fileName || 'download.xlsx'
      if ('download' in document.createElement('a')) { // 非IE下载
        const elink = document.createElement('a')
        elink.download = fileName
        elink.style.display = 'none'
        elink.href = URL.createObjectURL(blob)
        document.body.appendChild(elink)
        elink.click()
        URL.revokeObjectURL(elink.href) // 释放URL 对象
        document.body.removeChild(elink)
      } else { // IE10+下载
        navigator.msSaveBlob(blob, fileName)
      }
    }).catch(err => {
      console.log(err)
    })
  }
  importExcel(url, data) {
    let self = this
    let loadingInstance = null
    return new Promise((resolve, reject) => {
      let ajax = new XMLHttpRequest()
      // ajax.open('post', url, true)
      // ajax.setRequestHeader('Authorization', 'Bearer ' + getSession('Admin-Token'))
      // 文件上传
      ajax.onerror = function(e) {
        self.message('error', '文件上传出错！请重试')
      }
      ajax.onload = function(res) {
        loadingInstance.close()
        let result = res.target
        if (result.status === 200) {
          let _result = JSON.parse(result.response)
          if (!_result.status) {
            // 会员卡导入
            fileUpCheck(_result.id)
          }
          if (_result.status === 2) {
            // 验证不通过
            loadingInstance.close()
            reject(_result)
          }
          if (_result.status === 1) {
            // 检查通过,开始插入数据
            fileUpImport(_result.id)
          }
          if (_result.status === 4) {
            // 开始上传数据
            resolve(_result)
          }
        } else {
          loadingInstance.close()
          self.message('error', '文件上传出错！请重试')
        }
      }
      fileUpStarts(data)
      function fileUpStarts(param) {
        // 上传导入文件
        loadingServuce('文件正在上传，请勿操作')
        ajax.open('post', url, true)
        ajax.setRequestHeader('Authorization', 'Bearer ' + getSession('Admin-Token'))
        ajax.send(param)
      }
      function fileUpCheck(param) {
        // 导入文件检查
        loadingServuce('文件正在校验,请勿操作')
        let obj = {
          url: '/v1/gym/customer_vips/check',
          method: 'post',
          asyn: true,
          token: 'Bearer ' + getSession('Admin-Token'),
          contentType: 'application/json',
          data: {
            data_import_id: param
          }
        }
        ajaxRequst(obj)
      }
      function fileUpImport(param) {
        // 开始向数据库插入数据
        loadingServuce('正向数据库插入数据，请勿操作')
        let obj = {
          url: '/v1/gym/customer_vips/import',
          method: 'post',
          asyn: true,
          token: 'Bearer ' + getSession('Admin-Token'),
          contentType: 'application/json',
          data: {
            data_import_id: param
          }
        }
        ajaxRequst(obj)
      }
      function loadingServuce(msg) {
        loadingInstance = Loading.service({
          'fullscreen': true,
          'lock': true,
          'text': msg
        })
      }
      function ajaxRequst(obj) {
        ajax.open(obj.method, obj.url, obj.asyn)
        ajax.setRequestHeader('Authorization', obj.token)
        ajax.setRequestHeader('content-type', obj.contentType)
        ajax.send(JSON.stringify(obj.data))
      }
    })
  }
  importExcel1(url, data) {
    let self = this
    let loadingInstance = null
    return new Promise((resolve, reject) => {
      let ajax = new XMLHttpRequest()
      // 文件上传
      ajax.onerror = function(e) {
        self.message('error', '文件上传出错！请重试')
      }
      ajax.onload = function(res) {
        loadingInstance.close()
        let result = res.target
        if (result.status === 200) {
          let _result = JSON.parse(result.response)
          if (!_result.status) {
            // 会员卡导入
            fileUpCheck(_result.id)
          }
          if (_result.status === 2) {
            // 验证不通过
            loadingInstance.close()
            reject(_result)
          }
          if (_result.status === 1) {
            // 检查通过,开始插入数据
            fileUpImport(_result.id)
          }
          if (_result.status === 4) {
            // 开始上传数据
            resolve(_result)
          }
        } else {
          loadingInstance.close()
          self.message('error', '文件上传出错！请重试')
        }
      }
      fileUpStarts(data)
      function fileUpStarts(param) {
        // 上传导入文件
        loadingServuce('文件正在上传，请勿操作')
        ajax.open('post', url, true)
        ajax.setRequestHeader('Authorization', 'Bearer ' + getSession('Admin-Token'))
        ajax.send(param)
      }
      function fileUpCheck(param) {
        // 导入文件检查
        loadingServuce('文件正在校验,请勿操作')
        let obj = {
          url: '/api/v2/gym/hq/cards/unities/check',
          method: 'post',
          asyn: true,
          token: 'Bearer ' + getSession('Admin-Token'),
          contentType: 'application/json',
          data: {
            data_import_id: param
          }
        }
        ajaxRequst(obj)
      }
      function fileUpImport(param) {
        // 开始向数据库插入数据
        loadingServuce('正向数据库插入数据，请勿操作')
        let obj = {
          url: '/api/v2/gym/hq/cards/unities/import',
          method: 'post',
          asyn: true,
          token: 'Bearer ' + getSession('Admin-Token'),
          contentType: 'application/json',
          data: {
            data_import_id: param
          }
        }
        ajaxRequst(obj)
      }
      function loadingServuce(msg) {
        loadingInstance = Loading.service({
          'fullscreen': true,
          'lock': true,
          'text': msg
        })
      }
      function ajaxRequst(obj) {
        ajax.open(obj.method, obj.url, obj.asyn)
        ajax.setRequestHeader('Authorization', obj.token)
        ajax.setRequestHeader('content-type', obj.contentType)
        ajax.send(JSON.stringify(obj.data))
      }
    })
  }
  webSocket(cb) {
    let webSocketLink = new WebSocket(this.whows + '://' + this.loacal + '/saas/push/listen?gym_id=' + this.gymid + '&token=' + this.token)
    webSocketLink.onmessage = (res) => {
      // 收到服务器消息，使用res.data提取
      this.webSocketmessage(res, cb)
    }
    webSocketLink.onerror = (evt) => {
      // 产生异常
      console.log(evt)
    }
  }
  webSocketmessage(params, cb) {
    let info = JSON.parse(params.data)
    let self = this
    switch (info.Code) {
      case 0:
        this.websocketsuccess(info, cb)
        break
      case -1:
        console.error(info)
        break
      case 1:
        self.message('error', '鉴权失败，请关闭页面重新登录saas平台')
        break
      case 10:
        self.message('error', '建立的连接太多了, 建议关闭一些页面')
        break
      default:
        break
    }
  }
  websocketsuccess(params, cb) {
    if (params.Msg) {
      if (params.Msg.Type === 3) {
        cb(params)
      }
    }
  }
  eachRole(arr, path) {
    for (let item of arr) {
      if (item.path === path) {
        item.check = true
      }
      if (item.children && item.children.length) {
        this.eachRole(item.children, path)
      }
    }
  }
  eachBtnRole(object) {
    if (getSession('IS_ROOT') === 'true') {
      for (let item of btnlist) {
        object[item.id] = true
      }
    } else {
      let curbtnlist = JSON.parse(getSession('role'))
      for (let item of btnlist) {
        object[item.id] = false
        for (let curitem of curbtnlist) {
          if (item.id === curitem.id) {
            object[item.id] = true
          }
        }
      }
    }
  }
  tabRole(btnRoleList, tabMapOptions) {
    let arr = []
    for (let item in btnRoleList) {
      if (btnRoleList[item]) {
        arr.push(item)
      }
    }
    let over = []
    for (let items of arr) {
      for (let ase of tabMapOptions) {
        if (items === ase.key) {
          over.push(items)
        }
      }
    }
    return over[0]
  }
  numbText(e) {
    if (e && e.stopPropagation) {
      var code = e.which
    } else {
      code = window.event.keyCode
    }
    if (!((code >= 48 && code <= 57) || (code <= 105 && code >= 96) || code === 8 || code === 46)) {
      // 阻止事务的默认执行
      if (e && e.stopPropagation) {
        e.preventDefault()
        window.event.returnValue = false
      } else {
        window.event.returnValue = false
      }
    }
  }
  customFormat(date, fmt) {
    if (!date || /^-/.test(date) || date === '0000-00-00 00:00:00') {
      return '-'
    }
    let _date = new Date(date)
    var o = {
      'M+': _date.getMonth() + 1, // 月份
      'd+': _date.getDate(), // 日
      'h+': _date.getHours(), // 小时
      'm+': _date.getMinutes(), // 分
      's+': _date.getSeconds(), // 秒
      'q+': Math.floor((_date.getMonth() + 3) / 3), // 季度
      'S': _date.getMilliseconds() // 毫秒
    }
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (_date.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    for (var k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
      }
    }
    return fmt
  }
  // 取两位小数，相乘， 例如：（商品单价X商品价格） 返回：doublefloat
  float2() {
    let len = arguments.length
    let eg = Math.pow(100, len)
    let totle = 1
    for (let item of arguments) {
      totle *= (item * 100)
    }
    let lonret = totle / eg
    return Math.round(lonret * 100) / 100
  }
  // 身份证验证
  isCardNo(card) {
    // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
    var reg = /^[1-9]{1}[0-9]{14}$|^[1-9]{1}[0-9]{16}([0-9]|[xX])$/
    if (reg.test(card)) {
      return true
    } else {
      return false
    }
  }
  /* 映射 */
  getType(map) {
    let MAP = {}
    return function(type) {
      return MAP[type] != null ? MAP[type] : (function() {
        for (let names in map) {
          let namesArray = names.split('|')
          for (let i = 0, length = namesArray.length; i < length; i++) {
            MAP[namesArray[i]] = map[names]
          }
        }
        return MAP[type] != null ? MAP[type] : type
      })()
    }
  }
  /* 循环计算深层值 */
  getKeyarrValue(objkeyArr, result) {
    let text = result
    for (let i = 0; i < objkeyArr.length; i++) {
      text = text[objkeyArr[i]]
      if (!text) return ''
    }
    return text
  }
  /**
   * 时间筛选方法
   * @param param (时间筛选属性集合)
   * @param self (组件本身)
   */
  chooseTimerFilter(param, self) {
    let title = param.title || '时间'
    let time_start = param.rangevalue[0]
    let time_end = param.rangevalue[1]
    let text = title + ':' + time_start + '~' + time_end
    // type: 'checkbox_time' 代表时间筛选
    let time_l = { [param.data[1]]: time_start, [param.data[2]]: time_end }
    self.$set(self.tags, param.data[0], { name: text, type: 'checkbox_time', param: time_l })
    Object.assign(self.listQuery, time_l)
    self.listQuery.page = 1
    self.pageInit()
    self.getList()
  }

  /**
   * 关闭列表上方筛选tag方法
   * @param tag (当前tag)
   * @param self (组件本身)
   * @param index (当前tag的下标)
   */
  tagFilter(self, tag, index, searchlist) {
    delete self.tags[index]
    self.listQuery.page = 1
    if (tag.type === 'checkbox_time') {
      for (let o in tag.param) {
        delete self.listQuery[o]
      }
      self.pageInit()
      self.getList()
    } else {
      if (searchlist) {
        for (let item of searchlist) {
          if (item.value === tag.type) {
            delete self.listQuery.column
            delete self.listQuery.value
          }
        }
      }
      delete self.listQuery[tag.type]
      self.pageInit()
      if (!self.common.getClass('li', 'c' + tag.type)[0]) {
        self.$refs.scanIputDoc.clear()
        self.getList()
      } else {
        self.common.getClass('li', 'c' + tag.type)[0].click()
      }
    }
  }

  /**
   * 列表排序方法
   * @param self (组件本身)
   * @param data (当前排序值)
   */
  sortFilter(self, data) {
    delete self.listQuery[self.deleteItemSort]
    self.deleteItemSort = data.prop
    if (data.prop) {
      self.listQuery[data.prop] = /asc/.test(data.order) ? 'asc' : 'desc'
    } else {
      delete self.listQuery[data.prop]
    }
    self.listQuery.page = 1
    self.pageInit()
    self.getList()
  }
  /**
   * js输入框只允许输入金额
   * @param doc (DOM)
   * @param min (最小值)
   * @param max (最大值)
   */
  check(doc, min, max) {
    let regStrs = [
      [`^0[1-9]`, '0'], // 禁止录入0后面跟数字
      [`^0(\\d+)$`, '$1'], // 禁止录入整数部分两位以上，但首位为0
      ['[^\\d\\.]+$', ''], // 禁止录入任何非数字和点
      ['\\.(\\d?)\\.+', '.$1'], // 禁止录入两个以上的点
      ['^(\\d+\\.\\d{2}).+', '$1'] // 禁止录入小数点后两位以上
    ]
    for (let i = 0; i < regStrs.length; i++) {
      let reg = new RegExp(regStrs[i][0])
      doc.value = doc.value.replace(reg, regStrs[i][1])
    }
    if (Number(doc.value) < min) {
      doc.value = min
    } else if (Number(doc.value) > max) {
      doc.value = doc.value.substring(0, doc.value.length - 1)
    }
    return doc.value
  }

  /**
   * 超出显示省略号
   * @param str String (任意长度字符串)
   * @param num int (整数类型-截取的字符串长度)
   */
  substring(str, num) {
    if (!str) {
      return ''
    }
    if (str.length > num) {
      return str.substring(0, num) + '...'
    } else {
      return str
    }
  }
  /**
   * 去除空格，包含半角空格，全角空格以及s\这种普通空格
   * @param str String (任意长度字符串)
   * 此方法是原生JS自带的trim方法
   */
  delWhite(str) {
    return str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '')
  }
  /**
   * 导出Excel表格
   */
  formatJson(filterVal, jsonData) {
    return jsonData.map(v => filterVal.map(j => v[j]))
  }
  /**
   * 合并表头
   *  @param data Arry (需要合并的数据)
   */
  MergeExcelHard(data) {
    var arr = data
    let mergesArr = []
    arr[0].forEach((item, index) => {
      if (item) {
        mergesArr[mergesArr.length] = {
          s: {},
          e: {}
        }
        mergesArr[mergesArr.length - 1].s.c = index
        mergesArr[mergesArr.length - 1].s.r = 0
        mergesArr[mergesArr.length - 1].e.c = index
        mergesArr[mergesArr.length - 1].e.r = 0
      } else {
        mergesArr[mergesArr.length - 1].e.c = index
      }
    })
    mergesArr.forEach((item, index) => {
      if (arr[1][item.e.c] === '') {
        mergesArr[index].e.r = 1
      }
    })
    return mergesArr
  }
}
Vue.prototype.common = new Common()
