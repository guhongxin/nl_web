import request from '@/utils/request'

// 查询私教课程购买列表
export function courseBuyList(query) {
  return request({
    url: '/v1/gym/customer_courses',
    method: 'get',
    params: query
  })
}
// 查询私教预约列表
export function courseConsumeList(query) {
  return request({
    url: '/v1/gym/course_consumes',
    method: 'get',
    params: query
  })
}
// 私教预约统计
export function consumeCountList(query) {
  return request({
    url: '/v1/gym/course_consumes/statistics',
    method: 'post',
    params: query
  })
}

// 查询私教课程
export function privateCourseList(query) {
  return request({
    url: '/v1/gym/courses',
    method: 'get',
    params: query
  })
}

// 查询私教课程教练
export function getAllCoatch(query) {
  const data = {
    per_page: query.per_page,
    page: query.page,
    cname_like: query.cname_like,
    cphone_like: query.cphone_like,
    csex: query.sex,
    price_sort: query.price_sort
  }
  return request({
    url: '/v1/gym/courses/' + query.course_id + '/coaches',
    method: 'get',
    params: data
  })
}

// 查询私教购买教练
export function getAllCoatchBuy(id) {
  return request({
    url: '/v1/gym/courses/' + id + '/coaches',
    method: 'get'
  })
}

// 查询私教购买教练2
export function getCoatchList(query) {
  return request({
    url: '/v1/gym/course_coaches',
    method: 'get',
    params: query
  })
}

// 查询销售员工
export function getAllStaff() {
  return request({
    url: '/v1/gym/employees',
    method: 'get'
  })
}

// 修改客户信息
export function editCustomer(userInfo) {
  const id = userInfo.customerId
  const data = {
    'phone': userInfo.customerPhone,
    'name': userInfo.customerName,
    'sex': userInfo.customerSex,
    'consultant_id': userInfo.consultant_id,
    'coach_id': userInfo.coach_id
  }
  return request({
    url: '/v1/gym/customers/' + id + '?by=id',
    method: 'put',
    data
  })
}
// 修改购买私教客户信息
export function editBuyCustomer(userInfo) {
  const id = userInfo.customerId
  const data = {
    'phone': userInfo.customerPhone,
    'name': userInfo.customerName,
    'sex': userInfo.customerSex,
    'consultant_id': userInfo.consultant_id
  }
  return request({
    url: '/v1/gym/customers/' + id + '?by=id',
    method: 'put',
    data
  })
}
// 购买课程
export function courseBuy(userInfo) {
  const data = {
    'customer_id': userInfo.customerId,
    'coucoach_id': userInfo.coach_id,
    'sell_id': userInfo.sell_id,
    'quantity': userInfo.quantity,
    'payment_method': userInfo.payment_method,
    'real_total_fee': userInfo.real_total_fee,
    'expired_at': userInfo.expired_at,
    'remark': userInfo.remark,
    'debit_card_id': userInfo.debit_card_id
  }
  return request({
    url: '/v1/gym/course_orders',
    method: 'post',
    data: data
  })
}

// 删除私教购买
export function deletePrivateBuy(id) {
  return request({
    url: '/v1/gym/customer_courses/' + id + '?by=id',
    method: 'delete',
  })
}

// 私教购买详情
export function detailPrivateBuy(id) {
  return request({
    url: '/v1/gym/customer_courses/' + id,
    method: 'get',
  })
}

// 修改私教购买
export function editPrivateBuy(userInfo) {
  const data = {
    'course_id': userInfo.course_id,
    'coach_id': userInfo.coach_id,
    'remark': userInfo.remark,
    'expired_at': userInfo.expired_at
  }
  const id = userInfo.id
  return request({
    url: '/v1/gym/customer_courses/' + id + '?by=id',
    method: 'put',
    data
  })
}

// 批量操作日志
export function remarkOporate(userInfo) {
  const data = {
    'ids': userInfo.ids
  }
  return request({
    url: '/v1/gym/customer_courses/batch',
    method: 'post',
    data
  })
}

// 私教课程查询
export function privateCourseLists() {
  return request({
    url: '/v1/gym/courses',
    method: 'get'
  })
}

// 查询员工管理列表中的所有教练
export function privateCoachList(query) {
  return request({
    url: '/v1/gym/employees',
    method: 'get',
    params: query
  })
}
// 添加教练
export function addPrivateCoach(userInfo) {
  const data = {
    // 'coach_id': userInfo.coach_id,
    'price': userInfo.price,
    'coach_id': userInfo.coach_id
  }
  return request({
    url: '/v1/gym/courses/' + userInfo.course_id + '/coaches',
    method: 'post',
    data
  })
}

