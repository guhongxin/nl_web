// 多店管理员
import request from '@/utils/request'

// 查询员超级管理员账号列表
export function msSAdminList(param) {
  return request({
    url: '/api/v2/gym/hq/employees',
    method: 'GET',
    params: param
  })
}
// 删除管理员
export function deletemsSAdmin(id) {
  return request({
    url: '/api/v2/gym/hq/employees/' + id,
    method: 'DELETE'
  })
}
// 创建账号
export function addmsSAdmin(param) {
  return request({
    url: '/api/v2/gym/hq/employees',
    method: 'POST',
    data: param
  })
}
// 根据管理员id查找管理员详情
export function getEmployeesId(id) {
  return request({
    url: `/api/v2/gym/hq/employees/${id}`,
    method: 'GET'
  })
}
// 修改管理员账号
export function modifyEmployee(param) {
  return request({
    url: `/api/v2/gym/hq/employees/${param.id}`,
    method: 'PUT',
    data: param
  })
}
