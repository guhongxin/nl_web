import request from '@/utils/request'

// 添加柜子区域
export function addCabinetArea(userInfo) {
  const data = {
    area: userInfo.name,
    num: userInfo.num
  }
  return request({
    url: '/v1/gym/cabinet_bracelets',
    method: 'POST',
    data
  })
}

// 查询柜子区域
export function getAllCabinet() {
  return request({
    url: '/v1/gym/lockers',
    method: 'get'
  })
}

// 柜子管理（新）
export function listCabinet(data) {
  return request({
    url: '/v1/gym/lockers',
    method: 'get',
    params: data
  })
}

// 柜子状态查询
export function cabinetStates(userInfo) {
  const data = {
    area: userInfo.area,
    number: userInfo.number
  }
  return request({
    url: '/v1/gym/member_cabinet_records',
    method: 'get',
    params: data
  })
}

// 启用柜子(新)
export function useCabinet(userInfo) {
  const data = {
    remark: userInfo.useMark,
  }
  return request({
    url: '/v1/gym/lockers/' + userInfo.id + '/grids/' + userInfo.grid + '/enable',
    method: 'POST',
    data
  })
}

// 禁用柜子(新)
export function noUseCabinet(userInfo) {
  const data = {
    remark: userInfo.forbitMark,
  }
  return request({
    url: '/v1/gym/lockers/' + userInfo.id + '/grids/' + userInfo.grid + '/disable',
    method: 'POST',
    data
  })
}

// 租还记录（新）
export function listRentRecord(query) {
  return request({
    url: '/v1/gym/lockers/rents',
    method: 'get',
    params: query
  })
}

// 续费记录（新）
export function renewListRecord(query) {
  return request({
    url: '/v1/gym/lockers/renews',
    method: 'get',
    params: query
  })
}

// 禁用记录（新）
export function listBanRecord(query) {
  return request({
    url: '/v1/gym/lockers/disables',
    method: 'get',
    params: query
  })
}

// 删除租柜(新)
export function deleteCabinet(area, id) {
  const data = {
    area: area
  }
  return request({
    url: '/v1/gym/lockers/' + id,
    method: 'delete',
    data
  })
}

// 续费柜子(新)
export function renewCabinet(userInfo) {
  const data = {
    remark: userInfo.memo,
    total_fee: userInfo.real_pay,
    renewed_at: userInfo.gmt_end,
    payment_method: userInfo.payment_method,
    sell_id: userInfo.sell_id,
    debit_card_id: userInfo.debit_card_id
  }
  return request({
    url: '/v1/gym/lockers/' + userInfo.lockerid + '/grids/' + userInfo.grid + '/renew',
    method: 'post',
    data
  })
}

// 归还柜子(新)
export function backCabinet(userInfo) {
  const data = {
    remark: userInfo.return_memo
  }
  return request({
    url: '/v1/gym/lockers/' + userInfo.id + '/grids/' + userInfo.grid + '/repay',
    method: 'post',
    data
  })
}

// 根据手机号码获取会员信息
export function getMessageByPhone(phone) {
  return request({
    url: '/v1/gym/customers/' + phone + '?by=phone',
    method: 'get',
  })
}

// 租还记录导出
export function daoChu() {
  return request({
    url: '/v1/gym/cabinet_record_return_excel_exports',
    method: 'get'
  })
}

// 禁用记录导出
export function daoChuBan() {
  return request({
    url: '/v1/gym/cabinet_ban_record_excel_exports',
    method: 'get'
  })
}

// 租柜信息确认（新）
export function rentCabinetMessage(userInfo) {
  const data = {
    customer_id: userInfo.menber_id,
    member_name: userInfo.text_name,
    member_phone: userInfo.text_phone,
    started_at: userInfo.start,
    expired_at: userInfo.end,
    remark: userInfo.memo,
    total_fee: parseFloat(userInfo.real_pay),
    cash_pledge: parseFloat(userInfo.charter_pay),
    payment_method: userInfo.payment_method,
    sell_id: userInfo.sell_id,
    debit_card_id: userInfo.debit_card_id
  }
  return request({
    url: '/v1/gym/lockers/' + userInfo.id + '/grids/' + userInfo.grid + '/rent',
    method: 'POST',
    data
  })
}

// 绑定柜子查询
export function bindCabinet(userInfo) {
  const data = {
    area: userInfo
  }
  return request({
    url: '/v1/gym/cabinet_bracelets/bind_cabinet_query',
    method: 'get',
    params: data
  })
}

// 绑定柜子（新）
export function bindCabinetSure(id, gid, data) {
  return request({
    url: '/v1/gym/lockers/' + id + '/grids/' + gid,
    method: 'put',
    data: data
  })
}

// 区域查询
export function areaQuery(query) {
  return request({
    url: '/v1/gym/member_cabinet_records/areaQuery',
    method: 'get',
    params: query
  })
}
// 根据客户id查询租柜信息
export function cabinetMsgById(id) {
  return request({
    url: '/v1/gym/customers/' + id + '/cabinet',
    method: 'get'
  })
}

// 添加储物柜（新）
export function addCabinetNew(query) {
  return request({
    url: '/v1/gym/lockers',
    method: 'post',
    data: query
  })
}

// 储物柜获取设备（新）
export function getCabinetDeviceNew() {
  return request({
    url: '/v1/gym/lockers/devices',
    method: 'get'
  })
}

// 查询储物柜详情（新）
export function cabinetDetailNew(id) {
  return request({
    url: '/v1/gym/lockers/' + id + '/show',
    method: 'get'
  })
}

// 修改储物柜（新）
export function editCabinetNew(id, query) {
  return request({
    url: '/v1/gym/lockers/' + id,
    method: 'put',
    data: query
  })
}
// 查询柜子状态数量（新）
export function cabinetStatusNum() {
  return request({
    url: '/v1/gym/lockers/tabs',
    method: 'get'
  })
}
// 查询格子信息（新）
export function getGridMessage(id, gid) {
  return request({
    url: '/v1/gym/lockers/' + id + '/grids/' + gid,
    method: 'get'
  })
}
// 添加格子（新）
export function addGridNum(id, userInfo) {
  const data = {
    no: String(userInfo.no),
    key: String(userInfo.key)
  }
  return request({
    url: '/v1/gym/lockers/' + id + '/grids',
    method: 'post',
    data
  })
}
