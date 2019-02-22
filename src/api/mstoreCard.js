// 多店通卡
import request from '@/utils/request'

// 多店通卡列表
export function msCardList(param) {
  return request({
    url: '/api/v2/gym/hq/cards/unities',
    method: 'GET',
    params: param
  })
}
// 多店通卡统计数据
export function msCardTypeNumb(param) {
  return request({
    url: '/api/v2/gym/hq/cards/unities/stat',
    method: 'GET',
    params: param
  })
}
// 删除单张通卡
export function deletemsCard(id) {
  return request({
    url: `/api/v2/gym/hq/cards/unities/${id}`,
    method: 'DELETE'
  })
}
// 批量删除通卡
export function batchDeletemsCard(param) {
  return request({
    url: '/api/v2/gym/hq/cards/unities/batch-delete',
    method: 'POST',
    data: param
  })
}
// 通卡停卡切换
export function msCardstatusToggle(param) {
  return request({
    url: `/api/v2/gym/hq/cards/unities/${param.id}/status-toggle`,
    method: 'PUT',
    data: param
  })
}
// 通卡导入Excel异常数据异常
export function msCardInpormtErrInfor(query) {
  return request({
    url: `/api/v2/gym/hq/cards/unities/import/errors`,
    method: 'POST',
    data: query
  })
}
// 通卡导入数据详情
export function msCardInpormtDetails(id) {
  return request({
    url: `/v1/gym/data/imports/${id}`,
    method: 'GET'
  })
}
// 数据导入管理 - 重新尝试导入所有失败的
export function msCardInpormtRetryAll(id) {
  return request({
    url: `/v1/gym/data/imports/${id}/retry/all`,
    method: 'POST'
  })
}
// 通卡签到记录
export function mscheckInRecord(id, query) {
  return request({
    url: '/api/v2/gym/hq/cards/unities/card-list/' + id,
    method: 'GET',
    params: query
  })
}
// 通卡停卡记录
export function msstopCardRecord(query) {
  return request({
    url: '/api/v2/gym/hq/cards/unities/stop_cards/' + query.vip_id,
    method: 'GET',
    params: query
  })
}

// 通卡转卡记录
export function mstransferCardsRecord(query) {
  return request({
    url: '/api/v2/gym/hq/cards/unities/transfer_cards/' + query.vip_id,
    method: 'GET',
    params: query
  })
}

// 通卡续卡列表
export function msrenewalCardList(id, query) {
  return request({
    url: `/api/v2/gym/hq/cards/unities/${id}/renews`,
    method: 'GET',
    params: query
  })
}
// 通卡扣次列表
export function msdeducCardList(id, query) {
  return request({
    url: `/api/v2/gym/hq/cards/unities/${id}/times`,
    method: 'GET',
    params: query
  })
}
// 通卡硬删除
export function msdeforceDeleteCard(id) {
  return request({
    url: `/api/v2/gym/hq/cards/unities/${id}/force`,
    method: 'DELETE'
  })
}
