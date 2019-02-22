import request from '@/utils/request'

// 查询员工管理列表
export function employeeList(query) {
  return request({
    url: '/v1/gym/employees',
    method: 'get',
    params: query
  })
}

// 修改客户管理信息
export function modifyCustomer(query) {
  return request({
    url: '/v1/gym/customers/' + query.id,
    method: 'PUT',
    data: query
  })
}
// 删除客户管理信息
export function deleteCustomer(id) {
  return request({
    url: '/v1/gym/customers/' + id,
    method: 'DELETE'
  })
}
// 批量操作
// export function batchCustomer(query) {
//   return request({
//     url: '/v1/gym/customers/batch',
//     method: 'POST',
//     data: query
//   })
// }
// 客户详情
export function customersDetails(query) {
  return request({
    url: '/v1/gym/customers/' + query.id,
    method: 'GET',
  })
}
// 批量删除
export function customersBatchDestroy(query) {
  return request({
    url: '/v1/gym/customers/batch_destroy',
    method: 'POST',
    data: query
  })
}
// 批量设置会籍
export function customerBatSetCon(query) {
  return request({
    url: '/v1/gym/customers/bat_set_con',
    method: 'POST',
    data: query
  })
}
// 批量设置教练
export function customerBatSetCoach(query) {
  return request({
    url: '/v1/gym/customers/bat_set_coach',
    method: 'POST',
    data: query
  })
}
// 会员恢复
export function customerRestore(id) {
  return request({
    url: `/v1/gym/customers/${id}/restore`,
    method: 'PUT'
  })
}
// 批量会员恢复
export function customerBatchRestore(param) {
  return request({
    url: `/v1/gym/customers/bat_restore`,
    method: 'POST',
    data: param
  })
}
// 获得沟通备注
export function customerWord(id, query) {
  return request({
    url: '/v1/gym/customers/' + id + '/remarks',
    method: 'get',
    params: query
  })
}
// 运动数据
export function customerSport(id, query) {
  return request({
    url: `/v1/gym/customers/${id}/sports`,
    method: 'get',
    params: query
  })
}
// app运动数据勋章
export function app_sports_medal(id) {
  return request({
    url: `/v1/gym/customers/${id}/app_sports_medal`,
    method: 'get'
  })
}
// app运动数据汇总
export function app_sports_total(id) {
  return request({
    url: `/v1/gym/customers/${id}/app_sports_total`,
    method: 'get'
  })
}
// app运动数据详情列表
export function app_sports_detail(id, param) {
  return request({
    url: `/v1/gym/customers/${id}/app_sports_detail`,
    method: 'get',
    params: param
  })
}