// 修改私教课程中的私教教练
export function editPrivateCoach(id, userInfo) {
  const data = {
    'price': userInfo.price,
    'coach_id': userInfo.coachId
  }
  return request({
    url: '/v1/gym/courses/coaches/' + id,
    method: 'put',
    data: data
  })
}

// 删除私教课程中的私教教练
export function deletePrivateCoach(id) {
  return request({
    url: '/v1/gym/courses/coaches/' + id + '?by=id',
    method: 'delete'
  })
}

// 批量删除私教课程中的私教教练
export function deleteGroupPrivateCoach(userInfo) {
  const data = {
    'ids': userInfo.delete
    // 'method': 'delete'
  }
  return request({
    url: '/v1/gym/courses/coaches/batdes',
    method: 'post',
    data
  })
}

// 修改私教课程
export function editPrivateCourse(userInfo) {
  const id = userInfo.id
  const data = {
    'name': userInfo.name,
    'is_hot': userInfo.is_hot,
    'time': userInfo.time,
    'fit_type': userInfo.type,
    'image': userInfo.image,
    'app_status': userInfo.app_status,
    'introduce': userInfo.introduce
  }
  return request({
    url: '/v1/gym/courses/' + id + '?by=id',
    method: 'put',
    data
  })
}
// 添加私教课程
export function addPrivateCourse(userInfo) {
  const data = {
    'name': userInfo.name,
    'is_hot': userInfo.is_hot,
    'time': userInfo.time,
    'fit_type': userInfo.type,
    'image': userInfo.image,
    'introduce': userInfo.introduce
  }
  return request({
    url: '/v1/gym/courses',
    method: 'post',
    data
  })
}
// 删除私教课程
export function deletePrivateCourse(id) {
  return request({
    url: '/v1/gym/courses/' + id + '?by=id',
    method: 'delete',
  })
}
// 公开课or团课课程查询
export function groupCourseList(userInfo) {
  const data = {
    'type': userInfo.type,
    'gmt_booking_from': userInfo.gmt_booking_from,
    'gmt_booking_to': userInfo.gmt_booking_to
  }
  return request({
    url: '/v1/gym/group_courses',
    method: 'get',
    params: data
  })
}
// 新版--添加团课排期
export function newAddGroupCourseDate(userInfo) {
  return request({
    url: '/api/v2/gym/schedule/group',
    method: 'POST',
    data: userInfo
  })
}
// 新版--团课排期列表
export function newGroupCourseDateList(userInfo) {
  return request({
    url: '/api/v2/gym/schedule/group',
    method: 'get',
    params: userInfo
  })
}
// 新版--团课排期删除
export function deleteNewGroupCourseDate(id) {
  return request({
    url: '/api/v2/gym/schedule/group/' + id,
    method: 'DELETE'
  })
}
// 新版--团课排期修改
export function editNewGroupCourseDate(id, userInfo) {
  return request({
    url: '/api/v2/gym/schedule/group/' + id,
    method: 'put',
    data: userInfo
  })
}
// 新版--团课课程列表
export function newGroupCourseList(userInfo) {
  return request({
    url: '/api/v2/gym/courses/group',
    method: 'get',
    params: userInfo
  })
}
// 新版--新增团课
export function newAddGroupCourse(userInfo) {
  return request({
    url: '/api/v2/gym/courses/group',
    method: 'POST',
    data: userInfo
  })
}
// 新版--所有团课名字
export function groupCourseNameList() {
  return request({
    url: '/api/v2/gym/courses/group/all',
    method: 'get'
  })
}
// 新版--团课课程修改
export function editNewGroupCourse(id, userInfo) {
  return request({
    url: '/api/v2/gym/courses/group/' + id + '?by=id',
    method: 'PUT',
    data: userInfo
  })
}
// 新版-- 团课课程删除
export function deleteNewGroupCourse(id) {
  return request({
    url: '/api/v2/gym/courses/group/' + id + '?by=id',
    method: 'DELETE'
  })
}
// 新版--团课App销售
export function appSellNewGroupCourse(id, userInfo) {
  return request({
    url: '/api/v2/gym/courses/group/' + id + '?by=id',
    method: 'PATCH',
    params: userInfo
  })
}
// 新版--团课预约
export function newOrderGroupCourse(userInfo) {
  return request({
    url: '/api/v2/gym/reservations/group',
    method: 'POST',
    data: userInfo
  })
}
// 新版--根据id查询指定排期
export function groupCourseOrderList(userInfo) {
  return request({
    url: '/api/v2/gym/reservations/group',
    method: 'GET',
    params: userInfo
  })
}
// 新版--团课预约详情列表
export function newCourseScheduleById(id) {
  return request({
    url: '/api/v2/gym/schedule/group/' + id,
    method: 'GET'
  })
}
// 新版--团课预约统计
export function groupCourseStat() {
  return request({
    url: '/api/v2/gym/reservations/group/stat',
    method: 'GET'
  })
}
// 新版--编辑预约团课备注
export function newEditCourseOrder(id, userInfo) {
  return request({
    url: '/api/v2/gym/reservations/group/' + id,
    method: 'PUT',
    params: userInfo
  })
}
// 新版--取消团课预约
export function newCansleCourseOrder(id) {
  return request({
    url: '/api/v2/gym/reservations/group/' + id + '/cancel',
    method: 'PUT'
  })
}
// 新版--批量取消团课预约
export function newCansleGroupCourseOrder(userInfo) {
  return request({
    url: '/api/v2/gym/reservations/group/multi-cancel',
    method: 'PUT',
    data: userInfo
  })
}
// 添加公开课or团课
export function addPublicCourse(userInfo) {
  return request({
    url: '/v1/gym/group_courses',
    method: 'POST',
    data: userInfo
  })
}
// 删除公开课
export function deletePublicCourse(id) {
  return request({
    url: '/v1/gym/group_courses/' + id + '?by=id',
    method: 'DELETE'
  })
}
// 修改公开课
export function editPublicCourse(userInfo) {
  const data = {
    name: userInfo.name,
    max_person: userInfo.max_person,
    min_person: userInfo.min_person,
    address: userInfo.address,
    week: userInfo.week,
    time_start: userInfo.time_start,
    time_end: userInfo.time_end,
    coach_id: userInfo.coach_id,
    coach_name: userInfo.coach_name,
    price: userInfo.price,
    fit_type: userInfo.fit_type
  }
  return request({
    url: '/v1/gym/group_courses/' + userInfo.id + '?by=id',
    method: 'PUT',
    data
  })
}
// 团课预约
export function orderGroupCourse(userInfo) {
  return request({
    url: '/v1/gym/group_course_bookings',
    method: 'POST',
    data: userInfo
  })
}
// 团课预约详情
export function searchGroupCourseOrder(userInfo) {
  return request({
    url: '/v1/gym/group_course_bookings',
    method: 'GET',
    params: userInfo
  })
}
// 团课消课
export function canseleGroupOrder(id) {
  return request({
    url: '/v1/gym/group_course_bookings/' + id + '?by=id',
    method: 'delete'
  })
}
// 批量消课
export function orderGroupCourseGroup(userInfo) {
  return request({
    url: '/v1/gym/group_course_bookings/batch',
    method: 'post',
    data: userInfo
  })
}
// 获取当天的公开课
export function getTodayGroupCourses(userInfo) {
  return request({
    url: '/v1/gym/group_courses/today',
    method: 'get'
  })
}

