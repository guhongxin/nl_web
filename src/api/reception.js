import request from '@/utils/request'

// 查询角色管理列表
export function getSignList(query) {
  return request({
    url: '/v1/gym/roles',
    method: 'get',
    params: query
  })
}
