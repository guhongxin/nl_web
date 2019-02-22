import request from '@/utils/request'
import SparkMD5 from 'spark-md5'
// 客户管理 - 添加
export function addCustomers(query) {
  return request({
    url: '/v1/gym/customers',
    method: 'post',
    data: query
  })
}
// 通过customerId查询用户详情
export function getCustomersById(customerid) {
  return request({
    url: '/v1/gym/customers/' + customerid,
    method: 'get'
  })
}
// 查询客户管理列表
export function customerList(query) {
  return request({
    url: '/v1/gym/customers',
    method: 'get',
    params: query
  })
}
// 查询客户管理列表
export function countList(query) {
  return request({
    url: '/v1/gym/customers/statistics',
    method: 'post',
    params: query
  })
}
// 通过手机查询客户详情
export function getCustomersByPhone(phone) {
  return request({
    url: '/v1/gym/customers/phone/' + phone,
    method: 'get'
  })
}
// 通过ID查询客户有哪些课程
export function getCustomersInfoById(id) {
  return request({
    url: '/v1/gym/customers/' + id + '/courses',
    method: 'get'
  })
}
// 添加客户获取手机验证码
export function getSmsCode(phone) {
  let curtime = new Date().getTime()
  let curStr = randomWord(false, 16)
  let data = {
    phone,
    timestamp: curtime,
    nonce: curStr,
    signature: SparkMD5.hash(curtime + phone + curStr.slice(5, 13))
  }
  return request({
    url: '/v1/gym/send_phone_code/create_customer',
    method: 'post',
    data
  })
}
// 确认客户获取手机验证码
export function getConfigSmsCode(phone) {
  let curtime = new Date().getTime()
  let curStr = randomWord(false, 16)
  let data = {
    phone,
    timestamp: curtime,
    nonce: curStr,
    signature: SparkMD5.hash(curtime + phone + curStr.slice(5, 13))
  }
  return request({
    url: '/v1/gym/send_phone_code/customer_confirm',
    method: 'post',
    data
  })
}
function randomWord(randomFlag, min, max) {
  let str = ''
  let range = min
  let arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']

  // 随机产生
  if (randomFlag) {
    range = Math.round(Math.random() * (max - min)) + min
  }
  for (let i = 0; i < range; i++) {
    let pos = Math.round(Math.random() * (arr.length - 1))
    str += arr[pos]
  }
  return str
}
