import request from '@/utils/request'

// 查询消息列表
export function messageList(query) {
  return request({
    url: '/v1/gym/message_notices',
    method: 'get',
    params: query
  })
}
// 消息详情
export function messageDetails(id) {
  return request({
    url: '/v1/gym/message_notices/' + id,
    method: 'get'
  })
}
// 批量删除
export function messageBatchDelete(param) {
  return request({
    url: '/v1/gym/message_notices/batch',
    method: 'POST',
    data: param
  })
}
// 消息数量
export function messageNumb() {
  return request({
    url: '/v1/gym/article_detail/statistics',
    method: 'POST'
  })
}
// 获取总后台推送的消息
export function messageList1(query) {
  return request({
    url: '/v1/gym/article_detail',
    method: 'get',
    params: query
  })
}
// 查看推送消息
export function viewMessages(id) {
  return request({
    url: `/v1/gym/article_detail/${id}`,
    method: 'PUT'
  })
}
// 删除推送消息
export function deleteMessages(id) {
  return request({
    url: `/v1/gym/article_detail/${id}`,
    method: 'DELETE'
  })
}
