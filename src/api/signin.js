import request from '@/utils/request'

// 获取签到记录列表
export function getSignList(query) {
  return request({
    url: '/v1/gym/sign',
    method: 'get',
    params: query
  })
}
// 获取签到记录列表弹框
export function signListDialog(query) {
  return request({
    url: '/v1/gym/sign/list',
    method: 'get',
    params: query
  })
}
// 获取今日签到数
export function getTodaySignNum(query) {
  return request({
    url: '/v1/gym/sign/member',
    method: 'get'
  })
}
// 签到或签出
export function SignOrOut(query) {
  return request({
    url: '/v1/gym/sign',
    method: 'POST',
    data: query
  })
}
// 借出手牌
export function lendCabinetAll(query) {
  return request({
    url: '/v1/gym/cabinet_bracelets/lend',
    method: 'GET'
  })
}

// 确认出场
export function outSignById(id) {
  return request({
    url: '/v1/gym/sign/' + id,
    method: 'PUT'
  })
}

// 潜客登记
export function addHiddenGuest(params) {
  return request({
    url: '/v1/gym/customers',
    method: 'POST',
    data: params
  })
}

// 一键清场
export function cleanSign() {
  return request({
    url: '/v1/gym/sign/clean',
    method: 'POST'
  })
}
// 根据电话号码去签到
export function phoneSignV2(param) {
  return request({
    url: '/api/v2/gym/customers/sign-list',
    method: 'GET',
    params: param
  })
}