// 排序
export function courseSortTab(userInfo) {
  const data = {
    type: userInfo.type
  }
  return request({
    url: '/v1/gym/courses/' + userInfo.id + '/sort',
    method: 'POST',
    data
  })
}
// 私教预约详情
export function privateCourseDetails(id) {
  return request({
    url: '/v1/gym/course_consumes/' + id,
    method: 'GET'
  })
}
// 席位管理-获取模板列表
export function gethallsList() {
  return request({
    url: '/api/v2/gym/halls',
    method: 'GET',
  })
}
// 席位管理-增加席位模板
export function addhallsTemplate(result) {
  return request({
    url: '/api/v2/gym/halls',
    method: 'POST',
    data: result
  })
}
// 席位管理-删除席位模板
export function deletehallsTemplate(id) {
  return request({
    url: '/api/v2/gym/halls/' + id,
    method: 'DELETE'
  })
}
// 席位管理-修改席位模板
export function edithallsTemplate(id, data) {
  return request({
    url: '/api/v2/gym/halls/' + id,
    method: 'PUT',
    data: data
  })
}
// 获取当前课程席位信息
export function getHallsDetail(id, data) {
  return request({
    url: 'api/v2/gym/halls/' + id + '/seats',
    method: 'GET',
    params: data
  })
}
