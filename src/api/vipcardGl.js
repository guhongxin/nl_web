import request from '@/utils/request'
/* 会员卡管理 */
// 会员卡详情
export function vipCardDetails(id) {
  return request({
    url: '/v1/gym/customer_vips/' + id,
    method: 'GET'
  })
}
// 会员卡停卡
export function stopVipCard(query) {
  return request({
    url: '/v1/gym/stop_cards/' + query.id,
    method: 'PUT',
    data: query
  })
}
// 新编辑会员卡
export function neweditVipCardGl(query) {
  return request({
    url: '/v1/gym/customer_vips/' + query.id,
    method: 'put',
    data: query
  })
}
// 锁卡-会员卡
export function lockVipCardGl(query) {
  return request({
    url: '/v1/gym/customer_vips/' + query.id + '/lock',
    method: 'post',
    data: query
  })
}
// 解锁-会员卡
export function unlockVipCardGl(query) {
  return request({
    url: '/v1/gym/customer_vips/' + query.id + '/unlock',
    method: 'post',
    data: query
  })
}
// 2.0取消停卡
export function cencelVipCardGl(query) {
  return request({
    url: '/v1/gym/customer_vips/' + query.id + '/cancel/stop',
    method: 'POST',
    data: query
  })
}
// 中断停卡
export function breakVipCardGl(query) {
  return request({
    url: '/v1/gym/customer_vips/' + query.id + '/break_stop',
    method: 'POST',
    data: query
  })
}
// 2.0预约停卡
export function prestopVipCardGl(query) {
  return request({
    url: '/v1/gym/customer_vips/' + query.id + '/prestop',
    method: 'POST',
    data: query
  })
}
// 续卡
export function continueVipCardGl(query) {
  return request({
    url: '/v1/gym/customer_vips/' + query.id + '/renew',
    method: 'POST',
    data: query
  })
}
// 转卡
export function transferVipCard(query) {
  return request({
    url: '/v1/gym/customer_vips/' + query.id + '/transfer',
    method: 'post',
    data: query
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
// 签到记录（入场签到）
export function checkInRecord1(query) {
  return request({
    url: '/v1/gym/sign/list',
    method: 'GET',
    params: query
  })
}
// 签到记录（会员卡管理）
export function checkInRecord2(id, query) {
  return request({
    url: '/v1/gym/sign/card-list/' + id,
    method: 'GET',
    params: query
  })
}
// 根据手机查找用户
export function getPhoneCustomers(phone) {
  return request({
    url: '/v1/gym/customers/phone/' + phone,
    method: 'GET'
  })
}
// 停卡记录
export function stopCardRecord(query) {
  return request({
    url: '/v1/gym/stop_cards/' + query.vip_id,
    method: 'GET',
    params: query
  })
}
// 转卡记录
export function transferCardsRecord(query) {
  return request({
    url: '/v1/gym/transfer_cards/' + query.vip_id,
    method: 'GET',
    params: query
  })
}
// 批量导出excel
export function BatchExportCards(query) {
  return request({
    url: '/v1/gym/excel_export',
    method: 'GET',
    data: query
  })
}
// 停卡信息
export function stopCardInfor(id) {
  return request({
    url: '/v1/gym/stop_cards/info/' + id,
    method: 'GET'
  })
}
// 恢复已删除会员卡(批量)
export function reliveCard(param) {
  return request({
    url: '/v1/gym/customer_vips/bat_restore',
    method: 'POST',
    data: param
  })
}
// 恢复已删除会员卡(单个)
export function oneReliveCard(id) {
  return request({
    url: '/v1/gym/customer_vips/' + id + '/restore',
    method: 'POST'
  })
}
// 激活
export function activeCard(id) {
  return request({
    url: `/v1/gym/customer_vips/${id}/active`,
    method: 'POST'
  })
}
// 导入Excel异常数据查询
export function cardInpormtErrInfor(query) {
  return request({
    url: `/v1/gym/vip_log`,
    method: 'GET',
    params: query
  })
}
// 批量硬删除
export function cardbatforcedel(query) {
  return request({
    url: `/v1/gym/customer_vips/bat_force_del`,
    method: 'POST',
    data: query
  })
}
// 单个硬删除
export function dgcardbatforcedel(id) {
  return request({
    url: `/v1/gym/customer_vips/${id}/force`,
    method: 'DELETE'
  })
}
// 清空回收站
export function clearrecyclebin(param) {
  return request({
    url: `/v1/gym/customer_vips/clear_recycle_bin`,
    method: 'POST',
    data: param
  })
}
// 移动会员卡到回收站
// export function movetorecyclebin(param) {
//   return request({
//     url: `/v1/gym/vip_cards/move_to_recycle_bin`,
//     method: 'POST',
//     data: param
//   })
// }
// 新的导入Excel异常数据查询
export function newcardInpormtErrInfor(query) {
  return request({
    url: `/v1/gym/customer_vips/import/errors`,
    method: 'POST',
    data: query
  })
}
// 数据导入管理详情
export function cardInpormtDetails(id) {
  return request({
    url: `/v1/gym/data/imports/${id}`,
    method: 'GET'
  })
}
// 数据导入管理 - 重新尝试导入所有失败的
export function cardInpormtRetryAll(id) {
  return request({
    url: `/v1/gym/data/imports/${id}/retry/all`,
    method: 'POST'
  })
}
// 续卡列表
export function renewalCardList(id, query) {
  return request({
    url: `/v1/gym/customer_vips/${id}/renews`,
    method: 'GET',
    params: query
  })
}
// 扣次
export function deductVipCardGl(id, query) {
  return request({
    url: `/v1/gym/use_cards/use/${id}`,
    method: 'PUT',
    data: query
  })
}
// 扣次列表
export function deducCardList(id, query) {
  return request({
    url: `/v1/gym/use_cards/${id}/times`,
    method: 'GET',
    params: query
  })
}
// 批量开卡
export function batCardOpen(param) {
  return request({
    url: `/v1/gym/customer_vips/bat_active`,
    method: 'POST',
    data: param
  })
}
// 扣费列表
export function deducCardexpenseList(id, query) {
  return request({
    url: `/v1/gym/customer_vips/${id}/debit_card_expense_list`,
    method: 'GET',
    params: query
  })
}
// 储值卡扣费
export function deductCardMoney(id, query) {
  return request({
    url: `/v1/gym/customer_vips/deduction/${id}`,
    method: 'PUT',
    params: query
  })
}
// 获取有效储值卡列表
export function cardsNoList(query) {
  return request({
    url: `/v1/gym/customer_vips/debit_card`,
    method: 'GET',
    params: query
  })
}
