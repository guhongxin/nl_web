// 多店会员
import request from '@/utils/request'

// 多店会员列表
export function msCustomerList(param) {
  return request({
    url: '/api/v2/gym/hq/customers/unities',
    method: 'GET',
    params: param
  })
}

// 多店会员统计
export function msCustomerNumb(param) {
  return request({
    url: '/api/v2/gym/hq/customers/unities/stat',
    method: 'GET',
    params: param
  })
}
