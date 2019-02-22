import request from '@/utils/request'

// 操作日志查询
export function logList(query) {
  return request({
    // url: '/v1/gym/operation_logs',
    url: '/api/v2/gym/logs',
    method: 'get',
    params: query
  })
}
