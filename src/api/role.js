import request from '@/utils/request'

// 查询角色管理列表
export function roleList(query) {
  return request({
    url: '/v1/gym/roles',
    method: 'get',
    params: query
  })
}
// 删除角色列表(批量)
export function deleteRolesBatch(param) {
  return request({
    url: '/v1/gym/roles/batch',
    method: 'POST',
    data: param
  })
}
// 删除角色列表
export function deleteRoles(id) {
  return request({
    url: '/v1/gym/roles/' + id,
    method: 'delete'
  })
}
// 更新角色信息
export function updateRoles(param) {
  return request({
    url: '/v1/gym/roles/' + param.id,
    method: 'PUT',
    data: param
  })
}
// 添加权限
export function addRoles(param) {
  return request({
    url: '/v1/gym/roles',
    method: 'POST',
    data: param
  })
}
// 更新权限
export function updateAuthor(param) {
  return request({
    url: `/v1/gym/roles/${param.id}/perms`,
    method: 'PUT',
    data: param
  })
}
