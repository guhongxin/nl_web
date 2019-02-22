import request from '@/utils/request'
/* 会员卡模板--start */
// 添加会员卡模板
export function addVipCard(query) {
  return request({
    url: '/v1/gym/vip_templates',
    method: 'post',
    data: query
  })
}
// 编辑会员卡模板
export function editVipCard(query) {
  return request({
    url: '/v1/gym/vip_templates/' + query.id,
    method: 'put',
    data: query
  })
}
// 查询会员卡列表模板
export function listVipCard(query) {
  return request({
    url: '/v1/gym/vip_templates',
    method: 'get',
    params: query
  })
}
// 删除会员卡模板
export function deleteVipCard(id) {
  return request({
    url: '/v1/gym/vip_templates/' + id,
    method: 'delete'
  })
}
/* 会员卡模板--end */

/* vip会员卡列表--start */
// 查询会员卡列表
export function listSellVipCard(query) {
  return request({
    url: '/v1/gym/customer_vips',
    method: 'get',
    params: query
  })
}
// 根据卡号获取会员卡,返回门店卡和通卡，注意门店卡和通卡卡号可以一样
export function listSellVipCard1(query) {
  return request({
    url: `/v1/gym/customer_vips/get_can_sign_card_by_card_no/${query.card_no}`,
    method: 'get'
  })
}
// 查询会员卡RectBox数据
export function listRectBoxData(param) {
  return request({
    url: '/v1/gym/customer_vips/count',
    method: 'post',
    data: param
  })
}
// 删除会员卡数据
export function deleteCardData(id) {
  return request({
    url: '/v1/gym/customer_vips/' + id,
    method: 'delete'
  })
}
// 2.0删除会员卡
export function deleteCard(id) {
  return request({
    url: '/v1/gym/customer_vips/' + id,
    method: 'delete'
  })
}
// 开卡会员卡数据
export function addVipCardCustomer(query) {
  return request({
    url: '/v1/gym/customer_vips',
    method: 'post',
    data: query
  })
}

// 批量解锁会员卡
export function batchUnlockVipCard(query) {
  return request({
    url: '/v1/gym/customer_vips/bat_unlock',
    method: 'POST',
    data: query
  })
}
// 批量锁定会员卡
export function batchLockVipCard(query) {
  return request({
    url: '/v1/gym/customer_vips/bat_lock',
    method: 'POST',
    data: query
  })
}
// 批量删除会员卡
export function listBatchVipCard(ids) {
  return request({
    url: '/v1/gym/customer_vips/bat_destroy',
    method: 'POST',
    data: ids
  })
}
// 批量操作卡种
export function batchVipTemplates(query) {
  return request({
    url: '/v1/gym/vip_templates/batch',
    method: 'POST',
    data: query
  })
}
