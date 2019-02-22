import request from '@/utils/request'

// 查询员工管理列表
export function employeeList(query) {
  return request({
    url: '/v1/gym/employees',
    method: 'get',
    params: query
  })
}

export function statistics(query) {
  return request({
    url: '/v1/gym/employees/statistics',
    method: 'post',
    params: query
  })
}

// 员工详情
export function staffDetails(id) {
  return request({
    url: '/v1/gym/employees/' + id + '?by=id',
    method: 'get'
  })
}

// 修改员工
export function editEmployee(userInfo) {
  const id = userInfo.id
  const data = {
    role_id: userInfo.role,
    name: userInfo.name,
    phone: userInfo.phone,
    password: userInfo.password,
    head_portrait: userInfo.head_pic,
    start_work_time: userInfo.start,
    end_work_time: userInfo.end,
    // vacation_time_from: userInfo.vacation_time_from,
    // vacation_time_to: userInfo.vacation_time_to,
    status: userInfo.status,
    post: userInfo.post,
    emergency_contact: userInfo.egname,
    emergency_phone: userInfo.egphone,
    sex: userInfo.sex,
    introduce: userInfo.desc,
    photos: userInfo.photos
  }
  return request({
    url: '/v1/gym/employees/' + id + '?by=id',
    method: 'put',
    data: data
  })
}

// 添加员工
export function addEmployee(userInfo) {
  const data = {
    role_id: userInfo.role,
    name: userInfo.name,
    sex: userInfo.sex,
    phone: userInfo.phone,
    password: userInfo.password,
    head_portrait: userInfo.head_pic,
    start_work_time: userInfo.start,
    end_work_time: userInfo.end,
    post: userInfo.post,
    emergency_contact: userInfo.egname,
    emergency_phone: userInfo.egphone,
    introduce: userInfo.desc,
    photos: userInfo.photos
  }
  return request({
    url: '/v1/gym/employees',
    method: 'post',
    data: data
  })
}

// 删除员工
export function deleteEmployee(id) {
  return request({
    url: '/v1/gym/employees/' + id + '?by=id',
    method: 'delete'
  })
}

// 角色查询
export function selectRole() {
  return request({
    url: '/v1/gym/roles',
    method: 'get'
  })
}

// 批量处理(废弃)
export function employeesGroup(userInfo) {
  return request({
    url: '/v1/gym/employees/batch',
    method: 'post',
    data: userInfo
  })
}
// 批量处理设置教练
export function employeesGroupSet(userInfo) {
  return request({
    url: '/v1/gym/employees/bat_set_coach',
    method: 'post',
    data: userInfo
  })
}
// 批量处理取消教练
export function employeesGroupCansle(userInfo) {
  return request({
    url: '/v1/gym/employees/bat_cancel_coach',
    method: 'post',
    data: userInfo
  })
}
// 批量处理启用
export function employeesGroupUse(userInfo) {
  return request({
    url: '/v1/gym/employees/bat_enable',
    method: 'post',
    data: userInfo
  })
}
// 批量处理禁用
export function employeesGroupForbbite(userInfo) {
  return request({
    url: '/v1/gym/employees/bat_disable',
    method: 'post',
    data: userInfo
  })
}
// 绑定APP
export function bindAppByPhone(userInfo) {
  const userId = userInfo.id
  const data = {
    phone: userInfo.phoneByApp
  }
  return request({
    url: '/v1/gym/employees/' + userId + '/bind_app',
    method: 'post',
    data: data
  })
}
// 解绑APP
export function unbindAppByPhone(id) {
  return request({
    url: '/v1/gym/employees/' + id + '/unbind',
    method: 'post'
  })
}
// 启用
export function employeeEnable(id) {
  return request({
    url: '/v1/gym/employees/' + id + '/enable',
    method: 'post'
  })
}
// 禁用
export function employeeDisable(id) {
  return request({
    url: '/v1/gym/employees/' + id + '/disable',
    method: 'post'
  })
}
