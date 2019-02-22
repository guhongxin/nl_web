// 多店场馆
import request from '@/utils/request'

// 多店场馆列表
// export function msgymsList(param) {
//   return request({
//     url: '/api/v2/gym/hq/gyms',
//     method: 'GET',
//     params: param
//   })
// }
export function msgymsList(param) {
  return request({
    url: '/v1/gym/auth/get_manage_gyms',
    method: 'GET',
    params: param
  })
}
// 增加场馆列表
export function addMsgyms(param) {
  return request({
    url: '/api/v2/gym/hq/bind',
    method: 'POST',
    data: param
  })
}
// 多店切换
export function changegym(id) {
  return request({
    url: `/v1/gym/auth/change_gym/${id}`,
    method: 'POST'
  })
}
// 获取总店信息
export function getMsGYMInfor() {
  return request({
    url: `/api/v2/gym/hq/master`,
    method: 'GET'
  })
}
