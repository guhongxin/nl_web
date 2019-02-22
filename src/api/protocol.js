import request from '@/utils/request'
// 查看协议
export function watchProtocol(type) { // type类型M(Member 表示会员入会协议)，P（personal 私教协议）
  return request({
    url: '/v1/gym/protocols/' + type,
    method: 'get'
  })
}
// 编辑协议
export function editProtocol(type, name, content) {
  return request({
    url: '/v1/gym/protocols',
    method: 'POST',
    data: { type, name, content }
  })
}
// 重置协议
export function resetProtocol(type) {
  return request({
    url: '/v1/gym/protocols/' + type,
    method: 'DELETE'
  })
}
