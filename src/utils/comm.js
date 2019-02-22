export function timeFormat(param) {
  if (!param) {
    return null
  }
  let date = new Date(param)
  let result = ''
  let year = date.getFullYear()
  let month = date.getMonth() + 1 > 9 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)
  let day = date.getDate() > 9 ? date.getDate() : '0' + date.getDate()
  result = year + '-' + month + '-' + day
  return result
}
export function timeFormat2(param) {
  if (!param) {
    return ''
  }
  let date = new Date(param)
  let result = ''
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()
  let hour = date.getHours() > 9 ? date.getHours() : '0' + date.getHours()
  let mins = date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes()
  result = year + '/' + month + '/' + day + ' ' + hour + ':' + mins
  return result
}
export function remnantDay(endDate) {
  let result = 0
  let statDate = timeFormat(new Date())
  let _endDate = customFormat1(endDate, 'yyyy-MM-dd')
  if (new Date(_endDate) >= new Date(statDate)) {
    result = (new Date(_endDate) - new Date(statDate)) / 86400000
  } else {
    result = 0
  }
  return result
}
// 获取员工
export function getEmployeeSelectVule(arr, id) {
  let result = null
  if (id === null) {
    return result
  }
  let _arr = arr.find(currentVule => {
    return currentVule.id === id
  })
  if (_arr) {
    result = _arr.id
  } else {
    result = null
  }
  return result
}
export function phoneVerification(rule, value, callback) {
  if (!(/^1[0-9]{10}$/.test(value))) {
    callback(new Error('请输入正确的手机号码'))
  } else {
    callback()
  }
}
export function sfcodeVerification(rule, value, callback) {
  let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
  if (!reg.test(value)) {
    callback(new Error('请输入正确的身份证号码'))
  } else {
    callback()
  }
}
export function channelDictionary(param) {
  let result = ''
  switch (param) {
    case 0:
      result = '无'
      break
    case 1:
      result = '电话收集'
      break
    case 2:
      result = '拉人到店'
      break
    case 3:
      result = '自然访问'
      break
    case 4:
      result = '会员介绍'
      break
    case 5:
      result = '朋友介绍'
      break
    case 6:
      result = 'App'
      break
    case 7:
      result = '内购'
      break
    case 8:
      result = '宣传单'
      break
    case 9:
      result = '网络推广'
      break
    case 10:
      result = '团购'
      break
    case 11:
      result = '杂志期刊'
      break
    case 12:
      result = '新闻媒体'
      break
    case 13:
      result = '户外广告'
      break
    case 14:
      result = '其它'
      break
    default:
      result = '其它'
  }
  return result
}
export function cardStatus(param) {
  let result = ''
  switch (param) {
    case 1:
      result = '有效'
      break
    case 2:
      result = '即将到期'
      break
    case 3:
      result = '已过期'
      break
    case 4:
      result = '停卡中'
      break
    case 5:
      result = '未激活'
      break
    case 6:
      result = '预约停卡'
      break
    case 7:
      result = '回收站'
      break
    default:
      result = '其它'
  }
  return result
}
export function purposeDictionary(param) {
  let result = ''
  switch (param) {
    case 0:
      result = '减脂'
      break
    case 1:
      result = '增肌'
      break
    case 2:
      result = '塑形'
      break
    default:
      result = '其它'
  }
  return result
}
export function purposeDictionary1(param) {
  let result = ''
  switch (param) {
    case 'J':
      result = '减脂'
      break
    case 'Z':
      result = '增肌'
      break
    case 'S':
      result = '塑形'
      break
    default:
      result = '其它'
  }
  return result
}
export function intent_levelDictionary(param) {
  let result = ''
  switch (param) {
    case 0:
      result = '不明'
      break
    case 1:
      result = '强烈'
      break
    case 2:
      result = '一般'
      break
    default:
      result = '其它'
  }
  return result
}
export function body_typeDictionary(param) {
  // 体测
  let result = ''
  switch (param) {
    case 0:
      result = '隐形肥胖'
      break
    case 1:
      result = '偏胖'
      break
    case 2:
      result = '肥胖'
      break
    case 3:
      result = '偏瘦肌肉'
      break
    case 4:
      result = '标准'
      break
    case 5:
      result = '非常肌肉'
      break
    case 6:
      result = '偏瘦'
      break
    case 7:
      result = '标准肌肉'
      break
    case 8:
      result = '运动不足'
      break
    default:
      result = '其它'
  }
  return result
}
export function payment_methodDictionary(param) {
  // 体测
  let result = ''
  switch (Number(param)) {
    case 1:
      result = '现金'
      break
    case 2:
      result = '支付宝'
      break
    case 3:
      result = '微信'
      break
    case 4:
      result = '银行卡'
      break
    case 5:
      result = '储值卡'
      break
    default:
      result = '其它'
  }
  return result
}
export function getSelectDocArr(param1, param2) {
  let docArry = document.querySelectorAll(param1)
  let _docLength = docArry.length
  let selectDocIndex = []
  if (_docLength === 0) {
    return []
  }
  for (let i = 0; i < _docLength; i++) {
    if (docArry[i].className.indexOf(param2) !== -1) {
      selectDocIndex.push(i)
    }
  }
  return selectDocIndex
}
export function creatnoticeDom(doc, isTrue, text) {
  let parentNode = doc.parentNode
  if (parentNode.lastChild.tagName === 'P') {
    doc.parentNode.removeChild(parentNode.lastChild)
  }
  if (!isTrue) {
    doc.style.borderColor = '#f56c6c'
    let p = document.createElement('p')
    p.style.color = '#f56c6c'
    p.style.textAlign = 'left'
    p.style.fontSize = '10px'
    p.style.lineHeight = '0px'
    p.style.position = 'absolute'
    p.style.top = '35px'
    p.style.left = '0px'
    p.style.width = '100%'
    p.innerText = text
    parentNode.appendChild(p)
  } else {
    doc.style.borderColor = '#dcdfe6'
  }
}
export function creatNoticeInput(doc, text, isInsert) {
  let parentNode = doc.parentNode
  if (parentNode.lastChild.tagName === 'P') {
    doc.parentNode.removeChild(parentNode.lastChild)
  }
  if (isInsert) {
    let p = document.createElement('p')
    p.style.color = '#cccccc'
    p.style.textAlign = 'left'
    p.style.fontSize = '10px'
    p.style.lineHeight = '0px'
    p.style.position = 'absolute'
    p.style.top = '35px'
    p.style.left = '0px'
    p.style.width = '100%'
    p.innerText = text
    parentNode.appendChild(p)
  }
}
export function customFormat1(date, fmt) {
  if (/^-/.test(date) || date === '0000-00-00 00:00:00') {
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
export function cardtype_Dictionary(param) {
  // 卡种类型
  let result = ''
  switch (param) {
    case 1:
      result = '时效卡'
      break
    case 2:
      result = '次卡'
      break
    case 3:
      result = '储值卡'
      break
    default:
      result = '时效卡'
  }
  return result
}
export function consumerUse_Dictionary(param) {
  // 卡种类型
  let result = ''
  switch (param) {
    case 1:
      result = '购买商品'
      break
    case 2:
      result = '开卡'
      break
    case 3:
      result = '私教课'
      break
    case 4:
      result = '转卡'
      break
    case 5:
      result = '停卡'
      break
    case 6:
      result = '团课'
      break
    case 7:
      result = '会员卡续费'
      break
    case 8:
      result = '租柜'
      break
    case 9:
      result = '续柜'
      break
    default:
      result = '时效卡'
  }
  return result
}
export function showMask() {
  let text = "<div style='position: fixed; top:0; left:0; right:0; bottom:0;z-index:1002;background-color: rgba(0,0,0,0.7);'></div>"
  let other = document.createElement('span')
  other.innerHTML = text
  try {
    document.body.appendChild(other)
  } catch (err) {
    document.body.append(other)
  }
}
