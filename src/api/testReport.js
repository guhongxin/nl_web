import request from '@/utils/request'

// 根据手机号查询客户信息
export function customerBnPhone(phone) {
  return request({
    url: '/v1/gym/customers/phone/' + phone,
    method: 'get',
  })
}
// 查询员工
export function findEmployees(query) {
  return request({
    url: '/v1/gym/employees',
    method: 'GET',
    params: query
  })
}
// 修改客户
export function updateCustomers(query) {
  return request({
    url: '/v1/gym/customers/' + query.id,
    method: 'PUT',
    data: query
  })
}
// 添加客户
export function addCustomers(query) {
  return request({
    url: '/v1/gym/customers',
    method: 'POST',
    data: query
  })
}
// 体测录入
export function physicalTestInput(query) {
  return request({
    url: '/v1/gym/body_exams',
    method: 'POST',
    data: query
  })
}
// 批量删除体测
export function batchDeletPhysicalTest(query) {
  return request({
    url: '/v1/gym/body_exams/batch',
    method: 'POST',
    data: query
  })
}
// 更新体测
export function updatePhysicalTest(query) {
  return request({
    url: '/v1/gym/body_exams/' + query.id,
    method: 'PUT',
    data: query
  })
}
// 体测查询
export function bodyExamFind(id) {
  return request({
    url: '/v1/gym/body_exams/' + id,
    method: 'GET'
  })
}
// 体测列表
export function bodyExamList(param) {
  return request({
    url: '/v1/gym/body_exams',
    method: 'GET',
    params: param
  })
}
// 多店会员详情查看体测列表
export function msbodyExamList(id, param) {
  return request({
    url: `/api/v2/gym/hq/customers/${id}/body-exams`,
    method: 'GET',
    params: param
  })
}
/* 获取参数q */
export function getParamQ(id) {
  let BASE_HEAD_PROTOCOL = ''
  let BASE_HEAD_URL = ''
  if (document.location.protocol === 'http:') {
    BASE_HEAD_PROTOCOL = 'http://'
  } else {
    BASE_HEAD_PROTOCOL = 'https://'
  }
  if (window.location.host === 'www.nlfit.cn') {
    /* online */
    BASE_HEAD_URL = (BASE_HEAD_PROTOCOL + 'h5-nlfit.cn')
  } else if (window.location.host === 'www-ceshi.nlfit.cn') {
    /* test */
    BASE_HEAD_URL = (BASE_HEAD_PROTOCOL + 'h5-ceshi.nlfit.cn')
  } else {
    /* 128 */
    BASE_HEAD_URL = (BASE_HEAD_PROTOCOL + 'h5-dev.nlfit.cn')
  }
  return new Promise((resolve, reject) => {
    // 步骤一:创建异步对象
    let ajax = new XMLHttpRequest()
    // 步骤二:设置请求的url参数,参数一是请求的类型,参数二是请求的url,可以带参数,动态的传递参数starName到服务端
    ajax.open('get', BASE_HEAD_URL + '/web_proxy/gym/yj_exams/' + id)
    // 步骤三:发送请求
    ajax.send()
    // 步骤四:注册事件 onreadystatechange 状态改变就会调用
    ajax.onreadystatechange = () => {
      if (ajax.readyState === 4 && ajax.status === 200) {
        // 步骤五 如果能够进到这个判断 说明 数据 完美的回来了,并且请求的页面是存在的
        resolve(JSON.parse(ajax.responseText))
      }
    }
    ajax.error = () => {
      reject()
    }
  })
}
